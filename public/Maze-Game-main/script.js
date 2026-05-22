const CONFIG = {
    Easy: 10,
    Medium: 18,
    Hard: 30
};

let currentDifficulty = 'Easy';
let maze = [];
let player = { x: 0, y: 0 };
let steps = 0;
let isWon = false;
let highScores = JSON.parse(localStorage.getItem('neon-scores') || '{"Easy":null,"Medium":null,"Hard":null}');

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const stepsEl = document.getElementById('steps');
const bestEl = document.getElementById('best');
const complexityEl = document.getElementById('complexity');
const modal = document.getElementById('winModal');
const finalStepsEl = document.getElementById('finalSteps');

function initGame(diff) {
    currentDifficulty = diff;
    const size = CONFIG[diff];
    
    // Update UI active buttons
    document.querySelectorAll('.controls button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.diff === diff);
    });

    // Reset State
    steps = 0;
    player = { x: 0, y: 0 };
    isWon = false;
    modal.classList.remove('visible');
    
    // Generate Maze
    maze = generateMaze(size, size);
    
    // Update Stats
    updateStats();
    draw();
}

function generateMaze(w, h) {
    const grid = [];
    for (let y = 0; y < h; y++) {
        const row = [];
        for (let x = 0; x < w; x++) {
            row.push({ x, y, visited: false, walls: { top: true, right: true, bottom: true, left: true } });
        }
        grid.push(row);
    }

    const stack = [];
    const start = grid[0][0];
    start.visited = true;
    stack.push(start);

    while (stack.length > 0) {
        const curr = stack[stack.length - 1];
        const neighbors = getNeighbors(curr, grid, w, h);

        if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            removeWalls(curr, next);
            next.visited = true;
            stack.push(next);
        } else {
            stack.pop();
        }
    }
    return grid;
}

function getNeighbors(cell, grid, w, h) {
    const n = [];
    const { x, y } = cell;
    if (y > 0 && !grid[y - 1][x].visited) n.push(grid[y - 1][x]);
    if (x < w - 1 && !grid[y][x + 1].visited) n.push(grid[y][x + 1]);
    if (y < h - 1 && !grid[y + 1][x].visited) n.push(grid[y + 1][x]);
    if (x > 0 && !grid[y][x - 1].visited) n.push(grid[y][x - 1]);
    return n;
}

function removeWalls(a, b) {
    if (a.x < b.x) { a.walls.right = false; b.walls.left = false; }
    else if (a.x > b.x) { a.walls.left = false; b.walls.right = false; }
    else if (a.y < b.y) { a.walls.bottom = false; b.walls.top = false; }
    else if (a.y > b.y) { a.walls.top = false; b.walls.bottom = false; }
}

function draw() {
    const size = CONFIG[currentDifficulty];
    const cellSize = canvas.width / size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Maze
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const cell = maze[y][x];
            const px = x * cellSize;
            const py = y * cellSize;

            ctx.beginPath();
            if (cell.walls.top) { ctx.moveTo(px, py); ctx.lineTo(px + cellSize, py); }
            if (cell.walls.right) { ctx.moveTo(px + cellSize, py); ctx.lineTo(px + cellSize, py + cellSize); }
            if (cell.walls.bottom) { ctx.moveTo(px, py + cellSize); ctx.lineTo(px + cellSize, py + cellSize); }
            if (cell.walls.left) { ctx.moveTo(px, py); ctx.lineTo(px, py + cellSize); }
            ctx.stroke();
        }
    }

    // Draw End House
    const endSize = cellSize * 0.7;
    ctx.fillStyle = '#d946ef';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#d946ef';
    ctx.beginPath();
    ctx.arc((size - 0.5) * cellSize, (size - 0.5) * cellSize, endSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Player
    const pSize = cellSize * 0.6;
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#22d3ee';
    ctx.beginPath();
    ctx.roundRect((player.x + 0.2) * cellSize, (player.y + 0.2) * cellSize, cellSize * 0.6, cellSize * 0.6, 4);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function updateStats() {
    stepsEl.textContent = steps;
    bestEl.textContent = highScores[currentDifficulty] || '--';
    complexityEl.textContent = `${CONFIG[currentDifficulty]}x${CONFIG[currentDifficulty]}`;
}

function move(dx, dy) {
    if (isWon) return;
    const size = CONFIG[currentDifficulty];
    
    // Boundary check
    const nx = player.x + dx;
    const ny = player.y + dy;
    if (nx < 0 || nx >= size || ny < 0 || ny >= size) return;

    // Wall check
    const cell = maze[player.y][player.x];
    if (dx === 1 && cell.walls.right) return;
    if (dx === -1 && cell.walls.left) return;
    if (dy === 1 && cell.walls.bottom) return;
    if (dy === -1 && cell.walls.top) return;

    player.x = nx;
    player.y = ny;
    steps++;
    updateStats();
    draw();

    if (player.x === size - 1 && player.y === size - 1) {
        win();
    }
}

function win() {
    isWon = true;
    finalStepsEl.textContent = steps;
    const currentBest = highScores[currentDifficulty];
    if (currentBest === null || steps < currentBest) {
        highScores[currentDifficulty] = steps;
        localStorage.setItem('neon-scores', JSON.stringify(highScores));
    }
    modal.classList.add('visible');
}

// Input
addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': move(0, -1); break;
        case 's': case 'arrowdown': move(0, 1); break;
        case 'a': case 'arrowleft': move(-1, 0); break;
        case 'd': case 'arrowright': move(1, 0); break;
    }
    if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }
});

// UI Events
document.querySelectorAll('[data-diff]').forEach(btn => {
    btn.onclick = () => initGame(btn.dataset.diff);
});

// Start
initGame('Easy');
