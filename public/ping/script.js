const canvas = document.querySelector("#ping-pong");
const context = canvas.getContext("2d");

const startBtn = document.querySelector(".start-btn");
const pauseBtn = document.querySelector(".pause-btn");
const restartBtn = document.querySelector(".restart-btn");
const newBtn = document.querySelector(".new-btn");

let userscore = document.querySelector("#user-score");
let computerscore = document.querySelector("#computer-score");

let result =document.querySelector(".result");
let msg =document.querySelector("#msg");

let gameRunning = false;
let animationId;
const easy =5;
const medium =9;
const hard=13;

// CREATE USER PADDLE
const user = {
  x: 10,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "#4da6ff",
  score: 1
};

// CREATE COMPUTER PADDLE
const computer = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 100 / 2,
  width: 10,
  height: 100,
  color: "red",
  score: 1
};

// CREATE THE BALL
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
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

window.addEventListener("load", () => {
  render();
});

newBtn.addEventListener("click",() => {
  document.location.reload();
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

// SET DIFFICULTY FUNCTION 
function setDifficulty(level){
    
    if(level === "easy"){
        ball.speed =easy;
        ball.velocityX =easy;
        ball.velocityY =easy;
        
    }

    else if(level === "medium"){
        ball.speed = medium;
        ball.velocityX =medium;
        ball.velocityY =medium;
    }

    else if(level === "hard"){
        ball.speed =hard;
        ball.velocityX =hard;
        ball.velocityY =hard;
    }
}

// RENDER GAME FUNCTION
function render() {
  // CLEAR THE CANVAS
  drawRectangle(0, 0, canvas.width, canvas.height, "#040016");

  // DRAW THE NET
  drawNet();

  // DRAW THE SCORE
  

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
  ball.speed = 9 ;
  ball.velocityX = 9;
  ball.velocityY = 9;
}

// UPDATE FUNCTION
function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // SIMPLE AI TO CONTROL THE COMPUTER PADDLE
  let computerLevel = 0.1;
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
    computerscore.innerText= computer.score++ ;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    // THE USER GAINS 1 POINT
    userscore.innerText= user.score++;
    resetBall();
  }
  checkWinner();
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

// CHECK THE WINNER 
function checkWinner() {
  if (computer.score >=6 || user.score >= 6){
    if(computer.score >=6 && user.score < 6){
      console.log("computer is winner");
      showWinner("computer");
    }
    else if(computer.score <6 && user.score >= 6 ){
      console.log("user is the winner");
      showWinner("user");
    }
    else {
      console.log("draw");
      showdraw(); 
    }
    gameRunning = false;
    cancelAnimationFrame(animationId);
  }
}

//SHOW THE WINNER
function showWinner(winner){
  result.classList.add("open");
  if(winner==="user"){
  msg1.innerText=`Congratulations !!!! `;
  msg.innerText=`YOU ARE THE WINNER .\n🥳 🥳 🥳 🥳  `;
  }
  else{
    msg1.innerText=`YOU LOSE `;
    msg.innerText=`COMPUTER IS THE WINNER .\n 😔😔😔😔`;
  }
}
// SHOW THERE IS A DRAW
function showdraw(){
  result.classList.add("open");
  msg1.innerText=` The MATCH is a DRAW. `;
  msg.innerText=` 🤝  🤝  🤝  🤝 `
}