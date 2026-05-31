// SoundWave Lab: Synthesizer & Canvas Visualizer

// Global variables for Audio Engine
let audioCtx = null;
let masterGain = null;
let filterNode = null;
let delayNode = null;
let delayFeedback = null;
let distortionNode = null;
let analyser = null;

// Synthesis state
let activeOscillators = {};
let currentWaveType = 'sine';
let currentOctave = 4;
let demoInterval = null;
let isDemoPlaying = false;
let isAudioStarted = false;

// DOM Elements
const btnStartAudio = document.getElementById('btn-start-audio');
const btnDemoLoop = document.getElementById('btn-demo-loop');
const selectVisualizerMode = document.getElementById('select-visualizer-mode');
const displayOctave = document.getElementById('display-octave');
const btnOctaveDown = document.getElementById('btn-octave-down');
const btnOctaveUp = document.getElementById('btn-octave-up');
const canvas = document.getElementById('visualizer-canvas');
const ctx = canvas.getContext('2d');
const audioEngineOverlay = document.getElementById('audio-engine-overlay');

// Sliders and Displays
const inputAttack = document.getElementById('input-attack');
const inputDecay = document.getElementById('input-decay');
const inputSustain = document.getElementById('input-sustain');
const inputRelease = document.getElementById('input-release');
const inputCutoff = document.getElementById('input-cutoff');
const inputResonance = document.getElementById('input-resonance');
const inputDelayTime = document.getElementById('input-delay-time');
const inputDelayFeedback = document.getElementById('input-delay-feedback');
const inputDrive = document.getElementById('input-drive');

const displayAttack = document.getElementById('display-attack');
const displayDecay = document.getElementById('display-decay');
const displaySustain = document.getElementById('display-sustain');
const displayRelease = document.getElementById('display-release');
const displayCutoff = document.getElementById('display-cutoff');
const displayResonance = document.getElementById('display-resonance');
const displayDelayTime = document.getElementById('display-delay-time');
const displayDelayFeedback = document.getElementById('display-delay-feedback');
const displayDrive = document.getElementById('display-drive');

// Piano Key frequency map for middle octave (C4 to C5)
const noteFrequencies = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88,
    'C2': 523.25
};

// Computer Keyboard note shortcuts map
const keyboardMap = {
    'a': 'C',
    'w': 'C#',
    's': 'D',
    'e': 'D#',
    'd': 'E',
    'f': 'F',
    't': 'F#',
    'g': 'G',
    'y': 'G#',
    'h': 'A',
    'u': 'A#',
    'j': 'B',
    'k': 'C2'
};

// Computer Keyboard drum shortcuts
const drumMap = {
    '1': 'kick',
    '2': 'snare',
    '3': 'hihat',
    '4': 'clap'
};

// Initialize audio Context & wiring
function initAudio() {
    if (audioCtx) return;
    
    // Create audio context
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Wire up routing nodes
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.3, audioCtx.currentTime);

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.value = parseFloat(inputCutoff.value);
    filterNode.Q.value = parseFloat(inputResonance.value);

    // Distortion shaper node
    distortionNode = audioCtx.createWaveShaper();
    distortionNode.curve = makeDistortionCurve(parseFloat(inputDrive.value));
    distortionNode.oversample = '4x';

    // Delay nodes (Feedback loop)
    delayNode = audioCtx.createDelay(1.0);
    delayNode.delayTime.value = parseFloat(inputDelayTime.value);
    delayFeedback = audioCtx.createGain();
    delayFeedback.gain.value = parseFloat(inputDelayFeedback.value);

    // Build loop for Delay feedback
    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);

    // Routing graph:
    // Oscillator/Noise -> Distortion -> Filter -> Delay Combine -> Analyser -> Output
    // Setup FX send paths
    distortionNode.connect(filterNode);
    
    // Filter outputs into main output AND delay send
    filterNode.connect(masterGain);
    filterNode.connect(delayNode);
    
    // Delay outputs back into main output
    delayNode.connect(masterGain);

    // Connect to analyser & speakers
    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
    
    isAudioStarted = true;
    audioEngineOverlay.classList.add('hidden');
    btnStartAudio.textContent = "Audio Engine Active";
    btnStartAudio.classList.remove('glowing-btn');
    btnStartAudio.classList.add('secondary');
    
    // Start drawing canvas
    requestAnimationFrame(renderVisualizer);
}

// Generate distortion math curve
function makeDistortionCurve(amount) {
    let k = typeof amount === 'number' ? amount : 50;
    let n_samples = 44100;
    let curve = new Float32Array(n_samples);
    let deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
        let x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
}

// Sound Synthesis triggering
function playNote(noteName, frequency) {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Adjust freq based on Octave selection
    const octaveMultiplier = Math.pow(2, currentOctave - 4);
    const targetFreq = frequency * octaveMultiplier;

    // envelope params
    const attack = parseFloat(inputAttack.value);
    const decay = parseFloat(inputDecay.value);
    const sustain = parseFloat(inputSustain.value);
    
    // Create synth nodes
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    
    osc.type = currentWaveType;
    osc.frequency.setValueAtTime(targetFreq, audioCtx.currentTime);

    // envelope logic
    oscGain.gain.setValueAtTime(0, audioCtx.currentTime);
    oscGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + attack);
    oscGain.gain.exponentialRampToValueAtTime(sustain * 0.8, audioCtx.currentTime + attack + decay);

    // Connect oscillator to distortion node
    osc.connect(oscGain);
    oscGain.connect(distortionNode);
    
    osc.start();

    // Store references
    activeOscillators[noteName] = {
        oscillator: osc,
        gainNode: oscGain,
        frequency: targetFreq
    };

    // Trigger visual feedback in keyboard keys
    const keyEl = document.querySelector(`.key[data-note="${noteName}"]`);
    if (keyEl) keyEl.classList.add('active');
}

function stopNote(noteName) {
    const activeVoice = activeOscillators[noteName];
    if (activeVoice) {
        const release = parseFloat(inputRelease.value);
        const gainNode = activeVoice.gainNode;
        const osc = activeVoice.oscillator;

        // Trigger envelope release
        try {
            gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + release);
            
            setTimeout(() => {
                osc.stop();
                osc.disconnect();
            }, release * 1000 + 100);
        } catch (e) {
            // Ignore context schedule issues if already closed
        }

        delete activeOscillators[noteName];
    }

    const keyEl = document.querySelector(`.key[data-note="${noteName}"]`);
    if (keyEl) keyEl.classList.remove('active');
}

// WHITE NOISE generator for synthesized drums
function playWhiteNoiseBuffer() {
    const bufferSize = audioCtx.sampleRate * 0.2; // 200ms duration
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    return noiseNode;
}

// Synthesized Drums Triggers
function playDrum(drumType) {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Trigger pad animation
    const pad = document.getElementById(`pad-${drumType}`);
    if (pad) {
        pad.classList.add('active');
        setTimeout(() => pad.classList.remove('active'), 120);
    }

    if (drumType === 'kick') {
        // Kick synthesis: Oscillator sweep from 150Hz to 0.01Hz in 150ms
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(distortionNode);

        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

        gainNode.gain.setValueAtTime(1.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);

    } else if (drumType === 'snare') {
        // Snare synthesis: White noise filtered + high-pass kick sweep
        const noise = playWhiteNoiseBuffer();
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1000;

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.7, audioCtx.currentTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(distortionNode);

        // Core tone
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = 180;
        oscGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

        osc.connect(oscGain);
        oscGain.connect(distortionNode);

        noise.start();
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);

    } else if (drumType === 'hihat') {
        // Hihat synthesis: High-pass filtered noise with ultra short duration
        const noise = playWhiteNoiseBuffer();
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000;

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(distortionNode);

        noise.start();

    } else if (drumType === 'clap') {
        // Clap synthesis: Multiple short trigger bursts of noise
        const now = audioCtx.currentTime;
        const decayTime = 0.08;
        
        for (let i = 0; i < 3; i++) {
            const burstTime = now + (i * 0.015);
            const noise = playWhiteNoiseBuffer();
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1200;

            const gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(i === 2 ? 0.6 : 0.4, burstTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, burstTime + decayTime);

            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(distortionNode);

            noise.start(burstTime);
        }
    }
}

// Play Built-in Demo Beat Loop
function toggleDemoBeat() {
    if (!audioCtx) initAudio();
    
    if (isDemoPlaying) {
        clearInterval(demoInterval);
        isDemoPlaying = false;
        btnDemoLoop.textContent = "Play Demo Beat";
        btnDemoLoop.classList.remove('primary');
        btnDemoLoop.classList.add('secondary');
    } else {
        isDemoPlaying = true;
        btnDemoLoop.textContent = "Stop Demo Beat";
        btnDemoLoop.classList.add('primary');
        btnDemoLoop.classList.remove('secondary');

        let step = 0;
        // Simple synthetic pattern: 130 BPM (16th notes ~ 115ms interval)
        demoInterval = setInterval(() => {
            if (!isDemoPlaying) return;
            
            // Kick on 0, 4, 8, 12
            if (step % 4 === 0) playDrum('kick');
            
            // Snare/Clap on 4, 12
            if (step % 8 === 4) {
                if (Math.random() > 0.3) playDrum('snare');
                else playDrum('clap');
            }

            // Hihat on offbeats
            if (step % 2 === 1) playDrum('hihat');

            // Play random baseline notes in key on select beats
            if (step % 4 === 2) {
                const keys = ['C', 'E', 'G', 'A'];
                const selectedKey = keys[Math.floor(Math.random() * keys.length)];
                playNote(selectedKey, noteFrequencies[selectedKey]);
                setTimeout(() => stopNote(selectedKey), 100);
            }

            step = (step + 1) % 16;
        }, 200);
    }
}

// Audio Visualizer Rendering
function renderVisualizer() {
    if (!analyser) return;

    // Match canvas width to visual space
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }

    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = analyser.frequencyBinCount;
    const mode = selectVisualizerMode.value;

    ctx.clearRect(0, 0, width, height);

    if (mode === 'bars') {
        // Mode 1: Neon Frequency Bars
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            // Neon Gradient fill
            const grad = ctx.createLinearGradient(0, height, 0, height - barHeight * 1.2);
            grad.addColorStop(0, '#9d4edd');
            grad.addColorStop(0.5, '#ff007f');
            grad.addColorStop(1, '#00f5d4');

            ctx.fillStyle = grad;
            ctx.fillRect(x, height - barHeight * 1.2, barWidth - 1, barHeight * 1.2);

            x += barWidth;
        }

    } else if (mode === 'wave') {
        // Mode 2: Oscilloscope Waveform
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#00f5d4';
        
        // Add neon glow to path
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 245, 212, 0.8)';

        ctx.beginPath();
        const sliceWidth = width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * height / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        
        // Clear shadow effects to prevent performance loss
        ctx.shadowBlur = 0;

    } else if (mode === 'circular') {
        // Mode 3: Circular Particle Ring
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(width, height) * 0.25;

        // Calculate average energy for base ring pulse
        let total = 0;
        for (let i = 0; i < bufferLength; i++) {
            total += dataArray[i];
        }
        const avg = total / bufferLength;
        const dynamicRadius = baseRadius + (avg * 0.4);

        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255, 0, 127, 0.8)';
        
        ctx.beginPath();
        for (let i = 0; i < bufferLength; i += 2) {
            const angle = (i / bufferLength) * Math.PI * 2;
            const amp = dataArray[i] * 0.55;
            const r = dynamicRadius + amp;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.strokeStyle = '#ff007f';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner glowing ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, dynamicRadius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(157, 78, 221, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
    }

    requestAnimationFrame(renderVisualizer);
}

// Handle control value changes & DOM displays
function updateControlSliders() {
    displayAttack.textContent = `${inputAttack.value}s`;
    displayDecay.textContent = `${inputDecay.value}s`;
    displaySustain.textContent = `${Math.round(inputSustain.value * 100)}%`;
    displayRelease.textContent = `${inputRelease.value}s`;
    displayCutoff.textContent = `${inputCutoff.value} Hz`;
    displayResonance.textContent = `${parseFloat(inputResonance.value).toFixed(1)} Q`;
    displayDelayTime.textContent = `${inputDelayTime.value}s`;
    displayDelayFeedback.textContent = `${Math.round(inputDelayFeedback.value * 100)}%`;
    displayDrive.textContent = parseInt(inputDrive.value) === 0 ? "Clean" : `${inputDrive.value}%`;

    // Direct Web Audio node parameter updates
    if (filterNode) {
        filterNode.frequency.setValueAtTime(parseFloat(inputCutoff.value), audioCtx.currentTime);
        filterNode.Q.setValueAtTime(parseFloat(inputResonance.value), audioCtx.currentTime);
    }
    if (delayNode) {
        delayNode.delayTime.setValueAtTime(parseFloat(inputDelayTime.value), audioCtx.currentTime);
    }
    if (delayFeedback) {
        delayFeedback.gain.setValueAtTime(parseFloat(inputDelayFeedback.value), audioCtx.currentTime);
    }
    if (distortionNode) {
        distortionNode.curve = makeDistortionCurve(parseFloat(inputDrive.value));
    }
}

// Event Listeners setup
function setupEvents() {
    // Start button
    btnStartAudio.addEventListener('click', () => {
        initAudio();
    });

    // Demo loop toggle
    btnDemoLoop.addEventListener('click', toggleDemoBeat);

    // Interactive slider listeners
    const sliders = [
        inputAttack, inputDecay, inputSustain, inputRelease,
        inputCutoff, inputResonance, inputDelayTime, inputDelayFeedback, inputDrive
    ];
    sliders.forEach(slider => {
        slider.addEventListener('input', updateControlSliders);
    });

    // Wave type switchers
    const waveBtns = document.querySelectorAll('.wave-btn');
    waveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            waveBtns.forEach(b => b.classList.remove('active'));
            const targetBtn = e.currentTarget;
            targetBtn.classList.add('active');
            currentWaveType = targetBtn.dataset.type;
        });
    });

    // Octave switchers
    btnOctaveDown.addEventListener('click', () => {
        if (currentOctave > 1) {
            currentOctave--;
            displayOctave.textContent = `Octave: ${currentOctave}`;
        }
    });

    btnOctaveUp.addEventListener('click', () => {
        if (currentOctave < 8) {
            currentOctave++;
            displayOctave.textContent = `Octave: ${currentOctave}`;
        }
    });

    // Piano Keyboard interactivity (Mouse/Touch play)
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        const note = key.dataset.note;
        
        // Mouse Down
        key.addEventListener('mousedown', () => {
            playNote(note, noteFrequencies[note]);
        });

        // Mouse Up / Leave
        key.addEventListener('mouseup', () => {
            stopNote(note);
        });

        key.addEventListener('mouseleave', () => {
            stopNote(note);
        });

        // Touch support
        key.addEventListener('touchstart', (e) => {
            e.preventDefault();
            playNote(note, noteFrequencies[note]);
        });

        key.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopNote(note);
        });
    });

    // Drum pads interactivity
    const drumPads = document.querySelectorAll('.drum-pad');
    drumPads.forEach(pad => {
        const id = pad.id.replace('pad-', '');
        pad.addEventListener('mousedown', () => playDrum(id));
        pad.addEventListener('touchstart', (e) => {
            e.preventDefault();
            playDrum(id);
        });
    });

    // Computer Keyboard listeners
    window.addEventListener('keydown', (e) => {
        if (e.repeat) return; // Prevent key repeat loops

        const key = e.key.toLowerCase();
        
        // Note triggers
        if (keyboardMap[key]) {
            const note = keyboardMap[key];
            playNote(note, noteFrequencies[note]);
        }

        // Drum triggers
        if (drumMap[key]) {
            playDrum(drumMap[key]);
        }
    });

    window.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (keyboardMap[key]) {
            const note = keyboardMap[key];
            stopNote(note);
        }
    });
}

// Start visual settings initialization
setupEvents();
updateControlSliders();
