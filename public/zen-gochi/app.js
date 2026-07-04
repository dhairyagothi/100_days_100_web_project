// State variables
let stability = 100;
let zenScore = 0;
let level = 1;
let currentStage = 'The Seed';

// Configuration thresholds
const DAMAGE_MOUSE_SPEED = 40; // Trigger penalty if mouse moves too fast
const STABILITY_DECREASE_STEP = 15;
const STABILITY_RECOVERY_STEP = 2;

// DOM Elements
const stabilityBar = document.getElementById('stabilityBar');
const levelDisplay = document.getElementById('levelDisplay');
const stageDisplay = document.getElementById('stageDisplay');
const statusMessage = document.getElementById('statusMessage');
const bodyCore = document.getElementById('bodyCore');
const bodyGlow = document.getElementById('bodyGlow');
const pupil = document.getElementById('pupil');

// Tracking variables for physics calculation
let lastMouseX = 0;
let lastMouseY = 0;
let lastMouseTime = Date.now();

let lastMouseX = 0;
let lastMouseY = 0;
let lastMouseTime = 0;
let mouseInitialized = false;

// Prevent multiple penalties from stacking
const PENALTY_COOLDOWN = 300;
let lastPenaltyTime = 0;

// Ignore unrealistic mouse speed calculations
const MIN_MOUSE_DT = 16;

// Evolution mappings
const stages = {
  1: 'The Seed',
  5: 'The Sprout',
  15: 'The Core Orb',
  30: 'The Awakened Entity',
  50: 'Absolute Nothingness',
};

// Main game clock loop runs every 1 second
setInterval(() => {
  if (stability > 0) {
    // If user was stable, gain zen points
    zenScore++;

    // Handle level ups based on zen score points
    if (stages[zenScore]) {
      level++;
      currentStage = stages[zenScore];
      levelDisplay.textContent = level;
      stageDisplay.textContent = currentStage;
      triggerEvolutionVisuals();
    }

    // Slowly heal stability if it was damaged
    if (stability < 100) {
      stability = Math.min(100, stability + STABILITY_RECOVERY_STEP);
    }

    updateUI('System stable. Energy accumulating...', '#64748b');
  } else {
    updateUI('CRITICAL BRAINWAVES DETECTED! Zen broken.', '#ff0055');
    resetZen();
  }

  animateCreaturePulse();
}, 1000);

// Core function to penalize interaction
function breakZen(penaltyAmount, message) {
  const now = Date.now();

  // Cooldown to prevent stacked penalties
  if (now - lastPenaltyTime < PENALTY_COOLDOWN) {
    return;
  }

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
  currentStage = stages[1];
  levelDisplay.textContent = level;
  stageDisplay.textContent = currentStage;
  stability = 100;
  stabilityBar.style.width = '100%';
  bodyCore.setAttribute('r', '40');
}

// 1. Monitor Mouse Speed
document.addEventListener('mousemove', (e) => {
  const now = Date.now();

  // Initialize on first real mouse movement
  if (!mouseInitialized) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    lastMouseTime = now;
    mouseInitialized = true;
    return;
  }

  const dt = now - lastMouseTime;

  // Ignore unrealistic frame timings
  if (dt < MIN_MOUSE_DT) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    lastMouseTime = now;
    return;
  }

  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;

  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = (distance / dt) * 100;

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

// 2. Monitor Keypresses
document.addEventListener('keydown', () => {
  breakZen(
    Math.round(STABILITY_DECREASE_STEP * 1.2),
    'Input interference! Stop typing.'
  );
});

// 3. Monitor Clicks
document.addEventListener('mousedown', () => {
  breakZen(STABILITY_DECREASE_STEP, 'Physical contact alert! Hands off.');
});

// 4. Monitor Tab Switching (Cheating protection)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    breakZen(15, 'Focus lost. Stay present.');
  }
});

// Visual rendering logic
function updateUI(msg, color) {
  stabilityBar.style.width = `${stability}%`;
  statusMessage.textContent = msg;
  statusMessage.style.color = color;
}

function animateCreaturePulse() {
  // Basic parametric scaling to create a heart-beat look
  let baseRadius = 40 + level * 2;
  let pulseFactor = stability < 50 ? 6 : 2; // Shakes faster if dying
  let scale = baseRadius + Math.sin(Date.now() / 200) * pulseFactor;

  bodyCore.setAttribute('r', scale);
  bodyGlow.setAttribute('r', scale + 8);
}

function triggerEvolutionVisuals() {
  // Add visual fireworks or flash on transition threshold milestones
  bodyCore.style.transform = 'scale(1.3)';
  setTimeout(() => {
    bodyCore.style.transform = 'scale(1)';
  }, 300);
}
