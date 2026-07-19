'use strict';

// ─── CARD DATA ────────────────────────────────────────────────────────────────
const SUITS = ['♠', '♥', '♦', '♣'];
const SUIT_COLOR = { '♠': 'black', '♥': 'red', '♦': 'red', '♣': 'black' };
const SUIT_TO_LETTER = { '♠': 'S', '♥': 'H', '♦': 'D', '♣': 'C' };
const RANKS = ['Q', 'K', 'J', 'A']; // Queen, King, Jack, Ace
// Unicode card emojis for visual flair (suit-agnostic face)
const RANK_EMOJI = { Q: '🂭', K: '🂮', J: '🂫', A: '🂡' };
const RANK_LABEL = { Q: 'QUEEN', K: 'KING', J: 'JACK', A: 'ACE' };

// Build full deck: every rank × every suit = 16 unique cards
function buildDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit, color: SUIT_COLOR[suit], id: rank + suit });
    }
  }
  return deck; // 16 unique cards
}

// ─── LEVEL CONFIG ─────────────────────────────────────────────────────────────
const LEVELS = {
  easy: {
    pairs: 4,
    cols: 4,
    rows: 2,
    gridClass: 'grid-2x4',
    pts: 100,
    penalty: 10,
    timeBonus: 120,
  },
  mid: {
    pairs: 6,
    cols: 4,
    rows: 3,
    gridClass: 'grid-3x4',
    pts: 150,
    penalty: 10,
    timeBonus: 200,
  },
  hard: {
    pairs: 8,
    cols: 4,
    rows: 4,
    gridClass: 'grid-4x4',
    pts: 200,
    penalty: 10,
    timeBonus: 300,
  },
};

// ─── STATE ────────────────────────────────────────────────────────────────────
let mode = 'solo'; // 'solo' | 'duo'
let level = 'easy';
let cards = []; // { ...cardData, index, flipped, matched }
let flipped = []; // indices of currently flipped (unmatched) cards
let locked = false; // prevent clicks during flip-back animation
let activePlayer = 1; // 1 | 2
let scores = [0, 0]; // [p1, p2]
let matchCounts = [0, 0]; // pairs matched per player
let timerSecs = 0;
let timerHandle = null;
let gameStarted = false;
let gameOver = false;
let totalPairs = 4;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(s) {
  const m = Math.floor(s / 60),
    sec = s % 60;
  return m + ':' + String(sec).padStart(2, '0');
}

// ─── TIMER ───────────────────────────────────────────────────────────────────
function startTimer() {
  if (timerHandle) return;
  timerHandle = setInterval(() => {
    timerSecs++;
    document.getElementById('timer-display').textContent = fmt(timerSecs);
  }, 1000);
}
function stopTimer() {
  clearInterval(timerHandle);
  timerHandle = null;
}
function resetTimer() {
  stopTimer();
  timerSecs = 0;
  document.getElementById('timer-display').textContent = '0:00';
}

// ─── BUILD & RENDER ───────────────────────────────────────────────────────────
function buildGame() {
  const cfg = LEVELS[level];
  totalPairs = cfg.pairs;
  const deck = buildDeck();
  // Pick `pairs` unique cards randomly
  const chosen = shuffle(deck).slice(0, cfg.pairs);
  // Duplicate for pairs
  const pairs = shuffle([...chosen, ...chosen.map((c) => ({ ...c }))]);
  cards = pairs.map((c, i) => ({
    ...c,
    index: i,
    flipped: false,
    matched: false,
  }));
  flipped = [];
  locked = false;
  gameStarted = false;
  gameOver = false;
  resetTimer();
  renderBoard();
  updateScoreboard();
  setStatus('FLIP A CARD TO START!', 'var(--muted)');
}

function renderBoard() {
  const cfg = LEVELS[level];
  const el = document.getElementById('board');
  el.className = cfg.gridClass;
  el.innerHTML = '';
  for (const c of cards) {
    el.appendChild(makeCardEl(c));
  }
}

function makeCardEl(c) {
  const div = document.createElement('div');
  div.className =
    'card' + (c.flipped ? ' flipped' : '') + (c.matched ? ' matched' : '');
  div.setAttribute('data-index', c.index);
  div.setAttribute('role', 'button');
  div.setAttribute(
    'aria-label',
    c.flipped || c.matched
      ? RANK_LABEL[c.rank] + ' of ' + c.suit
      : 'Face-down card'
  );
  div.setAttribute('tabindex', '0');

  const inner = document.createElement('div');
  inner.className = 'card-inner';

  // Back
  const back = document.createElement('div');
  back.className = 'card-face card-back';

  // Front
  const front = document.createElement('div');
  front.className = 'card-face card-front';

  const imgEl = document.createElement('img');
  imgEl.src = `assets/cards/${c.rank}${SUIT_TO_LETTER[c.suit]}.png`;
  imgEl.alt = `${RANK_LABEL[c.rank]} of ${c.suit}`;

  front.appendChild(imgEl);
  inner.appendChild(back);
  inner.appendChild(front);
  div.appendChild(inner);

  div.addEventListener('click', () => handleFlip(c.index));
  div.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleFlip(c.index);
    }

    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      handleFlip(c.index);
    }
  });
  return div;
}

function getCardEl(i) {
  return document.querySelector(`.card[data-index="${i}"]`);
}

// ─── GAME LOGIC ───────────────────────────────────────────────────────────────
function handleFlip(i) {
  if (gameOver || locked) return;
  const c = cards[i];
  if (c.flipped || c.matched) return;
  if (flipped.length >= 2) return;

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  c.flipped = true;
  const el = getCardEl(i);
  el.classList.add('flipped');
  flipped.push(i);

  if (flipped.length === 2) {
    locked = true;
    setTimeout(() => checkMatch(), 700);
  } else {
    setStatus(
      mode === 'duo'
        ? 'P' + activePlayer + ' › FLIP ONE MORE!'
        : 'FLIP ONE MORE!',
      activePlayer === 1 ? 'var(--p1c)' : 'var(--p2c)'
    );
  }
}

function checkMatch() {
  const [a, b] = flipped;
  const ca = cards[a],
    cb = cards[b];
  const match = ca.id === cb.id;
  const cfg = LEVELS[level];
  const pIdx = activePlayer - 1;

  if (match) {
    ca.matched = cb.matched = true;
    scores[pIdx] += cfg.pts;
    matchCounts[pIdx]++;
    getCardEl(a).classList.add('matched', 'matched-new');
    getCardEl(b).classList.add('matched', 'matched-new');
    // Remove animation class after
    setTimeout(() => {
      getCardEl(a)?.classList.remove('matched-new');
      getCardEl(b)?.classList.remove('matched-new');
    }, 400);

    flipped = [];
    locked = false;
    updateScoreboard();
    showPenalty(pIdx, '+' + cfg.pts, false);

    const remaining = cards.filter((c) => !c.matched).length;
    if (remaining === 0) {
      setTimeout(() => endGame(), 300);
      return;
    }
    showToast('✓ MATCH! +' + cfg.pts + ' PTS', 'success');
    setStatus(
      mode === 'duo'
        ? 'P' + activePlayer + ' MATCHED! FLIP AGAIN!'
        : '✓ MATCH! KEEP GOING!',
      'var(--ng)'
    );
    // In duo: same player goes again on a match — no switch
  } else {
    scores[pIdx] = Math.max(0, scores[pIdx] - cfg.penalty);
    getCardEl(a).classList.add('wrong');
    getCardEl(b).classList.add('wrong');
    showPenalty(pIdx, '-' + cfg.penalty, true);
    updateScoreboard();
    showToast('✗ NO MATCH! -' + cfg.penalty + ' PTS', 'error');

    setTimeout(() => {
      cards[a].flipped = false;
      cards[b].flipped = false;
      const elA = getCardEl(a),
        elB = getCardEl(b);
      if (elA) {
        elA.classList.remove('flipped', 'wrong');
      }
      if (elB) {
        elB.classList.remove('flipped', 'wrong');
      }
      flipped = [];
      locked = false;

      // Switch player in duo
      if (mode === 'duo') {
        activePlayer = activePlayer === 1 ? 2 : 1;
        updateScoreboard();
      }
      setStatus(
        mode === 'duo' ? 'P' + activePlayer + "'S TURN" : 'TRY AGAIN!',
        activePlayer === 1 ? 'var(--p1c)' : 'var(--p2c)'
      );
    }, 800);
  }
}

function endGame() {
  stopTimer();
  gameOver = true;
  const cfg = LEVELS[level];
  // Time bonus: max timeBonus, decreasing by 1 per second elapsed
  const timePts = Math.max(0, cfg.timeBonus - timerSecs);

  if (mode === 'solo') {
    scores[0] += timePts;
    updateScoreboard();
    const total = scores[0];
    showResult(
      '🏆',
      'YOU WIN!',
      'Time: ' + fmt(timerSecs) + '  ·  Bonus: +' + timePts,
      [{ label: 'FINAL SCORE', val: total, color: 'var(--ng)' }]
    );
  } else {
    // Add time bonus to winner
    const [s1, s2] = scores;
    const winner = s1 > s2 ? 1 : s2 > s1 ? 2 : 0;
    if (winner > 0) scores[winner - 1] += timePts;
    updateScoreboard();
    const emoji = winner ? '🏆' : '🤝';
    const title = winner ? 'PLAYER ' + winner + ' WINS!' : "IT'S A TIE!";
    const sub = winner
      ? 'P' + winner + ' gets time bonus +' + timePts + '!'
      : 'Both players matched ' + matchCounts[0] + ' pairs!';
    showResult(emoji, title, sub, [
      { label: 'P1', val: scores[0], color: 'var(--p1c)' },
      { label: 'P2', val: scores[1], color: 'var(--p2c)' },
    ]);
  }
}

// ─── UI ───────────────────────────────────────────────────────────────────────
function updateScoreboard() {
  document.getElementById('score-p1').textContent = scores[0];
  document.getElementById('score-p2').textContent = scores[1];

  const c1 = document.getElementById('card-p1');
  const c2 = document.getElementById('card-p2');
  c1.className =
    'player-card' +
    (activePlayer === 1 && !gameOver && mode === 'duo' ? ' active-p1' : '');
  c2.className =
    'player-card' +
    (activePlayer === 2 && !gameOver && mode === 'duo' ? ' active-p2' : '');
  // Solo always highlights p1
  if (mode === 'solo' && !gameOver) c1.className = 'player-card active-p1';
}

let penaltyTimers = [null, null];
function showPenalty(pIdx, text, isNeg) {
  const el = document.getElementById('penalty-p' + (pIdx + 1));
  if (!el) return;
  clearTimeout(penaltyTimers[pIdx]);
  el.textContent = text;
  el.style.color = isNeg ? 'var(--np)' : 'var(--ng)';
  penaltyTimers[pIdx] = setTimeout(() => {
    el.textContent = '';
  }, 1200);
}

function setStatus(msg, color) {
  const el = document.getElementById('status-text');
  el.textContent = msg;
  el.style.color = color || 'var(--text)';
  el.style.textShadow = color
    ? '0 0 10px ' + color.replace('var', '').replace('(', '').replace(')', '')
    : 'none';
}

function showResult(emoji, title, sub, scoreItems) {
  document.getElementById('res-emoji').textContent = emoji;
  const t = document.getElementById('res-title');
  t.textContent = title;
  t.style.color = scoreItems[0]?.color || 'var(--ny)';
  document.getElementById('res-sub').textContent = sub;

  const sc = document.getElementById('res-scores');
  sc.innerHTML = '';
  for (const s of scoreItems) {
    sc.innerHTML += `<div class="res-score-item"><span class="res-score-name">${s.label}</span><span class="res-score-val" style="color:${s.color}">${s.val}</span></div>`;
  }
  document.getElementById('overlay').classList.add('show');
}

let toastTmr = null;
function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + (type || 'info') + ' show';
  clearTimeout(toastTmr);
  toastTmr = setTimeout(() => t.classList.remove('show'), 2000);
}

// ─── RESET HELPERS ────────────────────────────────────────────────────────────
function newGame() {
  // Keep scores, restart board
  document.getElementById('overlay').classList.remove('show');
  buildGame();
  updateScoreboard();
}

function resetAll() {
  document.getElementById('overlay').classList.remove('show');
  scores = [0, 0];
  matchCounts = [0, 0];
  activePlayer = 1;
  buildGame();
  updateScoreboard();
}

function switchMode(m) {
  mode = m;
  document.querySelectorAll('.setup-btn[data-mode]').forEach((b) => {
    const on = b.dataset.mode === m;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on);
  });
  // Show/hide P2 card
  const c2 = document.getElementById('card-p2');
  c2.style.opacity = m === 'duo' ? '1' : '0.35';
  document.getElementById('name-p2').textContent =
    m === 'duo' ? 'PLAYER 2' : '—';
  resetAll();
}

function switchLevel(l) {
  level = l;
  document.querySelectorAll('.setup-btn[data-level]').forEach((b) => {
    const on = b.dataset.level === l;
    b.classList.toggle('active', on);
  });
  resetAll();
}

// ─── EVENT LISTENERS ──────────────────────────────────────────────────────────
document
  .querySelectorAll('.setup-btn[data-mode]')
  .forEach((b) =>
    b.addEventListener('click', () => switchMode(b.dataset.mode))
  );
document
  .querySelectorAll('.setup-btn[data-level]')
  .forEach((b) =>
    b.addEventListener('click', () => switchLevel(b.dataset.level))
  );

document.getElementById('btn-reset').addEventListener('click', () => newGame());
document.getElementById('btn-new').addEventListener('click', () => resetAll());
document.getElementById('res-play').addEventListener('click', () => newGame());
document
  .getElementById('res-reset')
  .addEventListener('click', () => resetAll());

document.getElementById('htp-toggle').addEventListener('click', () => {
  const body = document.getElementById('htp-body'),
    chev = document.getElementById('htp-chev');
  const open = body.classList.toggle('open');
  chev.classList.toggle('open', open);
  document.getElementById('htp-toggle').setAttribute('aria-expanded', open);
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
// Init p2 card opacity for solo
document.getElementById('card-p2').style.opacity = '0.35';
document.getElementById('name-p2').textContent = '—';
buildGame();
