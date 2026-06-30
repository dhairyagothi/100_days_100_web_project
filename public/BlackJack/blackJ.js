/**
 * blackJ.js — BlackJack game logic, UI state, and event handling.
 * Features: core game, betting system, chip UI, Double Down, Split.
 */

'use strict';

// ── Card data ────────────────────────────────────────────────────────────────

/**
 * Card face values for all four suits.
 * Aces use [1, 11] — the higher value is applied unless it causes a bust.
 */
const CARD_VALUES = {
  '2C':2,  '3C':3,  '4C':4,  '5C':5,  '6C':6,  '7C':7,  '8C':8,  '9C':9,
  '10C':10,'KC':10, 'QC':10, 'JC':10, 'AC':[1,11],
  '2D':2,  '3D':3,  '4D':4,  '5D':5,  '6D':6,  '7D':7,  '8D':8,  '9D':9,
  '10D':10,'KD':10, 'QD':10, 'JD':10, 'AD':[1,11],
  '2H':2,  '3H':3,  '4H':4,  '5H':5,  '6H':6,  '7H':7,  '8H':8,  '9H':9,
  '10H':10,'KH':10, 'QH':10, 'JH':10, 'AH':[1,11],
  '2S':2,  '3S':3,  '4S':4,  '5S':5,  '6S':6,  '7S':7,  '8S':8,  '9S':9,
  '10S':10,'KS':10, 'QS':10, 'JS':10, 'AS':[1,11]
};

/** Returns a fresh 52-card deck. */
function freshDeck() {
  return [
    '2C','3C','4C','5C','6C','7C','8C','9C','10C','KC','QC','JC','AC',
    '2D','3D','4D','5D','6D','7D','8D','9D','10D','KD','QD','JD','AD',
    '2H','3H','4H','5H','6H','7H','8H','9H','10H','KH','QH','JH','AH',
    '2S','3S','4S','5S','6S','7S','8S','9S','10S','KS','QS','JS','AS'
  ];
}

/** Returns the rank portion of a card string (e.g. "10" from "10H", "K" from "KC"). */
function cardRank(card) {
  return card.slice(0, -1);
}

// ── Core game state ──────────────────────────────────────────────────────────

const BJgame = {
  you: {
    scoreSpan:     '#yourscore',
    cardContainer: '#your-cards',
    score: 0,
    cards: []
  },
  dealer: {
    scoreSpan:     '#dealerscore',
    cardContainer: '#dealer-cards',
    score: 0,
    cards: []
  },
  deck:   freshDeck(),
  wins:   0,
  losses: 0,
  draws:  0
};

const You    = BJgame.you;
const Dealer = BJgame.dealer;

/**
 * true = round in progress; false = awaiting Deal or Play Again.
 */
let gameActive = false;

// ── Betting state ────────────────────────────────────────────────────────────

const Bet = {
  balance:    1000,
  current:    0,
  last:       0,
  deducted:   false   // tracks whether the round's bet has been deducted from balance
};

// ── Split state ──────────────────────────────────────────────────────────────

const Split = {
  active:     false,
  hands:      [[], []],   // each sub-array holds card strings
  scores:     [0, 0],
  activeIdx:  0,          // which hand is currently being played
  bet:        0           // side bet (equals Bet.current at time of split)
};

// ── Double Down state ────────────────────────────────────────────────────────

let doubleDownActive = false;  // true after Double Down is clicked; auto-stand after one card

// ── Audio ────────────────────────────────────────────────────────────────────

const sounds = {
  hit:   document.getElementById('snd-hit'),
  tink:  document.getElementById('snd-tink'),
  win:   document.getElementById('snd-win'),
  cheer: document.getElementById('snd-cheer'),
  lose:  document.getElementById('snd-lose'),
  draw:  document.getElementById('snd-draw')
};

function playSound(key) {
  const s = sounds[key];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
}

// ── DOM helpers ───────────────────────────────────────────────────────────────

/** @param {string} selector @returns {Element|null} */
const $ = selector => document.querySelector(selector);

function showToast(msg, durationMs = 2400) {
  const el = document.getElementById('bjToast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), durationMs);
}

// ── Bet display ───────────────────────────────────────────────────────────────

function renderBetUI() {
  const balEl = document.getElementById('balanceDisplay');
  const betEl = document.getElementById('betDisplay');
  if (balEl) balEl.textContent = '$' + Bet.balance.toLocaleString();
  if (betEl) betEl.textContent = '$' + Bet.current.toLocaleString();
}

function setLastResult(text, color) {
  const el = document.getElementById('lastResultDisplay');
  if (!el) return;
  el.textContent  = text;
  el.style.color  = color || '';
}

// ── Chip rail ─────────────────────────────────────────────────────────────────

function lockChips(locked) {
  document.querySelectorAll('.chip').forEach(c => {
    c.disabled = locked;
    c.style.opacity = locked ? '0.4' : '';
    c.style.cursor  = locked ? 'not-allowed' : '';
  });
}

document.getElementById('chipRail').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip || chip.disabled) return;

  const val = parseInt(chip.dataset.val, 10);
  if (Bet.current + val > Bet.balance) {
    showToast('Not enough balance for that chip');
    return;
  }
  Bet.current += val;
  renderBetUI();

  // Brief pop animation
  chip.classList.add('chip--pop');
  setTimeout(() => chip.classList.remove('chip--pop'), 200);
});

document.getElementById('clearBetBtn').addEventListener('click', () => {
  if (gameActive) return;
  Bet.current = 0;
  renderBetUI();
});

document.getElementById('repeatBetBtn').addEventListener('click', () => {
  if (gameActive) return;
  if (!Bet.last) { showToast('No previous bet to repeat'); return; }
  if (Bet.last > Bet.balance) { showToast('Not enough balance'); return; }
  Bet.current = Bet.last;
  renderBetUI();
});

document.getElementById('refillBtn').addEventListener('click', () => {
  if (gameActive) { showToast('Finish this round first'); return; }
  Bet.balance = 1000;
  Bet.current = 0;
  Bet.last    = 0;
  setLastResult('—');
  renderBetUI();
  showToast('Balance refilled to $1,000');
});

// ── Special action buttons ─────────────────────────────────────────────────────

function setSpecialButtons(canDouble, canSplit) {
  const dBtn = document.getElementById('doubleBtn');
  const sBtn = document.getElementById('splitBtn');
  if (dBtn) { dBtn.disabled = !canDouble; dBtn.style.opacity = canDouble ? '' : '0.38'; }
  if (sBtn) { sBtn.disabled = !canSplit;  sBtn.style.opacity = canSplit  ? '' : '0.38'; }
}

function evaluateSpecialActions() {
  // Both actions are only available at the very start of a hand (exactly 2 cards dealt)
  const twoCards    = You.cards.length === 2;
  const hasBudget   = Bet.current <= Bet.balance;
  const matchingRanks = twoCards && cardRank(You.cards[0]) === cardRank(You.cards[1]);

  setSpecialButtons(
    twoCards && hasBudget,
    twoCards && hasBudget && matchingRanks
  );
}

// ── Double Down ───────────────────────────────────────────────────────────────

document.getElementById('doubleBtn').addEventListener('click', () => {
  if (!gameActive || You.cards.length !== 2) return;
  if (Bet.current > Bet.balance) { showToast('Insufficient balance to double'); return; }

  // Deduct the extra bet and double
  Bet.balance       -= Bet.current;
  Bet.current       *= 2;
  doubleDownActive   = true;
  renderBetUI();
  setSpecialButtons(false, false);

  showToast('Doubled! Drawing one card…');
  drawCard(You);

  if (You.score > 21) {
    setTimeout(() => endRound(findWinner()), 400);
  } else {
    // Auto-stand after the single card
    setTimeout(() => BJstand(), 700);
  }
});

// ── Split ─────────────────────────────────────────────────────────────────────

document.getElementById('splitBtn').addEventListener('click', () => {
  if (!gameActive || You.cards.length !== 2) return;
  if (cardRank(You.cards[0]) !== cardRank(You.cards[1])) {
    showToast('Can only split matching ranks');
    return;
  }
  if (Bet.current > Bet.balance) { showToast('Insufficient balance for split'); return; }

  // Deduct side bet
  Bet.balance -= Bet.current;
  Split.bet    = Bet.current;
  renderBetUI();

  // Build two hands — each starts with one original card + one newly drawn card
  Split.hands[0] = [You.cards[0], drawCardFromDeck()];
  Split.hands[1] = [You.cards[1], drawCardFromDeck()];
  Split.scores[0] = calcHandScore(Split.hands[0]);
  Split.scores[1] = calcHandScore(Split.hands[1]);
  Split.active    = true;
  Split.activeIdx = 0;

  // Clear the main card display — split section takes over
  $('#your-cards').querySelectorAll('img').forEach(img => img.remove());
  You.score = 0;
  $( You.scoreSpan).textContent = 0;

  showSplitSection();
  setSpecialButtons(false, false);
  lockChips(true);
  showToast('Split! Play hand 1, then hand 2 continues automatically.');
});

function drawCardFromDeck() {
  if (BJgame.deck.length === 0) BJgame.deck = freshDeck();
  const idx = Math.floor(Math.random() * BJgame.deck.length);
  const [card] = BJgame.deck.splice(idx, 1);
  return card;
}

function calcHandScore(cards) {
  let score = 0;
  cards.forEach(c => {
    const v = CARD_VALUES[c];
    if (Array.isArray(v)) score += (score + v[1] <= 21) ? v[1] : v[0];
    else score += v;
  });
  return score;
}

function showSplitSection() {
  const sec = document.getElementById('splitSection');
  if (sec) sec.hidden = false;
  renderSplitHand(0);
  renderSplitHand(1);
  activateSplitHand(0);
}

function renderSplitHand(idx) {
  const container = document.getElementById('splitCards' + idx);
  if (!container) return;
  container.innerHTML = '';
  Split.hands[idx].forEach(card => {
    const img = document.createElement('img');
    img.src  = `./static/${card}.png`;
    img.alt  = card;
    img.setAttribute('role', 'listitem');
    container.appendChild(img);
  });
  const scoreEl = document.getElementById('splitScore' + idx);
  if (scoreEl) scoreEl.textContent = 'Score: ' + Split.scores[idx];
}

function activateSplitHand(idx) {
  Split.activeIdx = idx;
  const h0 = document.getElementById('splitHand0');
  const h1 = document.getElementById('splitHand1');
  if (h0) h0.classList.toggle('split-hand--active', idx === 0);
  if (h1) h1.classList.toggle('split-hand--active', idx === 1);
  const lbl = document.getElementById('splitTurnLabel');
  if (lbl) lbl.textContent = 'Playing hand ' + (idx + 1) + ' of 2';
}

function hideSplitSection() {
  const sec = document.getElementById('splitSection');
  if (sec) sec.hidden = true;
}

/**
 * Settles both split hands against the dealer's final score.
 * Each hand uses Split.bet independently.
 */
function settleSplitBets(dealerScore, dealerBust) {
  let netChange = 0;
  const parts   = [];

  Split.hands.forEach((hand, i) => {
    const s    = Split.scores[i];
    const bust = s > 21;
    const b    = Split.bet;

    if (!bust && (dealerBust || s > dealerScore)) {
      netChange += b;
      parts.push(`Hand ${i + 1}: Win +$${b}`);
    } else if (!bust && !dealerBust && s === dealerScore) {
      parts.push(`Hand ${i + 1}: Push`);
      // bet returned — no netChange
    } else {
      netChange -= b;
      parts.push(`Hand ${i + 1}: Loss -$${b}`);
    }
  });

  Bet.balance += netChange;
  const color = netChange > 0 ? '#1d9e75' : netChange < 0 ? '#e24b4a' : '#ba7517';
  setLastResult(parts.join(' | '), color);
  renderBetUI();
  showToast(parts.join('  ·  '), 3500);
}

// ── Button helpers ────────────────────────────────────────────────────────────

function disableGameButtons() {
  ['#hit', '#stand'].forEach(sel => {
    const btn = $(sel);
    if (!btn) return;
    btn.disabled = true;
    btn.setAttribute('aria-disabled', 'true');
    btn.style.opacity = '0.4';
    btn.style.cursor  = 'not-allowed';
  });
}

function enableGameButtons() {
  ['#hit', '#stand'].forEach(sel => {
    const btn = $(sel);
    if (!btn) return;
    btn.disabled = false;
    btn.setAttribute('aria-disabled', 'false');
    btn.style.opacity = '';
    btn.style.cursor  = '';
  });
}

// ── Core logic ────────────────────────────────────────────────────────────────

/**
 * Draws one card from the deck for the given player, renders its image,
 * plays the deal sound, and updates the score.
 */
function drawCard(activePlayer) {
  const randomIndex   = Math.floor(Math.random() * BJgame.deck.length);
  const [currentCard] = BJgame.deck.splice(randomIndex, 1);

  activePlayer.cards.push(currentCard);

  const cardImg = document.createElement('img');
  cardImg.src   = `./static/${currentCard}.png`;
  cardImg.alt   = currentCard;
  cardImg.setAttribute('role', 'listitem');
  $(activePlayer.cardContainer).appendChild(cardImg);

  playSound('hit');

  updateScore(currentCard, activePlayer);
  showScore(activePlayer);
}

/**
 * Adds the drawn card's value to the player's running total.
 * Aces count as 11 only when that keeps the score ≤ 21.
 */
function updateScore(card, activePlayer) {
  const value = CARD_VALUES[card];
  if (Array.isArray(value)) {
    activePlayer.score +=
      (activePlayer.score + value[1] <= 21) ? value[1] : value[0];
  } else {
    activePlayer.score += value;
  }
}

function showScore(activePlayer) {
  $(activePlayer.scoreSpan).textContent = activePlayer.score;
}

// ── Round resolution ──────────────────────────────────────────────────────────

/**
 * Compares final scores and returns the winner object (or undefined for draw).
 */
function findWinner() {
  const youBust    = You.score > 21;
  const dealerBust = Dealer.score > 21;

  if (!youBust && (dealerBust || Dealer.score < You.score)) {
    BJgame.wins++;
    return You;
  }
  if (!youBust && !dealerBust && Dealer.score === You.score) {
    BJgame.draws++;
    return undefined;
  }
  if (!dealerBust && (youBust || You.score < Dealer.score)) {
    BJgame.losses++;
    return Dealer;
  }
  BJgame.draws++; // both bust
  return undefined;
}

function showResults(winner) {
  const el = $('#command');
  if (!el) return;

  if (winner === You) {
    el.textContent = '🏅 You Won!';
    el.style.color = '#4caf7d';
    playSound('win');
    sounds.cheer && (sounds.cheer.volume = 0.4);
    playSound('cheer');
  } else if (winner === Dealer) {
    el.textContent = '😖 You Lost!';
    el.style.color = '#e05252';
    playSound('lose');
  } else {
    el.textContent = "🤝 It's a Draw!";
    el.style.color = '#f0b429';
    playSound('draw');
  }
}

function updateScoreboard() {
  [['#wins', BJgame.wins], ['#losses', BJgame.losses], ['#draws', BJgame.draws]].forEach(([sel, val]) => {
    const el = $(sel);
    if (!el) return;
    el.textContent     = val;
    el.style.transform = 'scale(1.3)';
    setTimeout(() => { el.style.transform = ''; }, 250);
  });
}

/**
 * Settles the bet after a normal (non-split) round.
 */
function settleBet(winner) {
  let netChange = 0;

  if (winner === You) {
    // Check for natural blackjack (Ace + 10-value on opening deal)
    const isBlackjack = You.cards.length === 2 && You.score === 21;
    const payout = isBlackjack ? Math.floor(Bet.current * 2.5) : Bet.current * 2;
    netChange = payout;
    setLastResult(`Win! +$${payout - Bet.current}`, '#1d9e75');
  } else if (winner === undefined) {
    netChange = Bet.current; // push — return bet
    setLastResult('Push — bet returned', '#ba7517');
  } else {
    netChange = 0; // loss — bet already deducted
    setLastResult(`Loss — -$${Bet.current}`, '#e24b4a');
  }

  Bet.last    = Bet.current;
  Bet.balance += netChange;
  Bet.current  = 0;
  Bet.deducted = false;

  renderBetUI();
  lockChips(false);
  setSpecialButtons(false, false);
  doubleDownActive = false;

  if (Bet.balance <= 0) {
    showToast("You're out of chips! Click Refill to keep playing.", 4000);
  }
}

/**
 * Finalises a round: locks game state, disables actions, shows result, settles bet.
 */
function endRound(winner) {
  gameActive = false;
  disableGameButtons();
  showResults(winner);
  updateScoreboard();

  if (Split.active) {
    settleSplitBets(Dealer.score, Dealer.score > 21);
    // The original bet is already gone (deducted on deal); it was the split side bets at stake
    Bet.current  = 0;
    Bet.deducted = false;
    Split.active = false;
    renderBetUI();
    lockChips(false);
    setSpecialButtons(false, false);
  } else {
    settleBet(winner);
  }
}

// ── Button handlers ───────────────────────────────────────────────────────────

function BJhit() {
  if (!gameActive) return;

  // If split is active, add the card to the current split hand instead
  if (Split.active) {
    const idx  = Split.activeIdx;
    const card = drawCardFromDeck();
    Split.hands[idx].push(card);
    Split.scores[idx] = calcHandScore(Split.hands[idx]);
    renderSplitHand(idx);
    playSound('hit');

    if (Split.scores[idx] > 21) {
      showToast(`Hand ${idx + 1} bust!`);
      advanceSplitHand();
    }
    return;
  }

  drawCard(You);

  if (You.score > 21) {
    setTimeout(() => endRound(findWinner()), 400);
  } else if (!doubleDownActive) {
    // Re-evaluate special actions only when not mid double-down
    evaluateSpecialActions();
  }
}

/**
 * Move to hand 2, or if both hands are done kick off dealer draw.
 */
function advanceSplitHand() {
  if (Split.activeIdx === 0) {
    activateSplitHand(1);
    showToast('Now playing hand 2');
  } else {
    // Both hands played — dealer draws
    runDealerDraw();
  }
}

function BJstand() {
  if (!gameActive) return;

  if (Split.active) {
    advanceSplitHand();
    return;
  }

  runDealerDraw();
}

function runDealerDraw() {
  while (Dealer.score < 17) {
    drawCard(Dealer);
  }
  setTimeout(() => endRound(findWinner()), 800);
}

function BJdeal() {
  if (gameActive) {
    showToast('Finish your current turn first — Hit or Stand before dealing.');
    return;
  }

  if (Bet.current <= 0) {
    showToast('Place a bet first!');
    return;
  }
  if (Bet.current > Bet.balance) {
    showToast('Bet exceeds your balance');
    return;
  }

  // Deduct bet from balance before dealing
  Bet.balance  -= Bet.current;
  Bet.deducted  = true;
  renderBetUI();

  startNewRound();
}

function startNewRound() {
  // Clear card displays
  ['#your-cards', '#dealer-cards'].forEach(sel => {
    $(sel).querySelectorAll('img').forEach(img => img.remove());
  });

  BJgame.deck = freshDeck();

  // Reset player states
  [You, Dealer].forEach(player => {
    player.score = 0;
    player.cards = [];
    const el = $(player.scoreSpan);
    if (el) { el.textContent = 0; el.style.color = ''; }
  });

  // Reset split state
  Split.active    = false;
  Split.hands     = [[], []];
  Split.scores    = [0, 0];
  Split.activeIdx = 0;
  Split.bet       = 0;
  hideSplitSection();

  doubleDownActive = false;

  const commandEl = $('#command');
  if (commandEl) { commandEl.textContent = "Let's Play!"; commandEl.style.color = ''; }

  enableGameButtons();
  gameActive = true;
  lockChips(true);

  // Deal 2 cards each
  drawCard(You);
  drawCard(Dealer);
  drawCard(You);
  drawCard(Dealer);

  // Evaluate which special actions are available
  evaluateSpecialActions();

  // Blackjack on deal?
  if (You.score === 21 && You.cards.length === 2) {
    showToast('Blackjack! 🃏');
    setTimeout(() => endRound(findWinner()), 600);
  }
}

// ── Rules toggle ──────────────────────────────────────────────────────────────

function toggleRules() {
  const box      = document.getElementById('rules-box');
  const btn      = document.getElementById('rules-btn');
  const isHidden = box.hasAttribute('hidden');
  if (isHidden) box.removeAttribute('hidden');
  else box.setAttribute('hidden', '');
  btn.setAttribute('aria-expanded', String(isHidden));
}

document.addEventListener('click', e => {
  const box = document.getElementById('rules-box');
  const btn = document.getElementById('rules-btn');
  if (!box || !btn) return;
  if (!box.hasAttribute('hidden') && !box.contains(e.target) && e.target !== btn) {
    box.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', 'false');
  }
});

// ── Event listeners ───────────────────────────────────────────────────────────

document.getElementById('hit').addEventListener('click',        BJhit);
document.getElementById('stand').addEventListener('click',      BJstand);
document.getElementById('deal').addEventListener('click',       BJdeal);
document.getElementById('rules-btn').addEventListener('click',  toggleRules);
document.getElementById('play-again').addEventListener('click', () => {
  if (Bet.current <= 0 && Bet.last > 0 && Bet.last <= Bet.balance) {
    Bet.current = Bet.last; // auto-repeat last bet for convenience
    renderBetUI();
  }
  BJdeal();
});

document.getElementById('reset-score').addEventListener('click', () => {
  BJgame.wins = BJgame.losses = BJgame.draws = 0;
  updateScoreboard();
});

// Hover tink sound on action buttons
const actionGroup = document.querySelector('.action-buttons');
if (actionGroup) {
  actionGroup.addEventListener('mouseover', e => {
    if (e.target.classList.contains('btn') && !e.target.disabled) {
      playSound('tink');
    }
  });
}

// ── Initialise ────────────────────────────────────────────────────────────────

disableGameButtons();
setSpecialButtons(false, false);
renderBetUI();
