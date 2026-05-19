/**
 * digitalclock.js
 * Fixes:
 * 1. DOM errors — guard element existence before use
 * 2. Alarm repeated intervals — clear before setting new
 * 3. UI feedback non-blocking — use status div, not alert()
 * 4. Accessibility — aria updates on time change
 */

// ── State ────────────────────────────────────────────────
let clockInterval = null;
let alarmTime = null;
let alarmTriggered = false;

// ── DOM refs (guarded) ───────────────────────────────────
function getEl(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`[DigitalClock] Element #${id} not found`);
  return el;
}

// ── Clock ────────────────────────────────────────────────
function updateClock() {
  const clockEl = getEl("clock");
  const dateEl = getEl("date-display");
  if (!clockEl) return;

  const now = new Date();

  // Time string HH:MM:SS
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const timeStr = `${hh}:${mm}:${ss}`;

  clockEl.textContent = timeStr;
  // Update aria-label for screen readers (update every minute to avoid spam)
  if (ss === "00" || clockEl.getAttribute("aria-label") === "Current time") {
    clockEl.setAttribute("aria-label", `Current time: ${timeStr}`);
  }

  // Date string
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // Check alarm
  checkAlarm(hh, mm, ss);
}

function startClock() {
  // FIX: clear existing interval before starting new one
  if (clockInterval !== null) {
    clearInterval(clockInterval);
    clockInterval = null;
  }
  updateClock(); // immediate first tick
  clockInterval = setInterval(updateClock, 1000);
}

// ── Alarm ────────────────────────────────────────────────
function setAlarm() {
  const inputEl = getEl("alarm-time");
  const statusEl = getEl("alarm-status");
  const cancelBtn = getEl("cancel-alarm-btn");

  if (!inputEl) return;

  const val = inputEl.value; // "HH:MM"
  if (!val) {
    showStatus("Please select a valid alarm time.", "error");
    return;
  }

  alarmTime = val;
  alarmTriggered = false;

  if (statusEl) {
    showStatus(`Alarm set for ${val} ✓`, "success");
  }
  if (cancelBtn) cancelBtn.disabled = false;
}

function cancelAlarm() {
  alarmTime = null;
  alarmTriggered = false;
  showStatus("Alarm cancelled.", "info");

  const cancelBtn = getEl("cancel-alarm-btn");
  if (cancelBtn) cancelBtn.disabled = true;

  hideAlarmRing();
}

function checkAlarm(hh, mm, ss) {
  if (!alarmTime || alarmTriggered) return;

  const currentHHMM = `${hh}:${mm}`;
  if (currentHHMM === alarmTime && ss === "00") {
    alarmTriggered = true; // prevent repeated triggers
    triggerAlarm();
  }
}

function triggerAlarm() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  
  function beep() {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.8);
  }

  // beep every second until stopped
  beep();
  window.alarmSound = setInterval(beep, 1000);

  // existing code below stays same
  const ringEl = getEl("alarm-ring");
  if (ringEl) {
    ringEl.classList.remove("hidden");
    ringEl.focus();
  }
  showStatus("⏰ Alarm is ringing!", "ringing");
}

function stopAlarm() {
  // ADD THIS
  if (window.alarmSound) {
    clearInterval(window.alarmSound);
    window.alarmSound = null;
  }

  alarmTime = null;
  alarmTriggered = false;
  hideAlarmRing();
  showStatus("Alarm stopped.", "info");

  const cancelBtn = getEl("cancel-alarm-btn");
  if (cancelBtn) cancelBtn.disabled = true;
}

function hideAlarmRing() {
  const ringEl = getEl("alarm-ring");
  if (ringEl) ringEl.classList.add("hidden");
}

// ── UI Feedback (non-blocking) ───────────────────────────
function showStatus(message, type = "info") {
  const statusEl = getEl("alarm-status");
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `alarm-status status-${type}`;
}

// ── Init ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  startClock();
});