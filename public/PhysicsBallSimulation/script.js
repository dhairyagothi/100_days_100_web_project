const COLORS = [
  '#7c3aed', '#db2777', '#ea580c', '#d97706',
  '#16a34a', '#0284c7', '#0891b2', '#7c3aed',
  '#9333ea', '#e11d48', '#2563eb', '#059669',
];

const MAX  = 80;
const STEPS = 4;
const ITERS = 2;

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

class Ball {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.den = density;
    this.mass = density * r ** 3;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6 - 2;
    this.color = COLORS[Math.random() * COLORS.length | 0];
    this.rgb = hexToRgb(this.color);
    this.trail = [];
    this.hot = false;
  }

  step(g, e) {
    this.vy += g;
    this.vx *= 0.9992;
    this.vy *= 0.9992;

    const spd = Math.hypot(this.vx, this.vy);
    if (spd > 40) { this.vx *= 40 / spd; this.vy *= 40 / spd; }

    this.x += this.vx / STEPS;
    this.y += this.vy / STEPS;

    const W = canvas.width, H = canvas.height;

    if (this.x - this.r < 0)    { this.x = this.r;     this.vx =  Math.abs(this.vx) * e; }
    if (this.x + this.r > W)    { this.x = W - this.r; this.vx = -Math.abs(this.vx) * e; }
    if (this.y - this.r < 0)    { this.y = this.r;     this.vy =  Math.abs(this.vy) * e; }
    if (this.y + this.r > H) {
      this.y  = H - this.r;
      this.vy = -Math.abs(this.vy) * e;
      this.vx *= 0.92;
      if (Math.abs(this.vy) < 1.5) this.vy = 0;
      if (Math.abs(this.vx) < 0.4) this.vx = 0;
    }
  }

  pushTrail(max) {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > max + 2) this.trail.shift();
  }

  draw(ctx, tLen) {
    const [r, g, b] = this.rgb;

    if (tLen > 0 && this.trail.length > 1) {
      const start = Math.max(0, this.trail.length - tLen);
      const span = this.trail.length - 1 - start || 1;
      for (let i = start; i < this.trail.length - 1; i++) {
        const t = (i - start) / span;
        ctx.beginPath();
        ctx.moveTo(this.trail[i].x, this.trail[i].y);
        ctx.lineTo(this.trail[i + 1].x, this.trail[i + 1].y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${t * 0.28})`;
        ctx.lineWidth = this.r * (0.25 + t * 0.55);
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }

    const x = this.x, y = this.y, rd = this.r;
    const df = Math.min(1.4, Math.max(0.35, this.den));

    const glow = ctx.createRadialGradient(x, y, rd * 0.4, x, y, rd * 1.55);
    glow.addColorStop(0, `rgba(${r},${g},${b},${+(0.18 * df).toFixed(2)})`);
    glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
    ctx.beginPath(); ctx.arc(x, y, rd * 1.55, 0, Math.PI * 2);
    ctx.fillStyle = glow; ctx.fill();

    const body = ctx.createRadialGradient(x, y - rd * 0.2, rd * 0.05, x, y, rd);
    body.addColorStop(0,    `rgba(${r},${g},${b},${Math.min(1, 0.38 * df).toFixed(2)})`);
    body.addColorStop(0.55, `rgba(${r},${g},${b},${Math.min(1, 0.58 * df).toFixed(2)})`);
    body.addColorStop(1,    `rgba(${r},${g},${b},${Math.min(1, 0.78 * df).toFixed(2)})`);
    ctx.beginPath(); ctx.arc(x, y, rd, 0, Math.PI * 2);
    ctx.fillStyle = body; ctx.fill();

    ctx.beginPath(); ctx.arc(x, y, rd, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.7)`;
    ctx.lineWidth = 1.5; ctx.stroke();

    const dome = ctx.createRadialGradient(
      x - rd * 0.18, y - rd * 0.28, 0,
      x - rd * 0.18, y - rd * 0.28, rd * 0.78
    );
    dome.addColorStop(0,    'rgba(255,255,255,0.55)');
    dome.addColorStop(0.45, 'rgba(255,255,255,0.15)');
    dome.addColorStop(1,    'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(x, y, rd, 0, Math.PI * 2);
    ctx.fillStyle = dome; ctx.fill();

    ctx.beginPath();
    ctx.arc(x - rd * 0.3, y - rd * 0.36, rd * 0.19, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.fill();

    const caustic = ctx.createRadialGradient(
      x + rd * 0.18, y + rd * 0.28, 0,
      x + rd * 0.18, y + rd * 0.28, rd * 0.55
    );
    caustic.addColorStop(0, 'rgba(255,255,255,0.22)');
    caustic.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(x, y, rd, 0, Math.PI * 2);
    ctx.fillStyle = caustic; ctx.fill();

    if (this.hot) {
      ctx.beginPath(); ctx.arc(x, y, rd + 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
      ctx.lineWidth = 2.5; ctx.stroke();
    }
  }
}

function collide(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const min = a.r + b.r;
  if (dist >= min || dist < 0.001) return;

  const nx = dx / dist, ny = dy / dist;
  const ia = 1 / a.mass, ib = 1 / b.mass, iSum = ia + ib;

  // partial correction — full push creates energy in dense piles
  const corr = (min - dist) * 0.3 / iSum;
  a.x -= nx * corr * ia;  a.y -= ny * corr * ia;
  b.x += nx * corr * ib;  b.y += ny * corr * ib;

  const dot = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
  if (dot < 0) return;

  const j = -1.72 * dot / iSum;
  a.vx += j * ia * nx;  a.vy += j * ia * ny;
  b.vx -= j * ib * nx;  b.vy -= j * ib * ny;
}

const balls = [];
let gravity = 0.2, elasticity = 0.75, ballSize = 22, trailLen = 16, density = 1.0;
let paused = false, over = null;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  return [
    (e.clientX - rect.left) * (canvas.width  / rect.width),
    (e.clientY - rect.top)  * (canvas.height / rect.height),
  ];
}

function ballAt(x, y) {
  for (let i = balls.length - 1; i >= 0; i--)
    if (Math.hypot(x - balls[i].x, y - balls[i].y) <= balls[i].r) return i;
  return -1;
}

function spawn(x, y) {
  if (balls.length >= MAX) return;
  balls.push(new Ball(x, y, ballSize));
  document.getElementById('ball-count').textContent = balls.length;
}

function addBall() {
  const r = ballSize;
  spawn(
    r + Math.random() * (canvas.width - 2 * r),
    canvas.height * 0.25 + Math.random() * canvas.height * 0.55
  );
}

function reset() {
  balls.length = 0;
  over = null;
  document.getElementById('ball-count').textContent = 0;
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!paused) {
    const g = gravity / STEPS;
    for (let s = 0; s < STEPS; s++) {
      for (const b of balls) b.step(g, elasticity);
      for (let k = 0; k < ITERS; k++)
        for (let i = 0; i < balls.length; i++)
          for (let j = i + 1; j < balls.length; j++)
            collide(balls[i], balls[j]);
    }
    for (const b of balls) b.pushTrail(trailLen);
  }

  for (const b of balls) b.draw(ctx, trailLen);
  requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', () => {
  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('click', e => {
    const [x, y] = getPos(e);
    if (ballAt(x, y) === -1) spawn(x, y);
  });

  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    const [x, y] = getPos(e);
    const i = ballAt(x, y);
    if (i !== -1) { balls.splice(i, 1); over = null; document.getElementById('ball-count').textContent = balls.length; }
  });

  let dragging = false, dragX = null, dragY = null;

  canvas.addEventListener('mousedown', e => { if (!e.button) { dragging = true; dragX = dragY = null; } });
  canvas.addEventListener('mouseup',   () => { dragging = false; });

  canvas.addEventListener('mousemove', e => {
    const [x, y] = getPos(e);

    if (dragging && (dragX === null || Math.hypot(x - dragX, y - dragY) > 35)) {
      spawn(x, y); dragX = x; dragY = y;
    }

    const i = ballAt(x, y);
    if (over) over.hot = false;
    over = i !== -1 ? balls[i] : null;
    if (over) over.hot = true;
    canvas.style.cursor = over ? 'pointer' : 'crosshair';
  });

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      const rect = canvas.getBoundingClientRect();
      spawn(t.clientX - rect.left, t.clientY - rect.top);
    }
  }, { passive: false });

  document.getElementById('add-btn').addEventListener('click', addBall);

  document.getElementById('pause-btn').addEventListener('click', () => {
    paused = !paused;
    document.getElementById('pause-btn').textContent = paused ? '▶' : '⏸';
    document.getElementById('pause-btn').classList.toggle('paused', paused);
  });

  document.getElementById('clear-btn').addEventListener('click', reset);

  // Info Modal Event Handling
  const infoBtn = document.getElementById('info-btn');
  const modalOverlay = document.getElementById('physics-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openModal() {
    paused = true;
    document.getElementById('pause-btn').textContent = '▶';
    document.getElementById('pause-btn').classList.add('paused');
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
  }

  infoBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  document.getElementById('gravity').addEventListener('input', e => {
    gravity = +e.target.value;
    document.getElementById('gravity-val').textContent = gravity.toFixed(2);
  });

  document.getElementById('elasticity').addEventListener('input', e => {
    elasticity = +e.target.value;
    document.getElementById('elasticity-val').textContent = elasticity.toFixed(2);
  });

  document.getElementById('ball-size').addEventListener('input', e => {
    ballSize = +e.target.value;
    document.getElementById('ball-size-val').textContent = ballSize;
  });

  document.getElementById('trail').addEventListener('input', e => {
    trailLen = +e.target.value;
    document.getElementById('trail-val').textContent = trailLen;
    for (const b of balls) b.trail = [];
  });

  document.getElementById('density').addEventListener('input', e => {
    density = +e.target.value;
    document.getElementById('density-val').textContent = density.toFixed(1);
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); document.getElementById('pause-btn').click(); }
    if (e.key === 'c' || e.key === 'C') reset();
    if (e.key === 'Escape') closeModal();
  });

  requestAnimationFrame(() => { resize(); for (let i = 0; i < 12; i++) addBall(); loop(); });
});
