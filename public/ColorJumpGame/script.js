const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const finalScoreEl = document.getElementById('finalScore');
const difficultySelect = document.getElementById('difficulty');

// Statistics Elements
const statsToggle = document.getElementById('statsToggle');
const statsContent = document.getElementById('statsContent');
const resetStatsBtn = document.getElementById('resetStatsBtn');
const dialogOverlay = document.getElementById('dialogOverlay');
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

// Statistics Variables
let gameStats = JSON.parse(localStorage.getItem('colorJumpGameStats')) || {
    totalGames: 0,
    totalJumps: 0,
    highestScore: 0,
    totalScore: 0,
    longestSurvivalSeconds: 0,
    totalPlayTimeSeconds: 0,
    bestStreak: 0,
    currentStreak: 0,
    successfulGames: 0
};

let currentGameJumps = 0;
let gameStartTime = 0;

// Initialize Statistics UI
function initStatsUI() {
    updateAllStats();
    updateCurrentDifficultyStat();
}

// Update single stat with animation
function updateStat(elementId, value, suffix = '') {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = value + suffix;
    const card = el.closest('.stat-card');
    if (card) {
        card.classList.remove('updated');
        void card.offsetWidth; // Trigger reflow
        card.classList.add('updated');
        setTimeout(() => card.classList.remove('updated'), 500);
    }
}

// Update all statistics
function updateAllStats() {
    const avgScore = gameStats.totalGames > 0 
        ? Math.round(gameStats.totalScore / gameStats.totalGames) 
        : 0;
    const successRate = gameStats.totalGames > 0 
        ? Math.round((gameStats.successfulGames / gameStats.totalGames) * 100) 
        : 0;

    updateStat('totalGames', gameStats.totalGames);
    updateStat('totalJumps', gameStats.totalJumps);
    updateStat('highestScore', gameStats.highestScore);
    updateStat('averageScore', avgScore);
    updateStat('longestSurvival', gameStats.longestSurvivalSeconds, 's');
    updateStat('totalPlayTime', formatTime(gameStats.totalPlayTimeSeconds));
    updateStat('bestStreak', gameStats.bestStreak);
    updateStat('successRate', successRate, '%');

    // Update Progress Bars
    updateProgressBars(avgScore);
}

// Update current difficulty display
function updateCurrentDifficultyStat() {
    const difficultyNames = {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard'
    };
    updateStat('currentDifficultyStat', difficultyNames[difficultySelect.value]);
}

// Update progress bars
function updateProgressBars(avgScore) {
    // High Score Progress (compared to 100 as a target)
    const targetScore = 100;
    const highScoreProgress = Math.min((gameStats.highestScore / targetScore) * 100, 100);
    document.getElementById('highScoreProgress').textContent = Math.round(highScoreProgress) + '%';
    document.getElementById('highScoreFill').style.width = highScoreProgress + '%';

    // Average Score Progress (compared to 50)
    const avgScoreTarget = 50;
    const avgScoreProgress = Math.min((avgScore / avgScoreTarget) * 100, 100);
    document.getElementById('avgScoreProgress').textContent = Math.round(avgScoreProgress) + '%';
    document.getElementById('avgScoreFill').style.width = avgScoreProgress + '%';

    // Survival Time Progress (compared to 60 seconds)
    const survivalTarget = 60;
    const survivalProgress = Math.min((gameStats.longestSurvivalSeconds / survivalTarget) * 100, 100);
    document.getElementById('survivalProgress').textContent = Math.round(survivalProgress) + '%';
    document.getElementById('survivalFill').style.width = survivalProgress + '%';
}

// Format time in minutes and seconds
function formatTime(seconds) {
    if (seconds < 60) return seconds + 's';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + 'm ' + (secs > 0 ? secs + 's' : '');
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('colorJumpGameStats', JSON.stringify(gameStats));
}

// Event Listeners for Statistics Dashboard
statsToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    statsContent.hidden = !statsContent.hidden;
});

resetStatsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openModal();
});

cancelBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
});

confirmBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetStats();
});

dialogOverlay.addEventListener('click', (e) => {
    if (e.target === dialogOverlay) {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && dialogOverlay.classList.contains('active')) {
        closeModal();
    }
});

difficultySelect.addEventListener('change', updateCurrentDifficultyStat);

// Modal helper functions
function openModal() {
    dialogOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    dialogOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function resetStats() {
    // Reset stats
    gameStats = {
        totalGames: 0,
        totalJumps: 0,
        highestScore: 0,
        totalScore: 0,
        longestSurvivalSeconds: 0,
        totalPlayTimeSeconds: 0,
        bestStreak: 0,
        currentStreak: 0,
        successfulGames: 0
    };
    saveStats();
    updateAllStats();
    closeModal();
}

// Difficulty settings
const difficultySettings = {
    easy: {
        speed: 3,
        spawnRate: 120
    },
    medium: {
        speed: 4,
        spawnRate: 90
    },
    hard: {
        speed: 6,
        spawnRate: 60
    }
};

let currentDifficulty = 'medium';

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
        const settings = difficultySettings[currentDifficulty];
        this.speed = settings.speed + (score * 0.1); // Increases speed as score goes up
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
    // If modal is open, don't handle any game inputs
    if (dialogOverlay.classList.contains('active')) {
        return;
    }
    
    // Ignore clicks on buttons
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        return;
    }
    
    if (e.type === 'keydown' && e.code !== 'Space') return;
    if (isGameRunning) {
        player.jump();
        currentGameJumps++;
        gameStats.totalJumps++;
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
    currentGameJumps = 0;
    scoreEl.innerText = score;
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
}

function startGame() {
    if (isGameRunning) return;
    currentDifficulty = difficultySelect.value;
    difficultySelect.disabled = true;
    gameStartTime = Date.now();
    init();
    isGameRunning = true;
    animate();
}

function gameOver() {
    isGameRunning = false;
    cancelAnimationFrame(animationId);
    difficultySelect.disabled = false;
    
    // Calculate game duration in seconds
    const gameDurationSeconds = Math.round((Date.now() - gameStartTime) / 1000);
    
    // Update statistics
    gameStats.totalGames++;
    gameStats.totalScore += score;
    gameStats.totalPlayTimeSeconds += gameDurationSeconds;
    
    // Update highest score
    if (score > gameStats.highestScore) {
        gameStats.highestScore = score;
    }
    
    // Update longest survival
    if (gameDurationSeconds > gameStats.longestSurvivalSeconds) {
        gameStats.longestSurvivalSeconds = gameDurationSeconds;
    }
    
    // Update streak and success rate (consider score > 0 as a "successful" game)
    if (score > 0) {
        gameStats.successfulGames++;
        gameStats.currentStreak++;
        if (gameStats.currentStreak > gameStats.bestStreak) {
            gameStats.bestStreak = gameStats.currentStreak;
        }
    } else {
        gameStats.currentStreak = 0;
    }
    
    // Save and update UI
    saveStats();
    updateAllStats();
    
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
    const settings = difficultySettings[currentDifficulty];
    if (frames % settings.spawnRate === 0) { // Spawn rate
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

// Initialize Statistics UI on page load
initStatsUI();
