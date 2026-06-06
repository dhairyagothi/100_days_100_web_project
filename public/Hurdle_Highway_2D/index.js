const intro2 = document.getElementById("intro2");
const playbutton = document.getElementById("playbtn");
const mainMenu = document.getElementById("mainMenu");
const gametimer = document.getElementById("gametimer");
const gametimercont = document.getElementById("gametimercont");
const timeraud = document.getElementById("timeraud");
const carmoveaud = document.getElementById("carmoveaud");
const hornaud = document.getElementById("hornaud");
const crashaud = document.getElementById("crashaud");
const mainMenubtn = document.getElementById("mainMenubtn");
const playagain = document.getElementById("playagain");
const scoreb = document.getElementById("scorepara1");
const speedb = document.getElementById("scorepara2");
const scoreg = document.getElementById("scorepara");
const highscoreg = document.getElementById("highscorepara");
const highscoreb = document.getElementById("scorepara3");
const gameover = document.getElementById("gameover");
const car = document.getElementById("car");
const stage = document.getElementById("gameStage");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

const BASE_WIDTH = 1200;
const BASE_HEIGHT = 700;
const LANE_COUNT = 5;
const difficultySettings = {
  easy: {
    baseSpeed: 190,
    speedOffsetMin: -10,
    speedOffsetMax: 20,
    maxActiveObstacles: 5,
    minSpawnGap: 260,
    moveCooldown: 0.1,
  },
  medium: {
    baseSpeed: 220,
    speedOffsetMin: -15,
    speedOffsetMax: 30,
    maxActiveObstacles: 6,
    minSpawnGap: 220,
    moveCooldown: 0.12,
  },
  hard: {
    baseSpeed: 300,
    speedOffsetMin: -30,
    speedOffsetMax: 60,
    maxActiveObstacles: 8,
    minSpawnGap: 160,
    moveCooldown: 0.16,
  },
};

let currentDifficulty = "medium";
let baseSpeed = difficultySettings[currentDifficulty].baseSpeed;
let speedOffsetMin = difficultySettings[currentDifficulty].speedOffsetMin;
let speedOffsetMax = difficultySettings[currentDifficulty].speedOffsetMax;
let maxActiveObstacles = difficultySettings[currentDifficulty].maxActiveObstacles;
let minSpawnGap = difficultySettings[currentDifficulty].minSpawnGap;
let moveCooldown = difficultySettings[currentDifficulty].moveCooldown;

let laneCenters = [];
let gameStarted = false;
let countdownRunning = false;
let timecount = 3;
let lastTime = 0;
let score = 0;
let scoreTimer = 0;
let speedTimer = 0;
let spawnCursor = -200;

// ─── High Score ───────────────────────────────────────────────────────────────
let highScore = parseInt(localStorage.getItem("hh2d_highscore") || "0", 10);

function updateHighScoreDisplay() {
  highscoreb.textContent = `BEST - ${highScore}`;
}

function checkAndSaveHighScore() {
  const current = Math.floor(score);
  if (current > highScore) {
    highScore = current;
    localStorage.setItem("hh2d_highscore", highScore);
  }
  highscoreg.textContent = `BEST SCORE - ${highScore}`;
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Touch / Swipe Support ───────────────────────────────────────────────────
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 30;

stage.addEventListener("touchstart", (e) => {
  const touch = e.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

stage.addEventListener("touchend", (e) => {
  if (!gameStarted) return;
  const touch = e.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
    if (dx < 0) {
      carState.targetLane = Math.max(0, carState.targetLane - 1);
      carState.moveCooldown = moveCooldown;
    } else {
      carState.targetLane = Math.min(LANE_COUNT - 1, carState.targetLane + 1);
      carState.moveCooldown = moveCooldown;
    }
  }
}, { passive: true });
// ─────────────────────────────────────────────────────────────────────────────

const keys = { left: false, right: false };
const carState = {
  lane: 2,
  targetLane: 2,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  moveCooldown: 0,
};

const obstacles = Array.from(document.querySelectorAll(".obstacle")).map(
  (el) => ({
    el,
    width: 0,
    height: 0,
    lane: 0,
    y: 0,
    speed: baseSpeed,
    active: true,
  })
);

document.addEventListener("DOMContentLoaded", () => {
  intro2.play();
  updateHighScoreDisplay();
});

window.addEventListener("load", () => {
  stage.style.setProperty("--stage-width", `${BASE_WIDTH}px`);
  stage.style.setProperty("--stage-height", `${BASE_HEIGHT}px`);
  updateScale();
  computeLanes();
  measureSprites();
  applyDifficulty(currentDifficulty);
  resetAllObstacles();
  placeCarInstant();
  updateHighScoreDisplay();
  requestAnimationFrame(gameLoop);
});

window.addEventListener("resize", () => {
  updateScale();
});

playbutton.addEventListener("click", () => {
  if (countdownRunning) {
    return;
  }
  countdownRunning = true;
  mainMenu.style.visibility = "hidden";
  intro2.pause();
  applyDifficulty(currentDifficulty);
  startCountdown();
});

mainMenubtn.addEventListener("click", () => {
  location.reload();
});

playagain.addEventListener("click", () => {
  location.reload();
});

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const level = button.dataset.difficulty;
    if (!difficultySettings[level]) {
      return;
    }
    currentDifficulty = level;
    applyDifficulty(currentDifficulty);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyH") {
    hornaud.play();
  }
  if (e.code === "ArrowLeft") {
    keys.left = true;
  }
  if (e.code === "ArrowRight") {
    keys.right = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") {
    keys.left = false;
  }
  if (e.code === "ArrowRight") {
    keys.right = false;
  }
});

function updateScale() {
  const scale = Math.min(
    window.innerWidth / BASE_WIDTH,
    window.innerHeight / BASE_HEIGHT
  );
  stage.style.setProperty("--game-scale", scale.toFixed(3));
}

function computeLanes() {
  const roadPadding = BASE_WIDTH * 0.22;
  const usableWidth = BASE_WIDTH - roadPadding * 2;
  const gap = usableWidth / (LANE_COUNT - 1);
  laneCenters = Array.from({ length: LANE_COUNT }, (_, i) => {
    return roadPadding + gap * i;
  });
}

function measureSprites() {
  carState.width = car.offsetWidth;
  carState.height = car.offsetHeight;
  obstacles.forEach((obs) => {
    obs.width = obs.el.offsetWidth;
    obs.height = obs.el.offsetHeight;
  });
}

function placeCarInstant() {
  carState.y = BASE_HEIGHT - carState.height - 20;
  carState.lane = 2;
  carState.targetLane = 2;
  carState.x = laneCenters[carState.targetLane] - carState.width / 2;
  car.style.left = `${carState.x}px`;
  car.style.top = `${carState.y}px`;
}

function startCountdown() {
  timecount = 3;
  timeraud.play();
  gametimer.textContent = timecount;
  gametimercont.style.visibility = "visible";
  gametimercont.style.backgroundColor = "#E53935";

  const countdownInterval = setInterval(() => {
    timecount -= 1;
    gametimer.textContent = timecount;
    if (timecount === 2) {
      gametimercont.style.backgroundColor = "#FBC02D";
    }
    if (timecount === 1) {
      gametimercont.style.backgroundColor = "#43A047";
    }
    if (timecount === 0) {
      clearInterval(countdownInterval);
      gametimercont.style.visibility = "hidden";
      beginGame();
    }
  }, 1000);
}

function beginGame() {
  countdownRunning = false;
  gameStarted = true;
  gameover.style.visibility = "hidden";
  keys.left = false;
  keys.right = false;
  score = 0;
  scoreTimer = 0;
  speedTimer = 0;
  scoreb.textContent = "SCORE - 0";
  carmoveaud.currentTime = 0;
  carmoveaud.play();
  resetAllObstacles();
  placeCarInstant();
}

function resetAllObstacles() {
  spawnCursor = -200;
  let lastLane = carState.lane;
  obstacles.forEach((obs, index) => {
    obs.active = index < maxActiveObstacles;
    obs.el.style.visibility = obs.active ? "visible" : "hidden";
    if (!obs.active) {
      return;
    }
    obs.lane = pickLane(lastLane);
    lastLane = obs.lane;
    obs.speed = baseSpeed + randomInRange(speedOffsetMin, speedOffsetMax);
    obs.y = spawnCursor - randomInRange(0, 80);
    spawnCursor -= minSpawnGap;
    obs.el.style.top = `${obs.y}px`;
    obs.el.style.left = `${laneCenters[obs.lane] - obs.width / 2}px`;
  });
}

function pickLane(excludeLane) {
  let lane = Math.floor(Math.random() * LANE_COUNT);
  if (lane === excludeLane) {
    lane = (lane + 1) % LANE_COUNT;
  }
  return lane;
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function gameLoop(timestamp) {
  if (!lastTime) {
    lastTime = timestamp;
  }
  const dt = Math.min((timestamp - lastTime) / 1000, 0.033);
  lastTime = timestamp;

  if (gameStarted) {
    updateCar(dt);
    updateObstacles(dt);
    updateScoreAndSpeed(timestamp, dt);
    checkCollisions();
  }

  requestAnimationFrame(gameLoop);
}

function updateCar(dt) {
  if (carState.moveCooldown > 0) {
    carState.moveCooldown -= dt;
  }

  if (keys.left && carState.moveCooldown <= 0) {
    carState.targetLane = Math.max(0, carState.targetLane - 1);
    carState.moveCooldown = moveCooldown;
  }

  if (keys.right && carState.moveCooldown <= 0) {
    carState.targetLane = Math.min(LANE_COUNT - 1, carState.targetLane + 1);
    carState.moveCooldown = moveCooldown;
  }

  const targetX = laneCenters[carState.targetLane] - carState.width / 2;
  carState.x += (targetX - carState.x) * Math.min(1, dt * 12);
  car.style.left = `${carState.x}px`;
}

function updateObstacles(dt) {
  obstacles.forEach((obs) => {
    if (!obs.active) {
      return;
    }
    obs.y += obs.speed * dt;
    if (obs.y > BASE_HEIGHT + 150) {
      obs.lane = pickLane(obs.lane);
      obs.speed = baseSpeed + randomInRange(speedOffsetMin, speedOffsetMax);
      obs.y = spawnCursor - randomInRange(0, 80);
      spawnCursor -= minSpawnGap;
    }
    obs.el.style.top = `${obs.y}px`;
    obs.el.style.left = `${laneCenters[obs.lane] - obs.width / 2}px`;
  });
}

function applyDifficulty(level) {
  const settings = difficultySettings[level];
  if (!settings) {
    return;
  }
  baseSpeed = settings.baseSpeed;
  speedOffsetMin = settings.speedOffsetMin;
  speedOffsetMax = settings.speedOffsetMax;
  maxActiveObstacles = settings.maxActiveObstacles;
  minSpawnGap = settings.minSpawnGap;
  moveCooldown = settings.moveCooldown;

  difficultyButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.difficulty === level
    );
  });
}

function updateScoreAndSpeed(timestamp, dt) {
  score += dt;
  scoreTimer += dt;
  speedTimer += dt;

  if (scoreTimer >= 0.2) {
    scoreb.textContent = `SCORE - ${Math.floor(score)}`;
    scoreTimer = 0;
  }

  if (speedTimer >= 0.25) {
    const speedWave = Math.abs(Math.sin(timestamp / 900));
    const speedValue = Math.round(110 + speedWave * 50);
    speedb.textContent = `SPEED - ${speedValue} KM/H`;
    speedTimer = 0;
  }
}

function checkCollisions() {
  const carRect = {
    x: carState.x + carState.width * 0.12,
    y: carState.y + carState.height * 0.12,
    w: carState.width * 0.76,
    h: carState.height * 0.76,
  };

  for (const obs of obstacles) {
    if (!obs.active) {
      continue;
    }
    const obsRect = {
      x: laneCenters[obs.lane] - obs.width / 2 + obs.width * 0.15,
      y: obs.y + obs.height * 0.1,
      w: obs.width * 0.7,
      h: obs.height * 0.8,
    };

    if (rectsOverlap(carRect, obsRect)) {
      triggerCrash();
      break;
    }
  }
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function triggerCrash() {
  if (!gameStarted) {
    return;
  }
  gameStarted = false;
  carmoveaud.pause();
  crashaud.currentTime = 0;
  crashaud.play();
  checkAndSaveHighScore();
  gameover.style.visibility = "visible";
  scoreg.textContent = `YOUR SCORE - ${Math.floor(score)}`;
}