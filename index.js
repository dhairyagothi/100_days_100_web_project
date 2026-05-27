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
     const projectsUrl =
new URL(`${base}projects.json`,
window.location.href).toString();
      const response = await fetch(projectsUrl);
      if (!response.ok) {
        throw new Error(`Failed to load projects: ${response.statusText}`);
      }
const data = await response.json();

PROJECTS = data.map(project => [
   `Day ${project.projectNo}`,
   project.projectName,
   project.projectPath,
   project.techStack,
   project.difficulty,
   project.projectDesc
]);
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
      demoUrl = new URL(demoUrl, window.location.href).href;
    } catch (error) {
      // Keep the original path if URL normalization fails.
    }
  }

  return { demoUrl, sourceUrl, sourceOnly };
}

function getProjectDescription(project) {
  return (
      project[5] ||
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
  const project =
PROJECTS.find(p => p[1] === name);

const description =
getProjectDescription(project);
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
 * Check if project matches the active tech stack filters
 * EFFICIENT APPROACH: Direct string matching without complex transformations
 * @param {string|array} projectTags - Project tags (space-separated string or array)
 * @returns {boolean} True if project matches all active filters
 */
function matchesTechStack(projectTags) {
  // No filters = show all projects
  if (techStackFilters.length === 0) return true;

  // Handle empty or missing tags
  if (!projectTags) return false;

  // Convert to single lowercase string for efficient matching
  const tagsLower = (typeof projectTags === 'string' ? projectTags : projectTags.join(' ')).toLowerCase();

  // EFFICIENT: Check if ALL filters exist in tags (AND logic)
  // Uses simple includes() - O(n*m) where n=filters, m=tag length
  return techStackFilters.every(filter => tagsLower.includes(filter));
}


/**
 * Remove a specific technology filter
 * @param {string} tech - Technology to remove from filters
 */
function removeTechFilter(tech) {
  techStackFilters = techStackFilters.filter(t => t !== tech);
  updateTechFilterDisplay();
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

let bookmarkedProjects = JSON.parse(localStorage.getItem('bookmarkedProjects')) || [];
let recentProjects = JSON.parse(localStorage.getItem('recentProjects')) || [];

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

function renderGrid() {
  const grid = document.getElementById('projectGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

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

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.style.display = 'none';
    if (noResults) noResults.style.display = 'block';
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
  grid.appendChild(fragment);
  renderPagination(filtered.length, totalPages);
}

function renderPagination(totalItems, totalPages) {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  let container = document.getElementById('paginationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'paginationContainer';
    container.className = 'pagination-container';
  }

  container.innerHTML = '';

  // If there is only 1 page of results, hide and detach the pagination block
  if (totalPages <= 1) {
    if (container.parentElement === grid) {
      grid.removeChild(container);
    }
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

  // Append container dynamically inside the projectGrid element to keep it attached
  grid.appendChild(container);
}

function scrollToProjectSection() {
  const header = document.querySelector('.projects-header');
  if (!header) return;

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

  localStorage.setItem('bookmarkedProjects', JSON.stringify(bookmarkedProjects));
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

  localStorage.setItem('recentProjects', JSON.stringify(recentProjects));
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
      showDescription: false,
    });

    card.className = sourceOnly ? 'project-card source-only' : 'project-card';
    card.innerHTML = html;
    attachProjectCardInteraction(card, demoUrl, [day, name, url, tags]);

    recentGrid.appendChild(card);
  });
}

/* ============================================================
   VIEW ALL TOGGLE
   ============================================================ */

const bookmarkToggleBtn = document.getElementById('bookmarkToggleBtn');
const recentToggleBtn = document.getElementById('recentToggleBtn');
const copyBookmarksBtn = document.getElementById('copyBookmarksBtn');

if (bookmarkToggleBtn) {
  bookmarkToggleBtn.addEventListener('click', () => {
    showAllBookmarks = !showAllBookmarks;
    bookmarkToggleBtn.textContent = showAllBookmarks ? 'Show Less' : 'View All';
    renderBookmarks();
  });
}

if (copyBookmarksBtn) {
  copyBookmarksBtn.addEventListener('click', async () => {
    if (bookmarkedProjects.length === 0) {
      showToast('No bookmarks to copy!');
      return;
    }
    const textToCopy = bookmarkedProjects.map(p => {
      const projectName = p[1];
      const { demoUrl } = resolveProjectUrls(p[0], p[1], p[2], p[3]);
      const projectLink = demoUrl.startsWith('http')
        ? demoUrl
        : new URL(demoUrl, window.location.href).href;
      return `${projectName} - ${projectLink}`;
    }).join('\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('Bookmarks copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy bookmarks.');
    }
  });
}

if (recentToggleBtn) {
  recentToggleBtn.addEventListener('click', () => {
    showAllRecent = !showAllRecent;
    recentToggleBtn.textContent = showAllRecent ? 'Show Less' : 'View All';
    renderRecentProjects();
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

document.addEventListener('click', (e) => {
  const bookmarkBtn = e.target.closest('.bookmark-btn');
  if (!bookmarkBtn) return;

  e.preventDefault();
  const projectDay = bookmarkBtn.dataset.id;
  const project = PROJECTS.find((item) => item[0] === projectDay);
  if (!project) return;

  toggleBookmark(project);
});

document.addEventListener('click', (e) => {
  const projectLink = e.target.closest('.open-project');
  if (!projectLink) return;

  const projectDay = projectLink.dataset.id;
  const project = PROJECTS.find((item) => item[0] === projectDay);
  if (!project) return;

  trackRecentProject(project);
});

/* ============================================================
   FILTER CHIPS
   ============================================================ */
function initFilterChips() {
  const chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter;
      currentPage = 1;
      renderGrid();
    });
  });
}

/* ============================================================
   LIVE SEARCH & TECH STACK FILTER
   ============================================================ */
function debounce(fn, delay = 300) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener(
    'input',
    debounce(() => {
      searchQuery = input.value.trim();
      currentPage = 1;
      renderGrid();
    }, 180)
  );

  // Tech stack dropdown filter listener
  const techStack = document.getElementById('techStackFilter');
  if (techStack) {
    techStack.addEventListener('change', () => {
      techStackFilter = techStack.value;
      currentPage = 1;
      renderGrid();
    });
  }

  // Difficulty dropdown filter listener
  const diffFilterElement = document.getElementById('difficultyFilter');
  if (diffFilterElement) {
    diffFilterElement.addEventListener('change', () => {
      difficultyFilter = diffFilterElement.value;
      currentPage = 1;
      renderGrid();
    });
  }
}

function initSorting() {
  const sortSelect = document.getElementById('sortProjects');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', (e) => {
    sortOption = e.target.value;
    currentPage = 1;
    renderGrid();
  });
}

/* ============================================================
   TECH STACK SEARCH INITIALIZATION
   ============================================================ */
function initTechStackSearch() {
  const input = document.getElementById('techStackSearch');
  const clearBtn = document.getElementById('clearTechFilter');

  if (!input) return;

  let debounceTimer;

  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const value = e.target.value.trim().toLowerCase();

      if (value) {
        const techs = value.split(/[,\s]+/).filter(t => t.length > 0);
        techStackFilters = [...new Set(techs)];
        updateTechFilterDisplay();
        currentPage = 1;
        renderGrid();
      } else {
        clearAllTechFilters();
      }
    }, 300);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearAllTechFilters();
    });
  }

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    }
  });
}

/* ============================================================
   SEARCH CONTROLS
   ============================================================ */
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');

function updateCategoryCounts() {
  const counts = {};
  for (const key of Object.keys(FILTER_CATEGORY_MAP)) {
    if (key !== 'all') {
      counts[key] = 0;
    }
  }

  PROJECTS.forEach(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const filterKey = Object.keys(FILTER_CATEGORY_MAP).find(
      (key) => FILTER_CATEGORY_MAP[key] === category
    );
    if (filterKey && filterKey !== 'all') {
      counts[filterKey]++;
    }
  });

  const categorySpans = {
    'game': document.getElementById('gameCount'),
    'clone': document.getElementById('cloneCount'),
    'tool': document.getElementById('toolCount'),
    'ui': document.getElementById('uiCount'),
    'api': document.getElementById('apiCount')
  };

  for (const [key, span] of Object.entries(categorySpans)) {
    if (span) {
      span.textContent = counts[key].toLocaleString();
    }
  }
}

function syncProjectCounts() {
  let filtered = [...PROJECTS];

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter(([day, name]) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      day.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const total = filtered.length.toLocaleString();
  const countNodes = [document.getElementById('projectCount'), document.getElementById('allCount')];

  countNodes.forEach((node) => {
    if (node) node.textContent = total;
  });

  if (searchInput) {
    searchInput.placeholder = `Search ${PROJECTS.length.toLocaleString()} projects…`;
  }

  updateCategoryCounts();
}

// Clear button functionality
if (searchInput && clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
    searchInput.focus();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
      searchInput.focus();
    }
  });
}

// Initialize
syncProjectCounts();

/* ============================================================
   NAVBAR — dynamic based on login state
   ============================================================ */
function updateNavbar() {
  const container = document.getElementById('navButtons');
  if (!container) return;

  const username = window.username || null;
  const isRoot = !window.location.pathname.includes('/contributors/');
  const base = isRoot ? '' : '../';
  const isLight = document.body.classList.contains('light-mode');
  const themeButton = `
        <button class="btn btn-ghost btn-sm" id="themeToggleNav" aria-label="Toggle theme">
          <i class="fas ${isLight ? 'fa-sun' : 'fa-moon'}"></i> Theme
        </button>
        `;
  const otherLink = isRoot
    ? `<a class="btn btn-ghost btn-sm" href="${base}learning/learning.html"><i class="fas fa-graduation-cap"></i> Learn</a>
       <a class="btn btn-ghost btn-sm" href="${base}contributors/contributor.html">Contributors</a>`
    : `<a class="btn btn-ghost btn-sm" href="${base}index.html"><i class="fas fa-home"></i> Home</a>
       <a class="btn btn-ghost btn-sm" href="${base}learning/learning.html"><i class="fas fa-graduation-cap"></i> Learn</a>`;

  if (username) {
    container.innerHTML = `
            ${themeButton}
            <span class="welcome-text">Hi, ${username}</span>
            <button class="btn btn-ghost btn-sm" id="logoutBtn">Log out</button>
            <a class="btn btn-ghost btn-sm" href="https://www.github-readme.tech" target="_blank">Generate README</a>
            <a class="btn btn-ghost btn-sm" href="https://github.com/dhairyagothi/100_days_100_web_project" target="_blank">
              <i class="fab fa-github"></i> GitHub
            </a>
            ${otherLink}
        `;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      window.username = null;
      updateNavbar();
    });
  } else {
    container.innerHTML = `
            ${themeButton}
            ${otherLink}
            <a class="btn btn-ghost btn-sm" href="https://github.com/dhairyagothi/100_days_100_web_project" target="_blank">
                <i class="fab fa-github"></i> GitHub
            </a>
            <a class="btn btn-ghost btn-sm" href="https://www.github-readme.tech" target="_blank">Generate README</a>
            <a class="btn btn-primary btn-sm" href="${base}public/Login.html">Sign in</a>
        `;
  }
}

/* ============================================================
   THEME TOGGLE
   ============================================================ */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  let transitionTimer = null;

  const syncThemeIcons = () => {
    const isLight = document.body.classList.contains('light-mode');
    const iconClass = isLight ? 'fas fa-sun' : 'fas fa-moon';
    document.querySelectorAll('#themeToggle i, #themeToggleNav i').forEach(icon => {
      icon.className = iconClass;
    });
  };

  if (saved === 'light') {
    document.body.classList.add('light-mode');
  }
  syncThemeIcons();

  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('#themeToggle') || e.target.closest('#themeToggleNav');
    if (!target) return;

    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    syncThemeIcons();

    document.body.classList.add('theme-transitioning');
    if (transitionTimer) clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 400);
  });
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
function initScrollBtn() {
  const btn = document.getElementById('scrollBtn');
  const ring = document.getElementById('ringFill');
  if (!btn) return;

  const circumference = 2 * Math.PI * 22;
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    btn.classList.toggle('show', scrollTop > 400);

    if (ring) {
      ring.style.strokeDashoffset = circumference * (1 - progress);
    }

    // Footer collision avoidance
    const footer = document.querySelector('.footer');
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (footerRect.top < windowHeight) {
        const overlap = windowHeight - footerRect.top;
        // Cap the upward movement to a maximum of 120px.
        // This ensures it dodges the important bottom footer links but 
        // doesn't fly completely off the top of the screen when the footer is huge.
        const maxOverlap = Math.min(overlap, 120);
        btn.style.bottom = `calc(2rem + ${maxOverlap}px)`;
      } else {
        btn.style.bottom = '2rem';
      }
    }
  };

  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initCurrentYear() {
  document.querySelectorAll('[data-current-year], #Current-Year').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

/* ============================================================
   INIT
   ============================================================ */
function hasProjectGrid() {
  return Boolean(document.getElementById('projectGrid'));
}

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  updateNavbar();

  initCurrentYear();
  initFilterChips();
  initSearch();
  initSorting();
  initTechStackSearch();

  try {
    // Await the projects to be fetched
    await loadProjects();

    syncProjectCounts();
    fetchRepoStats();
    initScrollBtn();

    if (hasProjectGrid()) {
      renderGrid();
      renderBookmarks();
      renderRecentProjects();
    }
  } catch (error) {
    console.error('Failed to load projects:', error);
    const grid = document.getElementById('projectGrid');
    if (grid) {
      grid.innerHTML = '<div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">Failed to load projects. Please try refreshing the page.</div>';
    }
  }
});



(() => {
  const initDirectMobileMenu = () => {
    const menuToggle = document.getElementById('menuToggle');
    const navButtons = document.getElementById('navButtons');

    if (!menuToggle || !navButtons) return;

    const closeMenu = () => {
      menuToggle.classList.remove('active');
      navButtons.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navButtons.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!navButtons.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navButtons.classList.contains('active')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    navButtons.addEventListener('click', (e) => {
      if (e.target.closest('.btn') || e.target.closest('a') || e.target.closest('button')) {
        closeMenu();
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDirectMobileMenu);
  } else {
    initDirectMobileMenu();
  }
})();



// Re-render the grid when the browser window is resized to adapt pagination density instantly
window.addEventListener(
  'resize',
  debounce(() => {
    if (hasProjectGrid()) {
      renderGrid();
    }
  }, 180)
);

/* ============================================================
   EXPOSE FUNCTIONS TO GLOBAL SCOPE
   (Required for HTML onclick handlers)
   ============================================================ */
window.removeTechFilter = removeTechFilter;
window.clearAllTechFilters = clearAllTechFilters;

// Custom cursor
(function () {
  const outerCursor = document.querySelector('.cursor-ring--outer');
  const innerCursor = document.querySelector('.cursor-ring--inner');

  if (!outerCursor || !innerCursor) return;

  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  const speed = 0.18;

  const update = () => {
    current.x += (target.x - current.x) * speed;
    current.y += (target.y - current.y) * speed;

    outerCursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
    innerCursor.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(update);
  };

  const showCursor = () => {
    outerCursor.classList.add('is-visible');
    innerCursor.classList.add('is-visible');
  };

  const hideCursor = () => {
    outerCursor.classList.remove('is-visible');
    innerCursor.classList.remove('is-visible');
  };

  window.addEventListener(
    'mousemove',
    (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      showCursor();
    },
    { passive: true }
  );

  window.addEventListener('mouseleave', hideCursor);
  window.addEventListener('mouseenter', showCursor);

  requestAnimationFrame(update);
})();

// Particle Network Background
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
  const palette = [220, 250, 280];
  const DEFAULT_PARTICLE_FPS = 36;
  let W = 0;
  let H = 0;
  let dpr = 1;
  let particles = [];
  let particleCount = 0;
  let linkDistance = 0;
  let maxDistanceSq = 0;
  let frameInterval = 1000 / DEFAULT_PARTICLE_FPS;
  let animationFrame = 0;
  let resizeFrame = 0;
  let lastFrameTime = 0;

  const getProfile = () => {
    const smallScreen = window.innerWidth <= 768 || coarsePointerQuery.matches;
    const reducedMotion = reducedMotionQuery.matches;
    const disableAnimation = smallScreen || reducedMotion;

    return {
      minParticles: reducedMotion ? 8 : smallScreen ? 12 : 24,
      maxParticles: reducedMotion ? 18 : smallScreen ? 28 : 72,
      areaPerParticle: reducedMotion ? 110000 : smallScreen ? 70000 : 26000,
      linkDistance: reducedMotion ? 68 : smallScreen ? 84 : 120,
      velocity: reducedMotion ? 0.12 : smallScreen ? 0.18 : 0.3,
      radius: reducedMotion ? 1.8 : smallScreen ? 2.2 : 4,
      fps: reducedMotion ? 14 : smallScreen ? 20 : 36,
      showLinks: !reducedMotion && !smallScreen,
      disableAnimation,
    };
  };

  let profile = getProfile();

  function resize() {
    profile = getProfile();
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, profile.showLinks ? 1.5 : 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particleCount = Math.min(
      profile.maxParticles,
      Math.max(profile.minParticles, Math.round((W * H) / profile.areaPerParticle))
    );
    linkDistance = profile.linkDistance;
    maxDistanceSq = linkDistance * linkDistance;
    frameInterval = 1000 / profile.fps;
  }

  function init() {
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * profile.velocity,
      vy: (Math.random() - 0.5) * profile.velocity,
      r: Math.random() * profile.radius + 0.8,
      hue: palette[Math.floor(Math.random() * palette.length)],
      alpha: Math.random() * 0.45 + 0.18,
    }));
  }

  function stepParticles() {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = W;
      else if (particle.x > W) particle.x = 0;

      if (particle.y < 0) particle.y = H;
      else if (particle.y > H) particle.y = 0;
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    stepParticles();

    if (profile.showLinks) {
      for (let i = 0; i < particleCount; i += 1) {
        for (let j = i + 1; j < particleCount; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq >= maxDistanceSq) continue;

          const distance = Math.sqrt(distanceSq);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${(1 - distance / linkDistance) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 80%, 72%, ${particle.alpha})`;
      ctx.fill();
    });
  }

  function draw(now = 0) {
    animationFrame = requestAnimationFrame(draw);

    if (document.hidden || now - lastFrameTime < frameInterval) {
      return;
    }

    lastFrameTime = now;
    drawFrame();
  }

  function stopAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  }

  function startAnimation() {
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(draw);
    }
  }

  const rebuild = () => {
    resize();

    if (profile.disableAnimation) {
      stopAnimation();
      ctx.clearRect(0, 0, W, H);
      canvas.style.display = 'none';
      return;
    }

    canvas.style.display = '';
    init();
    startAnimation();
  };

  const handleResize = () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      rebuild();
    });
  };

  const handleProfileChange = () => {
    lastFrameTime = 0;
    rebuild();
  };

  const bindMediaChange = (query, handler) => {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', handler);
      return;
    }
    if (typeof query.addListener === 'function') {
      query.addListener(handler);
    }
  };

  window.addEventListener('resize', handleResize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      lastFrameTime = 0;
    }
  });
  bindMediaChange(reducedMotionQuery, handleProfileChange);
  bindMediaChange(coarsePointerQuery, handleProfileChange);

  rebuild();
})();

// =============================================
// PERSISTENT FILTERS & SEARCH — Issue #3320
// =============================================

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    category: params.get('category') || 'all'
  };
}

function updateURL(search, category) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category && category !== 'all') params.set('category', category);
  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  history.pushState({ search, category }, '', newURL);
}

function restoreStateFromURL() {
  const { search, category } = getQueryParams();
  const searchInput = document.getElementById('searchInput') ||
    document.querySelector('input[type="text"]') ||
    document.querySelector('.search-input');
  if (searchInput && search) searchInput.value = search;
  const categoryFilter = document.getElementById('category');
  if (categoryFilter && category !== 'all') categoryFilter.value = category;
  if (search || category !== 'all') applyFilters(search, category);
}

function applyFilters(search, category) {
  searchQuery = search || '';
  activeFilter = category || 'all';
  currentPage = 1;

  // Sync active chip selection with URL state
  const chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach((chip) => {
    if (chip.dataset.filter === activeFilter) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  renderGrid();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadProjects();
    restoreStateFromURL();
  } catch (error) {
    console.error('Failed to restore state or load projects:', error);
  }
  const searchInput = document.getElementById('search') ||
    document.querySelector('input[type="text"]') ||
    document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const { category } = getQueryParams();
      updateURL(searchInput.value, category);
      applyFilters(searchInput.value, category);
    });
  }
  const categoryFilter = document.getElementById('category');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      const { search } = getQueryParams();
      updateURL(search, categoryFilter.value);
      applyFilters(search, categoryFilter.value);
    });
  }
  window.addEventListener('popstate', () => restoreStateFromURL());
});
