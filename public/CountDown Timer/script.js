// Variable Declarations to monitor state engines
let countdownInterval = null;
let timeRemaining = 0; // Tracks total remaining seconds
let isPaused = true;

// DOM Target Element Fetch Configurations
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const setTimeBtn = document.getElementById('set-time-btn');

const inputHours = document.getElementById('input-hours');
const inputMinutes = document.getElementById('input-minutes');
const inputSeconds = document.getElementById('input-seconds');

const themeToggle = document.getElementById('theme-toggle');
const alarmSound = document.getElementById('alarm-sound');

/* ==========================================================================
   1. Theme Management System (Light/Dark Engine)
   ========================================================================== */
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

/* ==========================================================================
   2. Calculations Engine & State Updates
   ========================================================================== */
function updateDisplay() {
  const d = Math.floor(timeRemaining / (3600 * 24));
  const h = Math.floor((timeRemaining % (3600 * 24)) / 3600);
  const m = Math.floor((timeRemaining % 3600) / 60);
  const s = timeRemaining % 60;

  daysEl.textContent = String(d).padStart(2, '0');
  hoursEl.textContent = String(h).padStart(2, '0');
  minutesEl.textContent = String(m).padStart(2, '0');
  secondsEl.textContent = String(s).padStart(2, '0');
}

// Processing User Custom Input Fields setup
setTimeBtn.addEventListener('click', () => {
  const hrs = parseInt(inputHours.value) || 0;
  const mins = parseInt(inputMinutes.value) || 0;
  const secs = parseInt(inputSeconds.value) || 0;

  // Convert everything into a clean singular unit pool of seconds
  timeRemaining = (hrs * 3600) + (mins * 60) + secs;

  if (timeRemaining <= 0) {
    alert("Please enter a valid time duration duration to track!");
    return;
  }

  updateDisplay();

  // Enable running mechanism button profiles
  startBtn.disabled = false;
  pauseBtn.disabled = true;

  // Clear any residual background cycles
  clearInterval(countdownInterval);
  isPaused = true;
});

/* ==========================================================================
   3. Operational Trigger Engine Framework (Start, Pause, Reset)
   ========================================================================== */
startBtn.addEventListener('click', () => {
  if (!isPaused) return;

  isPaused = false;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  countdownInterval = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      alarmSound.play(); // Trigger ending alert
      isPaused = true;
      startBtn.disabled = true;
      pauseBtn.disabled = true;
      alert("Time is up!");
      return;
    }

    timeRemaining--;
    updateDisplay();
  }, 1000);
});

pauseBtn.addEventListener('click', () => {
  if (isPaused) return;

  clearInterval(countdownInterval);
  isPaused = true;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

resetBtn.addEventListener('click', () => {
  clearInterval(countdownInterval);
  timeRemaining = 0;
  isPaused = true;

  updateDisplay();

  // Empty user interface field blocks
  inputHours.value = '';
  inputMinutes.value = '';
  inputSeconds.value = '';

  startBtn.disabled = true;
  pauseBtn.disabled = true;
  alarmSound.pause();
  alarmSound.currentTime = 0;
document.addEventListener("DOMContentLoaded", () => {

  let countdown;

  let totalTime = 0;

  let remainingTime = 0;

  const minutesEl =
    document.getElementById("minutes");

  const secondsEl =
    document.getElementById("seconds");

  const inputHours =
    document.getElementById("inputHours");

  const inputMinutes =
    document.getElementById("inputMinutes");

  const inputSeconds =
    document.getElementById("inputSeconds");

  const progressCircle =
    document.querySelector(".progress-circle");

  const startBtn =
    document.getElementById("start");

  const pauseBtn =
    document.getElementById("pause");

  const resetBtn =
    document.getElementById("reset");

  const themeToggle =
    document.getElementById("themeToggle");

  const alarmSound =
    document.getElementById("alarmSound");

  const circleLength = 691;

  // BROWSER NOTIFICATION

  function showTimerNotification() {

    if (!("Notification" in window)) {
      return;
    }

    if (Notification.permission === "granted") {

      new Notification("⏰ Timer Complete", {
        body: "Your focus session has ended. Take a break!"
      });

    }

  }

  // THEME

  const savedTheme =
    localStorage.getItem("theme");

  if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeToggle.textContent = "☀";
  }

  themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

      localStorage.setItem("theme", "dark");

      themeToggle.textContent = "☀";

    } else {

      localStorage.setItem("theme", "light");

      themeToggle.textContent = "🌙";
    }

  });

  // REQUEST NOTIFICATION PERMISSION

  if ("Notification" in window &&
      Notification.permission === "default") {

    Notification.requestPermission();

  }

  // UPDATE DISPLAY

  function updateDisplay() {

    let mins =
      Math.floor(remainingTime / 60);

    let secs =
      remainingTime % 60;

    minutesEl.textContent =
      String(mins).padStart(2, "0");

    secondsEl.textContent =
      String(secs).padStart(2, "0");

    let progress =
      remainingTime / totalTime;

    progressCircle.style.strokeDashoffset =
      circleLength * (1 - progress);
  }

  // START TIMER

  function startTimer() {

    if (remainingTime <= 0) {

      totalTime =
        Number(inputHours.value) * 3600 +
        Number(inputMinutes.value) * 60 +
        Number(inputSeconds.value);

      remainingTime = totalTime;
    }

    if (remainingTime <= 0) {

      return;
    }

    clearInterval(countdown);

    countdown = setInterval(() => {

      remainingTime--;

      updateDisplay();

      if (remainingTime <= 0) {

        clearInterval(countdown);

        alarmSound.play();

        confetti({
          particleCount: 180,
          spread: 90
        });

        showTimerNotification();

      }

    }, 1000);
  }

  // PAUSE TIMER

  function pauseTimer() {

    clearInterval(countdown);
  }

  // RESET TIMER

  function resetTimer() {

    clearInterval(countdown);

    remainingTime = 0;

    totalTime = 0;

    minutesEl.textContent = "00";

    secondsEl.textContent = "00";

    progressCircle.style.strokeDashoffset = 0;

    inputHours.value = 0;

    inputMinutes.value = 0;

    inputSeconds.value = 0;
  }

  // PRESETS

  window.setPreset = function (seconds) {

    inputHours.value =
      Math.floor(seconds / 3600);

    inputMinutes.value =
      Math.floor((seconds % 3600) / 60);

    inputSeconds.value =
      seconds % 60;
  };

  // EVENTS

  startBtn.addEventListener(
    "click",
    startTimer
  );

  pauseBtn.addEventListener(
    "click",
    pauseTimer
  );

  resetBtn.addEventListener(
    "click",
    resetTimer
  );

});
