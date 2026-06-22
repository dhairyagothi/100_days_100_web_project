const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('startButton');
const whackSound = document.getElementById('whackSound');
const gameContainer = document.querySelector('.game-container');
const timerDisplay = document.getElementById('timer');  // FIX: wire up the timer element

let lastHole;
let score = 0;
let gameTime = false;
let countdownInterval = null;  // FIX: track the interval so we can clear it

// function to randomly pick a hole for the mole to appear
function RandomHole(holes) {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if (hole === lastHole) {
        // avoid showing in the same hole consecutively
        return RandomHole(holes);
    }
    lastHole = hole;
    return hole;
}

// function to make the mole pop up and hide
function MolePopUp() {
    // random pop up duration
    const time = Math.random() * 800 + 200;
    const hole = RandomHole(holes);
    // show mole
    hole.classList.add('active');
    setTimeout(() => {
        // hide mole after random time
        hole.classList.remove('active');
        // keep moles popping until game ends
        if (gameTime) MolePopUp();
    }, time);
}

// FIX: Countdown timer — counts down every second and updates the display
function startCountdown(duration) {
    let timeLeft = duration;
    timerDisplay.textContent = timeLeft;   // show initial value immediately

    // Clear any leftover interval from a previous game
    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }, 1000);
}

// function to start the game
function StartGame() {
    score = 0;
    scoreBoard.textContent = score;
    gameTime = true;

    startButton.disabled = true;   // prevent double-start

    const gameOver = document.getElementById('gameOver');
    if (gameOver) gameOver.style.display = 'none';

    MolePopUp();

    // FIX: Start the visible countdown (50 seconds)
    startCountdown(50);

    setTimeout(() => {
        gameTime = false;
        startButton.disabled = false;

        // Show game over message if element exists
        if (gameOver) gameOver.style.display = 'block';

        // Stop any remaining countdown (safety net)
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        timerDisplay.textContent = '0';
    }, 50000); // game duration of 50 seconds
}

// function to whack a mole and increase score
holes.forEach(hole => {
    hole.addEventListener('click', () => {
        // only whack active mole
        if (!hole.classList.contains('active')) return;
        score++;
        scoreBoard.textContent = score;
        hole.classList.remove('active');
        whackSound.play();
    });
});

startButton.addEventListener('click', StartGame);

// NOTE: The cursor is fully handled via CSS (cursor: url('hammer.png') 16 16, auto)
// The mousedown/mouseup JS cursor switching has been removed — it was redundant
// and caused flicker. If hammer.png is a standard web-safe size (≤128×128px),
// the CSS rule alone is sufficient and more reliable.
