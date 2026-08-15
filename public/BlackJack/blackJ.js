/**
 * blackJ.js — BlackJack game logic, UI state, and event handling.
 * Features: core game, betting system, chip UI, Double Down, Split,
 *           custom chip, round history, AI explanations, theme switcher.
 */

'use strict';

// ── Card data ────────────────────────────────────────────────────────────────

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

function freshDeck() {
  return [
    '2C','3C','4C','5C','6C','7C','8C','9C','10C','KC','QC','JC','AC',
    '2D','3D','4D','5D','6D','7D','8D','9D','10D','KD','QD','JD','AD',
    '2H','3H','4H','5H','6H','7H','8H','9H','10H','KH','QH','JH','AH',
    '2S','3S','4S','5S','6S','7S','8S','9S','10S','KS','QS','JS','AS'
  ];
}

function cardRank(card) { return card.slice(0, -1); }

// ── Core game state ──────────────────────────────────────────────────────────

const BJgame = {
  you:    { scoreSpan: '#yourscore',    cardContainer: '#your-cards',   score: 0, cards: [] },
  dealer: { scoreSpan: '#dealerscore',  cardContainer: '#dealer-cards', score: 0, cards: [] },
  deck:   freshDeck(),
  wins: 0, losses: 0, draws: 0
};

const You    = BJgame.you;
const Dealer = BJgame.dealer;
let gameActive = false;

// ── Betting state ────────────────────────────────────────────────────────────

const Bet = { balance: 1000, current: 0, last: 0, deducted: false };

// ── Split state ──────────────────────────────────────────────────────────────

const Split = { active: false, hands: [[], []], scores: [0, 0], activeIdx: 0, bet: 0 };

// ── Double Down state ────────────────────────────────────────────────────────

let doubleDownActive = false;

// ── Round context (for history + AI) ─────────────────────────────────────────

let roundCtx = { playerCards: [], dealerCards: [], playerScore: 0, dealerScore: 0, action: 'stand', bet: 0 };
const roundHistory = [];

// ── Audio ─────────────────────────────────────────────────────────────────────

const sounds = {
  hit:   document.getElementById('snd-hit'),
  tink:  document.getElementById('snd-tink'),
  win:   document.getElementById('snd-win'),
  cheer: document.getElementById('snd-cheer'),
  lose:  document.getElementById('snd-lose'),
  draw:  document.getElementById('snd-draw')
};
function playSound(key) {
  const s = sounds[key]; if (!s) return;
  s.currentTime = 0; s.play().catch(() => {});
}

// ── DOM helpers ───────────────────────────────────────────────────────────────

const $ = sel => document.querySelector(sel);

function showToast(msg, durationMs = 2400) {
  const el = document.getElementById('bjToast'); if (!el) return;
  el.textContent = msg; el.classList.add('show');
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
  const el = document.getElementById('lastResultDisplay'); if (!el) return;
  el.textContent = text; el.style.color = color || '';
}

// ── Chip rail ─────────────────────────────────────────────────────────────────

function lockChips(locked) {
  document.querySelectorAll('.chip').forEach(c => {
    c.disabled = locked;
    c.style.opacity = locked ? '0.4' : '';
    c.style.cursor  = locked ? 'not-allowed' : '';
  });
  const addBtn = document.getElementById('customChipAdd');
  const inp    = document.getElementById('customChipInput');
  if (addBtn) addBtn.disabled = locked;
  if (inp)    inp.disabled    = locked;
}

document.getElementById('chipRail').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip || chip.disabled) return;
  if (chip.id === 'customChipBtn') return; // handled by custom chip setup

  const val = parseInt(chip.dataset.val, 10);
  if (Bet.current + val > Bet.balance) { showToast('Not enough balance for that chip'); return; }
  Bet.current += val;
  renderBetUI();
  chip.classList.add('chip--pop');
  setTimeout(() => chip.classList.remove('chip--pop'), 200);
});

document.getElementById('clearBetBtn').addEventListener('click', () => {
  if (gameActive) return;
  Bet.current = 0; renderBetUI();
});

document.getElementById('repeatBetBtn').addEventListener('click', () => {
  if (gameActive) return;
  if (!Bet.last) { showToast('No previous bet to repeat'); return; }
  if (Bet.last > Bet.balance) { showToast('Not enough balance'); return; }
  Bet.current = Bet.last; renderBetUI();
});

document.getElementById('refillBtn').addEventListener('click', () => {
  if (gameActive) { showToast('Finish this round first'); return; }
  Bet.balance = 1000; Bet.current = 0; Bet.last = 0;
  setLastResult('—'); renderBetUI();
  showToast('Balance refilled to $1,000');
});

// ── Custom chip ───────────────────────────────────────────────────────────────

(function setupCustomChip() {
  const btn    = document.getElementById('customChipBtn');
  const popup  = document.getElementById('customChipPopup');
  const input  = document.getElementById('customChipInput');
  const addBtn = document.getElementById('customChipAdd');
  if (!btn || !popup || !input || !addBtn) return;

  function togglePopup(force) {
    const show = (force !== undefined) ? force : popup.hasAttribute('hidden');
    if (show) { popup.removeAttribute('hidden'); input.focus(); input.select(); }
    else popup.setAttribute('hidden', '');
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    if (btn.disabled) return;
    togglePopup();
    btn.classList.add('chip--pop');
    setTimeout(() => btn.classList.remove('chip--pop'), 200);
  });

  function applyCustomBet() {
    const val = parseInt(input.value, 10);
    if (!val || val < 1) { showToast('Enter a valid amount'); return; }
    if (Bet.current + val > Bet.balance) { showToast('Amount exceeds your balance'); return; }
    Bet.current += val; renderBetUI();
    input.value = '';
    togglePopup(false);
    showToast('+$' + val + ' added to bet');
  }

  addBtn.addEventListener('click', applyCustomBet);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') applyCustomBet(); });
  document.addEventListener('click', e => {
    if (!popup.hasAttribute('hidden') && !popup.contains(e.target) && e.target !== btn)
      togglePopup(false);
  });
})();

// ── Special action buttons ─────────────────────────────────────────────────────

function setSpecialButtons(canDouble, canSplit) {
  const dBtn = document.getElementById('doubleBtn');
  const sBtn = document.getElementById('splitBtn');
  if (dBtn) { dBtn.disabled = !canDouble; dBtn.style.opacity = canDouble ? '' : '0.38'; }
  if (sBtn) { sBtn.disabled = !canSplit;  sBtn.style.opacity = canSplit  ? '' : '0.38'; }
}

function evaluateSpecialActions() {
  const twoCards      = You.cards.length === 2;
  const hasBudget     = Bet.current <= Bet.balance;
  const matchingRanks = twoCards && cardRank(You.cards[0]) === cardRank(You.cards[1]);
  setSpecialButtons(twoCards && hasBudget, twoCards && hasBudget && matchingRanks);
}

// ── Double Down ───────────────────────────────────────────────────────────────

document.getElementById('doubleBtn').addEventListener('click', () => {
  if (!gameActive || You.cards.length !== 2) return;
  if (Bet.current > Bet.balance) { showToast('Insufficient balance to double'); return; }
  Bet.balance -= Bet.current;
  Bet.current *= 2;
  doubleDownActive = true;
  roundCtx.action  = 'double';
  renderBetUI();
  setSpecialButtons(false, false);
  showToast('Doubled! Drawing one card…');
  drawCard(You);
  if (You.score > 21) { setTimeout(() => endRound(findWinner()), 400); }
  else                { setTimeout(() => BJstand(), 700); }
});

// ── Split ─────────────────────────────────────────────────────────────────────

document.getElementById('splitBtn').addEventListener('click', () => {
  if (!gameActive || You.cards.length !== 2) return;
  if (cardRank(You.cards[0]) !== cardRank(You.cards[1])) { showToast('Can only split matching ranks'); return; }
  if (Bet.current > Bet.balance) { showToast('Insufficient balance for split'); return; }
  Bet.balance -= Bet.current;
  Split.bet    = Bet.current;
  roundCtx.action = 'split';
  renderBetUI();
  Split.hands[0]  = [You.cards[0], drawCardFromDeck()];
  Split.hands[1]  = [You.cards[1], drawCardFromDeck()];
  Split.scores[0] = calcHandScore(Split.hands[0]);
  Split.scores[1] = calcHandScore(Split.hands[1]);
  Split.active    = true;
  Split.activeIdx = 0;
  $('#your-cards').querySelectorAll('img').forEach(img => img.remove());
  You.score = 0;
  $(You.scoreSpan).textContent = 0;
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
  const sec = document.getElementById('splitSection'); if (sec) sec.hidden = false;
  renderSplitHand(0); renderSplitHand(1); activateSplitHand(0);
}

function renderSplitHand(idx) {
  const container = document.getElementById('splitCards' + idx); if (!container) return;
  container.innerHTML = '';
  Split.hands[idx].forEach(card => {
    const img = document.createElement('img');
    img.src = `./static/${card}.png`; img.alt = card;
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
  const sec = document.getElementById('splitSection'); if (sec) sec.hidden = true;
}

function settleSplitBets(dealerScore, dealerBust) {
  let netChange = 0;
  const parts   = [];
  Split.hands.forEach((hand, i) => {
    const s = Split.scores[i], bust = s > 21, b = Split.bet;
    if (!bust && (dealerBust || s > dealerScore)) { netChange += b; parts.push(`Hand ${i+1}: Win +$${b}`); }
    else if (!bust && !dealerBust && s === dealerScore) { parts.push(`Hand ${i+1}: Push`); }
    else { netChange -= b; parts.push(`Hand ${i+1}: Loss -$${b}`); }
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
    const btn = $(sel); if (!btn) return;
    btn.disabled = true; btn.setAttribute('aria-disabled', 'true');
    btn.style.opacity = '0.4'; btn.style.cursor = 'not-allowed';
  });
}

function enableGameButtons() {
  ['#hit', '#stand'].forEach(sel => {
    const btn = $(sel); if (!btn) return;
    btn.disabled = false; btn.setAttribute('aria-disabled', 'false');
    btn.style.opacity = ''; btn.style.cursor = '';
  });
}

// ── Core logic ────────────────────────────────────────────────────────────────

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

function updateScore(card, activePlayer) {
  const value = CARD_VALUES[card];
  if (Array.isArray(value)) {
    activePlayer.score += (activePlayer.score + value[1] <= 21) ? value[1] : value[0];
  } else {
    activePlayer.score += value;
  }
}

function showScore(activePlayer) { $(activePlayer.scoreSpan).textContent = activePlayer.score; }

// ── Round resolution ──────────────────────────────────────────────────────────

function findWinner() {
  const youBust = You.score > 21, dealerBust = Dealer.score > 21;
  if (!youBust && (dealerBust || Dealer.score < You.score)) { BJgame.wins++;   return You; }
  if (!youBust && !dealerBust && Dealer.score === You.score){ BJgame.draws++;  return undefined; }
  if (!dealerBust && (youBust || You.score < Dealer.score)) { BJgame.losses++; return Dealer; }
  BJgame.draws++; return undefined;
}

function showResults(winner) {
  const el = $('#command'); if (!el) return;
  if (winner === You) {
    el.textContent = '🏅 You Won!'; el.style.color = '#4caf7d';
    playSound('win'); sounds.cheer && (sounds.cheer.volume = 0.4); playSound('cheer');
  } else if (winner === Dealer) {
    el.textContent = '😖 You Lost!'; el.style.color = '#e05252'; playSound('lose');
  } else {
    el.textContent = "🤝 It's a Draw!"; el.style.color = '#f0b429'; playSound('draw');
  }
}

function updateScoreboard() {
  [['#wins', BJgame.wins], ['#losses', BJgame.losses], ['#draws', BJgame.draws]].forEach(([sel, val]) => {
    const el = $(sel); if (!el) return;
    el.textContent = val; el.style.transform = 'scale(1.3)';
    setTimeout(() => { el.style.transform = ''; }, 250);
  });
}

function settleBet(winner) {
  let netChange = 0;
  if (winner === You) {
    const isBlackjack = You.cards.length === 2 && You.score === 21;
    const payout = isBlackjack ? Math.floor(Bet.current * 2.5) : Bet.current * 2;
    netChange = payout;
    setLastResult(`Win! +$${payout - Bet.current}`, '#1d9e75');
  } else if (winner === undefined) {
    netChange = Bet.current;
    setLastResult('Push — bet returned', '#ba7517');
  } else {
    netChange = 0;
    setLastResult(`Loss — -$${Bet.current}`, '#e24b4a');
  }
  Bet.last    = Bet.current;
  Bet.balance += netChange;
  Bet.current  = 0;
  Bet.deducted = false;
  renderBetUI(); lockChips(false); setSpecialButtons(false, false); doubleDownActive = false;
  if (Bet.balance <= 0) showToast("You're out of chips! Click Refill to keep playing.", 4000);
}

function endRound(winner) {
  gameActive = false;
  disableGameButtons();
  showResults(winner);
  updateScoreboard();

  // Snapshot for history
  roundCtx.playerScore = You.score;
  roundCtx.dealerScore = Dealer.score;
  roundCtx.playerCards = [...You.cards];
  roundCtx.dealerCards = [...Dealer.cards];
  if (You.score > 21) roundCtx.action = 'bust';
  if (You.cards.length === 2 && You.score === 21) roundCtx.action = 'blackjack';

  if (Split.active) {
    settleSplitBets(Dealer.score, Dealer.score > 21);
    Bet.current = 0; Bet.deducted = false; Split.active = false;
    renderBetUI(); lockChips(false); setSpecialButtons(false, false);
    addHistoryEntry(winner, roundCtx, true);
  } else {
    addHistoryEntry(winner, roundCtx, false);
    settleBet(winner);
  }
}

// ── AI Result Explanation ─────────────────────────────────────────────────────

function generateAIExplanation(winner, ctx, isSplit) {
  const ps = ctx.playerScore, ds = ctx.dealerScore;
  const pb = ps > 21, db = ds > 21;

  if (isSplit) {
    return `You split your hand. Dealer finished on ${ds}${db ? ' (bust)' : ''}. ` +
           `Each hand was settled independently against the dealer's total.`;
  }
  if (ctx.action === 'blackjack') {
    return `Natural Blackjack! You hit 21 with your opening two cards (${ctx.playerCards.join(', ')}), ` +
           `paying 1.5× your bet. Dealer stood at ${ds}.`;
  }
  if (pb && db) {
    return `Both you (${ps}) and the dealer (${ds}) busted — a rare double-bust ends in a push.`;
  }
  if (pb) {
    const last = ctx.playerCards[ctx.playerCards.length - 1];
    return `You busted on ${ps} by drawing ${last}, taking you over 21. ` +
           `Dealer didn't need to act further — automatic loss.`;
  }
  if (db) {
    return `Dealer busted at ${ds} while drawing to meet the 17+ rule. ` +
           `Your hand of ${ps} held strong for the win.`;
  }
  if (winner === undefined) {
    return `Both you and the dealer finished on ${ps}. It's a push — no chips change hands.`;
  }
  if (winner === You) {
    if (ctx.action === 'double') {
      return `Bold double down! You drew to ${ps} — beating the dealer's ${ds}. Doubled payout earned.`;
    }
    return `You stood on ${ps} while the dealer drew to ${ds}. ` +
           `Your higher total wins the round.`;
  }
  // Dealer wins
  if (ctx.action === 'double') {
    return `You doubled down and drew to ${ps}, but the dealer reached ${ds}. ` +
           `Despite the bold move, the dealer's higher total takes the round.`;
  }
  if (ctx.action === 'stand') {
    return `You stood on ${ps}, hoping the dealer would bust. ` +
           `Instead they drew to ${ds}, which beats your hand — a tough one.`;
  }
  return `You hit to ${ps}, but the dealer's ${ds} is higher. Better luck next time.`;
}

// ── History log ───────────────────────────────────────────────────────────────

function addHistoryEntry(winner, ctx, isSplit) {
  const roundNum = roundHistory.length + 1;
  const bet = ctx.bet;
  let resultLabel, resultClass, netText;

  if (isSplit) {
    resultLabel = 'Split'; resultClass = 'hist-split'; netText = '';
  } else if (winner === You) {
    const isBlackjack = ctx.action === 'blackjack';
    const profit = isBlackjack ? Math.floor(bet * 1.5) : bet;
    resultLabel = isBlackjack ? 'Blackjack!' : 'Win';
    resultClass = 'hist-win'; netText = '+$' + profit;
  } else if (winner === undefined) {
    resultLabel = 'Push'; resultClass = 'hist-draw'; netText = '$0';
  } else {
    resultLabel = 'Loss'; resultClass = 'hist-loss'; netText = '-$' + bet;
  }

  const explanation = generateAIExplanation(winner, ctx, isSplit);
  const entry = {
    roundNum, resultLabel, resultClass, netText,
    playerScore: ctx.playerScore, dealerScore: ctx.dealerScore,
    bet, explanation,
    playerCards: ctx.playerCards.slice(),
    dealerCards: ctx.dealerCards.slice()
  };
  roundHistory.unshift(entry);
  renderHistoryEntry(entry, true);

  const empty = document.getElementById('historyEmpty');
  if (empty) empty.style.display = 'none';
}

function renderHistoryEntry(entry, prepend) {
  const list = document.getElementById('historyList'); if (!list) return;
  const card = document.createElement('div');
  card.className = 'hist-card';
  card.innerHTML =
    '<div class="hist-top">' +
      '<span class="hist-round">Round #' + entry.roundNum + '</span>' +
      '<span class="hist-result ' + entry.resultClass + '">' + entry.resultLabel + '</span>' +
      '<span class="hist-bet">Bet: $' + entry.bet.toLocaleString() + '</span>' +
      '<span class="hist-net ' + entry.resultClass + '">' + entry.netText + '</span>' +
      '<span class="hist-scores">You: ' + entry.playerScore + ' · Dealer: ' + entry.dealerScore + '</span>' +
    '</div>' +
    '<div class="hist-ai">' +
      '<span class="hist-ai-label"><i class="ti ti-robot" aria-hidden="true"></i> AI Analysis</span>' +
      '<p class="hist-ai-text">' + entry.explanation + '</p>' +
    '</div>';

  if (prepend && list.firstChild) { list.insertBefore(card, list.firstChild); }
  else { list.appendChild(card); }
  requestAnimationFrame(() => card.classList.add('hist-card--visible'));
}

document.getElementById('historyToggleBtn').addEventListener('click', () => {
  const panel = document.getElementById('historyPanel');
  const btn   = document.getElementById('historyToggleBtn');
  if (!panel || !btn) return;
  const isHidden = panel.hasAttribute('hidden');
  if (isHidden) { panel.removeAttribute('hidden'); btn.setAttribute('aria-expanded', 'true'); }
  else          { panel.setAttribute('hidden', ''); btn.setAttribute('aria-expanded', 'false'); }
});

document.getElementById('historyClearBtn').addEventListener('click', () => {
  roundHistory.length = 0;
  const list = document.getElementById('historyList');
  if (list) list.innerHTML = '<p class="history-empty" id="historyEmpty">No rounds played yet.</p>';
});

// ── Button handlers ───────────────────────────────────────────────────────────

function BJhit() {
  if (!gameActive) return;
  if (Split.active) {
    const idx  = Split.activeIdx;
    const card = drawCardFromDeck();
    Split.hands[idx].push(card);
    Split.scores[idx] = calcHandScore(Split.hands[idx]);
    renderSplitHand(idx);
    playSound('hit');
    if (Split.scores[idx] > 21) { showToast(`Hand ${idx + 1} bust!`); advanceSplitHand(); }
    return;
  }
  drawCard(You);
  if (You.score > 21) { setTimeout(() => endRound(findWinner()), 400); }
  else if (!doubleDownActive) { evaluateSpecialActions(); }
}

function advanceSplitHand() {
  if (Split.activeIdx === 0) { activateSplitHand(1); showToast('Now playing hand 2'); }
  else { runDealerDraw(); }
}

function BJstand() {
  if (!gameActive) return;
  if (Split.active) { advanceSplitHand(); return; }
  runDealerDraw();
}

function runDealerDraw() {
  while (Dealer.score < 17) { drawCard(Dealer); }
  setTimeout(() => endRound(findWinner()), 800);
}

function BJdeal() {
  if (gameActive) { showToast('Finish your current turn first — Hit or Stand before dealing.'); return; }
  if (Bet.current <= 0) { showToast('Place a bet first!'); return; }
  if (Bet.current > Bet.balance) { showToast('Bet exceeds your balance'); return; }
  Bet.balance  -= Bet.current;
  Bet.deducted  = true;
  renderBetUI();
  startNewRound();
}

function startNewRound() {
  ['#your-cards', '#dealer-cards'].forEach(sel => {
    $(sel).querySelectorAll('img').forEach(img => img.remove());
  });
  BJgame.deck = freshDeck();
  [You, Dealer].forEach(player => {
    player.score = 0; player.cards = [];
    const el = $(player.scoreSpan);
    if (el) { el.textContent = 0; el.style.color = ''; }
  });
  Split.active = false; Split.hands = [[], []]; Split.scores = [0, 0];
  Split.activeIdx = 0; Split.bet = 0;
  hideSplitSection();
  doubleDownActive = false;
  roundCtx = { playerCards: [], dealerCards: [], playerScore: 0, dealerScore: 0, action: 'stand', bet: Bet.current };
  const commandEl = $('#command');
  if (commandEl) { commandEl.textContent = "Let's Play!"; commandEl.style.color = ''; }
  enableGameButtons();
  gameActive = true;
  lockChips(true);
  drawCard(You); drawCard(Dealer); drawCard(You); drawCard(Dealer);
  evaluateSpecialActions();
  if (You.score === 21 && You.cards.length === 2) {
    roundCtx.action = 'blackjack';
    showToast('Blackjack! 🃏');
    setTimeout(() => endRound(findWinner()), 600);
  }
}

// ── Rules toggle ──────────────────────────────────────────────────────────────

function toggleRules() {
  const box = document.getElementById('rules-box');
  const btn = document.getElementById('rules-btn');
  const isHidden = box.hasAttribute('hidden');
  if (isHidden) box.removeAttribute('hidden'); else box.setAttribute('hidden', '');
  btn.setAttribute('aria-expanded', String(isHidden));
}

document.addEventListener('click', e => {
  const box = document.getElementById('rules-box');
  const btn = document.getElementById('rules-btn');
  if (!box || !btn) return;
  if (!box.hasAttribute('hidden') && !box.contains(e.target) && e.target !== btn) {
    box.setAttribute('hidden', ''); btn.setAttribute('aria-expanded', 'false');
  }
});

// ── Theme switcher ────────────────────────────────────────────────────────────

(function setupThemeSwitcher() {
  const THEMES = ['classic','dark','neon','velvet','blue','midnight','pastel','hc','gold','retro'];
  const htmlEl    = document.documentElement;
  const toggleBtn = document.getElementById('themeToggleBtn');
  const panel     = document.getElementById('themePanel');
  if (!toggleBtn || !panel) return;

  const saved = localStorage.getItem('bj-theme');
  if (saved && THEMES.includes(saved)) { htmlEl.setAttribute('data-theme', saved); markActive(saved); }

  /**
   * Positions the fixed panel so its right edge aligns with the button's right edge
   * and it opens just below the button — always fully visible inside the viewport.
   */
  function positionPanel() {
    const rect       = toggleBtn.getBoundingClientRect();
    const panelW     = Math.min(320, window.innerWidth - 32); // mirrors CSS min()
    const topVal     = rect.bottom + 8;
    // Right edge of panel = right edge of button; clamp so it never exits the viewport
    const rightVal   = Math.max(8, window.innerWidth - rect.right);

    panel.style.top   = topVal  + 'px';
    panel.style.right = rightVal + 'px';
    panel.style.left  = 'auto';
    panel.style.width = panelW  + 'px';
  }

  toggleBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (panel.hasAttribute('hidden')) {
      panel.removeAttribute('hidden');
      positionPanel();          // position on open
    } else {
      panel.setAttribute('hidden', '');
    }
  });

  // Reposition if the user resizes or scrolls while panel is open
  window.addEventListener('resize', () => {
    if (!panel.hasAttribute('hidden')) positionPanel();
  });
  window.addEventListener('scroll', () => {
    if (!panel.hasAttribute('hidden')) positionPanel();
  }, { passive: true });

  document.querySelectorAll('.theme-swatch').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const theme = btn.dataset.theme;
      htmlEl.setAttribute('data-theme', theme);
      localStorage.setItem('bj-theme', theme);
      markActive(theme);
      panel.setAttribute('hidden', '');
      showToast('Theme: ' + theme.charAt(0).toUpperCase() + theme.slice(1));
    });
  });

  document.addEventListener('click', e => {
    if (!panel.hasAttribute('hidden') && !panel.contains(e.target) && e.target !== toggleBtn)
      panel.setAttribute('hidden', '');
  });

  function markActive(theme) {
    document.querySelectorAll('.theme-swatch').forEach(s => {
      s.classList.toggle('theme-swatch--active', s.dataset.theme === theme);
    });
  }
})();

// ── Event listeners ───────────────────────────────────────────────────────────

document.getElementById('hit').addEventListener('click',        BJhit);
document.getElementById('stand').addEventListener('click',      BJstand);
document.getElementById('deal').addEventListener('click',       BJdeal);
document.getElementById('rules-btn').addEventListener('click',  toggleRules);
document.getElementById('play-again').addEventListener('click', () => {
  if (Bet.current <= 0 && Bet.last > 0 && Bet.last <= Bet.balance) {
    Bet.current = Bet.last; renderBetUI();
  }
  BJdeal();
});
document.getElementById('reset-score').addEventListener('click', () => {
  BJgame.wins = BJgame.losses = BJgame.draws = 0;
  updateScoreboard();
});

const actionGroup = document.querySelector('.action-buttons');
if (actionGroup) {
  actionGroup.addEventListener('mouseover', e => {
    if (e.target.classList.contains('btn') && !e.target.disabled) playSound('tink');
  });
}

// ── Initialise ────────────────────────────────────────────────────────────────

disableGameButtons();
setSpecialButtons(false, false);
renderBetUI();
