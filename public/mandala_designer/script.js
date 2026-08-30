const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');

// UI Controls Selectors
const axesSlider = document.getElementById('axesSlider');
const axesValue = document.getElementById('axesValue');
const sizeSlider = document.getElementById('sizeSlider');
const sizeValue = document.getElementById('sizeValue');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');
const neonRainbowBtn = document.getElementById('neonRainbowBtn');
const solidColorBtn = document.getElementById('solidColorBtn');
const customColorPicker = document.getElementById('customColorPicker');

// Configuration States Matrices
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hueCounter = 0;
let undoHistory = [];
const MAX_UNDO_STATES = 25;

let settings = {
    axes: parseInt(axesSlider.value),
    thickness: parseInt(sizeSlider.value),
    colorMode: 'rainbow', 
    solidColor: customColorPicker.value
};

let centerX = 0;
let centerY = 0;
let cssWidth = 0;
let cssHeight = 0;

// High-DPI Display Scaler Core Engine (Guarantees Crisp Lines & Full Area Coverage)
function resizeCanvas() {
    const container = canvas.parentElement;
    
    // Dynamically calculate the maximum available space inside the centered workspace wrapper
    const maxSize = Math.min(container.clientWidth, container.clientHeight);
    
    cssWidth = maxSize;
    cssHeight = maxSize;
    
    // Assign structural square size styling metrics
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    
    const dpr = window.devicePixelRatio || 1;
    
    // Enforce perfect pixel mapping against device target ratios
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    
    ctx.scale(dpr, dpr);
    
    // --- SHARPNESS ENHANCEMENT: Disable Context Alpha Blending Blur States ---
    ctx.imageSmoothingEnabled = false;
    
    centerX = cssWidth / 2;
    centerY = cssHeight / 2;
    
    if (undoHistory.length > 0) {
        restoreFromHistoryState(undoHistory[undoHistory.length - 1]);
    } else {
        clearWorkspace();
    }
}

function clearWorkspace() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cssWidth, cssHeight);
    drawCenterAnchorPoint();
}

function drawCenterAnchorPoint() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fill();
    ctx.restore();
}

// Intercept vector points relative to layout transformations
function getCanvasPointers(e) {
    const rect = canvas.getBoundingClientRect();
    
    if (e.touches && e.touches.length > 0) {
        return {
            x: ((e.touches[0].clientX - rect.left) / rect.width) * cssWidth,
            y: ((e.touches[0].clientY - rect.top) / rect.height) * cssHeight
        };
    }
    return {
        x: ((e.clientX - rect.left) / rect.width) * cssWidth,
        y: ((e.clientY - rect.top) / rect.height) * cssHeight
    };
}

function getBrushColor() {
    if (settings.colorMode === 'solid') {
        return settings.solidColor;
    } else {
        hueCounter = (hueCounter + 0.6) % 360;
        return `hsl(${hueCounter}, 100%, 60%)`;
    }
}

// Master Symmetric Matrix Vector Rotator Loops
function drawSymmetricPath(x1, y1, x2, y2) {
    const angleIncrement = (Math.PI * 2) / settings.axes;
    const brushColor = getBrushColor();

    ctx.save();
    ctx.translate(centerX, centerY);

    for (let i = 0; i < settings.axes; i++) {
        ctx.beginPath();
        ctx.moveTo(x1 - centerX, y1 - centerY);
        ctx.lineTo(x2 - centerX, y2 - centerY);
        
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = settings.thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // --- FIXED: BLUR REMOVAL ---
        // Completely removed ctx.shadowBlur and ctx.shadowColor to eliminate the fuzzy glowing mist.
        // This forces the browser to render hard, clean, razor-sharp solid vector edges.
        
        ctx.stroke();

        // Secondary Kaleidoscope Balance Mirrored Flips
        ctx.save();
        ctx.scale(1, -1);
        ctx.beginPath();
        ctx.moveTo(x1 - centerX, y1 - centerY);
        ctx.lineTo(x2 - centerX, y2 - centerY);
        ctx.stroke();
        ctx.restore();

        ctx.rotate(angleIncrement);
    }
    ctx.restore();
}

// Undo Frame History Manager Stacks
function pushCurrentStateToHistory() {
    if (undoHistory.length >= MAX_UNDO_STATES) {
        undoHistory.shift();
    }
    undoHistory.push(canvas.toDataURL());
}

function performUndo() {
    if (undoHistory.length <= 1) {
        undoHistory = [];
        clearWorkspace();
        return;
    }
    undoHistory.pop();
    const previousStateDataUrl = undoHistory[undoHistory.length - 1];
    restoreFromHistoryState(previousStateDataUrl);
}

function restoreFromHistoryState(dataUrl) {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
        drawCenterAnchorPoint();
    };
}

// Mouse and Touch Interaction Handlers
function startDrawing(e) {
    isDrawing = true;
    const coords = getCanvasPointers(e);
    lastX = coords.x;
    lastY = coords.y;
}

// Fixed line segmentation rendering handler
function paintStroke(e) {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();

    const coords = getCanvasPointers(e);
    drawSymmetricPath(lastX, lastY, coords.x, coords.y);
    
    lastX = coords.x;
    lastY = coords.y;
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        pushCurrentStateToHistory();
        drawCenterAnchorPoint();
    }
}

function exportAsPngFile() {
    const link = document.createElement('a');
    link.download = `mandala-vector-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    drawCenterAnchorPoint();
}

// UI Realtime Slider Configuration Monitors
axesSlider.addEventListener('input', (e) => {
    settings.axes = parseInt(e.target.value);
    axesValue.textContent = `${settings.axes} Axes`;
});

sizeSlider.addEventListener('input', (e) => {
    settings.thickness = parseInt(e.target.value);
    sizeValue.textContent = `${settings.thickness}px`;
});

// Color Selector Actions
neonRainbowBtn.addEventListener('click', () => {
    settings.colorMode = 'rainbow';
    neonRainbowBtn.classList.add('active');
    solidColorBtn.classList.remove('active');
});

solidColorBtn.addEventListener('click', () => {
    settings.colorMode = 'solid';
    solidColorBtn.classList.add('active');
    neonRainbowBtn.classList.remove('active');
});

customColorPicker.addEventListener('input', (e) => {
    settings.solidColor = e.target.value;
    settings.colorMode = 'solid';
    solidColorBtn.classList.add('active');
    neonRainbowBtn.classList.remove('active');
});

// Global Trigger Assignments
clearBtn.addEventListener('click', () => {
    undoHistory = [];
    clearWorkspace();
});
undoBtn.addEventListener('click', performUndo);
exportBtn.addEventListener('click', exportAsPngFile);

// Desktop Key Listeners Mapping (Standard Ctrl + Z Hooks)
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        performUndo();
    }
});

// Mouse Listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', paintStroke);
window.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Mobile Device Event Bindings
canvas.addEventListener('touchstart', (e) => { startDrawing(e); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { paintStroke(e); }, { passive: false });
window.addEventListener('touchend', stopDrawing);

// Run initialization listeners layout triggers on load cycles
window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', resizeCanvas);