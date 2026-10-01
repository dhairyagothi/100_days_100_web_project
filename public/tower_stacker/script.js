const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('finalScore');

// Overlay Targets
const startOverlay = document.getElementById('startOverlay');
const pauseOverlay = document.getElementById('pauseOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');

// Control Buttons
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const resetBtn = document.getElementById('resetBtn');
const restartBtn = document.getElementById('restartBtn');

// --- Game Configurations ---
const BLOCK_HEIGHT = 40;
const INITIAL_WIDTH = 200;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const BASE_SPEED = 2.5;

let blocks = [];
let animationFrameId = null;
let gameActive = false;
let isPaused = false;
let currentScore = 0;
let cameraY = 0; 

let activeBlock = {
    x: 0,
    y: 0,
    width: INITIAL_WIDTH,
    direction: 1, 
    speed: BASE_SPEED
};

// --- Core Initialization Routine ---
function initGame() {
    blocks = [];
    currentScore = 0;
    cameraY = 0;
    isPaused = false;
    gameActive = true;
    
    scoreEl.textContent = currentScore;
    
    // Hide all overlay view screens cleanly
    startOverlay.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    gameOverOverlay.classList.add('hidden');
    
    // Set standard play svg symbol into pause target buttons
    updatePauseButtonIcon(false);

    blocks.push({
        x: (CANVAS_WIDTH - INITIAL_WIDTH) / 2,
        y: CANVAS_HEIGHT - BLOCK_HEIGHT,
        width: INITIAL_WIDTH,
        color: generateColor(0)
    });

    spawnNextBlock();
    animate();
}

function spawnNextBlock() {
    const totalPlaced = blocks.length;
    const targetY = CANVAS_HEIGHT - (BLOCK_HEIGHT * (totalPlaced + 1));
    const currentWidth = blocks[totalPlaced - 1].width;
    const currentSpeed = BASE_SPEED + Math.floor(totalPlaced / 3) * 0.5;

    activeBlock.x = totalPlaced % 2 === 0 ? 0 : CANVAS_WIDTH - currentWidth;
    activeBlock.y = targetY;
    activeBlock.width = currentWidth;
    activeBlock.direction = totalPlaced % 2 === 0 ? 1 : -1;
    activeBlock.speed = currentSpeed;
}

// --- Toggle System Pause / Resume States ---
function togglePause() {
    if (!gameActive) return;

    if (!isPaused) {
        // Halt Loop Execution
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
        pauseOverlay.classList.remove('hidden');
        updatePauseButtonIcon(true);
    } else {
        // Resume Execution Loop
        isPaused = false;
        pauseOverlay.classList.add('hidden');
        updatePauseButtonIcon(false);
        animate();
    }
}

function updatePauseButtonIcon(pausedState) {
    if (pausedState) {
        // Set to Play Triangle Icon Shape
        pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>`;
    } else {
        // Set to Normal Parallel Stop Lines Block Shape
        pauseBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    }
}

// --- Physics Drops / Geometry Calculations ---
function handleDrop() {
    if (!gameActive || isPaused) return;

    const currentBlock = activeBlock;
    const targetBlock = blocks[blocks.length - 1];
    const leftEdgeDifference = currentBlock.x - targetBlock.x;
    let newWidth = currentBlock.width - Math.abs(leftEdgeDifference);

    if (newWidth <= 0) {
        endGame();
        return;
    }

    let newX = leftEdgeDifference > 0 ? currentBlock.x : targetBlock.x;

    blocks.push({
        x: newX,
        y: currentBlock.y,
        width: newWidth,
        color: generateColor(blocks.length)
    });

    currentScore++;
    scoreEl.textContent = currentScore;

    const currentTowerHeight = blocks.length * BLOCK_HEIGHT;
    if (currentTowerHeight > CANVAS_HEIGHT / 2) {
        cameraY = currentTowerHeight - CANVAS_HEIGHT / 2;
    }

    spawnNextBlock();
}

function endGame() {
    gameActive = false;
    cancelAnimationFrame(animationFrameId);
    finalScoreEl.textContent = currentScore;
    gameOverOverlay.classList.remove('hidden');
}

function generateColor(index) {
    const hue = (index * 20) % 360;
    return `hsl(${hue}, 75%, 55%)`;
}

// --- Main Engine Canvas Processing Frame Loop ---
function animate() {
    if (!gameActive || isPaused) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.save();
    ctx.translate(0, cameraY);

    for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, BLOCK_HEIGHT);
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        ctx.strokeRect(b.x, b.y, b.width, BLOCK_HEIGHT);
    }

    activeBlock.x += activeBlock.speed * activeBlock.direction;

    if (activeBlock.x + activeBlock.width > CANVAS_WIDTH) {
        activeBlock.x = CANVAS_WIDTH - activeBlock.width;
        activeBlock.direction = -1;
    } else if (activeBlock.x < 0) {
        activeBlock.x = 0;
        activeBlock.direction = 1;
    }

    ctx.fillStyle = generateColor(blocks.length);
    ctx.fillRect(activeBlock.x, activeBlock.y, activeBlock.width, BLOCK_HEIGHT);
    ctx.strokeRect(activeBlock.x, activeBlock.y, activeBlock.width, BLOCK_HEIGHT);

    ctx.restore();

    animationFrameId = requestAnimationFrame(animate);
}

// --- Global Window User Controls Event Routing Handles ---
function handleInteraction(e) {
    // If pressing space bar outside active gaming bounds, block normal browser page drops
    if (e.code === 'Space') e.preventDefault(); 
    
    if (e.type === 'keydown' && e.code !== 'Space') return;
    
    // Drop logic fires cleanly only if clicking canvas viewport elements directly
    if (gameActive && !isPaused) {
        handleDrop();
    }
}

// Event Binding Configurations
window.addEventListener('keydown', handleInteraction);
canvas.addEventListener('mousedown', handleInteraction);
canvas.addEventListener('touchstart', handleInteraction, { passive: true });

// Control HUD Button Event Bindings
startBtn.addEventListener('click', initGame);
pauseBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Stops drop mechanics from misfiring
    togglePause();
});
resumeBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);