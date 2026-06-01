const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
const difficultyText = document.getElementById("difficultyText");
const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const arena = document.getElementById("arena");

let paddleX = 180;
let ballX = 220;
let ballY = 120;
let velocityX = 3;
let velocityY = 4;
let score = 0;
let difficulty = "easy";
let gameRunning = false;
let ballHitPaddle = false; // Flag to prevent multiple score increments on single hit
let comboCount = 0; // Combo counter
let comboTimer = null; // Combo timer
const keys = {};

const gameWidth = 0;
const gameHeight = 0;

const bounds = () => ({
  width: arena.clientWidth,
  height: arena.clientHeight,
  paddleWidth: paddle.offsetWidth,
  paddleY: arena.clientHeight - 24 - paddle.offsetHeight,
  ballSize: ball.offsetWidth,
});

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));

function startGame(mode) {
  difficulty = mode;
  if (mode === "easy") {
    velocityX = 3;
    velocityY = 4;
  } else if (mode === "medium") {
    velocityX = 5;
    velocityY = 6;
  } else {
    velocityX = 7;
    velocityY = 8;
  }

  difficultyText.textContent = `Difficulty: ${mode[0].toUpperCase()}${mode.slice(
    1,
  )}`;
  menu.classList.add("hidden");
  gameRunning = true;
  comboCount = 0; // Reset combo on new game
  clearTimeout(comboTimer); // Clear combo timer
  updateGame();
}

function movePaddle() {
  const { width, paddleWidth } = bounds();
  const speed = 10;
  if (keys["ArrowLeft"] && paddleX > 0) paddleX -= speed;
  if (keys["ArrowRight"] && paddleX < width - paddleWidth) paddleX += speed;
  paddle.style.left = `${paddleX}px`;
}

function createTrail() {
  const trail = document.createElement("div");
  trail.className = "trail";
  trail.style.left = `${ballX + 6}px`;
  trail.style.top = `${ballY + 6}px`;
  trail.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
  trail.style.opacity = Math.random() * 0.7 + 0.3;
  arena.appendChild(trail);
  setTimeout(() => trail.remove(), 340);
}

function createParticleBurst(x, y) {
  const particleCount = 12;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = "8px";
    particle.style.height = "8px";
    particle.style.borderRadius = "50%";

    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 50 + Math.random() * 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    const colors = [
      "rgba(0, 246, 255, 0.8)",
      "rgba(255, 44, 195, 0.8)",
      "rgba(139, 93, 255, 0.8)",
      "rgba(80, 255, 177, 0.8)",
    ];

    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
    particle.style.setProperty("--tx", `${tx}px`);
    particle.style.setProperty("--ty", `${ty}px`);
    particle.style.animation = `particleBurst 0.6s ease-out forwards`;

    arena.appendChild(particle);
    setTimeout(() => particle.remove(), 600);
  }
}

function showComboText(x, y, comboLevel) {
  const comboTexts = [
    "2× COMBO!",
    "3× COMBO!!",
    "ON FIRE! 🔥",
    "UNSTOPPABLE!",
    "LEGENDARY! ⚡",
  ];

  const text = comboTexts[Math.min(comboLevel - 2, comboTexts.length - 1)];
  const comboDiv = document.createElement("div");
  comboDiv.className = "combo-text";
  comboDiv.textContent = text;
  comboDiv.style.left = `${x}px`;
  comboDiv.style.top = `${y}px`;

  const colors = [
    "var(--cyan)",
    "var(--magenta)",
    "var(--lime)",
    "var(--violet)",
  ];
  comboDiv.style.color = colors[comboLevel % colors.length];

  arena.appendChild(comboDiv);
  setTimeout(() => comboDiv.remove(), 600);
}

function screenShake() {
  const originalTransform = arena.style.transform;
  arena.style.animation = "none";
  setTimeout(() => {
    arena.style.animation = "screenShake 0.2s ease-out";
  }, 10);
}

function updateGame() {
  if (!gameRunning) return;
  const { width, height, paddleWidth, paddleY, ballSize } = bounds();
  movePaddle();

  ballX += velocityX;
  ballY += velocityY;

  if (ballX <= 0 || ballX >= width - ballSize) velocityX *= -1;
  if (ballY <= 0) velocityY *= -1;

  // Check collision with paddle
  const isCollidingWithPaddle =
    ballY + ballSize >= paddleY &&
    ballX + ballSize >= paddleX &&
    ballX <= paddleX + paddleWidth;

  if (isCollidingWithPaddle) {
    // Only process hit if this is a NEW collision (not already hitting)
    if (!ballHitPaddle) {
      const hitPoint = ballX + ballSize / 2 - (paddleX + paddleWidth / 2);
      const normalizedHit = hitPoint / (paddleWidth / 2);

      if (difficulty === "easy") {
        velocityX = normalizedHit * 4;
        velocityY = -(Math.abs(velocityY) + 0.16);
      } else if (difficulty === "medium") {
        velocityX = normalizedHit * 7 + Math.sin(Date.now() / 200) * 0.55;
        velocityY = -(Math.abs(velocityY) + 0.3);
      } else {
        velocityX = normalizedHit * 11 + (Math.random() - 0.5) * 2.2;
        velocityY = -(Math.abs(velocityY) + 0.44);
      }

      score++;
      comboCount++;
      scoreDisplay.textContent = `Score: ${score}`;

      // Create energetic particle burst
      createParticleBurst(ballX + ballSize / 2, ballY + ballSize / 2);

      // Show combo text and shake screen on combo
      if (comboCount >= 2) {
        showComboText(paddleX + paddleWidth / 2 - 40, paddleY - 40, comboCount);
        screenShake();
      }

      // Enhanced paddle animation
      paddle.style.transform = "scale(1.15) skewX(0.1deg)";
      setTimeout(() => (paddle.style.transform = "scale(1)"), 120);

      // Combo timer
      clearTimeout(comboTimer);
      comboTimer = setTimeout(() => {
        comboCount = 0;
      }, 2000);

      ballHitPaddle = true;
    }
  } else {
    // Reset collision flag when ball leaves paddle area
    ballHitPaddle = false;
  }

  if (ballY > height) return endGame();

  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;
  createTrail();
  requestAnimationFrame(updateGame);
}

function endGame() {
  ballHitPaddle = false; // Reset collision flag
  comboCount = 0; // Reset combo
  clearTimeout(comboTimer); // Clear combo timer
  gameRunning = false;
  finalScore.textContent = score;
  gameOverScreen.classList.remove("hidden");
}

function restartGame() {
  score = 0;
  paddleX = 180;
  ballX = 220;
  ballY = 120;
  scoreDisplay.textContent = "Score: 0";
  gameOverScreen.classList.add("hidden");
  menu.classList.remove("hidden");
  ballHitPaddle = false; // Reset collision flag
  comboCount = 0; // Reset combo
  clearTimeout(comboTimer); // Clear combo timer
}
