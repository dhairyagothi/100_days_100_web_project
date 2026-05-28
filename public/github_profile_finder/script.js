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
  exportPdfBtn: document.getElementById("exportPdfBtn")
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

const workerScript = `
  self.onmessage = function(e) {
    const repositories = e.data;
    const distribution = {};
    const metricsMapping = [];
    let accumulatedStars = 0;
    let totalForks = 0;

    repositories.forEach(repo => {
      accumulatedStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      if (repo.language) {
        distribution[repo.language] = (distribution[repo.language] || 0) + 1;
      }
      metricsMapping.push({
        name: repo.name,
        stars: repo.stargazers_count,
        forks: repo.forks_count
      });
    });

    const totalLanguagesCount = Object.values(distribution).reduce((a, b) => a + b, 0);
    const formattedDistribution = Object.entries(distribution).map(([lang, count]) => ({
      language: lang,
      percentage: Math.round((count / totalLanguagesCount) * 100)
    })).sort((a, b) => b.percentage - a.percentage);

    const topLanguages = formattedDistribution.slice(0, 3).map(node => node.language);

    self.postMessage({
      languages: topLanguages,
      distribution: formattedDistribution.slice(0, 4),
      rawMetrics: metricsMapping.slice(0, 4),
      stars: accumulatedStars,
      forks: totalForks
    });
  };
`;

const blob = new Blob([workerScript], { type: "application/javascript" });
const metricsWorker = new Worker(URL.createObjectURL(blob));

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
  if (UI.profileCard) UI.profileCard.classList.add("hidden");
  if (UI.metricsPanel) UI.metricsPanel.classList.add("hidden");
  if (UI.reposSection) UI.reposSection.classList.add("hidden");
  searchResultsContainer.style.display = "none";
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

function computeAccountHealthIndex(user, metrics) {
  const repoFactor = user.public_repos * 1.5;
  const tractionFactor = (metrics.stars * 2.5) + (metrics.forks * 1.2);
  const networkFactor = user.followers * 0.8;
  const matrixScore = Math.min(100, Math.round((repoFactor + tractionFactor + networkFactor) / 12));
  
  if (matrixScore > 75) return "Enterprise Authority";
  if (matrixScore > 40) return "Core Contributor";
  return "Active Developer";
}

function renderVisualInsightsCharts(metrics) {
  const langContainer = document.getElementById("languageDistributionChart");
  const tractionContainer = document.getElementById("systemTractionChart");
  
  if (langContainer) {
    langContainer.innerHTML = "";
    if (metrics.distribution.length === 0) {
      langContainer.innerHTML = '<span class="meta-output" style="text-align:left;">Insufficient environment distribution metrics.</span>';
    } else {
      metrics.distribution.forEach(item => {
        const layoutRow = document.createElement("div");
        layoutRow.style.cssText = "display:flex; flex-direction:column; gap:4px; width:100%;";
        layoutRow.innerHTML = `
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600;">
            <span>${item.language}</span>
            <span class="user-handle">${item.percentage}%</span>
          </div>
          <div style="width:100%; height:6px; background:var(--bg-secondary); border-radius:99px; overflow:hidden;">
            <div style="width:${item.percentage}%; height:100%; background:var(--accent); border-radius:99px;"></div>
          </div>
        `;
        langContainer.appendChild(layoutRow);
      });
    }
  }

  if (tractionContainer) {
    tractionContainer.innerHTML = "";
    if (metrics.rawMetrics.length === 0) {
      tractionContainer.innerHTML = '<span class="meta-output" style="text-align:left;">No tracking metrics registered.</span>';
    } else {
      metrics.rawMetrics.forEach(repo => {
        const layoutRow = document.createElement("div");
        layoutRow.style.cssText = "display:flex; align-items:center; justify-content:space-between; font-size:0.85rem; padding: 4px 0;";
        layoutRow.innerHTML = `
          <span style="font-weight:600; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:160px;">${repo.name}</span>
          <div style="display:flex; gap:8px;">
            <span class="pill" style="padding:2px 6px;">★ ${repo.stars}</span>
            <span class="pill" style="padding:2px 6px;">⑂ ${repo.forks}</span>
          </div>
        `;
        tractionContainer.appendChild(layoutRow);
      });
    }
  }
}

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

function renderProfile(user, metrics) {
  Nodes.avatar.src = user.avatar_url;
  Nodes.avatar.alt = `${user.login} workflow footprint`;
  Nodes.name.textContent = safeText(user.name, user.login);
  Nodes.username.textContent = `@${user.login}`;

  const architectureClassification = computeAccountHealthIndex(user, metrics);
  const ecosystemSummary = metrics.languages.length > 0 
    ? `Specializes in ${metrics.languages.join(", ")} environments.`
    : "Maintains a diversified structural codebase.";

  const baselineBio = user.bio ? user.bio : "Independent open source developer profile dashboard.";
  Nodes.bio.textContent = `${baselineBio} [Rank: ${architectureClassification}] — ${ecosystemSummary}`;
  
  Nodes.location.textContent = safeText(user.location, "Distributed/Remote");
  Nodes.company.textContent = safeText(user.company, "Independent Workspace");

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

  renderVisualInsightsCharts(metrics);

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
      <p class="repo-description">${repo.description || "No structural layout documentation provided for this ecosystem."}</p>
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

      metricsWorker.onmessage = function(e) {
        const structuralMetrics = e.data;
        
        DataCacheEngine.set(`profile_${cleanName}`, user);
        DataCacheEngine.set(`repos_${cleanName}`, sortedRepos);
        DataCacheEngine.set(`metrics_${cleanName}`, structuralMetrics);

        renderProfile(user, structuralMetrics);
        renderRepos(sortedRepos);
        hideStatus();
      };

      metricsWorker.postMessage(sortedRepos);
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

if (UI.exportPdfBtn) {
  UI.exportPdfBtn.addEventListener("click", () => {
    window.print();
  });
}

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