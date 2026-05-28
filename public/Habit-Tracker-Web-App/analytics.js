/**
 * analytics.js — Habit Tracker Analytics Dashboard
 *
 * Reads habits from localStorage and renders:
 *  1. Summary stat cards
 *  2. 16-week completion heatmap (all habits combined)
 *  3. Per-habit completion rate bars (last 30 days)
 *  4. Current vs. best streak comparison chart
 *  5. Per-habit 12-week mini heatmaps
 *
 * Works with existing habit data via streak-based approximation,
 * and improves progressively once completionHistory tracking is added
 * to script.js (see CONTRIBUTING_CHANGES.md for the diff).
 */

'use strict';

// ── Utilities ──────────────────────────────────────────────────────────────

/** Returns YYYY-MM-DD string adjusted for local timezone. */
function formatDate(d) {
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().split('T')[0];
}

function getTodayString() {
  return formatDate(new Date());
}

/** Safely load habits array from localStorage. */
function getHabits() {
  try {
    return JSON.parse(localStorage.getItem('habits')) || [];
  } catch {
    return [];
  }
}

/**
 * Returns an array of YYYY-MM-DD strings for when this habit was completed.
 *
 * Priority:
 *  1. Real history (completionHistory field, added by the updated script.js)
 *  2. Approximate history reconstructed from streak + lastCompleted
 *     — Works for existing data, becomes accurate after script.js update.
 */
function getHistory(habit) {
  if (Array.isArray(habit.completionHistory) && habit.completionHistory.length > 0) {
    return habit.completionHistory;
  }
  // Fallback: approximate N consecutive days ending at lastCompleted
  if (!habit.lastCompleted || !(habit.streak > 0)) return [];
  const history = [];
  const anchor = new Date(habit.lastCompleted + 'T12:00:00');
  for (let i = 0; i < habit.streak; i++) {
    const d = new Date(anchor);
    d.setDate(d.getDate() - i);
    history.push(formatDate(d));
  }
  return history;
}

/**
 * Percentage of the last 30 days on which the habit was completed.
 */
function calcCompletionRate(habit) {
  const historySet = new Set(getHistory(habit));
  const today = new Date();
  const WINDOW = 30;
  let hits = 0;
  for (let i = 0; i < WINDOW; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (historySet.has(formatDate(d))) hits++;
  }
  return Math.round((hits / WINDOW) * 100);
}

// ── Heatmap colour tables ──────────────────────────────────────────────────

const HEAT_DARK  = ['#161a2e', '#2d2a6a', '#4a44b0', '#7c6af7', '#a78bfa'];
const HEAT_LIGHT = ['#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0'];

function getHeatColors() {
  return document.body.classList.contains('light') ? HEAT_LIGHT : HEAT_DARK;
}

function heatColor(count, maxHabits, colors) {
  if (count === 0) return colors[0];
  const ratio = count / Math.max(maxHabits, 1);
  const idx = Math.min(Math.ceil(ratio * 4), 4);
  return colors[idx];
}

// ── SVG helpers ────────────────────────────────────────────────────────────

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function svgText(content, attrs = {}) {
  const el = svgEl('text', attrs);
  el.textContent = content;
  return el;
}

// ── 1. Summary Cards ───────────────────────────────────────────────────────

function renderSummaryCards(habits) {
  document.getElementById('total-habits').textContent = habits.length;

  if (habits.length === 0) return;

  const rates = habits.map(calcCompletionRate);
  const avgRate = Math.round(rates.reduce((a, b) => a + b, 0) / rates.length);
  document.getElementById('avg-rate').textContent = avgRate + '%';

  const bestStreak = Math.max(...habits.map(h => h.maxStreak || 0));
  document.getElementById('best-streak').textContent = bestStreak > 0 ? bestStreak + 'd' : '0d';

  const active = habits.filter(h => (h.streak || 0) > 0).length;
  document.getElementById('active-streaks').textContent = active;
}

// ── 2. 16-week Heatmap (all habits) ───────────────────────────────────────

/** Build date → completion count map across all habits. */
function buildCompletionMap(habits) {
  const map = {};
  habits.forEach(h => {
    getHistory(h).forEach(date => {
      map[date] = (map[date] || 0) + 1;
    });
  });
  return map;
}

/**
 * Calculates the Monday that starts our heatmap window.
 * We go back WEEKS*7 days from today, then rewind to the nearest Monday.
 */
function getHeatmapStartDate(weeksBack) {
  const start = new Date();
  start.setDate(start.getDate() - weeksBack * 7 + 1);
  const dow = start.getDay(); // 0=Sun,1=Mon,...,6=Sat
  const rewind = dow === 0 ? 6 : dow - 1;
  start.setDate(start.getDate() - rewind);
  return start;
}

function buildHeatmapSVG(habits, weeks, cellSize, cellGap, isMini = false) {
  const LABEL_W  = isMini ? 0 : 26;
  const MONTH_H  = isMini ? 0 : 16;
  const MONO_FONT = 'JetBrains Mono, monospace';

  const svgW = LABEL_W + weeks * (cellSize + cellGap) - cellGap;
  const svgH = MONTH_H + 7 * (cellSize + cellGap) - cellGap;

  const svg = svgEl('svg', {
    viewBox: `0 0 ${svgW} ${svgH}`,
    width: svgW,
    height: svgH,
  });

  const today = new Date();
  const todayStr = getTodayString();
  const completionMap = isMini ? null : buildCompletionMap(habits);
  const historySet = isMini ? new Set(getHistory(habits)) : null; // 'habits' is single habit when mini
  const maxHabits = isMini ? 1 : habits.length;
  const colors = getHeatColors();
  const startDate = getHeatmapStartDate(weeks);

  // Day-of-week labels (full heatmap only)
  if (!isMini) {
    const dayLabels = ['M', '', 'W', '', 'F', '', 'S'];
    dayLabels.forEach((label, i) => {
      if (!label) return;
      svg.appendChild(svgText(label, {
        x: 0,
        y: MONTH_H + i * (cellSize + cellGap) + cellSize - 2,
        'font-size': '9',
        fill: '#64748b',
        'font-family': MONO_FONT,
      }));
    });
  }

  let prevMonth = -1;

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(cellDate.getDate() + w * 7 + d);
      if (cellDate > today) continue;

      const dateStr = formatDate(cellDate);

      // Month label — full heatmap only
      if (!isMini && d === 0 && cellDate.getMonth() !== prevMonth) {
        prevMonth = cellDate.getMonth();
        const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        svg.appendChild(svgText(MONTHS[cellDate.getMonth()], {
          x: LABEL_W + w * (cellSize + cellGap),
          y: MONTH_H - 4,
          'font-size': '9',
          fill: '#64748b',
          'font-family': MONO_FONT,
        }));
      }

      const count = isMini
        ? (historySet.has(dateStr) ? 1 : 0)
        : (completionMap[dateStr] || 0);

      const rect = svgEl('rect', {
        x: LABEL_W + w * (cellSize + cellGap),
        y: MONTH_H + d * (cellSize + cellGap),
        width: cellSize,
        height: cellSize,
        rx: 2,
        fill: heatColor(count, maxHabits, colors),
      });

      // Highlight today
      if (!isMini && dateStr === todayStr) {
        rect.setAttribute('stroke', '#818cf8');
        rect.setAttribute('stroke-width', '1.5');
      }

      // Native SVG tooltip
      const habitsLabel = isMini
        ? (count ? 'Completed' : 'Not completed')
        : `${count} of ${maxHabits} habit${maxHabits !== 1 ? 's' : ''} completed`;
      const tip = svgEl('title');
      tip.textContent = `${dateStr}: ${habitsLabel}`;
      rect.appendChild(tip);

      svg.appendChild(rect);
    }
  }

  return svg;
}

function renderHeatmap(habits) {
  const container = document.getElementById('heatmap-container');
  container.innerHTML = '';
  container.appendChild(buildHeatmapSVG(habits, 16, 13, 3));

  // Legend cells
  const legendContainer = document.getElementById('legend-cells');
  legendContainer.innerHTML = '';
  getHeatColors().forEach(color => {
    const cell = document.createElement('div');
    cell.className = 'legend-cell';
    cell.style.background = color;
    legendContainer.appendChild(cell);
  });
}

// ── 3. Completion Rate Bars ────────────────────────────────────────────────

function renderCompletionRates(habits) {
  const container = document.getElementById('completion-rates');

  if (habits.length === 0) {
    container.innerHTML = '<p class="no-data">No habits tracked yet.</p>';
    return;
  }

  const sorted = habits
    .map(h => ({ name: h.name, rate: calcCompletionRate(h) }))
    .sort((a, b) => b.rate - a.rate);

  container.innerHTML = sorted.map(h => `
    <div class="rate-row">
      <span class="rate-name" title="${h.name}">${h.name}</span>
      <div class="rate-track">
        <div class="rate-fill" data-pct="${h.rate}"></div>
      </div>
      <span class="rate-pct">${h.rate}%</span>
    </div>
  `).join('');

  // Animate on next paint (width starts at 0 from CSS)
  requestAnimationFrame(() => {
    container.querySelectorAll('.rate-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  });
}

// ── 4. Streak Comparison Chart ────────────────────────────────────────────

function renderStreakChart(habits) {
  const container = document.getElementById('streak-chart');

  if (habits.length === 0) {
    container.innerHTML = '<p class="no-data">No habits tracked yet.</p>';
    return;
  }

  const sorted = [...habits].sort((a, b) => (b.maxStreak || 0) - (a.maxStreak || 0));
  const maxVal = Math.max(...sorted.map(h => h.maxStreak || 0), 1);

  container.innerHTML = sorted.map(h => {
    const current = h.streak || 0;
    const best    = h.maxStreak || 0;
    const currentPct = ((current / maxVal) * 100).toFixed(1);
    const bestPct    = ((best    / maxVal) * 100).toFixed(1);
    return `
      <div class="streak-row">
        <span class="streak-name">${h.name}</span>
        <div class="streak-bar-pair">
          <div class="streak-bar-row">
            <span class="streak-bar-label">Current</span>
            <div class="streak-track">
              <div class="streak-fill current" data-pct="${currentPct}"></div>
            </div>
            <span class="streak-val">${current}d</span>
          </div>
          <div class="streak-bar-row">
            <span class="streak-bar-label">Best</span>
            <div class="streak-track">
              <div class="streak-fill best" data-pct="${bestPct}"></div>
            </div>
            <span class="streak-val">${best}d</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  requestAnimationFrame(() => {
    container.querySelectorAll('.streak-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  });
}

// ── 5. Per-Habit Mini Heatmaps ────────────────────────────────────────────

function renderPerHabitHeatmaps(habits) {
  const container = document.getElementById('per-habit-heatmaps');

  if (habits.length === 0) {
    container.innerHTML = '<p class="no-data">No habits tracked yet.</p>';
    return;
  }

  container.innerHTML = '';

  habits.forEach(habit => {
    const item = document.createElement('div');
    item.className = 'habit-heatmap-item';

    const nameRow = document.createElement('div');
    nameRow.className = 'habit-heatmap-name';
    nameRow.innerHTML =
      habit.name +
      (habit.streak > 0
        ? ` <span class="habit-streak-badge">🔥 ${habit.streak}d streak</span>`
        : '');
    item.appendChild(nameRow);

    const scrollWrap = document.createElement('div');
    scrollWrap.className = 'mini-heatmap-scroll';
    // Pass the single habit's history; buildHeatmapSVG reads it as historySet
    scrollWrap.appendChild(buildHeatmapSVG(habit, 12, 11, 2, true));
    item.appendChild(scrollWrap);

    container.appendChild(item);
  });
}

// ── Theme ──────────────────────────────────────────────────────────────────

function initTheme() {
  // Analytics is dark by default; respect the saved preference
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.body.classList.add('light');

  const btn = document.getElementById('theme-toggle');
  btn.textContent = document.body.classList.contains('light') ? '🌙 Dark' : '☀️ Light';

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    btn.textContent = isLight ? '🌙 Dark' : '☀️ Light';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    // Re-render heatmaps so colours update
    const habits = getHabits();
    renderHeatmap(habits);
    renderPerHabitHeatmaps(habits);
  });
}

// ── Empty State (no habits at all) ────────────────────────────────────────

function renderEmptyState() {
  document.querySelector('.summary-cards').remove();
  document.querySelectorAll('.chart-section').forEach(s => s.remove());

  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.innerHTML = `
    <div class="empty-icon">📊</div>
    <h2>No habit data yet</h2>
    <p>
      Head back to the <a href="index.html">Habit Tracker</a> and add your first habit.<br>
      Your analytics will appear here as soon as you start logging.
    </p>
  `;
  document.querySelector('.dashboard').appendChild(empty);
}

// ── Init ───────────────────────────────────────────────────────────────────

function init() {
  initTheme();

  const habits = getHabits();

  if (habits.length === 0) {
    renderEmptyState();
    return;
  }

  renderSummaryCards(habits);
  renderHeatmap(habits);
  renderCompletionRates(habits);
  renderStreakChart(habits);
  renderPerHabitHeatmaps(habits);
}

init();