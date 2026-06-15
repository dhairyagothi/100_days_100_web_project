const matrixEl = document.getElementById('matrix');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const updateBtn = document.getElementById('update-size');
const clearBtn = document.getElementById('clear-btn');
const animType = document.getElementById('anim-type');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const importInput = document.getElementById('import-input');
const colorPicker = document.getElementById('color-picker');
const customColorWrapper = document.getElementById('custom-color-wrapper');

let rows = parseInt(rowsInput.value);
let cols = parseInt(colsInput.value);
let gridData = [];
let isDrawing = false;
let drawMode = true; // can be false (erase) or hex color string (draw)
let animInterval = null;
let originalGridData = [];
let currentColor = '#ffffff';

function initGrid() {
    matrixEl.innerHTML = '';
    matrixEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridData = Array(rows).fill().map(() => Array(cols).fill(false));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const led = document.createElement('div');
            led.classList.add('led');
            led.dataset.r = r;
            led.dataset.c = c;

            led.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isDrawing = true;
                
                if (currentColor === 'eraser') {
                    drawMode = false;
                } else {
                    const cellValue = gridData[r][c];
                    if (cellValue && cellValue === currentColor) {
                        drawMode = false;
                    } else {
                        drawMode = currentColor;
                    }
                }
                toggleLed(r, c, drawMode, led);
            });

            led.addEventListener('mouseenter', () => {
                if (isDrawing) {
                    toggleLed(r, c, drawMode, led);
                }
            });

            matrixEl.appendChild(led);
        }
    }
}

function toggleLed(r, c, state, el) {
    gridData[r][c] = state;
    if (state) {
        el.classList.add('active');
        const color = state === true ? '#ffffff' : state;
        el.style.backgroundColor = color;
        el.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}99`;
        el.style.borderColor = color;
    } else {
        el.classList.remove('active');
        el.style.backgroundColor = '';
        el.style.boxShadow = '';
        el.style.borderColor = '';
    }
}

function updateDOMFromData() {
    const leds = matrixEl.children;
    let i = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const state = gridData[r][c];
            if (state) {
                leds[i].classList.add('active');
                const color = state === true ? '#ffffff' : state;
                leds[i].style.backgroundColor = color;
                leds[i].style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}, 0 0 20px ${color}99`;
                leds[i].style.borderColor = color;
            } else {
                leds[i].classList.remove('active');
                leds[i].style.backgroundColor = '';
                leds[i].style.boxShadow = '';
                leds[i].style.borderColor = '';
            }
            i++;
        }
    }
}

document.addEventListener('mouseup', () => {
    isDrawing = false;
});

document.addEventListener('mouseleave', () => {
    isDrawing = false;
});

updateBtn.addEventListener('click', () => {
    stopAnimation();
    rows = parseInt(rowsInput.value);
    cols = parseInt(colsInput.value);
    initGrid();
});

clearBtn.addEventListener('click', () => {
    stopAnimation();
    initGrid();
});

// Color Picker and Swatches Handling
const swatches = document.querySelectorAll('.swatch');

function setActiveColor(color, element) {
    currentColor = color;
    swatches.forEach(s => s.classList.remove('active'));
    customColorWrapper.classList.remove('active');

    if (element) {
        element.classList.add('active');
    }
}

swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        const color = swatch.dataset.color;
        setActiveColor(color, swatch);
    });
});

colorPicker.addEventListener('input', (e) => {
    const color = e.target.value;
    customColorWrapper.style.setProperty('--custom-color', color);
    setActiveColor(color, customColorWrapper);
});

colorPicker.addEventListener('change', (e) => {
    const color = e.target.value;
    customColorWrapper.style.setProperty('--custom-color', color);
    setActiveColor(color, customColorWrapper);
});

playBtn.addEventListener('click', () => {
    stopAnimation();
    const type = animType.value;
    matrixEl.className = 'matrix';

    if (type === 'pulse') {
        matrixEl.classList.add('anim-pulse');
    } else if (type === 'flash') {
        matrixEl.classList.add('anim-flash');
    } else if (type === 'scroll-left') {
        originalGridData = gridData.map(row => [...row]);
        animInterval = setInterval(() => {
            for (let r = 0; r < rows; r++) {
                const first = gridData[r].shift();
                gridData[r].push(first);
            }
            updateDOMFromData();
        }, 150);
    }
});

stopBtn.addEventListener('click', stopAnimation);

function stopAnimation() {
    clearInterval(animInterval);
    animInterval = null;
    matrixEl.className = 'matrix';
    if (originalGridData.length > 0) {
        gridData = originalGridData.map(row => [...row]);
        updateDOMFromData();
        originalGridData = [];
    }
}

// JSON Import & Export
exportBtn.addEventListener('click', () => {
    stopAnimation();
    const exportData = {
        grid: {
            rows: rows,
            columns: cols
        },
        pattern: gridData,
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = "glyph-pattern.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', () => {
    stopAnimation();
    importInput.click();
});

importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            
            if (!data.grid || typeof data.grid.rows !== 'number' || typeof data.grid.columns !== 'number' || !Array.isArray(data.pattern)) {
                throw new Error("Invalid format: Must contain grid rows, columns, and pattern array.");
            }

            const importedRows = data.grid.rows;
            const importedCols = data.grid.columns;

            if (importedRows < 8 || importedRows > 32 || importedCols < 8 || importedCols > 32) {
                throw new Error("Invalid dimensions: Grid size must be between 8x8 and 32x32.");
            }

            if (data.pattern.length !== importedRows || !data.pattern.every(row => Array.isArray(row) && row.length === importedCols)) {
                throw new Error("Grid pattern dimensions do not match specified rows/columns.");
            }

            rows = importedRows;
            cols = importedCols;
            rowsInput.value = rows;
            colsInput.value = cols;

            initGrid();
            
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cell = data.pattern[r][c];
                    if (cell === true) {
                        gridData[r][c] = '#ffffff';
                    } else if (typeof cell === 'string' && cell.startsWith('#')) {
                        gridData[r][c] = cell;
                    } else {
                        gridData[r][c] = false;
                    }
                }
            }
            updateDOMFromData();
            importInput.value = '';

        } catch (err) {
            alert("Failed to import JSON: " + err.message);
            importInput.value = '';
        }
    };
    reader.readAsText(file);
});

initGrid();