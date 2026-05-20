const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const scoreDisplay = document.getElementById("score");

let playerX = 150;

let obstacleY = -300;
let obstacleX = Math.floor(Math.random() * 300);

let score = 0;
let gameOver = false;

document.addEventListener("keydown", (e) => {

    if(gameOver) return;

    if(e.key === "ArrowLeft" && playerX > 0){
        playerX -= 20;
    }

    if(e.key === "ArrowRight" && playerX < 300){
        playerX += 20;
    }

    player.style.left = playerX + "px";
});

function moveObstacle(){

    if(gameOver) return;

    obstacleY += 5;

    if(obstacleY > 600){

        obstacleY = -300;

        obstacleX = Math.floor(Math.random() * 300);

        score++;

        scoreDisplay.innerText = "Score: " + score;
    }

    obstacle.style.top = obstacleY + "px";
    obstacle.style.left = obstacleX + "px";

    checkCollision();

    requestAnimationFrame(moveObstacle);
}

function checkCollision(){

    let playerRect = player.getBoundingClientRect();

    let obstacleRect = obstacle.getBoundingClientRect();

    if(
        playerRect.left < obstacleRect.right &&
        playerRect.right > obstacleRect.left &&
        playerRect.top < obstacleRect.bottom &&
        playerRect.bottom > obstacleRect.top
    ){

        gameOver = true;

        alert("Game Over! Score: " + score);
    }
}

function restartGame(){

    location.reload();
}

moveObstacle();