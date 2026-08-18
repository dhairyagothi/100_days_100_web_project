// --- WORKSPACE & API CONTEXT BINDINGS ---
const canvas = document.getElementById('visualizer-canvas');
const ctx = canvas.getContext('2d');
const btnMic = document.getElementById('btn-mic');
const audioFile = document.getElementById('audio-file');
const audioPlayer = document.getElementById('audio-player');
const visualType = document.getElementById('visual-type');
const fftSizeSelect = document.getElementById('fft-size');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

// Playback Controls references
const playbackControlsGroup = document.getElementById('playback-controls-group');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnStop = document.getElementById('btn-stop');
const progressBarWrapper = document.querySelector('.progress-bar-wrapper');
const progressBar = document.getElementById('progress-bar');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');

let audioCtx = null;
let analyser = null;
let sourceNode = null;
let mediaElementSource = null;
let dataArray = [];
let animationId = null;

// Playback State Machine
const PlaybackState = {
  IDLE: 'Idle',
  PLAYING: 'Playing',
  PAUSED: 'Paused',
  STOPPED: 'Stopped'
};

let currentPlaybackState = PlaybackState.IDLE;
let activeArea = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

// Scale and fit resolution of Canvas boundaries dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const dashboard = document.querySelector('.dashboard');
  if (dashboard) {
    const rect = dashboard.getBoundingClientRect();
    if (window.innerWidth >= 768) {
      // Desktop: Dashboard is on the left
      // Unobstructed area is to the right of the dashboard
      const rightEdge = rect.right > 0 ? rect.right : 520;
      activeArea.left = rightEdge;
      activeArea.top = 0;
      activeArea.width = Math.max(200, canvas.width - rightEdge);
      activeArea.height = canvas.height;
    } else {
      // Mobile: Dashboard is at the bottom
      // Unobstructed area is above the dashboard
      const topEdge = rect.top > 0 ? rect.top : canvas.height - 300;
      activeArea.left = 0;
      activeArea.top = 0;
      activeArea.width = canvas.width;
      activeArea.height = Math.max(200, topEdge);
    }
  } else {
    activeArea.left = 0;
    activeArea.top = 0;
    activeArea.width = canvas.width;
    activeArea.height = canvas.height;
  }
}
window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', resizeCanvas);
resizeCanvas();

// --- 1. INITIALIZE WEB AUDIO CORE ROUTER ---
function setupAudioEngine() {
  if (audioCtx) return; // Prevent double creation initialization safely

  // Create cross-browser baseline processing context
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();

  // Set Fast Fourier Transform resolution grid balance
  analyser.fftSize = parseInt(fftSizeSelect.value);
  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
}

// Update runtime operational logs visually
function updateEngineStatus(message, isRunning) {
  statusText.textContent = message;
  if (isRunning) {
    statusDot.classList.add('active');
  } else {
    statusDot.classList.remove('active');
  }
}

// Clean up existing hardware/stream routes to prevent memory leaks
function disconnectExistingNodes() {
  if (animationId) cancelAnimationFrame(animationId);
  if (sourceNode && sourceNode !== mediaElementSource) {
    sourceNode.disconnect();
  }
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  setPlaybackState(PlaybackState.IDLE);
}

// --- 2. INPUT PROCESSING SYSTEMS ---
// Source Input: Hardware Microphone Capture
btnMic.addEventListener('click', async () => {
  try {
    disconnectExistingNodes();
    setupAudioEngine();

    // Request browser media access safely
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    // Route hardware microphone to core analysis pipeline
    sourceNode = audioCtx.createMediaStreamSource(stream);
    sourceNode.connect(analyser);

    updateEngineStatus('Listening to Mic Stream', true);
    startVisualizerLoop();
  } catch (err) {
    console.error('Microphone linking failed:', err);
    updateEngineStatus('Microphone access denied', false);
  }
});

// Source Input: Local MP3 File Parsing Context
audioFile.addEventListener('change', function () {
  const files = this.files;
  if (files.length === 0) return;

  disconnectExistingNodes();
  setupAudioEngine();
  resizeCanvas(); // Update activeArea based on dashboard visibility

  const fileURL = URL.createObjectURL(files[0]);
  audioPlayer.src = fileURL;

  // Create MediaElementSource only once
  if (!mediaElementSource) {
    mediaElementSource = audioCtx.createMediaElementSource(audioPlayer);

    mediaElementSource.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  sourceNode = mediaElementSource;

  // HTML5 audio event listeners will trigger setPlaybackState(PlaybackState.PLAYING)
  ensureAudioCtxRunning();
  audioPlayer.play().catch(err => console.log('Autoplay blocked or failed:', err));
  startVisualizerLoop();
});

// Resolution Adjustment Listener
fftSizeSelect.addEventListener('change', function () {
  if (analyser) {
    analyser.fftSize = parseInt(this.value);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }
});

// --- 3. HIGH PERFORMANCE RENDER LOOPS ---
function startVisualizerLoop() {
  const bufferLength = analyser.frequencyBinCount;
  resizeCanvas(); // Recalculate once when loop starts

  function draw() {
    animationId = requestAnimationFrame(draw);

    const renderMode = visualType.value;

    // Grab metrics data blocks depending on graph types chosen
    if (renderMode === 'oscilloscope') {
      analyser.getByteTimeDomainData(dataArray); // Fetch raw temporal waveforms
    } else {
      analyser.getByteFrequencyData(dataArray); // Fetch processed frequency decibel arrays
    }

    // Clear view area dynamically every single frame cleanly
    ctx.fillStyle = '#07080d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // -- MATRIX MODEL A: FREQUENCY BARS RENDERER --
    if (renderMode === 'frequency-bars') {
      const barWidth = (activeArea.width / bufferLength) * 2.5;
      let barHeight;
      let x = activeArea.left;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.8;
        barHeight = Math.min(barHeight, activeArea.height * 0.9);

        // Color gradient vector configuration mapped cleanly
        const hue = (i / bufferLength) * 280 + 200;
        ctx.fillStyle = `hsla(${hue}, 85%, 55%, 0.85)`;

        ctx.fillRect(x, activeArea.top + activeArea.height - barHeight, barWidth - 2, barHeight);
        x += barWidth;
      }
    }

    // -- MATRIX MODEL B: CIRCULAR RADIAL PULSE RENDERER --
    else if (renderMode === 'circular-matrix') {
      const centerX = activeArea.left + activeArea.width / 2;
      const centerY = activeArea.top + activeArea.height / 2;
      const baseRadius = Math.min(activeArea.width, activeArea.height) * 0.22;

      // Calculate average bass frequency for a pulse effect
      let bassSum = 0;
      const bassBins = Math.min(10, bufferLength);
      for (let j = 0; j < bassBins; j++) {
        bassSum += dataArray[j] || 0;
      }
      const bassAverage = bassBins > 0 ? (bassSum / bassBins) : 0;
      const pulse = (bassAverage / 255) * 35; // Up to 35px pulse depth
      const dynamicRadius = Math.max(10, baseRadius + pulse);

      // Draw center glowing aura
      const glowGrad = ctx.createRadialGradient(
        centerX, centerY, dynamicRadius * 0.2,
        centerX, centerY, dynamicRadius * 1.4
      );
      const bassIntensity = bassAverage / 255;
      glowGrad.addColorStop(0, `rgba(139, 92, 246, ${0.12 + bassIntensity * 0.18})`);
      glowGrad.addColorStop(0.5, `rgba(99, 102, 241, ${0.06 + bassIntensity * 0.12})`);
      glowGrad.addColorStop(1, 'rgba(7, 8, 13, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius * 1.6, 0, 2 * Math.PI);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Draw baseline circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const halfLength = bufferLength / 2;
      for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * Math.PI * 2 - Math.PI / 2; // Offset by -90 deg to start from top
        
        // Symmetrical left-right mapping
        let index;
        if (i < halfLength) {
          index = Math.floor((i / halfLength) * (bufferLength - 1));
        } else {
          index = Math.floor(((bufferLength - 1 - i) / halfLength) * (bufferLength - 1));
        }
        
        const amplitude = (dataArray[index] || 0) * 0.85;

        const xStart = centerX + Math.cos(angle) * dynamicRadius;
        const yStart = centerY + Math.sin(angle) * dynamicRadius;
        const xEnd = centerX + Math.cos(angle) * (dynamicRadius + amplitude);
        const yEnd = centerY + Math.sin(angle) * (dynamicRadius + amplitude);

        const hue = (index / bufferLength) * 280 + 200;
        ctx.strokeStyle = `hsla(${hue}, 95%, 65%, 0.8)`;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
      }
    }

    // -- MATRIX MODEL C: OSCILLOSCOPE WAVEFORM RENDERER --
    else if (renderMode === 'oscilloscope') {
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#8b5cf6';
      ctx.beginPath();

      const sliceWidth = activeArea.width / bufferLength;
      let x = activeArea.left;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = activeArea.top + (v * activeArea.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      ctx.lineTo(activeArea.left + activeArea.width, activeArea.top + activeArea.height / 2);
      ctx.stroke();
    }
  }

  draw();
}

// --- 4. PLAYBACK CONTROLS STATE ENGINE & SYNCHRONIZATION ---

function ensureAudioCtxRunning() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function setPlaybackState(state) {
  currentPlaybackState = state;
  
  switch (state) {
    case PlaybackState.IDLE:
      playbackControlsGroup.style.display = 'none';
      btnPlay.disabled = true;
      btnPause.disabled = true;
      btnResume.disabled = true;
      btnStop.disabled = true;
      
      btnPlay.classList.remove('active');
      btnPause.classList.remove('active');
      btnResume.classList.remove('active');
      btnStop.classList.remove('active');
      
      updateEngineStatus('Engine Idle', false);
      break;
      
    case PlaybackState.PLAYING:
      playbackControlsGroup.style.display = 'block';
      btnPlay.disabled = true;
      btnPause.disabled = false;
      btnResume.disabled = true;
      btnStop.disabled = false;
      
      btnPlay.classList.remove('active');
      btnPause.classList.remove('active');
      btnResume.classList.remove('active');
      btnStop.classList.remove('active');
      
      updateEngineStatus('Playing Track', true);
      break;
      
    case PlaybackState.PAUSED:
      playbackControlsGroup.style.display = 'block';
      btnPlay.disabled = false;
      btnPause.disabled = true;
      btnResume.disabled = false;
      btnStop.disabled = false;
      
      btnPause.classList.add('active');
      btnPlay.classList.remove('active');
      btnResume.classList.remove('active');
      btnStop.classList.remove('active');
      
      updateEngineStatus('Track Paused', false);
      break;
      
    case PlaybackState.STOPPED:
      playbackControlsGroup.style.display = 'block';
      btnPlay.disabled = false;
      btnPause.disabled = true;
      btnResume.disabled = true;
      btnStop.disabled = true;
      
      btnStop.classList.add('active');
      btnPlay.classList.remove('active');
      btnPause.classList.remove('active');
      btnResume.classList.remove('active');
      
      updateEngineStatus('Track Stopped', false);
      break;
  }
}

// Format seconds into MM:SS format
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update the progress bar fill and current timestamp
function updateProgressBar() {
  if (!audioPlayer.duration) return;
  const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.style.width = `${percentage}%`;
  timeCurrent.textContent = formatTime(audioPlayer.currentTime);
  
  // Update accessibility ARIA attributes
  progressBarWrapper.setAttribute('aria-valuenow', Math.round(percentage));
}

// Playback Control Button Event Listeners
btnPlay.addEventListener('click', () => {
  ensureAudioCtxRunning();
  audioPlayer.currentTime = 0;
  audioPlayer.play().catch(err => console.log('Playback failed:', err));
});

btnPause.addEventListener('click', () => {
  audioPlayer.pause();
});

btnResume.addEventListener('click', () => {
  ensureAudioCtxRunning();
  audioPlayer.play().catch(err => console.log('Playback failed:', err));
});

btnStop.addEventListener('click', () => {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  setPlaybackState(PlaybackState.STOPPED);
  updateProgressBar();
});

// Interactive seeking via clicking on the progress bar
progressBarWrapper.addEventListener('click', (e) => {
  if (!audioPlayer.duration) return;
  const rect = progressBarWrapper.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percentage = clickX / width;
  audioPlayer.currentTime = percentage * audioPlayer.duration;
  updateProgressBar();
});

// Keyboard seeking for accessibility
progressBarWrapper.addEventListener('keydown', (e) => {
  if (!audioPlayer.duration) return;
  let newTime = audioPlayer.currentTime;
  const step = 5; // seek 5 seconds
  
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    newTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + step);
    e.preventDefault();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    newTime = Math.max(0, audioPlayer.currentTime - step);
    e.preventDefault();
  }
  
  audioPlayer.currentTime = newTime;
  updateProgressBar();
});

// Native audio element event triggers
audioPlayer.addEventListener('play', () => {
  ensureAudioCtxRunning();
  setPlaybackState(PlaybackState.PLAYING);
});

audioPlayer.addEventListener('pause', () => {
  if (audioPlayer.currentTime === 0 || audioPlayer.ended) {
    setPlaybackState(PlaybackState.STOPPED);
  } else {
    setPlaybackState(PlaybackState.PAUSED);
  }
});

audioPlayer.addEventListener('ended', () => {
  audioPlayer.currentTime = 0;
  setPlaybackState(PlaybackState.STOPPED);
  updateProgressBar();
});

audioPlayer.addEventListener('timeupdate', updateProgressBar);

audioPlayer.addEventListener('loadedmetadata', () => {
  timeTotal.textContent = formatTime(audioPlayer.duration);
  timeCurrent.textContent = formatTime(0);
  progressBar.style.width = '0%';
  progressBarWrapper.setAttribute('aria-valuemax', '100');
  progressBarWrapper.setAttribute('aria-valuenow', '0');
});
