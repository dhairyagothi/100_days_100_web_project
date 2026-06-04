import { DeflectionPhysicsEngine } from './engineKernel.js';

const canvas = document.getElementById('deflect-canvas');
const engine = new DeflectionPhysicsEngine(canvas);

// Cache telemetry layout nodes pointers
const toggleBtn = document.getElementById('system-toggle');
const alarmLight = document.getElementById('alarm-light');
const alarmTxt = document.getElementById('alarm-txt');
const telIntegrity = document.getElementById('tel-integrity');
const telScore = document.getElementById('tel-score');
const telPool = document.getElementById('tel-pool');
const telLatency = document.getElementById('tel-latency');
const logStream = document.getElementById('log-stream');

let isEngineRunning = false;
let dragStart = null;
let currentMouse = null;
let spawnIntervalId = null;

function globalSimulationFrame() {
    if (!isEngineRunning) return;

    const startLatencyTime = performance.now();

    // 1. Process math intersection vectors and updates
    engine.processFrameVectors();

    // 2. Render graphics field
    let activeDragLine = (dragStart && currentMouse) ? { x1: dragStart.x, y1: dragStart.y, x2: currentMouse.x, y2: currentMouse.y } : null;
    engine.renderGrid(activeDragLine);

    const endLatencyDuration = performance.now() - startLatencyTime;

    // 3. Update active telemetry labels
    telScore.textContent = `${engine.score} Packets`;
    telPool.textContent = `${engine.threats.length} / 40`;
    telIntegrity.textContent = `${engine.integrity}%`;
    telLatency.textContent = `${endFrameDurationAdjust(endLatencyDuration).toFixed(4)} ms`;

    // System Breached Condition Check
    if (engine.integrity <= 40) {
        alarmLight.classList.add('alarm-triggered');
        alarmTxt.textContent = "CRITICAL BREACH BREACH";
        alarmTxt.style.color = '#ff0055';
        telIntegrity.style.color = '#ff0055';
    }

    if (engine.integrity === 0) {
        logStream.textContent += `\n[FATAL SYSTEM LOSS] Mainframe fully compromised. Terminating interceptors execution loop.`;
        haltSystemGrid();
        return;
    }

    requestAnimationFrame(globalSimulationFrame);
}

function endFrameDurationAdjust(val) { return val < 0 ? 0 : val; }

function haltSystemGrid() {
    isEngineRunning = false;
    clearInterval(spawnIntervalId);
    toggleBtn.textContent = "Activate Defense Engine Grid";
    toggleBtn.style.background = "";
}

// Bind drag shield generation coordinates listeners
canvas.addEventListener('mousedown', (e) => {
    if (!isEngineRunning) return;
    const rect = canvas.getBoundingClientRect();
    dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    currentMouse = { ...dragStart };
});

canvas.addEventListener('mousemove', (e) => {
    if (!isEngineRunning || !dragStart) return;
    const rect = canvas.getBoundingClientRect();
    currentMouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
});

canvas.addEventListener('mouseup', () => {
    if (dragStart && currentMouse) {
        // Enforce basic spacing rules so empty micro-points aren't cached
        const lineDistance = Math.hypot(currentMouse.x - dragStart.x, currentMouse.y - dragStart.y);
        if (lineDistance > 15) {
            engine.deflectors.push({ x1: dragStart.x, y1: dragStart.y, x2: currentMouse.x, y2: currentMouse.y });
            logStream.textContent += `\n[Shield Deployed] Coordinate Vector locked. Shield Length: ${Math.round(lineDistance)}px`;
            logStream.scrollTop = logStream.scrollHeight;

            // Automatically clear shield lines after 5 seconds to force continuous active gameplay
            setTimeout(() => {
                engine.deflectors.shift();
            }, 5000);
        }
    }
    dragStart = null;
    currentMouse = null;
});

toggleBtn.addEventListener('click', () => {
    if (isEngineRunning) {
        haltSystemGrid();
        logStream.textContent += `\n[SecOps Suspended] Protective firewalls disengaged.`;
    } else {
        isEngineRunning = true;
        engine.integrity = 100;
        engine.score = 0;
        engine.threats = [];
        engine.deflectors = [];

        telIntegrity.style.color = '';
        alarmTxt.style.color = '';
        alarmTxt.textContent = "ACTIVE ENGINE CONNECTED";
        alarmLight.classList.remove('alarm-triggered');

        toggleBtn.textContent = "Halt Defensive Interceptors";
        toggleBtn.style.background = "linear-gradient(135deg, #ff0055, #ff5500)";
        logStream.textContent = "[Firewall Authorized] System core connected. Vector packet scanners streaming...";

        // Set up a steady threat packet generation cycle
        spawnIntervalId = setInterval(() => engine.spawnPacket(), 500);
        globalSimulationFrame();
    }
});