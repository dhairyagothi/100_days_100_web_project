const UI = {
  form: document.getElementById("searchForm"),
  input: document.getElementById("usernameInput"),
  statusBox: document.getElementById("statusBox"),

  profileCard: document.getElementById("profileCard"),
  reposSection: document.getElementById("reposSection"),
  reposList: document.getElementById("reposList"),

  analyticsPanel: document.getElementById("analyticsPanel"),
  heatmapGrid: document.getElementById("heatmapGrid"),
  languageLegend: document.getElementById("languageLegend"),
  languagePie: document.querySelector(".language-pie"),
  topLanguagePercent: document.getElementById("topLanguagePercent"),
  topLanguageName: document.getElementById("topLanguageName"),

  themeToggle: document.getElementById("themeToggle"),
  themeIcon: document.getElementById("themeIcon"),
  offlineIndicator: document.getElementById("offlineIndicator"),

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

const CACHE_DURATION = 300000;

/* =========================================================
   CACHE ENGINE
========================================================= */

class DataCacheEngine {

  static get(storageKey) {

    try {

      const entry =
        localStorage.getItem(`gh_dash_${storageKey}`);

      if (!entry) return null;

      const payload = JSON.parse(entry);

      if (Date.now() > payload.expiresAt) {

        localStorage.removeItem(
          `gh_dash_${storageKey}`
        );

        return null;
      }

      return payload.data;

    } catch {

      return null;
    }
  }

  static set(storageKey, dataValue) {

    try {

      const payload = {
        data: dataValue,
        expiresAt: Date.now() + CACHE_DURATION
      };

      localStorage.setItem(
        `gh_dash_${storageKey}`,
        JSON.stringify(payload)
      );

    } catch (error) {

      console.error(error);
    }
  }
}

/* =========================================================
   UTILITIES
========================================================= */

function safeText(value, fallback = "—") {

  return value && String(value).trim()
    ? value
    : fallback;
}

function formatDate(dateString) {

  return new Date(dateString).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric"
    }
  );
}

function showStatus(message, type = "success") {

  if (!UI.statusBox) return;

  UI.statusBox.textContent = message;

  UI.statusBox.className =
    `status-banner ${type}`;

  UI.statusBox.classList.remove("hidden");
}

function hideStatus() {

  UI.statusBox?.classList.add("hidden");
}

function syncNetworkStatus() {

  if (!UI.offlineIndicator) return;

  UI.offlineIndicator.classList.toggle(
    "hidden",
    navigator.onLine
  );
}

function updateThemeIcon() {

  const isDark =
    document.documentElement.getAttribute(
      "data-theme"
    ) === "dark";

  UI.themeIcon.textContent =
    isDark ? "☀" : "☾";
}

function initTheme() {

  const savedTheme =
    localStorage.getItem("theme");

  if (savedTheme) {

    document.documentElement.setAttribute(
      "data-theme",
      savedTheme
    );

  } else {

    document.documentElement.setAttribute(
      "data-theme",
      "dark"
    );
  }

  updateThemeIcon();
}

function animateCounter(element, targetValue) {

  if (!element) return;

  const target =
    parseInt(targetValue, 10) || 0;

  let current = 0;

  const interval = setInterval(() => {

    current += Math.ceil(target / 40);

    if (current >= target) {

      current = target;

      clearInterval(interval);
    }

    element.textContent =
      current.toLocaleString();

  }, 20);
}

/* =========================================================
   LOADING
========================================================= */

function showLoading() {

  showStatus(
    "Fetching GitHub profile analytics...",
    "success"
  );

  UI.profileCard?.classList.add("hidden");
  UI.analyticsPanel?.classList.add("hidden");
  UI.reposSection?.classList.add("hidden");
}

function showCompareLoading() {

  showStatus(
    "Comparing GitHub profiles...",
    "success"
  );

  UI.comparisonPanel?.classList.remove(
    "hidden"
  );

  UI.comparisonContainer.innerHTML = `
    <div class="compare-loading">
      Loading profile comparison...
    </div>
  `;
}

/* =========================================================
   CONTRIBUTION HEATMAP
========================================================= */

function generateContributionHeatmap() {

  if (!UI.heatmapGrid) return;

  UI.heatmapGrid.innerHTML = "";

  const totalDays = 365;

  for (let i = 0; i < totalDays; i++) {

    const level =
      Math.floor(Math.random() * 5);

    const cell =
      document.createElement("div");

    cell.className =
      `heatmap-cell level-${level}`;

    const contributions =
      level === 0
        ? 0
        : Math.floor(
            Math.random() * (level * 8)
          ) + 1;

    cell.title =
      `${contributions} contributions`;

    UI.heatmapGrid.appendChild(cell);
  }
}

/* =========================================================
   LANGUAGE ANALYTICS
========================================================= */

async function renderLanguageAnalytics(repos) {

  if (!repos || !repos.length) return;

  const languageBytes = {};

  try {

    for (const repo of repos.slice(0, 10)) {

      if (!repo.languages_url) continue;

      const response =
        await fetch(repo.languages_url);

      if (!response.ok) continue;

      const data =
        await response.json();

      Object.entries(data).forEach(
        ([language, bytes]) => {

          languageBytes[language] =
            (languageBytes[language] || 0)
            + bytes;
        }
      );
    }

    const totalBytes =
      Object.values(languageBytes)
        .reduce((sum, value) => sum + value, 0);

    if (!totalBytes) return;

    const sortedLanguages =
      Object.entries(languageBytes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const colors = [
      "#8b5cf6",
      "#06b6d4",
      "#3b82f6",
      "#10b981",
      "#f59e0b"
    ];

    let currentDeg = 0;

    const gradientParts = [];

    UI.languageLegend.innerHTML = "";

    sortedLanguages.forEach(
      ([language, bytes], index) => {

        const percent =
          (bytes / totalBytes) * 100;

        const deg =
          (percent / 100) * 360;

        gradientParts.push(
          `${colors[index]} ${currentDeg}deg ${currentDeg + deg}deg`
        );

        currentDeg += deg;

        const item =
          document.createElement("div");

        item.className =
          "language-legend-item";

        item.innerHTML = `
          <div class="language-legend-left">

            <span
              class="language-dot"
              style="background:${colors[index]}"
            ></span>

            <span>${language}</span>

          </div>

          <strong>
            ${percent.toFixed(1)}%
          </strong>
        `;

        UI.languageLegend.appendChild(item);
      }
    );

    UI.languagePie.style.background =
      `conic-gradient(${gradientParts.join(",")})`;

    const [topLanguage, topBytes] =
      sortedLanguages[0];

    const topPercent =
      ((topBytes / totalBytes) * 100)
      .toFixed(0);

    UI.topLanguageName.textContent =
      topLanguage;

    UI.topLanguagePercent.textContent =
      `${topPercent}%`;

  } catch (error) {

    console.error(
      "Language analytics failed:",
      error
    );
  }
}

/* =========================================================
   PROFILE
========================================================= */

function renderProfile(user) {

  Nodes.avatar.src =
    user.avatar_url;

  Nodes.name.textContent =
    safeText(user.name, user.login);

  Nodes.username.textContent =
    `@${user.login}`;

  Nodes.bio.textContent =
    safeText(
      user.bio,
      "No bio available."
    );

  Nodes.location.textContent =
    safeText(user.location);

  Nodes.company.textContent =
    safeText(user.company);

  Nodes.joined.textContent =
    formatDate(user.created_at);

  if (user.blog) {

    const blogUrl =
      user.blog.startsWith("http")
        ? user.blog
        : `https://${user.blog}`;

    Nodes.website.innerHTML = `
      <a
        href="${blogUrl}"
        target="_blank"
        class="repo-link"
      >
        ${user.blog}
      </a>
    `;

  } else {

    Nodes.website.textContent = "—";
  }

  Nodes.profileLink.href =
    user.html_url;

  animateCounter(
    Nodes.repoCount,
    user.public_repos
  );

  animateCounter(
    Nodes.followers,
    user.followers
  );

  animateCounter(
    Nodes.following,
    user.following
  );

  animateCounter(
    Nodes.gists,
    user.public_gists
  );

  UI.profileCard?.classList.remove(
    "hidden"
  );
}

/* =========================================================
   REPOSITORIES
========================================================= */

function renderRepos(repos) {

  UI.reposList.innerHTML = "";

  if (!repos.length) {

    UI.reposList.innerHTML = `
      <div class="repo-card">
        No repositories found.
      </div>
    `;

    return;
  }

  repos.forEach((repo) => {

    const card =
      document.createElement("article");

    card.className = "repo-card";

    card.innerHTML = `
      <div class="repo-top">

        <h4 class="repo-name">

          <a
            href="${repo.html_url}"
            target="_blank"
            class="repo-link"
          >
            ${repo.name}
          </a>

        </h4>

        <span class="badge">
          ★ ${repo.stargazers_count}
        </span>

      </div>

      <p class="repo-description">

        ${safeText(
          repo.description,
          "No description available."
        )}

      </p>

      <div class="repo-meta">

        ${
          repo.language
            ? `<span class="pill">${repo.language}</span>`
            : ""
        }

        <span class="pill">
          Forks ${repo.forks_count}
        </span>

        <span class="pill">
          Updated ${formatDate(repo.updated_at)}
        </span>

      </div>
    `;

    UI.reposList.appendChild(card);
  });

  UI.reposSection?.classList.remove(
    "hidden"
  );
}

/* =========================================================
   FETCH USER
========================================================= */

async function fetchUser(username) {

  const cleanName =
    username.trim().replace("@", "");

  if (!cleanName) {

    showStatus(
      "Please enter a GitHub username.",
      "error"
    );

    return;
  }

  showLoading();

  try {

    const userResponse = await fetch(
      `https://api.github.com/users/${cleanName}`
    );

    if (!userResponse.ok) {

      throw new Error(
        "GitHub user not found."
      );
    }

    const user =
      await userResponse.json();

    const repoResponse = await fetch(
      `https://api.github.com/users/${cleanName}/repos?per_page=100`
    );

    const repos =
      await repoResponse.json();

    const sortedRepos = repos
      .sort(
        (a, b) =>
          b.stargazers_count -
          a.stargazers_count
      )
      .slice(0, 6);

    renderProfile(user);

    renderRepos(sortedRepos);

    generateContributionHeatmap();

    await renderLanguageAnalytics(repos);

    UI.analyticsPanel?.classList.remove(
      "hidden"
    );

    hideStatus();

  } catch (error) {

    showStatus(
      error.message,
      "error"
    );
  }
}

/* =========================================================
   FETCH PROFILE DATA
========================================================= */

async function fetchProfileData(username) {

  const cleanName =
    username.trim().replace("@", "");

  const cachedProfile =
    DataCacheEngine.get(
      `profile_${cleanName}`
    );

  const cachedRepos =
    DataCacheEngine.get(
      `repos_${cleanName}`
    );

  if (cachedProfile && cachedRepos) {

    return {
      user: cachedProfile,
      repos: cachedRepos
    };
  }

  const userResponse = await fetch(
    `https://api.github.com/users/${cleanName}`
  );

  if (!userResponse.ok) {

    throw new Error(
      `GitHub user not found: ${cleanName}`
    );
  }

  const user =
    await userResponse.json();

  const repoResponse = await fetch(
    `https://api.github.com/users/${cleanName}/repos?per_page=50`
  );

  const repos =
    await repoResponse.json();

  const sortedRepos = repos
    .sort(
      (a, b) =>
        b.stargazers_count -
        a.stargazers_count
    )
    .slice(0, 4);

  DataCacheEngine.set(
    `profile_${cleanName}`,
    user
  );

  DataCacheEngine.set(
    `repos_${cleanName}`,
    sortedRepos
  );

  return {
    user,
    repos: sortedRepos
  };
}

/* =========================================================
   COMPARISON UI
========================================================= */

function buildRepoListSmall(repos) {

  return repos.map((repo) => `
    <div class="mini-repo-card">

      <a
        href="${repo.html_url}"
        target="_blank"
        class="repo-link"
      >
        ${repo.name}
      </a>

      <span>
        ★ ${repo.stargazers_count}
      </span>

    </div>
  `).join("");
}

function renderComparisonCard(
  data,
  opponent
) {

  const repoWinner =
    data.user.public_repos >
    opponent.user.public_repos;

  const followerWinner =
    data.user.followers >
    opponent.user.followers;

  const followingWinner =
    data.user.following >
    opponent.user.following;

  return `
    <article class="compare-card">

      <div class="compare-header">

        <img
          src="${data.user.avatar_url}"
          class="compare-avatar"
        />

        <div>

          <h3>
            ${safeText(
              data.user.name,
              data.user.login
            )}
          </h3>

          <p>
            @${data.user.login}
          </p>

        </div>

      </div>

      <p class="compare-bio">

        ${safeText(
          data.user.bio,
          "No bio available."
        )}

      </p>

      <div class="compare-stats">

        <div class="compare-stat ${repoWinner ? "winner" : ""}">

          <span>Repositories</span>

          <strong>
            ${data.user.public_repos}
          </strong>

        </div>

        <div class="compare-stat ${followerWinner ? "winner" : ""}">

          <span>Followers</span>

          <strong>
            ${data.user.followers.toLocaleString()}
          </strong>

        </div>

        <div class="compare-stat ${followingWinner ? "winner" : ""}">

          <span>Following</span>

          <strong>
            ${data.user.following}
          </strong>

        </div>

      </div>

      <div class="compare-repos">

        <h4>Top Repositories</h4>

        ${buildRepoListSmall(data.repos)}

      </div>

    </article>
  `;
}

function renderComparison(
  leftData,
  rightData
) {

  UI.comparisonPanel?.classList.remove(
    "hidden"
  );

  UI.comparisonContainer.innerHTML = `
    ${renderComparisonCard(
      leftData,
      rightData
    )}

    ${renderComparisonCard(
      rightData,
      leftData
    )}
  `;

  UI.comparisonPanel.scrollIntoView({
    behavior: "smooth"
  });
}

/* =========================================================
   SEARCH FORM
========================================================= */

if (UI.form) {

  UI.form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      fetchUser(UI.input.value);
    }
  );
}

/* =========================================================
   COMPARE FORM
========================================================= */

if (UI.compareForm) {

  UI.compareForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const leftUsername =
        UI.compareA.value.trim();

      const rightUsername =
        UI.compareB.value.trim();

      if (
        !leftUsername ||
        !rightUsername
      ) {

        showStatus(
          "Enter two GitHub usernames.",
          "error"
        );

        return;
      }

      try {

        showCompareLoading();

        const [
          leftData,
          rightData
        ] = await Promise.all([

          fetchProfileData(
            leftUsername
          ),

          fetchProfileData(
            rightUsername
          )

        ]);

        renderComparison(
          leftData,
          rightData
        );

        hideStatus();

      } catch (error) {

        showStatus(
          error.message,
          "error"
        );
      }
    }
  );
}

/* =========================================================
   QUICK TAGS
========================================================= */

document
  .querySelectorAll(".tag-btn")
  .forEach((btn) => {

    btn.addEventListener(
      "click",
      () => {

        const user =
          btn.dataset.user;

        if (!user) return;

        UI.input.value = user;

        fetchUser(user);
      }
    );
  });

/* =========================================================
   COMPARE TAGS
========================================================= */

document
  .querySelectorAll(".compare-tag-btn")
  .forEach((btn) => {

    btn.addEventListener(
      "click",
      () => {

        const compare =
          btn.dataset.compare.split(",");

        UI.compareA.value =
          compare[0];

        UI.compareB.value =
          compare[1];

        UI.compareForm.dispatchEvent(
          new Event("submit")
        );
      }
    );
  });

/* =========================================================
   THEME TOGGLE
========================================================= */

if (UI.themeToggle) {

  UI.themeToggle.addEventListener(
    "click",
    () => {

      const currentTheme =
        document.documentElement.getAttribute(
          "data-theme"
        );

      const newTheme =
        currentTheme === "dark"
          ? "light"
          : "dark";

      document.documentElement.setAttribute(
        "data-theme",
        newTheme
      );

      localStorage.setItem(
        "theme",
        newTheme
      );

      updateThemeIcon();
    }
  );
}

/* =========================================================
   NETWORK
========================================================= */

window.addEventListener(
  "online",
  syncNetworkStatus
);

window.addEventListener(
  "offline",
  syncNetworkStatus
);

/* =========================================================
   INIT
========================================================= */

initTheme();

syncNetworkStatus();