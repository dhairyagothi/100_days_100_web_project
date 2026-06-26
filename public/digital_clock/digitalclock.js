// =========================
// DARK MODE
// =========================

let isDarkMode =
  localStorage.getItem("clockDarkMode") === "true";

function applyDarkMode(enabled) {
  isDarkMode = enabled;

  document.body.classList.toggle("dark-mode", enabled);

  const btn = document.getElementById("dark-mode-toggle");

  if (btn) {
    btn.textContent = enabled ? "☀️" : "🌙";
  }

  localStorage.setItem("clockDarkMode", enabled);
}

function toggleDarkMode() {
  applyDarkMode(!isDarkMode);
}

// =========================
// CLOCK
// =========================

const hoursEl   = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const ampmEl    = document.getElementById("ampm");
const dayNameEl = document.getElementById("day-name");
const fullDateEl = document.getElementById("full-date");
const formatToggleBtn = document.getElementById("format-toggle");

const days = [
  "Sunday","Monday","Tuesday",
  "Wednesday","Thursday","Friday","Saturday"
];

let is24HourFormat =
  localStorage.getItem("is24HourFormat") === "true";

function updateClock() {
  const now = new Date();

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const ampm = h >= 12 ? "PM" : "AM";

  const displayHour = is24HourFormat ? h : (h % 12 || 12);

  if (hoursEl)
    hoursEl.textContent = String(displayHour).padStart(2, "0");

  if (minutesEl)
    minutesEl.textContent = String(m).padStart(2, "0");

  if (secondsEl)
    secondsEl.textContent = String(s).padStart(2, "0");

  if (ampmEl)
    ampmEl.textContent = is24HourFormat ? "" : ampm;

  if (dayNameEl)
    dayNameEl.textContent = days[now.getDay()];

  if (fullDateEl)
    fullDateEl.textContent = now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
}

// =========================
// FORMAT TOGGLE
// =========================

if (formatToggleBtn) {
  formatToggleBtn.textContent = is24HourFormat ? "12H" : "24H";

  formatToggleBtn.addEventListener("click", () => {
    is24HourFormat = !is24HourFormat;

    localStorage.setItem("is24HourFormat", is24HourFormat);

    formatToggleBtn.textContent = is24HourFormat ? "12H" : "24H";

    updateClock();
  });
}

// =========================
// WORLD CLOCKS
// =========================

const worldClockList = document.getElementById("world-clocks-list");

const worldClocks = [
  { city: "New York", timezone: "America/New_York" },
  { city: "London",   timezone: "Europe/London"   },
  { city: "Tokyo",    timezone: "Asia/Tokyo"       },
];

function renderWorldClocks() {
  if (!worldClockList) return;

  worldClockList.innerHTML = "";

  worldClocks.forEach((clock) => {
    const card = document.createElement("div");
    card.className = "world-clock-card";
    card.innerHTML = `
      <h3>${clock.city}</h3>
      <p class="world-time" data-tz="${clock.timezone}">00:00:00</p>
    `;
    worldClockList.appendChild(card);
  });
}

function updateWorldClocks() {
  document.querySelectorAll(".world-time").forEach((el) => {
    const tz = el.dataset.tz;
    el.textContent = new Date().toLocaleTimeString("en-US", {
      timeZone: tz,
      hour12: !is24HourFormat,
    });
  });
}

function toggleWorldClockModal() {
  alert("World Clock Modal not added yet.");
}

// =========================
// POMODORO
// =========================

const pomodoroTimeEl   = document.getElementById("pomodoro-time");
const pomodoroStatusEl = document.getElementById("pomodoro-status");

let pomodoroSeconds    = 25 * 60;
let pomodoroTimer      = null;
let isPomodoroRunning  = false;

function updatePomodoroDisplay() {
  if (!pomodoroTimeEl) return;

  const mins = Math.floor(pomodoroSeconds / 60);
  const secs = pomodoroSeconds % 60;

  pomodoroTimeEl.textContent =
    `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function startPomodoro() {
  if (isPomodoroRunning) return;

  isPomodoroRunning = true;

  if (pomodoroStatusEl)
    pomodoroStatusEl.textContent = "Focus Session Running";

  pomodoroTimer = setInterval(() => {
    pomodoroSeconds--;
    updatePomodoroDisplay();

    if (pomodoroSeconds <= 0) {
      clearInterval(pomodoroTimer);
      isPomodoroRunning = false;

      if (pomodoroStatusEl)
        pomodoroStatusEl.textContent = "Session Complete 🎉";
    }
  }, 1000);
}

function pausePomodoro() {
  clearInterval(pomodoroTimer);
  isPomodoroRunning = false;

  if (pomodoroStatusEl)
    pomodoroStatusEl.textContent = "Paused";
}

function resetPomodoro() {
  clearInterval(pomodoroTimer);
  isPomodoroRunning = false;
  pomodoroSeconds = 25 * 60;

  updatePomodoroDisplay();

  if (pomodoroStatusEl)
    pomodoroStatusEl.textContent = "Focus Session";
}

document.getElementById("start-pomodoro")
  ?.addEventListener("click", startPomodoro);

document.getElementById("pause-pomodoro")
  ?.addEventListener("click", pausePomodoro);

document.getElementById("reset-pomodoro")
  ?.addEventListener("click", resetPomodoro);

// =========================
// ALARMS
// =========================

let alarms = JSON.parse(localStorage.getItem("clock_alarms")) || [];

let ringingAlarm     = null;
let triggeredAlarms  = new Set();
let lastCheckedMinute = "";

const alarmsList    = document.getElementById("alarms-list");
const toast         = document.getElementById("toast");
const alarmPopup    = document.getElementById("alarm-popup");
const popupAlarmTime  = document.getElementById("popup-alarm-time");
const popupAlarmLabel = document.getElementById("popup-alarm-label");

// =========================
// TOAST
// =========================

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// =========================
// SAVE
// =========================

function saveAlarms() {
  localStorage.setItem("clock_alarms", JSON.stringify(alarms));
}

// =========================
// ADD ALARM
// =========================

function addNewAlarm() {
  const timeInput   = document.getElementById("alarm-time");
  const labelInput  = document.getElementById("alarm-label");
  const snoozeInput = document.getElementById("alarm-snooze");

  if (!timeInput?.value) {
    showToast("Please select a time");
    return;
  }

  const alarm = {
    id: Date.now(),
    time: timeInput.value,
    label: labelInput.value || "Alarm",
    enabled: true,
    snooze: parseInt(snoozeInput.value) || 5,
  };

  alarms.push(alarm);
  saveAlarms();
  renderAlarmsList();

  timeInput.value  = "";
  labelInput.value = "";

  showToast("Alarm added");
}

// =========================
// RENDER ALARMS
// =========================

function renderAlarmsList() {
  if (!alarmsList) return;

  if (alarms.length === 0) {
    alarmsList.innerHTML = "<p>No alarms yet.</p>";
    return;
  }

  alarmsList.innerHTML = alarms.map((alarm) => `
    <div class="alarm-item">
      <div>
        <strong>${alarm.time}</strong>
        <p>${alarm.label}</p>
      </div>
      <button class="btn btn-danger" onclick="deleteAlarm(${alarm.id})">
        Delete
      </button>
    </div>
  `).join("");
}

// =========================
// DELETE
// =========================

function deleteAlarm(id) {
  alarms = alarms.filter((alarm) => alarm.id !== id);
  saveAlarms();
  renderAlarmsList();
  showToast("Alarm deleted");
}

// =========================
// CLEAR ALL
// =========================

function clearAllAlarms() {
  alarms = [];
  saveAlarms();
  renderAlarmsList();
  showToast("All alarms cleared");
}

// =========================
// CHECK ALARMS
// =========================

function checkAlarms() {
  const now = new Date();

  const currentTime =
    `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  if (currentTime !== lastCheckedMinute) {
    triggeredAlarms   = new Set();
    lastCheckedMinute = currentTime;
  }

  alarms.forEach((alarm) => {
    if (!alarm.enabled) return;

    if (alarm.time === currentTime && !triggeredAlarms.has(alarm.id)) {
      triggeredAlarms.add(alarm.id);
      triggerAlarm(alarm);
    }
  });
}

// =========================
// TRIGGER
// =========================

function triggerAlarm(alarm) {
  ringingAlarm = alarm;

  if (popupAlarmTime)  popupAlarmTime.textContent  = alarm.time;
  if (popupAlarmLabel) popupAlarmLabel.textContent = alarm.label;
  if (alarmPopup)      alarmPopup.classList.remove("hidden");

  showToast(`Alarm: ${alarm.label}`);
  playAlarmSound();
}

// =========================
// AUDIO
// =========================

function playAlarmSound() {
  const audio = document.getElementById("alarm-sound");
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

function stopActiveAlarm() {
  const audio = document.getElementById("alarm-sound");
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  if (alarmPopup) alarmPopup.classList.add("hidden");

  ringingAlarm = null;
}

function snoozeActiveAlarm() {
  stopActiveAlarm();
  showToast("Alarm snoozed");
}

document.getElementById("add-alarm-btn")
  ?.addEventListener("click", addNewAlarm);

document.getElementById("clear-all-btn")
  ?.addEventListener("click", clearAllAlarms);

// =========================
// HISTORY
// =========================

let historyLogs =
  JSON.parse(localStorage.getItem("clock_historyLogs")) || [];

function addHistoryLog(message) {
  historyLogs.unshift({
    text: message,
    time: new Date().toLocaleString(),
  });

  localStorage.setItem("clock_historyLogs", JSON.stringify(historyLogs));
}

function renderHistoryLogs() {
  const container = document.getElementById("history-logs");
  if (!container) return;

  if (historyLogs.length === 0) {
    container.innerHTML = `<div class="log-entry">No history available.</div>`;
    return;
  }

  container.innerHTML = historyLogs.map((log) => `
    <div class="log-entry">
      <div class="log-time">${log.time || ""}</div>
      <div class="log-text">${log.text}</div>
    </div>
  `).join("");
}

function toggleHistoryLogs() {
  const logs    = document.getElementById("history-logs");
  const chevron = document.getElementById("history-chevron");

  if (!logs) return;

  logs.classList.toggle("hidden");

  if (chevron) {
    chevron.style.transform = logs.classList.contains("hidden")
      ? "rotate(0deg)"
      : "rotate(180deg)";
  }
}

// =========================
// INIT — single DOMContentLoaded
// =========================

document.addEventListener("DOMContentLoaded", () => {
  // dark mode
  applyDarkMode(isDarkMode);

  // clock
  updateClock();

  // world clocks
  renderWorldClocks();
  updateWorldClocks();

  // pomodoro
  updatePomodoroDisplay();

  // alarms
  renderAlarmsList();

  // history
  renderHistoryLogs();

  // single interval for everything
  setInterval(() => {
    updateClock();
    updateWorldClocks();
    checkAlarms();
  }, 1000);
});

