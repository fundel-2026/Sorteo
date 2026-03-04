// DOM Elements
const form = document.getElementById('register-form');
const viewForm = document.getElementById('view-form');
const viewSuccess = document.getElementById('view-success');
const backBtn = document.getElementById('back-btn');
const toast = document.getElementById('toast');
const submitBtn = document.getElementById('submit-btn');

let startTime = null;

// Start timer on first interaction
form.addEventListener('focusin', () => {
    if (!startTime) {
        startTime = Date.now();
        console.log('Timer started!');
    }
}, { once: true });

function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.style.backgroundColor = isError ? 'rgba(255, 68, 68, 0.9)' : 'rgba(74, 222, 128, 0.9)';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// Firebase Imports
import { db } from './firebase.js';
import { collection, addDoc } from "firebase/firestore";

// Correct Answers
const CORRECT_ANSWERS = {
    q1: '22 años',
    q2: 'Ing. Bárbara Tenorio',
    q3: 'Ambato, Latacunga, Riobamba y Puyo',
    q4: 'Tu primer paso a la superación',
    q5: 'Fundación de Desarrollo Humano y Social Latacunga'
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const q1 = document.querySelector('input[name="q1"]:checked')?.value;
    const q2 = document.querySelector('input[name="q2"]:checked')?.value;
    const q3 = document.querySelector('input[name="q3"]:checked')?.value;
    const q4 = document.querySelector('input[name="q4"]:checked')?.value;
    const q5 = document.querySelector('input[name="q5"]:checked')?.value;

    if (!fullName || !q1 || !q2 || !q3 || !q4 || !q5) {
        showToast('Por favor responde todas las preguntas', true);
        return;
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // in seconds

    // Calculate Score
    let score = 0;
    if (q1 === CORRECT_ANSWERS.q1) score++;
    if (q2 === CORRECT_ANSWERS.q2) score++;
    if (q3 === CORRECT_ANSWERS.q3) score++;
    if (q4.includes(CORRECT_ANSWERS.q4)) score++; // Partial match for color
    if (q5 === CORRECT_ANSWERS.q5) score++;

    // Loading state
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    try {
        // Save to Firestore
        await addDoc(collection(db, "participants"), {
            name: fullName.trim(),
            answers: { q1, q2, q3, q4, q5 },
            score: score,
            duration: duration,
            registeredAt: new Date().toISOString()
        });

        // Show success view
        viewForm.classList.add('hidden');
        viewSuccess.classList.remove('hidden');
        form.reset();
        startTime = null; // Reset for next person

    } catch (err) {
        showToast('Error: ' + err.message, true);
        console.error(err);
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

backBtn.addEventListener('click', () => {
    viewSuccess.classList.add('hidden');
    viewForm.classList.remove('hidden');
});
