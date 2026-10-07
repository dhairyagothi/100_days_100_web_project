/**
 * Conway's Game of Life Logic
 */

// --- Global Settings Management ---
const DEFAULTS = {
    theme: 'theme-dark',
    liveColor: '#00ffcc',
    deadColor: '#121212',
    gridColor: '#2a2a2a',
    showGrid: true
};

function getSetting(key) {
    const val = localStorage.getItem('cgl_' + key);
    if (val === null) return DEFAULTS[key];
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
}

function setSetting(key, value) {
    localStorage.setItem('cgl_' + key, value);
}

// Apply Theme
document.body.className = getSetting('theme');


// --- Settings Page Logic ---
if (window.location.pathname.includes('settings.html')) {
    const themeSel = document.getElementById('setting-theme');
    const liveCol = document.getElementById('setting-live-color');
    const deadCol = document.getElementById('setting-dead-color');
    const gridCol = document.getElementById('setting-grid-color');
    const showGrid = document.getElementById('setting-show-grid');

    // Init values
    themeSel.value = getSetting('theme');
    liveCol.value = getSetting('liveColor');
    deadCol.value = getSetting('deadColor');
    gridCol.value = getSetting('gridColor');
    showGrid.checked = getSetting('showGrid');

    // Listeners
    themeSel.addEventListener('change', (e) => { setSetting('theme', e.target.value); document.body.className = e.target.value; });
    liveCol.addEventListener('change', (e) => setSetting('liveColor', e.target.value));
    deadCol.addEventListener('change', (e) => setSetting('deadColor', e.target.value));
    gridCol.addEventListener('change', (e) => setSetting('gridColor', e.target.value));
    showGrid.addEventListener('change', (e) => setSetting('showGrid', e.target.checked));
}


// --- Simulator Logic ---
if (window.location.pathname.includes('simulator.html')) {
    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize by disabling alpha

    const btnPlay = document.getElementById('btn-play');
    const playIcon = document.getElementById('play-icon');
    const btnStep = document.getElementById('btn-step');
    const btnClear = document.getElementById('btn-clear');
    const btnRandomize = document.getElementById('btn-randomize');
    
    const speedSlider = document.getElementById('speed-slider');
    const speedDisplay = document.getElementById('speed-display');
    const gridSizeSelect = document.getElementById('grid-size');
    const presetSelect = document.getElementById('preset-selector');

    const statGen = document.getElementById('stat-gen');
    const statPop = document.getElementById('stat-pop');

    // Engine State
    let cols = 100;
    let rows = 100;
    let cellSize = 8;
    let grid = [];
    let nextGrid = [];
    let isPlaying = false;
    let generation = 0;
    let fps = 15;
    let lastTime = 0;
    let animationId;

    // Drawing State
    let isDrawing = false;
    let drawMode = 1; // 1 to draw, 0 to erase

    // Colors
    let colorLive = getSetting('liveColor');
    let colorDead = getSetting('deadColor');
    let colorGrid = getSetting('gridColor');
    let showGridLines = getSetting('showGrid');

    // Initialize Arrays
    function initArrays() {
        grid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
        nextGrid = new Array(cols).fill(null).map(() => new Array(rows).fill(0));
    }

    // Set Canvas Size based on grid
    function resizeCanvas() {
        canvas.width = cols * cellSize;
        canvas.height = rows * cellSize;
        draw();
    }

    // Handle Grid Size Change
    function changeGridSize() {
        const size = parseInt(gridSizeSelect.value);
        cols = size;
        rows = size;
        
        // Adjust cell size for viewability (responsive logic)
        const containerWidth = document.getElementById('canvas-container').clientWidth;
        const containerHeight = document.getElementById('canvas-container').clientHeight;
        const minDimension = Math.min(containerWidth, containerHeight) - 40; // padding
        
        cellSize = Math.max(2, Math.floor(minDimension / size));
        if (cellSize < 3) showGridLines = false; // Disable lines on tiny cells for perf
        else showGridLines = getSetting('showGrid');

        initArrays();
        resizeCanvas();
        resetStats();
    }

    // Core Algorithm: Calculate Next Generation
    function computeNextGeneration() {
        let population = 0;
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                
                let state = grid[i][j];
                let neighbors = countNeighbors(i, j);

                // Rules
                if (state === 0 && neighbors === 3) {
                    nextGrid[i][j] = 1;
                    population++;
                } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                    nextGrid[i][j] = 0;
                } else {
                    nextGrid[i][j] = state;
                    if(state === 1) population++;
                }
            }
        }

        // Swap references for performance instead of copying
        let temp = grid;
        grid = nextGrid;
        nextGrid = temp;

        generation++;
        updateStats(population);
    }

    // Count Moore Neighborhood (8 cells, with wrap-around / toroidal array)
    function countNeighbors(x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let col = (x + i + cols) % cols;
                let row = (y + j + rows) % rows;
                sum += grid[col][row];
            }
        }
        sum -= grid[x][y]; // Subtract self
        return sum;
    }

    // Rendering Function
    function draw() {
        // Fast fill background (dead color)
        ctx.fillStyle = colorDead;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw live cells
        ctx.fillStyle = colorLive;
        ctx.beginPath();
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (grid[i][j] === 1) {
                    ctx.rect(i * cellSize, j * cellSize, cellSize, cellSize);
                }
            }
        }
        ctx.fill();

        // Draw grid lines
        if (showGridLines) {
            ctx.strokeStyle = colorGrid;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let i = 0; i <= cols; i++) {
                ctx.moveTo(i * cellSize, 0);
                ctx.lineTo(i * cellSize, canvas.height);
            }
            for (let j = 0; j <= rows; j++) {
                ctx.moveTo(0, j * cellSize);
                ctx.lineTo(canvas.width, j * cellSize);
            }
            ctx.stroke();
        }
    }

    // Game Loop
    function loop(timestamp) {
        if (!isPlaying) return;
        
        const throttle = 1000 / fps;
        if (timestamp - lastTime >= throttle) {
            computeNextGeneration();
            draw();
            lastTime = timestamp;
        }
        animationId = requestAnimationFrame(loop);
    }

    // Controls
    function togglePlay() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playIcon.classList.replace('fa-play', 'fa-pause');
            lastTime = performance.now();
            loop(lastTime);
        } else {
            playIcon.classList.replace('fa-pause', 'fa-play');
            cancelAnimationFrame(animationId);
        }
    }

    function step() {
        if (isPlaying) togglePlay();
        computeNextGeneration();
        draw();
    }

    function clearGrid() {
        if (isPlaying) togglePlay();
        initArrays();
        resetStats();
        draw();
    }

    function randomizeGrid() {
        if (isPlaying) togglePlay();
        let pop = 0;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j] = Math.random() > 0.75 ? 1 : 0; // 25% chance of life
                if (grid[i][j] === 1) pop++;
            }
        }
        resetStats();
        updateStats(pop);
        draw();
    }

    function updateStats(pop) {
        statGen.innerText = generation;
        if (pop !== undefined) statPop.innerText = pop;
    }

    function resetStats() {
        generation = 0;
        updateStats(0);
    }

    // Presets Library
    const PRESETS = {
        'glider': [
            [0,1,0],
            [0,0,1],
            [1,1,1]
        ],
        'pulsar': [
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,1,1,1,0,0]
        ],
        'gosper': [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]
    };

    function loadPreset(key) {
        if (!PRESETS[key]) return;
        clearGrid();
        const pattern = PRESETS[key];
        
        // Center the pattern
        const startX = Math.floor(cols / 2 - pattern[0].length / 2);
        const startY = Math.floor(rows / 2 - pattern.length / 2);
        
        let pop = 0;
        for (let j = 0; j < pattern.length; j++) {
            for (let i = 0; i < pattern[j].length; i++) {
                if (startX + i >= 0 && startX + i < cols && startY + j >= 0 && startY + j < rows) {
                    grid[startX + i][startY + j] = pattern[j][i];
                    if(pattern[j][i] === 1) pop++;
                }
            }
        }
        updateStats(pop);
        draw();
    }

    // Interaction (Mouse / Touch drawing)
    function handleDraw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        
        // Handle touch and mouse
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = Math.floor((clientX - rect.left) / cellSize);
        const y = Math.floor((clientY - rect.top) / cellSize);

        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[x][y] = drawMode;
            draw();
        }
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) / cellSize);
        const y = Math.floor((e.clientY - rect.top) / cellSize);
        
        // Determine mode based on what was clicked
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            drawMode = grid[x][y] === 1 ? 0 : 1;
            grid[x][y] = drawMode;
            draw();
        }
    });

    canvas.addEventListener('mousemove', handleDraw);
    window.addEventListener('mouseup', () => isDrawing = false);

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        // Same logic as mousedown
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.touches[0].clientX - rect.left) / cellSize);
        const y = Math.floor((e.touches[0].clientY - rect.top) / cellSize);
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            drawMode = grid[x][y] === 1 ? 0 : 1;
            grid[x][y] = drawMode;
            draw();
        }
        e.preventDefault(); // Prevent scrolling while drawing
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
        handleDraw(e);
        e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', () => isDrawing = false);

    // Event Listeners for UI
    btnPlay.addEventListener('click', togglePlay);
    btnStep.addEventListener('click', step);
    btnClear.addEventListener('click', clearGrid);
    btnRandomize.addEventListener('click', randomizeGrid);

    speedSlider.addEventListener('input', (e) => {
        fps = parseInt(e.target.value);
        speedDisplay.innerText = fps + ' fps';
    });

    gridSizeSelect.addEventListener('change', changeGridSize);

    presetSelect.addEventListener('change', (e) => {
        if(e.target.value !== 'none') {
            loadPreset(e.target.value);
            e.target.value = 'none'; // reset selector
        }
    });

    // Window resize observer
    window.addEventListener('resize', () => {
        // Debounce resize
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            if(!isPlaying) {
                changeGridSize(); // Recalculate cell size based on new container size
            }
        }, 200);
    });

    // Boot
    changeGridSize();
    randomizeGrid(); // Start with something cool
}
