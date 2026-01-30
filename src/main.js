import { parseFile } from './fileParser.js';
import confetti from 'canvas-confetti';

// State
let participants = [];
let isRolling = false;

// DOM Elements
const views = {
  upload: document.getElementById('view-upload'),
  ready: document.getElementById('view-ready'),
  rolling: document.getElementById('view-rolling'),
  winner: document.getElementById('view-winner')
};

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const countDisplay = document.getElementById('count-display');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const restartBtn = document.getElementById('restart-btn');
const rollingText = document.getElementById('rolling-text');
const winnerName = document.getElementById('winner-name');
const toast = document.getElementById('toast');

// Navigation Helper
function showView(viewName) {
  Object.values(views).forEach(el => el.classList.add('hidden'));
  views[viewName].classList.remove('hidden');
}

// Toast Helper
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// --- Event Listeners ---

// File Upload
browseBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent bubbling to drop-zone click if needed
  fileInput.click();
});

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length > 0) handleFile(files[0]);
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) handleFile(e.target.files[0]);
});

// Actions
resetBtn.addEventListener('click', () => {
  participants = [];
  fileInput.value = '';
  showView('upload');
});

restartBtn.addEventListener('click', () => {
  // Keep participants, just go back to ready
  showView('ready');
});

startBtn.addEventListener('click', startRaffle);

// --- Logic ---

async function handleFile(file) {
  try {
    participants = await parseFile(file);
    if (participants.length === 0) {
      showToast('⚠️ No se encontraron nombres válidos.');
      return;
    }

    // Success
    countDisplay.textContent = participants.length;
    showView('ready');
  } catch (err) {
    console.error(err);
    showToast('❌ Error: ' + err.message);
  }
}

function startRaffle() {
  if (participants.length < 2) {
    showToast('⚠️ Mínimo 2 participantes.');
    return;
  }

  showView('rolling');

  let duration = 3500;
  let intervalTime = 50;

  // Fast cycle
  const interval = setInterval(() => {
    const randomName = participants[Math.floor(Math.random() * participants.length)];
    rollingText.textContent = randomName;
  }, intervalTime);

  // End
  setTimeout(() => {
    clearInterval(interval);
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];

    winnerName.textContent = winner;
    showView('winner');
    fireConfetti();
  }, duration);
}

function fireConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}
