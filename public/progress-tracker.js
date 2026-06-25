// ============================================
// PROGRESS TRACKER - Interactive Learning Dashboard
// Issue #8861 - GSSoC'26
// ============================================

const ProgressTracker = {
  // ── State ──
  completedProjects: new Set(),
  achievements: [],
  streak: 0,
  lastVisit: null,

  // ── Initialize ──
  init() {
    this.loadFromStorage();
    this.render();
    this.setupEventListeners();
    console.log('📊 Progress Tracker initialized!');
  },

  // ── Storage ──
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('progress-tracker');
      if (saved) {
        const data = JSON.parse(saved);
        this.completedProjects = new Set(data.completed || []);
        this.achievements = data.achievements || [];
        this.streak = data.streak || 0;
        this.lastVisit = data.lastVisit || null;
        this.updateStreak();
      }
    } catch (e) {
      console.warn('Failed to load progress:', e);
    }
  },

  saveToStorage() {
    try {
      localStorage.setItem('progress-tracker', JSON.stringify({
        completed: Array.from(this.completedProjects),
        achievements: this.achievements,
        streak: this.streak,
        lastVisit: this.lastVisit
      }));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  },

  // ── Streak Logic ──
  updateStreak() {
    const today = new Date().toDateString();
    if (!this.lastVisit) {
      this.streak = 1;
    } else if (this.lastVisit === today) {
      // Same day, no change
      return;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (this.lastVisit === yesterday.toDateString()) {
        this.streak += 1;
      } else {
        this.streak = 1;
      }
    }
    this.lastVisit = today;
    this.saveToStorage();
  },

  // ── Toggle Project Completion ──
  toggleProject(projectId) {
    if (this.completedProjects.has(projectId)) {
      this.completedProjects.delete(projectId);
    } else {
      this.completedProjects.add(projectId);
      this.checkAchievements();
    }
    this.saveToStorage();
    this.render();
  },

  // ── Achievements ──
  checkAchievements() {
    const count = this.completedProjects.size;
    const newAchievements = [];

    const milestones = [
      { id: 'first', name: '🌟 First Project', count: 1 },
      { id: 'ten', name: '🎯 10 Projects', count: 10 },
      { id: 'twentyfive', name: '💎 25 Projects', count: 25 },
      { id: 'fifty', name: '🏆 50 Projects', count: 50 },
      { id: 'hundred', name: '👑 100 Projects', count: 100 },
      { id: 'all', name: '🌟 All Projects', count: 218 }
    ];

    milestones.forEach(milestone => {
      if (count >= milestone.count && !this.achievements.includes(milestone.id)) {
        this.achievements.push(milestone.id);
        newAchievements.push(milestone);
        this.showAchievementToast(milestone);
      }
    });

    if (newAchievements.length > 0) {
      this.saveToStorage();
    }
  },

  showAchievementToast(achievement) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="achievement-icon">${achievement.name.split(' ')[0]}</div>
      <div class="achievement-text">
        <strong>🏅 Achievement Unlocked!</strong>
        <span>${achievement.name}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => toast.remove(), 5000);
  },

  // ── Render Dashboard ──
  render() {
    const container = document.getElementById('progress-dashboard');
    if (!container) return;

    const total = 218;
    const completed = this.completedProjects.size;
    const percentage = Math.round((completed / total) * 100);

    container.innerHTML = `
      <div class="progress-dashboard">
        <!-- Header -->
        <div class="dashboard-header">
          <h2>📊 Your Progress</h2>
          <div class="streak-badge">🔥 ${this.streak} day streak</div>
        </div>

        <!-- Overall Progress -->
        <div class="progress-overall">
          <div class="progress-ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#1a1a2e" stroke-width="8"/>
              <circle cx="60" cy="60" r="54" fill="none" stroke="#6366f1" stroke-width="8"
                stroke-dasharray="339.292" stroke-dashoffset="${339.292 - (percentage / 100) * 339.292}"
                stroke-linecap="round"
                transform="rotate(-90 60 60)"/>
            </svg>
            <div class="progress-stats">
              <span class="stats-number">${completed}</span>
              <span class="stats-label">/${total} done</span>
            </div>
          </div>
          <div class="progress-percentage">${percentage}% Complete</div>
        </div>

        <!-- Category Breakdown -->
        <div class="category-breakdown">
          <h3>📂 By Category</h3>
          ${this.renderCategories()}
        </div>

        <!-- Achievements -->
        <div class="achievements-section">
          <h3>🏅 Achievements</h3>
          <div class="achievement-grid">
            ${this.renderAchievements()}
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="recent-activity">
          <h3>📈 Recent Activity</h3>
          <div class="activity-heatmap">
            ${this.renderHeatmap()}
          </div>
        </div>
      </div>
    `;

    this.attachProjectListeners();
  },

  renderCategories() {
    // This would need projects.json data - simplified version
    const categories = {
      'Tool': { completed: 0, total: 87 },
      'Game': { completed: 0, total: 66 },
      'UI': { completed: 0, total: 29 },
      'Website': { completed: 0, total: 24 },
      'API': { completed: 0, total: 18 },
      'AI': { completed: 0, total: 13 }
    };

    // In real implementation, iterate through projects.json
    // For now, show placeholder
    return Object.entries(categories).map(([name, data]) => `
      <div class="category-item">
        <span class="category-name">${name}</span>
        <div class="category-bar">
          <div class="category-fill" style="width: ${(data.completed / data.total) * 100}%"></div>
        </div>
        <span class="category-count">${data.completed}/${data.total}</span>
      </div>
    `).join('');
  },

  renderAchievements() {
    const allAchievements = [
      { id: 'first', name: '🌟 First Project', icon: '🌟' },
      { id: 'ten', name: '🎯 10 Projects', icon: '🎯' },
      { id: 'twentyfive', name: '💎 25 Projects', icon: '💎' },
      { id: 'fifty', name: '🏆 50 Projects', icon: '🏆' },
      { id: 'hundred', name: '👑 100 Projects', icon: '👑' },
      { id: 'all', name: '🌟 All Projects', icon: '🌟' }
    ];

    return allAchievements.map(ach => `
      <div class="achievement-card ${this.achievements.includes(ach.id) ? 'unlocked' : 'locked'}">
        <span class="achievement-icon">${ach.icon}</span>
        <span class="achievement-name">${ach.name}</span>
        ${this.achievements.includes(ach.id) ? '<span class="achievement-check">✅</span>' : '<span class="achievement-lock">🔒</span>'}
      </div>
    `).join('');
  },

  renderHeatmap() {
    // Simplified heatmap - 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activity = [3, 5, 2, 7, 4, 1, 0];
    return days.map((day, i) => `
      <div class="heatmap-day">
        <span class="day-label">${day}</span>
        <span class="day-activity" style="opacity: ${activity[i] / 7}">${activity[i]}</span>
      </div>
    `).join('');
  },

  attachProjectListeners() {
    document.querySelectorAll('.project-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.projectId;
        if (id) this.toggleProject(id);
      });
    });
  },

  setupEventListeners() {
    // Auto-save on page unload
    window.addEventListener('beforeunload', () => this.saveToStorage());
  }
};

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
  ProgressTracker.init();
});

// ── Export for external use ──
window.ProgressTracker = ProgressTracker;