// =====================================================================
// ATELIER DRAWING STUDIO - FIXED & OPTIMIZED VERSION
// =====================================================================

document.addEventListener('DOMContentLoaded', startApp);

function startApp(){

  // ---------------------------------------------------------------
  // DOM REFERENCES
  // ---------------------------------------------------------------
  const wrapper   = document.getElementById('canvas-wrapper');
  const canvas    = document.getElementById('canvas');
  const preview   = document.getElementById('preview-canvas');
  const ctx       = canvas.getContext('2d');
  const pctx      = preview.getContext('2d');
  const textInput = document.getElementById('text-input');

  const toolButtons   = document.querySelectorAll('.tool-btn');
  const sizeRange      = document.getElementById('size-range');
  const sizeVal         = document.getElementById('size-val');
  const opacityRange   = document.getElementById('opacity-range');
  const opacityVal      = document.getElementById('opacity-val');
  const roundCapBox    = document.getElementById('round-cap');
  const capRow          = document.getElementById('cap-row');
  const fillShapeBox   = document.getElementById('fill-shape');
  const fillRow         = document.getElementById('fill-row');
  const colorPicker    = document.getElementById('color-picker');
  const bgColorPicker  = document.getElementById('bg-color');
  const swatches       = document.querySelectorAll('.swatch');
  const undoBtn         = document.getElementById('undo-btn');
  const redoBtn         = document.getElementById('redo-btn');
  const clearBtn        = document.getElementById('clear-btn');
  const downloadBtn    = document.getElementById('download-btn');

  // ---------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------
  let tool = 'brush';
  let brushColor = colorPicker.value;
  let bgColor = bgColorPicker.value;
  let brushSize = parseInt(sizeRange.value, 10);
  let opacity = parseInt(opacityRange.value, 10) / 100;
  let roundCap = roundCapBox.checked;
  let fillShape = fillShapeBox.checked;

  let isDrawing = false;
  let startX = 0, startY = 0;
  let lastX = 0, lastY = 0;

  let undoStack = [];
  let redoStack = [];
  const MAX_HISTORY = 30;

  const SHAPE_TOOLS = ['line', 'rect', 'circle'];

  // ---------------------------------------------------------------
  // SETUP & AUTO-RESIZE
  // ---------------------------------------------------------------
  wrapper.style.backgroundColor = bgColor;

  function resizeCanvases(preserve){
    const rect = wrapper.getBoundingClientRect();
    let saved = null;
    if (preserve && canvas.width > 0 && canvas.height > 0){
      saved = canvas.toDataURL();
    }
    canvas.width = Math.round(rect.width);
    canvas.height = Math.round(rect.height);
    preview.width = Math.round(rect.width);
    preview.height = Math.round(rect.height);

    if (saved){
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = 1.0; // रीसाइज़ करते समय पुरानी ड्रॉइंग की ओपेसिटी खराब न हो
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      };
      img.src = saved;
    }
  }

  resizeCanvases(false);
  saveHistory(); // Initial blank state

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => resizeCanvases(true), 150);
  });

  // ---------------------------------------------------------------
  // HISTORY (UNDO / REDO)
  // ---------------------------------------------------------------
  function saveHistory(){
    if (undoStack.length >= MAX_HISTORY) undoStack.shift();
    undoStack.push(canvas.toDataURL());
    redoStack = [];
    refreshHistoryButtons();
  }

  function restore(dataUrl){
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };
    img.src = dataUrl;
  }

  function undo(){
    if (undoStack.length <= 1) return;
    redoStack.push(undoStack.pop());
    restore(undoStack[undoStack.length - 1]);
    refreshHistoryButtons();
  }

  function redo(){
    if (redoStack.length === 0) return;
    const url = redoStack.pop();
    undoStack.push(url);
    restore(url);
    refreshHistoryButtons();
  }

  function refreshHistoryButtons(){
    undoBtn.disabled = undoStack.length <= 1;
    redoBtn.disabled = redoStack.length === 0;
  }

  // ---------------------------------------------------------------
  // TOOL SELECTION
  // ---------------------------------------------------------------
  function setTool(name){
    tool = name;
    toolButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tool === name));

    capRow.classList.toggle('hidden', !(tool === 'brush' || tool === 'eraser'));
    fillRow.classList.toggle('hidden', !SHAPE_TOOLS.includes(tool));

    canvas.style.cursor = tool === 'text' ? 'text' : 'crosshair';
    hideTextInput();
  }

  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => setTool(btn.dataset.tool));
  });

  // ---------------------------------------------------------------
  // OPTIONS EVENT LISTENERS
  // ---------------------------------------------------------------
  sizeRange.addEventListener('input', () => {
    brushSize = parseInt(sizeRange.value, 10);
    sizeVal.textContent = brushSize;
  });

  opacityRange.addEventListener('input', () => {
    opacity = parseInt(opacityRange.value, 10) / 100;
    opacityVal.textContent = `${opacityRange.value}%`;
  });

  roundCapBox.addEventListener('change', () => { roundCap = roundCapBox.checked; });
  fillShapeBox.addEventListener('change', () => { fillShape = fillShapeBox.checked; });

  colorPicker.addEventListener('input', () => { brushColor = colorPicker.value; });

  bgColorPicker.addEventListener('input', () => {
    bgColor = bgColorPicker.value;
    wrapper.style.backgroundColor = bgColor;
  });

  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      brushColor = sw.dataset.color;
      colorPicker.value = brushColor;
    });
  });

  undoBtn.addEventListener('click', undo);
  redoBtn.addEventListener('click', redo);

  clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveHistory();
  });

  downloadBtn.addEventListener('click', () => {
    const out = document.createElement('canvas');
    out.width = canvas.width;
    out.height = canvas.height;
    const octx = out.getContext('2d');
    octx.fillStyle = bgColor;
    octx.fillRect(0, 0, out.width, out.height);
    octx.drawImage(canvas, 0, 0);
    
    const a = document.createElement('a');
    a.href = out.toDataURL('image/png');
    a.download = 'drawing.png';
    a.click();
  });

  // ---------------------------------------------------------------
  // POINTER HELPERS (Mouse + Touch Coordinate Map)
  // ---------------------------------------------------------------
  function getPos(evt){
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Touch Events और Mouse Events दोनों को सही से हैंडल करने के लिए कंडीशन
    let clientX = 0;
    let clientY = 0;

    if (evt.touches && evt.touches.length > 0) {
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    } else if (evt.changedTouches && evt.changedTouches.length > 0) {
      clientX = evt.changedTouches[0].clientX;
      clientY = evt.changedTouches[0].clientY;
    } else {
      clientX = evt.clientX;
      clientY = evt.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function applyStrokeStyle(context){
    context.lineCap = roundCap ? 'round' : 'square';
    context.lineJoin = roundCap ? 'round' : 'miter';
    context.lineWidth = brushSize;
    context.globalAlpha = opacity;
    context.strokeStyle = brushColor;
    context.fillStyle = brushColor;
  }

  // ---------------------------------------------------------------
  // FREEHAND DRAWING (Brush / Eraser)
  // ---------------------------------------------------------------
  function drawSegment(x0, y0, x1, y1){
    ctx.save();
    applyStrokeStyle(ctx);
    ctx.globalCompositeOperation = (tool === 'eraser') ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.restore();
  }

  // ---------------------------------------------------------------
  // SHAPE PREVIEW + COMMIT
  // ---------------------------------------------------------------
  function drawShape(context, x0, y0, x1, y1, isPreview){
    context.save();
    applyStrokeStyle(context);
    if (isPreview){
      context.setLineDash([6, 4]);
      context.globalAlpha = Math.min(opacity, 0.85);
    }

    if (tool === 'line'){
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.stroke();
    } else if (tool === 'rect'){
      const w = x1 - x0, h = y1 - y0;
      if (fillShape) context.fillRect(x0, y0, w, h);
      else context.strokeRect(x0, y0, w, h);
    } else if (tool === 'circle'){
      const rx = Math.abs(x1 - x0) / 2;
      const ry = Math.abs(y1 - y0) / 2;
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      context.beginPath();
      context.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      if (fillShape) context.fill();
      else context.stroke();
    }
    context.restore();
  }

  // ---------------------------------------------------------------
  // TEXT TOOL (Fixed Floating Coordinates)
  // ---------------------------------------------------------------
  function showTextInput(x, y, rectX, rectY){
    textInput.classList.remove('hidden');
    textInput.style.left = `${rectX}px`;
    textInput.style.top = `${rectY - 12}px`;
    textInput.style.fontSize = `${Math.max(brushSize * 3, 14)}px`;
    textInput.style.color = brushColor;
    textInput.value = '';
    textInput.dataset.canvasX = x;
    textInput.dataset.canvasY = y;
    setTimeout(() => textInput.focus(), 0);
  }

  function hideTextInput(){
    textInput.classList.add('hidden');
  }

  function commitTextInput(){
    if (textInput.classList.contains('hidden')) return;
    const value = textInput.value.trim();
    if (value){
      const x = parseFloat(textInput.dataset.canvasX);
      const y = parseFloat(textInput.dataset.canvasY);
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = brushColor;
      ctx.font = `${Math.max(brushSize * 3, 14)}px Inter, sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillText(value, x, y);
      ctx.restore();
      saveHistory();
    }
    hideTextInput();
  }

  textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter'){ e.preventDefault(); commitTextInput(); }
    if (e.key === 'Escape'){ hideTextInput(); }
  });
  textInput.addEventListener('blur', commitTextInput);

  // ---------------------------------------------------------------
  // POINTER EVENT HANDLERS
  // ---------------------------------------------------------------
  function handleStart(evt){
    // अगर इनपुट बॉक्स पर ही टच/क्लिक हुआ है तो डिफ़ॉल्ट एक्शन को न रोकें
    if(evt.target === textInput) return;
    
    evt.preventDefault();
    const pos = getPos(evt);

    if (tool === 'text'){
      const rect = canvas.getBoundingClientRect();
      // सही रेश्यो मैपिंग (Fixes Text placement displacement bug)
      const rectX = (pos.x * (rect.width / canvas.width));
      const rectY = (pos.y * (rect.height / canvas.height));
      showTextInput(pos.x, pos.y, rectX, rectY);
      return;
    }

    isDrawing = true;
    startX = lastX = pos.x;
    startY = lastY = pos.y;
  }

  function handleMove(evt){
    if (!isDrawing) return;
    evt.preventDefault();
    const pos = getPos(evt);

    if (tool === 'brush' || tool === 'eraser'){
      drawSegment(lastX, lastY, pos.x, pos.y);
      lastX = pos.x;
      lastY = pos.y;
    } else if (SHAPE_TOOLS.includes(tool)){
      pctx.clearRect(0, 0, preview.width, preview.height);
      drawShape(pctx, startX, startY, pos.x, pos.y, true);
    }
  }

  function handleEnd(evt){
    if (!isDrawing) return;
    isDrawing = false;

    if (tool === 'brush' || tool === 'eraser'){
      saveHistory();
    } else if (SHAPE_TOOLS.includes(tool)){
      const endPos = getPos(evt); // नए getPos लॉजिक से सही कोऑर्डिनेट्स मिलेंगे
      pctx.clearRect(0, 0, preview.width, preview.height);
      drawShape(ctx, startX, startY, endPos.x, endPos.y, false);
      saveHistory();
    }
  }

  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);

  canvas.addEventListener('touchstart', handleStart, { passive: false });
  canvas.addEventListener('touchmove', handleMove, { passive: false });
  window.addEventListener('touchend', handleEnd, { passive: false });

  // ---------------------------------------------------------------
  // KEYBOARD SHORTCUTS
  // ---------------------------------------------------------------
  const KEY_TOOL_MAP = { b: 'brush', e: 'eraser', l: 'line', r: 'rect', c: 'circle', t: 'text' };

  document.addEventListener('keydown', (e) => {
    const typing = document.activeElement === textInput;
    if (typing) return;

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z'){
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y'){
      e.preventDefault();
      redo();
      return;
    }

    if (e.key === '['){
      brushSize = Math.max(1, brushSize - 1);
      sizeRange.value = brushSize;
      sizeVal.textContent = brushSize;
    }
    if (e.key === ']'){
      brushSize = Math.min(80, brushSize + 1);
      sizeRange.value = brushSize;
      sizeVal.textContent = brushSize;
    }

    const mapped = KEY_TOOL_MAP[e.key.toLowerCase()];
    if (mapped) setTool(mapped);
  });

  // ---------------------------------------------------------------
  // INITIAL DISPLAY SYNC
  // ---------------------------------------------------------------
  sizeVal.textContent = brushSize;
  opacityVal.textContent = `${opacityRange.value}%`;
  setTool('brush');
}
