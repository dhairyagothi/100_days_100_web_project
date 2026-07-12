/**
 * Pixel Art Lab
 * Fully interactive grid-drawing tool exporting sharp pixel pngs.
 */

// ===== State =====
const state = {
  tool: 'draw', // 'draw' or 'erase'
  color: '#00f2fe',
  size: 16, // 8, 16, 32
  gridlines: true,
  isDrawing: false,
};

// ===== Pre-defined Quick Palette Swatches =====
const swatches = [
  '#00f2fe', // Cyan
  '#9b51e0', // Purple
  '#f857a6', // Pink
  '#2ecc71', // Green
  '#f1c40f', // Yellow
  '#e74c3c', // Red
  '#ffffff', // White
  '#11101e', // Dark Gray
];

// ===== DOM References =====
const dom = {
  grid: document.getElementById('pixel-grid'),
  btnDraw: document.getElementById('btn-draw'),
  btnErase: document.getElementById('btn-erase'),
  btnClear: document.getElementById('btn-clear'),
  btnExport: document.getElementById('btn-export'),
  btnToggleGridlines: document.getElementById('btn-toggle-gridlines'),
  paintColor: document.getElementById('paint-color'),
  paintHex: document.getElementById('paint-hex'),
  colorSwatches: document.getElementById('color-swatches'),
  gridSize: document.getElementById('grid-size'),
  toast: document.getElementById('toast'),
  toastText: document.getElementById('toast-text'),
};

// ===== Toast Helper =====
const showToast = (message) => {
  dom.toastText.textContent = message;
  dom.toast.classList.add('toast--visible');
  setTimeout(() => {
    dom.toast.classList.remove('toast--visible');
  }, 2200);
};

// ===== Swatches Creation =====
const renderSwatches = () => {
  dom.colorSwatches.innerHTML = '';
  swatches.forEach((color) => {
    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = color;
    swatch.setAttribute('role', 'option');
    swatch.setAttribute('aria-label', `Quick select color ${color}`);
    swatch.addEventListener('click', () => {
      state.color = color;
      dom.paintColor.value = color;
      dom.paintHex.textContent = color;
    });
    dom.colorSwatches.appendChild(swatch);
  });
};

// ===== Interactive Grid Setup =====

const renderGrid = () => {
  dom.grid.innerHTML = '';
  // Set dimensions dynamically in CSS grid style variables
  dom.grid.style.gridTemplateColumns = `repeat(${state.size}, 1fr)`;
  dom.grid.style.gridTemplateRows = `repeat(${state.size}, 1fr)`;

  if (state.gridlines) {
    dom.grid.classList.add('pixel-grid--gridlines');
  } else {
    dom.grid.classList.remove('pixel-grid--gridlines');
  }

  const numCells = state.size * state.size;

  for (let i = 0; i < numCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'pixel-cell';
    cell.setAttribute('role', 'gridcell');

    // Drawing action hooks
    cell.addEventListener('mousedown', (e) => {
      e.preventDefault();
      state.isDrawing = true;
      paintCell(cell);
    });

    cell.addEventListener('mouseenter', () => {
      if (state.isDrawing) {
        paintCell(cell);
      }
    });

    dom.grid.appendChild(cell);
  }
};

const paintCell = (cell) => {
  if (state.tool === 'draw') {
    cell.style.backgroundColor = state.color;
  } else {
    cell.style.backgroundColor = 'transparent';
  }
};

// ===== Clear Grid =====
const clearCanvas = () => {
  const cells = dom.grid.querySelectorAll('.pixel-cell');
  cells.forEach((cell) => {
    cell.style.backgroundColor = 'transparent';
  });
  showToast('Canvas cleared!');
};

// ===== High-Quality Sharp PNG Export =====

const exportPNG = () => {
  const cells = dom.grid.querySelectorAll('.pixel-cell');

  // Set export scaling (e.g. 512px canvas for sharp pixel look)
  const canvasSize = 512;
  const cellSize = canvasSize / state.size;

  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');

  // Disable image smoothing for sharp pixels
  ctx.imageSmoothingEnabled = false;

  // Render cells sequentially onto canvas
  cells.forEach((cell, index) => {
    const row = Math.floor(index / state.size);
    const col = index % state.size;

    const bgColor = cell.style.backgroundColor;

    if (bgColor && bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  });

  try {
    const link = document.createElement('a');
    link.download = `pixel-art-${state.size}x${state.size}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Pixel art downloaded! 👾');
  } catch (err) {
    console.error('PNG export failed:', err);
    showToast('Failed to export image.');
  }
};

// ===== Event Listeners =====

const initListeners = () => {
  // Global drag stop
  window.addEventListener('mouseup', () => {
    state.isDrawing = false;
  });

  // Tool bindings
  dom.btnDraw.addEventListener('click', () => {
    state.tool = 'draw';
    dom.btnDraw.classList.add('btn--active');
    dom.btnErase.classList.remove('btn--active');
  });

  dom.btnErase.addEventListener('click', () => {
    state.tool = 'erase';
    dom.btnErase.classList.add('btn--active');
    dom.btnDraw.classList.remove('btn--active');
  });

  // Action listeners
  dom.btnClear.addEventListener('click', clearCanvas);
  dom.btnExport.addEventListener('click', exportPNG);

  // Border toggle
  dom.btnToggleGridlines.addEventListener('click', () => {
    state.gridlines = !state.gridlines;
    if (state.gridlines) {
      dom.grid.classList.add('pixel-grid--gridlines');
    } else {
      dom.grid.classList.remove('pixel-grid--gridlines');
    }
    showToast(state.gridlines ? 'Gridlines enabled' : 'Gridlines disabled');
  });

  // Dropdown sizing
  dom.gridSize.addEventListener('change', (e) => {
    state.size = parseInt(e.target.value, 10);
    renderGrid();
    showToast(`Resized to ${state.size}x${state.size}!`);
  });

  // Color picker
  dom.paintColor.addEventListener('input', (e) => {
    state.color = e.target.value;
    dom.paintHex.textContent = e.target.value;
  });
};

// ===== App Init =====
const init = () => {
  renderSwatches();
  renderGrid();
  initListeners();
};

document.addEventListener('DOMContentLoaded', init);
