// Timer & Focus Mode Component Handler (with Box Breathing)
import { state, toggleTimer, resetTimer, changeTimerMode, addXP, unlockBadge } from '../state.js';

let localTimerInterval = null;
let breathingInterval = null;
let breathingCycleSeconds = 0;

export function initTimerComponent() {
  const btnToggle = document.getElementById('btn-timer-toggle');
  const btnReset = document.getElementById('btn-timer-reset');
  const modeButtons = document.querySelectorAll('.timer-mode-btn');
  const btnSkipBreathing = document.getElementById('btn-skip-breathing');

  // Toggle play/pause
  btnToggle.addEventListener('click', () => {
    toggleTimer();
  });

  // Reset timer
  btnReset.addEventListener('click', () => {
    resetTimer();
  });

  // Switch modes
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      changeTimerMode(mode);
    });
  });

  // Skip breathing break
  btnSkipBreathing.addEventListener('click', () => {
    stopBreathingExercise();
    changeTimerMode('focus');
  });

  // Start internal second tick loop
  startSecondTickLoop();
}

function startSecondTickLoop() {
  if (localTimerInterval) clearInterval(localTimerInterval);

  localTimerInterval = setInterval(() => {
    if (!state.activeRoom || !state.timer.isRunning) {
      return;
    }

    if (state.timer.mode === 'stopwatch') {
      // Stopwatch counts UP
      state.timer.timeRemaining += 1;
      // Grant passive XP (e.g. 1 XP per minute studied on stopwatch)
      if (state.timer.timeRemaining % 60 === 0) {
        addXP(1);
      }
    } else {
      // Pomodoro counts DOWN
      if (state.timer.timeRemaining > 0) {
        state.timer.timeRemaining -= 1;
      } else {
        // Timer reached 0!
        handleTimerCompletion();
      }
    }

    // Direct UI updates to avoid full page re-render lag
    updateTimerUI();
  }, 1000);
}

function handleTimerCompletion() {
  state.timer.isRunning = false;
  
  // Play programmatic audio chime alerts
  playChimeAlarm();

  if (state.timer.mode === 'focus') {
    // Reward XP & Achievements
    addXP(25); // 25 XP for a full focus block
    unlockBadge('pomodoro_complete');
    
    // Automatically transition to Break Mode
    state.timer.mode = 'break';
    changeTimerMode('break');
    
    // Trigger breathing
    startBreathingExercise();
  } else if (state.timer.mode === 'break') {
    unlockBadge('zen_practitioner');
    stopBreathingExercise();
    changeTimerMode('focus');
  }
}

// Programmatic Web Audio Synthesizer Alarm chime (doesn't need files)
function playChimeAlarm() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    
    // Play dual sine tone chords
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.5);
    osc2.stop(ctx.currentTime + 1.5);
  } catch(e) {
    console.warn("Could not play programmatic audio chime: ", e);
  }
}

// -------------------------------------------------------------
// BOX BREATHING ENGINE (16s cycle)
// -------------------------------------------------------------
function startBreathingExercise() {
  const breathingCard = document.getElementById('breathing-card');
  const timerCard = document.getElementById('timer-card');
  const bubble = document.getElementById('breathing-bubble');
  const text = document.getElementById('breathing-text');

  if (!breathingCard || !timerCard) return;

  breathingCard.classList.remove('hidden');
  timerCard.classList.add('hidden');

  breathingCycleSeconds = 0;
  runBreathingTick();

  if (breathingInterval) clearInterval(breathingInterval);
  breathingInterval = setInterval(() => {
    breathingCycleSeconds = (breathingCycleSeconds + 1) % 16;
    runBreathingTick();
  }, 1000);
}

function runBreathingTick() {
  const bubble = document.getElementById('breathing-bubble');
  const text = document.getElementById('breathing-text');
  if (!bubble || !text) return;

  const phase = Math.floor(breathingCycleSeconds / 4); // 4 phases: 0, 1, 2, 3

  if (phase === 0) {
    // 0-4s: Inhale
    text.textContent = `Inhale... (${4 - (breathingCycleSeconds % 4)}s)`;
    const progress = (breathingCycleSeconds % 4 + 1) / 4;
    bubble.style.transform = `scale(${1 + (progress * 1.5)})`;
    bubble.style.backgroundColor = 'var(--cyan)';
    bubble.style.boxShadow = '0 0 25px var(--cyan-glow)';
  } 
  else if (phase === 1) {
    // 4-8s: Hold
    text.textContent = `Hold... (${4 - (breathingCycleSeconds % 4)}s)`;
    bubble.style.transform = 'scale(2.5)';
    bubble.style.backgroundColor = 'var(--accent)';
    bubble.style.boxShadow = '0 0 25px var(--accent-glow)';
  } 
  else if (phase === 2) {
    // 8-12s: Exhale
    text.textContent = `Exhale... (${4 - (breathingCycleSeconds % 4)}s)`;
    const progress = (breathingCycleSeconds % 4 + 1) / 4;
    bubble.style.transform = `scale(${2.5 - (progress * 1.5)})`;
    bubble.style.backgroundColor = 'var(--purple)';
    bubble.style.boxShadow = '0 0 25px var(--purple-glow)';
  } 
  else if (phase === 3) {
    // 12-16s: Hold
    text.textContent = `Hold... (${4 - (breathingCycleSeconds % 4)}s)`;
    bubble.style.transform = 'scale(1.0)';
    bubble.style.backgroundColor = 'rgba(255,255,255,0.2)';
    bubble.style.boxShadow = 'none';
  }
}

function stopBreathingExercise() {
  if (breathingInterval) {
    clearInterval(breathingInterval);
    breathingInterval = null;
  }

  const breathingCard = document.getElementById('breathing-card');
  const timerCard = document.getElementById('timer-card');
  
  if (breathingCard && timerCard) {
    breathingCard.classList.add('hidden');
    timerCard.classList.remove('hidden');
  }
}

// -------------------------------------------------------------
// TIMER VIEW RENDER
// -------------------------------------------------------------
export function renderTimerView() {
  if (!state.activeRoom) return;

  // Sync mode buttons classes
  const modeButtons = document.querySelectorAll('.timer-mode-btn');
  modeButtons.forEach(btn => {
    if (btn.getAttribute('data-mode') === state.timer.mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Handle Box Breathing overlay trigger based on current mode
  if (state.timer.mode === 'break') {
    startBreathingExercise();
  } else {
    stopBreathingExercise();
  }

  updateTimerUI();
}

export function updateTimerUI() {
  const timeDisplay = document.getElementById('timer-time-display');
  const labelDisplay = document.getElementById('timer-label');
  const btnToggle = document.getElementById('btn-timer-toggle');
  const progressCircle = document.getElementById('timer-circle-progress');

  if (!timeDisplay) return;

  // Format Time text
  const mins = Math.floor(state.timer.timeRemaining / 60);
  const secs = state.timer.timeRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  timeDisplay.textContent = timeStr;
  
  // Set tab document title for background tracking
  document.title = state.timer.isRunning ? `(${timeStr}) Nexus Focus` : `Nexus Study`;

  // Play button label
  btnToggle.textContent = state.timer.isRunning ? "Pause Session" : "Start Session";

  // Mode descriptors
  if (state.timer.mode === 'focus') {
    labelDisplay.textContent = state.timer.isRunning ? "Deep Focus Period" : "Ready to Focus";
    labelDisplay.style.color = 'var(--cyan)';
  } else if (state.timer.mode === 'break') {
    labelDisplay.textContent = "Guided Rest Break";
    labelDisplay.style.color = 'var(--accent)';
  } else if (state.timer.mode === 'stopwatch') {
    labelDisplay.textContent = state.timer.isRunning ? "Tracking Focus..." : "Stopwatch Paused";
    labelDisplay.style.color = 'var(--purple)';
  }

  // Update circular progress SVG ring
  if (progressCircle) {
    const r = parseFloat(progressCircle.getAttribute('r')) || 95;
    const circumference = 2 * Math.PI * r;
    
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;

    if (state.timer.mode === 'stopwatch') {
      // Stopwatch: progress circle fully glowing
      progressCircle.style.strokeDashoffset = 0;
      progressCircle.style.stroke = 'var(--purple)';
    } else {
      // Countdown progress
      const percent = state.timer.timeRemaining / state.timer.duration;
      const offset = circumference * (1 - percent);
      progressCircle.style.strokeDashoffset = offset;
      
      // Purple colors for breaks, Cyan colors for focus
      progressCircle.style.stroke = state.timer.mode === 'break' ? 'var(--accent)' : 'var(--cyan)';
    }
  }
}
