    // ─── Global ────────────────────────────────────────────────────────────────
    let isDayMode = false;

    // ─── Starfield ─────────────────────────────────────────────────────────────
    (function () {
      const sf = document.getElementById('starfield');
      const ctx = sf.getContext('2d');
      sf.width = window.innerWidth; sf.height = window.innerHeight;
      const stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * sf.width, y: Math.random() * sf.height,
        r: Math.random() * 1.5 + 0.2, a: Math.random(), speed: Math.random() * 0.3 + 0.1
      }));
      function draw() {
        ctx.clearRect(0, 0, sf.width, sf.height);
        if (!isDayMode) {
          stars.forEach(s => {
            s.a += 0.005 * s.speed;
            const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.a));
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180,230,255,${alpha})`; ctx.fill();
          });
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.25)';
          stars.forEach((s, i) => { if (i % 5 === 0) { ctx.beginPath(); ctx.ellipse(s.x, s.y * 0.4, 30 + s.r * 10, 14 + s.r * 4, 0, 0, Math.PI * 2); ctx.fill(); } });
        }
        requestAnimationFrame(draw);
      }
      draw();
    })();

    // ─── Constants ─────────────────────────────────────────────────────────────
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const ROAD_LEFT = 60, ROAD_RIGHT = 360;
    const ROAD_W = ROAD_RIGHT - ROAD_LEFT;
    const LANE_COUNT = 3;
    const LANE_W = ROAD_W / LANE_COUNT;

    // Boost constants
    const BOOST_MAX = 300;   // frames of full boost
    const BOOST_DRAIN_RATE = 2.2;   // frames drained per frame while boosting
    const BOOST_REGEN_RATE = 0.55;  // frames regenerated per frame while not boosting
    const BOOST_SPEED_MULT = 1.65;  // speed multiplier during boost
    const BOOST_COOLDOWN = 90;    // frames after exhaustion before regen starts

    // Near-miss constants
    const NEAR_MISS_DIST_X = 52;   // px — horizontal window
    const NEAR_MISS_DIST_Y = 60;   // px — vertical window (obstacle passing player)
    const NEAR_MISS_EXPIRE = 55;   // frames before a tracked obstacle no longer awards miss
    const COMBO_DECAY_FRAMES = 280; // frames of no near-miss before combo resets

    // ─── Color Picker ──────────────────────────────────────────────────────────
    const CAR_COLORS = [
      { label: 'Cyan', hex: '#00aaff' },
      { label: 'Red', hex: '#ff2d55' },
      { label: 'Green', hex: '#39ff14' },
      { label: 'Orange', hex: '#ff9500' },
      { label: 'Purple', hex: '#af52de' },
      { label: 'Gold', hex: '#ffe600' },
      { label: 'Pink', hex: '#ff69b4' },
      { label: 'White', hex: '#ffffff' },
    ];
    let playerColor = CAR_COLORS[0].hex;
    const cpRow = document.getElementById('color-picker-row');
    CAR_COLORS.forEach((c, i) => {
      const sw = document.createElement('div');
      sw.className = 'color-swatch' + (i === 0 ? ' selected' : '');
      sw.style.background = c.hex; sw.title = c.label;
      sw.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        sw.classList.add('selected'); playerColor = c.hex;
      });
      cpRow.appendChild(sw);
    });

    // ─── Day/Night ─────────────────────────────────────────────────────────────
    const daynightBtn = document.getElementById('daynight-btn');
    daynightBtn.addEventListener('click', () => {
      isDayMode = !isDayMode;
      document.body.classList.toggle('day-mode', isDayMode);
      daynightBtn.textContent = isDayMode ? '🌙 NIGHT' : '☀️ DAY';
    });

    // ─── Best Score ────────────────────────────────────────────────────────────
    let best = parseInt(localStorage.getItem('turbodash_best') || '0');
    document.getElementById('bestDisplay').textContent = best;

    // ─── DOM refs ──────────────────────────────────────────────────────────────
    const scoreDisplay = document.getElementById('scoreDisplay');
    const bestDisplay = document.getElementById('bestDisplay');
    const boostFill = document.getElementById('boost-fill');
    const boostBarWrap = document.getElementById('boost-bar-wrap');
    const startOverlay = document.getElementById('startOverlay');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const finalScoreEl = document.getElementById('finalScore');
    const bestLabel = document.getElementById('bestLabel');
    const newRecordEl = document.getElementById('new-record');
    const crashFlash = document.getElementById('crash-flash');
    const boostFlash = document.getElementById('boost-flash');
    const puToast = document.getElementById('pu-toast');
    const multiBadge = document.getElementById('multi-badge');
    const puShieldIcon = document.getElementById('pu-shield-icon');
    const puSlowIcon = document.getElementById('pu-slow-icon');
    const puMultiIcon = document.getElementById('pu-multi-icon');
    const comboCountEl = document.getElementById('combo-count');
    const nearMissSplash = document.getElementById('nearmiss-splash');

    // ─── Game State ────────────────────────────────────────────────────────────
    let state = 'start';
    let score = 0, frame = 0;
    let roadSpeed = 2.5, baseSpeed = 2.5;
    let keys = { left: false, right: false, boost: false };
    let particles = [], exhaustParticles = [];
    let laneOffsets = [0, 0];

    // Power-up state
    let shieldActive = false, shieldTimer = 0;
    let slowActive = false, slowTimer = 0;
    let multiActive = false, multiTimer = 0;
    let scoreMultiplier = 1;

    // Boost state
    let boostCharge = BOOST_MAX;   // current charge (frames)
    let isBoosting = false;
    let boostCooldown = 0;           // post-exhaustion cooldown

    // Near-miss / combo state
    let comboCount = 0;
    let maxComboThisRun = 0;
    let comboDecayTimer = 0;
    let nearMissTotal = 0;        // stat for game-over screen
    let boostUsedTotal = 0;
    let trackedObstacles = new Set(); // obstacle ids that already gave a near-miss this pass

    // Ghost trail state
    let ghostTrail = [];             // [{x,y,alpha}]

    // ─── Player ────────────────────────────────────────────────────────────────
    const player = { x: W / 2, y: H - 120, w: 38, h: 70, lane: 1, targetX: W / 2, speed: 5 };
    function laneX(lane) { return ROAD_LEFT + LANE_W * lane + LANE_W / 2; }

    // ─── Obstacle types ────────────────────────────────────────────────────────
    const obstacleColors = ['#ff2d55', '#ff9500', '#af52de', '#32ade6', '#30d158', '#ff6b35'];
    let obstacles = [], obstacleCooldown = 0, obstacleIdCounter = 0;

    // ─── Power-ups ─────────────────────────────────────────────────────────────
    let powerups = [], powerupCooldown = 200;

    // ─── Input ─────────────────────────────────────────────────────────────────
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') keys.left = true;
      if (e.key === 'ArrowRight') keys.right = true;
      if (e.key === 'Shift' || e.key === ' ') { e.preventDefault(); keys.boost = true; }
    });
    document.addEventListener('keyup', e => {
      if (e.key === 'ArrowLeft') keys.left = false;
      if (e.key === 'ArrowRight') keys.right = false;
      if (e.key === 'Shift' || e.key === ' ') keys.boost = false;
    });

    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const boostBtn = document.getElementById('boostBtn');

    leftBtn.addEventListener('touchstart', e => { e.preventDefault(); keys.left = true; });
    leftBtn.addEventListener('touchend', e => { e.preventDefault(); keys.left = false; });
    rightBtn.addEventListener('touchstart', e => { e.preventDefault(); keys.right = true; });
    rightBtn.addEventListener('touchend', e => { e.preventDefault(); keys.right = false; });
    boostBtn.addEventListener('touchstart', e => { e.preventDefault(); keys.boost = true; boostBtn.classList.add('pressed'); });
    boostBtn.addEventListener('touchend', e => { e.preventDefault(); keys.boost = false; boostBtn.classList.remove('pressed'); });

    leftBtn.addEventListener('mousedown', () => keys.left = true);
    leftBtn.addEventListener('mouseup', () => keys.left = false);
    rightBtn.addEventListener('mousedown', () => keys.right = true);
    rightBtn.addEventListener('mouseup', () => keys.right = false);
    boostBtn.addEventListener('mousedown', () => { keys.boost = true; boostBtn.classList.add('pressed'); });
    boostBtn.addEventListener('mouseup', () => { keys.boost = false; boostBtn.classList.remove('pressed'); });

    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', startGame);

    // ─── Start / Restart ───────────────────────────────────────────────────────
    function startGame() {
      score = 0; frame = 0; roadSpeed = baseSpeed;
      obstacles = []; particles = []; exhaustParticles = []; powerups = []; ghostTrail = [];
      obstacleCooldown = 0; powerupCooldown = 200; obstacleIdCounter = 0;
      shieldActive = false; shieldTimer = 0;
      slowActive = false; slowTimer = 0;
      multiActive = false; multiTimer = 0;
      scoreMultiplier = 1;

      boostCharge = BOOST_MAX; isBoosting = false; boostCooldown = 0;
      comboCount = 0; maxComboThisRun = 0; comboDecayTimer = 0;
      nearMissTotal = 0; boostUsedTotal = 0;
      trackedObstacles.clear();

      player.lane = 1; player.x = laneX(1); player.targetX = player.x;
      laneOffsets = [0, 0];

      [puShieldIcon, puSlowIcon, puMultiIcon].forEach(i => i.classList.remove('active'));
      multiBadge.style.display = 'none';
      canvas.classList.remove('boosting');
      updateComboHUD();
      updateBoostHUD();

      startOverlay.classList.add('hidden');
      gameOverOverlay.classList.add('hidden');
      state = 'playing';
      requestAnimationFrame(gameLoop);
    }

    // ─── End Game ──────────────────────────────────────────────────────────────
    function endGame() {
      state = 'over';
      crashFlash.style.opacity = '0.6';
      setTimeout(() => { crashFlash.style.opacity = '0'; }, 150);
      finalScoreEl.textContent = score;
      const isRecord = score > best;
      if (isRecord) { best = score; localStorage.setItem('turbodash_best', best); }
      bestLabel.textContent = 'BEST: ' + best;
      bestDisplay.textContent = best;
      newRecordEl.style.display = isRecord ? 'block' : 'none';

      document.getElementById('stat-boosts').textContent = boostUsedTotal;
      document.getElementById('stat-nearMiss').textContent = nearMissTotal;
      document.getElementById('stat-maxCombo').textContent = maxComboThisRun;

      gameOverOverlay.classList.remove('hidden');
      canvas.classList.remove('boosting');

      for (let i = 0; i < 40; i++) {
        particles.push({
          x: player.x, y: player.y,
          vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8,
          r: Math.random() * 6 + 2, life: 1,
          color: ['#ff2d55', '#ffe600', '#ff9500', '#fff'][Math.floor(Math.random() * 4)]
        });
      }
      drawFrame();
    }

    // ─── Toast ─────────────────────────────────────────────────────────────────
    let toastTimeout = null;
    function showToast(msg, color) {
      puToast.textContent = msg;
      puToast.style.background = color + '33';
      puToast.style.border = '1px solid ' + color;
      puToast.style.color = color;
      puToast.classList.add('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => puToast.classList.remove('show'), 1800);
    }

    // ─── Near-Miss Splash ──────────────────────────────────────────────────────
    let nmSplashTimeout = null;
    function showNearMiss(comboN) {
      nearMissSplash.textContent = comboN > 1 ? `NEAR MISS! ×${comboN}` : 'NEAR MISS!';
      nearMissSplash.classList.add('show');
      if (nmSplashTimeout) clearTimeout(nmSplashTimeout);
      nmSplashTimeout = setTimeout(() => nearMissSplash.classList.remove('show'), 700);
    }

    // ─── HUD updaters ──────────────────────────────────────────────────────────
    function updateBoostHUD() {
      const pct = (boostCharge / BOOST_MAX) * 100;
      boostFill.style.width = pct + '%';
      if (boostCharge >= BOOST_MAX) {
        boostBarWrap.classList.add('boost-ready');
      } else {
        boostBarWrap.classList.remove('boost-ready');
      }
    }

    function updateComboHUD() {
      comboCountEl.textContent = comboCount > 0 ? '×' + comboCount : '×0';
      if (comboCount > 0) {
        comboCountEl.style.color = '#39ff14';
        comboCountEl.style.textShadow = '0 0 10px #39ff14';
      } else {
        comboCountEl.style.color = 'rgba(255,255,255,0.2)';
        comboCountEl.style.textShadow = 'none';
      }
    }

    function popCombo() {
      comboCountEl.classList.remove('pop');
      void comboCountEl.offsetWidth;
      comboCountEl.classList.add('pop');
      setTimeout(() => comboCountEl.classList.remove('pop'), 120);
    }

    // ─── Update ────────────────────────────────────────────────────────────────
    function update() {
      frame++;

      // ── Power-up timers ──
      if (shieldActive) { shieldTimer--; if (shieldTimer <= 0) { shieldActive = false; puShieldIcon.classList.remove('active'); } }
      if (slowActive) { slowTimer--; if (slowTimer <= 0) { slowActive = false; puSlowIcon.classList.remove('active'); } }
      if (multiActive) { multiTimer--; if (multiTimer <= 0) { multiActive = false; puMultiIcon.classList.remove('active'); scoreMultiplier = 1; multiBadge.style.display = 'none'; } }

      // ── Boost logic ──
      const canBoost = boostCharge > 0 && boostCooldown <= 0;
      isBoosting = keys.boost && canBoost && !slowActive;

      if (isBoosting) {
        boostCharge -= BOOST_DRAIN_RATE;
        if (boostCharge <= 0) {
          boostCharge = 0;
          isBoosting = false;
          boostCooldown = BOOST_COOLDOWN; // cooldown before regen
          canvas.classList.remove('boosting');
        } else {
          canvas.classList.add('boosting');
        }
      } else {
        canvas.classList.remove('boosting');
        if (boostCooldown > 0) {
          boostCooldown--;
        } else if (boostCharge < BOOST_MAX) {
          boostCharge = Math.min(BOOST_MAX, boostCharge + BOOST_REGEN_RATE);
        }
      }

      // Track boost activation for stats
      if (isBoosting && frame % 2 === 0) {
        // count as "used" once per activation, handled by charge drain guard
      }

      updateBoostHUD();

      const effectiveSpeed = slowActive ? roadSpeed * 0.45 : (isBoosting ? roadSpeed * BOOST_SPEED_MULT : roadSpeed);

      // ── Score ──
      const rawScore = Math.floor(frame * roadSpeed / 10);
      score = multiActive ? rawScore * 2 : rawScore;
      // Combo score bonus: each active combo level adds a passive multiplier
      if (comboCount > 0) score += comboCount;
      scoreDisplay.textContent = score;
      bestDisplay.textContent = Math.max(best, score);

      // ── Speed ramp ──
      roadSpeed = baseSpeed + Math.floor(frame / 400) * 0.7;
      roadSpeed = Math.min(roadSpeed, 18);

      // ── Player movement ──
      if (keys.left && player.lane > 0) { player.lane--; player.targetX = laneX(player.lane); keys.left = false; }
      if (keys.right && player.lane < 2) { player.lane++; player.targetX = laneX(player.lane); keys.right = false; }
      player.x += (player.targetX - player.x) * 0.18;

      // ── Lane scroll ──
      for (let i = 0; i < 2; i++) { laneOffsets[i] = (laneOffsets[i] + effectiveSpeed) % 80; }

      // ── Ghost trail ──
      ghostTrail.unshift({ x: player.x, y: player.y, alpha: 0.35 });
      if (ghostTrail.length > 12) ghostTrail.pop();
      ghostTrail.forEach(g => { g.alpha -= 0.028; g.y += effectiveSpeed * 0.15; });

      // ── Exhaust particles (always on, more during boost) ──
      spawnExhaust(effectiveSpeed);

      // ── Spawn obstacles ──
      obstacleCooldown--;
      if (obstacleCooldown <= 0) {
        const lane = Math.floor(Math.random() * 3);
        const color = obstacleColors[Math.floor(Math.random() * obstacleColors.length)];
        const roll = Math.random();
        let type;
        if (roll < 0.40) type = 'car';
        else if (roll < 0.60) type = 'truck';
        else if (roll < 0.75) type = 'bike';
        else if (roll < 0.88) type = 'cone';
        else type = 'barrier';
        obstacles.push({ id: obstacleIdCounter++, x: laneX(lane), y: -100, w: typeW(type), h: typeH(type), color, type, passed: false });
        obstacleCooldown = Math.max(30, 110 - Math.floor(frame / 250) * 5);
      }

      // ── Move obstacles + near-miss detection ──
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += effectiveSpeed * 1.4;

        // Near-miss window: obstacle bottom just cleared player top
        if (!obs.passed && obs.y + obs.h / 2 > player.y - player.h / 2 - NEAR_MISS_DIST_Y && obs.y - obs.h / 2 < player.y + player.h / 2 + NEAR_MISS_DIST_Y) {
          const dx = Math.abs(obs.x - player.x);
          const dy = Math.abs(obs.y - player.y);
          // "near" but not colliding
          if (!trackedObstacles.has(obs.id) && dx < NEAR_MISS_DIST_X && dx > (obs.w + player.w) / 2 - 6) {
            trackedObstacles.add(obs.id);
            comboCount++;
            comboDecayTimer = COMBO_DECAY_FRAMES;
            nearMissTotal++;
            if (comboCount > maxComboThisRun) maxComboThisRun = comboCount;
            updateComboHUD();
            popCombo();
            showNearMiss(comboCount);
            // Bonus score spike
            score += comboCount * 15;
          }
        }

        if (obs.y > H + 120) obstacles.splice(i, 1);
      }

      // ── Combo decay ──
      if (comboCount > 0) {
        comboDecayTimer--;
        if (comboDecayTimer <= 0) {
          comboCount = 0;
          updateComboHUD();
        }
      }

      // ── Spawn power-ups ──
      powerupCooldown--;
      if (powerupCooldown <= 0) {
        const lane = Math.floor(Math.random() * 3);
        const types = ['shield', 'slow', 'multi'];
        const puType = types[Math.floor(Math.random() * types.length)];
        powerups.push({ x: laneX(lane), y: -40, type: puType, r: 18 });
        powerupCooldown = 280 + Math.floor(Math.random() * 120);
      }

      // ── Move power-ups ──
      for (let i = powerups.length - 1; i >= 0; i--) {
        powerups[i].y += effectiveSpeed * 1.0;
        if (powerups[i].y > H + 60) { powerups.splice(i, 1); continue; }
        const pu = powerups[i];
        const dx = Math.abs(pu.x - player.x), dy = Math.abs(pu.y - player.y);
        if (dx < pu.r + player.w / 2 - 4 && dy < pu.r + player.h / 2 - 8) {
          collectPowerup(pu.type); powerups.splice(i, 1);
        }
      }

      // ── Collision ──
      if (!shieldActive) {
        for (const obs of obstacles) {
          const dx = Math.abs(obs.x - player.x), dy = Math.abs(obs.y - player.y);
          if (dx < (obs.w + player.w) / 2 - 6 && dy < (obs.h + player.h) / 2 - 8) { endGame(); return; }
        }
      }
    }

    // ─── Exhaust particles ─────────────────────────────────────────────────────
    function spawnExhaust(spd) {
      const count = isBoosting ? 5 : 2;
      for (let i = 0; i < count; i++) {
        const offsetX = (Math.random() - 0.5) * 10;
        const boostColor = isBoosting
          ? `hsl(${20 + Math.random() * 40},100%,60%)`
          : `hsl(${180 + Math.random() * 40},80%,60%)`;
        exhaustParticles.push({
          x: player.x + offsetX,
          y: player.y + player.h / 2,
          vx: (Math.random() - 0.5) * (isBoosting ? 3 : 1),
          vy: spd * 0.6 + Math.random() * 2,
          r: isBoosting ? Math.random() * 5 + 2 : Math.random() * 3 + 1,
          life: isBoosting ? 0.8 : 0.5,
          color: boostColor
        });
      }
    }

    // ─── typeW / typeH ─────────────────────────────────────────────────────────
    function typeW(type) {
      switch (type) { case 'truck': return 44; case 'bike': return 22; case 'cone': return 24; case 'barrier': return 80; default: return 36; }
    }
    function typeH(type) {
      switch (type) { case 'truck': return 90; case 'bike': return 55; case 'cone': return 28; case 'barrier': return 22; default: return 68; }
    }

    // ─── Collect power-up ──────────────────────────────────────────────────────
    function collectPowerup(type) {
      if (type === 'shield') {
        shieldActive = true; shieldTimer = 360; puShieldIcon.classList.add('active');
        showToast('🛡️  SHIELD ON!', '#00f5ff');
      } else if (type === 'slow') {
        slowActive = true; slowTimer = 300; puSlowIcon.classList.add('active');
        showToast('🐌  SLOW MODE!', '#af52de');
      } else if (type === 'multi') {
        multiActive = true; multiTimer = 400; scoreMultiplier = 2;
        puMultiIcon.classList.add('active');
        multiBadge.style.display = 'block';
        showToast('✖️  SCORE ×2!', '#ffe600');
      }
    }

    // ─── DRAW ──────────────────────────────────────────────────────────────────
    function drawFrame() {
      ctx.clearRect(0, 0, W, H);

      // Background
      if (isDayMode) {
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#87CEEB'); bg.addColorStop(1, '#b0e0f5');
        ctx.fillStyle = bg;
      } else {
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#050a0f'); bg.addColorStop(1, '#0a1520');
        ctx.fillStyle = bg;
      }
      ctx.fillRect(0, 0, W, H);

      // Boost warp-speed effect: horizontal blur streaks on sides
      if (isBoosting) drawBoostStreaks();

      drawRoad();
      drawPowerups();
      drawExhaustParticles();
      if (state !== 'over') {
        drawGhostTrail();
        drawPlayer();
      }
      drawObstacles();
      drawParticles();

      // Boost vignette
      if (isBoosting) {
        const vign = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8);
        vign.addColorStop(0, 'transparent');
        vign.addColorStop(1, 'rgba(255,100,0,0.18)');
        ctx.fillStyle = vign; ctx.fillRect(0, 0, W, H);
      }
    }

    function drawBoostStreaks() {
      const alpha = 0.12 + 0.08 * Math.sin(frame * 0.3);
      ctx.save();
      ctx.strokeStyle = `rgba(255,180,0,${alpha})`;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 18; i++) {
        const x = ROAD_LEFT - 10 + Math.random() * (ROAD_W + 20);
        const yStart = Math.random() * H;
        const len = 40 + Math.random() * 80;
        ctx.beginPath(); ctx.moveTo(x, yStart); ctx.lineTo(x, yStart + len); ctx.stroke();
      }
      ctx.restore();
    }

    function drawRoad() {
      const roadGrad = ctx.createLinearGradient(ROAD_LEFT, 0, ROAD_RIGHT, 0);
      if (isDayMode) {
        roadGrad.addColorStop(0, '#888'); roadGrad.addColorStop(0.5, '#aaa'); roadGrad.addColorStop(1, '#888');
      } else {
        roadGrad.addColorStop(0, '#101820'); roadGrad.addColorStop(0.5, '#192435'); roadGrad.addColorStop(1, '#101820');
      }
      ctx.fillStyle = roadGrad; ctx.fillRect(ROAD_LEFT, 0, ROAD_W, H);

      // Edge glows
      const edgeColor = isDayMode ? 'rgba(0,100,180,0.12)' : 'rgba(0,245,255,0.08)';
      const gl = ctx.createLinearGradient(ROAD_LEFT - 20, 0, ROAD_LEFT + 20, 0);
      gl.addColorStop(0, 'transparent'); gl.addColorStop(1, edgeColor);
      ctx.fillStyle = gl; ctx.fillRect(ROAD_LEFT - 20, 0, 40, H);
      const gr = ctx.createLinearGradient(ROAD_RIGHT - 20, 0, ROAD_RIGHT + 20, 0);
      gr.addColorStop(0, edgeColor); gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr; ctx.fillRect(ROAD_RIGHT - 20, 0, 40, H);

      // Borders
      const borderColor = isBoosting ? '#ff6a00' : (isDayMode ? '#0077aa' : '#00f5ff');
      ctx.strokeStyle = borderColor; ctx.lineWidth = 3;
      ctx.shadowColor = borderColor; ctx.shadowBlur = isBoosting ? 20 : (isDayMode ? 6 : 14);
      ctx.beginPath(); ctx.moveTo(ROAD_LEFT, 0); ctx.lineTo(ROAD_LEFT, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ROAD_RIGHT, 0); ctx.lineTo(ROAD_RIGHT, H); ctx.stroke();
      ctx.shadowBlur = 0;

      // Dashed lane lines
      const laneXPos = [ROAD_LEFT + LANE_W, ROAD_LEFT + LANE_W * 2];
      ctx.strokeStyle = isBoosting ? 'rgba(255,200,0,0.6)' : (isDayMode ? 'rgba(255,255,255,0.7)' : 'rgba(255,230,0,0.45)');
      ctx.lineWidth = 2; ctx.setLineDash([40, 40]);
      for (let li = 0; li < 2; li++) {
        ctx.lineDashOffset = -laneOffsets[li];
        ctx.beginPath(); ctx.moveTo(laneXPos[li], 0); ctx.lineTo(laneXPos[li], H); ctx.stroke();
      }
      ctx.setLineDash([]); ctx.lineDashOffset = 0;
    }

    // ─── Ghost trail ───────────────────────────────────────────────────────────
    function drawGhostTrail() {
      if (!isBoosting && roadSpeed < 5) return;
      const trailColor = isBoosting ? playerColor : playerColor;
      ghostTrail.forEach((g, i) => {
        if (g.alpha <= 0) return;
        const scale = 1 - i / ghostTrail.length * 0.5;
        ctx.save();
        ctx.globalAlpha = Math.max(0, g.alpha * (isBoosting ? 1.8 : 0.7));
        ctx.translate(g.x, g.y);
        ctx.scale(scale, scale);
        // Simple ghost silhouette
        ctx.fillStyle = trailColor;
        ctx.shadowColor = trailColor; ctx.shadowBlur = 8;
        roundRect(ctx, -player.w / 2, -player.h / 2, player.w, player.h, 7);
        ctx.fill();
        ctx.restore();
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }

    // ─── Exhaust particles ─────────────────────────────────────────────────────
    function drawExhaustParticles() {
      for (let i = exhaustParticles.length - 1; i >= 0; i--) {
        const p = exhaustParticles[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.06;
        if (p.life <= 0) { exhaustParticles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.life * 0.8;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      ctx.shadowBlur = 0;
    }

    // ─── Power-up orbs ─────────────────────────────────────────────────────────
    function drawPowerups() {
      const t = Date.now() / 1000;
      for (const pu of powerups) {
        ctx.save(); ctx.translate(pu.x, pu.y);
        const pulse = 1 + 0.1 * Math.sin(t * 4); ctx.scale(pulse, pulse);
        let color, emoji;
        if (pu.type === 'shield') { color = '#00f5ff'; emoji = '🛡️'; }
        else if (pu.type === 'slow') { color = '#af52de'; emoji = '🐌'; }
        else { color = '#ffe600'; emoji = '✖️'; }
        ctx.shadowColor = color; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.arc(0, 0, pu.r, 0, Math.PI * 2);
        ctx.fillStyle = color + '33'; ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke(); ctx.shadowBlur = 0;
        ctx.font = '16px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 0, 1); ctx.restore();
      }
    }

    // ─── Car drawing ───────────────────────────────────────────────────────────
    function drawCar(x, y, w, h, bodyColor, isPlayer) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath(); ctx.ellipse(0, h / 2 - 4, w * 0.55, 10, 0, 0, Math.PI * 2); ctx.fill();
      const bodyGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      if (isPlayer) {
        bodyGrad.addColorStop(0, lighten(bodyColor, 0.3));
        bodyGrad.addColorStop(0.5, bodyColor);
        bodyGrad.addColorStop(1, darken(bodyColor, 0.3));
      } else {
        bodyGrad.addColorStop(0, lighten(bodyColor, 0.3)); bodyGrad.addColorStop(1, bodyColor);
      }
      ctx.fillStyle = bodyGrad; roundRect(ctx, -w / 2, -h / 2, w, h, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      roundRect(ctx, -w / 2 + 4, -h / 2 + 4, w * 0.35, h * 0.4, 4); ctx.fill();
      ctx.fillStyle = isPlayer ? 'rgba(200,245,255,0.35)' : 'rgba(255,255,255,0.2)';
      roundRect(ctx, -w / 2 + 6, -h / 2 + 6, w - 12, h * 0.3, 3); ctx.fill();
      if (!isPlayer) {
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        roundRect(ctx, -w / 2 + 6, h / 2 - h * 0.3 - 4, w - 12, h * 0.28, 3); ctx.fill();
      }
      const lightY = isPlayer ? -h / 2 + 5 : h / 2 - 10;
      const lightColor = isPlayer ? (isBoosting ? '#ff6a00' : '#ffe600') : '#ff2d55';
      ctx.fillStyle = lightColor; ctx.shadowColor = lightColor; ctx.shadowBlur = 10;
      ctx.fillRect(-w / 2 + 4, lightY, 10, 6); ctx.fillRect(w / 2 - 14, lightY, 10, 6);
      ctx.shadowBlur = 0;
      const wheelPos = [[-w / 2 - 4, -h / 2 + 12], [w / 2 - 4, -h / 2 + 12], [-w / 2 - 4, h / 2 - 18], [w / 2 - 4, h / 2 - 18]];
      for (const [wx, wy] of wheelPos) {
        ctx.fillStyle = '#1a1a1a'; roundRect(ctx, wx, wy, 8, 16, 3); ctx.fill();
        ctx.strokeStyle = '#555'; ctx.lineWidth = 1.5; ctx.stroke();
      }
      if (isPlayer && shieldActive) {
        ctx.shadowColor = '#00f5ff'; ctx.shadowBlur = 25;
        ctx.strokeStyle = 'rgba(0,245,255,0.7)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(0, 0, w / 2 + 10, h / 2 + 10, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowBlur = 0;
      }
      if (isPlayer) {
        const outlineColor = isBoosting ? '#ff6a00' : playerColor;
        ctx.shadowColor = outlineColor; ctx.shadowBlur = isBoosting ? 30 : 20;
        ctx.strokeStyle = outlineColor + '88'; ctx.lineWidth = 2;
        roundRect(ctx, -w / 2 - 2, -h / 2 - 2, w + 4, h + 4, 9); ctx.stroke(); ctx.shadowBlur = 0;
      }
      ctx.restore();
    }

    function drawTruck(x, y, w, h, color) {
      ctx.save(); ctx.translate(x, y);
      const cabH = h * 0.42;
      const bodyGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      bodyGrad.addColorStop(0, lighten(color, 0.25)); bodyGrad.addColorStop(1, color);
      ctx.fillStyle = bodyGrad; roundRect(ctx, -w / 2, -h / 2, w, h, 5); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-w / 2 + 3, -h / 2 + cabH); ctx.lineTo(w / 2 - 3, -h / 2 + cabH); ctx.stroke();
      ctx.fillStyle = 'rgba(200,230,255,0.3)';
      roundRect(ctx, -w / 2 + 5, -h / 2 + 4, w - 10, cabH - 8, 4); ctx.fill();
      ctx.fillStyle = '#ff2d55'; ctx.shadowColor = '#ff2d55'; ctx.shadowBlur = 8;
      ctx.fillRect(-w / 2 + 3, h / 2 - 10, 12, 8); ctx.fillRect(w / 2 - 15, h / 2 - 10, 12, 8);
      ctx.shadowBlur = 0;
      for (const [wx, wy] of [[-w / 2 - 5, -h / 2 + 14], [w / 2 - 3, -h / 2 + 14], [-w / 2 - 5, h / 2 - 22], [w / 2 - 3, h / 2 - 22]]) {
        ctx.fillStyle = '#111'; roundRect(ctx, wx, wy, 10, 20, 3); ctx.fill();
        ctx.strokeStyle = '#444'; ctx.lineWidth = 1.5; ctx.stroke();
      }
      ctx.restore();
    }

    function drawBike(x, y, w, h, color) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = color; roundRect(ctx, -w / 2, -h / 2 + h * 0.2, w, h * 0.5, 5); ctx.fill();
      ctx.fillStyle = lighten(color, 0.3);
      ctx.beginPath(); ctx.ellipse(0, -h / 2 + h * 0.12, w * 0.4, h * 0.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#333'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-w / 2 + 2, h / 2 - 8); ctx.lineTo(w / 2 - 2, h / 2 - 8); ctx.stroke();
      ctx.strokeStyle = '#555'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(-w / 2 + 6, h / 2 - 4, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(w / 2 - 6, h / 2 - 4, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#ffe600'; ctx.shadowColor = '#ffe600'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(0, -h / 2, 4, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0; ctx.restore();
    }

    function drawCone(x, y, w, h) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#ff6600';
      ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.lineTo(w / 2, h / 2); ctx.lineTo(-w / 2, h / 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(-w / 2 + 4, -h / 2 + h * 0.3, w - 8, h * 0.12);
      ctx.fillRect(-w / 2 + 4, -h / 2 + h * 0.55, w - 8, h * 0.12);
      ctx.fillStyle = '#ccc'; roundRect(ctx, -w / 2 - 2, h / 2 - 4, w + 4, 6, 2); ctx.fill();
      ctx.restore();
    }

    function drawBarrier(x, y, w, h) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#999';
      ctx.beginPath();
      ctx.moveTo(-w / 2, h / 2); ctx.lineTo(-w / 2 + 4, -h / 4); ctx.lineTo(-w / 2 + 8, -h / 2);
      ctx.lineTo(w / 2 - 8, -h / 2); ctx.lineTo(w / 2 - 4, -h / 4); ctx.lineTo(w / 2, h / 2);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 10, -h / 2 + 2); ctx.lineTo(w / 2 - 10, -h / 2 + 2);
      ctx.lineTo(w / 2 - 12, -h / 4); ctx.lineTo(-w / 2 + 12, -h / 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ff6600';
      for (let sx = -w / 2 + 6; sx < w / 2 - 6; sx += 16) { ctx.fillRect(sx, -h / 2 + 2, 8, 8); }
      ctx.restore();
    }

    function drawObstacles() {
      for (const obs of obstacles) {
        switch (obs.type) {
          case 'truck': drawTruck(obs.x, obs.y, obs.w, obs.h, obs.color); break;
          case 'bike': drawBike(obs.x, obs.y, obs.w, obs.h, obs.color); break;
          case 'cone': drawCone(obs.x, obs.y, obs.w, obs.h); break;
          case 'barrier': drawBarrier(obs.x, obs.y, obs.w, obs.h); break;
          default: drawCar(obs.x, obs.y, obs.w, obs.h, obs.color, false); break;
        }
      }
    }

    function drawPlayer() { drawCar(player.x, player.y, player.w, player.h, playerColor, true); }

    function drawParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.025;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────
    function roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
    }
    function lighten(hex, amt) {
      hex = hex.replace('#', ''); if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const num = parseInt(hex, 16);
      return `rgb(${Math.round(Math.min(255, (num >> 16) + amt * 255))},${Math.round(Math.min(255, ((num >> 8) & 0xff) + amt * 255))},${Math.round(Math.min(255, (num & 0xff) + amt * 255))})`;
    }
    function darken(hex, amt) {
      hex = hex.replace('#', ''); if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const num = parseInt(hex, 16);
      return `rgb(${Math.round(Math.max(0, (num >> 16) - amt * 255))},${Math.round(Math.max(0, ((num >> 8) & 0xff) - amt * 255))},${Math.round(Math.max(0, (num & 0xff) - amt * 255))})`;
    }

    // ─── Game Loop ─────────────────────────────────────────────────────────────
    function gameLoop() {
      if (state !== 'playing') return;
      update(); drawFrame();
      requestAnimationFrame(gameLoop);
    }

    // Init
    drawFrame();
