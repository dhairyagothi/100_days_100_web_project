/**
 * Lumina AI - Premium Image Editor
 * Built with TensorFlow.js
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

// UI Elements
const statusIndicator = document.querySelector(".status-indicator");
const statusText = document.querySelector(".status-text");
const imageUpload = document.getElementById("imageUpload");
const dropZone = document.getElementById("dropZone");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const canvasWrapper = document.getElementById("canvasWrapper");
const loadingOverlay = document.getElementById("loadingOverlay");

// Buttons
const grayscaleBtn = document.getElementById("grayscaleBtn");
const edgeBtn = document.getElementById("edgeBtn");
const cartoonBtn = document.getElementById("cartoonBtn");
const removeBgBtn = document.getElementById("removeBgBtn");
const sepiaBtn = document.getElementById("sepiaBtn");
const invertBtn = document.getElementById("invertBtn");
const sharpenBtn = document.getElementById("sharpenBtn");
const undoBtn = document.getElementById("undoBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const compareBtn = document.getElementById("compareBtn");

// Sliders
const brightnessSlider = document.getElementById("brightnessSlider");
const contrastSlider = document.getElementById("contrastSlider");

// State
let originalImageData = null;
let historyStack = [];
const MAX_HISTORY = 10;
let bodyPixNet = null;
let isProcessing = false;

/* =========================
   INITIALIZATION
========================= */
async function initAI() {
  try {
    updateStatus("Initializing AI...", false);
    await tf.ready();
    updateStatus(`AI Ready (TF.js v${tf.version.tfjs})`, true);

    // Lazy load bodypix - only when needed or in background
    bodyPixNet = await bodyPix.load({
      architecture: "MobileNetV1",
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    });
  } catch (err) {
    console.error("AI Initialization failed:", err);
    updateStatus("AI Initialization Failed", false);
  }
}

function updateStatus(text, ready) {
  statusText.textContent = text;
  if (ready) {
    statusIndicator.classList.add("ready");
  } else {
    statusIndicator.classList.remove("ready");
  }
}

initAI();

/* =========================
   IMAGE LOADING & HANDLING
========================= */
imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) handleImageFile(file);
});

// Drag & Drop
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    handleImageFile(file);
  }
});

function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      setupCanvas(img);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function setupCanvas(img) {
  const maxWidth = window.innerWidth > 900 ? window.innerWidth - 450 : window.innerWidth - 100;
  const maxHeight = window.innerHeight - 250;

  let w = img.width;
  let h = img.height;

  const scale = Math.min(maxWidth / w, maxHeight / h, 1);
  w = Math.floor(w * scale);
  h = Math.floor(h * scale);

  canvas.width = w;
  canvas.height = h;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  originalImageData = ctx.getImageData(0, 0, w, h);

  // Clear history and add initial state
  historyStack = [ctx.getImageData(0, 0, w, h)];

  // Update UI
  uploadPlaceholder.classList.add("hidden");
  canvasWrapper.classList.remove("hidden");
  enableControls(true);
}

function enableControls(enable) {
  const tools = [
    grayscaleBtn, edgeBtn, cartoonBtn, removeBgBtn, sepiaBtn, invertBtn, sharpenBtn,
    resetBtn, downloadBtn, compareBtn, brightnessSlider, contrastSlider
  ];
  tools.forEach(btn => btn.disabled = !enable);
  undoBtn.disabled = historyStack.length <= 1;
}

/* =========================
   UTILITIES
========================= */
function showLoading() {
  isProcessing = true;
  loadingOverlay.classList.remove("hidden");
}

function hideLoading() {
  isProcessing = false;
  loadingOverlay.classList.add("hidden");
}

function saveToHistory() {
  const state = ctx.getImageData(0, 0, canvas.width, canvas.height);
  historyStack.push(state);
  if (historyStack.length > MAX_HISTORY) {
    historyStack.shift();
  }
  undoBtn.disabled = false;
}

undoBtn.onclick = () => {
  if (historyStack.length > 1) {
    historyStack.pop(); // Remove current
    const lastState = historyStack[historyStack.length - 1];
    ctx.putImageData(lastState, 0, 0);
    if (historyStack.length <= 1) undoBtn.disabled = true;
  }
};

resetBtn.onclick = () => {
  if (originalImageData) {
    ctx.putImageData(originalImageData, 0, 0);
    saveToHistory();
  }
};

/* =========================
   COMPARE FEATURE
========================= */
compareBtn.onmousedown = () => {
  if (originalImageData) {
    ctx.putImageData(originalImageData, 0, 0);
  }
};

compareBtn.onmouseup = compareBtn.onmouseleave = () => {
  if (historyStack.length > 0) {
    ctx.putImageData(historyStack[historyStack.length - 1], 0, 0);
  }
};

/* =========================
   AI FILTERS (TF.JS)
========================= */

async function applyFilter(filterFn) {
  if (isProcessing) return;
  showLoading();

  // Use timeout to let the UI update (loader show)
  setTimeout(async () => {
    try {
      await filterFn();
      saveToHistory();
    } catch (err) {
      console.error("Filter failed:", err);
      alert("An error occurred while processing the image.");
    } finally {
      hideLoading();
    }
  }, 50);
}

grayscaleBtn.onclick = () => applyFilter(async () => {
  const t = tf.browser.fromPixels(canvas);
  const gray = t.mean(2).expandDims(2).tile([1, 1, 3]);
  const normalized = gray.div(255);
  await tf.browser.toPixels(normalized, canvas);

  t.dispose();
  gray.dispose();
  normalized.dispose();
});

edgeBtn.onclick = () => applyFilter(async () => {
  const t = tf.browser.fromPixels(canvas).mean(2).expandDims(2).expandDims(0);
  const kernel = tf.tensor4d([-1, -1, -1, -1, 8, -1, -1, -1, -1], [3, 3, 1, 1]);

  const edges = tf.conv2d(t.toFloat(), kernel, 1, "same")
    .abs()
    .clipByValue(0, 255)
    .squeeze()
    .expandDims(2)
    .tile([1, 1, 3]);

  const normalized = edges.div(255);
  await tf.browser.toPixels(normalized, canvas);

  t.dispose();
  kernel.dispose();
  edges.dispose();
  normalized.dispose();
});

cartoonBtn.onclick = () => applyFilter(async () => {
  const img = tf.browser.fromPixels(canvas).toFloat();
  const cartoon = img.div(32).round().mul(32).clipByValue(0, 255);
  const normalized = cartoon.div(255);
  await tf.browser.toPixels(normalized, canvas);

  img.dispose();
  cartoon.dispose();
  normalized.dispose();
});

sepiaBtn.onclick = () => applyFilter(async () => {
  const t = tf.browser.fromPixels(canvas).toFloat();

  // Sepia matrix
  const sepiaMatrix = tf.tensor2d([
    [0.393, 0.349, 0.272],
    [0.769, 0.686, 0.534],
    [0.189, 0.168, 0.131]
  ]);

  const reshaped = t.reshape([-1, 3]);
  const sepia = tf.matMul(reshaped, sepiaMatrix)
    .reshape(t.shape)
    .clipByValue(0, 255);

  const normalized = sepia.div(255);
  await tf.browser.toPixels(normalized, canvas);

  t.dispose();
  sepiaMatrix.dispose();
  reshaped.dispose();
  sepia.dispose();
  normalized.dispose();
});

invertBtn.onclick = () => applyFilter(async () => {
  const t = tf.browser.fromPixels(canvas);
  const inverted = tf.scalar(255).sub(t);
  const normalized = inverted.div(255);
  await tf.browser.toPixels(normalized, canvas);

  t.dispose();
  inverted.dispose();
  normalized.dispose();
});

sharpenBtn.onclick = () => applyFilter(async () => {
  const t = tf.browser.fromPixels(canvas).toFloat().expandDims(0);
  const kernel = tf.tensor4d([0, -1, 0, -1, 5, -1, 0, -1, 0], [3, 3, 1, 1]).tile([1, 1, 3, 1]);

  const sharpened = tf.depthwiseConv2d(t, kernel, 1, "same")
    .clipByValue(0, 255)
    .squeeze();

  const normalized = sharpened.div(255);
  await tf.browser.toPixels(normalized, canvas);

  t.dispose();
  kernel.dispose();
  sharpened.dispose();
  normalized.dispose();
});

removeBgBtn.onclick = () => applyFilter(async () => {
  if (!bodyPixNet) {
    alert("AI Model still loading. Please wait.");
    return;
  }

  const seg = await bodyPixNet.segmentPerson(canvas, {
    internalResolution: "high",
    segmentationThreshold: 0.5
  });

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    if (seg.data[i / 4] === 0) d[i + 3] = 0;
  }

  ctx.putImageData(imgData, 0, 0);
});

/* =========================
   ADJUSTMENTS (SLIDERS)
========================= */

async function applyAdjustment() {
  if (!originalImageData || isProcessing) return;

  const b = parseFloat(brightnessSlider.value);
  const c = parseFloat(contrastSlider.value);

  // For sliders, we don't show the full loading overlay as it's meant to be fast-ish
  // But we use TF.js for the heavy lifting

  tf.tidy(() => {
    const t = tf.browser.fromPixels(canvas); // Start from current state or original? 
    // Usually adjustments are relative to the LAST state for interactive feel, 
    // but here let's apply to the current state.

    let processed = t.toFloat();

    // Brightness: add value
    if (b !== 0) {
      processed = processed.add(tf.scalar(b));
    }

    // Contrast: factor
    if (c !== 0) {
      const factor = (259 * (c + 255)) / (255 * (259 - c));
      processed = processed.sub(128).mul(factor).add(128);
    }

    const final = processed.clipByValue(0, 255).div(255);
    tf.browser.toPixels(final, canvas);
  });
}

// Debounce slider updates for smoother performance
let sliderTimeout;
[brightnessSlider, contrastSlider].forEach(slider => {
  slider.addEventListener("input", () => {
    clearTimeout(sliderTimeout);
    sliderTimeout = setTimeout(applyAdjustment, 50);
  });

  slider.addEventListener("change", () => {
    saveToHistory();
  });
});

/* =========================
   DOWNLOAD
========================= */
downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.download = "lumina-ai-export.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
