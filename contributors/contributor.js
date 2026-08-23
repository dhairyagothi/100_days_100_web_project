const modal = document.getElementById("profileModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
const certificateModal = document.getElementById("certificateModal");
const certificateBody = document.getElementById("certificateBody");
const closeCertificate = document.getElementById("closeCertificate");

const GITHUB_API_BASE = "https://api.github.com";
const REQUEST_TIMEOUT = 10000;
const MAX_RETRIES = 3;

function createModalA11y(modalEl, closeBtn) {
  if (!modalEl) {
    return { activate() {}, close() {} };
  }

  let lastFocused = null;
  const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const getFocusable = () =>
    Array.from(modalEl.querySelectorAll(focusableSelector)).filter(
      (el) => el.offsetParent !== null,
    );

  function close() {
    modalEl.style.display = "none";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab") {
      return;
    }
    const focusable = getFocusable();
    if (!focusable.length) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function activate() {
    lastFocused = document.activeElement;
    document.addEventListener("keydown", onKeydown);
    (closeBtn || getFocusable()[0] || modalEl).focus();
  }

  closeBtn?.addEventListener("click", close);
  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) {
      close();
    }
  });

  return { activate, close };
}

const profileModalA11y = createModalA11y(modal, closeModal);
// Certificate modal has no open trigger yet; wire its close and backdrop so it will not trap focus once one is added.
createModalA11y(certificateModal, closeCertificate);

async function githubFetch(url, options = {}, retries = MAX_RETRIES) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 403) {
      const resetTime = response.headers.get("X-RateLimit-Reset");
      let message = "GitHub API rate limit exceeded.";
      if (resetTime) {
        const resetDate = new Date(resetTime * 1000);
        message += ` Try again after ${resetDate.toLocaleTimeString()}`;
      }
      throw new Error(message);
    }

    if (!response.ok) {
      throw new Error(`GitHub API Error (${response.status})`);
    }

    const data = await response.json();
    if (!data) {
      throw new Error("Empty response received");
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (retries > 0) {
      return githubFetch(url, options, retries - 1);
    }
    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please try again.");
    }
    if (error instanceof TypeError) {
      throw new Error("Network error. Check your internet connection.");
    }
    throw error;
  }
}

function saveCache(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    }),
  );
}

function loadCache(key, maxAge = 1000 * 60 * 10) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached);
    const isExpired = Date.now() - parsed.timestamp > maxAge;
    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

async function openProfile(username) {
  if (!modal || !modalBody) {
    console.error("Modal elements not found");
    return;
  }

  modal.style.display = "flex";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.zIndex = "999999999";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  modalBody.innerHTML = "<p>Loading...</p>";
  profileModalA11y.activate();

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      modalBody.textContent = "";
      const heading = document.createElement("h2");
      heading.textContent = username;

      const message = document.createElement("p");
      message.textContent = "Profile unavailable";

      modalBody.appendChild(heading);
      modalBody.appendChild(message);
      return;
    }

    const user = await response.json();
    modalBody.textContent = "";

    // Avatar
    const avatar = document.createElement("img");
    avatar.src = user.avatar_url;
    avatar.alt = user.name || username;
    avatar.loading = 'lazy';
    avatar.style.width = '120px';
    avatar.style.height = '120px';
    avatar.style.borderRadius = '50%';

    // Name Enforces Native Context Escaping Natively
    const name = document.createElement("h2");
    name.textContent = user.name || username;

    // Bio
    const bio = document.createElement("p");
    bio.textContent = user.bio || "No bio available";

    // Followers
    const followers = document.createElement("p");
    followers.textContent = `Followers: ${user.followers}`;

    // Repositories
    const repos = document.createElement("p");
    repos.textContent = `Repositories: ${user.public_repos}`;

    // Location
    const location = document.createElement("p");
    location.textContent = `Location: ${user.location || "Unknown"}`;

    // Append structural tree elements cleanly to canvas layout
    modalBody.appendChild(avatar);
    modalBody.appendChild(name);
    modalBody.appendChild(bio);
    modalBody.appendChild(followers);
    modalBody.appendChild(repos);
    modalBody.appendChild(location);

    if (user.html_url) {
      const profileLink = document.createElement("a");
      profileLink.href = user.html_url;
      profileLink.target = "_blank";
      profileLink.rel = "noopener noreferrer";
      profileLink.className = "github-btn";
      profileLink.textContent = "GitHub Profile";
      modalBody.appendChild(profileLink);
    }
  } catch (err) {
    modalBody.innerHTML = "<p>Failed to load profile</p>";
    console.log(err);
  }
}

let allContributors = [];
let filteredContributors = [];

async function fetchContributors() {
    const contributorsContainer = document.getElementById("contributors");
    const contributorCountSpan = document.getElementById("contributorCount");
    const errorBox = document.getElementById("contributorsError");
    const errorMessage = document.getElementById("contributorsErrorMessage");
    const loading = document.getElementById("contributorsLoading");

    loading?.classList.remove("hidden");
    errorBox?.classList.add("hidden");
    contributorsContainer.innerHTML = "";

    try {
        const cached = loadCache("contributors-cache");
        if (cached) {
            allContributors = cached;
            filteredContributors = [...cached];
            if (contributorCountSpan) contributorCountSpan.textContent = cached.length;
            renderContributors(filteredContributors);
            loading?.classList.add("hidden");
            return;
        }

        let page = 1;
        allContributors = [];

        while (true) {
            const data = await githubFetch(
                `${GITHUB_API_BASE}/repos/${window.REPO_OWNER}/${window.REPO_NAME}/contributors?per_page=100&page=${page}`
            );

            if (!data.length) break;

            // filter out anonymous contributors without login
            const validData = data.filter(c => c.login);
            allContributors.push(...validData);
            page++;
        }

        saveCache("contributors-cache", allContributors);

        filteredContributors = [...allContributors];

        if (contributorCountSpan) contributorCountSpan.textContent = allContributors.length;

        const totalCommits = allContributors.reduce((sum, c) => sum + c.contributions, 0);
        const totalCommitsEl = document.getElementById('totalCommits');
        if (totalCommitsEl) totalCommitsEl.textContent = totalCommits.toLocaleString();

        renderContributors(filteredContributors);

    } catch (error) {
        console.error("Error fetching contributors:", error);
        errorBox?.classList.remove("hidden");
        if (errorMessage) errorMessage.textContent = error.message;
    } finally {
        loading?.classList.add("hidden");
    }
}

function renderContributors(data) {
  const contributorsContainer = document.getElementById("contributors");
  const emptyState = document.getElementById("emptyState");

  contributorsContainer.innerHTML = "";

  if (data.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  const fragment = document.createDocumentFragment();

  data.forEach((contributor) => {
    const card = document.createElement("div");
    card.className = "contributor-card";

    const globalRank =
      allContributors.findIndex((c) => c.login === contributor.login) + 1;
    let badge = "";

    if (globalRank === 1) {
      badge = "assets/badges/diamond.png";
    } else if (globalRank >= 2 && globalRank <= 3) {
      badge = "assets/badges/gold.png";
    } else if (globalRank >= 4 && globalRank <= 6) {
      badge = "assets/badges/silver.png";
    } else if (globalRank >= 7 && globalRank <= 10) {
      badge = "assets/badges/bronze.png";
    }

    if (badge) {
      const badgeImg = document.createElement("img");
      badgeImg.className = "rank-badge";
      badgeImg.src = badge;
      badgeImg.alt = "Rank badge";
      card.appendChild(badgeImg);
    }

    const avatar = document.createElement("img");
    avatar.src = contributor.avatar_url;
    avatar.alt = contributor.login;
    avatar.loading = 'lazy';
    card.appendChild(avatar);

    const name = document.createElement("h3");
    name.textContent = contributor.login;
    card.appendChild(name);

    const stats = document.createElement("div");
    stats.className = "contributor-stats";

    const stat = document.createElement("div");
    stat.className = "stat";

    const value = document.createElement("span");
    value.className = "value";
    value.textContent = contributor.contributions;

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = "Commits";

    stat.appendChild(value);
    stat.appendChild(label);
    stats.appendChild(stat);
    card.appendChild(stats);

    const links = document.createElement("div");
    links.className = "contributor-links";

    const detailsBtn = document.createElement("button");
    detailsBtn.className = "details-btn";
    detailsBtn.dataset.user = contributor.login;
    detailsBtn.textContent = "View Details";
    detailsBtn.addEventListener("click", () => {
      openProfile(contributor.login);
    });

    const profileLink = document.createElement("a");
    profileLink.href = contributor.html_url;
    profileLink.target = "_blank";
    profileLink.rel = "noopener noreferrer";
    profileLink.className = "github-btn";

    const icon = document.createElement("i");
    icon.className = "fab fa-github";

    profileLink.appendChild(icon);
    profileLink.append(" Profile");

    links.appendChild(detailsBtn);
    links.appendChild(profileLink);
    card.appendChild(links);

    fragment.appendChild(card);
  });

  contributorsContainer.appendChild(fragment);
}

function renderStargazers(stargazers) {
  const stargazersContainer = document.getElementById("stargazers");
  stargazersContainer.innerHTML = "";

  stargazers.forEach((stargazer) => {
    const starItem = document.createElement("a");
    starItem.href = stargazer.html_url;
    starItem.target = "_blank";
    starItem.className = "stargazer-item";
    starItem.title = stargazer.login;

    const img = document.createElement("img");
    img.src = stargazer.avatar_url;
    img.alt = stargazer.login;
    img.loading = 'lazy';

    starItem.appendChild(img);
    stargazersContainer.appendChild(starItem);
  });
}

async function fetchStargazers() {
  const stargazersContainer = document.getElementById("stargazers");
  const errorBox = document.getElementById("stargazersError");
  const errorMessage = document.getElementById("stargazersErrorMessage");
  const loading = document.getElementById("stargazersLoading");

  loading.classList.remove("hidden");
  errorBox.classList.add("hidden");
  stargazersContainer.innerHTML = "";

  try {
    const cached = loadCache("stargazers-cache");
    if (cached) {
      renderStargazers(cached);
      loading.classList.add("hidden");
      return;
    }

    const stargazers = await githubFetch(
      `${GITHUB_API_BASE}/repos/${window.REPO_OWNER}/${window.REPO_NAME}/stargazers?per_page=100`,
    );

    saveCache("stargazers-cache", stargazers);
    renderStargazers(stargazers);
  } catch (error) {
    errorBox.classList.remove("hidden");
    errorMessage.textContent = error.message;
  } finally {
    loading.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchContributors();
  fetchStargazers();

  document
    .getElementById("retryContributors")
    ?.addEventListener("click", fetchContributors);
  document
    .getElementById("retryStargazers")
    ?.addEventListener("click", fetchStargazers);

  const searchInput = document.getElementById("contributorSearch");
  const sortSelect = document.getElementById("sortContributors");

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    if (!value) {
      filteredContributors = [...allContributors];
    } else {
      filteredContributors = allContributors.filter((c) =>
        c.login && c.login.toLowerCase().includes(value)
      );
    }
    renderContributors(filteredContributors);
  });

  sortSelect.addEventListener("change", (e) => {
    const order = e.target.value;
    filteredContributors.sort((a, b) => {
      return order === "asc"
        ? a.contributions - b.contributions
        : b.contributions - a.contributions;
    });
    renderContributors(filteredContributors);
  });
});

window.removeTechFilter = () => {};
window.clearAllTechFilters = () => {};
