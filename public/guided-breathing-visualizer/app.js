// ===============================
// Breathing Presets
// ===============================
const TIMING_PRESETS = {
  box: [
    { state: "inhale", text: "Inhale", duration: 4000 },
    { state: "hold", text: "Hold", duration: 4000 },
    { state: "exhale", text: "Exhale", duration: 4000 },
    { state: "hold", text: "Hold", duration: 4000 },
  ],

  relax: [
    { state: "inhale", text: "Inhale", duration: 4000 },
    { state: "hold", text: "Hold", duration: 7000 },
    { state: "exhale", text: "Exhale", duration: 8000 },
  ],

  equal: [
    { state: "inhale", text: "Inhale", duration: 4000 },
    { state: "exhale", text: "Exhale", duration: 4000 },
  ],

  custom: [],
};

// ===============================
// Session State
// ===============================

let currentPresetKey = "box";
let currentStepIndex = 0;
let cycleCounterValue = 0;
let sessionActive = false;

let sessionTimeoutId = null;
let countdownInterval = null;

// ===============================
// DOM Elements
// ===============================

const customPanel = document.getElementById("customPatternPanel");

const inhaleInput = document.getElementById("inhaleDuration");
const holdInput = document.getElementById("holdDuration");
const exhaleInput = document.getElementById("exhaleDuration");
const secondHoldInput = document.getElementById("secondHoldDuration");

const saveBtn = document.getElementById("saveCustomPattern");
const validationMessage = document.getElementById("validationMessage");

const countdownTimer = document.getElementById("countdownTimer");
const phaseName = document.getElementById("phaseName");

const nodeWrapper = document.querySelector(".breathing-node-wrapper");
const statusText = document.getElementById("breathingText");

const cycleCountDisplay = document.getElementById("cycleCount");

const startStopBtn = document.getElementById("startStopBtn");

const presetButtons = document.querySelectorAll(".preset-btn");

// ===============================
// Local Storage
// ===============================

function loadCustomPattern() {
  const saved = localStorage.getItem("customBreathingPattern");

  if (!saved) return;

  const pattern = JSON.parse(saved);

  inhaleInput.value = pattern.inhale;
  holdInput.value = pattern.hold;
  exhaleInput.value = pattern.exhale;
  secondHoldInput.value = pattern.hold2;

  buildCustomPattern(pattern);
}

function saveCustomPattern() {
  const inhale = Number(inhaleInput.value);
  const hold = Number(holdInput.value);
  const exhale = Number(exhaleInput.value);
  const hold2 = Number(secondHoldInput.value);

  const values = [inhale, hold, exhale, hold2];

  if (values.some(v => Number.isNaN(v) || v < 0 || v > 30)) {
    validationMessage.innerText =
      "All durations must be between 0 and 30 seconds.";
    return;
  }

  if (inhale === 0 || exhale === 0) {
    validationMessage.innerText =
      "Inhale and Exhale must be at least 1 second.";
    return;
  }

  validationMessage.innerText = "";

  const pattern = {
    inhale,
    hold,
    exhale,
    hold2,
  };

  localStorage.setItem(
    "customBreathingPattern",
    JSON.stringify(pattern)
  );

  buildCustomPattern(pattern);
}

function buildCustomPattern(pattern) {
  TIMING_PRESETS.custom = [];

  TIMING_PRESETS.custom.push({
    state: "inhale",
    text: "Inhale",
    duration: pattern.inhale * 1000,
  });

  if (pattern.hold > 0) {
    TIMING_PRESETS.custom.push({
      state: "hold",
      text: "Hold",
      duration: pattern.hold * 1000,
    });
  }

  TIMING_PRESETS.custom.push({
    state: "exhale",
    text: "Exhale",
    duration: pattern.exhale * 1000,
  });

  if (pattern.hold2 > 0) {
    TIMING_PRESETS.custom.push({
      state: "hold",
      text: "Hold",
      duration: pattern.hold2 * 1000,
    });
  }
}

// ===============================
// Countdown
// ===============================

function startCountdown(duration) {
  clearInterval(countdownInterval);

  let remaining = duration / 1000;

  countdownTimer.innerText = remaining;

  countdownInterval = setInterval(() => {
    remaining--;

    if (remaining < 0) {
      clearInterval(countdownInterval);
      return;
    }

    countdownTimer.innerText = remaining;
  }, 1000);
}

// ===============================
// Breathing Engine
// ===============================

function runBreathingSequence() {
  if (!sessionActive) return;

  const preset = TIMING_PRESETS[currentPresetKey];
  const step = preset[currentStepIndex];

  nodeWrapper.className = "breathing-node-wrapper";
  nodeWrapper.classList.add(step.state);

  statusText.innerText = step.text;
  phaseName.innerText = step.text;

  startCountdown(step.duration);

  sessionTimeoutId = setTimeout(() => {
    currentStepIndex++;

    if (currentStepIndex >= preset.length) {
      currentStepIndex = 0;
      cycleCounterValue++;
      cycleCountDisplay.innerText = cycleCounterValue;
    }

    runBreathingSequence();
  }, step.duration);
}

// ===============================
// Reset Session
// ===============================

function clearSessionState() {
  sessionActive = false;

  clearTimeout(sessionTimeoutId);
  clearInterval(countdownInterval);

  currentStepIndex = 0;

  nodeWrapper.className = "breathing-node-wrapper";

  statusText.innerText = "Ready";
  phaseName.innerText = "Ready";
  countdownTimer.innerText = "0";

  startStopBtn.innerText = "Begin Session";
  startStopBtn.classList.remove("active");
}

// ===============================
// Event Listeners
// ===============================

saveBtn.addEventListener("click", saveCustomPattern);

startStopBtn.addEventListener("click", () => {
  if (sessionActive) {
    clearSessionState();
    return;
  }

  if (
    currentPresetKey === "custom" &&
    TIMING_PRESETS.custom.length === 0
  ) {
    validationMessage.innerText =
      "Please save a custom breathing pattern first.";
    return;
  }

  sessionActive = true;

  startStopBtn.innerText = "Stop Session";
  startStopBtn.classList.add("active");

  runBreathingSequence();
});

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (sessionActive) {
      clearSessionState();
    }

    presetButtons.forEach((b) =>
      b.classList.remove("active")
    );

    btn.classList.add("active");

    currentPresetKey = btn.dataset.preset;

    if (currentPresetKey === "custom") {
      customPanel.classList.remove("hidden");
    } else {
      customPanel.classList.add("hidden");
    }
  });
});

// ===============================
// Initialize
// ===============================

loadCustomPattern();

phaseName.innerText = "Ready";
countdownTimer.innerText = "0";