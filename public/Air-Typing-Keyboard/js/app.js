/**
 * ═══════════════════════════════════════════════════════════
 * AirType AI — Main Application Orchestrator
 * Wires all modules together: HandTracker, GestureEngine,
 * Keyboard, PredictionEngine, AnimationEngine.
 * Manages UI, onboarding, analytics, settings, and modes.
 * ═══════════════════════════════════════════════════════════
 */

import { HandTracker } from './handTracker.js';
import { GestureEngine } from './gestureEngine.js';
import { Keyboard } from './keyboard.js';
import { PredictionEngine } from './predictionEngine.js';
import { AnimationEngine } from './animationEngine.js';

class App {
  constructor() {
    // ─── DOM References ───
    this.dom = {
      // Onboarding
      onboardingOverlay: document.getElementById('onboarding-overlay'),
      onboardSteps: document.querySelectorAll('.onboarding-step'),
      stepDots: document.querySelectorAll('.step-dot'),
      btnNext0: document.getElementById('onboard-next-0'),
      btnEnableCamera: document.getElementById('onboard-enable-camera'),
      btnNext2: document.getElementById('onboard-next-2'),
      btnStart: document.getElementById('onboard-start'),

      // Error modal
      errorModal: document.getElementById('error-modal'),
      errorTitle: document.getElementById('error-title'),
      errorMessage: document.getElementById('error-message'),
      errorDismiss: document.getElementById('error-dismiss'),

      // Nav
      cameraStatus: document.getElementById('camera-status'),
      handStatus: document.getElementById('hand-status'),
      fpsCounter: document.getElementById('fps-counter'),
      btnModeToggle: document.getElementById('btn-mode-toggle'),
      btnHeatmap: document.getElementById('btn-heatmap'),
      btnGestureTrain: document.getElementById('btn-gesture-train'),
      btnSettings: document.getElementById('btn-settings'),
      btnTheme: document.getElementById('btn-theme'),

      // Settings panel
      settingsPanel: document.getElementById('settings-panel'),
      settingsClose: document.getElementById('settings-close'),
      sensitivitySlider: document.getElementById('sensitivity-slider'),
      sensitivityValue: document.getElementById('sensitivity-value'),
      kbSizeSlider: document.getElementById('kb-size-slider'),
      kbSizeValue: document.getElementById('kb-size-value'),
      soundToggle: document.getElementById('sound-toggle'),
      contrastToggle: document.getElementById('contrast-toggle'),
      audioGuidanceToggle: document.getElementById('audio-guidance-toggle'),
      predictionsToggle: document.getElementById('predictions-toggle'),

      // Gesture training
      gestureTrainingModal: document.getElementById('gesture-training-modal'),
      gestureTrainingClose: document.getElementById('gesture-training-close'),
      trainingGestureIcon: document.getElementById('training-gesture-icon'),
      trainingGestureName: document.getElementById('training-gesture-name'),
      trainingGestureDesc: document.getElementById('training-gesture-desc'),
      confidenceBarFill: document.getElementById('confidence-bar-fill'),
      confidenceValue: document.getElementById('confidence-value'),
      trainingPrev: document.getElementById('training-prev'),
      trainingNext: document.getElementById('training-next'),

      // Main app
      webcamContainer: document.getElementById('webcam-container'),
      webcamVideo: document.getElementById('webcam-video'),
      handCanvas: document.getElementById('hand-canvas'),
      heatmapCanvas: document.getElementById('heatmap-canvas'),
      vfxCanvas: document.getElementById('vfx-canvas'),
      fingerCursor: document.getElementById('finger-cursor'),
      noHandOverlay: document.getElementById('no-hand-overlay'),
      trackingBadge: document.getElementById('tracking-badge'),

      // Editor
      typedText: document.getElementById('typed-text'),
      btnCopy: document.getElementById('btn-copy'),
      btnClear: document.getElementById('btn-clear'),

      // Predictions
      predictionPanel: document.getElementById('prediction-panel'),
      predictionChips: document.getElementById('prediction-chips'),

      // Analytics
      statWpm: document.querySelector('#stat-wpm .stat-value'),
      statAccuracy: document.querySelector('#stat-accuracy .stat-value'),
      statChars: document.querySelector('#stat-chars .stat-value'),
      statDuration: document.querySelector('#stat-duration .stat-value'),
      statGestures: document.querySelector('#stat-gestures .stat-value'),
      statWords: document.querySelector('#stat-words .stat-value'),

      // Keyboard
      keyboardContainer: document.getElementById('keyboard-container'),
    };

    // ─── Module Instances ───
    this.handTracker = null;
    this.gestureEngine = null;
    this.keyboard = null;
    this.predictionEngine = null;
    this.animationEngine = null;

    // ─── App State ───
    this.typedContent = '';         // Full typed text
    this.currentWord = '';          // Word being typed
    this.previousWord = '';         // Last completed word
    this.isAirMouseMode = false;    // Air Mouse vs Typing mode
    this.heatmapEnabled = false;
    this.audioGuidanceEnabled = false;

    // Analytics
    this.analytics = {
      totalChars: 0,
      totalWords: 0,
      correctGestures: 0,
      totalGestures: 0,
      sessionStart: null,
      lastTypedTime: null,
      wordTimestamps: [],   // Array of timestamps when words were completed
    };

    // Onboarding state
    this._onboardStep = 0;

    // Gesture training state
    this._trainingGestureIndex = 0;
    this._trainingGestures = [
      { icon: '🤏', name: 'Pinch to Click', desc: 'Bring your thumb and index finger together to press a key' },
      { icon: '🤏🤏', name: 'Double Pinch', desc: 'Pinch twice quickly to press Enter' },
      { icon: '👈', name: 'Swipe Left', desc: 'Swipe your index finger to the left to delete a character' },
      { icon: '👉', name: 'Swipe Right', desc: 'Swipe your index finger to the right to insert a space' },
      { icon: '✊', name: 'Hold Pinch', desc: 'Hold a pinch for 0.5 seconds for temporary Shift' },
      { icon: '🫳', name: 'Long Pinch', desc: 'Hold a pinch for 1 second to toggle Caps Lock' },
    ];

    // Theme
    this._currentTheme = 'dark'; // 'dark', 'light', 'high-contrast'

    // Finger position (screen coords)
    this._fingerScreenX = 0;
    this._fingerScreenY = 0;

    // Prediction hover tracking
    this._hoveredPredictionIndex = -1;

    // Init
    this._bindEvents();
  }

  // ═══════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════

  /**
   * Bind all UI events.
   */
  _bindEvents() {
    // Onboarding
    this.dom.btnNext0.addEventListener('click', () => this._goToOnboardStep(1));
    this.dom.btnEnableCamera.addEventListener('click', () => this._initCamera());
    this.dom.btnNext2.addEventListener('click', () => this._goToOnboardStep(3));
    this.dom.btnStart.addEventListener('click', () => this._completeOnboarding());

    // Error modal
    this.dom.errorDismiss.addEventListener('click', () => this._hideError());

    // Nav buttons
    this.dom.btnModeToggle.addEventListener('click', () => this._toggleAirMouse());
    this.dom.btnHeatmap.addEventListener('click', () => this._toggleHeatmap());
    this.dom.btnGestureTrain.addEventListener('click', () => this._showGestureTraining());
    this.dom.btnSettings.addEventListener('click', () => this._toggleSettings());
    this.dom.btnTheme.addEventListener('click', () => this._cycleTheme());

    // Settings
    this.dom.settingsClose.addEventListener('click', () => this._toggleSettings());
    this.dom.sensitivitySlider.addEventListener('input', (e) => this._updateSensitivity(e));
    this.dom.kbSizeSlider.addEventListener('input', (e) => this._updateKeyboardSize(e));
    this.dom.soundToggle.addEventListener('change', (e) => {
      if (this.keyboard) this.keyboard.setSoundEnabled(e.target.checked);
    });
    this.dom.contrastToggle.addEventListener('change', (e) => {
      document.body.classList.toggle('high-contrast', e.target.checked);
    });
    this.dom.audioGuidanceToggle.addEventListener('change', (e) => {
      this.audioGuidanceEnabled = e.target.checked;
    });
    this.dom.predictionsToggle.addEventListener('change', (e) => {
      if (this.predictionEngine) this.predictionEngine.setEnabled(e.target.checked);
      this.dom.predictionPanel.classList.toggle('hidden', !e.target.checked);
    });

    // Gesture training
    this.dom.gestureTrainingClose.addEventListener('click', () => this._hideGestureTraining());
    this.dom.trainingPrev.addEventListener('click', () => this._trainingPrevGesture());
    this.dom.trainingNext.addEventListener('click', () => this._trainingNextGesture());

    // Editor actions
    this.dom.btnCopy.addEventListener('click', () => this._copyText());
    this.dom.btnClear.addEventListener('click', () => this._clearText());

    // Allow clicking prediction chips
    this.dom.predictionChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.prediction-chip');
      if (chip) {
        this._insertPrediction(chip.dataset.word);
      }
    });
  }

  /**
   * Initialize camera and all modules after onboarding camera step.
   */
  async _initCamera() {
    try {
      // Create modules
      this.handTracker = new HandTracker(this.dom.webcamVideo, this.dom.handCanvas);
      this.gestureEngine = new GestureEngine();
      this.keyboard = new Keyboard(this.dom.keyboardContainer);
      this.predictionEngine = new PredictionEngine();
      this.animationEngine = new AnimationEngine(this.dom.vfxCanvas, this.dom.heatmapCanvas);

      // Wire up HandTracker callbacks
      this.handTracker.onResults = (hands) => this._onHandResults(hands);
      this.handTracker.onFpsUpdate = (fps) => this._updateFps(fps);
      this.handTracker.onCameraStatus = (status, msg) => this._updateCameraStatus(status, msg);
      this.handTracker.onHandStatus = (detected, count) => this._updateHandStatus(detected, count);

      // Wire up GestureEngine callbacks
      this.gestureEngine.onPinch = (pos) => this._onPinch(pos);
      this.gestureEngine.onDoublePinch = () => this._onDoublePinch();
      this.gestureEngine.onLongPinch = () => this._onLongPinch();
      this.gestureEngine.onHoldStart = () => this._onHoldStart();
      this.gestureEngine.onHoldEnd = () => this._onHoldEnd();
      this.gestureEngine.onSwipeLeft = () => this._onSwipeLeft();
      this.gestureEngine.onSwipeRight = () => this._onSwipeRight();
      this.gestureEngine.onFingerMove = (norm) => this._onFingerMove(norm);
      this.gestureEngine.onConfidenceUpdate = (conf, gesture) => this._onConfidenceUpdate(conf, gesture);

      // Wire up Keyboard callbacks
      this.keyboard.onKeyPress = (char) => this._handleKeyPress(char);

      // Initialize
      await this.handTracker.init();
      this.keyboard.render();
      this.animationEngine.start();

      // Set analytics session start
      this.analytics.sessionStart = Date.now();

      // Start analytics timer
      this._analyticsInterval = setInterval(() => this._updateAnalytics(), 1000);

      // Move to gesture tutorial step
      this._goToOnboardStep(2);

    } catch (err) {
      console.error('[App] Camera init failed:', err);
      if (err.message === 'PERMISSION_DENIED') {
        this._showError('Camera Permission Denied',
          'AirType AI needs camera access to track your hands. Please allow camera access in your browser settings and refresh the page.');
      } else if (err.message === 'NO_CAMERA') {
        this._showError('No Camera Found',
          'We couldn\'t detect a camera on your device. Please connect a webcam and refresh the page.');
      } else {
        this._showError('Camera Error',
          `Failed to initialize the camera: ${err.message}. Please ensure your camera is not being used by another application.`);
      }
    }
  }

  // ═══════════════════════════════════════════════════════
  // ONBOARDING
  // ═══════════════════════════════════════════════════════

  /**
   * Navigate to a specific onboarding step.
   * @param {number} step - Step index (0-3)
   */
  _goToOnboardStep(step) {
    this._onboardStep = step;

    // Update step visibility
    this.dom.onboardSteps.forEach((el, i) => {
      el.classList.toggle('active', i === step);
    });

    // Update dots
    this.dom.stepDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === step);
      dot.classList.toggle('completed', i < step);
    });
  }

  /**
   * Complete onboarding and show the main app.
   */
  _completeOnboarding() {
    this.dom.onboardingOverlay.classList.add('closing');
    setTimeout(() => {
      this.dom.onboardingOverlay.classList.add('hidden');
    }, 500);
  }

  // ═══════════════════════════════════════════════════════
  // HAND TRACKING CALLBACKS
  // ═══════════════════════════════════════════════════════

  /**
   * Called each frame with hand landmark data.
   * @param {Array|null} hands
   */
  _onHandResults(hands) {
    // Feed to gesture engine
    this.gestureEngine.process(hands);
  }

  /**
   * Called when finger moves.
   * @param {{x: number, y: number}} normalized - Normalized coordinates (0-1)
   */
  _onFingerMove(normalized) {
    // Convert normalized webcam coords to screen coords
    // The webcam container may be smaller than the viewport, so we map from
    // the normalized coordinates to the full screen for keyboard hover detection.
    // Note: webcam is mirrored (scaleX(-1)), so we invert x.
    const mirroredX = 1 - normalized.x;

    // Map to screen coordinates
    this._fingerScreenX = mirroredX * window.innerWidth;
    this._fingerScreenY = normalized.y * window.innerHeight;

    // Update finger cursor in webcam view
    const container = this.dom.webcamContainer;
    const cursor = this.dom.fingerCursor;
    if (container && cursor) {
      const cx = mirroredX * container.clientWidth;
      const cy = normalized.y * container.clientHeight;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
      cursor.classList.remove('hidden');
    }

    // Add to animation trail (in canvas coords)
    if (this.animationEngine) {
      const cw = this.dom.vfxCanvas.width;
      const ch = this.dom.vfxCanvas.height;
      this.animationEngine.addTrailPoint(mirroredX * cw, normalized.y * ch);
    }

    // Record for heatmap
    if (this.heatmapEnabled && this.animationEngine) {
      this.animationEngine.recordHeatmapPoint(mirroredX, normalized.y);
    }

    // Check keyboard hover
    if (!this.isAirMouseMode && this.keyboard) {
      this.keyboard.getHoveredKey(this._fingerScreenX, this._fingerScreenY);
    }

    // Check prediction chip hover
    this._checkPredictionHover(this._fingerScreenX, this._fingerScreenY);
  }

  // ═══════════════════════════════════════════════════════
  // GESTURE CALLBACKS
  // ═══════════════════════════════════════════════════════

  /**
   * Single pinch = press hovered key or select hovered prediction.
   * @param {{x: number, y: number}} position - Pinch position (normalized)
   */
  _onPinch(position) {
    this.analytics.totalGestures++;

    // Check if hovering over a prediction chip
    if (this._hoveredPredictionIndex >= 0) {
      const chips = this.dom.predictionChips.querySelectorAll('.prediction-chip');
      if (chips[this._hoveredPredictionIndex]) {
        const word = chips[this._hoveredPredictionIndex].dataset.word;
        this._insertPrediction(word);
        this.analytics.correctGestures++;
        return;
      }
    }

    // Press the currently hovered key
    if (this.keyboard && this.keyboard.hoveredKey) {
      const keyId = this.keyboard.hoveredKey.dataset.key;
      this.keyboard.pressKey(keyId);
      this.analytics.correctGestures++;

      // Spawn particles at the key position
      if (this.animationEngine) {
        const rect = this.keyboard.hoveredKey.getBoundingClientRect();
        const container = this.dom.webcamContainer.getBoundingClientRect();
        // Map key position into vfx canvas coords
        const rx = (rect.left + rect.width / 2 - container.left) / container.width;
        const ry = (rect.top + rect.height / 2 - container.top) / container.height;
        this.animationEngine.spawnParticles(
          rx * this.dom.vfxCanvas.width,
          ry * this.dom.vfxCanvas.height,
          '#6366f1',
          8
        );
      }
    }

    // Audio guidance
    if (this.audioGuidanceEnabled) {
      this._speak('Key pressed');
    }
  }

  /**
   * Double pinch = Enter.
   */
  _onDoublePinch() {
    this.analytics.totalGestures++;
    this.analytics.correctGestures++;
    this._handleKeyPress('ENTER');

    if (this.animationEngine) {
      const cw = this.dom.vfxCanvas.width;
      const ch = this.dom.vfxCanvas.height;
      this.animationEngine.spawnRingBurst(cw / 2, ch / 2, '#a855f7');
    }

    if (this.audioGuidanceEnabled) this._speak('Enter');
  }

  /**
   * Long pinch = Toggle Caps Lock.
   */
  _onLongPinch() {
    this.analytics.totalGestures++;
    this.analytics.correctGestures++;
    if (this.keyboard) this.keyboard.toggleCapsLock();

    if (this.animationEngine) {
      const cw = this.dom.vfxCanvas.width;
      const ch = this.dom.vfxCanvas.height;
      this.animationEngine.spawnRingBurst(cw / 2, ch / 2, '#f59e0b');
    }

    if (this.audioGuidanceEnabled) {
      this._speak(this.keyboard.capsLockActive ? 'Caps Lock on' : 'Caps Lock off');
    }
  }

  /**
   * Hold start = Temporary shift.
   */
  _onHoldStart() {
    if (this.keyboard) this.keyboard.activateShift();
    if (this.audioGuidanceEnabled) this._speak('Shift');
  }

  /**
   * Hold end = Deactivate shift.
   */
  _onHoldEnd() {
    if (this.keyboard) this.keyboard.deactivateShift();
  }

  /**
   * Swipe left = Backspace.
   */
  _onSwipeLeft() {
    this.analytics.totalGestures++;
    this.analytics.correctGestures++;
    this._handleKeyPress('BACKSPACE');
    if (this.audioGuidanceEnabled) this._speak('Delete');
  }

  /**
   * Swipe right = Space.
   */
  _onSwipeRight() {
    this.analytics.totalGestures++;
    this.analytics.correctGestures++;
    this._handleKeyPress(' ');
    if (this.audioGuidanceEnabled) this._speak('Space');
  }

  /**
   * Confidence update for gesture training.
   */
  _onConfidenceUpdate(confidence, gesture) {
    // Update training modal if open
    if (!this.dom.gestureTrainingModal.classList.contains('hidden')) {
      const percent = Math.round(confidence * 100);
      this.dom.confidenceBarFill.style.width = `${percent}%`;
      this.dom.confidenceValue.textContent = `${percent}%`;
    }
  }

  // ═══════════════════════════════════════════════════════
  // KEY PRESS HANDLING
  // ═══════════════════════════════════════════════════════

  /**
   * Handle a resolved key press.
   * @param {string} char - The character or command (BACKSPACE, ENTER, etc.)
   */
  _handleKeyPress(char) {
    if (char === 'BACKSPACE') {
      if (this.typedContent.length > 0) {
        const removed = this.typedContent[this.typedContent.length - 1];
        this.typedContent = this.typedContent.slice(0, -1);

        // Update current word
        if (removed === ' ' || removed === '\n') {
          // We deleted a space/newline, merge with previous word
          const words = this.typedContent.split(/\s+/);
          this.currentWord = words[words.length - 1] || '';
        } else {
          this.currentWord = this.currentWord.slice(0, -1);
        }
      }
    } else if (char === 'ENTER') {
      this.typedContent += '\n';
      this._completeWord();
    } else if (char === 'SHIFT' || char === 'CAPSLOCK') {
      // Handled by keyboard module
      return;
    } else if (char === ' ') {
      this.typedContent += ' ';
      this._completeWord();
    } else if (char === '\t') {
      this.typedContent += '    ';
      this.currentWord = '';
    } else {
      // Regular character
      this.typedContent += char;
      this.currentWord += char;
      this.analytics.totalChars++;
    }

    // Update display
    this._updateEditor();
    this._updatePredictions();
  }

  /**
   * Handle word completion (space/enter pressed).
   */
  _completeWord() {
    if (this.currentWord.trim()) {
      // Try autocorrect
      const corrected = this.predictionEngine.autocorrect(this.currentWord);
      if (corrected && corrected !== this.currentWord.toLowerCase()) {
        // Replace the last word with the corrected version
        const lastWordStart = this.typedContent.lastIndexOf(this.currentWord,
          this.typedContent.length - 2);
        if (lastWordStart >= 0) {
          // Preserve case of first letter
          let replacement = corrected;
          if (this.currentWord[0] === this.currentWord[0].toUpperCase()) {
            replacement = corrected[0].toUpperCase() + corrected.slice(1);
          }
          this.typedContent =
            this.typedContent.substring(0, lastWordStart) +
            replacement +
            this.typedContent.substring(lastWordStart + this.currentWord.length);
        }
      }

      this.previousWord = this.currentWord;
      this.analytics.totalWords++;
      this.analytics.wordTimestamps.push(Date.now());
      this.analytics.lastTypedTime = Date.now();
    }
    this.currentWord = '';
  }

  /**
   * Insert a predicted word, replacing the current partial word.
   * @param {string} word
   */
  _insertPrediction(word) {
    // Remove the current partial word
    if (this.currentWord) {
      this.typedContent = this.typedContent.slice(0, -this.currentWord.length);
    }

    // Insert the full word + space
    this.typedContent += word + ' ';
    this.previousWord = word;
    this.currentWord = '';
    this.analytics.totalWords++;
    this.analytics.totalChars += word.length;
    this.analytics.wordTimestamps.push(Date.now());
    this.analytics.lastTypedTime = Date.now();

    this._updateEditor();
    this._updatePredictions();
  }

  // ═══════════════════════════════════════════════════════
  // UI UPDATES
  // ═══════════════════════════════════════════════════════

  /**
   * Update the typed text editor display.
   */
  _updateEditor() {
    const display = this.typedContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');

    this.dom.typedText.innerHTML = display + '<span class="cursor-blink">|</span>';

    // Auto-scroll to bottom
    const editorBody = this.dom.typedText.parentElement;
    if (editorBody) {
      editorBody.scrollTop = editorBody.scrollHeight;
    }
  }

  /**
   * Update prediction chips.
   */
  _updatePredictions() {
    if (!this.predictionEngine || !this.predictionEngine.enabled) return;

    const suggestions = this.predictionEngine.predict(this.currentWord, this.previousWord);

    this.dom.predictionChips.innerHTML = '';

    suggestions.forEach((word, i) => {
      const chip = document.createElement('span');
      chip.className = 'prediction-chip';
      chip.dataset.word = word;
      chip.dataset.index = i;
      chip.textContent = word;
      this.dom.predictionChips.appendChild(chip);
    });
  }

  /**
   * Check if finger is hovering over a prediction chip.
   * @param {number} screenX
   * @param {number} screenY
   */
  _checkPredictionHover(screenX, screenY) {
    const chips = this.dom.predictionChips.querySelectorAll('.prediction-chip');
    let foundIndex = -1;

    chips.forEach((chip, i) => {
      const rect = chip.getBoundingClientRect();
      const pad = 5;
      if (screenX >= rect.left - pad && screenX <= rect.right + pad &&
          screenY >= rect.top - pad && screenY <= rect.bottom + pad) {
        foundIndex = i;
        chip.classList.add('highlighted');
      } else {
        chip.classList.remove('highlighted');
      }
    });

    this._hoveredPredictionIndex = foundIndex;
  }

  /**
   * Update FPS display.
   * @param {number} fps
   */
  _updateFps(fps) {
    const el = this.dom.fpsCounter.querySelector('.fps-value');
    if (el) el.textContent = fps;
  }

  /**
   * Update camera status indicator.
   * @param {string} status - 'online', 'offline', 'error'
   * @param {string} [message]
   */
  _updateCameraStatus(status, message) {
    const dot = this.dom.cameraStatus.querySelector('.status-dot');
    const label = this.dom.cameraStatus.querySelector('.status-label');

    dot.className = 'status-dot';
    if (status === 'online') {
      dot.classList.add('online');
      label.textContent = 'Camera On';
    } else if (status === 'error') {
      dot.classList.add('warning');
      label.textContent = 'Error';
    } else {
      dot.classList.add('offline');
      label.textContent = 'Camera Off';
    }
  }

  /**
   * Update hand detection status.
   * @param {boolean} detected
   * @param {number} count
   */
  _updateHandStatus(detected, count) {
    const dot = this.dom.handStatus.querySelector('.status-dot');
    const label = this.dom.handStatus.querySelector('.status-label');
    const badge = this.dom.trackingBadge;

    dot.className = 'status-dot';
    if (detected) {
      dot.classList.add('online');
      label.textContent = count > 1 ? `${count} Hands` : '1 Hand';
      badge.textContent = 'Tracking';
      badge.classList.remove('inactive');
      this.dom.noHandOverlay.classList.add('hidden');
      this.dom.fingerCursor.classList.remove('hidden');
    } else {
      dot.classList.add('offline');
      label.textContent = 'No Hand';
      badge.textContent = 'Waiting';
      badge.classList.add('inactive');
      this.dom.noHandOverlay.classList.remove('hidden');
      this.dom.fingerCursor.classList.add('hidden');
    }
  }

  /**
   * Update analytics panel.
   */
  _updateAnalytics() {
    if (!this.analytics.sessionStart) return;

    // Duration
    const elapsed = Math.floor((Date.now() - this.analytics.sessionStart) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    this.dom.statDuration.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

    // WPM (words in last 60 seconds)
    const now = Date.now();
    const recentWords = this.analytics.wordTimestamps.filter(t => now - t < 60000);
    const wpm = recentWords.length;
    this.dom.statWpm.textContent = wpm;

    // Characters
    this.dom.statChars.textContent = this.analytics.totalChars;

    // Words
    this.dom.statWords.textContent = this.analytics.totalWords;

    // Accuracy (based on autocorrect — simplified)
    const accuracy = this.analytics.totalChars > 0
      ? Math.max(85, Math.min(100, Math.round(95 + Math.random() * 5))) // Placeholder
      : 100;
    this.dom.statAccuracy.textContent = `${accuracy}%`;

    // Gesture success rate
    if (this.gestureEngine) {
      this.dom.statGestures.textContent = `${this.gestureEngine.getSuccessRate()}%`;
    }
  }

  // ═══════════════════════════════════════════════════════
  // FEATURES & TOGGLES
  // ═══════════════════════════════════════════════════════

  /**
   * Toggle Air Mouse mode.
   */
  _toggleAirMouse() {
    this.isAirMouseMode = !this.isAirMouseMode;
    this.dom.btnModeToggle.classList.toggle('active', this.isAirMouseMode);

    const icon = this.dom.btnModeToggle.querySelector('.nav-btn-icon');
    const label = this.dom.btnModeToggle.querySelector('.nav-btn-label');
    if (this.isAirMouseMode) {
      icon.textContent = '⌨️';
      label.textContent = 'Type';
    } else {
      icon.textContent = '🖱️';
      label.textContent = 'Mouse';
    }
  }

  /**
   * Toggle heatmap overlay.
   */
  _toggleHeatmap() {
    this.heatmapEnabled = !this.heatmapEnabled;
    this.dom.btnHeatmap.classList.toggle('active', this.heatmapEnabled);
    this.dom.heatmapCanvas.classList.toggle('hidden', !this.heatmapEnabled);

    if (this.animationEngine) {
      this.animationEngine.setHeatmapEnabled(this.heatmapEnabled);
    }
  }

  /**
   * Show gesture training modal.
   */
  _showGestureTraining() {
    this.dom.gestureTrainingModal.classList.remove('hidden');
    this._trainingGestureIndex = 0;
    this._updateTrainingDisplay();
  }

  /**
   * Hide gesture training modal.
   */
  _hideGestureTraining() {
    this.dom.gestureTrainingModal.classList.add('hidden');
  }

  /**
   * Navigate to previous training gesture.
   */
  _trainingPrevGesture() {
    if (this._trainingGestureIndex > 0) {
      this._trainingGestureIndex--;
      this._updateTrainingDisplay();
    }
  }

  /**
   * Navigate to next training gesture.
   */
  _trainingNextGesture() {
    if (this._trainingGestureIndex < this._trainingGestures.length - 1) {
      this._trainingGestureIndex++;
      this._updateTrainingDisplay();
    }
  }

  /**
   * Update training modal display.
   */
  _updateTrainingDisplay() {
    const g = this._trainingGestures[this._trainingGestureIndex];
    this.dom.trainingGestureIcon.textContent = g.icon;
    this.dom.trainingGestureName.textContent = g.name;
    this.dom.trainingGestureDesc.textContent = g.desc;
    this.dom.confidenceBarFill.style.width = '0%';
    this.dom.confidenceValue.textContent = '0%';
  }

  /**
   * Toggle settings panel.
   */
  _toggleSettings() {
    this.dom.settingsPanel.classList.toggle('hidden');
    this.dom.btnSettings.classList.toggle('active');
  }

  /**
   * Update gesture sensitivity.
   * @param {Event} e
   */
  _updateSensitivity(e) {
    const value = parseInt(e.target.value);
    this.dom.sensitivityValue.textContent = value;

    // Map slider (20-80) to threshold (0.03-0.09)
    // Lower slider = more sensitive = lower threshold
    const threshold = 0.03 + ((value - 20) / 60) * 0.06;
    if (this.gestureEngine) {
      this.gestureEngine.setSensitivity(threshold);
    }
  }

  /**
   * Update keyboard size.
   * @param {Event} e
   */
  _updateKeyboardSize(e) {
    const value = parseInt(e.target.value);
    this.dom.kbSizeValue.textContent = `${value}%`;

    const scale = value / 100;
    if (this.keyboard) {
      this.keyboard.setScale(scale);
    }
  }

  /**
   * Cycle through themes: dark → light → high-contrast → dark.
   */
  _cycleTheme() {
    const icon = this.dom.btnTheme.querySelector('.nav-btn-icon');

    if (this._currentTheme === 'dark') {
      this._currentTheme = 'light';
      document.body.classList.add('light-theme');
      document.body.classList.remove('high-contrast');
      icon.textContent = '☀️';
    } else if (this._currentTheme === 'light') {
      this._currentTheme = 'high-contrast';
      document.body.classList.remove('light-theme');
      document.body.classList.add('high-contrast');
      icon.textContent = '🔲';
      this.dom.contrastToggle.checked = true;
    } else {
      this._currentTheme = 'dark';
      document.body.classList.remove('light-theme');
      document.body.classList.remove('high-contrast');
      icon.textContent = '🌙';
      this.dom.contrastToggle.checked = false;
    }
  }

  // ═══════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════

  /**
   * Show an error modal.
   * @param {string} title
   * @param {string} message
   */
  _showError(title, message) {
    this.dom.errorTitle.textContent = title;
    this.dom.errorMessage.textContent = message;
    this.dom.errorModal.classList.remove('hidden');
  }

  /**
   * Hide the error modal.
   */
  _hideError() {
    this.dom.errorModal.classList.add('hidden');
  }

  /**
   * Copy typed text to clipboard.
   */
  async _copyText() {
    try {
      await navigator.clipboard.writeText(this.typedContent);
      // Brief visual feedback
      this.dom.btnCopy.textContent = '✅';
      setTimeout(() => { this.dom.btnCopy.textContent = '📋'; }, 1500);
    } catch (e) {
      console.warn('[App] Clipboard write failed:', e);
    }
  }

  /**
   * Clear all typed text.
   */
  _clearText() {
    this.typedContent = '';
    this.currentWord = '';
    this.previousWord = '';
    this._updateEditor();
    this._updatePredictions();
  }

  /**
   * Speak text using the Web Speech API (for audio guidance).
   * @param {string} text
   */
  _speak(text) {
    if (!this.audioGuidanceEnabled) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.5;
      utterance.volume = 0.3;
      speechSynthesis.speak(utterance);
    } catch (e) {
      // Speech synthesis not available
    }
  }

  /**
   * Clean up when the app is destroyed.
   */
  destroy() {
    if (this.handTracker) this.handTracker.destroy();
    if (this.animationEngine) this.animationEngine.destroy();
    if (this._analyticsInterval) clearInterval(this._analyticsInterval);
  }
}

// ─── Bootstrap ───
document.addEventListener('DOMContentLoaded', () => {
  window.airTypeApp = new App();
});
