// App configuration and state
// Dark mode state
let isDarkMode = localStorage.getItem("clockDarkMode") === "true";
if (isDarkMode) document.body.classList.add("dark-mode");
let primaryTimezone = localStorage.getItem("primaryTimezone") || "local";
let alarms = JSON.parse(localStorage.getItem("clock_alarms")) || [];
let worldClocks = JSON.parse(localStorage.getItem("clock_worldClocks")) || [];
let historyLogs = JSON.parse(localStorage.getItem("clock_historyLogs")) || [];

let ringingAlarm = null;
let lastCheckedMinute = "";
let ringInterval = null;
let audioCtx = null;
let triggeredAlarms = new Set();
let weatherCache = {};
let currentTimeTheme = "";
let is24HourFormat = localStorage.getItem("is24HourFormat") === "true";

let activeAccent =
  localStorage.getItem("clockAccent") || "classic";

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
const historyChevron = document.getElementById("history-chevron");
const formatToggleBtn = document.getElementById("format-toggle");

// World Clock Modal DOM
const worldModal = document.getElementById("world-clock-modal");
const worldSearchInput = document.getElementById("world-search-input");
const worldTzOptionsList = document.getElementById("world-tz-options-list");
let countriesDatabase = [];

// Supported timezones
const TIMEZONES = [
  { id: "local", name: "Local Time", code: "LOC" },
  { id: "UTC", name: "UTC / GMT", code: "UTC" },
  { id: "Asia/Kolkata", name: "Kolkata (India)", code: "IST" },
  { id: "Asia/Tokyo", name: "Tokyo (Japan)", code: "JST" },
  { id: "Europe/London", name: "London (UK)", code: "GMT" },
  { id: "America/New_York", name: "New York", code: "EST" },
];

// TIME-BASED THEME FUNCTIONS
function getTimeBasedTheme(hour) {
  if (hour >= 5 && hour < 11) {
    return "morning";
  } else if (hour >= 11 && hour < 17) {
    return "afternoon";
  } else if (hour >= 17 && hour < 20) {
    return "evening";
  } else {
    return "night";
  }
}

function applyTimeBasedTheme() {
  const now = new Date();
  const hour = now.getHours();
  const newTimeTheme = getTimeBasedTheme(hour);

  if (newTimeTheme !== currentTimeTheme) {
    currentTimeTheme = newTimeTheme;

    // Remove only time-based theme classes, keep manual theme class
    document.body.classList.remove(
      "morning-theme",
      "afternoon-theme",
      "evening-theme",
      "night-theme",
    );
    // Add the new time-based theme class
    document.body.classList.add(`${currentTimeTheme}-theme`);
  }
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("dark-mode-toggle");
  if (btn) btn.textContent = isDarkMode ? "☀️" : "🌙";
 applyDarkMode(isDarkMode);

const savedAccent = localStorage.getItem("clockAccent") || "classic";
setAccentColor(savedAccent);

formatToggleBtn.textContent = is24HourFormat ? "12H" : "24H";

  populateTimezoneDropdown();
  renderAlarmsList();
  renderWorldClocks();
  tickWorldClocks();
  renderHistoryLogs();
  updateAlarmSummary();

  fetchWorldCountries();

  updateClock();
  setInterval(() => {
    updateClock();
    tickWorldClocks();
    applyTimeBasedTheme();
  }, 1000);
  formatToggleBtn.addEventListener("click", () => {
    is24HourFormat = !is24HourFormat;

    formatToggleBtn.textContent = is24HourFormat ? "12H" : "24H";

    localStorage.setItem("is24HourFormat", is24HourFormat);

    updateClock();
    tickWorldClocks();
  });
});

// ================= ACCENT COLOR =================
function setAccentColor(accent) {
  activeAccent = accent;
  localStorage.setItem("clockAccent", accent);

  // Remove only manual accent classes, keep time-based theme class
  document.body.classList.remove(
    "classic-theme",
    "modern-theme",
    "futuristic-theme",
    "nebula-theme",
  );
  // Add the selected manual accent class
  document.body.classList.add(`${accent}-theme`);

  document.querySelectorAll(".theme-swatch").forEach((swatch) => {
    swatch.classList.toggle("active", swatch.dataset.theme === accent);
  });
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
  let hh = is24HourFormat ? h : h % 12 || 12;

  hoursEl.textContent = String(hh).padStart(2, "0");
  minutesEl.textContent = String(m).padStart(2, "0");
  secondsEl.textContent = String(s).padStart(2, "0");
  ampmEl.textContent = is24HourFormat ? "" : ampm;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  dayNameEl.textContent = days[now.getDay()];
  fullDateEl.textContent = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  checkAlarms(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
}

// ================= ALARMS =================
function addNewAlarm() {
  const timeInput = document.getElementById("alarm-time");
  const labelInput = document.getElementById("alarm-label");

  if (!timeInput.value) {
    showToast("Please select a time");
    return;
  }

  const alarm = {
    id: Date.now(),
    time: timeInput.value,
    label: labelInput.value || "Alarm",
    enabled: true,
    snooze: parseInt(document.getElementById("alarm-snooze").value) || 5,
    snoozedTime: null,
    snoozeCount: 0,
  };

  alarms.push(alarm);
  saveAlarms();
  renderAlarmsList();
  updateAlarmSummary();
  showToast("Alarm added");
}

function checkAlarms(currentTime) {
  // Clear triggered alarms set when the minute changes
  if (currentTime !== lastCheckedMinute) {
    triggeredAlarms = new Set();
    lastCheckedMinute = currentTime;
  }

  alarms.forEach((alarm) => {
    if (!alarm.enabled) return;
    if (alarm.snoozedTime && Date.now() < alarm.snoozedTime) return;
    if (alarm.snoozedTime) alarm.snoozedTime = null;
    if (alarm.time === currentTime && !triggeredAlarms.has(alarm.id)) {
      triggeredAlarms.add(alarm.id);
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

  addHistoryLog(`Alarm "${alarm.label}" rang at ${alarm.time}`);
  renderHistoryLogs();

  startRinger();
}

function stopActiveAlarm() {
  stopRinger();
  alarmPopup.classList.add("hidden");
  ringingAlarm = null;
}

function snoozeActiveAlarm() {
  if (!ringingAlarm) return;

  ringingAlarm.snoozedTime = Date.now() + (ringingAlarm.snooze || 5) * 60000;
  ringingAlarm.snoozeCount = (ringingAlarm.snoozeCount || 0) + 1;
  showToast(`Snoozed for ${ringingAlarm.snooze || 5} min`);
  stopActiveAlarm();
  saveAlarms();
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

// ================= WORLD CLOCKS =================
async function fetchWeather(city) {
  try {
    const response = await fetch(`https://wttr.in/${city}?format=j1`);

    const data = await response.json();

    return {
      temperature: data.current_condition[0].temp_C,
      icon: data.current_condition[0].weatherIconUrl[0].value,
      condition: data.current_condition[0].weatherDesc[0].value,
    };
  } catch (error) {
    console.error("Weather fetch failed:", error);

    return {
      temperature: "--",
      icon: "",
      condition: "clear",
    };
  }
}
function toggleWorldClockModal() {
  if (worldModal.classList.contains("hidden")) {
    worldModal.classList.remove("hidden");
    if (worldSearchInput) worldSearchInput.focus();
  } else {
    closeWorldClockModal();
  }
}

function closeWorldClockModal() {
  worldModal.classList.add("hidden");
  if (worldSearchInput) worldSearchInput.value = "";
  renderCountryOptions(countriesDatabase);
}

async function fetchWorldCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,timezones,flags",
    );
    const data = await response.json();
    countriesDatabase = data.sort((a, b) =>
      a.name.common.localeCompare(b.name.common),
    );
    renderCountryOptions(countriesDatabase);
  } catch (error) {
    console.error("Failed to fetch world countries:", error);
    if (worldTzOptionsList) {
      worldTzOptionsList.innerHTML = `<p style="color:#999;padding:12px;text-align:center;font-size:13px;">Network error loading countries.</p>`;
    }
  }
}

function renderCountryOptions(countries) {
  if (!worldTzOptionsList) return;
  worldTzOptionsList.innerHTML = "";

  if (countries.length === 0) {
    worldTzOptionsList.innerHTML = `<p style="color:var(--text-muted);padding:12px;text-align:center;font-size:13px;">No match found</p>`;
    return;
  }

  countries.forEach((country) => {
    const name = country.name.common;
    const flag = country.flags.svg || country.flags.png;
    const offset = country.timezones[0];

    const optionRow = document.createElement("div");
    optionRow.className = "country-option";

    const leftDiv = document.createElement("div");
    leftDiv.className = "country-option-left";
    leftDiv.innerHTML = `
      <img src="${flag}" alt="${name}" class="flag-img" loading="lazy" />
      <span>${name}</span>
    `;

    const offsetSpan = document.createElement("span");
    offsetSpan.className = "tz-code";
    offsetSpan.textContent = offset;

    optionRow.appendChild(leftDiv);
    optionRow.appendChild(offsetSpan);

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
    const filtered = countriesDatabase.filter((c) =>
      c.name.common.toLowerCase().includes(term),
    );
    renderCountryOptions(filtered);
  });
}
function getWeatherEmoji(condition, isDay) {
  const weather = condition.toLowerCase();

  if (weather.includes("clear")) {
    return isDay ? "☀️" : "🌙";
  }

  if (weather.includes("cloud")) {
    return isDay ? "⛅" : "☁️";
  }

  if (weather.includes("rain")) return "🌧️";
  if (weather.includes("storm")) return "⛈️";
  if (weather.includes("snow")) return "❄️";
  if (weather.includes("mist")) return "🌫️";

  return isDay ? "🌤️" : "🌌";
}
function addCountryClock(name, offset, flag) {
  const alreadyExists = worldClocks.some((item) => item.name === name);
  if (alreadyExists) {
    showToast("Clock already added!");
    return;
  }

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
    container.innerHTML = `<p class="empty-state">No secondary clocks added yet.</p>`;
    return;
  }

  worldClocks.forEach(async (clock, index) => {
    if (!weatherCache[clock.name]) {
      weatherCache[clock.name] = await fetchWeather(clock.name);
    }

    const weather = weatherCache[clock.name];
    const row = document.createElement("div");
    row.className = "world-clock-row";
    row.innerHTML = `
      <div class="world-clock-left">
        <img src="${clock.flag}" alt="${clock.name}" class="flag-img" loading="lazy" />
        <div>
          <div class="world-city-name">
            ${clock.name}
            <span class="time-of-day-badge" data-offset="${clock.offset}"></span>
          </div>
          <div class="world-offset-label">${clock.offset}</div>
        </div>
      </div>
      <div class="world-clock-right">
  <div class="world-time-weather">
    <span class="world-time-display ticking-world-time" data-offset="${clock.offset}">
      00:00:00
    </span>

    <div class="world-weather-inline">
  <span class="weather-emoji">
    ${getWeatherEmoji(
      weather.condition || "clear",
      new Date().getHours() >= 6 && new Date().getHours() < 18,
    )}
  </span>

  <span class="weather-temp">
    ${weather.temperature}°C
  </span>
  </div>
  </div>

  <button class="remove-btn" onclick="removeWorldClock(${index})" title="Remove">
    &times;
  </button>
</div>
    `;
    container.appendChild(row);
  });
}

function removeWorldClock(index) {
  worldClocks.splice(index, 1);
  localStorage.setItem("clock_worldClocks", JSON.stringify(worldClocks));
  renderWorldClocks();
}

function getTimeOfDayInfo(hour) {
  if (hour >= 5 && hour < 12) {
    return {
      label: "Morning",
      emoji: "🌅",
      class: "tod-morning",
    };
  } else if (hour >= 12 && hour < 16) {
    return {
      label: "Afternoon",
      emoji: "☀️",
      class: "tod-afternoon",
    };
  } else if (hour >= 16 && hour < 19) {
    return {
      label: "Evening",
      emoji: "🌇",
      class: "tod-evening",
    };
  } else {
    return {
      label: "Night",
      emoji: "🌙",
      class: "tod-night",
    };
  }
}

function tickWorldClocks() {
  const liveNodes = document.querySelectorAll(".ticking-world-time");
  const badgeNodes = document.querySelectorAll(".time-of-day-badge");

  badgeNodes.forEach((node) => {
    const offsetStr = node.getAttribute("data-offset");
    const now = new Date();
    const utcTimeMs = now.getTime() + now.getTimezoneOffset() * 60000;

    let mathematicalHoursOffset = 0;
    if (offsetStr.includes("+") || offsetStr.includes("-")) {
      const modifier = offsetStr.includes("+") ? 1 : -1;
      const cleanSegments = offsetStr
        .replace("UTC", "")
        .replace("+", "")
        .replace("-", "")
        .split(":");
      const hoursSegment = parseInt(cleanSegments[0]) || 0;
      const minutesSegment = parseInt(cleanSegments[1]) || 0;
      mathematicalHoursOffset = modifier * (hoursSegment + minutesSegment / 60);
    }

    const targetedTime = new Date(
      utcTimeMs + 3600000 * mathematicalHoursOffset,
    );
    const hour = targetedTime.getHours();
    const info = getTimeOfDayInfo(hour);

    node.textContent = `${info.emoji} ${info.label}`;
    node.className = `time-of-day-badge ${info.class}`;
  });

  liveNodes.forEach((node) => {
    const offsetStr = node.getAttribute("data-offset");
    const now = new Date();
    const utcTimeMs = now.getTime() + now.getTimezoneOffset() * 60000;

    let mathematicalHoursOffset = 0;
    if (offsetStr.includes("+") || offsetStr.includes("-")) {
      const modifier = offsetStr.includes("+") ? 1 : -1;
      const cleanSegments = offsetStr
        .replace("UTC", "")
        .replace("+", "")
        .replace("-", "")
        .split(":");
      const hoursSegment = parseInt(cleanSegments[0]) || 0;
      const minutesSegment = parseInt(cleanSegments[1]) || 0;
      mathematicalHoursOffset = modifier * (hoursSegment + minutesSegment / 60);
    }

    const targetedTime = new Date(
      utcTimeMs + 3600000 * mathematicalHoursOffset,
    );

    node.textContent = targetedTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !is24HourFormat,
    });
  });
}

// ================= HISTORY =================
function renderHistoryLogs() {
  const container = document.getElementById("history-logs");
  if (!container) return;

  if (historyLogs.length === 0) {
    container.innerHTML = `<div class="log-entry" style="justify-content:center;">History is empty.</div>`;
    return;
  }

  container.innerHTML = historyLogs
    .map((log) => `<div class="log-entry"><span>${log.text}</span></div>`)
    .join("");
}

// Cleaned up duplicate toggleDarkMode and lightMode localStorage logic
function clearAlarm() {
  localStorage.removeItem("alarmTime");

  alarmTime = null;

  alarmTriggered = false;

  alarmStatus.textContent = "Not Set";

  showToast("Alarm cleared");
}

// ================= TIMEZONE DROPDOWN =================
function populateTimezoneDropdown() {
  const container = document.getElementById("tz-options-list");
  if (!container) return;
  container.innerHTML = TIMEZONES.map(
    (tz) =>
      `<div class="tz-option ${tz.id === primaryTimezone ? "selected" : ""}" onclick="selectPrimaryTimezone('${tz.id}', '${tz.name}')">
      <span>${tz.name}</span>
      <span class="tz-code">${tz.code}</span>
    </div>`,
  ).join("");
}

function selectPrimaryTimezone(id, name) {
  primaryTimezone = id;
  localStorage.setItem("primaryTimezone", id);
  document.getElementById("selected-tz-display").textContent = name;
  if (timezoneLabel) timezoneLabel.textContent = name;
  document.getElementById("tz-options-container").classList.add("hidden");
  document.getElementById("primary-timezone-wrapper").classList.remove("open");
  updateClock();
}

window.toggleTimezoneDropdown = function (e) {
  e.stopPropagation();
  const container = document.getElementById("tz-options-container");
  const wrapper = document.getElementById("primary-timezone-wrapper");

  container.classList.toggle("hidden");
  wrapper.classList.toggle("open", !container.classList.contains("hidden"));
};

function filterTimezones() {
  const input = document.getElementById("tz-search-input").value.toLowerCase();
  const options = document.getElementById("tz-options-list").children;
  for (let opt of options) {
    opt.style.display = opt.textContent.toLowerCase().includes(input)
      ? "flex"
      : "none";
  }
}

// Close dropdown on outside click
document.addEventListener("click", () => {
  const container = document.getElementById("tz-options-container");
  const wrapper = document.getElementById("primary-timezone-wrapper");
  if (container && !container.classList.contains("hidden")) {
    container.classList.add("hidden");
    if (wrapper) wrapper.classList.remove("open");
  }
});

// ================= ALARM MANAGEMENT =================
function renderAlarmsList() {
  const container = document.getElementById("alarms-list");
  if (!container) return;

  if (alarms.length === 0) {
    container.innerHTML = `<p class="empty-state">No alarms set. Add one above!</p>`;
    return;
  }

  container.innerHTML = alarms
    .map((alarm) => {
      const [h, m] = alarm.time.split(":");
      const h24 = parseInt(h);
      const ampm = h24 >= 12 ? "PM" : "AM";
      const h12 = h24 % 12 || 12;
      const formattedTime = `${String(h12).padStart(2, "0")}:${m}`;

      return `
      <div class="alarm-item">
        <div class="alarm-item-left">
          <div>
            <span class="alarm-item-time">${formattedTime}</span>
            <span class="alarm-item-ampm">${ampm}</span>
          </div>
          <div class="alarm-item-meta">
            <span class="alarm-item-label">${escapeHtml(alarm.label)}</span>
          </div>
        </div>
        <div class="alarm-item-right">
          <label class="toggle">
            <input type="checkbox" ${alarm.enabled ? "checked" : ""} onchange="toggleAlarmEnabled(${alarm.id}, this.checked)" />
            <span class="toggle-slider"></span>
          </label>
          <button class="remove-btn" onclick="deleteAlarm(${alarm.id})" title="Delete">&times;</button>
        </div>
      </div>
    `;
    })
    .join("");
}

function toggleAlarmEnabled(id, enabled) {
  const alarm = alarms.find((a) => a.id === id);
  if (alarm) {
    alarm.enabled = enabled;
    saveAlarms();
    updateAlarmSummary();
    showToast(enabled ? "Alarm enabled" : "Alarm disabled");
  }
}

function deleteAlarm(id) {
  alarms = alarms.filter((a) => a.id !== id);
  saveAlarms();
  renderAlarmsList();
  updateAlarmSummary();
  showToast("Alarm deleted");
}

function clearAllAlarms() {
  if (alarms.length === 0) {
    showToast("No alarms to clear");
    return;
  }
  alarms = [];
  saveAlarms();
  renderAlarmsList();
  updateAlarmSummary();
  showToast("All alarms cleared");
}

function toggleAlarmSection() {
  const controls = document.getElementById("alarm-controls");
  const btn = document.getElementById("alarm-section-toggle");
  controls.classList.toggle("hidden");
  btn.classList.toggle("active", !controls.classList.contains("hidden"));
}

function saveAlarms() {
  localStorage.setItem("clock_alarms", JSON.stringify(alarms));
}

function updateAlarmSummary() {
  const count = alarms.filter((a) => a.enabled).length;
  if (alarmStatus)
    alarmStatus.textContent = count > 0 ? count + " Active" : "None Active";
}

// ================= TOAST =================
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ================= UTILITY =================
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ================= DARK MODE =================
function applyDarkMode(enabled) {
  isDarkMode = enabled;
  document.body.classList.toggle("dark-mode", enabled);
  document.querySelectorAll(".dark-mode-btn").forEach(btn => {
    if (btn.id === "dark-mode-toggle") {
      btn.textContent = enabled ? "☀️" : "🌙";
    } else {
      btn.textContent = enabled ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
  });
  localStorage.setItem("clockDarkMode", enabled);
}

function toggleDarkMode() {
  applyDarkMode(!isDarkMode);
}



function toggleHistoryLogs() {
  const logs = document.getElementById("history-logs");
  const chevron = document.getElementById("history-chevron");

  if (!logs) return;

  logs.classList.toggle("hidden");

  if (chevron) {
    chevron.style.transform =
      logs.classList.contains("hidden")
        ? "rotate(0deg)"
        : "rotate(180deg)";
  }
}
