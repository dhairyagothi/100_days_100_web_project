/**
 * Secure Password Generator
 * Pure vanilla JS — no dependencies, no frameworks.
 */

// ---------------------------------------------------------------------------
// Character sets
// ---------------------------------------------------------------------------
const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers:   '0123456789',
  symbols:   '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

// ---------------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------------
const passwordOutput  = document.getElementById('password-output');
const generateBtn     = document.getElementById('generate-btn');
const regenerateBtn   = document.getElementById('regenerate-btn');
const copyBtn         = document.getElementById('copy-btn');
const lengthSlider    = document.getElementById('length-slider');
const lengthDisplay   = document.getElementById('length-display');
const sliderFill      = document.getElementById('slider-fill');
const validationMsg   = document.getElementById('validation-msg');
const strengthLabel   = document.getElementById('strength-label');
const bars            = [
  document.getElementById('bar-1'),
  document.getElementById('bar-2'),
  document.getElementById('bar-3'),
  document.getElementById('bar-4'),
];
const toast           = document.getElementById('toast');

// Checkbox inputs keyed by type name
const checkboxes = {
  uppercase: document.getElementById('uppercase'),
  lowercase: document.getElementById('lowercase'),
  numbers:   document.getElementById('numbers'),
  symbols:   document.getElementById('symbols'),
};

// ---------------------------------------------------------------------------
// Cryptographically random integer in [0, max)
// Uses crypto.getRandomValues when available, falls back to Math.random.
// ---------------------------------------------------------------------------
function secureRandom(max) {
  if (window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

// ---------------------------------------------------------------------------
// Fisher-Yates shuffle (in-place, returns same array)
// ---------------------------------------------------------------------------
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------------------
// Get the list of active character types selected by the user
// ---------------------------------------------------------------------------
function getSelectedTypes() {
  return Object.keys(checkboxes).filter(key => checkboxes[key].checked);
}

// ---------------------------------------------------------------------------
// Determine password strength
// Returns: 'weak' | 'medium' | 'strong'
// Rules:
//   Weak   — length < 8  OR  only 1 type selected
//   Strong — length >= 16 AND all 4 types selected
//   Medium — everything else
// ---------------------------------------------------------------------------
function getStrength(length, selectedTypes) {
  const count = selectedTypes.length;
  if (length < 8 || count === 1) return 'weak';
  if (length >= 16 && count === 4) return 'strong';
  return 'medium';
}

// ---------------------------------------------------------------------------
// Update the strength meter UI
// ---------------------------------------------------------------------------
function updateStrengthUI(strength) {
  // Reset all bars
  bars.forEach(bar => {
    bar.className = 'bar';
  });
  strengthLabel.className = 'strength-label';

  const config = {
    weak:   { fill: 1, label: 'Weak',   cls: 'weak' },
    medium: { fill: 2, label: 'Medium', cls: 'medium' },
    strong: { fill: 4, label: 'Strong', cls: 'strong' },
  };

  if (!strength) {
    strengthLabel.textContent = '—';
    return;
  }

  const { fill, label, cls } = config[strength];
  for (let i = 0; i < fill; i++) {
    bars[i].classList.add(cls, 'active');
  }
  strengthLabel.classList.add(cls);
  strengthLabel.textContent = label;
}

// ---------------------------------------------------------------------------
// Core password generation
// ---------------------------------------------------------------------------
function generatePassword() {
  const selectedTypes = getSelectedTypes();

  // Validate at least one type is selected
  if (selectedTypes.length === 0) {
    validationMsg.classList.add('visible');
    passwordOutput.value = '';
    updateStrengthUI(null);
    return;
  }

  validationMsg.classList.remove('visible');

  const length = parseInt(lengthSlider.value, 10);

  // Build the combined pool from selected types
  const pool = selectedTypes.map(type => CHAR_SETS[type]).join('');

  // Guarantee at least one character from each selected type
  const guaranteed = selectedTypes.map(type => {
    const set = CHAR_SETS[type];
    return set[secureRandom(set.length)];
  });

  // Fill the remaining positions from the full pool
  const remaining = [];
  for (let i = guaranteed.length; i < length; i++) {
    remaining.push(pool[secureRandom(pool.length)]);
  }

  // Merge and shuffle so the guaranteed chars aren't always at the front
  const passwordChars = shuffleArray([...guaranteed, ...remaining]);
  const password = passwordChars.join('');

  passwordOutput.value = password;

  // Update strength indicator
  const strength = getStrength(length, selectedTypes);
  updateStrengthUI(strength);
}

// ---------------------------------------------------------------------------
// Slider fill track update
// ---------------------------------------------------------------------------
function updateSliderFill() {
  const min   = parseInt(lengthSlider.min, 10);
  const max   = parseInt(lengthSlider.max, 10);
  const value = parseInt(lengthSlider.value, 10);
  const pct   = ((value - min) / (max - min)) * 100;
  sliderFill.style.width = `${pct}%`;
}

// ---------------------------------------------------------------------------
// Slider input handler — live display + re-generate if a password exists
// ---------------------------------------------------------------------------
function onSliderInput() {
  const val = lengthSlider.value;

  // Animate the length display number
  lengthDisplay.classList.remove('pop');
  void lengthDisplay.offsetWidth; // reflow to restart animation
  lengthDisplay.classList.add('pop');

  lengthDisplay.textContent = val;
  lengthSlider.setAttribute('aria-valuenow', val);
  updateSliderFill();

  // Regenerate if there's already a password on screen
  if (passwordOutput.value) {
    generatePassword();
  }
}

// ---------------------------------------------------------------------------
// Copy to clipboard
// ---------------------------------------------------------------------------
async function copyToClipboard() {
  const password = passwordOutput.value;
  if (!password) return;

  try {
    await navigator.clipboard.writeText(password);
  } catch {
    // Fallback for older browsers
    passwordOutput.select();
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
  }

  showToast();
}

// ---------------------------------------------------------------------------
// Toast notification
// ---------------------------------------------------------------------------
let toastTimer = null;

function showToast() {
  if (toastTimer) clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toastTimer = null;
  }, 2200);
}

// ---------------------------------------------------------------------------
// Regenerate button — spin animation + new password
// ---------------------------------------------------------------------------
function onRegenerate() {
  regenerateBtn.classList.remove('spinning');
  void regenerateBtn.offsetWidth;
  regenerateBtn.classList.add('spinning');
  generatePassword();
  regenerateBtn.addEventListener('animationend', () => {
    regenerateBtn.classList.remove('spinning');
  }, { once: true });
}

// ---------------------------------------------------------------------------
// Checkbox change — re-validate and regenerate if a password exists
// ---------------------------------------------------------------------------
function onCheckboxChange() {
  if (passwordOutput.value) {
    generatePassword();
  } else if (getSelectedTypes().length > 0) {
    // Clear stale validation message when user re-selects a type
    validationMsg.classList.remove('visible');
  }
}

// ---------------------------------------------------------------------------
// Keyboard accessibility — generate/copy with Enter/Space on buttons
// (buttons already handle this natively, but we keep it explicit)
// ---------------------------------------------------------------------------
function onKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    const target = e.target;
    if (target === generateBtn)  { e.preventDefault(); generatePassword(); }
    if (target === copyBtn)      { e.preventDefault(); copyToClipboard(); }
    if (target === regenerateBtn){ e.preventDefault(); onRegenerate(); }
  }
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------
generateBtn.addEventListener('click', generatePassword);
regenerateBtn.addEventListener('click', onRegenerate);
copyBtn.addEventListener('click', copyToClipboard);
lengthSlider.addEventListener('input', onSliderInput);
document.addEventListener('keydown', onKeydown);

Object.values(checkboxes).forEach(cb => {
  cb.addEventListener('change', onCheckboxChange);
});

// ---------------------------------------------------------------------------
// Initialise on page load
// ---------------------------------------------------------------------------
function init() {
  updateSliderFill();
  lengthDisplay.textContent = lengthSlider.value;
  generatePassword();
}

init();
