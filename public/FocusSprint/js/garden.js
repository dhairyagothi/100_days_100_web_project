/* ════════════════════════════════════════════════════════════════════
   FocusSprint — Virtual Garden Progression Engine
   Manages garden stages, growth points, stage unlocks, and rewards.
   Pure logic (no DOM). Reads/writes via GardenStorage.
   ════════════════════════════════════════════════════════════════════ */

class GardenManager {

  /* ── Stage configuration (expandable) ───────────────────────────── */
  static STAGES = [
    {
      id: 'seed',
      title: 'Seed',
      stageTitle: 'Seed Stage',
      requiredSessions: 0,
      rewardXP: 0,
      description: 'Every great forest begins with a single seed beneath the soil.',
      progressMessage: 'Complete {remaining} more sessions to help the seed break through.',
      completeMessage: 'The first spark of growth is alive beneath your focus.',
    },
    {
      id: 'sprout',
      title: 'Sprout',
      stageTitle: 'Sprout Stage',
      requiredSessions: 5,
      rewardXP: 25,
      description: 'A tiny sprout reaches upward, turning consistency into visible growth.',
      progressMessage: 'Complete {remaining} more sessions to strengthen it into a sapling.',
      completeMessage: 'Your sprout is steady, bright, and ready for deeper roots.',
    },
    {
      id: 'sapling',
      title: 'Sapling',
      stageTitle: 'Sapling Stage',
      requiredSessions: 15,
      rewardXP: 50,
      description: 'A young sapling grows stronger leaves as your focus compounds.',
      progressMessage: 'Complete {remaining} more sessions to shape it into a young tree.',
      completeMessage: 'The sapling has found its rhythm and is building a foundation.',
    },
    {
      id: 'tree',
      title: 'Young Tree',
      stageTitle: 'Young Tree Stage',
      requiredSessions: 30,
      rewardXP: 100,
      description: 'A young tree stands rooted, proof that repeated effort creates structure.',
      progressMessage: 'Complete {remaining} more sessions to mature your tree.',
      completeMessage: 'Your tree now anchors the garden with calm, steady momentum.',
    },
    {
      id: 'mature_tree',
      title: 'Mature Tree',
      stageTitle: 'Mature Tree Stage',
      requiredSessions: 60,
      rewardXP: 200,
      description: 'Your tree has matured into a resilient canopy built through every focus sprint.',
      progressMessage: 'Complete {remaining} more sessions to make it flourish.',
      completeMessage: 'The canopy is full, resilient, and quietly powerful.',
    },
    {
      id: 'flourishing_tree',
      title: 'Flourishing Tree',
      stageTitle: 'Flourishing Tree Stage',
      requiredSessions: 100,
      rewardXP: 500,
      description: 'The garden glows around a flourishing tree, alive with disciplined energy.',
      progressMessage: 'Complete {remaining} more sessions to awaken the enchanted forest.',
      completeMessage: 'Your tree radiates growth. The forest is beginning to answer.',
    },
    {
      id: 'enchanted_forest',
      title: 'Enchanted Forest',
      stageTitle: 'Enchanted Forest',
      requiredSessions: 250,
      rewardXP: 1000,
      description: 'You have grown an enchanted forest: a living legacy of discipline and focus.',
      progressMessage: 'Your garden has reached its final evolution.',
      completeMessage: 'The forest is fully awakened. Every session adds to its quiet magic.',
    },
  ];

  static STAGE_ALIASES = {
    grove: 'mature_tree',
    forest: 'flourishing_tree',
  };

  /* ══════════════════════════════════════════════════════════════════
     CORE: ADD GROWTH — called on every session completion
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Record growth from a completed session.
   * Updates growth points, session count, checks stage progression,
   * awards stage-unlock bonus XP, and emits events.
   *
   * @param {number} sessionDuration — minutes of the completed session
   * @returns {{ gardenData: Object, newStages: Array, bonusXP: number }}
   */
  static addGrowth(sessionDuration) {
    const data = GardenStorage.getData();
    const previousStageIndex = this._stageIndex(data.currentStage);

    // Accumulate
    data.totalSessions++;
    data.totalGrowthPoints += Math.max(0, sessionDuration);
    data.lastUpdated = Date.now();

    // Determine new stage
    const newStageIndex = this._computeStageIndex(data.totalSessions);
    const newStage = this.STAGES[newStageIndex];

    // Collect any newly unlocked stages (handles multi-stage jumps)
    const newStages = [];
    let bonusXP = 0;

    for (let i = previousStageIndex + 1; i <= newStageIndex; i++) {
      const stage = this.STAGES[i];

      // Only reward if not already rewarded
      if (!data.rewardedStages.includes(stage.id)) {
        data.rewardedStages.push(stage.id);

        if (stage.rewardXP > 0) {
          const currentXP = XPStorage.getTotalXP();
          XPStorage.setTotalXP(currentXP + stage.rewardXP);
          bonusXP += stage.rewardXP;
        }

        newStages.push(stage);

        // Emit stage unlock event
        document.dispatchEvent(
          new CustomEvent('gardenStageUnlocked', {
            detail: { stage: stage.id, title: stage.title },
          })
        );
      }
    }

    // Update stored data
    data.currentStage = newStage.id;
    data.unlockedStages = this.STAGES
      .slice(0, newStageIndex + 1)
      .map((s) => s.id);

    // Compute progress toward next stage
    const progressInfo = this._computeProgress(data.totalSessions, newStageIndex);
    data.progressPercentage = progressInfo.progressPercentage;

    GardenStorage.setData(data);

    return { gardenData: { ...data }, newStages, bonusXP };
  }

  /* ══════════════════════════════════════════════════════════════════
     QUERIES
     ══════════════════════════════════════════════════════════════════ */

  /** Get the current stage config object. */
  static getCurrentStage() {
    const data = GardenStorage.getData();
    const idx = this._stageIndex(data.currentStage);
    return { ...this.STAGES[idx] };
  }

  /** Get the next stage config object, or null if at max. */
  static getNextStage() {
    const data = GardenStorage.getData();
    const idx = this._stageIndex(data.currentStage);
    if (idx >= this.STAGES.length - 1) return null;
    return { ...this.STAGES[idx + 1] };
  }

  /**
   * Get full progress snapshot toward the next stage.
   * @returns {{ currentStage, nextStage, currentSessions, requiredSessions,
   *             sessionsRemaining, progressPercentage, gardenLevel, isMaxStage }}
   */
  static getProgressToNextStage() {
    const data = GardenStorage.getData();
    const currentIdx = this._stageIndex(data.currentStage);
    const currentStage = this.STAGES[currentIdx];
    const isMax = currentIdx >= this.STAGES.length - 1;
    const nextStage = isMax ? null : this.STAGES[currentIdx + 1];

    const progressInfo = this._computeProgress(data.totalSessions, currentIdx);

    return {
      currentStage: currentStage,
      nextStage: nextStage,
      currentSessions: data.totalSessions,
      requiredSessions: nextStage ? nextStage.requiredSessions : currentStage.requiredSessions,
      sessionsRemaining: progressInfo.sessionsRemaining,
      progressPercentage: progressInfo.progressPercentage,
      gardenLevel: currentIdx + 1,
      isMaxStage: isMax,
    };
  }

  /** Get remaining sessions to next stage. */
  static getRemainingSessions() {
    return this.getProgressToNextStage().sessionsRemaining;
  }

  /** Get array of unlocked stage IDs. */
  static getUnlockedStages() {
    const data = GardenStorage.getData();
    return [...data.unlockedStages];
  }

  /** Get the full persisted garden data. */
  static getGardenData() {
    return { ...GardenStorage.getData() };
  }

  /** Reset garden to initial state. */
  static resetGarden() {
    GardenStorage.clear();
  }

  /* ══════════════════════════════════════════════════════════════════
     STATISTICS
     ══════════════════════════════════════════════════════════════════ */

  /** Total accumulated growth points. */
  static getTotalGrowthPoints() {
    return GardenStorage.getData().totalGrowthPoints;
  }

  /**
   * Overall garden completion percentage (0–100).
   * Based on stages unlocked out of total stages.
   */
  static getGardenCompletionPercentage() {
    const data = GardenStorage.getData();
    const idx = this._stageIndex(data.currentStage);
    return Math.round(((idx + 1) / this.STAGES.length) * 100);
  }

  /** Number of stages unlocked (including Seed). */
  static getUnlockedStageCount() {
    const data = GardenStorage.getData();
    return this._stageIndex(data.currentStage) + 1;
  }

  /** Total number of defined stages. */
  static getTotalStages() {
    return this.STAGES.length;
  }

  /**
   * Garden level = 1-indexed stage number.
   * Stage 1 = Seed, Stage 7 = Enchanted Forest.
   */
  static getGardenLevel() {
    const data = GardenStorage.getData();
    return this._stageIndex(data.currentStage) + 1;
  }

  /**
   * Get a 1-indexed stage index for use by the achievement system.
   * 0 = no stage (impossible in practice), 1 = Seed, 2 = Sprout, etc.
   * @returns {number}
   */
  static getStageIndexForAchievements() {
    const data = GardenStorage.getData();
    return this._stageIndex(data.currentStage) + 1; // 1-indexed
  }

  /* ══════════════════════════════════════════════════════════════════
     INTERNAL HELPERS
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Get the array index of a stage by its ID.
   * Falls back to 0 (seed) if not found.
   * @private
   */
  static _stageIndex(stageId) {
    const normalizedStageId = this.STAGE_ALIASES[stageId] || stageId;
    const idx = this.STAGES.findIndex((s) => s.id === normalizedStageId);
    return idx >= 0 ? idx : 0;
  }

  /**
   * Compute which stage index the user should be at based on session count.
   * Picks the highest stage whose requiredSessions <= sessionCount.
   * @private
   */
  static _computeStageIndex(sessionCount) {
    let idx = 0;
    for (let i = this.STAGES.length - 1; i >= 0; i--) {
      if (sessionCount >= this.STAGES[i].requiredSessions) {
        idx = i;
        break;
      }
    }
    return idx;
  }

  /**
   * Compute progress info between current stage and next stage.
   * @private
   */
  static _computeProgress(totalSessions, currentStageIndex) {
    const isMax = currentStageIndex >= this.STAGES.length - 1;

    if (isMax) {
      return { sessionsRemaining: 0, progressPercentage: 100 };
    }

    const currentReq = this.STAGES[currentStageIndex].requiredSessions;
    const nextReq = this.STAGES[currentStageIndex + 1].requiredSessions;
    const span = nextReq - currentReq;
    const done = totalSessions - currentReq;
    const remaining = Math.max(0, nextReq - totalSessions);

    const pct = span > 0 ? Math.min(100, Math.round((done / span) * 100)) : 100;

    return { sessionsRemaining: remaining, progressPercentage: pct };
  }
}
