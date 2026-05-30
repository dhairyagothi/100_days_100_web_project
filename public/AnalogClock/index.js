document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
       CHRONOS+ PREMIUM DASHBOARD ENGINE
    ========================================= */

  /* =========================================
       CLOCK CONFIGURATION
    ========================================= */

  const clocks = [
    {
      id: "local",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour: document.getElementById("local-hour"),
      minute: document.getElementById("local-minute"),
      second: document.getElementById("local-second"),
      digital: document.getElementById("local-digital"),
      date: document.getElementById("local-date"),
    },

    {
      id: "ny",
      timezone: "America/New_York",
      hour: document.getElementById("ny-hour"),
      minute: document.getElementById("ny-minute"),
      second: document.getElementById("ny-second"),
      digital: document.getElementById("ny-digital"),
      date: document.getElementById("ny-date"),
    },

    {
      id: "london",
      timezone: "Europe/London",
      hour: document.getElementById("london-hour"),
      minute: document.getElementById("london-minute"),
      second: document.getElementById("london-second"),
      digital: document.getElementById("london-digital"),
      date: document.getElementById("london-date"),
    },

    {
      id: "tokyo",
      timezone: "Asia/Tokyo",
      hour: document.getElementById("tokyo-hour"),
      minute: document.getElementById("tokyo-minute"),
      second: document.getElementById("tokyo-second"),
      digital: document.getElementById("tokyo-digital"),
      date: document.getElementById("tokyo-date"),
    },
  ];

  /* =========================================
       GENERATE CLOCK TICKS
    ========================================= */

  function generateTicks() {
    document.querySelectorAll(".clock-face").forEach((face) => {
      face.querySelectorAll(".tick").forEach((t) => t.remove());

      for (let i = 0; i < 12; i++) {
        const tick = document.createElement("div");

        tick.classList.add("tick");

        if (i % 3 === 0) {
          tick.classList.add("major");
        }

        tick.style.transform = `rotate(${i * 30}deg)`;

        face.appendChild(tick);
      }
    });
  }

  generateTicks();

  /* =========================================
       CLOCK ENGINE
    ========================================= */

  function updateClock(clock) {
    const now = new Date();

    const time = new Date(
      now.toLocaleString("en-US", {
        timeZone: clock.timezone,
      }),
    );

    const ms = now.getMilliseconds();

    const seconds = time.getSeconds() + ms / 1000;
    const minutes = time.getMinutes() + seconds / 60;
    const hours = (time.getHours() % 12) + minutes / 60;

    const secDeg = seconds * 6;
    const minDeg = minutes * 6;
    const hourDeg = hours * 30;

    if (clock.hour) {
      clock.hour.style.transform = `rotate(${hourDeg}deg)`;
    }

    if (clock.minute) {
      clock.minute.style.transform = `rotate(${minDeg}deg)`;
    }

    if (clock.second) {
      clock.second.style.transform = `rotate(${secDeg}deg)`;
    }

    if (clock.digital) {
      clock.digital.textContent =
        `${String(time.getHours()).padStart(2, "0")}:` +
        `${String(time.getMinutes()).padStart(2, "0")}:` +
        `${String(time.getSeconds()).padStart(2, "0")}`;
    }

    if (clock.date) {
      clock.date.textContent = time.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  }

  function animateClocks() {
    clocks.forEach(updateClock);

    requestAnimationFrame(animateClocks);
  }

  requestAnimationFrame(animateClocks);

  /* =========================================
       THEME SYSTEM
    ========================================= */

  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");

  function applyTheme(mode) {
    if (mode === "dark") {
      document.body.classList.add("dark-theme");

      if (sunIcon) sunIcon.style.display = "block";
      if (moonIcon) moonIcon.style.display = "none";
    } else {
      document.body.classList.remove("dark-theme");

      if (sunIcon) sunIcon.style.display = "none";
      if (moonIcon) moonIcon.style.display = "block";
    }
  }

  function initTheme() {
    const saved = localStorage.getItem("chronos-theme");

    if (saved) {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      applyTheme(prefersDark ? "dark" : "light");
    }
  }

  initTheme();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const dark = document.body.classList.contains("dark-theme");

      const next = dark ? "light" : "dark";

      localStorage.setItem("chronos-theme", next);

      applyTheme(next);
    });
  }

  /* =========================================
       COUNTDOWN TIMER
    ========================================= */

  let timerInterval = null;
  let timerRemaining = 0;
  let timerPaused = false;

  const hoursInput = document.getElementById("hours");
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");

  const countdownDisplay = document.getElementById("countdownDisplay");

  const timerUpMsg = document.getElementById("timerUpMsg");

  const timerSound = document.getElementById("timerSound");

  const pauseBtn = document.getElementById("pausebtn");

  function renderTimer() {
    const hrs = Math.floor(timerRemaining / 3600);
    const mins = Math.floor((timerRemaining % 3600) / 60);
    const secs = timerRemaining % 60;

    countdownDisplay.textContent =
      `${String(hrs).padStart(2, "0")}:` +
      `${String(mins).padStart(2, "0")}:` +
      `${String(secs).padStart(2, "0")}`;
  }

  function stopTimerSound() {
    if (!timerSound) return;

    timerSound.pause();
    timerSound.currentTime = 0;
  }

  function finishTimer() {
    clearInterval(timerInterval);

    timerUpMsg.style.display = "flex";

    if (timerSound) {
      timerSound.currentTime = 0;

      timerSound.play().catch(() => {});
    }
  }

  window.startCountdown = function () {
    clearInterval(timerInterval);

    timerUpMsg.style.display = "none";

    stopTimerSound();

    const h = parseInt(hoursInput.value) || 0;
    const m = parseInt(minutesInput.value) || 0;
    const s = parseInt(secondsInput.value) || 0;

    timerRemaining = h * 3600 + m * 60 + s;

    if (timerRemaining <= 0) {
      alert("Please enter valid timer duration.");

      return;
    }

        isPaused = false;
        if(!pausebtn) return ;
        pausebtn.innerText = 'Pause';
        
        updateTimerDisplay();
        tickCountdown();
    };

function tickCountdown() {

    clearInterval(countdownInterval);

    updateTimerDisplay();

    countdownInterval = setInterval(() => {
        if (countdownTime <= 0) {
            triggerTimerFinished();
        } else {
            countdownTime--;
            updateTimerDisplay();
        }
      }
    }, 1000);
  };

  window.pauseCountdown = function () {
    if (timerRemaining <= 0) return;

    timerPaused = !timerPaused;

    pauseBtn.innerHTML = timerPaused ? "Resume" : "Pause";
  };

  window.restartCountdown = function () {
    clearInterval(timerInterval);

    timerRemaining = 0;

    timerPaused = false;

    renderTimer();

    hoursInput.value = "";
    minutesInput.value = "";
    secondsInput.value = "";

    pauseBtn.innerHTML = "Pause";

    timerUpMsg.style.display = "none";

    stopTimerSound();
  };

  renderTimer();

  /* =========================================
       MULTIPLE ALARMS SYSTEM
    ========================================= */

  let alarms = JSON.parse(localStorage.getItem("chronos-alarms")) || [];

  const alarmList = document.getElementById("alarmList");

  function saveAlarms() {
    localStorage.setItem("chronos-alarms", JSON.stringify(alarms));
  }

  function renderAlarms() {
    if (!alarmList) return;

    alarmList.innerHTML = "";

    if (!alarms.length) {
      alarmList.innerHTML = `<div class="text-secondary text-center py-3">
                    No alarms added
                 </div>`;

      return;
    }

    alarms.forEach((alarm, index) => {
      const item = document.createElement("div");

      item.className =
        "list-group-item d-flex justify-content-between align-items-center";

      item.innerHTML = `
                <div>
                    <strong>${alarm.time}</strong>
                    <div class="small text-secondary">
                        ${alarm.label || "Alarm"}
                    </div>
                </div>

                <div class="d-flex gap-2">

                    <button class="btn btn-sm btn-warning snooze-btn">
                        Snooze
                    </button>

                    <button class="btn btn-sm btn-danger delete-btn">
                        Delete
                    </button>

                </div>
            `;

      item.querySelector(".delete-btn").addEventListener("click", () => {
        alarms.splice(index, 1);

        saveAlarms();

        renderAlarms();
      });

      item.querySelector(".snooze-btn").addEventListener("click", () => {
        const current = new Date();

        current.setMinutes(current.getMinutes() + 5);

        alarm.time =
          `${String(current.getHours()).padStart(2, "0")}:` +
          `${String(current.getMinutes()).padStart(2, "0")}`;

        saveAlarms();

        renderAlarms();
      });

      alarmList.appendChild(item);
    });
  }

  renderAlarms();

  const addAlarmBtn = document.getElementById("addAlarmBtn");

  if (addAlarmBtn) {
    addAlarmBtn.addEventListener("click", () => {
      const alarmTime = document.getElementById("alarmTime").value;

      const alarmLabel = document.getElementById("alarmLabel").value;

      if (!alarmTime) {
        alert("Select alarm time.");

        return;
      }

      alarms.push({
        time: alarmTime,
        label: alarmLabel,
      });

      saveAlarms();

      renderAlarms();

      document.getElementById("alarmTime").value = "";
      document.getElementById("alarmLabel").value = "";
    });
  }

  setInterval(() => {
    const now = new Date();

    const current =
      `${String(now.getHours()).padStart(2, "0")}:` +
      `${String(now.getMinutes()).padStart(2, "0")}`;

    alarms.forEach((alarm) => {
      if (alarm.time === current && now.getSeconds() === 0) {
        alert(`⏰ Alarm: ${alarm.label || alarm.time}`);

        if (timerSound) {
          timerSound.currentTime = 0;

          timerSound.play().catch(() => {});
        }
      }
    });
  }, 1000);

  /* =========================================
       STOPWATCH SYSTEM
    ========================================= */

  let stopwatchInterval = null;
  let stopwatchTime = 0;
  let stopwatchRunning = false;

  const stopwatchDisplay = document.getElementById("stopwatchDisplay");

  const lapList = document.getElementById("lapList");

  function updateStopwatchDisplay() {
    const ms = stopwatchTime % 1000;

    const totalSec = Math.floor(stopwatchTime / 1000);

    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    stopwatchDisplay.textContent =
      `${String(hrs).padStart(2, "0")}:` +
      `${String(mins).padStart(2, "0")}:` +
      `${String(secs).padStart(2, "0")}.` +
      `${String(ms).padStart(3, "0")}`;
  }

  window.startStopwatch = function () {
    if (stopwatchRunning) return;

    stopwatchRunning = true;

    let last = performance.now();

    stopwatchInterval = setInterval(() => {
      const now = performance.now();

      stopwatchTime += now - last;

      last = now;

      updateStopwatchDisplay();
    }, 10);
  };

  window.pauseStopwatch = function () {
    stopwatchRunning = false;

    clearInterval(stopwatchInterval);
  };

  window.resetStopwatch = function () {
    stopwatchRunning = false;

    clearInterval(stopwatchInterval);

    stopwatchTime = 0;

    updateStopwatchDisplay();

    if (lapList) lapList.innerHTML = "";
  };

  window.addLap = function () {
    if (!lapList) return;

    const item = document.createElement("li");

    item.className = "list-group-item";

    item.textContent = stopwatchDisplay.textContent;

    lapList.prepend(item);
  };

  updateStopwatchDisplay();

  /* =========================================
       DRAGGABLE CLOCK CARDS
    ========================================= */

  const grid = document.getElementById("worldClocksGrid");

  if (grid && window.Sortable) {
    Sortable.create(grid, {
      animation: 200,
      ghostClass: "sortable-ghost",
    });
  }

  /* =========================================
       CUSTOM BACKGROUND UPLOAD
    ========================================= */

  const bgUpload = document.getElementById("bgUpload");

  if (bgUpload) {
    bgUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (event) {
        document.querySelectorAll(".clock-banner").forEach((banner) => {
          banner.style.backgroundImage = `url(${event.target.result})`;
        });
      };

      reader.readAsDataURL(file);
    });
  }

  /* =========================================
       FOCUS MODE
    ========================================= */

 const focusModeBtn = document.getElementById("focusModeBtn");

if (focusModeBtn) {
  focusModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("focus-mode");

    focusModeBtn.textContent =
      document.body.classList.contains("focus-mode")
        ? "Exit Focus Mode"
        : "Focus Mode";
  });
}
  /* =========================================
       KEYBOARD SHORTCUTS
    ========================================= */

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "t") {
      themeToggleBtn.click();
    }

    if (e.key.toLowerCase() === "f") {
      document.body.classList.toggle("focus-mode");
    }

    if (e.code === "Space") {
      e.preventDefault();

      if (stopwatchRunning) {
        pauseStopwatch();
      } else {
        startStopwatch();
      }
    }
  });

  /* =========================================
       CLOCK MODAL VIEW
    ========================================= */

  document.querySelectorAll(".world-clock-card").forEach((card) => {
    card.addEventListener("dblclick", () => {
      const modalClock = card.querySelector(".clock-frame").cloneNode(true);

      const modalBody = document.getElementById("clockModalBody");

      if (modalBody) {
        modalBody.innerHTML = "";

        modalClock.classList.add("large-clock");

        modalBody.appendChild(modalClock);
      }
    });
  });

  /* =========================================
       EXPORT DASHBOARD
    ========================================= */

  const exportBtn = document.getElementById("exportDashboardBtn");

  if (exportBtn && window.html2canvas) {
    exportBtn.addEventListener("click", () => {
      html2canvas(document.body).then((canvas) => {
        const link = document.createElement("a");

        link.download = "chronos-dashboard.png";

        link.href = canvas.toDataURL();

        link.click();
      });
    });
  }
});
