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
const stopBtn = document.getElementById("stop-btn");
const board = document.getElementById("board");
const allBtns = document.querySelectorAll(".btn");

let highScore = localStorage.getItem("highScore") || 0;
highScoreText.innerText = `🏆 High Score: ${highScore}`;

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
  const interval = setInterval(() => {
    const color = gameSeq[i];
    const btn = document.getElementById(color);
    gameFlash(btn);
    i++;
    if (i >= gameSeq.length) {
      clearInterval(interval);
      clickable = true;
      h2.innerText = "Your turn! 👆";

    }
  }, flashSpeed + 100);
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
  board.classList.add("shake");
  board.addEventListener("animationend", () => board.classList.remove("shake"), { once: true });
  h2.innerHTML = `💀 Game Over! Score: <b>${level}</b>`;
  updateHighScore();
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
  if (!started || !clickable) return;
  const btn = this;
  userFlash(btn);
  if (navigator.vibrate) navigator.vibrate(50);

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
