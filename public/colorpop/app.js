let state = {
  palette: [
    { hex: '#EED9C4', locked: false },
    { hex: '#DEB887', locked: false },
    { hex: '#C59B76', locked: false },
    { hex: '#A07855', locked: false },
    { hex: '#6B4C35', locked: false }
  ],
  activeIndex: 0, // Currently active color index in palette (0-4)
  favorites: [],
  soundEnabled: true
};

// --- AUDIO FEEDBACK (Web Audio API) ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    if (type === 'copy') {
      // High-pitched double beep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);

      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.5, audioCtx.currentTime); // C6
        gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.15);
      }, 70);

    } else if (type === 'generate') {
      // Soft wave sweep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.15);

    } else if (type === 'favorite') {
      // Sweet ascending major chord arpeggio
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.06, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.2);
      });
    }
  } catch (e) {
    console.warn("Audio Context block or unsupported:", e);
  }
}

// --- UTILITIES ---

// Generate Random Hex
function generateRandomHex() {
  const chars = '0123456789ABCDEF';
  let hex = '#';
  for (let i = 0; i < 6; i++) {
    hex += chars[Math.floor(Math.random() * 16)];
  }
  return hex;
}

// Convert HSL to Hex
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  let rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  let gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  let bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

// Convert Hex to RGB array
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

// Convert RGB to HSL string
function rgbToHslStr(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

// WCAG Contrast Compliance Evaluator
function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05;
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05;
  return Math.max(l1, l2) / Math.min(l1, l2);
}

function evaluateContrast(bgHex) {
  const contrastWithWhite = getContrastRatio(bgHex, '#FFFFFF');
  const contrastWithBlack = getContrastRatio(bgHex, '#000000');

  // Decide best text color
  const textColor = contrastWithWhite >= contrastWithBlack ? '#FFFFFF' : '#000000';
  const bestRatio = Math.max(contrastWithWhite, contrastWithBlack);

  let label = 'Low Contrast';
  let ratingClass = 'fail';

  if (bestRatio >= 7.0) {
    label = 'AAA Pass';
    ratingClass = 'pass';
  } else if (bestRatio >= 4.5) {
    label = 'AA Pass';
    ratingClass = 'pass';
  } else if (bestRatio >= 3.0) {
    label = 'AA Large';
    ratingClass = 'pass';
  }

  return {
    textColor,
    label,
    ratingClass,
    ratio: bestRatio.toFixed(1)
  };
}

// Copy to Clipboard Utility
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }
}

// --- DOM ELEMENTS ---
const orb1 = document.getElementById('orb-1');
const orb2 = document.getElementById('orb-2');
const orb3 = document.getElementById('orb-3');
const orb4 = document.getElementById('orb-4');

const heroCard = document.getElementById('hero-preview-card');
const heroColorDisplay = document.getElementById('hero-color-display');
const activeHexText = document.getElementById('active-hex-text');
const rgbSpecText = document.getElementById('rgb-spec-text');
const hslSpecText = document.getElementById('hsl-spec-text');
const contrastBadge = document.getElementById('contrast-badge');
const contrastVal = document.getElementById('contrast-val');
const colorPickerInput = document.getElementById('color-picker-input');
const generationModeSelect = document.getElementById('generation-mode');

const copyActiveBtn = document.getElementById('copy-active-btn');
const saveActiveBtn = document.getElementById('save-active-btn');
const generateBtn = document.getElementById('generate-btn');
const openExportBtn = document.getElementById('open-export-btn');

const paletteGrid = document.getElementById('palette-grid');

const favoritesCount = document.getElementById('favorites-count');
const favoritesGridList = document.getElementById('favorites-grid-list');
const emptyFavoritesState = document.getElementById('empty-favorites');
const clearAllFavoritesBtn = document.getElementById('clear-all-favorites');

const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundOnIcon = document.getElementById('sound-on-icon');
const soundOffIcon = document.getElementById('sound-off-icon');

// Modals
const exportModal = document.getElementById('export-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const copyCodeBtn = document.getElementById('copy-code-btn');

const exportCssCode = document.getElementById('export-css-code');
const exportTailwindCode = document.getElementById('export-tailwind-code');
const exportJsonCode = document.getElementById('export-json-code');

const keyboardModal = document.getElementById('keyboard-modal');
const keyboardHintBtn = document.getElementById('keyboard-hint-btn');
const closeKeyboardBtn = document.getElementById('close-keyboard-btn');

const toastContainer = document.getElementById('toast-container');

// --- APP LOGIC ---

// Toast alert trigger
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;

  const iconHtml = type === 'success'
    ? `<span class="toast-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>`
    : `<span class="toast-icon error"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>`;

  toast.innerHTML = `${iconHtml}<span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Cleanup after animation completes (3 seconds total)
  setTimeout(() => {
    toast.remove();
  }, 2800);
}

// Generate new random colors for unlocked palette cards based on selection mode
function generatePalette(playChime = true) {
  const mode = generationModeSelect ? generationModeSelect.value : 'random';

  state.palette.forEach(color => {
    if (!color.locked) {
      if (mode === 'nude') {
        const h = Math.floor(Math.random() * (45 - 12 + 1)) + 12; // 12 to 45 (nude terracotta to sand skin beige)
        const s = Math.floor(Math.random() * (45 - 15 + 1)) + 15; // 15% to 45% (low saturation nude)
        const l = Math.floor(Math.random() * (80 - 30 + 1)) + 30; // 30% to 80% (rich range of brown, caramel, beige)
        color.hex = hslToHex(h, s, l);
      } else if (mode === 'pastel') {
        const h = Math.floor(Math.random() * 360);
        const s = Math.floor(Math.random() * (80 - 45 + 1)) + 45; // 45% to 80%
        const l = Math.floor(Math.random() * (95 - 80 + 1)) + 80; // 80% to 95% (light and soft)
        color.hex = hslToHex(h, s, l);
      } else {
        color.hex = generateRandomHex();
      }
    }
  });

  if (playChime) {
    playSound('generate');
  }
  updateUI();
}

// Toggle Lock State
function toggleLock(index, event) {
  if (event) event.stopPropagation(); // prevent setting active index on locking
  state.palette[index].locked = !state.palette[index].locked;
  updateUI();
}

// Save Favorites locally
function saveFavoriteColor(hex) {
  const normalizedHex = hex.toUpperCase();
  if (state.favorites.includes(normalizedHex)) {
    showToast(`${normalizedHex} is already in your favorites!`, 'error');
    return;
  }
  state.favorites.unshift(normalizedHex);
  localStorage.setItem('colorpop_favorites', JSON.stringify(state.favorites));
  playSound('favorite');
  showToast(`Saved ${normalizedHex} to favorites!`);
  updateUI();
}

// Delete Favorite
function deleteFavorite(hex, event) {
  if (event) event.stopPropagation();
  const normalizedHex = hex.toUpperCase();
  state.favorites = state.favorites.filter(c => c !== normalizedHex);
  localStorage.setItem('colorpop_favorites', JSON.stringify(state.favorites));
  showToast(`Removed ${normalizedHex}`);
  updateUI();
}

// Set Active Color index
function setActiveColor(index) {
  state.activeIndex = index;
  colorPickerInput.value = state.palette[index].hex;
  updateUI();
}

// Update Active Color via input picker or hex change
function updateActiveColorValue(hex) {
  const validatedHex = hex.toUpperCase();
  state.palette[state.activeIndex].hex = validatedHex;
  updateUI();
}

// Sound toggle controller
function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  localStorage.setItem('colorpop_sound', state.soundEnabled);
  updateSoundIcon();
}

function updateSoundIcon() {
  if (state.soundEnabled) {
    soundOnIcon.classList.remove('hidden');
    soundOffIcon.classList.add('hidden');
  } else {
    soundOnIcon.classList.add('hidden');
    soundOffIcon.classList.remove('hidden');
  }
}

// Modal open/close actions
function toggleModal(modal, show) {
  if (show) {
    modal.classList.remove('hidden');
    if (modal === exportModal) {
      generateExportCodes();
    }
  } else {
    modal.classList.add('hidden');
  }
}

// Tab controller inside Export Modal
function switchTab(tabId) {
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tabId}`);
  });
}

// Generate Exporter code content
function generateExportCodes() {
  const colors = state.palette.map(c => c.hex);

  // CSS Export Code
  let cssText = `:root {\n`;
  colors.forEach((hex, i) => {
    cssText += `  --color-pop-${i + 1}: ${hex};\n`;
  });
  cssText += `}`;
  exportCssCode.textContent = cssText;

  // Tailwind Export Code
  let twText = `colors: {\n  pop: {\n`;
  colors.forEach((hex, i) => {
    twText += `    '${(i + 1) * 100}': '${hex}',\n`;
  });
  twText += `  }\n}`;
  exportTailwindCode.textContent = twText;

  // JSON Export Code
  const jsonObject = {};
  colors.forEach((hex, i) => {
    jsonObject[`color_${i + 1}`] = hex;
  });
  exportJsonCode.textContent = JSON.stringify(jsonObject, null, 2);
}

// --- RENDER FUNCTIONS ---
function updateUI() {
  const activeColor = state.palette[state.activeIndex].hex;
  const rgb = hexToRgb(activeColor);
  const hsl = rgbToHslStr(rgb[0], rgb[1], rgb[2]);

  // 1. Update Large Preview Block
  heroColorDisplay.style.backgroundColor = activeColor;
  activeHexText.textContent = activeColor;
  rgbSpecText.textContent = `rgb(${rgb.join(', ')})`;
  hslSpecText.textContent = hsl;

  // Check contrast compliance
  const evaluation = evaluateContrast(activeColor);
  heroColorDisplay.style.color = evaluation.textColor;
  contrastVal.textContent = `${evaluation.label} (${evaluation.ratio}:1)`;

  // Update Contrast badge theme
  contrastBadge.className = `contrast-badge ${evaluation.ratingClass}`;

  // Sync picker inputs
  colorPickerInput.value = activeColor;

  // 2. Render 5-Color Palette Cards
  paletteGrid.innerHTML = '';
  state.palette.forEach((color, idx) => {
    const isActive = idx === state.activeIndex;
    const card = document.createElement('div');
    card.className = `palette-card ${isActive ? 'active-selected' : ''}`;
    card.onclick = () => setActiveColor(idx);

    // SVGs for locks and copies
    const lockSvg = color.locked
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`;

    const copySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

    card.innerHTML = `
      <div class="color-block" style="background-color: ${color.hex}"></div>
      <div class="card-controls">
        <button class="lock-btn ${color.locked ? 'locked' : ''}" title="${color.locked ? 'Unlock Color' : 'Lock Color'}">
          ${lockSvg}
        </button>
        <span class="hex-value">${color.hex}</span>
        <button class="copy-btn" title="Copy Hex Code">
          ${copySvg}
        </button>
      </div>
    `;

    // Attach event listeners to inner buttons to avoid card click bubbling
    const lockBtn = card.querySelector('.lock-btn');
    lockBtn.addEventListener('click', (e) => toggleLock(idx, e));

    const copyBtn = card.querySelector('.copy-btn');
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(color.hex).then(() => {
        playSound('copy');
        showToast(`Copied ${color.hex} to clipboard!`);
      });
    });

    paletteGrid.appendChild(card);
  });

  // 3. Update Dynamic Mesh Background
  orb1.style.backgroundColor = state.palette[0].hex;
  orb2.style.backgroundColor = state.palette[1].hex;
  orb3.style.backgroundColor = state.palette[2].hex;
  orb4.style.backgroundColor = state.palette[3].hex;

  // 4. Render Saved Favorites Drawer
  favoritesCount.textContent = state.favorites.length;
  favoritesGridList.innerHTML = '';

  if (state.favorites.length === 0) {
    emptyFavoritesState.classList.remove('hidden');
    clearAllFavoritesBtn.classList.add('hidden');
  } else {
    emptyFavoritesState.classList.add('hidden');
    clearAllFavoritesBtn.classList.remove('hidden');

    state.favorites.forEach(favHex => {
      const chip = document.createElement('div');
      chip.className = 'favorite-chip';
      chip.style.backgroundColor = favHex;

      // Determine contrast text color for the label inside favorite chip
      const evaluationFav = evaluateContrast(favHex);

      chip.innerHTML = `
        <span class="fav-hex-label" style="color: ${evaluationFav.textColor}">${favHex}</span>
        <button class="delete-fav-btn" title="Delete Saved Color">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;

      // Clicking the chip loads it into the active index
      chip.onclick = () => {
        state.palette[state.activeIndex].hex = favHex;
        updateUI();
      };

      // Clicking delete removes it
      const deleteBtn = chip.querySelector('.delete-fav-btn');
      deleteBtn.addEventListener('click', (e) => deleteFavorite(favHex, e));

      favoritesGridList.appendChild(chip);
    });
  }
}

// --- INITIALIZE & ATTACH LISTENERS ---

function init() {
  // Load Favorites from LocalStorage
  const cachedFavs = localStorage.getItem('colorpop_favorites');
  if (cachedFavs) {
    state.favorites = JSON.parse(cachedFavs);
  }

  // Load sound setting
  const cachedSoundSetting = localStorage.getItem('colorpop_sound');
  if (cachedSoundSetting !== null) {
    state.soundEnabled = cachedSoundSetting === 'true';
  }
  updateSoundIcon();

  // Generate first random palette (no audio chime on initial page load)
  generatePalette(false);
}

// Color Picker Inputs
colorPickerInput.addEventListener('input', (e) => {
  updateActiveColorValue(e.target.value);
});

// Generation Mode selector change listener
if (generationModeSelect) {
  generationModeSelect.addEventListener('change', () => {
    generatePalette(true);
  });
}

// Primary Buttons
generateBtn.addEventListener('click', () => generatePalette(true));

copyActiveBtn.addEventListener('click', () => {
  const activeColor = state.palette[state.activeIndex].hex;
  copyToClipboard(activeColor).then(() => {
    playSound('copy');
    showToast(`Copied ${activeColor} to clipboard!`);
  });
});

saveActiveBtn.addEventListener('click', () => {
  const activeColor = state.palette[state.activeIndex].hex;
  saveFavoriteColor(activeColor);
});

clearAllFavoritesBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear all saved colors?")) {
    state.favorites = [];
    localStorage.removeItem('colorpop_favorites');
    showToast("Cleared all saved colors");
    updateUI();
  }
});

// Sound toggle
soundToggleBtn.addEventListener('click', toggleSound);

// Exporter Modal Events
openExportBtn.addEventListener('click', () => toggleModal(exportModal, true));
closeModalBtn.addEventListener('click', () => toggleModal(exportModal, false));
exportModal.addEventListener('click', (e) => {
  if (e.target === exportModal) toggleModal(exportModal, false);
});

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

copyCodeBtn.addEventListener('click', () => {
  const activeTabBtn = document.querySelector('.tab-btn.active');
  const activeTabId = activeTabBtn.dataset.tab;
  let codeText = '';

  if (activeTabId === 'css') codeText = exportCssCode.textContent;
  else if (activeTabId === 'tailwind') codeText = exportTailwindCode.textContent;
  else if (activeTabId === 'json') codeText = exportJsonCode.textContent;

  copyToClipboard(codeText).then(() => {
    playSound('copy');
    showToast("Export template copied!");
  });
});

// Keyboard Shortcuts Modal Events
keyboardHintBtn.addEventListener('click', () => toggleModal(keyboardModal, true));
closeKeyboardBtn.addEventListener('click', () => toggleModal(keyboardModal, false));
keyboardModal.addEventListener('click', (e) => {
  if (e.target === keyboardModal) toggleModal(keyboardModal, false);
});

// Keyboard Shortcut Bindings
document.addEventListener('keydown', (e) => {
  // Prevent shortcut firing if user is inside forms or inputs (though colorpop has no standard text inputs)
  if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
    return;
  }

  const key = e.key.toLowerCase();

  // Spacebar to generate colors
  if (e.code === 'Space') {
    e.preventDefault(); // prevent scrolling the page down
    generatePalette(true);
  }

  // Number keys 1-5 to toggle locks
  if (key >= '1' && key <= '5') {
    const idx = parseInt(key) - 1;
    toggleLock(idx);
  }

  // C to copy active color
  if (key === 'c') {
    const activeColor = state.palette[state.activeIndex].hex;
    copyToClipboard(activeColor).then(() => {
      playSound('copy');
      showToast(`Copied ${activeColor} to clipboard!`);
    });
  }

  // S to save active color to favorites
  if (key === 's') {
    const activeColor = state.palette[state.activeIndex].hex;
    saveFavoriteColor(activeColor);
  }

  // E to open export template
  if (key === 'e') {
    toggleModal(exportModal, exportModal.classList.contains('hidden'));
  }
});

// Start the Application
init();
