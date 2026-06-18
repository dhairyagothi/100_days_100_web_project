// src/utils/streakEngine.js

/**
 * Format a Date object as "YYYY-MM-DD" in LOCAL time (not UTC).
 * toISOString() always returns UTC which is wrong in IST (+5:30).
 */
function localDateStr(date) {
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  );
}

/**
 * Given an activity map { "YYYY-MM-DD": count }, compute current streak
 */
export function computeStreak(activityDates) {
  const dates = Object.keys(activityDates).sort().reverse();
  if (dates.length === 0) return 0;

  const today = localDateStr(new Date());
  const yesterday = localDateStr(new Date(Date.now() - 86400000));

  // streak must include today or yesterday
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 0;
  let current = new Date(dates[0] + 'T00:00:00'); // parse as local midnight
  const dateSet = new Set(dates);

  while (true) {
    const dateStr = localDateStr(current);
    if (dateSet.has(dateStr)) {
      streak++;
      current = new Date(current.getTime() - 86400000);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Generate 52 weeks × 7 days of data for GitHub-style heatmap
 */
export function generateHeatmapData(activityDates) {
  const weeks = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from 52 weeks ago, on a Sunday
  const start = new Date(today);
  start.setDate(start.getDate() - 52 * 7 - start.getDay());

  let current = new Date(start);
  let week = [];

  while (current <= today) {
    const dateStr = localDateStr(current); // use local time, not UTC
    const count = activityDates[dateStr] || 0;
    week.push({ date: dateStr, count });

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    current = new Date(current.getTime() + 86400000);
  }

  if (week.length > 0) weeks.push(week);
  return weeks;
}

/**
 * Map count to intensity level 0-4
 */
export function getIntensity(count) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

/**
 * Get month labels for heatmap header
 */
export function getMonthLabels(weeks) {
  const labels = [];
  let lastMonth = -1;

  weeks.forEach((week, i) => {
    const date = new Date(week[0].date);
    const month = date.getMonth();
    if (month !== lastMonth) {
      labels.push({ index: i, label: date.toLocaleString('default', { month: 'short' }) });
      lastMonth = month;
    }
  });

  return labels;
}
