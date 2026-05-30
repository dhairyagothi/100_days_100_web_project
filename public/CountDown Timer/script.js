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
