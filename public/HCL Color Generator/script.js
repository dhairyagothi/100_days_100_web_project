
const hueSlider        = document.getElementById('hue');
const saturationSlider = document.getElementById('saturation');
const lightnessSlider  = document.getElementById('lightness');

const colorDisplay = document.getElementById('customColorDisplay');
const colorValue = document.getElementById('colorValue');

const hueValue        = document.getElementById('hueValue');
const saturationValue = document.getElementById('saturationValue');
const lightnessValue  = document.getElementById('lightnessValue');

const copyBtn = document.getElementById('copyBtn');

const orb1 = document.querySelector('.orb1');
const orb2 = document.querySelector('.orb2');
const orb3 = document.querySelector('.orb3');

function updateColor() {
  const hue        = hueSlider.value;
  const saturation = saturationSlider.value;
  const lightness  = lightnessSlider.value;

  hueValue.textContent        = hue;
  saturationValue.textContent = saturation + '%';
  lightnessValue.textContent  = lightness + '%';

  const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  colorDisplay.style.backgroundColor = hsl;
  colorValue.textContent = hsl;
  colorDisplay.style.boxShadow = `0 8px 40px hsl(${hue}, ${saturation}%, ${lightness}%, 0.5)`;

  orb1.style.background = hsl;
  orb2.style.background = hsl;
  orb3.style.background = hsl;

}

hueSlider.addEventListener('input', updateColor);
saturationSlider.addEventListener('input', updateColor);
lightnessSlider.addEventListener('input', updateColor);


copyBtn.addEventListener('click', () => {
  const hue        = hueSlider.value;
  const saturation = saturationSlider.value;
  const lightness  = lightnessSlider.value;
  const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  navigator.clipboard.writeText(hsl);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => copyBtn.textContent = 'Copy Color', 1500);
});

// Quick Color Palette Logic
const quickPalette = document.getElementById('quickPalette');

const presetColors = [
  { h: 348, s: 83, l: 47 },   // Crimson
  { h: 16, s: 100, l: 50 },   // Orange
  { h: 43, s: 100, l: 50 },   // Gold
  { h: 145, s: 63, l: 42 },   // Green
  { h: 184, s: 100, l: 38 },  // Teal
  { h: 211, s: 100, l: 50 },  // Blue
  { h: 262, s: 52, l: 47 },   // Purple
  { h: 330, s: 76, l: 50 },   // Magenta
  { h: 0, s: 0, l: 15 },      // Very Dark Gray
  { h: 0, s: 0, l: 50 },      // Neutral Gray
  { h: 0, s: 0, l: 85 },      // Light Gray
  { h: 0, s: 0, l: 95 }       // Off White
];

presetColors.forEach(color => {
  const swatch = document.createElement('button');
  swatch.className = 'palette-swatch';
  swatch.style.backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
  swatch.setAttribute('aria-label', `Color hsl(${color.h}, ${color.s}%, ${color.l}%)`);
  
  swatch.addEventListener('click', () => {
    hueSlider.value = color.h;
    saturationSlider.value = color.s;
    lightnessSlider.value = color.l;
    updateColor();
  });
  
  quickPalette.appendChild(swatch);
});

updateColor();