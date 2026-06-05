const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const livesEl = document.getElementById('lives');
const scoreEl = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');


let lives = 3;
let score = 0;
let isGameOver = false;


const player = {
    x: 0,
    y: 0,
    size: 12,
    speed: 5,
    dx: 0,
    dy: 0,
    path: [] 
};


class Obstacle {
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
    }

    update() {
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.dx *= -1;
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.dy *= -1;
        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff3366';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff3366';
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0; 
    }
}

const obstacles = [
    new Obstacle(200, 200, 15, 3, 3),
    new Obstacle(600, 300, 15, -4, 2),
    new Obstacle(400, 100, 15, 2, -4)
];


window.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    if (e.key === 'ArrowUp' || e.key === 'w') { player.dx = 0; player.dy = -player.speed; }
    if (e.key === 'ArrowDown' || e.key === 's') { player.dx = 0; player.dy = player.speed; }
    if (e.key === 'ArrowLeft' || e.key === 'a') { player.dx = -player.speed; player.dy = 0; }
    if (e.key === 'ArrowRight' || e.key === 'd') { player.dx = player.speed; player.dy = 0; }
});


function checkCollision(px, py, obs) {
    const dist = Math.hypot(px - obs.x, py - obs.y);
    return dist < obs.radius + player.size / 2;
}


function gameLoop() {
    if (isGameOver) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

 
    if (player.dx !== 0 || player.dy !== 0) {
        player.path.push({ x: player.x, y: player.y });
        score += 1; 
        scoreEl.innerText = score;
    }

    player.x += player.dx;
    player.y += player.dy;


    player.x = Math.max(0, Math.min(canvas.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height, player.y));

    // Draw Path
    if (player.path.length > 0) {
        ctx.beginPath();
        ctx.moveTo(player.path[0].x, player.path[0].y);
        for (let i = 1; i < player.path.length; i++) {
            ctx.lineTo(player.path[i].x, player.path[i].y);
        }
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Draw Player
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x - player.size/2, player.y - player.size/2, player.size, player.size);


    obstacles.forEach(obs => {
        obs.update();
        obs.draw();

        // Check collision with player
        if (checkCollision(player.x, player.y, obs)) {
            handleHit();
        }

        // Check collision with path
        for (let p of player.path) {
            if (checkCollision(p.x, p.y, obs)) {
                handleHit();
                break;
            }
        }
    });

    requestAnimationFrame(gameLoop);
}

function handleHit() {
    lives--;
    livesEl.innerText = lives;
    player.path = [];
    player.x = 0;
    player.y = 0;
    player.dx = 0;
    player.dy = 0;

    if (lives <= 0) {
        isGameOver = true;
        gameOverScreen.classList.remove('hidden');
    }
}

// Start Game
gameLoop();