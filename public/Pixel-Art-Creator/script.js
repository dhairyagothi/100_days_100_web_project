// ==============================
// PIXEL ART CREATOR — script.js
// ==============================

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────────
  let gridSize    = 16;
  let cellSize    = 0;
  let currentColor = '#7c3aed';
  let currentTool = 'draw';
  let isDrawing   = false;
  let brushSize   = 1;
  let showGrid    = true;
  let pixelData   = [];     // flat array of hex colors or null
  let undoStack   = [];
  let redoStack   = [];
  let recentColors = [];
  let drawnPixels = new Set();
  let usedColors  = new Set();
  let lastCell    = { x: -1, y: -1 };

  // ── DOM ────────────────────────────────────────────────────────────
  const pixelCanvas  = document.getElementById('pixel-canvas');
  const gridCanvas   = document.getElementById('grid-canvas');
  const hoverCanvas  = document.getElementById('hover-canvas');
  const previewCanvas = document.getElementById('preview-canvas');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  const colorPicker   = document.getElementById('color-picker');
  const colorPreview  = document.getElementById('color-preview');
  const paletteGrid   = document.getElementById('palette-grid');
  const recentColorsEl = document.getElementById('recent-colors');
  const infoCoords    = document.getElementById('info-coords');
  const infoColor     = document.getElementById('info-color');
  const infoSize      = document.getElementById('info-size');
  const brushLabel    = document.getElementById('brush-size-label');
  const statDrawn     = document.getElementById('stat-drawn');
  const statColors    = document.getElementById('stat-colors');
  const statUndo      = document.getElementById('stat-undo');
  const toastEl       = document.getElementById('toast');
  const modalOverlay  = document.getElementById('modal-overlay');

  const pixCtx    = pixelCanvas.getContext('2d');
  const gridCtx   = gridCanvas.getContext('2d');
  const hoverCtx  = hoverCanvas.getContext('2d');
  const previewCtx = previewCanvas.getContext('2d');

  // ── Default Palette ────────────────────────────────────────────────
  const DEFAULT_PALETTE = [
    '#000000','#ffffff','#6b7280','#d1d5db',
    '#ef4444','#f97316','#f59e0b','#10b981',
    '#06b6d4','#3b82f6','#8b5cf6','#ec4899',
    '#7c3aed','#1d4ed8','#065f46','#7f1d1d',
    '#fef3c7','#dbeafe','#fce7f3','#d1fae5',
  ];

  let palette = [...DEFAULT_PALETTE];

  // ── Init ───────────────────────────────────────────────────────────
  function init() {
    setupCanvasSize();
    initPixelData();
    renderPixels();
    renderGrid();
    buildPalette();
    setColor(currentColor);
    updateStats();
    updatePreview();
    attachEvents();
  }

  function setupCanvasSize() {
    const container = canvasWrapper.parentElement;
    const availW = container.clientWidth  - 40;
    const availH = container.clientHeight - 80;
    const maxDim  = Math.min(availW, availH, 600);
    cellSize = Math.floor(maxDim / gridSize);
    const canvasW = cellSize * gridSize;
    const canvasH = cellSize * gridSize;

    [pixelCanvas, gridCanvas, hoverCanvas].forEach(c => {
      c.width  = canvasW;
      c.height = canvasH;
      c.style.width  = canvasW + 'px';
      c.style.height = canvasH + 'px';
    });

    canvasWrapper.style.width  = canvasW + 'px';
    canvasWrapper.style.height = canvasH + 'px';

    previewCanvas.width  = gridSize;
    previewCanvas.height = gridSize;
    previewCanvas.style.width  = '100%';
    previewCanvas.style.height = 'auto';

    infoSize.textContent = `${gridSize} × ${gridSize}`;
  }

  function initPixelData(keepExisting = false) {
    if (!keepExisting) {
      pixelData = new Array(gridSize * gridSize).fill(null);
    }
  }

  // ── Rendering ─────────────────────────────────────────────────────
  function renderPixels() {
    pixCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    // Transparent checkerboard background
    const s = cellSize;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const color = pixelData[y * gridSize + x];
        if (color) {
          pixCtx.fillStyle = color;
          pixCtx.fillRect(x * s, y * s, s, s);
        } else {
          // checkerboard
          const even = (x + y) % 2 === 0;
          pixCtx.fillStyle = even ? '#1a1a2e' : '#16162a';
          pixCtx.fillRect(x * s, y * s, s, s);
        }
      }
    }
  }

  function renderGrid() {
    gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    if (!showGrid) return;
    gridCtx.strokeStyle = 'rgba(255,255,255,0.06)';
    gridCtx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      gridCtx.beginPath();
      gridCtx.moveTo(i * cellSize, 0);
      gridCtx.lineTo(i * cellSize, gridCanvas.height);
      gridCtx.stroke();
      gridCtx.beginPath();
      gridCtx.moveTo(0, i * cellSize);
      gridCtx.lineTo(gridCanvas.width, i * cellSize);
      gridCtx.stroke();
    }
  }

  function renderHover(cx, cy) {
    hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
    if (cx < 0 || cy < 0 || cx >= gridSize || cy >= gridSize) return;
    const half = Math.floor(brushSize / 2);
    for (let dy = -half; dy <= half; dy++) {
      for (let dx = -half; dx <= half; dx++) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) continue;
        if (currentTool === 'erase') {
          hoverCtx.strokeStyle = 'rgba(255,100,100,0.6)';
          hoverCtx.lineWidth = 1.5;
          hoverCtx.strokeRect(nx * cellSize + 1, ny * cellSize + 1, cellSize - 2, cellSize - 2);
        } else {
          hoverCtx.fillStyle = currentTool === 'eyedrop' ? 'rgba(255,255,255,0.15)' : hexToRgba(currentColor, 0.5);
          hoverCtx.fillRect(nx * cellSize, ny * cellSize, cellSize, cellSize);
          hoverCtx.strokeStyle = 'rgba(255,255,255,0.4)';
          hoverCtx.lineWidth = 1;
          hoverCtx.strokeRect(nx * cellSize + 0.5, ny * cellSize + 0.5, cellSize - 1, cellSize - 1);
        }
      }
    }
  }

  function updatePreview() {
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const color = pixelData[y * gridSize + x];
        if (color) {
          previewCtx.fillStyle = color;
          previewCtx.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  function updateStats() {
    const drawn = pixelData.filter(c => c !== null).length;
    const colors = new Set(pixelData.filter(Boolean)).size;
    statDrawn.textContent  = drawn;
    statColors.textContent = colors;
    statUndo.textContent   = undoStack.length;
  }

  // ── Color ──────────────────────────────────────────────────────────
  function setColor(hex) {
    currentColor = hex;
    colorPreview.style.background = hex;
    colorPicker.value = hex;
    // update palette active
    document.querySelectorAll('.palette-color').forEach(el => {
      el.classList.toggle('active', el.dataset.color === hex);
    });
  }

  function addToRecent(hex) {
    if (recentColors[0] === hex) return;
    recentColors = [hex, ...recentColors.filter(c => c !== hex)].slice(0, 10);
    renderRecentColors();
  }

  function renderRecentColors() {
    recentColorsEl.innerHTML = '';
    recentColors.forEach(c => {
      const dot = document.createElement('div');
      dot.className = 'recent-color-dot';
      dot.style.background = c;
      dot.title = c;
      dot.addEventListener('click', () => setColor(c));
      recentColorsEl.appendChild(dot);
    });
  }

  // ── Palette ────────────────────────────────────────────────────────
  function buildPalette() {
    paletteGrid.innerHTML = '';
    palette.forEach(c => {
      const el = document.createElement('div');
      el.className = 'palette-color';
      el.style.background = c;
      el.dataset.color = c;
      el.title = c;
      if (c === currentColor) el.classList.add('active');
      el.addEventListener('click', () => { setColor(c); });
      paletteGrid.appendChild(el);
    });
  }

  // ── Drawing ────────────────────────────────────────────────────────
  function getCellCoords(e) {
    const rect = hoverCanvas.getBoundingClientRect();
    const scaleX = hoverCanvas.width / rect.width;
    const scaleY = hoverCanvas.height / rect.height;
    let cx, cy;
    if (e.touches) {
      cx = Math.floor(((e.touches[0].clientX - rect.left) * scaleX) / cellSize);
      cy = Math.floor(((e.touches[0].clientY - rect.top)  * scaleY) / cellSize);
    } else {
      cx = Math.floor(((e.clientX - rect.left) * scaleX) / cellSize);
      cy = Math.floor(((e.clientY - rect.top)  * scaleY) / cellSize);
    }
    return { cx, cy };
  }

  function applyPencilAt(cx, cy) {
    const half = Math.floor(brushSize / 2);
    for (let dy = -half; dy <= half; dy++) {
      for (let dx = -half; dx <= half; dx++) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize) continue;
        pixelData[ny * gridSize + nx] = currentTool === 'erase' ? null : currentColor;
      }
    }
    if (currentTool !== 'erase') {
      addToRecent(currentColor);
      usedColors.add(currentColor);
      drawnPixels.add(`${cx},${cy}`);
    }
  }

  function floodFill(startX, startY, fillColor) {
    const targetColor = pixelData[startY * gridSize + startX];
    if (targetColor === fillColor) return;
    const stack = [[startX, startY]];
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) continue;
      if (pixelData[y * gridSize + x] !== targetColor) continue;
      pixelData[y * gridSize + x] = fillColor;
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }

  function eyedrop(cx, cy) {
    const c = pixelData[cy * gridSize + cx];
    if (c) { setColor(c); showToast(`Color picked: ${c}`); }
  }

  // ── Undo / Redo ────────────────────────────────────────────────────
  function pushUndo() {
    undoStack.push([...pixelData]);
    redoStack = [];
    if (undoStack.length > 50) undoStack.shift();
  }

  function undo() {
    if (!undoStack.length) { showToast('Nothing to undo'); return; }
    redoStack.push([...pixelData]);
    pixelData = undoStack.pop();
    renderPixels();
    updatePreview();
    updateStats();
  }

  function redo() {
    if (!redoStack.length) { showToast('Nothing to redo'); return; }
    undoStack.push([...pixelData]);
    pixelData = redoStack.pop();
    renderPixels();
    updatePreview();
    updateStats();
  }

  // ── Download ───────────────────────────────────────────────────────
  function download() {
    const exportCanvas = document.createElement('canvas');
    const scale = 16; // export at 256px for 16×16
    exportCanvas.width  = gridSize * scale;
    exportCanvas.height = gridSize * scale;
    const ctx = exportCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const color = pixelData[y * gridSize + x];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    }
    const link = document.createElement('a');
    link.download = `pixelcraft-${gridSize}x${gridSize}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
    showToast('🎨 Artwork downloaded!');
  }

  // ── Templates ──────────────────────────────────────────────────────
  function applyTemplate(name) {
    if (gridSize < 16) { showToast('Use 16×16 or larger for templates'); return; }
    pushUndo();
    const cx = Math.floor(gridSize / 2);
    const cy = Math.floor(gridSize / 2);

    if (name === 'heart') {
      const pattern = [
        ' XX  XX ',
        'XXXXXXXX',
        'XXXXXXXX',
        ' XXXXXX ',
        '  XXXX  ',
        '   XX   ',
      ];
      const colors = ['#ef4444'];
      const ox = cx - 4, oy = cy - 3;
      pattern.forEach((row, dy) => {
        [...row].forEach((ch, dx) => {
          const px = ox + dx, py = oy + dy;
          if (px >= 0 && px < gridSize && py >= 0 && py < gridSize && ch === 'X') {
            pixelData[py * gridSize + px] = colors[0];
          }
        });
      });
    }

    if (name === 'star') {
      const pattern = [
        '   X   ',
        '  XXX  ',
        'XXXXXXX',
        ' XXXXX ',
        '  X X  ',
        ' X   X ',
      ];
      const ox = cx - 3, oy = cy - 3;
      pattern.forEach((row, dy) => {
        [...row].forEach((ch, dx) => {
          const px = ox + dx, py = oy + dy;
          if (px >= 0 && px < gridSize && py >= 0 && py < gridSize && ch === 'X') {
            pixelData[py * gridSize + px] = '#f59e0b';
          }
        });
      });
    }

    if (name === 'smiley') {
      // draw circle face
      const r = Math.floor(gridSize / 2) - 1;
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const dist = Math.sqrt((x - cx + 0.5) ** 2 + (y - cy + 0.5) ** 2);
          if (dist <= r) pixelData[y * gridSize + x] = '#f59e0b';
          if (dist >= r - 0.5 && dist <= r) pixelData[y * gridSize + x] = '#d97706';
        }
      }
      // eyes
      const eyeY = cy - Math.floor(gridSize * 0.12);
      const eyeX1 = cx - Math.floor(gridSize * 0.2);
      const eyeX2 = cx + Math.floor(gridSize * 0.2);
      [eyeX1, eyeX2].forEach(ex => {
        pixelData[eyeY * gridSize + ex] = '#1a1a2e';
        pixelData[(eyeY + 1) * gridSize + ex] = '#1a1a2e';
      });
      // smile
      const smileY = cy + Math.floor(gridSize * 0.15);
      for (let dx = -Math.floor(gridSize * 0.2); dx <= Math.floor(gridSize * 0.2); dx++) {
        const px = cx + dx;
        const py = smileY + Math.floor((dx * dx) / (gridSize * 0.15));
        if (px >= 0 && px < gridSize && py >= 0 && py < gridSize) {
          pixelData[py * gridSize + px] = '#1a1a2e';
        }
      }
    }

    if (name === 'rainbow') {
      const colors = ['#ef4444','#f97316','#f59e0b','#10b981','#06b6d4','#8b5cf6','#ec4899'];
      const stripeH = Math.ceil(gridSize / colors.length);
      colors.forEach((c, i) => {
        for (let y = i * stripeH; y < Math.min((i + 1) * stripeH, gridSize); y++) {
          for (let x = 0; x < gridSize; x++) {
            pixelData[y * gridSize + x] = c;
          }
        }
      });
    }

    renderPixels();
    updatePreview();
    updateStats();
    showToast(`Template "${name}" applied!`);
  }

  // ── Toast ──────────────────────────────────────────────────────────
  let toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  // ── Events ─────────────────────────────────────────────────────────
  function attachEvents() {

    // Canvas mouse
    hoverCanvas.addEventListener('mousedown', onMouseDown);
    hoverCanvas.addEventListener('mousemove', onMouseMove);
    hoverCanvas.addEventListener('mouseup',   onMouseUp);
    hoverCanvas.addEventListener('mouseleave', onMouseLeave);

    // Canvas touch
    hoverCanvas.addEventListener('touchstart',  onTouchStart,  { passive: false });
    hoverCanvas.addEventListener('touchmove',   onTouchMove,   { passive: false });
    hoverCanvas.addEventListener('touchend',    onMouseUp);

    // Tools
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTool = btn.dataset.tool;
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Color picker
    colorPreview.addEventListener('click', () => colorPicker.click());
    colorPicker.addEventListener('input',  () => setColor(colorPicker.value));

    // Add color
    document.getElementById('btn-add-color').addEventListener('click', () => {
      colorPicker.click();
      colorPicker.addEventListener('change', () => {
        if (!palette.includes(colorPicker.value)) {
          palette.push(colorPicker.value);
          buildPalette();
        }
        setColor(colorPicker.value);
      }, { once: true });
    });

    // Grid size
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gridSize = parseInt(btn.dataset.size);
        pushUndo();
        setupCanvasSize();
        initPixelData(false);
        renderPixels();
        renderGrid();
        updatePreview();
        updateStats();
        showToast(`Canvas: ${gridSize}×${gridSize}`);
      });
    });

    // Actions
    document.getElementById('btn-undo').addEventListener('click', undo);
    document.getElementById('btn-redo').addEventListener('click', redo);

    document.getElementById('btn-clear').addEventListener('click', () => {
      pushUndo();
      pixelData = new Array(gridSize * gridSize).fill(null);
      renderPixels();
      updatePreview();
      updateStats();
      showToast('Canvas cleared');
    });

    document.getElementById('btn-toggle-grid').addEventListener('click', () => {
      showGrid = !showGrid;
      renderGrid();
      showToast(showGrid ? 'Grid lines on' : 'Grid lines off');
    });

    // Brush size
    const brushInput = document.getElementById('brush-size');
    brushInput.addEventListener('input', () => {
      brushSize = parseInt(brushInput.value);
      brushLabel.textContent = brushSize + 'px';
    });

    // Download
    document.getElementById('btn-download').addEventListener('click', download);

    // New
    document.getElementById('btn-new').addEventListener('click', () => {
      modalOverlay.classList.add('show');
    });
    document.getElementById('modal-cancel').addEventListener('click', () => {
      modalOverlay.classList.remove('show');
    });
    document.getElementById('modal-confirm').addEventListener('click', () => {
      modalOverlay.classList.remove('show');
      undoStack = []; redoStack = [];
      pixelData = new Array(gridSize * gridSize).fill(null);
      renderPixels();
      updatePreview();
      updateStats();
      showToast('New canvas ready!');
    });

    // Templates
    document.querySelectorAll('.template-btn').forEach(btn => {
      btn.addEventListener('click', () => applyTemplate(btn.dataset.template));
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT') return;
      const key = e.key.toLowerCase();
      if (e.ctrlKey && key === 'z') { e.preventDefault(); undo(); }
      if (e.ctrlKey && key === 'y') { e.preventDefault(); redo(); }
      if (key === 'd') { setActiveTool('draw'); }
      if (key === 'f') { setActiveTool('fill'); }
      if (key === 'e') { setActiveTool('erase'); }
      if (key === 'i') { setActiveTool('eyedrop'); }
    });

    // Window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupCanvasSize();
        renderPixels();
        renderGrid();
      }, 200);
    });
  }

  function setActiveTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tool === tool);
    });
  }

  // ── Mouse/Touch Handlers ──────────────────────────────────────────
  function onMouseDown(e) {
    e.preventDefault();
    const { cx, cy } = getCellCoords(e);
    if (cx < 0 || cy < 0 || cx >= gridSize || cy >= gridSize) return;

    if (currentTool === 'eyedrop') {
      eyedrop(cx, cy);
      return;
    }
    if (currentTool === 'fill') {
      pushUndo();
      floodFill(cx, cy, currentColor);
      addToRecent(currentColor);
      renderPixels();
      updatePreview();
      updateStats();
      return;
    }

    isDrawing = true;
    pushUndo();
    applyPencilAt(cx, cy);
    renderPixels();
    updatePreview();
    updateStats();
    lastCell = { x: cx, y: cy };
  }

  function onMouseMove(e) {
    const { cx, cy } = getCellCoords(e);
    infoCoords.textContent = (cx >= 0 && cy >= 0 && cx < gridSize && cy < gridSize)
      ? `x: ${cx + 1}  y: ${cy + 1}` : 'x: —  y: —';
    const cellColor = (cx >= 0 && cy >= 0 && cx < gridSize && cy < gridSize)
      ? (pixelData[cy * gridSize + cx] || '—') : '—';
    infoColor.textContent = 'Color: ' + cellColor;

    renderHover(cx, cy);

    if (!isDrawing) return;
    if (cx === lastCell.x && cy === lastCell.y) return;
    if (cx < 0 || cy < 0 || cx >= gridSize || cy >= gridSize) return;
    if (currentTool === 'eyedrop' || currentTool === 'fill') return;

    applyPencilAt(cx, cy);
    renderPixels();
    updatePreview();
    updateStats();
    lastCell = { x: cx, y: cy };
  }

  function onMouseUp() {
    isDrawing = false;
  }

  function onMouseLeave() {
    isDrawing = false;
    hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
    infoCoords.textContent = 'x: —  y: —';
    infoColor.textContent  = 'Color: —';
  }

  function onTouchStart(e) {
    e.preventDefault();
    onMouseDown(e);
  }

  function onTouchMove(e) {
    e.preventDefault();
    onMouseMove(e);
  }

  // ── Helpers ────────────────────────────────────────────────────────
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // ── Start ──────────────────────────────────────────────────────────
  init();

})();
