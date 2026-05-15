// ── DOM elements ──────────────────────────────────
const redSlider   = document.getElementById('red');
const greenSlider = document.getElementById('green');
const blueSlider  = document.getElementById('blue');

const colorDisplay = document.getElementById('customColorDisplay');

const redValue   = document.getElementById('redValue');
const greenValue = document.getElementById('greenValue');
const blueValue  = document.getElementById('blueValue');

const rgbText = document.getElementById('rgbText');
const hexText = document.getElementById('hexText');
const copyBtn = document.getElementById('copyBtn');

// Grab the orb elements so we can change their color
const orb1 = document.querySelector('.orb1');
const orb2 = document.querySelector('.orb2');
const orb3 = document.querySelector('.orb3');

// ── Main update function ───────────────────────────
function updateColor() {
  const red   = redSlider.value;
  const green = greenSlider.value;
  const blue  = blueSlider.value;

  // Update the number next to each slider
  redValue.textContent   = red;
  greenValue.textContent = green;
  blueValue.textContent  = blue;


  const rgb = `rgb(${red}, ${green}, ${blue})`;
  const hex = '#'
    + (+red).toString(16).padStart(2, '0')
    + (+green).toString(16).padStart(2, '0')
    + (+blue).toString(16).padStart(2, '0');

  colorDisplay.style.backgroundColor = rgb;
  colorDisplay.style.boxShadow = `0 8px 40px ${hex}88`;
  rgbText.textContent = rgb;
  hexText.textContent = hex.toUpperCase();
  orb1.style.background = rgb;
  orb2.style.background = rgb;
  orb3.style.background = rgb;
}

redSlider.addEventListener('input', updateColor);
greenSlider.addEventListener('input', updateColor);
blueSlider.addEventListener('input', updateColor);

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(hexText.textContent);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => copyBtn.textContent = 'Copy HEX', 1500);
});

updateColor();