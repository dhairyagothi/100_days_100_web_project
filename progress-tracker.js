/**
 * Learner Progress Tracker with Certificates - Issue #8783
 * Tracks completion, generates certificates, and builds portfolio
 */

class ProgressTracker {
  constructor(username = 'Learner') {
    this.username = username;
    this.completedProjects = this.loadCompletedProjects();
    this.certificates = this.loadCertificates();
    this.portfolioItems = this.loadPortfolioItems();
    this.streaks = this.calculateStreaks();
  }

  /**
   * Mark project as completed
   */
  completeProject(projectDay, metadata = {}) {
    const completion = {
      projectDay: parseInt(projectDay),
      completedAt: Date.now(),
      timeSpent: metadata.timeSpent || 0,
      difficulty: metadata.difficulty || 'unknown',
      rating: metadata.rating || 0,
      notes: metadata.notes || '',
      screenshot: metadata.screenshot || null,
    };

    this.completedProjects.push(completion);
    this.sortCompletions();
    this.saveCompletedProjects();

    return this.checkForMilestones();
  }

  /**
   * Sort completed projects by day
   */
  sortCompletions() {
    this.completedProjects.sort((a, b) => a.projectDay - b.projectDay);
  }

  /**
   * Check for milestone achievements
   */
  checkForMilestones() {
    const milestones = [];
    const count = this.completedProjects.length;

    if (count === 10) milestones.push({ name: 'First 10', badge: 'ten' });
    if (count === 25) milestones.push({ name: 'Quarter Done', badge: 'quarter' });
    if (count === 50) milestones.push({ name: 'Halfway', badge: 'halfway' });
    if (count === 75) milestones.push({ name: 'Three Quarters', badge: 'three-quarters' });
    if (count === 100) milestones.push({ name: 'Century', badge: 'century' });

    if (milestones.length > 0) {
      this.generateCertificates(milestones);
    }

    return milestones;
  }

  /**
   * Generate completion certificate
   */
  generateCertificates(milestones) {
    milestones.forEach((milestone) => {
      if (!this.certificates.find((c) => c.badge === milestone.badge)) {
        const cert = {
          id: this.generateCertId(),
          name: milestone.name,
          badge: milestone.badge,
          earnedAt: Date.now(),
          projectsCompleted: this.completedProjects.length,
          verificatonCode: this.generateVerificationCode(),
        };
        this.certificates.push(cert);
      }
    });
    this.saveCertificates();
  }

  /**
   * Get progress percentage
   */
  getProgressPercentage(total = 100) {
    return ((this.completedProjects.length / total) * 100).toFixed(1);
  }

  /**
   * Get completion statistics
   */
  getStatistics() {
    const totalCompleted = this.completedProjects.length;
    const avgRating =
      totalCompleted > 0
        ? (this.completedProjects.reduce((sum, p) => sum + p.rating, 0) /
            totalCompleted)
          .toFixed(2)
        : 0;

    const totalTime = this.completedProjects.reduce(
      (sum, p) => sum + (p.timeSpent || 0),
      0
    );

    const byDifficulty = {
      beginner: this.completedProjects.filter((p) => p.difficulty === 'beginner')
        .length,
      intermediate: this.completedProjects.filter(
        (p) => p.difficulty === 'intermediate'
      ).length,
      advanced: this.completedProjects.filter((p) => p.difficulty === 'advanced')
        .length,
    };

    return {
      totalCompleted,
      avgRating,
      totalTimeSpent: this.formatTime(totalTime),
      byDifficulty,
      certificates: this.certificates.length,
      currentStreak: this.streaks.current || 0,
      longestStreak: this.streaks.longest || 0,
    };
  }

  /**
   * Format time in hours and minutes
   */
  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Calculate completion streaks
   */
  calculateStreaks() {
    if (this.completedProjects.length === 0) {
      return { current: 0, longest: 0 };
    }

    const days = this.completedProjects.map((p) => p.projectDay);
    let current = 1;
    let longest = 1;

    for (let i = 1; i < days.length; i++) {
      if (days[i] === days[i - 1] + 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }

    return { current, longest };
  }

  /**
   * Add item to portfolio
   */
  addPortfolioItem(projectDay, itemData) {
    const item = {
      id: this.generateItemId(),
      projectDay,
      title: itemData.title || 'Untitled Project',
      description: itemData.description || '',
      liveUrl: itemData.liveUrl || null,
      sourceUrl: itemData.sourceUrl || null,
      technologies: itemData.technologies || [],
      screenshot: itemData.screenshot || null,
      addedAt: Date.now(),
      featured: itemData.featured || false,
    };

    this.portfolioItems.push(item);
    this.savePortfolioItems();
    return item;
  }

  /**
   * Get portfolio items
   */
  getPortfolioItems(limit = null) {
    let items = this.portfolioItems.sort((a, b) => b.addedAt - a.addedAt);
    if (limit) items = items.slice(0, limit);
    return items;
  }

  /**
   * Get featured portfolio items
   */
  getFeaturedProjects() {
    return this.portfolioItems.filter((item) => item.featured);
  }

  /**
   * Export portfolio as JSON
   */
  exportPortfolio() {
    return {
      username: this.username,
      exportedAt: new Date().toISOString(),
      statistics: this.getStatistics(),
      completedProjects: this.completedProjects,
      certificates: this.certificates,
      portfolio: this.portfolioItems,
    };
  }

  /**
   * Get certificates
   */
  getCertificates() {
    return this.certificates.sort((a, b) => b.earnedAt - a.earnedAt);
  }

  /**
   * Generate certificate HTML for download
   */
  generateCertificateHTML(certificateId) {
    const cert = this.certificates.find((c) => c.id === certificateId);
    if (!cert) return null;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${cert.name}</title>
        <style>
          body { font-family: Georgia, serif; margin: 0; padding: 20px; }
          .certificate {
            border: 3px solid #2196F3;
            padding: 40px;
            max-width: 800px;
            margin: 20px auto;
            text-align: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          h1 { color: #2196F3; margin: 20px 0; }
          .achievement { font-size: 24px; margin: 20px 0; }
          .details { margin-top: 30px; color: #555; }
          .signature { margin-top: 40px; }
          .code { font-family: monospace; color: #2196F3; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>Certificate of Achievement</h1>
          <div class="achievement">${cert.name}</div>
          <p>This certifies that <strong>${this.username}</strong></p>
          <p>has successfully completed <strong>${cert.projectsCompleted} projects</strong></p>
          <div class="details">
            <p>Earned on ${new Date(cert.earnedAt).toLocaleDateString()}</p>
            <p class="code">Verification Code: ${cert.verificatonCode}</p>
          </div>
          <div class="signature">
            <p>100 Days 100 Web Projects</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Generate completion badge
   */
  generateCompletionBadge() {
    const percentage = this.getProgressPercentage();
    return {
      percentage,
      level:
        percentage >= 100
          ? 'Master'
          : percentage >= 75
          ? 'Advanced'
          : percentage >= 50
          ? 'Intermediate'
          : 'Beginner',
      nextMilestone:
        Math.ceil(this.completedProjects.length / 10) * 10,
    };
  }

  /**
   * Generate unique certificate ID
   */
  generateCertId() {
    return `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique item ID
   */
  generateItemId() {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate verification code
   */
  generateVerificationCode() {
    return Math.random().toString(36).substr(2, 12).toUpperCase();
  }

  /**
   * Persistence: Load completed projects
   */
  loadCompletedProjects() {
    try {
      const stored = localStorage.getItem('completedProjects');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Persistence: Save completed projects
   */
  saveCompletedProjects() {
    try {
      localStorage.setItem(
        'completedProjects',
        JSON.stringify(this.completedProjects)
      );
    } catch (e) {
      console.warn('Failed to save completed projects:', e);
    }
  }

  /**
   * Persistence: Load certificates
   */
  loadCertificates() {
    try {
      const stored = localStorage.getItem('certificates');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Persistence: Save certificates
   */
  saveCertificates() {
    try {
      localStorage.setItem('certificates', JSON.stringify(this.certificates));
    } catch (e) {
      console.warn('Failed to save certificates:', e);
    }
  }

  /**
   * Persistence: Load portfolio items
   */
  loadPortfolioItems() {
    try {
      const stored = localStorage.getItem('portfolioItems');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Persistence: Save portfolio items
   */
  savePortfolioItems() {
    try {
      localStorage.setItem('portfolioItems', JSON.stringify(this.portfolioItems));
    } catch (e) {
      console.warn('Failed to save portfolio items:', e);
    }
  }
}

/**
 * Render progress dashboard
 */
function renderProgressDashboard(containerId, progressTracker) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const stats = progressTracker.getStatistics();
  const badge = progressTracker.generateCompletionBadge();

  const html = `
    <div class="progress-dashboard">
      <div class="progress-header">
        <h2>Your Progress: ${progressTracker.username}</h2>
        <div class="level-badge">
          <h3>${badge.level}</h3>
          <p>${badge.percentage}%</p>
        </div>
      </div>

      <div class="progress-bar">
        <div class="bar-fill" style="width: ${badge.percentage}%"></div>
      </div>

      <div class="statistics-grid">
        <div class="stat-box">
          <h4>${stats.totalCompleted}</h4>
          <p>Projects Completed</p>
        </div>
        <div class="stat-box">
          <h4>${stats.avgRating}</h4>
          <p>Average Rating</p>
        </div>
        <div class="stat-box">
          <h4>${stats.totalTimeSpent}</h4>
          <p>Total Time</p>
        </div>
        <div class="stat-box">
          <h4>${stats.currentStreak}</h4>
          <p>Current Streak</p>
        </div>
      </div>

      <div class="difficulty-breakdown">
        <h3>Completion by Difficulty</h3>
        <div class="breakdown-bars">
          <div class="breakdown">
            <label>Beginner</label>
            <div class="bar">
              <div class="fill" style="width: ${(stats.byDifficulty.beginner / stats.totalCompleted) * 100}%"></div>
            </div>
            <span>${stats.byDifficulty.beginner}</span>
          </div>
          <div class="breakdown">
            <label>Intermediate</label>
            <div class="bar">
              <div class="fill" style="width: ${(stats.byDifficulty.intermediate / stats.totalCompleted) * 100}%"></div>
            </div>
            <span>${stats.byDifficulty.intermediate}</span>
          </div>
          <div class="breakdown">
            <label>Advanced</label>
            <div class="bar">
              <div class="fill" style="width: ${(stats.byDifficulty.advanced / stats.totalCompleted) * 100}%"></div>
            </div>
            <span>${stats.byDifficulty.advanced}</span>
          </div>
        </div>
      </div>

      <div class="certificates-section">
        <h3>Certificates (${stats.certificates})</h3>
        <div class="certificates-list">
          ${progressTracker.getCertificates().map((cert) => `
            <div class="certificate-card">
              <h5>${cert.name}</h5>
              <p>${new Date(cert.earnedAt).toLocaleDateString()}</p>
              <button class="download-cert" data-id="${cert.id}">Download</button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="portfolio-section">
        <h3>Portfolio (${progressTracker.getPortfolioItems().length})</h3>
        <button class="export-portfolio">Export Portfolio</button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelectorAll('.download-cert').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const certId = e.target.dataset.id;
      const html = progressTracker.generateCertificateHTML(certId);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certId}.html`;
      a.click();
    });
  });

  container.querySelector('.export-portfolio').addEventListener('click', () => {
    const portfolio = progressTracker.exportPortfolio();
    const json = JSON.stringify(portfolio, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${progressTracker.username}.json`;
    a.click();
  });
}

// Auto-initialize
window.progressTracker = new ProgressTracker('Your Name');
