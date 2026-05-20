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

// Supported global timezones
const TIMEZONES = [
  { id: "local", name: "Local Time" },
  { id: "UTC", name: "UTC / GMT" },
  { id: "America/New_York", name: "New York (US Eastern)" },
  { id: "America/Chicago", name: "Chicago (US Central)" },
  { id: "America/Denver", name: "Denver (US Mountain)" },
  { id: "America/Los_Angeles", name: "Los Angeles (US Pacific)" },
  { id: "America/Anchorage", name: "Anchorage (Alaska)" },
  { id: "Pacific/Honolulu", name: "Honolulu (Hawaii)" },
  { id: "America/Sao_Paulo", name: "São Paulo (Brazil)" },
  { id: "Europe/London", name: "London (UK)" },
  { id: "Europe/Paris", name: "Paris (Western Europe)" },
  { id: "Europe/Berlin", name: "Berlin (Central Europe)" },
  { id: "Europe/Moscow", name: "Moscow (Russia)" },
  { id: "Africa/Cairo", name: "Cairo (Egypt)" },
  { id: "Africa/Johannesburg", name: "Johannesburg (South Africa)" },
  { id: "Asia/Dubai", name: "Dubai (Gulf Standard)" },
  { id: "Asia/Kolkata", name: "Kolkata (India)" },
  { id: "Asia/Dhaka", name: "Dhaka (Bangladesh)" },
  { id: "Asia/Bangkok", name: "Bangkok (Thailand)" },
  { id: "Asia/Singapore", name: "Singapore" },
  { id: "Asia/Shanghai", name: "Shanghai (China)" },
  { id: "Asia/Tokyo", name: "Tokyo (Japan)" },
  { id: "Australia/Perth", name: "Perth (Western Australia)" },
  { id: "Australia/Adelaide", name: "Adelaide (Central Australia)" },
  { id: "Australia/Sydney", name: "Sydney (Eastern Australia)" },
  { id: "Pacific/Auckland", name: "Auckland (New Zealand)" }
];

// App startup initialization
document.addEventListener("DOMContentLoaded", () => {
  // Fallback system auto-detect for local timezone
  if (primaryTimezone === "local") {
    try {
      const detectedZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (TIMEZONES.some(t => t.id === detectedZone)) {
        primaryTimezone = detectedZone;
        localStorage.setItem("primaryTimezone", detectedZone);
      }
    } catch (err) {
      console.warn("Timezone detection failed:", err);
    }
  }

  setTheme(activeTheme);

  // Close timezone custom select when clicking elsewhere
  document.addEventListener("click", () => {
    document.getElementById("tz-options-container").classList.add("hidden");
    document.getElementById("primary-timezone-wrapper").classList.remove("open");
  });

  populateTimezoneDropdown();
  populateWorldClockModalList();
  renderAlarmsList();
  renderWorldClocks();
  renderHistoryLogs();
  updateAlarmSummary();

  // Prompt user notifications early when they interact with alarm inputs
  document.getElementById("alarm-controls").addEventListener("click", requestNotificationPermission);

  // Start tick loops
  updateClock();
  setInterval(updateClock, 1000);
});

// Switch visual interface styles
function setTheme(theme) {
  activeTheme = theme;
  localStorage.setItem("clockTheme", theme);

  const body = document.body;
  const card = document.getElementById("main-clock-card");

  body.className = `${theme}-theme`;
  card.className = `clock-card ${theme}-clock-card`;

  // Update active state class on selectors
  document.querySelectorAll(".theme-btn").forEach(btn => {
    btn.classList.toggle("active", btn.classList.contains(`${theme}-btn`));
  });

  document.getElementById("theme-label").textContent = `${theme.toUpperCase()} MODE`;
  showToast(`Theme switched to ${theme}`);
}

// Custom Searchable Dropdown
function toggleTimezoneDropdown(e) {
  e.stopPropagation();
  const container = document.getElementById("tz-options-container");
  const wrapper = document.getElementById("primary-timezone-wrapper");
  const searchInput = document.getElementById("tz-search-input");
  
  const opening = container.classList.toggle("hidden");
  wrapper.classList.toggle("open", !opening);

  if (!opening) {
    searchInput.value = "";
    filterTimezones();
    searchInput.focus();
  }
}

// Compute accurate GMT offsets
function getOffsetString(timezone) {
  if (timezone === "local") {
    const mins = -new Date().getTimezoneOffset();
    const sign = mins >= 0 ? "+" : "-";
    const h = String(Math.floor(Math.abs(mins) / 60)).padStart(2, "0");
    const m = String(Math.abs(mins) % 60).padStart(2, "0");
    return `GMT${sign}${h}:${m}`;
  }
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "longOffset"
    }).formatToParts(new Date());
    const match = parts.find(p => p.type === "timeZoneName");
    return match ? match.value : "GMT+00:00";
  } catch (e) {
    return "GMT+00:00";
  }
}

function populateTimezoneDropdown() {
  const optionsList = document.getElementById("tz-options-list");
  optionsList.innerHTML = "";

  TIMEZONES.forEach(tz => {
    const offset = getOffsetString(tz.id);
    const item = document.createElement("div");
    item.className = `custom-option ${tz.id === primaryTimezone ? "selected" : ""}`;
    item.onclick = () => selectPrimaryTimezone(tz.id);
    item.innerHTML = `
      <span>${tz.name}</span>
      <span class="tz-offset">${offset}</span>
    `;
    optionsList.appendChild(item);
  });

  const selected = TIMEZONES.find(t => t.id === primaryTimezone) || TIMEZONES[0];
  document.getElementById("selected-tz-display").textContent = selected.name;
  timezoneLabel.textContent = selected.name;
}

function selectPrimaryTimezone(tzId) {
  primaryTimezone = tzId;
  localStorage.setItem("primaryTimezone", tzId);
  
  populateTimezoneDropdown();
  document.getElementById("tz-options-container").classList.add("hidden");
  document.getElementById("primary-timezone-wrapper").classList.remove("open");
  
  updateClock();
  showToast(`Primary clock set to ${TIMEZONES.find(t => t.id === tzId).name}`);
}

function filterTimezones() {
  const query = document.getElementById("tz-search-input").value.toLowerCase();
  document.querySelectorAll("#tz-options-list .custom-option").forEach(opt => {
    opt.style.display = opt.textContent.toLowerCase().includes(query) ? "flex" : "none";
  });
}

// Primary Render Engine
function updateClock() {
  let now = new Date();
  
  if (primaryTimezone !== "local") {
    try {
      now = new Date(now.toLocaleString("en-US", { timeZone: primaryTimezone }));
    } catch (e) {
      console.error("Timezone offset translation error:", e);
    }
  }

  const rawHours = now.getHours();
  const rawMinutes = now.getMinutes();
  const rawSeconds = now.getSeconds();
  
  const currentHHMM = `${String(rawHours).padStart(2, "0")}:${String(rawMinutes).padStart(2, "0")}`;
  const ampm = rawHours >= 12 ? "PM" : "AM";
  
  let dispHours = rawHours % 12;
  if (dispHours === 0) dispHours = 12;

  // Optimized selective DOM ticks to avoid layout thrashing
  if (hoursEl.textContent !== String(dispHours).padStart(2, "0")) {
    hoursEl.textContent = String(dispHours).padStart(2, "0");
  }
  if (minutesEl.textContent !== String(rawMinutes).padStart(2, "0")) {
    minutesEl.textContent = String(rawMinutes).padStart(2, "0");
  }
  if (secondsEl.textContent !== String(rawSeconds).padStart(2, "0")) {
    secondsEl.textContent = String(rawSeconds).padStart(2, "0");
  }
  if (ampmEl.textContent !== ampm) {
    ampmEl.textContent = ampm;
  }

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const dayStr = days[now.getDay()];
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  if (dayNameEl.textContent !== dayStr) dayNameEl.textContent = dayStr;
  if (fullDateEl.textContent !== dateStr) fullDateEl.textContent = dateStr;

  tickWorldClocks();
  checkAlarms(currentHHMM);
}

// Alarm controls panel expander
function toggleAlarmSection() {
  const panel = document.getElementById("alarm-controls");
  const visible = panel.classList.toggle("hidden");
  
  document.getElementById("alarm-section-toggle").classList.toggle("active", !visible);

  if (!visible) {
    const timeInput = document.getElementById("alarm-time");
    if (!timeInput.value) {
      const now = new Date();
      timeInput.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    }
  }
}

function updateAlarmSummary() {
  const activeCount = alarms.filter(a => a.enabled).length;
  alarmStatus.textContent = activeCount === 0 ? "None Active" : `${activeCount} Active`;
  alarmStatus.style.color = activeCount === 0 ? "var(--soft-text)" : "var(--primary)";
}

// Create new alarm
function addNewAlarm() {
  const timeInput = document.getElementById("alarm-time");
  const labelInput = document.getElementById("alarm-label");
  const toneSelect = document.getElementById("alarm-tone");
  const snoozeSelect = document.getElementById("alarm-snooze");

  if (!timeInput.value) {
    showToast("Please select a time!");
    return;
  }

  // Pre-unlock sound layers for mobile safari
  initAudio();

  const newAlarm = {
    id: Date.now(),
    time: timeInput.value,
    label: labelInput.value.trim() || "Alarm",
    tone: toneSelect.value,
    snooze: parseInt(snoozeSelect.value),
    enabled: true,
    snoozeCount: 0,
    snoozedTime: null
  };

  alarms.push(newAlarm);
  localStorage.setItem("clock_alarms", JSON.stringify(alarms));
  
  labelInput.value = "";
  
  renderAlarmsList();
  updateAlarmSummary();
  addHistoryLog(`Alarm [${newAlarm.label}] set for ${formatAMPM(newAlarm.time)}`);
  showToast(`Alarm set for ${formatAMPM(newAlarm.time)}`);
}

function renderAlarmsList() {
  const list = document.getElementById("alarms-list");
  list.innerHTML = "";

  if (alarms.length === 0) {
    list.innerHTML = '<p class="empty-list-placeholder">No alarms set. Add one above!</p>';
    return;
  }

  // Sort chronological
  [...alarms].sort((a, b) => a.time.localeCompare(b.time)).forEach(alarm => {
    const item = document.createElement("div");
    item.className = `alarm-item ${alarm.enabled ? "" : "disabled-opacity"}`;

    const formatted = formatAMPM(alarm.time);
    const [t, p] = formatted.split(" ");
    
    item.innerHTML = `
      <div class="alarm-item-left">
        <div class="alarm-item-time-row">
          <span class="alarm-item-time">${t}</span>
          <span class="alarm-item-ampm">${p}</span>
        </div>
        <div class="alarm-item-meta">
          <span class="alarm-item-label">${escapeHTML(alarm.label)}</span>
          <span class="alarm-item-tone">🎵 ${getToneLabel(alarm.tone)}</span>
        </div>
      </div>
      <div class="alarm-item-right">
        <label class="switch">
          <input type="checkbox" ${alarm.enabled ? "checked" : ""} onchange="toggleAlarmEnabled(${alarm.id})" />
          <span class="slider"></span>
        </label>
        <button class="delete-alarm-btn" onclick="deleteAlarm(${alarm.id})" title="Remove Alarm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
    list.appendChild(item);
  });
}

function toggleAlarmEnabled(id) {
  const alarm = alarms.find(a => a.id === id);
  if (alarm) {
    alarm.enabled = !alarm.enabled;
    alarm.snoozedTime = null;
    alarm.snoozeCount = 0;
    
    localStorage.setItem("clock_alarms", JSON.stringify(alarms));
    renderAlarmsList();
    updateAlarmSummary();
    
    const status = alarm.enabled ? "enabled" : "disabled";
    addHistoryLog(`Alarm [${alarm.label}] ${status}`);
    showToast(`Alarm [${alarm.label}] ${status}`);
  }
}

function deleteAlarm(id) {
  const alarm = alarms.find(a => a.id === id);
  const label = alarm ? alarm.label : "Alarm";
  
  alarms = alarms.filter(a => a.id !== id);
  localStorage.setItem("clock_alarms", JSON.stringify(alarms));
  
  renderAlarmsList();
  updateAlarmSummary();
  addHistoryLog(`Alarm [${label}] removed`);
  showToast(`Alarm removed`);

  if (ringingAlarm && ringingAlarm.id === id) {
    stopActiveAlarm();
  }
}

function clearAllAlarms() {
  if (alarms.length === 0) return;
  
  alarms = [];
  localStorage.setItem("clock_alarms", JSON.stringify(alarms));
  renderAlarmsList();
  updateAlarmSummary();
  
  if (ringingAlarm) stopActiveAlarm();
  
  addHistoryLog("Cleared all alarms");
  showToast("Cleared all alarms");
}

function getToneLabel(tone) {
  const labels = { classic: "Classic Beep", cyber: "Cyber Wave", retro: "Retro Chime", mp3: "Standard MP3" };
  return labels[tone] || "Beep";
}

function formatAMPM(time24) {
  const [h, m] = time24.split(":");
  let hrs = parseInt(h);
  const ampm = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12 || 12;
  return `${String(hrs).padStart(2, "0")}:${m} ${ampm}`;
}

// Alarm ringing triggers
function checkAlarms(currentHHMM) {
  const nowMs = Date.now();

  alarms.forEach(alarm => {
    if (!alarm.enabled) return;

    if (alarm.snoozedTime === null) {
      // Normal trigger matching once per minute
      if (alarm.time === currentHHMM && lastCheckedMinute !== currentHHMM) {
        triggerAlarm(alarm);
      }
    } else if (nowMs >= alarm.snoozedTime) {
      // Snooze triggered
      triggerAlarm(alarm);
    }
  });

  lastCheckedMinute = currentHHMM;
}

function triggerAlarm(alarm) {
  ringingAlarm = alarm;

  popupAlarmTitle.textContent = "Alarm Ringing!";
  popupAlarmTime.textContent = formatAMPM(alarm.time);
  popupAlarmLabel.textContent = alarm.label;
  alarmPopup.classList.remove("hidden");

  startRinger(alarm.tone);

  if ("vibrate" in navigator) {
    navigator.vibrate([300, 120, 300, 120, 300]);
  }

  triggerBrowserNotification(`⏰ Alarm: ${alarm.label}`, `Time is up: ${formatAMPM(alarm.time)}!`);
  addHistoryLog(`Alarm [${alarm.label}] triggered`);
}

// Core web audio synthesizers
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function startRinger(tone) {
  initAudio();
  stopRinger();

  if (tone === "mp3") {
    alarmSound.currentTime = 0;
    alarmSound.loop = true;
    alarmSound.play().catch(err => {
      console.warn("Audio file blocked, using backup synth beep", err);
      startSynthLoop("classic");
    });
  } else {
    startSynthLoop(tone);
  }
}

function startSynthLoop(tone) {
  ringInterval = setInterval(() => {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    
    if (tone === "classic") {
      playClassicBeep(audioCtx, now);
    } else if (tone === "cyber") {
      playCyberSynth(audioCtx, now);
    } else if (tone === "retro") {
      playRetroChiptune(audioCtx, now);
    }
  }, 600);
}

function stopRinger() {
  if (ringInterval) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
  alarmSound.pause();
  alarmSound.currentTime = 0;
}

function playClassicBeep(ctx, time) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "square";
  osc.frequency.setValueAtTime(987.77, time); // B5 note
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.setValueAtTime(0.3, time + 0.02);
  gain.gain.setValueAtTime(0, time + 0.15);
  gain.gain.setValueAtTime(0.3, time + 0.20);
  gain.gain.setValueAtTime(0, time + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(time);
  osc.stop(time + 0.4);
}

function playCyberSynth(ctx, time) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc1.type = "sawtooth";
  osc2.type = "sine";
  
  osc1.frequency.setValueAtTime(140, time);
  osc1.frequency.exponentialRampToValueAtTime(880, time + 0.35);
  osc2.frequency.setValueAtTime(440, time);
  
  gain.gain.setValueAtTime(0, time);
  gain.gain.setValueAtTime(0.2, time + 0.02);
  gain.gain.setValueAtTime(0, time + 0.4);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  
  osc1.start(time);
  osc2.start(time);
  
  osc1.stop(time + 0.45);
  osc2.stop(time + 0.45);
}

function playRetroChiptune(ctx, time) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "triangle";
  
  const sweepNotes = [523.25, 659.25, 783.99, 1046.50]; // C Major
  osc.frequency.setValueAtTime(sweepNotes[0], time);
  osc.frequency.setValueAtTime(sweepNotes[1], time + 0.06);
  osc.frequency.setValueAtTime(sweepNotes[2], time + 0.12);
  osc.frequency.setValueAtTime(sweepNotes[3], time + 0.18);

  gain.gain.setValueAtTime(0, time);
  gain.gain.setValueAtTime(0.4, time + 0.02);
  gain.gain.setValueAtTime(0, time + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(time);
  osc.stop(time + 0.4);
}

function stopActiveAlarm() {
  if (!ringingAlarm) return;

  stopRinger();
  
  const alarm = alarms.find(a => a.id === ringingAlarm.id);
  if (alarm) {
    alarm.snoozedTime = null;
    alarm.snoozeCount = 0;
    localStorage.setItem("clock_alarms", JSON.stringify(alarms));
  }

  alarmPopup.classList.add("hidden");
  addHistoryLog(`Alarm [${ringingAlarm.label}] stopped`);
  showToast(`Alarm stopped`);
  
  ringingAlarm = null;
  renderAlarmsList();
  updateAlarmSummary();
}

function snoozeActiveAlarm() {
  if (!ringingAlarm) return;

  stopRinger();

  const alarm = alarms.find(a => a.id === ringingAlarm.id);
  if (alarm) {
    alarm.snoozeCount += 1;
    alarm.snoozedTime = Date.now() + alarm.snooze * 60 * 1000;
    
    localStorage.setItem("clock_alarms", JSON.stringify(alarms));
    addHistoryLog(`Alarm [${alarm.label}] snoozed (${alarm.snoozeCount})`);
    showToast(`Snoozed for ${alarm.snooze} min`);
  }

  alarmPopup.classList.add("hidden");
  ringingAlarm = null;
  renderAlarmsList();
}

// Dynamic notifications
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function triggerBrowserNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body, tag: "neon-clock-alarm", requireInteraction: true });
    } catch (err) {
      console.log("Desktop push failed:", err);
    }
  }
}

// Activity logging systems
function toggleHistoryLogs() {
  const container = document.getElementById("history-logs");
  const closed = container.classList.toggle("hidden");
  document.getElementById("history-chevron").textContent = closed ? "▼" : "▲";
}

function addHistoryLog(text) {
  const now = new Date();
  const timeStr = now.toTimeString().split(" ")[0];
  
  historyLogs.unshift({ time: timeStr, text });
  
  if (historyLogs.length > 30) historyLogs.pop();

  localStorage.setItem("clock_historyLogs", JSON.stringify(historyLogs));
  renderHistoryLogs();
}

function renderHistoryLogs() {
  const container = document.getElementById("history-logs");
  if (!container) return;

  if (historyLogs.length === 0) {
    container.innerHTML = '<p class="empty-logs-placeholder">History logs are empty.</p>';
    return;
  }

  container.innerHTML = "";
  historyLogs.forEach(log => {
    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = `<span class="log-time">[${escapeHTML(log.time)}]</span> <span class="log-text">${escapeHTML(log.text)}</span>`;
    container.appendChild(entry);
  });
}

// World Clocks additions
function toggleWorldClockModal() {
  const modal = document.getElementById("world-clock-modal");
  const opened = modal.classList.toggle("hidden");
  
  if (!opened) {
    const worldInput = document.getElementById("world-search-input");
    worldInput.value = "";
    filterWorldTimezones();
    worldInput.focus();
  }
}

function closeWorldClockModal() {
  document.getElementById("world-clock-modal").classList.add("hidden");
}

function populateWorldClockModalList() {
  const list = document.getElementById("world-tz-options-list");
  list.innerHTML = "";

  TIMEZONES.filter(z => z.id !== "local").forEach(tz => {
    const offset = getOffsetString(tz.id);
    const item = document.createElement("div");
    item.className = "world-tz-option";
    item.onclick = () => addWorldClock(tz.id);
    item.innerHTML = `
      <span>${tz.name}</span>
      <span class="tz-offset">${offset}</span>
    `;
    list.appendChild(item);
  });
}

function filterWorldTimezones() {
  const query = document.getElementById("world-search-input").value.toLowerCase();
  document.querySelectorAll("#world-tz-options-list .world-tz-option").forEach(opt => {
    opt.style.display = opt.textContent.toLowerCase().includes(query) ? "flex" : "none";
  });
}

function addWorldClock(tzId) {
  if (worldClocks.includes(tzId)) {
    showToast("This city is already active!");
    closeWorldClockModal();
    return;
  }

  worldClocks.push(tzId);
  localStorage.setItem("clock_worldClocks", JSON.stringify(worldClocks));
  
  renderWorldClocks();
  closeWorldClockModal();
  addHistoryLog(`World Clock added: ${TIMEZONES.find(t => t.id === tzId).name}`);
  showToast("Added world clock");
}

function removeWorldClock(tzId) {
  worldClocks = worldClocks.filter(id => id !== tzId);
  localStorage.setItem("clock_worldClocks", JSON.stringify(worldClocks));
  
  renderWorldClocks();
  addHistoryLog(`World Clock removed: ${TIMEZONES.find(t => t.id === tzId).name}`);
  showToast("World clock removed");
}

function renderWorldClocks() {
  const container = document.getElementById("world-clocks-list");
  container.innerHTML = "";

  if (worldClocks.length === 0) {
    container.innerHTML = `
      <p class="empty-list-placeholder" style="grid-column: 1 / -1;">
        No secondary clocks added. Click "+ Add Clock" to create world cities!
      </p>
    `;
    return;
  }

  worldClocks.forEach(tzId => {
    const data = TIMEZONES.find(t => t.id === tzId);
    if (!data) return;

    const key = tzId.replace(/\//g, "-");
    const card = document.createElement("div");
    card.className = "world-clock-card";
    card.id = `wc-${key}`;
    
    card.innerHTML = `
      <button class="world-clock-remove" onclick="removeWorldClock('${tzId}')">&times;</button>
      <div>
        <div class="world-city">${data.name.split(" (")[0]}</div>
        <div class="world-offset" id="wc-offset-${key}">Calculating...</div>
      </div>
      <div class="world-time-wrapper">
        <span class="world-time" id="wc-time-${key}">00:00:00</span>
        <span class="world-ampm" id="wc-ampm-${key}">AM</span>
      </div>
      <div class="world-date" id="wc-date-${key}">-- -- ----</div>
    `;
    container.appendChild(card);
  });
  
  tickWorldClocks();
}

// Compute differences relative to primary clock
function getOffsetDiffString(mainTz, secondaryTz) {
  try {
    const d = new Date();
    const parse = (tz) => new Date(d.toLocaleString("en-US", { hour12: false, timeZone: tz === "local" ? undefined : tz }));
    
    const diffHrs = (parse(secondaryTz).getTime() - parse(mainTz).getTime()) / 3600000;
    const rounded = Math.round(diffHrs * 10) / 10;
    
    if (rounded === 0) return "Same time";
    return `${rounded > 0 ? "+" : ""}${rounded}h relative to primary`;
  } catch (e) {
    return "";
  }
}

function tickWorldClocks() {
  if (worldClocks.length === 0) return;

  worldClocks.forEach(tzId => {
    const key = tzId.replace(/\//g, "-");
    const timeEl = document.getElementById(`wc-time-${key}`);
    const ampmEl = document.getElementById(`wc-ampm-${key}`);
    const dateEl = document.getElementById(`wc-date-${key}`);
    const offsetEl = document.getElementById(`wc-offset-${key}`);

    if (!timeEl) return;

    let now = new Date();
    try {
      now = new Date(now.toLocaleString("en-US", { timeZone: tzId }));
    } catch(err) {
      console.error(err);
    }

    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    
    const disp = h % 12 === 0 ? 12 : h % 12;
    const ampm = h >= 12 ? "PM" : "AM";
    const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const timeStr = `${String(disp).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    const dateStr = `${now.getDate()} ${shortMonths[now.getMonth()]} ${now.getFullYear()}`;

    if (timeEl.textContent !== timeStr) timeEl.textContent = timeStr;
    if (ampmEl.textContent !== ampm) ampmEl.textContent = ampm;
    if (dateEl.textContent !== dateStr) dateEl.textContent = dateStr;
    
    const offsetLabel = getOffsetDiffString(primaryTimezone, tzId);
    if (offsetEl.textContent !== offsetLabel) offsetEl.textContent = offsetLabel;
  });
}

// Compact toast alerts
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

// Security: Sanitization to prevent XSS (Cross-Site Scripting)
function escapeHTML(str) {
  if (!str) return "";
  return String(str).replace(/[&<>'"]/g, tag => {
    const chars = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    };
    return chars[tag] || tag;
  });
}