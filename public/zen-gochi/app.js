// Game State variables
let stability = 100;
let zenScore = 0;
let level = 1;
let currentStage = 'The Seed';

// Rules Configuration
const DAMAGE_MOUSE_SPEED = 40; 
const STABILITY_DECREASE_STEP = 15;
const STABILITY_RECOVERY_STEP = 2;

// DOM Hooking Elements
const stabilityBar = document.getElementById('stabilityBar');
const levelDisplay = document.getElementById('levelDisplay');
const stageDisplay = document.getElementById('stageDisplay');
const statusMessage = document.getElementById('statusMessage');
const bodyCore = document.getElementById('bodyCore');
const bodyGlow = document.getElementById('bodyGlow');
const pupil = document.getElementById('pupil');
const themeToggle = document.getElementById('themeToggle');

// Theme toggle configuration (isolated from penalties)
themeToggle.addEventListener('mousedown', (e) => e.stopPropagation());
themeToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  document.body.classList.toggle('light-theme');
});

// Tracking variables for physics logic
let lastMouseX = 0;
let lastMouseY = 0;
let lastMouseTime = Date.now();
let mouseInitialized = false;

const PENALTY_COOLDOWN = 300;
let lastPenaltyTime = 0;
const MIN_MOUSE_DT = 16;

const stages = [
  { score: 1, stage: 'The Seed' },
  { score: 5, stage: 'The Sprout' },
  { score: 15, stage: 'The Core Orb' },
  { score: 30, stage: 'The Awakened Entity' },
  { score: 50, stage: 'Absolute Nothingness' },
];

function updateEvolutionStage() {
  let unlockedStage = stages[0];
  let unlockedLevel = 1;

  stages.forEach((milestone, index) => {
    if (zenScore >= milestone.score) {
      unlockedStage = milestone;
      unlockedLevel = index + 1;
    }
  });

  if (currentStage !== unlockedStage.stage) {
    currentStage = unlockedStage.stage;
    level = unlockedLevel;

    levelDisplay.textContent = level;
    stageDisplay.textContent = currentStage;
    triggerEvolutionVisuals();
  }
}

// Main Loop
setInterval(() => {
  if (stability > 0) {
    zenScore++;
    updateEvolutionStage();

    if (stability < 100) {
      stability = Math.min(100, stability + STABILITY_RECOVERY_STEP);
    }

    const standardText = document.body.classList.contains('light-theme') ? '#708090' : '#64748b';
    updateUI('System stable. Energy accumulating...', standardText);
  } else {
    updateUI('CRITICAL BRAINWAVES DETECTED! Zen broken.', 'var(--neon-magenta)');
    resetZen();
  }
  animateCreaturePulse();
}, 1000);

function breakZen(penaltyAmount, message) {
  const now = Date.now();
  if (now - lastPenaltyTime < PENALTY_COOLDOWN) return;

  lastPenaltyTime = now;
  stability = Math.max(0, stability - penaltyAmount);
  stabilityBar.style.width = `${stability}%`;

  bodyCore.style.stroke = 'var(--neon-magenta)';
  bodyGlow.style.fill = 'var(--neon-magenta)';
  statusMessage.textContent = message;
  statusMessage.style.color = 'var(--neon-magenta)';

  setTimeout(() => {
    if (stability > 0) {
      bodyCore.style.stroke = 'var(--neon-cyan)';
      bodyGlow.style.fill = 'var(--neon-cyan)';
    }
  }, 400);
}

function resetZen() {
  zenScore = 0;
  level = 1;
  currentStage = stages[0].stage;

  levelDisplay.textContent = level;
  stageDisplay.textContent = currentStage;
  stability = 100;
  stabilityBar.style.width = '100%';
  bodyCore.setAttribute('r', '40');
}

// Interaction listeners
document.addEventListener('mousemove', (e) => {
  if (e.target.closest('#themeToggle')) return; // Ignore theme clicks

  const now = Date.now();
  if (!mouseInitialized) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    lastMouseTime = now;
    mouseInitialized = true;
    return;
  }

  const dt = now - lastMouseTime;
  if (dt < MIN_MOUSE_DT) return;

  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = (distance / dt) * 100;

  // Eye looking physics tracking
  const pupilX = 100 + dx * 0.05;
  const pupilY = 100 + dy * 0.05;
  pupil.setAttribute('cx', Math.max(95, Math.min(105, pupilX)));
  pupil.setAttribute('cy', Math.max(95, Math.min(105, pupilY)));

  if (speed > DAMAGE_MOUSE_SPEED) {
    breakZen(STABILITY_DECREASE_STEP, 'Motion detected! Hold still.');
  }

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  lastMouseTime = now;
});

document.addEventListener('keydown', () => {
  breakZen(Math.round(STABILITY_DECREASE_STEP * 1.2), 'Input interference! Stop typing.');
});

document.addEventListener('mousedown', (e) => {
  if (e.target.closest('#themeToggle')) return; 
  breakZen(STABILITY_DECREASE_STEP, 'Physical contact alert! Hands off.');
});

document.addEventListener('visibilitychange', () => {
  if (typeof document.hidden !== 'undefined' && document.hidden) {
    breakZen(15, 'Focus lost. Stay present.');
  }
});

function updateUI(msg, color) {
  stabilityBar.style.width = `${stability}%`;
  statusMessage.textContent = msg;
  statusMessage.style.color = color;
}

function animateCreaturePulse() {
  let baseRadius = 40 + level * 2;
  let pulseFactor = stability < 50 ? 6 : 2; 
  let scale = baseRadius + Math.sin(Date.now() / 200) * pulseFactor;

  bodyCore.setAttribute('r', scale);
  bodyGlow.setAttribute('r', scale + 8);
}

function triggerEvolutionVisuals() {
  bodyCore.style.transform = 'scale(1.3)';
  setTimeout(() => { bodyCore.style.transform = 'scale(1)'; }, 300);
}