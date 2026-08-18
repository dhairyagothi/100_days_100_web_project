// Game Configuration Parameters
const NODE_COLORS = {
    'cyan': 'var(--node-cyan)',
    'magenta': 'var(--node-magenta)',
    'yellow': 'var(--node-yellow)',
    'purple': 'var(--node-purple)',
    'orange': 'var(--node-orange)',
    'green': 'var(--node-green)'
};
const MAX_ATTEMPTS = 8;
const TIMER_DURATION = 120; 

// Local State Management variables
let secretCode = [];
let playerGuess = [null, null, null, null];
let activeSlotIndex = 0;
let attemptsLeft = MAX_ATTEMPTS;
let timeRemaining = TIMER_DURATION;
let timerInterval = null;
let gameStarted = false;

// DOM Selectors
const historyBoard = document.getElementById('historyBoard');
const currentGuessDeck = document.getElementById('currentGuessDeck');
const colorPicker = document.getElementById('colorPicker');
const startBtn = document.getElementById('startBtn');
const submitGuessBtn = document.getElementById('submitGuessBtn');
const attemptsDisplay = document.getElementById('attemptsDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const integrityDisplay = document.getElementById('integrityDisplay');
const gameModal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const secretReveal = document.getElementById('secretReveal');
const restartBtn = document.getElementById('restartBtn');

/**
 * Main game initialization engine
 */
function initGame() {
    historyBoard.innerHTML = '';
    playerGuess = [null, null, null, null];
    activeSlotIndex = 0;
    attemptsLeft = MAX_ATTEMPTS;
    timeRemaining = TIMER_DURATION;
    gameStarted = false;
    
    clearInterval(timerInterval);
    
    attemptsDisplay.textContent = `${attemptsLeft} / ${MAX_ATTEMPTS}`;
    timerDisplay.textContent = `120s`;
    integrityDisplay.textContent = `100%`;
    integrityDisplay.style.color = 'var(--node-green)';
    
    // Generate Secret Sequence Array
    const colorKeys = Object.keys(NODE_COLORS);
    secretCode = [];
    for (let i = 0; i < 4; i++) {
        secretCode.push(colorKeys[Math.floor(Math.random() * colorKeys.length)]);
    }
    
    // Renders top-down natively (PRB #8 at top, PRB #1 at bottom)
    for (let i = MAX_ATTEMPTS; i >= 1; i--) {
        createEmptyHistoryRow(i);
    }
    
    buildColorPickerUI();
    updateGuessDeckUI();
    
    startBtn.style.display = 'flex';
    submitGuessBtn.style.display = 'none';
}

function startGameOperation() {
    gameStarted = true;
    startBtn.style.display = 'none';
    submitGuessBtn.style.display = 'flex';
    updateGuessDeckUI();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(handleClockTick, 1000);
}

function createEmptyHistoryRow(index) {
    const row = document.createElement('div');
    row.className = 'history-row';
    row.id = `row-${index}`;
    
    row.innerHTML = `
        <div class="row-index">PRB #${index}</div>
        <div class="row-nodes">
            <div class="node-circle" style="opacity: 0.15"></div>
            <div class="node-circle" style="opacity: 0.15"></div>
            <div class="node-circle" style="opacity: 0.15"></div>
            <div class="node-circle" style="opacity: 0.15"></div>
        </div>
        <div class="feedback-pegs">
            <div class="peg"></div>
            <div class="peg"></div>
            <div class="peg"></div>
            <div class="peg"></div>
        </div>
    `;
    historyBoard.appendChild(row);
}

function buildColorPickerUI() {
    colorPicker.innerHTML = '';
    Object.keys(NODE_COLORS).forEach(color => {
        const pickerNode = document.createElement('div');
        pickerNode.className = 'picker-circle';
        pickerNode.style.backgroundColor = NODE_COLORS[color];
        pickerNode.addEventListener('click', () => handleColorSelection(color));
        colorPicker.appendChild(pickerNode);
    });
}

function handleColorSelection(color) {
    if (!gameStarted) return;
    
    if (activeSlotIndex < 4) {
        playerGuess[activeSlotIndex] = color;
        activeSlotIndex = playerGuess.findIndex(val => val === null);
        if (activeSlotIndex === -1) activeSlotIndex = 4;
        
        updateGuessDeckUI();
    }
}

function updateGuessDeckUI() {
    const slots = currentGuessDeck.querySelectorAll('.slot');
    slots.forEach((slot, index) => {
        const colorVal = playerGuess[index];
        if (colorVal) {
            slot.className = 'slot packed';
            slot.style.backgroundColor = NODE_COLORS[colorVal];
            slot.style.borderStyle = 'solid';
        } else {
            slot.className = 'slot empty';
            slot.style.backgroundColor = 'transparent';
            slot.style.borderStyle = 'dashed';
        }
        
        if (gameStarted && index === activeSlotIndex) {
            slot.style.borderColor = 'var(--text-main)';
        } else {
            slot.style.borderColor = '';
        }
    });

    submitGuessBtn.disabled = !gameStarted || playerGuess.includes(null);
}

currentGuessDeck.addEventListener('click', (e) => {
    if (!gameStarted) return;
    const slot = e.target.closest('.slot');
    if (!slot) return;
    const targetIdx = parseInt(slot.dataset.slot);
    playerGuess[targetIdx] = null;
    activeSlotIndex = targetIdx;
    updateGuessDeckUI();
});

function updateSystemIntegrity() {
    const timeWeight = (timeRemaining / TIMER_DURATION) * 50; 
    const attemptWeight = (attemptsLeft / MAX_ATTEMPTS) * 50; 
    const currentScore = Math.round(timeWeight + attemptWeight);
    
    integrityDisplay.textContent = `${currentScore}%`;
    
    if (currentScore > 65) {
        integrityDisplay.style.color = 'var(--node-green)';
    } else if (currentScore > 35) {
        integrityDisplay.style.color = 'var(--node-yellow)';
    } else {
        integrityDisplay.style.color = '#ef4444';
    }
}

function evaluateCurrentGuess() {
    if (!gameStarted) return;
    
    const currentRowIndex = attemptsLeft;
    const targetRow = document.getElementById(`row-${currentRowIndex}`);
    if (!targetRow) return;

    let flags = ['red', 'red', 'red', 'red']; 
    let secretMatched = [false, false, false, false];
    let guessMatched = [false, false, false, false];

    for (let i = 0; i < 4; i++) {
        if (playerGuess[i] === secretCode[i]) {
            flags[i] = 'green';
            secretMatched[i] = true;
            guessMatched[i] = true;
        }
    }

    for (let i = 0; i < 4; i++) {
        if (guessMatched[i]) continue;

        for (let j = 0; j < 4; j++) {
            if (!secretMatched[j] && playerGuess[i] === secretCode[j]) {
                flags[i] = 'yellow';
                secretMatched[j] = true;
                break;
            }
        }
    }

    const nodeContainers = targetRow.querySelectorAll('.node-circle');
    playerGuess.forEach((color, i) => {
        nodeContainers[i].style.opacity = '1';
        nodeContainers[i].style.backgroundColor = NODE_COLORS[color];
    });

    const pegContainers = targetRow.querySelectorAll('.peg');
    flags.forEach((flagType, i) => {
        pegContainers[i].className = `peg ${flagType}`;
    });

    const isWin = flags.filter(f => f === 'green').length === 4;
    
    if (isWin) {
        endGame(true, "Mainframe Overridden! Matrix sequence bypassed successfully.");
    } else {
        attemptsLeft--;
        attemptsDisplay.textContent = `${attemptsLeft} / ${MAX_ATTEMPTS}`;
        updateSystemIntegrity();
        
        playerGuess = [null, null, null, null];
        activeSlotIndex = 0;
        updateGuessDeckUI();

        if (attemptsLeft === 0) {
            endGame(false, "Lockdown Triggered. System core has shifted out of reach.");
        }
    }
}

function handleClockTick() {
    timeRemaining--;
    timerDisplay.textContent = `${timeRemaining}s`;
    updateSystemIntegrity();
    
    if (timeRemaining <= 0) {
        endGame(false, "Time expiration limit reached. Core sequence lost.");
    }
}

function endGame(isVictory, statusMessage) {
    clearInterval(timerInterval);
    gameStarted = false;
    
    modalTitle.textContent = isVictory ? "ACCESS GRANTED" : "SYSTEM SECURITY LOCKDOWN";
    modalTitle.style.color = isVictory ? "var(--node-green)" : "#ef4444";
    modalMessage.textContent = statusMessage;
    
    secretReveal.innerHTML = '';
    secretCode.forEach(color => {
        const node = document.createElement('div');
        node.className = 'node-circle';
        node.style.backgroundColor = NODE_COLORS[color];
        secretReveal.appendChild(node);
    });

    gameModal.classList.add('active');
}

/* ============================================================
   DYNAMIC TERMINAL DIGITAL MATRIX RAIN STREAM ENGINE
   ============================================================ */
const canvas = document.getElementById('terminalStreamCanvas');
const ctx = canvas.getContext('2d');

let columns = [];
const fontSize = 14;
const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZMATRIXQUANTUMSYSTEMCOREERR";

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const numColumns = Math.floor(canvas.width / fontSize) + 1;
    columns = [];
    for (let i = 0; i < numColumns; i++) {
        columns.push(Math.random() * -100);
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawMatrixStream() {
    ctx.fillStyle = 'rgba(3, 5, 10, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(0, 188, 212, 0.12)'; 
    ctx.font = `${fontSize}px monospace`;
    
    columns.forEach((y, x) => {
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        const posX = x * fontSize;
        const posY = y * fontSize;
        
        ctx.fillText(randomChar, posX, posY);
        
        if (posY > canvas.height && Math.random() > 0.975) {
            columns[x] = 0;
        } else {
            columns[x] += 1;
        }
    });
}

setInterval(drawMatrixStream, 33);

// Action Listeners
startBtn.addEventListener('click', startGameOperation);
submitGuessBtn.addEventListener('click', evaluateCurrentGuess);
restartBtn.addEventListener('click', () => {
    gameModal.classList.remove('active');
    initGame();
});

document.addEventListener('DOMContentLoaded', initGame);