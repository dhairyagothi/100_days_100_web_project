// App configuration and state
let activeTheme = localStorage.getItem("clockTheme") || "classic";
let primaryTimezone = localStorage.getItem("primaryTimezone") || "local";
let alarms = JSON.parse(localStorage.getItem("clock_alarms")) || [];
let worldClocks = JSON.parse(localStorage.getItem("clock_worldClocks")) || [];
let historyLogs = JSON.parse(localStorage.getItem("clock_historyLogs")) || [];

let ringingAlarm = null;
let lastCheckedMinute = "";
let ringInterval = null;
let audioCtx = null;

// DOM Selectors
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const ampmEl = document.getElementById("ampm");
const dayNameEl = document.getElementById("day-name");
const fullDateEl = document.getElementById("full-date");
const timezoneLabel = document.getElementById("timezone-label");
const alarmStatus = document.getElementById("alarm-status");
const toast = document.getElementById("toast");
const alarmPopup = document.getElementById("alarm-popup");
const popupAlarmTitle = document.getElementById("popup-alarm-title");
const popupAlarmTime = document.getElementById("popup-alarm-time");
const popupAlarmLabel = document.getElementById("popup-alarm-label");
const alarmSound = document.getElementById("alarm-sound");

// Supported timezones
const TIMEZONES = [
  { id: "local", name: "Local Time" },
  { id: "UTC", name: "UTC / GMT" },
  { id: "Asia/Kolkata", name: "Kolkata (India)" },
  { id: "Asia/Tokyo", name: "Tokyo (Japan)" },
  { id: "Europe/London", name: "London (UK)" },
  { id: "America/New_York", name: "New York" }
];

// INIT
document.addEventListener("DOMContentLoaded", () => {
  setTheme(activeTheme);

  populateTimezoneDropdown();
  renderAlarmsList();
  renderWorldClocks();
  renderHistoryLogs();
  updateAlarmSummary();

  updateClock();
  setInterval(updateClock, 1000);
});

// ================= THEME =================
function setTheme(theme) {
  activeTheme = theme;
  localStorage.setItem("clockTheme", theme);

  document.body.className = `${theme}-theme`;

  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });

  showToast(`Theme: ${theme}`);
}

// Extra feature (from fix-theme) - SAFE VERSION
function setClockFace(face) {
  const display = document.getElementById('display');
  const clock = document.getElementById('clock');

  if (!display || !clock) return;

  display.style.opacity = "0.7";
  clock.style.opacity = "0.7";

  setTimeout(() => {
    display.className = `clock-display ${face}`;
    clock.className = `clock ${face}`;
    display.style.opacity = "1";
    clock.style.opacity = "1";
  }, 150);
}

// ================= CLOCK =================
function updateClock() {
  let now = new Date();

  if (primaryTimezone !== "local") {
    now = new Date(now.toLocaleString("en-US", { timeZone: primaryTimezone }));
  }

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const ampm = h >= 12 ? "PM" : "AM";
  let hh = h % 12 || 12;

  hoursEl.textContent = String(hh).padStart(2, "0");
  minutesEl.textContent = String(m).padStart(2, "0");
  secondsEl.textContent = String(s).padStart(2, "0");
  ampmEl.textContent = ampm;

  checkAlarms(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
}

// ================= ALARMS =================
function addNewAlarm() {
  const timeInput = document.getElementById("alarm-time");
  const labelInput = document.getElementById("alarm-label");

  if (!timeInput.value) return;

  const alarm = {
    id: Date.now(),
    time: timeInput.value,
    label: labelInput.value || "Alarm",
    enabled: true,
    snooze: 5,
    snoozedTime: null,
    snoozeCount: 0
  };

  alarms.push(alarm);
  saveAlarms();
  renderAlarmsList();
  updateAlarmSummary();
  showToast("Alarm added");
}

function checkAlarms(currentTime) {
  alarms.forEach(alarm => {
    if (!alarm.enabled) return;

    if (alarm.time === currentTime) {
      triggerAlarm(alarm);
    }
  });
}

function triggerAlarm(alarm) {
  ringingAlarm = alarm;

  popupAlarmTitle.textContent = "Alarm!";
  popupAlarmTime.textContent = alarm.time;
  popupAlarmLabel.textContent = alarm.label;

  alarmPopup.classList.remove("hidden");

  startRinger();
}

function stopActiveAlarm() {
  stopRinger();
  alarmPopup.classList.add("hidden");
  ringingAlarm = null;
}

function snoozeActiveAlarm() {
  if (!ringingAlarm) return;

  ringingAlarm.snoozedTime = Date.now() + 5 * 60000;
  stopActiveAlarm();
}

// ================= AUDIO =================
function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
}

function startRinger() {
  initAudio();

  ringInterval = setInterval(() => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = 800;

    gain.gain.value = 0.1;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }, 500);
}

function stopRinger() {
  clearInterval(ringInterval);
}

// ================= WORLD CLOCK =================
function renderWorldClocks() {
  const container = document.getElementById("world-clocks-list");
  container.innerHTML = "";

  worldClocks.forEach(tz => {
    const div = document.createElement("div");
    div.className = "world-clock";
    div.innerText = tz;
    container.appendChild(div);
  });
}

// ================= HISTORY =================
function renderHistoryLogs() {
  const container = document.getElementById("history-logs");
  if (!container) return;

  container.innerHTML = historyLogs
    .map(log => `<div>${log.text}</div>`)
    .join("");
}

function addHistoryLog(text) {
  historyLogs.unshift({ text });
  localStorage.setItem("clock_historyLogs", JSON.stringify(historyLogs));
}

// ================= HELPERS =================
function saveAlarms() {
  localStorage.setItem("clock_alarms", JSON.stringify(alarms));
}

function updateAlarmSummary() {
  alarmStatus.textContent = alarms.filter(a => a.enabled).length + " Active";
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}