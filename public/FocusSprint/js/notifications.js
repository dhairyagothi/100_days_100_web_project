/* ════════════════════════════════════════════════════════════════════
   FocusSprint — Notification System (NotificationManager)
   ════════════════════════════════════════════════════════════════════ */

class NotificationManager {
  static containerId = 'notification-container';
  static MAX_VISIBLE = 3;
  static _lastXPTime = 0;
  /**
   * Initialize the notification container element in the DOM.
   * If it doesn't exist, it creates it.
   */
  static _ensureContainer() {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Helper to create and stack a toast notification.
   * @private
   */
  static _createToast({ type, icon, title, message, extra }) {
    const container = this._ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
        ${extra ? `<div class="toast-extra">${extra}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    // Manual close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this._dismissToast(toast);
    });

    // Append to container (newest on top)
    if (container.firstChild) {
      container.insertBefore(toast, container.firstChild);
    } else {
      container.appendChild(toast);
    }

    // Enforce max visible limit — auto-dismiss oldest if over limit
    const toasts = container.querySelectorAll('.toast-notification');
    if (toasts.length > this.MAX_VISIBLE) {
      for (let i = this.MAX_VISIBLE; i < toasts.length; i++) {
        this._dismissToast(toasts[i]);
      }
    }

    // Trigger transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      this._dismissToast(toast);
    }, 4000);
  }

  /**
   * Dismiss notification with slide-out transition.
   * @private
   */
  static _dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.remove('show');
    toast.classList.add('hide');

    // Remove from DOM after animation completes
    toast.addEventListener('transitionend', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });
  }

  /* ── API METHODS ────────────────────────────────────────────────── */

  static showSuccess(message) {
    this._createToast({
      type: 'success',
      icon: '✅',
      title: 'Success',
      message: message
    });
  }

  static showInfo(message) {
    this._createToast({
      type: 'info',
      icon: 'ℹ️',
      title: 'Information',
      message: message
    });
  }

  static showWarning(message) {
    this._createToast({
      type: 'warning',
      icon: '⚠️',
      title: 'Warning',
      message: message
    });
  }

  static showAchievement(title, desc, icon, rewardXP) {
    this._createToast({
      type: 'achievement',
      icon: icon || '🏆',
      title: '🏆 Achievement Unlocked',
      message: `<strong>${title}</strong><br>${desc}`,
      extra: rewardXP ? `+${rewardXP} Bonus XP` : ''
    });
  }

  static showGardenUnlock(title, icon, rewardXP) {
    this._createToast({
      type: 'garden',
      icon: icon || '✦',
      title: 'Garden Upgraded',
      message: `New Stage: <strong>${title}</strong>`,
      extra: rewardXP ? `+${rewardXP} XP` : ''
    });
  }

  static showLevelUp(data) {
    this._createToast({
      type: 'success',
      icon: '🎉',
      title: 'Level Up',
      message: `Reached Level <strong>${data.level}</strong>!`,
      extra: data.rank ? `Rank: ${data.rank}` : ''
    });
  }

  /**
   * Game feedback reward animation showing floating XP near the timer card.
   */
  static spawnFloatingXP(xpAmount) {
    const sessionCard = document.querySelector('.bento-session');
    if (!sessionCard) return;

    const floatingXP = document.createElement('div');
    floatingXP.className = 'floating-xp-gain';
    floatingXP.textContent = `+${xpAmount} XP`;

    sessionCard.appendChild(floatingXP);

    // Self-destruct after animation (1.8s) completes
    setTimeout(() => {
      floatingXP.remove();
    }, 1800);
  }
}

/* ── EVENT LISTENERS ──────────────────────────────────────────────── */

document.addEventListener('xpEarned', (e) => {
  if (e.detail && typeof e.detail.xp === 'number') {
    // Prevent duplicate XP notifications within 500ms window
    const now = Date.now();
    if (now - NotificationManager._lastXPTime < 500) return;
    NotificationManager._lastXPTime = now;

    // 1. Show the toast notification
    NotificationManager.showSuccess(`✨ +${e.detail.xp} XP Earned`);
    // 2. Spawn the floating game-like indicator near the timer
    NotificationManager.spawnFloatingXP(e.detail.xp);
  }
});

document.addEventListener('achievementUnlocked', (e) => {
  if (e.detail) {
    const { title, description, icon, rewardXP } = e.detail;
    NotificationManager.showAchievement(title, description, icon, rewardXP);
  }
});

document.addEventListener('gardenStageUnlocked', (e) => {
  if (e.detail) {
    const { title, icon, stage } = e.detail;
    // Look up stage rewardXP if garden.js is loaded
    let rewardXP = 0;
    if (typeof GardenManager !== 'undefined') {
      const match = GardenManager.STAGES.find((s) => s.id === stage);
      if (match) rewardXP = match.rewardXP;
    }
    NotificationManager.showGardenUnlock(title, icon, rewardXP);
  }
});
