const canvas = document.querySelector("#ping-pong");
const context = canvas.getContext("2d");

const pauseBtn = document.querySelector(".pause-btn");
const restartBtn = document.querySelector(".restart-btn");

let gameRunning = false;
let waitingForStart = true;
let animationId;

// Portrait orientation: paddles are horizontal, move left/right along bottom/top
const user = {
  x: canvas.width / 2 - 60 / 2,
  y: canvas.height - 20,
  width: 60,
  height: 10,
  color: "#3b82f6",
  score: 0
};

const computer = {
  x: canvas.width / 2 - 60 / 2,
  y: 10,
  width: 60,
  height: 10,
  color: "#ef4444",
  score: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 8,
  speed: 4,
  velocityX: 3,
  velocityY: -4,
  color: "white"
};

restartBtn.addEventListener("click", () => {
  document.location.reload();
});

// Mouse/touch controls horizontal paddle movement
canvas.addEventListener("mousemove", movePaddle);
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const touch = e.touches[0];
  user.x = (touch.clientX - rect.left) * scaleX - user.width / 2;
  clampUser();
}, { passive: false });

function movePaddle(evt) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  user.x = (evt.clientX - rect.left) * scaleX - user.width / 2;
  clampUser();
}

function clampUser() {
  user.x = Math.max(0, Math.min(canvas.width - user.width, user.x));
}

// Click anywhere on canvas to start
canvas.addEventListener("click", () => {
  if (waitingForStart) {
    waitingForStart = false;
    gameRunning = true;
    animate();
  }
});

pauseBtn.addEventListener("click", () => {
  if (!waitingForStart) {
    gameRunning = !gameRunning;
    pauseBtn.textContent = gameRunning ? "Pause" : "Resume";
    if (gameRunning) animate();
    else cancelAnimationFrame(animationId);
  }
});

function drawRectangle(x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}

function drawNet() {
  const segH = 10, gap = 15, x = canvas.width / 2 - 1;
  for (let i = 0; i < canvas.height; i += segH + gap) {
    drawRectangle(x, i, 2, segH, "rgba(255,255,255,0.4)");
  }
}

function drawScorePanels() {
  // CPU panel — top, red tint
  context.fillStyle = "rgba(239,68,68,0.15)";
  context.fillRect(0, 0, canvas.width, 44);

  // Player panel — bottom, blue tint
  context.fillStyle = "rgba(59,130,246,0.15)";
  context.fillRect(0, canvas.height - 44, canvas.width, 44);

  // CPU score & label
  context.fillStyle = "#ef4444";
  context.font = "bold 22px 'Franklin Gothic Medium', Arial, sans-serif";
  context.textAlign = "left";
  context.fillText(computer.score, 14, 30);
  context.fillStyle = "rgba(239,68,68,0.6)";
  context.font = "11px 'Franklin Gothic Medium', Arial, sans-serif";
  context.fillText("CPU", canvas.width - 40, 30);

  // Player score & label
  context.fillStyle = "#3b82f6";
  context.font = "bold 22px 'Franklin Gothic Medium', Arial, sans-serif";
  context.textAlign = "left";
  context.fillText(user.score, 14, canvas.height - 14);
  context.fillStyle = "rgba(59,130,246,0.6)";
  context.font = "11px 'Franklin Gothic Medium', Arial, sans-serif";
  context.fillText("YOU", canvas.width - 40, canvas.height - 14);

  context.textAlign = "left";
}

function drawStartScreen() {
  // Dim overlay
  context.fillStyle = "rgba(0,0,0,0.72)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.textAlign = "center";

  context.fillStyle = "#ffffff";
  context.font = "bold 28px 'Franklin Gothic Medium', Arial, sans-serif";
  context.fillText("PONG", canvas.width / 2, canvas.height / 2 - 36);

  context.fillStyle = "rgba(255,255,255,0.55)";
  context.font = "12px 'Franklin Gothic Medium', Arial, sans-serif";
  context.fillText("YOU ARE BLUE  ·  BOTTOM PADDLE", canvas.width / 2, canvas.height / 2 - 6);

  // Pill button
  const btnW = 140, btnH = 34, btnX = canvas.width / 2 - btnW / 2, btnY = canvas.height / 2 + 14;
  context.fillStyle = "rgba(255,255,255,0.1)";
  context.strokeStyle = "rgba(255,255,255,0.3)";
  context.lineWidth = 1;
  context.beginPath();
  context.roundRect(btnX, btnY, btnW, btnH, 17);
  context.fill();
  context.stroke();

  context.fillStyle = "#ffffff";
  context.font = "13px 'Franklin Gothic Medium', Arial, sans-serif";
  context.fillText("click to start", canvas.width / 2, btnY + 22);

  context.textAlign = "left";
}

function render() {
  drawRectangle(0, 0, canvas.width, canvas.height, "#1a1a2e");
  drawNet();
  drawScorePanels();
  drawRectangle(user.x, user.y, user.width, user.height, user.color);
  drawRectangle(computer.x, computer.y, computer.width, computer.height, computer.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);

  if (waitingForStart) drawStartScreen();
}

function collision(b, p) {
  return (
    b.x + b.radius > p.x &&
    b.x - b.radius < p.x + p.width &&
    b.y + b.radius > p.y &&
    b.y - b.radius < p.y + p.height
  );
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 4;
  ball.velocityY = -ball.velocityY;
  ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * 3;
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // AI tracks ball horizontally
  const aiLevel = 0.06;
  computer.x += (ball.x - (computer.x + computer.width / 2)) * aiLevel;
  computer.x = Math.max(0, Math.min(canvas.width - computer.width, computer.x));

  // Left/right wall bounce
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    ball.velocityX = -ball.velocityX;
  }

  // Scoring: ball exits top or bottom
  if (ball.y - ball.radius < 0) {
    user.score++;
    resetBall();
    return;
  }
  if (ball.y + ball.radius > canvas.height) {
    computer.score++;
    resetBall();
    return;
  }

  // Paddle collision
  const hitPlayer = collision(ball, user);
  const hitComputer = collision(ball, computer);

  if (hitPlayer || hitComputer) {
    const paddle = hitPlayer ? user : computer;
    const collidePoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    const angle = collidePoint * (Math.PI / 4);
    const dir = hitPlayer ? -1 : 1;

    ball.velocityX = ball.speed * Math.sin(angle);
    ball.velocityY = dir * ball.speed * Math.cos(angle);
    ball.speed = Math.min(ball.speed + 0.4, 14);
  }
}

function animate() {
  if (!gameRunning) return;
  update();
  render();
  animationId = requestAnimationFrame(animate);
}

// Initial render to show start screen
render();