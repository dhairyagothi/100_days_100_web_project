import { FrameSynthesisEngine } from './synthesisKernel.js';

const canvas = document.getElementById('video-canvas');
const engine = new FrameSynthesisEngine(canvas);

// Cache layout controllers pointers
const renderBtn = document.getElementById('render-toggle');
const interpSelect = document.getElementById('interp-select');
const freqSlider = document.getElementById('freq-slider');
const freqLbl = document.getElementById('freq-lbl');
const scrubber = document.getElementById('timeline-scrubber');

const telTime = document.getElementById('tel-time');
const telLatency = document.getElementById('tel-latency');

let isPlaying = false;
let animationFrameId = null;
let currentFrameIndex = 0;
const MAX_FRAMES_LIMIT = 1000;
function startRenderLoop() {
  if (animationFrameId !== null) return;

  isPlaying = true;
  renderBtn.textContent = 'Halt Synthesis Stream';

  animationFrameId = requestAnimationFrame(executeRenderCycle);
}

function stopRenderLoop() {
  isPlaying = false;

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  renderBtn.textContent = 'Compile Live Sequence Stream';
}

function executeRenderCycle() {
  const normalizedTime = currentFrameIndex / MAX_FRAMES_LIMIT;
  const interpMode = interpSelect.value;
  const frequencyFactor = parseFloat(freqSlider.value) / 10;

  // Track frame compilation duration down to fractions of milliseconds
  const startTimestamp = performance.now();

  // Command the kernel to compute and render the pixel matrix buffer
  engine.synthesizeFrame(normalizedTime, interpMode, frequencyFactor);

  const operationalLatency = performance.now() - startTimestamp;

  // Update telemetry layout labels
  telTime.textContent = `${(normalizedTime * 10).toFixed(2)}s`;
  telLatency.textContent = `${operationalLatency.toFixed(4)} ms`;
  scrubber.value = currentFrameIndex;

  if (isPlaying) {
    currentFrameIndex++;

    if (currentFrameIndex > MAX_FRAMES_LIMIT) {
      currentFrameIndex = 0;
    }

    animationFrameId = requestAnimationFrame(executeRenderCycle);
  } else {
    animationFrameId = null;
  }
}

// Bind live timeline scrubbing interactions
scrubber.addEventListener('input', (e) => {
  stopRenderLoop();

  currentFrameIndex = parseInt(e.target.value, 10);

  executeRenderCycle();
});
scrubber.addEventListener('change', () => {
  if (!isPlaying && animationFrameId === null) {
    startRenderLoop();
  }
});
freqSlider.addEventListener('input', (e) => {
  freqLbl.textContent = `${(parseFloat(e.target.value) / 10).toFixed(1)}x`;
  if (!isPlaying) executeRenderCycle();
});

interpSelect.addEventListener('change', () => {
  if (!isPlaying) executeRenderCycle();
});

renderBtn.addEventListener('click', () => {
  if (isPlaying) {
    stopRenderLoop();
  } else {
    startRenderLoop();
  }
});

// Render the baseline initial frame on workspace initialization
executeRenderCycle();
