/* ============================================================
   NEOTRETIS — challenge-system.js
   ChallengeSystem: generates and tracks three daily challenges.

   Design:
   - Three challenges are generated deterministically from the
     current UTC date string — every player worldwide sees the
     same three challenges on the same day.
   - Progress persists in localStorage under a date-stamped key,
     so it resets automatically the next calendar day without
     any timer logic.
   - The engine calls notify(snapshot) after game events; the
     system checks progress and updates the DOM in-place,
     targeting the three .challenge-item elements that already
     exist in index.html.
   - Completion state is reflected by the challenge-fill width,
     .challenge-status text, and a one-time toast.

   DOM targets (all pre-existing, positional — index order = challenge index):
     .challenge-item    (×3)
       .challenge-icon
       .challenge-name
       .challenge-fill
       .challenge-status

   ============================================================ */

const LS_PREFIX = 'neotretis_daily_';

// ─── Challenge pool ───────────────────────────────────────────
// Each definition is a factory function receiving a seed-derived
// variant index so the numbers vary daily.

const CHALLENGE_POOL = [
  // ── Score challenges ────────────────────────────────────────
  {
    id: 'score_5k',
    icon: '🎯',
    label: (v) => `Score ${(5_000 + v * 5_000).toLocaleString()} pts`,
    target: (v) => 5_000 + v * 5_000,
    metric: 'score',
    unit: 'pts',
  },
  {
    id: 'score_15k',
    icon: '💎',
    label: (v) => `Score ${(15_000 + v * 10_000).toLocaleString()} pts`,
    target: (v) => 15_000 + v * 10_000,
    metric: 'score',
    unit: 'pts',
  },
  {
    id: 'score_50k',
    icon: '🏆',
    label: () => `Score 50,000 pts`,
    target: () => 50_000,
    metric: 'score',
    unit: 'pts',
  },

  // ── Line challenges ─────────────────────────────────────────
  {
    id: 'lines_10',
    icon: '☰',
    label: (v) => `Clear ${10 + v * 5} lines`,
    target: (v) => 10 + v * 5,
    metric: 'lines',
    unit: 'lines',
  },
  {
    id: 'lines_20',
    icon: '⚡',
    label: (v) => `Clear ${20 + v * 10} lines`,
    target: (v) => 20 + v * 10,
    metric: 'lines',
    unit: 'lines',
  },
  {
    id: 'lines_50',
    icon: '💥',
    label: () => `Clear 50 lines`,
    target: () => 50,
    metric: 'lines',
    unit: 'lines',
  },

  // ── Level challenges ─────────────────────────────────────────
  {
    id: 'reach_level_3',
    icon: '🚀',
    label: () => `Reach Level 3`,
    target: () => 3,
    metric: 'level',
    unit: 'level',
  },
  {
    id: 'reach_level_5',
    icon: '🔥',
    label: () => `Reach Level 5`,
    target: () => 5,
    metric: 'level',
    unit: 'level',
  },
  {
    id: 'reach_level_8',
    icon: '👑',
    label: () => `Reach Level 8`,
    target: () => 8,
    metric: 'level',
    unit: 'level',
  },

  // ── Action challenges ────────────────────────────────────────
  {
    id: 'hard_drops_10',
    icon: '⬇️',
    label: (v) => `Perform ${10 + v * 5} hard drops`,
    target: (v) => 10 + v * 5,
    metric: 'hardDrops',
    unit: 'drops',
  },
  {
    id: 'hold_10',
    icon: '🔄',
    label: (v) => `Use Hold ${10 + v * 5} times`,
    target: (v) => 10 + v * 5,
    metric: 'holdCount',
    unit: 'holds',
  },
  {
    id: 'tetris_1',
    icon: '🔷',
    label: () => `Get a Tetris (clear 4 lines)`,
    target: () => 1,
    metric: 'tetrisCount',
    unit: 'Tetris',
  },
  {
    id: 'combo_3',
    icon: '🌊',
    label: () => `Reach a 3× Combo`,
    target: () => 3,
    metric: 'maxCombo',
    unit: 'combo',
  },
];

// ─── Date utilities ───────────────────────────────────────────

function todayKey() {
  return new Date().toISOString().slice(0, 10);   // "YYYY-MM-DD"
}

/**
 * Very simple deterministic hash: sum char codes of the string,
 * then use that to seed picks from the pool.
 * Same string → same picks, every time, on every machine.
 */
function dateHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;   // keep as uint32
  }
  return h;
}

/**
 * Pick 3 distinct challenges from the pool based on today's date.
 * Each gets a variant index (0–3) for parameterised targets.
 */
function pickChallenges(dateStr) {
  const hash = dateHash(dateStr);
  const pool = CHALLENGE_POOL;
  const indices = [];
  const variants = [];

  // Use successive bits of the hash to pick indices
  let h = hash;
  while (indices.length < 3) {
    const idx = h % pool.length;
    if (!indices.includes(idx)) {
      indices.push(idx);
      variants.push((h >>> 8) % 4);   // variant 0–3
    }
    // Advance hash
    h = ((h >>> 1) ^ (h * 1664525 + 1013904223)) >>> 0;
  }

  return indices.map((poolIdx, i) => {
    const def = pool[poolIdx];
    const variant = variants[i];
    return {
      id: `${def.id}_v${variant}`,
      icon: def.icon,
      name: def.label(variant),
      target: def.target(variant),
      metric: def.metric,
      unit: def.unit,
      progress: 0,
      done: false,
    };
  });
}

// ─── Persistence ──────────────────────────────────────────────

function lsKey() {
  return `${LS_PREFIX}${todayKey()}`;
}

function loadTodayProgress() {
  try {
    const raw = localStorage.getItem(lsKey());
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTodayProgress(challenges) {
  try {
    // Prune old daily keys (keep only today's)
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LS_PREFIX) && k !== lsKey()) {
        localStorage.removeItem(k);
        i--;   // key removed, adjust index
      }
    }
    localStorage.setItem(lsKey(), JSON.stringify(challenges));
  } catch { /* ignore */ }
}

// ─── Main class ───────────────────────────────────────────────

export class ChallengeSystem {
  /**
   * @param {Function} showToast  (icon, message, duration?) => void
   */
  constructor(showToast) {
    this._showToast = showToast ?? (() => { });
    this._challenges = this._initChallenges();
    this._domItems = Array.from(document.querySelectorAll('.challenge-item'));
    this._allDoneCelebrated = this._challenges.every(ch => ch.done);

    // Render immediately so the panel reflects today's challenges on load
    this._renderAll();
  }

  // ─── Engine-facing API ────────────────────────────────────────

  /**
   * Update challenge progress from a game state snapshot.
   * Call after every significant game event.
   *
   * @param {Object} snapshot
   *   score        {number}   current score this game
   *   lines        {number}   lines cleared this game
   *   level        {number}   current level
   *   tetrisCount  {number}   4-line clears this game
   *   hardDrops    {number}   hard drops this game (cumulative this session)
   *   holdCount    {number}   holds this game
   *   maxCombo     {number}   highest combo reached this game
   */
  notify(snapshot) {
    let anyChange = false;

    this._challenges.forEach((ch, i) => {
      if (ch.done) return;

      const raw = snapshot[ch.metric] ?? 0;
      // Level is a high-water mark (don't revert on restart)
      const value = ch.metric === 'level' || ch.metric === 'maxCombo'
        ? Math.max(ch.progress, raw)
        : raw;

      const prev = ch.progress;
      ch.progress = Math.min(value, ch.target);

      if (ch.progress !== prev) anyChange = true;

      if (!ch.done && ch.progress >= ch.target) {
        ch.done = true;
        this._announceComplete(ch);
        anyChange = true;
      }
    });

    if (anyChange) {
      saveTodayProgress(this._challenges);
      this._renderAll();

      const currentlyAllDone = this._challenges.every(ch => ch.done);
      if (currentlyAllDone && !this._allDoneCelebrated) {
        this._allDoneCelebrated = true;
        this._celebrateDailyCompletion();
      }
    }
  }

  _celebrateDailyCompletion() {
    // Drop cascading confetti
    window.NeoTetrisParticles?.addConfetti();
    // Play challenge complete audio if available
    window.NeoTetrisAudio?.playChallengeComplete();
    setTimeout(() => {
      this._showToast('🏆', 'DAILY DOUBLE! All 3 challenges completed! +500 XP', 6000);
    }, 800);
  }

  /** Called on game start to reset per-game metrics but preserve daily progress. */
  onGameStart() {
    // Nothing to do — progress is cumulative across sessions within one day.
    // The engine passes fresh per-game metrics; ChallengeSystem takes the max
    // for level/maxCombo and raw cumulative for counts.
  }

  /** Re-render the panel (call after theme switch etc.). */
  refresh() {
    this._renderAll();
  }

  // ─── Initialisation ───────────────────────────────────────────

  _initChallenges() {
    const saved = loadTodayProgress();
    if (saved && Array.isArray(saved) && saved.length === 3) {
      return saved;
    }
    return pickChallenges(todayKey());
  }

  // ─── DOM rendering ────────────────────────────────────────────

  _renderAll() {
    this._challenges.forEach((ch, i) => {
      const item = this._domItems[i];
      if (!item) return;

      // Icon
      const iconEl = item.querySelector('.challenge-icon');
      if (iconEl) iconEl.textContent = ch.done ? '✅' : ch.icon;

      // Name
      const nameEl = item.querySelector('.challenge-name');
      if (nameEl) nameEl.textContent = ch.name;

      // Progress fill
      const pct = ch.target > 0
        ? Math.min(100, Math.round((ch.progress / ch.target) * 100))
        : 0;
      const fillEl = item.querySelector('.challenge-fill');
      if (fillEl) fillEl.style.width = `${pct}%`;

      // Status text
      const statusEl = item.querySelector('.challenge-status');
      if (statusEl) {
        statusEl.textContent = ch.done ? '✓' : `${pct}%`;
      }

      // Visual completed state
      item.classList.toggle('challenge-done', ch.done);
      item.classList.toggle('challenge-done-glow', ch.done);
    });
  }

  // ─── Toast ────────────────────────────────────────────────────

  _announceComplete(ch) {
    this._showToast('📅', `Daily challenge complete: ${ch.name}!`, 5000);
    window.NeoTetrisParticles?.addConfetti();
    window.NeoTetrisAudio?.playChallengeComplete();
  }
}
