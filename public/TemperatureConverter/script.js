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
const factCard      = document.getElementById('factCard');
const factText      = document.getElementById('factText');
const factIcon      = document.getElementById('factIcon');
const formulaSection = document.getElementById('formulaSection');
const fromToLabel    = document.getElementById('fromToLabel');
const formulaText    = document.getElementById('formulaText');
const calculationSteps = document.getElementById('calculationSteps');
const referenceGrid  = document.getElementById('referenceGrid');

// ── State ──
let conversionHistory = [];
let historyTimeout    = null;
let lastInputUnit     = 'celsius';

const STORAGE_KEY_HISTORY = 'tempconvert_history';
const STORAGE_KEY_THEME   = 'tempconvert_theme';

// ── Scale Config ──
const SCALE_MIN = -273.15;  // Absolute zero
const SCALE_MAX = 1000;     // °C

// ── Temperature Facts Data ──
const temperatureFacts = [
  {
    min: -273.15,
    max: -200,
    icon: '🥶',
    text: 'Absolute zero (-273.15°C) is the coldest possible temperature, where all molecular motion stops.'
  },
  {
    min: -199.99,
    max: -78.5,
    icon: '❄️',
    text: 'Dry ice (solid CO₂) sublimates at -78.5°C and is used for keeping things cold without leaving residue.'
  },
  {
    min: -78.49,
    max: 0,
    icon: '🌨️',
    text: 'Water freezes at 0°C (32°F), turning into ice which is less dense than liquid water—so ice floats!'
  },
  {
    min: 0.01,
    max: 10,
    icon: '🥤',
    text: 'A typical refrigerator temperature is around 4°C, slowing bacterial growth to keep food fresh.'
  },
  {
    min: 10.01,
    max: 20,
    icon: '🍂',
    text: 'Room temperature is commonly defined as 20°C, a comfortable range for most people.'
  },
  {
    min: 20.01,
    max: 30,
    icon: '🌤️',
    text: '25°C is considered a pleasant room temperature, often used as a standard in scientific experiments.'
  },
  {
    min: 30.01,
    max: 40,
    icon: '🌡️',
    text: 'The average normal human body temperature is 37°C (98.6°F), though it can vary slightly.'
  },
  {
    min: 40.01,
    max: 70,
    icon: '☕',
    text: 'Hot coffee is typically served around 60-70°C, hot enough to be enjoyable without burning.'
  },
  {
    min: 70.01,
    max: 100,
    icon: '♨️',
    text: 'Water boils at 100°C (212°F) at standard atmospheric pressure, turning into steam.'
  },
  {
    min: 100.01,
    max: 200,
    icon: '🍪',
    text: 'A typical oven temperature for baking cookies is 180°C, allowing them to turn golden and crispy.'
  },
  {
    min: 200.01,
    max: 500,
    icon: '🔥',
    text: 'The flame of a candle burns at roughly 400°C, hot enough to melt many common materials.'
  },
  {
    min: 500.01,
    max: 1000,
    icon: '☀️',
    text: 'The surface of the Sun is about 5500°C, incredibly hot but much cooler than its core at 15 million°C!'
  }
];

// ── Conversion Formulas & Step Generators ──
const conversionFormulas = {
  'celsius→fahrenheit': {
    formula: '°F = (°C × 9/5) + 32',
    getSteps: (value) => [
      `${value} × 9/5 = ${(value * 9/5).toFixed(2)}`,
      `${(value * 9/5).toFixed(2)} + 32 = ${((value * 9/5) + 32).toFixed(2)}°F`
    ]
  },
  'celsius→kelvin': {
    formula: 'K = °C + 273.15',
    getSteps: (value) => [
      `${value} + 273.15 = ${(value + 273.15).toFixed(2)}K`
    ]
  },
  'fahrenheit→celsius': {
    formula: '°C = (°F - 32) × 5/9',
    getSteps: (value) => [
      `${value} - 32 = ${(value - 32).toFixed(2)}`,
      `${(value - 32).toFixed(2)} × 5/9 = ${((value - 32) * 5/9).toFixed(2)}°C`
    ]
  },
  'fahrenheit→kelvin': {
    formula: 'K = (°F - 32) × 5/9 + 273.15',
    getSteps: (value) => [
      `${value} - 32 = ${(value - 32).toFixed(2)}`,
      `${(value - 32).toFixed(2)} × 5/9 = ${((value - 32) * 5/9).toFixed(2)}`,
      `${((value - 32) * 5/9).toFixed(2)} + 273.15 = ${((value - 32) * 5/9 + 273.15).toFixed(2)}K`
    ]
  },
  'kelvin→celsius': {
    formula: '°C = K - 273.15',
    getSteps: (value) => [
      `${value} - 273.15 = ${(value - 273.15).toFixed(2)}°C`
    ]
  },
  'kelvin→fahrenheit': {
    formula: '°F = (K - 273.15) × 9/5 + 32',
    getSteps: (value) => [
      `${value} - 273.15 = ${(value - 273.15).toFixed(2)}`,
      `${(value - 273.15).toFixed(2)} × 9/5 = ${((value - 273.15) * 9/5).toFixed(2)}`,
      `${((value - 273.15) * 9/5).toFixed(2)} + 32 = ${((value - 273.15) * 9/5 + 32).toFixed(2)}°F`
    ]
  }
};

// ── Real-World Reference Points ──
const referencePoints = [
  { name: 'Absolute Zero', temp: -273.15, icon: '❄', tempDisplay: '-273.15°C' },
  { name: 'Freezing Point', temp: 0, icon: '❄️', tempDisplay: '0°C' },
  { name: 'Room Temperature', temp: 23, icon: '🌤', tempDisplay: '23°C' },
  { name: 'Human Body Temperature', temp: 37, icon: '🌡', tempDisplay: '37°C' },
  { name: 'Boiling Point', temp: 100, icon: '♨', tempDisplay: '100°C' }
];

// ── Init ──
(function init() {
  loadTheme();
  loadHistory();
  initReferenceGrid();
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
  updateFactCard(celsius);
  updateReferenceHighlight(celsius);
}

function clearValues() {
  celsiusEl.value = fahrenheitEl.value = kelvinEl.value = '';
  updateScaleBar(null);
  updateFactCard(null);
  updateFormulaPanel(null, null);
  updateReferenceHighlight(null);
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

// ── Temperature Facts Card ──
function updateFactCard(celsius) {
  if (celsius === null || celsius === undefined || isNaN(celsius)) {
    factIcon.textContent = '🌡️';
    factText.textContent = 'Enter a temperature to see an interesting fact!';
    return;
  }

  const fact = temperatureFacts.find(f => celsius >= f.min && celsius <= f.max);
  if (fact) {
    factIcon.textContent = fact.icon;
    factText.textContent = fact.text;
  } else {
    factIcon.textContent = '🌡️';
    factText.textContent = 'That\'s an interesting temperature!';
  }
}

// ── Formula & Calculation Panel ──
function updateFormulaPanel(value, fromUnit) {
  if (value === null || value === undefined || isNaN(value)) {
    fromToLabel.textContent = 'Select units and enter a value';
    formulaText.textContent = 'Enter a value to see the formula';
    calculationSteps.innerHTML = '';
    return;
  }

  // Determine target units (the other two units)
  let toUnits = [];
  if (fromUnit === 'celsius') {
    toUnits = ['fahrenheit', 'kelvin'];
  } else if (fromUnit === 'fahrenheit') {
    toUnits = ['celsius', 'kelvin'];
  } else { // kelvin
    toUnits = ['celsius', 'fahrenheit'];
  }

  // For now, let's just use the first target unit for simplicity (matches original intent of showing one conversion)
  const toUnit = toUnits[0];

  const key = `${fromUnit}→${toUnit}`;
  const formulaData = conversionFormulas[key];

  if (!formulaData) {
    fromToLabel.textContent = 'Select units and enter a value';
    formulaText.textContent = 'Enter a value to see the formula';
    calculationSteps.innerHTML = '';
    return;
  }

  // Update the from-to label
  const labels = {
    celsius: 'Celsius',
    fahrenheit: 'Fahrenheit',
    kelvin: 'Kelvin'
  };
  fromToLabel.textContent = `${labels[fromUnit]} → ${labels[toUnit]}`;
  formulaText.textContent = formulaData.formula;

  // Render steps
  calculationSteps.innerHTML = '';
  const steps = formulaData.getSteps(value);
  steps.forEach(stepText => {
    const stepEl = document.createElement('div');
    stepEl.className = 'calculation-step';
    stepEl.textContent = stepText;
    calculationSteps.appendChild(stepEl);
  });
}

// ── Real-World Reference Functions ──
function initReferenceGrid() {
  referenceGrid.innerHTML = '';
  referencePoints.forEach((point, index) => {
    const card = document.createElement('div');
    card.className = 'reference-card';
    card.dataset.index = index;

    const icon = document.createElement('div');
    icon.className = 'reference-icon';
    icon.textContent = point.icon;

    const name = document.createElement('div');
    name.className = 'reference-name';
    name.textContent = point.name;

    const temp = document.createElement('div');
    temp.className = 'reference-temp';
    temp.textContent = point.tempDisplay;

    card.appendChild(icon);
    card.appendChild(name);
    card.appendChild(temp);
    referenceGrid.appendChild(card);
  });
}

function updateReferenceHighlight(celsiusTemp) {
  const cards = referenceGrid.querySelectorAll('.reference-card');

  // Reset all cards
  cards.forEach(card => card.classList.remove('active'));

  if (celsiusTemp === null || celsiusTemp === undefined || isNaN(celsiusTemp)) {
    return;
  }

  // Find closest reference point
  let closestIndex = 0;
  let minDistance = Math.abs(referencePoints[0].temp - celsiusTemp);

  for (let i = 1; i < referencePoints.length; i++) {
    const distance = Math.abs(referencePoints[i].temp - celsiusTemp);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  // Highlight closest card
  const closestCard = cards[closestIndex];
  if (closestCard) {
    closestCard.classList.add('active');
  }
}

// ── Input Listeners ──
function setupInputListeners() {
  celsiusEl.addEventListener('input', () => {
    lastInputUnit = 'celsius';
    const c = parseFloat(celsiusEl.value);
    if (!isNaN(c)) {
      setValues(fromCelsius(c), 'celsius');
      scheduleHistoryEntry(c);
      updateFormulaPanel(c, lastInputUnit);
    } else {
      clearValues();
      celsiusEl.value = '';
      updateFormulaPanel(null, null);
    }
  });

  fahrenheitEl.addEventListener('input', () => {
    lastInputUnit = 'fahrenheit';
    const f = parseFloat(fahrenheitEl.value);
    if (!isNaN(f)) {
      const c = celsiusFromFahrenheit(f);
      setValues(fromCelsius(c), 'fahrenheit');
      scheduleHistoryEntry(c, `${+f.toFixed(4)}°F`);
      updateFormulaPanel(f, lastInputUnit);
    } else {
      clearValues();
      fahrenheitEl.value = '';
      updateFormulaPanel(null, null);
    }
  });

  kelvinEl.addEventListener('input', () => {
    lastInputUnit = 'kelvin';
    const k = parseFloat(kelvinEl.value);
    if (!isNaN(k)) {
      const c = celsiusFromKelvin(k);
      setValues(fromCelsius(c), 'kelvin');
      scheduleHistoryEntry(c, `${+k.toFixed(4)}K`);
      updateFormulaPanel(k, lastInputUnit);
    } else {
      clearValues();
      kelvinEl.value = '';
      updateFormulaPanel(null, null);
    }
  });
}

// ── Presets ──
function setupPresets() {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const c = parseFloat(btn.dataset.celsius);
      const vals = fromCelsius(c);
      lastInputUnit = 'celsius';
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
      updateFactCard(c);
      updateFormulaPanel(c, 'celsius');
      updateReferenceHighlight(c);
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
      lastInputUnit = 'celsius';
      celsiusEl.value    = vals.celsius;
      fahrenheitEl.value = +vals.fahrenheit.toFixed(4);
      kelvinEl.value     = +vals.kelvin.toFixed(4);
      updateScaleBar(c);
      updateFactCard(c);
      updateFormulaPanel(c, 'celsius');
      updateReferenceHighlight(c);
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