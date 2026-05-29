const progressValue = document.querySelector("#progress-value");
const progressLabel = document.querySelector("#progress-label");
const progressRing = document.querySelector(".progress-ring");
const particleField = document.querySelector(".particle-field");
const liveRegion = document.querySelector("#progress-live");
const cursorGlow = document.querySelector(".cursor-glow");
const cursorTrail = document.querySelector(".cursor-trail");
const card = document.querySelector(".progress-card");
const rippleLayer = document.querySelector(".ripple-layer");

const startButton = document.querySelector("#btn");
const stopButton = document.querySelector("#stopBtn");
const resetButton = document.querySelector("#resetBtn");

const modeButtons = Array.from(document.querySelectorAll(".mode-button"));
const presetButtons = Array.from(document.querySelectorAll(".preset-chip"));
const milestoneNodes = Array.from(document.querySelectorAll(".milestone"));

const lastRunEl = document.querySelector("#lastRun");
const avgPaceEl = document.querySelector("#avgPace");
const historyCountEl = document.querySelector("#historyCount");
const sparklineEl = document.querySelector("#historySparkline");

const autoLoopToggle = document.querySelector("#autoLoopToggle");

const PROGRESS_TARGET = 100;
const HISTORY_KEY = "progress_history_v2";

const MAX_TRAIL_NODES = 18;
const MAX_RIPPLES = 10;

const SPEEDS = {
    linear: 20,
    ease: 28,
    spring: 24,
};

const milestones = [
    { value: 0, label: "Warming up", color: "#67e8f9" },
    { value: 25, label: "Flow", color: "#22c55e" },
    { value: 50, label: "Surge", color: "#38bdf8" },
    { value: 75, label: "Focus", color: "#8b5cf6" },
    { value: 100, label: "Complete", color: "#fbbf24" }
];

let currentProgress = 0;
let animationFrame = null;
let autoLoopTimeout = null;

let isAnimating = false;
let isDragging = false;

let activePointerId = null;

let lastTimestamp = null;
let velocity = 0;

let runStartTime = null;

let animationMode = "linear";

let lastAnnounced = -1;
let lastMilestoneIndex = -1;

let audioContext = null;
let audioUnlocked = false;

let history = loadHistory();

let pendingPointerEvent = null;
let pointerMoveFrame = null;

let lastTrailTime = 0;

function cleanupAnimationState() {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;

    if (autoLoopTimeout) {
        clearTimeout(autoLoopTimeout);
        autoLoopTimeout = null;
    }

    lastTimestamp = null;
    velocity = 0;
    isAnimating = false;

    progressRing.classList.remove("animating");
}

function getActiveMilestone(progress) {
    for (let index = milestones.length - 1; index >= 0; index -= 1) {
        if (progress >= milestones[index].value) {
            return milestones[index];
        }
    }

    return milestones[0];
}

function updateProgressRing() {
    const roundedProgress = Math.round(currentProgress);
    const progressDegrees = currentProgress * 3.6;

    const milestone = getActiveMilestone(currentProgress);

    progressRing.style.setProperty(
        "--progress-deg",
        `${progressDegrees}deg`
    );

    progressRing.style.setProperty(
        "--ring-color",
        milestone.color
    );

    progressValue.textContent = `${roundedProgress}%`;
    progressLabel.textContent = milestone.label;

    progressRing.setAttribute(
        "aria-valuenow",
        roundedProgress
    );

    progressRing.setAttribute(
        "aria-valuetext",
        `${roundedProgress} percent`
    );

    updateMilestonesUI();
    updateLiveRegion(roundedProgress);
}

function updateMilestonesUI() {
    milestoneNodes.forEach((node) => {
        const value = Number(node.dataset.value || 0);

        node.classList.toggle(
            "is-active",
            currentProgress >= value
        );
    });
}

function updateLiveRegion(progress) {
    if (progress === lastAnnounced) {
        return;
    }

    if (progress !== 100 && progress % 5 !== 0) {
        return;
    }

    liveRegion.textContent = `Progress ${progress} percent`;

    lastAnnounced = progress;
}

function setProgress(value, options = {}) {
    currentProgress = Math.min(
        PROGRESS_TARGET,
        Math.max(0, value)
    );

    updateProgressRing();

    if (!options.silent) {
        handleMilestoneSound();
    }

    if (currentProgress >= PROGRESS_TARGET) {
        handleProgressComplete(options);
        return;
    }

    if (!options.keepState) {
        progressRing.classList.remove("completed");
        progressValue.classList.remove("completing");
        startButton.classList.remove("restart-state");
    }
}

function animationStep(timestamp) {
    if (!isAnimating) {
        return;
    }

    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }

    const deltaSeconds = Math.min(
        0.02,
        (timestamp - lastTimestamp) / 1000
    );

    lastTimestamp = timestamp;

    if (animationMode === "spring") {
        const tension = 0.012;
        const damping = 0.92;

        velocity += (
            (PROGRESS_TARGET - currentProgress) * tension
        );

        velocity *= damping;

        currentProgress += velocity * deltaSeconds * 12;
    } else {
        const baseSpeed =
            SPEEDS[animationMode] || SPEEDS.linear;

        const easeFactor =
            animationMode === "ease"
                ? Math.max(0.22, 1 - currentProgress / 100)
                : 1;

        currentProgress += (
            baseSpeed *
            deltaSeconds *
            easeFactor
        );
    }

    if (currentProgress >= PROGRESS_TARGET - 0.1) {
        currentProgress = PROGRESS_TARGET;

        updateProgressRing();

        handleProgressComplete();

        return;
    }

    updateProgressRing();

    handleMilestoneSound();

    animationFrame = requestAnimationFrame(animationStep);
}

function startProgress() {
    if (isAnimating || isDragging) {
        return;
    }

    cleanupAnimationState();

    unlockAudio();

    if (currentProgress >= PROGRESS_TARGET) {
        currentProgress = 0;

        progressRing.classList.remove("completed");
        progressValue.classList.remove("completing");

        updateProgressRing();
    }

    isAnimating = true;

    runStartTime = Date.now();

    startButton.disabled = true;
    startButton.textContent = "In Progress...";

    startButton.classList.remove("restart-state");

    progressRing.classList.add("animating");

    updateStopButtonState();

    animationFrame = requestAnimationFrame(animationStep);
}

function stopProgress(options = {}) {
    if (!isAnimating) {
        return;
    }

    cleanupAnimationState();

    startButton.disabled = false;
    startButton.textContent = "Resume";

    updateStopButtonState();

    if (!options.keepRunTime) {
        runStartTime = null;
    }
}

function resetProgress() {
    cleanupAnimationState();

    currentProgress = 0;

    lastMilestoneIndex = -1;

    runStartTime = null;

    progressRing.classList.remove(
        "animating",
        "completed"
    );

    progressValue.classList.remove("completing");

    startButton.disabled = false;
    startButton.textContent = "Start Progress";

    startButton.classList.remove("restart-state");

    updateProgressRing();

    updateStopButtonState();
}

function handleProgressComplete(options = {}) {
    if (progressRing.classList.contains("completed")) {
        return;
    }

    cleanupAnimationState();

    progressRing.classList.add("completed");

    progressValue.classList.add("completing");

    startButton.disabled = false;
    startButton.textContent = "Restart Progress";

    startButton.classList.add("restart-state");

    updateStopButtonState();

    spawnParticles();

    if (!options.silent) {
        playChime();
        recordRun();
    }

    if (
        autoLoopToggle &&
        autoLoopToggle.checked &&
        !options.manual
    ) {
        autoLoopTimeout = setTimeout(() => {
            resetProgress();
            startProgress();
        }, 900);
    }
}

function updateStopButtonState() {
    stopButton.disabled = !isAnimating;
}

function updateModeButtons(selectedMode) {
    animationMode = selectedMode;

    modeButtons.forEach((button) => {
        const isActive =
            button.dataset.mode === selectedMode;

        button.classList.toggle(
            "is-active",
            isActive
        );

        button.setAttribute(
            "aria-checked",
            String(isActive)
        );
    });
}

function setProgressFromPointer(event) {
    const rect = progressRing.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    let angle =
        Math.atan2(deltaY, deltaX) *
            (180 / Math.PI) +
        90;

    if (angle < 0) {
        angle += 360;
    }

    const value = Math.round((angle / 360) * 100);

    setProgress(value, {
        keepState: true,
        silent: true,
        manual: true,
    });
}

function handlePointerDown(event) {
    event.preventDefault();

    unlockAudio();

    stopProgress({
        keepRunTime: true,
    });

    isDragging = true;

    activePointerId = event.pointerId;

    progressRing.setPointerCapture(activePointerId);

    setProgressFromPointer(event);
}

function handlePointerMove(event) {
    if (!isDragging) {
        return;
    }

    setProgressFromPointer(event);
}

function finalizeDragState() {
    isDragging = false;

    if (
        activePointerId !== null &&
        progressRing.hasPointerCapture(activePointerId)
    ) {
        progressRing.releasePointerCapture(
            activePointerId
        );
    }

    activePointerId = null;

    startButton.disabled = false;

    if (currentProgress >= PROGRESS_TARGET) {
        startButton.textContent = "Restart Progress";
    } else if (currentProgress === 0) {
        startButton.textContent = "Start Progress";
    } else {
        startButton.textContent = "Resume";
    }

    updateStopButtonState();
}

function handlePointerUp() {
    if (!isDragging) {
        return;
    }

    finalizeDragState();
}

function handlePointerCancel() {
    if (!isDragging) {
        return;
    }

    finalizeDragState();
}

function updateCursorGlow(event) {
    if (!cursorGlow) {
        return;
    }

    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;

    cursorGlow.style.opacity = "1";
}

function spawnTrail(event) {
    if (!cursorTrail) {
        return;
    }

    const now = Date.now();

    if (now - lastTrailTime < 40) {
        return;
    }

    lastTrailTime = now;

    while (
        cursorTrail.childElementCount >= MAX_TRAIL_NODES
    ) {
        cursorTrail.firstElementChild?.remove();
    }

    const dot = document.createElement("span");

    dot.className = "trail-dot";

    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;

    cursorTrail.appendChild(dot);

    setTimeout(() => {
        dot.remove();
    }, 700);
}

function updateParallax(event) {
    if (!card) {
        return;
    }

    const rect = card.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX =
        (event.clientX - centerX) / rect.width;

    const deltaY =
        (event.clientY - centerY) / rect.height;

    const rotateX = deltaY * -8;
    const rotateY = deltaX * 10;

    card.style.setProperty(
        "--card-tilt-x",
        `${rotateX}deg`
    );

    card.style.setProperty(
        "--card-tilt-y",
        `${rotateY}deg`
    );

    progressRing.style.setProperty(
        "--ring-tilt-x",
        `${rotateX * 0.8}deg`
    );

    progressRing.style.setProperty(
        "--ring-tilt-y",
        `${rotateY * 0.8}deg`
    );
}

function resetParallax() {
    card.style.setProperty(
        "--card-tilt-x",
        "0deg"
    );

    card.style.setProperty(
        "--card-tilt-y",
        "0deg"
    );

    progressRing.style.setProperty(
        "--ring-tilt-x",
        "0deg"
    );

    progressRing.style.setProperty(
        "--ring-tilt-y",
        "0deg"
    );
}

function createRipple(event) {
    if (!rippleLayer) {
        return;
    }

    while (
        rippleLayer.childElementCount >= MAX_RIPPLES
    ) {
        rippleLayer.firstElementChild?.remove();
    }

    const ripple = document.createElement("span");

    ripple.className = "ripple";

    const rect = rippleLayer.getBoundingClientRect();

    ripple.style.left =
        `${event.clientX - rect.left}px`;

    ripple.style.top =
        `${event.clientY - rect.top}px`;

    rippleLayer.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 800);
}

function handleGlobalPointerMove(event) {
    pendingPointerEvent = event;

    if (pointerMoveFrame) {
        return;
    }

    pointerMoveFrame = requestAnimationFrame(() => {
        if (!pendingPointerEvent) {
            pointerMoveFrame = null;
            return;
        }

        updateCursorGlow(pendingPointerEvent);
        updateParallax(pendingPointerEvent);
        spawnTrail(pendingPointerEvent);

        pendingPointerEvent = null;
        pointerMoveFrame = null;
    });
}

function handleKeyControls(event) {
    const keys = [
        "ArrowRight",
        "ArrowLeft",
        "ArrowUp",
        "ArrowDown"
    ];

    if (!keys.includes(event.key)) {
        return;
    }

    event.preventDefault();

    unlockAudio();

    const delta = event.shiftKey ? 5 : 1;

    const direction =
        event.key === "ArrowLeft" ||
        event.key === "ArrowDown"
            ? -1
            : 1;

    setProgress(
        currentProgress + delta * direction,
        {
            keepState: true,
            silent: true,
        }
    );
}

function unlockAudio() {
    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    audioUnlocked = true;
}

function playTone(frequency, duration, gainValue) {
    if (!audioUnlocked || !audioContext) {
        return;
    }

    const oscillator =
        audioContext.createOscillator();

    const gainNode =
        audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gainNode.gain.value = gainValue;

    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration
    );
}

function playTick() {
    playTone(740, 0.08, 0.04);
}

function playChime() {
    playTone(520, 0.12, 0.05);

    setTimeout(() => {
        playTone(820, 0.12, 0.05);
    }, 90);
}

function handleMilestoneSound() {
    for (
        let index = milestones.length - 1;
        index >= 0;
        index -= 1
    ) {
        if (currentProgress >= milestones[index].value) {
            if (
                index > lastMilestoneIndex &&
                milestones[index].value !== 0 &&
                milestones[index].value !== 100
            ) {
                playTick();
            }

            lastMilestoneIndex = index;

            break;
        }
    }
}

function spawnParticles() {
    if (!particleField) {
        return;
    }

    particleField.innerHTML = "";

    const count = 14;

    for (let i = 0; i < count; i += 1) {
        const particle =
            document.createElement("span");

        particle.className = "particle";

        const angle = (Math.PI * 2 * i) / count;

        const distance =
            45 + Math.random() * 20;

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.style.setProperty(
            "--x",
            `${x}px`
        );

        particle.style.setProperty(
            "--y",
            `${y}px`
        );

        particleField.appendChild(particle);
    }
}

function sanitizeHistory(data) {
    if (!Array.isArray(data)) {
        return [];
    }

    return data
        .filter((item) => {
            return (
                item &&
                Number.isFinite(item.duration) &&
                item.duration > 0 &&
                Number.isFinite(item.timestamp)
            );
        })
        .slice(0, 12);
}

function loadHistory() {
    try {
        const stored =
            localStorage.getItem(HISTORY_KEY);

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return sanitizeHistory(parsed);
    } catch {
        return [];
    }
}

function recordRun() {
    if (!runStartTime) {
        return;
    }

    const duration = Date.now() - runStartTime;

    history.unshift({
        duration,
        timestamp: Date.now(),
    });

    history = sanitizeHistory(history);

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

    runStartTime = null;

    renderHistory();
}

function renderHistory() {
    if (!history.length) {
        lastRunEl.textContent = "--";
        avgPaceEl.textContent = "--";
        historyCountEl.textContent = "0 runs";

        sparklineEl.innerHTML = "";

        return;
    }

    const last = history[0];

    const avg =
        history.reduce(
            (total, item) =>
                total + item.duration,
            0
        ) / history.length;

    lastRunEl.textContent =
        formatDuration(last.duration);

    avgPaceEl.textContent =
        formatDuration(avg);

    historyCountEl.textContent =
        `${history.length} runs`;

    drawSparkline();
}

function drawSparkline() {
    if (!history.length) {
        sparklineEl.innerHTML = "";
        return;
    }

    const width = 240;
    const height = 60;

    const durations = history
        .map((item) => item.duration)
        .filter(Number.isFinite);

    if (!durations.length) {
        sparklineEl.innerHTML = "";
        return;
    }

    const min = Math.min(...durations);
    const max = Math.max(...durations);

    const range = Math.max(1, max - min);

    const points = durations.map(
        (duration, index) => {
            const x =
                history.length === 1
                    ? width / 2
                    : (
                        width /
                        (history.length - 1)
                    ) * index;

            const normalized =
                (duration - min) / range;

            const y =
                height -
                (10 + normalized * 40);

            return `${x},${y}`;
        }
    );

    sparklineEl.innerHTML = `
        <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#67e8f9" />
                <stop offset="100%" stop-color="#8b5cf6" />
            </linearGradient>
        </defs>

        <polyline
            fill="none"
            stroke="url(#sparklineGradient)"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            points="${points.join(" ")}"
        />
    `;
}

function formatDuration(duration) {
    const seconds = Math.max(
        1,
        Math.round(duration / 1000)
    );

    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);

    const remainder = seconds % 60;

    return `${minutes}m ${remainder}s`;
}

function applyMagneticHover(event) {
    const target = event.currentTarget;

    const rect = target.getBoundingClientRect();

    const offsetX =
        (
            event.clientX -
            rect.left -
            rect.width / 2
        ) / rect.width;

    const offsetY =
        (
            event.clientY -
            rect.top -
            rect.height / 2
        ) / rect.height;

    target.style.transform = `
        translate(
            ${offsetX * 10}px,
            ${offsetY * 10}px
        )
    `;
}

function resetMagneticHover(event) {
    event.currentTarget.style.transform =
        "translate(0, 0)";
}

startButton.addEventListener(
    "click",
    startProgress
);

stopButton.addEventListener(
    "click",
    () => stopProgress({
        keepRunTime: true,
    })
);

resetButton.addEventListener(
    "click",
    resetProgress
);

if (autoLoopToggle) {
    autoLoopToggle.checked = false;
}

modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        updateModeButtons(button.dataset.mode);
    });
});

presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
        unlockAudio();

        stopProgress({
            keepRunTime: true,
        });

        runStartTime = null;

        const value = Number(
            button.dataset.value || 0
        );

        setProgress(value, {
            keepState: true,
            silent: value < PROGRESS_TARGET,
            manual: true,
        });

        startButton.disabled = false;

        startButton.textContent =
            value >= PROGRESS_TARGET
                ? "Restart Progress"
                : "Start Progress";
    });
});

progressRing.addEventListener(
    "pointerdown",
    handlePointerDown
);

progressRing.addEventListener(
    "pointermove",
    handlePointerMove
);

progressRing.addEventListener(
    "pointerup",
    handlePointerUp
);

progressRing.addEventListener(
    "pointercancel",
    handlePointerCancel
);

progressRing.addEventListener(
    "lostpointercapture",
    handlePointerCancel
);

progressRing.addEventListener(
    "keydown",
    handleKeyControls
);

document.addEventListener(
    "pointermove",
    handleGlobalPointerMove,
    { passive: true }
);

document.addEventListener(
    "pointerleave",
    () => {
        if (cursorGlow) {
            cursorGlow.style.opacity = "0";
        }

        resetParallax();
    }
);

document.addEventListener(
    "click",
    createRipple,
    { passive: true }
);

[
    ...modeButtons,
    ...presetButtons,
    startButton,
    stopButton,
    resetButton
].forEach((button) => {
    button.addEventListener(
        "mousemove",
        applyMagneticHover
    );

    button.addEventListener(
        "mouseleave",
        resetMagneticHover
    );
});

updateModeButtons("linear");

updateProgressRing();

updateStopButtonState();

renderHistory();