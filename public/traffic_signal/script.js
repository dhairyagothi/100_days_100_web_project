const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

let W,
  H,
  gameRunning = false,
  paused = false,
  isNight = false;
let score = 0,
  carsPassed = 0,
  collisions = 0,
  level = 1;
let signal = 'red';
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
  '#e74c3c',
  '#3498db',
  '#f39c12',
  '#2ecc71',
  '#9b59b6',
  '#1abc9c',
  '#e67e22',
  '#ecf0f1',
];
const CAR_TYPES = ['sedan', 'truck', 'bus', 'sports'];

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
    state: 'moving',
    passed: false,
    collided: false,
    alpha: 1,
  };
}

function getStopX(car) {
  return car.goRight ? INTERSECTION_X - car.w - 14 : INTERSECTION_X + 14;
}

function nextSignal() {
  if (signal === 'red') {
    signal = 'green';
    signalMax = SIGNAL_DURATIONS.green - Math.min(level * 0.12, 2);
  } else if (signal === 'green') {
    signal = 'yellow';
    signalMax = SIGNAL_DURATIONS.yellow;
  } else {
    signal = 'red';
    signalMax = SIGNAL_DURATIONS.red - Math.min(level * 0.08, 2);
  }
  signalTimer = signalMax;
  updateSignalUI();
}

function updateSignalUI() {
  document.getElementById('red-light').className =
    'signal-light' + (signal === 'red' ? ' active-red' : '');
  document.getElementById('yellow-light').className =
    'signal-light' + (signal === 'yellow' ? ' active-yellow' : '');
  document.getElementById('green-light').className =
    'signal-light' + (signal === 'green' ? ' active-green' : '');
  const bar = document.getElementById('timer-bar');
  bar.style.background =
    signal === 'red'
      ? 'var(--red)'
      : signal === 'yellow'
        ? 'var(--yellow)'
        : 'var(--green)';
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
  signal = 'red';
  signalTimer = SIGNAL_DURATIONS.red;
  signalMax = SIGNAL_DURATIONS.red;
  spawnTimer = 0;
  levelTimer = 0;
  updateSignalUI();
  updateHUD();
}

function updateHUD() {
  document.getElementById('score-display').textContent = score;
  document.getElementById('passed-display').textContent = carsPassed;
  document.getElementById('collision-display').textContent = collisions;
  document.getElementById('level-display').textContent = level;
  document.getElementById('diff-badge').textContent =
    `LEVEL ${level} — ${level < 3 ? 'EASY' : level < 6 ? 'MEDIUM' : level < 9 ? 'HARD' : 'EXTREME'}`;
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
  document.getElementById('timer-bar').style.width = pct * 100 + '%';
  document.getElementById('timer-count').textContent =
    Math.ceil(signalTimer) + 's';
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
      (c) => c.lane === lane && !c.passed && !c.collided
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
    if (signal === 'red' || signal === 'yellow') {
      if (atStop) {
        car.state = 'stopped';
        car.x = car.goRight ? stopX - car.w : stopX;
      } else {
        const dist = car.goRight ? stopX - car.w - car.x : car.x - stopX;
        const slowZone = 120;
        const spd =
          dist < slowZone
            ? car.speed * (0.3 + 0.7 * (dist / slowZone))
            : car.speed;
        car.x += (car.goRight ? 1 : -1) * spd * 60 * dt;
        car.state = dist < slowZone ? 'stopping' : 'moving';
      }
    } else {
      car.state = 'moving';
      car.x += (car.goRight ? 1 : -1) * car.speed * 60 * dt;
    }
    if (!car.passed) {
      const clearRight = car.goRight && car.x > W + 20;
      const clearLeft = !car.goRight && car.x + car.w < -20;
      if (clearRight || clearLeft) {
        car.passed = true;
        carsPassed++;
        score += 10 + level * 2;
        updateHUD();
      }
    }
  });

  for (let i = 0; i < cars.length; i++) {
    if (cars[i].collided || cars[i].passed) continue;

    for (let j = i + 1; j < cars.length; j++) {
      if (cars[j].collided || cars[j].passed) continue;

      const a = cars[i];
      const b = cars[j];

      const isOverlapping =
        a.x < b.x + b.w - 4 &&
        a.x + a.w > b.x + 4 &&
        a.y < b.y + b.h - 4 &&
        a.y + a.h > b.y + 4;

      if (!isOverlapping) continue;

      a.collided = true;
      b.collided = true;

      collisions++;
      score = Math.max(0, score - 30);

      updateHUD();
      flashRed();
    }
  }

  clouds.forEach((c) => {
    c.x += c.speed * dt;
    if (c.x > W + 200) c.x = -200;
  });
  cars = cars.filter(
    (c) => c.alpha > 0 && !(c.passed && (c.x > W + 200 || c.x < -200))
  );
}

function flashRed() {
  const el = document.getElementById('collision-flash');
  el.style.background = 'rgba(255,0,0,0.35)';
  setTimeout(() => (el.style.background = 'rgba(255,0,0,0)'), 250);
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
    grad.addColorStop(0, '#02020f');
    grad.addColorStop(1, '#0d0d3a');
  } else {
    grad.addColorStop(0, '#3a9bd5');
    grad.addColorStop(1, '#aee8f5');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, SKY_H);
}

function drawCloudsOrStars() {
  if (isNight) {
    ctx.fillStyle = '#fff';
    stars.forEach((s) => {
      ctx.globalAlpha = 0.5 + 0.5 * Math.sin(Date.now() / 1000 + s.x);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(W * 0.88, SKY_H * 0.18, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#fffde7';
    ctx.shadowColor = '#fffde7';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(W * 0.88 + 10, SKY_H * 0.18 - 4, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#02020f';
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(W * 0.85, SKY_H * 0.2, 36, 0, Math.PI * 2);
    ctx.fillStyle = '#ffe87c';
    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = 40;
    ctx.fill();
    ctx.shadowBlur = 0;
    clouds.forEach((c) => {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      drawCloud(c.x, c.y, c.w);
    });
  }
}

// Function definitions split up for clarity
function drawCloud(x, y, w) {
  const r = w * 0.18;
  ctx.beginPath();
  ctx.ellipse(x + w * 0.3, y + r, r * 1.5, r, 0, 0, Math.PI * 2);
  ctx.ellipse(x + w * 0.55, y, r * 2, r * 1.2, 0, 0, Math.PI * 2);
  ctx.ellipse(x + w * 0.75, y + r * 0.5, r * 1.3, r * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBuildings() {
  buildings.forEach((b) => {
    const by = SKY_H - b.h;
    ctx.fillStyle = isNight ? '#1a1a2e' : '#8b7355';
    ctx.fillRect(b.x, by, b.w, b.h);
    b.windows.forEach((win) => {
      const wx = b.x + 5 + win.c * 14;
      const wy = by + 8 + win.r * 18;
      if (wx + 8 > b.x + b.w - 3) return;
      if (isNight && win.on) {
        ctx.fillStyle = 'rgba(255,240,150,0.7)';
      } else if (!isNight) {
        ctx.fillStyle = 'rgba(180,220,255,0.5)';
      } else {
        ctx.fillStyle = 'rgba(40,40,60,0.8)';
      }
      ctx.fillRect(wx, wy, 8, 10);
    });
  });
}

function drawRoad() {
  const grad = ctx.createLinearGradient(0, ROAD_TOP, 0, ROAD_BOTTOM);
  if (isNight) {
    grad.addColorStop(0, '#2a2a2a');
    grad.addColorStop(1, '#1a1a1a');
  } else {
    grad.addColorStop(0, '#5a5a5a');
    grad.addColorStop(1, '#444');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, ROAD_TOP, W, ROAD_BOTTOM - ROAD_TOP);
  ctx.fillStyle = isNight ? '#1a1a1a' : '#7a6a55';
  ctx.fillRect(0, ROAD_TOP - 6, W, 6);
  ctx.fillRect(0, ROAD_BOTTOM, W, 6);
  for (let i = 1; i < LANE_COUNT; i++) {
    const y = ROAD_TOP + i * LANE_H;
    if (i === 3) {
      ctx.strokeStyle = '#ffcc00';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = isNight
        ? 'rgba(255,255,255,0.25)'
        : 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([20, 20]);
    }
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawGround() {
  const grad = ctx.createLinearGradient(0, ROAD_BOTTOM + 6, 0, H);
  if (isNight) {
    grad.addColorStop(0, '#0d1a0d');
    grad.addColorStop(1, '#050d05');
  } else {
    grad.addColorStop(0, '#5a8a4a');
    grad.addColorStop(1, '#3a6a2a');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, ROAD_BOTTOM + 6, W, H - ROAD_BOTTOM - 6);
}

function drawIntersection() {
  const iw = 80;
  const stripes = 6;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle =
      i % 2 === 0
        ? isNight
          ? 'rgba(255,255,255,0.5)'
          : 'rgba(255,255,255,0.7)'
        : 'transparent';
    const sx = INTERSECTION_X - iw / 2 + i * (iw / stripes);
    ctx.fillRect(sx, ROAD_TOP, iw / stripes, ROAD_BOTTOM - ROAD_TOP);
  }
  ctx.strokeStyle = isNight ? 'rgba(255,255,255,0.8)' : '#fff';
  ctx.lineWidth = 3;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(INTERSECTION_X - iw / 2 - 2, ROAD_TOP);
  ctx.lineTo(INTERSECTION_X - iw / 2 - 2, ROAD_BOTTOM);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(INTERSECTION_X + iw / 2 + 2, ROAD_TOP);
  ctx.lineTo(INTERSECTION_X + iw / 2 + 2, ROAD_BOTTOM);
  ctx.stroke();
}

function drawTrafficLight() {
  const tx = INTERSECTION_X - 44;
  const ty = ROAD_TOP - 80;
  const ph = 90,
    pw = 24;
  ctx.fillStyle = isNight ? '#555' : '#777';
  ctx.fillRect(tx + pw / 2 - 3, ty + ph, 6, 80);
  ctx.fillStyle = '#111';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(tx, ty, pw, ph, 5);
  ctx.fill();
  ctx.stroke();
  const lights = [
    { col: '#ff2222', active: signal === 'red' },
    { col: '#ffcc00', active: signal === 'yellow' },
    { col: '#00ff44', active: signal === 'green' },
  ];
  lights.forEach((l, i) => {
    const lx = tx + pw / 2,
      ly = ty + 14 + i * 26;
    ctx.beginPath();
    ctx.arc(lx, ly, 8, 0, Math.PI * 2);
    if (l.active) {
      ctx.fillStyle = l.col;
      ctx.shadowColor = l.col;
      ctx.shadowBlur = 18;
    } else {
      ctx.fillStyle = '#1a1a1a';
      ctx.shadowBlur = 0;
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

function drawCars() {
  cars.forEach((car) => {
    if (car.alpha <= 0) return;
    ctx.globalAlpha = car.alpha;
    drawCar(car);
    ctx.globalAlpha = 1;
  });
}

function drawCar(car) {
  const { x, y, w, h, color, type, goRight, state, collided } = car;
  ctx.save();
  if (!goRight) {
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(x + w / 2), -(y + h / 2));
  }
  ctx.fillStyle = collided ? '#ff4400' : color;
  if (collided) {
    ctx.shadowColor = '#ff4400';
    ctx.shadowBlur = 20;
  }
  ctx.beginPath();
  ctx.roundRect(x, y + h * 0.25, w, h * 0.75, 4);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.arc(x + w * 0.2, y + h - 5, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + w * 0.78, y + h - 5, 5, 0, Math.PI * 2);
  ctx.fill();
  if (state === 'stopping' || state === 'stopped') {
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = '#f00';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.ellipse(x + 2, y + h * 0.55, 4, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function toggleDayNight() {
  isNight = !isNight;
}
function togglePause() {
  paused = !paused;
  const btn = document.querySelector('#controls .ctrl-btn:last-child');
  btn.textContent = paused ? '▶ Resume' : '⏸ Pause';
}

function startGame() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('stats-row').style.display = 'none';
  gameRunning = true;
  paused = false;
  initGame();
  lastTime = performance.now();
  cancelAnimationFrame(animFrame);
  animFrame = requestAnimationFrame(loop);
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(animFrame);
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-passed').textContent = carsPassed;
  document.getElementById('final-collisions').textContent = collisions;
  document.getElementById('final-level').textContent = level;
  document.getElementById('stats-row').style.display = 'flex';
  document.querySelector('#overlay h1').textContent = '🚗 GAME OVER';
  document.getElementById('start-btn').textContent = 'PLAY AGAIN';
  document.getElementById('overlay').style.display = 'flex';
}

calcLayout();
genBuildings();
genStars();
genClouds();

(function previewDraw() {
  if (!gameRunning) {
    calcLayout();
    draw();
    requestAnimationFrame(previewDraw);
  }
})();
