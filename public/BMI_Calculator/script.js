
var hUnit = 'cm';
var wUnit = 'kg';
var history = [];


function setHUnit(u) {
  hUnit = u;
  document.getElementById('hCm').classList.toggle('active', u === 'cm');
  document.getElementById('hFt').classList.toggle('active', u === 'ft');
  document.getElementById('heightCmRow').style.display = u === 'cm' ? '' : 'none';
  document.getElementById('heightFtRow').style.display = u === 'ft' ? '' : 'none';
}

function setWUnit(u) {
  wUnit = u;
  document.getElementById('wKg').classList.toggle('active', u === 'kg');
  document.getElementById('wLb').classList.toggle('active', u === 'lb');
  document.getElementById('weightUnitLabel').textContent = u;
}


var gaugeCtx = document.getElementById('gaugeCanvas').getContext('2d');
var gaugeW = 240, gaugeH = 140;
document.getElementById('gaugeCanvas').width  = gaugeW * 2;
document.getElementById('gaugeCanvas').height = gaugeH * 2;
gaugeCtx.scale(2, 2);

function drawGauge(bmiScore) {
  var cx = gaugeW / 2, cy = gaugeH - 10;
  var r = 100, inR = 72;

  gaugeCtx.clearRect(0, 0, gaugeW, gaugeH);

  var segs = [
    { pct: 0,    end: .235, color: '#4a9eff' },
    { pct: .235, end: .5,   color: '#22d47a' },
    { pct: .5,   end: .735, color: '#f5a623' },
    { pct: .735, end: 1,    color: '#f55353' },
  ];

  segs.forEach(function(s) {
    var sa = Math.PI + s.pct * Math.PI;
    var ea = Math.PI + s.end * Math.PI;

    // filled arc
    gaugeCtx.beginPath();
    gaugeCtx.arc(cx, cy, r,   sa, ea);
    gaugeCtx.arc(cx, cy, inR, ea, sa, true);
    gaugeCtx.fillStyle = s.color;
    gaugeCtx.globalAlpha = .22;
    gaugeCtx.fill();
    gaugeCtx.globalAlpha = 1;

    // stroked arc
    gaugeCtx.beginPath();
    gaugeCtx.arc(cx, cy, r,   sa, ea);
    gaugeCtx.arc(cx, cy, inR, ea, sa, true);
    gaugeCtx.strokeStyle = s.color;
    gaugeCtx.lineWidth = 1;
    gaugeCtx.stroke();
  });

  if (bmiScore !== null) {
    var clamp = Math.min(Math.max(bmiScore, 10), 45);
    var pct   = (clamp - 10) / (45 - 10);
    var angle = Math.PI + pct * Math.PI;
    var nx    = cx + Math.cos(angle) * (inR + 14);
    var ny    = cy + Math.sin(angle) * (inR + 14);

    // pivot dot
    gaugeCtx.beginPath();
    gaugeCtx.arc(cx, cy, 4, 0, Math.PI * 2);
    gaugeCtx.fillStyle = 'rgba(255,255,255,.6)';
    gaugeCtx.fill();

    // needle line
    gaugeCtx.beginPath();
    gaugeCtx.moveTo(cx, cy);
    gaugeCtx.lineTo(nx, ny);
    gaugeCtx.strokeStyle = '#fff';
    gaugeCtx.lineWidth   = 2;
    gaugeCtx.lineCap     = 'round';
    gaugeCtx.stroke();

    // needle tip
    gaugeCtx.beginPath();
    gaugeCtx.arc(nx, ny, 5, 0, Math.PI * 2);
    gaugeCtx.fillStyle = getCatColor(bmiScore);
    gaugeCtx.fill();
  }
}

drawGauge(null);

function getCatColor(bmi) {
  if (bmi < 18.5) return '#4a9eff';
  if (bmi < 25)   return '#22d47a';
  if (bmi < 30)   return '#f5a623';
  return '#f55353';
}

// HISTORY CHART
var histCtx   = document.getElementById('historyChart').getContext('2d');
var histChart = new Chart(histCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'BMI',
      data: [],
      borderColor: '#0fbfad',
      backgroundColor: 'rgba(15,191,173,.08)',
      borderWidth: 2,
      pointBackgroundColor: '#0fbfad',
      pointRadius: 5,
      pointHoverRadius: 7,
      tension: .4,
      fill: true,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(c) { return ' BMI: ' + c.parsed.y.toFixed(1); }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,.05)' },
        ticks: { color: '#7a92b5', font: { size: 11 } }
      },
      y: {
        beginAtZero: false,
        min: 10,
        max: 40,
        grid: { color: 'rgba(255,255,255,.05)' },
        ticks: { color: '#7a92b5', font: { size: 11 } }
      }
    }
  }
});

// CALCULATE
function calculate() {
  var heightCm, weight;

  if (hUnit === 'cm') {
    heightCm = parseFloat(document.getElementById('heightCm').value);
    if (!heightCm || heightCm < 50 || heightCm > 300) {
      alert('Please enter a valid height (50–300 cm).');
      return;
    }
  } else {
    var ft     = parseFloat(document.getElementById('heightFt').value) || 0;
    var inches = parseFloat(document.getElementById('heightIn').value) || 0;
    if (!ft && !inches) {
      alert('Please enter your height in feet / inches.');
      return;
    }
    heightCm = ft * 30.48 + inches * 2.54;
  }

  weight = parseFloat(document.getElementById('weightVal').value);
  if (!weight || weight <= 0) {
    alert('Please enter a valid weight.');
    return;
  }
  if (wUnit === 'lb') weight *= 0.453592;

  var hM   = heightCm / 100;
  var bmi  = weight / (hM * hM);
  var bmiR = parseFloat(bmi.toFixed(1));

  var cat      = getCategory(bmiR);
  var catClass = cat.toLowerCase().replace(' ', '');

  // Update gauge
  drawGauge(bmiR);
  document.getElementById('gaugeBmi').textContent = bmiR.toFixed(1);
  var catEl = document.getElementById('gaugeCat');
  catEl.textContent = cat;
  catEl.className   = 'gauge-cat ' + catClass;

  // Scale indicator
  var clamp = Math.min(Math.max(bmiR, 10), 45);
  var pct   = ((clamp - 10) / (45 - 10)) * 100;
  var ind   = document.getElementById('scaleInd');
  ind.style.opacity = '1';
  ind.style.left    = pct + '%';

  // Result message
  document.getElementById('resultMsg').innerHTML =
    '<span style="color:#fff;font-weight:500;">' + bmiR.toFixed(1) + ' kg/m²</span> — ' +
    '<span style="color:' + getCatColor(bmiR) + '">' + cat + '</span><br>' +
    '<span style="font-size:.77rem;">Height: ' + heightCm.toFixed(0) + 'cm · Weight: ' + weight.toFixed(1) + 'kg</span>';

  // Hero stats
  document.getElementById('dispBMI').textContent = bmiR.toFixed(1);
  document.getElementById('dispCat').textContent = cat;

  // Tips
  renderTips(cat);

  // History chart
  var now   = new Date();
  var label = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
              now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  history.push({ label: label, bmi: bmiR });
  histChart.data.labels.push(label);
  histChart.data.datasets[0].data.push(bmiR);
  histChart.data.datasets[0].pointBackgroundColor =
    histChart.data.datasets[0].data.map(function(v) { return getCatColor(v); });
  histChart.update();
}

function getCategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25)   return 'Normal weight';
  if (bmi < 30)   return 'Overweight';
  return 'Obesity';
}

// HEALTH TIPS DATA
var tipsData = {
  'Underweight': [
    {
      icon: '<path d="M3 2l2 2m-2 6h5.5M3 14l2-2m7-8.5a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"/>',
      color: 'rgba(74,158,255,.25)',
      title: 'Eat more frequently',
      text: 'Aim for 5–6 smaller meals a day packed with proteins, healthy fats, and complex carbs.'
    },
    {
      icon: '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>',
      color: 'rgba(74,158,255,.2)',
      title: 'Nutrient-dense smoothies',
      text: 'Blend bananas, nut butters, oats, whole milk and protein powder for calorie-rich snacks.'
    },
    {
      icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      color: 'rgba(74,158,255,.2)',
      title: 'Strength training',
      text: 'Light resistance exercises help you build lean muscle mass and support healthy weight gain.'
    },
  ],
  'Normal weight': [
    {
      icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>',
      color: 'rgba(34,212,122,.2)',
      title: 'Great job — maintain it!',
      text: 'Your BMI is in the healthy range. Keep up your balanced diet and regular physical activity.'
    },
    {
      icon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
      color: 'rgba(34,212,122,.2)',
      title: 'Stay active',
      text: 'Aim for 150 min of moderate cardio per week and 2 sessions of strength training.'
    },
    {
      icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
      color: 'rgba(34,212,122,.15)',
      title: 'Hydrate well',
      text: 'Drink at least 8 glasses of water daily to maintain metabolism and energy levels.'
    },
  ],
  'Overweight': [
    {
      icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
      color: 'rgba(245,166,35,.2)',
      title: 'Balanced diet focus',
      text: 'Reduce processed foods and sugars. Focus on vegetables, lean proteins, and whole grains.'
    },
    {
      icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>',
      color: 'rgba(245,166,35,.2)',
      title: 'Increase activity',
      text: 'Add 30 minutes of brisk walking daily. Small habits compound over time into big results.'
    },
    {
      icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
      color: 'rgba(245,166,35,.15)',
      title: 'Be kind to yourself',
      text: 'Progress not perfection. Even 5–10% weight loss improves health significantly.'
    },
  ],
  'Obesity': [
    {
      icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
      color: 'rgba(245,83,83,.2)',
      title: 'Consult a healthcare provider',
      text: 'A doctor can help with a personalized plan. Medical support makes a big difference.'
    },
    {
      icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
      color: 'rgba(245,83,83,.2)',
      title: 'Small sustainable steps',
      text: 'Set achievable daily goals. Start with 10-minute walks and build gradually.'
    },
    {
      icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>',
      color: 'rgba(245,83,83,.15)',
      title: 'Nutrition first',
      text: 'Reduce calorie-dense foods. Keep a food diary to identify patterns and trigger foods.'
    },
  ]
};

function renderTips(cat) {
  var tips = tipsData[cat] || tipsData['Normal weight'];
  var html = '';
  tips.forEach(function(t) {
    html +=
      '<div class="tip-item">' +
        '<div class="tip-icon" style="background:' + t.color + ';">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">' + t.icon + '</svg>' +
        '</div>' +
        '<div class="tip-text"><strong>' + t.title + '</strong>' + t.text + '</div>' +
      '</div>';
  });
  document.getElementById('tipsList').innerHTML = html;
}

function clearHistory() {
  history = [];
  histChart.data.labels = [];
  histChart.data.datasets[0].data = [];
  histChart.update();
}


document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calculate();
});


document.querySelectorAll('input[type=number]').forEach(function(el) {
  el.addEventListener('wheel', function(e) {
    e.preventDefault();
  }, { passive: false });
});
