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

    // Sort by newest first
    const sorted = [...participants].reverse();

    sorted.forEach((p, index) => {
        const tr = document.createElement('tr');
        const date = new Date(p.registeredAt).toLocaleTimeString();
        tr.innerHTML = `
            <td>${sorted.length - index}</td>
            <td><strong>${p.name}</strong></td>
            <td>${p.whatsapp}</td>
            <td>${p.city}</td>
            <td>${p.course}</td>
            <td style="color: var(--text-muted); font-size: 0.9em;">${date}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// --- Raffle Logic ---
startRaffleBtn.addEventListener('click', () => {
    if (participants.length < 2) {
        alert('Se necesitan al menos 2 participantes.');
        return;
    }
    if (isRolling) return;

    isRolling = true;
    startRaffleBtn.disabled = true;

    let duration = 3000;
    let intervalTime = 50;

    const interval = setInterval(() => {
        const randomName = participants[Math.floor(Math.random() * participants.length)].name;
        raffleDisplay.textContent = randomName;
        raffleDisplay.classList.remove('winner-highlight');
    }, intervalTime);

    setTimeout(() => {
        clearInterval(interval);

        // Pick Winner
        const winner = participants[Math.floor(Math.random() * participants.length)];
        raffleDisplay.textContent = winner.name;
        raffleDisplay.classList.add('winner-highlight');

        fireConfetti();
        isRolling = false;
        startRaffleBtn.disabled = false;
    }, duration);
});

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
