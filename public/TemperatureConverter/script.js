/* ==========================================
   TEMP°CONVERT — Enhanced Script
   ========================================== */

// ── DOM References ──
const celsiusEl     = document.getElementById('celsius');
const fahrenheitEl  = document.getElementById('fahrenheit');
const kelvinEl      = document.getElementById('kelvin');
const historyList   = document.getElementById('historyList');
const historyEmpty  = document.getElementById('historyEmpty');
const clearBtn      = document.getElementById('clearHistory');
const themeToggle   = document.getElementById('themeToggle');
const themeIcon     = themeToggle.querySelector('.theme-icon');
const scaleFill     = document.getElementById('scaleFill');
const scaleThumb    = document.getElementById('scaleThumb');

// ── State ──
let conversionHistory = [];
let historyTimeout    = null;

const STORAGE_KEY_HISTORY = 'tempconvert_history';
const STORAGE_KEY_THEME   = 'tempconvert_theme';

// ── Scale Config ──
const SCALE_MIN = -273.15;  // Absolute zero
const SCALE_MAX = 1000;     // °C

// ── Init ──
(function init() {
  loadTheme();
  loadHistory();
  setupPresets();
  setupInputListeners();
  setupClearHistory();
  setupThemeToggle();
})();

// ── Theme ──
function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  applyTheme(saved, false);
}

function applyTheme(theme, animate = true) {
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  if (animate) {
    document.body.style.transition = 'background 0.4s ease, color 0.4s ease';
  }
  localStorage.setItem(STORAGE_KEY_THEME, theme);
}

function setupThemeToggle() {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ── Conversions ──
function fromCelsius(c) {
  return {
    celsius:    c,
    fahrenheit: c * 9/5 + 32,
    kelvin:     c + 273.15,
  };
}

function celsiusFromFahrenheit(f) { return (f - 32) * 5/9; }
function celsiusFromKelvin(k)     { return k - 273.15; }

function setValues({ celsius, fahrenheit, kelvin }, skip) {
  if (skip !== 'celsius')    celsiusEl.value    = isNaN(celsius)    ? '' : +celsius.toFixed(4);
  if (skip !== 'fahrenheit') fahrenheitEl.value = isNaN(fahrenheit) ? '' : +fahrenheit.toFixed(4);
  if (skip !== 'kelvin')     kelvinEl.value     = isNaN(kelvin)     ? '' : +kelvin.toFixed(4);
  updateScaleBar(celsius);
}

function clearValues() {
  celsiusEl.value = fahrenheitEl.value = kelvinEl.value = '';
  updateScaleBar(null);
}

// ── Scale Bar ──
function updateScaleBar(celsius) {
  if (celsius === null || celsius === undefined || isNaN(celsius)) {
    scaleFill.style.width = '0%';
    scaleThumb.style.left = '0%';
    return;
  }
  const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, celsius));
  const pct = ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
  scaleFill.style.width = pct + '%';
  scaleThumb.style.left = pct + '%';
}

// ── Input Listeners ──
function setupInputListeners() {
  celsiusEl.addEventListener('input', () => {
    const c = parseFloat(celsiusEl.value);
    if (!isNaN(c)) {
      setValues(fromCelsius(c), 'celsius');
      scheduleHistoryEntry(c);
    } else {
      clearValues();
      celsiusEl.value = '';
    }
  });

  fahrenheitEl.addEventListener('input', () => {
    const f = parseFloat(fahrenheitEl.value);
    if (!isNaN(f)) {
      const c = celsiusFromFahrenheit(f);
      setValues(fromCelsius(c), 'fahrenheit');
      scheduleHistoryEntry(c, `${+f.toFixed(4)}°F`);
    } else {
      clearValues();
      fahrenheitEl.value = '';
    }
  });

  kelvinEl.addEventListener('input', () => {
    const k = parseFloat(kelvinEl.value);
    if (!isNaN(k)) {
      const c = celsiusFromKelvin(k);
      setValues(fromCelsius(c), 'kelvin');
      scheduleHistoryEntry(c, `${+k.toFixed(4)}K`);
    } else {
      clearValues();
      kelvinEl.value = '';
    }
  });
}

// ── Presets ──
function setupPresets() {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = parseFloat(btn.dataset.celsius);
      const vals = fromCelsius(c);
      // Animate inputs
      [celsiusEl, fahrenheitEl, kelvinEl].forEach(el => {
        el.classList.remove('pop');
        void el.offsetWidth;
        el.classList.add('pop');
      });
      celsiusEl.value    = +vals.celsius.toFixed(4);
      fahrenheitEl.value = +vals.fahrenheit.toFixed(4);
      kelvinEl.value     = +vals.kelvin.toFixed(4);
      updateScaleBar(c);
      addHistoryEntry(c, btn.querySelector('.preset-name').textContent);
    });
  });
}

// ── History ──
function scheduleHistoryEntry(celsius, label = null) {
  clearTimeout(historyTimeout);
  historyTimeout = setTimeout(() => {
    addHistoryEntry(celsius, label);
  }, 900);
}

function addHistoryEntry(celsius, label = null) {
  const vals = fromCelsius(celsius);
  const entry = {
    id:         Date.now(),
    label:      label || `${+vals.celsius.toFixed(2)}°C`,
    celsius:    +vals.celsius.toFixed(2),
    fahrenheit: +vals.fahrenheit.toFixed(2),
    kelvin:     +vals.kelvin.toFixed(2),
    time:       new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  // Deduplicate consecutive identical entries
  if (conversionHistory.length > 0 && conversionHistory[0].celsius === entry.celsius) return;

  conversionHistory.unshift(entry);
  if (conversionHistory.length > 20) conversionHistory.pop(); // keep max 20
  saveHistory();
  renderHistory();
}

function saveHistory() {
  try { localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(conversionHistory)); } catch(e) {}
}

function loadHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      conversionHistory = JSON.parse(saved);
      renderHistory();
    }
  } catch(e) { conversionHistory = []; }
}

function renderHistory() {
  // Remove existing items (keep the empty state div)
  historyList.querySelectorAll('.history-item').forEach(el => el.remove());

  if (conversionHistory.length === 0) {
    historyEmpty.style.display = 'flex';
    return;
  }
  historyEmpty.style.display = 'none';

  conversionHistory.forEach((entry, i) => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.style.animationDelay = (i * 40) + 'ms';
    item.innerHTML = `
      <div class="history-item-row">
        <span class="history-item-source">${escapeHtml(entry.label)}</span>
        <span class="history-item-time">${entry.time}</span>
      </div>
      <div class="history-item-values">
        <span class="history-val-chip">${entry.celsius}°C</span>
        <span class="history-val-chip">${entry.fahrenheit}°F</span>
        <span class="history-val-chip">${entry.kelvin}K</span>
      </div>
    `;
    // Click to restore
    item.addEventListener('click', () => {
      const c = entry.celsius;
      const vals = fromCelsius(c);
      celsiusEl.value    = vals.celsius;
      fahrenheitEl.value = +vals.fahrenheit.toFixed(4);
      kelvinEl.value     = +vals.kelvin.toFixed(4);
      updateScaleBar(c);
    });
    historyList.appendChild(item);
  });
}

function setupClearHistory() {
  clearBtn.addEventListener('click', () => {
    conversionHistory = [];
    saveHistory();
    renderHistory();
  });
}

// ── Utils ──
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}