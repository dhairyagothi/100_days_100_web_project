/**
 * CSS Glassmorphism & Shadow Generator
 * Dynamic generator built with vanilla JS.
 */

// ===== State =====
const state = {
  opacity: 25, // Percent
  blur: 16, // px
  borderOpacity: 10, // Percent
  borderRadius: 24, // px
  shadowY: 16, // px
  shadowBlur: 32, // px
  shadowOpacity: 20, // Percent
};

const backdropThemes = {
  'cyan-purple': { primary: '#22d3ee', secondary: '#a855f7' },
  'emerald-lime': { primary: '#10b981', secondary: '#84cc16' },
  'crimson-ruby': { primary: '#ef4444', secondary: '#be123c' },
  'sunset-gold': { primary: '#f59e0b', secondary: '#14b8a6' },
};

const backdropPatterns = {
  blueprint: `
    radial-gradient(circle at center, rgba(255,255,255,0.04) 1px, transparent 1px),
    #0f172a
  `,
  dotgrid: `
    radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px),
    #ffffff
  `,
  canvas: '#e5e7eb',
};

// ===== DOM References =====
const dom = {
  card: document.getElementById('glass-card-preview'),
  cssOutput: document.getElementById('css-output'),
  btnCopy: document.getElementById('btn-copy-css'),
  toast: document.getElementById('toast'),
  toastText: document.getElementById('toast-text'),
  studioCanvas: document.getElementById('studio-canvas'),
  primaryBlob: document.getElementById('blob-primary'),
  secondaryBlob: document.getElementById('blob-secondary'),
  themeButtons: document.querySelectorAll('.backdrop-theme'),
  patternButtons: document.querySelectorAll('.backdrop-pattern'),
  // Sliders & value displays
  opacitySlider: document.getElementById('opacity-slider'),
  opacityValue: document.getElementById('opacity-value'),
  blurSlider: document.getElementById('blur-slider'),
  blurValue: document.getElementById('blur-value'),
  borderSlider: document.getElementById('border-slider'),
  borderValue: document.getElementById('border-value'),
  radiusSlider: document.getElementById('radius-slider'),
  radiusValue: document.getElementById('radius-value'),
  shadowYSlider: document.getElementById('shadow-y-slider'),
  shadowYValue: document.getElementById('shadow-y-value'),
  shadowBlurSlider: document.getElementById('shadow-blur-slider'),
  shadowBlurValue: document.getElementById('shadow-blur-value'),
  shadowOpacitySlider: document.getElementById('shadow-opacity-slider'),
  shadowOpacityValue: document.getElementById('shadow-opacity-value'),
};

const applyBackdropTheme = (theme) => {
  const selected = backdropThemes[theme];
  if (!selected || !dom.primaryBlob || !dom.secondaryBlob) return;

  dom.primaryBlob.style.background = selected.primary;
  dom.secondaryBlob.style.background = selected.secondary;
};

const applyBackdropPattern = (pattern) => {
  const selected = backdropPatterns[pattern];
  if (!selected || !dom.studioCanvas) return;

  dom.studioCanvas.style.background = selected;

  if (pattern === 'dotgrid') {
    dom.studioCanvas.style.backgroundSize = '24px 24px';
  } else if (pattern === 'blueprint') {
    dom.studioCanvas.style.backgroundSize = '32px 32px';
  } else {
    dom.studioCanvas.style.backgroundSize = 'auto';
  }
};

// ===== Toast Alert Helper =====
const showToast = (message) => {
  dom.toastText.textContent = message;
  dom.toast.classList.add('toast--visible');
  setTimeout(() => {
    dom.toast.classList.remove('toast--visible');
  }, 2200);
};

// ===== CSS Code Formatter =====

const updateStyles = () => {
  // Convert state values
  const bgOpacity = state.opacity / 100;
  const borderOpacityVal = state.borderOpacity / 100;
  const shadowOpacityVal = state.shadowOpacity / 100;

  // Generate CSS properties
  const backgroundValue = `rgba(255, 255, 255, ${bgOpacity})`;
  const backdropFilterValue = `blur(${state.blur}px)`;
  const borderValue = `1px solid rgba(255, 255, 255, ${borderOpacityVal})`;
  const borderRadiusValue = `${state.borderRadius}px`;
  const boxShadowValue = `0 ${state.shadowY}px ${state.shadowBlur}px 0 rgba(0, 0, 0, ${shadowOpacityVal})`;

  // Apply to visual preview card element
  dom.card.style.background = backgroundValue;
  dom.card.style.backdropFilter = backdropFilterValue;
  dom.card.style.webkitBackdropFilter = backdropFilterValue;
  dom.card.style.border = borderValue;
  dom.card.style.borderRadius = borderRadiusValue;
  dom.card.style.boxShadow = boxShadowValue;

  // Format CSS output display code
  const cssCode = `background: ${backgroundValue};
backdrop-filter: ${backdropFilterValue};
-webkit-backdrop-filter: ${backdropFilterValue};
border: ${borderValue};
border-radius: ${borderRadiusValue};
box-shadow: ${boxShadowValue};`;

  dom.cssOutput.textContent = cssCode;
};

// ===== Clipboard Copy action =====

const copyCSS = async () => {
  const cssText = dom.cssOutput.textContent;

  try {
    await navigator.clipboard.writeText(cssText);
    showToast('CSS Styles copied to clipboard! 💎');
  } catch (err) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = cssText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('CSS Styles copied to clipboard! 💎');
    } catch (fallbackErr) {
      showToast('Copy failed. Please copy manually.');
      console.error('Copy fallback failed:', fallbackErr);
    }
  }
};

// ===== Slider Action Listeners =====

const initListeners = () => {
  // Opacity Slider
  dom.opacitySlider.addEventListener('input', (e) => {
    state.opacity = parseInt(e.target.value, 10);
    dom.opacityValue.textContent = `${state.opacity}%`;
    updateStyles();
  });

  dom.themeButtons.forEach((button) => {
    button.addEventListener('click', () => {

      dom.themeButtons.forEach((btn) => {
        btn.classList.remove('active');
      });

      button.classList.add('active');

      applyBackdropTheme(button.dataset.theme);
    });
  });

  dom.patternButtons.forEach((button) => {
    button.addEventListener('click', () => {

      dom.patternButtons.forEach((btn) => {
        btn.classList.remove('active');
      });

      button.classList.add('active');

      applyBackdropPattern(button.dataset.pattern);
    });
  });

  // Blur Slider
  dom.blurSlider.addEventListener('input', (e) => {
    state.blur = parseInt(e.target.value, 10);
    dom.blurValue.textContent = `${state.blur}px`;
    updateStyles();
  });

  // Border Opacity Slider
  dom.borderSlider.addEventListener('input', (e) => {
    state.borderOpacity = parseInt(e.target.value, 10);
    dom.borderValue.textContent = `${state.borderOpacity}%`;
    updateStyles();
  });

  // Border Radius Slider
  dom.radiusSlider.addEventListener('input', (e) => {
    state.borderRadius = parseInt(e.target.value, 10);
    dom.radiusValue.textContent = `${state.borderRadius}px`;
    updateStyles();
  });

  // Shadow Y Slider
  dom.shadowYSlider.addEventListener('input', (e) => {
    state.shadowY = parseInt(e.target.value, 10);
    dom.shadowYValue.textContent = `${state.shadowY}px`;
    updateStyles();
  });

  // Shadow Blur Slider
  dom.shadowBlurSlider.addEventListener('input', (e) => {
    state.shadowBlur = parseInt(e.target.value, 10);
    dom.shadowBlurValue.textContent = `${state.shadowBlur}px`;
    updateStyles();
  });

  // Shadow Opacity Slider
  dom.shadowOpacitySlider.addEventListener('input', (e) => {
    state.shadowOpacity = parseInt(e.target.value, 10);
    dom.shadowOpacityValue.textContent = `${state.shadowOpacity}%`;
    updateStyles();
  });

  // Copy CSS Action Click
  dom.btnCopy.addEventListener('click', copyCSS);
};

// ===== Initialize App =====
const init = () => {
  updateStyles();

  applyBackdropTheme('cyan-purple');
  applyBackdropPattern('blueprint');

  document
    .querySelector('[data-theme="cyan-purple"]')
    ?.classList.add('active');

  document
    .querySelector('[data-pattern="blueprint"]')
    ?.classList.add('active');

  initListeners();
};

document.addEventListener('DOMContentLoaded', init);
