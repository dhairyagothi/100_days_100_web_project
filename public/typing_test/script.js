/* =====================================
   CONFIGURATION & DATA
===================================== */

const modeData = {
  regular: { label: 'Regular', icon: '📋' },
  sudden: { label: 'Sudden Death', icon: '💀' },
  countdown: { label: 'Countdown Mode', icon: '⏳' },
};

const difficultyMeta = {
  easy: { label: 'Easy', color: '#22c55e' },
  medium: { label: 'Medium', color: '#eab308' },
  hard: { label: 'Hard', color: '#ef4444' },
};

let sentencesRepository = {
  easy: [
    'The cat sat on the mat.',
    'Dogs are the best pets ever.',
    'Birds fly high in the blue sky.',
    'I like to eat cake and pie.',
    'The sun is hot and bright today.',
    'She went to the store to buy milk.',
    'He runs fast in the morning.',
    'The red ball is in the yard.',
    'My dog likes to play fetch.',
    'We went to the park today.',
  ],
  medium: [
    'Every morning brings new opportunities to grow and learn.',
    'The ocean waves crash gently against the sandy shore.',
    'Music has the power to heal the human soul.',
    'Patience and persistence are keys to achieving success.',
    'Technology evolves faster than we can adapt to it.',
    'Coffee and books are the perfect combination for peace.',
    'Time is the most precious resource we possess.',
    'Dreams come true when we dare to chase them.',
    'Writing is thinking with the fingers on the keyboard.',
    'Kindness costs nothing but means everything to others.',
  ],
  hard: [
    'The quantum entanglement phenomenon challenges our fundamental understanding of physics.',
    'Entropy always increases in isolated thermodynamic systems over time.',
    'Cryptographic algorithms provide essential security for modern digital communications.',
    'Neuroplasticity demonstrates the remarkable adaptability of the human brain.',
    'Sophisticated algorithms optimize complex logistical supply chain operations.',
    'Philosophical epistemology examines the nature and limits of human knowledge.',
  ],
};

/* =====================================
   DOM ELEMENTS
===================================== */

const textDisplay = document.getElementById('textDisplay');
const userInput = document.getElementById('userInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const retryBtn = document.getElementById('retryBtn');
const shareBtn = document.getElementById('shareBtn');
const themeToggle = document.getElementById('themeToggle');
const soundToggle = document.getElementById('soundToggle');
const resultsDiv = document.getElementById('results');
const statsDiv = document.getElementById('stats');
const gameContent = document.getElementById('gameContent');
const difficultyBadge = document.getElementById('difficultyBadge');
const modeBadge = document.getElementById('modeBadge');
const selectorsPanel = document.getElementById('selectorsPanel');
const caret = document.getElementById('caret');
const focusOverlay = document.getElementById('focusOverlay');
const textWrapper = document.getElementById('textWrapper');
const analyticsGraph = document.getElementById('analyticsGraph');
const timerDisplay = document.getElementById('timerDisplay');
const timerSection = document.getElementById('timerSection');
const toastContainer = document.getElementById('toastContainer');
const streakCountEl = document.getElementById('streakCount');
const personalBestEl = document.getElementById('personalBest');

/* =====================================
   STATE
===================================== */

let testText = '';
let testStarted = false;
let testFinished = false;
let startTime = null;
let timerInterval = null;
let selectedDifficulty = 'medium';
let selectedMode = 'regular';
let wpmHistory = [];
let timelineSeconds = 0;
let totalErrorsEncountered = 0;
let countdownDuration = 30;
let soundEnabled = true;
let personalBestWpm = parseInt(localStorage.getItem('typingBestWpm')) || 0;
let streak = parseInt(localStorage.getItem('typingStreak')) || 0;
let lastTestDate = localStorage.getItem('typingLastDate') || '';

/* =====================================
   AUDIO ENGINE (Web Audio API)
===================================== */

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playKeySound() {
  if (!soundEnabled || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 600 + Math.random() * 200;
  osc.type = 'sine';
  gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.08);
}

function playErrorSound() {
  if (!soundEnabled || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 200;
  osc.type = 'square';
  gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.12);
}

function playCompleteSound() {
  if (!soundEnabled || !audioCtx) return;
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    const t = audioCtx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}

/* =====================================
   TOAST NOTIFICATIONS
===================================== */

function showToast(message, icon = 'ℹ') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* =====================================
   PARTICLE BACKGROUND
===================================== */

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const count = Math.min(60, Math.floor(window.innerWidth / 25));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isDark = document.documentElement.classList.contains('dark-mode');
  const color = isDark ? '150, 160, 200' : '100, 116, 139';

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
    ctx.fill();
  });

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}

resizeCanvas();
createParticles();
animateParticles();
window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
});

/* =====================================
   CONFETTI
===================================== */

function triggerConfetti() {
  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6'];
  const shapes = ['●', '■', '▲', '★', '◆'];

  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.top = `${-10 + Math.random() * 30}%`;
    piece.style.color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.fontSize = `${10 + Math.random() * 16}px`;
    piece.style.animationDuration = `${1.2 + Math.random() * 1}s`;
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2500);
  }
}

/* =====================================
   STREAK MANAGEMENT
===================================== */

function updateStreak() {
  const today = new Date().toDateString();
  if (lastTestDate === today) {
    // Already tested today
  } else if (lastTestDate === new Date(Date.now() - 86400000).toDateString()) {
    streak++;
  } else if (lastTestDate !== '') {
    streak = 1;
  } else {
    streak = 1;
  }
  lastTestDate = today;
  localStorage.setItem('typingStreak', streak);
  localStorage.setItem('typingLastDate', lastTestDate);
  streakCountEl.textContent = streak;
}

streakCountEl.textContent = streak;

/* =====================================
   LOAD SENTENCES
===================================== */

async function loadSentences() {
  try {
    const response = await fetch('sentences.json');
    if (response.ok) {
      sentencesRepository = await response.json();
    }
  } catch (e) {
    // Use fallback
  }
  updateBadges();
}

/* =====================================
   DIFFICULTY & MODE SELECTION
===================================== */

function selectDifficulty(level) {
  selectedDifficulty = level;
  document.querySelectorAll('[data-diff]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.diff === level);
  });
  updateBadges();
}

function selectMode(mode) {
  selectedMode = mode;
  document.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  updateBadges();
}

function updateBadges() {
  const meta = difficultyMeta[selectedDifficulty];
  difficultyBadge.textContent = meta.label;
  difficultyBadge.style.color = meta.color;
  difficultyBadge.style.borderColor = meta.color + '44';
  difficultyBadge.style.backgroundColor = meta.color + '15';

  const m = modeData[selectedMode];
  modeBadge.textContent = `${m.icon} ${m.label}`;
}

function getRandomSentence(difficulty) {
  const pool = sentencesRepository[difficulty] || sentencesRepository['medium'];
  return pool[Math.floor(Math.random() * pool.length)];
}

/* =====================================
   TEXT RENDERING
===================================== */

function parseTextIntoWords(text) {
  textDisplay.innerHTML = '';
  const words = text.split(' ');
  words.forEach((word, wIdx) => {
    const wordBox = document.createElement('div');
    wordBox.className = 'word-box';
    for (let i = 0; i < word.length; i++) {
      const span = document.createElement('span');
      span.textContent = word[i];
      wordBox.appendChild(span);
    }
    textDisplay.appendChild(wordBox);

    // Add space span between words
    if (wIdx < words.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.textContent = ' ';
      spaceSpan.className = 'space-char';
      textDisplay.appendChild(spaceSpan);
    }
  });
}

function getCharElements() {
  return [...textDisplay.querySelectorAll('span')];
}

/* =====================================
   INITIALIZE TEST
===================================== */

function initTest() {
  initAudio();

  const sentence = getRandomSentence(selectedDifficulty);
  testText = sentence;
  testStarted = false;
  testFinished = false;
  startTime = null;
  wpmHistory = [];
  timelineSeconds = 0;
  totalErrorsEncountered = 0;

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;

  userInput.value = '';
  userInput.disabled = false;

  resultsDiv.style.display = 'none';
  gameContent.classList.remove('hidden');
  selectorsPanel.classList.add('hidden');
  statsDiv.classList.remove('hidden');
  focusOverlay.classList.remove('active');

  gameContent.querySelector('.test-area') ?
    document.querySelector('.test-area').classList.add('active') : null;

  document.getElementById('wpmDisplay').textContent = '0';
  document.getElementById('accuracyDisplay').textContent = '100%';
  document.getElementById('errorDisplay').textContent = '0';
  timerDisplay.textContent = selectedMode === 'countdown' ? countdownDuration + 's' : '0s';
  timerSection.classList.remove('urgent');

  parseTextIntoWords(testText);
  caret.classList.add('blinking');
  updateCaretPosition();

  userInput.focus();

  showToast('Test ready! Start typing...', '⌨');
}

/* =====================================
   TIMER
===================================== */

function startTimer() {
  timerInterval = setInterval(() => {
    if (!testStarted || testFinished) return;

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timelineSeconds = elapsed;

    let displayTime = elapsed;

    if (selectedMode === 'countdown') {
      displayTime = countdownDuration - elapsed;
      if (displayTime <= 5 && displayTime > 0) {
        timerSection.classList.add('urgent');
      }
      if (displayTime <= 0) {
        timerDisplay.textContent = '0s';
        finishTest();
        return;
      }
    }

    timerDisplay.textContent = displayTime + 's';

    // Record WPM every 2 seconds
    if (elapsed > 0 && elapsed % 2 === 0) {
      const currentWpm = calculateLiveWpm();
      wpmHistory.push({ second: elapsed, wpm: currentWpm });
    }
  }, 1000);
}

/* =====================================
   INPUT HANDLING
===================================== */

function updateDisplay() {
  const spans = getCharElements();
  const inputValue = userInput.value;
  let hasNewError = false;

  spans.forEach((span, index) => {
    if (index < inputValue.length) {
      if (inputValue[index] === span.textContent) {
        span.className = 'correct';
      } else {
        if (!span.classList.contains('wrong')) {
          hasNewError = true;
          totalErrorsEncountered++;
        }
        span.className = 'wrong';
      }
    } else {
      span.className = '';
    }
  });

  if (hasNewError) {
    playErrorSound();

    // Sudden death mode
    if (selectedMode === 'sudden') {
      finishTest();
      showToast('Wrong character! Game over.', '💀');
      return;
    }
  } else if (inputValue.length > 0) {
    playKeySound();
  }

  updateCaretPosition();

  const currentWpm = calculateLiveWpm();
  updateLiveStatsDisplay(currentWpm);

  // Check if test is complete
  if (inputValue.length >= testText.length && !testFinished) {
    finishTest();
  }
}

/* =====================================
   CARET POSITION
===================================== */

function updateCaretPosition() {
  const spans = getCharElements();
  const index = userInput.value.length;
  const wrapperRect = textWrapper.getBoundingClientRect();

  if (index < spans.length) {
    const targetSpan = spans[index];
    const spanRect = targetSpan.getBoundingClientRect();
    caret.style.left = `${spanRect.left - wrapperRect.left}px`;
    caret.style.top = `${spanRect.top - wrapperRect.top}px`;
    caret.style.height = `${spanRect.height}px`;
  } else if (spans.length > 0) {
    const lastSpan = spans[spans.length - 1];
    const spanRect = lastSpan.getBoundingClientRect();
    caret.style.left = `${spanRect.right - wrapperRect.left}px`;
    caret.style.top = `${spanRect.top - wrapperRect.top}px`;
    caret.style.height = `${spanRect.height}px`;
  }
}

/* =====================================
   LIVE CALCULATIONS
===================================== */

function calculateLiveWpm() {
  const inputLength = userInput.value.length;
  const timeElapsedMinutes = (Date.now() - startTime) / 1000 / 60;
  return Math.round(inputLength / 5 / (timeElapsedMinutes || 1 / 60));
}

function updateLiveStatsDisplay(currentWpm) {
  const spans = getCharElements();
  const inputLength = userInput.value.length;
  let correctCount = 0;
  let wrongCount = 0;

  spans.forEach((span, idx) => {
    if (idx < inputLength) {
      if (span.classList.contains('correct')) correctCount++;
      else if (span.classList.contains('wrong')) wrongCount++;
    }
  });

  const accuracy = inputLength > 0 ? Math.round((correctCount / inputLength) * 100) : 100;

  document.getElementById('wpmDisplay').textContent = currentWpm;
  document.getElementById('accuracyDisplay').textContent = accuracy + '%';
  document.getElementById('errorDisplay').textContent = wrongCount;
}

/* =====================================
   FINISH TEST
===================================== */

function finishTest() {
  if (testFinished) return;
  testFinished = true;
  testStarted = false;

  clearInterval(timerInterval);
  timerInterval = null;

  userInput.disabled = true;
  caret.classList.add('blinking');
  focusOverlay.classList.remove('active');

  document.querySelector('.test-area').classList.remove('active');

  const timeElapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
  const finalWpm = calculateLiveWpm();

  const spans = getCharElements();
  const inputLength = userInput.value.length;
  let correctCount = 0;

  spans.forEach((span, idx) => {
    if (idx < inputLength && span.classList.contains('correct')) correctCount++;
  });

  const finalAccuracy = inputLength > 0 ? Math.round((correctCount / inputLength) * 100) : 0;

  // Set result values
  document.getElementById('finalWpm').textContent = finalWpm;
  document.getElementById('finalAccuracy').textContent = finalAccuracy + '%';
  document.getElementById('finalTime').textContent = timeElapsedSeconds + 's';
  document.getElementById('finalErrors').textContent = totalErrorsEncountered;

  // Results subtitle based on performance
  const subtitle = document.getElementById('resultsSubtitle');
  const trophy = document.getElementById('resultsTrophy');
  if (finalWpm >= 80) {
    subtitle.textContent = 'Incredible speed! You\'re a typing master! 🔥';
    trophy.textContent = '🏆';
  } else if (finalWpm >= 60) {
    subtitle.textContent = 'Great job! You\'re above average!';
    trophy.textContent = '🥇';
  } else if (finalWpm >= 40) {
    subtitle.textContent = 'Good effort! Keep practicing to improve.';
    trophy.textContent = '🥈';
  } else {
    subtitle.textContent = 'Keep going! Practice makes perfect.';
    trophy.textContent = '💪';
  }

  // Show/hide personal best
  if (finalWpm > personalBestWpm && finalAccuracy >= 80) {
    personalBestWpm = finalWpm;
    localStorage.setItem('typingBestWpm', personalBestWpm);
    personalBestEl.style.display = 'flex';
  } else {
    personalBestEl.style.display = 'none';
  }

  // Update streak
  updateStreak();

  // Show results
  gameContent.classList.add('hidden');
  resultsDiv.style.display = 'block';

  if (wpmHistory.length === 0) {
    wpmHistory.push({ second: timeElapsedSeconds, wpm: finalWpm });
  }

  // Animate rings
  setTimeout(() => {
    animateRing('wpmRingFill', Math.min(finalWpm / 120, 1));
    animateRing('accuracyRingFill', finalAccuracy / 100);
  }, 300);

  renderPerformanceGraph();

  // Effects
  playCompleteSound();
  if (finalWpm >= 50 && finalAccuracy >= 85) {
    triggerConfetti();
  }
}

/* =====================================
   ANIMATED RINGS
===================================== */

function animateRing(elementId, percentage) {
  const circumference = 2 * Math.PI * 42; // r=42
  const offset = circumference * (1 - percentage);
  const el = document.getElementById(elementId);
  if (el) {
    el.style.strokeDasharray = circumference;
    el.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.strokeDashoffset = offset;
      });
    });
  }
}

/* =====================================
   PERFORMANCE GRAPH
===================================== */

function renderPerformanceGraph() {
  analyticsGraph.innerHTML = '';

  const width = analyticsGraph.clientWidth || 600;
  const height = analyticsGraph.clientHeight || 200;
  const padding = 45;

  if (wpmHistory.length === 0) return;

  const maxSec = Math.max(...wpmHistory.map((d) => d.second), 1);
  const maxWpm = Math.max(...wpmHistory.map((d) => d.wpm), 40);

  const mapX = (sec) => padding + (sec / maxSec) * (width - 2 * padding);
  const mapY = (wpm) => height - padding - (wpm / maxWpm) * (height - 2 * padding);

  // Create gradient definition
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'graphGradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '0%');
  gradient.setAttribute('y2', '100%');

  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('style', 'stop-color: var(--accent); stop-opacity: 0.3');
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('style', 'stop-color: var(--accent); stop-opacity: 0.02');
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  analyticsGraph.appendChild(defs);

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = padding + (i / 4) * (height - 2 * padding);
    const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    gridLine.setAttribute('x1', padding);
    gridLine.setAttribute('y1', y);
    gridLine.setAttribute('x2', width - padding);
    gridLine.setAttribute('y2', y);
    gridLine.setAttribute('class', 'graph-grid');
    analyticsGraph.appendChild(gridLine);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', padding - 8);
    label.setAttribute('y', y + 4);
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('class', 'graph-text');
    label.textContent = Math.round(maxWpm * (1 - i / 4));
    analyticsGraph.appendChild(label);
  }

  // Axes
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', padding);
  xAxis.setAttribute('y1', height - padding);
  xAxis.setAttribute('x2', width - padding);
  xAxis.setAttribute('y2', height - padding);
  xAxis.setAttribute('class', 'graph-axis');
  analyticsGraph.appendChild(xAxis);

  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', padding);
  yAxis.setAttribute('y1', padding);
  yAxis.setAttribute('x2', padding);
  yAxis.setAttribute('y2', height - padding);
  yAxis.setAttribute('class', 'graph-axis');
  analyticsGraph.appendChild(yAxis);

  // Labels
  const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xLabel.setAttribute('x', width / 2);
  xLabel.setAttribute('y', height - 6);
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('class', 'graph-text');
  xLabel.textContent = 'Time (seconds)';
  analyticsGraph.appendChild(xLabel);

  // Area fill
  let areaPath = `M ${mapX(wpmHistory[0].second)} ${height - padding}`;
  wpmHistory.forEach((pt) => {
    areaPath += ` L ${mapX(pt.second)} ${mapY(pt.wpm)}`;
  });
  areaPath += ` L ${mapX(wpmHistory[wpmHistory.length - 1].second)} ${height - padding} Z`;

  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('d', areaPath);
  area.setAttribute('class', 'graph-area');
  analyticsGraph.appendChild(area);

  // Line
  let linePath = '';
  wpmHistory.forEach((pt, idx) => {
    const x = mapX(pt.second);
    const y = mapY(pt.wpm);
    linePath += `${idx === 0 ? 'M' : 'L'} ${x} ${y} `;
  });

  if (linePath) {
    const graphLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    graphLine.setAttribute('d', linePath.trim());
    graphLine.setAttribute('class', 'graph-line');
    analyticsGraph.appendChild(graphLine);
  }

  // Data points
  wpmHistory.forEach((pt) => {
    const x = mapX(pt.second);
    const y = mapY(pt.wpm);

    // Outer glow
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glow.setAttribute('cx', x);
    glow.setAttribute('cy', y);
    glow.setAttribute('r', '8');
    glow.setAttribute('fill', 'var(--accent)');
    glow.setAttribute('opacity', '0.15');
    analyticsGraph.appendChild(glow);

    // Point
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '4');
    circle.setAttribute('fill', 'var(--accent)');
    circle.setAttribute('stroke', 'var(--bg-card)');
    circle.setAttribute('stroke-width', '2');
    analyticsGraph.appendChild(circle);
  });
}

/* =====================================
   EVENT LISTENERS
===================================== */

// Input
userInput.addEventListener('input', () => {
  if (testFinished) return;

  // Start test on first input
  if (!testStarted && userInput.value.length > 0) {
    testStarted = true;
    startTime = Date.now();
    caret.classList.remove('blinking');
    startTimer();
  }

  if (!testStarted) return;
  updateDisplay();
});

// Start button
startBtn.addEventListener('click', initTest);

// Reset button
resetBtn.addEventListener('click', () => {
  testStarted = false;
  testFinished = false;
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
  userInput.value = '';
  userInput.disabled = false;
  resultsDiv.style.display = 'none';
  gameContent.classList.remove('hidden');
  statsDiv.classList.add('hidden');
  selectorsPanel.classList.remove('hidden');
  focusOverlay.classList.remove('active');
  caret.classList.add('blinking');
  caret.style.left = '0px';
  caret.style.top = '0px';
  timerDisplay.textContent = '0s';
  timerSection.classList.remove('urgent');
  document.querySelector('.test-area').classList.remove('active');
  textDisplay.innerHTML = '<span class="placeholder-text">Select your settings and press <strong>Start Test</strong> to begin...</span>';
});

// Retry button
retryBtn.addEventListener('click', initTest);

// Share button
shareBtn.addEventListener('click', () => {
  const wpm = document.getElementById('finalWpm').textContent;
  const accuracy = document.getElementById('finalAccuracy').textContent;
  const text = `⌨️ Typing Test Result\n🚀 ${wpm} WPM | 🎯 ${accuracy} Accuracy\n\nTest your speed too!`;

  if (navigator.share) {
    navigator.share({ title: 'Typing Test Result', text });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    showToast('Result copied to clipboard!', '📋');
  }
});

// Sound toggle
soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggle.classList.toggle('muted', !soundEnabled);
  showToast(soundEnabled ? 'Sound enabled' : 'Sound muted', soundEnabled ? '🔊' : '🔇');
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark-mode');
  const isDark = document.documentElement.classList.contains('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  setTimeout(() => {
    if (resultsDiv.style.display === 'block') renderPerformanceGraph();
  }, 50);
});

// Difficulty & mode buttons
document.querySelectorAll('[data-diff]').forEach((btn) => {
  btn.addEventListener('click', () => selectDifficulty(btn.dataset.diff));
});

document.querySelectorAll('[data-mode]').forEach((btn) => {
  btn.addEventListener('click', () => selectMode(btn.dataset.mode));
});

// Focus management
document.addEventListener('keydown', (e) => {
  if (testStarted && !testFinished) {
    if (document.activeElement !== userInput) {
      userInput.focus();
    }
  }
});

userInput.addEventListener('blur', () => {
  if (testStarted && !testFinished) {
    focusOverlay.classList.add('active');
  }
});

focusOverlay.addEventListener('click', () => {
  focusOverlay.classList.remove('active');
  userInput.focus();
  updateCaretPosition();
});

// Window resize
window.addEventListener('resize', () => {
  if (testStarted && !testFinished) updateCaretPosition();
  if (resultsDiv.style.display === 'block') renderPerformanceGraph();
});

/* =====================================
   KEYBOARD SHORTCUTS
===================================== */

document.addEventListener('keydown', (e) => {
  // Tab to retry
  if (e.key === 'Tab') {
    e.preventDefault();
    if (resultsDiv.style.display === 'block' || testFinished) {
      initTest();
    } else if (!testStarted) {
      initTest();
    }
  }

  // Escape to reset
  if (e.key === 'Escape') {
    resetBtn.click();
  }
});

/* =====================================
   THEME INIT
===================================== */

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark-mode');
} else if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark-mode');
}

/* =====================================
   INITIALIZE
===================================== */

selectDifficulty('medium');
selectMode('regular');
loadSentences();

textDisplay.innerHTML = '<span class="placeholder-text">Select your settings and press <strong>Start Test</strong> to begin...</span>';
