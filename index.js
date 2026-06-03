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
let itemsPerPage = 9;
let projectData = [];
let filteredProjectData = [];

/* ============================================================
   TECHNOLOGY STACK FILTERING VARIABLES
   ============================================================ */
let techStackFilters = []; 
let techSearchQuery = ""; 

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

const FILTER_CATEGORY_MAP = {
  all: "all",
  game: "Games",
  clone: "Clones",
  tool: "Tools",
  ui: "UI / Animation",
  api: "APIs",
};

function getCategoryFromTags(tags, name) {
  const tagStr = (Array.isArray(tags) ? tags.join(" ") : tags || "").toLowerCase();
  const nameStr = (name || "").toLowerCase();

  if (tagStr.includes("game")) return "Games";
  if (tagStr.includes("clone")) return "Clones";
  if (tagStr.includes("tool")) return "Tools";
  if (tagStr.includes("ui")) return "UI / Animation";
  if (tagStr.includes("api") || tagStr.includes("weather")) return "APIs";

  if (nameStr.includes("clone")) return "Clones";
  if (nameStr.includes("game") || nameStr.includes("puzzle") || nameStr.includes("quiz")) return "Games";

  return "Tools";
}

let PROJECTS = [];
let projectsPromise = null;

function hydrateProjects(data) {
  PROJECTS = data.map((project) => ({
    day: `Day ${project.projectNo}`,
    projectName: project.projectName,
    projectPath: project.projectPath,
    techStack: project.techStack,
    difficulty: project.difficulty,
    projectDesc: project.projectDesc,
  }));
}

function getPreloadedProjectsData() {
  return Array.isArray(window.PROJECTS_DATA) ? window.PROJECTS_DATA : null;
}

function parseProjectsData(payload) {
  try {
    return JSON.parse(payload);
  } catch (error) {
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
      const projectsUrl = new URL(`${base}projects.json`, window.location.href).toString();
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

loadProjects();

/* ============================================================
   PROJECT LINK RESOLUTION
   ============================================================ */
const SOURCE_ONLY_TAG = "source-only";

const EXTERNAL_DEMO_SOURCE_FOLDERS = {
  "Day 20": "public/EveSparks",
  "Day 115": "public/event-registration-system",
};

function isGithubTreeUrl(url) {
  return /^https:\/\/github\.com\/[^/]+\/[^/]+\/tree\/[^/]+\//i.test(String(url || "").trim());
}

function parseGithubTreePath(url) {
  const match = String(url || "").trim().match(/\/tree\/[^/]+\/(.+?)(?:\?|#|$)/);
  return match ? decodeURIComponent(match[1].replace(/\/$/, "")) : null;
}

function isSourceOnlyProject(day, tags) {
  if (day === "Day 13" || day === "Day 72") return true;
  const tagList = Array.isArray(tags) ? tags : String(tags || "").split(/\s+/).filter(Boolean);
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
  return (project && project.projectDesc) || "Explore this project to discover interactive functionality.";
}

function buildProjectCardHTML({ day, name, url, tags, category, isBookmarked = false, showDescription = true }) {
  const { demoUrl, sourceUrl, sourceOnly } = resolveProjectUrls(day, name, url, tags);
  const tagsArray = Array.isArray(tags)
    ? tags.filter((t) => t !== SOURCE_ONLY_TAG)
    : String(tags || "").split(/\s+/).filter((t) => t && t !== SOURCE_ONLY_TAG);
  const tagsHTML = tagsArray.map((t) => `<span class="tag">${t}</span>`).join("");
  const project = PROJECTS.find((p) => p.projectName === name);

  const description = getProjectDescription(project);
  const sourceOnlyBadge = sourceOnly ? '<span class="source-only-badge" title="Requires local server setup">Source only</span>' : "";
  const primaryLink = sourceOnly
    ? `<a href="${sourceUrl}" target="_blank" class="card-link open-project" data-id="${day}" rel="noopener noreferrer" onclick="event.stopPropagation()"><i class="fab fa-github"></i> Source</a>`
    : `<a href="${demoUrl}" target="_blank" class="card-link open-project" data-id="${day}" rel="noopener noreferrer" onclick="event.stopPropagation()">Demo <i class="fas fa-arrow-right"></i></a>`;
  const codeLink = sourceOnly ? "" : `<a href="${sourceUrl}" target="_blank" class="card-link view-code-link" rel="noopener noreferrer" onclick="event.stopPropagation()"><i class="fab fa-github"></i> Code</a>`;

  return {
    html: `
      <div class="card-meta">
          <span class="card-day">${day}</span>
          <span class="card-category-wrap">
            <span class="card-category">${category}</span>
            ${sourceOnlyBadge}
          </span>
      </div>
      <h3 class="card-name">${name}</h3>
      ${showDescription ? `<div class="card-description">${description}</div>` : ""}
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
    if (projectData) trackRecentProject(projectData);
    window.open(demoUrl, "_blank", "noopener");
  };
}

/* ============================================================
   TECHNOLOGY STACK FILTERING FUNCTIONS
   ============================================================ */
function normalizeTech(tech) {
  const lower = tech.toLowerCase().trim();
  return TECH_ALIASES[lower] || lower;
}

function matchesTechStack(projectTags) {
  if (techStackFilters.length === 0) return true;
  if (!projectTags) return false;

  const tagSet = new Set(
    (Array.isArray(projectTags) ? projectTags : String(projectTags).split(/\s+/))
      .map((t) => t.toLowerCase().trim())
      .filter(Boolean)
  );

  return techStackFilters.every((filter) => tagSet.has(filter.toLowerCase()));
}

function removeTechFilter(tech) {
  techStackFilters = techStackFilters.filter((t) => t !== tech);
  updateTechFilterDisplay();
  renderGrid();
}

function clearAllTechFilters() {
  techStackFilters = [];
  techSearchQuery = "";
  const input = document.getElementById("techStackSearch");
  if (input) input.value = "";
  updateTechFilterDisplay();
  renderGrid();
}

function updateTechFilterDisplay() {
  const container = document.getElementById("activeTechFilters");
  const tagsContainer = document.getElementById("techFilterTags");
  const clearBtn = document.getElementById("clearTechFilter");

  if (!container || !tagsContainer) return;
  if (clearBtn) clearBtn.style.display = techStackFilters.length > 0 ? "block" : "none";

  if (techStackFilters.length === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "flex";
  tagsContainer.innerHTML = techStackFilters
    .map((tech) => `
      <span class="tech-filter-tag">
        ${tech}
        <button onclick="removeTechFilter('${tech}')" aria-label="Remove ${tech} filter">
          <i class="fas fa-times"></i>
        </button>
      </span>
    `).join("");
}

function getAllTechnologies() {
  const techSet = new Set();
  PROJECTS.forEach((project) => {
    const tags = project.techStack;
    if (tags) {
      const tagArray = typeof tags === "string" ? tags.split(/\s+/).filter(Boolean) : tags;
      tagArray.forEach((tag) => techSet.add(tag.toLowerCase()));
    }
  });
  return Array.from(techSet).sort();
}

/* ============================================================
   BOOKMARK + RECENT SYSTEM
   ============================================================ */
let bookmarkedProjects = [];
let recentProjects = [];
const INITIAL_VISIBLE_ITEMS = 3;
const ONE_HOUR_MS = 60 * 60 * 1000;

try {
  bookmarkedProjects = JSON.parse(localStorage.getItem("bookmarkedProjects")) || [];
  recentProjects = JSON.parse(localStorage.getItem("recentProjects")) || [];
} catch (error) {
  console.warn("localStorage is not available or access is denied:", error.message);
}

let showAllBookmarks = false;
let showAllRecent = false;

function migrateRecentProjects() {
  if (recentProjects.length === 0) return;
  if (typeof recentProjects[0] === "object" && recentProjects[0].timestamp) return;

  recentProjects = recentProjects.map((project) => {
    if (Array.isArray(project)) {
      return {
        day: project[0],
        name: project[1],
        url: project[2],
        tags: project[3],
        timestamp: Date.now() - ONE_HOUR_MS / 2,
      };
    }
    return project;
  });
  localStorage.setItem("recentProjects", JSON.stringify(recentProjects));
}

migrateRecentProjects();

function cleanupExpiredRecentProjects() {
  const initialLength = recentProjects.length;
  recentProjects = getRecentProjectsWithinWindow();

  if (recentProjects.length !== initialLength) {
    localStorage.setItem("recentProjects", JSON.stringify(recentProjects));
    renderRecentProjects();
  }
}

setInterval(cleanupExpiredRecentProjects, 5 * 60 * 1000);

const CATEGORY_LABEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

/* ============================================================
   GITHUB REPO STATS
   ============================================================ */
async function fetchRepoStats() {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  try {
    set("starCount", "Loading...");
    set("forkCount", "Loading...");
    set("issueCount", "Loading...");
    set("prCount", "Loading...");

    const [repoRes, prRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}`),
      fetch(`https://api.github.com/search/issues?q=repo:${window.REPO_OWNER}/${window.REPO_NAME}+type:pr+state:open`),
    ]);

    if (!repoRes.ok || !prRes.ok) throw new Error("GitHub API request failed");

    const repo = await repoRes.json();
    const prs = await prRes.json();

    set("starCount", repo.stargazers_count.toLocaleString());
    set("forkCount", repo.forks_count.toLocaleString());
    set("issueCount", Math.max(0, repo.open_issues_count - prs.total_count).toLocaleString());
    set("prCount", prs.total_count.toLocaleString());
  } catch (e) {
    console.warn("GitHub stats unavailable:", e.message);
    set("starCount", "N/A"); set("forkCount", "N/A"); set("issueCount", "N/A"); set("prCount", "N/A");
  }
}

function generateReadme() {
  try {
    const lines = ["# 100 Days · 100 Web Projects", "A curated archive of frontend experiments — browse, fork, contribute.", "", "## Projects"];
    PROJECTS.forEach((project) => {
      const { demoUrl } = resolveProjectUrls(project.day, project.projectName, project.projectPath, project.techStack);
      const category = getCategoryFromTags(project.techStack, project.projectName);
      lines.push(`- **${project.day} — ${project.projectName}** — ${demoUrl} — _${category}_`);
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
   RENDER PROJECT GRID & UNIFIED URL PERSISTENCE SYSTEM
   ============================================================ */
let activeFilter = "all";
let searchQuery = "";
let sortOption = "default";
let techStackFilter = "all";
let difficultyFilter = "all";

function syncStateToURL() {
  const url = new URL(window.location);

  if (searchQuery) url.searchParams.set("search", searchQuery);
  else url.searchParams.delete("search");

  if (activeFilter && activeFilter !== "all") url.searchParams.set("category", activeFilter);
  else url.searchParams.delete("category");

  if (currentPage > 1) url.searchParams.set("page", currentPage);
  else url.searchParams.delete("page");

  if (bookmarkedProjects.length > 0) {
    const bookmarkIds = bookmarkedProjects.map((p) => normalizeProjectEntry(p).day);
    url.searchParams.set("bookmarks", bookmarkIds.join(","));
  } else {
    url.searchParams.delete("bookmarks");
  }

  window.history.replaceState({}, "", url);
}

function readStateFromURL() {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("search")) {
    searchQuery = urlParams.get("search");
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = searchQuery;
  }

  if (urlParams.has("category")) {
    activeFilter = urlParams.get("category");
  }

  if (urlParams.has("page")) {
    const page = parseInt(urlParams.get("page"), 10);
    if (!isNaN(page) && page > 0) currentPage = page;
  }
}

function renderGrid() {
  const grid = document.getElementById("projectGrid");
  const noResults = document.getElementById("noResults");
  if (!grid) return;

  if (typeof updateClearFiltersBtnVisibility === "function") {
    updateClearFiltersBtnVisibility();
  }

  const filtered = PROJECTS.filter((project) => {
    const day = project.day;
    const name = project.projectName;
    const tags = project.techStack;
    const difficulty = project.difficulty || "";

    const category = getCategoryFromTags(tags, name);
    const targetCategory = FILTER_CATEGORY_MAP[activeFilter] || "all";
    const matchesFilter = activeFilter === "all" || category === targetCategory;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || q.split(/\s+/).every((term) => 
      name.toLowerCase().includes(term) ||
      day.toLowerCase().includes(term) ||
      (Array.isArray(tags) ? tags.join(" ") : tags || "").toLowerCase().includes(term)
    );

    let matchesTech = true;
    if (techStackFilter && techStackFilter !== "all") {
      const tagStr = (Array.isArray(tags) ? tags.join(" ") : tags || "").toLowerCase();
      matchesTech = tagStr.includes(techStackFilter.toLowerCase());
    }

    let matchesDifficulty = true;
    if (difficultyFilter && difficultyFilter !== "all") {
      matchesDifficulty = difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    }

    return matchesFilter && matchesSearch && matchesTech && matchesDifficulty;
  });

  if (sortOption === "az") {
    filtered.sort((a, b) => a.projectName.localeCompare(b.projectName));
  } else if (sortOption === "latest") {
    filtered.sort((a, b) => parseInt(b.day.replace("Day ", "")) - parseInt(a.day.replace("Day ", "")));
  } else if (sortOption === "difficulty") {
    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
    filtered.sort((a, b) => (difficultyOrder[a.difficulty?.toLowerCase()] || 0) - (difficultyOrder[b.difficulty?.toLowerCase()] || 0));
  }

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.style.display = "none";
    if (noResults) noResults.style.display = "block";
    const container = document.getElementById("paginationContainer");
    if (container) container.remove();
    return;
  }

  grid.style.display = "grid";
  if (noResults) noResults.style.display = "none";

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = filtered.slice(startIndex, endIndex);
  const fragment = document.createDocumentFragment();

  pageItems.forEach((project) => {
    const isBookmarked = bookmarkedProjects.some((item) => normalizeProjectEntry(item).day === project.day);
    const category = getCategoryFromTags(project.techStack, project.projectName);
    
    const card = document.createElement("div");
    const { html, demoUrl, sourceOnly } = buildProjectCardHTML({
      day: project.day,
      name: project.projectName,
      url: project.projectPath,
      tags: project.techStack,
      category,
      isBookmarked,
      showDescription: true,
    });

    card.className = sourceOnly ? "project-card source-only visible" : "project-card visible";
    card.innerHTML = html;
    attachProjectCardInteraction(card, demoUrl, project);
    fragment.appendChild(card);
  });
  
  grid.appendChild(fragment);
  renderPagination(filtered.length, totalPages);
  syncStateToURL();
}

function renderPagination(totalItems, totalPages) {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;

  let container = document.getElementById("paginationContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "paginationContainer";
    container.className = "pagination-container";
  }

  container.innerHTML = "";
  if (totalPages <= 1) {
    if (container.parentElement === grid) grid.removeChild(container);
    return;
  }

  const infoDiv = document.createElement("div");
  infoDiv.className = "pagination-info";
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  infoDiv.innerHTML = `Showing <strong>${startItem}</strong> to <strong>${endItem}</strong> of <strong>${totalItems}</strong> projects`;
  container.appendChild(infoDiv);

  const controlsDiv = document.createElement("div");
  controlsDiv.className = "pagination-controls";

  const makeNavBtn = (label, disabled, targetPage) => {
    const btn = document.createElement("button");
    btn.innerHTML = label;
    btn.disabled = disabled;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPage !== targetPage) {
        currentPage = targetPage;
        renderGrid();
        setTimeout(() => scrollToProjectSection(), 50);
      }
    });
    return btn;
  };

  controlsDiv.appendChild(makeNavBtn("⏮ First", currentPage === 1, 1));
  controlsDiv.appendChild(makeNavBtn('<i class="fas fa-chevron-left"></i>', currentPage === 1, currentPage - 1));

  let startPage = 1, endPage = totalPages, maxVisible = 4;
  if (totalPages > maxVisible) {
    if (currentPage <= 2) { startPage = 1; endPage = 4; }
    else if (currentPage >= totalPages - 1) { startPage = totalPages - 3; endPage = totalPages; }
    else { startPage = currentPage - 1; endPage = currentPage + 2; }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = `page-num ${currentPage === i ? "active" : ""}`;
    pageBtn.textContent = i;
    pageBtn.setAttribute("aria-label", `Page ${i}`);
    pageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderGrid();
      setTimeout(() => scrollToProjectSection(), 50);
    });
    controlsDiv.appendChild(pageBtn);
  }

  controlsDiv.appendChild(makeNavBtn('<i class="fas fa-chevron-right"></i>', currentPage === totalPages, currentPage + 1));
  controlsDiv.appendChild(makeNavBtn("Last ⏭", currentPage === totalPages, totalPages));

  container.appendChild(controlsDiv);
  grid.appendChild(container);
}

function scrollToProjectSection() {
  const header = document.querySelector(".projects-header");
  if (!header || header.getBoundingClientRect().top < window.innerHeight) return;

  const navbar = document.querySelector(".navbar");
  const offset = navbar ? navbar.offsetHeight - 50 : 30;
  const targetY = header.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: targetY, behavior: "smooth" });
}

function toggleBookmark(project) {
  const exists = bookmarkedProjects.find((item) => normalizeProjectEntry(item).day === project.day);

  if (exists) {
    bookmarkedProjects = bookmarkedProjects.filter((item) => normalizeProjectEntry(item).day !== project.day);
    showToast("Bookmark removed");
  } else {
    bookmarkedProjects.push(project);
    showToast("Project bookmarked");
  }

  try {
    localStorage.setItem("bookmarkedProjects", JSON.stringify(bookmarkedProjects));
  } catch (error) {
    console.warn("Could not save bookmark due to localStorage restrictions");
  }
  
  renderBookmarks();
  renderGrid();
  syncStateToURL();
}

function loadBookmarksFromURL() {
  const params = new URLSearchParams(window.location.search);
  const bookmarkParam = params.get("bookmarks");
  if (!bookmarkParam) return;

  const bookmarkIds = bookmarkParam.split(",").map((id) => id.trim());
  bookmarkedProjects = PROJECTS.filter((project) => bookmarkIds.includes(project.day));
  localStorage.setItem("bookmarkedProjects", JSON.stringify(bookmarkedProjects));
}

function getRecentProjectsWithinWindow() {
  const now = Date.now();
  return recentProjects.filter((item) => (item.timestamp || Date.now()) >= now - ONE_HOUR_MS);
}

function trackRecentProject(project) {
  let projectObj = Array.isArray(project) ? {
    day: project[0], name: project[1], url: project[2], tags: project[3], timestamp: Date.now()
  } : { ...project, timestamp: Date.now() };

  recentProjects = recentProjects.filter((item) => item.day !== projectObj.day);
  recentProjects.unshift(projectObj);
  if (recentProjects.length > 20) recentProjects.pop();

  try {
    localStorage.setItem("recentProjects", JSON.stringify(recentProjects));
  } catch (error) {
    console.warn("Could not save recent projects due to localStorage restrictions");
  }
  renderRecentProjects();
}

const bookmarkGrid = document.getElementById("bookmarkGrid");

function normalizeProjectEntry(project) {
  if (Array.isArray(project)) {
    return { day: project[0], name: project[1], url: project[2], tags: project[3] };
  }
  return {
    day: project.day,
    name: project.projectName || project.name,
    url: project.projectPath || project.url,
    tags: project.techStack || project.tags,
  };
}

function renderBookmarks() {
  if (!bookmarkGrid) return;
  bookmarkGrid.innerHTML = "";

  if (bookmarkedProjects.length === 0) {
    bookmarkGrid.innerHTML = `<p class="empty-state">No bookmarked projects yet.</p>`;
    return;
  }

  const bookmarkToggleBtn = document.getElementById("bookmarkToggleBtn");
  if (bookmarkToggleBtn) {
    bookmarkToggleBtn.style.display = bookmarkedProjects.length <= INITIAL_VISIBLE_ITEMS ? "none" : "inline-flex";
  }

  const visibleBookmarks = showAllBookmarks ? bookmarkedProjects : bookmarkedProjects.slice(0, INITIAL_VISIBLE_ITEMS);

  visibleBookmarks.forEach((project) => {
    const { day, name, url, tags } = normalizeProjectEntry(project);
    if (!day || !name) return;

    const category = getCategoryFromTags(tags, name);
    const card = document.createElement("div");
    const { html, demoUrl, sourceOnly } = buildProjectCardHTML({
      day, name, url, tags, category, isBookmarked: true, showDescription: true
    });

    card.className = sourceOnly ? "project-card source-only visible" : "project-card visible";
    card.innerHTML = html;
    attachProjectCardInteraction(card, demoUrl, project);
    bookmarkGrid.appendChild(card);
  });
}

const recentGrid = document.getElementById("recentGrid");

function renderRecentProjects() {
  if (!recentGrid) return;
  recentGrid.innerHTML = "";

  const validRecent = getRecentProjectsWithinWindow();
  if (validRecent.length === 0) {
    recentGrid.innerHTML = `<p class="empty-state">No recently viewed projects within the last hour.</p>`;
    return;
  }

  const recentToggleBtn = document.getElementById("recentToggleBtn");
  if (recentToggleBtn) {
    recentToggleBtn.style.display = validRecent.length <= INITIAL_VISIBLE_ITEMS ? "none" : "inline-flex";
  }

  const visibleRecent = showAllRecent ? validRecent : validRecent.slice(0, INITIAL_VISIBLE_ITEMS);

  visibleRecent.forEach((projectObj) => {
    const day = projectObj.day || projectObj[0];
    const name = projectObj.projectName || projectObj.name || projectObj[1];
    const url = projectObj.projectPath || projectObj.url || projectObj[2];
    const tags = projectObj.techStack || projectObj.tags || projectObj[3];

    const category = getCategoryFromTags(tags, name);
    const card = document.createElement("div");
    const isBookmarked = bookmarkedProjects.some((item) => normalizeProjectEntry(item).day === day);
    const { html, demoUrl, sourceOnly } = buildProjectCardHTML({
      day, name, url, tags, category, isBookmarked, showDescription: true
    });

    card.className = sourceOnly ? "project-card source-only visible" : "project-card visible";
    card.innerHTML = html;
    attachProjectCardInteraction(card, demoUrl, projectObj);
    recentGrid.appendChild(card);
  });
}

cleanupExpiredRecentProjects();

/* ============================================================
   VIEW ALL TOGGLES
   ============================================================ */
const bookmarkToggleBtn = document.getElementById("bookmarkToggleBtn");
const recentToggleBtn = document.getElementById("recentToggleBtn");
const copyBookmarksBtn = document.getElementById("copyBookmarksBtn");

if (bookmarkToggleBtn) {
  bookmarkToggleBtn.addEventListener("click", () => {
    showAllBookmarks = !showAllBookmarks;
    bookmarkToggleBtn.textContent = showAllBookmarks ? "Show Less" : "View All";
    renderBookmarks();
  });
}

if (copyBookmarksBtn) {
  copyBookmarksBtn.addEventListener("click", async () => {
    if (bookmarkedProjects.length === 0) {
      showToast("No bookmarks to copy!");
      return;
    }
    const textToCopy = bookmarkedProjects
      .map((p) => {
        const { day, name, url, tags } = normalizeProjectEntry(p);
        const { demoUrl } = resolveProjectUrls(day, name, url, tags);
        const projectLink = demoUrl.startsWith("http") ? demoUrl : new URL(demoUrl, window.location.href).href;
        return `${name} - ${projectLink}`;
      }).join("\n");

    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast("Bookmarks copied to clipboard!");
    } catch (err) {
      showToast("Failed to copy bookmarks.");
    }
  });
}

if (recentToggleBtn) {
  recentToggleBtn.addEventListener("click", () => {
    showAllRecent = !showAllRecent;
    recentToggleBtn.textContent = showAllRecent ? "Show Less" : "View All";
    renderRecentProjects();
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

document.addEventListener("click", (e) => {
  const bookmarkBtn = e.target.closest(".bookmark-btn");
  if (!bookmarkBtn) return;
  e.preventDefault();
  const project = PROJECTS.find((item) => item.day === bookmarkBtn.dataset.id);
  if (project) toggleBookmark(project);
});

document.addEventListener("click", (e) => {
  const projectLink = e.target.closest(".open-project");
  if (!projectLink) return;
  const project = PROJECTS.find((item) => item.day === projectLink.dataset.id);
  if (project) trackRecentProject(project);
});

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

  btn.style.display = (hasSearch || hasTech || hasDiff || hasCategory) ? "inline-flex" : "none";
}

function resetAllFilters() {
  const chips = document.querySelectorAll(".chip[data-filter]");
  chips.forEach((c) => c.classList.remove("active"));
  const allChip = document.getElementById("filterAll") || document.querySelector('.chip[data-filter="all"]');
  if (allChip) allChip.classList.add("active");
  activeFilter = "all";

  const input = document.getElementById("searchInput");
  if (input) input.value = "";
  searchQuery = "";

  const techStack = document.getElementById("techStackFilter");
  if (techStack) techStack.value = "all";
  techStackFilter = "all";

  const difficultyElement = document.getElementById("difficultyFilter");
  if (difficultyElement) difficultyElement.value = "all";
  difficultyFilter = "all";

  const sortSelect = document.getElementById("sortProjects");
  if (sortSelect) sortSelect.value = "default";
  sortOption = "default";

  currentPage = 1;
  renderGrid();
  syncProjectCounts();
  showToast("Filters cleared!");
}

function initClearAllFilters() {
  const btn = document.getElementById("clearAllFiltersBtn");
  if (btn) btn.addEventListener("click", resetAllFilters);
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
  });
}

/* ============================================================
   LIVE SEARCH & DEBOUNCE UTILITY
   ============================================================ */
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  input.addEventListener("input", debounce(() => {
    searchQuery = input.value.trim();
    currentPage = 1;
    renderGrid();
  }, 180));

  const techStack = document.getElementById("techStackFilter");
  if (techStack) {
    techStack.addEventListener("change", () => {
      techStackFilter = techStack.value;
      currentPage = 1;
      renderGrid();
    });
  }

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

function initTechStackSearch() {
  const input = document.getElementById("techStackSearch");
  const clearBtn = document.getElementById("clearTechFilter");
  if (!input) return;

  input.addEventListener("input", debounce((e) => {
    const value = e.target.value.trim().toLowerCase();
    if (value) {
      const techs = value.split(/[,\s]+/).filter(Boolean);
      techStackFilters = [...new Set(techs)];
      updateTechFilterDisplay();
      currentPage = 1;
      renderGrid();
    } else {
      clearAllTechFilters();
    }
  }, 300));

  if (clearBtn) clearBtn.addEventListener("click", clearAllTechFilters);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") { e.preventDefault(); input.blur(); }
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
    if (key !== "all") counts[key] = 0;
  }

  PROJECTS.forEach((project) => {
    const category = getCategoryFromTags(project.techStack, project.projectName);
    const filterKey = Object.keys(FILTER_CATEGORY_MAP).find((key) => FILTER_CATEGORY_MAP[key] === category);
    if (filterKey && filterKey !== "all") counts[filterKey]++;
  });

  const categorySpans = {
    game: document.getElementById("gameCount"),
    clone: document.getElementById("cloneCount"),
    tool: document.getElementById("toolCount"),
    ui: document.getElementById("uiCount"),
    api: document.getElementById("apiCount"),
  };

  for (const [key, span] of Object.entries(categorySpans)) {
    if (span) span.textContent = counts[key].toLocaleString();
  }
}

function syncProjectCounts() {
  let filtered = [...PROJECTS];
  if (searchQuery) {
    filtered = filtered.filter((p) => 
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.day.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const total = filtered.length.toLocaleString();
  const countNodes = [document.getElementById("projectCount"), document.getElementById("allCount")];
  countNodes.forEach((node) => { if (node) node.textContent = total; });

  if (searchInput) searchInput.placeholder = `Search ${PROJECTS.length.toLocaleString()} projects…`;
  updateCategoryCounts();
}

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

syncProjectCounts();

/* ============================================================
   SCROLL TO TOP WITH RING FILL
   ============================================================ */
function initScrollBtn() {
  const btn = document.getElementById("scrollBtn");
  const ring = document.getElementById("ringFill");
  if (!btn) return;

  const circumference = 2 * Math.PI * 22;
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    btn.classList.toggle("show", scrollTop > 400);
    btn.classList.toggle("completed", progress >= 0.98);

    if (ring) ring.style.strokeDashoffset = circumference * (1 - progress);

    const footer = document.querySelector(".footer");
    if (footer) {
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (footerRect.top < windowHeight) {
        const maxOverlap = Math.min(windowHeight - footerRect.top, 120);
        btn.style.bottom = `calc(2rem + ${maxOverlap}px)`;
      } else {
        btn.style.bottom = "2rem";
      }
    }
  };

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

function initCurrentYear() {
  document.querySelectorAll("[data-current-year], #Current-Year").forEach((node) => {
    node.textContent = "2026";
  });
}

function hasProjectGrid() {
  return Boolean(document.getElementById("projectGrid"));
}

/* ============================================================
   UNIFIED APP LIFECYCLE INITIALIZER
   ============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
  readStateFromURL();
  initScrollBtn();
  initCurrentYear();
  initFilterChips();
  initSearch();
  initSorting();
  initTechStackSearch();
  initClearAllFilters();

  try {
    await loadProjects();
    syncProjectCounts();

    if (hasProjectGrid()) {
      loadBookmarksFromURL();
      renderGrid();
      renderBookmarks();
      renderRecentProjects();
    }

    fetchRepoStats();
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

window.addEventListener("resize", debounce(() => {
  if (hasProjectGrid()) renderGrid();
}, 180));

window.removeTechFilter = removeTechFilter;
window.clearAllTechFilters = clearAllTechFilters;

/* ============================================================
   CUSTOM INTERACTIVE CURSOR ENGINE
   ============================================================ */
(function () {
  const outerCursor = document.querySelector(".cursor-ring--outer");
  const innerCursor = document.querySelector(".cursor-ring--inner");
  if (!outerCursor || !innerCursor) return;

  let isKeyboardNavigating = false;

  const getActivationState = () => {
    let cursorEnabled = true;
    try {
      cursorEnabled = localStorage.getItem("customCursorEnabled") !== "false";
    } catch (_) {}
    return cursorEnabled && !window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const updateCursorActivationState = () => {
    if (getActivationState() && !isKeyboardNavigating) {
      document.body.classList.add("custom-cursor-active");
    } else {
      document.body.classList.remove("custom-cursor-active");
      outerCursor.classList.remove("is-visible");
      innerCursor.classList.remove("is-visible");
    }
  };

  window.updateCustomCursorState = updateCursorActivationState;

  const target = { x: 0, y: 0 }, current = { x: 0, y: 0 }, speed = 0.18;

  const update = () => {
    if (getActivationState() && !isKeyboardNavigating) {
      current.x += (target.x - current.x) * speed;
      current.y += (target.y - current.y) * speed;
      outerCursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      innerCursor.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(update);
  };

  const showCursor = () => {
    if (getActivationState() && !isKeyboardNavigating) {
      outerCursor.classList.add("is-visible");
      innerCursor.classList.add("is-visible");
    }
  };

  window.addEventListener("mousemove", (e) => {
    target.x = e.clientX; target.y = e.clientY;
    if (isKeyboardNavigating) { isKeyboardNavigating = false; updateCursorActivationState(); }
    showCursor();
  }, { passive: true });

  window.addEventListener("mouseleave", () => { outerCursor.classList.remove("is-visible"); innerCursor.classList.remove("is-visible"); });
  window.addEventListener("mouseenter", showCursor);
  window.addEventListener("keydown", (e) => { if (e.key === "Tab") { isKeyboardNavigating = true; updateCursorActivationState(); } });

  const hoverTargets = 'a, button, [role="button"], input, select, .chip, .project-card, .bookmark-btn';
  document.addEventListener("mouseover", (e) => {
    if (!getActivationState() || isKeyboardNavigating) return;
    if (e.target.closest(hoverTargets)) {
      outerCursor.style.borderColor = "rgba(59, 130, 246, 1)";
      outerCursor.style.boxShadow = "0 0 18px rgba(59, 130, 246, 0.6)";
      outerCursor.style.width = "52px"; outerCursor.style.height = "52px";
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (!getActivationState() || isKeyboardNavigating) return;
    if (e.target.closest(hoverTargets)) {
      outerCursor.style.borderColor = "rgba(59, 130, 246, 0.7)";
      outerCursor.style.boxShadow = "0 0 12px rgba(59, 130, 246, 0.35)";
      outerCursor.style.width = "36px"; outerCursor.style.height = "36px";
    }
  });

  updateCursorActivationState();
  requestAnimationFrame(update);
})();

/* ============================================================
   BACKGROUND PARTICLE NETWORK
   ============================================================ */
(function () {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
  const palette = [220, 250, 280];
  let W = 0, H = 0, dpr = 1, particles = [], particleCount = 0, linkDistance = 0, maxDistanceSq = 0, frameInterval = 1000 / 24, animationFrame = 0, lastFrameTime = 0;

  const getProfile = () => {
    const smallScreen = window.innerWidth <= 768 || coarsePointerQuery.matches;
    const reducedMotion = reducedMotionQuery.matches;
    return {
      minParticles: reducedMotion ? 8 : smallScreen ? 12 : 18,
      maxParticles: reducedMotion ? 18 : smallScreen ? 28 : 48,
      areaPerParticle: reducedMotion ? 110000 : smallScreen ? 70000 : 32000,
      linkDistance: reducedMotion ? 68 : smallScreen ? 84 : 100,
      velocity: reducedMotion ? 0.12 : smallScreen ? 0.18 : 0.24,
      radius: reducedMotion ? 1.8 : smallScreen ? 2.2 : 3.2,
      fps: reducedMotion ? 14 : smallScreen ? 20 : 24,
      showLinks: !reducedMotion && !smallScreen && window.innerWidth > 1280,
      disableAnimation: smallScreen || reducedMotion,
    };
  };

  let profile = getProfile();

  function resize() {
    profile = getProfile(); W = window.innerWidth; H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, profile.showLinks ? 1.5 : 1);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particleCount = Math.min(profile.maxParticles, Math.max(profile.minParticles, Math.round((W * H) / profile.areaPerParticle)));
    linkDistance = profile.linkDistance; maxDistanceSq = linkDistance * linkDistance;
    frameInterval = 1000 / profile.fps;
  }

  function init() {
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * profile.velocity, vy: (Math.random() - 0.5) * profile.velocity,
      r: Math.random() * profile.radius + 0.8, hue: palette[Math.floor(Math.random() * palette.length)],
      alpha: Math.random() * 0.45 + 0.18,
    }));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;
    });

    if (profile.showLinks) {
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= maxDistanceSq) continue;
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${(1 - Math.sqrt(distSq) / linkDistance) * 0.22})`;
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 72%, ${p.alpha})`; ctx.fill();
    });
  }

  function draw(now = 0) {
    animationFrame = requestAnimationFrame(draw);
    if (document.hidden || now - lastFrameTime < frameInterval) return;
    lastFrameTime = now; drawFrame();
  }

  const rebuild = () => {
    resize();
    if (profile.disableAnimation) {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0; ctx.clearRect(0, 0, W, H); canvas.style.display = "none";
      return;
    }
    canvas.style.display = ""; init();
    if (!animationFrame) animationFrame = requestAnimationFrame(draw);
  };

  window.addEventListener("resize", debounce(rebuild, 150), { passive: true });
  rebuild();
})();