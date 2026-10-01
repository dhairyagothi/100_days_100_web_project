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
// Audio System
// ===============================

class AudioManager {
  constructor() {
    this.soundEffectsEnabled = true;
    this.voiceGuidanceEnabled = false;
    this.ambientEnabled = false;
    this.volume = 0.5;
    this.currentAmbient = 'rain';
    this.audioContext = null;
    this.ambientSource = null;
    this.gainNode = null;
    this.speechSynth = window.speechSynthesis;
    this.isSpeaking = false;
    this.speechQueue = [];
    
    this.initAudioContext();
  }
  
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.volume;
      this.gainNode.connect(this.audioContext.destination);
    } catch (e) {
      console.warn('Web Audio not supported');
    }
  }
  
  setVolume(value) {
    this.volume = value / 100;
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }
  
  // Breath Sound Effects
  playBreathSound(state, duration) {
    if (!this.soundEffectsEnabled || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      oscillator.connect(gain);
      gain.connect(this.gainNode);
      
      // Different tones for different phases
      if (state === 'inhale') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(400, this.audioContext.currentTime + duration / 1000);
        gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      } else if (state === 'exhale') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + duration / 1000);
        gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      } else {
        // Hold - subtle chime
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
        gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      }
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + (state === 'hold' ? 0.5 : duration / 1000));
      
    } catch (e) {
      console.warn('Error playing breath sound:', e);
    }
  }
  
  // Tibetan Singing Bowl Chime
  playChime() {
    if (!this.soundEffectsEnabled || !this.audioContext) return;
    
    try {
      const bufferSize = this.audioContext.sampleRate * 2;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Create a decaying sine wave with harmonics
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.audioContext.sampleRate;
        const frequency = 440 + 880 * Math.exp(-t * 0.5);
        const envelope = Math.exp(-t * 2);
        data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
      }
      
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      
      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);
      
      source.connect(gain);
      gain.connect(this.gainNode);
      source.start(this.audioContext.currentTime);
      
    } catch (e) {
      console.warn('Error playing chime:', e);
    }
  }
  
  // Ambient Sounds
  async playAmbient(soundType = 'rain') {
    if (!this.ambientEnabled || !this.audioContext) return;
    
    try {
      if (this.ambientSource) {
        this.ambientSource.stop();
        this.ambientSource = null;
      }
      
      // Generate ambient noise using Web Audio
      const bufferSize = 2 * this.audioContext.sampleRate;
      const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
      
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < bufferSize; i++) {
          const t = i / this.audioContext.sampleRate;
          let value = 0;
          
          // Different ambient sounds
          switch(soundType) {
            case 'rain':
              value = this.generateRainNoise(t) * 0.15;
              break;
            case 'ocean':
              value = this.generateOceanNoise(t) * 0.12;
              break;
            case 'forest':
              value = this.generateForestNoise(t) * 0.08;
              break;
            case 'fire':
              value = this.generateFireNoise(t) * 0.1;
              break;
            default:
              value = Math.random() * 2 - 1;
          }
          
          data[i] = value;
        }
      }
      
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      
      const gain = this.audioContext.createGain();
      gain.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
      
      source.connect(gain);
      gain.connect(this.audioContext.destination);
      
      source.start(0);
      this.ambientSource = source;
      
    } catch (e) {
      console.warn('Error playing ambient sound:', e);
    }
  }
  
  // Noise generators
  generateRainNoise(t) {
    const rainDrops = 20;
    let sum = 0;
    for (let i = 0; i < rainDrops; i++) {
      const phase = i * 0.3 + t * 0.5;
      const amplitude = 0.1 + 0.1 * Math.sin(t * 1.2 + i);
      sum += amplitude * Math.sin(2 * Math.PI * (100 + i * 20) * t + phase);
    }
    return sum / rainDrops + (Math.random() - 0.5) * 0.1;
  }
  
  generateOceanNoise(t) {
    const waves = 8;
    let sum = 0;
    for (let i = 0; i < waves; i++) {
      const frequency = 0.5 + i * 0.2;
      const amplitude = 0.15 * Math.exp(-i * 0.2);
      sum += amplitude * Math.sin(2 * Math.PI * frequency * t + Math.sin(t * 0.1 + i * 1.5));
    }
    return sum + (Math.random() - 0.5) * 0.05;
  }
  
  generateForestNoise(t) {
    const birds = 5;
    let sum = 0;
    for (let i = 0; i < birds; i++) {
      const chirpRate = 1 + Math.random() * 2;
      const chirpLength = 0.02 + Math.random() * 0.03;
      const value = Math.sin(2 * Math.PI * (500 + i * 200) * t);
      const envelope = Math.exp(-Math.pow((t % chirpRate - 0.5) * 20, 2));
      sum += value * envelope * 0.02;
    }
    return sum + Math.sin(t * 2) * 0.02 + (Math.random() - 0.5) * 0.03;
  }
  
  generateFireNoise(t) {
    const cracks = 30;
    let sum = 0;
    for (let i = 0; i < cracks; i++) {
      const frequency = 50 + Math.random() * 150;
      const amplitude = 0.02 + Math.random() * 0.03;
      const phase = Math.random() * Math.PI * 2;
      const decay = Math.exp(-t * 0.5 + i * 0.01);
      sum += amplitude * Math.sin(2 * Math.PI * frequency * t + phase) * decay;
    }
    return sum + (Math.random() - 0.5) * 0.05;
  }
  
  stopAmbient() {
    if (this.ambientSource) {
      this.ambientSource.stop();
      this.ambientSource = null;
    }
  }
  
  // Voice Guidance
  speak(text, rate = 0.9, pitch = 1) {
    if (!this.voiceGuidanceEnabled) return;
    
    try {
      if (this.isSpeaking) {
        this.speechQueue.push({ text, rate, pitch });
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = this.volume;
      utterance.lang = 'en-US';
      
      utterance.onstart = () => {
        this.isSpeaking = true;
      };
      
      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.speechQueue.length > 0) {
          const next = this.speechQueue.shift();
          this.speak(next.text, next.rate, next.pitch);
        }
      };
      
      utterance.onerror = () => {
        this.isSpeaking = false;
        if (this.speechQueue.length > 0) {
          const next = this.speechQueue.shift();
          this.speak(next.text, next.rate, next.pitch);
        }
      };
      
      this.speechSynth.speak(utterance);
    } catch (e) {
      console.warn('Error with voice guidance:', e);
    }
  }
  
  stopSpeech() {
    this.speechSynth.cancel();
    this.isSpeaking = false;
    this.speechQueue = [];
  }
  
  toggleSoundEffects() {
    this.soundEffectsEnabled = !this.soundEffectsEnabled;
    return this.soundEffectsEnabled;
  }
  
  toggleVoiceGuidance() {
    this.voiceGuidanceEnabled = !this.voiceGuidanceEnabled;
    if (!this.voiceGuidanceEnabled) {
      this.stopSpeech();
    }
    return this.voiceGuidanceEnabled;
  }
  
  toggleAmbient() {
    this.ambientEnabled = !this.ambientEnabled;
    if (!this.ambientEnabled) {
      this.stopAmbient();
    } else {
      this.playAmbient(this.currentAmbient);
    }
    return this.ambientEnabled;
  }
  
  setAmbientSound(type) {
    this.currentAmbient = type;
    if (this.ambientEnabled) {
      this.playAmbient(type);
    }
  }
}

// ===============================
// Session State
// ===============================

let currentPresetKey = "box";
let currentStepIndex = 0;
let cycleCounterValue = 0;
let sessionActive = false;

let sessionTimeoutId = null;
let countdownInterval = null;

// Initialize Audio Manager
const audioManager = new AudioManager();

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

// Audio Controls
const soundEffectsToggle = document.getElementById("soundEffectsToggle");
const voiceGuidanceToggle = document.getElementById("voiceGuidanceToggle");
const ambientToggle = document.getElementById("ambientSoundToggle");
const ambientSelector = document.getElementById("ambientSelector");
const ambientBtns = document.querySelectorAll(".ambient-btn");
const volumeSlider = document.getElementById("volumeSlider");

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.querySelector(".theme-icon");

// ===============================
// Theme Management
// ===============================

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  
  document.documentElement.setAttribute("data-theme", newTheme);
  themeIcon.textContent = newTheme === "light" ? "☀️" : "🌙";
  
  localStorage.setItem("theme", newTheme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeIcon.textContent = savedTheme === "light" ? "☀️" : "🌙";
}

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
  
  // Play breath sound effect
  audioManager.playBreathSound(step.state, step.duration);
  
  // Voice guidance
  if (step.state !== 'hold') {
    audioManager.speak(step.text, 0.9, step.state === 'inhale' ? 1.1 : 0.9);
  }

  sessionTimeoutId = setTimeout(() => {
    currentStepIndex++;

    if (currentStepIndex >= preset.length) {
      currentStepIndex = 0;
      cycleCounterValue++;
      cycleCountDisplay.innerText = cycleCounterValue;
      
      // Play chime at start of new cycle
      audioManager.playChime();
      
      // Announce cycle completion
      if (cycleCounterValue % 5 === 0) {
        audioManager.speak(`Completed ${cycleCounterValue} cycles`, 0.8, 1);
      }
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
  
  audioManager.stopSpeech();
}

// ===============================
// Event Listeners
// ===============================

// Theme
themeToggle.addEventListener("click", toggleTheme);

// Audio Controls
soundEffectsToggle.addEventListener("click", () => {
  const enabled = audioManager.toggleSoundEffects();
  soundEffectsToggle.classList.toggle("active");
});

voiceGuidanceToggle.addEventListener("click", () => {
  const enabled = audioManager.toggleVoiceGuidance();
  voiceGuidanceToggle.classList.toggle("active");
});

ambientToggle.addEventListener("click", () => {
  const enabled = audioManager.toggleAmbient();
  ambientToggle.classList.toggle("active");
  ambientSelector.classList.toggle("hidden");
});

ambientBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    ambientBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    audioManager.setAmbientSound(btn.dataset.sound);
  });
});

volumeSlider.addEventListener("input", (e) => {
  const value = e.target.value;
  audioManager.setVolume(value);
});

// Custom Pattern
saveBtn.addEventListener("click", saveCustomPattern);

// Start/Stop
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

// Preset Buttons
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

loadTheme();
loadCustomPattern();

phaseName.innerText = "Ready";
countdownTimer.innerText = "0";