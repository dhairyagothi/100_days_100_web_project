/* ============================================
   AUDIO PHYSICS NEBULA — Unified Engine
   ============================================ */

// ==========================================
// 1. VECTOR MATH ENGINE
// ==========================================
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) { this.x += v.x; this.y += v.y; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; return this; }
    mult(n) { this.x *= n; this.y *= n; return this; }
    div(n) { if (n !== 0) { this.x /= n; this.y /= n; } return this; }
    magSq() { return this.x * this.x + this.y * this.y; }
    mag() { return Math.sqrt(this.magSq()); }
    normalize() {
        const m = this.mag();
        if (m > 0) this.div(m);
        return this;
    }
    copy() { return new Vector2D(this.x, this.y); }

    static sub(v1, v2) { return new Vector2D(v1.x - v2.x, v1.y - v2.y); }
    static dist(v1, v2) { return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2); }
}

// ==========================================
// 2. PARTICLE CLASS
// ==========================================
class Particle {
    constructor() {
        this.position = new Vector2D();
        this.velocity = new Vector2D();
        this.acceleration = new Vector2D();
        this.mass = 1;
        this.active = false;
        this.trail = [];
        this.maxTrail = 12;
        this.hue = 180;
        this.baseHue = 180;
        this.alpha = 1;
    }

    spawn(x, y, vx, vy, mass) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = vx;
        this.velocity.y = vy;
        this.acceleration.x = 0;
        this.acceleration.y = 0;
        this.mass = mass;
        this.active = true;
        this.trail = [];
        this.baseHue = 160 + Math.random() * 60; // cyan-blue range
        this.hue = this.baseHue;
        this.alpha = 1;
    }

    applyForce(force) {
        this.acceleration.x += force.x / this.mass;
        this.acceleration.y += force.y / this.mass;
    }

    update(drag) {
        if (!this.active) return;

        // Record trail
        this.trail.push(this.position.copy());
        if (this.trail.length > this.maxTrail) this.trail.shift();

        // Integrate motion
        this.velocity.add(this.acceleration);
        this.velocity.mult(drag);
        this.position.add(this.velocity);
        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }
}

// ==========================================
// 3. AUDIO MANAGER
// ==========================================
class AudioManager {
    constructor() {
        this.ctx = null;
        this.analyser = null;
        this.freqData = null;
        this.timeData = null;

        // Microphone
        this.micStream = null;
        this.micSource = null;
        this.micConnected = false;

        // File playback
        this.fileBuffer = null;
        this.fileSource = null;
        this.fileLoaded = false;
        this.isPlaying = false;
        this.isPaused = false;
        this.playbackOffset = 0;
        this.playbackStartTime = 0;

        // Synth
        this.masterGain = null;
        this.oscType = 'sawtooth';

        // Callbacks for UI updates
        this.onPlaybackEnd = null;
    }

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 2048;
        this.analyser.smoothingTimeConstant = 0.8;

        this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
        this.timeData = new Uint8Array(this.analyser.frequencyBinCount);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
    }

    async enableMic() {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.micStream = stream;
        this.micSource = this.ctx.createMediaStreamSource(stream);
        this.micSource.connect(this.analyser);
        this.micConnected = true;
    }

    disableMic() {
        if (this.micStream) {
            this.micStream.getTracks().forEach(t => t.stop());
        }
        if (this.micSource) {
            try { this.micSource.disconnect(); } catch (e) { /* ignore */ }
        }
        this.micStream = null;
        this.micSource = null;
        this.micConnected = false;
    }

    loadFile(file) {
        return new Promise((resolve, reject) => {
            if (!this.ctx) this.init();

            const reader = new FileReader();
            reader.onload = (e) => {
                this.ctx.decodeAudioData(e.target.result, (buffer) => {
                    this.fileBuffer = buffer;
                    this.fileLoaded = true;
                    this.playbackOffset = 0;
                    resolve(buffer);
                }, reject);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    play() {
        if (!this.fileBuffer || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();

        // Stop any current source
        if (this.fileSource) {
            try { this.fileSource.stop(); } catch (e) { /* ignore */ }
        }

        this.fileSource = this.ctx.createBufferSource();
        this.fileSource.buffer = this.fileBuffer;
        this.fileSource.connect(this.analyser);
        this.fileSource.connect(this.masterGain);

        this.fileSource.start(0, this.playbackOffset);
        this.playbackStartTime = this.ctx.currentTime;
        this.isPlaying = true;
        this.isPaused = false;

        this.fileSource.onended = () => {
            if (this.isPlaying && !this.isPaused) {
                this.isPlaying = false;
                this.playbackOffset = 0;
                if (this.onPlaybackEnd) this.onPlaybackEnd();
            }
        };
    }

    pause() {
        if (!this.isPlaying || !this.fileSource) return;
        this.playbackOffset += this.ctx.currentTime - this.playbackStartTime;
        try { this.fileSource.stop(); } catch (e) { /* ignore */ }
        this.isPlaying = false;
        this.isPaused = true;
    }

    stop() {
        if (this.fileSource) {
            try { this.fileSource.stop(); } catch (e) { /* ignore */ }
        }
        this.isPlaying = false;
        this.isPaused = false;
        this.playbackOffset = 0;
    }

    playParticleTone(speed, distance) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = this.oscType;

        let freq = 80 + (speed * 18) + (4000 / (distance + 1));
        freq = Math.min(2500, Math.max(40, freq));
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        let volume = Math.min(0.25, (1 / (distance + 10)) * 15);
        gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    getFrequencyData() {
        if (!this.analyser) return null;
        this.analyser.getByteFrequencyData(this.freqData);
        return this.freqData;
    }

    getTimeDomainData() {
        if (!this.analyser) return null;
        this.analyser.getByteTimeDomainData(this.timeData);
        return this.timeData;
    }

    getAverageFrequency() {
        const data = this.getFrequencyData();
        if (!data) return 0;
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        return sum / data.length;
    }

    getBassEnergy() {
        const data = this.getFrequencyData();
        if (!data) return 0;
        const end = Math.floor(data.length / 6);
        let sum = 0;
        for (let i = 0; i < end; i++) sum += data[i];
        return sum / end;
    }

    getMidEnergy() {
        const data = this.getFrequencyData();
        if (!data) return 0;
        const start = Math.floor(data.length / 6);
        const end = Math.floor(data.length / 2);
        let sum = 0;
        for (let i = start; i < end; i++) sum += data[i];
        return sum / (end - start);
    }

    getTrebleEnergy() {
        const data = this.getFrequencyData();
        if (!data) return 0;
        const start = Math.floor(data.length * 2 / 3);
        let sum = 0;
        for (let i = start; i < data.length; i++) sum += data[i];
        return sum / (data.length - start);
    }

    hasActiveSource() {
        return this.micConnected || this.isPlaying;
    }
}

// ==========================================
// 4. SIMULATION ENGINE
// ==========================================
class SimulationEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.audio = new AudioManager();

        this.state = 'IDLE'; // IDLE | RUNNING | PAUSED

        this.config = {
            G: 0.5,
            drag: 0.99,
            maxParticles: 300,
            particleCount: 200
        };

        this.centerMass = {
            position: new Vector2D(),
            mass: 600
        };

        this.pool = [];
        for (let i = 0; i < this.config.maxParticles; i++) {
            this.pool.push(new Particle());
        }

        this.mouse = { x: 0, y: 0, active: false, pressed: false };
        this.animFrameId = null;

        // FPS tracking
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsTime = performance.now();
        this.lastFrameTime = performance.now();
        this.lastKineticEnergy = 0;

        // Ambient animation
        this.ambientAngle = 0;

        this.resize();
        this.spawnParticles(this.config.particleCount);
        this.initMouseEvents();

        window.addEventListener('resize', () => this.resize());

        // Start the perpetual render loop
        this.loop();
    }

    resize() {
        const wrapper = document.getElementById('canvasWrapper');
        if (!wrapper) return;

        const rect = wrapper.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = (rect.width * 9 / 16) * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = (rect.width * 9 / 16) + 'px';

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        this.displayWidth = rect.width;
        this.displayHeight = rect.width * 9 / 16;

        this.centerMass.position.x = this.displayWidth / 2;
        this.centerMass.position.y = this.displayHeight / 2;
    }

    initMouseEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.active = true;
            this.mouse.pressed = true;

            // Init audio on first interaction
            if (!this.audio.ctx) this.audio.init();

            // Spawn a particle at click
            this.spawnAtPoint(this.mouse.x, this.mouse.y);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            if (this.mouse.pressed) {
                this.mouse.active = true;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouse.active = false;
            this.mouse.pressed = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.active = false;
            this.mouse.pressed = false;
        });

        // Touch support
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
            this.mouse.active = true;
            this.mouse.pressed = true;
            if (!this.audio.ctx) this.audio.init();
            this.spawnAtPoint(this.mouse.x, this.mouse.y);
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
        }, { passive: false });

        this.canvas.addEventListener('touchend', () => {
            this.mouse.active = false;
            this.mouse.pressed = false;
        });
    }

    spawnParticles(count) {
        // Deactivate all
        for (let i = 0; i < this.pool.length; i++) {
            this.pool[i].active = false;
            this.pool[i].trail = [];
        }

        const cx = this.centerMass.position.x;
        const cy = this.centerMass.position.y;

        for (let i = 0; i < count && i < this.config.maxParticles; i++) {
            const p = this.pool[i];
            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 250;

            const px = cx + Math.cos(angle) * dist;
            const py = cy + Math.sin(angle) * dist;

            // Orbital velocity (perpendicular to radius)
            const speed = 2 + Math.random() * 3;
            const vx = -Math.sin(angle) * speed + (Math.random() - 0.5) * 0.5;
            const vy = Math.cos(angle) * speed + (Math.random() - 0.5) * 0.5;

            const mass = 2 + Math.random() * 6;
            p.spawn(px, py, vx, vy, mass);
        }
    }

    spawnAtPoint(x, y) {
        const p = this.pool.find(item => !item.active);
        if (!p) return;

        const dx = x - this.centerMass.position.x;
        const dy = y - this.centerMass.position.y;
        const mag = Math.sqrt(dx * dx + dy * dy) || 1;

        const vx = (-dy / mag) * 4.5 + (Math.random() - 0.5);
        const vy = (dx / mag) * 4.5 + (Math.random() - 0.5);
        const mass = 2 + Math.random() * 6;

        p.spawn(x, y, vx, vy, mass);
    }

    resetField() {
        this.spawnParticles(this.config.particleCount);
    }

    // --- State Machine ---
    start() {
        this.state = 'RUNNING';
        this.updateSimButtons();
    }

    pause() {
        this.state = 'PAUSED';
        this.updateSimButtons();
    }

    resume() {
        this.state = 'RUNNING';
        this.updateSimButtons();
    }

    reset() {
        this.state = 'IDLE';
        this.resetField();
        this.lastKineticEnergy = 0;
        this.updateSimButtons();
    }

    updateSimButtons() {
        const btnStart = document.getElementById('btnSimStart');
        const btnPause = document.getElementById('btnSimPause');
        const btnResume = document.getElementById('btnSimResume');
        const btnReset = document.getElementById('btnSimReset');
        const badge = document.getElementById('simStateBadge');
        const stateText = document.getElementById('simStateText');

        btnStart.disabled = this.state === 'RUNNING' || this.state === 'PAUSED';
        btnPause.disabled = this.state !== 'RUNNING';
        btnResume.disabled = this.state !== 'PAUSED';
        btnReset.disabled = false;

        badge.classList.remove('state-running', 'state-paused');
        if (this.state === 'RUNNING') badge.classList.add('state-running');
        if (this.state === 'PAUSED') badge.classList.add('state-paused');

        stateText.textContent = this.state;
    }

    // --- Physics ---
    updatePhysics() {
        let totalKE = 0;
        const cx = this.centerMass.position.x;
        const cy = this.centerMass.position.y;
        const cm = this.centerMass.mass;

        // Get audio energy data for reactive effects
        let bassEnergy = 0, midEnergy = 0, trebleEnergy = 0;
        if (this.audio.hasActiveSource()) {
            bassEnergy = this.audio.getBassEnergy() / 255;
            midEnergy = this.audio.getMidEnergy() / 255;
            trebleEnergy = this.audio.getTrebleEnergy() / 255;
        }

        for (let i = 0; i < this.pool.length; i++) {
            const p = this.pool[i];
            if (!p.active) continue;

            // Gravitational force toward center mass
            const dx = cx - p.position.x;
            const dy = cy - p.position.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            // Boundary checks
            if (dist < 5) { p.active = false; continue; }
            if (dist > 2000) { p.active = false; continue; }

            // Clamp minimum distance
            const safeDist = Math.max(dist, 15);
            const nx = dx / dist;
            const ny = dy / dist;

            // F = G * m1 * m2 / r^2
            const strength = (this.config.G * p.mass * cm) / (safeDist * safeDist);
            p.acceleration.x += nx * strength / p.mass;
            p.acceleration.y += ny * strength / p.mass;

            // Audio-reactive forces
            if (bassEnergy > 0.1) {
                // Bass creates outward radial push
                const pushStrength = bassEnergy * 0.8;
                p.acceleration.x -= nx * pushStrength;
                p.acceleration.y -= ny * pushStrength;
            }

            if (trebleEnergy > 0.05) {
                // Treble shifts hue warmer
                p.hue = p.baseHue - trebleEnergy * 80;
                if (p.hue < 0) p.hue += 360;
            } else {
                p.hue = p.baseHue;
            }

            if (midEnergy > 0.1) {
                // Mid modulates trail length
                p.maxTrail = Math.floor(8 + midEnergy * 16);
            } else {
                p.maxTrail = 12;
            }

            // Mouse singularity attractor
            if (this.mouse.active) {
                const mdx = this.mouse.x - p.position.x;
                const mdy = this.mouse.y - p.position.y;
                const mDist = Math.sqrt(mdx * mdx + mdy * mdy) + 25;
                const mForce = (this.config.G * 40) / (mDist * mDist);
                p.acceleration.x += (mdx / mDist) * mForce;
                p.acceleration.y += (mdy / mDist) * mForce;
            }

            // Update particle
            p.update(this.config.drag);

            // Kinetic energy
            const speed = p.velocity.mag();
            totalKE += 0.5 * p.mass * speed * speed;

            // Particle tones
            if (speed > 1.5 && Math.random() < 0.03) {
                this.audio.playParticleTone(speed, dist);
            }
        }

        this.lastKineticEnergy = totalKE;
        return totalKE;
    }

    // --- Idle Ambient ---
    renderIdleAmbient() {
        this.ambientAngle += 0.002;
        const cx = this.centerMass.position.x;
        const cy = this.centerMass.position.y;

        for (let i = 0; i < this.pool.length; i++) {
            const p = this.pool[i];
            if (!p.active) continue;

            // Gentle orbital nudge
            const dx = p.position.x - cx;
            const dy = p.position.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const speed = 0.3;

            p.velocity.x += (-dy / dist) * speed * 0.02;
            p.velocity.y += (dx / dist) * speed * 0.02;

            // Very light drag to prevent drift
            p.velocity.mult(0.998);
            p.position.x += p.velocity.x * 0.5;
            p.position.y += p.velocity.y * 0.5;

            // Trail for idle
            p.trail.push(p.position.copy());
            if (p.trail.length > 6) p.trail.shift();
        }
    }

    // --- Rendering ---
    render() {
        const w = this.displayWidth;
        const h = this.displayHeight;
        const ctx = this.ctx;

        // Trail fade overlay
        ctx.fillStyle = 'rgba(6, 8, 15, 0.18)';
        ctx.fillRect(0, 0, w, h);

        // Nebula glow at center
        const grad = ctx.createRadialGradient(
            this.centerMass.position.x, this.centerMass.position.y, 0,
            this.centerMass.position.x, this.centerMass.position.y, 200
        );
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.04)');
        grad.addColorStop(0.5, 'rgba(0, 180, 255, 0.015)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Center mass node
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f0ff';
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath();
        ctx.arc(this.centerMass.position.x, this.centerMass.position.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Outer ring
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.centerMass.position.x, this.centerMass.position.y, 20, 0, Math.PI * 2);
        ctx.stroke();

        // Mouse singularity
        if (this.mouse.active) {
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#ff0055';
            ctx.fillStyle = '#ff0055';
            ctx.beginPath();
            ctx.arc(this.mouse.x, this.mouse.y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Force lines to center
            ctx.shadowBlur = 0;
            ctx.strokeStyle = 'rgba(255, 0, 85, 0.15)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 8]);
            ctx.beginPath();
            ctx.moveTo(this.mouse.x, this.mouse.y);
            ctx.lineTo(this.centerMass.position.x, this.centerMass.position.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Audio-reactive mid energy for particle size pulse
        let midPulse = 1;
        if (this.audio.hasActiveSource()) {
            midPulse = 1 + (this.audio.getMidEnergy() / 255) * 0.8;
        }

        // Draw particles
        for (let i = 0; i < this.pool.length; i++) {
            const p = this.pool[i];
            if (!p.active) continue;

            // Trail
            if (p.trail.length > 1) {
                ctx.shadowBlur = 0;
                ctx.lineWidth = p.mass * 0.3;
                ctx.beginPath();
                for (let j = 0; j < p.trail.length; j++) {
                    const alpha = (j / p.trail.length) * 0.4;
                    ctx.strokeStyle = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
                    const pt = p.trail[j];
                    if (j === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
                ctx.stroke();
            }

            // Particle head
            const radius = p.mass * 0.5 * midPulse;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsl(${p.hue}, 100%, 65%)`;
            ctx.fillStyle = `hsl(${p.hue}, 100%, 65%)`;
            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.shadowBlur = 0;

        // Waveform overlay
        if (this.audio.hasActiveSource()) {
            this.renderWaveform(ctx, w, h);
            this.renderFrequencyBars(ctx, w, h);
        }
    }

    renderWaveform(ctx, w, h) {
        const timeData = this.audio.getTimeDomainData();
        if (!timeData) return;

        const sliceWidth = w / timeData.length;
        const yBase = h * 0.75;

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        for (let i = 0; i < timeData.length; i++) {
            const v = timeData[i] / 128.0;
            const y = yBase + (v - 1) * 40;
            if (i === 0) ctx.moveTo(0, y);
            else ctx.lineTo(i * sliceWidth, y);
        }

        ctx.stroke();
    }

    renderFrequencyBars(ctx, w, h) {
        const freqData = this.audio.getFrequencyData();
        if (!freqData) return;

        const barCount = 64;
        const step = Math.floor(freqData.length / barCount);
        const barWidth = w / barCount;

        for (let i = 0; i < barCount; i++) {
            const value = freqData[i * step] / 255;
            const barHeight = value * 30;

            const hue = 180 + (i / barCount) * 120;
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.15 + value * 0.2})`;
            ctx.fillRect(
                i * barWidth,
                h - barHeight,
                barWidth - 1,
                barHeight
            );
        }
    }

    // --- Telemetry ---
    updateTelemetry(frameTime) {
        const telFreq = document.getElementById('telFreq');
        const telKinetic = document.getElementById('telKinetic');
        const telLatency = document.getElementById('telLatency');
        const telParticles = document.getElementById('telParticles');
        const telFPS = document.getElementById('telFPS');
        const fpsCounter = document.getElementById('fpsCounter');

        // Frequency
        const avgFreq = this.audio.hasActiveSource()
            ? this.audio.getAverageFrequency() * 10
            : 0;
        telFreq.textContent = `${avgFreq.toFixed(2)} Hz`;

        // Kinetic energy
        telKinetic.textContent = `${this.lastKineticEnergy.toFixed(2)} ERG`;

        // Latency
        telLatency.textContent = `${frameTime.toFixed(3)} ms`;

        // Particle count
        let activeCount = 0;
        for (let i = 0; i < this.pool.length; i++) {
            if (this.pool[i].active) activeCount++;
        }
        telParticles.textContent = `${activeCount} / ${this.config.maxParticles}`;

        // FPS
        telFPS.textContent = `${this.fps}`;
        fpsCounter.textContent = `${this.fps} FPS`;
    }

    // --- Main Loop ---
    loop() {
        const now = performance.now();
        const frameStart = now;

        // FPS calc
        this.frameCount++;
        if (now - this.lastFpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = now;
        }

        // Update based on state
        if (this.state === 'RUNNING') {
            this.updatePhysics();
        } else if (this.state === 'IDLE') {
            this.renderIdleAmbient();
        }
        // PAUSED: no physics update, just render

        // Always render
        this.render();

        const frameTime = performance.now() - frameStart;
        this.updateTelemetry(frameTime);

        this.animFrameId = requestAnimationFrame(() => this.loop());
    }
}

// ==========================================
// 5. DOM CONTROLLER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const engine = new SimulationEngine('nebulaCanvas');

    // --- Simulation Buttons ---
    document.getElementById('btnSimStart').addEventListener('click', () => engine.start());
    document.getElementById('btnSimPause').addEventListener('click', () => engine.pause());
    document.getElementById('btnSimResume').addEventListener('click', () => engine.resume());
    document.getElementById('btnSimReset').addEventListener('click', () => engine.reset());

    // --- Helper: Update LED ---
    function setLed(ledId, className) {
        const led = document.getElementById(ledId);
        led.className = 'led ' + className;
    }

    // --- Microphone Toggle ---
    document.getElementById('btnMicToggle').addEventListener('click', async () => {
        const btn = document.getElementById('btnMicToggle');
        if (!engine.audio.ctx) engine.audio.init();

        if (engine.audio.micConnected) {
            engine.audio.disableMic();
            setLed('ledMic', 'led-off');
            document.getElementById('statusMicText').textContent = 'Mic: Disconnected';
            btn.classList.remove('mic-active');
            btn.innerHTML = '<span class="btn-icon">🎤</span> Enable Microphone';
        } else {
            try {
                await engine.audio.enableMic();
                setLed('ledMic', 'led-green');
                document.getElementById('statusMicText').textContent = 'Mic: Connected';
                btn.classList.add('mic-active');
                btn.innerHTML = '<span class="btn-icon">🎤</span> Disable Microphone';
            } catch (e) {
                setLed('ledMic', 'led-red');
                document.getElementById('statusMicText').textContent = 'Mic: Access Denied';
            }
        }
    });

    // --- File Upload ---
    document.getElementById('audioFileInput').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!engine.audio.ctx) engine.audio.init();

        document.getElementById('audioFileName').textContent = 'Loading...';

        try {
            await engine.audio.loadFile(file);
            document.getElementById('audioFileName').textContent = file.name;
            setLed('ledFile', 'led-cyan');
            document.getElementById('statusFileText').textContent = 'File: Loaded';
            document.getElementById('btnAudioPlay').disabled = false;
        } catch (err) {
            document.getElementById('audioFileName').textContent = 'Error loading file';
            setLed('ledFile', 'led-red');
            document.getElementById('statusFileText').textContent = 'File: Error';
        }
    });

    // --- Helper: Update Playback UI ---
    function updatePlaybackUI(state) {
        const btnPlay = document.getElementById('btnAudioPlay');
        const btnPause = document.getElementById('btnAudioPause');
        const btnStop = document.getElementById('btnAudioStop');

        if (state === 'playing') {
            setLed('ledPlayback', 'led-green');
            document.getElementById('statusPlaybackText').textContent = 'Playback: Playing';
            btnPlay.disabled = true;
            btnPause.disabled = false;
            btnStop.disabled = false;
        } else if (state === 'paused') {
            setLed('ledPlayback', 'led-amber');
            document.getElementById('statusPlaybackText').textContent = 'Playback: Paused';
            btnPlay.disabled = false;
            btnPause.disabled = true;
            btnStop.disabled = false;
        } else {
            setLed('ledPlayback', 'led-off');
            document.getElementById('statusPlaybackText').textContent = 'Playback: Stopped';
            btnPlay.disabled = !engine.audio.fileLoaded;
            btnPause.disabled = true;
            btnStop.disabled = true;
        }
    }

    // --- Playback Buttons ---
    document.getElementById('btnAudioPlay').addEventListener('click', () => {
        engine.audio.play();
        updatePlaybackUI('playing');
    });

    document.getElementById('btnAudioPause').addEventListener('click', () => {
        engine.audio.pause();
        updatePlaybackUI('paused');
    });

    document.getElementById('btnAudioStop').addEventListener('click', () => {
        engine.audio.stop();
        updatePlaybackUI('stopped');
    });

    // Handle natural playback end
    engine.audio.onPlaybackEnd = () => {
        updatePlaybackUI('stopped');
    };

    // --- Physics Sliders ---
    document.getElementById('gravitySlider').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        engine.config.G = val;
        document.getElementById('gravityVal').textContent = val.toFixed(2);
    });

    document.getElementById('dragSlider').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        engine.config.drag = val;
        document.getElementById('dragVal').textContent = val.toFixed(3);
    });

    document.getElementById('particleSlider').addEventListener('input', (e) => {
        const count = parseInt(e.target.value);
        engine.config.particleCount = count;
        document.getElementById('particleVal').textContent = count;
        engine.resetField();
    });

    // --- Waveform Select ---
    document.getElementById('synthType').addEventListener('change', (e) => {
        engine.audio.oscType = e.target.value;
    });
});
