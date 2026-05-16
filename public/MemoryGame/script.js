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

// Flip card function
function flipCard(event) {
    if (lockBoard) return;

    const clickedCard = event.currentTarget;
    clickedCard.classList.add('flipped');

    if (!firstCard) {
        firstCard = clickedCard;
    } else if (!secondCard && clickedCard !== firstCard) {
        secondCard = clickedCard;
        checkForMatch();
    }
}

// Check for matching cards
function checkForMatch() {
    lockBoard = true;

    const firstEmoji = firstCard.querySelector('.card-back').innerHTML;
    const secondEmoji = secondCard.querySelector('.card-back').innerHTML;

    if (firstEmoji === secondEmoji) {
        disableCards();
        updateScore();
    } else {
        unflipCards();
    }
}

// Disable matched cards
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

// Unflip cards if they don't match
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Update the score based on matching pairs
function updateScore() {
    matchesCount++;
    document.getElementById('score-board').innerHTML = `✅ Matches: ${matchesCount} / ${totalPairs}`;
    
    // Check for victory
    if (matchesCount === totalPairs) {
        setTimeout(() => {
            const scoreBoard = document.getElementById('score-board');
            scoreBoard.classList.add('victory');
            alert('🎉🎊 CONGRATULATIONS! You matched all pairs! 🎊🎉');
            scoreBoard.innerHTML = '🏆 VICTORY! 🏆 <br> ✅ Matches: ' + matchesCount + ' / ' + totalPairs;
            
            // Reset game after victory
            setTimeout(() => {
                resetGame();
            }, 2000);
        }, 200);
    }
}

// Reset variables and unlock board
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Reset entire game
function resetGame() {
    // Clear the container
    gameContainer.innerHTML = '';
    // Reset variables
    matchesCount = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    // Update score display
    document.getElementById('score-board').innerHTML = `✅ Matches: 0 / ${totalPairs}`;
    document.getElementById('score-board').classList.remove('victory');
    // Recreate cards
    createCards();
    // Reattach event listeners
    cards.forEach(card => {
        card.addEventListener('click', function(event) {
            if (!card.classList.contains('flipped')) {
                flipCard({currentTarget: card});
            }
        });
    });
}

// Initialize the game
createCards();

// Event listener for clicking on cards
gameContainer.addEventListener('click', function(event) {
    const clickedCard = event.target.closest('.card');
    if (clickedCard && !clickedCard.classList.contains('flipped')) {
        flipCard({currentTarget: clickedCard});
    }
});
