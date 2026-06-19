/**
 * Project Submission and Contributor Showcase System - Issue #8781
 * Enables users to submit project solutions and showcase contributor profiles
 */

class ProjectSubmissionManager {
  constructor() {
    this.submissions = this.loadSubmissions();
    this.contributors = this.loadContributors();
    this.validationRules = this.setupValidationRules();
  }

  /**
   * Submit a completed project solution
   */
  submitProject(projectDay, submissionData) {
    const validation = this.validateSubmission(projectDay, submissionData);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const submission = {
      id: this.generateSubmissionId(),
      projectDay,
      submittedAt: Date.now(),
      submittedBy: submissionData.username || 'Anonymous',
      sourceUrl: submissionData.sourceUrl,
      liveUrl: submissionData.liveUrl,
      description: submissionData.description,
      technologies: submissionData.technologies || [],
      screenshots: submissionData.screenshots || [],
      status: 'pending',
      approvalCount: 0,
      rejectionCount: 0,
    };

    if (!this.submissions[projectDay]) {
      this.submissions[projectDay] = [];
    }

    this.submissions[projectDay].push(submission);
    this.saveSubmissions();

    return { success: true, submissionId: submission.id, submission };
  }

  /**
   * Validate submission data against rules
   */
  validateSubmission(projectDay, data) {
    const errors = [];

    if (!data.username || data.username.trim().length < 2) {
      errors.push('Username must be at least 2 characters');
    }

    if (!data.sourceUrl || !this.isValidUrl(data.sourceUrl)) {
      errors.push('Valid GitHub or source repository URL required');
    }

    if (data.liveUrl && !this.isValidUrl(data.liveUrl)) {
      errors.push('Live URL must be valid if provided');
    }

    if (!data.description || data.description.trim().length < 20) {
      errors.push('Description must be at least 20 characters');
    }

    if (!Array.isArray(data.technologies) || data.technologies.length === 0) {
      errors.push('At least one technology must be specified');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Setup validation rules for different submission types
   */
  setupValidationRules() {
    return {
      sourceUrl: { pattern: /https?:\/\/(github\.com|gitlab\.com|bitbucket\.org)/, message: 'Use GitHub, GitLab, or Bitbucket' },
      description: { minLength: 20, maxLength: 500 },
      technologies: { minItems: 1, maxItems: 10 },
    };
  }

  /**
   * Check if URL is valid
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Approve or reject a submission
   */
  approveSubmission(submissionId, approverProfile) {
    const submission = this.findSubmission(submissionId);
    if (!submission) return { success: false, error: 'Submission not found' };

    submission.approvalCount += 1;

    if (submission.approvalCount >= 2) {
      submission.status = 'approved';
      this.addContributorProfile(submission, approverProfile);
    }

    this.saveSubmissions();
    return { success: true, submission };
  }

  /**
   * Reject a submission with feedback
   */
  rejectSubmission(submissionId, feedback) {
    const submission = this.findSubmission(submissionId);
    if (!submission) return { success: false, error: 'Submission not found' };

    submission.rejectionCount += 1;
    submission.rejectionFeedback = feedback;

    if (submission.rejectionCount >= 2) {
      submission.status = 'rejected';
    } else {
      submission.status = 'needs-revision';
    }

    this.saveSubmissions();
    return { success: true, submission };
  }

  /**
   * Add approved contributor to showcase
   */
  addContributorProfile(submission, profile) {
    const contributor = {
      id: this.generateContributorId(),
      username: submission.submittedBy,
      profileUrl: profile?.profileUrl || null,
      bio: profile?.bio || '',
      projects: [submission.projectDay],
      technologies: submission.technologies,
      submissions: 1,
      approvals: submission.approvalCount,
      joinedAt: Date.now(),
      badges: this.assignBadges(submission),
    };

    const existing = this.contributors.find((c) => c.username === contributor.username);
    if (existing) {
      existing.projects.push(submission.projectDay);
      existing.submissions += 1;
      existing.approvals += submission.approvalCount;
      existing.badges = this.assignBadges(submission, existing.badges);
    } else {
      this.contributors.push(contributor);
    }

    this.saveContributors();
  }

  /**
   * Assign achievement badges to contributors
   */
  assignBadges(submission, existingBadges = []) {
    const badges = [...existingBadges];

    if (submission.technologies.length >= 3) {
      this.addBadgeIfMissing(badges, 'polyglot');
    }

    if (submission.liveUrl) {
      this.addBadgeIfMissing(badges, 'live-demo');
    }

    const projectDay = parseInt(submission.projectDay);
    if (projectDay >= 50) {
      this.addBadgeIfMissing(badges, 'halfway');
    }
    if (projectDay >= 100) {
      this.addBadgeIfMissing(badges, 'century');
    }

    return badges;
  }

  /**
   * Helper to add badge if not already present
   */
  addBadgeIfMissing(badges, badgeName) {
    if (!badges.includes(badgeName)) {
      badges.push(badgeName);
    }
  }

  /**
   * Get submissions for a specific project
   */
  getProjectSubmissions(projectDay) {
    return this.submissions[projectDay] || [];
  }

  /**
   * Get approved submissions only
   */
  getApprovedSubmissions(projectDay) {
    return (this.submissions[projectDay] || []).filter((s) => s.status === 'approved');
  }

  /**
   * Get contributor profile
   */
  getContributorProfile(username) {
    return this.contributors.find((c) => c.username === username);
  }

  /**
   * Get leaderboard ranked by submission count
   */
  getLeaderboard(limit = 20) {
    return this.contributors
      .sort((a, b) => b.submissions - a.submissions || b.approvals - a.approvals)
      .slice(0, limit)
      .map((c, idx) => ({
        rank: idx + 1,
        ...c,
      }));
  }

  /**
   * Get contributors by badge
   */
  getContributorsByBadge(badge) {
    return this.contributors.filter((c) => c.badges.includes(badge));
  }

  /**
   * Get showcase statistics
   */
  getStatistics() {
    const totalSubmissions = Object.values(this.submissions).flat().length;
    const approvedSubmissions = Object.values(this.submissions)
      .flat()
      .filter((s) => s.status === 'approved').length;

    return {
      totalSubmissions,
      approvedSubmissions,
      approvalRate:
        totalSubmissions > 0 ? ((approvedSubmissions / totalSubmissions) * 100).toFixed(1) : 0,
      totalContributors: this.contributors.length,
      averageProjectsPerContributor:
        this.contributors.length > 0
          ? (this.contributors.reduce((sum, c) => sum + c.projects.length, 0) /
              this.contributors.length)
            .toFixed(1)
          : 0,
    };
  }

  /**
   * Find submission by ID
   */
  findSubmission(submissionId) {
    for (const daySubmissions of Object.values(this.submissions)) {
      const found = daySubmissions.find((s) => s.id === submissionId);
      if (found) return found;
    }
    return null;
  }

  /**
   * Generate unique submission ID
   */
  generateSubmissionId() {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique contributor ID
   */
  generateContributorId() {
    return `ctb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Persistence: Load submissions from localStorage
   */
  loadSubmissions() {
    try {
      const stored = localStorage.getItem('projectSubmissions');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Persistence: Save submissions to localStorage
   */
  saveSubmissions() {
    try {
      localStorage.setItem('projectSubmissions', JSON.stringify(this.submissions));
    } catch (e) {
      console.warn('Failed to save submissions:', e);
    }
  }

  /**
   * Persistence: Load contributors from localStorage
   */
  loadContributors() {
    try {
      const stored = localStorage.getItem('contributors');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Persistence: Save contributors to localStorage
   */
  saveContributors() {
    try {
      localStorage.setItem('contributors', JSON.stringify(this.contributors));
    } catch (e) {
      console.warn('Failed to save contributors:', e);
    }
  }
}

/**
 * Render submission form
 */
function renderSubmissionForm(containerId, projectDay, submissionManager) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const html = `
    <form class="submission-form" data-day="${projectDay}">
      <div class="form-group">
        <label>GitHub Username</label>
        <input type="text" name="username" placeholder="Your GitHub username" required>
      </div>
      <div class="form-group">
        <label>Source Repository URL</label>
        <input type="url" name="sourceUrl" placeholder="https://github.com/..." required>
      </div>
      <div class="form-group">
        <label>Live Demo URL (optional)</label>
        <input type="url" name="liveUrl" placeholder="https://yoursite.com">
      </div>
      <div class="form-group">
        <label>Project Description</label>
        <textarea name="description" placeholder="Describe your solution..." rows="4" required></textarea>
      </div>
      <div class="form-group">
        <label>Technologies Used</label>
        <input type="text" name="technologies" placeholder="JavaScript, React, CSS" required>
      </div>
      <button type="submit" class="submit-btn">Submit Project</button>
    </form>
  `;

  container.innerHTML = html;

  container.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      username: formData.get('username'),
      sourceUrl: formData.get('sourceUrl'),
      liveUrl: formData.get('liveUrl'),
      description: formData.get('description'),
      technologies: formData.get('technologies').split(',').map((t) => t.trim()),
    };

    const result = submissionManager.submitProject(projectDay, data);
    if (result.success) {
      alert('Project submitted successfully!');
      e.target.reset();
    } else {
      alert('Submission failed: ' + result.errors.join(', '));
    }
  });
}

/**
 * Render contributor showcase/leaderboard
 */
function renderContributorShowcase(containerId, submissionManager) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const leaderboard = submissionManager.getLeaderboard(15);
  const stats = submissionManager.getStatistics();

  const html = `
    <div class="contributor-showcase">
      <div class="showcase-stats">
        <div class="stat-card">
          <h4>${stats.totalContributors}</h4>
          <p>Contributors</p>
        </div>
        <div class="stat-card">
          <h4>${stats.totalSubmissions}</h4>
          <p>Projects Submitted</p>
        </div>
        <div class="stat-card">
          <h4>${stats.approvalRate}%</h4>
          <p>Approval Rate</p>
        </div>
      </div>

      <div class="leaderboard">
        <h3>Top Contributors</h3>
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Contributor</th>
              <th>Projects</th>
              <th>Badges</th>
            </tr>
          </thead>
          <tbody>
            ${leaderboard
              .map(
                (c) => `
              <tr>
                <td class="rank">#${c.rank}</td>
                <td class="username">${c.username}</td>
                <td class="count">${c.submissions}</td>
                <td class="badges">${c.badges.map((b) => `<span class="badge">${b}</span>`).join('')}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Auto-initialize
window.projectSubmissionManager = new ProjectSubmissionManager();
