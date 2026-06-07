/* ============================================================
   NEOTRETIS — achievements.js
   AchievementManager: tracks, persists, and renders achievements.

   Architecture:
   - All achievement definitions live in ACHIEVEMENT_DEFS.
   - Persistent state is a flat object { [id]: { unlocked, progress } }
     stored under LS_KEY in localStorage.
   - The engine calls notify(event) with a plain snapshot of game
     stats after every significant game event. AchievementManager
     checks every locked achievement and unlocks+toasts if criteria met.
   - The achievement panel in index.html is fully rebuilt on each
     unlock — the list is short (12 items) so this is cheap and avoids
     stale DOM state.

   DOM targets (all pre-existing):
     .achievements-list   — container rebuilt on update
     .achv-count          — "N / 12" counter in the card header
   ============================================================ */

const LS_KEY = 'neotretis_achievements';

// ─── Achievement definitions ──────────────────────────────────
// id:         unique string key stored in localStorage
// icon:       emoji shown in the panel and toast
// name:       display name
// desc:       one-line description
// check(s):   returns true when the achievement should unlock
//             s = { score, lines, level, hardDrops, holdCount, tetrisCount, gamesPlayed }
// progress(s):returns [current, max] for progress bar (only for progressive achievements)
//             omit for binary achievements (unlocked or not)

export const ACHIEVEMENT_DEFS = [
  {
    id: 'first_game',
    icon: '🌟',
    name: 'First Game',
    desc: 'Play your very first game',
    check: s => s.gamesPlayed >= 1,
  },
  {
    id: 'first_line',
    icon: '✂️',
    name: 'Line Cutter',
    desc: 'Clear your first line',
    check: s => s.lines >= 1,
  },
  {
    id: 'first_tetris',
    icon: '💎',
    name: 'Tetris!',
    desc: 'Clear 4 lines at once',
    check: s => s.tetrisCount >= 1,
  },
  {
    id: 'lines_100',
    icon: '💥',
    name: 'Line Breaker',
    desc: 'Clear 100 lines total',
    check: s => s.totalLines >= 100,
    progress: s => [Math.min(s.totalLines, 100), 100],
  },
  {
    id: 'lines_500',
    icon: '🌊',
    name: 'Line Destroyer',
    desc: 'Clear 500 lines total',
    check: s => s.totalLines >= 500,
    progress: s => [Math.min(s.totalLines, 500), 500],
  },
  {
    id: 'level_5',
    icon: '⚡',
    name: 'Gaining Speed',
    desc: 'Reach Level 5',
    check: s => s.level >= 5,
    progress: s => [Math.min(s.level, 5), 5],
  },
  {
    id: 'level_10',
    icon: '🚀',
    name: 'Speed Demon',
    desc: 'Reach Level 10',
    check: s => s.level >= 10,
    progress: s => [Math.min(s.level, 10), 10],
  },
  {
    id: 'score_10k',
    icon: '🏅',
    name: 'Point Scorer',
    desc: 'Score 10,000 points',
    check: s => s.score >= 10_000,
    progress: s => [Math.min(s.score, 10_000), 10_000],
  },
  {
    id: 'score_50k',
    icon: '🥈',
    name: 'High Roller',
    desc: 'Score 50,000 points',
    check: s => s.score >= 50_000,
    progress: s => [Math.min(s.score, 50_000), 50_000],
  },
  {
    id: 'score_100k',
    icon: '🏆',
    name: 'Century Club',
    desc: 'Score 100,000 points',
    check: s => s.score >= 100_000,
    progress: s => [Math.min(s.score, 100_000), 100_000],
  },
  {
    id: 'hold_50',
    icon: '🔄',
    name: 'Hold Master',
    desc: 'Use Hold 50 times',
    check: s => s.totalHolds >= 50,
    progress: s => [Math.min(s.totalHolds, 50), 50],
  },
  {
    id: 'hard_drop_25',
    icon: '⬇️',
    name: 'Hard Dropper',
    desc: 'Perform 25 hard drops',
    check: s => s.totalHardDrops >= 25,
    progress: s => [Math.min(s.totalHardDrops, 25), 25],
  },
];

const TOTAL = ACHIEVEMENT_DEFS.length;

export class AchievementManager {
  /**
   * @param {Function} showToast  (icon, message, duration?) => void
   */
  constructor(showToast) {
    this._showToast = showToast ?? (() => { });
    this._state = this._load();   // { [id]: { unlocked: bool, progress: number } }

    // Cache DOM refs
    this._listEl = document.querySelector('.achievements-list');
    this._countEl = document.querySelector('.achv-count');

    // Render initial state from persisted data
    this._rebuildDOM();
  }

  // ─── Engine-facing API ────────────────────────────────────────

  /**
   * Check all locked achievements against the current game snapshot.
   * Call after every significant game event.
   *
   * @param {Object} snapshot
   *   score         {number}  current score this game
   *   lines         {number}  lines cleared this game
   *   level         {number}  current level
   *   tetrisCount   {number}  total 4-line clears this game
   *   hardDrops     {number}  hard drops this game (session counter)
   *   holdCount     {number}  holds this game (session counter)
   *   totalLines    {number}  lifetime lines (from lifetime counters)
   *   totalHardDrops{number}  lifetime hard drops
   *   totalHolds    {number}  lifetime holds
   *   gamesPlayed   {number}  lifetime games started
   */
  notify(snapshot) {
    let anyNew = false;

    for (const def of ACHIEVEMENT_DEFS) {
      const entry = this._state[def.id];

      if (entry.unlocked) continue;   // already done

      // Update progress for progressive achievements (before unlock check)
      if (def.progress) {
        const [cur] = def.progress(snapshot);
        entry.progress = cur;
      }

      // Check unlock condition
      if (def.check(snapshot)) {
        entry.unlocked = true;
        entry.progress = 0;   // no longer needed
        anyNew = true;
        this._announceUnlock(def);
      }
    }

    if (anyNew) {
      this._save();
      this._rebuildDOM();
    } else {
      // Still update progress bars even if nothing new unlocked
      this._updateProgressBars(snapshot);
    }
  }

  /**
   * Called on game start — record that a game was played and check
   * the 'first_game' achievement immediately.
   * @param {Object} lifetimeCounters  { gamesPlayed, totalLines, totalHolds, totalHardDrops }
   */
  onGameStart(lifetimeCounters) {
    this.notify({
      score: 0, lines: 0, level: 1, tetrisCount: 0,
      hardDrops: 0, holdCount: 0, ...lifetimeCounters
    });
  }

  /** Full reset of achievement state (dev utility — not exposed to player). */
  _resetAll() {
    this._state = this._buildDefaultState();
    this._save();
    this._rebuildDOM();
  }

  // ─── Persistence ──────────────────────────────────────────────

  _buildDefaultState() {
    const state = {};
    for (const def of ACHIEVEMENT_DEFS) {
      state[def.id] = { unlocked: false, progress: 0 };
    }
    return state;
  }

  _load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return this._buildDefaultState();
      const saved = JSON.parse(raw);
      // Merge: add any new achievements not in the saved data
      const state = this._buildDefaultState();
      for (const id of Object.keys(state)) {
        if (saved[id]) {
          state[id] = { ...state[id], ...saved[id] };
        }
      }
      return state;
    } catch {
      return this._buildDefaultState();
    }
  }

  _save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(this._state));
    } catch { /* storage full / private mode */ }
  }

  // ─── DOM rendering ────────────────────────────────────────────

  /**
   * Rebuild the full achievements list from current state.
   * Shows the 4 most-relevant entries:
   *   1. All recently-unlocked (up to 2)
   *   2. Remaining slots filled by closest-to-completion locked ones
   */
  _rebuildDOM() {
    if (!this._listEl) return;

    // Update count badge
    const unlocked = ACHIEVEMENT_DEFS.filter(d => this._state[d.id]?.unlocked).length;
    if (this._countEl) {
      this._countEl.textContent = `${unlocked} / ${TOTAL}`;
    }

    // Pick which achievements to show (4 slots in the panel)
    const toShow = this._selectVisible();

    // Rebuild the inner HTML
    this._listEl.innerHTML = toShow.map(def => {
      const entry = this._state[def.id];
      const isUnlocked = entry.unlocked;

      if (isUnlocked) {
        return `
          <div class="achievement-item unlocked">
            <div class="achv-icon">${def.icon}</div>
            <div class="achv-info">
              <span class="achv-name">${def.name}</span>
              <span class="achv-desc">${def.desc}</span>
            </div>
            <span class="achv-badge">✓</span>
          </div>`;
      }

      // Locked — show progress bar if the def has a progress function
      let progressHTML = '';
      if (def.progress) {
        const pct = this._progressPct(def, entry.progress);
        progressHTML = `
          <div class="achv-progress-bar">
            <div class="achv-fill" style="width:${pct}%"></div>
          </div>`;
      }

      return `
        <div class="achievement-item locked">
          <div class="achv-icon">🔒</div>
          <div class="achv-info">
            <span class="achv-name">${def.name}</span>
            <span class="achv-desc">${def.desc}</span>
            ${progressHTML}
          </div>
        </div>`;
    }).join('');
  }

  /**
   * Select the 4 achievements to display:
   * - Show unlocked ones first (most recently unlocked at top),
   *   up to 2 slots.
   * - Fill remaining slots with locked achievements sorted by
   *   progress percentage descending (closest to completion first).
   */
  _selectVisible() {
    const unlocked = ACHIEVEMENT_DEFS.filter(d => this._state[d.id]?.unlocked);
    const locked = ACHIEVEMENT_DEFS.filter(d => !this._state[d.id]?.unlocked);

    // Sort locked by progress descending
    locked.sort((a, b) => {
      const pa = this._progressPct(a, this._state[a.id].progress);
      const pb = this._progressPct(b, this._state[b.id].progress);
      return pb - pa;
    });

    // Take up to 2 most-recently-unlocked + fill to 4 with locked
    const showUnlocked = unlocked.slice(-2);   // last 2 unlocked
    const remaining = 4 - showUnlocked.length;
    const showLocked = locked.slice(0, remaining);

    return [...showUnlocked, ...showLocked];
  }

  /** Progress percentage for a single achievement definition. */
  _progressPct(def, currentProgress) {
    if (!def.progress) return 0;
    try {
      // Pass currentProgress under every possible metric key so the
      // progress function always receives a defined number regardless
      // of which field it reads (totalLines, score, level, etc.).
      const sentinel = {
        score: currentProgress,
        lines: currentProgress,
        level: currentProgress,
        totalLines: currentProgress,
        totalHardDrops: currentProgress,
        totalHolds: currentProgress,
        totalTetris: currentProgress,
        gamesPlayed: currentProgress,
        tetrisCount: currentProgress,
        hardDrops: currentProgress,
        holdCount: currentProgress,
      };
      const [cur, max] = def.progress(sentinel);
      if (!max || max <= 0) return 0;
      return Math.min(100, Math.round((cur / max) * 100));
    } catch {
      return 0;
    }
  }

  /**
   * Lightweight update: only repaint progress bar widths without
   * rebuilding the entire list HTML.
   */
  _updateProgressBars(snapshot) {
    if (!this._listEl) return;

    const items = this._listEl.querySelectorAll('.achievement-item.locked');
    items.forEach(itemEl => {
      const nameEl = itemEl.querySelector('.achv-name');
      if (!nameEl) return;
      const name = nameEl.textContent.trim();
      const def = ACHIEVEMENT_DEFS.find(d => d.name === name);
      if (!def || !def.progress) return;

      const [cur, max] = def.progress(snapshot);
      const pct = max > 0 ? Math.min(100, Math.round((cur / max) * 100)) : 0;

      // Store current progress in state so _selectVisible can sort
      if (this._state[def.id]) {
        this._state[def.id].progress = cur;
      }

      const fillEl = itemEl.querySelector('.achv-fill');
      if (fillEl) fillEl.style.width = `${pct}%`;
    });
  }

  // ─── Toast on unlock ──────────────────────────────────────────

  _announceUnlock(def) {
    this._showToast(def.icon, `Achievement: ${def.name}!`, 4500);
    window.NeoTetrisParticles?.addConfetti();
    window.NeoTetrisAudio?.playAchievement();
  }
}

// ─── Lifetime counter helpers ─────────────────────────────────
// The engine needs persistent lifetime counters (games played,
// total lines, total holds, total hard drops) that survive across
// sessions. We store them under a separate key to keep concerns clean.

const LC_KEY = 'neotretis_lifetime';

const DEFAULT_LIFETIME = {
  gamesPlayed: 0,
  totalLines: 0,
  totalHolds: 0,
  totalHardDrops: 0,
  totalTetris: 0,
};

export function loadLifetimeCounters() {
  try {
    const raw = localStorage.getItem(LC_KEY);
    if (!raw) return { ...DEFAULT_LIFETIME };
    return { ...DEFAULT_LIFETIME, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_LIFETIME };
  }
}

export function saveLifetimeCounters(counters) {
  try {
    localStorage.setItem(LC_KEY, JSON.stringify(counters));
  } catch { /* ignore */ }
}

/**
 * Increment one or more lifetime counter fields and persist immediately.
 * @param {Partial<typeof DEFAULT_LIFETIME>} delta
 * @returns {typeof DEFAULT_LIFETIME}  Updated counters
 */
export function incrementLifetime(delta) {
  const current = loadLifetimeCounters();
  for (const [key, val] of Object.entries(delta)) {
    if (key in current) current[key] += val;
  }
  saveLifetimeCounters(current);
  return current;
}