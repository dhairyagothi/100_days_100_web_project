      const clipPaths = {
        circle: '',
        square: '',
        triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      };

      /* ── Gravity calculation ────────────────────────────────────────
         BASE_GRAVITY is the raw pixel-per-frame² acceleration for Earth.
         Each planet's actual gravity = BASE_GRAVITY × planet.multiplier.
         This matches the original Earth gravity value of 0.5 exactly.
      ────────────────────────────────────────────────────────────────── */
      const BASE_GRAVITY = 0.5;

      /* Active physics state — starts on Earth */
      let currentPlanet = PLANETS.earth;
      let gravity = BASE_GRAVITY * currentPlanet.multiplier; // 0.5

      const ball     = document.getElementById('ball');
      const area     = document.getElementById('playArea');
      const colorPicker = document.getElementById('ballColor');
      const shapeSelect = document.getElementById('ballShape');

      let x = 180, y = 180, vx = 0, vy = 0;
      let bouncing = true;

      /* ── Physics loop ───────────────────────────────────────────────
         gravity is re-read from the live variable each frame, so
         switching planets takes effect immediately with no restart.
      ────────────────────────────────────────────────────────────────── */
      function update() {
        /* Apply gravity to vertical velocity */
        vy += gravity;
        x += vx;
        y += vy;
        if (y + 40 > 400) {
          y = 400 - 40;
          vy *= -0.7;
        }
        if (y < 0) {
          y = 0;

          // Bounce away from ceiling
          vy = Math.abs(vy) * 0.7;

          // Prevent repeated ceiling collisions when gravity is reversed
          if (gravity < 0 && vy < 1.5) {
            vy = 1.5;
          }
        }
        if (x + 40 > 400) {
          x = 400 - 40;
          vx *= -0.7;
        }
        if (x < 0) {
          x = 0;
          vx *= -0.7;
        }
        ball.style.left = x + 'px';
        ball.style.top  = y + 'px';
        if (bouncing) requestAnimationFrame(update);
      }

      /* Click the ball to launch it upward with a random horizontal kick */
      ball.addEventListener('click', () => {
        vy = -10;
        vx = (Math.random() - 0.5) * 10;
      });

      /* Reset restores position and velocity; planet/color/shape unchanged */
      function resetBall() {
        x = 180; y = 180; vx = 0; vy = 0;
      }

      /* ── Planet selector ────────────────────────────────────────────
         Clicking a planet button updates gravity and bounce immediately.
         Active button styling reflects the current selection.
      ────────────────────────────────────────────────────────────────── */
      document.querySelectorAll('.planet-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.dataset.planet;
          currentPlanet = PLANETS[key];

          /* Recalculate live gravity from multiplier */
          gravity = BASE_GRAVITY * currentPlanet.multiplier;

          /* Update active highlight */
          document.querySelectorAll('.planet-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });

      /* ── Ball colour ────────────────────────────────────────────────
         Color picker input fires on every drag — instant update.
      ────────────────────────────────────────────────────────────────── */
      colorPicker.addEventListener('input', () => {
        ball.style.background = colorPicker.value;
      });
      ball.style.background = colorPicker.value;

      /* ── Ball shape ─────────────────────────────────────────────────
         CSS clip-path handles triangle and star; border-radius for
         circle and square. No canvas needed.
      ────────────────────────────────────────────────────────────────── */
      const CLIP_PATHS = {
        circle:   '',
        square:   '',
        triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        star:     'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
      };

      function applyShape(shape) {
        ball.style.borderRadius = shape === 'circle' ? '50%' : '0';
        ball.style.clipPath     = CLIP_PATHS[shape];
      }

      shapeSelect.addEventListener('change', () => applyShape(shapeSelect.value));

      /* Kick off the animation loop */
      update();
