/* ==========================================================================
   Plant Growth Simulation — Enhanced Interactive Logic
   ========================================================================== */
(function () {
  'use strict';

  // ---- Stage Data ----
  const STAGES = [
    {
      name: 'Seeds',
      image: 'images/seeds.webp',
      emoji: '🌱',
      description:
        'Every great tree starts as a tiny seed. Add water and sunlight to begin growing!',
    },
    {
      name: 'Sapling',
      image: 'images/sap3.webp',
      emoji: '🌿',
      description: 'A tender sapling has emerged! Keep nurturing it with care.',
    },
    {
      name: 'Young Plant',
      image: 'images/stage-2-veretation.png',
      emoji: '🪴',
      description: 'Your plant is growing strong with lush green vegetation.',
    },
    {
      name: 'Flowering Plant',
      image: 'images/flowering.png',
      emoji: '🌸',
      description: 'Beautiful flowers have bloomed! Your plant is thriving.',
    },
    {
      name: 'Tree',
      image: 'images/R.png',
      emoji: '🌳',
      description:
        "A magnificent tree stands tall! You've completed the journey. 🎉",
    },
  ];

  const FALLBACK_IMAGE = 'images/back.webp';

  const MAX_LEVEL = 4;

  // ---- State ----
  let state = {
    water: 0,
    sunlight: 0,
    stage: 0,
  };

  // ---- DOM Elements ----
  const el = {
    plantImage: document.getElementById('plant-image'),
    plantStage: document.getElementById('plant-stage'),
    plantGlow: document.getElementById('plant-glow'),
    stageDescription: document.getElementById('stage-description'),
    stageBadge: document.getElementById('stage-badge'),
    stageEmoji: document.getElementById('stage-emoji'),
    waterMeter: document.getElementById('water-meter'),
    waterMeterWrap: document.getElementById('water-meter-wrap'),
    waterValue: document.getElementById('water-value'),
    sunMeter: document.getElementById('sun-meter'),
    sunMeterWrap: document.getElementById('sun-meter-wrap'),
    sunValue: document.getElementById('sun-value'),
    waterBtn: document.getElementById('water-btn'),
    sunBtn: document.getElementById('sun-btn'),
    resetBtn: document.getElementById('reset-btn'),
    timeline: document.getElementById('progress-timeline'),
    celebrationOverlay: document.getElementById('celebration-overlay'),
    plantImageContainer: document.getElementById('plant-image-container'),
  };

  el.plantImage.addEventListener('error', function () {
    console.warn('Missing plant stage image:', this.src);

    this.onerror = null;
    this.classList.add('fallback');
    this.src = FALLBACK_IMAGE;
    this.alt = 'Plant image unavailable';
  });
  // ---- Initialize ----
  function init() {
    bindEvents();
    render();
  }

  // ---- Event Binding ----
  function bindEvents() {
    el.waterBtn.addEventListener('click', handleWater);
    el.sunBtn.addEventListener('click', handleSunlight);
    el.resetBtn.addEventListener('click', handleReset);

    // Ripple effect on buttons
    document.querySelectorAll('.control-btn').forEach(function (btn) {
      btn.addEventListener('click', createRipple);
    });
  }

  // ---- Handlers ----
  function handleWater() {
    if (state.water >= MAX_LEVEL || state.water > state.sunlight) return;
    state.water++;
    onResourceAdded();
  }

  function handleSunlight() {
    if (state.sunlight >= MAX_LEVEL || state.sunlight > state.water) return;
    state.sunlight++;
    onResourceAdded();
  }

  function onResourceAdded() {
    checkStageAdvance();
    render();
  }

  function handleReset() {
    state = { water: 0, sunlight: 0, stage: 0 };
    el.plantStage.classList.remove('completed');
    el.celebrationOverlay.classList.remove('active');
    el.celebrationOverlay.innerHTML = '';

    // Animate plant image reset
    el.plantImage.classList.add('growing');
    el.plantImage.addEventListener('animationend', function onEnd() {
      el.plantImage.classList.remove('growing');
      el.plantImage.removeEventListener('animationend', onEnd);
    });

    render();
  }

  // ---- Stage Logic ----
  function checkStageAdvance() {
    var newStage = Math.min(state.water, state.sunlight);
    if (newStage !== state.stage && newStage <= STAGES.length - 1) {
      state.stage = newStage;
      animatePlantTransition();

      if (state.stage === STAGES.length - 1) {
        triggerCelebration();
      }
    }
  }

  // ---- Rendering ----
  function render() {
    renderMeters();
    renderStage();
    renderTimeline();
    renderButtons();
  }

  function renderMeters() {
    var waterPercent = (state.water / MAX_LEVEL) * 100;
    var sunPercent = (state.sunlight / MAX_LEVEL) * 100;

    el.waterMeter.style.width = waterPercent + '%';
    el.sunMeter.style.width = sunPercent + '%';

    el.waterMeterWrap.setAttribute('aria-valuenow', state.water);
    el.sunMeterWrap.setAttribute('aria-valuenow', state.sunlight);

    el.waterValue.textContent = state.water + ' / ' + MAX_LEVEL;
    el.sunValue.textContent = state.sunlight + ' / ' + MAX_LEVEL;
  }

  function renderStage() {
    var stage = STAGES[state.stage];

    el.plantImage.onerror = function () {
      console.warn('Missing plant stage image:', stage.image);

      this.onerror = null;
      this.src = FALLBACK_IMAGE;
      this.alt = 'Plant image unavailable';
    };

    el.plantImage.src = stage.image;
    el.plantImage.alt = 'Current plant stage: ' + stage.name;
    el.stageDescription.textContent = stage.description;
    el.stageBadge.textContent = stage.name;
    el.stageEmoji.textContent = stage.emoji;
    el.plantStage.setAttribute('data-stage', state.stage);
  }

  function renderTimeline() {
    var steps = el.timeline.querySelectorAll('.timeline-step');
    var connectors = el.timeline.querySelectorAll('.connector-fill');

    steps.forEach(function (step, index) {
      step.classList.remove('active', 'completed');
      step.removeAttribute('aria-current');

      if (index < state.stage) {
        step.classList.add('completed');
      } else if (index === state.stage) {
        step.classList.add('active');
        step.setAttribute('aria-current', 'step');
      }
    });

    connectors.forEach(function (connector, index) {
      if (index < state.stage) {
        connector.classList.add('filled');
      } else {
        connector.classList.remove('filled');
      }
    });
  }

  function renderButtons() {
    var isComplete = state.stage >= STAGES.length - 1;

    // Water button: disable if at max or if water is already ahead of sunlight
    el.waterBtn.disabled =
      isComplete || state.water >= MAX_LEVEL || state.water > state.sunlight;
    el.sunBtn.disabled =
      isComplete || state.sunlight >= MAX_LEVEL || state.sunlight > state.water;

    // Update button text for completed state
    if (isComplete) {
      el.waterBtn.querySelector('.btn-text').textContent = 'Max Level';
      el.sunBtn.querySelector('.btn-text').textContent = 'Max Level';
    } else {
      el.waterBtn.querySelector('.btn-text').textContent = 'Add Water';
      el.sunBtn.querySelector('.btn-text').textContent = 'Add Sunlight';
    }
  }

  // ---- Animations ----
  function animatePlantTransition() {
    el.plantImage.classList.add('growing');
    el.plantImage.addEventListener('animationend', function onEnd() {
      el.plantImage.classList.remove('growing');
      el.plantImage.removeEventListener('animationend', onEnd);
    });
  }

  function createRipple(e) {
    var btn = e.currentTarget;
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var x = e.clientX - rect.left - size / 2;
    var y = e.clientY - rect.top - size / 2;

    // Remove existing ripples
    var existingRipple = btn.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();

    var ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    btn.appendChild(ripple);

    ripple.addEventListener('animationend', function () {
      ripple.remove();
    });
  }

  // ---- Celebration ----
  function triggerCelebration() {
    el.plantStage.classList.add('completed');

    // Generate confetti
    var overlay = el.celebrationOverlay;
    overlay.innerHTML = '';
    overlay.classList.add('active');

    var colors = [
      'hsl(145, 65%, 48%)', // green
      'hsl(42, 95%, 55%)', // gold
      'hsl(200, 85%, 55%)', // blue
      'hsl(330, 70%, 55%)', // pink
      'hsl(48, 100%, 60%)', // yellow
      'hsl(280, 55%, 58%)', // purple
    ];

    for (var i = 0; i < 60; i++) {
      var piece = document.createElement('div');
      piece.classList.add('confetti-piece');
      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.animationDuration = Math.random() * 2 + 2 + 's';
      piece.style.animationDelay = Math.random() * 1.5 + 's';
      piece.style.width = Math.random() * 8 + 6 + 'px';
      piece.style.height = Math.random() * 8 + 6 + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      overlay.appendChild(piece);
    }

    // Clean up after animation
    setTimeout(function () {
      overlay.classList.remove('active');
      setTimeout(function () {
        overlay.innerHTML = '';
      }, 500);
    }, 4500);
  }

  // ---- Start ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
