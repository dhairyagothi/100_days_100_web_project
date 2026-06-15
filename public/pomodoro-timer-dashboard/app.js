// Timings in seconds
const MODES = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

let currentMode = "work";
let timeLeft = MODES[currentMode];
let timerInterval = null;

// UI Targets
const timeDisplay = document.getElementById("timeDisplay");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");
const progressRingFill = document.getElementById("timerProgress");
const modeButtons = document.querySelectorAll(".mode-btn");

// Circular Geometry Setup
const RING_CIRCUMFERENCE = 2 * Math.PI * 130;

// Web Audio API Ambient Synths
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const activeAudioChannels = {};

// Synthetic sound maps generator
const SoundGenerators = {
  rain: (ctx) => {
    const bufferSize = 2 * ctx.sampleRate,
      noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate),
      output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 450;

    whiteNoise.connect(filter);
    return { source: whiteNoise, tail: filter };
  },
  forest: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 120;

    // Low-frequency filter modulation to emulate wind breeze waves
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.2;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 30;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);

    lfo.start();
    return { source: osc, tail: gain, extra: lfo };
  },
  cafe: (ctx) => {
    const bufferSize = ctx.sampleRate * 2,
      noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate),
      output = noiseBuffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 * 0.5362;
      output[i] *= 0.11; // pink noise approximation
      b6 = white * 0.115926;
    }
    const pinkNoise = ctx.createBufferSource();
    pinkNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 300;

    pinkNoise.connect(filter);
    return { source: pinkNoise, tail: filter };
  },
};

// Update Timer Ring Logic
function updateClockInterface() {
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  timeDisplay.innerText = `${minutes}:${seconds}`;

  const fraction = timeLeft / MODES[currentMode];
  const offset = RING_CIRCUMFERENCE * (1 - fraction);
  progressRingFill.style.strokeDashoffset = offset.toString();
}

// Main Engine Loops
function tick() {
  if (timeLeft > 0) {
    timeLeft--;
    updateClockInterface();
  } else {
    clearInterval(timerInterval);
    timerInterval = null;
    startStopBtn.innerText = "Start Focus";
    // Play soft native system chime notification
    const osc = audioCtx.createOscillator();
    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }
}

// Button Click Triggers
startStopBtn.addEventListener("click", () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    startStopBtn.innerText = "Start Focus";
  } else {
    timerInterval = setInterval(tick, 1000);
    startStopBtn.innerText = "Pause";
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = MODES[currentMode];
  startStopBtn.innerText = "Start Focus";
  updateClockInterface();
});

// Mode State Handlers
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentMode = btn.getAttribute("data-mode");
    timeLeft = MODES[currentMode];

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      startStopBtn.innerText = "Start Focus";
    }
    updateClockInterface();
  });
});

// Mixer Engine Infrastructure
document.querySelectorAll(".sound-toggle-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const soundId = btn.getAttribute("data-sound");

    if (activeAudioChannels[soundId]) {
      // Stop sound logic
      activeAudioChannels[soundId].source.stop();
      if (activeAudioChannels[soundId].extra) {
        activeAudioChannels[soundId].extra.stop();
      }
      delete activeAudioChannels[soundId];
      btn.classList.remove("playing");
      btn.innerText = "Play";
    } else {
      // Start generator logic
      const nodeGraph = SoundGenerators[soundId](audioCtx);
      const channelGain = audioCtx.createGain();

      const correspondingSlider = document.querySelector(
        `.volume-slider[data-sound="${soundId}"]`,
      );
      channelGain.gain.value = parseFloat(correspondingSlider.value);

      nodeGraph.tail.connect(channelGain);
      channelGain.connect(audioCtx.destination);

      nodeGraph.source.loop = true;
      nodeGraph.source.start();

      activeAudioChannels[soundId] = {
        source: nodeGraph.source,
        gainNode: channelGain,
        extra: nodeGraph.extra,
      };

      btn.classList.add("playing");
      btn.innerText = "Stop";
    }
  });
});

// Real-time Slider Volume Mixers
document.querySelectorAll(".volume-slider").forEach((slider) => {
  slider.addEventListener("input", () => {
    const soundId = slider.getAttribute("data-sound");
    if (activeAudioChannels[soundId]) {
      activeAudioChannels[soundId].gainNode.gain.value = parseFloat(
        slider.value,
      );
    }
  });
});

// Base Initializer Pass
updateClockInterface();
