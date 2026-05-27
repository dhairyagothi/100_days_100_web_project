const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨']; // 9 pairs = 18 cards
let cardsArray = [...emojis, ...emojis];
let firstCard = null;
let secondCard = null;
let busy = false;
let moves = 0;
let matchedPairs = 0;
let timeLeft = 60;
let timerId = null;
let isPlaying = false;
let hasStarted = false;

const board = document.getElementById('game-board');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const timeEl = document.getElementById('time');
const bestScoreEl = document.getElementById('best-score');
const restartBtn = document.getElementById('restart-btn');
const resetBtn = document.getElementById('reset-btn');
const gameMessage = document.getElementById('game-message');
const messageTitle = document.getElementById('message-title');
const messageDesc = document.getElementById('message-desc');
const playAgainBtn = document.getElementById('play-again-btn');

// Initialize best score from localStorage
let bestScore = localStorage.getItem('memoryBest') || null;
updateBestScoreDisplay();

restartBtn.addEventListener('click', restartGame);
resetBtn.addEventListener('click', hardReset);
playAgainBtn.addEventListener('click', restartGame);

function initBoard() {
    board.innerHTML = '';
    shuffle(cardsArray);
    
    cardsArray.forEach((emoji) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = emoji;
        
        const back = document.createElement('div');
        back.classList.add('card-face', 'card-back');
        
        const front = document.createElement('div');
        front.classList.add('card-face', 'card-front');
        front.textContent = emoji;
        
        card.appendChild(back);
        card.appendChild(front);
        
        card.addEventListener('click', () => onCardClick(card));
        board.appendChild(card);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    hasStarted = true;
    isPlaying = true;
    clearInterval(timerId);
    timerId = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function restartGame() {
    hasStarted = false;
    isPlaying = false;
    moves = 0;
    matchedPairs = 0;
    timeLeft = 60;
    firstCard = null;
    secondCard = null;
    busy = false;
    
    movesEl.textContent = moves;
    pairsEl.textContent = matchedPairs;
    timeEl.textContent = timeLeft;
    
    gameMessage.classList.add('hidden');
    clearInterval(timerId);
    
    initBoard();
}

function onCardClick(card) {
    if (busy || card === firstCard || card.classList.contains('matched')) return;

    if (!hasStarted) {
        startTimer(); // Game starts automatically on first card flip
    }

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        moves++;
        movesEl.textContent = moves;
        checkForMatch();
    }
}

function checkForMatch() {
    busy = true;
    
    if (firstCard.dataset.value === secondCard.dataset.value) {
        // Match
        setTimeout(() => {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            resetSelection();
            matchedPairs++;
            pairsEl.textContent = matchedPairs;
            
            if (matchedPairs === emojis.length) {
                endGame(true);
            }
        }, 300);
    } else {
        // Mismatch
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetSelection();
        }, 800);
    }
}

function resetSelection() {
    firstCard = null;
    secondCard = null;
    busy = false;
}

function endGame(won) {
    isPlaying = false;
    hasStarted = false;
    clearInterval(timerId);
    
    gameMessage.classList.remove('hidden');
    
    if (won) {
        messageTitle.textContent = 'You Won! 🎉';
        messageDesc.textContent = `Completed in ${moves} moves with ${timeLeft}s left.`;
        
        if (!bestScore || moves < bestScore) {
            bestScore = moves;
            localStorage.setItem('memoryBest', bestScore);
            messageDesc.innerHTML += '<br><strong style="color:#10b981;">New Best Score!</strong>';
            updateBestScoreDisplay();
        }
    } else {
        messageTitle.textContent = 'Game Over ❌';
        messageDesc.textContent = 'Time ran out!';
    }
}

function hardReset() {
    localStorage.removeItem('memoryBest');
    bestScore = null;
    updateBestScoreDisplay();
    restartGame();
}

function updateBestScoreDisplay() {
    bestScoreEl.textContent = bestScore ? bestScore : '-';
}

// Initialize the board on page load
initBoard();
