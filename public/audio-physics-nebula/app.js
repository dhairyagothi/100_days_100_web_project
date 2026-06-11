import { PhysicsNebulaEngine } from './physicsKernel.js';

const canvas = document.getElementById('physics-canvas');
const engine = new PhysicsNebulaEngine(canvas);

// Cache DOM interface elements pointers
const gravitySlider = document.getElementById('gravity-slider');
const gravityLbl = document.getElementById('gravity-lbl');
const countSlider = document.getElementById('count-slider');
const countLbl = document.getElementById('count-lbl');
const audioBtn = document.getElementById('audio-toggle-btn');
const statusLight = document.getElementById('audio-status-light');
const statusTxt = document.getElementById('audio-txt');

const telFreq = document.getElementById('tel-freq');
const telKinetic = document.getElementById('tel-kinetic');
const telLatency = document.getElementById('tel-latency');

// Web Audio API Global Instance Cache Context
let audioCtx = null;
let oscillatorNode = null;
let gainNode = null;
let audioActive = false;

function initAudioPipeline() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    oscillatorNode = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    oscillatorNode.type = 'sine'; // High-purity tone wave
    oscillatorNode.frequency.setValueAtTime(0, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime); // Initialize volume floor

    oscillatorNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillatorNode.start();
}

// Global Loop Framework Core Handler
function stepSimulationLoop() {
    const startFrameTime = performance.now();

    // 1. Crunch kinematic changes
    const totalVelocityMass = engine.processPhysicsStep();

    // 2. Clear canvas and redraw vectors
    engine.renderField();

    const endFrameDuration = performance.now() - startFrameTime;

    // Map velocity math to dynamic audio synthesizer frequencies
    let synthFrequency = 0;
    if (engine.singularity.active && totalVelocityMass > 0) {
        synthFrequency = 150 + (totalVelocityMass * 1.5); // Frequency calculation scale bounds
        if (synthFrequency > 1200) synthFrequency = 1200; // Cap pitch maximum limits
    }

    // Stream sound values to the hardware sound matrix
    if (audioActive && audioCtx) {
        oscillatorNode.frequency.setTargetAtTime(synthFrequency, audioCtx.currentTime, 0.05);
        gainNode.gain.setTargetAtTime(synthFrequency > 0 ? 0.15 : 0, audioCtx.currentTime, 0.05);
    }

    // Publish dashboard metrics telemetry labels
    telFreq.textContent = `${synthFrequency.toFixed(2)} Hz`;
    telKinetic.textContent = `${totalVelocityMass.toFixed(2)} ERG`;
    telLatency.textContent = `${endFrameDuration.toFixed(4)} ms`;

    requestAnimationFrame(stepSimulationLoop);
}

// Bind Canvas Interface Vector Pointer Hooks
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    engine.singularity.x = e.clientX - rect.left;
    engine.singularity.y = e.clientY - rect.top;
    engine.singularity.active = true;
});

canvas.addEventListener('mousemove', (e) => {
    if (engine.singularity.active) {
        const rect = canvas.getBoundingClientRect();
        engine.singularity.x = e.clientX - rect.left;
        engine.singularity.y = e.clientY - rect.top;
    }
});

canvas.addEventListener('mouseup', () => {
    engine.singularity.active = false;
    engine.singularity.x = null;
    engine.singularity.y = null;
});

// Configure slider modifiers listeners
gravitySlider.addEventListener('input', (e) => {
    const gVal = parseFloat(e.target.value) / 10;
    engine.gravityG = gVal;
    gravityLbl.textContent = `${gVal.toFixed(1)}x`;
});

countSlider.addEventListener('input', (e) => {
    const count = parseInt(e.target.value);
    countLbl.textContent = count;
    engine.populateCloud(count);
});

audioBtn.addEventListener('click', () => {
    if (!audioActive) {
        if (!audioCtx) initAudioPipeline();
        audioActive = true;
        statusLight.classList.add('light-on');
        statusTxt.textContent = "CONNECTED CORE";
        audioBtn.textContent = "Silence Audio Core Channels";
    } else {
        audioActive = false;
        if (gainNode) gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        statusLight.classList.remove('light-on');
        statusTxt.textContent = "MUTED";
        audioBtn.textContent = "Engage Web Audio Matrix";
    }
});

// Run baseline startup initialization sequence
engine.populateCloud(200);
stepSimulationLoop();   
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
        let m = this.mag();
        if (m !== 0) this.div(m);
        return this;
    }
    copy() { return new Vector2D(this.x, this.y); }
    static sub(v1, v2) { return new Vector2D(v1.x - v2.x, v1.y - v2.y); }
}

// ==========================================
// 2. POOLED KINEMATIC ENTITY
// ==========================================
class Particle {
    constructor() {
        this.position = new Vector2D();
        this.velocity = new Vector2D();
        this.acceleration = new Vector2D();
        this.mass = 1;
        this.active = false;
        this.trail = [];
        this.maxTrail = 8;
    }

    spawn(x, y, vx, vy, mass) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = vx;
        this.velocity.y = vy;
        this.acceleration.mult(0);
        this.mass = mass;
        this.active = true;
        this.trail = [];
    }

    applyForce(force) {
        let f = force.copy().div(this.mass);
        this.acceleration.add(f);
    }

    update() {
        if (!this.active) return;

        // Cache history for rendering particle vector tails
        this.trail.push(this.position.copy());
        if (this.trail.length > this.maxTrail) this.trail.shift();

        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }
}

// ==========================================
// 3. WEB AUDIO SYNTHESIZER PIPELINE
// ==========================================
class AudioSynthesizer {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.oscType = 'sawtooth';
    }

    init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // Standardized volume ceiling
        this.masterGain.connect(this.ctx.destination);
    }

    playParticleTone(speed, distance) {
        if (!this.ctx) return;

        let osc = this.ctx.createOscillator();
        let gainNode = this.ctx.createGain();

        osc.type = this.oscType;

        // Pitch assignment math: map higher velocities to distinct high-pitch frequencies
        let baseFreq = 80;
        let targetFreq = baseFreq + (speed * 18) + (4000 / (distance + 1));

        // Clip spikes safely
        targetFreq = Math.min(2500, Math.max(40, targetFreq));

        osc.frequency.setValueAtTime(targetFreq, this.ctx.currentTime);

        // Map sound volume based on spatial interaction depth
        let volume = Math.min(0.25, (1 / (distance + 10)) * 15);
        gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }
}

// ==========================================
// 4. MAIN ENGINE ENVIRONMENT
// ==========================================
class CyberneticNebula {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.synth = new AudioSynthesizer();

        this.config = {
            G: 0.5,
            drag: 0.99,
            maxParticles: 300
        };

        this.centerMass = { position: new Vector2D(0, 0), mass: 600 };
        this.pool = Array.from({ length: this.config.maxParticles }, () => new Particle());

        this.initEvents();
        this.resize();
    }

    resize() {
        // Use exact dimensions from viewport bounds bounding client
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = window.innerHeight * 0.75;

        this.centerMass.position.x = this.canvas.width / 2;
        this.centerMass.position.y = this.canvas.height / 2;
    }

    initEvents() {
        window.addEventListener('resize', () => this.resize());

        this.canvas.addEventListener('mousedown', (e) => {
            // Unblock security context if muted/uninitialized
            if (!this.synth.ctx) {
                this.synth.init();
                document.querySelectorAll('.log-line')[1].innerText = ">> AUDIO CONTEXT: OPERATIONAL";
            }
            this.spawnFromClick(e.offsetX, e.offsetY);
        });
    }

    spawnFromClick(x, y) {
        // Find single available instance inside allocated array bounds
        let p = this.pool.find(item => !item.active);
        if (p) {
            // Generate perpendicular offset matrix components for instant orbital inertia
            let dx = x - this.centerMass.position.x;
            let dy = y - this.centerMass.position.y;

            // Perpendicular vector (-y, x) normalizer pattern
            let mag = Math.sqrt(dx * dx + dy * dy) || 1;
            let vx = (-dy / mag) * 4.5 + (Math.random() - 0.5);
            let vy = (dx / mag) * 4.5 + (Math.random() - 0.5);

            let mass = Math.random() * 6 + 2;
            p.spawn(x, y, vx, vy, mass);
        }
    }

    updatePhysics() {
        this.pool.forEach(p => {
            if (!p.active) return;

            // F = G * (m1 * m2) / r^2
            let force = Vector2D.sub(this.centerMass.position, p.position);
            let distance = force.mag();

            // Enforce hard dynamic distance tracking caps to preserve engine loop calculus
            if (distance < 12) {
                p.active = false; // Entity collapse into singularity core
                return;
            }
            if (distance > 2000) {
                p.active = false;
                return;
            }

            force.normalize();
            let strength = (this.config.G * p.mass * this.centerMass.mass) / (distance * distance);
            force.mult(strength);

            p.applyForce(force);
            p.velocity.mult(this.config.drag);
            p.update();

            // Frequency synthesizer feedback execution loop triggers
            let currentSpeed = p.velocity.mag();
            if (currentSpeed > 1.2 && Math.random() < 0.04) {
                this.synth.playParticleTone(currentSpeed, distance);
            }
        });
    }

    render() {
        // High-frequency trail canvas refresh overlay blending
        this.ctx.fillStyle = 'rgba(10, 10, 18, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Core Singularity Node Render
        this.ctx.shadowBlur = 25;
        this.ctx.shadowColor = '#00ffcc';
        this.ctx.fillStyle = '#00ffcc';
        this.ctx.beginPath();
        this.ctx.arc(this.centerMass.position.x, this.centerMass.position.y, 7, 0, Math.PI * 2);
        this.ctx.fill();

        // Object Pool Array Mapping
        this.pool.forEach(p => {
            if (!p.active) return;

            // Draw vector trails mapping historic positioning frames
            this.ctx.shadowBlur = 0;
            this.ctx.strokeStyle = 'rgba(255, 0, 85, 0.25)';
            this.ctx.lineWidth = p.mass * 0.4;
            this.ctx.beginPath();
            for (let i = 0; i < p.trail.length; i++) {
                let pt = p.trail[i];
                if (i === 0) this.ctx.moveTo(pt.x, pt.y);
                else this.ctx.lineTo(pt.x, pt.y);
            }
            this.ctx.stroke();

            // Head node drawing routine
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#ff0055';
            this.ctx.fillStyle = '#ff0055';
            this.ctx.beginPath();
            this.ctx.arc(p.position.x, p.position.y, p.mass * 0.7, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.shadowBlur = 0; // Clear blur constraints
    }

    loop() {
        this.updatePhysics();
        this.render();

        // Log stream updates execution handling
        let activeCount = this.pool.filter(p => p.active).length;
        document.getElementById('particleCountLog').innerText = `>> ACTIVE_ENTITIES: ${activeCount} / ${this.config.maxParticles}`;

        requestAnimationFrame(() => this.loop());
    }
}

// ==========================================
// 5. EVENT LISTENERS & INVOCATION
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const engine = new CyberneticNebula('nebulaCanvas');
    engine.loop();

    // Hook up configuration matrix sliders
    const gravSlider = document.getElementById('gravitySlider');
    const gravVal = document.getElementById('gravityVal');
    gravSlider.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        engine.config.G = val;
        gravVal.innerText = val.toFixed(2);
    });

    const dragSlider = document.getElementById('dragSlider');
    const dragVal = document.getElementById('dragVal');
    dragSlider.addEventListener('input', (e) => {
        let val = parseFloat(e.target.value);
        engine.config.drag = val;
        dragVal.innerText = val.toFixed(2);
    });

    const waveSelect = document.getElementById('synthType');
    waveSelect.addEventListener('change', (e) => {
        engine.synth.oscType = e.target.value;
    });
});
