/**
 * Interactive Project Browser with Live Previews - Issue #8779
 * Provides source code showcase, live preview capabilities, and advanced filtering
 */

class ProjectBrowser {
  constructor(projects = []) {
    this.projects = projects;
    this.filters = {
      difficulty: null,
      category: null,
      searchTerm: null,
    };
    this.selectedProject = null;
    this.viewMode = 'grid';
  }

  /**
   * Filter projects by difficulty level
   */
  filterByDifficulty(difficulty) {
    this.filters.difficulty = difficulty;
    return this.applyFilters();
  }

  /**
   * Filter projects by category/topic
   */
  filterByCategory(category) {
    this.filters.category = category;
    return this.applyFilters();
  }

  /**
   * Search projects by name or description
   */
  searchProjects(term) {
    this.filters.searchTerm = term?.toLowerCase() || null;
    return this.applyFilters();
  }

  /**
   * Apply all active filters to project list
   */
  applyFilters() {
    return this.projects.filter((project) => {
      if (this.filters.difficulty && project.difficulty !== this.filters.difficulty) {
        return false;
      }

      if (this.filters.category && project.category !== this.filters.category) {
        return false;
      }

      if (this.filters.searchTerm) {
        const matchesName = project.name
          ?.toLowerCase()
          .includes(this.filters.searchTerm);
        const matchesDesc = project.description
          ?.toLowerCase()
          .includes(this.filters.searchTerm);
        return matchesName || matchesDesc;
      }

      return true;
    });
  }

  /**
   * Clear all active filters
   */
  clearFilters() {
    this.filters = {
      difficulty: null,
      category: null,
      searchTerm: null,
    };
    return this.projects;
  }

  /**
   * Get unique categories from all projects
   */
  getCategories() {
    const categories = new Set();
    this.projects.forEach((p) => {
      if (p.category) categories.add(p.category);
    });
    return Array.from(categories);
  }

  /**
   * Get unique difficulty levels
   */
  getDifficultyLevels() {
    return ['beginner', 'intermediate', 'advanced'];
  }

  /**
   * Select project and prepare for preview
   */
  selectProject(projectDay) {
    this.selectedProject = this.projects.find((p) => p.day === projectDay);
    return this.selectedProject;
  }

  /**
   * Get live preview data for selected project
   */
  getLivePreview() {
    if (!this.selectedProject) return null;

    return {
      projectDay: this.selectedProject.day,
      name: this.selectedProject.name,
      description: this.selectedProject.description,
      liveUrl: this.selectedProject.liveUrl || null,
      sourceCode: this.getSourceCodeSnippet(),
      technologies: this.selectedProject.technologies || [],
      difficulty: this.selectedProject.difficulty,
      estimatedTime: this.selectedProject.estimatedTime,
      learningOutcomes: this.selectedProject.learningOutcomes || [],
    };
  }

  /**
   * Extract and format source code snippet
   */
  getSourceCodeSnippet() {
    if (!this.selectedProject?.sourceUrl) return null;

    return {
      url: this.selectedProject.sourceUrl,
      language: this.detectLanguage(this.selectedProject.sourceUrl),
      preview: this.selectedProject.codePreview || 'View full source on GitHub',
    };
  }

  /**
   * Detect programming language from URL
   */
  detectLanguage(url) {
    const extensions = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.jsx': 'jsx',
      '.tsx': 'tsx',
      '.py': 'python',
      '.java': 'java',
      '.html': 'html',
      '.css': 'css',
      '.vue': 'vue',
      '.react': 'react',
    };

    for (const [ext, lang] of Object.entries(extensions)) {
      if (url.includes(ext)) return lang;
    }
    return 'unknown';
  }

  /**
   * Switch between grid and list view modes
   */
  setViewMode(mode) {
    if (['grid', 'list'].includes(mode)) {
      this.viewMode = mode;
      return true;
    }
    return false;
  }

  /**
   * Sort filtered projects by specified criteria
   */
  sortProjects(sortBy) {
    const filtered = this.applyFilters();

    const sorters = {
      day: (a, b) => a.day - b.day,
      difficulty: (a, b) => {
        const order = { beginner: 0, intermediate: 1, advanced: 2 };
        return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
      },
      name: (a, b) => (a.name || '').localeCompare(b.name || ''),
      trending: (a, b) => (b.stars || 0) - (a.stars || 0),
    };

    if (sorters[sortBy]) {
      return filtered.sort(sorters[sortBy]);
    }

    return filtered;
  }

  /**
   * Get related projects based on selected project
   */
  getRelatedProjects(maxResults = 5) {
    if (!this.selectedProject) return [];

    const related = this.projects.filter(
      (p) =>
        p.day !== this.selectedProject.day &&
        (p.difficulty === this.selectedProject.difficulty ||
          p.category === this.selectedProject.category)
    );

    return related.slice(0, maxResults);
  }

  /**
   * Generate project statistics
   */
  getStatistics() {
    return {
      totalProjects: this.projects.length,
      byDifficulty: {
        beginner: this.projects.filter((p) => p.difficulty === 'beginner').length,
        intermediate: this.projects.filter((p) => p.difficulty === 'intermediate').length,
        advanced: this.projects.filter((p) => p.difficulty === 'advanced').length,
      },
      byCategory: this.projects.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {}),
      averageDifficulty: this.projects.length > 0 ? 3 : 0,
      completionRate: 0,
    };
  }
}

/**
 * Render interactive browser UI
 */
function renderProjectBrowser(containerId, projects) {
  const browser = new ProjectBrowser(projects);
  const container = document.getElementById(containerId);

  if (!container) return browser;

  const html = `
    <div class="project-browser">
      <div class="browser-sidebar">
        <div class="filter-section">
          <h3>Filters</h3>
          <div class="filter-group">
            <label>Difficulty</label>
            <select class="difficulty-filter">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Category</label>
            <select class="category-filter">
              <option value="">All Categories</option>
            </select>
          </div>
          <div class="filter-group">
            <input
              type="text"
              class="search-input"
              placeholder="Search projects..."
            >
          </div>
          <button class="clear-filters-btn">Clear All Filters</button>
        </div>
      </div>

      <div class="browser-main">
        <div class="browser-toolbar">
          <div class="view-toggle">
            <button class="view-btn grid-btn active" data-view="grid">Grid</button>
            <button class="view-btn list-btn" data-view="list">List</button>
          </div>
          <select class="sort-select">
            <option value="day">By Day</option>
            <option value="difficulty">By Difficulty</option>
            <option value="name">By Name</option>
            <option value="trending">Trending</option>
          </select>
        </div>

        <div class="projects-container grid-view"></div>
      </div>

      <div class="browser-preview">
        <div class="preview-header">
          <h3>Live Preview</h3>
          <button class="close-preview">×</button>
        </div>
        <div class="preview-content">
          <p>Select a project to view details</p>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  populateCategories(browser, container);
  attachBrowserEventListeners(browser, container);

  return browser;
}

/**
 * Populate category filter dropdown
 */
function populateCategories(browser, container) {
  const categorySelect = container.querySelector('.category-filter');
  browser.getCategories().forEach((cat) => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

/**
 * Attach event listeners to browser controls
 */
function attachBrowserEventListeners(browser, container) {
  const diffFilter = container.querySelector('.difficulty-filter');
  const catFilter = container.querySelector('.category-filter');
  const searchInput = container.querySelector('.search-input');
  const clearBtn = container.querySelector('.clear-filters-btn');
  const sortSelect = container.querySelector('.sort-select');
  const viewBtns = container.querySelectorAll('.view-btn');
  const projectsContainer = container.querySelector('.projects-container');

  function updateDisplay() {
    const filtered = browser.sortProjects(sortSelect.value);
    projectsContainer.innerHTML = filtered
      .map(
        (p) =>
          `<div class="project-card" data-day="${p.day}">
        <h4>${p.name}</h4>
        <span class="difficulty-badge">${p.difficulty}</span>
        <p>${p.description}</p>
      </div>`
      )
      .join('');

    projectsContainer.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', () => {
        const day = card.dataset.day;
        browser.selectProject(day);
        updatePreview(browser, container);
      });
    });
  }

  diffFilter.addEventListener('change', (e) => {
    browser.filterByDifficulty(e.target.value || null);
    updateDisplay();
  });

  catFilter.addEventListener('change', (e) => {
    browser.filterByCategory(e.target.value || null);
    updateDisplay();
  });

  searchInput.addEventListener('input', (e) => {
    browser.searchProjects(e.target.value);
    updateDisplay();
  });

  clearBtn.addEventListener('click', () => {
    browser.clearFilters();
    diffFilter.value = '';
    catFilter.value = '';
    searchInput.value = '';
    updateDisplay();
  });

  sortSelect.addEventListener('change', updateDisplay);

  viewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      viewBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      browser.setViewMode(btn.dataset.view);
      projectsContainer.classList.toggle('grid-view', btn.dataset.view === 'grid');
      projectsContainer.classList.toggle('list-view', btn.dataset.view === 'list');
    });
  });

  container.querySelector('.close-preview').addEventListener('click', () => {
    container.querySelector('.browser-preview').style.display = 'none';
  });

  updateDisplay();
}

/**
 * Update preview panel with selected project
 */
function updatePreview(browser, container) {
  const preview = browser.getLivePreview();
  const previewContent = container.querySelector('.preview-content');

  if (!preview) {
    previewContent.innerHTML = '<p>Select a project to view details</p>';
    return;
  }

  const html = `
    <div class="preview-project">
      <h4>${preview.name}</h4>
      <p>${preview.description}</p>
      <div class="preview-meta">
        <span class="badge">${preview.difficulty}</span>
        <span class="time">${preview.estimatedTime}</span>
      </div>
      ${preview.liveUrl ? `<a href="${preview.liveUrl}" target="_blank" class="live-link">View Live</a>` : ''}
      ${preview.sourceCode ? `<a href="${preview.sourceCode.url}" target="_blank" class="source-link">View Source</a>` : ''}
      <div class="outcomes">
        <h5>Learning Outcomes:</h5>
        <ul>
          ${preview.learningOutcomes.map((o) => `<li>${o}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  previewContent.innerHTML = html;
  container.querySelector('.browser-preview').style.display = 'block';
}

// Auto-initialize
if (typeof loadProjects === 'function') {
  loadProjects().then((projects) => {
    window.projectBrowser = renderProjectBrowser('projectBrowserContainer', projects);
  });
}
