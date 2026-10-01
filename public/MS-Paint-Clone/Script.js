(function () {
  "use strict";

  // ── DOM refs ─────────────────────────────────────────────────────
  const canvas       = document.getElementById("paint-canvas");
  const ctx          = canvas.getContext("2d");
  const colorPicker  = document.getElementById("color-picker");
  const bgColorPick  = document.getElementById("bg-color");
  const brushSize    = document.getElementById("brush-size");
  const sizeLabel    = document.getElementById("size-label");
  const paletteEl    = document.getElementById("palette");
  const cursorRing   = document.getElementById("cursor-preview");
  const statusCoords = document.getElementById("status-coords");
  const statusTool   = document.getElementById("status-tool");
  const statusSize   = document.getElementById("status-size");
  const toolGroup    = document.getElementById("tool-group");

  // ── State ─────────────────────────────────────────────────────────
  let activeTool    = "brush";
  let painting      = false;
  let startX        = 0;
  let startY        = 0;
  let snapshot      = null;   
  let undoStack     = [];
  const MAX_UNDO    = 20;

  // ── Palette colours ───────────────────────────────────────────────
  const PALETTE = [
    "#1a1a2e","#16213e","#0f3460","#533483",
    "#e94560","#ff6b6b","#ffa07a","#ffd166",
    "#06d6a0","#118ab2","#073b4c","#ffffff",
    "#f8f9fa","#adb5bd","#6c757d","#343a40",
    "#f72585","#7209b7","#3a0ca3","#4361ee",
  ];

  // ── Canvas sizing ─────────────────────────────────────────────────
  function resizeCanvas() {
    const area   = canvas.parentElement;
    const maxW   = area.clientWidth  - 40;
    const maxH   = area.clientHeight - 40;
    const cw     = Math.min(1200, maxW);
    const ch     = Math.min(700,  maxH);

    // Save current drawing
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width  = cw;
    canvas.height = ch;
    fillBackground();
    ctx.putImageData(img, 0, 0);
  }

  function fillBackground(color) {
    const c = color || bgColorPick.value;
    ctx.save();
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // ── Palette ───────────────────────────────────────────────────────
  function buildPalette() {
    PALETTE.forEach(hex => {
      const s = document.createElement("div");
      s.className = "swatch";
      s.style.background = hex;
      s.title = hex;
      if (hex === colorPicker.value) s.classList.add("selected");
      s.addEventListener("click", () => selectSwatch(hex, s));
      paletteEl.appendChild(s);
    });
  }

  function selectSwatch(hex, el) {
    document.querySelectorAll(".swatch").forEach(s => s.classList.remove("selected"));
    el.classList.add("selected");
    colorPicker.value = hex;
    if (activeTool === "eraser") activateTool("brush");
  }

  // ── Tool activation ───────────────────────────────────────────────
  function activateTool(name) {
    activeTool = name;
    document.querySelectorAll(".tool-btn").forEach(b => b.classList.remove("active"));
    const btn = document.querySelector(`[data-tool="${name}"]`);
    if (btn) btn.classList.add("active");
    statusTool.textContent = "Tool: " + name.charAt(0).toUpperCase() + name.slice(1);
    updateCursorSize();
  }

  toolGroup.addEventListener("click", e => {
    const btn = e.target.closest(".tool-btn");
    if (btn) activateTool(btn.dataset.tool);
  });

  // ── Cursor ring ───────────────────────────────────────────────────
  function updateCursorSize() {
    const sz = parseInt(brushSize.value, 10);
    cursorRing.style.width  = sz + "px";
    cursorRing.style.height = sz + "px";
    cursorRing.style.display = (activeTool === "fill") ? "none" : "block";
  }

  document.addEventListener("mousemove", e => {
    cursorRing.style.left = e.clientX + "px";
    cursorRing.style.top  = e.clientY + "px";
  });

  canvas.addEventListener("mouseleave", () => { cursorRing.style.display = "none"; });
  canvas.addEventListener("mouseenter", () => {
    if (activeTool !== "fill") cursorRing.style.display = "block";
  });

  // ── Canvas coords ─────────────────────────────────────────────────
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  }

  // ── Undo ──────────────────────────────────────────────────────────
  function saveState() {
    if (undoStack.length >= MAX_UNDO) undoStack.shift();
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  function undo() {
    if (!undoStack.length) return;
    ctx.putImageData(undoStack.pop(), 0, 0);
  }

  // ── Drawing helpers ───────────────────────────────────────────────
  function setupCtx() {
    ctx.lineWidth   = brushSize.value;
    ctx.strokeStyle = (activeTool === "eraser") ? bgColorPick.value : colorPicker.value;
    ctx.fillStyle   = colorPicker.value;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
  }

  // ── Flood fill (BFS) ──────────────────────────────────────────────
  function floodFill(sx, sy, fillR, fillG, fillB) {
    const w   = canvas.width;
    const h   = canvas.height;
    const img = ctx.getImageData(0, 0, w, h);
    const d   = img.data;

    const idx   = (x, y) => (y * w + x) * 4;
    const start = idx(sx, sy);
    const [tR, tG, tB, tA] = [d[start], d[start+1], d[start+2], d[start+3]];

    if (tR === fillR && tG === fillG && tB === fillB) return;

    const match = i => d[i]===tR && d[i+1]===tG && d[i+2]===tB && d[i+3]===tA;
    const paint = i => { d[i]=fillR; d[i+1]=fillG; d[i+2]=fillB; d[i+3]=255; };

    const stack = [[sx, sy]];
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || x >= w || y < 0 || y >= h) continue;
      const i = idx(x, y);
      if (!match(i)) continue;
      paint(i);
      stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);
    }
    ctx.putImageData(img, 0, 0);
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return [r, g, b];
  }

  // ── Mouse events ──────────────────────────────────────────────────
  canvas.addEventListener("mousedown", e => {
    if (e.button !== 0) return;
    const {x, y} = getPos(e);

    if (activeTool === "fill") {
      saveState();
      const [r,g,b] = hexToRgb(colorPicker.value);
      floodFill(x, y, r, g, b);
      return;
    }

    saveState();
    painting = true;
    startX   = x;
    startY   = y;
    setupCtx();

    if (activeTool === "brush" || activeTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);   
      ctx.stroke();
    }

    if (["line","rect","circle"].includes(activeTool)) {
      snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  });

  canvas.addEventListener("mousemove", e => {
    const {x, y} = getPos(e);
    statusCoords.textContent = `x: ${x}, y: ${y}`;

    if (!painting) return;
    setupCtx();

    if (activeTool === "brush" || activeTool === "eraser") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (activeTool === "line") {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (activeTool === "rect") {
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    }

    if (activeTool === "circle") {
      ctx.putImageData(snapshot, 0, 0);
      const rx = (x - startX) / 2;
      const ry = (y - startY) / 2;
      const cx2 = startX + rx;
      const cy2 = startY + ry;
      ctx.beginPath();
      ctx.ellipse(cx2, cy2, Math.abs(rx), Math.abs(ry), 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  });

  const stopPainting = () => {
    painting  = false;
    snapshot  = null;
    ctx.beginPath();
  };

  canvas.addEventListener("mouseup",    stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);

  // ── Controls ──────────────────────────────────────────────────────
  brushSize.addEventListener("input", () => {
    sizeLabel.textContent      = brushSize.value;
    statusSize.textContent     = "Size: " + brushSize.value + "px";
    updateCursorSize();
  });

  colorPicker.addEventListener("input", () => {
    document.querySelectorAll(".swatch").forEach(s => s.classList.remove("selected"));
  });

  bgColorPick.addEventListener("input", () => {
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    fillBackground(bgColorPick.value);
    ctx.putImageData(img, 0, 0);
  });

  document.getElementById("btn-undo").addEventListener("click", undo);

  document.getElementById("btn-clear").addEventListener("click", () => {
    saveState();
    fillBackground();
  });

  document.getElementById("btn-download").addEventListener("click", () => {
    const link    = document.createElement("a");
    link.download = "painting.png";
    link.href     = canvas.toDataURL("image/png");
    link.click();
  });

  // ── Keyboard shortcuts ────────────────────────────────────────────
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT") return;
    if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); return; }
    switch (e.key.toLowerCase()) {
      case "b": activateTool("brush");  break;
      case "e": activateTool("eraser"); break;
      case "f": activateTool("fill");   break;
      case "l": activateTool("line");   break;
      case "r": activateTool("rect");   break;
      case "c": activateTool("circle"); break;
    }
  });

  // ── Init ──────────────────────────────────────────────────────────
  bgColorPick.value = "#ffffff";  
  buildPalette();
  resizeCanvas();
  fillBackground();
  updateCursorSize();
  statusSize.textContent = "Size: " + brushSize.value + "px";

  window.addEventListener("resize", resizeCanvas);

})();