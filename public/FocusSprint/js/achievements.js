/* ════════════════════════════════════════════════════════════════════
   FocusSprint — Achievement Engine
   Defines achievements, checks conditions, awards bonus XP,
   emits CustomEvents. No DOM dependency.
   ════════════════════════════════════════════════════════════════════ */

class AchievementEngine {

  /* ══════════════════════════════════════════════════════════════════
     ACHIEVEMENT DEFINITIONS — Add new ones here.
     Each entry:
       id          unique string
       title       display name
       description unlock condition text
       icon        emoji
       category    sessions | xp | levels | streaks | garden
       condition   function(ctx) => boolean
       progress    function(ctx) => { current, target }
       rewardXP    bonus XP on unlock
     ══════════════════════════════════════════════════════════════════ */

  static DEFINITIONS = [

    /* ── SESSION ACHIEVEMENTS ────────────────────────────────────── */
    {
      id: 'first_focus',
      title: 'First Focus',
      description: 'Complete your first focus session',
      icon: '⚡',
      category: 'sessions',
      condition: (ctx) => ctx.sessionCount >= 1,
      progress: (ctx) => ({ current: Math.min(ctx.sessionCount, 1), target: 1 }),
      rewardXP: 25,
    },
    {
      id: 'getting_started',
      title: 'Getting Started',
      description: 'Complete 5 focus sessions',
      icon: '🚀',
      category: 'sessions',
      condition: (ctx) => ctx.sessionCount >= 5,
      progress: (ctx) => ({ current: Math.min(ctx.sessionCount, 5), target: 5 }),
      rewardXP: 50,
    },
    {
      id: 'consistent_learner',
      title: 'Consistent Learner',
      description: 'Complete 25 focus sessions',
      icon: '📚',
      category: 'sessions',
      condition: (ctx) => ctx.sessionCount >= 25,
      progress: (ctx) => ({ current: Math.min(ctx.sessionCount, 25), target: 25 }),
      rewardXP: 100,
    },
    {
      id: 'focus_veteran',
      title: 'Focus Veteran',
      description: 'Complete 100 focus sessions',
      icon: '🎯',
      category: 'sessions',
      condition: (ctx) => ctx.sessionCount >= 100,
      progress: (ctx) => ({ current: Math.min(ctx.sessionCount, 100), target: 100 }),
      rewardXP: 200,
    },
    {
      id: 'focus_legend',
      title: 'Focus Legend',
      description: 'Complete 250 focus sessions',
      icon: '👑',
      category: 'sessions',
      condition: (ctx) => ctx.sessionCount >= 250,
      progress: (ctx) => ({ current: Math.min(ctx.sessionCount, 250), target: 250 }),
      rewardXP: 500,
    },

    /* ── XP ACHIEVEMENTS ─────────────────────────────────────────── */
    {
      id: 'xp_collector',
      title: 'XP Collector',
      description: 'Earn 500 total XP',
      icon: '💎',
      category: 'xp',
      condition: (ctx) => ctx.totalXP >= 500,
      progress: (ctx) => ({ current: Math.min(ctx.totalXP, 500), target: 500 }),
      rewardXP: 50,
    },
    {
      id: 'xp_hunter',
      title: 'XP Hunter',
      description: 'Earn 1,000 total XP',
      icon: '💰',
      category: 'xp',
      condition: (ctx) => ctx.totalXP >= 1000,
      progress: (ctx) => ({ current: Math.min(ctx.totalXP, 1000), target: 1000 }),
      rewardXP: 100,
    },
    {
      id: 'xp_master',
      title: 'XP Master',
      description: 'Earn 5,000 total XP',
      icon: '🌟',
      category: 'xp',
      condition: (ctx) => ctx.totalXP >= 5000,
      progress: (ctx) => ({ current: Math.min(ctx.totalXP, 5000), target: 5000 }),
      rewardXP: 250,
    },
    {
      id: 'xp_legend',
      title: 'XP Legend',
      description: 'Earn 10,000 total XP',
      icon: '✨',
      category: 'xp',
      condition: (ctx) => ctx.totalXP >= 10000,
      progress: (ctx) => ({ current: Math.min(ctx.totalXP, 10000), target: 10000 }),
      rewardXP: 500,
    },

    /* ── LEVEL ACHIEVEMENTS ──────────────────────────────────────── */
    {
      id: 'level_up',
      title: 'Level Up',
      description: 'Reach Level 2',
      icon: '⬆️',
      category: 'levels',
      condition: (ctx) => ctx.level >= 2,
      progress: (ctx) => ({ current: Math.min(ctx.level, 2), target: 2 }),
      rewardXP: 25,
    },
    {
      id: 'deep_worker',
      title: 'Deep Worker',
      description: 'Reach Level 4',
      icon: '🧠',
      category: 'levels',
      condition: (ctx) => ctx.level >= 4,
      progress: (ctx) => ({ current: Math.min(ctx.level, 4), target: 4 }),
      rewardXP: 75,
    },
    {
      id: 'focus_master_level',
      title: 'Focus Master',
      description: 'Reach Level 6',
      icon: '🏅',
      category: 'levels',
      condition: (ctx) => ctx.level >= 6,
      progress: (ctx) => ({ current: Math.min(ctx.level, 6), target: 6 }),
      rewardXP: 150,
    },
    {
      id: 'productivity_legend',
      title: 'Productivity Legend',
      description: 'Reach Level 8',
      icon: '🏔️',
      category: 'levels',
      condition: (ctx) => ctx.level >= 8,
      progress: (ctx) => ({ current: Math.min(ctx.level, 8), target: 8 }),
      rewardXP: 300,
    },

    /* ── STREAK ACHIEVEMENTS ─────────────────────────────────────── */
    {
      id: 'on_fire',
      title: 'On Fire',
      description: '3-day streak',
      icon: '🔥',
      category: 'streaks',
      condition: (ctx) => ctx.longestStreak >= 3,
      progress: (ctx) => ({ current: Math.min(ctx.longestStreak, 3), target: 3 }),
      rewardXP: 50,
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: '7-day streak',
      icon: '🗓️',
      category: 'streaks',
      condition: (ctx) => ctx.longestStreak >= 7,
      progress: (ctx) => ({ current: Math.min(ctx.longestStreak, 7), target: 7 }),
      rewardXP: 100,
    },
    {
      id: 'consistency_king',
      title: 'Consistency King',
      description: '30-day streak',
      icon: '👑',
      category: 'streaks',
      condition: (ctx) => ctx.longestStreak >= 30,
      progress: (ctx) => ({ current: Math.min(ctx.longestStreak, 30), target: 30 }),
      rewardXP: 250,
    },
    {
      id: 'unbreakable',
      title: 'Unbreakable',
      description: '100-day streak',
      icon: '💪',
      category: 'streaks',
      condition: (ctx) => ctx.longestStreak >= 100,
      progress: (ctx) => ({ current: Math.min(ctx.longestStreak, 100), target: 100 }),
      rewardXP: 500,
    },

    /* ── GARDEN ACHIEVEMENTS ─────────────────────────────────────── */
    {
      id: 'first_seed',
      title: 'First Seed',
      description: 'Unlock Seed stage',
      icon: '🌱',
      category: 'garden',
      condition: (ctx) => ctx.gardenStageIndex >= 1 && ctx.sessionCount >= 1, // Seed
      progress: (ctx) => ({ current: (ctx.gardenStageIndex >= 1 && ctx.sessionCount >= 1) ? 1 : 0, target: 1 }),
      rewardXP: 25,
    },
    {
      id: 'sprout_keeper',
      title: 'Sprout Keeper',
      description: 'Reach Sprout stage',
      icon: '🌿',
      category: 'garden',
      condition: (ctx) => ctx.gardenStageIndex >= 2, // Sprout
      progress: (ctx) => ({ current: Math.min(Math.max(ctx.gardenStageIndex, 0), 2), target: 2 }),
      rewardXP: 50,
    },
    {
      id: 'sapling_grower',
      title: 'Sapling Grower',
      description: 'Reach Sapling stage',
      icon: '🌾',
      category: 'garden',
      condition: (ctx) => ctx.gardenStageIndex >= 3, // Sapling
      progress: (ctx) => ({ current: Math.min(Math.max(ctx.gardenStageIndex, 0), 3), target: 3 }),
      rewardXP: 75,
    },
    {
      id: 'tree_guardian',
      title: 'Tree Guardian',
      description: 'Reach Young Tree stage',
      icon: '🌳',
      category: 'garden',
      condition: (ctx) => ctx.gardenStageIndex >= 4, // Tree
      progress: (ctx) => ({ current: Math.min(Math.max(ctx.gardenStageIndex, 0), 4), target: 4 }),
      rewardXP: 100,
    },
    {
      id: 'grove_master',
      title: 'Mature Tree',
      description: 'Reach Mature Tree stage',
      icon: '🌴',
      category: 'garden',
      condition: (ctx) => ctx.gardenStageIndex >= 5, // Mature Tree
      progress: (ctx) => ({ current: Math.min(Math.max(ctx.gardenStageIndex, 0), 5), target: 5 }),
      rewardXP: 150,
    },
    {
      id: 'forest_lord',
      title: 'Flourishing Tree',
      description: 'Reach Flourishing Tree stage',
      icon: '🌲',
      category: 'garden',
      condition: (ctx) => ctx.gardenStageIndex >= 6, // Flourishing Tree
      progress: (ctx) => ({ current: Math.min(Math.max(ctx.gardenStageIndex, 0), 6), target: 6 }),
      rewardXP: 250,
    },
    {
      id: 'enchanted_keeper',
      title: 'Enchanted Keeper',
      description: 'Reach Enchanted Forest',
      icon: '✨',
      category: 'garden',
      condition: (ctx) => ctx.gardenStageIndex >= 7, // Enchanted Forest
      progress: (ctx) => ({ current: Math.min(Math.max(ctx.gardenStageIndex, 0), 7), target: 7 }),
      rewardXP: 500,
    },
  ];

  /* ══════════════════════════════════════════════════════════════════
     CONTEXT BUILDER — Gathers all state needed for condition checks
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Build the context object from current app state.
   * Called before every check cycle.
   * @returns {Object}
   */
  static buildContext() {
    const sessions = SessionStorage.getSessions();
    const totalXP = XPStorage.getTotalXP();
    const level = XPEngine.getLevel(totalXP);
    const streakData = StreakStorage.getStreakData();
    const streakState = StreakTracker.getCurrentState();

    // Garden stage index from GardenManager (1-indexed: 1=Seed, 2=Sprout, ...)
    // Falls back to 0 if GardenManager is not yet loaded
    let gardenStageIndex = 0;
    if (typeof GardenManager !== 'undefined') {
      gardenStageIndex = GardenManager.getStageIndexForAchievements();
    }

    return {
      sessionCount: sessions.length,
      totalXP,
      level,
      currentStreak: streakState.currentStreak,
      longestStreak: Math.max(streakData.longestStreak, streakState.currentStreak),
      gardenStageIndex,
    };
  }

  /* ══════════════════════════════════════════════════════════════════
     CORE ENGINE
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Check all achievements against current state.
   * Unlocks any that meet conditions and haven't been unlocked yet.
   * Awards bonus XP for newly unlocked achievements.
   *
   * @returns {Array} Array of newly unlocked achievement objects
   */
  static checkAchievements() {
    const allUnlocked = [];
    const maxPasses = 5; // Safety: prevent infinite cascade

    for (let pass = 0; pass < maxPasses; pass++) {
      const ctx = this.buildContext(); // Rebuild context each pass (XP may have changed)
      const saved = AchievementStorage.getData();
      let unlockedThisPass = 0;

      for (const def of this.DEFINITIONS) {
        // Skip already unlocked
        if (saved[def.id] && saved[def.id].unlocked) continue;

        // Check condition
        if (def.condition(ctx)) {
          const unlockData = {
            unlocked: true,
            unlockedAt: Date.now(),
            rewardXP: def.rewardXP,
          };

          // Save unlock state
          saved[def.id] = unlockData;
          AchievementStorage.setData(saved);

          // Award bonus XP
          const currentXP = XPStorage.getTotalXP();
          XPStorage.setTotalXP(currentXP + def.rewardXP);

          // Emit event for UI listeners
          document.dispatchEvent(
            new CustomEvent('achievementUnlocked', {
              detail: { ...def, ...unlockData },
            })
          );

          allUnlocked.push({ ...def, ...unlockData });
          unlockedThisPass++;
        }
      }

      // If nothing new unlocked this pass, we're stable
      if (unlockedThisPass === 0) break;
    }

    return allUnlocked;
  }

  /**
   * Manually unlock a specific achievement by ID.
   * @param {string} id
   * @returns {Object|null} The unlocked achievement, or null if already unlocked/not found
   */
  static unlockAchievement(id) {
    const def = this.DEFINITIONS.find((d) => d.id === id);
    if (!def) return null;

    const saved = AchievementStorage.getData();
    if (saved[id] && saved[id].unlocked) return null;

    const unlockData = {
      unlocked: true,
      unlockedAt: Date.now(),
      rewardXP: def.rewardXP,
    };

    saved[id] = unlockData;
    AchievementStorage.setData(saved);

    const currentXP = XPStorage.getTotalXP();
    XPStorage.setTotalXP(currentXP + def.rewardXP);

    document.dispatchEvent(
      new CustomEvent('achievementUnlocked', {
        detail: { ...def, ...unlockData },
      })
    );

    return { ...def, ...unlockData };
  }

  /* ══════════════════════════════════════════════════════════════════
     QUERIES
     ══════════════════════════════════════════════════════════════════ */

  /** Get all achievements with their current unlock state merged in. */
  static getAllAchievements() {
    const saved = AchievementStorage.getData();

    return this.DEFINITIONS.map((def) => {
      const state = saved[def.id] || { unlocked: false, unlockedAt: null, rewardXP: def.rewardXP };
      return { ...def, ...state };
    });
  }

  /** Get only unlocked achievements. */
  static getUnlockedAchievements() {
    return this.getAllAchievements().filter((a) => a.unlocked);
  }

  /** Get only locked achievements. */
  static getLockedAchievements() {
    return this.getAllAchievements().filter((a) => !a.unlocked);
  }

  /**
   * Get progress for all achievements.
   * @returns {Array} [{ id, title, current, target, progress, unlocked }]
   */
  static getAchievementProgress() {
    const ctx = this.buildContext();
    const saved = AchievementStorage.getData();

    return this.DEFINITIONS.map((def) => {
      const isUnlocked = saved[def.id] && saved[def.id].unlocked;
      const { current, target } = def.progress(ctx);

      return {
        id: def.id,
        title: def.title,
        category: def.category,
        current,
        target,
        progress: target > 0 ? Math.round((current / target) * 100) : 0,
        unlocked: isUnlocked,
      };
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     STATISTICS
     ══════════════════════════════════════════════════════════════════ */

  /** Total number of defined achievements. */
  static getTotalAchievements() {
    return this.DEFINITIONS.length;
  }

  /** Number of unlocked achievements. */
  static getUnlockedCount() {
    return this.getUnlockedAchievements().length;
  }

  /** Completion percentage (0–100). */
  static getCompletionPercentage() {
    const total = this.getTotalAchievements();
    if (total === 0) return 0;
    return Math.round((this.getUnlockedCount() / total) * 100);
  }
}
