/* ════════════════════════════════════════════════════════════════════
   FocusSprint — Streak Tracking System
   Tracks current streak, longest streak, last completion date.
   Pure logic (no DOM). Reads/writes via StreakStorage.
   ════════════════════════════════════════════════════════════════════ */

class StreakTracker {

  /**
   * Get a date string (YYYY-MM-DD) for a given Date object.
   * Uses local timezone to match the user's "day" concept.
   * @param {Date} date
   * @returns {string}
   */
  static toDateString(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Calculate the difference in calendar days between two date strings.
   * Returns a positive integer.
   * @param {string} dateStrA - YYYY-MM-DD
   * @param {string} dateStrB - YYYY-MM-DD
   * @returns {number}
   */
  static daysBetween(dateStrA, dateStrB) {
    const a = new Date(dateStrA + 'T00:00:00');
    const b = new Date(dateStrB + 'T00:00:00');
    return Math.round(Math.abs(b - a) / 86400000);
  }

  /**
   * Record a session completion and update the streak.
   * Handles all streak logic:
   *   - Same day: no change
   *   - Next day: increment streak
   *   - Skipped days: reset streak to 1
   *
   * @returns {{ currentStreak, longestStreak, lastCompletedDate, justExtended }}
   */
  static recordCompletion() {
    const data = StreakStorage.getStreakData();
    const today = this.toDateString(new Date());

    // Already completed a session today — do not double-count
    if (data.lastCompletedDate === today) {
      return { ...data, justExtended: false };
    }

    let newStreak;

    if (!data.lastCompletedDate) {
      // First ever session
      newStreak = 1;
    } else {
      const gap = this.daysBetween(data.lastCompletedDate, today);

      if (gap === 1) {
        // Consecutive day — extend streak
        newStreak = data.currentStreak + 1;
      } else {
        // Skipped one or more days — reset
        newStreak = 1;
      }
    }

    // Update longest if needed
    const newLongest = Math.max(data.longestStreak, newStreak);

    const updated = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastCompletedDate: today,
    };

    StreakStorage.setStreakData(updated);

    return { ...updated, justExtended: true };
  }

  /**
   * Get the current streak state, accounting for broken streaks
   * that haven't been recorded yet.
   * If today is more than 1 day after lastCompletedDate,
   * the streak should display as 0 (broken).
   * @returns {{ currentStreak, longestStreak, lastCompletedDate, isActive }}
   */
  static getCurrentState() {
    const data = StreakStorage.getStreakData();
    const today = this.toDateString(new Date());

    if (!data.lastCompletedDate) {
      return { currentStreak: 0, longestStreak: 0, lastCompletedDate: null, isActive: false };
    }

    // If last session was today, streak is active
    if (data.lastCompletedDate === today) {
      return { ...data, isActive: true };
    }

    const gap = this.daysBetween(data.lastCompletedDate, today);

    if (gap === 1) {
      // Yesterday — streak is still alive but not yet recorded today
      return { ...data, isActive: true };
    }

    // Streak is broken (gap > 1)
    return {
      currentStreak: 0,
      longestStreak: data.longestStreak,
      lastCompletedDate: data.lastCompletedDate,
      isActive: false,
    };
  }

  /**
   * Build the weekly activity map for the streak bar display.
   * Returns an array of 7 booleans (Mon–Sun) for the current week.
   * @returns {boolean[]}
   */
  static getWeekActivity() {
    const sessions = SessionStorage.getSessions();
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon, ...
    // Calculate Monday of the current week
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    // Create set of active dates this week
    const activeDates = new Set();
    sessions.forEach((s) => {
      const d = new Date(s.completedAt);
      if (d >= monday) {
        activeDates.add(this.toDateString(d));
      }
    });

    // Build Mon–Sun array
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(activeDates.has(this.toDateString(d)));
    }

    return week;
  }
}
