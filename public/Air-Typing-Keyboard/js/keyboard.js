/**
 * ═══════════════════════════════════════════════════════════
 * AirType AI — Virtual Keyboard Module
 * Full QWERTY keyboard with hover detection, magnetic
 * snapping, visual/audio/haptic feedback.
 * ═══════════════════════════════════════════════════════════
 */

export class Keyboard {
  /**
   * @param {HTMLElement} containerEl - Container to render keyboard into
   */
  constructor(containerEl) {
    this.container = containerEl;
    this.keys = [];           // Array of { el, key, row, col, rect }
    this.hoveredKey = null;   // Currently hovered key element
    this.shiftActive = false;
    this.capsLockActive = false;
    this.soundEnabled = true;

    // Audio context for click sounds
    this._audioCtx = null;

    // Callbacks
    this.onKeyPress = null;     // (key: string) => void
    this.onKeyHover = null;     // (key: string|null) => void

    // Keyboard layout definition
    this.layout = [
      // Row 0: Numbers
      ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      // Row 1: QWERTY top
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
      // Row 2: Home row
      ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
      // Row 3: Bottom
      ['ShiftLeft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'],
      // Row 4: Space bar
      ['Space']
    ];

    // Display labels (for special keys)
    this.labels = {
      'Backspace': '⌫ Bksp',
      'Tab': '⇥ Tab',
      'CapsLock': '⇪ Caps',
      'Enter': '↵ Enter',
      'ShiftLeft': '⇧ Shift',
      'ShiftRight': '⇧ Shift',
      'Space': 'Space',
      '`': '`', '-': '-', '=': '=',
      '[': '[', ']': ']', '\\': '\\',
      ';': ';', "'": "'", ',': ',', '.': '.', '/': '/'
    };

    // Shifted characters
    this.shiftMap = {
      '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
      '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_',
      '=': '+', '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"',
      ',': '<', '.': '>', '/': '?'
    };

    // Magnetic snapping settings
    this._snapRadius = 30; // pixels
    this._snapStrength = 0.3; // 0-1 easing factor
  }

  /**
   * Render the keyboard into the container.
   */
  render() {
    this.container.innerHTML = '';
    this.keys = [];

    this.layout.forEach((row, rowIndex) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'keyboard-row';
      rowEl.dataset.row = rowIndex;

      row.forEach((key, colIndex) => {
        const keyEl = document.createElement('div');
        keyEl.className = 'key';
        keyEl.dataset.key = key;
        keyEl.dataset.row = rowIndex;
        keyEl.dataset.col = colIndex;

        // Display label
        const displayText = this._getDisplayText(key);
        keyEl.textContent = displayText;

        // Add to row
        rowEl.appendChild(keyEl);

        // Store reference
        this.keys.push({
          el: keyEl,
          key,
          row: rowIndex,
          col: colIndex,
          rect: null // Will be computed after render
        });
      });

      this.container.appendChild(rowEl);
    });

    // Compute bounding rects after DOM is ready
    requestAnimationFrame(() => this._updateRects());

    // Recompute on resize
    window.addEventListener('resize', () => this._updateRects());
  }

  /**
   * Get the display text for a key.
   * @param {string} key
   * @returns {string}
   */
  _getDisplayText(key) {
    if (this.labels[key]) return this.labels[key];
    if (this.shiftActive || this.capsLockActive) {
      if (key.length === 1) {
        if (this.shiftMap[key]) return this.shiftMap[key];
        return key.toUpperCase();
      }
    }
    return key;
  }

  /**
   * Update all key bounding rectangles.
   */
  _updateRects() {
    this.keys.forEach(k => {
      k.rect = k.el.getBoundingClientRect();
    });
  }

  /**
   * Check which key a screen position hovers over.
   * Applies magnetic snapping for better usability.
   * @param {number} screenX - Screen X coordinate
   * @param {number} screenY - Screen Y coordinate
   * @returns {{key: string, el: HTMLElement, snappedX: number, snappedY: number}|null}
   */
  getHoveredKey(screenX, screenY) {
    this._updateRects();

    let closest = null;
    let closestDist = Infinity;

    for (const k of this.keys) {
      if (!k.rect) continue;

      const cx = k.rect.left + k.rect.width / 2;
      const cy = k.rect.top + k.rect.height / 2;
      const dx = screenX - cx;
      const dy = screenY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check if point is inside the key rectangle (with padding)
      const pad = 4;
      const inside =
        screenX >= k.rect.left - pad &&
        screenX <= k.rect.right + pad &&
        screenY >= k.rect.top - pad &&
        screenY <= k.rect.bottom + pad;

      if (inside && dist < closestDist) {
        closestDist = dist;
        closest = k;
      } else if (!closest && dist < this._snapRadius && dist < closestDist) {
        // Magnetic snap: even if not directly over, snap to nearby key
        closestDist = dist;
        closest = k;
      }
    }

    // Update hover state
    if (closest) {
      if (this.hoveredKey !== closest.el) {
        // Remove hover from previous
        if (this.hoveredKey) {
          this.hoveredKey.classList.remove('hovered');
        }
        // Add hover to new
        closest.el.classList.add('hovered');
        this.hoveredKey = closest.el;
        if (this.onKeyHover) this.onKeyHover(closest.key);
      }

      // Compute snapped position (ease toward key center)
      const cx = closest.rect.left + closest.rect.width / 2;
      const cy = closest.rect.top + closest.rect.height / 2;
      const snappedX = screenX + (cx - screenX) * this._snapStrength;
      const snappedY = screenY + (cy - screenY) * this._snapStrength;

      return { key: closest.key, el: closest.el, snappedX, snappedY };
    } else {
      // No key hovered
      if (this.hoveredKey) {
        this.hoveredKey.classList.remove('hovered');
        this.hoveredKey = null;
        if (this.onKeyHover) this.onKeyHover(null);
      }
      return null;
    }
  }

  /**
   * Simulate a key press.
   * @param {string} keyId - The key identifier
   */
  pressKey(keyId) {
    const keyData = this.keys.find(k => k.key === keyId);
    if (!keyData) return;

    // Visual feedback
    keyData.el.classList.add('pressed');
    setTimeout(() => keyData.el.classList.remove('pressed'), 200);

    // Ripple effect
    this._createRipple(keyData.el);

    // Audio feedback
    if (this.soundEnabled) this._playClickSound(keyId);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }

    // Determine the actual character
    let char = this._resolveChar(keyId);

    // Handle modifier keys
    if (keyId === 'ShiftLeft' || keyId === 'ShiftRight') {
      this.shiftActive = !this.shiftActive;
      this._updateKeyLabels();
      this._updateModifierStates();
      return;
    }

    if (keyId === 'CapsLock') {
      this.capsLockActive = !this.capsLockActive;
      this._updateKeyLabels();
      this._updateModifierStates();
      return;
    }

    // Fire callback with resolved character
    if (this.onKeyPress) this.onKeyPress(char);

    // Deactivate shift after one key press (if not caps lock)
    if (this.shiftActive && keyId !== 'ShiftLeft' && keyId !== 'ShiftRight') {
      this.shiftActive = false;
      this._updateKeyLabels();
      this._updateModifierStates();
    }
  }

  /**
   * Resolve the actual character for a key press.
   * @param {string} keyId
   * @returns {string}
   */
  _resolveChar(keyId) {
    // Special keys
    if (keyId === 'Backspace') return 'BACKSPACE';
    if (keyId === 'Tab') return '\t';
    if (keyId === 'Enter') return 'ENTER';
    if (keyId === 'Space') return ' ';
    if (keyId === 'ShiftLeft' || keyId === 'ShiftRight') return 'SHIFT';
    if (keyId === 'CapsLock') return 'CAPSLOCK';

    const isUpper = this.shiftActive !== this.capsLockActive; // XOR

    if (keyId.length === 1) {
      // Check shift map for symbols
      if (this.shiftActive && this.shiftMap[keyId]) {
        return this.shiftMap[keyId];
      }
      return isUpper ? keyId.toUpperCase() : keyId.toLowerCase();
    }

    return keyId;
  }

  /**
   * Update key labels when shift/caps state changes.
   */
  _updateKeyLabels() {
    this.keys.forEach(k => {
      k.el.textContent = this._getDisplayText(k.key);
    });
  }

  /**
   * Update visual state of modifier keys.
   */
  _updateModifierStates() {
    this.keys.forEach(k => {
      if (k.key === 'ShiftLeft' || k.key === 'ShiftRight') {
        k.el.classList.toggle('active-modifier', this.shiftActive);
      }
      if (k.key === 'CapsLock') {
        k.el.classList.toggle('active-modifier', this.capsLockActive);
      }
    });
  }

  /**
   * Create ripple effect on a key element.
   * @param {HTMLElement} el
   */
  _createRipple(el) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${rect.width / 2 - size / 2}px`;
    ripple.style.top = `${rect.height / 2 - size / 2}px`;
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * Play a subtle click sound using Web Audio API.
   * No external audio files needed.
   * @param {string} keyId
   */
  _playClickSound(keyId) {
    try {
      if (!this._audioCtx) {
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = this._audioCtx;

      // Create a short noise burst for click sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Different frequencies for different key types
      const isSpecial = ['Backspace', 'Enter', 'Tab', 'CapsLock', 'ShiftLeft', 'ShiftRight', 'Space'].includes(keyId);
      oscillator.frequency.setValueAtTime(isSpecial ? 600 : 880, ctx.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Audio not available, silently fail
    }
  }

  /**
   * Set the keyboard scale.
   * @param {number} scale - Scale factor (e.g. 0.8, 1, 1.2)
   */
  setScale(scale) {
    document.documentElement.style.setProperty('--keyboard-scale', scale);
  }

  /**
   * Enable or disable sound effects.
   * @param {boolean} enabled
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }

  /**
   * Activate shift temporarily (for hold gesture).
   */
  activateShift() {
    this.shiftActive = true;
    this._updateKeyLabels();
    this._updateModifierStates();
  }

  /**
   * Deactivate shift.
   */
  deactivateShift() {
    this.shiftActive = false;
    this._updateKeyLabels();
    this._updateModifierStates();
  }

  /**
   * Toggle caps lock.
   */
  toggleCapsLock() {
    this.capsLockActive = !this.capsLockActive;
    this._updateKeyLabels();
    this._updateModifierStates();
  }
}
