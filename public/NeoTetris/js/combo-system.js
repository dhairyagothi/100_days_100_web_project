/* ============================================================
   NEOTRETIS — combo-system.js
   ComboManager: renders the combo panel and fires milestone toasts.

   Design contract:
   - ScoreManager is the SINGLE SOURCE OF TRUTH for the combo count.
     ComboManager never stores the count itself; it reads it from
     the ScoreManager instance passed to every update call.
   - The engine calls ComboManager.onLineClear(n, scoreManager) after
     each line-clear event, and ComboManager.onBreak() when a piece
     locks with no clear.
   - All DOM writes target existing elements from index.html — nothing
     new is created.

   DOM targets (all pre-existing):
     #combo-val         — "x3" counter
     #combo-flame       — flame emoji, class 'active' when combo > 0
     #combo-history     — container of .combo-hist-dot spans (×8)
     .combo-label       — sub-label text (animated on milestone)
     .combo-hist-dot    — individual history dots (active/inactive)
   ============================================================ */

// ─── Milestone definitions ────────────────────────────────────
// Each milestone fires once per combo streak when the threshold is crossed.
const MILESTONES = [
  { at: 3, icon: '🔥', label: '3× COMBO!', msg: 'On Fire!' },
  { at: 5, icon: '💥', label: '5× COMBO!', msg: 'Unstoppable!' },
  { at: 8, icon: '⚡', label: '8× COMBO!', msg: 'Lightning Speed!' },
  { at: 10, icon: '🌟', label: '10× COMBO!', msg: 'Unbelievable!' },
  { at: 12, icon: '🌟', label: '12× COMBO!', msg: 'Legendary!' },
  { at: 20, icon: '👑', label: '20× COMBO!!', msg: 'Godlike!!' },
];

// Number of history dots in the DOM (matches index.html: 8 spans)
const HISTORY_DOTS = 8;

export class ComboManager {
  /**
   * @param {Function} showToast  Injected toast callback: (icon, msg) => void
   *                              Decouples from main.js without circular imports.
   */
  constructor(showToast) {
    this._showToast = showToast ?? (() => { });
    this._lastMilestone = 0;   // highest milestone threshold already announced

    // Cache DOM refs once — they never change
    this._valEl = document.getElementById('combo-val');
    this._flameEl = document.getElementById('combo-flame');
    this._histEl = document.getElementById('combo-history');
    this._labelEl = document.querySelector('.combo-label');
    this._cardEl = document.querySelector('.combo-card');
    this._dots = this._histEl
      ? Array.from(this._histEl.querySelectorAll('.combo-hist-dot'))
      : [];
  }

  // ─── Engine-facing API ────────────────────────────────────────

  /**
   * Called by the engine after a successful line clear.
   * @param {number} linesCleared   1–4
   * @param {number} combo          Current combo count (from ScoreManager)
   * @param {number} bonus          Combo bonus points awarded this clear
   */
  onLineClear(linesCleared, combo, bonus) {
    this._renderCombo(combo);
    if (combo > 0) {
      this._spawnFloatingText(`x${combo}`);
      if (this._cardEl) {
        this._cardEl.classList.remove('combo-bounce');
        void this._cardEl.offsetWidth; // Trigger reflow
        this._cardEl.classList.add('combo-bounce');
      }
    }
    this._checkMilestones(combo, bonus);
  }

  _spawnFloatingText(text) {
    if (!this._valEl) return;
    const rect = this._valEl.getBoundingClientRect();
    const popup = document.createElement('div');
    popup.className = 'float-combo-animation';
    popup.textContent = text;
    popup.style.left = `${window.scrollX + rect.left + rect.width / 2 - 20}px`;
    popup.style.top = `${window.scrollY + rect.top - 12}px`;
    document.body.appendChild(popup);

    // Cleanup
    setTimeout(() => popup.remove(), 1200);
  }

  /**
   * Called by the engine when a piece locks without clearing a line.
   * Resets all combo UI back to zero state.
   */
  onBreak() {
    this._lastMilestone = 0;
    this._renderCombo(0);
  }

  /**
   * Full reset — called on new game / restart.
   */
  reset() {
    this._lastMilestone = 0;
    this._renderCombo(0);
  }

  // ─── Rendering ────────────────────────────────────────────────

  _renderCombo(combo) {
    // ── Counter text ────────────────────────────────────────────
    if (this._valEl) {
      this._valEl.textContent = `x${combo}`;
      if (combo > 0) {
        // Bounce animation — add class, remove after animation completes
        this._valEl.classList.add('combo-bounce');
        setTimeout(() => this._valEl.classList.remove('combo-bounce'), 500);
      }
    }

    // ── Flame icon ──────────────────────────────────────────────
    if (this._flameEl) {
      this._flameEl.classList.toggle('active', combo > 0);
    }

    // ── History dots ────────────────────────────────────────────
    // Dots light up left-to-right as the combo grows.
    // When combo exceeds HISTORY_DOTS, all dots stay lit (cap at max).
    this._dots.forEach((dot, i) => {
      dot.classList.toggle('active', i < combo);
      // Dim the 'inactive' class used in HTML; keep for CSS targeting
      dot.classList.toggle('inactive', i >= combo);
    });

    // ── Sub-label ───────────────────────────────────────────────
    if (this._labelEl) {
      if (combo === 0) {
        this._labelEl.textContent = 'CONSECUTIVE CLEARS';
      } else if (combo >= 12) {
        this._labelEl.textContent = '🌟 LEGENDARY STREAK';
      } else if (combo >= 8) {
        this._labelEl.textContent = '⚡ LIGHTNING STREAK';
      } else if (combo >= 5) {
        this._labelEl.textContent = '💥 SUPER STREAK';
      } else if (combo >= 3) {
        this._labelEl.textContent = '🔥 ON FIRE!';
      } else {
        this._labelEl.textContent = 'CONSECUTIVE CLEARS';
      }
    }
  }

  // ─── Milestone toasts ─────────────────────────────────────────

  _checkMilestones(combo, bonus) {
    for (const m of MILESTONES) {
      if (combo >= m.at && this._lastMilestone < m.at) {
        this._lastMilestone = m.at;
        const bonusStr = bonus > 0 ? ` (+${bonus})` : '';
        this._showToast(m.icon, `${m.msg} ${m.label}${bonusStr}`);
        window.NeoTetrisAudio?.playComboMilestone();
        break;   // Only fire the highest newly-crossed milestone per clear
      }
    }
  }
}
