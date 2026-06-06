const categories = {
  length: {
    units: {
      kilometer:  { label: "Kilometer (km)",  value: 1000 },
      meter:      { label: "Meter (m)",        value: 1 },
      centimeter: { label: "Centimeter (cm)",  value: 0.01 },
      millimeter: { label: "Millimeter (mm)",  value: 0.001 },
      mile:       { label: "Mile (mi)",         value: 1609.344 },
      yard:       { label: "Yard (yd)",         value: 0.9144 },
      foot:       { label: "Foot (ft)",         value: 0.3048 },
      inch:       { label: "Inch (in)",         value: 0.0254 }
    }
  },
  weight: {
    units: {
      kilogram:  { label: "Kilogram (kg)",    value: 1 },
      gram:      { label: "Gram (g)",          value: 0.001 },
      milligram: { label: "Milligram (mg)",    value: 0.000001 },
      pound:     { label: "Pound (lb)",        value: 0.45359237 },
      ounce:     { label: "Ounce (oz)",        value: 0.0283495 },
      ton:       { label: "Metric Ton (t)",    value: 1000 }
    }
  },
  temperature: {
    units: {
      celsius:    { label: "Celsius (°C)" },
      fahrenheit: { label: "Fahrenheit (°F)" },
      kelvin:     { label: "Kelvin (K)" }
    }
  },
  time: {
    units: {
      second: { label: "Second (s)",   value: 1 },
      minute: { label: "Minute (min)", value: 60 },
      hour:   { label: "Hour (hr)",    value: 3600 },
      day:    { label: "Day",          value: 86400 },
      week:   { label: "Week",         value: 604800 },
      month:  { label: "Month",        value: 2629800 },
      year:   { label: "Year",         value: 31557600 }
    }
  },
  speed: {
    units: {
      meterPerSecond:    { label: "m/s",   value: 1 },
      kilometerPerHour:  { label: "km/h",  value: 0.277778 },
      milePerHour:       { label: "mph",   value: 0.44704 },
      footPerSecond:     { label: "ft/s",  value: 0.3048 },
      knot:              { label: "Knot",  value: 0.514444 }
    }
  }
};

// ── DOM refs ──
const fromInput = document.getElementById('fromInput');
const toInput   = document.getElementById('toInput');
const fromUnit  = document.getElementById('fromUnit');
const toUnit    = document.getElementById('toUnit');
const output    = document.getElementById('output');
const swapBtn   = document.getElementById('swapBtn');
const tabs      = document.getElementById('tabs');

let currentCategory = 'length';

// ── Load a category ──
function loadCategory(cat) {
  currentCategory = cat;
  const units = categories[cat].units;

  fromUnit.innerHTML = '';
  toUnit.innerHTML   = '';

  Object.entries(units).forEach(([key, u]) => {
    fromUnit.add(new Option(u.label, key));
    toUnit.add(new Option(u.label, key));
  });

  const keys = Object.keys(units);
  fromUnit.value = keys[0];
  toUnit.value   = keys[1] || keys[0];
  fromInput.value = 1;

  convert();
}

// ── Core conversion ──
function convert() {
  const value = parseFloat(fromInput.value);

  if (isNaN(value)) {
    toInput.value     = '';
    output.textContent = 'Enter a valid number';
    return;
  }

  const from  = fromUnit.value;
  const to    = toUnit.value;
  const units = categories[currentCategory].units;
  let result;

  if (currentCategory === 'temperature') {
    result = convertTemperature(value, from, to);
  } else {
    result = (value * units[from].value) / units[to].value;
  }

  result = formatNumber(result);
  toInput.value = result;

  output.innerHTML =
    `<span>${value} <strong>${units[from].label}</strong></span>` +
    `&nbsp;=&nbsp;` +
    `<span><strong>${result}</strong> ${units[to].label}</span>`;
}

// ── Temperature special-case ──
function convertTemperature(value, from, to) {
  let celsius;
  switch (from) {
    case 'celsius':    celsius = value; break;
    case 'fahrenheit': celsius = (value - 32) * 5 / 9; break;
    case 'kelvin':     celsius = value - 273.15; break;
  }
  switch (to) {
    case 'celsius':    return celsius;
    case 'fahrenheit': return celsius * 9 / 5 + 32;
    case 'kelvin':     return celsius + 273.15;
  }
}

// ── Number formatting ──
function formatNumber(num) {
  if (num === 0) return '0';
  if (Math.abs(num) >= 1e6 || (Math.abs(num) < 0.0001 && num !== 0)) {
    return Number(num).toExponential(4);
  }
  return parseFloat(num.toFixed(6));
}

// ── Event listeners ──
tabs.addEventListener('click', e => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadCategory(btn.dataset.cat);
});

swapBtn.addEventListener('click', () => {
  const tmp      = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value   = tmp;
  convert();
});

fromInput.addEventListener('input', convert);
fromUnit.addEventListener('change', convert);
toUnit.addEventListener('change', convert);

// ── Init ──
loadCategory('length');