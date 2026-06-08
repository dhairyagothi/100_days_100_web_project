const matrixEl = document.getElementById('matrix');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const updateBtn = document.getElementById('update-size');
const clearBtn = document.getElementById('clear-btn');
const animType = document.getElementById('anim-type');
const playBtn = document.getElementById('play-btn');
const stopBtn = document.getElementById('stop-btn');
const exportBtn = document.getElementById('export-btn');

let rows = parseInt(rowsInput.value);
let cols = parseInt(colsInput.value);
let gridData = [];
let isDrawing = false;
let drawMode = true;
let animInterval = null;
let originalGridData = [];

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
                drawMode = !gridData[r][c];
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
    } else {
        el.classList.remove('active');
    }
}

function updateDOMFromData() {
    const leds = matrixEl.children;
    let i = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (gridData[r][c]) {
                leds[i].classList.add('active');
            } else {
                leds[i].classList.remove('active');
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

initGrid();