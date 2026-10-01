import { words } from "./data/words.js";

function createSound(src) {
  const audio = new Audio(src);
  audio.preload = "auto";
  return audio;
}

function soundUrl(fileName) {
  return new URL(`./sounds/${fileName}`, import.meta.url).href;
}

function playSound(audio) {
  audio.currentTime = 0;
  const playback = audio.play();
  if (playback && typeof playback.catch === "function") {
    playback.catch(() => {});
  }
}

const shootSound = createSound(soundUrl("shoot.mp3"));
const hitSound = createSound(soundUrl("hit.mp3"));
const destroySound = createSound(soundUrl("destroy.mp3"));
const gameOverSound = createSound(soundUrl("gameover.mp3"));

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const hud = document.getElementById("gameUi");

const difficultyButtons = document.querySelectorAll('.difficulty');

let selectedMode = "easy";

difficultyButtons.forEach(button => {
  button.addEventListener("click", () => {
    difficultyButtons.forEach(btn => {
      btn.classList.remove("active");
    });
    button.classList.add("active");
    selectedMode = button.dataset.mode;
  });
});

const player = {
  x: 120,
  y: canvas.height / 2,
  radius: 18
};

let enemies = [];
let bullets = [];
let activeEnemy = null;
let score = 0;
let gameRunning = false;
let enemyCount = 1;
let enemySpeed = 1.2;
let enemySpawner = null;

startBtn.addEventListener("click", () => {
  [shootSound, hitSound, destroySound, gameOverSound].forEach(audio => {
    audio.load();
  });
  startScreen.style.display = "none";
  resetGame();
  startGame(selectedMode);
});

restartBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  resetGame();
  startGame(selectedMode);
});

backBtn.addEventListener("click", () => {
  if (gameRunning) {
    returnToMenu();
    return;
  }
  if (gameOverScreen.style.display === "flex") {
    returnToMenu();
    return;
  }
  window.location.href = "/";
});

function resetGame() {
  enemies = [];
  bullets = [];
  activeEnemy = null;
  score = 0;
  document.getElementById("score").innerText = score;
  document.getElementById("targetWord").innerText = "None";
  clearInterval(enemySpawner);
  if (hud) {
    hud.style.display = "none";
  }
}

function returnToMenu() {
  gameRunning = false;
  clearInterval(enemySpawner);
  enemies = [];
  bullets = [];
  activeEnemy = null;
  gameOverScreen.style.display = "none";
  if (hud) {
    hud.style.display = "none";
  }
  startScreen.style.display = "flex";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function startGame(mode) {
  if (mode === "easy") {
    enemyCount = 1;
    enemySpeed = 1.2;
  }
  if (mode === "medium") {
    enemyCount = 2;
    enemySpeed = 1.2;
  }
  if (mode === "hard") {
    enemyCount = 3;
    enemySpeed = 1.7;
  }
  gameRunning = true;
  if (hud) {
    hud.style.display = "flex";
  }
  createEnemies();
  requestAnimationFrame(gameLoop);
}

function randomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function createEnemies() {
  enemySpawner = setInterval(() => {
    if (!gameRunning) return;
    while (enemies.length < enemyCount) {
      enemies.push({
        x: canvas.width + Math.random() * 300,
        y: 100 + Math.random() * (canvas.height - 200),
        radius: 22,
        word: randomWord(),
        typed: "",
        speed: enemySpeed,
        hit: false,
        hitTime: 0
      });
    }
  }, 1000);
}

function drawPlayer() {
  ctx.beginPath();
  ctx.fillStyle = "#00ffee";
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowColor = "#00ffee";
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(player.x, player.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawEnemies() {
  enemies.forEach(enemy => {
    enemy.x -= enemy.speed;
    ctx.beginPath();
    if (enemy.hit) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "#ff7b00";
    }
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "bold 22px Arial";
    ctx.textAlign = "left";

    const typed = enemy.word.substring(0, enemy.typed.length);
    const left = enemy.word.substring(enemy.typed.length);

    const totalWidth = ctx.measureText(enemy.word).width;
    const startX = enemy.x - totalWidth / 2;
    const typedWidth = ctx.measureText(typed).width;

    ctx.fillStyle = "#00ff99";
    ctx.fillText(typed, startX, enemy.y - 35);

    ctx.fillStyle = "white";
    ctx.fillText(left, startX + typedWidth, enemy.y - 35);

    if (Date.now() - enemy.hitTime > 100) {
      enemy.hit = false;
    }

    if (enemy.x < player.x + 20) {
      gameOver();
    }
  });
}

function createBullet(enemy) {
  playSound(shootSound);
  bullets.push({
    x: player.x,
    y: player.y,
    enemy: enemy
  });
}

function drawBullets() {
  bullets.forEach((bullet, index) => {
    if (!bullet.enemy) {
      bullets.splice(index, 1);
      return;
    }

    const dx = bullet.enemy.x - bullet.x;
    const dy = bullet.enemy.y - bullet.y;
    const angle = Math.atan2(dy, dx);

    bullet.x += Math.cos(angle) * 18;
    bullet.y += Math.sin(angle) * 18;

    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
    ctx.fill();

    const dist = Math.hypot(bullet.enemy.x - bullet.x, bullet.enemy.y - bullet.y);
    if (dist < 20) {
      playSound(hitSound);
      bullet.enemy.hit = true;
      bullet.enemy.hitTime = Date.now();
      bullets.splice(index, 1);
    }
  });
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  drawBullets();
  requestAnimationFrame(gameLoop);
}

function gameOver() {
  playSound(gameOverSound);
  gameRunning = false;
  gameOverScreen.style.display = "flex";
}

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  const key = e.key.toLowerCase();
  if (key.length !== 1) return;

  if (!activeEnemy) {
    for (let enemy of enemies) {
      if (enemy.word[0] === key) {
        activeEnemy = enemy;
        break;
      }
    }
  }

  if (!activeEnemy) return;

  const nextLetter = activeEnemy.word[activeEnemy.typed.length];

  if (key === nextLetter) {
    activeEnemy.typed += key;
    createBullet(activeEnemy);
    document.getElementById("targetWord").innerText = activeEnemy.word;

    if (activeEnemy.typed === activeEnemy.word) {
      playSound(destroySound);
      enemies = enemies.filter(enemy => enemy !== activeEnemy);
      bullets = bullets.filter(bullet => bullet.enemy !== activeEnemy);
      score += 10;
      document.getElementById("score").innerText = score;
      activeEnemy = null;
      document.getElementById("targetWord").innerText = "None";
    }
  } else {
    for (let enemy of enemies) {
      if (enemy.word[0] === key) {
        activeEnemy = enemy;
        break;
      }
    }
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  player.y = canvas.height / 2;
});