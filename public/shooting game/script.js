const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const timerEl = document.getElementById("timer");

const popup = document.getElementById("scorePopup");

const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");

const pauseBtn = document.getElementById("pauseBtn");

let score = 0;
let shotsFired = 0;
let timeLeft = 15;

let gameRunning = false;
let paused = false;

let timer;
let moveDirection = 1;

let highScore = localStorage.getItem("targetHigh") || 0;
highScoreEl.innerText = highScore;

// Start Game
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  startGame();
});

function startGame() {
  gameRunning = true;
  startTimer();
  moveTarget();
}

// Timer
function startTimer() {

  timer = setInterval(() => {

    if (paused) return;

    timeLeft--;

    timerEl.innerText = timeLeft;

    if (timeLeft <= 0) {
      finishGame();
    }

  }, 1000);

}

// Shoot
window.addEventListener("click", (e) => {

  if (!gameRunning || paused) return;

  shotsFired++;

  createBullet(e.clientX, e.clientY);

  setTimeout(() => {
    checkHit(e.clientX, e.clientY);
  }, 350);

});

// Bullet Animation
function createBullet(targetX, targetY) {

  const bullet = document.createElement("div");

  bullet.classList.add("bullet");

  let x = window.innerWidth / 2;
  let y = window.innerHeight - 150;

  bullet.style.left = x + "px";
  bullet.style.top = y + "px";

  gameArea.appendChild(bullet);

  const interval = setInterval(() => {

    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;

    bullet.style.left = x + "px";
    bullet.style.top = y + "px";

    if (
      Math.abs(x - targetX) < 5 &&
      Math.abs(y - targetY) < 5
    ) {
      clearInterval(interval);
      bullet.remove();
    }

  }, 16);

}

// Hit Detection
function checkHit(x, y) {

  const rect = target.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const distance = Math.sqrt(
    (x - centerX) ** 2 +
    (y - centerY) ** 2
  );

  let points = 0;
  let text = "MISS";

  if (distance < 20) {
    points = 100;
    text = "PERFECT +100";
  }
  else if (distance < 50) {
    points = 70;
    text = "+70";
  }
  else if (distance < 80) {
    points = 50;
    text = "+50";
  }
  else if (distance < 110) {
    points = 20;
    text = "+20";
  }

  score += points;

  scoreEl.innerText = score;

  // Save High Score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("targetHigh", highScore);
    highScoreEl.innerText = highScore;
  }

  // Popup
  popup.innerText = text;

  popup.style.opacity = 1;

  setTimeout(() => {
    popup.style.opacity = 0;
  }, 700);

  // Target Effect
  target.classList.add("hitFlash");

  setTimeout(() => {
    target.classList.remove("hitFlash");
  }, 300);

}

// Moving Target
function moveTarget() {

  setInterval(() => {

    if (!gameRunning || paused) return;

    let current =
      parseInt(target.style.left) ||
      window.innerWidth / 2;

    current += moveDirection * 5;

    if (
      current > window.innerWidth - 200 ||
      current < 120
    ) {
      moveDirection *= -1;
    }

    target.style.left = current + "px";

  }, 40);

}

// Pause
pauseBtn.addEventListener("click", () => {

  paused = !paused;

  pauseBtn.innerText = paused ? "Resume" : "Pause";

});

// Finish Game
function finishGame() {

  clearInterval(timer);

  gameRunning = false;

  const finishScreen = document.createElement("div");

  finishScreen.classList.add("screen");

  finishScreen.innerHTML = `
    <h1>⏰ TIME FINISHED</h1>
    <h2>Total Bullets Fired: ${shotsFired}</h2>
    <h2>Your Score: ${score}</h2>
    <button onclick="location.reload()">
      PLAY AGAIN
    </button>
  `;

  document.body.appendChild(finishScreen);

}