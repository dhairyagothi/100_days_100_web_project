/* ════════════════════════════════════════════════════════════════════
   FocusSprint — Celebration Modals System (CelebrationManager)
   ════════════════════════════════════════════════════════════════════ */

class CelebrationManager {
  static queue = [];
  static activeOverlay = null;
  static lastFocusedElement = null;
  static isInitialized = false;

  /**
   * Initialize keyboard listener for the Escape key.
   */
  static init() {
    if (this.isInitialized) return;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeOverlay) {
        this.closeActiveCelebration();
      }
    });
    this.isInitialized = true;
  }

  /**
   * Queue a Level Up celebration.
   */
  static queueLevelUp(level, previousLevel, rank) {
    this.init();
    
    // Prevent duplicate Level Up events in the queue
    const isDuplicate = this.queue.some(
      (item) => item.type === 'levelUp' && item.level === level
    );
    if (this.activeOverlay) {
      const activeType = this.activeOverlay.dataset.type;
      const activeLevel = parseInt(this.activeOverlay.dataset.level, 10);
      if (activeType === 'levelUp' && activeLevel === level) return;
    }
    if (isDuplicate) return;

    this.queue.push({
      type: 'levelUp',
      level,
      previousLevel,
      rank
    });
    this._processQueue();
  }

  /**
   * Queue a Streak Milestone celebration.
   */
  static queueStreak(streakCount) {
    this.init();

    // Prevent duplicate Streak events in the queue
    const isDuplicate = this.queue.some(
      (item) => item.type === 'streak' && item.streakCount === streakCount
    );
    if (this.activeOverlay) {
      const activeType = this.activeOverlay.dataset.type;
      const activeStreak = parseInt(this.activeOverlay.dataset.streak, 10);
      if (activeType === 'streak' && activeStreak === streakCount) return;
    }
    if (isDuplicate) return;

    this.queue.push({
      type: 'streak',
      streakCount
    });
    this._processQueue();
  }

  /**
   * Check queue and render next modal if none is currently active.
   * @private
   */
  static _processQueue() {
    if (this.activeOverlay) return; // Wait until current overlay is dismissed
    if (this.queue.length === 0) return;

    const nextItem = this.queue.shift();
    this._displayCelebration(nextItem);
  }

  /**
   * Render and trigger the celebration modal overlay.
   * @private
   */
  static _displayCelebration(item) {
    this.lastFocusedElement = document.activeElement;

    // Create fullscreen overlay wrapper
    const overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';
    overlay.dataset.type = item.type;

    let modalHTML = '';

    if (item.type === 'levelUp') {
      overlay.dataset.level = item.level;
      modalHTML = `
        <div class="celebration-modal" role="dialog" aria-modal="true" aria-labelledby="cel-title" aria-describedby="cel-desc">
          <button class="celebration-close-btn" aria-label="Close celebration modal">&times;</button>
          <span class="celebration-icon" aria-hidden="true">🎉</span>
          <div class="celebration-subtitle">LEVEL UP!</div>
          <h1 class="celebration-title" id="cel-title">Level Reached</h1>
          <p class="celebration-info" id="cel-desc">
            Level <strong>${item.previousLevel}</strong> &rarr; Level <strong>${item.level}</strong><br>
            New Rank: <strong>${item.rank}</strong>
          </p>
          <button class="celebration-action-btn">Let's Go!</button>
        </div>
      `;
    } else if (item.type === 'streak') {
      overlay.dataset.streak = item.streakCount;
      modalHTML = `
        <div class="celebration-modal" role="dialog" aria-modal="true" aria-labelledby="cel-title" aria-describedby="cel-desc">
          <button class="celebration-close-btn" aria-label="Close celebration modal">&times;</button>
          <span class="celebration-icon" aria-hidden="true">🔥</span>
          <div class="celebration-subtitle">STREAK MILESTONE!</div>
          <h1 class="celebration-title" id="cel-title">${item.streakCount} Day Streak</h1>
          <p class="celebration-info" id="cel-desc">
            You reached a milestone of <strong>${item.streakCount} consecutive days</strong>!<br>
            Your dedication and focus are paying off.
          </p>
          <button class="celebration-action-btn">Awesome!</button>
        </div>
      `;
    }

    overlay.innerHTML = modalHTML;
    document.body.appendChild(overlay);
    this.activeOverlay = overlay;

    // Triggers hardware transition entry
    requestAnimationFrame(() => {
      overlay.classList.add('show');
    });

    // Close actions binding
    const closeBtn = overlay.querySelector('.celebration-close-btn');
    const actionBtn = overlay.querySelector('.celebration-action-btn');

    const handleDismiss = () => this.closeActiveCelebration();

    closeBtn.addEventListener('click', handleDismiss);
    actionBtn.addEventListener('click', handleDismiss);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) handleDismiss();
    });

    // Establish focus trap
    this._setupFocusTrap(overlay);
  }

  /**
   * Close modal overlay, restore focus, and process queue.
   */
  static closeActiveCelebration() {
    const overlay = this.activeOverlay;
    if (!overlay) return;

    overlay.classList.remove('show');

    // Wait for transition animation to end
    overlay.addEventListener('transitionend', () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }

      // Restore user focus
      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
        this.lastFocusedElement.focus();
      }

      this.activeOverlay = null;
      // Process next item in sequence
      this._processQueue();
    });
  }

  /**
   * Constrain tab focus to elements inside the modal.
   * @private
   */
  static _setupFocusTrap(overlayEl) {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusables = overlayEl.querySelectorAll(focusableSelectors);
    if (focusables.length === 0) return;

    const firstEl = focusables[0];
    const lastEl = focusables[focusables.length - 1];

    overlayEl.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // Shift + Tab -> wraps to last
          if (document.activeElement === firstEl) {
            lastEl.focus();
            e.preventDefault();
          }
        } else { // Tab -> wraps to first
          if (document.activeElement === lastEl) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      }
    });

    // Focus on first element (close button) or default button
    firstEl.focus();
  }
}

/* ── EVENT LISTENERS ──────────────────────────────────────────────── */

document.addEventListener('levelUp', (e) => {
  if (e.detail) {
    const { level, previousLevel, rank } = e.detail;
    CelebrationManager.queueLevelUp(level, previousLevel, rank);
  }
});

document.addEventListener('streakMilestone', (e) => {
  if (e.detail && typeof e.detail.streak === 'number') {
    CelebrationManager.queueStreak(e.detail.streak);
  }
});
