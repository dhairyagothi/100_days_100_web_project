// ======================================
// UNIT CONVERTER DATA
// ======================================

const categories = {
  length: {
    units: {
      kilometer: { label: "Kilometer (km)", value: 1000 },
      meter: { label: "Meter (m)", value: 1 },
      centimeter: { label: "Centimeter (cm)", value: 0.01 },
      millimeter: { label: "Millimeter (mm)", value: 0.001 },
      mile: { label: "Mile (mi)", value: 1609.344 },
      yard: { label: "Yard (yd)", value: 0.9144 },
      foot: { label: "Foot (ft)", value: 0.3048 },
      inch: { label: "Inch (in)", value: 0.0254 }
    }
  },

  weight: {
    units: {
      kilogram: { label: "Kilogram (kg)", value: 1 },
      gram: { label: "Gram (g)", value: 0.001 },
      milligram: { label: "Milligram (mg)", value: 0.000001 },
      pound: { label: "Pound (lb)", value: 0.45359237 },
      ounce: { label: "Ounce (oz)", value: 0.0283495 },
      ton: { label: "Metric Ton (t)", value: 1000 }
    }
  },

  temperature: {
    units: {
      celsius: { label: "Celsius (°C)" },
      fahrenheit: { label: "Fahrenheit (°F)" },
      kelvin: { label: "Kelvin (K)" }
    }
  },

  time: {
    units: {
      second: { label: "Second (s)", value: 1 },
      minute: { label: "Minute (min)", value: 60 },
      hour: { label: "Hour (hr)", value: 3600 },
      day: { label: "Day", value: 86400 },
      week: { label: "Week", value: 604800 },
      month: { label: "Month", value: 2629800 },
      year: { label: "Year", value: 31557600 }
    }
  },

  speed: {
    units: {
      meterPerSecond: { label: "m/s", value: 1 },
      kilometerPerHour: { label: "km/h", value: 0.277778 },
      milePerHour: { label: "mph", value: 0.44704 },
      footPerSecond: { label: "ft/s", value: 0.3048 },
      knot: { label: "Knot", value: 0.514444 }
    }
  }
};

// ======================================
// DOM ELEMENTS
// ======================================

const fromInput = document.getElementById("fromInput");
const toInput = document.getElementById("toInput");

const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");

const output = document.getElementById("output");
const swapBtn = document.getElementById("swapBtn");
const tabs = document.getElementById("tabs");

const themeSelect = document.getElementById("themeSelect");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// ======================================
// STATE
// ======================================

let currentCategory = "length";
let typingTimer;

// ======================================
// THEME SYSTEM
// ======================================

function loadTheme() {
  const savedTheme =
    localStorage.getItem("unitConverterTheme") ||
    "aurora";

  document.body.className = savedTheme;

  if (themeSelect) {
    themeSelect.value = savedTheme;
  }
}

function applyTheme(theme) {
  document.body.className = theme;

  localStorage.setItem(
    "unitConverterTheme",
    theme
  );
}

// ======================================
// HISTORY SYSTEM
// ======================================

let history =
  JSON.parse(
    localStorage.getItem("unitConverterHistory")
  ) || [];

function saveHistory() {
  localStorage.setItem(
    "unitConverterHistory",
    JSON.stringify(history)
  );
}

function renderHistory() {

  if (!history.length) {
    historyList.innerHTML = `
      <div class="history-empty">
        No conversions yet
      </div>
    `;
    return;
  }

  historyList.innerHTML = history
    .map(item => `
      <div class="history-item">
        ${item}
      </div>
    `)
    .join("");
}

function addToHistory(text) {

  if (!text) return;

  // Prevent duplicate consecutive entries
  if (history.length > 0 && history[0] === text) {
    return;
  }

  history.unshift(text);

  if (history.length > 10) {
    history.pop();
  }

  saveHistory();
  renderHistory();
}

function clearHistory() {
  history = [];
  saveHistory();
  renderHistory();
}

// ======================================
// LOAD CATEGORY
// ======================================

function loadCategory(category) {

  currentCategory = category;

  const units = categories[category].units;

  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  Object.entries(units).forEach(([key, unit]) => {

    fromUnit.add(
      new Option(unit.label, key)
    );

    toUnit.add(
      new Option(unit.label, key)
    );

  });

  const keys = Object.keys(units);

  fromUnit.value = keys[0];
  toUnit.value = keys[1] || keys[0];

  convert(false);
}

// ======================================
// TEMPERATURE
// ======================================

function convertTemperature(value, from, to) {

  let celsius;

  switch (from) {

    case "celsius":
      celsius = value;
      break;

    case "fahrenheit":
      celsius = (value - 32) * 5 / 9;
      break;

    case "kelvin":
      celsius = value - 273.15;
      break;

    default:
      celsius = value;
  }

  switch (to) {

    case "celsius":
      return celsius;

    case "fahrenheit":
      return celsius * 9 / 5 + 32;

    case "kelvin":
      return celsius + 273.15;

    default:
      return celsius;
  }
}

// ======================================
// NUMBER FORMAT
// ======================================

function formatNumber(num) {

  if (num === 0) return "0";

  if (
    Math.abs(num) >= 1000000 ||
    (Math.abs(num) < 0.0001 && num !== 0)
  ) {
    return Number(num).toExponential(4);
  }

  return parseFloat(
    num.toFixed(6)
  );
}

// ======================================
// RESULT ANIMATION
// ======================================

function animateResult() {

  output.style.opacity = "0.6";

  setTimeout(() => {
    output.style.opacity = "1";
  }, 150);
}

// ======================================
// CONVERSION
// ======================================

function convert(addHistory = false) {

  const value = parseFloat(
    fromInput.value
  );

  if (isNaN(value)) {

    toInput.value = "";

    output.innerHTML =
      "Please enter a valid number";

    return;
  }

  const units =
    categories[currentCategory].units;

  const from = fromUnit.value;
  const to = toUnit.value;

  let result;

  if (currentCategory === "temperature") {

    result = convertTemperature(
      value,
      from,
      to
    );

  } else {

    result =
      (value * units[from].value) /
      units[to].value;
  }

  const formattedResult =
    formatNumber(result);

  toInput.value = formattedResult;

  output.innerHTML = `
    <span>
      ${value}
      <strong>${units[from].label}</strong>
    </span>
    &nbsp;=&nbsp;
    <span>
      <strong>${formattedResult}</strong>
      ${units[to].label}
    </span>
  `;

  animateResult();

  if (addHistory) {

    const historyEntry = `
      ${value} ${units[from].label}
      → 
      ${formattedResult} ${units[to].label}
    `.trim();

    addToHistory(historyEntry);
  }
}

// ======================================
// SWAP
// ======================================

function swapUnits() {

  const temp = fromUnit.value;

  fromUnit.value = toUnit.value;
  toUnit.value = temp;

  convert(true);
}

// ======================================
// DEBOUNCED HISTORY
// ======================================

function handleTyping() {

  convert(false);

  clearTimeout(typingTimer);

  typingTimer = setTimeout(() => {
    convert(true);
  }, 800);
}

// ======================================
// EVENT LISTENERS
// ======================================

// Category tabs

tabs.addEventListener("click", (e) => {

  const button =
    e.target.closest(".tab-btn");

  if (!button) return;

  document
    .querySelectorAll(".tab-btn")
    .forEach(btn =>
      btn.classList.remove("active")
    );

  button.classList.add("active");

  loadCategory(button.dataset.cat);
});

// Input typing

fromInput.addEventListener(
  "input",
  handleTyping
);

// Unit changes

fromUnit.addEventListener(
  "change",
  () => convert(true)
);

toUnit.addEventListener(
  "change",
  () => convert(true)
);

// Swap

swapBtn.addEventListener(
  "click",
  swapUnits
);

// Theme

themeSelect.addEventListener(
  "change",
  () => {
    applyTheme(themeSelect.value);
  }
);

// Clear history

clearHistoryBtn.addEventListener(
  "click",
  clearHistory
);

// ======================================
// INIT
// ======================================

loadTheme();
renderHistory();
loadCategory("length");
convert(false);