/* ── SVG gradient defs injected once ── */
(function injectSvgDefs() {
    const svg = document.getElementById('progressRing');
    if (!svg) return;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stop-color="#7c3aed"/>
            <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>`;
    svg.prepend(defs);
})();

/* ══════════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════════ */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');

// Restore saved preference
const savedTheme = localStorage.getItem('clockTheme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('clockTheme', next);
});

/* ══════════════════════════════════════════════
   ANALOG CLOCK
══════════════════════════════════════════════ */
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function updateClock() {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    const ms = d.getMilliseconds();

    // Smooth second hand with millisecond interpolation
    const smoothSec = s + ms / 1000;

    const hRot = (h % 12) * 30 + m * 0.5;
    const mRot = m * 6 + s * 0.1;
    const sRot = smoothSec * 6;

    document.getElementById('hour').style.transform   = `rotate(${hRot}deg)`;
    document.getElementById('minute').style.transform = `rotate(${mRot}deg)`;
    document.getElementById('second').style.transform = `rotate(${sRot}deg)`;

    // Digital time display
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    document.getElementById('digitalTime').textContent = `${hh}:${mm}:${ss}`;

    // Date display
    document.getElementById('digitalDate').textContent =
        `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// Smooth 60fps for the second hand
setInterval(updateClock, 50);
updateClock();

/* ══════════════════════════════════════════════
   COUNTDOWN TIMER
══════════════════════════════════════════════ */
const RING_CIRCUMFERENCE = 2 * Math.PI * 88; // ≈ 553

let countdownInterval = null;
let countdownTime     = 0;
let totalTime         = 0;
let isPaused          = false;

const ringFill       = document.getElementById('ringFill');
const display        = document.getElementById('countdownDisplay');
const statusLabel    = document.getElementById('timerStatusLabel');
const progressWrapper = document.getElementById('progressRingWrapper');

function setRingProgress(remaining, total) {
    if (total === 0) { ringFill.style.strokeDashoffset = RING_CIRCUMFERENCE; return; }
    const pct    = remaining / total;
    const offset = RING_CIRCUMFERENCE * (1 - pct);
    ringFill.style.strokeDashoffset = offset;
}

function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function tickCountdown() {
    if (countdownTime <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        display.textContent = '00:00:00';
        setRingProgress(0, totalTime);
        progressWrapper.classList.remove('urgent');
        statusLabel.textContent = '';

        // Reset inputs
        document.getElementById('hours').value   = '';
        document.getElementById('minutes').value = '';
        document.getElementById('seconds').value = '';

        // Play sound + show toast
        const sound = document.getElementById('timerSound');
        sound.currentTime = 0;
        sound.play().catch(() => {}); // catch autoplay policy errors gracefully
        showToast("🔔 Time's Up!");
        return;
    }

    countdownTime--;
    display.textContent = formatTime(countdownTime);
    setRingProgress(countdownTime, totalTime);

    // Urgent mode: last 10 seconds
    if (countdownTime <= 10 && countdownTime > 0) {
        progressWrapper.classList.add('urgent');
    } else {
        progressWrapper.classList.remove('urgent');
    }
}

function startCountdown() {
    const h = parseInt(document.getElementById('hours').value)   || 0;
    const m = parseInt(document.getElementById('minutes').value) || 0;
    const s = parseInt(document.getElementById('seconds').value) || 0;

    const duration = h * 3600 + m * 60 + s;
    if (duration <= 0) {
        shakeInputs();
        return;
    }

    clearInterval(countdownInterval);
    countdownTime = duration;
    totalTime     = duration;
    isPaused      = false;

    display.textContent = formatTime(countdownTime);
    setRingProgress(countdownTime, totalTime);
    progressWrapper.classList.remove('urgent');
    statusLabel.textContent = 'Running';

    // Reset pause button label
    const pauseBtn = document.getElementById('pausebtn');
    pauseBtn.innerHTML = '<span class="btn-icon">⏸</span> Pause';

    // Hide any previous toast
    hideToast();

    countdownInterval = setInterval(tickCountdown, 1000);
}

function resumeCountdown() {
    if (countdownTime <= 0) return;
    statusLabel.textContent = 'Running';
    countdownInterval = setInterval(tickCountdown, 1000);
}

function pauseCountdown() {
    const pauseBtn = document.getElementById('pausebtn');

    if (!isPaused) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        isPaused = true;
        pauseBtn.innerHTML = '<span class="btn-icon">▶</span> Resume';
        statusLabel.textContent = 'Paused';
    } else {
        resumeCountdown();
        isPaused = false;
        pauseBtn.innerHTML = '<span class="btn-icon">⏸</span> Pause';
    }
}

function restartCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownTime = 0;
    totalTime     = 0;
    isPaused      = false;

    display.textContent = '00:00:00';
    setRingProgress(0, 1);
    progressWrapper.classList.remove('urgent');
    statusLabel.textContent = '';

    document.getElementById('hours').value   = '';
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';

    const pauseBtn = document.getElementById('pausebtn');
    pauseBtn.innerHTML = '<span class="btn-icon">⏸</span> Pause';

    hideToast();
}

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
/* Stopwatch */
const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const stopwatchStatus = document.getElementById('stopwatchStatusLabel');
const stopwatchStartBtn = document.getElementById('stopwatchStartBtn');
const stopwatchPauseBtn = document.getElementById('stopwatchPauseBtn');
const stopwatchResetBtn = document.getElementById('stopwatchResetBtn');

let stopwatchStartTime = 0;
let stopwatchElapsedMs = 0;
let stopwatchFrameId = null;
let stopwatchRunning = false;

function renderStopwatch(elapsedMs) {
    stopwatchDisplay.textContent = formatTime(Math.floor(elapsedMs / 1000));
}

function updateStopwatchControls() {
    const hasElapsedTime = stopwatchElapsedMs > 0;

    stopwatchStartBtn.disabled = stopwatchRunning || hasElapsedTime;
    stopwatchPauseBtn.disabled = !stopwatchRunning && !hasElapsedTime;
    stopwatchResetBtn.disabled = !stopwatchRunning && !hasElapsedTime;
}

function setStopwatchPauseLabel(isRunning) {
    stopwatchPauseBtn.innerHTML = isRunning
        ? '<span class="btn-icon">&#10074;&#10074;</span> Pause'
        : '<span class="btn-icon">&#9654;</span> Resume';
}

function stepStopwatch(timestamp) {
    if (!stopwatchRunning) return;

    renderStopwatch(stopwatchElapsedMs + (timestamp - stopwatchStartTime));
    stopwatchFrameId = requestAnimationFrame(stepStopwatch);
}

function startStopwatch() {
    if (stopwatchRunning || stopwatchElapsedMs > 0) return;

    stopwatchRunning = true;
    stopwatchStartTime = performance.now();
    stopwatchStatus.textContent = 'Running';
    setStopwatchPauseLabel(true);
    updateStopwatchControls();
    stopwatchFrameId = requestAnimationFrame(stepStopwatch);
}

function pauseStopwatch() {
    if (stopwatchRunning) {
        stopwatchElapsedMs += performance.now() - stopwatchStartTime;
        stopwatchRunning = false;
        cancelAnimationFrame(stopwatchFrameId);
        stopwatchFrameId = null;
        renderStopwatch(stopwatchElapsedMs);
        stopwatchStatus.textContent = 'Paused';
        setStopwatchPauseLabel(false);
        updateStopwatchControls();
        return;
    }

    if (stopwatchElapsedMs <= 0) return;

    stopwatchRunning = true;
    stopwatchStartTime = performance.now();
    stopwatchStatus.textContent = 'Running';
    setStopwatchPauseLabel(true);
    updateStopwatchControls();
    stopwatchFrameId = requestAnimationFrame(stepStopwatch);
}

function resetStopwatch() {
    stopwatchRunning = false;
    stopwatchElapsedMs = 0;
    cancelAnimationFrame(stopwatchFrameId);
    stopwatchFrameId = null;
    renderStopwatch(0);
    stopwatchStatus.textContent = 'Ready';
    setStopwatchPauseLabel(true);
    updateStopwatchControls();
}

stopwatchStartBtn.addEventListener('click', startStopwatch);
stopwatchPauseBtn.addEventListener('click', pauseStopwatch);
stopwatchResetBtn.addEventListener('click', resetStopwatch);
updateStopwatchControls();

let toastTimeout = null;

function showToast(msg) {
    const toast    = document.getElementById('toast');
    const toastTxt = document.getElementById('toastText');
    toastTxt.textContent = msg;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(hideToast, 5000);
}

function hideToast() {
    document.getElementById('toast').classList.remove('show');
}

// Dismiss toast on click
document.getElementById('toast').addEventListener('click', hideToast);

/* ══════════════════════════════════════════════
   INPUT SHAKE ANIMATION (empty / zero start)
══════════════════════════════════════════════ */
function shakeInputs() {
    const row = document.getElementById('timeInput');
    row.style.animation = 'none';
    // Force reflow
    void row.offsetWidth;
    row.style.animation = 'shake 0.4s ease';
}

// Inject shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
}`;
document.head.appendChild(shakeStyle);

/* ══════════════════════════════════════════════
   KEYBOARD SHORTCUT: Enter → Start
══════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.matches('input')) {
        startCountdown();
    }
});
