import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';

// Elements
const tableBody = document.getElementById('table-body');
const totalCount = document.getElementById('total-count');
const startRaffleBtn = document.getElementById('start-raffle-btn');
const raffleDisplay = document.getElementById('raffle-display');
const exportBtn = document.getElementById('export-btn');

let participants = [];
let isRolling = false;

// Firebase Imports
import { db } from './firebase.js';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

// --- Init ---
async function loadData() {
    // Listen for real-time updates
    const q = query(collection(db, "participants"), orderBy("registeredAt", "desc"));

    onSnapshot(q, (snapshot) => {
        participants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTable();
    }, (error) => {
        console.error("Error reading data:", error);
        raffleDisplay.textContent = 'ERROR DE CONEXIÓN';
    });
}

function renderTable() {
    totalCount.textContent = participants.length;
    tableBody.innerHTML = '';

    // Sort by Score (Desc) and then Duration (Asc)
    const sorted = [...participants].sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score; // Higher score first
        }
        return a.duration - b.duration; // If same score, faster duration first
    });

    // Update Podium
    updatePodium(sorted);

    sorted.forEach((p, index) => {
        const tr = document.createElement('tr');
        const date = new Date(p.registeredAt).toLocaleTimeString();
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${p.name}</strong></td>
            <td style="color: var(--secondary); font-weight: 800;">${p.score} / 5</td>
            <td>${p.duration ? p.duration.toFixed(2) : '-'} s</td>
            <td style="color: var(--text-muted); font-size: 0.9em;">${date}</td>
        `;
        tableBody.appendChild(tr);
    });
}

function updatePodium(sorted) {
    const winners = [
        { id: 'winner-1', data: sorted[0] },
        { id: 'winner-2', data: sorted[1] },
        { id: 'winner-3', data: sorted[2] }
    ];

    winners.forEach(w => {
        const card = document.getElementById(w.id);
        if (w.data) {
            card.querySelector('.podium-name').textContent = w.data.name;
            card.querySelector('.podium-stats').textContent = `${w.data.duration.toFixed(2)}s | ${w.data.score}/5`;
            card.style.opacity = '1';
        } else {
            card.querySelector('.podium-name').textContent = '---';
            card.querySelector('.podium-stats').textContent = '-- s | --/5';
            card.style.opacity = '0.5';
        }
    });
}

// Old raffle timer logic removed


function fireConfetti() {
    const end = Date.now() + 3000;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

// --- Export Logic ---
exportBtn.addEventListener('click', () => {
    if (participants.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const ws = XLSX.utils.json_to_sheet(participants);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participantes");
    XLSX.writeFile(wb, "Sorteo_Participantes.xlsx");
});

// Start
loadData();
// Poll for updates (Removed: Firestore is Real-Time)
// setInterval(loadData, 5000);
