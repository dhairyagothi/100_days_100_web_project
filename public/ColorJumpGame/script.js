const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const finalScoreEl = document.getElementById('finalScore');

// Resize canvas to match display size
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game Variables
let animationId;
let frames = 0;
let score = 0;
let highScore = localStorage.getItem('colorJumpHighScore') || 0;
let isGameRunning = false;

highScoreEl.innerText = highScore;

// Colors
const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

// Player Object
const player = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.6,
    jumpStrength: -10,
    color: '#fff',
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 5);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
    },
    
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        // Floor collision
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            gameOver();
        }
        
        // Ceiling collision
        if (this.y <= 0) {
            this.y = 0;
            this.velocity = 0;
        }
        
        this.draw();
    },
    
    jump() {
        this.velocity = this.jumpStrength;
    }
};

// Obstacles Array
let obstacles = [];

class Obstacle {
    constructor() {
        this.width = 40;
        this.height = Math.random() * (canvas.height / 2) + 50;
        this.x = canvas.width;
        
        // Randomly decide if it's a top or bottom obstacle
        this.isTop = Math.random() > 0.5;
        this.y = this.isTop ? 0 : canvas.height - this.height;
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speed = 4 + (score * 0.1); // Increases speed as score goes up
        this.passed = false;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    update() {
        this.x -= this.speed;
        this.draw();
    }
}

// Controls
function handleInput(e) {
    if (e.type === 'keydown' && e.code !== 'Space') return;
    if (isGameRunning) {
        player.jump();
    } else if (gameOverScreen.classList.contains('active')) {
        // Prevent accidental restart on multi-tap
    }
}

window.addEventListener('keydown', handleInput);
window.addEventListener('touchstart', handleInput);
window.addEventListener('mousedown', handleInput);

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function init() {
    player.y = canvas.height / 2;
    player.velocity = 0;
    obstacles = [];
    score = 0;
    frames = 0;
    scoreEl.innerText = score;
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
}

function startGame() {
    if (isGameRunning) return;
    init();
    isGameRunning = true;
    animate();
}

function gameOver() {
    isGameRunning = false;
    cancelAnimationFrame(animationId);
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('colorJumpHighScore', highScore);
        highScoreEl.innerText = highScore;
    }
    
    finalScoreEl.innerText = score;
    gameOverScreen.classList.add('active');
}

function checkCollision(obs) {
    if (
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y
    ) {
        return true;
    }
    return false;
}

function animate() {
    if (!isGameRunning) return;
    
    animationId = requestAnimationFrame(animate);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background Particles / Trail could be added here
    
    player.update();
    
    // Handle Obstacles
    if (frames % 90 === 0) { // Spawn rate
        obstacles.push(new Obstacle());
    }
    
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.update();
        
        // Collision logic
        if (checkCollision(obs)) {
            gameOver();
        }
        
        // Score logic
        if (obs.x + obs.width < player.x && !obs.passed) {
            score++;
            scoreEl.innerText = score;
            obs.passed = true;
        }
        
        // Remove off-screen obstacles
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
        }
    }
    
    frames++;
}

// Initial Draw
player.draw();
