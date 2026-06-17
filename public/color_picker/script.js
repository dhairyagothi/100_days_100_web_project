const toast = document.createElement('div');
toast.className = 'copy-toast';
document.body.appendChild(toast);

function showToast(msg) {
  toast.textContent = msg;
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.opacity = '0';
  }, 1200);
}

const redSlider = document.getElementById('red');
const greenSlider = document.getElementById('green');
const blueSlider = document.getElementById('blue');

const colorDisplay = document.getElementById('customColorDisplay');
const hexValue = document.getElementById('hexValue');
const rgbValue = document.getElementById('rgbValue');
const hexInput = document.getElementById('hexInput');
const saveBtn = document.getElementById('saveColorBtn');
const favoritesContainer = document.getElementById('favoritesContainer');
const copyHexBtn = document.getElementById('copyHex');
const copyRgbBtn = document.getElementById('copyRgb');
const copyHslBtn = document.getElementById('copyHsl');

// Palette boxes
const paletteBoxes = [
  document.getElementById('color1'),
  document.getElementById('color2'),
  document.getElementById('color3'),
  document.getElementById('color4'),
  document.getElementById('color5'),
];

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (!/^([A-Fa-f0-9]{6})$/.test(hex)) return null;

  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

// Convert RGB → HSL (needed for palette generation)
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);

  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert HSL → RGB
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Palette generator
function generatePalette(r, g, b) {
  let { h, s, l } = rgbToHsl(r, g, b);

  let colors = [];

  // base color
  colors.push({ r, g, b });

  // complementary
  let comp = hslToRgb((h + 0.5) % 1, s, l);
  colors.push(comp);

  // analogous colors
  let a1 = hslToRgb((h + 0.05) % 1, s, l);
  let a2 = hslToRgb((h - 0.05 + 1) % 1, s, l);

  colors.push(a1);
  colors.push(a2);

  // lighter shade
  let lighter = hslToRgb(h, s, Math.min(1, l + 0.2));
  colors.push(lighter);

  return colors;
}

// Update UI
function updateFromSliders() {
  const r = parseInt(redSlider.value);
  const g = parseInt(greenSlider.value);
  const b = parseInt(blueSlider.value);

  const rgb = `rgb(${r}, ${g}, ${b})`;
  const hex = rgbToHex(r, g, b);

  colorDisplay.style.backgroundColor = rgb;

  rgbValue.textContent = `RGB: ${rgb}`;
  hexValue.textContent = `HEX: ${hex}`;

  hexInput.value = hex;

  // PALETTE UPDATE
  const palette = generatePalette(r, g, b);

  paletteBoxes.forEach((box, i) => {
    const col = palette[i];
    box.style.backgroundColor = `rgb(${col.r}, ${col.g}, ${col.b})`;
  });

  paletteBoxes.forEach((box, i) => {
    const col = palette[i];
    const hex = rgbToHex(col.r, col.g, col.b);

    box.style.backgroundColor = `rgb(${col.r}, ${col.g}, ${col.b})`;

    // IMPORTANT: avoid stacking multiple listeners
    box.onclick = () => copyToClipboard(hex);
  });
}

// HEX input sync
function updateFromHex() {
  const rgb = hexToRgb(hexInput.value);
  if (!rgb) return;

  redSlider.value = rgb.r;
  greenSlider.value = rgb.g;
  blueSlider.value = rgb.b;

  updateFromSliders();
}

// Events
redSlider.addEventListener('input', updateFromSliders);
greenSlider.addEventListener('input', updateFromSliders);
blueSlider.addEventListener('input', updateFromSliders);
let hexTimer;
hexInput.addEventListener('input', () => {
  clearTimeout(hexTimer);

  hexTimer = setTimeout(() => {
    updateFromHex();
  }, 300);
});
updateFromSliders();

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied: ${text}`);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();

    document.execCommand('copy');

    document.body.removeChild(textarea);

    showToast(`Copied: ${text}`);
  }
}

const memoryStore = new Map();

const StorageManager = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return memoryStore.get(key) || null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      memoryStore.set(key, value);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      memoryStore.delete(key);
    }
  },
};

// Initialize favorites from storage
let favorites;

try {
  favorites = JSON.parse(StorageManager.get('favorites') || '[]');

  if (!Array.isArray(favorites)) {
    favorites = [];
  }
} catch {
  favorites = [];
}

function renderFavorites() {
  favoritesContainer.innerHTML = '';

  favorites.forEach((color, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'favorite-item';

    const box = document.createElement('div');
    box.className = 'favorite-box';
    box.style.backgroundColor = color;

    // click to copy
    box.onclick = () => copyToClipboard(color);

    // ❌ remove button
    const removeBtn = document.createElement('button');
    removeBtn.innerText = '✖';
    removeBtn.className = 'remove-fav';

    removeBtn.onclick = (e) => {
      e.stopPropagation(); // prevent copy trigger

      favorites.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      renderFavorites();
      showToast('Removed from favorites');
    };

    wrapper.appendChild(box);
    wrapper.appendChild(removeBtn);
    favoritesContainer.appendChild(wrapper);
  });
}

renderFavorites();

saveBtn.addEventListener('click', () => {
  const currentHex = hexValue.textContent.replace('HEX: ', '');

  if (!favorites.includes(currentHex)) {
    favorites.push(currentHex);
    StorageManager.set('favorites', JSON.stringify(favorites));
    renderFavorites();
    showToast('Color saved ⭐');
  } else {
    showToast('Already in favorites');
  }
});

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);

  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
}

copyHexBtn.onclick = () => {
  copyToClipboard(hexValue.textContent.replace('HEX: ', ''));
};

copyRgbBtn.onclick = () => {
  const r = redSlider.value;
  const g = greenSlider.value;
  const b = blueSlider.value;
  copyToClipboard(`rgb(${r}, ${g}, ${b})`);
};

copyHslBtn.onclick = () => {
  const hsl = rgbToHsl(redSlider.value, greenSlider.value, blueSlider.value);

  copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
};
let toastTimer;

function showToast(msg) {
  clearTimeout(toastTimer);

  toast.textContent = msg;
  toast.style.opacity = '1';

  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
  }, 1200);
}
