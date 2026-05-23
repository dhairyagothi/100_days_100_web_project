/* ============================================================
   COLOR PALETTE STUDIO — script.js
   Full color theory engine: HSL math + harmony modes + export
   ============================================================ */

'use strict';

/* ── DOM references ───────────────────────────────────────── */
const seedColorInput   = document.getElementById('seedColor');
const hexInput         = document.getElementById('hexInput');
const harmonySelect    = document.getElementById('harmonySelect');
const countSlider      = document.getElementById('countSlider');
const countLabel       = document.getElementById('countLabel');
const generateBtn      = document.getElementById('generateBtn');
const randomBtn        = document.getElementById('randomBtn');
const exportCSSBtn     = document.getElementById('exportCSSBtn');
const paletteGrid      = document.getElementById('paletteGrid');
const paletteStrip     = document.getElementById('paletteStrip');
const gridViewBtn      = document.getElementById('gridViewBtn');
const listViewBtn      = document.getElementById('listViewBtn');
const detailPanel      = document.getElementById('detailPanel');
const detailSwatch     = document.getElementById('detailSwatch');
const dHex             = document.getElementById('dHex');
const dRgb             = document.getElementById('dRgb');
const dHsl             = document.getElementById('dHsl');
const closeDetail      = document.getElementById('closeDetail');
const savedList        = document.getElementById('savedList');
const savePaletteBtn   = document.getElementById('savePaletteBtn');
const exportModal      = document.getElementById('exportModal');
const cssOutput        = document.getElementById('cssOutput');
const copyCSSBtn       = document.getElementById('copyCSSBtn');
const downloadCSSBtn   = document.getElementById('downloadCSSBtn');
const closeModal       = document.getElementById('closeModal');
const toastEl          = document.getElementById('toast');

/* ── State ────────────────────────────────────────────────── */
let currentPalette = [];    // Array of hex strings
let viewMode       = 'grid';
let savedPalettes  = JSON.parse(localStorage.getItem('colorPalettes') || '[]');
let toastTimer     = null;

/* ═══════════════════════════════════════════════════════════
   COLOR MATH UTILITIES
═══════════════════════════════════════════════════════════ */

/**
 * Parse a hex string like "#6366f1" → {r, g, b} (0-255)
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

/**
 * {r,g,b} (0-255) → {h, s, l} (h: 0-360, s/l: 0-100)
 */
function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

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

/**
 * {h, s, l} → {r, g, b}
 */
function hslToRgb({ h, s, l }) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/**
 * {r,g,b} → "#rrggbb"
 */
function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

/**
 * hsl object → "#rrggbb"
 */
function hslToHex(hsl) {
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Relative luminance for accessibility contrast math
 */
function getLuminance({ r, g, b }) {
  const toLinear = c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Contrast ratio between two hex colors (for readability badge)
 */
function contrastRatio(hex1, hex2) {
  const l1 = getLuminance(hexToRgb(hex1));
  const l2 = getLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(1);
}

/**
 * Return a human-readable luminance label
 */
function luminanceLabel(hex) {
  const lum = getLuminance(hexToRgb(hex));
  if (lum > 0.7) return 'Very Light';
  if (lum > 0.4) return 'Light';
  if (lum > 0.15) return 'Mid';
  if (lum > 0.05) return 'Dark';
  return 'Very Dark';
}

/* ═══════════════════════════════════════════════════════════
   HARMONY GENERATORS
═══════════════════════════════════════════════════════════ */

function generatePalette(seedHex, mode, count) {
  const rgb = hexToRgb(seedHex);
  const hsl = rgbToHsl(rgb);
  const colors = [];

  switch (mode) {
    case 'monochromatic': {
      // Evenly distribute lightness from seed L ±40
      const minL = Math.max(10, hsl.l - 40);
      const maxL = Math.min(92, hsl.l + 40);
      const step = (maxL - minL) / (count - 1);
      for (let i = 0; i < count; i++) {
        colors.push(hslToHex({ h: hsl.h, s: hsl.s, l: Math.round(minL + step * i) }));
      }
      break;
    }
    case 'analogous': {
      const spread = 40;
      const startH = (hsl.h - spread + 360) % 360;
      const step = (spread * 2) / (count - 1);
      for (let i = 0; i < count; i++) {
        const h = Math.round((startH + step * i + 360) % 360);
        colors.push(hslToHex({ h, s: hsl.s, l: hsl.l }));
      }
      break;
    }
    case 'complementary': {
      const compH = (hsl.h + 180) % 360;
      const half = Math.floor(count / 2);
      for (let i = 0; i < half; i++) {
        const lStep = (i / (half - 1 || 1)) * 30 - 15;
        colors.push(hslToHex({ h: hsl.h, s: hsl.s, l: Math.max(15, Math.min(85, hsl.l + lStep)) }));
      }
      for (let i = 0; i < count - half; i++) {
        const lStep = (i / (count - half - 1 || 1)) * 30 - 15;
        colors.push(hslToHex({ h: compH, s: hsl.s, l: Math.max(15, Math.min(85, hsl.l + lStep)) }));
      }
      break;
    }
    case 'triadic': {
      const hues = [hsl.h, (hsl.h + 120) % 360, (hsl.h + 240) % 360];
      const base = hues.map(h => hslToHex({ h, s: hsl.s, l: hsl.l }));
      // Fill remaining by adjusting lightness of each triadic color
      for (let i = 0; i < count; i++) {
        const h = hues[i % 3];
        const lDelta = Math.floor(i / 3) * 15;
        colors.push(hslToHex({ h, s: hsl.s, l: Math.max(15, Math.min(85, hsl.l + lDelta)) }));
      }
      // Trim to count
      colors.length = count;
      break;
    }
    case 'tetradic': {
      const hues = [hsl.h, (hsl.h + 90) % 360, (hsl.h + 180) % 360, (hsl.h + 270) % 360];
      for (let i = 0; i < count; i++) {
        const h = hues[i % 4];
        const lDelta = Math.floor(i / 4) * 12;
        colors.push(hslToHex({ h, s: hsl.s, l: Math.max(15, Math.min(85, hsl.l + lDelta)) }));
      }
      colors.length = count;
      break;
    }
    case 'split-complementary': {
      const hues = [hsl.h, (hsl.h + 150) % 360, (hsl.h + 210) % 360];
      for (let i = 0; i < count; i++) {
        const h = hues[i % 3];
        const lDelta = Math.floor(i / 3) * 12;
        colors.push(hslToHex({ h, s: hsl.s, l: Math.max(15, Math.min(85, hsl.l + lDelta)) }));
      }
      colors.length = count;
      break;
    }
    case 'shades': {
      for (let i = 0; i < count; i++) {
        const l = Math.round(5 + (90 / (count - 1)) * i);
        colors.push(hslToHex({ h: hsl.h, s: Math.max(10, hsl.s - 5), l }));
      }
      break;
    }
  }

  return colors;
}

/* ═══════════════════════════════════════════════════════════
   RENDER
═══════════════════════════════════════════════════════════ */

function renderGrid(palette) {
  paletteGrid.innerHTML = '';
  palette.forEach(hex => {
    const card = document.createElement('div');
    card.className = 'swatch-card';
    card.setAttribute('title', `Click for details: ${hex}`);
    card.innerHTML = `
      <div class="swatch-color" style="background:${hex}">
        <button class="swatch-copy-btn" data-hex="${hex}">Copy</button>
      </div>
      <div class="swatch-info">
        <div class="swatch-hex">${hex.toUpperCase()}</div>
        <div class="swatch-luminance">${luminanceLabel(hex)}</div>
      </div>
    `;
    card.addEventListener('click', (e) => {
      if (e.target.closest('.swatch-copy-btn')) return;
      openDetail(hex);
    });
    card.querySelector('.swatch-copy-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      copyText(hex.toUpperCase());
    });
    paletteGrid.appendChild(card);
  });
}

function renderStrip(palette) {
  paletteStrip.innerHTML = '';
  palette.forEach(hex => {
    const div = document.createElement('div');
    div.className = 'strip-swatch';
    div.style.background = hex;
    div.setAttribute('title', hex);
    div.innerHTML = `<div class="strip-label">${hex.toUpperCase()}</div>`;
    div.addEventListener('click', () => openDetail(hex));
    paletteStrip.appendChild(div);
  });
}

function applyPalette(palette) {
  currentPalette = palette;
  renderGrid(palette);
  renderStrip(palette);
  detailPanel.classList.add('hidden');
}

/* ── Detail Panel ─────────────────────────────────────────── */
function openDetail(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  detailSwatch.style.background = hex;
  dHex.textContent = hex.toUpperCase();
  dRgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  dHsl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  detailPanel.classList.remove('hidden');
  detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── CSS Export ───────────────────────────────────────────── */
function generateCSS(palette) {
  const lines = [`:root {`];
  const harmony = harmonySelect.value;
  lines.push(`  /* Generated with Color Palette Studio */`);
  lines.push(`  /* Harmony: ${harmony} | Swatches: ${palette.length} */`);
  lines.push('');
  palette.forEach((hex, i) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);
    lines.push(`  --color-${i + 1}: ${hex.toUpperCase()};`);
    lines.push(`  --color-${i + 1}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};`);
    lines.push(`  --color-${i + 1}-hsl: ${hsl.h}deg ${hsl.s}% ${hsl.l}%;`);
    if (i < palette.length - 1) lines.push('');
  });
  lines.push(`}`);
  return lines.join('\n');
}

/* ── Saved Palettes ───────────────────────────────────────── */
function renderSaved() {
  if (savedPalettes.length === 0) {
    savedList.innerHTML = '<p class="empty-hint">No palettes saved yet. Generate one and hit Save!</p>';
    return;
  }
  savedList.innerHTML = '';
  savedPalettes.forEach((entry, idx) => {
    const el = document.createElement('div');
    el.className = 'saved-entry';
    const dotsHTML = entry.palette
      .slice(0, 8)
      .map(h => `<div class="saved-dot" style="background:${h}" title="${h}"></div>`)
      .join('');
    el.innerHTML = `
      <div class="saved-swatches">${dotsHTML}</div>
      <div class="saved-meta">
        <div class="saved-label">${entry.harmony} · ${entry.palette.length} colors</div>
        <div class="saved-time">${entry.time}</div>
      </div>
      <div class="saved-actions">
        <button class="saved-load-btn" data-idx="${idx}">Load</button>
        <button class="saved-del-btn"  data-idx="${idx}">✕</button>
      </div>
    `;
    savedList.appendChild(el);
  });
}

function saveCurrent() {
  if (currentPalette.length === 0) {
    showToast('Generate a palette first!');
    return;
  }
  const now = new Date();
  savedPalettes.unshift({
    palette: [...currentPalette],
    harmony: harmonySelect.value,
    seed: seedColorInput.value,
    time: now.toLocaleString(),
  });
  if (savedPalettes.length > 20) savedPalettes.pop(); // cap at 20
  localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
  renderSaved();
  showToast('Palette saved! 🎨');
}

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast(`Copied: ${text}`))
    .catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(`Copied: ${text}`);
    });
}

function randomHex() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

function isValidHex(str) {
  return /^#?[0-9a-fA-F]{6}$/.test(str.trim());
}

function buildAndRender() {
  const seed = seedColorInput.value;
  const mode = harmonySelect.value;
  const count = parseInt(countSlider.value);
  applyPalette(generatePalette(seed, mode, count));
}

/* ═══════════════════════════════════════════════════════════
   EVENT LISTENERS
═══════════════════════════════════════════════════════════ */

// Seed color picker → sync hex text input
seedColorInput.addEventListener('input', () => {
  hexInput.value = seedColorInput.value;
  buildAndRender();
});

// Manual hex text entry
hexInput.addEventListener('input', () => {
  let val = hexInput.value.trim();
  if (!val.startsWith('#')) val = '#' + val;
  if (isValidHex(val)) {
    seedColorInput.value = val;
    buildAndRender();
  }
});
hexInput.addEventListener('blur', () => {
  let val = hexInput.value.trim();
  if (!val.startsWith('#')) val = '#' + val;
  if (!isValidHex(val)) {
    hexInput.value = seedColorInput.value;
    showToast('Invalid hex color. Reverted.');
  }
});

// Harmony / count changes
harmonySelect.addEventListener('change', buildAndRender);
countSlider.addEventListener('input', () => {
  countLabel.textContent = countSlider.value;
  buildAndRender();
});

// Buttons
generateBtn.addEventListener('click', buildAndRender);
randomBtn.addEventListener('click', () => {
  const hex = randomHex();
  seedColorInput.value = hex;
  hexInput.value = hex;
  buildAndRender();
  showToast('Random seed applied!');
});

// View toggle
gridViewBtn.addEventListener('click', () => {
  viewMode = 'grid';
  paletteGrid.classList.remove('hidden');
  paletteStrip.classList.add('hidden');
  gridViewBtn.classList.add('active');
  listViewBtn.classList.remove('active');
});
listViewBtn.addEventListener('click', () => {
  viewMode = 'list';
  paletteGrid.classList.add('hidden');
  paletteStrip.classList.remove('hidden');
  listViewBtn.classList.add('active');
  gridViewBtn.classList.remove('active');
});

// Detail panel close
closeDetail.addEventListener('click', () => detailPanel.classList.add('hidden'));

// Copy small buttons inside detail panel
document.querySelectorAll('.copy-small').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (target) copyText(target.textContent);
  });
});

// Export CSS button
exportCSSBtn.addEventListener('click', () => {
  if (currentPalette.length === 0) { showToast('Generate a palette first!'); return; }
  cssOutput.textContent = generateCSS(currentPalette);
  exportModal.classList.remove('hidden');
});
closeModal.addEventListener('click', () => exportModal.classList.add('hidden'));
exportModal.addEventListener('click', (e) => {
  if (e.target === exportModal) exportModal.classList.add('hidden');
});
copyCSSBtn.addEventListener('click', () => {
  copyText(cssOutput.textContent);
});
downloadCSSBtn.addEventListener('click', () => {
  const blob = new Blob([cssOutput.textContent], { type: 'text/css' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'palette.css';
  a.click();
  showToast('CSS file downloaded!');
});

// Save palette
savePaletteBtn.addEventListener('click', saveCurrent);

// Saved list delegated events (load / delete)
savedList.addEventListener('click', (e) => {
  const loadBtn = e.target.closest('.saved-load-btn');
  const delBtn  = e.target.closest('.saved-del-btn');
  if (loadBtn) {
    const idx = parseInt(loadBtn.dataset.idx);
    const entry = savedPalettes[idx];
    seedColorInput.value = entry.seed;
    hexInput.value = entry.seed;
    harmonySelect.value = entry.harmony;
    applyPalette(entry.palette);
    showToast('Palette loaded!');
  }
  if (delBtn) {
    const idx = parseInt(delBtn.dataset.idx);
    savedPalettes.splice(idx, 1);
    localStorage.setItem('colorPalettes', JSON.stringify(savedPalettes));
    renderSaved();
    showToast('Palette deleted.');
  }
});

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
countLabel.textContent = countSlider.value;
buildAndRender();
renderSaved();
