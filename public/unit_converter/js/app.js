// ---- Unit data -------------------------------------------------------
// Every category (except temperature) converts through a base unit:
//   value_in_base = value * toBase[unit]
//   result        = value_in_base / toBase[targetUnit]
// Temperature is non-multiplicative (offsets), so it gets its own
// toCelsius / fromCelsius helpers instead of a toBase table.

const categories = {
  weight: {
    label: "Weight",
    icon: "weight",
    base: "kg",
    units: { kg: "Kilograms", lb: "Pounds", g: "Grams", oz: "Ounces", st: "Stone" },
    toBase: { kg: 1, lb: 0.45359237, g: 0.001, oz: 0.028349523125, st: 6.35029318 },
  },
  length: {
    label: "Length",
    icon: "ruler",
    base: "m",
    units: { m: "Metres", ft: "Feet", cm: "Centimetres", in: "Inches", mi: "Miles", km: "Kilometres" },
    toBase: { m: 1, ft: 0.3048, cm: 0.01, in: 0.0254, mi: 1609.344, km: 1000 },
  },
  temp: {
    label: "Temperature",
    icon: "temp",
    base: "c",
    units: { c: "Celsius", f: "Fahrenheit", k: "Kelvin" },
  },
  volume: {
    label: "Volume",
    icon: "flask",
    base: "l",
    units: { l: "Litres", gal: "Gallons (US)", ml: "Millilitres", cup: "Cups (US)", floz: "Fl. oz (US)" },
    toBase: { l: 1, gal: 3.785411784, ml: 0.001, cup: 0.2365882365, floz: 0.0295735295625 },
  },
};

// Small inline icon set (outline style, currentColor) keyed by name above.
const icons = {
  weight:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke-linecap="round"/></svg>',
  ruler:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v3M15 8v3M19 8v3" stroke-linecap="round"/></svg>',
  temp:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10 13.5V4a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z"/></svg>',
  flask:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 3h6M10 3v6l-5 9a1.5 1.5 0 0 0 1.3 2.2h11.4A1.5 1.5 0 0 0 19 18l-5-9V3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

// ---- State -------------------------------------------------------------

let activeCat = "weight";
let fromUnit = "kg";
let toUnit = "lb";

// ---- DOM refs ------------------------------------------------------------

const tabsEl = document.getElementById("tabs");
const fromValEl = document.getElementById("from-value");
const toValEl = document.getElementById("to-value");
const fromUnitEl = document.getElementById("from-unit");
const toUnitEl = document.getElementById("to-unit");
const errorEl = document.getElementById("error-msg");
const swapBtn = document.getElementById("swap-btn");
const formulaNote = document.getElementById("formula-note");
const form = document.getElementById("converter-form");

// ---- Rendering -----------------------------------------------------------

function renderTabs() {
  tabsEl.innerHTML = "";
  Object.keys(categories).forEach((key) => {
    const cat = categories[key];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab" + (key === activeCat ? " active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", key === activeCat ? "true" : "false");
    btn.innerHTML = `${icons[cat.icon]}<span>${cat.label}</span>`;
    btn.addEventListener("click", () => {
      if (key === activeCat) return;
      activeCat = key;
      const unitKeys = Object.keys(categories[key].units);
      fromUnit = unitKeys[0];
      toUnit = unitKeys[1];
      renderTabs();
      renderUnitSelects();
      convert();
    });
    tabsEl.appendChild(btn);
  });
}

function renderUnitSelects() {
  const cat = categories[activeCat];
  fromUnitEl.innerHTML = "";
  toUnitEl.innerHTML = "";

  Object.entries(cat.units).forEach(([key, label]) => {
    const opt1 = document.createElement("option");
    opt1.value = key;
    opt1.textContent = label;
    opt1.selected = key === fromUnit;
    fromUnitEl.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = key;
    opt2.textContent = label;
    opt2.selected = key === toUnit;
    toUnitEl.appendChild(opt2);
  });
}

function updateFormulaNote() {
  const cat = categories[activeCat];
  formulaNote.textContent = `${cat.units[fromUnit]} \u2192 ${cat.units[toUnit]}`;
}

// ---- Conversion math -------------------------------------------------------

function toCelsius(value, unit) {
  if (unit === "c") return value;
  if (unit === "f") return ((value - 32) * 5) / 9;
  return value - 273.15; // kelvin
}

function fromCelsius(value, unit) {
  if (unit === "c") return value;
  if (unit === "f") return (value * 9) / 5 + 32;
  return value + 273.15; // kelvin
}

function convert() {
  const raw = fromValEl.value.trim();
  const num = Number(raw);

  updateFormulaNote();

  if (raw === "" || isNaN(num)) {
    showError(true);
    toValEl.textContent = "\u2013\u2013";
    return;
  }
  showError(false);

  const cat = categories[activeCat];
  let result;

  if (activeCat === "temp") {
    result = fromCelsius(toCelsius(num, fromUnit), toUnit);
  } else {
    const base = num * cat.toBase[fromUnit];
    result = base / cat.toBase[toUnit];
  }

  const rounded = Math.abs(result) >= 100 ? result.toFixed(1) : result.toFixed(3);
  toValEl.textContent = Number(rounded).toString();
}

function showError(isError) {
  errorEl.hidden = !isError;
}

// ---- Events ------------------------------------------------------------

fromUnitEl.addEventListener("change", (e) => {
  fromUnit = e.target.value;
  convert();
});

toUnitEl.addEventListener("change", (e) => {
  toUnit = e.target.value;
  convert();
});

fromValEl.addEventListener("input", convert);

// Submitting the form (e.g. pressing Enter) just runs the same live conversion.
form.addEventListener("submit", (e) => {
  e.preventDefault();
  convert();
});

swapBtn.addEventListener("click", () => {
  const previousUnit = fromUnit;
  fromUnit = toUnit;
  toUnit = previousUnit;

  // Carry the current result into the input so swapping feels reversible.
  const currentResult = toValEl.textContent;
  if (currentResult !== "\u2013\u2013") {
    fromValEl.value = currentResult;
  }

  swapBtn.classList.add("spin");
  setTimeout(() => swapBtn.classList.remove("spin"), 250);

  renderUnitSelects();
  convert();
});

// ---- Init ------------------------------------------------------------

renderTabs();
renderUnitSelects();
convert();