/**
 * Comprehensive Resource Guide - Issue #8782
 * Tutorials, documentation links, best practices, and learning materials
 */

class ResourceGuide {
  constructor() {
    this.resources = this.initializeResources();
    this.userProgress = this.loadUserProgress();
    this.bookmarks = this.loadBookmarks();
  }

  /**
   * Initialize comprehensive resource database
   */
  initializeResources() {
    return {
      html: {
        title: 'HTML Fundamentals',
        category: 'frontend',
        resources: [
          {
            id: 'html_1',
            type: 'tutorial',
            title: 'MDN HTML Basics',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
            difficulty: 'beginner',
            duration: '2-3 hours',
            description: 'Comprehensive HTML guide from Mozilla Developer Network',
            tags: ['markup', 'structure', 'semantics'],
          },
          {
            id: 'html_2',
            type: 'documentation',
            title: 'HTML5 Specification',
            url: 'https://html.spec.whatwg.org/',
            difficulty: 'intermediate',
            duration: '10+ hours',
            description: 'Official HTML5 living standard documentation',
            tags: ['spec', 'reference', 'advanced'],
          },
          {
            id: 'html_3',
            type: 'best-practice',
            title: 'Semantic HTML Best Practices',
            url: 'https://www.smashingmagazine.com/2022/01/html-web-components/',
            difficulty: 'intermediate',
            duration: '1 hour',
            description: 'Guidelines for writing semantic and accessible HTML',
            tags: ['accessibility', 'semantics', 'a11y'],
          },
        ],
      },
      css: {
        title: 'CSS Styling',
        category: 'frontend',
        resources: [
          {
            id: 'css_1',
            type: 'tutorial',
            title: 'CSS Fundamentals',
            url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS',
            difficulty: 'beginner',
            duration: '3-4 hours',
            description: 'Complete CSS tutorial covering selectors, box model, and layout',
            tags: ['styling', 'layout', 'responsive'],
          },
          {
            id: 'css_2',
            type: 'tutorial',
            title: 'Flexbox Complete Guide',
            url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
            difficulty: 'intermediate',
            duration: '2 hours',
            description: 'In-depth guide to CSS Flexbox layout technique',
            tags: ['layout', 'flexbox', 'responsive'],
          },
          {
            id: 'css_3',
            type: 'tutorial',
            title: 'CSS Grid Guide',
            url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
            difficulty: 'intermediate',
            duration: '2 hours',
            description: 'Complete CSS Grid tutorial with examples',
            tags: ['layout', 'grid', 'advanced'],
          },
          {
            id: 'css_4',
            type: 'best-practice',
            title: 'Performance Optimization Tips',
            url: 'https://web.dev/css-performance/',
            difficulty: 'advanced',
            duration: '1.5 hours',
            description: 'CSS optimization strategies for faster page loads',
            tags: ['performance', 'optimization', 'critical-css'],
          },
        ],
      },
      javascript: {
        title: 'JavaScript Programming',
        category: 'frontend',
        resources: [
          {
            id: 'js_1',
            type: 'tutorial',
            title: 'JavaScript Basics',
            url: 'https://javascript.info/',
            difficulty: 'beginner',
            duration: '4-5 hours',
            description: 'Comprehensive JavaScript tutorial from basics to advanced concepts',
            tags: ['programming', 'syntax', 'fundamentals'],
          },
          {
            id: 'js_2',
            type: 'documentation',
            title: 'MDN JavaScript Reference',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
            difficulty: 'intermediate',
            duration: 'variable',
            description: 'Complete JavaScript API reference and guides',
            tags: ['reference', 'documentation', 'api'],
          },
          {
            id: 'js_3',
            type: 'best-practice',
            title: 'Async JavaScript Patterns',
            url: 'https://javascript.info/async',
            difficulty: 'advanced',
            duration: '2-3 hours',
            description: 'Promises, async/await, and asynchronous programming patterns',
            tags: ['async', 'promises', 'callbacks'],
          },
          {
            id: 'js_4',
            type: 'best-practice',
            title: 'DOM Manipulation Best Practices',
            url: 'https://plainjs.com/javascript/',
            difficulty: 'intermediate',
            duration: '2 hours',
            description: 'Effective DOM querying and manipulation techniques',
            tags: ['dom', 'optimization', 'performance'],
          },
        ],
      },
      react: {
        title: 'React Framework',
        category: 'frontend',
        resources: [
          {
            id: 'react_1',
            type: 'tutorial',
            title: 'Official React Documentation',
            url: 'https://react.dev/',
            difficulty: 'beginner',
            duration: '4-6 hours',
            description: 'Official React learning resource with interactive examples',
            tags: ['framework', 'components', 'hooks'],
          },
          {
            id: 'react_2',
            type: 'tutorial',
            title: 'React Hooks Guide',
            url: 'https://react.dev/reference/react/hooks',
            difficulty: 'intermediate',
            duration: '2-3 hours',
            description: 'Complete guide to React Hooks and state management',
            tags: ['hooks', 'state', 'effects'],
          },
          {
            id: 'react_3',
            type: 'best-practice',
            title: 'Performance Optimization in React',
            url: 'https://react.dev/learn/render-and-commit',
            difficulty: 'advanced',
            duration: '1.5 hours',
            description: 'Techniques for optimizing React component rendering',
            tags: ['performance', 'memoization', 'optimization'],
          },
        ],
      },
      tools: {
        title: 'Development Tools',
        category: 'tooling',
        resources: [
          {
            id: 'tools_1',
            type: 'tutorial',
            title: 'Git Version Control',
            url: 'https://git-scm.com/doc',
            difficulty: 'beginner',
            duration: '2-3 hours',
            description: 'Git fundamentals and workflow guide',
            tags: ['git', 'version-control', 'collaboration'],
          },
          {
            id: 'tools_2',
            type: 'tutorial',
            title: 'npm Package Management',
            url: 'https://docs.npmjs.com/',
            difficulty: 'beginner',
            duration: '1-2 hours',
            description: 'npm basics and dependency management',
            tags: ['npm', 'packages', 'dependencies'],
          },
          {
            id: 'tools_3',
            type: 'best-practice',
            title: 'VS Code Tips and Tricks',
            url: 'https://code.visualstudio.com/docs/editor/tips-and-tricks',
            difficulty: 'beginner',
            duration: '1 hour',
            description: 'Productivity tips for VS Code editor',
            tags: ['editor', 'productivity', 'tools'],
          },
        ],
      },
    };
  }

  /**
   * Get resources by category
   */
  getResourcesByCategory(category) {
    return Object.values(this.resources).filter(
      (r) => r.category === category
    );
  }

  /**
   * Get resources by type (tutorial, documentation, best-practice)
   */
  getResourcesByType(type) {
    const results = [];
    Object.values(this.resources).forEach((tech) => {
      tech.resources
        .filter((r) => r.type === type)
        .forEach((r) => results.push(r));
    });
    return results;
  }

  /**
   * Search resources by keyword
   */
  searchResources(keyword) {
    const term = keyword.toLowerCase();
    const results = [];

    Object.values(this.resources).forEach((tech) => {
      tech.resources
        .filter(
          (r) =>
            r.title.toLowerCase().includes(term) ||
            r.description.toLowerCase().includes(term) ||
            r.tags.some((tag) => tag.includes(term))
        )
        .forEach((r) => results.push(r));
    });

    return results;
  }

  /**
   * Get resources by difficulty level
   */
  getResourcesByDifficulty(difficulty) {
    const results = [];
    Object.values(this.resources).forEach((tech) => {
      tech.resources
        .filter((r) => r.difficulty === difficulty)
        .forEach((r) => results.push(r));
    });
    return results;
  }

  /**
   * Get personalized learning path
   */
  getLearningPath(userLevel) {
    const recommended = [];
    const difficulties = {
      beginner: ['beginner'],
      intermediate: ['beginner', 'intermediate'],
      advanced: ['beginner', 'intermediate', 'advanced'],
    };

    const relevantDifficulties = difficulties[userLevel] || ['beginner'];

    Object.values(this.resources).forEach((tech) => {
      tech.resources
        .filter((r) => relevantDifficulties.includes(r.difficulty))
        .forEach((r) => recommended.push(r));
    });

    return recommended.sort((a, b) => {
      const diffOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    });
  }

  /**
   * Mark resource as completed
   */
  markResourceAsCompleted(resourceId) {
    if (!this.userProgress[resourceId]) {
      this.userProgress[resourceId] = {
        completed: true,
        completedAt: Date.now(),
        rating: 0,
        notes: '',
      };
    } else {
      this.userProgress[resourceId].completed = true;
      this.userProgress[resourceId].completedAt = Date.now();
    }
    this.saveUserProgress();
    return true;
  }

  /**
   * Rate a resource
   */
  rateResource(resourceId, rating, notes = '') {
    if (!this.userProgress[resourceId]) {
      this.userProgress[resourceId] = {
        completed: false,
        rating: Math.min(5, Math.max(1, rating)),
        notes,
      };
    } else {
      this.userProgress[resourceId].rating = Math.min(5, Math.max(1, rating));
      this.userProgress[resourceId].notes = notes;
    }
    this.saveUserProgress();
    return true;
  }

  /**
   * Add bookmark to resource
   */
  bookmarkResource(resourceId) {
    if (!this.bookmarks.includes(resourceId)) {
      this.bookmarks.push(resourceId);
      this.saveBookmarks();
    }
    return true;
  }

  /**
   * Remove bookmark
   */
  removeBookmark(resourceId) {
    this.bookmarks = this.bookmarks.filter((id) => id !== resourceId);
    this.saveBookmarks();
    return true;
  }

  /**
   * Get bookmarked resources
   */
  getBookmarkedResources() {
    const bookmarked = [];
    Object.values(this.resources).forEach((tech) => {
      tech.resources
        .filter((r) => this.bookmarks.includes(r.id))
        .forEach((r) => bookmarked.push(r));
    });
    return bookmarked;
  }

  /**
   * Get resource completion statistics
   */
  getCompletionStats() {
    const completed = Object.values(this.userProgress).filter(
      (p) => p.completed
    ).length;
    const total = Object.keys(this.userProgress).length;

    return {
      completed,
      total,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
      averageRating:
        total > 0
          ? (Object.values(this.userProgress)
              .filter((p) => p.rating > 0)
              .reduce((sum, p) => sum + p.rating, 0) /
              Object.values(this.userProgress).filter((p) => p.rating > 0)
                .length)
            .toFixed(2)
          : 0,
    };
  }

  /**
   * Persistence: Load user progress
   */
  loadUserProgress() {
    try {
      const stored = localStorage.getItem('resourceProgress');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Persistence: Save user progress
   */
  saveUserProgress() {
    try {
      localStorage.setItem('resourceProgress', JSON.stringify(this.userProgress));
    } catch (e) {
      console.warn('Failed to save resource progress:', e);
    }
  }

  /**
   * Persistence: Load bookmarks
   */
  loadBookmarks() {
    try {
      const stored = localStorage.getItem('resourceBookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Persistence: Save bookmarks
   */
  saveBookmarks() {
    try {
      localStorage.setItem('resourceBookmarks', JSON.stringify(this.bookmarks));
    } catch (e) {
      console.warn('Failed to save bookmarks:', e);
    }
  }
}

/**
 * Render resource guide UI
 */
function renderResourceGuide(containerId, resourceGuide) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const stats = resourceGuide.getCompletionStats();
  const categories = ['frontend', 'tooling'];

  const html = `
    <div class="resource-guide">
      <div class="guide-stats">
        <div class="stat">
          <h4>${stats.completed}/${stats.total}</h4>
          <p>Resources Completed</p>
        </div>
        <div class="stat">
          <h4>${stats.completionRate}%</h4>
          <p>Completion Rate</p>
        </div>
        <div class="stat">
          <h4>${stats.averageRating}</h4>
          <p>Average Rating</p>
        </div>
      </div>

      <div class="guide-content">
        <div class="search-box">
          <input
            type="text"
            class="resource-search"
            placeholder="Search resources..."
          >
        </div>

        <div class="resources-list"></div>
      </div>

      <div class="bookmarks-panel">
        <h3>Bookmarks</h3>
        <div class="bookmarks-list"></div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  const searchInput = container.querySelector('.resource-search');
  const resourcesList = container.querySelector('.resources-list');

  function displayResources(resources) {
    resourcesList.innerHTML = resources
      .map(
        (r) =>
          `<div class="resource-card" data-id="${r.id}">
        <h5>${r.title}</h5>
        <p class="type">${r.type}</p>
        <p class="description">${r.description}</p>
        <div class="meta">
          <span class="difficulty">${r.difficulty}</span>
          <span class="duration">${r.duration}</span>
        </div>
        <a href="${r.url}" target="_blank" class="resource-link">Visit Resource</a>
        <button class="bookmark-btn">Bookmark</button>
      </div>`
      )
      .join('');

    resourcesList.querySelectorAll('.bookmark-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const resourceId = e.target.closest('.resource-card').dataset.id;
        resourceGuide.bookmarkResource(resourceId);
        btn.textContent = 'Bookmarked';
        btn.disabled = true;
      });
    });
  }

  searchInput.addEventListener('input', (e) => {
    const results =
      e.target.value.length > 0
        ? resourceGuide.searchResources(e.target.value)
        : Object.values(resourceGuide.resources)
          .flatMap((t) => t.resources);
    displayResources(results);
  });

  const allResources = Object.values(resourceGuide.resources).flatMap(
    (t) => t.resources
  );
  displayResources(allResources);
}

// Auto-initialize
window.resourceGuide = new ResourceGuide();
