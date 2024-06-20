const canvas = document.querySelector("#ping-pong");

const context = canvas.getContext("2d");

const startBtn = document.querySelector(".start-btn");

const pauseBtn = document.querySelector(".pause-btn");

const restartBtn = document.querySelector(".restart-btn");

let gameRunning = false;

let animationId;

//CREATE USER PADDLE
const user = {
 x: 0,
 y: canvas.height/2 - 100/2,
 width: 10,
 height: 100,
 color: "red",
 score: 0
}

//CREATE COMPUTER PADDLE
const computer = {
 x: canvas.width - 10,
 y: canvas.height/2 - 100/2,
 width: 10,
 height: 100,
 color: "black",
 score: 0
}

//CREATE THE BALL
const ball = {
 x: canvas.width / 2,
 y: canvas.height / 2,
 radius: 10,
 speed: 5,
 velocityX: 5,
 velocityY: 5,
 color: "white"
}

//CREATE THE NET
const net = {
 x: canvas.width/2 - 1,
 y: 0,
 width: 2,
 height: 10,
 color: "white"
}

restartBtn.addEventListener("click", () => {
 document.location.reload();
});

addEventListener("load", (event) => {
 render();
});

//DRAW NET FUNCTION
function drawNet() {
    const netWidth = 4; // Adjust the net width as needed
    const netSpacing = 15; // Adjust the spacing as needed

    // Draw the left half of the net
    for (let i = 0; i <= canvas.height; i += netSpacing) {
        drawRectangle(net.x, net.y + i, netWidth, net.height, net.color);
    }

    // Draw the right half of the net
    for (let i = 0; i <= canvas.height; i += netSpacing) {
        drawRectangle(net.x + net.width - netWidth, net.y + i, netWidth, net.height, net.color);
    }
}


//DRAW RECTANGLE FUNCTION
function drawRectangle(x, y, w, h, color) {
 context.fillStyle = color;
 context.fillRect(x, y, w, h);
}

//DRAW CIRCLE FUNCTION
function drawCircle(x, y, r, color) {
 context.fillStyle = color;
 context.beginPath();
 context.arc(x, y, r, 0, Math.PI * 2, false);
 context.closePath();
 context.fill();
}

//DRAW TEXT FUNCTION
function drawText(text, x, y, color) {
 context.fillStyle = color;
 context.font = "45px fantasy";
 context.fillText(text, x, y);
}

//RENDER GAME FUNCTION
// Inside the render() function
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

//CONTROL USERS PADDLE
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
 let rectangle = canvas.getBoundingClientRect();

 user.y = evt.clientY - rectangle.top - user.height/2;
}

//COLLISION DETECTION FUNCTION
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

//RESET BALL FUNCTION
function resetBall() {
 ball.x = canvas.width / 2;
 ball.y = canvas.height / 2;

 ball.speed = 5;
 ball.velocityX = -ball.velocityX;
}

//UPDATE FUNCTION
function update() {
 ball.x += ball.velocityX;
 ball.y += ball.velocityY;

 //SIMPLE AI TO CONTROL THE COMPUTER PADDLE
 let computerLevel = 0.1;
 computer.y += (ball.y - (computer.y + computer.height/2)) * computerLevel;

 if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
  ball.velocityY = -ball.velocityY;
 }

 let player = (ball.x < canvas.width/2) ? user : computer;

 if(collision(ball, player)) {
  //WHERE THE BALL HIT THE PLAYER
  let collidePoint = ball.y - (player.y + player.height/2);

  //NORMALIZATION
  collidePoint = collidePoint / (player.height/2);

  //CALCULATE THE ANGLE IN RADIAN
  let angleRad = collidePoint * Math.PI/4;

  //X DIRECTION OF THE BALL WHEN IT'S HIT
  let direction = (ball.x < canvas.width/2) ? 1 : -1;


  //CHANGE VELOCITY OF X AND Y
  ball.velocityX = direction * ball.speed * Math.cos(angleRad);

  ball.velocityY = ball.speed * Math.sin(angleRad);

  //Everytime a ball is hit by a paddle, we increase its speed
  ball.speed += 0.5;
 }
 //UPDATE THE SCORE
 if(ball.x - ball.radius < 0) {
  //THE COMPUTER GAINS 1 POINT
  computer.score++;
  resetBall();
 } else if(ball.x + ball.radius > canvas.width){
  //THE USER GAINS 1 POINT
  user.score++;
  resetBall();
 }
}

//GAME INITIALIZATION FUNCTION
function animate() {
    if(!gameRunning) {
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