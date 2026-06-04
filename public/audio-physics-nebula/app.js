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