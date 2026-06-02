// Pixel Art Studio Core Engine
const AppState = {
  size: 16,
  zoom: 20,
  tool: "pencil",
  primaryColor: "#ffffff",
  secondaryColor: "#000000",
  brushSize: 1,
  isDrawing: false,
  frames: [],
  currentFrame: 0,
  layers: [{ id: 1, name: "Layer 1", visible: true, data: null }],
  currentLayer: 1,
  history: [],
  historyIndex: -1,
  isPlaying: false,
  fps: 8,
  onionSkin: false,
};

const UI = {
  canvas: document.getElementById("pixelCanvas"),
  ctx: document.getElementById("pixelCanvas").getContext("2d"),
  gridOverlay: document.getElementById("gridOverlay"),
  gridCtx: document.getElementById("gridOverlay").getContext("2d"),
  previewOverlay: document.getElementById("previewOverlay"),
  previewCtx: document.getElementById("previewOverlay").getContext("2d"),
  previewCanvas: document.getElementById("previewCanvas"),
  pCtx: document.getElementById("previewCanvas").getContext("2d"),
};

let startX, startY;
const channel = new BroadcastChannel("pixel_art_collab");

function init() {
  setupCanvas();
  generatePalette();
  addFrame();
  bindEvents();
  drawGrid();
  updateUI();

  // Collab
  channel.onmessage = (e) => {
    if (e.data.type === "sync") {
      const img = new Image();
      img.onload = () => {
        UI.ctx.clearRect(0, 0, UI.canvas.width, UI.canvas.height);
        UI.ctx.drawImage(img, 0, 0);
        saveState(false);
      };
      img.src = e.data.payload;
    }
  };
}

function setupCanvas() {
  const size = AppState.size;
  const zoom = AppState.zoom;
  UI.canvas.width = size;
  UI.canvas.height = size;
  UI.gridOverlay.width = size * zoom;
  UI.gridOverlay.height = size * zoom;
  UI.previewOverlay.width = size * zoom;
  UI.previewOverlay.height = size * zoom;
  UI.ctx.imageSmoothingEnabled = false;

  // Style sizing
  const pxSize = size * zoom;
  UI.canvas.style.width = `${pxSize}px`;
  UI.canvas.style.height = `${pxSize}px`;

  document.getElementById("canvasSize").value = size;
}

function drawGrid() {
  UI.gridCtx.clearRect(0, 0, UI.gridOverlay.width, UI.gridOverlay.height);
  if (AppState.zoom < 3) return; // Too small for grid

  UI.gridCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  UI.gridCtx.lineWidth = 1;
  UI.gridCtx.beginPath();
  for (let x = 0; x <= AppState.size; x++) {
    UI.gridCtx.moveTo(x * AppState.zoom, 0);
    UI.gridCtx.lineTo(x * AppState.zoom, AppState.size * AppState.zoom);
  }
  for (let y = 0; y <= AppState.size; y++) {
    UI.gridCtx.moveTo(0, y * AppState.zoom);
    UI.gridCtx.lineTo(AppState.size * AppState.zoom, y * AppState.zoom);
  }
  UI.gridCtx.stroke();
}

function updateUI() {
  document.getElementById("zoomLevel").innerText = `${AppState.zoom * 10}%`;
  document.getElementById("primaryColor").style.background =
    AppState.primaryColor;
  document.getElementById("secondaryColor").style.background =
    AppState.secondaryColor;
  document
    .querySelectorAll(".tool-btn")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.tool === AppState.tool),
    );
  renderTimeline();
}

function bindEvents() {
  document.getElementById("canvasSize").addEventListener("change", (e) => {
    AppState.size = parseInt(e.target.value);
    AppState.zoom = Math.max(1, Math.floor(600 / AppState.size));
    setupCanvas();
    drawGrid();
  });

  document.getElementById("btnZoomIn").addEventListener("click", () => {
    AppState.zoom++;
    updateCanvasZoom();
  });
  document.getElementById("btnZoomOut").addEventListener("click", () => {
    if (AppState.zoom > 1) {
      AppState.zoom--;
      updateCanvasZoom();
    }
  });

  document.querySelectorAll(".tool-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      AppState.tool = e.currentTarget.dataset.tool;
      updateUI();
    });
  });

  document.getElementById("colorPicker").addEventListener("input", (e) => {
    AppState.primaryColor = e.target.value;
    updateUI();
  });

  document.getElementById("btnSwapColors").addEventListener("click", () => {
    [AppState.primaryColor, AppState.secondaryColor] = [
      AppState.secondaryColor,
      AppState.primaryColor,
    ];
    updateUI();
  });

  // Mouse events
  const container = document.getElementById("canvasContainer");
  container.addEventListener("mousedown", handlePointerDown);
  container.addEventListener("mousemove", handlePointerMove);
  window.addEventListener("mouseup", handlePointerUp);

  // Timeline
  document.getElementById("btnAddFrame").addEventListener("click", addFrame);
  document
    .getElementById("btnPrevFrame")
    .addEventListener("click", () => selectFrame(AppState.currentFrame - 1));
  document
    .getElementById("btnNextFrame")
    .addEventListener("click", () => selectFrame(AppState.currentFrame + 1));
  document.getElementById("btnPlayAnim").addEventListener("click", togglePlay);

  // Undo/redo
  document.getElementById("btnUndo").addEventListener("click", undo);
  document.getElementById("btnRedo").addEventListener("click", redo);

  // Keyboard
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "z") {
      e.preventDefault();
      undo();
    }
    if (e.ctrlKey && e.key === "y") {
      e.preventDefault();
      redo();
    }
    if (e.key === "p") AppState.tool = "pencil";
    if (e.key === "e") AppState.tool = "eraser";
    if (e.key === "g") AppState.tool = "fill";
    if (e.key === "i") AppState.tool = "eyedropper";
    if (["p", "e", "g", "i"].includes(e.key)) updateUI();
  });

  // Export
  document.getElementById("btnExportPng").addEventListener("click", exportPNG);
}

function updateCanvasZoom() {
  const pxSize = AppState.size * AppState.zoom;
  UI.canvas.style.width = `${pxSize}px`;
  UI.canvas.style.height = `${pxSize}px`;
  UI.gridOverlay.width = pxSize;
  UI.gridOverlay.height = pxSize;
  UI.previewOverlay.width = pxSize;
  UI.previewOverlay.height = pxSize;
  drawGrid();
  updateUI();
}

function getPos(e) {
  const rect = UI.gridOverlay.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / AppState.zoom);
  const y = Math.floor((e.clientY - rect.top) / AppState.zoom);
  return { x, y };
}

function handlePointerDown(e) {
  if (e.button !== 0 && e.button !== 2) return;
  AppState.isDrawing = true;
  const { x, y } = getPos(e);
  startX = x;
  startY = y;

  const color =
    e.button === 2 ? AppState.secondaryColor : AppState.primaryColor;

  if (AppState.tool === "pencil") drawPixel(x, y, color);
  else if (AppState.tool === "eraser") drawPixel(x, y, null);
  else if (AppState.tool === "fill") floodFill(x, y, color);
  else if (AppState.tool === "eyedropper") pickColor(x, y, e.button === 2);
}

function handlePointerMove(e) {
  const { x, y } = getPos(e);
  document.getElementById("cursorPos").innerText = `${x}, ${y}`;

  if (!AppState.isDrawing) return;
  const color =
    e.buttons === 2 ? AppState.secondaryColor : AppState.primaryColor;

  if (AppState.tool === "pencil") drawPixel(x, y, color);
  else if (AppState.tool === "eraser") drawPixel(x, y, null);
}

function handlePointerUp() {
  if (AppState.isDrawing) {
    AppState.isDrawing = false;
    saveState();
    updatePreview();
    broadcast();
  }
}

function drawPixel(x, y, color) {
  if (x < 0 || x >= AppState.size || y < 0 || y >= AppState.size) return;
  if (color) {
    UI.ctx.fillStyle = color;
    UI.ctx.fillRect(x, y, 1, 1);
  } else {
    UI.ctx.clearRect(x, y, 1, 1);
  }
}

function floodFill(x, y, color) {
  // A simplified flood fill via Canvas API
  const imgData = UI.ctx.getImageData(0, 0, AppState.size, AppState.size);
  const data = imgData.data;

  const targetColor = getPixelColor(data, x, y);
  const fillColor = hexToRgba(color);

  if (colorsMatch(targetColor, fillColor)) return;

  const stack = [[x, y]];
  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cx >= AppState.size || cy < 0 || cy >= AppState.size)
      continue;

    const currentColor = getPixelColor(data, cx, cy);
    if (colorsMatch(currentColor, targetColor)) {
      setPixelColor(data, cx, cy, fillColor);
      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }
  }
  UI.ctx.putImageData(imgData, 0, 0);
}

function getPixelColor(data, x, y) {
  const i = (y * AppState.size + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
}

function setPixelColor(data, x, y, color) {
  const i = (y * AppState.size + x) * 4;
  data[i] = color[0];
  data[i + 1] = color[1];
  data[i + 2] = color[2];
  data[i + 3] = color[3];
}

function colorsMatch(c1, c2) {
  return (
    c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] === c2[3]
  );
}

function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b, 255];
}

function pickColor(x, y, isSecondary) {
  const data = UI.ctx.getImageData(x, y, 1, 1).data;
  if (data[3] === 0) return; // transparent
  const hex =
    "#" +
    ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2])
      .toString(16)
      .slice(1);
  if (isSecondary) AppState.secondaryColor = hex;
  else AppState.primaryColor = hex;
  updateUI();
}

function generatePalette() {
  const colors = [
    "#000000",
    "#1a1c2c",
    "#5d275d",
    "#b13e53",
    "#ef7d57",
    "#ffcd75",
    "#a7f070",
    "#38b764",
    "#257179",
    "#29366f",
    "#3b5dc9",
    "#41a6f6",
    "#73eff7",
    "#f4f4f4",
    "#94b0c2",
    "#566c86",
  ];
  const p = document.getElementById("palette");
  p.innerHTML = "";
  colors.forEach((c) => {
    const d = document.createElement("div");
    d.className = "palette-color";
    d.style.backgroundColor = c;
    d.onclick = () => {
      AppState.primaryColor = c;
      updateUI();
    };
    d.oncontextmenu = (e) => {
      e.preventDefault();
      AppState.secondaryColor = c;
      updateUI();
    };
    p.appendChild(d);
  });
}

function saveState(addToHistory = true) {
  const dataUrl = UI.canvas.toDataURL();
  AppState.frames[AppState.currentFrame] = dataUrl;

  if (addToHistory) {
    AppState.history = AppState.history.slice(0, AppState.historyIndex + 1);
    AppState.history.push(dataUrl);
    AppState.historyIndex++;
  }

  renderTimeline();
  updatePreview();
}

function loadState(dataUrl) {
  if (!dataUrl) {
    UI.ctx.clearRect(0, 0, AppState.size, AppState.size);
    return;
  }
  const img = new Image();
  img.onload = () => {
    UI.ctx.clearRect(0, 0, AppState.size, AppState.size);
    UI.ctx.drawImage(img, 0, 0);
  };
  img.src = dataUrl;
}

function undo() {
  if (AppState.historyIndex > 0) {
    AppState.historyIndex--;
    loadState(AppState.history[AppState.historyIndex]);
    AppState.frames[AppState.currentFrame] =
      AppState.history[AppState.historyIndex];
    renderTimeline();
    broadcast();
  }
}

function redo() {
  if (AppState.historyIndex < AppState.history.length - 1) {
    AppState.historyIndex++;
    loadState(AppState.history[AppState.historyIndex]);
    AppState.frames[AppState.currentFrame] =
      AppState.history[AppState.historyIndex];
    renderTimeline();
    broadcast();
  }
}

function addFrame() {
  AppState.frames.push(null);
  selectFrame(AppState.frames.length - 1);
}

function selectFrame(index) {
  if (index < 0 || index >= AppState.frames.length) return;
  AppState.currentFrame = index;
  loadState(AppState.frames[index]);
  renderTimeline();
}

function renderTimeline() {
  const tf = document.getElementById("timelineFrames");
  tf.innerHTML = "";
  AppState.frames.forEach((dataUrl, i) => {
    const d = document.createElement("div");
    d.className = `frame-thumb ${i === AppState.currentFrame ? "active" : ""}`;
    d.onclick = () => selectFrame(i);

    if (dataUrl) {
      const img = new Image();
      img.src = dataUrl;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.imageRendering = "pixelated";
      d.appendChild(img);
    }

    const num = document.createElement("div");
    num.className = "frame-number";
    num.innerText = i + 1;
    d.appendChild(num);

    tf.appendChild(d);
  });
}

function updatePreview() {
  UI.pCtx.clearRect(0, 0, 128, 128);
  if (AppState.frames[AppState.currentFrame]) {
    const img = new Image();
    img.onload = () => {
      UI.pCtx.imageSmoothingEnabled = false;
      UI.pCtx.drawImage(img, 0, 0, 128, 128);
    };
    img.src = AppState.frames[AppState.currentFrame];
  }
}

function togglePlay() {
  AppState.isPlaying = !AppState.isPlaying;
  const btn = document.getElementById("btnPlayAnim");
  btn.innerHTML = AppState.isPlaying
    ? '<i class="fas fa-stop"></i>'
    : '<i class="fas fa-play"></i>';

  if (AppState.isPlaying) {
    let frame = 0;
    const fps = document.getElementById("fpsInput").value || 8;
    const interval = setInterval(() => {
      if (!AppState.isPlaying) {
        clearInterval(interval);
        return;
      }
      selectFrame(frame);
      frame = (frame + 1) % AppState.frames.length;
    }, 1000 / fps);
  }
}

function exportPNG() {
  const link = document.createElement("a");
  link.download = "pixel-art.png";

  // Scale up for better view
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = AppState.size * 10;
  tempCanvas.height = AppState.size * 10;
  const tCtx = tempCanvas.getContext("2d");
  tCtx.imageSmoothingEnabled = false;
  tCtx.drawImage(UI.canvas, 0, 0, tempCanvas.width, tempCanvas.height);

  link.href = tempCanvas.toDataURL();
  link.click();
}

function broadcast() {
  channel.postMessage({
    type: "sync",
    payload: UI.canvas.toDataURL(),
  });
}

// Start
document.addEventListener("DOMContentLoaded", init);
