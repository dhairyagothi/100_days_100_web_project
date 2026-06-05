// --- WORKSPACE & API CONTEXT BINDINGS ---
const canvas = document.getElementById('visualizer-canvas');
const ctx = canvas.getContext('2d');
const btnMic = document.getElementById('btn-mic');
const audioFile = document.getElementById('audio-file');
const audioPlayer = document.getElementById('audio-player');
const visualType = document.getElementById('visual-type');
const fftSizeSelect = document.getElementById('fft-size');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

let audioCtx = null;
let analyser = null;
let sourceNode = null;
let dataArray = [];
let animationId = null;

// Scale and fit resolution of Canvas boundaries dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- 1. INITIALIZE WEB AUDIO CORE ROUTER ---
function setupAudioEngine() {
    if (audioCtx) return; // Prevent double creation initialization safely

    // Create cross-browser baseline processing context
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();

    // Set Fast Fourier Transform resolution grid balance
    analyser.fftSize = parseInt(fftSizeSelect.value);
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
}

// Update runtime operational logs visually
function updateEngineStatus(message, isRunning) {
    statusText.textContent = message;
    if (isRunning) {
        statusDot.classList.add('active');
    } else {
        statusDot.classList.remove('active');
    }
}

// Clean up existing hardware/stream routes to prevent memory leaks
function disconnectExistingNodes() {
    if (animationId) cancelAnimationFrame(animationId);
    if (sourceNode) {
        sourceNode.disconnect();
    }
    audioPlayer.pause();
}

// --- 2. INPUT PROCESSING SYSTEMS ---
// Source Input: Hardware Microphone Capture
btnMic.addEventListener('click', async () => {
    try {
        disconnectExistingNodes();
        setupAudioEngine();

        // Request browser media access safely
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

        // Route hardware microphone to core analysis pipeline
        sourceNode = audioCtx.createMediaStreamSource(stream);
        sourceNode.connect(analyser);

        updateEngineStatus("Listening to Mic Stream", true);
        startVisualizerLoop();
    } catch (err) {
        console.error("Microphone linking failed:", err);
        updateEngineStatus("Microphone access denied", false);
    }
});

// Source Input: Local MP3 File Parsing Context
audioFile.addEventListener('change', function () {
    const files = this.files;
    if (files.length === 0) return;

    disconnectExistingNodes();
    setupAudioEngine();

    // Load file stream into background runtime player
    const fileURL = URL.createObjectURL(files[0]);
    audioPlayer.src = fileURL;

    // Connect tracking interface directly to analyzer pipeline nodes
    sourceNode = audioCtx.createMediaElementSource(audioPlayer);
    sourceNode.connect(analyser);
    analyser.connect(audioCtx.destination); // Route directly to output speakers

    audioPlayer.play();
    updateEngineStatus("Playing Uploaded Track", true);
    startVisualizerLoop();
});

// Resolution Adjustment Listener
fftSizeSelect.addEventListener('change', function () {
    if (analyser) {
        analyser.fftSize = parseInt(this.value);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
});

// --- 3. HIGH PERFORMANCE RENDER LOOPS ---
function startVisualizerLoop() {
    const bufferLength = analyser.frequencyBinCount;

    function draw() {
        animationId = requestAnimationFrame(draw);

        const renderMode = visualType.value;

        // Grab metrics data blocks depending on graph types chosen
        if (renderMode === 'oscilloscope') {
            analyser.getByteTimeDomainData(dataArray); // Fetch raw temporal waveforms
        } else {
            analyser.getByteFrequencyData(dataArray); // Fetch processed frequency decibel arrays
        }

        // Clear view area dynamically every single frame cleanly
        ctx.fillStyle = '#07080d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // -- MATRIX MODEL A: FREQUENCY BARS RENDERER --
        if (renderMode === 'frequency-bars') {
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] * 1.8;

                // Color gradient vector configuration mapped cleanly
                const hue = (i / bufferLength) * 280 + 200;
                ctx.fillStyle = `hsla(${hue}, 85%, 55%, 0.85)`;

                ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
                x += barWidth;
            }
        }

        // -- MATRIX MODEL B: CIRCULAR RADIAL PULSE RENDERER --
        else if (renderMode === 'circular-matrix') {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const baseRadius = Math.min(centerX, centerY) * 0.4;

            ctx.beginPath();
            ctx.arc(centerX, centerY, baseRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.stroke();

            for (let i = 0; i < bufferLength; i++) {
                const angle = (i / bufferLength) * Math.PI * 2;
                const amplitude = dataArray[i] * 0.7;

                const xStart = centerX + Math.cos(angle) * baseRadius;
                const yStart = centerY + Math.sin(angle) * baseRadius;
                const xEnd = centerX + Math.cos(angle) * (baseRadius + amplitude);
                const yEnd = centerY + Math.sin(angle) * (baseRadius + amplitude);

                const hue = (i / bufferLength) * 360;
                ctx.strokeStyle = `hsla(${hue}, 90%, 60%, 0.75)`;
                ctx.lineWidth = 3;

                ctx.beginPath();
                ctx.moveTo(xStart, yStart);
                ctx.lineTo(xEnd, yEnd);
                ctx.stroke();
            }
        }

        // -- MATRIX MODEL C: OSCILLOSCOPE WAVEFORM RENDERER --
        else if (renderMode === 'oscilloscope') {
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#8b5cf6';
            ctx.beginPath();

            const sliceWidth = canvas.width / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0; // Dynamic scale normalized variance shifts
                const y = (v * canvas.height) / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                x += sliceWidth;
            }
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }
    }

    draw();
}