const screens = document.querySelectorAll('.screen');
const choose_insect_btns = document.querySelectorAll('.choose-insect-btn');
const start_btn = document.getElementById('start-btn');
const game_container = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
const timerBtns = document.querySelectorAll('.timer-btn');

// End game popup and final result elements
const endBtn = document.getElementById('end-btn');
const gameOverPopup = document.getElementById('game-over');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const finalResult = document.getElementById('final-result');
const finalScore = document.getElementById('final-score');
const finalTime = document.getElementById('final-time');
const playAgain = document.getElementById('play-again');

const backgroundMusic= document.getElementById('background-music');
const catchSound = document.getElementById('catch-sound');
const buttonClickSound = document.getElementById('button-click-sound');
const volumeSlider =document.getElementById('volume-slider');

let score = 0
let selected_insect = {}
let gameDuration = 60
let timeRemaining = 60
let gameInterval // Stores the time interval
let isGamePaused = false // Helps pausing timer when user clicks 'End Game' button
let gameEnded = false

start_btn.addEventListener('click', () => screens[0].classList.add('up'));

choose_insect_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img')
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        selected_insect = { src, alt }
        screens[1].classList.add('up')
    });
});

timerBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        gameDuration = Number(btn.dataset.time);
        timeRemaining = gameDuration;

        screens[2].classList.add('up');

        setTimeout(createInsect, 1000);
        startGame();

        setTimeout(() => {
            backgroundMusic.play()
        }, 500)
    });
});

function startGame() {
    updateTimer();
    gameInterval = setInterval(updateTimer,1000);
}

function updateTimer() {
    if (timeRemaining <= 0) {
        endGame();
        return;
    }

    timeRemaining-- ;

    let m = Math.floor(timeRemaining / 60);
    let s = timeRemaining % 60 ;

    m = m < 10 ? `0${m}` : m ;
    s = s < 10 ? `0${s}` : s ;

    timeEl.innerHTML = `Time: ${m}:${s}`;
}

function createInsect() {
    if (gameEnded) return;
    const insect = document.createElement('div');
    insect.classList.add('insect');
    const { x, y } = getRandomLocation();
    insect.style.top = `${y}px`;
    insect.style.left = `${x}px`;
    insect.innerHTML = `<img src="${selected_insect.src}" alt="${selected_insect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;

  insect.addEventListener("click", catchInsect);

  game_container.appendChild(insect);
}

function getRandomLocation() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const x = Math.random() * (width - 200) + 100;
  const y = Math.random() * (height - 200) + 100;
  return { x, y };
}

function catchInsect() {
  catchSound.currentTime = 0;
  catchSound.play();

  increaseScore();
  this.classList.add("caught");
  this.style.pointerEvents = "none";
  setTimeout(() => this.remove(), 300);
  addInsects();
}

function addInsects() {
  setTimeout(createInsect, 1000);
  setTimeout(createInsect, 1500);
}

function increaseScore() {
  score++;
  if (score > 19) {
    message.classList.add("visible");
  }
  scoreEl.innerHTML = `Score: ${score}`;
}

// Show confirmation popup when user clicks 'End Game' button
endBtn.addEventListener("click", () => {
  gameOverPopup.style.display = "flex";
  clearInterval(gameInterval);
  isGamePaused = true;
});

// --- Volume Slider ---
volumeSlider.addEventListener("input", () => {
  const volume = volumeSlider.value;
  backgroundMusic.volume = volume;
  catchSound.volume = volume;
  buttonClickSound.volume = volume;
});

// Resume game
noBtn.addEventListener('click', () => {
    gameOverPopup.style.display = 'none'

    if (isGamePaused) {
        clearInterval(gameInterval);
        gameInterval = setInterval(updateTimer, 1000);
        isGamePaused = false;
    }
});

// Ends the game
yesBtn.addEventListener("click", endGame);

// Stops timer, removes insects and display final results
function endGame() {
    gameEnded = true ;
    clearInterval(gameInterval);
    isGamePaused = false;
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    document.querySelectorAll('.insect').forEach(insect => {
        insect.remove();
    });

  gameOverPopup.style.display = "none";

    const timeTaken = gameDuration - timeRemaining;
    let m = Math.floor(timeTaken / 60);
    let s = timeTaken % 60;
  const paddedMins = m < 10 ? `0${m}` : m;
  const paddedSeconds = s < 10 ? `0${s}` : s;

  finalScore.innerHTML = `Final Score: ${score}`;
  finalTime.innerHTML = `Time Taken: ${paddedMins}:${paddedSeconds}`;

  finalResult.style.display = "flex";
}
