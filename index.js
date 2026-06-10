/* ============================================================
   CONFIGURATION
   ============================================================ */
if (typeof REPO_OWNER === 'undefined') {
  window.REPO_OWNER = 'dhairyagothi';
  window.REPO_NAME = '100_days_100_web_project';
}
window.REPO_OWNER = window.REPO_OWNER || 'dhairyagothi';
window.REPO_NAME = window.REPO_NAME || '100_days_100_web_project';

let currentPage = 1;
//for the number of visible projects in one page.
let itemsPerPage = 9;
let projectData = [];
let filteredProjectData = [];


/* ============================================================
   TECHNOLOGY STACK FILTERING VARIABLES
   ============================================================ */
let techStackFilters = []; // Array of active tech filters
let techSearchQuery = ''; // Current tech search input

// Technology normalization map (handles common variations)
// Maps user input → actual tags in dataset
const TECH_ALIASES = {
  'js': 'javascript',
  'react': 'javascript',
  'node': 'javascript',
  'vue': 'javascript',
  'python': 'api',
  'flask': 'api',
  'game': 'game',
  'games': 'game',
};

/* Maps data-filter values on chip buttons to display category names */
const FILTER_CATEGORY_MAP = {
  'all': 'all',
  'game': 'Games',
  'clone': 'Clones',
  'tool': 'Tools',
  'ui': 'UI / Animation',
  'api': 'APIs',
};

/**
 * Derive a display category from a project's tags and name.
 * Uses the existing tag structure so no new data field is needed.
 */
function getCategoryFromTags(tags, name) {
  const tagStr = (Array.isArray(tags) ? tags.join(' ') : (tags || '')).toLowerCase();
  const nameStr = (name || '').toLowerCase();

  if (tagStr.includes('game')) return 'Games';
  if (tagStr.includes('clone')) return 'Clones';
  if (tagStr.includes('tool')) return 'Tools';
  if (tagStr.includes('ui')) return 'UI / Animation';
  if (tagStr.includes('api') || tagStr.includes('weather')) return 'APIs';

  if (nameStr.includes('clone')) return 'Clones';
  if (nameStr.includes('game') || nameStr.includes('puzzle') || nameStr.includes('quiz')) return 'Games';

  return 'Tools';
}

let PROJECTS = [];
let projectsPromise = null;

function loadProjects() {
  if (!projectsPromise) {
    projectsPromise = (async () => {
      const isRoot = !window.location.pathname.includes('/contributors/');
      const base = isRoot ? '' : '../';
      const projectsUrl = new URL(`${base}projects.json`, window.location.href).toString();
      const response = await fetch(projectsUrl);
      if (!response.ok) {
        throw new Error(`Failed to load projects: ${response.statusText}`);
      }
      
      const data = await response.json();

      // Ensure root JSON data is a clean array
      if (!Array.isArray(data)) {
        console.error("Root projects.json structural context is completely malformed or empty!");
        PROJECTS = [];
        return;
      }

      PROJECTS = [];
      data.forEach((project) => {
        // Defensive Type-Checking Guard: Filter out malformed entries cleanly
        if (
          !project ||
          typeof project !== 'object' ||
          Array.isArray(project) ||
          project.projectNo === undefined ||
          !project.projectName ||
          !project.projectPath
        ) {
          console.error("Skipping malformed or corrupted project entry in projects.json:", project);
          return; // Skip data array errors without breaking the layout
        }

        // Structural defensive formatting defaults to guarantee safe down-line loops
        PROJECTS.push([
          `Day ${project.projectNo}`,
          project.projectName,
          project.projectPath,
          Array.isArray(project.techStack) ? project.techStack : [], // Array fallbacks protect loops
          project.difficulty || 'Beginner',
          project.projectDesc || 'Explore this project to discover interactive functionality.'
        ]);
      });
    })();
  }
  return projectsPromise;
}

// Start fetching immediately
loadProjects();


/* ============================================================
   PROJECT LINK RESOLUTION (demo vs source / source-only)
   ============================================================ */
const SOURCE_ONLY_TAG = 'source-only';

/** Live demos hosted outside the repo — Code links point to in-repo source folders */
const EXTERNAL_DEMO_SOURCE_FOLDERS = {
  'Day 20': 'public/EveSparks',
  'Day 115': 'public/event-registration-system',
};

function isGithubTreeUrl(url) {
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/tree\/[^/]+\//i.test(String(url || '').trim());
}

function parseGithubTreePath(url) {
  const match = String(url || '').trim().match(/\/tree\/[^/]+\/(.+?)(?:\?|#|$)/);
  return match ? decodeURIComponent(match[1].replace(/\/$/, '')) : null;
}

function isSourceOnlyProject(day, tags) {
  if (day === 'Day 13' || day === 'Day 72') return true;
  const tagList = Array.isArray(tags)
    ? tags
    : String(tags || '').split(/\s+/).filter(Boolean);
  return tagList.includes(SOURCE_ONLY_TAG);
}

function githubTreeToLocalDemo(url) {
  const folderPath = parseGithubTreePath(url);
  if (!folderPath) return null;
  return `./${folderPath}/index.html`;
}

function getSourceUrl(url, day) {
  const trimmed = (url || '').trim();
  const repoSourceFolder = day && EXTERNAL_DEMO_SOURCE_FOLDERS[day];
  if (repoSourceFolder) {
    return `https://github.com/${window.REPO_OWNER}/${window.REPO_NAME}/tree/Main/${repoSourceFolder}`;
  }
  if (isGithubTreeUrl(trimmed)) return trimmed;
  if (trimmed.startsWith('http')) return trimmed;
  if (trimmed.startsWith('./')) {
    const folderPath = trimmed.substring(2, trimmed.lastIndexOf('/'));
    return `https://github.com/${window.REPO_OWNER}/${window.REPO_NAME}/tree/Main/${folderPath}`;
  }
  return `https://github.com/${window.REPO_OWNER}/${window.REPO_NAME}/tree/Main`;
}

function resolveProjectUrls(day, name, url, tags) {
  const trimmed = (url || '').trim();
  const sourceOnly = isSourceOnlyProject(day, tags);
  let demoUrl = trimmed;
  let sourceUrl = getSourceUrl(trimmed, day);

  if (isGithubTreeUrl(trimmed)) {
    sourceUrl = trimmed;
    demoUrl = sourceOnly ? trimmed : (githubTreeToLocalDemo(trimmed) || trimmed);
  }

  if (!sourceOnly && demoUrl && !demoUrl.startsWith('http')) {
    try {
      const isRoot = !window.location.pathname.includes('/contributors/');
      const basePrefix = isRoot ? '' : '../';
      if (demoUrl.startsWith('./')) {
        demoUrl = basePrefix + demoUrl.substring(2);
      }
    } catch (error) {
    }
  }

  return { demoUrl, sourceUrl, sourceOnly };
}

function getProjectDescription(project) {
  return (
    (project && project[5]) ||
    'Explore this project to discover interactive functionality.'
  );
}

function buildProjectCardHTML({
  day,
  name,
  url,
  tags,
  category,
  isBookmarked = false,
  showDescription = true,
}) {
  const { demoUrl, sourceUrl, sourceOnly } = resolveProjectUrls(day, name, url, tags);
  const tagsArray = Array.isArray(tags)
    ? tags.filter((t) => t !== SOURCE_ONLY_TAG)
    : String(tags || '')
        .split(/\s+/)
        .filter((t) => t && t !== SOURCE_ONLY_TAG);
  const tagsHTML = tagsArray.map((t) => `<span class="tag">${t}</span>`).join('');
  const project = PROJECTS.find(p => p[1] === name);

  const description = getProjectDescription(project);
  const sourceOnlyBadge = sourceOnly
    ? '<span class="source-only-badge" title="Requires local server setup">Source only</span>'
    : '';
  const primaryLink = sourceOnly
    ? `<a href="${sourceUrl}" target="_blank" class="card-link open-project" data-id="${day}" rel="noopener noreferrer" onclick="event.stopPropagation()">
                        <i class="fab fa-github"></i> Source
                    </a>`
    : `<a href="${demoUrl}" target="_blank" class="card-link open-project" data-id="${day}" rel="noopener noreferrer" onclick="event.stopPropagation()">
                        Demo <i class="fas fa-arrow-right"></i>
                    </a>`;
  const codeLink = sourceOnly
    ? ''
    : `<a href="${sourceUrl}" target="_blank" class="card-link view-code-link" rel="noopener noreferrer" onclick="event.stopPropagation()">
                        <i class="fab fa-github"></i> Code
                    </a>`;

  return {
    html: `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category-wrap">
                  <span class="card-category">${category}</span>
                  ${sourceOnlyBadge}
                </span>
            </div>
            <div class="card-name">${name}</div>
            ${
              showDescription
                ? `<div class="card-description">
    ${description}
</div>`
                : ''
            }
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <div class="card-actions-left">
                    ${primaryLink}
                    ${codeLink}
                </div>
                <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${day}" onclick="event.stopPropagation()">
                    <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                </button>
            </div>
        `,
    demoUrl,
    sourceOnly,
  };
}

function attachProjectCardInteraction(card, demoUrl, projectData = null) {
  card.style.cursor = 'pointer';
  card.onclick = (e) => {
    if (e.target.closest('a, button')) return;
    
    // Track the project visit if projectData is provided
    if (projectData) {
      trackRecentProject(projectData);
    }
    
    window.open(demoUrl, '_blank', 'noopener');
  };
}


/* ============================================================
   TECHNOLOGY STACK FILTERING FUNCTIONS
   ============================================================ */

/**
 * Normalize technology name for consistent matching
 * SIMPLIFIED: Just lowercase, no complex aliases needed
 * @param {string} tech - Technology name to normalize
 * @returns {string} Normalized technology name
 */
function normalizeTech(tech) {
  const lower = tech.toLowerCase().trim();
  // Only handle common variations
  return TECH_ALIASES[lower] || lower;
}

/**
 * Check if project matches the active tech stack filters.
 * Each filter must match a complete tag token, not a substring of another tag.
 * Example: searching "java" must not return projects tagged "javascript".
 * @param {string|array} projectTags - Project tags (space-separated string or array)
 * @returns {boolean} True if project matches all active filters
 */
function matchesTechStack(projectTags) {
  // No filters = show all projects
  if (techStackFilters.length === 0) return true;

  // Handle empty or missing tags
  if (!projectTags) return false;

  // Normalize to a set of individual lowercase tokens for whole-word matching.
  // Using a Set avoids repeated linear scans for each filter.
  const tagSet = new Set(
    (Array.isArray(projectTags) ? projectTags : String(projectTags).split(/\s+/))
      .map((t) => t.toLowerCase().trim())
      .filter(Boolean)
  );

  // Every active filter must match an exact token in the tag set (AND logic).
  // This prevents "java" from matching "javascript", "css" from matching "canvas", etc.
  return techStackFilters.every((filter) => tagSet.has(filter.toLowerCase()));
}


/**
 * Remove a specific technology filter
 * @param {string} tech - Technology to remove from filters
 */
function removeTechFilter(tech) {
  techStackFilters = techStackFilters.filter(t => t !== tech);
  updateTechFilterDisplay();
  currentPage = 1; // FIX: reset page when filter changes
  renderGrid();
}

/**
 * Clear all technology filters
 */
function clearAllTechFilters() {
  techStackFilters = [];
  techSearchQuery = '';

  const input = document.getElementById('techStackSearch');
  if (input) input.value = '';

  updateTechFilterDisplay();
  currentPage = 1; // FIX: reset page when filters are cleared
  renderGrid();
}

/**
 * Update the visual display of active tech filters
 */
function updateTechFilterDisplay() {
  const container = document.getElementById('activeTechFilters');
  const tagsContainer = document.getElementById('techFilterTags');
  const clearBtn = document.getElementById('clearTechFilter');

  if (!container || !tagsContainer) return;

  // Show/hide clear button in search input
  if (clearBtn) {
    clearBtn.style.display = techStackFilters.length > 0 ? 'block' : 'none';
  }

  // Show/hide active filters container
  if (techStackFilters.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';

  // Render filter tags with remove buttons
  tagsContainer.innerHTML = techStackFilters.map(tech => `
    <span class="tech-filter-tag">
      ${tech}
      <button onclick="removeTechFilter('${tech}')" aria-label="Remove ${tech} filter">
        <i class="fas fa-times"></i>
      </button>
    </span>
  `).join('');
}

/**
 * Get all unique technologies from projects (optional utility)
 * EFFICIENT: Uses Set for O(1) lookups
 * @returns {array} Sorted array of unique technologies
 */
function getAllTechnologies() {
  const techSet = new Set();

  PROJECTS.forEach(([, , , tags]) => {
    if (tags) {
      const tagArray = typeof tags === 'string'
        ? tags.split(/\s+/).filter(t => t)
        : tags;

      tagArray.forEach(tag => {
        techSet.add(tag.toLowerCase());
      });
    }
  });

  return Array.from(techSet).sort();
}

/* ============================================================
   BOOKMARK + RECENT SYSTEM
============================================================ */

let bookmarkedProjects = [];
let recentProjects = [];

try {
  bookmarkedProjects = JSON.parse(localStorage.getItem('bookmarkedProjects')) || [];
  recentProjects = JSON.parse(localStorage.getItem('recentProjects')) || [];
} catch (error) {
  console.warn('localStorage is not available or access is denied:', error.message);
}

let showAllBookmarks = false;
let showAllRecent = false;

const INITIAL_VISIBLE_ITEMS = 3;
const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Migrates old recent projects format (array) to new format (object with timestamp)
 * If stored format doesn't have timestamps, it's likely the old format
 */
function migrateRecentProjects() {
  if (recentProjects.length === 0) return;
  
  // Check if already in new format (has timestamp)
  if (typeof recentProjects[0] === 'object' && recentProjects[0].timestamp) {
    return; // Already migrated
  }
  
  // Migrate old format [day, name, url, tags] to new format {day, name, url, tags, timestamp}
  recentProjects = recentProjects.map((project) => {
    if (Array.isArray(project)) {
      return {
        day: project[0],
        name: project[1],
        url: project[2],
        tags: project[3],
        timestamp: Date.now() - (ONE_HOUR_MS / 2) // Set to 30 mins ago to preserve them initially
      };
    }
    return project;
  });
  
  localStorage.setItem('recentProjects', JSON.stringify(recentProjects));
}

// Migrate on load
migrateRecentProjects();

/**
 * Cleans up recent projects older than 1 hour
 * Called periodically and on page load
 */
function cleanupExpiredRecentProjects() {
  const initialLength = recentProjects.length;
  recentProjects = getRecentProjectsWithinWindow();
  
  if (recentProjects.length !== initialLength) {
    localStorage.setItem('recentProjects', JSON.stringify(recentProjects));
    renderRecentProjects();
  }
}

// Clean up on page load
cleanupExpiredRecentProjects();

// Clean up every 5 minutes
setInterval(cleanupExpiredRecentProjects, 5 * 60 * 1000);

const CATEGORY_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/* ============================================================
   GITHUB REPO STATS
   ============================================================ */
async function fetchRepoStats() {

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const setFallback = () => {
    set('starCount', 'N/A');
    set('forkCount', 'N/A');
    set('issueCount', 'N/A');
    set('prCount', 'N/A');
  };

  try {

    // Optional loading state
    set('starCount', 'Loading...');
    set('forkCount', 'Loading...');
    set('issueCount', 'Loading...');
    set('prCount', 'Loading...');

    const [repoRes, prRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}`),
      fetch(`https://api.github.com/search/issues?q=repo:${window.REPO_OWNER}/${window.REPO_NAME}+type:pr+state:open`)
    ]);

    if (!repoRes.ok || !prRes.ok) {
      throw new Error("GitHub API request failed");
    }

    const repo = await repoRes.json();
    const prs = await prRes.json();

    set('starCount', repo.stargazers_count.toLocaleString());
    set('forkCount', repo.forks_count.toLocaleString());
    set('issueCount', (repo.open_issues_count - prs.total_count).toLocaleString());
    set('prCount', prs.total_count.toLocaleString());

  } catch (e) {

    console.warn("GitHub stats unavailable:", e.message);

    // Show fallback text instead of permanent dashes
    setFallback();
  }
}

function generateReadme() {
  try {
    const lines = [];
    lines.push('# 100 Days · 100 Web Projects');
    lines.push('A curated archive of frontend experiments — browse, fork, contribute.');
    lines.push('');
    lines.push('## Projects');
    PROJECTS.forEach(([day, name, url, tags]) => {
      const { demoUrl } = resolveProjectUrls(day, name, url, tags);
      const category = getCategoryFromTags(tags, name);
      lines.push(`- **${day} — ${name}** — ${demoUrl} — _${category}_`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  } catch (e) {
    console.error('Failed to generate README:', e);
    alert('Could not generate README. See console for details.');
  }
}

/* ============================================================
   RENDER PROJECT GRID
   ============================================================ */
let activeFilter = 'all';
let searchQuery = '';
let sortOption = 'default';
let techStackFilter = 'all';
let difficultyFilter = 'all';

// FIX: Resize debounce timer handle — stored at module level so it can be
// cleared across multiple rapid resize events without leaking timers.
let _resizeDebounceTimer = null;

function syncStateToURL() {
  const url = new URL(window.location);
  
  if (searchQuery) {
    url.searchParams.set('search', searchQuery);
  } else {
    url.searchParams.delete('search');
  }

  if (activeFilter && activeFilter !== 'all') {
    url.searchParams.set('category', activeFilter);
  } else {
    url.searchParams.delete('category');
  }

  if (currentPage > 1) {
    url.searchParams.set('page', currentPage);
  } else {
    url.searchParams.delete('page');
  }

  window.history.replaceState({}, '', url);
}

function readStateFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  
  if (urlParams.has('search')) {
    searchQuery = urlParams.get('search');
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = searchQuery;
    }
  }
  
  if (urlParams.has('category')) {
    activeFilter = urlParams.get('category');
  }
  
  if (urlParams.has('page')) {
    const page = parseInt(urlParams.get('page'), 10);
    if (!isNaN(page) && page > 0) {
      currentPage = page;
    }
  }
}

// FIX: Single entry point for all search input changes.
// Reads the live DOM value → updates the module-level variable → resets page
// → re-renders. Must be called from the input's event listener (see
// initSearchListener below) and NEVER re-registered on resize.
function handleSearchInput(value) {
  searchQuery = value;
  currentPage = 1; // FIX: always reset to page 1 on new search
  renderGrid();
}

// FIX: Attaches the search listener exactly ONCE after the DOM is ready.
// Keeping this separate from renderGrid() guarantees the listener is never
// duplicated or lost due to grid re-renders or window resize events.
function initSearchListener() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  // Sync the input's displayed value with the current module-level state
  // (important on orientation-change soft-reloads where the DOM may reset).
  searchInput.value = searchQuery;

  // Use the 'input' event so filtering is live as the user types.
  searchInput.addEventListener('input', (e) => {
    handleSearchInput(e.target.value);
  });

  // FIX: On focus, re-sync the input value from the module-level variable.
  // This guards against mobile browsers that visually clear inputs on
  // orientation change while the JS variable still holds the correct value.
  searchInput.addEventListener('focus', () => {
    if (searchInput.value !== searchQuery) {
      searchInput.value = searchQuery;
    }
  });
}

function renderGrid() {
  const grid = document.getElementById('projectGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  // FIX: Always keep the search input's displayed value in sync with the
  // module-level searchQuery. This prevents the visual "cleared" state that
  // occurs when the browser reflows the layout on resize/orientation change.
  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchInput.value !== searchQuery) {
    searchInput.value = searchQuery;
  }

  if (typeof updateClearFiltersBtnVisibility === 'function') {
    updateClearFiltersBtnVisibility();
  }

  const filtered = PROJECTS.filter(([day, name, url, tags, difficulty = '']) => {
    // Category filter
    const category = getCategoryFromTags(tags, name);
    const targetCategory = FILTER_CATEGORY_MAP[activeFilter] || 'all';
    const matchesFilter = activeFilter === 'all' || category === targetCategory;

    // Search filter
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || q.split(/\s+/).every(term =>
      name.toLowerCase().includes(term) ||
      day.toLowerCase().includes(term) ||
      ((Array.isArray(tags) ? tags.join(' ') : (tags || '')).toLowerCase().includes(term))
    );

    // Tech stack dropdown filter
    let matchesTech = true;
    if (techStackFilter && techStackFilter !== 'all') {
      const tagStr = (Array.isArray(tags) ? tags.join(' ') : (tags || '')).toLowerCase();
      matchesTech = tagStr.includes(techStackFilter.toLowerCase());
    }

    // Difficulty filter
    let matchesDifficulty = true;
    if (difficultyFilter && difficultyFilter !== 'all') {
      matchesDifficulty = (difficulty || '').toLowerCase() === difficultyFilter.toLowerCase();
    }

    return matchesFilter && matchesSearch && matchesTech && matchesDifficulty;
  });

  // Apply sorting
  if (sortOption === 'az') {
    filtered.sort((a, b) => a[1].localeCompare(b[1]));
  } else if (sortOption === 'latest') {
    filtered.sort((a, b) => {
      const dayA = parseInt(a[0].replace('Day ', ''));
      const dayB = parseInt(b[0].replace('Day ', ''));
      return dayB - dayA;
    });
  } else if (sortOption === 'difficulty') {
    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
    filtered.sort((a, b) => {
      const diffA = a[4] ? difficultyOrder[a[4].toLowerCase()] || 0 : 0;
      const diffB = b[4] ? difficultyOrder[b[4].toLowerCase()] || 0 : 0;
      return diffA - diffB;
    });
  }

  // FIX: Clear only the project cards from the grid, leaving the pagination
  // container untouched during the clear phase. Previously, grid.innerHTML = ''
  // destroyed the pagination container node and then re-appended a brand new
  // one on every render. This caused the pagination element to be treated as a
  // grid column by CSS Grid (because it lived INSIDE #projectGrid), which broke
  // the auto-fill column layout whenever the container's width changed on
  // resize. Now we remove only card children and leave pagination in place.
  const existingCards = grid.querySelectorAll('.project-card');
  existingCards.forEach(card => card.remove());

  if (filtered.length === 0) {
    grid.style.display = 'none';
    if (noResults) noResults.style.display = 'block';
    // Remove pagination when there are no results
    const container = document.getElementById('paginationContainer');
    if (container) container.remove();
    return;
  }

  grid.style.display = 'grid';
  if (noResults) noResults.style.display = 'none';

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = filtered.slice(startIndex, endIndex);
  const fragment = document.createDocumentFragment();

  pageItems.forEach(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const card = document.createElement('div');
    const isBookmarked = bookmarkedProjects.some((item) => item[0] === day);
    const { html, demoUrl, sourceOnly } = buildProjectCardHTML({
      day,
      name,
      url,
      tags,
      category,
      isBookmarked,
      showDescription: true,
    });

    card.className = sourceOnly ? 'project-card source-only' : 'project-card';
    card.innerHTML = html;
    attachProjectCardInteraction(card, demoUrl, [day, name, url, tags]);

    fragment.appendChild(card);
  });

  // FIX: Insert cards BEFORE the pagination container so card elements are
  // always siblings of — not mixed with — the pagination node inside the grid.
  // This keeps CSS Grid's auto-fill columns working correctly at all widths.
  const paginationContainer = document.getElementById('paginationContainer');
  if (paginationContainer) {
    grid.insertBefore(fragment, paginationContainer);
  } else {
    grid.appendChild(fragment);
  }

  renderPagination(filtered.length, totalPages);
  
  syncStateToURL();
}

function renderPagination(totalItems, totalPages) {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  let container = document.getElementById('paginationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'paginationContainer';
    container.className = 'pagination-container';
    // FIX: Append pagination ONCE here. renderGrid() will always find it with
    // getElementById and insert new cards before it, so pagination stays last.
    grid.appendChild(container);
  }

  container.innerHTML = '';

  // If there is only 1 page of results, hide and detach the pagination block
  if (totalPages <= 1) {
    container.remove();
    return;
  }

  // Render showing info range (e.g. "Showing 1 to 9 of 100")
  const infoDiv = document.createElement('div');
  infoDiv.className = 'pagination-info';
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  infoDiv.innerHTML = `Showing <strong>${startItem}</strong> to <strong>${endItem}</strong> of <strong>${totalItems}</strong> projects`;
  container.appendChild(infoDiv);

  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'pagination-controls';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'prev-btn';
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.setAttribute('aria-label', 'Previous Page');
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderGrid();
      // Delay scrolling by 50ms to allow DOM layout to recalculate and stabilize after cards redraw
      setTimeout(() => {
        scrollToProjectSection();
      }, 50);
    }
  });
  controlsDiv.appendChild(prevBtn);

  // Initialize bounds for numeric pagination window (displays maximum of 4 page buttons)
  let startPage = 1;
  let endPage = totalPages;
  const maxVisible = 4;

  // Sliding window pagination logic centering the active page
  if (totalPages > maxVisible) {
    if (currentPage <= 2) {
      startPage = 1;
      endPage = 4;
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - 3;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 2;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-num ${currentPage === i ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.setAttribute('aria-label', `Page ${i}`);
    pageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      renderGrid();
      // Delay scrolling by 50ms to allow DOM layout to recalculate and stabilize after cards redraw
      setTimeout(() => {
        scrollToProjectSection();
      }, 50);
    });
    controlsDiv.appendChild(pageBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'next-btn';
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.setAttribute('aria-label', 'Next Page');
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderGrid();
      // Delay scrolling by 50ms to allow DOM layout to recalculate and stabilize after cards redraw
      setTimeout(() => {
        scrollToProjectSection();
      }, 50);
    }
  });
  controlsDiv.appendChild(nextBtn);

  container.appendChild(controlsDiv);

  // FIX: Only append the container if it was detached by the totalPages <= 1
  // branch above. If it is already in the DOM (the normal path), skip the
  // append to avoid moving it — which would re-trigger a layout recalculation
  // and could cause a brief visual flicker at wide viewport widths.
  if (!container.parentElement) {
    grid.appendChild(container);
  }
}

function scrollToProjectSection() {
  const header = document.querySelector('.projects-header');
  if (!header) return;

  // Only scroll if the projects section is fully below the viewport.
  // If the user is already within or past the project grid, don't move them.
  if (header.getBoundingClientRect().top < window.innerHeight) return;

  const navbar = document.querySelector('.navbar');
  // Subtract height of fixed navbar with a 50px buffer to prevent overlaying the search bar
  const offset = navbar ? navbar.offsetHeight - 50 : 30;
  const targetY = header.getBoundingClientRect().top + window.pageYOffset - offset;
  const startY = window.pageYOffset;
  const distance = targetY - startY;

  // Custom snappy scroll duration (100ms matches the quick transitions in your CSS)
  const duration = 100;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    // Cap scroll position math exactly to distance to avoid landing slightly off target
    const run = easeInOutQuad(Math.min(timeElapsed, duration), startY, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  // Mathematical Quadratic Ease-In-Out formula for momentum-like deceleration
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

function toggleBookmark(project) {
  const exists = bookmarkedProjects.find((item) => item[0] === project[0]);

  if (exists) {
    bookmarkedProjects = bookmarkedProjects.filter((item) => item[0] !== project[0]);
    showToast('Bookmark removed');
  } else {
    bookmarkedProjects.push(project);
    showToast('Project bookmarked');
  }

  try {
    localStorage.setItem('bookmarkedProjects', JSON.stringify(bookmarkedProjects));
  } catch (error) {
    console.warn('Could not save bookmark due to localStorage restrictions');
  }
  renderBookmarks();
  renderGrid();
  renderRecentProjects();
}

/**
 * Removes projects older than 1 hour from the recent projects list
 * @returns {array} Filtered recent projects within the 1-hour window
 */
function getRecentProjectsWithinWindow() {
  const now = Date.now();
  return recentProjects.filter((item) => {
    const timestamp = item.timestamp || Date.now();
    const age = now - timestamp;
    return age <= ONE_HOUR_MS;
  });
}

/**
 * Tracks a recently viewed project with a timestamp
 * @param {array} project - Project data [day, name, url, tags]
 */
function trackRecentProject(project) {
  // Convert old format to new format if needed
  let projectObj;
  if (Array.isArray(project)) {
    projectObj = {
      day: project[0],
      name: project[1],
      url: project[2],
      tags: project[3],
      timestamp: Date.now()
    };
  } else {
    projectObj = {
      ...project,
      timestamp: Date.now()
    };
  }

  // Remove duplicate if exists
  recentProjects = recentProjects.filter((item) => item.day !== projectObj.day);
  
  // Add to front
  recentProjects.unshift(projectObj);

  // Keep only the 20 most recent entries (not filtered by time yet)
  if (recentProjects.length > 20) {
    recentProjects.pop();
  }

  try {
    localStorage.setItem('recentProjects', JSON.stringify(recentProjects));
  } catch (error) {
    console.warn('Could not save recent projects due to localStorage restrictions');
  }
  renderRecentProjects();
}

const bookmarkGrid = document.getElementById('bookmarkGrid');

function renderBookmarks() {
  if (!bookmarkGrid) return;

  bookmarkGrid.innerHTML = '';

  if (bookmarkedProjects.length === 0) {
    bookmarkGrid.innerHTML = `<p class="empty-state">No bookmarked projects yet.</p>`;
    return;
  }

  const bookmarkToggleBtn = document.getElementById('bookmarkToggleBtn');
  if (bookmarkToggleBtn) {
    bookmarkToggleBtn.style.display = bookmarkedProjects.length <= INITIAL_VISIBLE_ITEMS ? 'none' : 'inline-flex';
  }

  const visibleBookmarks = showAllBookmarks ? bookmarkedProjects : bookmarkedProjects.slice(0, INITIAL_VISIBLE_ITEMS);

  visibleBookmarks.forEach(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const card = document.createElement('div');
    const { html, demoUrl, sourceOnly } = buildProjectCardHTML({
      day,
      name,
      url,
      tags,
      category,
      isBookmarked: true,
      showDescription: true,
    });

    card.className = sourceOnly ? 'project-card source-only' : 'project-card';
    card.innerHTML = html;
    attachProjectCardInteraction(card, demoUrl, [day, name, url, tags]);

    bookmarkGrid.appendChild(card);
  });
}

const recentGrid = document.getElementById('recentGrid');

function renderRecentProjects() {
  if (!recentGrid) return;

  recentGrid.innerHTML = '';

  // Filter projects within the 1-hour window
  const validRecent = getRecentProjectsWithinWindow();

  if (validRecent.length === 0) {
    recentGrid.innerHTML = `<p class="empty-state">No recently viewed projects within the last hour.</p>`;
    return;
  }

  const recentToggleBtn = document.getElementById('recentToggleBtn');
  if (recentToggleBtn) {
    recentToggleBtn.style.display = validRecent.length <= INITIAL_VISIBLE_ITEMS ? 'none' : 'inline-flex';
  }

  const visibleRecent = showAllRecent ? validRecent : validRecent.slice(0, INITIAL_VISIBLE_ITEMS);

  visibleRecent.forEach((projectObj) => {
    // Handle both old array format and new object format
    const day = projectObj.day || projectObj[0];
    const name = projectObj.name || projectObj[1];
    const url = projectObj.url || projectObj[2];
    const tags = projectObj.tags || projectObj[3];
    
    const category = getCategoryFromTags(tags, name);
    const card = document.createElement('div');
    const isBookmarked = bookmarkedProjects.some((item) => item[0] === day);
    const { html, demoUrl, sourceOnly } = buildProjectCardHTML({
      day,
      name,
      url,
      tags,
      category,
      isBookmarked,
      showDescription: true,
    });

    card.className = sourceOnly ? 'project-card source-only' : 'project-card';
    card.innerHTML = html;
    attachProjectCardInteraction(card, demoUrl, [day, name, url, tags]);

    recentGrid.appendChild(card);
  });
}

/* ============================================================
   RESIZE HANDLER  (FIX — new addition)
   ============================================================ */

/**
 * On window resize / orientation change the browser may:
 *  1. Visually reset <input> values (Safari iOS in particular).
 *  2. Recalculate layout and leave grid columns misaligned.
 *
 * Strategy:
 *  - Debounce so we only act once the resize gesture settles (150 ms).
 *  - Re-sync the search input value from the module-level variable.
 *  - Re-render the grid so column widths recalculate against the new
 *    viewport width (this also re-inserts cards in the correct DOM order
 *    relative to the pagination container, fixing any overlap).
 *  - Never re-bind any event listeners here.
 */
function _onResize() {
  clearTimeout(_resizeDebounceTimer);
  _resizeDebounceTimer = setTimeout(() => {
    // Step 1: restore the search input's displayed value if the browser
    // reset it visually (common on iOS orientation change).
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value !== searchQuery) {
      searchInput.value = searchQuery;
    }

    // Step 2: re-render so grid columns recalculate at the new viewport width.
    // renderGrid() already preserves searchQuery, activeFilter, currentPage etc.
    renderGrid();
  }, 150);
}

window.addEventListener('resize', _onResize);
// orientationchange fires on mobile before 'resize'; listen to both so the
// fix runs even on devices that don't always emit a subsequent resize event.
window.addEventListener('orientationchange', _onResize);

/* ============================================================
   INITIALISATION  (FIX — wire up search listener after DOM ready)
   ============================================================ */

/**
 * Called once after the DOM is ready (and after PROJECTS loads).
 * Attaches the search input listener exactly once and performs the
 * initial render. All other module-level listeners (resize, etc.)
 * are registered at parse time above and do not need to be here.
 */
function init() {
  readStateFromURL();
  initSearchListener(); // FIX: single, permanent listener for the search input
  renderGrid();
}

// Defer init until the DOM is fully parsed so getElementById calls succeed.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // Document already parsed (script loaded with defer / at end of body)
  init();
}