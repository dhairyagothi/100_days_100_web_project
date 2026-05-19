let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];

let started = false;
let level = 0;
let lives = 3;
let strictMode = false;
let flashSpeed = 600; // speed scales
let clickable = true;

const h2 = document.querySelector("h2");
const highScoreText = document.getElementById("highscore");
const strictToggle = document.getElementById("strict-toggle");
const themeToggle = document.getElementById("theme-toggle");
const startBtn = document.getElementById("start-btn");
const allBtns = document.querySelectorAll(".btn");

let highScore = localStorage.getItem("highScore") || 0;
highScoreText.innerText = `High Score: ${highScore}`;

// ---------------- Flash functions ----------------
function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 300);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 200);
}

// ---------------- Game logic ----------------
function startGame() {
  if (!started) {
    started = true;
    level = 0;
    lives = 3;
    gameSeq = [];
    userSeq = [];
    h2.innerText = "Game Started!";
    levelUp();
  }
}

function levelUp() {
  userSeq = [];
  level++;
  flashSpeed = Math.max(250, 600 - level * 30);
  h2.innerText = `Level ${level}`;
  h2.classList.add("level-up");
  setTimeout(() => h2.classList.remove("level-up"), 500);

  let randIdx = Math.floor(Math.random() * 4);
  let randColor = btns[randIdx];
  gameSeq.push(randColor);

  clickable = false;
  setTimeout(playSequence, 500);
}

function playSequence() {
  let i = 0;
  const interval = setInterval(() => {
    const color = gameSeq[i];
    const btn = document.getElementById(color);
    gameFlash(btn);
    i++;
    if (i >= gameSeq.length) {
      clearInterval(interval);
      clickable = true;
    }
  }, flashSpeed);
}

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      clickable = false;
      setTimeout(levelUp, 800);
    }
  } else {
    if (strictMode) {
      lives--;
      if (lives > 0) {
        h2.innerText = `Wrong! Lives left: ${lives}`;
        userSeq = [];
        clickable = false;
        setTimeout(playSequence, 1000);
      } else {
        gameOver();
      }
    } else {
      h2.innerText = `Wrong! Try again...`;
      userSeq = [];
      clickable = false;
      setTimeout(playSequence, 1000);
    }
  }
}

function gameOver() {
  h2.innerHTML = `💀 Game Over! Score: <b>${level}</b><br>Press Start to play again.`;
  document.body.style.backgroundColor = "red";
  setTimeout(() => (document.body.style.backgroundColor = "white"), 200);
  updateHighScore();
  resetGame();
}

function updateHighScore() {
  if (level > highScore) {
    highScore = level;
    localStorage.setItem("highScore", highScore);
    highScoreText.innerText = `High Score: ${highScore}`;
  }
}

function btnPress() {
  if (!started || !clickable) return;
  const btn = this;
  userFlash(btn);

  let userColor = btn.getAttribute("id");
  userSeq.push(userColor);

  checkAns(userSeq.length - 1);
}

function resetGame() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  clickable = true;
}

// ---------------- Event Listeners ----------------
startBtn.addEventListener("click", startGame);
strictToggle.addEventListener("change", (e) => {
  strictMode = e.target.checked;
});

const themeIcon = document.querySelector(".theme-icon");

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeIcon.innerText = "☀️";
  } else {
    themeIcon.innerText = "🌙";
  }
});

allBtns.forEach((btn) => btn.addEventListener("click", btnPress));
