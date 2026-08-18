const gameContainer = document.getElementById('game-container');
// EMOJIS instead of colors! 🎉
const emojis = ['🐼', '🚀', '🍕', '👻', '💎', '🌟', '❤️', '🎵'];
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let matchesCount = 0;
const totalPairs = emojis.length;

// Create cards dynamically
function createCards() {
    const cardsArray = [...emojis, ...emojis];
    // Shuffle cards
    for (let i = cardsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }
    
    cardsArray.forEach(emoji => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        
        // HTML structure of each card with emoji
        const innerHTML = `
            <div class="card-inner">
                <div class="card-front">❓</div>
                <div class="card-back" style="background: linear-gradient(135deg, #f093fb, #f5576c); display: flex; align-items: center; justify-content: center; font-size: 48px;">${emoji}</div>
            </div>
        `;
        cardElement.innerHTML = innerHTML;
        gameContainer.appendChild(cardElement);
    });
    
    cards = document.querySelectorAll('.card');
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

// ── Preview Countdown ─────────────────────────────────────
 
/**
 * Count down from 3 seconds while cards are face-up, then auto-start.
 * The Start button label reflects the countdown and acts as a skip.
 */
function startPreviewCountdown() {
  let countdown = 3;
  startBtn.textContent = `Skip Preview (${countdown})`;
 
  previewInterval = setInterval(() => {
    countdown--;
 
    if (countdown > 0) {
      startBtn.textContent = `Skip Preview (${countdown})`;
    } else {
      // Countdown finished — auto-start the game
      clearInterval(previewInterval);
      previewInterval = null;
      startGame();
    }
  }, 1000);
}

// ── Game Start ────────────────────────────────────────────

function setupPreview() {
  const cfg = DIFFICULTIES[difficulty];
  victorySound.pause();
  victorySound.currentTime = 0;
  
  // Cancel any running preview countdown or game timer
  if (previewInterval) {
     clearInterval(previewInterval);
     previewInterval = null;
  }

  stopTimer();
  winModal.classList.remove('visible');

  cards = [];
  flipped = [];
  matched = [];
  moves = 0;
  seconds = 0;
  hintUsed = false;
  gameActive = false;  // FIX 2: Set gameActive to false for restart
  lockBoard = true;

  movesEl.textContent = '0';
  timerEl.textContent = '0:00';
  timerEl.className = 'stat-value';

  pairsEl.textContent = `0/${cfg.pairs}`;
  progressEl.style.width = '0%';

  hintBtn.disabled    = true;
  hintBtn.textContent = 'Hint';

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
  startPreviewCountdown();
}

/**
 * Initialise and start a fresh game
 */
function startGame() {

  if (previewInterval) {
    clearInterval(previewInterval);
    previewInterval = null;
  }

  cards.forEach(card => {
    card.classList.remove('flipped');
  });

  flipped = [];

  gameActive = true;
  lockBoard = false;

  startBtn.textContent = 'New Game';
  hintBtn.disabled     = false;
  hintBtn.textContent  = 'Hint';

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
  if (hintUsed) {
    showToast('💡 Hint already used!');
    return;
  }
  hintUsed = true;
  const hintBtn = document.getElementById('hintBtn');
  hintBtn.disabled = true;
  hintBtn.textContent = 'Hint Used';

  // Collect unmatched unflipped cards
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

  // Find a pair to reveal
  const validPairs = Object.values(emojiMap).filter(group => group.length >= 2);
  if (!validPairs.length) return;

  // Pick one random pair
  const pair = validPairs[Math.floor(Math.random() * validPairs.length)];
  const cardA = pair[0];
  const cardB = pair[1];

  // Briefly flip the pair face-up
  cardA.classList.add('flipped');
  cardB.classList.add('flipped');
  showToast('💡 Hint used!');

  // Flip back after 1.5 seconds
  setTimeout(() => {
    if (!cardA.classList.contains('matched')) cardA.classList.remove('flipped');
    if (!cardB.classList.contains('matched')) cardB.classList.remove('flipped');
  }, 1500);
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

  victorySound.currentTime = 0;
  victorySound.play();

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
  console.log("CONFETTI FIRED");
  const container = document.getElementById('confettiContainer');
  container.innerHTML = '';

  const colors = ['#7c3aed','#a855f7','#f59e0b','#10b981','#ef4444','#60a5fa','#f472b6'];

  for (let i = 0; i < 180; i++) {
    const p = document.createElement('div');
    p.className  = 'confetti-particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${10 + Math.random() * 12}px;
      height: ${10 + Math.random() * 12}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.8}s;
    `;
    p.style.boxShadow = `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`;
    container.appendChild(p);
  }

  // Clean up particles after animation completes
  setTimeout(() => { container.innerHTML = ''; }, 4000);
}

// ── Initialise ────────────────────────────────────────────
updateBestDisplay();
updateGridClass();
setupPreview();