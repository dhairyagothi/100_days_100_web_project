const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const levelElement = document.querySelector(".level");
const controls = document.querySelectorAll(".controls i");
const newGameButton = document.querySelector(".new-game-button");
const restartGameButton = document.querySelector(".restart-game-button");

let gameOver = false;
let foodX, foodY, bonusFoodX, bonusFoodY, powerUpX, powerUpY;
let bonusFoodVisible = false, powerUpVisible = false;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId, powerUpTimerId;
let score = 0;
let level = 1;
let gameSpeed = 300;
let obstacles = [];
let powerUpActive = false;
let powerUpDuration = 5000; // Power-up lasts for 5 seconds

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
}

const updateBonusFoodPosition = () => {
  bonusFoodX = Math.floor(Math.random() * 30) + 1;
  bonusFoodY = Math.floor(Math.random() * 30) + 1;
  bonusFoodVisible = true;
  setTimeout(() => {
    bonusFoodVisible = false;
  }, 5000);
}

const updatePowerUpPosition = () => {
  powerUpX = Math.floor(Math.random() * 30) + 1;
  powerUpY = Math.floor(Math.random() * 30) + 1;
  powerUpVisible = true;
  setTimeout(() => {
    powerUpVisible = false;
  }, 5000);
}

const activatePowerUp = () => {
  powerUpActive = true;
  setTimeout(() => {
    powerUpActive = false;
  }, powerUpDuration);
}

const updateObstacles = () => {
  obstacles = [];
  for (let i = 0; i < level; i++) {
    let obstacleX = Math.floor(Math.random() * 30) + 1;
    let obstacleY = Math.floor(Math.random() * 30) + 1;
    obstacles.push([obstacleX, obstacleY]);
  }
}

const handleGameOver = () => {
  clearInterval(setIntervalId);
  clearTimeout(powerUpTimerId);
  alert("Game Over! Press OK to replay...");
  location.reload();
}

const changeDirection = e => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  if (bonusFoodVisible) {
    html += `<div class="bonus-food" style="grid-area: ${bonusFoodY} / ${bonusFoodX}"></div>`;
  }
  if (powerUpVisible) {
    html += `<div class="power-up" style="grid-area: ${powerUpY} / ${powerUpX}"></div>`;
  }

  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodY, foodX]);
    score++;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  if (snakeX === bonusFoodX && snakeY === bonusFoodY && bonusFoodVisible) {
    score += 5;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
    bonusFoodVisible = false;
  }

  if (snakeX === powerUpX && snakeY === powerUpY && powerUpVisible) {
    activatePowerUp();
    powerUpVisible = false;
  }

  snakeX += velocityX;
  snakeY += velocityY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
      gameOver = true;
    }
  }

  for (let i = 0; i < obstacles.length; i++) {
    html += `<div class="obstacle" style="grid-area: ${obstacles[i][1]} / ${obstacles[i][0]}"></div>`;
    if (snakeX === obstacles[i][0] && snakeY === obstacles[i][1]) {
      gameOver = true;
    }
  }

  if (score !== 0 && score % 10 === 0 && score / 10 === level) {
    level++;
    levelElement.innerText = `Level: ${level}`;
    gameSpeed -= 20;
    updateObstacles();
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, gameSpeed);
  }

  playBoard.innerHTML = html;
}

const startNewGame = () => {
  gameOver = false;
  score = 0;
  level = 1;
  gameSpeed = 300;
  snakeBody = [];
  velocityX = 0;
  velocityY = 0;
  snakeX = 5;
  snakeY = 5;
  highScore = 0;
  localStorage.setItem("high-score", highScore);
  highScoreElement.innerText = `High Score: ${highScore}`;
  scoreElement.innerText = `Score: ${score}`;
  levelElement.innerText = `Level: ${level}`;
  updateFoodPosition();
  updateObstacles();
  clearInterval(setIntervalId);
  setIntervalId = setInterval(initGame, gameSpeed);
}

const restartGame = () => {
  gameOver = false;
  score = 0;
  snakeBody = [];
  velocityX = 0;
  velocityY = 0;
  snakeX = 5;
  snakeY = 5;
  scoreElement.innerText = `Score: ${score}`;
  levelElement.innerText = `Level: ${level}`;
  updateFoodPosition();
  updateObstacles();
  clearInterval(setIntervalId);
  setIntervalId = setInterval(initGame, gameSpeed);
}

newGameButton.addEventListener("click", startNewGame);
restartGameButton.addEventListener("click", restartGame);

updateFoodPosition();
updateObstacles();
setIntervalId = setInterval(initGame, gameSpeed);
document.addEventListener("keyup", changeDirection);
