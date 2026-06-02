/**
 * ═══════════════════════════════════════════════════════════
 * AirType AI — Hand Tracker Module
 * Webcam access + MediaPipe Hands integration
 * ═══════════════════════════════════════════════════════════
 */

export class HandTracker {
  /**
   * @param {HTMLVideoElement} videoEl - Webcam video element
   * @param {HTMLCanvasElement} canvasEl - Canvas for drawing hand skeleton
   */
  constructor(videoEl, canvasEl) {
    this.video = videoEl;
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');

    /** @type {Array<Object>|null} Current detected hands */
    this.hands = null;
    /** @type {boolean} Whether the camera is active */
    this.cameraActive = false;
    /** @type {boolean} Whether tracking is running */
    this.running = false;

    // FPS tracking
    this._frameCount = 0;
    this._lastFpsTime = performance.now();
    this.fps = 0;

    // Callbacks
    this.onResults = null;        // (hands) => void
    this.onFpsUpdate = null;      // (fps) => void
    this.onCameraStatus = null;   // (status: 'online'|'offline'|'error') => void
    this.onHandStatus = null;     // (detected: boolean, count: number) => void

    // MediaPipe instances
    this._hands = null;
    this._camera = null;

    // No-hand timeout
    this._noHandTimeout = null;
    this._lastHandDetected = 0;
  }

  /**
   * Initialize the webcam and MediaPipe Hands.
   * Loads the MediaPipe CDN scripts dynamically.
   */
  async init() {
    try {
      // Load MediaPipe scripts from CDN
      await this._loadMediaPipe();

      // Initialize MediaPipe Hands
      /* global Hands */
      this._hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      this._hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.6
      });

      this._hands.onResults((results) => this._processResults(results));

      // Start webcam
      await this._startCamera();

      this.running = true;
      this._tick();

    } catch (err) {
      console.error('[HandTracker] Initialization failed:', err);
      if (this.onCameraStatus) this.onCameraStatus('error', err.message);
      throw err;
    }
  }

  /**
   * Dynamically load MediaPipe Hands + Camera Utils from CDN.
   */
  _loadMediaPipe() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.Hands) {
        resolve();
        return;
      }

      const scripts = [
        'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js'
      ];

      let loaded = 0;
      scripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          loaded++;
          if (loaded === scripts.length) resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    });
  }

  /**
   * Request webcam access and start streaming.
   */
  async _startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }
      });

      this.video.srcObject = stream;
      await this.video.play();

      this.cameraActive = true;
      if (this.onCameraStatus) this.onCameraStatus('online');

      // Resize canvas to match video
      this._resizeCanvas();
      window.addEventListener('resize', () => this._resizeCanvas());

    } catch (err) {
      this.cameraActive = false;
      if (err.name === 'NotAllowedError') {
        if (this.onCameraStatus) this.onCameraStatus('error', 'Camera permission denied');
        throw new Error('PERMISSION_DENIED');
      } else if (err.name === 'NotFoundError') {
        if (this.onCameraStatus) this.onCameraStatus('error', 'No camera found');
        throw new Error('NO_CAMERA');
      } else {
        if (this.onCameraStatus) this.onCameraStatus('error', err.message);
        throw err;
      }
    }
  }

  /**
   * Resize canvas to match video dimensions.
   */
  _resizeCanvas() {
    const container = this.canvas.parentElement;
    if (!container) return;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
  }

  /**
   * Main render/detection loop.
   */
  async _tick() {
    if (!this.running) return;

    try {
      if (this.video.readyState >= 2) {
        await this._hands.send({ image: this.video });
      }
    } catch (e) {
      // Silently recover from frame processing errors
      console.warn('[HandTracker] Frame error:', e.message);
    }

    // FPS calculation
    this._frameCount++;
    const now = performance.now();
    if (now - this._lastFpsTime >= 1000) {
      this.fps = this._frameCount;
      this._frameCount = 0;
      this._lastFpsTime = now;
      if (this.onFpsUpdate) this.onFpsUpdate(this.fps);
    }

    requestAnimationFrame(() => this._tick());
  }

  /**
   * Process MediaPipe results and draw hand skeleton.
   * @param {Object} results - MediaPipe Hands results
   */
  _processResults(results) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const detected = results.multiHandLandmarks && results.multiHandLandmarks.length > 0;

    if (detected) {
      this._lastHandDetected = performance.now();
      this.hands = results.multiHandLandmarks.map((landmarks, i) => ({
        landmarks,
        handedness: results.multiHandedness?.[i]?.label || 'Unknown'
      }));

      // Draw each hand
      this.hands.forEach(hand => this._drawHand(hand.landmarks));

      if (this.onHandStatus) this.onHandStatus(true, this.hands.length);
    } else {
      this.hands = null;
      // Check if hand has been absent for a while
      if (performance.now() - this._lastHandDetected > 2000) {
        if (this.onHandStatus) this.onHandStatus(false, 0);
      }
    }

    // Send results to gesture engine
    if (this.onResults) this.onResults(this.hands);
  }

  /**
   * Draw hand landmarks and skeletal connections on the canvas.
   * Uses a glowing neon style to match the UI theme.
   * @param {Array} landmarks - 21 hand landmarks
   */
  _drawHand(landmarks) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    // MediaPipe hand connections
    const connections = [
      [0,1],[1,2],[2,3],[3,4],       // Thumb
      [0,5],[5,6],[6,7],[7,8],       // Index
      [0,9],[9,10],[10,11],[11,12],  // Middle (via wrist)
      [0,13],[13,14],[14,15],[15,16],// Ring (via wrist)
      [0,17],[17,18],[18,19],[19,20],// Pinky (via wrist)
      [5,9],[9,13],[13,17]           // Palm connections
    ];

    // Draw connections
    this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = 'round';
    this.ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
    this.ctx.shadowBlur = 8;

    connections.forEach(([a, b]) => {
      const la = landmarks[a];
      const lb = landmarks[b];
      this.ctx.beginPath();
      this.ctx.moveTo(la.x * w, la.y * h);
      this.ctx.lineTo(lb.x * w, lb.y * h);
      this.ctx.stroke();
    });

    // Draw landmarks
    landmarks.forEach((lm, i) => {
      const x = lm.x * w;
      const y = lm.y * h;
      const isFingerTip = [4, 8, 12, 16, 20].includes(i);
      const radius = isFingerTip ? 6 : 3.5;

      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);

      if (isFingerTip) {
        // Fingertips get brighter glow
        this.ctx.fillStyle = i === 8 ? '#a78bfa' : '#06b6d4'; // Index tip = purple
        this.ctx.shadowColor = i === 8 ? 'rgba(167, 139, 250, 0.8)' : 'rgba(6, 182, 212, 0.8)';
        this.ctx.shadowBlur = 12;
      } else {
        this.ctx.fillStyle = 'rgba(99, 102, 241, 0.8)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
      }

      this.ctx.fill();
    });

    // Reset shadow
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = 'transparent';
  }

  /**
   * Get normalized screen coordinates for a specific landmark.
   * @param {number} handIndex - Which hand (0 or 1)
   * @param {number} landmarkIndex - Which landmark (0-20)
   * @returns {{x: number, y: number, z: number}|null}
   */
  getLandmark(handIndex, landmarkIndex) {
    if (!this.hands || !this.hands[handIndex]) return null;
    const lm = this.hands[handIndex].landmarks[landmarkIndex];
    if (!lm) return null;
    return {
      x: lm.x * this.canvas.width,
      y: lm.y * this.canvas.height,
      z: lm.z
    };
  }

  /**
   * Get raw normalized landmark (0-1 range).
   * @param {number} handIndex
   * @param {number} landmarkIndex
   * @returns {{x: number, y: number, z: number}|null}
   */
  getRawLandmark(handIndex, landmarkIndex) {
    if (!this.hands || !this.hands[handIndex]) return null;
    return this.hands[handIndex].landmarks[landmarkIndex] || null;
  }

  /**
   * Stop tracking and release camera.
   */
  destroy() {
    this.running = false;
    if (this.video.srcObject) {
      this.video.srcObject.getTracks().forEach(t => t.stop());
    }
    if (this._hands) {
      this._hands.close();
    }
  }
}
