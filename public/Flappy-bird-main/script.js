const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const topPipeImg = new Image();
topPipeImg.src = "toppipe.png";

const bottomPipeImg = new Image();
bottomPipeImg.src = "bottompipe.png";

const birdImg = new Image();
birdImg.src = "flappybird.png";

const bgImg = new Image();
bgImg.src = "flappybirdbg.png";

canvas.width = 1000;
canvas.height = 600;



// GAME VARIABLES

let score = 0;
let gameStarted = false;
let gameOver = false;



// BIRD

const bird = {
  x: 300,
  y: 250,
  width: 40,
  height: 30,

  velocity: 0,
  gravity: 0.1,
  jump: -4,

  draw() {
    ctx.save();

  // Rotate bird based on velocity
  ctx.translate(this.x, this.y);

  const rotation = this.velocity * 0.075;
  ctx.rotate(rotation);

  ctx.drawImage(
    birdImg,
    -this.width /2,
    -this.height /2,
    this.width,
    this.height
  );

  ctx.restore();
  },

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Ground collision
    if (this.y + 20 >= canvas.height) {
      this.y = canvas.height - 20;
      gameOver = true;
    }

    // Ceiling collision
    if (this.y - 20 <= 0) {
      this.y = 20;
      this.velocity = 0;
    }
  },

  flap() {
    this.velocity = this.jump;
  }
};



// PIPES

const pipes = [];

const pipeWidth = 70;
const pipeGap = 170;
const pipeSpeed = 2;

function createPipe() {
  const topHeight = Math.random() * 250 + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - pipeGap,
    scored: false
  });
}

function drawPipes() {
  pipes.forEach(pipe => {

    // Top Pipe
    ctx.drawImage(
      topPipeImg,
      pipe.x,
      0,
      pipeWidth,
      pipe.top
    );

    // Bottom Pipe
    ctx.drawImage(
      bottomPipeImg,
      pipe.x,
      canvas.height - pipe.bottom,
      pipeWidth,
      pipe.bottom
    );

  });
}

function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    // Score
    if (!pipe.scored && pipe.x + pipeWidth < bird.x) {
      score++;
      pipe.scored = true;
    }

    // Collision
    if (
      bird.x + 20 > pipe.x &&
      bird.x - 20 < pipe.x + pipeWidth &&
      (
        bird.y - 20 < pipe.top ||
        bird.y + 20 > canvas.height - pipe.bottom
      )
    ) {
      gameOver = true;
    }
  });

  // Remove pipes
  if (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }
}



// BACKGROUND

function drawBackground() {
  ctx.drawImage(
    bgImg,
    0,
    0,
    canvas.width,
    canvas.height
  );
}



// SCORE

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "100px Flappy";
  ctx.fillText(score, canvas.width / 2 - 10, 60);
}



// GAME OVER

function drawGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "90px Flappy";
  ctx.fillText("Game Over", 85, 250);

  ctx.font = "48px Flappy";
  ctx.fillText("Press SPACE to Restart", 70, 310);
}



// CONTROLS

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {

    if (gameOver) {
      restartGame();
      return;
    }

    gameStarted = true;
    bird.flap();
  }
});


// RESTART

function restartGame() {
  bird.y = 250;
  bird.velocity = 0;

  pipes.length = 0;

  score = 0;
  gameOver = false;
  gameStarted = false;
}



// GAME LOOP

function update() {
  if (!gameStarted || gameOver) return;

  bird.update();

  updatePipes();
}

function draw() {
  drawBackground();

  drawPipes();

  bird.draw();

  drawScore();

  if (!gameStarted) {
    ctx.fillStyle = "white";
    ctx.font = "30px Flappy";
    ctx.fillText("Press SPACE to Start", 55, 300);
  }

  if (gameOver) {
    drawGameOver();
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

// PIPE SPAWN
setInterval(() => {
  if (gameStarted && !gameOver) {
    createPipe();
  }
}, 800);

// Start
gameLoop();