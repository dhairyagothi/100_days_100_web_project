// State Config Management
const patterns = {
  box: [
    {
      action: "Inhale",
      duration: 4,
      scale: 1.5,
      color: "radial-gradient(circle at 30% 30%, #38bdf8 0%, #0369a1 100%)",
    },
    {
      action: "Hold",
      duration: 4,
      scale: 1.5,
      color: "radial-gradient(circle at 30% 30%, #a855f7 0%, #6b21a8 100%)",
    },
    {
      action: "Exhale",
      duration: 4,
      scale: 1.0,
      color: "radial-gradient(circle at 30% 30%, #10b981 0%, #065f46 100%)",
    },
    {
      action: "Hold",
      duration: 4,
      scale: 1.0,
      color: "radial-gradient(circle at 30% 30%, #64748b 0%, #334155 100%)",
    },
  ],
  relax: [
    {
      action: "Inhale",
      duration: 4,
      scale: 1.6,
      color: "radial-gradient(circle at 30% 30%, #38bdf8 0%, #0369a1 100%)",
    },
    {
      action: "Hold",
      duration: 7,
      scale: 1.6,
      color: "radial-gradient(circle at 30% 30%, #a855f7 0%, #6b21a8 100%)",
    },
    {
      action: "Exhale",
      duration: 8,
      scale: 1.0,
      color: "radial-gradient(circle at 30% 30%, #10b981 0%, #065f46 100%)",
    },
  ],
  equal: [
    {
      action: "Inhale",
      duration: 4,
      scale: 1.5,
      color: "radial-gradient(circle at 30% 30%, #38bdf8 0%, #0369a1 100%)",
    },
    {
      action: "Exhale",
      duration: 4,
      scale: 1.0,
      color: "radial-gradient(circle at 30% 30%, #10b981 0%, #065f46 100%)",
    },
  ],
};

let activePattern = "box";
let isRunning = false;
let isAudioMuted = false;
let currentStepIndex = 0;
let stepTimeRemaining = 0;
let cycleTimer = null;
let tickTimer = null;

// DOM Layout References
const breathSphere = document.getElementById("breathSphere");
const breathText = document.getElementById("breathText");
const timerTicker = document.getElementById("timerTicker");
const btnToggleAction = document.getElementById("btnToggleAction");
const btnAudioToggle = document.getElementById("btnAudioToggle");
const presetButtons = document.querySelectorAll(".btn-preset");

// Native Audio Synth Core to play chimes without external dependencies
function playTone(frequency, duration) {
  if (isAudioMuted) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + duration,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.warn("Audio Context interaction deferred until user action:", err);
  }
}

// Rhythmic Flow Execution Loop Engine
function executeBreathingStep() {
  const stepList = patterns[activePattern];
  const currentStep = stepList[currentStepIndex];

  // Apply visual vector transitions
  breathText.innerText = currentStep.action;
  breathSphere.style.transform = `scale(${currentStep.scale})`;
  breathSphere.style.background = currentStep.color;

  // Audio guidance chime alerts
  if (currentStep.action === "Inhale") playTone(523.25, 0.4); // C5 Chime
  if (currentStep.action === "Exhale") playTone(392.0, 0.4); // G4 Chime
  if (currentStep.action === "Hold") playTone(440.0, 0.15); // A4 Subtle Tick

  stepTimeRemaining = currentStep.duration;
  timerTicker.innerText = `${stepTimeRemaining}s`;

  // Establish sub-second countdown intervals
  clearInterval(tickTimer);
  tickTimer = setInterval(() => {
    stepTimeRemaining--;
    if (stepTimeRemaining > 0) {
      timerTicker.innerText = `${stepTimeRemaining}s`;
    } else {
      clearInterval(tickTimer);
    }
  }, 1000);

  // Queue up subsequent sequence block
  clearTimeout(cycleTimer);
  cycleTimer = setTimeout(() => {
    currentStepIndex = (currentStepIndex + 1) % stepList.length;
    executeBreathingStep();
  }, currentStep.duration * 1000);
}

// System State Controllable Interventions
function startSession() {
  isRunning = true;
  currentStepIndex = 0;
  btnToggleAction.innerHTML = '<i class="fas fa-pause"></i> Pause Session';
  btnToggleAction.style.background = "#ef4444";
  executeBreathingStep();
}

function stopSession() {
  isRunning = false;
  clearTimeout(cycleTimer);
  clearInterval(tickTimer);

  // Return sphere state to neutral baseline positions
  breathText.innerText = "Ready";
  breathSphere.style.transform = "scale(1)";
  breathSphere.style.background =
    "radial-gradient(circle at 30% 30%, #38bdf8 0%, #0369a1 100%)";
  timerTicker.innerText = "0s";

  btnToggleAction.innerHTML =
    '<i class="fas fa-play"></i> Start Guided Session';
  btnToggleAction.style.background = "#38bdf8";
}

// Interface Button Event Triggers
btnToggleAction.addEventListener("click", () => {
  if (isRunning) {
    stopSession();
  } else {
    startSession();
  }
});

btnAudioToggle.addEventListener("click", () => {
  isAudioMuted = !isAudioMuted;
  if (isAudioMuted) {
    btnAudioToggle.innerHTML = '<i class="fas fa-volume-mute"></i> Chime Off';
    btnAudioToggle.style.color = "#64748b";
  } else {
    btnAudioToggle.innerHTML = '<i class="fas fa-volume-up"></i> Chime On';
    btnAudioToggle.style.color = "#cbd5e1";
    playTone(523.25, 0.1);
  }
});

// Configure Rhythm Selection Interactivity
presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (isRunning) stopSession();

    presetButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    activePattern = btn.getAttribute("data-pattern");
  });
});
