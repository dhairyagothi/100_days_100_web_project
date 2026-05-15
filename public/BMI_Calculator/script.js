var hUnit = 'cm';
var wUnit = 'kg';
var history = [];
var currentGaugeValue = null;
var gaugeFrame = null;

var elements = {
  body: document.body,
  heightCmRow: document.getElementById('heightCmRow'),
  heightFtRow: document.getElementById('heightFtRow'),
  hCm: document.getElementById('hCm'),
  hFt: document.getElementById('hFt'),
  wKg: document.getElementById('wKg'),
  wLb: document.getElementById('wLb'),
  weightUnitLabel: document.getElementById('weightUnitLabel'),
  unitModeLabel: document.getElementById('unitModeLabel'),
  heightCm: document.getElementById('heightCm'),
  heightFt: document.getElementById('heightFt'),
  heightIn: document.getElementById('heightIn'),
  weightVal: document.getElementById('weightVal'),
  dispBMI: document.getElementById('dispBMI'),
  dispCat: document.getElementById('dispCat'),
  heroStateChip: document.getElementById('heroStateChip'),
  heroStateCopy: document.getElementById('heroStateCopy'),
  gaugeCanvas: document.getElementById('gaugeCanvas'),
  gaugeBmi: document.getElementById('gaugeBmi'),
  gaugeCat: document.getElementById('gaugeCat'),
  scaleInd: document.getElementById('scaleInd'),
  resultMsg: document.getElementById('resultMsg'),
  tipsList: document.getElementById('tipsList'),
  targetWeightVal: document.getElementById('targetWeightVal'),
  trendVal: document.getElementById('trendVal'),
  trendCopy: document.getElementById('trendCopy'),
  historyCount: document.getElementById('historyCount')
};

var gaugeCtx = elements.gaugeCanvas.getContext('2d');
var gaugeW = 280;
var gaugeH = 170;

function getCategoryMeta(bmi) {
  if (bmi < 18.5) {
    return {
      label: 'Underweight',
      className: 'underweight',
      color: '#4a9eff',
      softColor: 'rgba(74, 158, 255, 0.18)',
      message: 'Below the recommended range. Focus on steady nutrition, strength, and consistency.'
    };
  }

  if (bmi < 25) {
    return {
      label: 'Normal weight',
      className: 'normalweight',
      color: '#22d47a',
      softColor: 'rgba(34, 212, 122, 0.18)',
      message: 'Inside the recommended range. Keep the momentum with balanced daily habits.'
    };
  }

  if (bmi < 30) {
    return {
      label: 'Overweight',
      className: 'overweight',
      color: '#f5a623',
      softColor: 'rgba(245, 166, 35, 0.18)',
      message: 'Above the recommended range. Small, repeatable improvements can move the trend.'
    };
  }

  return {
    label: 'Obesity',
    className: 'obesity',
    color: '#f55353',
    softColor: 'rgba(245, 83, 83, 0.18)',
    message: 'High BMI range detected. A structured plan and professional guidance can help.'
  };
}

function hexToRgba(hex, alpha) {
  var normalized = hex.replace('#', '');
  var value = parseInt(normalized, 16);
  var r = (value >> 16) & 255;
  var g = (value >> 8) & 255;
  var b = value & 255;
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

function sizeGaugeCanvas() {
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  elements.gaugeCanvas.width = gaugeW * dpr;
  elements.gaugeCanvas.height = gaugeH * dpr;
  gaugeCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawGauge(currentGaugeValue);
}

function drawGauge(bmiScore) {
  var cx = gaugeW / 2;
  var cy = gaugeH - 18;
  var outerRadius = 108;
  var tickInner = 86;
  var tickOuter = 98;
  var meta = bmiScore === null ? getCategoryMeta(22) : getCategoryMeta(bmiScore);

  gaugeCtx.clearRect(0, 0, gaugeW, gaugeH);

  gaugeCtx.beginPath();
  gaugeCtx.arc(cx, cy, outerRadius, Math.PI, Math.PI * 2);
  gaugeCtx.strokeStyle = 'rgba(255,255,255,0.08)';
  gaugeCtx.lineWidth = 20;
  gaugeCtx.lineCap = 'round';
  gaugeCtx.stroke();

  var segments = [
    { start: 0, end: 0.235, color: '#4a9eff' },
    { start: 0.235, end: 0.5, color: '#22d47a' },
    { start: 0.5, end: 0.735, color: '#f5a623' },
    { start: 0.735, end: 1, color: '#f55353' }
  ];

  segments.forEach(function(segment) {
    var startAngle = Math.PI + segment.start * Math.PI;
    var endAngle = Math.PI + segment.end * Math.PI;

    gaugeCtx.beginPath();
    gaugeCtx.arc(cx, cy, outerRadius, startAngle, endAngle);
    gaugeCtx.strokeStyle = segment.color;
    gaugeCtx.globalAlpha = 0.95;
    gaugeCtx.lineWidth = 18;
    gaugeCtx.lineCap = 'round';
    gaugeCtx.stroke();
  });

  gaugeCtx.globalAlpha = 1;

  for (var i = 0; i <= 14; i++) {
    var tickAngle = Math.PI + (i / 14) * Math.PI;
    var x1 = cx + Math.cos(tickAngle) * tickInner;
    var y1 = cy + Math.sin(tickAngle) * tickInner;
    var x2 = cx + Math.cos(tickAngle) * tickOuter;
    var y2 = cy + Math.sin(tickAngle) * tickOuter;

    gaugeCtx.beginPath();
    gaugeCtx.moveTo(x1, y1);
    gaugeCtx.lineTo(x2, y2);
    gaugeCtx.strokeStyle = 'rgba(255,255,255,0.16)';
    gaugeCtx.lineWidth = i % 2 === 0 ? 2 : 1;
    gaugeCtx.stroke();
  }

  gaugeCtx.beginPath();
  gaugeCtx.arc(cx, cy, 74, Math.PI, Math.PI * 2);
  gaugeCtx.strokeStyle = 'rgba(255,255,255,0.05)';
  gaugeCtx.lineWidth = 1.2;
  gaugeCtx.stroke();

  gaugeCtx.beginPath();
  gaugeCtx.arc(cx, cy, 7, 0, Math.PI * 2);
  gaugeCtx.fillStyle = 'rgba(255,255,255,0.18)';
  gaugeCtx.fill();

  if (bmiScore !== null) {
    var clamp = Math.min(Math.max(bmiScore, 10), 45);
    var pct = (clamp - 10) / (45 - 10);
    var angle = Math.PI + pct * Math.PI;
    var trailRadius = 90;
    var tipX = cx + Math.cos(angle) * (trailRadius + 2);
    var tipY = cy + Math.sin(angle) * (trailRadius + 2);

    gaugeCtx.beginPath();
    gaugeCtx.arc(cx, cy, trailRadius, Math.PI, angle);
    gaugeCtx.strokeStyle = meta.softColor;
    gaugeCtx.lineWidth = 6;
    gaugeCtx.lineCap = 'round';
    gaugeCtx.stroke();

    gaugeCtx.save();
    gaugeCtx.beginPath();
    gaugeCtx.moveTo(cx, cy);
    gaugeCtx.lineTo(tipX, tipY);
    gaugeCtx.strokeStyle = '#ffffff';
    gaugeCtx.shadowColor = meta.color;
    gaugeCtx.shadowBlur = 16;
    gaugeCtx.lineWidth = 4;
    gaugeCtx.lineCap = 'round';
    gaugeCtx.stroke();
    gaugeCtx.restore();

    gaugeCtx.beginPath();
    gaugeCtx.arc(tipX, tipY, 7, 0, Math.PI * 2);
    gaugeCtx.fillStyle = meta.color;
    gaugeCtx.shadowColor = meta.color;
    gaugeCtx.shadowBlur = 14;
    gaugeCtx.fill();

    gaugeCtx.beginPath();
    gaugeCtx.arc(tipX, tipY, 3.2, 0, Math.PI * 2);
    gaugeCtx.fillStyle = '#ffffff';
    gaugeCtx.fill();
  }

  gaugeCtx.beginPath();
  gaugeCtx.arc(cx, cy, 4, 0, Math.PI * 2);
  gaugeCtx.fillStyle = '#ffffff';
  gaugeCtx.fill();
}

function animateGauge(target) {
  if (gaugeFrame) cancelAnimationFrame(gaugeFrame);

  var startValue = currentGaugeValue === null ? 10 : currentGaugeValue;
  var endValue = Math.min(Math.max(target, 10), 45);
  var startTime = null;
  var duration = 1000;

  function frame(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var nextValue = startValue + (endValue - startValue) * eased;

    drawGauge(nextValue);

    if (progress < 1) {
      gaugeFrame = requestAnimationFrame(frame);
    } else {
      currentGaugeValue = target;
      drawGauge(target);
    }
  }

  gaugeFrame = requestAnimationFrame(frame);
}

function animateNumericText(element, target, decimals) {
  var startValue = parseFloat(element.textContent);
  if (Number.isNaN(startValue)) startValue = 0;
  if (element._frame) cancelAnimationFrame(element._frame);

  var startTime = null;
  var duration = 900;

  function frame(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 4);
    var value = startValue + (target - startValue) * eased;
    element.textContent = value.toFixed(decimals);

    if (progress < 1) {
      element._frame = requestAnimationFrame(frame);
    } else {
      element.textContent = target.toFixed(decimals);
    }
  }

  element._frame = requestAnimationFrame(frame);
}

function pulseResultStage() {
  var resultStage = document.querySelector('.result-stage');
  if (!resultStage || !resultStage.animate) return;

  resultStage.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.018)' },
    { transform: 'scale(1)' }
  ], {
    duration: 560,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
  });
}

function updateUnitModeLabel() {
  var label = 'Custom mode';

  if (hUnit === 'cm' && wUnit === 'kg') {
    label = 'Metric mode';
  } else if (hUnit === 'ft' && wUnit === 'lb') {
    label = 'Imperial mode';
  }

  elements.unitModeLabel.textContent = label;
}

function setThemeState(stateKey) {
  elements.body.dataset.bmiState = stateKey || 'idle';
}

function setHUnit(unit) {
  hUnit = unit;
  elements.hCm.classList.toggle('active', unit === 'cm');
  elements.hFt.classList.toggle('active', unit === 'ft');
  elements.heightCmRow.style.display = unit === 'cm' ? '' : 'none';
  elements.heightFtRow.style.display = unit === 'ft' ? '' : 'none';
  updateUnitModeLabel();
}

function setWUnit(unit) {
  wUnit = unit;
  elements.wKg.classList.toggle('active', unit === 'kg');
  elements.wLb.classList.toggle('active', unit === 'lb');
  elements.weightUnitLabel.textContent = unit;
  updateUnitModeLabel();
}

function formatHeight(heightCm) {
  if (hUnit === 'cm') {
    return Math.round(heightCm) + ' cm';
  }

  var totalInches = heightCm / 2.54;
  var feet = Math.floor(totalInches / 12);
  var inches = Math.round(totalInches - feet * 12);

  if (inches === 12) {
    feet += 1;
    inches = 0;
  }

  return feet + ' ft ' + inches + ' in';
}

function formatWeight(weightKg) {
  if (wUnit === 'kg') {
    return weightKg.toFixed(1) + ' kg';
  }

  return (weightKg / 0.453592).toFixed(1) + ' lb';
}

function formatWeightRange(weightKgMin, weightKgMax) {
  if (wUnit === 'kg') {
    return weightKgMin.toFixed(1) + ' - ' + weightKgMax.toFixed(1) + ' kg';
  }

  var minLb = weightKgMin / 0.453592;
  var maxLb = weightKgMax / 0.453592;
  return minLb.toFixed(1) + ' - ' + maxLb.toFixed(1) + ' lb';
}

function updateResultTiles(heightCm, bmiScore, previousBmi) {
  var heightM = heightCm / 100;
  var targetMin = 18.5 * heightM * heightM;
  var targetMax = 24.9 * heightM * heightM;
  elements.targetWeightVal.textContent = formatWeightRange(targetMin, targetMax);

  if (previousBmi === null) {
    elements.trendVal.textContent = 'First check';
    elements.trendVal.dataset.trend = 'flat';
    elements.trendCopy.textContent = 'Track repeat entries';
  } else {
    var delta = parseFloat((bmiScore - previousBmi).toFixed(1));

    if (Math.abs(delta) < 0.1) {
      elements.trendVal.textContent = 'No change';
      elements.trendVal.dataset.trend = 'flat';
      elements.trendCopy.textContent = 'Holding steady vs last check';
    } else if (delta > 0) {
      elements.trendVal.textContent = '+' + delta.toFixed(1);
      elements.trendVal.dataset.trend = 'up';
      elements.trendCopy.textContent = 'Higher than your last check';
    } else {
      elements.trendVal.textContent = delta.toFixed(1);
      elements.trendVal.dataset.trend = 'down';
      elements.trendCopy.textContent = 'Lower than your last check';
    }
  }

  document.querySelectorAll('.result-tile').forEach(function(tile, index) {
    tile.classList.remove('is-live');
    tile.style.animationDelay = (index * 70) + 'ms';
    void tile.offsetWidth;
    tile.classList.add('is-live');
  });
}

function updateHeroSummary(meta) {
  elements.heroStateChip.textContent = meta.label;
  elements.heroStateChip.className = 'status-chip';
  elements.heroStateCopy.textContent = meta.message;
  elements.dispCat.textContent = meta.label;
}

function updateHistoryAppearance(accentColor) {
  var gradient = histCtx.createLinearGradient(0, 0, 0, 220);
  gradient.addColorStop(0, hexToRgba(accentColor, 0.34));
  gradient.addColorStop(1, hexToRgba(accentColor, 0));

  histChart.data.datasets[0].borderColor = accentColor;
  histChart.data.datasets[0].backgroundColor = gradient;
}

function updateHistoryCount() {
  var count = history.length;
  elements.historyCount.textContent = count + ' ' + (count === 1 ? 'entry' : 'entries');
}

var histCtx = document.getElementById('historyChart').getContext('2d');
var histChart = new Chart(histCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'BMI',
      data: [],
      borderColor: '#0fbfad',
      backgroundColor: 'rgba(15,191,173,.08)',
      borderWidth: 3,
      pointBackgroundColor: '#0fbfad',
      pointBorderColor: '#07111f',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: 0.38,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 760,
      easing: 'easeOutCubic'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(8, 18, 34, 0.94)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#dce7fb',
        displayColors: false,
        callbacks: {
          label: function(context) {
            return 'BMI: ' + context.parsed.y.toFixed(1);
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#7a92b5', font: { size: 11 } }
      },
      y: {
        min: 10,
        max: 40,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#7a92b5', font: { size: 11 } }
      }
    }
  }
});

function calculate() {
  var heightCm;
  var weightKg;

  if (hUnit === 'cm') {
    heightCm = parseFloat(elements.heightCm.value);
    if (!heightCm || heightCm < 50 || heightCm > 300) {
      alert('Please enter a valid height (50-300 cm).');
      return;
    }
  } else {
    var feet = parseFloat(elements.heightFt.value) || 0;
    var inches = parseFloat(elements.heightIn.value) || 0;

    if (!feet && !inches) {
      alert('Please enter your height in feet and inches.');
      return;
    }

    heightCm = feet * 30.48 + inches * 2.54;
  }

  weightKg = parseFloat(elements.weightVal.value);
  if (!weightKg || weightKg <= 0) {
    alert('Please enter a valid weight.');
    return;
  }

  if (wUnit === 'lb') {
    weightKg *= 0.453592;
  }

  var heightM = heightCm / 100;
  var bmi = weightKg / (heightM * heightM);
  var bmiRounded = parseFloat(bmi.toFixed(1));
  var meta = getCategoryMeta(bmiRounded);
  var previousBmi = history.length ? history[history.length - 1].bmi : null;

  setThemeState(meta.className);
  animateGauge(bmiRounded);
  animateNumericText(elements.gaugeBmi, bmiRounded, 1);
  animateNumericText(elements.dispBMI, bmiRounded, 1);

  elements.gaugeCat.textContent = meta.label;
  elements.gaugeCat.className = 'gauge-cat is-visible';
  elements.scaleInd.style.opacity = '1';
  elements.scaleInd.style.left = (((Math.min(Math.max(bmiRounded, 10), 45) - 10) / 35) * 100) + '%';

  elements.resultMsg.innerHTML =
    '<strong style="color:#fff;">BMI ' + bmiRounded.toFixed(1) + ' kg/m2</strong><br>' +
    '<span style="color:' + meta.color + '; font-weight:700;">' + meta.label + '</span> | ' + meta.message + '<br>' +
    '<span style="font-size:0.78rem;">Height: ' + formatHeight(heightCm) + ' | Weight: ' + formatWeight(weightKg) + '</span>';

  updateHeroSummary(meta);
  updateResultTiles(heightCm, bmiRounded, previousBmi);
  renderTips(meta.label);
  pulseResultStage();
  updateHistoryAppearance(meta.color);

  var now = new Date();
  var label = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
              now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  history.push({ label: label, bmi: bmiRounded });
  histChart.data.labels.push(label);
  histChart.data.datasets[0].data.push(bmiRounded);
  histChart.data.datasets[0].pointBackgroundColor =
    histChart.data.datasets[0].data.map(function(value) {
      return getCategoryMeta(value).color;
    });
  histChart.update();
  updateHistoryCount();
}

var tipsData = {
  'Underweight': [
    {
      icon: '<path d="M3 2l2 2m-2 6h5.5M3 14l2-2m7-8.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/>',
      color: 'rgba(74,158,255,.22)',
      title: 'Build calories gradually',
      text: 'Aim for 5-6 smaller meals each day with protein, complex carbs, and healthy fats.'
    },
    {
      icon: '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>',
      color: 'rgba(74,158,255,.18)',
      title: 'Use nutrient-dense snacks',
      text: 'Smoothies with oats, nut butters, milk, fruit, and protein can make intake easier.'
    },
    {
      icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      color: 'rgba(74,158,255,.18)',
      title: 'Train for strength',
      text: 'Resistance work can help support lean muscle gain instead of only adding body weight.'
    }
  ],
  'Normal weight': [
    {
      icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>',
      color: 'rgba(34,212,122,.20)',
      title: 'Maintain the momentum',
      text: 'Your BMI is in the healthy range. Keep your meals balanced and movement consistent.'
    },
    {
      icon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
      color: 'rgba(34,212,122,.18)',
      title: 'Protect the baseline',
      text: 'Aim for regular cardio, some strength work, quality sleep, and hydration.'
    },
    {
      icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
      color: 'rgba(34,212,122,.14)',
      title: 'Track trends, not one-off days',
      text: 'Use repeat check-ins to catch drift early and stay inside your comfort range.'
    }
  ],
  'Overweight': [
    {
      icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
      color: 'rgba(245,166,35,.20)',
      title: 'Simplify your meals',
      text: 'Reduce processed foods and build most meals around protein, fiber, and whole foods.'
    },
    {
      icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
      color: 'rgba(245,166,35,.18)',
      title: 'Move a little more daily',
      text: 'Walking, cycling, or 30 minutes of moderate activity can shift the weekly trend.'
    },
    {
      icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
      color: 'rgba(245,166,35,.14)',
      title: 'Stay patient and steady',
      text: 'Even a 5-10 percent reduction in body weight can improve key health markers.'
    }
  ],
  'Obesity': [
    {
      icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      color: 'rgba(245,83,83,.20)',
      title: 'Get structured support',
      text: 'A clinician or registered dietitian can help shape a realistic, personalized plan.'
    },
    {
      icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
      color: 'rgba(245,83,83,.18)',
      title: 'Start with low-friction habits',
      text: 'Begin with short walks, better meal structure, and sleep consistency before chasing perfection.'
    },
    {
      icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>',
      color: 'rgba(245,83,83,.14)',
      title: 'Review patterns honestly',
      text: 'Track food, movement, and energy for a week to spot the biggest improvement opportunities.'
    }
  ]
};

function renderTips(category) {
  var tips = tipsData[category] || tipsData['Normal weight'];
  var html = '';

  tips.forEach(function(tip, index) {
    html +=
      '<div class="tip-item" style="animation-delay:' + (index * 90) + 'ms;">' +
        '<div class="tip-icon" style="background:' + tip.color + ';">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">' + tip.icon + '</svg>' +
        '</div>' +
        '<div class="tip-text"><strong>' + tip.title + '</strong>' + tip.text + '</div>' +
      '</div>';
  });

  elements.tipsList.innerHTML = html;
}

function clearHistory() {
  history = [];
  histChart.data.labels = [];
  histChart.data.datasets[0].data = [];
  histChart.update();
  updateHistoryCount();
  elements.trendVal.textContent = 'First check';
  elements.trendVal.dataset.trend = 'flat';
  elements.trendCopy.textContent = 'Track repeat entries';
}

function initRevealAnimations() {
  var revealItems = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(function(item) {
      item.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach(function(item) {
    observer.observe(item);
  });
}

function initTiltCards() {
  var cards = document.querySelectorAll('.tilt-card');

  cards.forEach(function(card) {
    card.addEventListener('pointermove', function(event) {
      if (window.matchMedia('(pointer: coarse)').matches) return;

      var rect = card.getBoundingClientRect();
      var px = (event.clientX - rect.left) / rect.width;
      var py = (event.clientY - rect.top) / rect.height;
      var rotateY = (px - 0.5) * 10;
      var rotateX = (0.5 - py) * 10;

      card.style.setProperty('--tilt-x', rotateX + 'deg');
      card.style.setProperty('--tilt-y', rotateY + 'deg');
    });

    card.addEventListener('pointerleave', function() {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') calculate();
});

document.querySelectorAll('input[type=number]').forEach(function(input) {
  input.addEventListener('wheel', function(event) {
    event.preventDefault();
  }, { passive: false });
});

window.addEventListener('resize', sizeGaugeCanvas);

updateUnitModeLabel();
updateHistoryCount();
updateHistoryAppearance('#0fbfad');
setThemeState('idle');
sizeGaugeCanvas();
initRevealAnimations();
initTiltCards();
