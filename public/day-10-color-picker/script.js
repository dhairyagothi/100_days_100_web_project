/* ─── State ─────────────────────────────────── */
let currentHex = '#e94560';
let currentPalette = 'complementary';
let savedColors = JSON.parse(localStorage.getItem('savedColors') || '[]');
let recentHistory = [];

/* ─── DOM refs ──────────────────────────────── */
const colorInput     = document.getElementById('colorInput');
const bgColorInput   = document.getElementById('bgColorInput');
const preview        = document.getElementById('preview');
const previewHex     = document.getElementById('previewHex');
const hexVal         = document.getElementById('hexVal');
const rgbVal         = document.getElementById('rgbVal');
const hslVal         = document.getElementById('hslVal');
const copyBtn        = document.getElementById('copyBtn');
const historyEl      = document.getElementById('history');
const savedEl        = document.getElementById('savedColors');
const toast          = document.getElementById('toast');
const saveBtn        = document.getElementById('saveBtn');
const clearSavedBtn  = document.getElementById('clearSavedBtn');
const exportBtn      = document.getElementById('exportPaletteBtn');
const contrastPreview = document.getElementById('contrastPreview');
const contrastText   = document.getElementById('contrastText');
const contrastScore  = document.getElementById('contrastScore');
const badgeAA        = document.getElementById('badgeAA');
const badgeAAA       = document.getElementById('badgeAAA');
const shadesRow      = document.getElementById('shadesRow');
const tintsRow       = document.getElementById('tintsRow');
const paletteSatches = document.getElementById('paletteSatches');

/* ─── Sliders ───────────────────────────────── */
const sliderR = document.getElementById('sliderR');
const sliderG = document.getElementById('sliderG');
const sliderB = document.getElementById('sliderB');
const sliderH = document.getElementById('sliderH');
const sliderS = document.getElementById('sliderS');
const sliderL = document.getElementById('sliderL');
const valR = document.getElementById('valR');
const valG = document.getElementById('valG');
const valB = document.getElementById('valB');
const valH = document.getElementById('valH');
const valS = document.getElementById('valS');
const valL = document.getElementById('valL');

/* ─── Conversions ───────────────────────────── */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255)
  };
}

/* ─── Contrast ──────────────────────────────── */
function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(hex1, hex2) {
  const { r: r1, g: g1, b: b1 } = hexToRgb(hex1);
  const { r: r2, g: g2, b: b2 } = hexToRgb(hex2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/* ─── Palette generators ────────────────────── */
function generatePalette(hex, type) {
  const { h, s, l } = rgbToHsl(...Object.values(hexToRgb(hex)));
  const toHex = (hue, sat, lig) => {
    const { r, g, b } = hslToRgb(((hue % 360) + 360) % 360, sat, lig);
    return rgbToHex(r, g, b);
  };
  switch (type) {
    case 'complementary':
      return [hex, toHex(h + 180, s, l)];
    case 'triadic':
      return [hex, toHex(h + 120, s, l), toHex(h + 240, s, l)];
    case 'analogous':
      return [toHex(h - 30, s, l), hex, toHex(h + 30, s, l), toHex(h + 60, s, l)];
    case 'split':
      return [hex, toHex(h + 150, s, l), toHex(h + 210, s, l)];
    default:
      return [hex];
  }
}

/* ─── Shades & Tints ────────────────────────── */
function generateShades(hex) {
  const { h, s, l } = rgbToHsl(...Object.values(hexToRgb(hex)));
  const shades = [], tints = [];
  for (let i = 1; i <= 5; i++) {
    const newL = Math.max(0, l - i * (l / 5.5));
    const { r, g, b } = hslToRgb(h, s, Math.round(newL));
    shades.push(rgbToHex(r, g, b));
  }
  for (let i = 1; i <= 5; i++) {
    const newL = Math.min(100, l + i * ((100 - l) / 5.5));
    const { r, g, b } = hslToRgb(h, s, Math.round(newL));
    tints.push(rgbToHex(r, g, b));
  }
  return { shades, tints };
}

/* ─── Core update ───────────────────────────── */
function updateColor(hex, source = 'picker') {
  currentHex = hex.toLowerCase();
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);

  // Preview
  preview.style.background = hex;
  previewHex.textContent = hex.toUpperCase();
  copyBtn.style.background = hex;

  // Value displays
  hexVal.textContent = hex.toUpperCase();
  rgbVal.textContent = `rgb(${r},${g},${b})`;
  hslVal.textContent = `hsl(${h},${s}%,${l}%)`;

  // Sync color input
  if (source !== 'picker') colorInput.value = hex;

  // Sync RGB sliders
  if (source !== 'rgb') {
    sliderR.value = r; valR.textContent = r;
    sliderG.value = g; valG.textContent = g;
    sliderB.value = b; valB.textContent = b;
  }

  // Sync HSL sliders
  if (source !== 'hsl') {
    sliderH.value = h; valH.textContent = h + '°';
    sliderS.value = s; valS.textContent = s + '%';
    sliderL.value = l; valL.textContent = l + '%';
  }

  // History
  if (!recentHistory.includes(currentHex)) {
    recentHistory.unshift(currentHex);
    if (recentHistory.length > 12) recentHistory.pop();
    renderHistory();
  }

  // Contrast
  updateContrast();

  // Shades/tints
  renderShadesTints(hex);

  // Palette
  renderPalette();
}

/* ─── Contrast updater ──────────────────────── */
function updateContrast() {
  const bg = bgColorInput.value;
  const ratio = contrastRatio(currentHex, bg);
  const rounded = Math.round(ratio * 10) / 10;

  contrastPreview.style.background = bg;
  contrastText.style.color = currentHex;
  contrastScore.textContent = `${rounded} : 1`;

  const passAA  = ratio >= 4.5;
  const passAAA = ratio >= 7;

  badgeAA.textContent  = passAA  ? 'AA ✓'  : 'AA ✗';
  badgeAA.className    = 'badge ' + (passAA  ? 'pass' : 'fail');
  badgeAAA.textContent = passAAA ? 'AAA ✓' : 'AAA ✗';
  badgeAAA.className   = 'badge ' + (passAAA ? 'pass' : 'fail');
}

/* ─── Render: Shades & Tints ────────────────── */
function renderShadesTints(hex) {
  const { shades, tints } = generateShades(hex);
  shadesRow.innerHTML = '';
  tintsRow.innerHTML = '';

  shades.forEach(c => {
    const el = document.createElement('div');
    el.className = 'shade-swatch';
    el.style.background = c;
    el.title = c.toUpperCase();
    el.addEventListener('click', () => { updateColor(c); showToast(c.toUpperCase() + ' copied'); navigator.clipboard.writeText(c.toUpperCase()); });
    shadesRow.appendChild(el);
  });

  tints.forEach(c => {
    const el = document.createElement('div');
    el.className = 'shade-swatch';
    el.style.background = c;
    el.title = c.toUpperCase();
    el.addEventListener('click', () => { updateColor(c); showToast(c.toUpperCase() + ' copied'); navigator.clipboard.writeText(c.toUpperCase()); });
    tintsRow.appendChild(el);
  });
}

/* ─── Render: Palette ───────────────────────── */
function renderPalette() {
  paletteSatches.innerHTML = '';
  const colors = generatePalette(currentHex, currentPalette);
  colors.forEach(c => {
    const wrap = document.createElement('div');
    wrap.className = 'palette-swatch';
    wrap.innerHTML = `<div class="p-color" style="background:${c}"></div><div class="p-hex">${c.toUpperCase()}</div>`;
    wrap.title = c.toUpperCase();
    wrap.addEventListener('click', () => { updateColor(c); navigator.clipboard.writeText(c.toUpperCase()); showToast(c.toUpperCase() + ' copied'); });
    paletteSatches.appendChild(wrap);
  });
}

/* ─── Render: Recent history ─────────────────── */
function renderHistory() {
  historyEl.innerHTML = '';
  recentHistory.forEach(c => {
    historyEl.appendChild(makeSwatch(c, () => updateColor(c)));
  });
}

/* ─── Render: Saved colors ──────────────────── */
function renderSaved() {
  savedEl.innerHTML = '';
  savedColors.forEach(c => {
    savedEl.appendChild(makeSwatch(c, () => updateColor(c)));
  });
}

/* ─── Swatch factory ────────────────────────── */
function makeSwatch(color, onClick) {
  const sw = document.createElement('div');
  sw.className = 'history-swatch';
  sw.style.background = color;
  const tip = document.createElement('span');
  tip.className = 'swatch-tip';
  tip.textContent = color.toUpperCase();
  sw.appendChild(tip);
  sw.addEventListener('click', onClick);
  return sw;
}

/* ─── Toast ─────────────────────────────────── */
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

/* ─── Event listeners ───────────────────────── */

// Native color picker
colorInput.addEventListener('input', e => updateColor(e.target.value, 'picker'));

// RGB sliders
[sliderR, sliderG, sliderB].forEach(slider => {
  slider.addEventListener('input', () => {
    const r = +sliderR.value, g = +sliderG.value, b = +sliderB.value;
    valR.textContent = r; valG.textContent = g; valB.textContent = b;
    updateColor(rgbToHex(r, g, b), 'rgb');
  });
});

// HSL sliders
[sliderH, sliderS, sliderL].forEach(slider => {
  slider.addEventListener('input', () => {
    const h = +sliderH.value, s = +sliderS.value, l = +sliderL.value;
    valH.textContent = h + '°'; valS.textContent = s + '%'; valL.textContent = l + '%';
    const { r, g, b } = hslToRgb(h, s, l);
    updateColor(rgbToHex(r, g, b), 'hsl');
  });
});

// BG color for contrast
bgColorInput.addEventListener('input', updateContrast);

// Copy HEX button
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(hexVal.textContent).then(() => showToast('HEX Copied! ✓'));
});

// Click value blocks to copy
document.querySelectorAll('.value-block').forEach(block => {
  block.addEventListener('click', () => {
    const type = block.dataset.copy;
    let text = '';
    if (type === 'hex') text = hexVal.textContent;
    if (type === 'rgb') text = rgbVal.textContent;
    if (type === 'hsl') text = hslVal.textContent;
    navigator.clipboard.writeText(text).then(() => showToast(type.toUpperCase() + ' Copied! ✓'));
  });
});

// Palette tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPalette = btn.dataset.palette;
    renderPalette();
  });
});

// Save color
saveBtn.addEventListener('click', () => {
  if (!savedColors.includes(currentHex)) {
    savedColors.unshift(currentHex);
    if (savedColors.length > 20) savedColors.pop();
    localStorage.setItem('savedColors', JSON.stringify(savedColors));
    renderSaved();
    showToast('Color saved!');
  } else {
    showToast('Already saved');
  }
});

// Clear saved
clearSavedBtn.addEventListener('click', () => {
  savedColors = [];
  localStorage.setItem('savedColors', JSON.stringify(savedColors));
  renderSaved();
  showToast('Cleared');
});

// Export CSS variables
exportBtn.addEventListener('click', () => {
  const colors = generatePalette(currentHex, currentPalette);
  const vars = colors.map((c, i) => `  --color-${i + 1}: ${c.toUpperCase()};`).join('\n');
  const base = `  --color-base: ${currentHex.toUpperCase()};\n`;
  const output = `:root {\n${base}${vars}\n}`;
  navigator.clipboard.writeText(output).then(() => showToast('CSS vars copied!'));
});

/* ─── Init ──────────────────────────────────── */
renderSaved();
updateColor('#e94560');