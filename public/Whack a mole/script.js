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

const difficultySelect = document.getElementById("difficulty");
const difficultyText = document.getElementById("currentDifficulty");

const DIFFICULTY = {
    easy: {
        min: 700,
        max: 1200
    },
    medium: {
        min: 400,
        max: 800
    },
    hard: {
        min: 150,
        max: 450
    }
};

let currentDifficulty = "medium";
let gameTimeout = null;

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
    const speed = DIFFICULTY[currentDifficulty];

    const time = Math.random() * (speed.max - speed.min) + speed.min;

    const hole = RandomHole(holes);
    hole.classList.add("active");

    setTimeout(() => {
        hole.classList.remove("active");

        if (gameTime) {
            MolePopUp();
        }
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

    startButton.disabled = true;

    difficultyText.textContent =
        currentDifficulty.charAt(0).toUpperCase() +
        currentDifficulty.slice(1);

    const gameOver = document.getElementById("GameOver");
    gameOver.style.display = "none";


    MolePopUp();

    startCountdown(50);

    gameTimeout = setTimeout(() => {
        gameTime = false;

        startButton.disabled = false;

        gameOver.style.display = "block";

        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        timerDisplay.textContent = "0";
    }, 50000);
}

function resetGame() {
    gameTime = false;

    score = 0;
    scoreBoard.textContent = "0";

    holes.forEach(hole => hole.classList.remove("active"));

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    if (gameTimeout) {
        clearTimeout(gameTimeout);
        gameTimeout = null;
    }

    timerDisplay.textContent = "50";

    document.getElementById("GameOver").style.display = "none";

    startButton.disabled = false;
}

difficultySelect.addEventListener("change", function () {
    currentDifficulty = this.value;

    difficultyText.textContent =
        currentDifficulty.charAt(0).toUpperCase() +
        currentDifficulty.slice(1);

    resetGame();
});

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
