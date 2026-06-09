/**
 * analytics.js — 90-day focus heatmap + stat computation.
 */

import { on } from './bus.js';
import { storage } from './storage.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS = 90;

function dateKey(date) {
    return date.toISOString().slice(0, 10);
}

export class Analytics {
    constructor() {
        this.history = {};
        this.stats = {
            totalSessions: 0,
            totalFocusedSec: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastSessionDay: null,
        };
        this.heatmapEl = document.getElementById('heatmap');
        this.statStreakEl = document.getElementById('statStreak');
        this.statTodayEl  = document.getElementById('statToday');
        this.statTotalEl  = document.getElementById('statTotal');

        on('session:complete', (payload) => {
            if (payload.kind === 'focus') {
                this.recordFocus(payload.duration);
            }
        });
    }

    async load() {
        const stored = await storage.get('analytics');
        if (stored) {
            this.history = stored.history || {};
            this.stats = { ...this.stats, ...stored.stats };
        }
        this._recomputeStreak();
        this.renderHeatmap();
        this.renderStats();
    }

    async _persist() {
        await storage.set('analytics', { history: this.history, stats: this.stats });
    }

    recordFocus(durationSec) {
        const today = dateKey(new Date());
        const entry = this.history[today] ||= { sessions: 0, focusedSec: 0 };
        entry.sessions += 1;
        entry.focusedSec += durationSec;

        this.stats.totalSessions += 1;
        this.stats.totalFocusedSec += durationSec;
        this.stats.lastSessionDay = today;
        this._recomputeStreak();

        this._persist();
        this.renderHeatmap();
        this.renderStats();
    }

    _recomputeStreak() {
        let streak = 0;
        const cursor = new Date();
        cursor.setHours(0, 0, 0, 0);

        if (!this.history[dateKey(cursor)]) {
            cursor.setTime(cursor.getTime() - DAY_MS);
        }
        while (this.history[dateKey(cursor)]?.sessions > 0) {
            streak += 1;
            cursor.setTime(cursor.getTime() - DAY_MS);
        }
        this.stats.currentStreak = streak;
        if (streak > this.stats.longestStreak) this.stats.longestStreak = streak;
    }

    _level(sessions) {
        if (sessions === 0) return 0;
        if (sessions <= 2) return 1;
        if (sessions <= 4) return 2;
        if (sessions <= 6) return 3;
        return 4;
    }

    renderHeatmap() {
        if (!this.heatmapEl) return;
        this.heatmapEl.innerHTML = '';
        const todayKey = dateKey(new Date());
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setTime(start.getTime() - (DAYS - 1) * DAY_MS);
        start.setTime(start.getTime() - start.getDay() * DAY_MS);

        const cells = [];
        const total = DAYS + 14;
        for (let i = 0; i < total; i++) {
            const d = new Date(start.getTime() + i * DAY_MS);
            if (d > new Date()) break;
            const key = dateKey(d);
            const entry = this.history[key];
            const level = this._level(entry?.sessions || 0);
            const cell = document.createElement('div');
            cell.className = 'hm-cell';
            cell.dataset.level = level;
            if (key === todayKey) cell.dataset.today = 'true';
            const sessions = entry?.sessions || 0;
            const mins = Math.round((entry?.focusedSec || 0) / 60);
            cell.title = `${key} · ${sessions} session${sessions !== 1 ? 's' : ''} · ${mins} min focused`;
            cells.push(cell);
        }
        cells.forEach(c => this.heatmapEl.appendChild(c));
    }

    renderStats() {
        if (this.statStreakEl) this.statStreakEl.textContent = this.stats.currentStreak;
        const today = this.history[dateKey(new Date())];
        if (this.statTodayEl)  this.statTodayEl.textContent = today?.sessions || 0;
        if (this.statTotalEl)  this.statTotalEl.textContent = (this.stats.totalFocusedSec / 3600).toFixed(1);
    }

    async wipe() {
        this.history = {};
        this.stats = { totalSessions: 0, totalFocusedSec: 0, currentStreak: 0, longestStreak: 0, lastSessionDay: null };
        await this._persist();
        this.renderHeatmap();
        this.renderStats();
    }
}