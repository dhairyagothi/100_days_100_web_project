// Initialize toast element for copy feedback
const toast = document.createElement('div');
toast.className = 'copy-toast';
document.body.appendChild(toast);

let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-55%) scale(1.05)';

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) scale(1)';
  }, 150);

  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
  }, 1200);
}

// Select DOM elements
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
const bgModeSelect = document.getElementById('bgModeSelect');

// Palette boxes
const paletteBoxes = [
    document.getElementById("color1"),
    document.getElementById("color2"),
    document.getElementById("color3"),
    document.getElementById("color4"),
    document.getElementById("color5")
];

// Utility: RGB to HEX
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// Utility: HEX to RGB
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (!/^([A-Fa-f0-9]{6})$/.test(hex))
        return null;

    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };
}

// Utility: RGB to HSL
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

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// Utility: HSL to RGB
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
        b: Math.round(b * 255)
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
  let comp = hslToRgb((h + 180) % 360, s, l);
  colors.push(comp);

  // analogous colors
  let a1 = hslToRgb((h + 30) % 360, s, l);
  let a2 = hslToRgb((h - 30 + 360) % 360, s, l);

  colors.push(a1);
  colors.push(a2);

  // lighter shade
  let lighter = hslToRgb(h, s, Math.min(100, l + 20));
  colors.push(lighter);

  return colors;
}

// Synchronize body background and container accessibility details
function updateBackgroundAndTheme(r, g, b, hex) {
  const root = document.documentElement;
  const hsl = rgbToHsl(r, g, b);
  
  // Calculate relative luminance for contrast/accessibility
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  
  // Generate theme variations
  const darkL = Math.max(0, hsl.l - 15);
  const themeColorDark = `hsl(${hsl.h}, ${hsl.s}%, ${darkL}%)`;
  
  const lightL = Math.min(100, hsl.l + 15);
  const themeColorLight = `hsl(${hsl.h}, ${hsl.s}%, ${lightL}%)`;
  
  const compH = (hsl.h + 180) % 360;
  const themeColorComp = `hsl(${compH}, ${hsl.s}%, ${hsl.l}%)`;
  
  // Set theme variables on root
  root.style.setProperty('--theme-color', hex);
  root.style.setProperty('--theme-color-dark', themeColorDark);
  root.style.setProperty('--theme-color-light', themeColorLight);
  root.style.setProperty('--theme-contrast-text', luminance > 0.6 ? '#1e293b' : '#ffffff');
  
  // Adjust container styling dynamically to maintain accessibility
  if (luminance > 0.5) {
    root.style.setProperty('--container-bg', 'rgba(255, 255, 255, 0.92)');
    root.style.setProperty('--container-text', '#1e293b');
    root.style.setProperty('--container-border', hex);
    root.style.setProperty('--input-bg', '#ffffff');
    root.style.setProperty('--input-text', '#1e293b');
    root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
  } else {
    root.style.setProperty('--container-bg', 'rgba(15, 23, 42, 0.90)');
    root.style.setProperty('--container-text', '#f8fafc');
    root.style.setProperty('--container-border', themeColorLight);
    root.style.setProperty('--input-bg', '#1e293b');
    root.style.setProperty('--input-text', '#f8fafc');
    root.style.setProperty('--shadow-color', `rgba(${r}, ${g}, ${b}, 0.35)`);
  }
  
  // Update background variables based on selected mode
  const bgMode = bgModeSelect ? bgModeSelect.value : 'gradient';
  
  if (bgMode === 'solid') {
    root.style.setProperty('--gradient-color-1', hex);
    root.style.setProperty('--gradient-color-2', hex);
  } else if (bgMode === 'gradient') {
    root.style.setProperty('--gradient-color-1', hex);
    root.style.setProperty('--gradient-color-2', themeColorDark);
  } else if (bgMode === 'complementary') {
    root.style.setProperty('--gradient-color-1', hex);
    root.style.setProperty('--gradient-color-2', themeColorComp);
  }
}

// Update UI state from R, G, B slider values
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

  // Background and theme updates
  updateBackgroundAndTheme(r, g, b, hex);

  // Generate palette
  const palette = generatePalette(r, g, b);

    paletteBoxes.forEach((box, i) => {
        const col = palette[i];
        const hex = rgbToHex(col.r, col.g, col.b);

        box.style.backgroundColor = `rgb(${col.r}, ${col.g}, ${col.b})`;

        // IMPORTANT: avoid stacking multiple listeners
        box.onclick = () => copyToClipboard(hex);
    });
}

// Sync values from HEX input box
function updateFromHex() {
  const rgb = hexToRgb(hexInput.value);
  if (!rgb) return;

  redSlider.value = rgb.r;
  greenSlider.value = rgb.g;
  blueSlider.value = rgb.b;

  updateFromSliders();
}

// Event Listeners for sliders
redSlider.addEventListener('input', updateFromSliders);
greenSlider.addEventListener('input', updateFromSliders);
blueSlider.addEventListener('input', updateFromSliders);

// Event Listener for HEX input (with 300ms debounce)
let hexTimer;
hexInput.addEventListener("input", () => {
    clearTimeout(hexTimer);

    hexTimer = setTimeout(() => {
        updateFromHex();
    }, 300);
});

// Event Listener for background mode selector
if (bgModeSelect) {
  bgModeSelect.addEventListener('change', () => {
    const r = parseInt(redSlider.value);
    const g = parseInt(greenSlider.value);
    const b = parseInt(blueSlider.value);
    const hex = rgbToHex(r, g, b);
    updateBackgroundAndTheme(r, g, b, hex);
  });
}

// Initialize on page load
updateFromSliders();

// Clipboard Copy Utility
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast(`Copied: ${text}`);
    } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();

        document.execCommand("copy");

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
    }
};

function renderFavorites() {
    favoritesContainer.innerHTML = "";

    favorites.forEach((color, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "favorite-item";

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

// Favorites state management
let favorites;
try {
  favorites = JSON.parse(StorageManager.get('favorites') || '[]');
  if (!Array.isArray(favorites)) {
    favorites = [];
  }
} catch {
  favorites = [];
}

// Render list of favorite colors
function renderFavorites() {
  favoritesContainer.innerHTML = '';

  favorites.forEach((color, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'favorite-item';

    const box = document.createElement('div');
    box.className = 'favorite-box';
    box.style.backgroundColor = color;

    // Click loads color + copies
    box.onclick = () => {
      const rgb = hexToRgb(color);
      if (rgb) {
        redSlider.value = rgb.r;
        greenSlider.value = rgb.g;
        blueSlider.value = rgb.b;
        updateFromSliders();
      }
      copyToClipboard(color);
    };

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.innerText = '✖';
    removeBtn.className = 'remove-fav';
    removeBtn.onclick = (e) => {
      e.stopPropagation(); // prevent select trigger
      favorites.splice(index, 1);
      StorageManager.set('favorites', JSON.stringify(favorites));
      renderFavorites();
      showToast('Removed from favorites');
    };

    wrapper.appendChild(box);
    wrapper.appendChild(removeBtn);
    favoritesContainer.appendChild(wrapper);
  });
}

// Initial favorites rendering
renderFavorites();

saveBtn.addEventListener("click", () => {
    const currentHex = hexValue.textContent.replace("HEX: ", "");

    if (!favorites.includes(currentHex)) {
        favorites.push(currentHex);
        StorageManager.set(
            "favorites",
            JSON.stringify(favorites)
        );
        renderFavorites();
        showToast("Color saved ⭐");
    } else {
        showToast("Already in favorites");
    }
});

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;

    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
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
    const hsl = rgbToHsl(
        redSlider.value,
        greenSlider.value,
        blueSlider.value
    );

    copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
};
let toastTimer;

function showToast(msg) {
    clearTimeout(toastTimer);

    toast.textContent = msg;
    toast.style.opacity = "1";

    toastTimer = setTimeout(() => {
        toast.style.opacity = "0";
    }, 1200);
}
