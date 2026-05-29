// ── Timer State ──
let workTime  = 25 * 60;
let breakTime = 5  * 60;

let totalTime = workTime;
let time      = workTime;

let timer     = null;
let isRunning = false;

// ── DOM References ──
const timerDisplay   = document.getElementById("timer");
const progressCircle = document.getElementById("progressCircle");
const workBtn        = document.getElementById("workBtn");
const breakBtn       = document.getElementById("breakBtn");
const tickSound      = document.getElementById("tickSound");
const taskInput      = document.getElementById("taskInput");
const currentTask    = document.getElementById("currentTask");
const taskCheck      = document.getElementById("taskCheck");
const quoteBanner    = document.querySelector(".quote-banner");
const taskDisplay    = document.querySelector(".task-display");
const quoteText      = document.getElementById("quoteText");
const startBtn       = document.getElementById("start");
const pauseBtn       = document.getElementById("pause");
const resetBtn       = document.getElementById("reset");

// ── Fix: Pause disabled on load ──
pauseBtn.disabled = true;

// ── Quotes ──
const quotes = [
    "It's the job that's never started that takes longest to finish. — J.R.R. Tolkien",
    "Someday is not a day of the week. — Janet Dailey",
    "A year from now you may wish you had started today. — Karen Lamb",
    "You may delay, but time will not. — Benjamin Franklin",
    "You cannot escape the responsibility of tomorrow by evading it today. — Abraham Lincoln",
    "Whatever you want to do, do it now. There are only so many tomorrows. — Michael Landon",
    "Small progress is still progress",
    "You don't have to see the whole staircase, just take the first step. — Martin Luther King Jr.",
    "Discipline creates freedom",
    "Stay consistent, not perfect"
];

function changeQuote() {
    if (totalTime === breakTime) return;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.innerText = randomQuote;
}

setInterval(changeQuote, 5000);
changeQuote();
// ── Display Update ──
function updateDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerDisplay.innerText = `${minutes}:${seconds}`;

    let progress = 628 - (628 * time) / totalTime;
    progressCircle.style.strokeDashoffset = progress;
}

// ── Start ──
function startTimer() {
    if (isRunning) return;

    isRunning = true;

    // Fix: toggle button states
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    tickSound.play().catch(() => {});

    timer = setInterval(() => {
        if (time > 0) {
            time--;
            updateDisplay();
        } else {
            clearInterval(timer);
            tickSound.pause();
            isRunning = false;

            // Fix: restore button states on session complete
            startBtn.disabled = false;
            pauseBtn.disabled = true;

            alert("Session Complete!");
            switchMode();
            startTimer();
        }
    }, 1000);
}

// ── Pause ──
function pauseTimer() {
    clearInterval(timer);
    tickSound.pause();
    isRunning = false;

    // Fix: toggle button states
    pauseBtn.disabled = true;
    startBtn.disabled = false;
}

// ── Reset ──
function resetTimer() {
    clearInterval(timer);
    tickSound.pause();
    isRunning = false;
    time = totalTime;

    // Fix: restore button states on reset
    pauseBtn.disabled = true;
    startBtn.disabled = false;

    updateDisplay();
}

// ── Mode Switch ──
function switchMode() {
    if (totalTime === workTime) {
        totalTime = breakTime;
        time      = breakTime;
        breakBtn.classList.add("active");
        workBtn.classList.remove("active");
        taskDisplay.style.display  = "none";
        quoteBanner.style.display  = "none";
    } else {
        totalTime = workTime;
        time      = workTime;
        workBtn.classList.add("active");
        breakBtn.classList.remove("active");
        taskDisplay.style.display = "flex";
        quoteBanner.style.display = "block";
    }
    updateDisplay();
}

// ── Task Input ──
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        if (taskInput.value.trim() !== "") {
            currentTask.innerText = taskInput.value;
            taskCheck.checked = false;
            currentTask.style.textDecoration = "none";
            currentTask.style.opacity = "1";
            taskInput.value = "";
        }
    }
});

// ── Task Checkbox ──
taskCheck.addEventListener("change", () => {
    if (taskCheck.checked) {
        currentTask.style.textDecoration = "line-through";
        currentTask.style.opacity = "0.6";
        setTimeout(() => {
            currentTask.innerText = "No current task";
            currentTask.style.textDecoration = "none";
            currentTask.style.opacity = "1";
            taskCheck.checked = false;
        }, 1500);
    } else {
        currentTask.style.textDecoration = "none";
        currentTask.style.opacity = "1";
    }
});

// ── Button Events ──
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// ── Work Mode ──
workBtn.addEventListener("click", () => {
    totalTime = workTime;
    time      = workTime;
    workBtn.classList.add("active");
    breakBtn.classList.remove("active");
    taskDisplay.style.display = "flex";
    quoteBanner.style.display = "block";
    resetTimer();
});

// ── Break Mode ──
breakBtn.addEventListener("click", () => {
    totalTime = breakTime;
    time      = breakTime;
    breakBtn.classList.add("active");
    workBtn.classList.remove("active");
    taskDisplay.style.display = "none";
    quoteBanner.style.display = "none";
    resetTimer();
});

// ── Theme Toggle ──
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeBtn.innerText = document.body.classList.contains("light") ? "☀️" : "🌙";
});

// ── Focus Mode ──
const focusBtn = document.getElementById("focusModeBtn");

focusBtn.addEventListener("click", () => {
    document.body.classList.toggle("focus-mode");
    focusBtn.innerText = document.body.classList.contains("focus-mode")
        ? "Exit Focus Mode"
        : "Focus Mode";
});
document.getElementById("setTimeBtn").addEventListener("click", () => {
    const val = parseInt(document.getElementById("customInput").value);

    if (!val || val < 1 || val > 120) {
        alert("Enter a valid time between 1 and 120 minutes.");
        return;
    }

    workTime  = val * 60;
    totalTime = workTime;
    time      = workTime;

    // reset active mode to Work
    workBtn.classList.add("active");
    breakBtn.classList.remove("active");
    taskDisplay.style.display = "flex";
    quoteBanner.style.display = "block";

    resetTimer();
    document.getElementById("customInput").value = "";
});
// ── Init ──
updateDisplay();