// App configuration and state
let activeTheme = localStorage.getItem("clockTheme") || "classic";
if (activeTheme === "future") activeTheme = "futuristic";
let primaryTimezone = localStorage.getItem("primaryTimezone") || "local";
let alarms = JSON.parse(localStorage.getItem("clock_alarms")) || [];
let worldClocks = JSON.parse(localStorage.getItem("clock_worldClocks")) || [];
let historyLogs = JSON.parse(localStorage.getItem("clock_historyLogs")) || [];

let ringingAlarm = null;
let lastCheckedMinute = "";
let ringInterval = null;
let audioCtx = null;
let triggeredAlarms = new Set();
let editingAlarmId = null;

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
const alarmTimeInput = document.getElementById("alarm-time");
const alarmLabelInput = document.getElementById("alarm-label");
const alarmToneInput = document.getElementById("alarm-tone");
const alarmSnoozeInput = document.getElementById("alarm-snooze");
const alarmSnoozeCustomWrap = document.getElementById("alarm-snooze-custom-wrap");
const alarmSnoozeCustomInput = document.getElementById("alarm-snooze-custom");
const alarmForm = document.querySelector(".alarm-form");
const alarmSubmitButton = document.getElementById("alarm-submit-btn");
const alarmCancelButton = document.getElementById("alarm-cancel-btn");
const clearAllButton = document.getElementById("clear-all-btn");
const confirmModal = document.getElementById("confirm-modal");
const confirmModalMessage = document.getElementById("confirm-modal-message");
const confirmModalYes = document.getElementById("confirm-modal-yes");
const historyHeader = document.getElementById("history-header");
const historyChevron = document.getElementById("history-chevron");

// World Clock Modal DOM
const worldModal = document.getElementById("world-clock-modal");
const worldSearchInput = document.getElementById("world-search-input");
const worldTzOptionsList = document.getElementById("world-tz-options-list");
let countriesDatabase = [];
let confirmAction = null;

// Supported timezones
const TIMEZONES = [
  { id: "local", name: "Local Time", code: "LOC" },
  { id: "UTC", name: "UTC / GMT", code: "UTC" },
  { id: "Asia/Kolkata", name: "Kolkata (India)", code: "IST" },
  { id: "Asia/Tokyo", name: "Tokyo (Japan)", code: "JST" },
  { id: "Europe/London", name: "London (UK)", code: "GMT" },
  { id: "America/New_York", name: "New York", code: "EST" }
];

// INIT
document.addEventListener("DOMContentLoaded", () => {
  setTheme(activeTheme);
  normalizeAlarms();
  updateSnoozeCustomVisibility();

  populateTimezoneDropdown();
  renderAlarmsList();
  renderWorldClocks();
  renderHistoryLogs();
  updateAlarmSummary();

  fetchWorldCountries();

  updateClock();
  setInterval(() => {
    updateClock();
    tickWorldClocks();
  }, 1000);
});

// ================= THEME =================
function setTheme(theme) {
  activeTheme = theme;
  localStorage.setItem("clockTheme", theme);

  document.body.className = `${theme}-theme`;
  document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";

  document.querySelectorAll(".theme-swatch").forEach(swatch => {
    swatch.classList.toggle("active", swatch.dataset.theme === theme);
  });

  const labelMap = {
    classic: "CLASSIC",
    modern: "MODERN",
    futuristic: "CYBER",
    nebula: "NEBULA",
    dark: "MIDNIGHT"
  };
  const badge = document.getElementById("theme-label");
  if (badge) badge.textContent = labelMap[theme] || "CLASSIC";

  showToast(`Theme: ${labelMap[theme] || theme}`);
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

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  dayNameEl.textContent = days[now.getDay()];
  fullDateEl.textContent = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  checkAlarms(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
}

// ================= ALARMS =================
function normalizeAlarms() {
  const now = Date.now();
  alarms = alarms.map(alarm => {
    const normalized = {
      ...alarm,
      tone: alarm.tone || "classic",
      enabled: alarm.enabled !== false,
      snoozeMinutes: Number(alarm.snoozeMinutes ?? alarm.snooze ?? 5) || 5,
      snoozedUntil: alarm.snoozedUntil || null,
      isRinging: false
    };

    if (normalized.snoozedUntil && normalized.snoozedUntil <= now) {
      normalized.snoozedUntil = null;
    }

    normalized.nextTriggerAt = normalized.snoozedUntil || getNextTriggerTimestamp(normalized.time, now);
    return normalized;
  });
  saveAlarms();
}

function getNextTriggerTimestamp(timeValue, baseTimestamp = Date.now()) {
  if (!timeValue) return baseTimestamp;

  const [hours, minutes] = timeValue.split(":").map(Number);
  const nextTrigger = new Date(baseTimestamp);
  nextTrigger.setSeconds(0, 0);
  nextTrigger.setHours(hours, minutes, 0, 0);

  if (nextTrigger.getTime() <= baseTimestamp) {
    nextTrigger.setDate(nextTrigger.getDate() + 1);
  }

  return nextTrigger.getTime();
}

function getSelectedSnoozeMinutes() {
  const selectedValue = alarmSnoozeInput ? alarmSnoozeInput.value : "5";
  if (selectedValue === "custom") {
    const customMinutes = parseInt(alarmSnoozeCustomInput?.value, 10);
    return Number.isFinite(customMinutes) && customMinutes > 0 ? customMinutes : 5;
  }

  const presetMinutes = parseInt(selectedValue, 10);
  return Number.isFinite(presetMinutes) && presetMinutes > 0 ? presetMinutes : 5;
}

function updateSnoozeCustomVisibility() {
  if (!alarmSnoozeInput || !alarmSnoozeCustomWrap) return;
  const shouldShow = alarmSnoozeInput.value === "custom";
  alarmSnoozeCustomWrap.classList.toggle("hidden", !shouldShow);
  if (shouldShow && !alarmSnoozeCustomInput.value) {
    alarmSnoozeCustomInput.value = "5";
  }
}

if (alarmSnoozeInput) {
  alarmSnoozeInput.addEventListener("change", updateSnoozeCustomVisibility);
}

function addNewAlarm() {
  if (!alarmTimeInput?.value) {
    showToast("Please select a time");
    return;
  }

  const alarmData = {
    id: editingAlarmId || Date.now(),
    time: alarmTimeInput.value,
    label: alarmLabelInput?.value || "Alarm",
    tone: alarmToneInput?.value || "classic",
    enabled: editingAlarmId ? alarms.find(alarm => alarm.id === editingAlarmId)?.enabled !== false : true,
    snoozeMinutes: getSelectedSnoozeMinutes(),
    snoozedUntil: null,
    nextTriggerAt: getNextTriggerTimestamp(alarmTimeInput.value),
    isRinging: false
  };

  if (editingAlarmId) {
    const alarmIndex = alarms.findIndex(alarm => alarm.id === editingAlarmId);
    if (alarmIndex !== -1) {
      alarms[alarmIndex] = { ...alarms[alarmIndex], ...alarmData };
    } else {
      alarms.push(alarmData);
    }
    showToast("Alarm updated");
  } else {
    alarms.push(alarmData);
    showToast("Alarm added");
  }

  saveAlarms();
  renderAlarmsList();
  updateAlarmSummary();
  resetAlarmForm();
}

function checkAlarms(currentTime) {
  const now = Date.now();

  alarms.forEach(alarm => {
    if (!alarm.enabled) return;
    if (!alarm.nextTriggerAt) {
      alarm.nextTriggerAt = alarm.snoozedUntil || getNextTriggerTimestamp(alarm.time, now);
    }
    if (alarm.isRinging) return;
    if (now >= alarm.nextTriggerAt) {
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

  alarm.isRinging = true;
  alarm.snoozedUntil = null;
  saveAlarms();
  startRinger(alarm);
}

function stopActiveAlarm() {
  if (ringingAlarm) {
    ringingAlarm.isRinging = false;
    ringingAlarm.snoozedUntil = null;
    ringingAlarm.nextTriggerAt = getNextTriggerTimestamp(ringingAlarm.time);
    saveAlarms();
  }

  stopRinger();
  alarmPopup.classList.add("hidden");
  ringingAlarm = null;
}

function snoozeActiveAlarm() {
  if (!ringingAlarm) return;

  const snoozeMinutes = Number(ringingAlarm.snoozeMinutes || 5);
  ringingAlarm.snoozedUntil = Date.now() + snoozeMinutes * 60000;
  ringingAlarm.nextTriggerAt = ringingAlarm.snoozedUntil;
  ringingAlarm.isRinging = false;
  saveAlarms();

  stopRinger();
  alarmPopup.classList.add("hidden");
  ringingAlarm = null;

  showToast(`Snoozed for ${snoozeMinutes} min`);
}

// ================= AUDIO =================
function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
}

function startRinger(alarm) {
  stopRinger();
  initAudio();

  if (alarm?.tone === "mp3" && alarmSound) {
    alarmSound.loop = true;
    alarmSound.currentTime = 0;
    alarmSound.play().catch(() => {});
    return;
  }

  const toneMap = {
    classic: { type: "sine", frequency: 800 },
    cyber: { type: "square", frequency: 1020 },
    retro: { type: "triangle", frequency: 640 },
    default: { type: "sine", frequency: 800 }
  };
  const tone = toneMap[alarm?.tone] || toneMap.default;

  ringInterval = setInterval(() => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = tone.type;
    osc.frequency.value = tone.frequency;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }, 500);
}

function stopRinger() {
  clearInterval(ringInterval);
  ringInterval = null;
  if (alarmSound) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmSound.loop = false;
  }
}

// ================= WORLD CLOCKS =================
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
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,timezones,flags");
    const data = await response.json();
    countriesDatabase = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
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

  countries.forEach(country => {
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

  worldClocks.forEach((clock, index) => {
    const row = document.createElement("div");
    row.className = "world-clock-row";
    row.innerHTML = `
      <div class="world-clock-left">
        <img src="${clock.flag}" alt="${clock.name}" class="flag-img" loading="lazy" />
        <div>
          <div class="world-city-name">${clock.name}</div>
          <div class="world-offset-label">${clock.offset}</div>
        </div>
      </div>
      <div class="world-clock-right">
        <span class="world-time-display ticking-world-time" data-offset="${clock.offset}">00:00:00</span>
        <button class="remove-btn" onclick="removeWorldClock(${index})" title="Remove">&times;</button>
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

    const targetedTime = new Date(utcTimeMs + (3600000 * mathematicalHoursOffset));

    node.textContent = targetedTime.toLocaleTimeString("en-US", {
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

  if (historyLogs.length === 0) {
    container.innerHTML = `<div class="log-entry" style="justify-content:center;">History is empty.</div>`;
    return;
  }

  container.innerHTML = historyLogs
    .map(log => `<div class="log-entry"><span>${log.text}</span></div>`)
    .join("");
}

function addHistoryLog(text) {
  historyLogs.unshift({ text });
  if (historyLogs.length > 50) historyLogs.pop();
  localStorage.setItem("clock_historyLogs", JSON.stringify(historyLogs));
}

function toggleHistoryLogs() {
  const logs = document.getElementById("history-logs");
  if (!logs) return;
  logs.classList.toggle("hidden");
  if (historyHeader) historyHeader.classList.toggle("open");
}

// ================= TIMEZONE DROPDOWN =================
function populateTimezoneDropdown() {
  const container = document.getElementById("tz-options-list");
  if (!container) return;
  container.innerHTML = TIMEZONES.map(tz =>
    `<div class="tz-option ${tz.id === primaryTimezone ? 'selected' : ''}" onclick="selectPrimaryTimezone('${tz.id}', '${tz.name}')">
      <span>${tz.name}</span>
      <span class="tz-code">${tz.code}</span>
    </div>`
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

function toggleTimezoneDropdown(e) {
  e.stopPropagation();
  const container = document.getElementById("tz-options-container");
  const wrapper = document.getElementById("primary-timezone-wrapper");
  container.classList.toggle("hidden");
  wrapper.classList.toggle("open", !container.classList.contains("hidden"));
}

function filterTimezones() {
  const input = document.getElementById("tz-search-input").value.toLowerCase();
  const options = document.getElementById("tz-options-list").children;
  for (let opt of options) {
    opt.style.display = opt.textContent.toLowerCase().includes(input) ? "flex" : "none";
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

  container.innerHTML = alarms.map((alarm) => {
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
          <button class="edit-btn" onclick="editAlarm(${alarm.id})" title="Edit alarm" aria-label="Edit alarm">&#9998;</button>
          <label class="toggle">
            <input type="checkbox" ${alarm.enabled ? "checked" : ""} onchange="toggleAlarmEnabled(${alarm.id}, this.checked)" />
            <span class="toggle-slider"></span>
          </label>
          <button class="remove-btn" onclick="deleteAlarm(${alarm.id})" title="Delete" ${editingAlarmId === alarm.id ? "disabled aria-disabled=\"true\"" : ""}> &times;</button>
        </div>
      </div>
    `;
  }).join("");
}

function toggleAlarmEnabled(id, enabled) {
  const alarm = alarms.find(a => a.id === id);
  if (alarm) {
    alarm.enabled = enabled;
    saveAlarms();
    updateAlarmSummary();
    showToast(enabled ? "Alarm enabled" : "Alarm disabled");
  }
}

function editAlarm(id) {
  const alarm = alarms.find(item => item.id === id);
  if (!alarm) return;

  editingAlarmId = alarm.id;
  if (alarmTimeInput) alarmTimeInput.value = alarm.time;
  if (alarmLabelInput) alarmLabelInput.value = alarm.label || "";
  if (alarmToneInput) alarmToneInput.value = alarm.tone || "classic";

  if (alarmSnoozeInput) {
    const presetValue = [5, 10, 15].includes(Number(alarm.snoozeMinutes)) ? String(alarm.snoozeMinutes) : "custom";
    alarmSnoozeInput.value = presetValue;
  }

  if (alarmSnoozeCustomInput) {
    alarmSnoozeCustomInput.value = [5, 10, 15].includes(Number(alarm.snoozeMinutes)) ? "" : String(alarm.snoozeMinutes || 5);
  }

  updateSnoozeCustomVisibility();
  if (alarmSubmitButton) alarmSubmitButton.textContent = "Update Alarm";
  if (alarmCancelButton) alarmCancelButton.classList.remove("hidden");
  if (clearAllButton) clearAllButton.classList.add("hidden");
  if (alarmForm) {
    alarmForm.classList.add("editing");
    alarmForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  setTimeout(() => {
    alarmTimeInput?.focus();
    alarmTimeInput?.select?.();
  }, 0);
  showToast("Editing alarm");
  renderAlarmsList();
}

function resetAlarmForm() {
  editingAlarmId = null;
  alarmForm?.reset();
  if (alarmSubmitButton) alarmSubmitButton.textContent = "Add Alarm";
  if (alarmCancelButton) alarmCancelButton.classList.add("hidden");
  if (clearAllButton) clearAllButton.classList.remove("hidden");
  if (alarmForm) alarmForm.classList.remove("editing");
  if (alarmSnoozeInput) alarmSnoozeInput.value = "5";
  if (alarmSnoozeCustomInput) alarmSnoozeCustomInput.value = "";
  updateSnoozeCustomVisibility();
  renderAlarmsList();
}

function cancelAlarmEdit() {
  resetAlarmForm();
  showToast("Edit cancelled");
}

function deleteAlarm(id) {
  if (editingAlarmId === id) return;
  const alarm = alarms.find(item => item.id === id);
  if (!alarm) return;

  openConfirmModal(`Are you sure want to delete "${alarm.label || "Alarm"}"?`, () => {
    if (ringingAlarm && ringingAlarm.id === id) {
      stopRinger();
      alarmPopup?.classList.add("hidden");
      ringingAlarm = null;
    }

    alarms = alarms.filter(item => item.id !== id);
    saveAlarms();
    renderAlarmsList();
    updateAlarmSummary();
    showToast("Alarm deleted");
  });
}

function clearAllAlarms() {
  if (editingAlarmId) return;
  if (alarms.length === 0) {
    showToast("No alarms to clear");
    return;
  }

  openConfirmModal("Are you sure want to delete all alarms?", () => {
    stopRinger();
    alarmPopup?.classList.add("hidden");
    ringingAlarm = null;
    editingAlarmId = null;
    alarms = [];
    saveAlarms();
    renderAlarmsList();
    updateAlarmSummary();
    resetAlarmForm();
    showToast("All alarms cleared");
  });
}

function toggleAlarmSection() {
  const controls = document.getElementById("alarm-controls");
  const btn = document.getElementById("alarm-section-toggle");
  controls.classList.toggle("hidden");
  const isOpen = !controls.classList.contains("hidden");
  btn.classList.toggle("active", isOpen);
  btn.textContent = isOpen ? "×" : "Manage";
  btn.setAttribute("aria-label", isOpen ? "Close alarm controls" : "Manage alarms");
}

function saveAlarms() {
  localStorage.setItem("clock_alarms", JSON.stringify(alarms));
}

function openConfirmModal(message, onConfirm) {
  if (!confirmModal || !confirmModalMessage || !confirmModalYes) return;

  confirmAction = onConfirm;
  confirmModalMessage.textContent = message;
  confirmModal.classList.remove("hidden");
  confirmModalYes.focus();
}

function closeConfirmModal() {
  if (!confirmModal) return;

  confirmModal.classList.add("hidden");
  confirmAction = null;
}

if (confirmModalYes) {
  confirmModalYes.addEventListener("click", () => {
    const action = confirmAction;
    closeConfirmModal();
    if (typeof action === "function") action();
  });
}

function updateAlarmSummary() {
  const count = alarms.filter(a => a.enabled).length;
  if (alarmStatus) alarmStatus.textContent = count > 0 ? count + " Active" : "None Active";
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
