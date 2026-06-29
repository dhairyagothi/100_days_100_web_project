/* ════════════════════════════════════════════════════════════════════
   FocusSprint — Analytics & Productivity Insights Engine
   Calculates statistics, generates insights, and tracks milestones.
   Pure logic (no DOM). Reads from existing Storage classes.
   ════════════════════════════════════════════════════════════════════ */

class AnalyticsEngine {

  /* ══════════════════════════════════════════════════════════════════
     INTERNAL HELPERS
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Format a Date object as YYYY-MM-DD string (local timezone).
   * @param {Date} date
   * @returns {string}
   */
  static _toDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Get the Monday of the week containing the given date.
   * @param {Date} date
   * @returns {Date} Monday at 00:00:00.000
   */
  static _getMonday(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0=Sun, 1=Mon, ...
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Filter sessions to those whose completedAt falls within [start, end].
   * @param {Date} start
   * @param {Date} end
   * @returns {Array}
   */
  static _getSessionsInRange(start, end) {
    const startMs = start.getTime();
    const endMs = end.getTime();
    return SessionStorage.getSessions().filter((s) => {
      const t = s.completedAt;
      return t >= startMs && t <= endMs;
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     CORE STATISTICS
     ══════════════════════════════════════════════════════════════════ */

  /** Total focus time in minutes across all completed sessions. */
  static getTotalFocusMinutes() {
    return SessionStorage.getSessions()
      .reduce((sum, s) => sum + (s.duration || 0), 0);
  }

  /** Total focus time in hours (rounded to 1 decimal place). */
  static getTotalFocusHours() {
    return Math.round(this.getTotalFocusMinutes() / 6) / 10;
  }

  /** Total number of completed sessions. */
  static getCompletedSessions() {
    return SessionStorage.getSessions().length;
  }

  /** Average session duration in minutes (rounded integer). Returns 0 if no sessions. */
  static getAverageSessionDuration() {
    const sessions = SessionStorage.getSessions();
    if (sessions.length === 0) return 0;
    return Math.round(this.getTotalFocusMinutes() / sessions.length);
  }

  /** Duration of the longest session (minutes). Returns 0 if no sessions. */
  static getLongestSession() {
    const sessions = SessionStorage.getSessions();
    if (sessions.length === 0) return 0;
    return Math.max(...sessions.map((s) => s.duration || 0));
  }

  /** Duration of the shortest session (minutes). Returns 0 if no sessions. */
  static getShortestSession() {
    const sessions = SessionStorage.getSessions();
    if (sessions.length === 0) return 0;
    return Math.min(...sessions.map((s) => s.duration || 0));
  }

  /* ══════════════════════════════════════════════════════════════════
     PRODUCTIVITY SCORE  (0–100)
     Weighted composite of five progression factors.

     Streak          30% — rewards daily consistency
     Weekly Activity 25% — active days this week (Mon–Sun)
     Focus Volume    20% — weekly focus minutes (5 hrs = perfect)
     Achievements    15% — overall completion progress
     Garden          10% — garden stage progress
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Calculate a composite productivity score.
   * @returns {number} 0–100
   */
  static getProductivityScore() {
    const sessions = SessionStorage.getSessions();
    if (sessions.length === 0) return 0;

    const streakState = StreakTracker.getCurrentState();
    const weekActivity = StreakTracker.getWeekActivity();
    const activeDays = weekActivity.filter(Boolean).length;
    const thisWeekMinutes = this.getCurrentWeekFocus();
    const totalAchievements = AchievementEngine.getTotalAchievements();
    const unlockedAchievements = AchievementEngine.getUnlockedCount();
    const gardenCompletion = GardenManager.getGardenCompletionPercentage();

    // Component scores (each 0–100)
    const streakScore = Math.min(streakState.currentStreak / 14, 1) * 100;
    const consistencyScore = (activeDays / 7) * 100;
    const volumeScore = Math.min(thisWeekMinutes / 300, 1) * 100;
    const achievementScore = totalAchievements > 0
      ? (unlockedAchievements / totalAchievements) * 100
      : 0;
    const gardenScore = gardenCompletion;

    const score = Math.round(
      streakScore * 0.30 +
      consistencyScore * 0.25 +
      volumeScore * 0.20 +
      achievementScore * 0.15 +
      gardenScore * 0.10
    );

    return Math.min(100, Math.max(0, score));
  }

  /* ══════════════════════════════════════════════════════════════════
     WEEKLY STATISTICS
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Get per-day statistics for a given week.
   * @param {number} weekOffset — 0 = current week, 1 = last week, etc.
   * @returns {Array<{ day: string, minutes: number, sessions: number }>}
   */
  static getWeeklyStats(weekOffset = 0) {
    const today = new Date();
    const monday = this._getMonday(today);
    monday.setDate(monday.getDate() - weekOffset * 7);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const weekSessions = this._getSessionsInRange(monday, sunday);

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const stats = dayNames.map((day) => ({ day, minutes: 0, sessions: 0 }));

    weekSessions.forEach((s) => {
      const d = new Date(s.completedAt);
      const idx = (d.getDay() + 6) % 7; // Mon=0 … Sun=6
      stats[idx].minutes += s.duration || 0;
      stats[idx].sessions++;
    });

    return stats;
  }

  /** Total focus minutes for the current week (Mon–Sun). */
  static getCurrentWeekFocus() {
    return this.getWeeklyStats(0).reduce((s, d) => s + d.minutes, 0);
  }

  /* ══════════════════════════════════════════════════════════════════
     MONTHLY STATISTICS
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Get per-week statistics for a given month.
   * @param {number} monthOffset — 0 = current month, 1 = last month, etc.
   * @returns {Array<{ week: number, minutes: number, sessions: number }>}
   */
  static getMonthlyStats(monthOffset = 0) {
    const now = new Date();
    const targetYear = now.getFullYear();
    const targetMonth = now.getMonth() - monthOffset;

    const firstDay = new Date(targetYear, targetMonth, 1);
    firstDay.setHours(0, 0, 0, 0);
    const lastDay = new Date(targetYear, targetMonth + 1, 0);
    lastDay.setHours(23, 59, 59, 999);

    const monthSessions = this._getSessionsInRange(firstDay, lastDay);

    // Build 7-day week buckets from the first of the month
    const weeks = [];
    let weekStart = new Date(firstDay);
    let weekNum = 1;

    while (weekStart <= lastDay) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      if (weekEnd > lastDay) weekEnd.setTime(lastDay.getTime());

      weeks.push({
        week: weekNum,
        startMs: weekStart.getTime(),
        endMs: weekEnd.getTime() + (23 * 3600 + 59 * 60 + 59) * 1000 + 999,
        minutes: 0,
        sessions: 0,
      });

      weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() + 1);
      weekStart.setHours(0, 0, 0, 0);
      weekNum++;
    }

    monthSessions.forEach((s) => {
      const t = s.completedAt;
      for (const w of weeks) {
        if (t >= w.startMs && t <= w.endMs) {
          w.minutes += s.duration || 0;
          w.sessions++;
          break;
        }
      }
    });

    return weeks.map((w) => ({
      week: w.week,
      minutes: w.minutes,
      sessions: w.sessions,
    }));
  }

  /** Total focus minutes for the current calendar month. */
  static getCurrentMonthFocus() {
    return this.getMonthlyStats(0).reduce((s, w) => s + w.minutes, 0);
  }

  /* ══════════════════════════════════════════════════════════════════
     DAILY ACTIVITY HEATMAP
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Generate GitHub-style daily activity data for the last N days.
   * @param {number} days — number of days to include (default 90)
   * @returns {Array<{ date: string, sessions: number, minutes: number }>}
   */
  static getDailyActivityHeatmap(days = 90) {
    const sessions = SessionStorage.getSessions();
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const start = new Date(today);
    start.setDate(today.getDate() - days + 1);
    start.setHours(0, 0, 0, 0);

    // Build date → totals lookup
    const map = {};
    sessions.forEach((s) => {
      const d = new Date(s.completedAt);
      if (d >= start && d <= today) {
        const key = this._toDateString(d);
        if (!map[key]) map[key] = { sessions: 0, minutes: 0 };
        map[key].sessions++;
        map[key].minutes += s.duration || 0;
      }
    });

    // Return an entry for every day in the range
    const result = [];
    const cursor = new Date(start);
    while (cursor <= today) {
      const key = this._toDateString(cursor);
      result.push({
        date: key,
        sessions: map[key]?.sessions || 0,
        minutes: map[key]?.minutes || 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  }

  /* ══════════════════════════════════════════════════════════════════
     PRODUCTIVITY INSIGHTS
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Generate data-driven productivity insights.
   * Each insight has an icon, text, and priority (higher = more relevant).
   * Returns the top insights sorted by priority.
   *
   * @returns {Array<{ icon: string, text: string, priority: number }>}
   */
  static generateInsights() {
    const sessions = SessionStorage.getSessions();

    if (sessions.length === 0) {
      return [{
        icon: '📊',
        text: 'No productivity data available yet. Complete a session to unlock insights.',
        priority: 0,
      }];
    }

    const insights = [];

    // ── 1. Week-over-week comparison ────────────────────────────────
    const thisWeekStats = this.getWeeklyStats(0);
    const lastWeekStats = this.getWeeklyStats(1);
    const thisWeekMin = thisWeekStats.reduce((s, d) => s + d.minutes, 0);
    const lastWeekMin = lastWeekStats.reduce((s, d) => s + d.minutes, 0);

    if (lastWeekMin > 0) {
      const pctChange = Math.round(((thisWeekMin - lastWeekMin) / lastWeekMin) * 100);
      if (pctChange > 0) {
        insights.push({
          icon: '📈', priority: 10,
          text: `You focused ${pctChange}% more this week than last week.`,
        });
      } else if (pctChange < -10) {
        insights.push({
          icon: '📉', priority: 8,
          text: `Your focus dropped ${Math.abs(pctChange)}% compared to last week.`,
        });
      } else {
        insights.push({
          icon: '🎯', priority: 5,
          text: 'Your focus is consistent with last week. Keep it up!',
        });
      }
    } else if (thisWeekMin > 0) {
      insights.push({
        icon: '🚀', priority: 7,
        text: `Great start! You've focused ${thisWeekMin} minutes this week.`,
      });
    }

    // ── 2. Average session trend (this week vs last week) ──────────
    const thisWeekSessions = thisWeekStats.reduce((s, d) => s + d.sessions, 0);
    const lastWeekSessions = lastWeekStats.reduce((s, d) => s + d.sessions, 0);
    if (thisWeekSessions > 0 && lastWeekSessions > 0) {
      const thisAvg = Math.round(thisWeekMin / thisWeekSessions);
      const lastAvg = Math.round(lastWeekMin / lastWeekSessions);
      const diff = thisAvg - lastAvg;
      if (diff > 5) {
        insights.push({
          icon: '⏱️', priority: 7,
          text: `Your average session increased by ${diff} minutes this week.`,
        });
      } else if (diff < -5) {
        insights.push({
          icon: '⏱️', priority: 6,
          text: `Your average session decreased by ${Math.abs(diff)} minutes.`,
        });
      }
    }

    // ── 3. Current streak status ───────────────────────────────────
    const streakState = StreakTracker.getCurrentState();
    if (streakState.currentStreak >= 14) {
      insights.push({
        icon: '🔥', priority: 9,
        text: `Incredible ${streakState.currentStreak}-day streak! You're unstoppable.`,
      });
    } else if (streakState.currentStreak >= 7) {
      insights.push({
        icon: '🔥', priority: 8,
        text: `Amazing ${streakState.currentStreak}-day streak! Keep the momentum.`,
      });
    } else if (streakState.currentStreak >= 3) {
      insights.push({
        icon: '🔥', priority: 6,
        text: `You maintained a ${streakState.currentStreak}-day streak.`,
      });
    } else if (streakState.currentStreak === 0) {
      insights.push({
        icon: '💡', priority: 7,
        text: 'Start a session today to begin a new streak.',
      });
    }

    // ── 4. XP to next level ────────────────────────────────────────
    const totalXP = XPStorage.getTotalXP();
    const progression = XPEngine.getProgression(totalXP);
    if (progression.xpToNext > 0 && progression.xpToNext <= 200) {
      insights.push({
        icon: '✨', priority: 9,
        text: `Only ${progression.xpToNext} XP until Level ${progression.level + 1}!`,
      });
    } else if (progression.xpToNext > 0) {
      insights.push({
        icon: '✨', priority: 4,
        text: `You are ${progression.xpToNext} XP away from Level ${progression.level + 1}.`,
      });
    }

    // ── 5. Garden progress ─────────────────────────────────────────
    const gardenProgress = GardenManager.getProgressToNextStage();
    if (!gardenProgress.isMaxStage && gardenProgress.sessionsRemaining > 0) {
      const remaining = gardenProgress.sessionsRemaining;
      if (remaining <= 3) {
        insights.push({
          icon: '🌱', priority: 8,
          text: `Just ${remaining} session${remaining !== 1 ? 's' : ''} until ${gardenProgress.nextStage.title}!`,
        });
      } else {
        insights.push({
          icon: '🌱', priority: 3,
          text: `${remaining} sessions until your garden evolves to ${gardenProgress.nextStage.title}.`,
        });
      }
    } else if (gardenProgress.isMaxStage) {
      insights.push({
        icon: '✨', priority: 5,
        text: 'Your garden is fully grown. Legendary!',
      });
    }

    // ── 6. Time-of-day pattern ─────────────────────────────────────
    if (sessions.length >= 5) {
      const buckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
      sessions.forEach((s) => {
        const hr = new Date(s.completedAt).getHours();
        if (hr >= 5 && hr < 12) buckets.morning++;
        else if (hr >= 12 && hr < 17) buckets.afternoon++;
        else if (hr >= 17 && hr < 21) buckets.evening++;
        else buckets.night++;
      });
      const best = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0];
      if (best[1] > 0) {
        const labels = { morning: 'the morning', afternoon: 'the afternoon', evening: 'the evening', night: 'late night' };
        insights.push({
          icon: '📅', priority: 4,
          text: `Most of your focus sessions occur in ${labels[best[0]]}.`,
        });
      }
    }

    // ── 7. Best day this week ──────────────────────────────────────
    if (thisWeekMin > 0) {
      const bestDay = [...thisWeekStats].sort((a, b) => b.minutes - a.minutes)[0];
      if (bestDay.minutes > 0) {
        insights.push({
          icon: '🗓️', priority: 3,
          text: `${bestDay.day} was your most productive day this week (${bestDay.minutes} min).`,
        });
      }
    }

    // ── 8. Longest session record ──────────────────────────────────
    const longest = this.getLongestSession();
    if (longest >= 60) {
      insights.push({
        icon: '🏆', priority: 5,
        text: `Your longest session was ${longest} minutes. Deep work champion.`,
      });
    }

    // ── 9. Total hours milestone ───────────────────────────────────
    const totalHours = this.getTotalFocusHours();
    const hourMilestones = [1, 5, 10, 25, 50, 100, 250, 500];
    for (const milestone of hourMilestones) {
      if (totalHours >= milestone && totalHours < milestone * 1.5) {
        insights.push({
          icon: '🎯', priority: 6,
          text: `You've crossed ${milestone} total focus hours!`,
        });
        break;
      }
    }

    // Sort by priority (highest first) and return top 4
    return insights
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 4);
  }

  /* ══════════════════════════════════════════════════════════════════
     MILESTONE TRACKING
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Get the nearest upcoming milestones across all progression systems.
   * @returns {Array<{ type: string, icon: string, label: string,
   *                    remaining: string, progress: number }>}
   */
  static getNextMilestone() {
    const milestones = [];

    // ── Level milestone ────────────────────────────────────────────
    const totalXP = XPStorage.getTotalXP();
    const progression = XPEngine.getProgression(totalXP);
    if (progression.xpToNext > 0) {
      milestones.push({
        type: 'level',
        icon: '⬆️',
        label: `Level ${progression.level + 1} (${progression.nextRank})`,
        remaining: `${progression.xpToNext} XP`,
        progress: progression.progressPct,
      });
    }

    // ── Garden milestone ───────────────────────────────────────────
    const garden = GardenManager.getProgressToNextStage();
    if (!garden.isMaxStage && garden.nextStage) {
      milestones.push({
        type: 'garden',
        icon: garden.nextStage.icon,
        label: garden.nextStage.title,
        remaining: `${garden.sessionsRemaining} sessions`,
        progress: garden.progressPercentage,
      });
    }

    // ── Streak milestone ───────────────────────────────────────────
    const streakState = StreakTracker.getCurrentState();
    const streakTargets = [
      { count: 3, label: 'On Fire' },
      { count: 7, label: 'Week Warrior' },
      { count: 14, label: '2-Week Streak' },
      { count: 30, label: 'Consistency King' },
      { count: 100, label: 'Unbreakable' },
    ];
    for (const target of streakTargets) {
      if (streakState.currentStreak < target.count) {
        milestones.push({
          type: 'streak',
          icon: '🔥',
          label: target.label,
          remaining: `${target.count - streakState.currentStreak} days`,
          progress: Math.round((streakState.currentStreak / target.count) * 100),
        });
        break; // Only the next one
      }
    }

    // ── Achievement milestone ──────────────────────────────────────
    const achProgress = AchievementEngine.getAchievementProgress();
    const closestAch = achProgress
      .filter((a) => !a.unlocked && a.progress > 0)
      .sort((a, b) => b.progress - a.progress)[0];

    if (closestAch) {
      const achDef = AchievementEngine.DEFINITIONS.find((d) => d.id === closestAch.id);
      milestones.push({
        type: 'achievement',
        icon: achDef ? achDef.icon : '🏆',
        label: closestAch.title,
        remaining: `${closestAch.target - closestAch.current} more`,
        progress: closestAch.progress,
      });
    }

    return milestones;
  }

  /* ══════════════════════════════════════════════════════════════════
     AGGREGATE SNAPSHOT
     ══════════════════════════════════════════════════════════════════ */

  /**
   * Get a complete analytics snapshot (useful for UI rendering).
   * @returns {Object}
   */
  static getSnapshot() {
    return {
      totalMinutes: this.getTotalFocusMinutes(),
      totalHours: this.getTotalFocusHours(),
      completedSessions: this.getCompletedSessions(),
      averageDuration: this.getAverageSessionDuration(),
      longestSession: this.getLongestSession(),
      shortestSession: this.getShortestSession(),
      productivityScore: this.getProductivityScore(),
      currentWeekFocus: this.getCurrentWeekFocus(),
      currentMonthFocus: this.getCurrentMonthFocus(),
    };
  }
}
