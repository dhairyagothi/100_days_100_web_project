const UI = {
  form: document.getElementById("searchForm") || document.querySelector(".modern-search-form"),
  input: document.getElementById("usernameInput") || document.querySelector(".search-input-container input"),
  statusBox: document.getElementById("statusBox") || document.querySelector(".status-banner"),
  profileCard: document.getElementById("profileCard"),
  metricsPanel: document.getElementById("metricsPanel"),
  reposSection: document.getElementById("reposSection"),
  reposList: document.getElementById("reposList"),
  themeToggle: document.getElementById("themeToggle"),
  themeIcon: document.getElementById("themeIcon"),
  offlineIndicator: document.getElementById("offlineIndicator"),
  exportPdfBtn: document.getElementById("exportPdfBtn"),
  compareForm: document.getElementById("compareForm"),
  compareA: document.getElementById("compareA"),
  compareB: document.getElementById("compareB"),
  comparisonPanel: document.getElementById("comparisonPanel"),
  comparisonContainer: document.getElementById("comparisonContainer")
};

const Nodes = {
  avatar: document.getElementById("avatar"),
  name: document.getElementById("name"),
  username: document.getElementById("username"),
  bio: document.getElementById("bio"),
  location: document.getElementById("location"),
  company: document.getElementById("company"),
  website: document.getElementById("website"),
  joined: document.getElementById("joined"),
  repoCount: document.getElementById("repoCount"),
  followers: document.getElementById("followers"),
  following: document.getElementById("following"),
  gists: document.getElementById("gists"),
  profileLink: document.getElementById("profileLink")
};

let searchResultsContainer = document.getElementById("searchResultsContainer");
if (!searchResultsContainer) {
  searchResultsContainer = document.createElement("div");
  searchResultsContainer.id = "searchResultsContainer";
  searchResultsContainer.style.cssText = `
    display: none;
    margin-top: 1rem;
    border-radius: var(--radius-md, 16px);
    overflow: hidden;
    background: var(--card);
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow);
  `;
  
  const targetWorkspace = document.querySelector(".search-workspace");
  if (targetWorkspace) {
    targetWorkspace.appendChild(searchResultsContainer);
  } else if (UI.form && UI.form.parentNode) {
    UI.form.parentNode.appendChild(searchResultsContainer);
  } else {
    document.body.appendChild(searchResultsContainer);
  }
}

const CACHE_DURATION = 300000;
let liveSearchDebounceTimer = null;

// Removed inlined worker and synthetic analytics to keep comparisons data-driven

class DataCacheEngine {
  static get(storageKey) {
    try {
      const entry = localStorage.getItem(`gh_dash_${storageKey}`);
      if (!entry) return null;
      
      const payload = JSON.parse(entry);
      if (Date.now() > payload.expiresAt) {
        localStorage.removeItem(`gh_dash_${storageKey}`);
        return null;
      }
      return payload.data;
    } catch (error) {
      return null;
    }
  }

  static set(storageKey, dataValue) {
    try {
      const payload = {
        data: dataValue,
        expiresAt: Date.now() + CACHE_DURATION
      };
      localStorage.setItem(`gh_dash_${storageKey}`, JSON.stringify(payload));
    } catch (error) {
      console.error("Cache serialization limit exceeded", error);
    }
  }
}

function syncNetworkStatus() {
  const isOnline = navigator.onLine;
  if (UI.offlineIndicator) {
    UI.offlineIndicator.classList.toggle("hidden", isOnline);
  }
  if (!isOnline && UI.statusBox) {
    showStatus("Offline state detected. Serving data exclusively from client memory layers.", "offline");
  } else if (isOnline && UI.statusBox && !UI.statusBox.classList.contains("hidden") && UI.statusBox.classList.contains("offline")) {
    hideStatus();
  }
}

function updateThemeIcon() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark" || !document.documentElement.hasAttribute("data-theme");
  if (UI.themeIcon) {
    UI.themeIcon.textContent = isDark ? "☀" : "☾";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }
  updateThemeIcon();
}

function showStatus(message, type = "success") {
  if (!UI.statusBox) return;
  UI.statusBox.textContent = message;
  UI.statusBox.className = `status-banner ${type}`;
  UI.statusBox.classList.remove("hidden");
}

function hideStatus() {
  if (UI.statusBox) UI.statusBox.classList.add("hidden");
}

function showLoading() {
  showStatus("Syncing workspace records and evaluating analytics models...", "success");
  document.body.classList.remove("compare-mode");
  if (UI.profileCard) UI.profileCard.classList.add("hidden");
  if (UI.metricsPanel) UI.metricsPanel.classList.add("hidden");
  if (UI.reposSection) UI.reposSection.classList.add("hidden");
  if (UI.comparisonPanel) UI.comparisonPanel.classList.add("hidden");
  searchResultsContainer.style.display = "none";
}

function showCompareLoading() {
  document.body.classList.add("compare-mode");
  if (UI.profileCard) UI.profileCard.classList.add("hidden");
  if (UI.metricsPanel) UI.metricsPanel.classList.add("hidden");
  if (UI.reposSection) UI.reposSection.classList.add("hidden");
  if (UI.comparisonPanel) UI.comparisonPanel.classList.remove("hidden");
  if (UI.comparisonContainer) {
    UI.comparisonContainer.innerHTML = `
      <div class="compare-loading-state" role="status" aria-live="polite">
        <div class="spinner" aria-hidden="true"></div>
        <div>
          <strong>Preparing comparison</strong>
          <p>Loading both profiles and repository summaries.</p>
        </div>
      </div>`;
  }
  UI.comparisonPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// computeMetricsForRepos removed — no derived/fake analytics required

async function fetchProfileData(username) {
  const cleanName = username.trim().replace(/^@/, "");

  if (!cleanName) {
    throw new Error("A GitHub username is required.");
  }

  const cachedProfile = DataCacheEngine.get(`profile_${cleanName}`);
  const cachedRepos = DataCacheEngine.get(`repos_${cleanName}`);

  if (cachedProfile && cachedRepos) {
    return { user: cachedProfile, repos: cachedRepos };
  }

  if (!navigator.onLine) {
    throw new Error(`Offline mode cannot fetch ${cleanName}.`);
  }

  const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanName)}`);
  if (!userResponse.ok) {
    throw new Error(`GitHub user not found: ${cleanName}`);
  }

  const user = await userResponse.json();
  const repoResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanName)}/repos?per_page=50&sort=updated`);
  const repos = await repoResponse.json();
  const verifiedRepos = Array.isArray(repos) ? repos : [];
  const sortedRepos = verifiedRepos.sort((alpha, beta) => beta.stargazers_count - alpha.stargazers_count).slice(0, 6);

  DataCacheEngine.set(`profile_${cleanName}`, user);
  DataCacheEngine.set(`repos_${cleanName}`, sortedRepos);

  return { user, repos: sortedRepos };
}

function buildRepoListSmall(repos) {
  if (!Array.isArray(repos) || repos.length === 0) {
    return '<div class="empty-state-inline">No repositories available.</div>';
  }

  return `
    <div class="repo-mini-list">
      ${repos.map((repo) => `
        <article class="repo-mini-card">
          <div class="repo-mini-title-row">
            <a class="repo-link" href="${repo.html_url}" target="_blank" rel="noreferrer">${repo.name}</a>
            <span class="repo-mini-stars">★ ${repo.stargazers_count}</span>
          </div>
          <p class="repo-mini-description">${safeText(repo.description, "No description provided.")}</p>
          <div class="repo-mini-meta">
            ${repo.language ? `<span class="badge-chip">${repo.language}</span>` : ""}
            <span class="badge-chip">Forks ${repo.forks_count}</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderComparisonCard(profileData, compareType, peerData) {
  const leadFollowers = profileData.user.followers > peerData.user.followers;
  const leadRepos = profileData.user.public_repos > peerData.user.public_repos;
  const primaryBadge = leadFollowers ? "Leader in followers" : leadRepos ? "Leader in repos" : "Balanced profile";
  return `
    <article class="compare-panel compare-panel-${compareType}">
      <div class="compare-panel-top">
        <div class="panel-head">
          <img src="${profileData.user.avatar_url}" alt="${profileData.user.login} avatar" loading="lazy" />
          <div class="compare-identity">
            <div class="compare-title-row">
              <strong class="compare-name">${safeText(profileData.user.name, profileData.user.login)}</strong>
              <span class="badge-strong">${primaryBadge}</span>
            </div>
            <p class="compare-handle">@${profileData.user.login}</p>
          </div>
        </div>
        <p class="compare-bio">${safeText(profileData.user.bio, "—")}</p>

        <div class="compare-badges">
          <span class="badge-chip ${leadRepos ? "badge-chip-accent" : ""}">Repos ${profileData.user.public_repos}</span>
          <span class="badge-chip ${leadFollowers ? "badge-chip-accent" : ""}">Followers ${profileData.user.followers}</span>
          <span class="badge-chip">Following ${profileData.user.following}</span>
          <span class="badge-chip">Joined ${formatDate(profileData.user.created_at)}</span>
        </div>

        <div class="compare-actions">
          <a class="compare-action-btn" href="${profileData.user.html_url}" target="_blank" rel="noreferrer">
            View GitHub Profile
          </a>
        </div>
      </div>
      
      <div class="compare-section">
        <div class="section-title-row">
          <h4>Top Repositories</h4>
          <span class="section-subtitle">Sorted by stars and update activity</span>
        </div>
        ${buildRepoListSmall(profileData.repos)}
      </div>
    </article>
  `;
}

function renderComparison(leftData, rightData) {
  if (!UI.comparisonContainer) return;

  document.body.classList.add("compare-mode");
  if (UI.profileCard) UI.profileCard.classList.add("hidden");
  if (UI.metricsPanel) UI.metricsPanel.classList.add("hidden");
  if (UI.reposSection) UI.reposSection.classList.add("hidden");

  UI.comparisonContainer.innerHTML = `
    ${renderComparisonCard(leftData, "left", rightData)}
    ${renderComparisonCard(rightData, "right", leftData)}
  `;

  UI.comparisonPanel?.classList.remove("hidden");
  UI.comparisonPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function safeText(value, fallback = "—") {
  return value && String(value).trim() ? value : fallback;
}

// Removed synthetic analytics chart rendering — charts are not populated here to keep UI simple

function animateCounter(element, targetValue) {
  if (!element) return;
  const target = parseInt(targetValue, 10) || 0;
  if (target === 0) {
    element.textContent = "0";
    return;
  }
  
  let start = 0;
  const duration = 1000;
  const startTime = performance.now();
  
  function updateNumber(currentTime) {
    const elapsedTime = currentTime - startTime;
    if (elapsedTime >= duration) {
      element.textContent = target.toLocaleString();
      return;
    }
    const progress = elapsedTime / duration;
    const easeOutQuad = progress * (2 - progress);
    const currentValue = Math.floor(easeOutQuad * target);
    element.textContent = currentValue.toLocaleString();
    requestAnimationFrame(updateNumber);
  }
  requestAnimationFrame(updateNumber);
}

function renderProfile(user, repos = []) {
  document.body.classList.remove("compare-mode");
  if (UI.comparisonPanel) UI.comparisonPanel.classList.add("hidden");
  Nodes.avatar.src = user.avatar_url;
  Nodes.avatar.alt = `${user.login} avatar`;
  Nodes.name.textContent = safeText(user.name, user.login);
  Nodes.username.textContent = `@${user.login}`;

  Nodes.bio.textContent = safeText(user.bio, "—");
  Nodes.location.textContent = safeText(user.location, "—");
  Nodes.company.textContent = safeText(user.company, "—");

  if (user.blog) {
    const blogUrl = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
    Nodes.website.innerHTML = `<a href="${blogUrl}" target="_blank" rel="noreferrer" class="repo-link">${user.blog.replace(/^https?:\/\//, "")}</a>`;
  } else {
    Nodes.website.textContent = "—";
  }

  Nodes.joined.textContent = formatDate(user.created_at);
  Nodes.profileLink.href = user.html_url;

  animateCounter(Nodes.repoCount, user.public_repos);
  animateCounter(Nodes.followers, user.followers);
  animateCounter(Nodes.following, user.following);
  animateCounter(Nodes.gists, user.public_gists);

  // Keep profile and metrics panels visible
  if (UI.profileCard) UI.profileCard.classList.remove("hidden");
  if (UI.metricsPanel) UI.metricsPanel.classList.remove("hidden");
}

function renderRepos(repos) {
  UI.reposList.innerHTML = "";

  if (!repos.length) {
    UI.reposList.innerHTML = `<div class="repo-card"><p class="repo-description">No active repositories mapped inside this execution ring.</p></div>`;
    if (UI.reposSection) UI.reposSection.classList.remove("hidden");
    return;
  }

  repos.forEach((repo) => {
    const card = document.createElement("article");
    card.className = "repo-card";
    
    const operationalIndex = repo.stargazers_count + (repo.forks_count * 2);
    const engineeringStatus = operationalIndex > 100 ? "Production System" : "Stable Archive";

    card.innerHTML = `
      <div class="repo-top">
        <h4 class="repo-name">
          <a class="repo-link" href="${repo.html_url}" target="_blank" rel="noreferrer">
            ${repo.name}
          </a>
        </h4>
        <span class="badge" style="margin:0; padding:2px 8px; font-size:0.7rem;">${engineeringStatus}</span>
      </div>
      <p class="repo-description">${repo.description || "No description."}</p>
      <div class="repo-meta">
        ${repo.language ? `<span class="pill">● ${repo.language}</span>` : ""}
        <span class="pill">★ ${repo.stargazers_count}</span>
        <span class="pill">⑂ ${repo.forks_count}</span>
        <span class="pill">Sync: ${formatDate(repo.updated_at)}</span>
      </div>
    `;
    UI.reposList.appendChild(card);
  });

  if (UI.reposSection) UI.reposSection.classList.remove("hidden");
}

function renderSearchResults(users) {
  searchResultsContainer.innerHTML = "";

  if (!users.length) {
    searchResultsContainer.style.display = "none";
    return;
  }

  const heading = document.createElement("p");
  heading.textContent = `${users.length} unique indices discovered. Select terminal connection:`;
  heading.style.cssText = "padding: 1rem; font-weight: 700; margin: 0; color: var(--muted); font-size: 0.9rem;";
  searchResultsContainer.appendChild(heading);

  users.forEach((user) => {
    const item = document.createElement("div");
    item.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-top: 1px solid var(--card-border);
      transition: background 0.2s;
      color: var(--text);
      font-weight: 600;
    `;
    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <img src="${user.avatar_url}" alt="${user.login}" style="width:28px;height:28px;border-radius:8px;object-fit:cover;">
        <span>${user.login}</span>
      </div>
      <span class="badge" style="margin:0; font-size:0.65rem;">Connect</span>
    `;
    item.addEventListener("mouseover", () => item.style.background = "var(--bg-secondary)");
    item.addEventListener("mouseout", () => item.style.background = "");
    item.addEventListener("click", () => {
      if (UI.input) UI.input.value = user.login;
      searchResultsContainer.style.display = "none";
      fetchUser(user.login);
    });
    searchResultsContainer.appendChild(item);
  });

  searchResultsContainer.style.display = "block";
}

async function executeTypeaheadLookup(queryString) {
  if (!navigator.onLine) return;
  const query = queryString.trim();
  if (query.length < 2) {
    searchResultsContainer.style.display = "none";
    return;
  }

  const typedCache = DataCacheEngine.get(`lookup_${query}`);
  if (typedCache) {
    renderSearchResults(typedCache);
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=5`);
    if (response.ok) {
      const searchData = await response.json();
      const outputItems = searchData.items || [];
      DataCacheEngine.set(`lookup_${query}`, outputItems);
      renderSearchResults(outputItems);
    }
  } catch (error) {
    console.error("Typeahead stream generation interrupted:", error);
  }
}

async function fetchUser(username) {
  const cleanName = username.trim().replace(/^@/, "");

  if (!cleanName) {
    showStatus("Operational exception parameter failure: target handle required.", "error");
    return;
  }

  showLoading();
  searchResultsContainer.style.display = "none";

  const cachedProfile = DataCacheEngine.get(`profile_${cleanName}`);
  const cachedRepos = DataCacheEngine.get(`repos_${cleanName}`);
  const cachedMetrics = DataCacheEngine.get(`metrics_${cleanName}`);

  if (cachedProfile && cachedRepos && cachedMetrics) {
    renderProfile(cachedProfile, cachedMetrics);
    renderRepos(cachedRepos);
    hideStatus();
    return;
  }

  if (!navigator.onLine) {
    if (UI.profileCard) UI.profileCard.classList.add("hidden");
    if (UI.metricsPanel) UI.metricsPanel.classList.add("hidden");
    if (UI.reposSection) UI.reposSection.classList.add("hidden");
    showStatus("Identity registry mapping unavailable while completely disconnected from remote tracking cluster.", "error");
    return;
  }

  try {
    const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanName)}`);

    if (userResponse.ok) {
      const user = await userResponse.json();
      const repoResponse = await fetch(
        `https://api.github.com/users/${encodeURIComponent(cleanName)}/repos?per_page=50&sort=updated`
      );
      const repos = await repoResponse.json();
      const verifiedRepos = Array.isArray(repos) ? repos : [];
      
      const sortedRepos = verifiedRepos
        .sort((alpha, beta) => beta.stargazers_count - alpha.stargazers_count)
        .slice(0, 6);

      DataCacheEngine.set(`profile_${cleanName}`, user);
      DataCacheEngine.set(`repos_${cleanName}`, sortedRepos);

      renderProfile(user, sortedRepos);
      renderRepos(sortedRepos);
      hideStatus();
    } else {
      const searchResponse = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(cleanName)}&per_page=10`
      );

      if (!searchResponse.ok) {
        throw new Error("Unable to parse identity coordinates over upstream paths.");
      }

      const searchData = await searchResponse.json();

      if (!searchData.items || searchData.items.length === 0) {
        throw new Error("No architectural records match search conditions.");
      }

      if (searchData.items.length === 1) {
        await fetchUser(searchData.items[0].login);
      } else {
        hideStatus();
        if (UI.profileCard) UI.profileCard.classList.add("hidden");
        if (UI.metricsPanel) UI.metricsPanel.classList.add("hidden");
        if (UI.reposSection) UI.reposSection.classList.add("hidden");
        renderSearchResults(searchData.items);
      }
    }
  } catch (error) {
    if (UI.profileCard) UI.profileCard.classList.add("hidden");
    if (UI.metricsPanel) UI.metricsPanel.classList.add("hidden");
    if (UI.reposSection) UI.reposSection.classList.add("hidden");
    searchResultsContainer.style.display = "none";
    showStatus(error.message || "An unexpected cluster mapping event occurred.", "error");
  }
}

if (UI.form) {
  UI.form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (UI.input) {
      fetchUser(UI.input.value);
    }
  });
}

if (UI.input) {
  UI.input.addEventListener("input", (event) => {
    clearTimeout(liveSearchDebounceTimer);
    liveSearchDebounceTimer = setTimeout(() => {
      executeTypeaheadLookup(event.target.value);
    }, 300);
  });
}

document.querySelectorAll(".tag-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!btn.dataset.user) return;
    if (UI.input) {
      UI.input.value = btn.dataset.user;
    }
    fetchUser(btn.dataset.user);
  });
});

document.addEventListener("click", (event) => {
  if (UI.form && !UI.form.contains(event.target) && !searchResultsContainer.contains(event.target)) {
    searchResultsContainer.style.display = "none";
  }
});

document.querySelectorAll(".workspace-tabs-nav .tab-nav-item").forEach(tabBtn => {
  tabBtn.addEventListener("click", () => {
    const activePaneId = tabBtn.getAttribute("data-pane");
    
    document.querySelectorAll(".workspace-tabs-nav .tab-nav-item").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    
    tabBtn.classList.add("active");
    const targetPane = document.getElementById(activePaneId);
    if (targetPane) targetPane.classList.add("active");
  });
});

if (UI.compareForm) {
  UI.compareForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const leftUsername = UI.compareA ? UI.compareA.value : "";
    const rightUsername = UI.compareB ? UI.compareB.value : "";

    if (!leftUsername.trim() || !rightUsername.trim()) {
      showStatus("Enter two GitHub usernames to compare.", "error");
      return;
    }

    hideStatus();
    showCompareLoading();

    try {
      const [leftData, rightData] = await Promise.all([
        fetchProfileData(leftUsername),
        fetchProfileData(rightUsername)
      ]);

      renderComparison(leftData, rightData);
    } catch (error) {
      document.body.classList.add("compare-mode");
      if (UI.profileCard) UI.profileCard.classList.add("hidden");
      if (UI.metricsPanel) UI.metricsPanel.classList.add("hidden");
      if (UI.reposSection) UI.reposSection.classList.add("hidden");
      if (UI.comparisonPanel) UI.comparisonPanel.classList.remove("hidden");
      if (UI.comparisonContainer) {
        UI.comparisonContainer.innerHTML = `<div class="status-banner error">${safeText(error.message, "Unable to compare profiles.")}</div>`;
      }
      UI.comparisonPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

document.querySelectorAll(".compare-tag-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const [leftUsername, rightUsername] = String(button.dataset.compare || "").split(",");
    if (UI.compareA) UI.compareA.value = leftUsername || "";
    if (UI.compareB) UI.compareB.value = rightUsername || "";
    UI.compareForm?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
});

// Export functionality removed — keep UI focused on fetched data only

if (UI.themeToggle) {
  UI.themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon();
  });
}

window.addEventListener("online", syncNetworkStatus);
window.addEventListener("offline", syncNetworkStatus);

initTheme();
syncNetworkStatus();