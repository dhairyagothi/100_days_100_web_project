/* ================================================================
   TYPING BATTLE ARENA — script.js
   Vanilla JS | No frameworks | Works with uploaded HTML + CSS
   ================================================================ */

'use strict';

// ================================================================
// CONSTANTS
// ================================================================

const RANKS = [
  { name: '🥉 BRONZE TYPIST',   xpRequired: 0    },
  { name: '🥈 SILVER TYPIST',   xpRequired: 500  },
  { name: '🥇 GOLD TYPIST',     xpRequired: 1200 },
  { name: '💎 PLATINUM TYPIST', xpRequired: 2500 },
  { name: '💠 DIAMOND TYPIST',  xpRequired: 4500 },
  { name: '👑 MASTER TYPIST',   xpRequired: 7500 },
];

const RANK_XP_THRESHOLDS = RANKS.map(r => r.xpRequired);

const MODE_TIMES = {
  sprint:   30,
  ranked:   60,
  survival: null,  // lives-based
  zen:      null,  // no timer
};

const CIRCUMFERENCE = 213.6; // 2 * PI * 34 (ring radius)

const PARAGRAPHS = [
  // Coding themed
  "The function returned undefined because the variable was declared but never assigned a value inside the loop.",
  "Debugging is twice as hard as writing the code in the first place, so if you write code as cleverly as possible you are not smart enough to debug it.",
  "A good programmer looks both ways before crossing a one-way street and always writes unit tests before shipping to production.",
  "Arrays start at zero and life starts at one, but programmers live somewhere in between those two realities every single day.",
  "Recursion is just a function calling itself until a base case is reached, at which point the call stack unwinds gracefully.",
  "Version control saves lives. Commit often, push frequently, and never force-push to the main branch on a Friday afternoon.",
  "Clean code reads like well-written prose. Every variable name tells a story and every function does exactly one thing.",
  "The semicolon is optional in JavaScript but your sanity is not. Pick a linter, configure it once, and never argue again.",
  // Gaming themed
  "The final boss appeared just as the last health potion shattered on the dungeon floor, its glow fading into cold stone.",
  "Every respawn is a second chance. Every defeat is a lesson. Every victory is earned by the calluses on your fingertips.",
  "The leaderboard refreshes every midnight. Six players share the top spot. Only one of them has not slept in three days.",
  "Speed matters. Accuracy matters more. But composure under pressure is the rarest stat of all in any competitive arena.",
  "Your character's inventory was full, so you dropped the legendary sword to pick up a health kit you never ended up using.",
  "The combo counter flashed gold as the streak hit fifty. The crowd in the background fell completely and utterly silent.",
  "Ranked mode separates the casual players from those who have spent entire weekends practicing the same thirty second drill.",
  // Motivational themed
  "Discipline is choosing between what you want now and what you want most. Champions choose the long game every single time.",
  "Every expert was once a beginner who refused to quit when the skill gap felt impossibly wide and the progress felt invisible.",
  "The keyboard is your instrument. Every keystroke is a note. Master the fundamentals and the music will take care of itself.",
  "Progress is not always visible in the moment. Keep showing up, keep practicing, and trust the process to compound over time.",
  "Speed comes from accuracy. Accuracy comes from focus. Focus comes from caring enough to slow down before you speed up.",
  "You are not competing against others on this leaderboard. You are competing against the version of yourself from yesterday.",
  "Consistency beats intensity every time. Thirty minutes of deliberate practice daily will outperform a single all-nighter.",
  "The mind gives up long before the fingers do. Push through the discomfort and discover what you are truly capable of today.",
];

const DIFFICULTY_WORDS = {
  easy:   PARAGRAPHS.filter((_, i) => i < 8),
  medium: PARAGRAPHS,
  hard:   PARAGRAPHS.filter(p => p.length > 180),
};

// ================================================================
// STATE
// ================================================================

let state = {
  // Game
  mode:          'sprint',
  username:      'Player',
  running:       false,
  finished:      false,

  // Typing
  paragraph:     '',
  charIndex:     0,
  totalTyped:    0,
  correctTyped:  0,
  mistakes:      0,

  // Timer
  timeTotal:     30,
  timeLeft:      30,
  startTime:     null,
  timerInterval: null,

  // Combo
  streak:        0,
  maxStreak:     0,

  // Survival
  lives:         5,

  // Stats
  wpm:           0,
  accuracy:      100,

  // Settings
  settings: {
    difficulty:      'medium',
    fontSize:        20,
    sound:           true,
    typingFeedback:  true,
    showCursor:      true,
  },

  // XP / Rank
  totalXP:       0,

  // Leaderboard sort
  lbSort:        'wpm',
};

// ================================================================
// HELPERS
// ================================================================

/** Safe element getter — returns null without throwing */
function el(id) {
  return document.getElementById(id);
}

/** Show toast notification */
function showToast(msg, duration = 2500) {
  const toast = el('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), duration);
}

/** Pick a random paragraph based on difficulty */
function randomParagraph() {
  const pool = DIFFICULTY_WORDS[state.settings.difficulty] || PARAGRAPHS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Get rank object for given totalXP */
function getRankForXP(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.xpRequired) rank = r;
  }
  return rank;
}

/** Get next rank threshold above current XP */
function getNextRankXP(xp) {
  for (const r of RANKS) {
    if (xp < r.xpRequired) return r.xpRequired;
  }
  return RANKS[RANKS.length - 1].xpRequired + 1000; // already max
}

/** Format seconds nicely */
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/** Calculate elapsed seconds since start */
function elapsedSecs() {
  if (!state.startTime) return 0;
  return (Date.now() - state.startTime) / 1000;
}

/** Calculate WPM */
function calcWPM() {
  const mins = elapsedSecs() / 60;
  if (mins <= 0) return 0;
  return Math.round((state.correctTyped / 5) / mins);
}

/** Calculate Accuracy */
function calcAccuracy() {
  if (state.totalTyped === 0) return 100;
  return Math.max(0, Math.round((state.correctTyped / state.totalTyped) * 100));
}

/** Calculate XP earned this round */
function calcXP(wpm, accuracy, streak) {
  const speedBonus    = Math.round(wpm * 1.5);
  const streakBonus   = Math.round(streak * 2);
  const accuracyBonus = accuracy >= 95 ? 50 : accuracy >= 80 ? 20 : 0;
  return speedBonus + streakBonus + accuracyBonus;
}

/** Motivational result message */
function resultMessage(wpm) {
  if (wpm >= 100) return '👑 Keyboard Beast. Legendary speed!';
  if (wpm >= 70)  return '🔥 Blazing fast! You\'re unstoppable!';
  if (wpm >= 50)  return '⚡ Fast Fingers! Keep pushing!';
  if (wpm >= 30)  return '💪 Solid effort, warrior!';
  return '🎮 Beginner warrior. Train harder!';
}

/** Result icon based on WPM */
function resultIcon(wpm) {
  if (wpm >= 100) return '👑';
  if (wpm >= 70)  return '🏆';
  if (wpm >= 50)  return '⚡';
  return '🎯';
}

// ================================================================
// PERSISTENCE
// ================================================================

function loadPersisted() {
  try {
    const saved = localStorage.getItem('typingArenaState');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.totalXP  = parsed.totalXP  || 0;
      state.username = parsed.username || 'Player';
    }
  } catch (e) { /* ignore */ }

  try {
    const savedSettings = localStorage.getItem('typingArenaSettings');
    if (savedSettings) {
      state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
    }
  } catch (e) { /* ignore */ }
}

function persistState() {
  try {
    localStorage.setItem('typingArenaState', JSON.stringify({
      totalXP:  state.totalXP,
      username: state.username,
    }));
  } catch (e) { /* ignore */ }
}

function persistSettings() {
  try {
    localStorage.setItem('typingArenaSettings', JSON.stringify(state.settings));
  } catch (e) { /* ignore */ }
}

// ================================================================
// LEADERBOARD
// ================================================================

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem('typingArenaLeaderboard') || '[]');
  } catch (e) { return []; }
}

function saveLeaderboard(lb) {
  try {
    localStorage.setItem('typingArenaLeaderboard', JSON.stringify(lb));
  } catch (e) { /* ignore */ }
}

function addLeaderboardEntry(entry) {
  const lb = loadLeaderboard();
  lb.push(entry);
  saveLeaderboard(lb);
}

function renderLeaderboard() {
  const table = el('leaderboardTable');
  if (!table) return;

  let lb = loadLeaderboard();

  if (lb.length === 0) {
    table.innerHTML = '<div class="lb-empty">NO RECORDS YET — PLAY TO ENTER THE BOARD</div>';
    return;
  }

  // Sort
  if (state.lbSort === 'wpm') {
    lb.sort((a, b) => b.wpm - a.wpm);
  } else if (state.lbSort === 'accuracy') {
    lb.sort((a, b) => b.accuracy - a.accuracy);
  } else if (state.lbSort === 'streak') {
    lb.sort((a, b) => b.streak - a.streak);
  }

  table.innerHTML = lb.map((entry, i) => {
    const medals = ['🥇', '🥈', '🥉'];
    const rankStr = medals[i] || `#${i + 1}`;
    return `
      <div class="lb-row" role="listitem">
        <span class="lb-rank">${rankStr}</span>
        <span class="lb-name">${escapeHTML(entry.username)}</span>
        <span class="lb-wpm">${entry.wpm} WPM</span>
        <span class="lb-acc">${entry.accuracy}%</span>
        <span class="lb-streak">x${entry.streak}</span>
      </div>
    `;
  }).join('');
}

function escapeHTML(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(str)));
  return d.innerHTML;
}

// ================================================================
// XP / RANK UI
// ================================================================

function updateRankUI() {
  const xp         = state.totalXP;
  const rank        = getRankForXP(xp);
  const nextXP      = getNextRankXP(xp);
  const prevXP      = rank.xpRequired;
  const rangeXP     = nextXP - prevXP;
  const progressXP  = xp - prevXP;
  const pct         = Math.min(100, Math.round((progressXP / rangeXP) * 100));

  const badge = el('currentRankBadge');
  const bar   = el('xpBar');
  const label = el('xpLabel');

  if (badge) badge.textContent = rank.name;
  if (bar)   bar.style.width   = pct + '%';
  if (label) label.textContent = `${xp} / ${nextXP} XP`;
}

// ================================================================
// BACKGROUND CANVAS ANIMATION
// ================================================================

function initCanvas() {
  const canvas = el('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function spawnParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((W * H) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.5 + 0.5,
        a:  Math.random(),
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.a * 0.6})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    }
    requestAnimationFrame(draw);
  }

  resize();
  spawnParticles();
  draw();
  window.addEventListener('resize', () => { resize(); spawnParticles(); });
}

// ================================================================
// TYPING ENGINE — RENDER PARAGRAPH
// ================================================================

function renderParagraph() {
  const display = el('wordsDisplay');
  if (!display) return;
  display.innerHTML = '';

  for (let i = 0; i < state.paragraph.length; i++) {
    const span = document.createElement('span');
    span.classList.add('char');
    span.textContent = state.paragraph[i];
    if (i === 0) span.classList.add('current');
    display.appendChild(span);
  }
}

function getCharSpans() {
  const display = el('wordsDisplay');
  if (!display) return [];
  return Array.from(display.querySelectorAll('.char'));
}

/** Update character highlighting */
function updateCharDisplay(inputVal) {
  const spans = getCharSpans();
  const len   = Math.min(inputVal.length, spans.length);

  for (let i = 0; i < spans.length; i++) {
    spans[i].classList.remove('correct', 'wrong', 'current');

    if (i < len) {
      if (inputVal[i] === state.paragraph[i]) {
        spans[i].classList.add('correct');
      } else {
        spans[i].classList.add('wrong');
      }
    } else if (i === len) {
      spans[i].classList.add('current');

      // Scroll current char into view if needed
      spans[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }
}

// ================================================================
// TIMER
// ================================================================

function startTimer() {
  clearInterval(state.timerInterval);
  updateTimerUI(state.timeLeft, state.timeTotal);

  if (state.mode === 'zen' || state.mode === 'survival') {
    // No countdown timer; show elapsed for zen
    if (state.mode === 'zen') {
      const timerValEl = el('timerVal');
      if (timerValEl) timerValEl.textContent = '∞';
      const ring = el('timerRingFg');
      if (ring) ring.style.strokeDashoffset = 0;
    }
    return;
  }

  state.timerInterval = setInterval(() => {
    state.timeLeft = Math.max(0, state.timeLeft - 1);
    updateTimerUI(state.timeLeft, state.timeTotal);

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      endGame();
    }
  }, 1000);
}

function updateTimerUI(timeLeft, timeTotal) {
  const timerValEl = el('timerVal');
  const ring       = el('timerRingFg');

  if (timerValEl) timerValEl.textContent = timeLeft;

  if (ring && timeTotal > 0) {
    const pct    = timeLeft / timeTotal;
    const offset = CIRCUMFERENCE * (1 - pct);
    ring.style.strokeDashoffset = offset;

    // Color shift as time runs low
    if (pct < 0.25) {
      ring.style.stroke = '#f87171';
    } else if (pct < 0.5) {
      ring.style.stroke = '#fbbf24';
    } else {
      ring.style.stroke = '';
    }
  }
}

function stopTimer() {
  clearInterval(state.timerInterval);
}

// ================================================================
// SURVIVAL LIVES
// ================================================================

function renderHearts() {
  const heartsEl = el('healthHearts');
  if (!heartsEl) return;
  const hearts = heartsEl.querySelectorAll('.heart');
  hearts.forEach((h, i) => {
    h.classList.toggle('lost', i >= state.lives);
  });
}

function loseLife() {
  state.lives = Math.max(0, state.lives - 1);
  renderHearts();
  if (state.lives <= 0) {
    endGame();
  }
}

// ================================================================
// STATS UPDATE
// ================================================================

function updateHUD() {
  state.wpm      = calcWPM();
  state.accuracy = calcAccuracy();

  const wpmValEl      = el('wpmVal');
  const accValEl      = el('accVal');
  const streakValEl   = el('streakVal');
  const mistakesValEl = el('mistakesVal');
  const charsValEl    = el('charsVal');
  const maxStreakEl   = el('maxStreakVal');
  const comboTextEl   = el('comboText');
  const comboDsp      = el('comboDisplay');

  if (wpmValEl)      wpmValEl.textContent      = state.wpm;
  if (accValEl)      accValEl.textContent       = state.accuracy;
  if (streakValEl)   streakValEl.textContent    = state.streak;
  if (mistakesValEl) mistakesValEl.textContent  = state.mistakes;
  if (charsValEl)    charsValEl.textContent     = state.totalTyped;
  if (maxStreakEl)   maxStreakEl.textContent     = state.maxStreak;

  // Combo
  if (comboTextEl)   comboTextEl.textContent    = `🔥 COMBO x${state.streak}`;
  if (comboDsp) {
    comboDsp.classList.toggle('hot', state.streak > 10);
  }
}

function updateProgress() {
  const pct = Math.round((state.charIndex / state.paragraph.length) * 100);
  const bar = el('progressBar');
  const lbl = el('progressLabel');
  if (bar) bar.style.width     = pct + '%';
  if (lbl) lbl.textContent     = pct + '%';
}

// ================================================================
// INPUT INDICATOR
// ================================================================

function setInputIndicator(type) {
  const ind = el('inputIndicator');
  if (!ind) return;
  ind.classList.remove('correct-ind', 'wrong-ind');
  if (type === 'correct') ind.classList.add('correct-ind');
  if (type === 'wrong')   ind.classList.add('wrong-ind');
}

// ================================================================
// APPLY SETTINGS TO DOM
// ================================================================

function applySettings() {
  // Font size
  document.documentElement.style.setProperty('--typing-size', state.settings.fontSize + 'px');

  // Settings UI sync
  const diffSel     = el('difficultySelect');
  const fontRange   = el('fontSizeRange');
  const fontSizeVal = el('fontSizeVal');
  const soundTgl    = el('soundToggle');
  const feedbackTgl = el('typingFeedbackToggle');
  const cursorTgl   = el('cursorToggle');

  if (diffSel)     diffSel.value       = state.settings.difficulty;
  if (fontRange)   fontRange.value     = state.settings.fontSize;
  if (fontSizeVal) fontSizeVal.textContent = state.settings.fontSize + 'px';

  function syncToggle(btn, val) {
    if (!btn) return;
    btn.textContent = val ? 'ON' : 'OFF';
    btn.classList.toggle('active', !!val);
    btn.setAttribute('aria-checked', String(!!val));
  }

  syncToggle(soundTgl,    state.settings.sound);
  syncToggle(feedbackTgl, state.settings.typingFeedback);
  syncToggle(cursorTgl,   state.settings.showCursor);
}

// ================================================================
// SOUND (Web Audio — simple beeps)
// ================================================================

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  return audioCtx;
}

function playBeep(freq = 880, dur = 0.06, type = 'sine', vol = 0.08) {
  if (!state.settings.sound) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type      = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch (e) {}
}

function playCorrect()  { playBeep(880, 0.06, 'sine',   0.06); }
function playWrong()    { playBeep(220, 0.08, 'square', 0.07); }
function playWordDone() { playBeep(1200, 0.12, 'sine',  0.08); }

// ================================================================
// GAME SETUP
// ================================================================

function setupArenaForMode() {
  const hudTimer      = el('hudTimer');
  const healthBarWrap = el('healthBarWrap');

  if (state.mode === 'survival') {
    if (hudTimer)      hudTimer.style.display      = 'none';
    if (healthBarWrap) healthBarWrap.style.display  = '';
    state.lives = 5;
    renderHearts();
  } else {
    if (hudTimer)      hudTimer.style.display      = '';
    if (healthBarWrap) healthBarWrap.style.display  = 'none';
  }

  // Timer total
  if (state.mode === 'sprint')  { state.timeTotal = 30; state.timeLeft = 30; }
  if (state.mode === 'ranked')  { state.timeTotal = 60; state.timeLeft = 60; }
  if (state.mode === 'zen')     { state.timeTotal = 1;  state.timeLeft = 1;  }
  if (state.mode === 'survival'){ state.timeTotal = 1;  state.timeLeft = 1;  }

  // Reset ring
  const ring = el('timerRingFg');
  if (ring) {
    ring.style.strokeDashoffset = 0;
    ring.style.stroke = '';
  }
  const timerValEl = el('timerVal');
  if (timerValEl) {
    if (state.mode === 'zen' || state.mode === 'survival') {
      timerValEl.textContent = state.mode === 'zen' ? '∞' : '♥';
    } else {
      timerValEl.textContent = state.timeLeft;
    }
  }
}

function resetGameState() {
  state.charIndex    = 0;
  state.totalTyped   = 0;
  state.correctTyped = 0;
  state.mistakes     = 0;
  state.streak       = 0;
  state.maxStreak    = 0;
  state.running      = false;
  state.finished     = false;
  state.startTime    = null;
  state.wpm          = 0;
  state.accuracy     = 100;
}

// ================================================================
// COUNTDOWN → START
// ================================================================

function startCountdown(callback) {
  const overlay = el('countdownOverlay');
  const numEl   = el('countdownNum');
  if (!overlay || !numEl) { callback(); return; }

  let count = 3;
  overlay.classList.add('active');
  numEl.textContent = count;

  const interval = setInterval(() => {
    count--;
    // Force re-trigger animation
    numEl.style.animation = 'none';
    void numEl.offsetWidth; // reflow
    numEl.style.animation = '';

    if (count > 0) {
      numEl.textContent = count;
    } else {
      clearInterval(interval);
      overlay.classList.remove('active');
      callback();
    }
  }, 900);
}

// ================================================================
// ENTER BATTLE
// ================================================================

function enterBattle() {
  const usernameInput = el('usernameInput');
  state.username = (usernameInput && usernameInput.value.trim()) || 'Player';
  persistState();

  // Pick paragraph
  state.paragraph = randomParagraph();

  // Reset state
  resetGameState();
  setupArenaForMode();

  // Hide hero, show countdown
  const hero  = el('heroSection');
  const arena = el('arenaSection');
  const results = el('resultsSection');
  if (hero)    hero.style.display    = 'none';
  if (results) results.style.display = 'none';

  startCountdown(() => {
    if (arena) arena.style.display = '';

    // Render typing area
    renderParagraph();

    // Reset HUD
    updateHUD();
    updateProgress();
    setInputIndicator(null);

    // Enable + focus input
    const input = el('typingInput');
    if (input) {
      input.value    = '';
      input.disabled = false;
      input.focus();
    }

    state.running = true;
    state.startTime = Date.now();
    startTimer();
  });
}

// ================================================================
// CORE TYPING HANDLER
// ================================================================

function handleTypingInput(e) {
  if (!state.running || state.finished) return;

  const input = e.target;
  const val   = input.value;

  // First keystroke — mark start if not already (zen/survival have no timer start)
  if (!state.startTime) state.startTime = Date.now();

  const expected = state.paragraph;
  const curLen   = val.length;
  const prevLen  = state.charIndex; // how many chars processed so far

  // Determine what changed
  if (curLen > prevLen) {
    // New character typed
    const typedChar    = val[curLen - 1];
    const expectedChar = expected[curLen - 1];

    state.totalTyped++;

    if (typedChar === expectedChar) {
      state.correctTyped++;
      state.streak++;
      if (state.streak > state.maxStreak) state.maxStreak = state.streak;
      setInputIndicator('correct');
      if (state.settings.typingFeedback) playCorrect();

      // Flash typing box on word completion (space)
      if (typedChar === ' ') {
        playWordDone();
        const box = document.querySelector('.typing-box');
        if (box) {
          box.classList.remove('flash-correct');
          void box.offsetWidth;
          box.classList.add('flash-correct');
        }
      }
    } else {
      state.mistakes++;
      state.streak = 0;
      setInputIndicator('wrong');

      if (state.settings.typingFeedback) {
        playWrong();
        // Shake input
        input.classList.remove('shake');
        void input.offsetWidth;
        input.classList.add('shake');
      }

      if (state.mode === 'survival') loseLife();
    }

    state.charIndex = curLen;
  } else if (curLen < prevLen) {
    // Backspace — just update visual
    state.charIndex = curLen;
    setInputIndicator(null);
  }

  // Update display
  updateCharDisplay(val);
  updateHUD();
  updateProgress();

  // Check completion
  if (curLen >= expected.length) {
    // Ensure all correct
    let allCorrect = true;
    for (let i = 0; i < expected.length; i++) {
      if (val[i] !== expected[i]) { allCorrect = false; break; }
    }
    if (allCorrect) {
      endGame();
    }
  }
}

// ================================================================
// END GAME
// ================================================================

function endGame() {
  if (state.finished) return;
  state.finished = true;
  state.running  = false;
  stopTimer();

  const input = el('typingInput');
  if (input) input.disabled = true;

  const elapsed = Math.round(elapsedSecs());
  const wpm     = calcWPM();
  const acc     = calcAccuracy();

  // Calculate XP earned
  const xpEarned = calcXP(wpm, acc, state.maxStreak);
  state.totalXP += xpEarned;
  persistState();
  updateRankUI();

  // Save to leaderboard
  addLeaderboardEntry({
    username: state.username,
    wpm:      wpm,
    accuracy: acc,
    streak:   state.maxStreak,
    mode:     state.mode,
    date:     Date.now(),
  });

  // Show results after short delay
  setTimeout(() => showResults(wpm, acc, elapsed, xpEarned), 400);
}

// ================================================================
// RESULTS SCREEN
// ================================================================

function showResults(wpm, acc, elapsed, xpEarned) {
  const arena   = el('arenaSection');
  const results = el('resultsSection');
  if (arena)   arena.style.display   = 'none';
  if (results) results.style.display = '';

  // Populate
  setText('resWpm',      wpm);
  setText('resAcc',      acc + '%');
  setText('resMistakes', state.mistakes);
  setText('resStreak',   state.maxStreak);
  setText('resChars',    state.totalTyped);
  setText('resTime',     formatTime(elapsed));
  setText('xpGainedVal', '+' + xpEarned + ' XP');
  setText('resultsMessage', resultMessage(wpm));

  const iconEl = el('resultsIcon');
  if (iconEl) iconEl.textContent = resultIcon(wpm);

  // Rank
  const rank = getRankForXP(state.totalXP);
  setText('rankResultVal', rank.name);

  // XP bar animation
  const nextXP  = getNextRankXP(state.totalXP);
  const prevXP  = getRankForXP(state.totalXP).xpRequired;
  const range   = nextXP - prevXP;
  const prog    = state.totalXP - prevXP;
  const pct     = Math.min(100, Math.round((prog / range) * 100));
  const xpBar   = el('xpGainedBar');
  if (xpBar) {
    xpBar.style.width = '0%';
    setTimeout(() => { xpBar.style.width = pct + '%'; }, 100);
  }
}

function setText(id, val) {
  const e = el(id);
  if (e) e.textContent = val;
}

// ================================================================
// RESTART
// ================================================================

function restartGame() {
  stopTimer();
  const input = el('typingInput');
  if (input) input.value = '';

  state.paragraph = randomParagraph();
  resetGameState();
  setupArenaForMode();

  renderParagraph();
  updateHUD();
  updateProgress();
  setInputIndicator(null);

  const arena   = el('arenaSection');
  const results = el('resultsSection');
  const hero    = el('heroSection');
  if (arena)   arena.style.display   = '';
  if (results) results.style.display = 'none';
  if (hero)    hero.style.display    = 'none';

  // Short countdown before restart
  startCountdown(() => {
    if (input) {
      input.disabled = false;
      input.value    = '';
      input.focus();
    }
    state.running   = true;
    state.startTime = Date.now();
    startTimer();
  });
}

function goToMainMenu() {
  stopTimer();
  resetGameState();

  const arena   = el('arenaSection');
  const results = el('resultsSection');
  const hero    = el('heroSection');
  if (arena)   arena.style.display   = 'none';
  if (results) results.style.display = 'none';
  if (hero)    hero.style.display    = '';

  const input = el('typingInput');
  if (input) { input.disabled = true; input.value = ''; }

  updateRankUI();
}

// ================================================================
// MODAL HELPERS
// ================================================================

function openModal(id) {
  const modal = el(id);
  if (modal) modal.style.display = '';
}

function closeModal(id) {
  const modal = el(id);
  if (modal) modal.style.display = 'none';
}

// ================================================================
// MUTE
// ================================================================

function toggleMute() {
  state.settings.sound = !state.settings.sound;
  const btn = el('muteBtn');
  if (btn) btn.textContent = state.settings.sound ? '🔊' : '🔇';
  persistSettings();
  applySettings();
  showToast(state.settings.sound ? 'Sound ON' : 'Sound OFF');
}

// ================================================================
// EVENT LISTENERS
// ================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Load persisted data ──
  loadPersisted();
  updateRankUI();
  applySettings();
  initCanvas();

  // Pre-fill username if stored
  const usernameInput = el('usernameInput');
  if (usernameInput && state.username !== 'Player') {
    usernameInput.value = state.username;
  }

  // ── Mode buttons ──
  const modeBtns = document.querySelectorAll('.mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      state.mode = btn.dataset.mode || 'sprint';
    });
  });

  // ── Start button ──
  const startBtn = el('startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // Resume audio context on user gesture
      const ctx = getAudioCtx();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      enterBattle();
    });
  }

  // ── Typing input ──
  const typingInput = el('typingInput');
  if (typingInput) {
    typingInput.addEventListener('input', handleTypingInput);

    // Prevent paste
    typingInput.addEventListener('paste', e => e.preventDefault());
  }

  // ── Restart button ──
  const restartBtn = el('restartBtn');
  if (restartBtn) restartBtn.addEventListener('click', restartGame);

  // ── Quit button ──
  const quitBtn = el('quitBtn');
  if (quitBtn) quitBtn.addEventListener('click', goToMainMenu);

  // ── Play again (results) ──
  const playAgainBtn = el('playAgainBtn');
  if (playAgainBtn) playAgainBtn.addEventListener('click', restartGame);

  // ── Main menu (results) ──
  const mainMenuBtn = el('mainMenuBtn');
  if (mainMenuBtn) mainMenuBtn.addEventListener('click', goToMainMenu);

  // ── Mute ──
  const muteBtn = el('muteBtn');
  if (muteBtn) muteBtn.addEventListener('click', toggleMute);
  if (muteBtn) muteBtn.textContent = state.settings.sound ? '🔊' : '🔇';

  // ── Leaderboard modal ──
  const lbNavBtn       = el('leaderboardNavBtn');
  const closeLb        = el('closeLeaderboard');
  if (lbNavBtn) {
    lbNavBtn.addEventListener('click', () => {
      renderLeaderboard();
      openModal('leaderboardModal');
    });
  }
  if (closeLb) closeLb.addEventListener('click', () => closeModal('leaderboardModal'));

  // LB sort filters
  document.querySelectorAll('.lb-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lb-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.lbSort = btn.dataset.sort || 'wpm';
      renderLeaderboard();
    });
  });

  // Clear leaderboard
  const clearLbBtn = el('clearLeaderboardBtn');
  if (clearLbBtn) {
    clearLbBtn.addEventListener('click', () => {
      saveLeaderboard([]);
      renderLeaderboard();
      showToast('Leaderboard cleared');
    });
  }

  // Close modal on overlay click
  const lbModal = el('leaderboardModal');
  if (lbModal) {
    lbModal.addEventListener('click', e => {
      if (e.target === lbModal) closeModal('leaderboardModal');
    });
  }

  // ── Settings modal ──
  const settingsNavBtn = el('settingsNavBtn');
  const closeSettings  = el('closeSettings');
  if (settingsNavBtn) settingsNavBtn.addEventListener('click', () => openModal('settingsModal'));
  if (closeSettings)  closeSettings.addEventListener('click',  () => closeModal('settingsModal'));

  const settingsModal = el('settingsModal');
  if (settingsModal) {
    settingsModal.addEventListener('click', e => {
      if (e.target === settingsModal) closeModal('settingsModal');
    });
  }

  // Font size range live update
  const fontRange   = el('fontSizeRange');
  const fontSizeVal = el('fontSizeVal');
  if (fontRange) {
    fontRange.addEventListener('input', () => {
      const sz = parseInt(fontRange.value, 10);
      if (fontSizeVal) fontSizeVal.textContent = sz + 'px';
      document.documentElement.style.setProperty('--typing-size', sz + 'px');
    });
  }

  // Toggle helpers
  function bindToggle(btnId, key) {
    const btn = el(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      state.settings[key] = !state.settings[key];
      btn.textContent = state.settings[key] ? 'ON' : 'OFF';
      btn.classList.toggle('active', state.settings[key]);
      btn.setAttribute('aria-checked', String(state.settings[key]));
    });
  }

  bindToggle('soundToggle',          'sound');
  bindToggle('typingFeedbackToggle', 'typingFeedback');
  bindToggle('cursorToggle',         'showCursor');

  // Save settings
  const saveSettingsBtn = el('saveSettingsBtn');
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      const diffSel   = el('difficultySelect');
      const fontRange = el('fontSizeRange');

      if (diffSel)   state.settings.difficulty = diffSel.value;
      if (fontRange) state.settings.fontSize   = parseInt(fontRange.value, 10);

      persistSettings();
      applySettings();
      closeModal('settingsModal');
      showToast('Settings saved!');
    });
  }

  // Reset progress
  const resetProgressBtn = el('resetProgressBtn');
  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      if (!confirm('Reset all XP and rank progress? This cannot be undone.')) return;
      state.totalXP = 0;
      persistState();
      updateRankUI();
      closeModal('settingsModal');
      showToast('Progress reset');
    });
  }

  // ── Keyboard shortcut: Enter to start from hero ──
  const heroSection = el('heroSection');
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && heroSection && heroSection.style.display !== 'none') {
      const startBtn = el('startBtn');
      if (startBtn && document.activeElement !== el('usernameInput')) {
        startBtn.click();
      }
    }
    // Escape closes modals
    if (e.key === 'Escape') {
      closeModal('leaderboardModal');
      closeModal('settingsModal');
    }
  });

  // ── Remove shake class after animation ──
  if (typingInput) {
    typingInput.addEventListener('animationend', () => {
      typingInput.classList.remove('shake');
    });
  }

});
/* ── End of script.js ── */
