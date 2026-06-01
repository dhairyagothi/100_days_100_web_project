/* ============================================================
   CONFIGURATION
   ============================================================ */
if (typeof REPO_OWNER === "undefined") {
  window.REPO_OWNER = "dhairyagothi";
  window.REPO_NAME = "100_days_100_web_project";
}
window.REPO_OWNER = window.REPO_OWNER || "dhairyagothi";
window.REPO_NAME = window.REPO_NAME || "100_days_100_web_project";

let currentPage = 1;
//for the number of visible projects in one page.
let itemsPerPage = 9;
let projectData = [];
let filteredProjectData = [];

/* ============================================================
   PROJECT DATA
   [day label, project name, demo url, tech tags (array), category]
   Categories: game | clone | tool | ui | api
   ============================================================ */
let techStackFilters = []; // Array of active tech filters
let techSearchQuery = ""; // Current tech search input

// Technology normalization map (handles common variations)
// Maps user input → actual tags in dataset
const TECH_ALIASES = {
  js: "javascript",
  react: "javascript",
  node: "javascript",
  vue: "javascript",
  python: "api",
  flask: "api",
  game: "game",
  games: "game",
};

/* Maps data-filter values on chip buttons to display category names */
const FILTER_CATEGORY_MAP = {
  all: "all",
  game: "Games",
  clone: "Clones",
  tool: "Tools",
  ui: "UI / Animation",
  api: "APIs",
};

/**
 * Derive a display category from a project's tags and name.
 * Uses the existing tag structure so no new data field is needed.
 */
function getCategoryFromTags(tags, name) {
  const tagStr = (
    Array.isArray(tags) ? tags.join(" ") : tags || ""
  ).toLowerCase();
  const nameStr = (name || "").toLowerCase();

  if (tagStr.includes("game")) return "Games";
  if (tagStr.includes("clone")) return "Clones";
  if (tagStr.includes("tool")) return "Tools";
  if (tagStr.includes("ui")) return "UI / Animation";
  if (tagStr.includes("api") || tagStr.includes("weather")) return "APIs";

  if (nameStr.includes("clone")) return "Clones";
  if (
    nameStr.includes("game") ||
    nameStr.includes("puzzle") ||
    nameStr.includes("quiz")
  )
    return "Games";

  return "Tools";
}

let PROJECTS = [];
let projectsPromise = null;

function hydrateProjects(data) {
  PROJECTS = data.map((project) => [
    `Day ${project.projectNo}`,
    project.projectName,
    project.projectPath,
    project.techStack,
    project.difficulty,
    project.projectDesc,
  ]);
}

function getPreloadedProjectsData() {
  return Array.isArray(window.PROJECTS_DATA) ? window.PROJECTS_DATA : null;
}

function parseProjectsData(payload) {
  try {
    return JSON.parse(payload);
  } catch (error) {
    // Fallback for common malformed object separators in projects.json
    const repairedPayload = String(payload).replace(/}\s*{/g, "},{");
    return JSON.parse(repairedPayload);
  }
}

function loadProjects() {
  if (!projectsPromise) {
    projectsPromise = (async () => {
      const preloadedData = getPreloadedProjectsData();
      if (preloadedData) {
        hydrateProjects(preloadedData);
        return PROJECTS;
      }

      const isRoot = !window.location.pathname.includes("/contributors/");
      const base = isRoot ? "" : "../";
      const projectsUrl = new URL(
        `${base}projects.json`,
        window.location.href,
      ).toString();
      try {
        const response = await fetch(projectsUrl);
        if (!response.ok) {
          throw new Error(`Failed to load projects: ${response.statusText}`);
        }
        const payload = await response.text();
        const data = parseProjectsData(payload);
        hydrateProjects(data);
        return PROJECTS;
      } catch (error) {
        const fallbackData = getPreloadedProjectsData();
        if (fallbackData) {
          hydrateProjects(fallbackData);
          return PROJECTS;
        }
        throw error;
      }
    })();
  }
  return projectsPromise;
}

// Start fetching immediately
loadProjects();

/* ============================================================
   PROJECT LINK RESOLUTION (demo vs source / source-only)
   ============================================================ */
const SOURCE_ONLY_TAG = "source-only";

/** Live demos hosted outside the repo — Code links point to in-repo source folders */
const EXTERNAL_DEMO_SOURCE_FOLDERS = {
  "Day 20": "public/EveSparks",
  "Day 115": "public/event-registration-system",
};

function isGithubTreeUrl(url) {
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/tree\/[^/]+\//i.test(
    String(url || "").trim(),
  );
}

function parseGithubTreePath(url) {
  const match = String(url || "")
    .trim()
    .match(/\/tree\/[^/]+\/(.+?)(?:\?|#|$)/);
  return match ? decodeURIComponent(match[1].replace(/\/$/, "")) : null;
}

function isSourceOnlyProject(day, tags) {
  if (day === "Day 13" || day === "Day 72") return true;
  const tagList = Array.isArray(tags)
    ? tags
    : String(tags || "")
        .split(/\s+/)
        .filter(Boolean);
  return tagList.includes(SOURCE_ONLY_TAG);
}

function githubTreeToLocalDemo(url) {
  const folderPath = parseGithubTreePath(url);
  if (!folderPath) return null;
  return `./${folderPath}/index.html`;
}

function getSourceUrl(url, day) {
  const trimmed = (url || "").trim();
  const repoSourceFolder = day && EXTERNAL_DEMO_SOURCE_FOLDERS[day];
  if (repoSourceFolder) {
    return `https://github.com/${window.REPO_OWNER}/${window.REPO_NAME}/tree/Main/${repoSourceFolder}`;
  }
  if (isGithubTreeUrl(trimmed)) return trimmed;
  if (trimmed.startsWith("http")) return trimmed;
  if (trimmed.startsWith("./")) {
    const folderPath = trimmed.substring(2, trimmed.lastIndexOf("/"));
    return `https://github.com/${window.REPO_OWNER}/${window.REPO_NAME}/tree/Main/${folderPath}`;
  }
  return `https://github.com/${window.REPO_OWNER}/${window.REPO_NAME}/tree/Main`;
}

function resolveProjectUrls(day, name, url, tags) {
  const trimmed = (url || "").trim();
  const sourceOnly = isSourceOnlyProject(day, tags);
  let demoUrl = trimmed;
  let sourceUrl = getSourceUrl(trimmed, day);

  if (isGithubTreeUrl(trimmed)) {
    sourceUrl = trimmed;
    demoUrl = sourceOnly ? trimmed : githubTreeToLocalDemo(trimmed) || trimmed;
  }

  if (!sourceOnly && demoUrl && !demoUrl.startsWith("http")) {
    try {
      const isRoot = !window.location.pathname.includes("/contributors/");
      const basePrefix = isRoot ? "" : "../";
      if (demoUrl.startsWith("./")) {
        demoUrl = basePrefix + demoUrl.substring(2);
      }
    } catch (error) {}
  }

  return { demoUrl, sourceUrl, sourceOnly };
}

function getProjectDescription(project) {
  return (
    (project && project[5]) ||
    "Explore this project to discover interactive functionality."
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
  const { demoUrl, sourceUrl, sourceOnly } = resolveProjectUrls(
    day,
    name,
    url,
    tags,
  );
  const tagsArray = Array.isArray(tags)
    ? tags.filter((t) => t !== SOURCE_ONLY_TAG)
    : String(tags || "")
        .split(/\s+/)
        .filter((t) => t && t !== SOURCE_ONLY_TAG);
  const tagsHTML = tagsArray
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");
  const project = PROJECTS.find((p) => p[1] === name);

  const description = getProjectDescription(project);
  const sourceOnlyBadge = sourceOnly
    ? '<span class="source-only-badge" title="Requires local server setup">Source only</span>'
    : "";
  const primaryLink = sourceOnly
    ? `<a href="${sourceUrl}" target="_blank" class="card-link open-project" data-id="${day}" rel="noopener noreferrer" onclick="event.stopPropagation()">
                        <i class="fab fa-github"></i> Source
                    </a>`
    : `<a href="${demoUrl}" target="_blank" class="card-link open-project" data-id="${day}" rel="noopener noreferrer" onclick="event.stopPropagation()">
                        Demo <i class="fas fa-arrow-right"></i>
                    </a>`;
  const codeLink = sourceOnly
    ? ""
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
                : ""
            }
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <div class="card-actions-left">
                    ${primaryLink}
                    ${codeLink}
                </div>
                <button class="bookmark-btn ${isBookmarked ? "active" : ""}" data-id="${day}">
                    <i class="${isBookmarked ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
                </button>
            </div>
        `,
    demoUrl,
    sourceOnly,
  };
}

function attachProjectCardInteraction(card, demoUrl, projectData = null) {
  card.style.cursor = "pointer";
  card.onclick = (e) => {
    if (e.target.closest("a, button")) return;

    // Track the project visit if projectData is provided
    if (projectData) {
      trackRecentProject(projectData);
    }

    window.open(demoUrl, "_blank", "noopener");
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
    (Array.isArray(projectTags)
      ? projectTags
      : String(projectTags).split(/\s+/)
    )
      .map((t) => t.toLowerCase().trim())
      .filter(Boolean),
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
  techStackFilters = techStackFilters.filter((t) => t !== tech);
  updateTechFilterDisplay();
  renderGrid();
}

/**
 * Clear all technology filters
 */
function clearAllTechFilters() {
  techStackFilters = [];
  techSearchQuery = "";

  const input = document.getElementById("techStackSearch");
  if (input) input.value = "";

  updateTechFilterDisplay();
  renderGrid();
}

/**
 * Update the visual display of active tech filters
 */
function updateTechFilterDisplay() {
  const container = document.getElementById("activeTechFilters");
  const tagsContainer = document.getElementById("techFilterTags");
  const clearBtn = document.getElementById("clearTechFilter");

  if (!container || !tagsContainer) return;

  // Show/hide clear button in search input
  if (clearBtn) {
    clearBtn.style.display = techStackFilters.length > 0 ? "block" : "none";
  }

  // Show/hide active filters container
  if (techStackFilters.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "flex";

  // Render filter tags with remove buttons
  tagsContainer.innerHTML = techStackFilters
    .map(
      (tech) => `
    <span class="tech-filter-tag">
      ${tech}
      <button onclick="removeTechFilter('${tech}')" aria-label="Remove ${tech} filter">
        <i class="fas fa-times"></i>
      </button>
    </span>
  `,
    )
    .join("");
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
      const tagArray =
        typeof tags === "string" ? tags.split(/\s+/).filter((t) => t) : tags;

      tagArray.forEach((tag) => {
        techSet.add(tag.toLowerCase());
      });
    }
  });

  return Array.from(techSet).sort();
}

/* ============================================================
   BOOKMARK + RECENT SYSTEM

let bookmarkedProjects = [];
let recentProjects = [];

try {
  bookmarkedProjects =
    JSON.parse(localStorage.getItem("bookmarkedProjects")) || [];
  recentProjects = JSON.parse(localStorage.getItem("recentProjects")) || [];
} catch (error) {
  console.warn(
    "localStorage is not available or access is denied:",
    error.message,
  );
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
  if (typeof recentProjects[0] === "object" && recentProjects[0].timestamp) {
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
        timestamp: Date.now() - ONE_HOUR_MS / 2, // Set to 30 mins ago to preserve them initially
      };
    }
    return project;
  });

  localStorage.setItem("recentProjects", JSON.stringify(recentProjects));
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
    localStorage.setItem("recentProjects", JSON.stringify(recentProjects));
    renderRecentProjects();
  }
}

// Clean up every 5 minutes
setInterval(cleanupExpiredRecentProjects, 5 * 60 * 1000);

const CATEGORY_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/* ============================================================
   GITHUB STATS
   ============================================================ */
async function fetchRepoStats() {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const setFallback = () => {
    set("starCount", "N/A");
    set("forkCount", "N/A");
    set("issueCount", "N/A");
    set("prCount", "N/A");
  };

  try {
    // Optional loading state
    set("starCount", "Loading...");
    set("forkCount", "Loading...");
    set("issueCount", "Loading...");
    set("prCount", "Loading...");

    const [repoRes, prRes] = await Promise.all([
      fetch(
        `https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}`,
      ),
      fetch(
        `https://api.github.com/search/issues?q=repo:${window.REPO_OWNER}/${window.REPO_NAME}+type:pr+state:open`,
      ),
    ]);

    if (!repoRes.ok || !prRes.ok) {
      throw new Error("GitHub API request failed");
    }

    const repo = await repoRes.json();
    const prs = await prRes.json();

    set("starCount", repo.stargazers_count.toLocaleString());
    set("forkCount", repo.forks_count.toLocaleString());
    set(
      "issueCount",
      (repo.open_issues_count - prs.total_count).toLocaleString(),
    );
    set("prCount", prs.total_count.toLocaleString());
  } catch (e) {
    console.warn("GitHub stats unavailable:", e.message);

    // Show fallback text instead of permanent dashes
    setFallback();
  }
}
function generateReadme() {
  try {
    const lines = [];
    lines.push("# 100 Days · 100 Web Projects");
    lines.push(
      "A curated archive of frontend experiments — browse, fork, contribute.",
    );
    lines.push("");
    lines.push("## Projects");
    PROJECTS.forEach(([day, name, url, tags]) => {
      const { demoUrl } = resolveProjectUrls(day, name, url, tags);
      const category = getCategoryFromTags(tags, name);
      lines.push(`- **${day} — ${name}** — ${demoUrl} — _${category}_`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  } catch (e) {
    console.error("Failed to generate README:", e);
    alert("Could not generate README. See console for details.");
  }
}

/* ============================================================
   RENDER PROJECT GRID
   ============================================================ */
let activeFilter = 'all';
let searchQuery  = '';

function renderGrid() {
    const grid = document.getElementById('projectGrid');
    const noResults = document.getElementById('noResults');
    if (!grid) return;

    const filtered = PROJECTS.filter(([day, name, , , cat]) => {
        const matchesFilter = activeFilter === 'all' || cat === activeFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || name.toLowerCase().includes(q) || day.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        removePagination();
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);

    paginated.forEach(([day, name, url, tags, cat]) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        const tagsHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
        card.innerHTML = `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${CATEGORY_LABEL[cat] || cat}</span>
            </div>
            <div class="card-name">${name}</div>
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <a href="${url.trim()}" target="_blank" class="card-link" rel="noopener noreferrer">
                    View Demo <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    removePagination();
    if (totalPages <= 1) return;

    const container = document.createElement('div');
    container.id = 'pagination';
    container.style.cssText = 'display:flex;justify-content:center;gap:8px;margin-top:2rem;flex-wrap:wrap;';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.style.cssText = `padding:8px 14px;border-radius:6px;border:1px solid #444;
            background:${i === currentPage ? '#fff' : 'transparent'};
            color:${i === currentPage ? '#000' : '#fff'};cursor:pointer;`;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderGrid();
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        });
        container.appendChild(btn);
    }

    document.getElementById('projectGrid').after(container);
}

function removePagination() {
    const old = document.getElementById('pagination');
    if (old) old.remove();
}

/* ============================================================
   CLEAR ALL FILTERS SYSTEM
   ============================================================ */
function updateClearFiltersBtnVisibility() {
  const btn = document.getElementById("clearAllFiltersBtn");
  if (!btn) return;

  const input = document.getElementById("searchInput");
  const techStack = document.getElementById("techStackFilter");
  const difficultyElement = document.getElementById("difficultyFilter");

  const hasSearch = input && input.value.trim() !== "";
  const hasTech = techStack && techStack.value !== "all";
  const hasDiff = difficultyElement && difficultyElement.value !== "all";
  const hasCategory = activeFilter && activeFilter !== "all";

  if (hasSearch || hasTech || hasDiff || hasCategory) {
    btn.style.display = "inline-flex";
  } else {
    btn.style.display = "none";
  }
}

function resetAllFilters() {
  // 1. Reset Category filter chips
  const chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach((c) => c.classList.remove("active"));
  const allChip =
    document.getElementById("filterAll") ||
    document.querySelector('.chip[data-filter="all"]');
  if (allChip) allChip.classList.add("active");
  activeFilter = "all";

  // 2. Clear Search input
  const input = document.getElementById("searchInput");
  if (input) input.value = "";
  searchQuery = "";

  // 3. Reset Tech Stack dropdown select
  const techStack = document.getElementById("techStackFilter");
  if (techStack) techStack.value = "all";
  techStackFilter = "all";

  // 4. Reset Difficulty dropdown select
  const difficultyElement = document.getElementById("difficultyFilter");
  if (difficultyElement) difficultyElement.value = "all";
  difficultyFilter = "all";

  // 5. Reset Sorting to default
  const sortSelect = document.getElementById("sortProjects");
  if (sortSelect) sortSelect.value = "default";
  sortOption = "default";

  // 6. Sync URL
  if (typeof updateURL === "function") {
    updateURL("", "all");
  }

  // 7. Refresh grid and pagination
  currentPage = 1;
  renderGrid();
  syncProjectCounts();

  showToast("Filters cleared!");
}

function initClearAllFilters() {
  const btn = document.getElementById("clearAllFiltersBtn");
  if (btn) {
    btn.addEventListener("click", resetAllFilters);
  }
}

/* ============================================================
   FILTER CHIPS
   ============================================================ */
function initFilterChips() {
  const chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach((chip) => {
    if (chip.dataset.filter === activeFilter) {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
    }

    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter;
      currentPage = 1;
      renderGrid();
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
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener(
    "input",
    debounce(() => {
      searchQuery = input.value.trim();
      currentPage = 1;
      renderGrid();
    }, 180),
  );

  // Tech stack dropdown filter listener
  const techStack = document.getElementById("techStackFilter");
  if (techStack) {
    techStack.addEventListener("change", () => {
      techStackFilter = techStack.value;
      currentPage = 1;
      renderGrid();
    });
  }

  // Difficulty dropdown filter listener
  const diffFilterElement = document.getElementById("difficultyFilter");
  if (diffFilterElement) {
    diffFilterElement.addEventListener("change", () => {
      difficultyFilter = diffFilterElement.value;
      currentPage = 1;
      renderGrid();
    });
  }
}

function initSorting() {
  const sortSelect = document.getElementById("sortProjects");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", (e) => {
    sortOption = e.target.value;
    currentPage = 1;
    renderGrid();
  });
}

/* ============================================================
   TECH STACK SEARCH INITIALIZATION
   ============================================================ */
function initTechStackSearch() {
  const input = document.getElementById("techStackSearch");
  const clearBtn = document.getElementById("clearTechFilter");

  if (!input) return;

  // Use the shared debounce utility instead of a manual inline timer
  input.addEventListener(
    "input",
    debounce((e) => {
      const value = e.target.value.trim().toLowerCase();

      if (value) {
        const techs = value.split(/[,\s]+/).filter((t) => t.length > 0);
        techStackFilters = [...new Set(techs)];
        updateTechFilterDisplay();
        currentPage = 1;
        renderGrid();
      } else {
        clearAllTechFilters();
      }
    }, 300),
  );

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearAllTechFilters();
    });
  }

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      input.blur();
    }
  });
}

/* ============================================================
   SEARCH CONTROLS
   ============================================================ */
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearch");

function updateCategoryCounts() {
  const counts = {};
  for (const key of Object.keys(FILTER_CATEGORY_MAP)) {
    if (key !== "all") {
      counts[key] = 0;
    }
  }

  PROJECTS.forEach(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const filterKey = Object.keys(FILTER_CATEGORY_MAP).find(
      (key) => FILTER_CATEGORY_MAP[key] === category,
    );
    if (filterKey && filterKey !== "all") {
      counts[filterKey]++;
    }
  });

  const categorySpans = {
    game: document.getElementById("gameCount"),
    clone: document.getElementById("cloneCount"),
    tool: document.getElementById("toolCount"),
    ui: document.getElementById("uiCount"),
    api: document.getElementById("apiCount"),
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
    filtered = filtered.filter(
      ([day, name]) =>
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        day.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  const total = filtered.length.toLocaleString();
  const countNodes = [
    document.getElementById("projectCount"),
    document.getElementById("allCount"),
  ];

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

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = `Search ${total} projects…`;
    }
}

// Initialize
syncProjectCounts();

/* ============================================================
   NAVBAR — dynamic based on login state
   ============================================================ */
function updateNavbar() {
  // The navbar is now managed by navbar.js which creates the dropdowns properly.
  // This function is kept empty to prevent legacy calls from breaking.
}

/* ============================================================
   THEME TOGGLE
   ============================================================ */
// Implemented by the shared ThemeManager in theme.js.

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
function initScrollBtn() {
  const btn = document.getElementById("scrollBtn");
  const ring = document.getElementById("ringFill");
  if (!btn) return;

  const circumference = 2 * Math.PI * 22;
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    btn.classList.toggle("show", scrollTop > 400);
    btn.classList.toggle("completed", progress >= 0.98);

    if (ring) {
      ring.style.strokeDashoffset = circumference * (1 - progress);
    }

    // Footer collision avoidance
    const footer = document.querySelector(".footer");
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
        btn.style.bottom = "2rem";
      }
    }
  };

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initCurrentYear() {
  document
    .querySelectorAll("[data-current-year], #Current-Year")
    .forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
}

/* ============================================================
   INIT
   ============================================================ */
function hasProjectGrid() {
  return Boolean(document.getElementById("projectGrid"));
}

document.addEventListener("DOMContentLoaded", async () => {
  readStateFromURL();

  initTheme();
  updateNavbar();
  initScrollBtn();
  fetchRepoStats();

  initCurrentYear();
  initFilterChips();
  initSearch();
  initSorting();
  initTechStackSearch();
  initClearAllFilters();

  try {
    // Await the projects to be fetched
    await loadProjects();

    syncProjectCounts();

    if (hasProjectGrid()) {
      loadBookmarksFromURL();

      renderGrid();
      renderBookmarks();
      renderRecentProjects();
    }

    syncProjectCounts();
    fetchRepoStats();
    initScrollBtn();
  } catch (error) {
    console.error("Failed to load projects:", error);

    const grid = document.getElementById("projectGrid");

    if (grid) {
      grid.innerHTML = `
        <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
          Failed to load projects. Please try refreshing the page.
        </div>
      `;
    }
  }
});

(() => {
  const initDirectMobileMenu = () => {
    const menuToggle = document.getElementById("menuToggle");
    const navButtons = document.getElementById("navButtons");

    if (!menuToggle || !navButtons) return;
    if (menuToggle.dataset.mobileNavBound === "true") return;
    menuToggle.dataset.mobileNavBound = "true";

    const closeMenu = () => {
      menuToggle.classList.remove("active");
      navButtons.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      menuToggle.classList.add("active");
      navButtons.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
      const firstLink = navButtons.querySelector("a, button");
      firstLink?.focus({ preventScroll: true });
    };

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (navButtons.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", (e) => {
      if (!navButtons.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navButtons.classList.contains("active")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    navButtons.addEventListener("click", (e) => {
      if (
        e.target.closest(".btn") ||
        e.target.closest("a") ||
        e.target.closest("button")
      ) {
        closeMenu();
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDirectMobileMenu);
  } else {
    initDirectMobileMenu();
  }
})();

// Re-render the grid when the browser window is resized to adapt pagination density instantly
window.addEventListener(
  "resize",
  debounce(() => {
    if (hasProjectGrid()) {
      renderGrid();
    }
  }, 180),
);

/* ============================================================
   EXPOSE FUNCTIONS TO GLOBAL SCOPE
   (Required for HTML onclick handlers)
   ============================================================ */
window.removeTechFilter = removeTechFilter;
window.clearAllTechFilters = clearAllTechFilters;

/* ============================================================
   THEME CORE ENGINE (Fixes Issue #4359)
   ============================================================ */
function initTheme() {
  window.ThemeManager?.init?.();
}

// Initialize the theme engine
initTheme();
// Custom cursor
(function () {
  const outerCursor = document.querySelector(".cursor-ring--outer");
  const innerCursor = document.querySelector(".cursor-ring--inner");
  if (!outerCursor || !innerCursor) return;

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (coarsePointer || prefersReducedMotion) {
    outerCursor.style.display = "none";
    innerCursor.style.display = "none";
    return;
  }

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
    outerCursor.classList.add("is-visible");
    innerCursor.classList.add("is-visible");
  };

  const hideCursor = () => {
    outerCursor.classList.remove("is-visible");
    innerCursor.classList.remove("is-visible");
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      showCursor();
    },
    { passive: true },
  );

  window.addEventListener("mouseleave", hideCursor);
  window.addEventListener("mouseenter", showCursor);

  requestAnimationFrame(update);
})();

// Particle Network Background
(function () {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
  const palette = [220, 250, 280];
  const DEFAULT_PARTICLE_FPS = 24;
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
    const largeScreen = window.innerWidth > 1280;

    return {
      minParticles: reducedMotion ? 8 : smallScreen ? 12 : 18,
      maxParticles: reducedMotion ? 18 : smallScreen ? 28 : 48,
      areaPerParticle: reducedMotion ? 110000 : smallScreen ? 70000 : 32000,
      linkDistance: reducedMotion ? 68 : smallScreen ? 84 : 100,
      velocity: reducedMotion ? 0.12 : smallScreen ? 0.18 : 0.24,
      radius: reducedMotion ? 1.8 : smallScreen ? 2.2 : 3.2,
      fps: reducedMotion ? 14 : smallScreen ? 20 : 24,
      showLinks: !reducedMotion && !smallScreen && largeScreen,
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
      Math.max(
        profile.minParticles,
        Math.round((W * H) / profile.areaPerParticle),
      ),
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
      canvas.style.display = "none";
      return;
    }

    canvas.style.display = "";
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
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handler);
      return;
    }
    if (typeof query.addListener === "function") {
      query.addListener(handler);
    }
  };

  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("visibilitychange", () => {
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
    search: params.get("search") || "",
    category: params.get("category") || "all",
  };
}

function updateURL(search, category) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category && category !== "all") params.set("category", category);
  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  history.pushState({ search, category }, "", newURL);
}

function restoreStateFromURL() {
  const { search, category } = getQueryParams();
  const searchInput =
    document.getElementById("searchInput") ||
    document.querySelector('input[type="text"]') ||
    document.querySelector(".search-input");
  if (searchInput && search) searchInput.value = search;
  const categoryFilter = document.getElementById("category");
  if (categoryFilter && category !== "all") categoryFilter.value = category;
  if (search || category !== "all") applyFilters(search, category);
}

function applyFilters(search, category) {
  searchQuery = search || "";
  activeFilter = category || "all";
  currentPage = 1;

  // Sync active chip selection with URL state
  const chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach((chip) => {
    if (chip.dataset.filter === activeFilter) {
      chip.classList.add("active");
    } else {
      chip.classList.remove("active");
    }
  });

  renderGrid();
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadProjects();
    restoreStateFromURL();
  } catch (error) {
    console.error("Failed to restore state or load projects:", error);
  }
  const searchInput =
    document.getElementById("search") ||
    document.querySelector('input[type="text"]') ||
    document.querySelector(".search-input");
  if (searchInput) {
    // Debounced so rapid typing doesn't trigger a renderGrid() on every keystroke
    searchInput.addEventListener(
      "input",
      debounce(() => {
        const { category } = getQueryParams();
        updateURL(searchInput.value, category);
        applyFilters(searchInput.value, category);
      }, 200),
    );
  }
  const categoryFilter = document.getElementById("category");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      const { search } = getQueryParams();
      updateURL(search, categoryFilter.value);
      applyFilters(search, categoryFilter.value);
    });
  }
  window.addEventListener("popstate", () => restoreStateFromURL());
});
