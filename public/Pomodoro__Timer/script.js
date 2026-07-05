// ===== Config =====
const MODES = {
  focus: { label: 'FOCUS', minutes: 25, colorVar: '--focus-color' },
  short: { label: 'SHORT BREAK', minutes: 5, colorVar: '--short-color' },
  long: { label: 'LONG BREAK', minutes: 15, colorVar: '--long-color' },
};

const TOTAL_SESSIONS = 4;
const CIRCUMFERENCE = 2 * Math.PI * 95; // r=95 → ~597

// ===== State =====
let currentMode = 'focus';
let totalSeconds = MODES.focus.minutes * 60;
let remainingSeconds = totalSeconds;
let isRunning = false;
let intervalId = null;
let sessionCount = 1;

// ===== DOM =====
const timeDisplay = document.getElementById('timeDisplay');
const modeLabel = document.getElementById('modeLabel');
const ringFill = document.getElementById('ringFill');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const skipBtn = document.getElementById('skipBtn');
const sessionCountEl = document.getElementById('sessionCount');
const timerWrapper = document.querySelector('.timer-wrapper');
const tabs = document.querySelectorAll('.tab');
const dots = [
  document.getElementById('dot1'),
  document.getElementById('dot2'),
  document.getElementById('dot3'),
  document.getElementById('dot4'),
];
const title = document.querySelector('.title');
const modeLabelTop = document.querySelector('.mode-label');

// ===== Ring =====
ringFill.style.strokeDasharray = CIRCUMFERENCE;

function updateRing() {
  const progress = remainingSeconds / totalSeconds;
  const offset = CIRCUMFERENCE * (1 - progress);
  ringFill.style.strokeDashoffset = offset;
}

// ===== Display =====
function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  timeDisplay.textContent = formatTime(remainingSeconds);
  updateRing();
}

// ===== Color Theme =====
function applyColor(mode) {
  const root = document.documentElement;
  const color = getComputedStyle(root)
    .getPropertyValue(MODES[mode].colorVar)
    .trim();
  root.style.setProperty('--active-color', `var(${MODES[mode].colorVar})`);
}

// ===== Switch Mode =====
function switchMode(mode) {
  stopTimer();
  currentMode = mode;
  totalSeconds = MODES[mode].minutes * 60;
  remainingSeconds = totalSeconds;

  modeLabel.textContent = MODES[mode].label;
  modeLabelTop.textContent = MODES[mode].label;
  startBtn.textContent = 'START';
  timerWrapper.classList.remove('running');

  applyColor(mode);
  updateDisplay();

  // Update active tab
  tabs.forEach((t) => {
    t.classList.toggle('active', t.dataset.mode === mode);
  });
}

// ===== Session Dots =====
function updateDots() {
  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 < sessionCount) dot.classList.add('done');
    if (i + 1 === sessionCount) dot.classList.add('active');
  });
  sessionCountEl.textContent = sessionCount;
}

// ===== Sound Alert =====
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    // Audio not supported
  }
}

// ===== Timer Logic =====
function startTimer() {
  isRunning = true;
  startBtn.textContent = 'PAUSE';
  timerWrapper.classList.add('running');

  intervalId = setInterval(() => {
    remainingSeconds--;
    updateDisplay();

    if (remainingSeconds <= 0) {
      clearInterval(intervalId);
      isRunning = false;
      playBeep();
      handleSessionEnd();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalId);
  isRunning = false;
  startBtn.textContent = 'START';
  timerWrapper.classList.remove('running');
}

function handleSessionEnd() {
  timerWrapper.classList.remove('running');
  startBtn.textContent = 'START';

  if (currentMode === 'focus') {
    // Focus completed naturally
    if (sessionCount >= TOTAL_SESSIONS) {
      sessionCount = TOTAL_SESSIONS;
      updateDots();

      setTimeout(() => switchMode('long'), 500);

      setTimeout(() => {
        sessionCount = 1;
        updateDots();
      }, 500);
    } else {
      // Completed focus -> count session
      sessionCount++;
      updateDots();

      setTimeout(() => switchMode('short'), 500);
    }
  } else {
    // Completed break -> back to focus
    setTimeout(() => switchMode('focus'), 500);
  }
}

function handleSkip() {
  timerWrapper.classList.remove('running');
  startBtn.textContent = 'START';

  if (currentMode === 'focus') {
    // Skip current focus only.
    // Do NOT increment completed sessions.
    switchMode('short');
  } else {
    // Skip current break only.
    // Return to focus without changing session count.
    switchMode('focus');
  }
}

// ===== Button Events =====
startBtn.addEventListener('click', () => {
  if (isRunning) {
    stopTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener('click', () => {
  stopTimer();
  remainingSeconds = totalSeconds;
  updateDisplay();
});

skipBtn.addEventListener('click', () => {
  stopTimer();
  handleSkip();
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    switchMode(tab.dataset.mode);
  });
});

// ===== Init =====
updateDots();
updateDisplay();
applyColor('focus');
