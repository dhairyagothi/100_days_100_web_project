// ── Config ────────────────────────────────────────────────
const EMOJIS = ['🦊','🐬','🦋','🌸','🍄','⚡','🎸','🔮','🦄','🌈','🎯','🍀'];

const DIFFICULTIES = {
  easy:   { cols: 4, pairs: 8,  label: '4×4' },
  medium: { cols: 5, pairs: 10, label: '5×4' },
  hard:   { cols: 6, pairs: 12, label: '6×4' }
};

// ── State ─────────────────────────────────────────────────
let cards        = [];
let flipped      = [];
let matched      = [];
let moves        = 0;
let seconds      = 0;
let timerInterval = null;
let gameActive   = false;
let lockBoard    = false;
let hintUsed     = false;
let difficulty   = 'easy';
let highScores   = JSON.parse(localStorage.getItem('mmHighScores') || '{}');

// ── DOM References ─────────────────────────────────────────
const grid       = document.getElementById('gameGrid');
const movesEl    = document.getElementById('movesVal');
const timerEl    = document.getElementById('timerVal');
const pairsEl    = document.getElementById('pairsVal');
const bestEl     = document.getElementById('bestVal');
const progressEl = document.getElementById('progressBar');
const winModal   = document.getElementById('winModal');
const toastEl    = document.getElementById('toast');

// ── Event Listeners ───────────────────────────────────────
document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    difficulty = btn.dataset.diff;
    updateGridClass();
    updateBestDisplay();
    setupPreview();
  });
});

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('hintBtn').addEventListener('click', useHint);
document.getElementById('playAgainBtn').addEventListener('click', () => {
  winModal.classList.remove('visible');
  setupPreview();
});
document.getElementById('restartBtn').addEventListener('click', setupPreview);


// ── Utility Helpers ───────────────────────────────────────

/**
 * Fisher-Yates shuffle — returns a new shuffled array
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Format seconds as M:SS string
 */
function fmt(s) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Apply the correct grid CSS class based on current difficulty
 */
function updateGridClass() {
  const cfg = DIFFICULTIES[difficulty];
  grid.className = `game-grid grid-4x${cfg.cols}`;
}

/**
 * Update the Best Moves display in the stats bar
 */
function updateBestDisplay() {
  const hs = highScores[difficulty];
  bestEl.textContent = hs ? `${hs.moves}m` : '—';
}

/**
 * Show a temporary toast notification
 */
function showToast(msg, dur = 1800) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), dur);
}

// ── Timer ─────────────────────────────────────────────────

/**
 * Start the game timer from zero
 */
function startTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  timerEl.textContent = '0:00';
  timerEl.className = 'stat-value';

  timerInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = fmt(seconds);

    // Color-coded warning states
    if (seconds >= 60 && seconds < 120) {
      timerEl.className = 'stat-value timer-warning';
    } else if (seconds >= 120) {
      timerEl.className = 'stat-value timer-danger';
    }
  }, 1000);
}

/**
 * Stop the game timer
 */
function stopTimer() {
  clearInterval(timerInterval);
}

// ── Game Start ────────────────────────────────────────────
function setupPreview() {
  const cfg = DIFFICULTIES[difficulty];

  stopTimer();
  winModal.classList.remove('visible');

  cards = [];
  flipped = [];
  matched = [];
  moves = 0;
  seconds = 0;
  hintUsed = false;

  gameActive = false;
  lockBoard = true;

  movesEl.textContent = '0';
  timerEl.textContent = '0:00';
  timerEl.className = 'stat-value';

  pairsEl.textContent = `0/${cfg.pairs}`;
  progressEl.style.width = '0%';

  updateGridClass();
  updateBestDisplay();

  const pool = shuffle(EMOJIS).slice(0, cfg.pairs);
  const deck = shuffle([...pool, ...pool]);

  grid.innerHTML = '';

  deck.forEach((emoji, i) => {
    const card = document.createElement('div');

    card.className = 'card flipped';

    card.dataset.emoji = emoji;
    card.dataset.idx = i;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">${emoji}</div>
      </div>
    `;

    card.addEventListener('click', () => onCardClick(card));

    grid.appendChild(card);
    cards.push(card);
  });
}
/**
 * Initialise and start a fresh game
 */
function startGame() {
  cards.forEach(card => {
    card.classList.remove('flipped');
  });

  flipped = [];

  gameActive = true;
  lockBoard = false;

  startTimer();
}

// ── Card Interaction ──────────────────────────────────────

/**
 * Handle a card click event
 */
function onCardClick(card) {
  if (!gameActive || lockBoard)               return;
  if (card.classList.contains('matched'))     return;
  if (flipped.includes(card))                 return;
  if (flipped.length === 2)                   return;

  card.classList.add('flipped');
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    lockBoard = true;
    checkMatch();
  }
}

/**
 * Check whether the two flipped cards are a matching pair
 */
function checkMatch() {
  const [a, b] = flipped;

  if (a.dataset.emoji === b.dataset.emoji) {
    // ✓ Matched
    setTimeout(() => {
      a.classList.add('matched');
      b.classList.add('matched');
      matched.push(a, b);
      flipped   = [];
      lockBoard = false;

      const cfg      = DIFFICULTIES[difficulty];
      const pairsDone = matched.length / 2;

      // Update pairs counter and progress bar
      pairsEl.textContent    = `${pairsDone}/${cfg.pairs}`;
      progressEl.style.width = `${(pairsDone / cfg.pairs) * 100}%`;

      if (pairsDone < cfg.pairs) showToast('✓ Match!');
      if (matched.length === cards.length) onWin();
    }, 300);

  } else {
    // ✗ No match — shake and flip back
    a.classList.add('wrong');
    b.classList.add('wrong');
    setTimeout(() => {
      a.classList.remove('flipped', 'wrong');
      b.classList.remove('flipped', 'wrong');
      flipped   = [];
      lockBoard = false;
    }, 900);
  }
}

// ── Hint ──────────────────────────────────────────────────

/**
 * Briefly reveal a matching pair (one use per game)
 */
function useHint() {
  if (!gameActive || hintUsed) {
    showToast('Hint already used!');
    return;
  }
  hintUsed = true;

  // Collect unmatched, unflipped cards
  const unmatched = cards.filter(
    c => !c.classList.contains('matched') && !c.classList.contains('flipped')
  );
  if (!unmatched.length) return;

  // Group by emoji to find a valid pair
  const emojiMap = {};
  for (const c of unmatched) {
    const e = c.dataset.emoji;
    if (!emojiMap[e]) emojiMap[e] = [];
    emojiMap[e].push(c);
  }
  const pair = Object.values(emojiMap).find(g => g.length >= 2);
  if (!pair) return;

  // Briefly show the pair
  pair[0].classList.add('flipped');
  pair[1].classList.add('flipped');
  showToast('💡 Hint used!');

  setTimeout(() => {
    if (!pair[0].classList.contains('matched')) {
      pair[0].classList.remove('flipped');
      pair[1].classList.remove('flipped');
    }
  }, 1200);
}

// ── Win Condition ─────────────────────────────────────────

/**
 * Called when all pairs are matched — show results and high score
 */
function onWin() {
  stopTimer();
  gameActive             = false;
  progressEl.style.width = '100%';

  // Check and save high score
  const hs        = highScores[difficulty];
  const isNewBest = !hs || moves < hs.moves || (moves === hs.moves && seconds < hs.seconds);

  if (isNewBest) {
    highScores[difficulty] = { moves, seconds };
    localStorage.setItem('mmHighScores', JSON.stringify(highScores));
  }
  updateBestDisplay();

  // Populate modal
  const rating =
    moves <= 12 ? 'Incredible!' :
    moves <= 18 ? 'Great job!'  :
    moves <= 25 ? 'Well done!'  : 'You did it!';

  document.getElementById('modalSub').textContent        = rating;
  document.getElementById('modalMoves').textContent      = moves;
  document.getElementById('modalTime').textContent       = fmt(seconds);
  document.getElementById('newBest').style.display       = isNewBest ? 'block' : 'none';

  setTimeout(() => {
    winModal.classList.add('visible');
    launchConfetti();
  }, 400);
}

// ── Confetti ──────────────────────────────────────────────

/**
 * Spawn animated confetti particles on win
 */
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  container.innerHTML = '';

  const colors = ['#7c3aed','#a855f7','#f59e0b','#10b981','#ef4444','#60a5fa','#f472b6'];

  for (let i = 0; i < 70; i++) {
    const p = document.createElement('div');
    p.className  = 'confetti-particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${4 + Math.random() * 8}px;
      height: ${4 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.8}s;
    `;
    container.appendChild(p);
  }

  // Clean up particles after animation completes
  setTimeout(() => { container.innerHTML = ''; }, 4000);
}

// ── Initialise ────────────────────────────────────────────
updateBestDisplay();
updateGridClass();
setupPreview();