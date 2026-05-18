const canvas = document.querySelector("#ping-pong");
const context = canvas.getContext("2d");

const startBtn = document.querySelector(".start-btn");
const pauseBtn = document.querySelector(".pause-btn");
const restartBtn = document.querySelector(".restart-btn");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const winnerText = document.getElementById("winnerText");
const playAgainBtn = document.querySelector(".play-again-btn");

let gameRunning = false;
let animationId;
let currentDifficulty = "medium";
const winningScore = 5;
let gameOver = false;

// Difficulty settings
const difficultySettings = {
  easy: { ballSpeed: 4, computerLevel: 0.05 },
  medium: { ballSpeed: 6, computerLevel: 0.1 },
  hard: { ballSpeed: 9, computerLevel: 0.15 }
};

// CREATE USER PADDLE
const user = {
  x: 0,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "red",
  score: 0
};

// CREATE COMPUTER PADDLE
const computer = {
  x: canvas.width - 10,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "black",
  score: 0
};

// CREATE THE BALL
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: difficultySettings[currentDifficulty].ballSpeed,
  velocityX: difficultySettings[currentDifficulty].ballSpeed,
  velocityY: difficultySettings[currentDifficulty].ballSpeed,
  color: "white"
};

// CREATE THE NET
const net = {
  x: canvas.width / 2 - 1,
  y: 0,
  width: 2,
  height: 10,
  color: "white"
};

restartBtn.addEventListener("click", () => {
  document.location.reload();
});

// Difficulty button event listeners
difficultyBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (gameRunning) return; // Don't allow changing difficulty during game
    
    // Remove selected class from all buttons
    difficultyBtns.forEach(b => b.classList.remove("selected"));
    
    // Add selected class to clicked button
    btn.classList.add("selected");
    
    // Set current difficulty
    currentDifficulty = btn.dataset.difficulty;
    
    // Reset ball speed based on difficulty
    ball.speed = difficultySettings[currentDifficulty].ballSpeed;
    ball.velocityX = difficultySettings[currentDifficulty].ballSpeed;
    ball.velocityY = difficultySettings[currentDifficulty].ballSpeed;
  });
});

// Play again button event listener
playAgainBtn.addEventListener("click", () => {
  resetGame();
});

// Set medium as default selected difficulty
document.querySelector(".difficulty-btn.medium").classList.add("selected");

window.addEventListener("load", () => {
  render();
});

// DRAW NET FUNCTION
function drawNet() {
  const netWidth = 4;
  const netSpacing = 15;

  for (let i = 0; i <= canvas.height; i += netSpacing) {
    drawRectangle(net.x - netWidth / 2, net.y + i, netWidth, net.height, net.color);
  }
}

// DRAW RECTANGLE FUNCTION
function drawRectangle(x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

// DRAW CIRCLE FUNCTION
function drawCircle(x, y, r, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}

// DRAW TEXT FUNCTION
function drawText(text, x, y, color) {
  context.fillStyle = color;
  context.font = "45px fantasy";
  context.fillText(text, x, y);
}

// RENDER GAME FUNCTION
function render() {
  // CLEAR THE CANVAS
  drawRectangle(0, 0, canvas.width, canvas.height, "green");

  // DRAW THE NET
  drawNet();

  // DRAW THE SCORE
  drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
  drawText(computer.score, (3 * canvas.width) / 4, canvas.height / 5, "white");

  // DRAW THE USER AND COMPUTER PADDLES
  drawRectangle(user.x, user.y, user.width, user.height, user.color);
  drawRectangle(computer.x, computer.y, computer.width, computer.height, computer.color);

  // DRAW THE BALL
  drawCircle(ball.x, ball.y, ball.radius, ball.color);

  // DRAW THE WHITE LINE IN THE MIDDLE
  drawRectangle(net.x, net.y, net.width, canvas.height, net.color);
}

// CONTROL USERS PADDLE
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
  let rectangle = canvas.getBoundingClientRect();
  user.y = evt.clientY - rectangle.top - user.height / 2;
}

// COLLISION DETECTION FUNCTION
function collision(b, p) {
  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// RESET BALL FUNCTION
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = difficultySettings[currentDifficulty].ballSpeed;
  ball.velocityX = -ball.velocityX;
}

// RESET GAME FUNCTION
function resetGame() {
  user.score = 0;
  computer.score = 0;
  gameOver = false;
  gameRunning = false;
  
  // Reset ball
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = difficultySettings[currentDifficulty].ballSpeed;
  ball.velocityX = difficultySettings[currentDifficulty].ballSpeed;
  ball.velocityY = difficultySettings[currentDifficulty].ballSpeed;
  
  // Hide game over overlay
  gameOverOverlay.classList.remove("show");
  
  // Render initial state
  render();
}

// UPDATE FUNCTION
function update() {
  if (gameOver) return; // Don't update if game is over
  
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // SIMPLE AI TO CONTROL THE COMPUTER PADDLE
  let computerLevel = difficultySettings[currentDifficulty].computerLevel;
  computer.y += (ball.y - (computer.y + computer.height / 2)) * computerLevel;

  // BALL COLLISION WITH TOP AND BOTTOM BORDERS
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  // PADDLE COLLISION
  let player = (ball.x < canvas.width / 2) ? user : computer;

  if (collision(ball, player)) {
    // WHERE THE BALL HIT THE PLAYER
    let collidePoint = ball.y - (player.y + player.height / 2);

    // NORMALIZATION
    collidePoint = collidePoint / (player.height / 2);

    // CALCULATE THE ANGLE IN RADIAN
    let angleRad = collidePoint * Math.PI / 4;

    // X DIRECTION OF THE BALL WHEN IT'S HIT
    let direction = (ball.x < canvas.width / 2) ? 1 : -1;

    // CHANGE VELOCITY OF X AND Y
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    // Every time a ball is hit by a paddle, we increase its speed
    ball.speed += 0.5;
  }

  // UPDATE THE SCORE
  if (ball.x - ball.radius < 0) {
    // THE COMPUTER GAINS 1 POINT
    computer.score++;
    resetBall();
    checkWinner();
  } else if (ball.x + ball.radius > canvas.width) {
    // THE USER GAINS 1 POINT
    user.score++;
    resetBall();
    checkWinner();
  }
}

// CHECK WINNER FUNCTION
function checkWinner() {
  if (user.score >= winningScore) {
    gameOver = true;
    gameRunning = false;
    winnerText.textContent = "You Win!";
    winnerText.style.color = "#27ae60";
    gameOverOverlay.classList.add("show");
  } else if (computer.score >= winningScore) {
    gameOver = true;
    gameRunning = false;
    winnerText.textContent = "Computer Wins!";
    winnerText.style.color = "#e74c3c";
    gameOverOverlay.classList.add("show");
  }
}

// GAME INITIALIZATION FUNCTION
function animate() {
  if (!gameRunning) {
    return; // Don't continue the animation if it's paused
  }

  update();
  render();
  animationId = requestAnimationFrame(animate);
}

startBtn.addEventListener("click", () => {
  if (!gameRunning) {
    gameRunning = true;
    animate();
  }
});

pauseBtn.addEventListener("click", () => {
  gameRunning = false;
  cancelAnimationFrame(animationId);
});
