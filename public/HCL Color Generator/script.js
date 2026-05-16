
const hueSlider        = document.getElementById('hue');
const saturationSlider = document.getElementById('saturation');
const lightnessSlider  = document.getElementById('lightness');

const colorDisplay = document.getElementById('customColorDisplay');

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


updateColor();