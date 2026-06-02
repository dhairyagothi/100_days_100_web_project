const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth || 480;
canvas.height = canvas.offsetHeight || 700;
const W = canvas.width, H = canvas.height;

// ── GAME STATE ──────────────────────────────────────────────
let state = 'menu'; // menu | playing | gameover
let score = 0, coins = 0, distance = 0;
let bestScore = parseInt(localStorage.getItem('trainBestScore') || '0');
let gameSpeed = 4, baseSpeed = 4;
let frameCount = 0;
let animId;

// powerups
let shield = false, magnet = false, slowmo = false, boost = false;
let shieldTimer = 0, magnetTimer = 0, slowmoTimer = 0, boostTimer = 0;
const PUP_DURATION = 300;
let lives = 3;
let invincible = false, invincibleTimer = 0;
const INVINCIBLE_DURATION = 120;

// ── TRACK SETUP ─────────────────────────────────────────────
const NUM_TRACKS = 3;
const TRACK_XS = [120, 240, 360]; // x centers of 3 tracks
let playerTrack = 1; // 0,1,2
let targetTrack = 1;
let playerX = TRACK_XS[1];
let playerY = H - 160;
let moveSpeed = 0;

// Train sprite state
let isMovingLeft = false, isMovingRight = false;
let shakeX = 0;

// ── SCROLLING OBJECTS ────────────────────────────────────────
let trackSegments = []; // scrolling track lines
let obstacles = [];
let coinObjects = [];
let powerupObjects = [];
let particles = [];
let bgClouds = [];
let scorePopups = [];

// ── COLORS / THEME ──────────────────────────────────────────
const theme = {
  sky: ['#020a1a', '#051a35', '#041228'],
  track: '#1a2a3a',
  rail: '#2a4060',
  railBright: '#3a6090',
  ground: '#0d1a0d',
  player: '#00C8FF',
  obstacle: '#FF3366',
  coin: '#FFD700',
};

// ── INIT ─────────────────────────────────────────────────────
function init() {
  score = 0; coins = 0; distance = 0;
  gameSpeed = 4; baseSpeed = 4; frameCount = 0;
  playerTrack = 1; targetTrack = 1;
  playerX = TRACK_XS[1]; playerY = H - 160;
  isMovingLeft = false; isMovingRight = false; shakeX = 0;
  shield = false; magnet = false; slowmo = false; boost = false;
  shieldTimer = 0; magnetTimer = 0; slowmoTimer = 0; boostTimer = 0;
  lives = 3; invincible = false; invincibleTimer = 0;
  obstacles = []; coinObjects = []; powerupObjects = []; particles = [];
  scorePopups = [];
  buildTrackSegments();
  buildClouds();
  updateHUD();
}

function buildTrackSegments() {
  trackSegments = [];
  for (let y = 0; y < H + 60; y += 50) {
    trackSegments.push({ y });
  }
}

function buildClouds() {
  bgClouds = [];
  for (let i = 0; i < 5; i++) {
    bgClouds.push({
      x: Math.random() * W,
      y: 50 + Math.random() * 180,
      w: 60 + Math.random() * 80,
      speed: 0.2 + Math.random() * 0.3,
      alpha: 0.05 + Math.random() * 0.1
    });
  }
}

// ── SPAWNING ─────────────────────────────────────────────────
let obstacleTimer = 0, coinTimer = 0, powerupTimer = 0;
const OBSTACLE_INTERVAL_BASE = 90;

function getBlockedTracks() {
  return [...new Set(
    obstacles
      .filter(ob => {
        if (ob.type === 'incoming') return ob.y > -200 && ob.y < playerY - 100;
        return ob.y > -600 && ob.y < H;
      })
      .map(ob => ob.track)
  )];
}

function spawnObstacle() {
  const blockedTracks = getBlockedTracks();
  const freeTracks = [0, 1, 2].filter(t => !blockedTracks.includes(t));
  if (freeTracks.length === 0) return;

  // 70% chance to only spawn if 2+ lanes are free, keeping it breathable
  if (freeTracks.length === 1) return;
  if (freeTracks.length === 2 && Math.random() < 0.5) return;

  const track = freeTracks[Math.floor(Math.random() * freeTracks.length)];
  const types = ['broken', 'incoming', 'incoming', 'barrier', 'signal'];
  const type = types[Math.floor(Math.random() * types.length)];
  obstacles.push({
    track, type,
    x: TRACK_XS[track],
    y: -80,
    w: type === 'incoming' ? 50 : 36,
    h: type === 'incoming' ? 80 : 50,
    speed: type === 'incoming' ? gameSpeed * 1.6 : gameSpeed,
    warning: type === 'incoming'
  });
}

function spawnCoinRow() {
  const blockedTracks = getBlockedTracks();
  const safeTracks = [0, 1, 2].filter(t => !blockedTracks.includes(t));
  if (safeTracks.length === 0) return;
  const track = safeTracks[Math.floor(Math.random() * safeTracks.length)];
  for (let i = 0; i < 4; i++) {
    coinObjects.push({
      track, x: TRACK_XS[track],
      y: -60 - i * 44,
      r: 12, collected: false
    });
  }
}

function spawnPowerup() {
  const blockedTracks = getBlockedTracks();
  const safeTracks = [0, 1, 2].filter(t => !blockedTracks.includes(t));
  if (safeTracks.length === 0) return;
  const track = safeTracks[Math.floor(Math.random() * safeTracks.length)];
  const types = ['shield', 'magnet', 'slow', 'boost'];
  const type = types[Math.floor(Math.random() * types.length)];
  powerupObjects.push({
    track, type,
    x: TRACK_XS[track],
    y: -60,
    r: 16
  });
}
// ── PARTICLE FX ──────────────────────────────────────────────
function spawnCollectFX(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = 1.5 + Math.random() * 2;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1, decay: 0.04 + Math.random() * 0.02,
      r: 3 + Math.random() * 3, color
    });
  }
}

function spawnCrashFX(x, y) {
  for (let i = 0; i < 24; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 1, decay: 0.02 + Math.random() * 0.02,
      r: 4 + Math.random() * 6,
      color: ['#FF3366','#FF6600','#FFD700','#fff'][Math.floor(Math.random()*4)]
    });
  }
}

function spawnScorePopup(x, y, text, color) {
  scorePopups.push({ x, y, text, color, life: 1, vy: -1.5 });
}

// ── DRAW FUNCTIONS ───────────────────────────────────────────
function drawBackground() {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#020a18');
  grad.addColorStop(0.5, '#051830');
  grad.addColorStop(1, '#051830');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Stars
  ctx.save();
  for (let i = 0; i < 80; i++) {
    const sx = (i * 137 + frameCount * 0.03) % W;
    const sy = (i * 97) % (H * 0.55);
    const sa = 0.3 + 0.4 * Math.sin(frameCount * 0.05 + i);
    ctx.globalAlpha = sa;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(sx, sy, i % 3 === 0 ? 1.5 : 0.8, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();

  // Clouds
  bgClouds.forEach(c => {
    c.x -= c.speed;
    if (c.x + c.w < 0) c.x = W + c.w;
    ctx.save();
    ctx.globalAlpha = c.alpha;
    ctx.fillStyle = '#1a3a5a';
    // Draw cloud as multiple overlapping circles
    const cx = c.x, cy = c.y, r = c.w / 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2);
    ctx.arc(cx + r * 1.4, cy + r * 0.3, r * 0.9, 0, Math.PI * 2);
    ctx.arc(cx - r * 1.4, cy + r * 0.3, r * 0.8, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.7, cy - r * 0.6, r * 0.85, 0, Math.PI * 2);
    ctx.arc(cx - r * 0.6, cy - r * 0.5, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });


}

function drawGround() {}

function drawTracks() {
  const trackTop = 0;
  const trackBot = H;

  // Draw 3 tracks with perspective
  for (let t = 0; t < NUM_TRACKS; t++) {
    const cx = TRACK_XS[t];

    // Ballast (gravel bed)
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#2a3a2a';
    ctx.beginPath();
    ctx.moveTo(cx - 35, trackTop);
    ctx.lineTo(cx + 35, trackTop);
    ctx.lineTo(cx + 45, trackBot);
    ctx.lineTo(cx - 45, trackBot);
    ctx.fill();
    ctx.restore();

    // Left rail
    ctx.strokeStyle = '#2a5070';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 18, trackTop);
    ctx.lineTo(cx - 22, trackBot);
    ctx.stroke();

    // Right rail
    ctx.beginPath();
    ctx.moveTo(cx + 18, trackTop);
    ctx.lineTo(cx + 22, trackBot);
    ctx.stroke();

    // Rail shine
    ctx.strokeStyle = 'rgba(0,200,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 17, trackTop);
    ctx.lineTo(cx - 21, trackBot);
    ctx.stroke();
  }

  // Sleepers (scrolling)
  const speed = slowmo ? gameSpeed * 0.4 : gameSpeed;
  trackSegments.forEach((seg, i) => {
    seg.y += speed;
    if (seg.y > H + 60) seg.y = -50;

    const progress = (seg.y - trackTop) / (trackBot - trackTop);
    if (progress < 0 || progress > 1) return;
    const alpha = 0.15 + progress * 0.4;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#3a5030';
    ctx.lineWidth = 2 + progress * 3;
    ctx.lineCap = 'round';

    // Sleeper for each track
    for (let t = 0; t < NUM_TRACKS; t++) {
      const cx = TRACK_XS[t];
      const halfW = 20 + progress * 8;
      ctx.beginPath();
      ctx.moveTo(cx - halfW, seg.y);
      ctx.lineTo(cx + halfW, seg.y);
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawTrain() {
  // Smooth track switching
  if (invincible && frameCount % 6 < 3) return;
  const tX = TRACK_XS[targetTrack];
  playerX += (tX - playerX) * 0.3;
  const x = playerX + shakeX;
  const y = playerY;

  // Wheel glow (bottom)
  const wGrad = ctx.createRadialGradient(x, y + 30, 0, x, y + 30, 50);
  wGrad.addColorStop(0, 'rgba(0,200,255,0.25)');
  wGrad.addColorStop(1, 'rgba(0,200,255,0)');
  ctx.fillStyle = wGrad;
  ctx.fillRect(x - 50, y - 10, 100, 80);

  // Shield effect
  if (shield) {
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.15 * Math.sin(frameCount * 0.2);
    ctx.strokeStyle = '#00FFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(x, y - 20, 45, 65, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#00FFFF';
    ctx.fill();
    ctx.restore();
  }

  // Magnet effect
  if (magnet) {
    ctx.save();
    ctx.globalAlpha = 0.3 + 0.1 * Math.sin(frameCount * 0.15);
    ctx.strokeStyle = '#FF44FF';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(x, y - 20, 70, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ── Train body ──
  // Main chassis
  const bodyGrad = ctx.createLinearGradient(x - 30, y - 70, x + 30, y - 70);
  bodyGrad.addColorStop(0, '#0066AA');
  bodyGrad.addColorStop(0.4, '#00AAFF');
  bodyGrad.addColorStop(1, '#0055AA');
  ctx.fillStyle = bodyGrad;
  roundRect(ctx, x - 28, y - 90, 56, 90, 10);
  ctx.fill();

  // Stripe
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(x - 28, y - 55, 56, 10);

  // Cab / front
  const cabGrad = ctx.createLinearGradient(x - 24, y - 110, x + 24, y - 110);
  cabGrad.addColorStop(0, '#0044AA');
  cabGrad.addColorStop(0.5, '#0088EE');
  cabGrad.addColorStop(1, '#0044AA');
  ctx.fillStyle = cabGrad;
  roundRect(ctx, x - 24, y - 118, 48, 32, [8, 8, 0, 0]);
  ctx.fill();

  // Windshield
  ctx.fillStyle = 'rgba(100,220,255,0.5)';
  roundRect(ctx, x - 16, y - 113, 32, 20, 4);
  ctx.fill();
  // Windshield shine
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.ellipse(x - 5, y - 107, 7, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Headlight
  const hlGrad = ctx.createRadialGradient(x, y - 88, 0, x, y - 88, 25);
  hlGrad.addColorStop(0, 'rgba(255,255,180,0.9)');
  hlGrad.addColorStop(1, 'rgba(255,220,0,0)');
  ctx.fillStyle = hlGrad;
  ctx.fillRect(x - 25, y - 110, 50, 50);

  // Headlight circle
  ctx.fillStyle = '#FFE060';
  ctx.beginPath();
  ctx.arc(x, y - 88, 6, 0, Math.PI * 2);
  ctx.fill();

  // Bottom wheels
  ctx.fillStyle = '#333';
  [-16, 16].forEach(ox => {
    ctx.beginPath();
    ctx.arc(x + ox, y + 4, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Wheel spokes animation
    ctx.save();
    ctx.translate(x + ox, y + 4);
    ctx.rotate(frameCount * 0.1 * (boost ? 2 : 1));
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1.5;
    for (let s = 0; s < 4; s++) {
      const a = (Math.PI / 2) * s;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * 8, Math.sin(a) * 8);
      ctx.stroke();
    }
    ctx.restore();
  });

  // Speed boost steam
  if (boost) {
    for (let i = 0; i < 3; i++) {
      const offsetX = (Math.random() - 0.5) * 20;
      const pY = y - 120 - Math.random() * 20;
      ctx.save();
      ctx.globalAlpha = 0.3 * Math.random();
      ctx.fillStyle = '#88CCFF';
      ctx.beginPath();
      ctx.arc(x + offsetX, pY, 8 + Math.random() * 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Motion trail
  ctx.save();
  for (let t = 1; t <= 4; t++) {
    ctx.globalAlpha = 0.06 * (5 - t);
    ctx.fillStyle = '#0088FF';
    roundRect(ctx, x - 28 + t, y - 90 + t * 6, 56 - t, 80, 10);
    ctx.fill();
  }
  ctx.restore();
}

function drawObstacles() {
  const speed = slowmo ? gameSpeed * 0.4 : gameSpeed;
  obstacles.forEach(ob => {
    if (ob.type !== 'incoming') ob.y += speed;
    else ob.y += ob.speed * (slowmo ? 0.4 : 1);

    const x = ob.x, y = ob.y;

    if (ob.type === 'broken') {
      // Broken track
      ctx.save();
      ctx.fillStyle = '#FF3366';
      ctx.globalAlpha = 0.9;
      // Track pieces scattered
      for (let p = 0; p < 5; p++) {
        const px = x - 20 + p * 10 + Math.sin(p * 7) * 5;
        ctx.save();
        ctx.translate(px, y);
        ctx.rotate(Math.sin(p * 3) * 0.4);
        ctx.fillStyle = p % 2 === 0 ? '#FF3366' : '#CC2244';
        ctx.fillRect(-8, -4, 16, 8);
        ctx.restore();
      }
      // Warning X
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(frameCount * 0.2);
      ctx.strokeStyle = '#FF3366';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - 18, y - 30); ctx.lineTo(x + 18, y - 10);
      ctx.moveTo(x + 18, y - 30); ctx.lineTo(x - 18, y - 10);
      ctx.stroke();
      ctx.restore();
    } else if (ob.type === 'incoming') {
      // Oncoming red train
      ctx.save();
      // Train body (flipped)
      const bGrad = ctx.createLinearGradient(x - 26, y, x + 26, y);
      bGrad.addColorStop(0, '#880022');
      bGrad.addColorStop(0.5, '#FF2244');
      bGrad.addColorStop(1, '#880022');
      ctx.fillStyle = bGrad;
      roundRect(ctx, x - 24, y - 10, 48, 80, 8);
      ctx.fill();
      // Headlight (facing down)
      ctx.fillStyle = '#FFE060';
      ctx.beginPath();
      ctx.arc(x, y + 72, 5, 0, Math.PI * 2);
      ctx.fill();
      const rGrad = ctx.createRadialGradient(x, y + 72, 0, x, y + 72, 30);
      rGrad.addColorStop(0, 'rgba(255,240,100,0.8)');
      rGrad.addColorStop(1, 'rgba(255,150,0,0)');
      ctx.fillStyle = rGrad;
      ctx.fillRect(x - 30, y + 42, 60, 60);
      // Warning stripes
      ctx.globalAlpha = 0.15 + 0.1 * Math.sin(frameCount * 0.3);
      ctx.fillStyle = '#FF0000';
      for (let s = 0; s < 4; s++) {
        ctx.fillRect(x - 24 + s * 12, y - 10, 6, 80);
      }
      ctx.restore();

      // "DANGER" text
      if (ob.y < H * 0.3) {
        ctx.save();
        ctx.globalAlpha = 0.8 + 0.2 * Math.sin(frameCount * 0.5);
        ctx.fillStyle = '#FF3366';
        ctx.font = 'bold 10px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DANGER', x, ob.y - 20);
        ctx.restore();
      }
    } else if (ob.type === 'barrier') {
      // Gate barrier
      ctx.save();
      ctx.strokeStyle = '#FF6600';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      // Post
      ctx.beginPath();
      ctx.moveTo(x - 24, y - 40);
      ctx.lineTo(x - 24, y + 16);
      ctx.stroke();
      // Bar with stripes
      const barLen = 48;
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#FF6600';
      ctx.beginPath();
      ctx.moveTo(x - 24, y - 20);
      ctx.lineTo(x - 24 + barLen, y - 20);
      ctx.stroke();
      // Stripe marks
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#FF0000';
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        ctx.moveTo(x - 14 + s * 14, y - 30);
        ctx.lineTo(x - 20 + s * 14, y - 10);
        ctx.stroke();
      }
      // Flashing light
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(frameCount * 0.3);
      ctx.fillStyle = '#FF4400';
      ctx.beginPath();
      ctx.arc(x - 24, y - 42, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (ob.type === 'signal') {
      // Red signal block
      ctx.save();
      ctx.fillStyle = '#222';
      roundRect(ctx, x - 18, y - 50, 36, 56, 6);
      ctx.fill();
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Red light (flashing)
      const pulse = 0.5 + 0.5 * Math.sin(frameCount * 0.35);
      ctx.globalAlpha = 0.6 + 0.4 * pulse;
      const lGrad = ctx.createRadialGradient(x, y - 30, 0, x, y - 30, 14);
      lGrad.addColorStop(0, '#FF0000');
      lGrad.addColorStop(1, 'rgba(255,0,0,0)');
      ctx.fillStyle = lGrad;
      ctx.fillRect(x - 20, y - 50, 40, 40);
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgb(${Math.round(180+75*pulse)}, 0, 0)`;
      ctx.beginPath();
      ctx.arc(x, y - 30, 10, 0, Math.PI * 2);
      ctx.fill();
      // Green (off)
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = '#00FF00';
      ctx.beginPath();
      ctx.arc(x, y - 8, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
}

function drawCoins() {
  const speed = slowmo ? gameSpeed * 0.4 : gameSpeed;
  coinObjects.forEach(c => {
    c.y += speed;
    if (c.collected) return;
    ctx.save();
    // Magnet attraction
    if (magnet) {
      const dx = playerX - c.x, dy = playerY - 50 - c.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const magnetRadius = 300 + gameSpeed * 8;
      const force = 0.06 + gameSpeed * 0.004;
      if (dist < magnetRadius) {
        c.x += dx * force;
        c.y += dy * force;
      }
    }
    const bob = Math.sin(frameCount * 0.15 + c.x) * 3;
    const spinAmt = Math.max(0.05, Math.abs(Math.cos(frameCount * 0.08)));
    ctx.globalAlpha = 0.95;
    const cGrad = ctx.createRadialGradient(c.x - 3, c.y + bob - 3, 0, c.x, c.y + bob, c.r);
    cGrad.addColorStop(0, '#FFF59D');
    cGrad.addColorStop(0.5, '#FFD700');
    cGrad.addColorStop(1, '#CC8800');
    ctx.fillStyle = cGrad;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y + bob, Math.max(0.5, Math.abs(c.r * spinAmt)), c.r, 0, 0, Math.PI * 2);
    ctx.fill();
    // Shine
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#FFF176';
    ctx.beginPath();
    ctx.ellipse(c.x - 3, c.y + bob - 3, Math.max(0.5, Math.abs(3 * spinAmt)), 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawPowerups() {
  const speed = slowmo ? gameSpeed * 0.4 : gameSpeed;
  const icons = { shield: '🛡️', magnet: '🧲', slow: '⏱️', boost: '⚡' };
  const colors = { shield: '#00FFFF', magnet: '#FF44FF', slow: '#44FFAA', boost: '#FFD700' };
  powerupObjects.forEach(p => {
    p.y += speed;
    const bob = Math.sin(frameCount * 0.1 + p.x) * 4;
    const y = p.y + bob;
    ctx.save();
    // Glow
    ctx.globalAlpha = 0.3 + 0.2 * Math.sin(frameCount * 0.15);
    const pGrad = ctx.createRadialGradient(p.x, y, 0, p.x, y, p.r * 2.5);
    pGrad.addColorStop(0, colors[p.type] || '#fff');
    pGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(p.x, y, p.r * 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Circle
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.arc(p.x, y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors[p.type];
    ctx.lineWidth = 2;
    ctx.stroke();
    // Icon
    ctx.font = `${p.r * 1.2}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icons[p.type], p.x, y);
    ctx.restore();
  });
}

function drawParticles() {
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.1;
    p.life -= p.decay;
    if (p.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.1, p.r * p.life), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  particles = particles.filter(p => p.life > 0);
}

function drawScorePopups() {
  scorePopups.forEach(sp => {
    sp.y += sp.vy;
    sp.life -= 0.025;
    ctx.save();
    ctx.globalAlpha = Math.max(0, sp.life);
    ctx.fillStyle = sp.color;
    ctx.font = 'bold 14px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(sp.text, sp.x, sp.y);
    ctx.restore();
  });
  scorePopups = scorePopups.filter(sp => sp.life > 0);
}

function drawSpeedIndicator() {
  const speedLevel = Math.floor((gameSpeed - 4) / 0.5) + 1;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(W - 80, H - 55, 65, 18);
  ctx.fillStyle = speedLevel > 5 ? '#FF6644' : speedLevel > 3 ? '#FFD700' : '#00FF88';
  ctx.font = '10px Orbitron, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`SPD ×${gameSpeed.toFixed(1)}`, W - 76, H - 42);
  ctx.restore();
}

function drawPowerupTimers() {
  const active = [];
  if (shield) active.push({ label: '🛡️', timer: shieldTimer });
  if (magnet) active.push({ label: '🧲', timer: magnetTimer });
  if (slowmo) active.push({ label: '⏱️', timer: slowmoTimer });
  if (boost)  active.push({ label: '⚡', timer: boostTimer });
  if (active.length === 0) return;

  active.forEach((p, i) => {
    const barW = 65;
    const filled = Math.max(0, (p.timer / PUP_DURATION) * barW);
    const yOff = H - 75 - (i * 28);

    ctx.save();
    // Background bar
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(W - 80, yOff, barW, 16);
    // Filled bar
    ctx.fillStyle = '#028f1a';
    ctx.fillRect(W - 80, yOff, filled, 16);
    // Icon and label
    ctx.font = '11px Orbitron, monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'left';
    ctx.fillText(p.label + ' ' + Math.ceil(p.timer / 60) + 's', W - 78, yOff + 12);
    ctx.restore();
  });
}

// ── COLLISION DETECTION ──────────────────────────────────────
function checkCollisions() {
  const px = playerX, py = playerY - 55;
  const hitR = 26;

  // Coins
  coinObjects.forEach(c => {
    if (c.collected) return;
    const dx = px - c.x, dy = py - c.y;
    if (Math.sqrt(dx * dx + dy * dy) < hitR + c.r) {
      c.collected = true;
      coins++;
      score += 10;
      spawnCollectFX(c.x, c.y, '#FFD700');
      spawnScorePopup(c.x, c.y - 20, '+10', '#FFD700');
      updateHUD();
    }
  });

  // Powerups
  powerupObjects = powerupObjects.filter(p => {
    const dx = px - p.x, dy = py - p.y;
    if (Math.sqrt(dx * dx + dy * dy) < hitR + p.r) {
      activatePowerup(p.type);
      spawnCollectFX(p.x, p.y, '#FFFFFF', 12);
      return false;
    }
    return true;
  });

  // Obstacles
  if (shield || invincible) return;
  obstacles.forEach(ob => {
   if (ob.type === 'incoming') {
      const dx = Math.abs(playerX - ob.x);
      if (dx < 26 && ob.y + 72 >= playerY - 118 && ob.y < playerY + 10) crash();
      return;
    }

    // Cab zone (narrow, top of train)
    const cabDx = Math.abs(px - ob.x);
    const cabDy = Math.abs((playerY - 113) - (ob.y - ob.h / 2));
    const cabHit = cabDx < 20 && cabDy < 42;

    // Body zone (wider, middle)
    const bodyDx = Math.abs(px - ob.x);
    const bodyDy = Math.abs((playerY - 55) - (ob.y - ob.h / 2));
    const bodyHit = bodyDx < 26 && bodyDy < 42;

    // Wheel zone (widest, bottom)
    const wheelDx = Math.abs(px - ob.x);
    const wheelDy = Math.abs((playerY - 5) - (ob.y - ob.h / 2));
    const wheelHit = wheelDx < 18 && wheelDy < 42;

    if (cabHit || bodyHit || wheelHit) crash();
  });
}

function activatePowerup(type) {
  const labels = { shield: '🛡️ SHIELD!', magnet: '🧲 MAGNET!', slow: '⏱️ SLOW-MO!', boost: '⚡ BOOST!' };
  spawnScorePopup(playerX, playerY - 130, labels[type], '#FFFFFF');
  if (type === 'shield') { shield = true; shieldTimer = PUP_DURATION; }
  if (type === 'magnet') { magnet = true; magnetTimer = PUP_DURATION; }
  if (type === 'slow')   { slowmo = true; slowmoTimer = PUP_DURATION; }
  if (type === 'boost')  { boost = true; boostTimer = PUP_DURATION; }
  updatePowerupIcons();
}

function updatePowerups() {
  if (shield) { shieldTimer--; if (shieldTimer <= 0) { shield = false; updatePowerupIcons(); } }
  if (magnet) { magnetTimer--; if (magnetTimer <= 0) { magnet = false; updatePowerupIcons(); } }
  if (slowmo) { slowmoTimer--; if (slowmoTimer <= 0) { slowmo = false; updatePowerupIcons(); } }
  if (boost)  { boostTimer--; if (boostTimer <= 0) { boost = false; updatePowerupIcons(); } }
  if (invincible) { invincibleTimer--; if (invincibleTimer <= 0) { invincible = false; } }
}

// ── GAME LOGIC ───────────────────────────────────────────────
function crash() {
  if (invincible) return;
  lives--;
  updateHUD();
  spawnCrashFX(playerX, playerY - 50);
  shakeX = 10;
  setTimeout(() => { shakeX = -8; }, 60);
  setTimeout(() => { shakeX = 0; }, 120);
  if (lives <= 0) {
    setTimeout(() => gameOver(), 300);
    state = 'crashing';
  } else {
    invincible = true;
    invincibleTimer = INVINCIBLE_DURATION;
    spawnScorePopup(playerX, playerY - 140, lives + ' LIFE LEFT!', '#FF6644');
  }
}

function gameOver() {
  state = 'gameover';
  if (score > bestScore) {
  bestScore = score;
  localStorage.setItem('trainBestScore', bestScore);
}
  document.getElementById('goScore').textContent = score;
  document.getElementById('goBest').textContent = bestScore;
  document.getElementById('goDist').textContent = Math.floor(distance) + 'm';
  document.getElementById('goCoins').textContent = coins;
  document.getElementById('gameOverScreen').classList.remove('hidden');
  document.getElementById('scoreBar').classList.add('hidden');
  document.getElementById('powerupBar').classList.add('hidden');
}

function updateHUD() {
  document.getElementById('hudScore').textContent = score;
  document.getElementById('hudCoins').textContent = '🪙 ' + coins;
  document.getElementById('hudBest').textContent = bestScore;
  document.getElementById('hudLives').textContent = '❤️'.repeat(Math.max(0, lives));
}

function updatePowerupIcons() {
  document.getElementById('pup-shield').classList.toggle('active', shield);
  document.getElementById('pup-magnet').classList.toggle('active', magnet);
  document.getElementById('pup-slow').classList.toggle('active', slowmo);
  document.getElementById('pup-boost').classList.toggle('active', boost);
}

// ── MAIN GAME LOOP ───────────────────────────────────────────
function gameLoop() {
  animId = requestAnimationFrame(gameLoop);

  if (state !== 'playing' && state !== 'crashing') {
    // Just draw background on menu/gameover
    drawBackground();
    return;
  }

  frameCount++;
  const actualSpeed = boost ? gameSpeed * 1.6 : (slowmo ? gameSpeed * 0.4 : gameSpeed);

  // Score & distance
  distance += actualSpeed * 0.05;
  score += Math.floor(actualSpeed * 0.1);
  if (frameCount % 5 === 0) updateHUD();

  // Speed ramp
  if (frameCount % 400 === 0) {
    baseSpeed = Math.min(baseSpeed + 0.4, 12);
    gameSpeed = baseSpeed;
  }

  // Spawning
  const interval = Math.max(40, OBSTACLE_INTERVAL_BASE - Math.floor(gameSpeed * 6));
  obstacleTimer++;
  if (obstacleTimer >= interval) {
    obstacleTimer = 0;
    if (Math.random() > 0.15) spawnObstacle();
  }
  coinTimer++;
  if (coinTimer >= 55) { coinTimer = 0; if (Math.random() > 0.3) spawnCoinRow(); }
  powerupTimer++;
  if (powerupTimer >= 280) { powerupTimer = 0; if (Math.random() > 0.5) spawnPowerup(); }

  // Cleanup off-screen
  obstacles = obstacles.filter(o => o.y < H + 120);
  coinObjects = coinObjects.filter(c => c.y < H + 30 && !c.collected);
  powerupObjects = powerupObjects.filter(p => p.y < H + 30);

  // Update powerup timers
  updatePowerups();

  // Draw
  drawBackground();
  drawGround();
  drawTracks();
  drawObstacles();
  drawCoins();
  drawPowerups();
 
  if (state === 'playing') drawTrain();
  drawParticles();
  drawScorePopups();
  drawSpeedIndicator();
  drawPowerupTimers();

  if (state === 'playing') checkCollisions();
}

// ── INPUT HANDLING ───────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (state !== 'playing') return;
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    if (targetTrack > 0) targetTrack--;
  }
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    if (targetTrack < NUM_TRACKS - 1) targetTrack++;
  }
});

// Swipe gesture for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener('touchend', e => {
  e.preventDefault();
  if (state !== 'playing') return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 20) return; // ignore tiny taps
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0 && targetTrack > 0) targetTrack--;
    if (dx > 0 && targetTrack < NUM_TRACKS - 1) targetTrack++;
  }
}, { passive: false });

// ── SCREEN BUTTONS ───────────────────────────────────────────
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('menuBtn').addEventListener('click', () => {
  state = 'menu';
  document.getElementById('gameOverScreen').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
});

function startGame() {
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('gameOverScreen').classList.add('hidden');
  document.getElementById('scoreBar').classList.remove('hidden');
  document.getElementById('powerupBar').classList.remove('hidden');
  init();
  state = 'playing';
}

// ── UTILITY ──────────────────────────────────────────────────
function roundRect(ctx, x, y, w, h, r) {
  if (typeof r === 'number') r = [r, r, r, r];
  ctx.beginPath();
  ctx.moveTo(x + r[0], y);
  ctx.lineTo(x + w - r[1], y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r[1]);
  ctx.lineTo(x + w, y + h - r[2]);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
  ctx.lineTo(x + r[3], y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r[3]);
  ctx.lineTo(x, y + r[0]);
  ctx.quadraticCurveTo(x, y, x + r[0], y);
  ctx.closePath();
}

// ── START LOOP ───────────────────────────────────────────────
buildClouds();
gameLoop();