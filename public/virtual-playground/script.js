const PLANETS = {

  moon: {
    multiplier: 0.16,
    jump: -18,
    color: "#F5F5DC"
  },
  mars: {
    multiplier: 0.38,
    jump: -15,
    color: "#E63946"
  },
  earth: {
    multiplier: 1.0,
    jump: -10,
    color: "#2196F3"
  },
  saturn: {
    multiplier: 1.06,
    jump: -9,
    color: "#D4AF37"
  },
  jupiter: {
    multiplier: 2.53,
    jump: -7,
    color: "#FF8C42"
  }
=======
  moon: { multiplier: 0.16 },
  mars: { multiplier: 0.38 },
  earth: { multiplier: 1.0 },
  saturn: { multiplier: 1.06 },
  jupiter: { multiplier: 2.53 },

};

const BASE_GRAVITY = 0.5;

let currentPlanet = PLANETS.earth;
let gravity = BASE_GRAVITY * currentPlanet.multiplier;

const ball = document.getElementById('ball');
const area = document.getElementById('playArea');
const colorPicker = document.getElementById('ballColor');
const shapeSelect = document.getElementById('ballShape');

const BALL_SIZE = 40;

let x = 0;
let y = 0;
let vx = 0;
let vy = 0;

// ----------------------
// Physics Update
// ----------------------
function update() {

  const areaWidth = area.clientWidth;
  const areaHeight = area.clientHeight;

  vy += gravity;

  vy = Math.max(-25, Math.min(vy, 25));

  x += vx;
  y += vy;

  // Floor
  if (y + BALL_SIZE >= areaHeight) {
    y = areaHeight - BALL_SIZE;

    if (Math.abs(vy) < 1) {
      vy = 0;
    } else {
      vy *= -0.75;
    }
  }

  // Ceiling
  if (y <= 0) {
    y = 0;
    vy = Math.abs(vy) * 0.75;
  }

  // Left Wall
  if (x <= 0) {
    x = 0;
    vx *= -0.75;
  }

  // Right Wall
  if (x + BALL_SIZE >= areaWidth) {
    x = areaWidth - BALL_SIZE;
    vx *= -0.75;
  }

  ball.style.left = x + "px";
  ball.style.top = y + "px";

  requestAnimationFrame(update);
}


// ----------------------
// Ball Jump
// ----------------------
ball.addEventListener("click", () => {

  vy = currentPlanet.jump;

=======
// Ball jump
ball.addEventListener('click', () => {
  vy = -10;

  vx = (Math.random() - 0.5) * 8;

});

// ----------------------
// Reset
// ----------------------
function resetBall() {

  x = area.clientWidth / 2 - BALL_SIZE / 2;
  y = area.clientHeight / 2 - BALL_SIZE / 2;

  vx = 0;
  vy = 0;

}

function keepBallInsideBounds() {
  const areaWidth = area.clientWidth;
  const areaHeight = area.clientHeight;

  x = Math.min(Math.max(0, x), areaWidth - BALL_SIZE);
  y = Math.min(Math.max(0, y), areaHeight - BALL_SIZE);

  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
}

window.resetBall = resetBall;


// ----------------------
// Planet Selection
// ----------------------
document.querySelectorAll(".planet-btn").forEach((btn) => {

  btn.addEventListener("click", () => {
=======
window.addEventListener('resize', () => {
  keepBallInsideBounds();
});

// Planet selector
document.querySelectorAll('.planet-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const planetName = btn.dataset.planet;


    const planet = btn.dataset.planet;

    if (!PLANETS[planet]) return;

    currentPlanet = PLANETS[planet];

    gravity = BASE_GRAVITY * currentPlanet.multiplier;


    document.querySelectorAll(".planet-btn").forEach(button => {

      button.classList.remove("active");

    });

    btn.classList.add("active");

    // Change Ball Color
    ball.style.background = currentPlanet.color;

    // Update Color Picker
    colorPicker.value = currentPlanet.color;

=======
    document.querySelectorAll('.planet-btn').forEach((button) => {
      button.classList.remove('active');
    });

    btn.classList.add('active');

  });

});

// ----------------------
// Manual Color Picker
// ----------------------
colorPicker.addEventListener("input", () => {

  ball.style.background = colorPicker.value;

});

// ----------------------
// Shape Changer
// ----------------------
function applyShape(shape) {

  ball.style.clipPath = "";
  ball.style.borderRadius = "0";

  switch (shape) {

    case "circle":
      ball.style.borderRadius = "50%";
      break;

    case 'square':
      break;

    case "triangle":
      ball.style.clipPath =
        "polygon(50% 0%,0% 100%,100% 100%)";
      break;

    case 'star':
      ball.style.clipPath =
        'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)';
      break;
  }

}

shapeSelect.addEventListener("change", () => {

  applyShape(shapeSelect.value);

});

// ----------------------
// Initial Setup
// ----------------------
ball.style.background = currentPlanet.color;

colorPicker.value = currentPlanet.color;

applyShape("circle");

resetBall();

update();