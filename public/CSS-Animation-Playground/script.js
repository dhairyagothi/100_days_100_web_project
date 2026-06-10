/* ============================================
   CSS Animation Playground — Main Script
   ============================================ */

(function () {
  'use strict';

  // ==========================================
  // STATE
  // ==========================================
  const state = {
    name: 'myAnimation',
    duration: 1,
    delay: 0,
    timingFunction: 'ease',
    iterationCount: 'infinite',
    direction: 'alternate',
    fillMode: 'forwards',
    previewShape: 'box',
    previewColor: '#00f5d4',
    speed: 1,
    isPlaying: true,
    activeKeyframeIndex: 0,
    keyframes: [
      createKeyframe(0, { backgroundColor: '#00f5d4' }),
      createKeyframe(100, { backgroundColor: '#f72585', translateX: 0, translateY: 0, rotate: 360, scale: 1.2, opacity: 1, borderRadius: 50, shadowBlur: 40 })
    ]
  };

  function createKeyframe(percent, overrides = {}) {
    return {
      percent,
      translateX: 0,
      translateY: 0,
      rotate: 0,
      scale: 1,
      skewX: 0,
      opacity: 1,
      backgroundColor: '#00f5d4',
      borderRadius: 8,
      shadowBlur: 20,
      ...overrides
    };
  }

  // ==========================================
  // DOM REFERENCES
  // ==========================================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const els = {
    animName: $('#anim-name'),
    duration: $('#ctrl-duration'),
    valDuration: $('#val-duration'),
    delay: $('#ctrl-delay'),
    valDelay: $('#val-delay'),
    easing: $('#ctrl-easing'),
    iterations: $('#ctrl-iterations'),
    valIterations: $('#val-iterations'),
    infinite: $('#ctrl-infinite'),
    direction: $('#ctrl-direction'),
    fillMode: $('#ctrl-fill'),
    previewColor: $('#ctrl-preview-color'),
    previewColorHex: $('#preview-color-hex'),
    previewElement: $('#preview-element'),
    previewStage: $('#preview-stage'),
    timelineTrack: $('#timeline-track'),
    keyframeProps: $('#keyframe-props'),
    kfTitle: $('#kf-title'),
    kfPercent: $('#kf-percent'),
    kfTranslateX: $('#kf-translateX'),
    kfTranslateY: $('#kf-translateY'),
    kfRotate: $('#kf-rotate'),
    kfScale: $('#kf-scale'),
    kfSkewX: $('#kf-skewX'),
    kfOpacity: $('#kf-opacity'),
    kfBorderRadius: $('#kf-borderRadius'),
    kfBgColor: $('#kf-bgColor'),
    kfBgHex: $('#kf-bg-hex'),
    kfShadow: $('#kf-shadow'),
    codeContent: $('#code-content'),
    btnPlay: $('#btn-play'),
    btnStop: $('#btn-stop'),
    btnCopy: $('#btn-copy'),
    btnAddKf: $('#btn-add-keyframe'),
    btnDeleteKf: $('#btn-delete-kf'),
    btnReset: $('#btn-reset'),
    iconPlay: $('#icon-play'),
    iconPause: $('#icon-pause'),
    speedCtrl: $('#ctrl-speed'),
    copyToast: $('#copy-toast'),
    presetsGrid: $('#presets-grid'),
    shapeSelector: $('#shape-selector'),
    // Value displays
    valTx: $('#kf-val-tx'),
    valTy: $('#kf-val-ty'),
    valRot: $('#kf-val-rot'),
    valScale: $('#kf-val-scale'),
    valSkx: $('#kf-val-skx'),
    valOpacity: $('#kf-val-opacity'),
    valRadius: $('#kf-val-radius'),
    valShadow: $('#kf-val-shadow')
  };

  // Dynamic style element for the animation
  let styleEl = document.createElement('style');
  styleEl.id = 'dynamic-animation-style';
  document.head.appendChild(styleEl);

  // ==========================================
  // PRESETS
  // ==========================================
  const presets = {
    bounce: {
      duration: 1, timingFunction: 'cubic-bezier(0.68,-0.55,0.27,1.55)', direction: 'alternate', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { translateY: 0, scale: 1, shadowBlur: 20 }),
        createKeyframe(50, { translateY: -80, scale: 1.05, shadowBlur: 40 }),
        createKeyframe(100, { translateY: 0, scale: 0.95, shadowBlur: 10 })
      ]
    },
    fadeIn: {
      duration: 1.5, timingFunction: 'ease', direction: 'alternate', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { opacity: 0, scale: 0.8, shadowBlur: 0 }),
        createKeyframe(100, { opacity: 1, scale: 1, shadowBlur: 30 })
      ]
    },
    slideIn: {
      duration: 1, timingFunction: 'ease-out', direction: 'alternate', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { translateX: -150, opacity: 0, shadowBlur: 0 }),
        createKeyframe(100, { translateX: 0, opacity: 1, shadowBlur: 20 })
      ]
    },
    spin: {
      duration: 1.5, timingFunction: 'linear', direction: 'normal', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { rotate: 0 }),
        createKeyframe(100, { rotate: 360 })
      ]
    },
    pulse: {
      duration: 0.8, timingFunction: 'ease-in-out', direction: 'alternate', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { scale: 1, shadowBlur: 15 }),
        createKeyframe(50, { scale: 1.15, shadowBlur: 40 }),
        createKeyframe(100, { scale: 1, shadowBlur: 15 })
      ]
    },
    shake: {
      duration: 0.6, timingFunction: 'ease-in-out', direction: 'normal', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { translateX: 0, rotate: 0 }),
        createKeyframe(20, { translateX: -15, rotate: -5 }),
        createKeyframe(40, { translateX: 15, rotate: 5 }),
        createKeyframe(60, { translateX: -10, rotate: -3 }),
        createKeyframe(80, { translateX: 10, rotate: 3 }),
        createKeyframe(100, { translateX: 0, rotate: 0 })
      ]
    },
    flip: {
      duration: 1.2, timingFunction: 'ease-in-out', direction: 'alternate', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { rotate: 0, scale: 1 }),
        createKeyframe(50, { rotate: 180, scale: 0.8 }),
        createKeyframe(100, { rotate: 360, scale: 1 })
      ]
    },
    zoomIn: {
      duration: 1, timingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)', direction: 'alternate', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { scale: 0, opacity: 0, borderRadius: 50, shadowBlur: 0 }),
        createKeyframe(100, { scale: 1, opacity: 1, borderRadius: 8, shadowBlur: 30 })
      ]
    },
    swing: {
      duration: 1, timingFunction: 'ease-in-out', direction: 'alternate', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { rotate: 0 }),
        createKeyframe(20, { rotate: 15 }),
        createKeyframe(40, { rotate: -10 }),
        createKeyframe(60, { rotate: 5 }),
        createKeyframe(80, { rotate: -5 }),
        createKeyframe(100, { rotate: 0 })
      ]
    },
    rubberBand: {
      duration: 1, timingFunction: 'ease-in-out', direction: 'normal', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { scale: 1, skewX: 0 }),
        createKeyframe(30, { scale: 1.25, skewX: -5 }),
        createKeyframe(40, { scale: 0.75, skewX: 5 }),
        createKeyframe(50, { scale: 1.15, skewX: -3 }),
        createKeyframe(65, { scale: 0.95, skewX: 2 }),
        createKeyframe(75, { scale: 1.05, skewX: -1 }),
        createKeyframe(100, { scale: 1, skewX: 0 })
      ]
    },
    jello: {
      duration: 1, timingFunction: 'ease-in-out', direction: 'normal', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { skewX: 0 }),
        createKeyframe(22, { skewX: -12 }),
        createKeyframe(33, { skewX: 10 }),
        createKeyframe(44, { skewX: -6 }),
        createKeyframe(55, { skewX: 4 }),
        createKeyframe(66, { skewX: -2 }),
        createKeyframe(100, { skewX: 0 })
      ]
    },
    heartbeat: {
      duration: 1.2, timingFunction: 'ease-in-out', direction: 'normal', iterationCount: 'infinite',
      keyframes: [
        createKeyframe(0, { scale: 1 }),
        createKeyframe(14, { scale: 1.3 }),
        createKeyframe(28, { scale: 1 }),
        createKeyframe(42, { scale: 1.3 }),
        createKeyframe(70, { scale: 1 }),
        createKeyframe(100, { scale: 1 })
      ]
    }
  };

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    bindEvents();
    updateShape();
    renderTimeline();
    selectKeyframe(0);
    generateAnimation();
    updateCodeOutput();
  }

  // ==========================================
  // EVENT BINDING
  // ==========================================
  function bindEvents() {
    // Animation settings
    els.animName.addEventListener('input', (e) => {
      state.name = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '') || 'myAnimation';
      e.target.value = state.name;
      generateAnimation();
      updateCodeOutput();
    });

    els.duration.addEventListener('input', (e) => {
      state.duration = parseFloat(e.target.value);
      els.valDuration.textContent = state.duration + 's';
      generateAnimation();
      updateCodeOutput();
    });

    els.delay.addEventListener('input', (e) => {
      state.delay = parseFloat(e.target.value);
      els.valDelay.textContent = state.delay + 's';
      generateAnimation();
      updateCodeOutput();
    });

    els.easing.addEventListener('change', (e) => {
      state.timingFunction = e.target.value;
      generateAnimation();
      updateCodeOutput();
    });

    els.iterations.addEventListener('input', (e) => {
      if (!els.infinite.checked) {
        state.iterationCount = e.target.value;
        els.valIterations.textContent = e.target.value;
        generateAnimation();
        updateCodeOutput();
      }
    });

    els.infinite.addEventListener('change', (e) => {
      if (e.target.checked) {
        state.iterationCount = 'infinite';
        els.valIterations.textContent = 'infinite';
        els.iterations.disabled = true;
      } else {
        state.iterationCount = els.iterations.value;
        els.valIterations.textContent = els.iterations.value;
        els.iterations.disabled = false;
      }
      generateAnimation();
      updateCodeOutput();
    });

    els.direction.addEventListener('change', (e) => {
      state.direction = e.target.value;
      generateAnimation();
      updateCodeOutput();
    });

    els.fillMode.addEventListener('change', (e) => {
      state.fillMode = e.target.value;
      generateAnimation();
      updateCodeOutput();
    });

    // Preview color
    els.previewColor.addEventListener('input', (e) => {
      state.previewColor = e.target.value;
      els.previewColorHex.textContent = e.target.value;
      updatePreviewElementColor();
    });

    // Speed control
    els.speedCtrl.addEventListener('change', (e) => {
      state.speed = parseFloat(e.target.value);
      els.previewElement.style.animationPlayState = 'running';
      // Speed is implemented by modifying the actual duration applied
      generateAnimation();
    });

    // Play/Pause
    els.btnPlay.addEventListener('click', togglePlay);

    // Stop
    els.btnStop.addEventListener('click', () => {
      state.isPlaying = false;
      els.previewElement.style.animation = 'none';
      els.iconPlay.style.display = 'block';
      els.iconPause.style.display = 'none';
      // Force reflow to reset
      void els.previewElement.offsetWidth;
    });

    // Copy
    els.btnCopy.addEventListener('click', copyCode);

    // Add Keyframe
    els.btnAddKf.addEventListener('click', addKeyframe);

    // Delete Keyframe
    els.btnDeleteKf.addEventListener('click', deleteActiveKeyframe);

    // Reset
    els.btnReset.addEventListener('click', resetAll);

    // Keyframe percent
    els.kfPercent.addEventListener('change', (e) => {
      const kf = state.keyframes[state.activeKeyframeIndex];
      if (kf) {
        let val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
        kf.percent = val;
        e.target.value = val;
        els.kfTitle.textContent = `Keyframe: ${val}%`;
        state.keyframes.sort((a, b) => a.percent - b.percent);
        state.activeKeyframeIndex = state.keyframes.indexOf(kf);
        renderTimeline();
        generateAnimation();
        updateCodeOutput();
      }
    });

    // Keyframe property sliders
    bindKfSlider('kf-translateX', 'translateX', 'kf-val-tx', (v) => v + 'px');
    bindKfSlider('kf-translateY', 'translateY', 'kf-val-ty', (v) => v + 'px');
    bindKfSlider('kf-rotate', 'rotate', 'kf-val-rot', (v) => v + '°');
    bindKfSlider('kf-scale', 'scale', 'kf-val-scale', (v) => v);
    bindKfSlider('kf-skewX', 'skewX', 'kf-val-skx', (v) => v + '°');
    bindKfSlider('kf-opacity', 'opacity', 'kf-val-opacity', (v) => v);
    bindKfSlider('kf-borderRadius', 'borderRadius', 'kf-val-radius', (v) => v + 'px');
    bindKfSlider('kf-shadow', 'shadowBlur', 'kf-val-shadow', (v) => v + 'px');

    // Keyframe bg color
    els.kfBgColor.addEventListener('input', (e) => {
      const kf = state.keyframes[state.activeKeyframeIndex];
      if (kf) {
        kf.backgroundColor = e.target.value;
        els.kfBgHex.textContent = e.target.value;
        generateAnimation();
        updateCodeOutput();
      }
    });

    // Presets
    els.presetsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.preset-btn');
      if (!btn) return;
      const name = btn.dataset.preset;
      if (presets[name]) applyPreset(name);
    });

    // Shape selector
    els.shapeSelector.addEventListener('click', (e) => {
      const btn = e.target.closest('.shape-btn');
      if (!btn) return;
      $$('.shape-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.previewShape = btn.dataset.shape;
      updateShape();
      generateAnimation();
    });
  }

  function bindKfSlider(sliderId, prop, valId, formatter) {
    const slider = document.getElementById(sliderId);
    const valSpan = document.getElementById(valId);
    slider.addEventListener('input', (e) => {
      const kf = state.keyframes[state.activeKeyframeIndex];
      if (kf) {
        kf[prop] = parseFloat(e.target.value);
        valSpan.textContent = formatter(kf[prop]);
        generateAnimation();
        updateCodeOutput();
      }
    });
  }

  // ==========================================
  // PLAY / PAUSE
  // ==========================================
  function togglePlay() {
    if (state.isPlaying) {
      state.isPlaying = false;
      els.previewElement.style.animationPlayState = 'paused';
      els.iconPlay.style.display = 'block';
      els.iconPause.style.display = 'none';
    } else {
      state.isPlaying = true;
      // If animation was stopped (none), re-generate
      if (els.previewElement.style.animation === 'none') {
        generateAnimation();
      }
      els.previewElement.style.animationPlayState = 'running';
      els.iconPlay.style.display = 'none';
      els.iconPause.style.display = 'block';
    }
  }

  // ==========================================
  // SHAPE
  // ==========================================
  function updateShape() {
    const el = els.previewElement;
    el.className = 'preview-element';
    el.classList.add('shape-' + state.previewShape);

    // For star shape, create an inline SVG
    if (state.previewShape === 'star') {
      el.innerHTML = '<svg viewBox="0 0 100 100" width="80" height="80"><polygon points="50,5 63,35 95,38 70,60 78,92 50,75 22,92 30,60 5,38 37,35" /></svg>';
      const polygon = el.querySelector('polygon');
      if (polygon) polygon.setAttribute('fill', state.previewColor);
    } else if (state.previewShape === 'text') {
      el.innerHTML = '<span class="preview-text">Animate</span>';
    } else {
      el.innerHTML = '';
    }
  }

  function updatePreviewElementColor() {
    if (state.previewShape === 'star') {
      const polygon = els.previewElement.querySelector('polygon');
      if (polygon) polygon.setAttribute('fill', state.previewColor);
    }
  }

  // ==========================================
  // TIMELINE
  // ==========================================
  function renderTimeline() {
    // Remove old dots
    els.timelineTrack.querySelectorAll('.timeline-dot').forEach(d => d.remove());

    state.keyframes.forEach((kf, i) => {
      const dot = document.createElement('div');
      dot.className = 'timeline-dot' + (i === state.activeKeyframeIndex ? ' active' : '');
      dot.style.left = kf.percent + '%';
      dot.title = kf.percent + '%';

      const label = document.createElement('span');
      label.className = 'timeline-dot-label';
      label.textContent = kf.percent + '%';
      dot.appendChild(label);

      dot.addEventListener('click', () => selectKeyframe(i));
      els.timelineTrack.appendChild(dot);
    });
  }

  function selectKeyframe(index) {
    if (index < 0 || index >= state.keyframes.length) return;
    state.activeKeyframeIndex = index;
    const kf = state.keyframes[index];

    // Update UI
    els.kfTitle.textContent = `Keyframe: ${kf.percent}%`;
    els.kfPercent.value = kf.percent;
    els.kfTranslateX.value = kf.translateX;
    els.kfTranslateY.value = kf.translateY;
    els.kfRotate.value = kf.rotate;
    els.kfScale.value = kf.scale;
    els.kfSkewX.value = kf.skewX;
    els.kfOpacity.value = kf.opacity;
    els.kfBorderRadius.value = kf.borderRadius;
    els.kfBgColor.value = kf.backgroundColor;
    els.kfBgHex.textContent = kf.backgroundColor;
    els.kfShadow.value = kf.shadowBlur;

    // Update value displays
    els.valTx.textContent = kf.translateX + 'px';
    els.valTy.textContent = kf.translateY + 'px';
    els.valRot.textContent = kf.rotate + '°';
    els.valScale.textContent = kf.scale;
    els.valSkx.textContent = kf.skewX + '°';
    els.valOpacity.textContent = kf.opacity;
    els.valRadius.textContent = kf.borderRadius + 'px';
    els.valShadow.textContent = kf.shadowBlur + 'px';

    // Update timeline dots
    renderTimeline();
  }

  function addKeyframe() {
    // Find a gap to add a new keyframe
    const existingPercents = state.keyframes.map(k => k.percent);
    let newPercent = 50;
    if (existingPercents.includes(50)) {
      // Try to find a gap
      for (let p = 10; p <= 90; p += 10) {
        if (!existingPercents.includes(p)) {
          newPercent = p;
          break;
        }
      }
    }

    // Clone from closest existing keyframe
    const closest = state.keyframes.reduce((prev, curr) =>
      Math.abs(curr.percent - newPercent) < Math.abs(prev.percent - newPercent) ? curr : prev
    );

    const newKf = { ...closest, percent: newPercent };
    state.keyframes.push(newKf);
    state.keyframes.sort((a, b) => a.percent - b.percent);

    const newIndex = state.keyframes.indexOf(newKf);
    selectKeyframe(newIndex);
    generateAnimation();
    updateCodeOutput();
  }

  function deleteActiveKeyframe() {
    if (state.keyframes.length <= 2) {
      // Need at least 2 keyframes
      showToast('Need at least 2 keyframes!');
      return;
    }
    state.keyframes.splice(state.activeKeyframeIndex, 1);
    state.activeKeyframeIndex = Math.min(state.activeKeyframeIndex, state.keyframes.length - 1);
    selectKeyframe(state.activeKeyframeIndex);
    generateAnimation();
    updateCodeOutput();
  }

  // ==========================================
  // GENERATE CSS ANIMATION
  // ==========================================
  function generateAnimation() {
    const sortedKfs = [...state.keyframes].sort((a, b) => a.percent - b.percent);
    const effectiveDuration = state.duration / state.speed;

    // Build @keyframes rule
    let kfCSS = `@keyframes ${state.name} {\n`;
    sortedKfs.forEach(kf => {
      const transform = buildTransform(kf);
      kfCSS += `  ${kf.percent}% {\n`;
      kfCSS += `    transform: ${transform};\n`;
      kfCSS += `    opacity: ${kf.opacity};\n`;
      kfCSS += `    background-color: ${kf.backgroundColor};\n`;
      kfCSS += `    border-radius: ${kf.borderRadius}px;\n`;
      kfCSS += `    box-shadow: 0 0 ${kf.shadowBlur}px ${hexToRgba(kf.backgroundColor, 0.5)};\n`;
      kfCSS += `  }\n`;
    });
    kfCSS += `}\n`;

    // Build animation shorthand
    const animShorthand = `${state.name} ${effectiveDuration}s ${state.timingFunction} ${state.delay}s ${state.iterationCount} ${state.direction} ${state.fillMode}`;

    // Inject into style element
    styleEl.textContent = kfCSS;

    // Apply to preview element
    const el = els.previewElement;
    el.style.animation = 'none';
    // Force reflow
    void el.offsetWidth;
    el.style.animation = animShorthand;
    el.style.animationPlayState = state.isPlaying ? 'running' : 'paused';

    // Update play icon
    if (state.isPlaying) {
      els.iconPlay.style.display = 'none';
      els.iconPause.style.display = 'block';
    }
  }

  function buildTransform(kf) {
    const parts = [];
    if (kf.translateX !== 0) parts.push(`translateX(${kf.translateX}px)`);
    if (kf.translateY !== 0) parts.push(`translateY(${kf.translateY}px)`);
    if (kf.rotate !== 0) parts.push(`rotate(${kf.rotate}deg)`);
    if (kf.scale !== 1) parts.push(`scale(${kf.scale})`);
    if (kf.skewX !== 0) parts.push(`skewX(${kf.skewX}deg)`);
    return parts.length ? parts.join(' ') : 'none';
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // ==========================================
  // CODE OUTPUT (with syntax highlighting)
  // ==========================================
  function updateCodeOutput() {
    const sortedKfs = [...state.keyframes].sort((a, b) => a.percent - b.percent);

    let rawCode = '';
    rawCode += `/* Animation: ${state.name} */\n\n`;

    // Element rule
    rawCode += `.animated-element {\n`;
    rawCode += `  animation: ${state.name} ${state.duration}s ${state.timingFunction} ${state.delay}s ${state.iterationCount} ${state.direction} ${state.fillMode};\n`;
    rawCode += `}\n\n`;

    // @keyframes
    rawCode += `@keyframes ${state.name} {\n`;
    sortedKfs.forEach(kf => {
      const transform = buildTransform(kf);
      rawCode += `  ${kf.percent}% {\n`;
      if (transform !== 'none') rawCode += `    transform: ${transform};\n`;
      if (kf.opacity !== 1) rawCode += `    opacity: ${kf.opacity};\n`;
      rawCode += `    background-color: ${kf.backgroundColor};\n`;
      rawCode += `    border-radius: ${kf.borderRadius}px;\n`;
      rawCode += `    box-shadow: 0 0 ${kf.shadowBlur}px ${hexToRgba(kf.backgroundColor, 0.5)};\n`;
      rawCode += `  }\n`;
    });
    rawCode += `}\n`;

    // Syntax highlight it
    const highlighted = highlightCSS(rawCode);
    els.codeContent.innerHTML = highlighted;
  }

  function highlightCSS(code) {
    // Escape HTML first
    let html = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Comments
    html = html.replace(/(\/\*.*?\*\/)/gs, '<span class="css-comment">$1</span>');

    // @keyframes keyword
    html = html.replace(/(@keyframes)/g, '<span class="css-keyword">$1</span>');

    // Percentages in keyframes (like "0% {")
    html = html.replace(/^(\s*)(\d+%)/gm, '$1<span class="css-percent">$2</span>');

    // Selectors (lines ending with {)
    html = html.replace(/^(\.[a-zA-Z0-9_-]+)/gm, '<span class="css-selector">$1</span>');

    // Property names
    html = html.replace(/(\s+)([\w-]+)(\s*:)/gm, '$1<span class="css-prop">$2</span>$3');

    // Braces
    html = html.replace(/([{}])/g, '<span class="css-brace">$1</span>');

    return html;
  }

  // ==========================================
  // COPY TO CLIPBOARD
  // ==========================================
  function copyCode() {
    const sortedKfs = [...state.keyframes].sort((a, b) => a.percent - b.percent);

    let rawCode = `/* Animation: ${state.name} */\n\n`;
    rawCode += `.animated-element {\n`;
    rawCode += `  animation: ${state.name} ${state.duration}s ${state.timingFunction} ${state.delay}s ${state.iterationCount} ${state.direction} ${state.fillMode};\n`;
    rawCode += `}\n\n`;
    rawCode += `@keyframes ${state.name} {\n`;
    sortedKfs.forEach(kf => {
      const transform = buildTransform(kf);
      rawCode += `  ${kf.percent}% {\n`;
      if (transform !== 'none') rawCode += `    transform: ${transform};\n`;
      if (kf.opacity !== 1) rawCode += `    opacity: ${kf.opacity};\n`;
      rawCode += `    background-color: ${kf.backgroundColor};\n`;
      rawCode += `    border-radius: ${kf.borderRadius}px;\n`;
      rawCode += `    box-shadow: 0 0 ${kf.shadowBlur}px ${hexToRgba(kf.backgroundColor, 0.5)};\n`;
      rawCode += `  }\n`;
    });
    rawCode += `}\n`;

    navigator.clipboard.writeText(rawCode).then(() => {
      showToast('✅ Copied to clipboard!');
    }).catch(() => {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = rawCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('✅ Copied to clipboard!');
    });
  }

  function showToast(msg) {
    els.copyToast.textContent = msg;
    els.copyToast.classList.add('show');
    setTimeout(() => els.copyToast.classList.remove('show'), 2000);
  }

  // ==========================================
  // PRESETS
  // ==========================================
  function applyPreset(name) {
    const preset = presets[name];
    if (!preset) return;

    // Update active button
    $$('.preset-btn').forEach(b => b.classList.remove('active'));
    const btn = $(`.preset-btn[data-preset="${name}"]`);
    if (btn) btn.classList.add('active');

    // Apply preset values
    state.name = name;
    els.animName.value = name;

    state.duration = preset.duration;
    els.duration.value = preset.duration;
    els.valDuration.textContent = preset.duration + 's';

    state.timingFunction = preset.timingFunction;
    // Try to match the select option, fallback to setting value directly
    const easingOptions = Array.from(els.easing.options);
    const matchOption = easingOptions.find(o => o.value === preset.timingFunction);
    if (matchOption) {
      els.easing.value = preset.timingFunction;
    } else {
      // Add temporary option
      const opt = document.createElement('option');
      opt.value = preset.timingFunction;
      opt.textContent = preset.timingFunction;
      els.easing.appendChild(opt);
      els.easing.value = preset.timingFunction;
    }

    state.direction = preset.direction;
    els.direction.value = preset.direction;

    if (preset.iterationCount === 'infinite') {
      state.iterationCount = 'infinite';
      els.infinite.checked = true;
      els.iterations.disabled = true;
      els.valIterations.textContent = 'infinite';
    } else {
      state.iterationCount = preset.iterationCount;
      els.infinite.checked = false;
      els.iterations.disabled = false;
      els.iterations.value = preset.iterationCount;
      els.valIterations.textContent = preset.iterationCount;
    }

    // Deep clone keyframes
    state.keyframes = preset.keyframes.map(kf => ({ ...kf }));

    // Update everything
    state.activeKeyframeIndex = 0;
    renderTimeline();
    selectKeyframe(0);
    generateAnimation();
    updateCodeOutput();
  }

  // ==========================================
  // RESET
  // ==========================================
  function resetAll() {
    state.name = 'myAnimation';
    state.duration = 1;
    state.delay = 0;
    state.timingFunction = 'ease';
    state.iterationCount = 'infinite';
    state.direction = 'alternate';
    state.fillMode = 'forwards';
    state.speed = 1;
    state.isPlaying = true;
    state.activeKeyframeIndex = 0;
    state.keyframes = [
      createKeyframe(0, { backgroundColor: '#00f5d4' }),
      createKeyframe(100, { backgroundColor: '#f72585', rotate: 360, scale: 1.2, borderRadius: 50, shadowBlur: 40 })
    ];

    // Reset UI
    els.animName.value = state.name;
    els.duration.value = 1;
    els.valDuration.textContent = '1s';
    els.delay.value = 0;
    els.valDelay.textContent = '0s';
    els.easing.value = 'ease';
    els.infinite.checked = true;
    els.iterations.disabled = true;
    els.valIterations.textContent = 'infinite';
    els.direction.value = 'alternate';
    els.fillMode.value = 'forwards';
    els.speedCtrl.value = '1';
    els.iconPlay.style.display = 'none';
    els.iconPause.style.display = 'block';

    $$('.preset-btn').forEach(b => b.classList.remove('active'));

    renderTimeline();
    selectKeyframe(0);
    generateAnimation();
    updateCodeOutput();
  }

  // ==========================================
  // INIT
  // ==========================================
  init();

})();
