import { words } from "./data/words.js";

const shootSound = new Audio("./sounds/shoot.mp3");
const hitSound = new Audio("./sounds/hit.mp3");
const destroySound = new Audio("./sounds/destroy.mp3");
const gameOverSound = new Audio("./sounds/gameover.mp3");

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const backButton = document.getElementById("backButton");
const gameOverScreen = document.getElementById("gameOverScreen");

const difficultyButtons =
  document.querySelectorAll(".difficulty");

let selectedMode = "easy";
let enemySpawnTimer = null;
let animationFrameId = null;
let onStartScreen = true;

difficultyButtons.forEach(button => {

  button.addEventListener("click", () => {

    difficultyButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    selectedMode = button.dataset.mode;

  });

});

const player = {
  x:120,
  y:canvas.height / 2,
  radius:18
};

let enemies = [];
let bullets = [];

let activeEnemy = null;

let score = 0;

let gameRunning = false;

let enemyCount = 1;
let enemySpeed = 1.2;

function clearEnemyTimer(){

  if(enemySpawnTimer !== null){

    clearInterval(enemySpawnTimer);

    enemySpawnTimer = null;
  }
}

function stopGameLoop(){

  gameRunning = false;

  if(animationFrameId !== null){

    cancelAnimationFrame(animationFrameId);

    animationFrameId = null;
  }
}

function resetGameState(){

  clearEnemyTimer();

  stopGameLoop();

  enemies = [];
  bullets = [];
  activeEnemy = null;
  score = 0;

  document
    .getElementById("score")
    .innerText = score;

  document
    .getElementById("targetWord")
    .innerText = "None";
}

function showMenu(){

  resetGameState();

  gameOverScreen.style.display = "none";
  startScreen.style.display = "flex";

  onStartScreen = true;
}

function goHome(){

  resetGameState();

  window.location.href = "../../index.html#projects";
}

startBtn.addEventListener("click", () => {

  startScreen.style.display = "none";

  onStartScreen = false;

  startGame(selectedMode);

});

backButton.addEventListener("click", () => {

  if(onStartScreen){

    goHome();

    return;
  }

  showMenu();

});

function startGame(mode){

  resetGameState();

  gameOverScreen.style.display = "none";

  startScreen.style.display = "none";

  onStartScreen = false;

  if(mode === "easy"){
    enemyCount = 1;
    enemySpeed = 1.2;
  }

  if(mode === "medium"){
    enemyCount = 2;
    enemySpeed = 1.2;
  }

  if(mode === "hard"){
    enemyCount = 3;
    enemySpeed = 1.7;
  }

  gameRunning = true;

  createEnemies();

  animationFrameId = requestAnimationFrame(gameLoop);
}

function randomWord(){

  return words[
    Math.floor(Math.random() * words.length)
  ];
}

function createEnemies(){

  clearEnemyTimer();

  enemySpawnTimer = setInterval(() => {

    if(!gameRunning) return;

    while(enemies.length < enemyCount){

      enemies.push({

        x: canvas.width + Math.random() * 300,

        y:
          100 +
          Math.random() * (canvas.height - 200),

        radius:22,

        word:randomWord(),

        typed:"",

        speed:enemySpeed,

        hit:false,
        hitTime:0
      });

    }

  },1000);
}

function drawPlayer(){

  ctx.beginPath();

  ctx.fillStyle = "#00ffee";

  ctx.arc(
    player.x,
    player.y,
    player.radius,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.shadowColor = "#00ffee";
  ctx.shadowBlur = 25;

  ctx.beginPath();

  ctx.arc(
    player.x,
    player.y,
    8,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "white";

  ctx.fill();

  ctx.shadowBlur = 0;
}

function drawEnemies(){

  enemies.forEach(enemy => {

    if(!gameRunning) return;

    enemy.x -= enemy.speed;

    ctx.beginPath();

    if(enemy.hit){
      ctx.fillStyle = "red";
    }else{
      ctx.fillStyle = "#ff7b00";
    }

    ctx.arc(
      enemy.x,
      enemy.y,
      enemy.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.font = "22px Arial";

    ctx.textAlign = "center";

    const typed =
      enemy.word.substring(0, enemy.typed.length);

    const left =
      enemy.word.substring(enemy.typed.length);

    ctx.fillStyle = "#00ff99";

    ctx.fillText(
      typed,
      enemy.x - 10,
      enemy.y - 35
    );

    ctx.fillStyle = "white";

    ctx.fillText(
      left,
      enemy.x + 15,
      enemy.y - 35
    );

    if(Date.now() - enemy.hitTime > 100){
      enemy.hit = false;
    }

    if(enemy.x < player.x + 20){
      gameOver();
    }

  });
}

function createBullet(enemy){

  shootSound.currentTime = 0;
  shootSound.play();

  bullets.push({

    x:player.x,
    y:player.y,

    enemy:enemy
  });
}

function drawBullets(){

  bullets.forEach((bullet,index) => {

    if(!bullet.enemy){

      bullets.splice(index,1);

      return;
    }

    const dx =
      bullet.enemy.x - bullet.x;

    const dy =
      bullet.enemy.y - bullet.y;

    const angle =
      Math.atan2(dy,dx);

    bullet.x += Math.cos(angle) * 18;
    bullet.y += Math.sin(angle) * 18;

    ctx.beginPath();

    ctx.fillStyle = "white";

    ctx.arc(
      bullet.x,
      bullet.y,
      4,
      0,
      Math.PI * 2
    );

    ctx.fill();

    const dist = Math.hypot(
      bullet.enemy.x - bullet.x,
      bullet.enemy.y - bullet.y
    );

    if(dist < 20){

      hitSound.currentTime = 0;
      hitSound.play();

      bullet.enemy.hit = true;
      bullet.enemy.hitTime = Date.now();

      bullets.splice(index,1);
    }

  });
}

function gameLoop(){

  if(!gameRunning) return;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  drawPlayer();

  drawEnemies();

  drawBullets();

  if(!gameRunning) return;

  animationFrameId = requestAnimationFrame(gameLoop);
}

function gameOver(){

  gameOverSound.play();

  stopGameLoop();
  clearEnemyTimer();

  onStartScreen = false;

  gameOverScreen.style.display = "flex";
}

document.addEventListener("keydown",(e) => {

  if(!gameRunning) return;

  const key = e.key.toLowerCase();

  if(key.length !== 1) return;

  if(!activeEnemy){

    for(let enemy of enemies){

      if(enemy.word[0] === key){

        activeEnemy = enemy;

        break;
      }
    }
  }

  if(!activeEnemy) return;

  const nextLetter =
    activeEnemy.word[
      activeEnemy.typed.length
    ];

  if(key === nextLetter){

    activeEnemy.typed += key;

    createBullet(activeEnemy);

    document
      .getElementById("targetWord")
      .innerText = activeEnemy.word;

    if(
      activeEnemy.typed === activeEnemy.word
    ){

      destroySound.currentTime = 0;
      destroySound.play();

      enemies = enemies.filter(enemy => {
        return enemy !== activeEnemy;
      });

      bullets = bullets.filter(bullet => {
        return bullet.enemy !== activeEnemy;
      });

      score += 10;

      document
        .getElementById("score")
        .innerText = score;

      activeEnemy = null;

      document
        .getElementById("targetWord")
        .innerText = "None";
    }

  }else{

    for(let enemy of enemies){

      if(enemy.word[0] === key){

        activeEnemy = enemy;

        break;
      }
    }
  }

});

window.addEventListener("resize",() => {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  player.y = canvas.height / 2;
});