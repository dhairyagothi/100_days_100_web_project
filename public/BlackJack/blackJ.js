/**
 * blackJ.js ΓÇö BlackJack game logic, UI state, and event handling.
 */

/**
 * Card face values for all four suits.
 * Aces use [1, 11] ΓÇö the higher value is applied unless it causes a bust.
 * Defined at module level to prevent accidental mutation during resets.
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

/**
 * Returns a fresh 52-card deck for the start of each round.
 * @returns {string[]}
 */
function freshDeck() {
  return [
    '2C','3C','4C','5C','6C','7C','8C','9C','10C','KC','QC','JC','AC',
    '2D','3D','4D','5D','6D','7D','8D','9D','10D','KD','QD','JD','AD',
    '2H','3H','4H','5H','6H','7H','8H','9H','10H','KH','QH','JH','AH',
    '2S','3S','4S','5S','6S','7S','8S','9S','10S','KS','QS','JS','AS'
  ];
}

/** Central game state. CARD_VALUES is excluded to prevent reset overwrites. */
const BJgame = {
  you: {
    scoreSpan:     '#yourscore',
    cardContainer: '#your-cards',
    score: 0
  },
  dealer: {
    scoreSpan:     '#dealerscore',
    cardContainer: '#dealer-cards',
    score: 0
  },
  cards:  freshDeck(),
  wins:   0,
  losses: 0,
  draws:  0
};

const You    = BJgame.you;
const Dealer = BJgame.dealer;

/**
 * Single source of truth for whether a round is in progress.
 * Prevents duplicate findWinner() calls and stray Hit/Stand actions.
 * true  ΓåÆ round active; false ΓåÆ awaiting Deal or Play Again.
 */
let gameActive = false;

// Audio ΓÇö declared at module level; const is not hoisted so order matters.
const hitsound  = new Audio('./static/sounds/swish.m4a');
const tink      = new Audio('./static/sounds/tink.wav');
const winSound  = new Audio('./static/sounds/cash.mp3');
const cheers    = new Audio('./static/sounds/cheer.wav');
const loseSound = new Audio('./static/sounds/aww.mp3');
const drawSound = new Audio('./static/sounds/ohh.mp3');

/** @param {string} selector @returns {Element|null} */
const $ = selector => document.querySelector(selector);

// ΓöÇΓöÇ Button helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

/** Disables Hit and Stand at round end so stale clicks are rejected. */
function disableGameButtons() {
  ['#hit', '#stand'].forEach(sel => {
    const btn = $(sel);
    btn.disabled = true;
    btn.setAttribute('aria-disabled', 'true');
    btn.style.opacity = '0.4';
    btn.style.cursor  = 'not-allowed';
  });
}

/** Re-enables Hit and Stand at the start of each new round. */
function enableGameButtons() {
  ['#hit', '#stand'].forEach(sel => {
    const btn = $(sel);
    btn.disabled = false;
    btn.setAttribute('aria-disabled', 'false');
    btn.style.opacity = '';
    btn.style.cursor  = '';
  });
}

// ΓöÇΓöÇ Core logic ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

/**
 * Draws one card from the deck for the given player, renders its image,
 * plays the deal sound, and updates the score.
 * @param {Object} activePlayer - You or Dealer state object.
 */
function drawCard(activePlayer) {
  const randomIndex   = Math.floor(Math.random() * BJgame.cards.length);
  const [currentCard] = BJgame.cards.splice(randomIndex, 1);

  const cardImg = document.createElement('img');
  cardImg.src   = `./static/${currentCard}.png`;
  cardImg.alt   = currentCard;
  cardImg.setAttribute('role', 'listitem');
  $(activePlayer.cardContainer).appendChild(cardImg);

  hitsound.currentTime = 0;
  hitsound.play().catch(() => {});

  updateScore(currentCard, activePlayer);
  showScore(activePlayer);
}

/**
 * Adds the drawn card's value to the player's running total.
 * Aces count as 11 only when that keeps the score at 21 or under.
 * @param {string} card
 * @param {Object} activePlayer
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

// Dealer's Logic (2nd player) OR Stand button
document.querySelector('#stand').addEventListener('click', BJstand)

function BJstand(){
    if(You['score']===0){
        alert('Please Hit Some Cards First!');
    }
    else{
        while(Dealer['score']<16){
            drawCard(Dealer);
        }
        setTimeout(function(){
            showresults(findwinner());
            scoreboard();
            
            // Show countdown message
            const countdownEl = document.querySelector('#countdown-message');
            let count = 3;
            countdownEl.textContent = `Resetting in ${count}...`;
            
            // Countdown timer
            const countdownInterval = setInterval(function() {
                count--;
                if (count > 0) {
                    countdownEl.textContent = `Resetting in ${count}...`;
                } else {
                    countdownEl.textContent = '';
                    clearInterval(countdownInterval);
                }
            }, 1000);
            
            // Auto-trigger Play Again after 3 seconds
            setTimeout(function(){
                BJdeal();
            }, 3000);
        }, 800); 
    }
}
// Rules button

document.querySelector('#rules-btn')
.addEventListener('click', ()=>{

let box =
document.querySelector('#rules-box');

if(box.style.display==="none"){
box.style.display="block";
}

// ΓöÇΓöÇ Round resolution ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

/**
 * Compares final scores and increments the matching lifetime counter.
 * @returns {Object|undefined} Winning player object, or undefined on a draw.
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
  BJgame.draws++; // Both bust
  return undefined;
}

/**
 * Updates the status message and plays the matching sound for the outcome.
 * @param {Object|undefined} winner
 */
function showResults(winner) {
  const el = $('#command');

  if (winner === You) {
    el.textContent = '≡ƒÅå You Won!';
    el.style.color = '#4caf7d';
    winSound.play().catch(() => {});
    cheers.volume = 0.4; // Must be set before play() to avoid volume spike
    cheers.play().catch(() => {});
  } else if (winner === Dealer) {
    el.textContent = '≡ƒÿö You Lost!';
    el.style.color = '#e05252';
    loseSound.play().catch(() => {});
  } else {
    el.textContent = "≡ƒñ¥ It's a Draw!";
    el.style.color = '#f0b429';
    drawSound.play().catch(() => {});
  }
}

/** Animates the wins/losses/draws counters after each round. */
function updateScoreboard() {
  [
    ['#wins',   BJgame.wins],
    ['#losses', BJgame.losses],
    ['#draws',  BJgame.draws]
  ].forEach(([sel, val]) => {
    const el = $(sel);
    el.textContent     = val;
    el.style.transform = 'scale(1.3)';
    setTimeout(() => { el.style.transform = ''; }, 250);
  });
}

/**
 * Finalises a round: locks gameActive, disables actions, shows result.
 * @param {Object|undefined} winner
 */
function endRound(winner) {
  gameActive = false;
  disableGameButtons();
  showResults(winner);
  updateScoreboard();
}

// ΓöÇΓöÇ Button handlers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

/**
 * Draws one card for the player.
 * Auto-resolves the round if the player busts ΓÇö no Stand click required.
 */
function BJhit() {
  if (!gameActive) return;

  drawCard(You);

  if (You.score > 21) {
    setTimeout(() => endRound(findWinner()), 400);
  }
}

/**
 * Ends the player's turn and runs the dealer's automated draw.
 * Dealer draws until reaching 17 or higher (standard Blackjack rules).
 */
function BJstand() {
  if (!gameActive) return;

  while (Dealer.score < 17) {
    drawCard(Dealer);
  }

  setTimeout(() => endRound(findWinner()), 800);
}

/**
 * Starts a new round if none is active.
 * Blocks mid-round deal attempts with an alert.
 */
function BJdeal() {
  if (gameActive) {
    alert('Finish the current round before dealing again.');
    return;
  }

  startNewRound();
}

/**
 * Resets board state for a fresh round without clearing the scoreboard.
 * Extracted from BJdeal() so Play Again can call it without triggering deal guards.
 */
function startNewRound() {
  ['#your-cards', '#dealer-cards'].forEach(sel => {
    $(sel).querySelectorAll('img').forEach(img => img.remove());
  });

  BJgame.cards = freshDeck();

  [You, Dealer].forEach(player => {
    player.score = 0;
    const el = $(player.scoreSpan);
    el.textContent = 0;
    el.style.color = '';
  });

  const commandEl = $('#command');
  commandEl.textContent = "Round started! Click Hit to draw a card.";
  commandEl.style.color = '';

  enableGameButtons();
  gameActive = true;
}

// ΓöÇΓöÇ Rules toggle ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

/** Toggles the rules panel and keeps aria-expanded in sync. */
function toggleRules() {
  const box      = $('#rules-box');
  const btn      = $('#rules-btn');
  const isHidden = box.hasAttribute('hidden');

  box[isHidden ? 'removeAttribute' : 'setAttribute']('hidden', '');
  btn.setAttribute('aria-expanded', String(isHidden));
}

// ΓöÇΓöÇ Event listeners ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

$('#hit').addEventListener('click',   BJhit);
$('#stand').addEventListener('click', BJstand);
$('#deal').addEventListener('click',  BJdeal);
$('#rules-btn').addEventListener('click', toggleRules);
$('#play-again').addEventListener('click', startNewRound);

$('#reset-score').addEventListener('click', () => {
  BJgame.wins = BJgame.losses = BJgame.draws = 0;
  updateScoreboard();
});

// Hover sound delegated to the button group to avoid per-button listeners
document.querySelector('.action-buttons').addEventListener('mouseover', e => {
  if (e.target.classList.contains('btn') && !e.target.disabled) {
    tink.currentTime = 0;
    tink.play().catch(() => {});
  }
});

// Initialise with buttons disabled ΓÇö Deal opens the first round
disableGameButtons();
});
