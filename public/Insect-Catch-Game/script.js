// --- Sound Setup ---
const backgroundMusic = document.getElementById("background-music");
const catchSound = document.getElementById("catch-sound");
const buttonClickSound = document.getElementById("button-click-sound");
const muteBtn = document.getElementById("mute-btn");
const volumeSlider = document.getElementById("volume-slider");

let isMuted = false;

// Preload all sounds
backgroundMusic.load();
catchSound.load();
buttonClickSound.load();

// Set initial volume
backgroundMusic.volume = 0.5
catchSound.volume = 0.5
buttonClickSound.volume = 0.5

const screens = document.querySelectorAll('.screen');
const choose_insect_btns = document.querySelectorAll('.choose-insect-btn');
const start_btn = document.getElementById('start-btn')
const game_container = document.getElementById('game-container')
const timeEl = document.getElementById('time')
const scoreEl = document.getElementById('score')
const message = document.getElementById('message')
let seconds = 0
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

start_btn.addEventListener('click', () => {
    buttonClickSound.currentTime = 0
    buttonClickSound.onended = null // clear any previous onended
    buttonClickSound.play()
    
    // Wait for sound to finish, then show next screen
    buttonClickSound.onended = () => {
        screens[0].classList.add('up')
    }
})
start_btn.addEventListener('click', () => screens[0].classList.add('up'));

choose_insect_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        buttonClickSound.currentTime = 0
        buttonClickSound.onended = null // clear any previous onended
        buttonClickSound.play()

        const img = btn.querySelector('img')
        const src = img.getAttribute('src')
        const alt = img.getAttribute('alt')
        selected_insect = { src, alt }

        // Wait for sound to finish, then show game screen
        buttonClickSound.onended = () => {
            screens[1].classList.add('up')
            setTimeout(createInsect, 1000)
            startGame()

            // Start background music after screen slides
            setTimeout(() => {
                backgroundMusic.play()
            }, 500)
        }
    })
})
backgroundMusic.volume = 0.5;
catchSound.volume = 0.5;
buttonClickSound.volume = 0.5;

const screens = document.querySelectorAll(".screen");
const choose_insect_btns = document.querySelectorAll(".choose-insect-btn");
const start_btn = document.getElementById("start-btn");
const game_container = document.getElementById("game-container");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const message = document.getElementById("message");

// End game popup and final result elements
const endBtn = document.getElementById("end-btn");
const gameOverPopup = document.getElementById("game-over");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const finalResult = document.getElementById("final-result");
const finalScore = document.getElementById("final-score");
const finalTime = document.getElementById("final-time");

let seconds = 0;
let score = 0;
let selected_insect = {};
let gameInterval; // Stores the time interval
let isGamePaused = false; // Helps pausing timer when user clicks 'End Game' button

function playButtonClickSound(onComplete) {
  let completed = false;
  let fallbackTimer;

  const finish = () => {
    if (completed) return;
    completed = true;
    clearTimeout(fallbackTimer);
    buttonClickSound.removeEventListener("ended", finish);
    onComplete();
  };

  buttonClickSound.addEventListener("ended", finish, { once: true });
  fallbackTimer = setTimeout(finish, 700);

  try {
    buttonClickSound.currentTime = 0;
    const playPromise = buttonClickSound.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(finish);
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
  } catch (error) {
    finish();
  }
}

start_btn.addEventListener("click", () => {
  playButtonClickSound(() => {
    screens[0].classList.add("up");
  });
});

choose_insect_btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    const src = img.getAttribute("src");
    const alt = img.getAttribute("alt");
    selected_insect = { src, alt };

    playButtonClickSound(() => {
      screens[1].classList.add("up");
      setTimeout(createInsect, 1000);
      startGame();

      // Start background music after screen slides
      setTimeout(() => {
        backgroundMusic.play();
      }, 500);
    });
  });
});

function startGame() {
  gameInterval = setInterval(increaseTime, 1000);
}

function increaseTime() {
  seconds++;
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;
  timeEl.textContent = `Time: ${m}:${s}`;
}

function createInsect() {
  const insect = document.createElement("div");
  insect.classList.add("insect");
  const { x, y } = getRandomLocation();
  insect.style.top = `${y}px`;
  insect.style.left = `${x}px`;

  const img = document.createElement("img");
  img.src = selected_insect.src;
  img.alt = selected_insect.alt;
  img.style.transform = `rotate(${Math.random() * 360}deg)`;
  insect.appendChild(img);
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
        catchSound.currentTime = 0
        catchSound.play()

        increaseScore()
        this.classList.add('caught')
        setTimeout(() => this.remove(), 2000)
        addInsects()
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
  scoreEl.textContent = `Score: ${score}`;
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
noBtn.addEventListener("click", () => {
  gameOverPopup.style.display = "none";

  if (isGamePaused) {
    gameInterval = setInterval(increaseTime, 1000);
    isGamePaused = false;
  }
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
  clearInterval(gameInterval);
  document.querySelectorAll(".insect").forEach((insect) => {
    insect.remove();
  });

  gameOverPopup.style.display = "none";

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const paddedMins = m < 10 ? `0${m}` : `${m}`;
  const paddedSeconds = s < 10 ? `0${s}` : `${s}`;
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

  finalScore.textContent = `Final Score: ${score}`;
  finalTime.textContent = `Time Taken: ${paddedMins}:${paddedSeconds}`;

  finalResult.style.display = "flex";
}
