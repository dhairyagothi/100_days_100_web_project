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

// World Clock Modal DOM Selectors
const worldModal = document.getElementById("world-clock-modal");
const worldSearchInput = document.getElementById("world-search-input");
const worldTzOptionsList = document.getElementById("world-tz-options-list");
let countriesDatabase = [];

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

  // Load the global country database from API instantly
  fetchWorldCountries();

  updateClock();
  setInterval(() => {
    updateClock();
    tickWorldClocks(); // Keep secondary clocks perfectly synchronized every second
  }, 1000);
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

function toggleWorldClockModal() {
  if (worldModal.classList.contains("hidden")) {
    worldModal.classList.remove("hidden");
    worldSearchInput.focus();
  } else {
    closeWorldClockModal();
  }
}

function closeWorldClockModal() {
  worldModal.classList.add("hidden");
  worldSearchInput.value = "";
  renderCountryOptions(countriesDatabase); // Reset options view
}

async function fetchWorldCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,timezones,flags");
    const data = await response.json();
    
    // Sort array elements alphabetically by country name
    countriesDatabase = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    
    renderCountryOptions(countriesDatabase);
  } catch (error) {
    console.error("Failed to fetch world countries:", error);
    worldTzOptionsList.innerHTML = `<p style="color:#ff5555; padding:10px; text-align:center;">Network error loading countries.</p>`;
  }
}

function renderCountryOptions(countries) {
  worldTzOptionsList.innerHTML = "";
  
  if (countries.length === 0) {
    worldTzOptionsList.innerHTML = `<p style="color:#888; padding:10px; text-align:center;">No match found</p>`;
    return;
  }

  countries.forEach(country => {
    const name = country.name.common;
    const flag = country.flags.svg || country.flags.png;
    const offset = country.timezones[0]; // Primary UTC offset string format (e.g. 'UTC+05:30')

    const optionRow = document.createElement("div");
    optionRow.className = "custom-timezone-option";
    optionRow.style.cssText = "display:flex; align-items:center; gap:12px; padding:10px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.05); color:#fff;";
    
    optionRow.innerHTML = `
      <img src="${flag}" style="width:22px; height:14px; object-fit:cover; border-radius:2px;">
      <span style="font-family:'Poppins', sans-serif; font-size:14px;">${name} <small style="color:#666;">(${offset})</small></span>
    `;

    optionRow.addEventListener("click", () => {
      addCountryClock(name, offset, flag);
      closeWorldClockModal();
    });

    worldTzOptionsList.appendChild(optionRow);
  });
}

if (worldSearchInput) {
  worldSearchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = countriesDatabase.filter(c => 
      c.name.common.toLowerCase().includes(term)
    );
    renderCountryOptions(filtered);
  });
}

function addCountryClock(name, offset, flag) {
  const alreadyExists = worldClocks.some(item => item.name === name);
  if (alreadyExists) {
    showToast("Clock already added!");
    return;
  }

  // Push into your state variable tracker
  worldClocks.push({ name, offset, flag });
  localStorage.setItem("clock_worldClocks", JSON.stringify(worldClocks));
  
  renderWorldClocks();
  showToast(`Added ${name}`);
}

function renderWorldClocks() {
  const container = document.getElementById("world-clocks-list");
  if (!container) return;
  container.innerHTML = "";

  if (worldClocks.length === 0) {
    container.innerHTML = `<p style="color:#555; text-align:center; width:100%; padding:20px; font-family:'Poppins';">No secondary world clocks added yet.</p>`;
    return;
  }

 worldClocks.forEach((clock, index) => {
    const card = document.createElement("div");
    card.className = "world-clock-card";
    card.innerHTML = `
      <div class="world-clock-info">
        <img src="${clock.flag}" style="width: 22px; height: 14px; object-fit: cover; border-radius: 2px; opacity: 0.9; flex-shrink: 0;">
        <div class="world-clock-meta">
          <span class="world-city">${clock.name}</span>
          <span class="world-offset">${clock.offset}</span>
        </div>
      </div>
      
      <div class="world-time-zone-display">
        <span class="world-time ticking-world-time" data-offset="${clock.offset}">00:00:00 AM</span>
        <button class="world-clock-remove" onclick="removeWorldClock(${index})">&times;</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function removeWorldClock(index) {
  worldClocks.splice(index, 1);
  localStorage.setItem("clock_worldClocks", JSON.stringify(worldClocks));
  renderWorldClocks();
}

function tickWorldClocks() {
  const liveNodes = document.querySelectorAll(".ticking-world-time");
  
  liveNodes.forEach(node => {
    const offsetStr = node.getAttribute("data-offset");
    
    const now = new Date();
    const utcTimeMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    
    let mathematicalHoursOffset = 0;
    if (offsetStr.includes("+") || offsetStr.includes("-")) {
      const modifier = offsetStr.includes("+") ? 1 : -1;
      const cleanSegments = offsetStr.replace("UTC", "").replace("+", "").replace("-", "").split(":");
      const hoursSegment = parseInt(cleanSegments[0]) || 0;
      const minutesSegment = parseInt(cleanSegments[1]) || 0;
      mathematicalHoursOffset = modifier * (hoursSegment + (minutesSegment / 60));
    }

    const targetedTimeDateInstance = new Date(utcTimeMs + (3600000 * mathematicalHoursOffset));
    
    node.textContent = targetedTimeDateInstance.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
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

function populateTimezoneDropdown() {
  const container = document.getElementById("tz-options-list");
  if (!container) return;
  container.innerHTML = TIMEZONES.map(tz => 
    `<div class="custom-timezone-option" onclick="selectPrimaryTimezone('${tz.id}', '${tz.name}')">${tz.name}</div>`
  ).join("");
}

function selectPrimaryTimezone(id, name) {
  primaryTimezone = id;
  localStorage.setItem("primaryTimezone", id);
  document.getElementById("selected-tz-display").textContent = name;
  timezoneLabel.textContent = name;
  document.getElementById("tz-options-container").classList.add("hidden");
  updateClock();
}

function renderAlarmsList() {
  const container = document.getElementById("alarms-list");
  if (!container) return;
  
  if (alarms.length === 0) {
    container.innerHTML = `<p class="empty-list-placeholder">No alarms set. Add one above!</p>`;
    return;
  }

  container.innerHTML = alarms.map((alarm, index) => `
    <div class="alarm-item" style="display:flex; justify-content:space-between; align-items:center; color:#fff; padding:8px 0; border-bottom:1px solid #222;">
      <div>
        <strong>${alarm.time}</strong> - <small>${alarm.label}</small>
      </div>
      <button onclick="deleteAlarm(${alarm.id})" style="background:transparent; border:none; color:#ff5555; cursor:pointer;">Delete</button>
    </div>
  `).join("");
}

function deleteAlarm(id) {
  alarms = alarms.filter(a => a.id !== id);
  saveAlarms();
  renderAlarmsList();
  updateAlarmSummary();
}

function clearAllAlarms() {
  alarms = [];
  saveAlarms();
  renderAlarmsList();
  updateAlarmSummary();
}

function toggleAlarmSection() {
  document.getElementById("alarm-controls").classList.toggle("hidden");
}

function toggleTimezoneDropdown(e) {
  e.stopPropagation();
  document.getElementById("tz-options-container").classList.toggle("hidden");
}

function filterTimezones() {
  const input = document.getElementById("tz-search-input").value.toLowerCase();
  const options = document.getElementById("tz-options-list").children;
  for (let opt of options) {
    opt.style.display = opt.textContent.toLowerCase().includes(input) ? "block" : "none";
  }
}

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