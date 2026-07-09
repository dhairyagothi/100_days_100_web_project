class AudioFFTSandbox {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Web Audio Core Nodes Reference Points
        this.audioCtx = null;
        this.analyser = null;
        this.oscillator = null;
        this.gainNode = null;
        this.dataArray = [];

        this.targetFrequency = 440; // Default Standard tuning A4 frequency
        this.isEngineRunning = false;

        this.initCanvas();
        this.registerEvents();
        this.animate();
    }

    initCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight - 40;
    }

    initializeAudioPipeline() {
        if (this.isEngineRunning) return;

        // Instantiate standard window audio node stream contexts
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 1024; // Resolution buffer scale parameters

        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);

        // Build a raw continuous synthesizer oscillator source
        this.oscillator = this.audioCtx.createOscillator();
        this.oscillator.type = 'sawtooth'; // High harmonic data content type
        this.oscillator.frequency.setValueAtTime(this.targetFrequency, this.audioCtx.currentTime);

        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.setValueAtTime(0.04, this.audioCtx.currentTime); // Attenuate master gain to protect hearing

        // Bind audio layout graphs: Oscillator -> Gain -> Analyser -> Output Audio Speakers
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);

        this.oscillator.start();
        this.isEngineRunning = true;

        document.getElementById('startAudioBtn').innerText = "ENGINE TERMINATED";
        document.getElementById('startAudioBtn').style.borderColor = "#ff007f";
        document.getElementById('startAudioBtn').style.color = "#ff007f";
    }

    registerEvents() {
        window.addEventListener('resize', () => this.initCanvas());

        document.getElementById('startAudioBtn').addEventListener('click', () => {
            this.initializeAudioPipeline();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isEngineRunning) return;

            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;

            // Map horizontal layout spectrum spaces to a scalable frequency bounds (80Hz to 1200Hz)
            const frequencyPercent = mouseX / this.canvas.width;
            this.targetFrequency = 80 + (frequencyPercent * 1120);

            this.oscillator.frequency.setValueAtTime(this.targetFrequency, this.audioCtx.currentTime);
            document.getElementById('freqMetric').innerText = `${this.targetFrequency.toFixed(2)} Hz`;
        });
    }

    animate() {
        const startTime = performance.now();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackgroundMatrixGrid();

        if (this.isEngineRunning && this.analyser) {
            // Unpack active array frequencies
            this.analyser.getByteFrequencyData(this.dataArray);

            // Compute split screen layout coordinate divisions
            const halfWidth = this.canvas.width / 2;

            this.renderLinearDecibelBars(0, 0, halfWidth, this.canvas.height);
            this.renderOrbitalPhaseConstellation(halfWidth, 0, halfWidth, this.canvas.height);
        } else {
            this.drawEmptyStateIndicators();
        }

        const runLatency = performance.now() - startTime;
        document.getElementById('latencyMetric').innerText = `${runLatency.toFixed(2)} ms`;

        requestAnimationFrame(() => this.animate());
    }

    drawBackgroundMatrixGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
        this.ctx.lineWidth = 1;
        const size = 25;

        for (let x = 0; x < this.canvas.width; x += size) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += size) {
            this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y); this.ctx.stroke();
        }

        // Draw viewport separation line axis
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
    }

    renderLinearDecibelBars(x, y, w, h) {
        const barWidth = (w / this.dataArray.length) * 2.5;
        let currentX = x;
        let peakAmp = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            const val = this.dataArray[i];
            if (val > peakAmp) peakAmp = val;

            const barHeight = (val / 255) * (h * 0.75);

            // Map color saturation to value heights dynamically
            this.ctx.fillStyle = `rgba(0, 240, 255, ${val / 255 + 0.15})`;
            this.ctx.fillRect(currentX, h - barHeight, barWidth - 1, barHeight);

            currentX += barWidth;
            if (currentX > w) break;
        }

        const calculatedDb = (peakAmp / 255) * 100;
        document.getElementById('amplitudeMetric').innerText = `${calculatedDb.toFixed(1)} dB`;
    }

    renderOrbitalPhaseConstellation(x, y, w, h) {
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        const maxRadius = Math.min(w, h) * 0.38;

        this.ctx.strokeStyle = 'rgba(57, 255, 20, 0.2)';
        this.ctx.lineWidth = 1.2;
        this.ctx.beginPath();

        // Trace vectors via a circular phase mapping sequence
        for (let i = 0; i < this.dataArray.length; i++) {
            const amplitude = this.dataArray[i] / 255;
            if (amplitude === 0) continue;

            const angle = (i / this.dataArray.length) * Math.PI * 4; // Multiple rotations to build out multi-body webs
            const currentRadius = amplitude * maxRadius;

            const targetX = centerX + Math.cos(angle) * currentRadius;
            const targetY = centerY + Math.sin(angle) * currentRadius;

            if (i === 0) {
                this.ctx.moveTo(targetX, targetY);
            } else {
                this.ctx.lineTo(targetX, targetY);
            }
        }
        this.ctx.stroke();
    }

    drawEmptyStateIndicators() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("// ENGINE OFFLINE: INITIALIZE CORES TO STREAM ACOUSTIC DATA //", this.canvas.width / 2, this.canvas.height / 2);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new AudioFFTSandbox('audioCanvas');
});