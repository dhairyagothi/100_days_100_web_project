// Alternate name for shape clip-paths (not used directly below but kept
// for historical/reference purposes). Defines CSS clip-path values for
// non-rectangular shapes used to mask the ball element.
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
// Base gravity constant (pixels/frame^2) for Earth. Individual planet
// gravities are calculated by multiplying this base by a planet-specific
// multiplier (see PLANETS object defined elsewhere in the app).
const BASE_GRAVITY = 0.5;
const PLANETS = {
  earth: { name: 'Earth', multiplier: 1.0 },
  moon: { name: 'Moon', multiplier: 0.165 },
  mars: { name: 'Mars', multiplier: 0.38 },
  jupiter: { name: 'Jupiter', multiplier: 2.528 },
  saturn: { name: 'Saturn', multiplier: 1.065 }
}
/* Active physics state — starts on Earth */
// Start on Earth by default and compute the live gravity value used
// in the physics simulation. The PLANETS object (expected to be defined
// in another script) provides per-planet multipliers.
let currentPlanet = PLANETS.earth;
let gravity = BASE_GRAVITY * currentPlanet.multiplier; // initial gravity

// DOM references to interactive UI elements
const ball = document.getElementById('ball');           // the moving element
const area = document.getElementById('playArea');       // container / bounds
const colorPicker = document.getElementById('ballColor');
const shapeSelect = document.getElementById('ballShape');

// Position (x,y) and velocity (vx,vy) of the ball in pixels and
// pixels-per-frame respectively. bouncing toggles the animation loop.
let x = 180, y = 180, vx = 0, vy = 0;
let bouncing = true;

/* ── Physics loop ───────────────────────────────────────────────
   gravity is re-read from the live variable each frame, so
   switching planets takes effect immediately with no restart.
────────────────────────────────────────────────────────────────── */
// Main physics loop: apply gravity, integrate velocities to positions,
// enforce rectangular bounds [0,400] minus the ball size (40px), and
// apply a damping factor on collisions to simulate energy loss.
function update() {
  // Integrate acceleration into vertical velocity
  vy += gravity;

  // Integrate velocities into positions
  x += vx;
  y += vy;

  // Floor collision: snap to floor and invert/dampen vertical velocity
  if (y + 40 > 400) {
    y = 400 - 40;
    vy *= -0.7; // lose 30% of speed on bounce
  }

  // Ceiling collision: push down and dampen
  if (y < 0) {
    y = 0;
    vy = Math.abs(vy) * 0.7;

    // When gravity is reversed (negative), ensure small upward
    // velocities don't cause repeated ceiling collisions by clamping
    if (gravity < 0 && vy < 1.5) {
      vy = 1.5;
    }
  }

  // Right wall collision
  if (x + 40 > 400) {
    x = 400 - 40;
    vx *= -0.7;
  }

  // Left wall collision
  if (x < 0) {
    x = 0;
    vx *= -0.7;
  }

  // Update DOM element position
  ball.style.left = x + 'px';
  ball.style.top = y + 'px';

  // Continue loop while bouncing is enabled
  if (bouncing) requestAnimationFrame(update);
}

// Clicking the ball gives it an immediate upward impulse and a small
// random horizontal velocity for variety.
ball.addEventListener('click', () => {
  vy = -10;
  vx = (Math.random() - 0.5) * 10;
});

// Reset the ball's position and stop any motion (does not change
// selected planet, color, or shape).
function resetBall() {
  x = 180; y = 180; vx = 0; vy = 0;
}

/* ── Planet selector ────────────────────────────────────────────
   Clicking a planet button updates gravity and bounce immediately.
   Active button styling reflects the current selection.
────────────────────────────────────────────────────────────────── */
// Wire up planet selection buttons. When a planet is selected we update
// the currentPlanet reference, recalc gravity immediately, and update
// the UI highlight on the active button.
document.querySelectorAll('.planet-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.planet;
    currentPlanet = PLANETS[key];

    // Live gravity value used by the physics loop
    gravity = BASE_GRAVITY * currentPlanet.multiplier;

    // Update active button styling
    document.querySelectorAll('.planet-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ── Ball colour ────────────────────────────────────────────────
   Color picker input fires on every drag — instant update.
────────────────────────────────────────────────────────────────── */
// Instant color updates as the user drags the color input
colorPicker.addEventListener('input', () => {
  ball.style.background = colorPicker.value;
});
ball.style.background = colorPicker.value; // initial color

/* ── Ball shape ─────────────────────────────────────────────────
   CSS clip-path handles triangle and star; border-radius for
   circle and square. No canvas needed.
────────────────────────────────────────────────────────────────── */
// Canonical set of clip-paths used to mask the ball into different shapes.
// circle/square use border-radius instead of clip-path for better rendering.
const CLIP_PATHS = {
  circle: '',
  square: '',
  triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
};

// Apply selected shape to the ball. Circles are achieved with border-radius;
// triangles and stars use clip-path polygons.
function applyShape(shape) {
  ball.style.borderRadius = shape === 'circle' ? '50%' : '0';
  ball.style.clipPath = CLIP_PATHS[shape];
}

// React to shape selection changes and start the animation loop.
shapeSelect.addEventListener('change', () => applyShape(shapeSelect.value));

// Start the simulation
update();
