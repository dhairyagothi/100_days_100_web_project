const PLANETS = {
  moon: { multiplier: 0.16 },
  mars: { multiplier: 0.38 },
  earth: { multiplier: 1.0 },
  saturn: { multiplier: 1.06 },
  jupiter: { multiplier: 2.53 }
};

const BASE_GRAVITY = 0.5;

let currentPlanet = PLANETS.earth;
let gravity = BASE_GRAVITY * currentPlanet.multiplier;

const ball = document.getElementById("ball");
const area = document.getElementById("playArea");
const colorPicker = document.getElementById("ballColor");
const shapeSelect = document.getElementById("ballShape");

let x = 180;
let y = 180;
let vx = 0;
let vy = 0;

const BALL_SIZE = 40;

function update() {
  const areaWidth = area.clientWidth;
  const areaHeight = area.clientHeight;

  vy += gravity;

  // Prevent insane speeds
  vy = Math.max(-20, Math.min(vy, 20));

  x += vx;
  y += vy;

  // Floor collision
  if (y + BALL_SIZE >= areaHeight) {
    y = areaHeight - BALL_SIZE;

    if (Math.abs(vy) < 1) {
      vy = 0;
    } else {
      vy *= -0.75;
    }
  }

  // Ceiling collision
  if (y <= 0) {
    y = 0;
    vy = Math.abs(vy) * 0.75;
  }

  // Right wall
  if (x + BALL_SIZE >= areaWidth) {
    x = areaWidth - BALL_SIZE;
    vx *= -0.75;
  }

  // Left wall
  if (x <= 0) {
    x = 0;
    vx *= -0.75;
  }

  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;

  requestAnimationFrame(update);
}

// Ball jump
ball.addEventListener("click", () => {
  vy = -10;
  vx = (Math.random() - 0.5) * 8;
});

// Reset button
function resetBall() {
  x = area.clientWidth / 2 - BALL_SIZE / 2;
  y = area.clientHeight / 2 - BALL_SIZE / 2;
  vx = 0;
  vy = 0;
}

window.resetBall = resetBall;

// Planet selector
document.querySelectorAll(".planet-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const planetName = btn.dataset.planet;

    if (!PLANETS[planetName]) return;

    currentPlanet = PLANETS[planetName];
    gravity = BASE_GRAVITY * currentPlanet.multiplier;

    document.querySelectorAll(".planet-btn").forEach(button => {
      button.classList.remove("active");
    });

    btn.classList.add("active");
  });
});

// Color picker
colorPicker.addEventListener("input", () => {
  ball.style.backgroundColor = colorPicker.value;
});

// Shape changer
function applyShape(shape) {
  ball.style.clipPath = "";
  ball.style.borderRadius = "0";

  switch (shape) {
    case "circle":
      ball.style.borderRadius = "50%";
      break;

    case "square":
      break;

    case "triangle":
      ball.style.clipPath =
        "polygon(50% 0%, 0% 100%, 100% 100%)";
      break;

    case "star":
      ball.style.clipPath =
        "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)";
      break;
  }
}

shapeSelect.addEventListener("change", () => {
  applyShape(shapeSelect.value);
});

// Initial setup
ball.style.backgroundColor = colorPicker.value;
applyShape("circle");
resetBall();
update();
