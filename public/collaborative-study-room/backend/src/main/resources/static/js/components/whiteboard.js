// Whiteboard Component Handler
import { state, broadcastEvent, unlockBadge } from '../state.js';

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#8b5cf6'; // Default purple
let currentBrushSize = 4;

export function initWhiteboardComponent() {
  const canvas = document.getElementById('whiteboard-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const btnClear = document.getElementById('btn-whiteboard-clear');
  const colorBtns = document.querySelectorAll('.color-btn');
  const brushSlider = document.getElementById('brush-size');
  const brushVal = document.getElementById('brush-size-val');

  // Load colors click listeners
  colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentColor = btn.getAttribute('data-color');
    });
  });

  // Brush slider changes
  brushSlider.addEventListener('input', (e) => {
    currentBrushSize = parseInt(e.target.value);
    brushVal.textContent = `${currentBrushSize}px`;
  });

  // Clear canvas click listener
  btnClear.addEventListener('click', () => {
    clearCanvasLocally();
    broadcastEvent('WHITEBOARD_CLEAR', null);
  });

  // Canvas Mouse events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  // Touch support for mobiles/tablets
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      // Calculate scaled coords
      const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;
      
      isDrawing = true;
      lastX = x;
      lastY = y;
      
      e.preventDefault();
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    if (isDrawing && e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
      const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;

      drawStroke(lastX, lastY, x, y, currentColor, currentBrushSize);
      
      // Broadcast stroke to other users
      broadcastEvent('WHITEBOARD_DRAW', {
        x1: lastX,
        y1: lastY,
        x2: x,
        y2: y,
        color: currentColor,
        size: currentBrushSize
      });

      lastX = x;
      lastY = y;

      e.preventDefault();
    }
  });

  canvas.addEventListener('touchend', () => {
    isDrawing = false;
  });

  // Sync listener from broadcast events
  window.addEventListener('whiteboard-draw-stroke', (e) => {
    const stroke = e.detail;
    drawStroke(stroke.x1, stroke.y1, stroke.x2, stroke.y2, stroke.color, stroke.size);
  });

  window.addEventListener('whiteboard-clear-canvas', () => {
    clearCanvasLocally();
  });

  // Handle canvas tab activated resize check
  window.addEventListener('whiteboard-tab-active', () => {
    // Redraw canvas context states in case they reset
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  });

  function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    // Translate client mouse click offset to scaled fixed canvas size
    lastX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    lastY = ((e.clientY - rect.top) / rect.height) * canvas.height;
    
    // Unlock achievements
    unlockBadge('doodler');
  }

  function draw(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    drawStroke(lastX, lastY, x, y, currentColor, currentBrushSize);

    // Broadcast drawing coordinates
    broadcastEvent('WHITEBOARD_DRAW', {
      x1: lastX,
      y1: lastY,
      x2: x,
      y2: y,
      color: currentColor,
      size: currentBrushSize
    });

    lastX = x;
    lastY = y;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function drawStroke(x1, y1, x2, y2, color, size) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function clearCanvasLocally() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
