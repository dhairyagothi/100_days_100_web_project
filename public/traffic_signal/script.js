const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let W,
  H,
  gameRunning = false,
  paused = false,
  isNight = false;
let score = 0,
  carsPassed = 0,
  collisions = 0,
  level = 1;
let signal = "red";
let signalTimer = 0;
const SIGNAL_DURATIONS = { red: 5, yellow: 1.5, green: 4 };
let signalMax = SIGNAL_DURATIONS.red;
let cars = [],
  clouds = [],
  stars = [],
  buildings = [];
let spawnTimer = 0,
  levelTimer = 0;
let animFrame;
let lastTime = 0;

const LANE_COUNT = 5;
let ROAD_TOP, ROAD_BOTTOM, LANE_H, INTERSECTION_X, GROUND_H, SKY_H;

function calcLayout() {
  W = canvas.width;
  H = canvas.height;
  SKY_H = H * 0.5;
  ROAD_TOP = H * 0.5;
  ROAD_BOTTOM = H * 0.78;
  LANE_H = (ROAD_BOTTOM - ROAD_TOP) / LANE_COUNT;
  INTERSECTION_X = W * 0.52;
  GROUND_H = H - ROAD_BOTTOM;
}

function genBuildings() {
  buildings = [];
  const count = 14;
  for (let i = 0; i < count; i++) {
    const bw = 40 + Math.random() * 70;
    const bh = 60 + Math.random() * 150;
    const bx = (W / count) * i + Math.random() * 20 - 10;
    buildings.push({ x: bx, w: bw, h: bh, windows: [] });
    const cols = Math.floor(bw / 14);
    const rows = Math.floor(bh / 18);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        buildings[buildings.length - 1].windows.push({
          r,
          c,
          on: Math.random() > 0.35,
        });
  }
}

function genStars() {
  stars = [];
  for (let i = 0; i < 120; i++)
    stars.push({
      x: Math.random() * W,
      y: Math.random() * SKY_H * 0.9,
      r: 0.5 + Math.random() * 1.5,
    });
}

function genClouds() {
  clouds = [];
  for (let i = 0; i < 5; i++)
    clouds.push({
      x: Math.random() * W,
      y: 30 + Math.random() * 80,
      w: 80 + Math.random() * 120,
      speed: 10 + Math.random() * 15,
    });
}

const CAR_COLORS = [
  "#e74c3c",
  "#3498db",
  "#f39c12",
  "#2ecc71",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#ecf0f1",
];
const CAR_TYPES = ["sedan", "truck", "bus", "sports"];

function makeCar(lane) {
  const goRight = lane < 3;
  const type = CAR_TYPES[Math.floor(Math.random() * CAR_TYPES.length)];
  const baseSpeed = (1.5 + Math.random()) * (0.8 + level * 0.12);
  const dims = {
    sedan: { w: 50, h: 22 },
    truck: { w: 70, h: 24 },
    bus: { w: 90, h: 26 },
    sports: { w: 46, h: 19 },
  };
  const d = dims[type];
  const y = ROAD_TOP + lane * LANE_H + (LANE_H - d.h) / 2;
  return {
    x: goRight ? -d.w - 10 : W + d.w + 10,
    y,
    lane,
    goRight,
    type,
    w: d.w,
    h: d.h,
    color: CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)],
    speed: baseSpeed,
    state: "moving",
    passed: false,
    collided: false,
    alpha: 1,
  };
}

function getStopX(car) {
  return car.goRight ? INTERSECTION_X - car.w - 14 : INTERSECTION_X + 14;
}

function nextSignal() {
  if (signal === "red") {
    signal = "green";
    signalMax = SIGNAL_DURATIONS.green - Math.min(level * 0.12, 2);
  } else if (signal === "green") {
    signal = "yellow";
    signalMax = SIGNAL_DURATIONS.yellow;
  } else {
    signal = "red";
    signalMax = SIGNAL_DURATIONS.red - Math.min(level * 0.08, 2);
  }
  signalTimer = signalMax;
  updateSignalUI();
}

function updateSignalUI() {
  document.getElementById("red-light").className =
    "signal-light" + (signal === "red" ? " active-red" : "");
  document.getElementById("yellow-light").className =
    "signal-light" + (signal === "yellow" ? " active-yellow" : "");
  document.getElementById("green-light").className =
    "signal-light" + (signal === "green" ? " active-green" : "");
  const bar = document.getElementById("timer-bar");
  bar.style.background =
    signal === "red"
      ? "var(--red)"
      : signal === "yellow"
        ? "var(--yellow)"
        : "var(--green)";
}

function initGame() {
  calcLayout();
  genBuildings();
  genStars();
  genClouds();
  cars = [];
  score = 0;
  carsPassed = 0;
  collisions = 0;
  level = 1;
  signal = "red";
  signalTimer = SIGNAL_DURATIONS.red;
  signalMax = SIGNAL_DURATIONS.red;
  spawnTimer = 0;
  levelTimer = 0;
  updateSignalUI();
  updateHUD();
}

function updateHUD() {
  document.getElementById("score-display").textContent = score;
  document.getElementById("passed-display").textContent = carsPassed;
  document.getElementById("collision-display").textContent = collisions;
  document.getElementById("level-display").textContent = level;
  document.getElementById("diff-badge").textContent =
    `LEVEL ${level} — ${level < 3 ? "EASY" : level < 6 ? "MEDIUM" : level < 9 ? "HARD" : "EXTREME"}`;
  if (collisions >= 5) endGame();
}

function loop(ts) {
  if (!gameRunning) return;
  const dt = Math.min((ts - lastTime) / 1000, 0.05);
  lastTime = ts;
  if (!paused) update(dt);
  draw();
  animFrame = requestAnimationFrame(loop);
}

function update(dt) {
  signalTimer -= dt;
  if (signalTimer <= 0) nextSignal();

  const pct = Math.max(0, signalTimer / signalMax);
  document.getElementById("timer-bar").style.width = pct * 100 + "%";
  document.getElementById("timer-count").textContent =
    Math.ceil(signalTimer) + "s";

  levelTimer += dt;
  if (levelTimer > 20) {
    level = Math.min(level + 1, 12);
    levelTimer = 0;
    updateHUD();
  }

  spawnTimer -= dt;
  const spawnRate = Math.max(0.6, 2.2 - level * 0.12);
  if (spawnTimer <= 0) {
    const lane = Math.floor(Math.random() * LANE_COUNT);
    const maxCarsInLane = cars.filter(
      (c) => c.lane === lane && !c.passed && !c.collided,
    ).length;
    if (maxCarsInLane < 4) cars.push(makeCar(lane));
    spawnTimer = spawnRate + Math.random() * 0.5;
  }

  cars.forEach((car) => {
    if (car.collided) {
      car.alpha -= dt * 1.5;
      return;
    }
    if (car.passed) {
      car.x += (car.goRight ? 1 : -1) * car.speed * 60 * dt;
      return;
    }
    const stopX = getStopX(car);
    const atStop = car.goRight
      ? car.x + car.w >= stopX - 2
      : car.x <= stopX + 2;

    if (signal === "red" || signal === "yellow") {
      if (atStop) {
        car.state = "stopped";
        car.x = car.goRight ? stopX - car.w : stopX;
      } else {
        const dist = car.goRight ? stopX - car.w - car.x : car.x - stopX;
        const slowZone = 120;
        const spd =
          dist < slowZone
            ? car.speed * (0.3 + 0.7 * (dist / slowZone))
            : car.speed;
        car.x += (car.goRight ? 1 : -1) * spd * 60 * dt;
        car.state = dist < slowZone ? "stopping" : "moving";
      }
    } else {
      car.state = "moving";
      car.x += (car.goRight ? 1 : -1) * car.speed * 60 * dt;
    }

    if (!car.passed) {
      const clearRight = car.goRight && car.x > W + 20;
      const clearLeft = !car.goRight && car.x + car.w < -20;
      if (clearRight || clearLeft) {
        car.passed = true;
        carsPassed++;
        // CHANGED: Increased score boost per car from 10 to 25
        score += 25 + level * 2;
        updateHUD();
      }
    }
  }
  );

  for (let i = 0; i < cars.length; i++) {
    if (cars[i].collided || cars[i].passed) continue;
    for (let j = i + 1; j < cars.length; j++) {
      if (cars[j].collided || cars[j].passed) continue;
      if (cars[i].lane !== cars[j].lane) continue;
      const a = cars[i],
        b = cars[j];
      if (
        a.x < b.x + b.w - 4 &&
        a.x + a.w > b.x + 4 &&
        a.y < b.y + b.h - 4 &&
        a.y + a.h > b.y + 4
      ) {
        a.collided = b.collided = true;
        collisions++;
        // CHANGED: Lowered collision penalty from -30 to -5
        score = Math.max(0, score - 5);
        updateHUD();
        flashRed();
      }
    }
  }

  clouds.forEach((c) => {
    c.x += c.speed * dt;
    if (c.x > W + 200) c.x = -200;
  });

  cars = cars.filter(
    (c) => c.alpha > 0 && !(c.passed && (c.x > W + 200 || c.x < -200)),
  );
}

function flashRed() {
  const el = document.getElementById("collision-flash");
  el.style.background = "rgba(255,0,0,0.35)";
  setTimeout(() => (el.style.background = "rgba(255,0,0,0)"), 250);
}

function draw() {
  calcLayout();
  ctx.clearRect(0, 0, W, H);
  drawSky();
  drawBuildings();
  drawCloudsOrStars();
  drawRoad();
  drawIntersection();
  drawTrafficLight();
  drawCars();
  drawGround();
}

function drawSky() {
  const grad = ctx.createLinearGradient(0, 0, 0, SKY_H);
  if (isNight) {
    grad.addColorStop(0, "#02020f");
    grad.addColorStop(1, "#0d0d3a");
  } else {
    grad.addColorStop(0, "#3a9bd5");
    grad.addColorStop(1, "#aee8f5");