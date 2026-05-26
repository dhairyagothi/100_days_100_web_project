// ── DOM references ────────────────────────────────────────────
// Declared at the top so all functions can access them safely

const fromValEl       = document.getElementById('fromVal');
const toValEl         = document.getElementById('toVal');
const fromUnitEl      = document.getElementById('fromUnit');
const toUnitEl        = document.getElementById('toUnit');
const quickRefsEl     = document.getElementById('quickRefs');
const outputList      = document.getElementById('outputList');
const ingredientInput = document.getElementById('ingredientInput');
const srvNum          = document.getElementById('srvNum');
const toast           = document.getElementById('toast');

// ── unit data ─────────────────────────────────────────────────
// All values are relative to a base unit within the category.
// For volume: base = 1 tsp. For weight: base = 1 gram. etc.

const categories = {
  volume: {
    units: {
      'tsp':    1,
      'tbsp':   3,
      'fl oz':  6,
      'cup':    48,
      'pint':   96,
      'quart':  192,
      'gallon': 768,
      'ml':     0.202884,
      'l':      202.884,
    },
    refs: [
      { name: '1 cup',   val: '237 ml' },
      { name: '1 tbsp',  val: '3 tsp / 15 ml' },
      { name: '1 fl oz', val: '2 tbsp / 30 ml' },
      { name: '1 pint',  val: '2 cups / 473 ml' },
    ]
  },
  weight: {
    units: {
      'g':  1,
      'kg': 1000,
      'oz': 28.3495,
      'lb': 453.592,
    },
    refs: [
      { name: '1 oz',  val: '28.35 g' },
      { name: '1 lb',  val: '453.6 g' },
      { name: '1 kg',  val: '2.205 lb' },
      { name: '100 g', val: '3.53 oz' },
    ]
  },
  temp: {
    units: { '°C': 'C', '°F': 'F', 'K': 'K' },
    refs: [
      { name: 'Water boils',   val: '100 °C / 212 °F' },
      { name: 'Water freezes', val: '0 °C / 32 °F' },
      { name: '180 °C (fan)',  val: '356 °F' },
      { name: '200 °C (fan)',  val: '392 °F' },
    ]
  },
  length: {
    units: {
      'mm': 1,
      'cm': 10,
      'm':  1000,
      'in': 25.4,
      'ft': 304.8,
    },
    refs: [
      { name: '1 inch',    val: '2.54 cm' },
      { name: '1 foot',    val: '30.48 cm' },
      { name: '20 cm pan', val: '~8 inch' },
      { name: '23 cm pan', val: '~9 inch' },
    ]
  }
};

// Default "from" and "to" units per category
const defaults = {
  volume: { from: 'cup', to: 'ml'  },
  weight: { from: 'g',   to: 'oz'  },
  temp:   { from: '°C',  to: '°F'  },
  length: { from: 'cm',  to: 'in'  },
};

let currentCat = 'volume';

// ── converter logic ───────────────────────────────────────────

const populateSelects = () => {
  const unitKeys = Object.keys(categories[currentCat].units);
  const { from, to } = defaults[currentCat];

  const buildOptions = (el, selectedVal) => {
    el.innerHTML = unitKeys
      .map(k => `<option value="${k}"${k === selectedVal ? ' selected' : ''}>${k}</option>`)
      .join('');
  };

  buildOptions(fromUnitEl, from);
  buildOptions(toUnitEl, to);
};

const doConvert = () => {
  const raw = parseFloat(fromValEl.value);
  if (isNaN(raw)) {
    toValEl.value = '';
    return;
  }

  const from = fromUnitEl.value;
  const to   = toUnitEl.value;
  const cat  = categories[currentCat];
  let result;

  if (currentCat === 'temp') {
    // Temperature is first converted to Celsius, then to the target unit
    let celsius;
    if (from === '°C')      celsius = raw;
    else if (from === '°F') celsius = (raw - 32) * 5 / 9;
    else                    celsius = raw - 273.15; // Kelvin

    if (to === '°C')      result = celsius;
    else if (to === '°F') result = celsius * 9 / 5 + 32;
    else                  result = celsius + 273.15;
  } else {
    // All other categories: convert through the base unit
    const inBase = raw * cat.units[from];
    result = inBase / cat.units[to];
  }

  toValEl.value = +result.toFixed(4);
};

const renderRefs = () => {
  const refs = categories[currentCat].refs;
  quickRefsEl.innerHTML = refs
    .map(r => `
      <div class="quick-ref">
        <span class="quick-ref__name">${r.name}</span>
        <span class="quick-ref__val">${r.val}</span>
      </div>
    `)
    .join('');
};

// ── recipe scaler logic ───────────────────────────────────────

let baseServings      = 4;
let currentServings   = 4;
let parsedIngredients = [];

// Converts "1/2" or "1 1/2" style strings to a decimal number
const fracToDecimal = (str) => {
  const parts = str.split('/');
  if (parts.length === 2) {
    return parseFloat(parts[0]) / parseFloat(parts[1]);
  }
  return parseFloat(str);
};

// Parses a single ingredient line like "2 1/2 cups flour" or "200g sugar"
const parseIngredientLine = (line) => {
  line = line.trim();
  if (!line) return null;

  // Match a number at the start: plain int, decimal, fraction, or mixed number
  const amountRe = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d*\.?\d+)\s*/;
  const match = line.match(amountRe);

  if (!match) {
    // No number found — treat whole line as the ingredient name
    return { name: line, amount: null, unit: '', original: line };
  }

  let amount;
  const rawNum = match[1].trim();

  if (rawNum.includes(' ')) {
    // Mixed number like "1 1/2"
    const [whole, frac] = rawNum.split(' ');
    amount = parseInt(whole) + fracToDecimal(frac);
  } else {
    amount = fracToDecimal(rawNum);
  }

  let rest = line.slice(match[0].length);

  // Try to detect a unit word right after the number
  const unitRe = /^(cups?|tbsp|tsp|oz|lbs?|g|kg|ml|l|pinch|cloves?|large?|medium?|small?)\b\s*/i;
  const unitMatch = rest.match(unitRe);
  let unit = '';

  if (unitMatch) {
    unit = unitMatch[0].trim();
    rest = rest.slice(unitMatch[0].length);
  }

  return { name: rest.trim(), amount, unit, original: line };
};

// ── number formatting ─────────────────────────────────────────

// Turns a decimal like 0.5 into "½", 1.25 into "1 ¼", etc.
const formatAmount = (n) => {
  if (n === null) return '';

  const fracs = [
    [0.125, '⅛'],
    [0.25,  '¼'],
    [0.333, '⅓'],
    [0.5,   '½'],
    [0.667, '⅔'],
    [0.75,  '¾'],
  ];

  const whole = Math.floor(n);
  const dec   = n - whole;

  for (const [val, sym] of fracs) {
    if (Math.abs(dec - val) < 0.04) {
      return whole > 0 ? `${whole} ${sym}` : sym;
    }
  }

  // Fall back to plain numbers, rounded appropriately
  if (n >= 100) return Math.round(n).toString();
  if (n >= 10)  return +n.toFixed(1) + '';
  return +n.toFixed(2) + '';
};

const renderOutput = () => {
  if (!parsedIngredients.length) return;

  const ratio = currentServings / baseServings;

  outputList.innerHTML = parsedIngredients.map(ing => {
    if (ing.amount === null) {
      return `<li>
        <span class="ingredient__name">${ing.name}</span>
        <span class="ingredient__amount">—</span>
        <span class="ingredient__scaled ingredient__scaled--same">—</span>
      </li>`;
    }

    const scaled    = ing.amount * ratio;
    const unchanged = Math.abs(scaled - ing.amount) < 0.001;

    return `<li>
      <span class="ingredient__name">${ing.name || 'ingredient'}</span>
      <span class="ingredient__amount">${formatAmount(ing.amount)} ${ing.unit}</span>
      <span class="ingredient__scaled${unchanged ? ' ingredient__scaled--same' : ''}">${formatAmount(scaled)} ${ing.unit}</span>
    </li>`;
  }).join('');
};

const parseAndRender = () => {
  const lines = ingredientInput.value
    .split('\n')
    .filter(l => l.trim());

  if (!lines.length) return;

  parsedIngredients = lines.map(parseIngredientLine).filter(Boolean);
  renderOutput();
};

// ── toast helper ──────────────────────────────────────────────

const showToast = (msg) => {
  toast.textContent = msg;
  toast.classList.add('toast--show');
  setTimeout(() => toast.classList.remove('toast--show'), 2000);
};

// ── event listeners ───────────────────────────────────────────

// Switch category tab
document.querySelectorAll('.tabs__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.tabs__btn--active').classList.remove('tabs__btn--active');
    btn.classList.add('tabs__btn--active');
    currentCat = btn.dataset.cat;
    populateSelects();
    renderRefs();
    doConvert();
  });
});

// Converter inputs
fromValEl.addEventListener('input', doConvert);
fromUnitEl.addEventListener('change', doConvert);
toUnitEl.addEventListener('change', doConvert);

// Servings +/-
document.getElementById('srvUp').addEventListener('click', () => {
  currentServings = Math.min(currentServings + 1, 50);
  srvNum.textContent = currentServings;
  renderOutput();
});

document.getElementById('srvDown').addEventListener('click', () => {
  currentServings = Math.max(currentServings - 1, 1);
  srvNum.textContent = currentServings;
  renderOutput();
});

// Parse button
document.getElementById('parseBtn').addEventListener('click', () => {
  baseServings = currentServings;
  parseAndRender();
});

// Ctrl+Enter shortcut inside textarea
ingredientInput.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    baseServings = currentServings;
    parseAndRender();
  }
});

// Copy scaled list to clipboard
document.getElementById('copyBtn').addEventListener('click', () => {
  if (!parsedIngredients.length) return;

  const ratio = currentServings / baseServings;
  const text  = parsedIngredients.map(ing => {
    if (ing.amount === null) return ing.name;
    return `${formatAmount(ing.amount * ratio)} ${ing.unit} ${ing.name}`.trim();
  }).join('\n');

  navigator.clipboard.writeText(text)
    .then(() => showToast('Copied to clipboard!'))
    .catch(err => console.error('Failed to copy to clipboard:', err));
});

// ── init ──────────────────────────────────────────────────────

const initApp = () => {
  try {
    populateSelects();
    renderRefs();
    doConvert();
  } catch (err) {
    console.error('Failed to initialize app:', err);
  }
};

initApp();