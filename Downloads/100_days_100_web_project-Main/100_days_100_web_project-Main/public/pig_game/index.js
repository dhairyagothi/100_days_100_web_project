// DOM Elements
const DOM = {
    roll: document.querySelector('.roll'),
    hold: document.querySelector('.hold'),
    newGame: document.querySelector('.new'),
    players: {
        0: document.querySelector('.player--0'),
        1: document.querySelector('.player--1')
    },
    dice: document.querySelector('.dice'),
    scores: {
        0: document.querySelector('.score--0'),
        1: document.querySelector('.score--1')
    },
    currentScores: {
        0: document.querySelector('.current--0'),
        1: document.querySelector('.current--1')
    },
    winners: {
        0: document.querySelector('.win--0'),
        1: document.querySelector('.win--1')
    }
};

// Game Configuration
const CONFIG = {
    WINNING_SCORE: 100,
    DICE_IMAGES: ['', 'dice-1', 'dice-2', 'dice-3', 'dice-4', 'dice-5', 'dice-6']
};

// Game State
let state = {
    scores: [0, 0],
    currentScore: 0,
    activePlayer: 0,
    isPlaying: true
};

// Helper Functions
const updateDiceDisplay = (value) => {
    DOM.dice.innerHTML = `<img src='${CONFIG.DICE_IMAGES[value]}.png' width="150" alt="Dice showing ${value}">`;
    DOM.dice.classList.remove('hidden');
};

const updateScore = (player, score) => {
    DOM.scores[player].textContent = score;
};

const updateCurrentScore = (player, score) => {
    DOM.currentScores[player].textContent = score;
};

const togglePlayerActive = () => {
    DOM.players[0].classList.toggle('player--active');
    DOM.players[1].classList.toggle('player--active');
};

const handleWinner = (player) => {
    state.isPlaying = false;
    DOM.dice.classList.add('hidden');
    DOM.winners[player].classList.remove('hidden');
    DOM.players[player].classList.add('player--winner');
    DOM.players[player].classList.remove('player--active');
};

// Game Logic Functions
const switchPlayer = () => {
    updateCurrentScore(state.activePlayer, 0);
    state.currentScore = 0;
    state.activePlayer = state.activePlayer === 0 ? 1 : 0;
    togglePlayerActive();
};

const initGame = () => {
    // Reset game state
    state = {
        scores: [0, 0],
        currentScore: 0,
        activePlayer: 0,
        isPlaying: true
    };

    // Reset UI
    [0, 1].forEach(player => {
        updateCurrentScore(player, 0);
        updateScore(player, 0);
        DOM.winners[player].classList.add('hidden');
        DOM.players[player].classList.remove('player--winner');
    });

    DOM.dice.classList.add('hidden');
    DOM.players[0].classList.add('player--active');
    DOM.players[1].classList.remove('player--active');
};

// Event Handlers
const handleRoll = () => {
    if (!state.isPlaying) return;

    const diceValue = Math.trunc(Math.random() * 6) + 1;
    updateDiceDisplay(diceValue);

    if (diceValue !== 1) {
        state.currentScore += diceValue;
        updateCurrentScore(state.activePlayer, state.currentScore);
    } else {
        switchPlayer();
    }
};

const handleHold = () => {
    if (!state.isPlaying) return;

    state.scores[state.activePlayer] += state.currentScore;
    updateScore(state.activePlayer, state.scores[state.activePlayer]);

    if (state.scores[state.activePlayer] >= CONFIG.WINNING_SCORE) {
        handleWinner(state.activePlayer);
    } else {
        switchPlayer();
    }
};

// Event Listeners
DOM.roll.addEventListener('click', handleRoll);
DOM.hold.addEventListener('click', handleHold);
DOM.newGame.addEventListener('click', initGame);

// Initialize game on load
initGame();