const keyboardContainer = document.getElementById("keyboard-container");
const waveSelectSelector = document.getElementById("wave-select");

// Instantiating Web Audio Context dynamically upon execution initialization
const AudioContextEngine = window.AudioContext || window.webkitAudioContext;
let masterAudioContextInstance = null;

// Matrix map collection mapping note assignments to computer key codes
const noteMatrixSchema = [
  { noteName: "C4", keyBinding: "A", frequency: 261.63, isBlack: false },
  { noteName: "C#4", keyBinding: "W", frequency: 277.18, isBlack: true },
  { noteName: "D4", keyBinding: "S", frequency: 293.66, isBlack: false },
  { noteName: "D#4", keyBinding: "E", frequency: 311.13, isBlack: true },
  { noteName: "E4", keyBinding: "D", frequency: 329.63, isBlack: false },
  { noteName: "F4", keyBinding: "F", frequency: 349.23, isBlack: false },
  { noteName: "F#4", keyBinding: "T", frequency: 369.99, isBlack: true },
  { noteName: "G4", keyBinding: "G", frequency: 392.0, isBlack: false },
  { noteName: "G#4", keyBinding: "Y", frequency: 415.3, isBlack: true },
  { noteName: "A4", keyBinding: "H", frequency: 440.0, isBlack: false },
  { noteName: "A#4", keyBinding: "U", frequency: 466.16, isBlack: true },
  { noteName: "B4", keyBinding: "J", frequency: 493.88, isBlack: false },
  { noteName: "C5", keyBinding: "K", frequency: 523.25, isBlack: false },
];

const activelyTriggeredOscillatorsList = {};

function compileKeyboardElements() {
  keyboardContainer.innerHTML = "";

  noteMatrixSchema.forEach((elementConfig) => {
    const keyDomNode = document.createElement("div");
    keyDomNode.className = `piano-key ${elementConfig.isBlack ? "black-key" : "white-key"}`;
    keyDomNode.dataset.note = elementConfig.noteName;

    keyDomNode.innerHTML = `<span class="key-label">${elementConfig.keyBinding}</span>`;

    // Interactive mouse down triggers
    keyDomNode.addEventListener("mousedown", () =>
      triggerOscillatorAttackTone(elementConfig),
    );
    keyDomNode.addEventListener("mouseup", () =>
      clearOscillatorReleaseTone(elementConfig.noteName),
    );
    keyDomNode.addEventListener("mouseleave", () =>
      clearOscillatorReleaseTone(elementConfig.noteName),
    );

    keyboardContainer.appendChild(keyDomNode);
  });
}

function initializeAudioContextEnvironment() {
  if (!masterAudioContextInstance) {
    masterAudioContextInstance = new AudioContextEngine();
  }
}

function triggerOscillatorAttackTone(noteConfiguration) {
  initializeAudioContextEnvironment();

  // Prevent duplicated signal stacks if key is held down
  if (activelyTriggeredOscillatorsList[noteConfiguration.noteName]) return;

  const synthOscillatorNode = masterAudioContextInstance.createOscillator();
  const soundEnvelopeGainNode = masterAudioContextInstance.createGain();

  synthOscillatorNode.type = waveSelectSelector.value;
  synthOscillatorNode.frequency.setValueAtTime(
    noteConfiguration.frequency,
    masterAudioContextInstance.currentTime,
  );

  // Smooth envelope attack window settings to prevent popping audio artifact spikes
  soundEnvelopeGainNode.gain.setValueAtTime(
    1,
    masterAudioContextInstance.currentTime,
  );
  soundEnvelopeGainNode.gain.exponentialRampToValueAtTime(
    0.001,
    masterAudioContextInstance.currentTime + 1.2,
  );

  synthOscillatorNode.connect(soundEnvelopeGainNode);
  soundEnvelopeGainNode.connect(masterAudioContextInstance.destination);

  synthOscillatorNode.start();

  // Map instances onto memory array maps to allow tracking release executions
  activelyTriggeredOscillatorsList[noteConfiguration.noteName] = {
    oscInstance: synthOscillatorNode,
    gainInstance: soundEnvelopeGainNode,
  };

  toggleVisualKeyStateRepresentation(noteConfiguration.noteName, true);
}

function clearOscillatorReleaseTone(noteIdentifierName) {
  const activeTargetInstance =
    activelyTriggeredOscillatorsList[noteIdentifierName];
  if (!activeTargetInstance) return;

  try {
    activeTargetInstance.oscInstance.stop();
  } catch (e) {
    // Handle runtime context edge breaks safely
  }

  delete activelyTriggeredOscillatorsList[noteIdentifierName];
  toggleVisualKeyStateRepresentation(noteIdentifierName, false);
}

function toggleVisualKeyStateRepresentation(noteName, isCurrentlyPlaying) {
  const matchedDomNode = keyboardContainer.querySelector(
    `[data-note="${noteName}"]`,
  );
  if (!matchedDomNode) return;

  if (isCurrentlyPlaying) {
    matchedDomNode.classList.add("active-playing");
  } else {
    matchedDomNode.classList.remove("active-playing");
  }
}

// Global window event tracking structures mapping user computer key rows
window.addEventListener("keydown", (keydownEvent) => {
  if (keydownEvent.repeat) return; // Disregard internal recurring engine loops
  const extractedCharacterToken = keydownEvent.key.toUpperCase();
  const correlatedConfigMatch = noteMatrixSchema.find(
    (item) => item.keyBinding === extractedCharacterToken,
  );

  if (correlatedConfigMatch) {
    triggerOscillatorAttackTone(correlatedConfigMatch);
  }
});

window.addEventListener("keyup", (keyupEvent) => {
  const extractedCharacterToken = keyupEvent.key.toUpperCase();
  const correlatedConfigMatch = noteMatrixSchema.find(
    (item) => item.keyBinding === extractedCharacterToken,
  );

  if (correlatedConfigMatch) {
    clearOscillatorReleaseTone(correlatedConfigMatch.noteName);
  }
});

// Build the piano layout visually
compileKeyboardElements();
