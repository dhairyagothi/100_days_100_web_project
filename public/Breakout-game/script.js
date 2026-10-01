// ============================================
// BREAKOUT GAME - ULTIMATE EDITION
// ============================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// ============================================
// CANVAS SETUP
// ============================================

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// ============================================
// AUDIO SYSTEM
// ============================================

let soundEnabled = localStorage.getItem("soundEnabled") !== "false";

function playSound(type) {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const now = audioContext.currentTime;
    
    switch (type) {
        case "paddle":
            oscillator.frequency.setValueAtTime(800, now);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;
        case "brick":
            oscillator.frequency.setValueAtTime(600, now);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscillator.start(now);
            oscillator.stop(now + 0.15);
            break;
        case "powerup":
            oscillator.frequency.setValueAtTime(1200, now);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;
        case "gameover":
            oscillator.frequency.setValueAtTime(300, now);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            break;
    }
}

// ============================================
// GAME STATE
// ============================================

let gameState = {
    running: false,
    paused: false,
    score: 0,
    highScore: parseInt(localStorage.getItem("highScore")) || 0,
    lives: 3,
    maxLives: 3,
    level: 1,
    difficulty: "medium",
    bricksDestroyed: 0,
    totalScore: 0,
};

let achievementState = {
    firstBreak: false,
    tenBricks: false,
    speedDemon: false,
    collector: false,
    noMiss: false,
    skillMaster: false,
};

const difficultySettings = {
    easy: {
        ballSpeed: 2.5,
        paddleSpeed: 7,
        brickRows: 3,
        brickCols: 8,
        powerupChance: 0.2,
    },
    medium: {
        ballSpeed: 4,
        paddleSpeed: 8,
        brickRows: 4,
        brickCols: 9,
        powerupChance: 0.12,
    },
    hard: {
        ballSpeed: 5.5,
        paddleSpeed: 9,
        brickRows: 5,
        brickCols: 10,
        powerupChance: 0.08,
    },
    extreme: {
        ballSpeed: 7,
        paddleSpeed: 10,
        brickRows: 6,
        brickCols: 11,
        powerupChance: 0.05,
    },
};

// ============================================
// GAME OBJECTS
// ============================================

const ball = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    size: 7,
    speed: 4,
    dx: 0,
    dy: 0,
};

const paddle = {
    x: CANVAS_WIDTH / 2 - 40,
    y: CANVAS_HEIGHT - 25,
    w: 80,
    h: 14,
    speed: 8,
    dx: 0,
};

let balls = [{ ...ball }];
let bricks = [];
let powerups = [];
let particles = [];
let activePowerups = {};

const powerupTypes = {
    biggerPaddle: { symbol: "🔹", name: "Bigger Paddle", duration: 8000, color: "#FFD700" },
    slowBall: { symbol: "🌀", name: "Slow Ball", duration: 6000, color: "#87CEEB" },
    multiBall: { symbol: "⚽", name: "Multi-Ball", duration: 0, color: "#FF6B6B" },
    extraLife: { symbol: "❤️", name: "Extra Life", duration: 0, color: "#FF1493" },
};

class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.w = 35;
        this.h = 35;
        this.speed = 2;
        this.collected = false;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        const typeInfo = powerupTypes[this.type];
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(typeInfo.symbol, this.x, this.y);
        
        ctx.strokeStyle = typeInfo.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    }

    isCollectedBy(paddle) {
        return this.x > paddle.x && this.x < paddle.x + paddle.w &&
               this.y > paddle.y && this.y < paddle.y + paddle.h;
    }
}

// ============================================
// BRICK INITIALIZATION
// ============================================

function initializeBricks() {
    bricks = [];
    const settings = difficultySettings[gameState.difficulty];
    const brickRows = settings.brickRows;
    const brickCols = settings.brickCols;
    
    // Calculate brick dimensions to fill the width
    const totalPadding = 8;
    const brickWidth = (CANVAS_WIDTH - totalPadding) / brickCols;
    const brickHeight = 18;
    const topOffset = 20;
    const verticalGap = 8;

    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
                    "#F7DC6F", "#BB8FCE", "#85C1E2", "#F8B88B", "#A9DFBF"];

    for (let row = 0; row < brickRows; row++) {
        bricks[row] = [];
        for (let col = 0; col < brickCols; col++) {
            const x = col * brickWidth + totalPadding / 2;
            const y = topOffset + row * (brickHeight + verticalGap);
            bricks[row][col] = {
                x, y,
                w: brickWidth - 1,
                h: brickHeight,
                visible: true,
                color: colors[row % colors.length],
                durability: 1,
            };
        }
    }
}

// ============================================
// DRAWING FUNCTIONS
// ============================================

function drawBall(ballObj) {
    ctx.beginPath();
    ctx.arc(ballObj.x, ballObj.y, ballObj.size, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 7);
    ctx.fillStyle = "#10b981";
    ctx.fill();
    ctx.strokeStyle = "#06b6d4";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawBricks() {
    bricks.forEach(row => {
        row.forEach(brick => {
            if (brick.visible) {
                ctx.fillStyle = brick.color;
                ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
                ctx.lineWidth = 1;
                ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);
                
                if (brick.durability > 1) {
                    ctx.fillStyle = "white";
                    ctx.font = "bold 12px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(brick.durability, brick.x + brick.w / 2, brick.y + brick.h / 2);
                }
            }
        });
    });
}

function drawPowerups() {
    powerups.forEach(p => p.draw());
}

function drawParticles() {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });
}

function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    drawBricks();
    drawPowerups();
    balls.forEach(drawBall);
    drawPaddle();
    drawParticles();
}

// ============================================
// MOVEMENT & PHYSICS
// ============================================

function movePaddle() {
    paddle.x += paddle.dx;
    paddle.x = Math.max(0, Math.min(CANVAS_WIDTH - paddle.w, paddle.x));
}

function moveBall(ballObj) {
    ballObj.x += ballObj.dx;
    ballObj.y += ballObj.dy;

    // Walls
    if (ballObj.x + ballObj.size > CANVAS_WIDTH || ballObj.x - ballObj.size < 0) {
        ballObj.dx *= -1;
        ballObj.x = Math.max(ballObj.size, Math.min(CANVAS_WIDTH - ballObj.size, ballObj.x));
    }

    if (ballObj.y - ballObj.size < 0) {
        ballObj.dy *= -1;
        ballObj.y = ballObj.size;
    }

    // Paddle collision
    if (ballObj.x > paddle.x && ballObj.x < paddle.x + paddle.w &&
        ballObj.y + ballObj.size > paddle.y && ballObj.y < paddle.y + paddle.h) {
        const hitPos = (ballObj.x - paddle.x) / paddle.w;
        const angle = (hitPos - 0.5) * (Math.PI / 3);
        const speed = Math.sqrt(ballObj.dx ** 2 + ballObj.dy ** 2);
        
        ballObj.dx = Math.sin(angle) * speed;
        ballObj.dy = -Math.abs(Math.cos(angle) * speed);
        ballObj.y = paddle.y - ballObj.size;
        
        playSound("paddle");
    }

    // Brick collisions
    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < bricks[i].length; j++) {
            if (bricks[i][j].visible && checkBrickCollision(ballObj, bricks[i][j])) {
                handleBrickCollision(ballObj, bricks[i][j]);
            }
        }
    }

    return ballObj.y - ballObj.size <= CANVAS_HEIGHT;
}

function checkBrickCollision(ball, brick) {
    return ball.x > brick.x && ball.x < brick.x + brick.w &&
           ball.y > brick.y && ball.y < brick.y + brick.h;
}

function handleBrickCollision(ballObj, brick) {
    const overlapLeft = ballObj.x + ballObj.size - brick.x;
    const overlapRight = brick.x + brick.w - (ballObj.x - ballObj.size);
    const overlapTop = ballObj.y + ballObj.size - brick.y;
    const overlapBottom = brick.y + brick.h - (ballObj.y - ballObj.size);

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (minOverlap === overlapTop || minOverlap === overlapBottom) {
        ballObj.dy *= -1;
    } else {
        ballObj.dx *= -1;
    }

    brick.durability--;
    if (brick.durability <= 0) {
        brick.visible = false;
        gameState.bricksDestroyed++;
        increaseScore(10);
        createBrickParticles(brick);
        checkAchievements();
        
        if (Math.random() < difficultySettings[gameState.difficulty].powerupChance) {
            const types = Object.keys(powerupTypes);
            const randomType = types[Math.floor(Math.random() * types.length)];
            powerups.push(new Powerup(brick.x + brick.w / 2, brick.y + brick.h / 2, randomType));
        }
    }

    playSound("brick");
}

function createBrickParticles(brick) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: brick.x + brick.w / 2,
            y: brick.y + brick.h / 2,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            color: brick.color,
            size: Math.random() * 4 + 2,
            life: 60,
            maxLife: 60,
        });
    }
}

function updateParticles() {
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life--;
    });
}

// ============================================
// POWER-UPS
// ============================================

function activatePowerup(type) {
    const typeInfo = powerupTypes[type];

    switch (type) {
        case "biggerPaddle":
            if (!activePowerups[type]) {
                paddle.w = 140;
                activePowerups[type] = true;
                updatePowerupDisplay();
                if (typeInfo.duration > 0) {
                    setTimeout(() => {
                        paddle.w = 80;
                        delete activePowerups[type];
                        updatePowerupDisplay();
                    }, typeInfo.duration);
                }
            }
            playSound("powerup");
            break;

        case "slowBall":
            if (!activePowerups[type]) {
                balls.forEach(b => {
                    b.dx *= 0.6;
                    b.dy *= 0.6;
                });
                activePowerups[type] = true;
                updatePowerupDisplay();
                setTimeout(() => {
                    balls.forEach(b => {
                        b.dx /= 0.6;
                        b.dy /= 0.6;
                    });
                    delete activePowerups[type];
                    updatePowerupDisplay();
                }, typeInfo.duration);
            }
            playSound("powerup");
            break;

        case "multiBall":
            if (balls.length < 5) {
                const newBall = { ...balls[0] };
                newBall.dx *= (Math.random() > 0.5 ? 1.1 : 0.9);
                balls.push(newBall);
                createParticleExplosion(balls[0].x, balls[0].y, "#FF6B6B");
            }
            playSound("powerup");
            break;

        case "extraLife":
            if (gameState.lives < gameState.maxLives) {
                gameState.lives++;
                updateLivesDisplay();
                createParticleExplosion(paddle.x + paddle.w / 2, paddle.y, "#FF1493");
            }
            playSound("powerup");
            break;
    }
}

function createParticleExplosion(x, y, color) {
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        particles.push({
            x, y,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            color,
            size: 4,
            life: 40,
            maxLife: 40,
        });
    }
}

function updatePowerupDisplay() {
    const display = document.getElementById("powerups-display");
    const icons = document.getElementById("powerup-icons");
    
    if (Object.keys(activePowerups).length > 0) {
        display.classList.remove("hidden");
        icons.innerHTML = "";
        Object.keys(activePowerups).forEach(type => {
            const typeInfo = powerupTypes[type];
            const item = document.createElement("div");
            item.className = "powerup-item";
            item.innerHTML = `${typeInfo.symbol} ${typeInfo.name}`;
            icons.appendChild(item);
        });
    } else {
        display.classList.add("hidden");
    }
}

// ============================================
// SCORING & STATE
// ============================================

function increaseScore(points = 10) {
    gameState.score += points;
    gameState.totalScore += points;
    document.getElementById("current-score").textContent = gameState.score;
}

function updateLivesDisplay() {
    let heartsText = "";
    for (let i = 0; i < gameState.lives; i++) heartsText += "❤️ ";
    document.getElementById("lives-display").textContent = heartsText;
}

function checkWin() {
    return bricks.every(row => row.every(brick => !brick.visible));
}

function checkAchievements() {
    if (gameState.bricksDestroyed === 1 && !achievementState.firstBreak) {
        achievementState.firstBreak = true;
        showToast("🎉 Achievement: First Break!");
    }
    if (gameState.bricksDestroyed === 10 && !achievementState.tenBricks) {
        achievementState.tenBricks = true;
        showToast("🏆 Achievement: Brick Buster!");
    }
    if (gameState.difficulty === "hard" && !achievementState.skillMaster) {
        achievementState.skillMaster = true;
        showToast("🌟 Achievement: Skill Master!");
    }
}

// ============================================
// CONTROLS
// ============================================

function keyDown(e) {
    if (e.key === "Right" || e.key === "ArrowRight") paddle.dx = paddle.speed;
    else if (e.key === "Left" || e.key === "ArrowLeft") paddle.dx = -paddle.speed;
    else if (e.key === "p" || e.key === "P") togglePause();
    else if (e.key === "Enter") {
        const rulesContainer = document.getElementById("rules-container");
        if (rulesContainer && rulesContainer.classList.contains("hidden") && !gameState.running) {
            document.getElementById("play-nav-btn")?.click();
        }
    }
}

function keyUp(e) {
    if (["Right", "ArrowRight", "Left", "ArrowLeft"].includes(e.key)) {
        paddle.dx = 0;
    }
}

canvas.addEventListener("mousemove", (e) => {
    if (!gameState.running || gameState.paused) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    paddle.x = Math.max(0, Math.min(CANVAS_WIDTH - paddle.w, mouseX - paddle.w / 2));
});

canvas.addEventListener("touchmove", (e) => {
    if (!gameState.running || gameState.paused) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const touchX = (e.touches[0].clientX - rect.left) * scaleX;
    paddle.x = Math.max(0, Math.min(CANVAS_WIDTH - paddle.w, touchX - paddle.w / 2));
}, { passive: false });

// ============================================
// PAUSE
// ============================================

function togglePause() {
    if (!gameState.running) return;
    gameState.paused = !gameState.paused;
    document.getElementById("pause-container").classList.toggle("hidden");
}

document.getElementById("resume-btn").addEventListener("click", () => {
    gameState.paused = false;
    document.getElementById("pause-container").classList.add("hidden");
    update();
});

document.getElementById("pause-restart-btn").addEventListener("click", () => {
    gameState.paused = false;
    gameState.running = false;
    document.getElementById("pause-container").classList.add("hidden");
    startGame();
});

document.getElementById("pause-btn").addEventListener("click", togglePause);

// ============================================
// GAME LOOP
// ============================================

function update() {
    if (!gameState.running || gameState.paused) return;

    movePaddle();
    
    powerups = powerups.filter(p => p.y < CANVAS_HEIGHT);
    powerups.forEach(p => {
        p.update();
        if (p.isCollectedBy(paddle)) {
            activatePowerup(p.type);
            p.collected = true;
        }
    });
    powerups = powerups.filter(p => !p.collected);

    const activeBalls = [];
    balls.forEach(ballObj => {
        if (moveBall(ballObj)) {
            activeBalls.push(ballObj);
        }
    });

    if (activeBalls.length === 0) {
        gameState.lives--;
        updateLivesDisplay();
        
        if (gameState.lives <= 0) {
            showGameOver();
            return;
        } else {
            resetBallsAndPaddle();
        }
    } else {
        balls = activeBalls;
    }

    if (checkWin()) {
        showWin();
        return;
    }

    updateParticles();
    draw();
    requestAnimationFrame(update);
}

function resetBallsAndPaddle() {
    const settings = difficultySettings[gameState.difficulty];
    balls = [{
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        size: 7,
        speed: settings.ballSpeed,
        dx: settings.ballSpeed,
        dy: -settings.ballSpeed,
    }];
    paddle.x = CANVAS_WIDTH / 2 - 40;
    paddle.dx = 0;
    powerups = [];
    activePowerups = {};
    updatePowerupDisplay();
}

// ============================================
// GAME LIFECYCLE
// ============================================

function startGame() {
    const settings = difficultySettings[gameState.difficulty];
    
    document.getElementById("rules-container").classList.add("hidden");
    document.getElementById("game-over-container").classList.add("hidden");
    document.getElementById("play-nav-btn").classList.add("hidden");
    
    gameState.score = 0;
    gameState.lives = gameState.maxLives;
    gameState.level = 1;
    gameState.bricksDestroyed = 0;
    
    const savedSensitivity = localStorage.getItem("breakoutSensitivity");
    paddle.speed = savedSensitivity ? parseInt(savedSensitivity) : settings.paddleSpeed;
    ball.speed = settings.ballSpeed;
    
    initializeBricks();
    resetBallsAndPaddle();
    
    document.getElementById("current-score").textContent = "0";
    document.getElementById("level").textContent = "1";
    updateLivesDisplay();
    document.getElementById("high-score-display").textContent = gameState.highScore;
    
    draw();
    startCountdown();
}

function showWin() {
    gameState.running = false;
    gameState.level++;
    document.getElementById("game-over-container").classList.remove("hidden");
    document.getElementById("game-over-title").textContent = "🎉 Level Complete!";
    document.getElementById("final-score").textContent = gameState.score;
    document.getElementById("final-high-score").textContent = gameState.highScore;
    document.getElementById("pause-btn").classList.add("hidden");
    document.getElementById("play-nav-btn").classList.remove("hidden");
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem("highScore", gameState.highScore);
    }
}

function showGameOver() {
    gameState.running = false;
    playSound("gameover");
    document.getElementById("game-over-container").classList.remove("hidden");
    document.getElementById("game-over-title").textContent = "Game Over";
    document.getElementById("final-score").textContent = gameState.score;
    document.getElementById("pause-btn").classList.add("hidden");
    document.getElementById("play-nav-btn").classList.remove("hidden");
    
    let newHighScore = false;
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem("highScore", gameState.highScore);
        newHighScore = true;
    }
    document.getElementById("final-high-score").textContent = gameState.highScore;
    
    // Show achievements
    const achievementsList = [];
    if (achievementState.firstBreak) achievementsList.push({ icon: "🎮", name: "First Break", desc: "Break your first brick" });
    if (achievementState.tenBricks) achievementsList.push({ icon: "🏆", name: "Brick Buster", desc: "Break 10 bricks" });
    if (newHighScore) achievementsList.push({ icon: "🌟", name: "New Record", desc: "Achieve a new high score" });
    
    if (achievementsList.length > 0) {
        const ach = document.getElementById("achievements-earned");
        const list = document.getElementById("achievements-list");
        list.innerHTML = achievementsList.map(a => 
            `<div class="achievement-item"><div class="achievement-icon">${a.icon}</div><div class="achievement-text"><div class="achievement-name">${a.name}</div><div>${a.desc}</div></div></div>`
        ).join("");
        ach.classList.remove("hidden");
    }
}

function startCountdown() {
    const countdownEl = document.getElementById("countdown");
    countdownEl.classList.remove("hidden");
    let count = 3;
    countdownEl.textContent = count;
    
    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
        } else if (count === 0) {
            countdownEl.textContent = "GO!";
        } else {
            clearInterval(timer);
            countdownEl.classList.add("hidden");
            gameState.running = true;
            gameState.paused = false;
            document.getElementById("pause-btn").classList.remove("hidden");
            update();
        }
    }, 1000);
}

// ============================================
// THEME & SOUND CONTROLS
// ============================================

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    const themeBtn = document.getElementById("theme-btn");
    if (themeBtn) {
        themeBtn.textContent = newTheme === "dark" ? "🌙 Theme" : "☀️ Theme";
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem("soundEnabled", soundEnabled);
    document.getElementById("sound-btn").textContent = soundEnabled ? "🔊 Sound" : "🔇 Muted";
}

document.getElementById("theme-btn").addEventListener("click", toggleTheme);
document.getElementById("sound-btn").addEventListener("click", toggleSound);

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";
document.body.setAttribute("data-theme", savedTheme);
const themeBtn = document.getElementById("theme-btn");
if (themeBtn) {
    themeBtn.textContent = savedTheme === "dark" ? "🌙 Theme" : "☀️ Theme";
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function syncPaddleSpeed(speedVal) {
    paddle.speed = speedVal;
    
    const sensitivitySlider = document.getElementById("sensitivity");
    const sensitivityValue = document.getElementById("sensitivity-value");
    const rulesSensitivitySlider = document.getElementById("rules-sensitivity-input");
    const rulesSensitivityValue = document.getElementById("rules-sensitivity-value");
    
    if (sensitivitySlider) {
        sensitivitySlider.value = speedVal;
    }
    if (sensitivityValue) {
        sensitivityValue.textContent = speedVal;
    }
    if (rulesSensitivitySlider) {
        rulesSensitivitySlider.value = speedVal;
    }
    if (rulesSensitivityValue) {
        rulesSensitivityValue.textContent = speedVal;
    }
    try {
        localStorage.setItem("breakoutSensitivity", speedVal);
    } catch (_) {}
}

document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".difficulty-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        gameState.difficulty = btn.dataset.difficulty;
        
        // Update sensitivity sliders based on new difficulty default speed
        const settings = difficultySettings[gameState.difficulty];
        syncPaddleSpeed(settings.paddleSpeed);
    });
});

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("restart-btn").addEventListener("click", startGame);
document.getElementById("home-btn").addEventListener("click", () => window.location.href = "/");

document.querySelector(".close-btn")?.addEventListener("click", () => {
    document.getElementById("rules-container").classList.add("hidden");
});

window.addEventListener("load", () => {
    document.getElementById("high-score-display").textContent = gameState.highScore;
    document.getElementById("sound-btn").textContent = soundEnabled ? "🔊 Sound" : "🔇 Muted";
    document.getElementById("rules-container").classList.remove("hidden");
    
    // Initialize Paddle Speed Sliders
    const savedSensitivity = localStorage.getItem("breakoutSensitivity");
    if (savedSensitivity) {
        syncPaddleSpeed(parseInt(savedSensitivity));
    } else {
        const settings = difficultySettings[gameState.difficulty];
        syncPaddleSpeed(settings.paddleSpeed);
    }

    const sensitivitySlider = document.getElementById("sensitivity");
    const rulesSensitivitySlider = document.getElementById("rules-sensitivity-input");

    if (sensitivitySlider) {
        sensitivitySlider.addEventListener("input", (e) => {
            syncPaddleSpeed(parseInt(e.target.value));
        });
    }

    if (rulesSensitivitySlider) {
        rulesSensitivitySlider.addEventListener("input", (e) => {
            syncPaddleSpeed(parseInt(e.target.value));
        });
    }

    // Toggle Settings Dropdown Menu
    const settingsToggleBtn = document.getElementById("settings-toggle-btn");
    const settingsMenu = document.getElementById("settings-menu");
    if (settingsToggleBtn && settingsMenu) {
        settingsToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            settingsMenu.classList.toggle("hidden");
        });

        document.addEventListener("click", (e) => {
            if (!settingsMenu.contains(e.target) && e.target !== settingsToggleBtn) {
                settingsMenu.classList.add("hidden");
            }
        });
    }

    // Play Navigation Button Click (Opens Rules/Start popup)
    const playNavBtn = document.getElementById("play-nav-btn");
    if (playNavBtn) {
        playNavBtn.addEventListener("click", () => {
            // If the game is running and not paused, pause it first to stop background loop
            if (gameState.running && !gameState.paused) {
                togglePause();
            }
            
            // Hide the other popups
            document.getElementById("pause-container").classList.add("hidden");
            document.getElementById("game-over-container").classList.add("hidden");
            document.getElementById("settings-menu").classList.add("hidden");
            
            // Show the rules screen (popup window for start or play again)
            document.getElementById("rules-container").classList.remove("hidden");
        });
    }
});

canvas.addEventListener("contextmenu", e => e.preventDefault());