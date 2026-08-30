/**
 * Web Audio Synthesizer Logic
 */

// Only run synthesizer logic on the synth page
if (document.getElementById('audio-overlay')) {

    const overlay = document.getElementById('audio-overlay');
    const initBtn = document.getElementById('init-audio-btn');
    const workspace = document.querySelector('.workspace');

    // UI Controls
    const waveRadios = document.querySelectorAll('input[name="waveform"]');
    const masterVolSlider = document.getElementById('master-vol');
    const volDisplay = document.getElementById('vol-display');
    const filterFreqSlider = document.getElementById('filter-freq');
    const filterDisplay = document.getElementById('filter-display');
    const visualizerCanvas = document.getElementById('visualizer');
    const canvasCtx = visualizerCanvas.getContext('2d');
    const btnTime = document.getElementById('btn-time');
    const btnFreq = document.getElementById('btn-freq');
    const pianoContainer = document.getElementById('piano-container');

    // Settings
    const vizColor = localStorage.getItem('synth_color') || '#0ea5e9';
    const globalVolLimit = parseFloat(localStorage.getItem('synth_vol_limit') || 1.0);

    // Audio Graph Elements
    let audioCtx;
    let masterGain;
    let analyser;
    let masterFilter;

    // State
    let currentWaveform = 'sine';
    let currentVisualMode = 'time'; // 'time' or 'freq'
    let activeOscillators = {}; // Track playing notes by keyboard code

    // Musical Frequencies (C4 to C5 octave)
    const notes = [
        { key: 'A', name: 'C', hz: 261.63, type: 'white' },
        { key: 'W', name: 'C#', hz: 277.18, type: 'black' },
        { key: 'S', name: 'D', hz: 293.66, type: 'white' },
        { key: 'E', name: 'D#', hz: 311.13, type: 'black' },
        { key: 'D', name: 'E', hz: 329.63, type: 'white' },
        { key: 'F', name: 'F', hz: 349.23, type: 'white' },
        { key: 'T', name: 'F#', hz: 369.99, type: 'black' },
        { key: 'G', name: 'G', hz: 392.00, type: 'white' },
        { key: 'Y', name: 'G#', hz: 415.30, type: 'black' },
        { key: 'H', name: 'A', hz: 440.00, type: 'white' },
        { key: 'U', name: 'A#', hz: 466.16, type: 'black' },
        { key: 'J', name: 'B', hz: 493.88, type: 'white' },
        { key: 'K', name: 'C5', hz: 523.25, type: 'white' }
    ];

    // Build Keyboard UI
    notes.forEach(note => {
        const keyEl = document.createElement('div');
        keyEl.classList.add('key', note.type);
        keyEl.dataset.key = note.key;
        keyEl.dataset.hz = note.hz;
        
        // Label
        if(note.type === 'white') {
            keyEl.innerText = note.key;
        }

        // Mouse Events
        keyEl.addEventListener('mousedown', () => playNote(note.key, note.hz));
        keyEl.addEventListener('mouseup', () => stopNote(note.key));
        keyEl.addEventListener('mouseleave', () => stopNote(note.key));

        pianoContainer.appendChild(keyEl);
    });

    // Initialize Audio Engine
    initBtn.addEventListener('click', () => {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Master Gain
        masterGain = audioCtx.createGain();
        masterGain.gain.value = parseFloat(masterVolSlider.value) * globalVolLimit;

        // Filter
        masterFilter = audioCtx.createBiquadFilter();
        masterFilter.type = 'lowpass';
        masterFilter.frequency.value = parseFloat(filterFreqSlider.value);

        // Analyser
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;

        // Route: Oscillators -> Master Gain -> Filter -> Analyser -> Speakers
        masterGain.connect(masterFilter);
        masterFilter.connect(analyser);
        analyser.connect(audioCtx.destination);

        // Hide overlay
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 500);
        workspace.classList.add('active');

        // Start Canvas Loop
        resizeCanvas();
        drawVisualizer();
    });

    // --- Controls ---

    waveRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentWaveform = e.target.value;
        });
    });

    masterVolSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        volDisplay.innerText = Math.round(val * 100) + '%';
        if(masterGain) {
            // Smooth volume ramp
            masterGain.gain.setTargetAtTime(val * globalVolLimit, audioCtx.currentTime, 0.05);
        }
    });

    filterFreqSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        filterDisplay.innerText = val + ' Hz';
        if(masterFilter) {
            masterFilter.frequency.setTargetAtTime(val, audioCtx.currentTime, 0.05);
        }
    });

    btnTime.addEventListener('click', () => {
        currentVisualMode = 'time';
        btnTime.classList.add('active');
        btnFreq.classList.remove('active');
    });

    btnFreq.addEventListener('click', () => {
        currentVisualMode = 'freq';
        btnFreq.classList.add('active');
        btnTime.classList.remove('active');
    });

    // --- Note Playing Logic ---

    function playNote(key, frequency) {
        if(!audioCtx || activeOscillators[key]) return; // Already playing or not init

        // Highlight UI
        const keyEl = document.querySelector(`.key[data-key="${key}"]`);
        if(keyEl) keyEl.classList.add('active');

        // Create Osc
        const osc = audioCtx.createOscillator();
        osc.type = currentWaveform;
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

        // Create individual ADSR Gain for this note to prevent clicks
        const env = audioCtx.createGain();
        env.gain.setValueAtTime(0, audioCtx.currentTime);
        // Attack
        env.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);

        osc.connect(env);
        env.connect(masterGain);

        osc.start();
        activeOscillators[key] = { osc, env };
    }

    function stopNote(key) {
        if(!audioCtx || !activeOscillators[key]) return;

        // Un-highlight UI
        const keyEl = document.querySelector(`.key[data-key="${key}"]`);
        if(keyEl) keyEl.classList.remove('active');

        const { osc, env } = activeOscillators[key];
        
        // Release
        env.gain.cancelScheduledValues(audioCtx.currentTime);
        env.gain.setValueAtTime(env.gain.value, audioCtx.currentTime);
        env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

        osc.stop(audioCtx.currentTime + 0.1);
        
        delete activeOscillators[key];
    }

    // Computer Keyboard Event Listeners
    window.addEventListener('keydown', (e) => {
        const key = e.key.toUpperCase();
        const note = notes.find(n => n.key === key);
        if(note) {
            playNote(note.key, note.hz);
        }
    });

    window.addEventListener('keyup', (e) => {
        const key = e.key.toUpperCase();
        const note = notes.find(n => n.key === key);
        if(note) {
            stopNote(note.key);
        }
    });


    // --- Visualizer Logic ---

    function resizeCanvas() {
        visualizerCanvas.width = visualizerCanvas.parentElement.clientWidth;
        visualizerCanvas.height = visualizerCanvas.parentElement.clientHeight - 60; // subtract header
    }
    window.addEventListener('resize', resizeCanvas);

    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);

        const width = visualizerCanvas.width;
        const height = visualizerCanvas.height;

        canvasCtx.fillStyle = '#09090b'; // dark background
        canvasCtx.fillRect(0, 0, width, height);

        if (currentVisualMode === 'time') {
            // Oscilloscope
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = vizColor;
            canvasCtx.beginPath();

            const sliceWidth = width * 1.0 / bufferLength;
            let x = 0;

            for(let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0; // 0 to 2
                const y = v * height / 2;

                if(i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(width, height/2);
            canvasCtx.stroke();

        } else {
            // Frequency Bars
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);

            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for(let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                canvasCtx.fillStyle = vizColor;
                canvasCtx.fillRect(x, height - barHeight/2, barWidth, barHeight/2);

                x += barWidth + 1;
            }
        }
    }
}
