/**
 * Learner Progress Tracker Portfolio Integration - Issue #8784
 * Integrates progress tracking with portfolio building and sharing
 */

class PortfolioIntegration {
  constructor(progressTracker) {
    this.progressTracker = progressTracker;
    this.portfolioLinks = this.loadPortfolioLinks();
    this.sharedPortfolios = this.loadSharedPortfolios();
    this.portfolioCustomization = this.loadCustomization();
  }

  /**
   * Create portfolio link to learner profile
   */
  createPortfolioLink(projectDays = null) {
    const link = {
      id: this.generateLinkId(),
      createdAt: Date.now(),
      url: `/portfolio/${this.progressTracker.username.replace(/\s+/g, '-')}/${this.generateSlug()}`,
      isPublic: false,
      projects: projectDays || this.getAllCompletedProjectDays(),
      viewCount: 0,
      lastAccessedAt: null,
      customization: {
        title: this.progressTracker.username + ' Portfolio',
        bio: '',
        theme: 'light',
        showStats: true,
        showCertificates: true,
      },
    };

    this.portfolioLinks.push(link);
    this.savePortfolioLinks();
    return link;
  }

  /**
   * Get all completed project days
   */
  getAllCompletedProjectDays() {
    return this.progressTracker.completedProjects.map((p) => p.projectDay);
  }

  /**
   * Customize portfolio appearance
   */
  customizePortfolio(linkId, customizationData) {
    const link = this.portfolioLinks.find((l) => l.id === linkId);
    if (!link) return { success: false, error: 'Portfolio link not found' };

    link.customization = {
      ...link.customization,
      ...customizationData,
    };

    this.savePortfolioLinks();
    return { success: true, customization: link.customization };
  }

  /**
   * Share portfolio with specific individuals
   */
  sharePortfolio(linkId, email) {
    const link = this.portfolioLinks.find((l) => l.id === linkId);
    if (!link) return { success: false, error: 'Portfolio not found' };

    const shareRecord = {
      id: this.generateShareId(),
      linkId,
      sharedWith: email,
      sharedAt: Date.now(),
      accessCount: 0,
    };

    if (!this.sharedPortfolios[linkId]) {
      this.sharedPortfolios[linkId] = [];
    }

    this.sharedPortfolios[linkId].push(shareRecord);
    this.saveSharedPortfolios();

    return {
      success: true,
      shareLink: link.url,
      sharedWith: email,
    };
  }

  /**
   * Make portfolio publicly accessible
   */
  publishPortfolio(linkId) {
    const link = this.portfolioLinks.find((l) => l.id === linkId);
    if (!link) return { success: false, error: 'Portfolio not found' };

    link.isPublic = true;
    this.savePortfolioLinks();

    return {
      success: true,
      publicUrl: `https://yoursite.com${link.url}`,
      linkId,
    };
  }

  /**
   * Get portfolio view details
   */
  getPortfolioView(linkId) {
    const link = this.portfolioLinks.find((l) => l.id === linkId);
    if (!link) return null;

    link.viewCount += 1;
    link.lastAccessedAt = Date.now();

    const stats = this.progressTracker.getStatistics();
    const portfolio = this.progressTracker.getPortfolioItems();
    const certificates = this.progressTracker.getCertificates();

    return {
      username: this.progressTracker.username,
      customization: link.customization,
      statistics: stats,
      portfolio: portfolio.filter((p) => link.projects.includes(p.projectDay)),
      certificates,
      viewCount: link.viewCount,
      sharedWith: (this.sharedPortfolios[linkId] || []).length,
    };
  }

  /**
   * Track portfolio analytics
   */
  getPortfolioAnalytics(linkId) {
    const link = this.portfolioLinks.find((l) => l.id === linkId);
    if (!link) return null;

    const shares = this.sharedPortfolios[linkId] || [];

    return {
      linkId,
      totalViews: link.viewCount,
      totalShares: shares.length,
      createdAt: new Date(link.createdAt).toLocaleDateString(),
      lastAccessed: link.lastAccessedAt
        ? new Date(link.lastAccessedAt).toLocaleDateString()
        : 'Never',
      isPublic: link.isPublic,
      sharedWith: shares.map((s) => ({ email: s.sharedWith, accessCount: s.accessCount })),
    };
  }

  /**
   * Generate portfolio preview HTML
   */
  generatePortfolioHTML(linkId) {
    const view = this.getPortfolioView(linkId);
    if (!view) return null;

    const certificatesHTML = view.certificates
      .map(
        (c) =>
          `<div class="certificate">
            <h4>${c.name}</h4>
            <p>Earned on ${new Date(c.earnedAt).toLocaleDateString()}</p>
          </div>`
      )
      .join('');

    const projectsHTML = view.portfolio
      .map(
        (p) =>
          `<div class="portfolio-project">
            <h5>${p.title}</h5>
            <p>${p.description}</p>
            <div class="tech">
              ${p.technologies.map((t) => `<span>${t}</span>`).join('')}
            </div>
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank">Live Demo</a>` : ''}
            ${p.sourceUrl ? `<a href="${p.sourceUrl}" target="_blank">Source</a>` : ''}
          </div>`
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${view.username} - Portfolio</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; padding: 20px; }
          .container { max-width: 1000px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
          h1 { color: #2196F3; margin-bottom: 10px; }
          .bio { color: #666; margin-bottom: 20px; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
          .stat { background: #f9f9f9; padding: 15px; border-radius: 4px; text-align: center; }
          .stat h3 { color: #2196F3; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #333; margin-bottom: 15px; border-bottom: 2px solid #2196F3; padding-bottom: 10px; }
          .certificate { background: #f0f7ff; padding: 15px; margin: 10px 0; border-left: 4px solid #2196F3; border-radius: 4px; }
          .portfolio-project { background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 4px; }
          .tech { display: flex; flex-wrap: wrap; gap: 5px; margin: 10px 0; }
          .tech span { background: #e3f2fd; color: #2196F3; padding: 4px 8px; border-radius: 3px; font-size: 12px; }
          a { color: #2196F3; text-decoration: none; margin-right: 10px; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${view.username}</h1>
          ${view.customization.bio ? `<p class="bio">${view.customization.bio}</p>` : ''}

          ${
            view.customization.showStats
              ? `
            <div class="stats">
              <div class="stat">
                <h3>${view.statistics.totalCompleted}</h3>
                <p>Projects</p>
              </div>
              <div class="stat">
                <h3>${view.statistics.avgRating}</h3>
                <p>Avg Rating</p>
              </div>
              <div class="stat">
                <h3>${view.statistics.certificates}</h3>
                <p>Certificates</p>
              </div>
              <div class="stat">
                <h3>${view.statistics.currentStreak}</h3>
                <p>Streak</p>
              </div>
            </div>
          `
              : ''
          }

          ${
            view.customization.showCertificates && certificatesHTML
              ? `
            <div class="section">
              <h2>Certificates</h2>
              ${certificatesHTML}
            </div>
          `
              : ''
          }

          <div class="section">
            <h2>Featured Projects</h2>
            ${projectsHTML || '<p>No projects yet</p>'}
          </div>

          <div class="section" style="font-size: 12px; color: #999;">
            <p>Portfolio created on ${new Date(view.statistics.joinedAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Export portfolio with metadata
   */
  exportPortfolioWithMetadata(linkId) {
    const view = this.getPortfolioView(linkId);
    if (!view) return null;

    return {
      username: view.username,
      customization: view.customization,
      statistics: view.statistics,
      projects: view.portfolio,
      certificates: view.certificates,
      analytics: this.getPortfolioAnalytics(linkId),
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * Get portfolio links for learner
   */
  getPortfolioLinks() {
    return this.portfolioLinks;
  }

  /**
   * Delete portfolio link
   */
  deletePortfolioLink(linkId) {
    this.portfolioLinks = this.portfolioLinks.filter((l) => l.id !== linkId);
    delete this.sharedPortfolios[linkId];
    this.savePortfolioLinks();
    this.saveSharedPortfolios();
    return { success: true };
  }

  /**
   * Generate unique link ID
   */
  generateLinkId() {
    return `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate share ID
   */
  generateShareId() {
    return `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate URL slug
   */
  generateSlug() {
    return Math.random().toString(36).substr(2, 12).toLowerCase();
  }

  /**
   * Persistence: Load portfolio links
   */
  loadPortfolioLinks() {
    try {
      const stored = localStorage.getItem('portfolioLinks');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Persistence: Save portfolio links
   */
  savePortfolioLinks() {
    try {
      localStorage.setItem('portfolioLinks', JSON.stringify(this.portfolioLinks));
    } catch (e) {
      console.warn('Failed to save portfolio links:', e);
    }
  }

  /**
   * Persistence: Load shared portfolios
   */
  loadSharedPortfolios() {
    try {
      const stored = localStorage.getItem('sharedPortfolios');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Persistence: Save shared portfolios
   */
  saveSharedPortfolios() {
    try {
      localStorage.setItem('sharedPortfolios', JSON.stringify(this.sharedPortfolios));
    } catch (e) {
      console.warn('Failed to save shared portfolios:', e);
    }
  }

  /**
   * Persistence: Load customization
   */
  loadCustomization() {
    try {
      const stored = localStorage.getItem('portfolioCustomization');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Persistence: Save customization
   */
  saveCustomization() {
    try {
      localStorage.setItem(
        'portfolioCustomization',
        JSON.stringify(this.portfolioCustomization)
      );
    } catch (e) {
      console.warn('Failed to save customization:', e);
    }
  }
}

/**
 * Render portfolio management UI
 */
function renderPortfolioManager(containerId, portfolioIntegration) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const links = portfolioIntegration.getPortfolioLinks();

  const html = `
    <div class="portfolio-manager">
      <h2>Portfolio Management</h2>
      <button class="create-portfolio-btn">Create New Portfolio</button>

      <div class="portfolio-list">
        ${links
          .map(
            (link) => `
          <div class="portfolio-card">
            <h4>${link.customization.title}</h4>
            <p>Created: ${new Date(link.createdAt).toLocaleDateString()}</p>
            <div class="stats-small">
              <span>Views: ${link.viewCount}</span>
              <span>Public: ${link.isPublic ? 'Yes' : 'No'}</span>
            </div>
            <button class="view-btn" data-id="${link.id}">View</button>
            <button class="customize-btn" data-id="${link.id}">Customize</button>
            <button class="share-btn" data-id="${link.id}">Share</button>
            <button class="delete-btn" data-id="${link.id}">Delete</button>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelector('.create-portfolio-btn').addEventListener('click', () => {
    const link = portfolioIntegration.createPortfolioLink();
    alert('Portfolio created! Link: ' + link.url);
  });

  container.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const linkId = e.target.dataset.id;
      const view = portfolioIntegration.getPortfolioView(linkId);
      console.log('Portfolio View:', view);
    });
  });

  container.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const linkId = e.target.dataset.id;
      if (confirm('Delete this portfolio?')) {
        portfolioIntegration.deletePortfolioLink(linkId);
        btn.closest('.portfolio-card').remove();
      }
    });
  });
}

// Auto-initialize
window.portfolioIntegration = null;
