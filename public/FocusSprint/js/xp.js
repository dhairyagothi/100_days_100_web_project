/* ════════════════════════════════════════════════════════════════════
   FocusSprint — XP & Level Engine
   Calculates XP rewards, levels, ranks, and progress.
   Pure logic (no DOM). Reads/writes via XPStorage.
   ════════════════════════════════════════════════════════════════════ */

class XPEngine {

  /* ── Level thresholds (expandable) ─────────────────────────────── */
  static LEVEL_TABLE = [
    { level: 1,  xpRequired: 0 },
    { level: 2,  xpRequired: 100 },
    { level: 3,  xpRequired: 250 },
    { level: 4,  xpRequired: 500 },
    { level: 5,  xpRequired: 1000 },
    { level: 6,  xpRequired: 1750 },
    { level: 7,  xpRequired: 2750 },
    { level: 8,  xpRequired: 4000 },
    { level: 9,  xpRequired: 5500 },
    { level: 10, xpRequired: 7500 },
  ];

  /* ── Rank titles (1-indexed by level) ──────────────────────────── */
  static RANK_TITLES = {
    1:  'Beginner',
    2:  'Focus Rookie',
    3:  'Focus Apprentice',
    4:  'Deep Worker',
    5:  'Productivity Warrior',
    6:  'Focus Master',
    7:  'Productivity Legend',
    8:  'Time Lord',
    9:  'Grandmaster',
    10: 'Transcendent',
  };

  /* ── XP reward presets for standard durations ──────────────────── */
  static PRESET_XP = {
    25: 50,
    45: 90,
    60: 120,
  };

  /**
   * Calculate XP earned for a session duration.
   * Uses preset values for standard durations, otherwise duration * 2.
   * @param {number} minutes
   * @returns {number}
   */
  static calculateXP(minutes) {
    if (minutes <= 0) return 0;
    return this.PRESET_XP[minutes] || minutes * 2;
  }

  /**
   * Determine the player's current level from total XP.
   * @param {number} totalXP
   * @returns {number} Level number (1-based)
   */
  static getLevel(totalXP) {
    const table = this.LEVEL_TABLE;
    let level = 1;

    for (let i = table.length - 1; i >= 0; i--) {
      if (totalXP >= table[i].xpRequired) {
        level = table[i].level;
        break;
      }
    }

    return level;
  }

  /**
   * Get the XP threshold for a given level.
   * If level exceeds table, extrapolates using last-known gap * 1.5.
   * @param {number} level
   * @returns {number}
   */
  static getXPForLevel(level) {
    const entry = this.LEVEL_TABLE.find((e) => e.level === level);
    if (entry) return entry.xpRequired;

    // Extrapolate beyond table
    const last = this.LEVEL_TABLE[this.LEVEL_TABLE.length - 1];
    const secondLast = this.LEVEL_TABLE[this.LEVEL_TABLE.length - 2];
    const gap = last.xpRequired - secondLast.xpRequired;
    const levelsAbove = level - last.level;
    return last.xpRequired + Math.round(gap * 1.5 * levelsAbove);
  }

  /**
   * Get the rank title for a given level.
   * Falls back to "Level {n}" for undefined ranks.
   * @param {number} level
   * @returns {string}
   */
  static getRank(level) {
    return this.RANK_TITLES[level] || `Level ${level}`;
  }

  /**
   * Get the rank title for the NEXT level.
   * @param {number} currentLevel
   * @returns {string}
   */
  static getNextRank(currentLevel) {
    return this.getRank(currentLevel + 1);
  }

  /**
   * Calculate full progression snapshot from total XP.
   * @param {number} totalXP
   * @returns {Object} { level, rank, nextRank, currentXP, nextLevelXP, xpInLevel, xpNeeded, progressPct }
   */
  static getProgression(totalXP) {
    const level = this.getLevel(totalXP);
    const currentLevelXP = this.getXPForLevel(level);
    const nextLevelXP = this.getXPForLevel(level + 1);

    const xpInLevel = totalXP - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    const progressPct = xpNeeded > 0 ? Math.round((xpInLevel / xpNeeded) * 100) : 100;

    return {
      level,
      rank: this.getRank(level),
      nextRank: this.getNextRank(level),
      totalXP,
      currentLevelXP,
      nextLevelXP,
      xpInLevel,
      xpNeeded,
      xpToNext: nextLevelXP - totalXP,
      progressPct: Math.min(progressPct, 100),
    };
  }

  /**
   * Award XP and return the new progression state.
   * Handles storage read/write internally.
   * @param {number} earnedXP
   * @returns {{ progression: Object, previousLevel: number, leveledUp: boolean }}
   */
  static awardXP(earnedXP) {
    const previousXP = XPStorage.getTotalXP();
    const previousLevel = this.getLevel(previousXP);

    const newTotal = previousXP + earnedXP;
    XPStorage.setTotalXP(newTotal);

    const progression = this.getProgression(newTotal);
    const leveledUp = progression.level > previousLevel;

    return { progression, previousLevel, leveledUp };
  }
}
