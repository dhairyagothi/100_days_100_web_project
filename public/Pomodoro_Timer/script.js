let pomodoroTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60;

let time = pomodoroTime;
let timer = null;
let isRunning = false;
let currentMode = 'pomodoro'; 

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pomodoroBtn = document.getElementById("pomodoroBtn");
const shortBreakBtn = document.getElementById("shortBreakBtn");
const longBreakBtn = document.getElementById("longBreakBtn");
const tickSound = document.getElementById("tickSound");

const colors = {
    pomodoro: { bg: '#ba4949', btnText: '#ba4949' },
    short: { bg: '#38858a', btnText: '#38858a' },
    long: { bg: '#397097', btnText: '#397097' }
};

function updateDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    let minStr = minutes < 10 ? "0" + minutes : minutes;
    let secStr = seconds < 10 ? "0" + seconds : seconds;
    timerDisplay.innerText = `${minStr}:${secStr}`;
    document.title = `${minStr}:${secStr} - Time to focus!`;
}

function changeMode(mode) {
    if (isRunning) {
        if (!confirm("The timer is still running, are you sure you want to switch?")) {
            return;
        }
        pauseTimer();
    }
    
    currentMode = mode;
    
    pomodoroBtn.classList.remove('active');
    shortBreakBtn.classList.remove('active');
    longBreakBtn.classList.remove('active');

    if (mode === 'pomodoro') {
        time = pomodoroTime;
        pomodoroBtn.classList.add('active');
    } else if (mode === 'short') {
        time = shortBreakTime;
        shortBreakBtn.classList.add('active');
    } else if (mode === 'long') {
        time = longBreakTime;
        longBreakBtn.classList.add('active');
    }

    document.documentElement.style.setProperty('--bg-color', colors[mode].bg);
    document.documentElement.style.setProperty('--btn-text', colors[mode].btnText);
    
    updateDisplay();
}

pomodoroBtn.addEventListener('click', () => changeMode('pomodoro'));
shortBreakBtn.addEventListener('click', () => changeMode('short'));
longBreakBtn.addEventListener('click', () => changeMode('long'));

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.innerText = "PAUSE";
        startBtn.classList.add('running');
        
        tickSound.play().catch(() => {});

        timer = setInterval(() => {
            if (time > 0) {
                time--;
                updateDisplay();
            } else {
                pauseTimer();
                alert("Session Complete!");
            }
        }, 1000);
    } else {
        pauseTimer();
    }
}

function pauseTimer() {
    clearInterval(timer);
    tickSound.pause();
    isRunning = false;
    startBtn.innerText = "START";
    startBtn.classList.remove('running');
}

startBtn.addEventListener('click', startTimer);

updateDisplay();
