/**
 * ═══════════════════════════════════════════════════════════
 * AirType AI — Gesture Engine
 * Recognizes pinch, swipe, hold, and compound gestures
 * from hand landmark data.
 * ═══════════════════════════════════════════════════════════
 */

export class GestureEngine {
  /**
   * @param {Object} options
   * @param {number} options.pinchThreshold - Distance in normalized units for pinch detection
   */
  constructor(options = {}) {
    /** Pinch distance threshold (normalized 0-1 coords, so small) */
    this.pinchThreshold = options.pinchThreshold || 0.06;

    // ─── State tracking ───
    this._prevIndexTip = null;      // Previous index fingertip position
    this._prevThumbTip = null;      // Previous thumb tip position
    this._pinching = false;         // Currently in a pinch
    this._pinchStartTime = 0;       // When the current pinch started
    this._lastPinchTime = 0;        // When the last pinch ended
    this._pinchCount = 0;           // Consecutive pinch count (for double-pinch)
    this._pinchCooldown = false;    // Prevent rapid re-triggering

    // Swipe tracking
    this._swipeHistory = [];        // Recent index tip x-positions
    this._swipeHistoryMax = 8;      // Frames to track for swipe
    this._lastSwipeTime = 0;

    // Hold tracking
    this._holdTriggered = false;

    // Long pinch tracking
    this._longPinchTriggered = false;

    // Gesture confidence
    this._confidence = 0;
    this._lastGesture = null;

    // Debounce timings (ms)
    this._pinchDebounce = 300;
    this._swipeDebounce = 400;
    this._doublePinchWindow = 400;
    this._holdDuration = 500;        // 500ms for temporary shift
    this._longPinchDuration = 1000;  // 1s for caps lock

    // Statistics
    this.totalGestures = 0;
    this.successfulGestures = 0;

    // Callbacks
    this.onPinch = null;           // (position: {x, y}) => void
    this.onDoublePinch = null;     // () => void
    this.onLongPinch = null;       // () => void
    this.onHoldStart = null;       // () => void
    this.onHoldEnd = null;         // () => void
    this.onSwipeLeft = null;       // () => void
    this.onSwipeRight = null;      // () => void
    this.onFingerMove = null;      // (position: {x, y}, normalized: {x, y}) => void
    this.onPinchStateChange = null; // (isPinching: boolean) => void
    this.onConfidenceUpdate = null; // (confidence: number, gesture: string) => void
  }

  /**
   * Set the pinch threshold distance.
   * @param {number} threshold - Normalized distance (0-1)
   */
  setSensitivity(threshold) {
    this.pinchThreshold = threshold;
  }

  /**
   * Process hand landmark data each frame.
   * Detects gestures and fires callbacks.
   * @param {Array|null} hands - Array of hand data from HandTracker
   */
  process(hands) {
    if (!hands || hands.length === 0) {
      // Reset state when no hands detected
      this._resetState();
      return;
    }

    // Use the first hand for gesture detection
    const hand = hands[0];
    const landmarks = hand.landmarks;

    // Key landmarks (normalized 0-1)
    const thumbTip = landmarks[4];    // Thumb tip
    const indexTip = landmarks[8];    // Index fingertip
    const indexMcp = landmarks[5];    // Index finger MCP (base)

    if (!thumbTip || !indexTip) return;

    // ─── Emit finger position ───
    if (this.onFingerMove) {
      this.onFingerMove(
        { x: indexTip.x, y: indexTip.y },  // normalized
        { x: indexTip.x, y: indexTip.y }   // also normalized, will be screen-mapped by consumer
      );
    }

    // ─── Pinch Detection ───
    const pinchDist = this._distance(thumbTip, indexTip);
    const isPinching = pinchDist < this.pinchThreshold;

    // Update confidence
    if (isPinching) {
      this._confidence = Math.min(1, 1 - (pinchDist / this.pinchThreshold));
    } else {
      this._confidence = Math.max(0, 1 - (pinchDist / (this.pinchThreshold * 3)));
    }

    // Pinch state transition: not pinching → pinching
    if (isPinching && !this._pinching) {
      this._pinching = true;
      this._pinchStartTime = performance.now();
      this._holdTriggered = false;
      this._longPinchTriggered = false;

      if (this.onPinchStateChange) this.onPinchStateChange(true);
    }

    // Pinch state transition: pinching → released
    if (!isPinching && this._pinching) {
      this._pinching = false;
      const pinchDuration = performance.now() - this._pinchStartTime;
      const now = performance.now();

      if (this.onPinchStateChange) this.onPinchStateChange(false);

      // End hold if active
      if (this._holdTriggered) {
        this._holdTriggered = false;
        if (this.onHoldEnd) this.onHoldEnd();
        this._emitGesture('hold_end');
      }

      // Don't fire pinch if it was a long pinch (caps lock)
      if (this._longPinchTriggered) {
        this._longPinchTriggered = false;
        return;
      }

      // Don't fire pinch if it was a hold (shift)
      if (pinchDuration > this._holdDuration) {
        return;
      }

      // Check for double pinch
      if (now - this._lastPinchTime < this._doublePinchWindow) {
        this._pinchCount++;
        if (this._pinchCount >= 2) {
          // Double pinch detected
          if (!this._pinchCooldown) {
            this._pinchCooldown = true;
            if (this.onDoublePinch) this.onDoublePinch();
            this._emitGesture('double_pinch');
            setTimeout(() => { this._pinchCooldown = false; }, this._pinchDebounce);
          }
          this._pinchCount = 0;
          this._lastPinchTime = 0;
          return;
        }
      } else {
        this._pinchCount = 1;
      }

      this._lastPinchTime = now;

      // Delay single pinch to wait for possible double pinch
      setTimeout(() => {
        if (this._pinchCount === 1 && performance.now() - this._lastPinchTime >= this._doublePinchWindow * 0.8) {
          // Single pinch confirmed
          if (!this._pinchCooldown) {
            this._pinchCooldown = true;
            const midX = (thumbTip.x + indexTip.x) / 2;
            const midY = (thumbTip.y + indexTip.y) / 2;
            if (this.onPinch) this.onPinch({ x: midX, y: midY });
            this._emitGesture('pinch');
            setTimeout(() => { this._pinchCooldown = false; }, this._pinchDebounce * 0.5);
          }
          this._pinchCount = 0;
        }
      }, this._doublePinchWindow);
    }

    // ─── Hold Detection (pinch sustained) ───
    if (this._pinching) {
      const duration = performance.now() - this._pinchStartTime;

      // Temporary shift after holdDuration
      if (duration > this._holdDuration && !this._holdTriggered && !this._longPinchTriggered) {
        this._holdTriggered = true;
        if (this.onHoldStart) this.onHoldStart();
        this._emitGesture('hold_start');
      }

      // Caps lock after longPinchDuration
      if (duration > this._longPinchDuration && !this._longPinchTriggered) {
        this._longPinchTriggered = true;
        this._holdTriggered = false; // Override hold
        if (this.onHoldEnd) this.onHoldEnd(); // End hold state
        if (this.onLongPinch) this.onLongPinch();
        this._emitGesture('long_pinch');
      }
    }

    // ─── Swipe Detection ───
    this._swipeHistory.push({ x: indexTip.x, y: indexTip.y, t: performance.now() });
    if (this._swipeHistory.length > this._swipeHistoryMax) {
      this._swipeHistory.shift();
    }

    if (this._swipeHistory.length >= this._swipeHistoryMax && !this._pinching) {
      const oldest = this._swipeHistory[0];
      const newest = this._swipeHistory[this._swipeHistory.length - 1];
      const dx = newest.x - oldest.x;
      const dy = newest.y - oldest.y;
      const dt = newest.t - oldest.t;
      const speed = Math.abs(dx) / (dt / 1000); // normalized units per second
      const now = performance.now();

      // Require fast horizontal movement with minimal vertical deviation
      if (speed > 1.5 && Math.abs(dx) > 0.15 && Math.abs(dy) < Math.abs(dx) * 0.5) {
        if (now - this._lastSwipeTime > this._swipeDebounce) {
          this._lastSwipeTime = now;
          if (dx < 0) {
            // Swipe left (remember: camera is mirrored, so negative x = user's right-to-left = LEFT)
            // Actually with mirrored video, user moving hand left sees it go right.
            // MediaPipe gives unmirrored coords. So negative dx = hand moved right in camera = left for user (mirrored).
            if (this.onSwipeRight) this.onSwipeRight();
            this._emitGesture('swipe_right');
          } else {
            if (this.onSwipeLeft) this.onSwipeLeft();
            this._emitGesture('swipe_left');
          }
          this._swipeHistory = [];
        }
      }
    }

    // Store previous positions
    this._prevIndexTip = { ...indexTip };
    this._prevThumbTip = { ...thumbTip };

    // Emit confidence
    if (this.onConfidenceUpdate) {
      this.onConfidenceUpdate(this._confidence, this._lastGesture);
    }
  }

  /**
   * Calculate Euclidean distance between two landmarks.
   * @param {{x: number, y: number}} a
   * @param {{x: number, y: number}} b
   * @returns {number}
   */
  _distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }

  /**
   * Track gesture statistics.
   * @param {string} gesture
   */
  _emitGesture(gesture) {
    this._lastGesture = gesture;
    this.totalGestures++;
    this.successfulGestures++;
  }

  /**
   * Reset internal state (when hand is lost).
   */
  _resetState() {
    if (this._pinching && this._holdTriggered) {
      if (this.onHoldEnd) this.onHoldEnd();
    }
    this._pinching = false;
    this._holdTriggered = false;
    this._longPinchTriggered = false;
    this._swipeHistory = [];
    this._prevIndexTip = null;
    this._prevThumbTip = null;
    this._confidence = 0;
    if (this.onPinchStateChange) this.onPinchStateChange(false);
  }

  /**
   * Get gesture success rate.
   * @returns {number} 0-100
   */
  getSuccessRate() {
    if (this.totalGestures === 0) return 100;
    return Math.round((this.successfulGestures / this.totalGestures) * 100);
  }

  /**
   * Get current gesture confidence.
   * @returns {number} 0-1
   */
  getConfidence() {
    return this._confidence;
  }

  /**
   * Get the name of the last detected gesture.
   * @returns {string|null}
   */
  getLastGesture() {
    return this._lastGesture;
  }
}
