// Breathing Routine Configuration Arrays
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
};

let currentPresetKey = "box";
let currentStepIndex = 0;
let cycleCounterValue = 0;
let sessionActive = false;
let sessionTimeoutId = null;

// DOM Selectors
const nodeWrapper = document.querySelector(".breathing-node-wrapper");
const statusText = document.getElementById("breathingText");
const cycleCountDisplay = document.getElementById("cycleCount");
const startStopBtn = document.getElementById("startStopBtn");
const presetButtons = document.querySelectorAll(".preset-btn");

// Executive Animation Sequence Controller
function runBreathingSequence() {
  if (!sessionActive) return;

  const currentPreset = TIMING_PRESETS[currentPresetKey];
  const step = currentPreset[currentStepIndex];

  // Clear previous dynamic state tracking selectors
  nodeWrapper.className = "breathing-node-wrapper";
  nodeWrapper.classList.add(step.state);
  statusText.innerText = step.text;

  sessionTimeoutId = setTimeout(() => {
    currentStepIndex++;

    // Cycle increment checkpoint evaluation
    if (currentStepIndex >= currentPreset.length) {
      currentStepIndex = 0;
      cycleCounterValue++;
      cycleCountDisplay.innerText = cycleCounterValue;
    }

    runBreathingSequence();
  }, step.duration);
}

function clearSessionState() {
  sessionActive = false;
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
    sessionTimeoutId = null;
  }
  nodeWrapper.className = "breathing-node-wrapper";
  statusText.innerText = "Ready";
  startStopBtn.innerText = "Begin Session";
  startStopBtn.classList.remove("active");
  currentStepIndex = 0;
}

// Interactive Listener hooks
startStopBtn.addEventListener("click", () => {
  if (sessionActive) {
    clearSessionState();
  } else {
    sessionActive = true;
    startStopBtn.innerText = "Stop Session";
    startStopBtn.classList.add("active");
    runBreathingSequence();
  }
});

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (sessionActive) {
      clearSessionState();
    }
    presetButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentPresetKey = btn.getAttribute("data-preset");
  });
});
