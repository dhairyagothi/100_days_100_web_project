// --- Global Game State Variables ---
let userScore = 0;
let computerScore = 0;
let roundsPlayed = 0;
let totalRounds = 0;
const options = ['ROCK', 'PAPER', 'SCISSORS'];

// --- DOM Element Selectors ---
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const roundsInput = document.getElementById('rounds-input');
const startBtn = document.getElementById('start-btn');

const scoreLabel = document.getElementById('score-label');
const roundLabel = document.getElementById('round-label');
const resultLabel = document.getElementById('result-label');
const userChoiceLabel = document.getElementById('user-choice-label');
const correctAnswerLabel = document.getElementById('computer-choice-label'); // matching variable logic

const rockBtn = document.getElementById('rock-btn');
const paperBtn = document.getElementById('paper-btn');
const scissorsBtn = document.getElementById('scissors-btn');
const playAgainBtn = document.getElementById('play-again-btn');

// --- Event Listeners ---
startBtn.addEventListener('click', startGame);
rockBtn.addEventListener('click', () => playRound('ROCK'));
paperBtn.addEventListener('click', () => playRound('PAPER'));
scissorsBtn.addEventListener('click', () => playRound('SCISSORS'));
playAgainBtn.addEventListener('click', resetGame);

// --- Functions ---

function startGame() {
    const rounds = parseInt(roundsInput.value, 10);
    
    if (isNaN(rounds) || rounds <= 0) {
        alert("Invalid Input: Number of rounds must be greater than zero.");
        return;
    }

    // Reset game state for a new game
    totalRounds = rounds;
    userScore = 0;
    computerScore = 0;
    roundsPlayed = 0;

    // Transition screens
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    updateScoreboard();
}

function playRound(userChoice) {
    if (roundsPlayed >= totalRounds) {
        return; // Game is over
    }

    const randomIndex = Math.floor(Math.random() * options.length);
    const computerChoice = options[randomIndex];
    roundsPlayed++;

    // Determine the winner
    let resultText = "";
    let resultColor = "";

    if (userChoice === computerChoice) {
        resultText = "IT'S A DRAW!";
        resultColor = "#f1c40f";
    } else if (
        (userChoice === "ROCK" && computerChoice === "SCISSORS") ||
        (userChoice === "PAPER" && computerChoice === "ROCK") ||
        (userChoice === "SCISSORS" && computerChoice === "PAPER")
    ) {
        resultText = "YOU WON THIS ROUND!";
        userScore++;
        resultColor = "#2ecc71";
    } else {
        resultText = "YOU LOST THIS ROUND!";
        computerScore++;
        resultColor = "#e74c3c";
    }

    // Update labels
    userChoiceLabel.textContent = `Your choice: ${userChoice}`;
    correctAnswerLabel.textContent = `Computer's choice: ${computerChoice}`;
    resultLabel.textContent = resultText;
    resultLabel.style.color = resultColor;
    
    updateScoreboard();

    // Check for game over
    if (roundsPlayed === totalRounds) {
        endGame();
    }
}

function updateScoreboard() {
    scoreLabel.textContent = `Score: You ${userScore} - ${computerScore} Computer`;
    roundLabel.textContent = `Round: ${roundsPlayed} / ${totalRounds}`;
}

function endGame() {
    let finalMessage = "";
    if (userScore > computerScore) {
        finalMessage = "Congratulations! You won the game!";
    } else if (computerScore > userScore) {
        finalMessage = "Game Over. The computer won.";
    } else {
        finalMessage = "The game ended in a draw!";
    }

    // Standard web alert replaces tkinter messagebox
    setTimeout(() => {
        alert(finalMessage);
    }, 10);

    // Show play again button
    playAgainBtn.classList.remove('hidden');

    // Disable game buttons
    rockBtn.disabled = true;
    paperBtn.disabled = true;
    scissorsBtn.disabled = true;
}

function resetGame() {
    // Reset labels
    userChoiceLabel.textContent = "";
    correctAnswerLabel.textContent = "";
    resultLabel.textContent = "";

    // Hide play again button and re-enable choice buttons
    playAgainBtn.classList.add('hidden');
    rockBtn.disabled = false;
    paperBtn.disabled = false;
    scissorsBtn.disabled = false;

    // Switch back to setup screen
    gameScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
}
