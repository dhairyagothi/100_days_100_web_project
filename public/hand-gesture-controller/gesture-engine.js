/**
 * HCI Hand-Gesture Controller Engine
 * Tracks hand landmarks and maps them to synthetic keyboard event strings.
 */
const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('output-canvas');
const canvasCtx = canvasElement.getContext('2d');
const gestureStatus = document.getElementById('current-gesture');
const eventLog = document.getElementById('event-log');

// Helper to append virtual keystroke execution logs to UI
function logKeystroke(message) {
  const line = document.createElement('div');
  line.textContent = `[${new Date().toLocaleTimeString()}] 🚀 ${message}`;
  eventLog.appendChild(line);
  eventLog.scrollTop = eventLog.scrollHeight;
}

// ========================================================
// CORE ALGORITHMIC GESTURE EVALUATOR
// ========================================================
function evaluateGestures(landmarks) {
  const indexTipY = landmarks[8].y;
  const indexKnuckleY = landmarks[6].y;

  const middleTipY = landmarks[12].y;
  const middleKnuckleY = landmarks[10].y;

  const thumbX = landmarks[4].x;
  const thumbBaseX = landmarks[2].x;

  let detectedAction = 'No Action / Neutral';

  // Arrow Up
  if (indexTipY < indexKnuckleY && middleTipY > middleKnuckleY) {
    detectedAction = 'ArrowUp';
  }

  // Arrow Down
  else if (indexTipY < indexKnuckleY && middleTipY < middleKnuckleY) {
    detectedAction = 'ArrowDown';
  }

  // Arrow Left
  else if (Math.abs(thumbX - thumbBaseX) > 0.1 && indexTipY > indexKnuckleY) {
    detectedAction = 'ArrowLeft';
  }

  gestureStatus.textContent = detectedAction;

  // ==================================================
  // FIRE ONLY WHEN GESTURE CHANGES
  // ==================================================
  if (
    detectedAction !== 'No Action / Neutral' &&
    (gestureReleased || detectedAction !== lastDetectedGesture)
  ) {
    triggerSyntheticKey(detectedAction);

    lastDetectedGesture = detectedAction;
    gestureReleased = false;
  }

  // Reset state when hand returns to neutral
  if (detectedAction === 'No Action / Neutral') {
    gestureReleased = true;
    lastDetectedGesture = detectedAction;
  }
}

// ========================================================
// SYNTHETIC BROWSER KEYBOARD INJECTION PIPELINE
// ========================================================
let lastTriggerTime = 0;
const throttleDelay = 200;

// Track gesture state to prevent repeated firing
let lastDetectedGesture = 'No Action / Neutral';
let gestureReleased = true; // Limits events to once every 200ms to prevent game flooding

function triggerSyntheticKey(keyCode) {
  const now = performance.now();
  if (now - lastTriggerTime < throttleDelay) return;
  lastTriggerTime = now;

  logKeystroke(`Dispatched Virtual Key: ${keyCode}`);

  // Create and dispatch the "keydown" structural event natively
  const keydownEvent = new KeyboardEvent('keydown', {
    key: keyCode,
    code: keyCode,
    bubbles: true,
    cancelable: true,
  });
  window.dispatchEvent(keydownEvent);

  // Instantly fire the trailing "keyup" event to reset state
  setTimeout(() => {
    const keyupEvent = new KeyboardEvent('keyup', {
      key: keyCode,
      code: keyCode,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(keyupEvent);
  }, 50);
}

// ========================================================
// MEDIAPIPE PIPELINE SETUP & INTERFACE RENDERING
// ========================================================
function onResults(results) {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const handLandmarks = results.multiHandLandmarks[0];

    // Draw visual landmark coordinates on the debugging overlay canvas
    for (const landmark of handLandmarks) {
      canvasCtx.beginPath();
      canvasCtx.arc(
        landmark.x * canvasElement.width,
        landmark.y * canvasElement.height,
        4,
        0,
        2 * Math.PI
      );
      canvasCtx.fillStyle = '#00ffaa';
      canvasCtx.fill();
    }

    // Run gesture evaluation metrics against the extracted landmark matrix array
    evaluateGestures(handLandmarks);
  } else {
    gestureStatus.textContent = 'No Hand Detected';

    gestureReleased = true;
    lastDetectedGesture = 'No Action / Neutral';
  }
}

const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
hands.onResults(onResults);

// Initialize background hardware camera listener pipeline loop
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 400,
  height: 300,
});
camera.start();
