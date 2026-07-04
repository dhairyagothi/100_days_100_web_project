// Clock update function
function updateClock() {
  const now = new Date();

  document.getElementById('hour').textContent = String(now.getHours()).padStart(2, '0');
  document.getElementById('minute').textContent = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('second').textContent = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('date').textContent = now.toLocaleDateString();
  document.getElementById('day').textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
  });
}

// Theme definitions
const themes = {
  mint: { text: '#5c9b7b', bg: '#dff7ea' },
  lavender: { text: '#8b6fb3', bg: '#e9defa' },
  peach: { text: '#d68a72', bg: '#ffe7dd' },
  sky: { text: '#6f9ecf', bg: '#dfefff' },
  sakura: { text: '#c47a94', bg: '#ffdfe8' },
  butter: { text: '#c2a24a', bg: '#fff4c9' },
};

// Helper: Apply theme
function applyTheme(bg, text) {
  const root = document.documentElement;
  root.style.setProperty('--bg', bg);
  root.style.setProperty('--text', text);
  root.style.setProperty('--shadow', bg + '40');
  
  // Adjust divider color
  let r = parseInt(bg.slice(1,3), 16);
  let g = parseInt(bg.slice(3,5), 16);
  let b = parseInt(bg.slice(5,7), 16);
  r = Math.min(255, Math.max(0, r - 20));
  g = Math.min(255, Math.max(0, g - 20));
  b = Math.min(255, Math.max(0, b - 20));
  const divider = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  root.style.setProperty('--divider', divider);
}

// Apply preset theme
function applyPreset(themeName) {
  const theme = themes[themeName];
  if (!theme) return;
  
  applyTheme(theme.bg, theme.text);
  
  // Update active state
  document.querySelectorAll('.color').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  const activeBtn = document.querySelector(`.color[data-theme="${themeName}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-pressed', 'true');
  }
  
  // Sync custom picker
  document.getElementById('customColorPicker').value = theme.bg;
  document.getElementById('customHexInput').value = theme.bg;
}

// Apply custom color
function applyCustomColor(hex) {
  // Validate and format hex
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    if (/^[0-9a-f]{6}$/i.test(hex)) {
      hex = '#' + hex;
    } else if (/^[0-9a-f]{3}$/i.test(hex)) {
      hex = '#' + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    } else {
      alert('Please enter a valid hex color, e.g., #dff7ea');
      return;
    }
  }
  
  // Calculate text color based on background luminance
  let r = parseInt(hex.slice(1,3), 16);
  let g = parseInt(hex.slice(3,5), 16);
  let b = parseInt(hex.slice(5,7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  let text;
  if (luminance > 0.6) {
    // Light background → dark text
    text = `#${Math.max(0, r-80).toString(16).padStart(2,'0')}${Math.max(0, g-80).toString(16).padStart(2,'0')}${Math.max(0, b-80).toString(16).padStart(2,'0')}`;
  } else {
    // Dark background → light text
    text = `#${Math.min(255, r+100).toString(16).padStart(2,'0')}${Math.min(255, g+100).toString(16).padStart(2,'0')}${Math.min(255, b+100).toString(16).padStart(2,'0')}`;
  }
  
  applyTheme(hex, text);
  
  // Deselect preset buttons
  document.querySelectorAll('.color').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  
  // Update custom inputs
  document.getElementById('customColorPicker').value = hex;
  document.getElementById('customHexInput').value = hex;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Preset theme buttons
  document.querySelectorAll('.color[data-theme]').forEach(btn => {
    btn.addEventListener('click', function() {
      applyPreset(this.dataset.theme);
    });
  });
  
  // Custom color picker
  document.getElementById('customColorPicker').addEventListener('input', function() {
    const val = this.value;
    document.getElementById('customHexInput').value = val;
    applyCustomColor(val);
  });
  
  // Custom hex input
  document.getElementById('customHexInput').addEventListener('blur', function() {
    const val = this.value.trim();
    if (val) applyCustomColor(val);
  });
  
  document.getElementById('customHexInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const val = this.value.trim();
      if (val) applyCustomColor(val);
      this.blur();
    }
  });
  
  // Apply button
  document.getElementById('applyCustomBtn').addEventListener('click', function() {
    const val = document.getElementById('customHexInput').value.trim();
    if (val) applyCustomColor(val);
  });
  
  // Reset button
  document.getElementById('resetPresetBtn').addEventListener('click', function() {
    applyPreset('mint');
  });
  
  // Start clock
  updateClock();
  setInterval(updateClock, 1000);
});