/**
 * Audio Wave Synthesizer
 * Built with Web Audio API and HTML5 Canvas.
 */

// ===== State =====
const state = {
  audioEnabled: false,
  waveform: 'sine',
  volume: 0.5,
  octave: 4,
  activeOscillators: {},
};

// ===== Key Frequency Map (Octave 4) =====
const frequencies = {
  C: 261.63,
  'C#': 277.18,
  D: 293.66,
  'D#': 311.13,
  E: 329.63,
  F: 349.23,
  'F#': 369.99,
  G: 392.0,
  'G#': 415.3,
  A: 440.0,
  'A#': 466.16,
  B: 493.88,
  C5: 523.25,
};

// ===== Computer Keyboard Bindings =====
const keyMap = {
  KeyA: { note: 'C', black: false },
  KeyW: { note: 'C#', black: true },
  KeyS: { note: 'D', black: false },
  KeyE: { note: 'D#', black: true },
  KeyD: { note: 'E', black: false },
  KeyF: { note: 'F', black: false },
  KeyT: { note: 'F#', black: true },
  KeyG: { note: 'G', black: false },
  KeyY: { note: 'G#', black: true },
  KeyH: { note: 'A', black: false },
  KeyU: { note: 'A#', black: true },
  KeyJ: { note: 'B', black: false },
  KeyK: { note: 'C5', black: false },
};

// ===== DOM References =====
const dom = {
  canvas: document.getElementById('visualizer-canvas'),
  audioOverlay: document.getElementById('visualizer-overlay'),
  btnStart: document.getElementById('btn-start-audio'),
  btnOctaveUp: document.getElementById('btn-octave-up'),
  btnOctaveDown: document.getElementById('btn-octave-down'),
  octaveValue: document.getElementById('octave-value'),
  volumeSlider: document.getElementById('volume-slider'),
  volumeValue: document.getElementById('volume-value'),
  keyboard: document.getElementById('piano-keyboard'),
  waveformBtns: document.querySelectorAll('.toggle-btn'),
  toast: document.getElementById('toast'),
  toastText: document.getElementById('toast-text'),
};

// ===== Audio Setup =====
let audioContext = null;
let masterGainNode = null;
let analyserNode = null;
let canvasContext = null;
let drawVisual = null;
let visualizerRunning = false;
let visualizerRunning = false;

/**
 * Shows a toast message
 * @param {string} msg
 */
const showToast = (msg) => {
  dom.toastText.textContent = msg;
  dom.toast.classList.add('toast--visible');
  setTimeout(() => {
    dom.toast.classList.remove('toast--visible');
  }, 2500);
};

/**
 * Initializes the Web Audio API context
 */
const initAudio = () => {
  if (state.audioEnabled) {
    showToast('Synthesizer already active.');
    return true;
  }

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      showToast('Web Audio API not supported in this browser.');
      return false;
    }

    audioContext = new AudioCtx();
    masterGainNode = audioContext.createGain();
    analyserNode = audioContext.createAnalyser();

    // Configure analyser
    analyserNode.fftSize = 256;
    masterGainNode.gain.setValueAtTime(state.volume, audioContext.currentTime);

    // Connections
    masterGainNode.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    state.audioEnabled = true;

    dom.btnStart.disabled = true;
    dom.btnStart.setAttribute('aria-disabled', 'true');

    dom.audioOverlay.classList.add('visualizer-overlay--hidden');

    // Start drawing loop
    initVisualizer();
    showToast('Synthesizer active! 🔊');
    return true;
  } catch (err) {
    console.error('Audio initialization failed:', err);
    showToast('Failed to enable audio.');
    return false;
  }
};

// ===== Synthesizer Mechanics =====

/**
 * Play a note by name
 * @param {string} noteName
 */
const playNote = (noteName) => {
  if (!state.audioEnabled) return;

  // Calculate frequency based on octave shift
  let baseFreq = frequencies[noteName];
  if (!baseFreq) return;

  // Handle shift relative to default octave 4
  const factor = Math.pow(2, state.octave - 4);
  const targetFreq = baseFreq * factor;

  // Avoid duplicate triggers
  if (state.activeOscillators[noteName]) {
    stopNote(noteName);
  }

  try {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.type = state.waveform;
    osc.frequency.setValueAtTime(targetFreq, audioContext.currentTime);

    // Envelope setting for click avoidance
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
    gainNode.gain.setValueAtTime(1, audioContext.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(masterGainNode);

    osc.start();

    state.activeOscillators[noteName] = {
      osc,
      gainNode,
    };

    // UI Feedback
    const keyEl = document.querySelector(`[data-note="${noteName}"]`);
    if (keyEl) keyEl.classList.add('piano-key--active');
  } catch (err) {
    console.error('Play note error:', err);
  }
};

/**
 * Stop playing a note by name
 * @param {string} noteName
 */
const stopNote = (noteName) => {
  const oscData = state.activeOscillators[noteName];
  if (!oscData) return;

  try {
    const { osc, gainNode } = oscData;
    gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.08
    );

    setTimeout(() => {
      try {
        osc.stop();
        osc.disconnect();
        gainNode.disconnect();
      } catch (e) {
        // Safe check if context is closed
      }
    }, 100);

    delete state.activeOscillators[noteName];

    // UI Feedback
    const keyEl = document.querySelector(`[data-note="${noteName}"]`);
    if (keyEl) keyEl.classList.remove('piano-key--active');
  } catch (err) {
    console.error('Stop note error:', err);
  }
};

// ===== Visualizer Rendering =====

const initVisualizer = () => {
  if (visualizerRunning) {
    return;
  }

  visualizerRunning = true;

  if (drawVisual !== null) {
    cancelAnimationFrame(drawVisual);
    drawVisual = null;
  }

  canvasContext = dom.canvas.getContext('2d');
  resizeCanvas();

  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const draw = () => {
    drawVisual = requestAnimationFrame(draw);
    analyserNode.getByteFrequencyData(dataArray);

    canvasContext.fillStyle = '#0a0a12';
    canvasContext.fillRect(0, 0, dom.canvas.width, dom.canvas.height);

    const barWidth = (dom.canvas.width / bufferLength) * 2.5;
    let barHeight = 0;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 1.6;

      // Color gradients
      const percent = i / bufferLength;
      const r = Math.floor(0 + percent * 155);
      const g = Math.floor(242 - percent * 100);
      const b = Math.floor(254 + percent * 1);

      canvasContext.fillStyle = `rgb(${r},${g},${b})`;
      canvasContext.fillRect(
        x,
        dom.canvas.height - barHeight,
        barWidth - 1,
        barHeight
      );

      x += barWidth;
    }
  };

  draw();
};

const resizeCanvas = () => {
  if (!dom.canvas) return;
  dom.canvas.width = dom.canvas.clientWidth;
  dom.canvas.height = dom.canvas.clientHeight;
};

// ===== Piano Layout Generation =====

const renderPianoKeys = () => {
  dom.keyboard.innerHTML = '';
  const noteList = Object.keys(frequencies);

  noteList.forEach((note) => {
    const key = document.createElement('button');
    key.className = 'piano-key';
    key.dataset.note = note;
    key.type = 'button';

    const isBlack = note.includes('#');
    key.classList.add(isBlack ? 'piano-key--black' : 'piano-key--white');

    const label = document.createElement('span');
    label.className = 'key-label';

    // Map desktop shortcuts to UI label
    let helper = '';
    Object.entries(keyMap).forEach(([kCode, val]) => {
      if (val.note === note) {
        helper = kCode.replace('Key', '');
      }
    });

    label.textContent = helper ? `${note} (${helper})` : note;
    key.appendChild(label);

    // Event listeners
    key.addEventListener('mousedown', (e) => {
      e.preventDefault();
      playNote(note);
    });

    key.addEventListener('mouseup', () => stopNote(note));
    key.addEventListener('mouseleave', () => stopNote(note));

    // Touch events
    key.addEventListener('touchstart', (e) => {
      e.preventDefault();
      playNote(note);
    });
    key.addEventListener('touchend', () => stopNote(note));

    dom.keyboard.appendChild(key);
  });
};

// ===== Event Listeners =====

const initListeners = () => {
  // Start synthesis trigger
  dom.btnStart.addEventListener('click', () => {
    initAudio();
  });

  // Volume slider
  dom.volumeSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value, 10);
    state.volume = value / 100;
    dom.volumeValue.textContent = `${value}%`;

    if (masterGainNode) {
      masterGainNode.gain.setValueAtTime(
        state.volume,
        audioContext.currentTime
      );
    }
  });

  // Octave shifting
  dom.btnOctaveDown.addEventListener('click', () => {
    if (state.octave > 1) {
      state.octave--;
      dom.octaveValue.textContent = `Octave ${state.octave}`;
    }
  });

  dom.btnOctaveUp.addEventListener('click', () => {
    if (state.octave < 7) {
      state.octave++;
      dom.octaveValue.textContent = `Octave ${state.octave}`;
    }
  });

  // Waveform selectors
  dom.waveformBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.waveform = btn.dataset.wave;
      dom.waveformBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('toggle-btn--active', active);
        b.setAttribute('aria-checked', active.toString());
      });
    });
  });

  // Computer keyboard trigger listeners
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return; // Prevent key repeat loops

    const bind = keyMap[e.code];
    if (bind) {
      e.preventDefault();
      playNote(bind.note);
    }
  });

  window.addEventListener('keyup', (e) => {
    const bind = keyMap[e.code];
    if (bind) {
      e.preventDefault();
      stopNote(bind.note);
    }
  });

  // Resize canvas event
  window.addEventListener('resize', resizeCanvas);
};

// ===== App Entry Point =====
const init = () => {
  renderPianoKeys();
  initListeners();
};

document.addEventListener('DOMContentLoaded', init);
