const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
const fpsDisplay = document.getElementById('fpsDisplay');

const themes = {
  ocean:  ['#1D9E75', '#378ADD', '#534AB7', '#5DCAA5', '#85B7EB', '#1d6ea5'],
  fire:   ['#D85A30', '#BA7517', '#EF9F27', '#E24B4A', '#F0997B', '#FAC775'],
  aurora: ['#534AB7', '#1D9E75', '#D4537E', '#AFA9EC', '#5DCAA5', '#ED93B1'],
  mono:   ['#888780', '#B4B2A9', '#5F5E5A', '#D3D1C7', '#444441', '#ffffff'],
  candy:  ['#ff6eb4', '#ff9f43', '#54a0ff', '#5f27cd', '#00d2d3', '#ff6b6b'],
};

let currentTheme = 'ocean';
let particles = [];
let animId = null;
let isPaused = false;
let time = 0;
let speed = 4;
let targetCount = 120;
let pSize = 2;
let connectRange = 80;
let mouseX = -9999;
let mouseY = -9999;

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor(init) {
    this.reset(init);
  }

  reset(init) {
    this.x = Math.random() * canvas.width;
    this.baseY = Math.random() * canvas.height;
    this.y = init ? this.baseY : canvas.height + 10;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.phase = Math.random() * Math.PI * 2;
    this.freq = 0.002 + Math.random() * 0.005;
    this.amp = 15 + Math.random() * 45;
    this.alpha = 0.35 + Math.random() * 0.65;
    this.color = themes[currentTheme][Math.floor(Math.random() * themes[currentTheme].length)];
    this.radius = pSize * (0.5 + Math.random() * 0.9);
    this.life = 0;
    this.maxLife = 250 + Math.random() * 500;
  }

  update(t) {
    this.life++;

    const wave = Math.sin(this.x * this.freq + t * 0.015 * speed + this.phase) * this.amp;
    const wave2 = Math.cos(this.x * this.freq * 0.5 + t * 0.008 * speed + this.phase) * (this.amp * 0.3);

    this.x += this.vx * speed * 0.25;
    this.y = this.baseY + wave + wave2;
    this.baseY += this.vy * speed * 0.08;

    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const mouseDist = Math.sqrt(dx * dx + dy * dy);
    if (mouseDist < 100) {
      const force = (100 - mouseDist) / 100;
      this.x += (dx / mouseDist) * force * 2;
      this.baseY += (dy / mouseDist) * force * 1.5;
    }

    if (this.x < -20) this.x = canvas.width + 10;
    if (this.x > canvas.width + 20) this.x = -10;
    if (this.baseY < -40 || this.baseY > canvas.height + 40 || this.life > this.maxLife) {
      this.baseY = Math.random() * canvas.height;
      this.life = 0;
      this.color = themes[currentTheme][Math.floor(Math.random() * themes[currentTheme].length)];
    }
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles(n) {
  particles = Array.from({ length: n }, () => new Particle(true));
}

function drawConnections() {
  if (connectRange === 0) return;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < connectRange) {
        ctx.globalAlpha = (1 - dist / connectRange) * 0.2;
        ctx.strokeStyle = particles[i].color;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function updateFPS() {
  const now = performance.now();
  frameCount++;
  if (now - lastTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = now;
    fpsDisplay.textContent = fps + ' FPS';
  }
}

function loop() {
  if (isPaused) return;

  time++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  while (particles.length < targetCount) particles.push(new Particle(false));
  while (particles.length > targetCount) particles.pop();

  drawConnections();
  ctx.globalAlpha = 1;
  particles.forEach(p => { p.update(time); p.draw(); });
  ctx.globalAlpha = 1;

  updateFPS();
  animId = requestAnimationFrame(loop);
}

resize();
initParticles(targetCount);
loop();

window.addEventListener('resize', () => {
  resize();
});

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
  mouseX = -9999;
  mouseY = -9999;
});

canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  mouseX = e.touches[0].clientX - rect.left;
  mouseY = e.touches[0].clientY - rect.top;
}, { passive: false });

canvas.addEventListener('touchend', () => {
  mouseX = -9999;
  mouseY = -9999;
});

document.getElementById('speedSlider').addEventListener('input', e => {
  speed = +e.target.value;
  document.getElementById('speedVal').textContent = speed;
});

document.getElementById('countSlider').addEventListener('input', e => {
  targetCount = +e.target.value;
  document.getElementById('countVal').textContent = targetCount;
});

document.getElementById('sizeSlider').addEventListener('input', e => {
  pSize = +e.target.value;
  document.getElementById('sizeVal').textContent = pSize;
  particles.forEach(p => p.radius = pSize * (0.5 + Math.random() * 0.9));
});

document.getElementById('connectSlider').addEventListener('input', e => {
  connectRange = +e.target.value;
  document.getElementById('connectVal').textContent = connectRange;
});

document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTheme = btn.dataset.theme;
    particles.forEach(p => {
      p.color = themes[currentTheme][Math.floor(Math.random() * themes[currentTheme].length)];
    });
  });
});

const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
  pauseBtn.classList.toggle('paused', isPaused);
  if (!isPaused) loop();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  time = 0;
  initParticles(targetCount);
});