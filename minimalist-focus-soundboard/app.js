let audioCtx = null;
const activeSounds = {};

const soundGenerators = {
  rain: (ctx, gainNode) => {
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;

    source.connect(filter);
    filter.connect(gainNode);
    return source;
  },

  "white-noise": (ctx, gainNode) => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNode);
    return source;
  },

  fire: (ctx, gainNode) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 45;

    const biquad = ctx.createBiquadFilter();
    biquad.type = "peaking";
    biquad.frequency.value = 1200;
    biquad.Q.value = 10;
    biquad.gain.value = 25;

    osc.connect(biquad);
    biquad.connect(gainNode);
    return osc;
  },

  cafe: (ctx, gainNode) => {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 160;
    osc2.type = "sine";
    osc2.frequency.value = 164;

    osc1.connect(gainNode);
    osc2.connect(gainNode);

    return {
      start: () => {
        osc1.start();
        osc2.start();
      },
      stop: () => {
        osc1.stop();
        osc2.stop();
      },
    };
  },

  train: (ctx, gainNode) => {
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 32;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 120;

    osc.connect(filter);
    filter.connect(gainNode);
    return osc;
  },

  forest: (ctx, gainNode) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 900;

    const modulation = ctx.createOscillator();
    const modGain = ctx.createGain();
    modulation.frequency.value = 0.25;
    modGain.gain.value = 150;

    modulation.connect(modGain);
    modGain.connect(osc.frequency);

    osc.connect(gainNode);
    return {
      start: () => {
        modulation.start();
        osc.start();
      },
      stop: () => {
        modulation.stop();
        osc.stop();
      },
    };
  },
};

document.querySelectorAll(".sound-card").forEach((card) => {
  const soundType = card.dataset.sound;
  const slider = card.querySelector(".volume-slider");

  card.addEventListener("click", (e) => {
    if (e.target === slider) return;

    if (!audioCtx)
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (activeSounds[soundType]) {
      activeSounds[soundType].source.stop();
      card.classList.remove("active");
      delete activeSounds[soundType];
    } else {
      const trackGain = audioCtx.createGain();
      trackGain.gain.value = slider.value;
      trackGain.connect(audioCtx.destination);

      const sourceNode = soundGenerators[soundType](audioCtx, trackGain);
      sourceNode.start();

      activeSounds[soundType] = { source: sourceNode, gain: trackGain };
      card.classList.add("active");
    }
  });

  slider.addEventListener("input", (e) => {
    if (activeSounds[soundType]) {
      activeSounds[soundType].gain.gain.setValueAtTime(
        e.target.value,
        audioCtx.currentTime,
      );
    }
  });
});

let timerInterval = null;
let timeRemaining = 25 * 60;
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("timerStartBtn");
const resetBtn = document.getElementById("timerResetBtn");

startBtn.addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
  } else {
    startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    timerInterval = setInterval(() => {
      timeRemaining--;
      const mins = Math.floor(timeRemaining / 60)
        .toString()
        .padStart(2, "0");
      const secs = (timeRemaining % 60).toString().padStart(2, "0");
      timerDisplay.innerText = `${mins}:${secs}`;

      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert("Focus block complete! Time for a short break.");
        timeRemaining = 25 * 60;
        timerDisplay.innerText = "25:00";
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
      }
    }, 1000);
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeRemaining = 25 * 60;
  timerDisplay.innerText = "25:00";
  startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
});
