let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

let cameraY = 0;

// images
let playImg = new Image();
let restartImg = new Image();
let pauseImg = new Image();
let resumeImg = new Image();

let doodlerRightImg;
let doodlerLeftImg;
let platformImg;

// game states
let gameStarted = false;
let gameOver = false;
let gamePaused = false;

// doodler
let doodlerWidth = 46;
let doodlerHeight = 46;

let doodlerX = boardWidth / 2 - doodlerWidth / 2;
let doodlerY = (boardHeight * 7) / 8 - doodlerHeight;

let doodler = {
  img: null,
  x: doodlerX,
  y: doodlerY,
  width: doodlerWidth,
  height: doodlerHeight,
};

// physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -14;
let gravity = 0.25;
let maxVelocityX = 4;

// platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;

// score
let score = 0;

window.onload = function () {
  board = document.getElementById('board');
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext('2d');

  // images
  doodlerRightImg = new Image();
  doodlerRightImg.src = './doodler-right.png';

  doodlerLeftImg = new Image();
  doodlerLeftImg.src = './doodler-left.png';

  platformImg = new Image();
  platformImg.src = './platform.png';

  playImg.src = './play.jpg';
  restartImg.src = './restart.jpg';
  pauseImg.src = './pause.jpg';
  resumeImg.src = './resume.jpg';

  placePlatforms();

  document.addEventListener('keydown', moveDoodler);
  document.addEventListener('click', handleClick);

  requestAnimationFrame(update);
};

// ================= UPDATE LOOP =================
function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, boardWidth, boardHeight);

  // START SCREEN
  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  // PAUSE SCREEN
  if (gamePaused) {
    drawPauseScreen();
    return;
  }

  // GAME OVER SCREEN
  if (gameOver) {
    drawGameOverScreen();
    return;
  }

  // ================= PHYSICS =================
  doodler.x += velocityX;
  velocityX *= 0.9;

  if (doodler.x > boardWidth) doodler.x = 0;
  else if (doodler.x + doodler.width < 0) doodler.x = boardWidth;

  velocityY += gravity;
  doodler.y += velocityY;

  // CAMERA FOLLOW
  let targetCameraY = doodler.y - boardHeight / 2;
  cameraY += (targetCameraY - cameraY) * 0.08;

  // GAME OVER CHECK (SAFE)
  if (doodler.y - cameraY > boardHeight) {
    gameOver = true;
  }

  // DRAW DOODLER
  context.drawImage(
    doodler.img,
    doodler.x,
    doodler.y - cameraY,
    doodler.width,
    doodler.height
  );

  // PLATFORMS + COLLISION
  for (let platform of platformArray) {
    const doodlerBottom = doodler.y + doodler.height;
    const previousBottom = doodlerBottom - velocityY;

    const horizontalOverlap =
      doodler.x + doodler.width > platform.x &&
      doodler.x < platform.x + platform.width;

    const landedOnTop =
      previousBottom <= platform.y && doodlerBottom >= platform.y;

    if (velocityY > 0 && horizontalOverlap && landedOnTop) {
      velocityY = initialVelocityY;
    }

    context.drawImage(
      platform.img,
      platform.x,
      platform.y - cameraY,
      platform.width,
      platform.height
    );
  }

  while (
    platformArray.length > 0 &&
    platformArray[0].y - cameraY > boardHeight + 100
  ) {
    platformArray.shift();
    newPlatform();
  }

  // SCORE
  score = Math.max(score, Math.floor(-doodler.y));

  context.fillStyle = 'black';
  context.font = '16px Arial';
  context.textAlign = 'left'; // Added to fix alignment issues caused by screen menus
  context.fillText('Score: ' + score, 10, 20);

  // pause icon
  context.drawImage(pauseImg, boardWidth - 40, 10, 30, 30);
}

// ================= INPUT =================
function moveDoodler(e) {
  if (!gameStarted || gameOver || gamePaused) return;

  if (e.code == 'ArrowRight' || e.code == 'KeyD') {
    velocityX = maxVelocityX;
    doodler.img = doodlerRightImg;
  } else if (e.code == 'ArrowLeft' || e.code == 'KeyA') {
    velocityX = -maxVelocityX;
    doodler.img = doodlerLeftImg;
  }
}

// ================= CLICK =================
function handleClick(e) {
  let rect = board.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  let bx = boardWidth / 2 - 60;

  // START
  if (!gameStarted) {
    if (
      x > bx &&
      x < bx + 120 &&
      y > boardHeight / 2 &&
      y < boardHeight / 2 + 50
    ) {
      startGame();
    }
    return;
  }

  // GAME OVER → restart only
  if (gameOver) {
    if (
      x > bx &&
      x < bx + 120 &&
      y > boardHeight / 2 + 20 &&
      y < boardHeight / 2 + 70
    ) {
      resetGame();
    }
    return;
  }

  // RESUME BUTTON CLICK (CENTER BUTTON FOR PAUSE SCREEN)
  if (gamePaused) {
    let rx = boardWidth / 2 - 60;
    let ry = boardHeight / 2;

    if (x > rx && x < rx + 120 && y > ry && y < ry + 50) {
      gamePaused = false;
      return; // Exit here so it doesn't immediately check the pause icon toggle below
    }
  }

  // PAUSE / UNPAUSE VIA TOP ICON
  if (x > boardWidth - 40 && x < boardWidth - 10 && y > 10 && y < 40) {
    gamePaused = !gamePaused;
    return;
  }
}

// ================= START GAME =================
function startGame() {
  gameStarted = true;
  gameOver = false;
  gamePaused = false;

  velocityX = 0;
  velocityY = initialVelocityY;
  cameraY = 0;

  // FIX: Set fallback image so canvas context.drawImage does not throw a null exception
  doodler.img = doodlerRightImg;
  doodler.x = boardWidth / 2 - doodlerWidth / 2;
  doodler.y = (boardHeight * 7) / 8 - doodlerHeight;
}

// ================= RESET GAME =================
function resetGame() {
  doodler = {
    img: doodlerRightImg,
    x: boardWidth / 2 - doodlerWidth / 2,
    y: (boardHeight * 7) / 8 - doodlerHeight,
    width: doodlerWidth,
    height: doodlerHeight,
  };

  velocityX = 0;
  velocityY = initialVelocityY;
  cameraY = 0;
  score = 0;
  gameOver = false;

  placePlatforms();
}

// ================= SCREENS =================
function drawStartScreen() {
  context.drawImage(playImg, boardWidth / 2 - 60, boardHeight / 2, 120, 50);
}

function drawGameOverScreen() {
  context.fillStyle = 'rgba(0,0,0,0.5)';
  context.fillRect(0, 0, boardWidth, boardHeight);

  context.fillStyle = 'white';
  context.textAlign = 'center';

  context.fillText('GAME OVER', boardWidth / 2, boardHeight / 2 - 40);
  context.fillText('Score: ' + score, boardWidth / 2, boardHeight / 2 - 10);

  context.drawImage(
    restartImg,
    boardWidth / 2 - 60,
    boardHeight / 2 + 20,
    120,
    50
  );
}

function drawPauseScreen() {
  context.fillStyle = 'rgba(0,0,0,0.4)';
  context.fillRect(0, 0, boardWidth, boardHeight);

  context.fillStyle = 'white';
  context.textAlign = 'center';

  context.fillText('PAUSED', boardWidth / 2, boardHeight / 2 - 40);

  // resume button
  context.drawImage(resumeImg, boardWidth / 2 - 60, boardHeight / 2, 120, 50);
}

// ================= PLATFORM =================
function placePlatforms() {
  platformArray = [];

  platformArray.push({
    img: platformImg,
    x: boardWidth / 2 - platformWidth / 2, // Centered perfectly under starting position
    y: boardHeight - 50,
    width: platformWidth,
    height: platformHeight,
  });

  for (let i = 0; i < 7; i++) {
    platformArray.push({
      img: platformImg,
      x: Math.random() * (boardWidth - platformWidth), // Keeps platforms inside game borders
      y: boardHeight - 100 * i - 150,
      width: platformWidth,
      height: platformHeight,
    });
  }
}

function newPlatform() {
  platformArray.push({
    img: platformImg,
    x: Math.random() * (boardWidth - platformWidth),
    y: cameraY - 50,
    width: platformWidth,
    height: platformHeight,
  });
}
