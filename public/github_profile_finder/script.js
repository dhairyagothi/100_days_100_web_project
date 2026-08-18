const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const profileContainer = document.getElementById("profileContainer");
const themeToggle = document.getElementById("themeToggle");

searchBtn.addEventListener("click", () => {
  const username = searchInput.value.trim();

  if(username === ""){
    profileContainer.innerHTML = `
      <p class="error">Please enter username</p>
    `;
    return;
  }

  fetchProfile(username);
});

searchInput.addEventListener("keypress",(e)=>{
  if(e.key === "Enter"){
    searchBtn.click();
  }
});

async function fetchProfile(username){

  try{

    profileContainer.innerHTML = `
      <p>Loading...</p>
    `;

    const response = await fetch(
      `https://api.github.com/users/${username}`
    );

    if(response.status === 404){

      profileContainer.innerHTML = `
        <p class="error">User not found</p>
      `;

      return;
    }

    const data = await response.json();

    displayProfile(data);

  }
  catch(error){

    profileContainer.innerHTML = 
    `<p class="error">Something went wrong</p>`;

  }

}

function displayProfile(user){

  profileContainer.innerHTML = `

    <div class="profile-card">

      <img src="${user.avatar_url}">

      <h2>${user.name || "No Name"}</h2>

      <p>@${user.login}</p>

      <p>${user.bio || "No bio available"}</p>

      <div class="stats">

        <div>
          <h3>${user.followers}</h3>
          <p>Followers</p>
        </div>

        <div>
          <h3>${user.following}</h3>
          <p>Following</p>
        </div>

        <div>
          <h3>${user.public_repos}</h3>
          <p>Repos</p>
        </div>

      </div>

      <p>📍 ${user.location || "Location not available"}</p>

      <a href="${user.html_url}" target="_blank">
        Visit Profile
      </a>

    </div>

  `;
}

themeToggle.addEventListener("click",()=>{

  document.body.classList.toggle("light");

  if(document.body.classList.contains("light")){
    themeToggle.innerHTML =
      `<i class="fa-solid fa-sun"></i>`;
  }
  else{
    themeToggle.innerHTML =
      `<i class="fa-solid fa-moon"></i>`;
  }

});
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

const activeCounterIntervals = [];

/* =========================================================
   CACHE ENGINE

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
   REQUEST LIFECYCLE (Bug #10505)

// Only one profile search or comparison may be "in flight" at a
// time. currentOperationController lets us abort whatever the
// previous one was doing the moment a new one starts, and
// currentOperationId is a generation counter so that async work
// which can't be aborted (e.g. a fetch that already resolved, or
// a loop that's mid-iteration) can still recognize it has become
// stale and refuse to touch the UI.
let currentOperationController = null;
let currentOperationId = 0;

// Call at the start of every profile search / comparison. Aborts
// the previous operation (if any) so its in-flight requests stop
// and its results can never overwrite what the user just asked
// for, then hands back a fresh signal + id for the new operation.
function beginOperation() {
  if (currentOperationController) {
    currentOperationController.abort();
  }
  currentOperationController = new AbortController();
  currentOperationId += 1;

  return {
    signal: currentOperationController.signal,
    operationId: currentOperationId
  };
}

// True once a newer operation has started, meaning this one's
// results are stale and must not be rendered.
function isStaleOperation(operationId) {
  return operationId !== currentOperationId;
}

// An AbortError means a request was cancelled on purpose (a newer
// search/comparison took over) - it is not a real failure and
// must never surface as an error banner to the user.
function isAbortError(error) {
  return Boolean(error) && error.name === "AbortError";
}

/* =========================================================
   UTILITIES

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

  activeCounterIntervals.push(interval);
}

function stopActiveCounters() {

  activeCounterIntervals.forEach(
    (interval) => clearInterval(interval)
  );

  activeCounterIntervals.length = 0;
}

function resetStatCounters() {

  stopActiveCounters();

  if (Nodes.repoCount)
    Nodes.repoCount.textContent = "0";

  if (Nodes.followers)
    Nodes.followers.textContent = "0";

  if (Nodes.following)
    Nodes.following.textContent = "0";

  if (Nodes.gists)
    Nodes.gists.textContent = "0";
}

function resetProfileUI() {

  resetStatCounters();

  UI.profileCard?.classList.add("hidden");
  UI.reposSection?.classList.add("hidden");
  UI.analyticsPanel?.classList.add("hidden");

  if (UI.reposList)
    UI.reposList.replaceChildren();
}

/* =========================================================
   LOADING

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

  const loadingNote = document.createElement("div");
  loadingNote.className = "compare-loading";
  loadingNote.textContent = "Loading profile comparison...";
  UI.comparisonContainer.replaceChildren(loadingNote);
}

/* =========================================================
   CONTRIBUTION HEATMAP

// Set this to a backend/serverless proxy URL to enable the
// GraphQL path. Left empty because this project has no
// backend yet - see comment block above.
const GRAPHQL_PROXY_ENDPOINT = "";

const CONTRIBUTIONS_FALLBACK_API_URL =
  "https://github-contributions-api.jogruber.de/v4";

const CONTRIBUTIONS_FETCH_TIMEOUT_MS = 8000;
const CONTRIBUTIONS_MAX_RETRIES = 2;
const CONTRIBUTIONS_RETRY_BASE_DELAY_MS = 600;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch wrapper with a timeout, since a hung request should
 * never leave the heatmap stuck on "Loading...". Also accepts the
 * outer search/comparison operation's signal (externalSignal) so
 * that cancelling the whole operation aborts this request
 * immediately too, instead of waiting out its own timeout.
 */
async function fetchWithTimeout(url, timeoutMs, externalSignal) {

  const controller = new AbortController();

  const timer = setTimeout(
    () => controller.abort(),
    timeoutMs
  );

  const abortFromOutside = () => controller.abort();

  if (externalSignal) {

    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", abortFromOutside);
    }
  }

  try {

    return await fetch(url, { signal: controller.signal });

  } finally {

    clearTimeout(timer);

    if (externalSignal) {
      externalSignal.removeEventListener("abort", abortFromOutside);
    }
  }
}

/**
 * Calls a backend proxy that is expected to run the GitHub
 * GraphQL `contributionsCollection` query server-side (where a
 * token can be kept secret) and return normalized
 * { date, count, level } day objects. Only used when
 * GRAPHQL_PROXY_ENDPOINT is configured.
 */
async function fetchContributionsFromGraphQLProxy(username, signal) {

  const response = await fetchWithTimeout(
    `${GRAPHQL_PROXY_ENDPOINT}?username=${encodeURIComponent(username)}`,
    CONTRIBUTIONS_FETCH_TIMEOUT_MS,
    signal
  );

  if (!response.ok) {

    const error = new Error(
      "The contribution data proxy returned an error."
    );
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.contributions)) {

    throw new Error(
      "The contribution data proxy returned an unexpected format."
    );
  }

  return data.contributions;
}

/**
 * Calls the public fallback contributions API with a timeout
 * and retry/backoff for transient errors. Never returns
 * fabricated data - any unrecoverable failure is thrown so the
 * caller can show an honest error state.
 */
async function fetchContributionsFromFallbackApi(username, signal) {

  let lastError = null;

  for (let attempt = 0; attempt <= CONTRIBUTIONS_MAX_RETRIES; attempt++) {

    try {

      const response = await fetchWithTimeout(
        `${CONTRIBUTIONS_FALLBACK_API_URL}/${username}?y=last`,
        CONTRIBUTIONS_FETCH_TIMEOUT_MS,
        signal
      );

      if (response.status === 404) {

        // Invalid/unknown username - retrying won't help.
        const error = new Error(
          "No GitHub user was found with that username."
        );
        error.status = 404;
        throw error;
      }

      if (response.status === 429) {

        const error = new Error(
          "The contribution data provider is rate-limited right now."
        );
        error.status = 429;
        throw error;
      }

      if (!response.ok) {

        const error = new Error(
          "Unable to fetch contribution activity for this user."
        );
        error.status = response.status;
        throw error;
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.contributions)) {

        throw new Error(
          "Contribution data was returned in an unexpected format."
        );
      }

      return data.contributions;

    } catch (error) {

      lastError = error;

      const isAbort = error.name === "AbortError";
      const isNotFound = error.status === 404;

      // If the *outer* search/comparison was cancelled (a newer one
      // started), this AbortError is an intentional cancellation,
      // not a transient failure - retrying it would just re-issue
      // work nobody wants anymore. Only genuine timeouts (this
      // request's own budget expiring) are retryable.
      const isExternalCancel = Boolean(signal && signal.aborted);

      // Don't retry on a bad username, an intentionally cancelled
      // operation, or an aborted/timed-out request that's already
      // exhausted its own budget once; only retry genuinely
      // transient failures.
      const isRetryable =
        !isNotFound &&
        !isExternalCancel &&
        (isAbort ||
          error.status === 429 ||
          error.status >= 500 ||
          error.status === undefined);

      if (!isRetryable || attempt === CONTRIBUTIONS_MAX_RETRIES) {

        if (isAbort && !isExternalCancel) {

          lastError = new Error(
            "The request timed out while loading contribution activity."
          );
        }

        break;
      }

      await sleep(
        CONTRIBUTIONS_RETRY_BASE_DELAY_MS * Math.pow(2, attempt)
      );
    }
  }

  throw lastError;
}

/**
 * Fetches the last 12 months of real contribution data for a
 * GitHub username. Returns an array of
 * { date, count, level } objects, oldest first. GraphQL (via a
 * secure backend proxy) is preferred when configured; otherwise
 * falls back to the public read-only contributions API. Never
 * falls back to randomly generated or fake data.
 */
async function fetchContributionData(username, signal) {

  const cacheKey = `contributions_${username}`;

  const cached = DataCacheEngine.get(cacheKey);

  if (cached) return cached;

  const contributions = GRAPHQL_PROXY_ENDPOINT
    ? await fetchContributionsFromGraphQLProxy(username, signal)
    : await fetchContributionsFromFallbackApi(username, signal);

  DataCacheEngine.set(cacheKey, contributions);

  return contributions;
}

/**
 * Renders a GitHub-style calendar grid (7 rows x ~53 columns)
 * from real contribution day objects. Leading blank cells are
 * added so the first real day lines up with its correct
 * day-of-week row, matching GitHub's own layout.
 */
function renderContributionHeatmap(contributions) {

  UI.heatmapGrid.replaceChildren();

  // Cap at 371 days (53 weeks) to mirror GitHub's ~12 month view.
  const days = contributions.slice(-371);

  if (!days.length) {

    throw new Error("No contribution data available for this user.");
  }

  const firstDay = new Date(`${days[0].date}T00:00:00`);
  const leadingBlankDays = firstDay.getDay(); // 0 = Sunday

  for (let i = 0; i < leadingBlankDays; i++) {

    const blankCell =
      document.createElement("div");

    blankCell.className = "heatmap-cell level-0";
    blankCell.style.visibility = "hidden";

    UI.heatmapGrid.appendChild(blankCell);
  }

  days.forEach((day) => {

    const cell =
      document.createElement("div");

    cell.className =
      `heatmap-cell level-${day.level}`;

    const formattedDate =
      new Date(`${day.date}T00:00:00`).toLocaleDateString(
        "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      );

    cell.title =
      `${day.count} contribution${day.count === 1 ? "" : "s"} on ${formattedDate}`;

    UI.heatmapGrid.appendChild(cell);
  });
}

/**
 * Displays a friendly, non-fake fallback when real contribution
 * data can't be retrieved. Never falls back to random data.
 */
function showHeatmapError(message) {

  UI.heatmapGrid.replaceChildren();

  const errorNode =
    document.createElement("div");

  errorNode.style.gridColumn = "1 / -1";
  errorNode.style.color = "var(--muted)";
  errorNode.style.fontSize = ".88rem";
  errorNode.style.padding = "10px 0";

  errorNode.textContent = message;

  UI.heatmapGrid.appendChild(errorNode);
}

async function generateContributionHeatmap(username, signal, operationId) {

  if (!UI.heatmapGrid) return;

  const loadingNode =
    document.createElement("div");

  loadingNode.style.gridColumn = "1 / -1";
  loadingNode.style.color = "var(--muted)";
  loadingNode.style.fontSize = ".88rem";
  loadingNode.style.padding = "10px 0";
  loadingNode.textContent = "Loading contribution activity...";

  UI.heatmapGrid.replaceChildren();
  UI.heatmapGrid.appendChild(loadingNode);

  try {

    const contributions =
      await fetchContributionData(username, signal);

    // A newer search/comparison may have started while this was
    // in flight; ignore the now-stale result instead of rendering
    // over whatever the newer operation has already shown.
    if (isStaleOperation(operationId)) return;

    renderContributionHeatmap(contributions);

  } catch (error) {

    // Cancellation (this operation or the whole page's operation
    // being superseded) is expected, not an error - stay silent.
    if (isAbortError(error) || isStaleOperation(operationId)) return;

    showHeatmapError(getContributionErrorMessage(error));
  }
}

/**
 * Turns a raw fetch/parse error into a specific, human-readable
 * message so the person searching a profile understands what
 * went wrong (invalid username vs. rate limit vs. network vs.
 * an unexpected failure) instead of one generic string.
 */
function getContributionErrorMessage(error) {

  if (error?.status === 404) {

    return "No contribution data found - check that the username is correct.";
  }

  if (error?.status === 429) {

    return "Contribution data is temporarily rate-limited. Please try again in a moment.";
  }

  // A failed fetch (offline, DNS failure, blocked request, etc.)
  // surfaces as a TypeError in browsers rather than a bad status.
  if (error instanceof TypeError) {

    return "Couldn't reach the contribution data source - check your connection and try again.";
  }

  if (typeof error?.status === "number" && error.status >= 500) {

    return "The contribution data source is currently unavailable. Please try again later.";
  }

  return "Contribution activity couldn't be loaded for this user right now.";
}

/* =========================================================
   LANGUAGE ANALYTICS

async function renderLanguageAnalytics(repos, signal, operationId) {

  if (!repos || !repos.length) return;

  const languageBytes = {};

  try {

    for (const repo of repos.slice(0, 10)) {

      if (!repo.languages_url) continue;

      const response =
        await fetch(repo.languages_url, { signal });

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

    // A newer search/comparison may have started while these
    // per-repo language requests were in flight; don't let a
    // stale result overwrite the current UI.
    if (isStaleOperation(operationId)) return;

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

    UI.languageLegend.replaceChildren();

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

        const left =
          document.createElement("div");

        left.className =
          "language-legend-left";

        const dot =
          document.createElement("span");

        dot.className = "language-dot";
        dot.style.background = colors[index];

        const langLabel =
          document.createElement("span");

        // GitHub API value — set via textContent, never HTML
        langLabel.textContent = language;

        left.appendChild(dot);
        left.appendChild(langLabel);

        const percentLabel =
          document.createElement("strong");

        percentLabel.textContent =
          `${percent.toFixed(1)}%`;

        item.appendChild(left);
        item.appendChild(percentLabel);

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

    // Cancellation is expected here (a newer operation took over)
    // and isn't a real failure worth logging.
    if (isAbortError(error)) return;

    console.error(
      "Language analytics failed:",
      error
    );
  }
}

/* =========================================================
   PROFILE

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

    // Only build a link for http(s) URLs; otherwise show plain text.
    // This avoids javascript:/data: URIs ending up in an href.
    let isSafeUrl = false;

    try {

      isSafeUrl =
        ["http:", "https:"].includes(
          new URL(blogUrl).protocol
        );

    } catch {

      isSafeUrl = false;
    }

    Nodes.website.replaceChildren();

    if (isSafeUrl) {

      const link =
        document.createElement("a");

      link.href = blogUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.className = "repo-link";
      link.textContent = user.blog; // GitHub API value — textContent, never HTML

      Nodes.website.appendChild(link);

    } else {

      Nodes.website.textContent = user.blog;
    }

  } else {

    Nodes.website.textContent = "—";
  }

  Nodes.profileLink.href =
    user.html_url;

  stopActiveCounters();

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

function renderRepos(repos) {

  UI.reposList.replaceChildren();

  if (!repos.length) {

    const empty =
      document.createElement("div");

    empty.className = "repo-card";
    empty.textContent = "No repositories found.";

    UI.reposList.appendChild(empty);

    return;
  }

  repos.forEach((repo) => {

    const card =
      document.createElement("article");

    card.className = "repo-card";

    const top =
      document.createElement("div");

    top.className = "repo-top";

    const name =
      document.createElement("h4");

    name.className = "repo-name";

    const nameLink =
      document.createElement("a");

    nameLink.href = repo.html_url;
    nameLink.target = "_blank";
    nameLink.rel = "noreferrer";
    nameLink.className = "repo-link";
    nameLink.textContent = repo.name; // GitHub API value — textContent, never HTML

    name.appendChild(nameLink);

    const starBadge =
      document.createElement("span");

    starBadge.className = "badge";
    starBadge.textContent =
      `★ ${repo.stargazers_count}`;

    top.appendChild(name);
    top.appendChild(starBadge);

    const description =
      document.createElement("p");

    description.className = "repo-description";
    description.textContent = safeText(
      repo.description,
      "No description available."
    );

    const meta =
      document.createElement("div");

    meta.className = "repo-meta";

    if (repo.language) {

      const languagePill =
        document.createElement("span");

      languagePill.className = "pill";
      languagePill.textContent = repo.language; // GitHub API value — textContent

      meta.appendChild(languagePill);
    }

    const forksPill =
      document.createElement("span");

    forksPill.className = "pill";
    forksPill.textContent =
      `Forks ${repo.forks_count}`;

    const updatedPill =
      document.createElement("span");

    updatedPill.className = "pill";
    updatedPill.textContent =
      `Updated ${formatDate(repo.updated_at)}`;

    meta.appendChild(forksPill);
    meta.appendChild(updatedPill);

    card.appendChild(top);
    card.appendChild(description);
    card.appendChild(meta);

    UI.reposList.appendChild(card);
  });

  UI.reposSection?.classList.remove(
    "hidden"
  );
}

/* =========================================================
   FETCH USER

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

  // Cancel any previous profile search/comparison so it can't
  // finish late and clobber the UI with stale data (Bug #10505),
  // then run this one under its own signal + generation id.
  const { signal, operationId } = beginOperation();

  showLoading();

  try {

    const userResponse = await fetch(
      `https://api.github.com/users/${cleanName}`,
      { signal }
    );

    if (!userResponse.ok) {

      throw new Error(
        "GitHub user not found."
      );
    }

    const user =
      await userResponse.json();

    const repoResponse = await fetch(
      `https://api.github.com/users/${cleanName}/repos?per_page=100`,
      { signal }
    );

    if (!repoResponse.ok) {

      const errorData =
        await repoResponse.json().catch(() => ({}));

      throw new Error(
        errorData.message || "Failed to fetch repositories."
      );
    }

    const repos =
      await repoResponse.json();

    if (!Array.isArray(repos)) {

      throw new Error(
        "Failed to fetch repositories."
      );
    }

    const sortedRepos = repos
      .sort(
        (a, b) =>
          b.stargazers_count -
          a.stargazers_count
      )
      .slice(0, 6);

    // A newer search/comparison may have started while the above
    // requests were in flight; if so, this result is stale and
    // must not be rendered over the newer one.
    if (isStaleOperation(operationId)) return;

    renderProfile(user);

    renderRepos(sortedRepos);

    await generateContributionHeatmap(cleanName, signal, operationId);

    if (isStaleOperation(operationId)) return;

    await renderLanguageAnalytics(repos, signal, operationId);

    if (isStaleOperation(operationId)) return;

    UI.analyticsPanel?.classList.remove(
      "hidden"
    );

    hideStatus();

  } catch (error) {

    // An aborted request means a newer search/comparison started
    // and cancelled this one on purpose - that's not a failure, so
    // don't show an error banner or reset UI the newer operation
    // may already own.
    if (isAbortError(error) || isStaleOperation(operationId)) return;

    resetProfileUI();

    showStatus(
      error.message,
      "error"
    );
  }
}

/* =========================================================
   FETCH PROFILE DATA

async function fetchProfileData(username, signal) {

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
    `https://api.github.com/users/${cleanName}`,
    { signal }
  );

  if (!userResponse.ok) {

    throw new Error(
      `GitHub user not found: ${cleanName}`
    );
  }

  const user =
    await userResponse.json();

  const repoResponse = await fetch(
    `https://api.github.com/users/${cleanName}/repos?per_page=50`,
    { signal }
  );

  if (!repoResponse.ok) {

    const errorData =
      await repoResponse.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to fetch repositories."
    );
  }

  const repos =
    await repoResponse.json();

  if (!Array.isArray(repos)) {

    throw new Error(
      "Failed to fetch repositories."
    );
  }

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

function buildRepoListSmall(repos) {

  const fragment =
    document.createDocumentFragment();

  repos.forEach((repo) => {

    const mini =
      document.createElement("div");

    mini.className = "mini-repo-card";

    const link =
      document.createElement("a");

    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.className = "repo-link";
    link.textContent = repo.name; // GitHub API value — textContent, never HTML

    const stars =
      document.createElement("span");

    stars.textContent =
      `★ ${repo.stargazers_count}`;

    mini.appendChild(link);
    mini.appendChild(stars);

    fragment.appendChild(mini);
  });

  return fragment;
}

function buildComparisonStat(label, value, isWinner) {

  const stat =
    document.createElement("div");

  stat.className =
    `compare-stat ${isWinner ? "winner" : ""}`;

  const label_ =
    document.createElement("span");

  label_.textContent = label;

  const strong =
    document.createElement("strong");

  strong.textContent = value;

  stat.appendChild(label_);
  stat.appendChild(strong);

  return stat;
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

  const article =
    document.createElement("article");

  article.className = "compare-card";

  const header =
    document.createElement("div");

  header.className = "compare-header";

  const img =
    document.createElement("img");

  img.src = data.user.avatar_url;
  img.className = "compare-avatar";

  const identity =
    document.createElement("div");

  const h3 =
    document.createElement("h3");

  h3.textContent = safeText(
    data.user.name,
    data.user.login
  );

  const handle =
    document.createElement("p");

  handle.textContent = `@${data.user.login}`;

  identity.appendChild(h3);
  identity.appendChild(handle);

  header.appendChild(img);
  header.appendChild(identity);

  const bio =
    document.createElement("p");

  bio.className = "compare-bio";
  bio.textContent = safeText(
    data.user.bio,
    "No bio available."
  );

  const stats =
    document.createElement("div");

  stats.className = "compare-stats";

  stats.appendChild(
    buildComparisonStat(
      "Repositories",
      data.user.public_repos,
      repoWinner
    )
  );

  stats.appendChild(
    buildComparisonStat(
      "Followers",
      data.user.followers.toLocaleString(),
      followerWinner
    )
  );

  stats.appendChild(
    buildComparisonStat(
      "Following",
      data.user.following,
      followingWinner
    )
  );

  const repoWrap =
    document.createElement("div");

  repoWrap.className = "compare-repos";

  const repoHeading =
    document.createElement("h4");

  repoHeading.textContent = "Top Repositories";

  repoWrap.appendChild(repoHeading);
  repoWrap.appendChild(
    buildRepoListSmall(data.repos)
  );

  article.appendChild(header);
  article.appendChild(bio);
  article.appendChild(stats);
  article.appendChild(repoWrap);

  return article;
}

function renderComparison(
  leftData,
  rightData
) {

  UI.comparisonPanel?.classList.remove(
    "hidden"
  );

  UI.comparisonContainer.replaceChildren(
    renderComparisonCard(
      leftData,
      rightData
    ),
    renderComparisonCard(
      rightData,
      leftData
    )
  );

  UI.comparisonPanel.scrollIntoView({
    behavior: "smooth"
  });
}

/* =========================================================
   SEARCH FORM

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

      // Cancel any previous profile search/comparison so it can't
      // finish late and clobber this comparison's UI (Bug #10505).
      const { signal, operationId } = beginOperation();

      try {

        showCompareLoading();

        const [
          leftData,
          rightData
        ] = await Promise.all([

          fetchProfileData(
            leftUsername,
            signal
          ),

          fetchProfileData(
            rightUsername,
            signal
          )

        ]);

        // A newer search/comparison may have started while these
        // requests were in flight; ignore this now-stale result.
        if (isStaleOperation(operationId)) return;

        renderComparison(
          leftData,
          rightData
        );

        hideStatus();

      } catch (error) {

        // An aborted request means a newer search/comparison
        // started and cancelled this one on purpose - not a real
        // failure, so stay silent rather than show an error banner.
        if (isAbortError(error) || isStaleOperation(operationId)) return;

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

initTheme();

syncNetworkStatus();
