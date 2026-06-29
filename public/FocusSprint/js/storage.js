/* ════════════════════════════════════════════════════════════════════
   FocusSprint — Storage Layer (LocalStorage CRUD)
   Handles: Sessions, XP, Streaks
   All methods are static. Gracefully handles corruption/empty state.
   ════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════
   SESSION STORAGE
   Key: focussprint_sessions
   Shape: [{ id, name, duration, completedAt }]
   ══════════════════════════════════════════════════════════════════ */

class SessionStorage {
  static KEY = 'focussprint_sessions';
  static MAX_SESSIONS = 500;

  /**
   * Retrieve all saved sessions, newest first.
   * Gracefully handles missing, empty, or corrupted data.
   * @returns {Array} Array of session objects
   */
  static getSessions() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);

      // Guard against non-array corruption
      if (!Array.isArray(parsed)) {
        console.warn('[Storage] Data was not an array — resetting.');
        this.clearSessions();
        return [];
      }

      const normalized = parsed
        .map((session) => this._normalizeSession(session))
        .filter(Boolean)
        .sort((a, b) => b.completedAt - a.completedAt)
        .slice(0, this.MAX_SESSIONS);

      if (normalized.length !== parsed.length) {
        this._persist(normalized);
      }

      return normalized;
    } catch (err) {
      console.warn('[Storage] Failed to parse sessions — resetting.', err);
      this.clearSessions();
      return [];
    }
  }

  /**
   * Save a completed session. Newest is prepended.
   * @param {Object} session - Must include { id, name, duration, completedAt }
   */
  static saveSession(session) {
    const normalized = this._normalizeSession(session);
    if (!normalized) {
      console.warn('[Storage] Attempted to save invalid session.');
      return;
    }

    const sessions = this.getSessions();
    sessions.unshift(normalized);
    const trimmedSessions = sessions.slice(0, this.MAX_SESSIONS);

    this._persist(trimmedSessions);
  }

  /**
   * Delete a single session by its ID.
   * @param {string} id
   */
  static deleteSession(id) {
    const sessions = this.getSessions().filter((s) => s.id !== id);
    this._persist(sessions);
  }

  static _normalizeSession(session) {
    if (!session || typeof session !== 'object') return null;

    const duration = Number(session.duration);
    const completedAt = Number(session.completedAt);
    const name = typeof session.name === 'string' ? session.name.trim() : '';

    if (
      !session.id ||
      !Number.isFinite(duration) ||
      duration <= 0 ||
      !Number.isFinite(completedAt) ||
      completedAt <= 0
    ) {
      return null;
    }

    return {
      id: String(session.id),
      name: name || 'Untitled Session',
      duration: Math.min(240, Math.max(1, Math.round(duration))),
      completedAt,
    };
  }

  static _persist(sessions) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(sessions));
    } catch (err) {
      console.error('[Storage] Failed to save sessions.', err);
    }
  }

  /**
   * Remove all saved sessions.
   */
  static clearSessions() {
    try {
      localStorage.removeItem(this.KEY);
    } catch (err) {
      console.error('[Storage] Failed to clear sessions.', err);
    }
  }
}


/* ══════════════════════════════════════════════════════════════════
   XP STORAGE
   Key: focussprint_xp
   Shape: { totalXP: number }
   ══════════════════════════════════════════════════════════════════ */

class XPStorage {
  static KEY = 'focussprint_xp';

  /**
   * Get the player's total XP.
   * @returns {number}
   */
  static getTotalXP() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return 0;

      const parsed = JSON.parse(raw);

      if (typeof parsed === 'number' && Number.isFinite(parsed) && parsed >= 0) return parsed;
      if (parsed && typeof parsed.totalXP === 'number' && Number.isFinite(parsed.totalXP) && parsed.totalXP >= 0) {
        return parsed.totalXP;
      }

      console.warn('[XPStorage] Corrupted data — resetting.');
      this.clear();
      return 0;
    } catch (err) {
      console.warn('[XPStorage] Parse error — resetting.', err);
      this.clear();
      return 0;
    }
  }

  /**
   * Set the player's total XP.
   * @param {number} totalXP
   */
  static setTotalXP(totalXP) {
    const safeXP = Number.isFinite(Number(totalXP))
      ? Math.max(0, Math.round(Number(totalXP)))
      : 0;
    try {
      localStorage.setItem(this.KEY, JSON.stringify({ totalXP: safeXP }));
    } catch (err) {
      console.error('[XPStorage] Failed to save.', err);
    }
  }

  /** Remove XP data. */
  static clear() {
    try {
      localStorage.removeItem(this.KEY);
    } catch (err) {
      console.error('[XPStorage] Failed to clear.', err);
    }
  }
}


/* ══════════════════════════════════════════════════════════════════
   STREAK STORAGE
   Key: focussprint_streak
   Shape: { currentStreak, longestStreak, lastCompletedDate }
   ══════════════════════════════════════════════════════════════════ */

class StreakStorage {
  static KEY = 'focussprint_streak';

  /** Default streak state */
  static DEFAULT = {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
  };

  /**
   * Get streak data from storage.
   * @returns {{ currentStreak: number, longestStreak: number, lastCompletedDate: string|null }}
   */
  static getStreakData() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return { ...this.DEFAULT };

      const parsed = JSON.parse(raw);

      // Validate shape
      if (
        typeof parsed !== 'object' ||
        typeof parsed.currentStreak !== 'number' ||
        typeof parsed.longestStreak !== 'number'
      ) {
        console.warn('[StreakStorage] Corrupted data — resetting.');
        this.clear();
        return { ...this.DEFAULT };
      }

      return {
        currentStreak: Math.max(0, Math.floor(parsed.currentStreak)),
        longestStreak: Math.max(0, Math.floor(parsed.longestStreak)),
        lastCompletedDate: parsed.lastCompletedDate || null,
      };
    } catch (err) {
      console.warn('[StreakStorage] Parse error — resetting.', err);
      this.clear();
      return { ...this.DEFAULT };
    }
  }

  /**
   * Save streak data.
   * @param {{ currentStreak: number, longestStreak: number, lastCompletedDate: string|null }} data
   */
  static setStreakData(data) {
    const safeData = {
      currentStreak: Math.max(0, Math.floor(Number(data?.currentStreak) || 0)),
      longestStreak: Math.max(0, Math.floor(Number(data?.longestStreak) || 0)),
      lastCompletedDate: data?.lastCompletedDate || null,
    };
    try {
      localStorage.setItem(this.KEY, JSON.stringify(safeData));
    } catch (err) {
      console.error('[StreakStorage] Failed to save.', err);
    }
  }

  /** Remove streak data. */
  static clear() {
    try {
      localStorage.removeItem(this.KEY);
    } catch (err) {
      console.error('[StreakStorage] Failed to clear.', err);
    }
  }
}


/* ══════════════════════════════════════════════════════════════════
   ACHIEVEMENT STORAGE
   Key: focussprint_achievements
   Shape: { [achievementId]: { unlocked, unlockedAt, rewardXP } }
   ══════════════════════════════════════════════════════════════════ */

class AchievementStorage {
  static KEY = 'focussprint_achievements';

  /**
   * Get the achievement state map.
   * @returns {Object} Map of achievement ID → { unlocked, unlockedAt, rewardXP }
   */
  static getData() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return {};

      const parsed = JSON.parse(raw);

      if (typeof parsed !== 'object' || Array.isArray(parsed)) {
        console.warn('[AchievementStorage] Corrupted data — resetting.');
        this.clear();
        return {};
      }

      return parsed;
    } catch (err) {
      console.warn('[AchievementStorage] Parse error — resetting.', err);
      this.clear();
      return {};
    }
  }

  /**
   * Save the achievement state map.
   * @param {Object} data
   */
  static setData(data) {
    if (!data || typeof data !== 'object') {
      this.clear();
      return;
    }

    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (err) {
      console.error('[AchievementStorage] Failed to save.', err);
    }
  }

  /** Remove all achievement data. */
  static clear() {
    try {
      localStorage.removeItem(this.KEY);
    } catch (err) {
      console.error('[AchievementStorage] Failed to clear.', err);
    }
  }
}


/* ══════════════════════════════════════════════════════════════════
   GARDEN STORAGE
   Key: focussprint_garden
   Shape: { currentStage, totalSessions, totalGrowthPoints,
            progressPercentage, unlockedStages[], rewardedStages[], lastUpdated }
   ══════════════════════════════════════════════════════════════════ */

class GardenStorage {
  static KEY = 'focussprint_garden';

  /** Default garden state. */
  static DEFAULT = {
    currentStage: 'seed',
    totalSessions: 0,
    totalGrowthPoints: 0,
    progressPercentage: 0,
    unlockedStages: ['seed'],
    rewardedStages: ['seed'],
    lastUpdated: null,
  };

  /**
   * Get garden data from storage.
   * @returns {Object}
   */
  static getData() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return { ...this.DEFAULT, unlockedStages: [...this.DEFAULT.unlockedStages], rewardedStages: [...this.DEFAULT.rewardedStages] };

      const parsed = JSON.parse(raw);

      // Validate shape
      if (
        typeof parsed !== 'object' ||
        typeof parsed.currentStage !== 'string' ||
        typeof parsed.totalSessions !== 'number' ||
        !Array.isArray(parsed.unlockedStages)
      ) {
        console.warn('[GardenStorage] Corrupted data — resetting.');
        this.clear();
        return { ...this.DEFAULT, unlockedStages: [...this.DEFAULT.unlockedStages], rewardedStages: [...this.DEFAULT.rewardedStages] };
      }

      // Ensure rewardedStages exists (migration guard)
      if (!Array.isArray(parsed.rewardedStages)) {
        parsed.rewardedStages = [...parsed.unlockedStages];
      }

      const validStages = typeof GardenManager !== 'undefined'
        ? GardenManager.STAGES.map((stage) => stage.id)
        : null;
      const aliases = typeof GardenManager !== 'undefined' ? GardenManager.STAGE_ALIASES || {} : {};
      const requestedStage = aliases[parsed.currentStage] || parsed.currentStage;
      const currentStage = validStages && !validStages.includes(requestedStage)
        ? this.DEFAULT.currentStage
        : requestedStage;

      const normalizeStageList = (stages) => stages
        .map((stage) => aliases[stage] || stage)
        .filter((stage, index, list) => (!validStages || validStages.includes(stage)) && list.indexOf(stage) === index);
      const unlockedStages = normalizeStageList(parsed.unlockedStages);
      const rewardedStages = normalizeStageList(parsed.rewardedStages);

      return {
        currentStage,
        totalSessions: Math.max(0, Math.floor(parsed.totalSessions)),
        totalGrowthPoints: Math.max(0, Math.floor(Number(parsed.totalGrowthPoints) || 0)),
        progressPercentage: Math.min(100, Math.max(0, Math.round(Number(parsed.progressPercentage) || 0))),
        unlockedStages: unlockedStages.length ? unlockedStages : [...this.DEFAULT.unlockedStages],
        rewardedStages: rewardedStages.length ? rewardedStages : [...this.DEFAULT.rewardedStages],
        lastUpdated: parsed.lastUpdated || null,
      };
    } catch (err) {
      console.warn('[GardenStorage] Parse error — resetting.', err);
      this.clear();
      return { ...this.DEFAULT, unlockedStages: [...this.DEFAULT.unlockedStages], rewardedStages: [...this.DEFAULT.rewardedStages] };
    }
  }

  /**
   * Save garden data.
   * @param {Object} data
   */
  static setData(data) {
    if (!data || typeof data !== 'object') {
      this.clear();
      return;
    }

    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (err) {
      console.error('[GardenStorage] Failed to save.', err);
    }
  }

  /** Remove garden data. */
  static clear() {
    try {
      localStorage.removeItem(this.KEY);
    } catch (err) {
      console.error('[GardenStorage] Failed to clear.', err);
    }
  }
}
