// script.js - Chrome Dino Game (T-Rex Runner)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const highScoreEl = document.getElementById("highScore");

let gameRunning = false;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("dinoHighScore") || 0;
let frame = 0;
let speed = 6;
const GRAVITY = 0.6;
const JUMP = -15;

// Dino
const dino = {
  x: 80,
  y: 200,
  width: 44,
  height: 50,
  dy: 0,
  isJumping: false,
  isDucking: false,
  legFrame: 0,
};

// Arrays
let obstacles = [];
let clouds = [];
let groundY = 250;

// Game variables
let lastObstacle = 0;

// Keyboard
const keys = {};

// Generate initial clouds
function initClouds() {
  clouds = [];
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: Math.random() * canvas.width * 1.5,
      y: 40 + Math.random() * 80,
      size: 0.8 + Math.random() * 0.6,
    });
  }
}

// Spawn obstacle
function spawnObstacle() {
  const now = Date.now();
  if (now - lastObstacle < 800 + Math.random() * 800) return;

  const types = ["cactus1", "cactus2", "cactus3", "bird"];
  let type = types[Math.floor(Math.random() * (score > 800 ? 4 : 3))];

  let obstacle = {
    x: canvas.width + 50,
    width: 30,
    height: 50,
    type: type,
    passed: false,
  };

  if (type === "bird") {
    obstacle.y = groundY - 80 - Math.random() * 60;
    obstacle.height = 35;
    obstacle.width = 50;
  } else {
    obstacle.y = groundY - obstacle.height;
    if (type === "cactus2") obstacle.width = 50;
    if (type === "cactus3") obstacle.width = 70;
  }

  obstacles.push(obstacle);
  lastObstacle = now;
}

// Update game
function update() {
  if (!gameRunning || gameOver) return;

  frame++;
  score += 0.2;
  speed = Math.min(13, 6 + Math.floor(score / 300) * 0.4);

  scoreElement.textContent = Math.floor(score).toString().padStart(5, "0");

  // Dino physics
  if (dino.isJumping) {
    dino.dy += GRAVITY;
    dino.y += dino.dy;

    if (dino.y >= groundY - dino.height) {
      dino.y = groundY - dino.height;
      dino.isJumping = false;
      dino.dy = 0;
    }
  }

  // Spawn obstacles
  spawnObstacle();

  // Update obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.x -= speed;

    // Score when passed
    if (!obs.passed && obs.x + obs.width < dino.x) {
      obs.passed = true;
    }

    // Remove offscreen
    if (obs.x < -100) {
      obstacles.splice(i, 1);
    }
  }

  // Update clouds
  clouds.forEach((cloud) => {
    cloud.x -= speed * 0.3;
    if (cloud.x < -200) cloud.x = canvas.width + Math.random() * 400;
  });

  // Collision detection
  checkCollisions();

  // Increase difficulty
  if (frame % 1200 === 0) speed += 0.2;
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Sky background
  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw clouds
  ctx.fillStyle = "#535353";
  clouds.forEach((cloud) => {
    ctx.globalAlpha = 0.6;
    ctx.fillRect(cloud.x, cloud.y, 60 * cloud.size, 25 * cloud.size);
    ctx.fillRect(
      cloud.x + 20 * cloud.size,
      cloud.y - 10 * cloud.size,
      45 * cloud.size,
      25 * cloud.size,
    );
    ctx.globalAlpha = 1;
  });

  // Draw ground
  ctx.fillStyle = "#535353";
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

  // Ground lines
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  for (let x = (frame * -speed) % 60; x < canvas.width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, groundY + 10);
    ctx.lineTo(x + 30, groundY + 10);
    ctx.stroke();
  }

  // Draw Dino
  ctx.fillStyle = "#333";
  const dHeight = dino.isDucking ? 35 : dino.height;
  const dY = dino.isDucking ? groundY - dHeight : dino.y;

  // Body
  ctx.fillRect(dino.x + 10, dY + 10, 30, 25);
  // Head
  ctx.fillRect(dino.x + 30, dY + 8, 18, 20);
  // Tail
  ctx.fillRect(dino.x + 5, dY + 20, 12, 12);
  // Leg
  if (!dino.isJumping) {
    const leg = Math.floor(frame / 6) % 2 === 0 ? 8 : 18;
    ctx.fillRect(dino.x + 15, dY + 30, 8, leg);
    ctx.fillRect(dino.x + 28, dY + 30, 8, leg === 8 ? 18 : 8);
  }

  // Eye
  ctx.fillStyle = "#fff";
  ctx.fillRect(dino.x + 40, dY + 13, 6, 6);
  ctx.fillStyle = "#000";
  ctx.fillRect(dino.x + 42, dY + 15, 3, 3);

  // Draw obstacles
  ctx.fillStyle = "#333";
  obstacles.forEach((obs) => {
    if (obs.type.includes("cactus")) {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      // Spikes
      ctx.fillRect(obs.x + 8, obs.y - 12, 8, 15);
    } else if (obs.type === "bird") {
      // Simple bird
      ctx.fillRect(obs.x, obs.y, obs.width, 20);
      ctx.fillRect(obs.x + 10, obs.y - 8, 25, 12);
    }
  });
}

// Collision
function checkCollisions() {
  const dinoBox = {
    x: dino.x + 10,
    y: dino.isDucking ? groundY - 35 : dino.y + 10,
    width: dino.width - 15,
    height: dino.isDucking ? 30 : dino.height - 15,
  };

  for (let obs of obstacles) {
    const obsBox = {
      x: obs.x + 5,
      y: obs.y + 5,
      width: obs.width - 10,
      height: obs.height - 10,
    };

    if (
      dinoBox.x < obsBox.x + obsBox.width &&
      dinoBox.x + dinoBox.width > obsBox.x &&
      dinoBox.y < obsBox.y + obsBox.height &&
      dinoBox.y + dinoBox.height > obsBox.y
    ) {
      endGame();
      return;
    }
  }
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  if (score > highScore) {
    highScore = Math.floor(score);
    localStorage.setItem("dinoHighScore", highScore);
  }
  finalScoreEl.textContent = Math.floor(score);
  highScoreEl.textContent = highScore;
  gameOverScreen.style.display = "flex";
}

// Game Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Controls
function jump() {
  if (!dino.isJumping && gameRunning) {
    dino.isJumping = true;
    dino.dy = JUMP;
  }
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  gameOver = false;
  score = 0;
  speed = 6;
  obstacles = [];
  dino.y = groundY - dino.height;
  dino.isJumping = false;
  dino.isDucking = false;
  startScreen.style.display = "none";
  gameOverScreen.style.display = "none";
}

// Restart
window.restartGame = function () {
  startGame();
};

// Keyboard
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if ((e.key === " " || e.key === "ArrowUp") && !gameRunning && !gameOver) {
    startGame();
  } else if ((e.key === " " || e.key === "ArrowUp") && gameRunning) {
    jump();
  }

  if (e.key === "ArrowDown") {
    dino.isDucking = true;
  }

  if ((e.key === " " || e.key === "Enter") && gameOver) {
    restartGame();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowDown") {
    dino.isDucking = false;
  }
});

// Touch support
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (!gameRunning && !gameOver) {
    startGame();
  } else if (gameRunning) {
    jump();
  } else if (gameOver) {
    restartGame();
  }
});

canvas.addEventListener("mousedown", () => {
  if (gameRunning) jump();
});

// Initialize
function init() {
  initClouds();
  gameOverScreen.style.display = "none";
  startScreen.style.display = "flex";
  highScoreEl.textContent = highScore; // Just for reference
  gameLoop();
}

window.onload = init;
