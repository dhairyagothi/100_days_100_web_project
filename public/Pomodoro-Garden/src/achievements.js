/**
 * achievements.js — milestone tracker with toast notifications.
 */

import { on } from './bus.js';
import { storage } from './storage.js';

const ACHIEVEMENTS = [
    { id: 'first-bloom',     label: 'First Bloom',           hint: 'Complete your first focus session',         check: s => s.totalSessions >= 1 },
    { id: 'sapling',         label: 'Sapling',               hint: 'Complete 10 focus sessions',                check: s => s.totalSessions >= 10 },
    { id: 'grove',           label: 'Grove',                 hint: 'Complete 50 focus sessions',                check: s => s.totalSessions >= 50 },
    { id: 'arboretum',       label: 'Arboretum',             hint: 'Complete 200 focus sessions',               check: s => s.totalSessions >= 200 },

    { id: 'week-warrior',    label: 'Seven-Day Streak',      hint: 'Focus 7 days in a row',                     check: s => s.currentStreak >= 7 },
    { id: 'month-master',    label: 'Thirty-Day Streak',     hint: 'Focus 30 days in a row',                    check: s => s.currentStreak >= 30 },

    { id: 'deep-diver',      label: 'Deep Diver',            hint: 'Accumulate 10 hours of focus',              check: s => s.totalFocusedSec >= 36000 },
    { id: 'master-gardener', label: 'Master Gardener',       hint: 'Accumulate 100 hours of focus',             check: s => s.totalFocusedSec >= 360000 },

    { id: 'early-bird',      label: 'Early Bird',            hint: 'Focus before 7 AM',                         time: 'early' },
    { id: 'night-owl',       label: 'Night Owl',             hint: 'Focus after 11 PM',                         time: 'late'  },
];

const TOAST_DURATION = 3600;

export class Achievements {
    constructor(analytics) {
        this.analytics = analytics;
        this.unlocked = new Set();
        this.toastEl = document.getElementById('toast');
        this._toastTimeout = null;

        on('session:complete', (payload) => {
            if (payload.kind === 'focus') this.evaluate(payload);
        });
    }

    async load() {
        const stored = await storage.get('achievements');
        if (stored?.unlocked) this.unlocked = new Set(stored.unlocked);
    }

    async _persist() {
        await storage.set('achievements', { unlocked: [...this.unlocked] });
    }

    evaluate(payload) {
        const stats = this.analytics.stats;
        const hour = new Date(payload.completedAt).getHours();

        for (const a of ACHIEVEMENTS) {
            if (this.unlocked.has(a.id)) continue;
            let earned = false;
            if (a.check)  earned = a.check(stats);
            if (a.time === 'early' && hour < 7) earned = true;
            if (a.time === 'late'  && hour >= 23) earned = true;
            if (earned) this.unlock(a);
        }
    }

    unlock(achievement) {
        this.unlocked.add(achievement.id);
        this._persist();
        this.showToast(achievement);
    }

    showToast(achievement) {
        if (!this.toastEl) return;
        clearTimeout(this._toastTimeout);
        this.toastEl.innerHTML = `
            <span class="toast__icon">✦</span>
            <span><strong>${achievement.label}</strong> — ${achievement.hint}</span>
        `;
        this.toastEl.hidden = false;
        this._toastTimeout = setTimeout(() => {
            this.toastEl.hidden = true;
        }, TOAST_DURATION);
    }

    async wipe() {
        this.unlocked.clear();
        await this._persist();
    }
}