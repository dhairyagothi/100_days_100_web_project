/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED BACKGROUND — Aurora blobs + particle network
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');

  const PARTICLE_COUNT = 120;
  const CONNECT_DISTANCE = 90;
  const PARTICLE_COLORS = [
    'rgba(79,110,247,',   // indigo
    'rgba(201,168,76,',   // gold
    'rgba(62,207,142,',   // emerald
    'rgba(139,92,246,',   // purple
  ];

  let W, H, particles = [], tick = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 2 + 0.5,
      vx:    (Math.random() - 0.5) * 0.35,
      vy:    (Math.random() - 0.5) * 0.35,
      col:   PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      alpha: Math.random() * 0.45 + 0.05,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle());
  }

  function drawAurora() {
    ctx.clearRect(0, 0, W, H);

    /* Deep background */
    ctx.fillStyle = '#080b18';
    ctx.fillRect(0, 0, W, H);

    /* Blob 1 — indigo, top-left drift */
    let g = ctx.createRadialGradient(
      W * 0.25 + Math.sin(tick * 0.0007) * 80,
      H * 0.30 + Math.cos(tick * 0.0009) * 60,
      10,
      W * 0.25, H * 0.30, W * 0.45
    );
    g.addColorStop(0, 'rgba(79,110,247,0.18)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* Blob 2 — purple, top-right drift */
    g = ctx.createRadialGradient(
      W * 0.75 + Math.cos(tick * 0.0006) * 100,
      H * 0.20 + Math.sin(tick * 0.0011) * 50,
      10,
      W * 0.75, H * 0.20, W * 0.40
    );
    g.addColorStop(0, 'rgba(139,92,246,0.14)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* Blob 3 — gold, bottom-centre drift */
    g = ctx.createRadialGradient(
      W * 0.50 + Math.sin(tick * 0.0005) * 120,
      H * 0.75 + Math.cos(tick * 0.0008) * 70,
      10,
      W * 0.50, H * 0.75, W * 0.35
    );
    g.addColorStop(0, 'rgba(201,168,76,0.10)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawParticles() {
    /* Dots */
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.col + p.alpha + ')';
      ctx.fill();

      /* Move */
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    /* Connection lines */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(79,110,247,' + (0.07 * (1 - dist / CONNECT_DISTANCE)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    tick++;
    drawAurora();
    drawParticles();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', init);
  init();
  loop();
})();


/* ═══════════════════════════════════════════════════════════════════════════
   BMI CALCULATOR
   ═══════════════════════════════════════════════════════════════════════════ */
let bmiHistory = [];
let bmiChart   = null;

/* ── Height unit toggle ────────────────────────────────────────────────── */
document.getElementById('height-unit').addEventListener('change', function () {
  const isFeet = this.value === 'feet';
  document.getElementById('height-lbl').textContent = isFeet ? 'Height (ft.in)' : 'Height (cm)';
  document.getElementById('height').placeholder      = isFeet ? 'e.g. 5.9'      : 'e.g. 170';
});

/* ── Calculate button ──────────────────────────────────────────────────── */
document.getElementById('btn').addEventListener('click', calculate);

/* ── Helpers ───────────────────────────────────────────────────────────── */
function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.remove('hidden');
  document.getElementById('results').classList.add('hidden');
  document.getElementById('range-vis').classList.add('hidden');
}

function hideError() {
  document.getElementById('error-msg').classList.add('hidden');
}

function getCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', badge: 'rgba(79,110,247,0.15)',  text: '#4f6ef7' };
  if (bmi < 25.0) return { label: 'Normal weight', badge: 'rgba(62,207,142,0.15)', text: '#3ecf8e' };
  if (bmi < 30.0) return { label: 'Overweight',   badge: 'rgba(232,168,56,0.15)', text: '#e8a838' };
  return           { label: 'Obese',           badge: 'rgba(224,92,92,0.15)',  text: '#e05c5c' };
}

/* Maps a BMI value to a % position on the 10–40 scale bar */
function pointerPercent(bmi) {
  return Math.min(Math.max((bmi - 10) / (40 - 10) * 100, 2), 98);
}

/* ── Main calculate function ───────────────────────────────────────────── */
function calculate() {
  hideError();

  const heightUnit = document.getElementById('height-unit').value;
  const weightUnit = document.getElementById('weight-unit').value;
  const heightRaw  = document.getElementById('height').value.trim();
  const weightRaw  = parseFloat(document.getElementById('weight').value);

  /* ── Parse height → metres ── */
  let heightM;
  if (heightUnit === 'cm') {
    const cm = parseFloat(heightRaw);
    if (!cm || cm < 50 || cm > 300) { showError('Enter a valid height (50–300 cm).'); return; }
    heightM = cm / 100;
  } else {
    const parts = heightRaw.split('.');
    const ft    = parseFloat(parts[0] || 0);
    const inch  = parseFloat(parts[1] || 0);
    if (!ft && !inch) { showError('Enter height as ft.in (e.g. 5.9).'); return; }
    heightM = (ft * 12 + inch) * 0.0254;
  }

  /* ── Parse weight → kg ── */
  if (!weightRaw || weightRaw < 10 || weightRaw > 500) { showError('Enter a valid weight.'); return; }
  const weightKg = weightUnit === 'lb' ? weightRaw * 0.453592 : weightRaw;

  /* ── BMI ── */
  const bmi = weightKg / (heightM * heightM);
  const cat = getCategory(bmi);

  /* ── Healthy weight range in user's unit ── */
  const lowKg  = 18.5 * heightM * heightM;
  const highKg = 24.9 * heightM * heightM;

  const fmt = weightUnit === 'kg'
    ? n => n.toFixed(1) + ' kg'
    : n => (n / 0.453592).toFixed(1) + ' lb';

  /* ── Render results ── */
  document.getElementById('bmi-val').textContent = bmi.toFixed(1);

  const badge = document.getElementById('cat-badge');
  badge.textContent       = cat.label;
  badge.style.background  = cat.badge;
  badge.style.color       = cat.text;

  document.getElementById('healthy-range').textContent = fmt(lowKg) + ' – ' + fmt(highKg);

  const diff = weightKg - highKg;
  document.getElementById('tip-text').textContent = diff > 0
    ? 'Approx. ' + diff.toFixed(1) + ' kg above healthy range.'
    : 'Within or below healthy range.';

  document.getElementById('results').classList.remove('hidden');
  document.getElementById('range-vis').classList.remove('hidden');

  /* Animate pointer */
  document.getElementById('bmi-ptr').style.left = pointerPercent(bmi) + '%';

  /* ── Update history chart ── */
  bmiHistory.push({
    x: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    y: parseFloat(bmi.toFixed(2)),
  });
  renderChart();
}

/* ── Chart.js history line chart ───────────────────────────────────────── */
function renderChart() {
  const canvas = document.getElementById('bmiChart');
  if (bmiChart) bmiChart.destroy();

  bmiChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels:   bmiHistory.map(d => d.x),
      datasets: [{
        label:                'BMI',
        data:                 bmiHistory.map(d => d.y),
        borderColor:          '#4f6ef7',
        backgroundColor:      'rgba(79,110,247,0.08)',
        pointBackgroundColor: '#c9a84c',
        pointBorderColor:     '#c9a84c',
        pointRadius:          5,
        tension:              0.35,
        fill:                 true,
        borderWidth:          2,
      }],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(13,15,26,0.9)',
          borderColor:     'rgba(79,110,247,0.3)',
          borderWidth:     1,
          titleColor:      '#c9a84c',
          bodyColor:       '#eef0f8',
        },
      },
      scales: {
        x: {
          grid:  { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#8891b8', font: { size: 11 } },
        },
        y: {
          grid:          { color: 'rgba(255,255,255,0.04)' },
          ticks:         { color: '#8891b8', font: { size: 11 } },
          suggestedMin:  10,
          suggestedMax:  40,
        },
      },
    },
  });
}
