let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;
let lives = 3;
let strictMode = false;
let flashSpeed = 600; // speed scales
let clickable = true;
let paused = false;
let sequenceInterval = null; // store Simon sequence interval

const screens = document.querySelectorAll('.screen');
const h2 = document.querySelector("h2");
const highScoreText = document.getElementById("highscore");
const modal = document.getElementById("game-modal");
const modalTitle = document.getElementById("modal-title");
const modalScore = document.getElementById("modal-score");
const modalHighScore = document.getElementById("modal-highscore");
const modalBtn = document.getElementById("modal-btn");
const strictToggle = document.getElementById("strict-toggle");
const themeToggle = document.getElementById("theme-toggle");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const board = document.getElementById("board");
const allBtns = document.querySelectorAll(".btn");
const pauseBtn = document.getElementById("pause-btn");
const playBtn =document.getElementById("play-btn");

let highScore = localStorage.getItem("highScore") || 0;
highScoreText.innerText = `🏆 High Score: ${highScore}`;

playBtn.addEventListener('click', () => screens[0].classList.add('up'));

// ---------------- Flash functions ----------------
function gameFlash(btn) {
  btn.classList.add("flash");
  btn.addEventListener("animationend", () => btn.classList.remove("flash"), { once: true });
}

function userFlash(btn) {
  btn.classList.add("userflash");
  btn.addEventListener("animationend", () => btn.classList.remove("userflash"), { once: true });

}

// ---------------- Game logic ----------------
function startGame() {
  if (!started) {
    started = true;
    level = 0;
    lives = 3;
    gameSeq = [];
    userSeq = [];
    h2.innerText = "Get ready! 👀";
    levelUp();
  }
}

function levelUp() {
  if (level === 20) {
    updateHighScore();
    
    showModal(
      "🎉 Congratulations!",
      level,
      "Play Again"
    );
    
    resetGame();
    return;
  }
  userSeq = [];
  level++;
  flashSpeed = Math.max(250, 600 - level * 30);
  h2.innerText = `Level ${level} 🎯`;
  h2.classList.remove("level-up");
  void h2.offsetWidth; 
  h2.classList.add("level-up");


  let randIdx = Math.floor(Math.random() * 4);
  let randColor = btns[randIdx];
  gameSeq.push(randColor);

  clickable = false;
  setTimeout(playSequence, 600);
}

function playSequence() {
  let i = 0;

  sequenceInterval = setInterval(() => {
    if (paused) return;

    const color = gameSeq[i];
    const btn = document.getElementById(color);

    gameFlash(btn);

    i++;

    if (i >= gameSeq.length) {
      clearInterval(sequenceInterval);
      sequenceInterval = null;

      clickable = true;
      h2.innerText = "Your turn! 👆";
    }
  }, flashSpeed + 100);
}

function togglePause() {
  if (!started) return;

  paused = !paused;

  if (paused) {
    clickable = false;

    // Stop sequence playback if it's currently running
    if (sequenceInterval) {
      clearInterval(sequenceInterval);
    }

    h2.innerText = "⏸ Game Paused";
    pauseBtn.innerText = "▶ Resume";
  } else {
    h2.innerText = "▶ Resumed";

    // Replay the current sequence
    clickable = false;
    setTimeout(() => {
      playSequence();
    }, 500);

    pauseBtn.innerText = "⏸ Pause";
  }
}

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      clickable = false;
      h2.innerText = "✅ Correct! Nice!";
      setTimeout(levelUp, 900);
    }
  } else {
    if (strictMode) {
      lives--;
      if (lives > 0) {
        h2.innerText = `❌ Wrong! Lives left: ${lives}`;
        userSeq = [];
        clickable = false;
        setTimeout(playSequence, 1200);
      } else {
        gameOver();
      }
    } else {
      h2.innerText = ` ❌ Oops! Try again...`;
      userSeq = [];
      clickable = false;
      setTimeout(playSequence, 1000);
    }
  }
}

function stopGame() {
  if (!started) return;

  h2.innerHTML = `🛑 Game Stopped! Final Score: <b>${level}</b>`;

  updateHighScore();

  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  lives = 3;
  clickable = true;
}

function gameOver() {
  updateHighScore();

  showModal(
    "💀 Game Over!",
    level,
    "Restart"
  );

  resetGame();
}

function updateHighScore() {
  if (level > highScore) {
    highScore = level;
    localStorage.setItem("highScore", highScore);
    highScoreText.innerText = ` 🏆 High Score: ${highScore}`;
  }
}

function btnPress() {
  if (!started || !clickable || paused) return;

  const btn = this;
  userFlash(btn);

  if (navigator.vibrate) navigator.vibrate(50);

  let userColor = btn.getAttribute("id");
  userSeq.push(userColor);

  checkAns(userSeq.length - 1);
}

function showModal(title, score, buttonText) {
  modalTitle.innerText = title;
  modalScore.innerText = `Final Score: ${score}`;
  modalHighScore.innerText = `Highest Score: ${highScore}`;
  modalBtn.innerText = buttonText;

  modal.classList.remove("hidden");
}

modalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  startGame();
});

function resetGame() {
  started = false;
  paused = false;

  if (sequenceInterval) {
    clearInterval(sequenceInterval);
  }

  gameSeq = [];
  userSeq = [];
  level = 0;
  clickable = true;

  pauseBtn.innerText = "⏸ Pause";
}

// ---------------- Event Listeners ----------------
startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
strictToggle.addEventListener("change", (e) => {
  strictMode = e.target.checked;
});

const themeIcon = document.querySelector(".theme-icon");

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  themeIcon.innerText = document.body.classList.contains("dark") ? "☀️" : "🌙";
 
});

allBtns.forEach((btn) => btn.addEventListener("click", btnPress));
pauseBtn.addEventListener("click", togglePause);