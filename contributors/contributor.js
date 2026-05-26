const modal = document.getElementById('profileModal');

const modalBody = document.getElementById('modalBody');

const closeModal = document.getElementById('closeModal');

const certificateModal = document.getElementById('certificateModal');

const certificateBody = document.getElementById('certificateBody');

const closeCertificate = document.getElementById('closeCertificate');

const GITHUB_API_BASE = 'https://api.github.com';

const REQUEST_TIMEOUT = 10000;

const MAX_RETRIES = 3;

closeModal?.addEventListener(
  'click',

  () => {
    modal.style.display = 'none';
  }
);

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
        Accept: 'application/vnd.github+json',
      },
    });

    clearTimeout(timeoutId);

    if (response.status === 403) {
      const resetTime = response.headers.get('X-RateLimit-Reset');

      let message = 'GitHub API rate limit exceeded.';

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
      throw new Error('Empty response received');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (retries > 0) {
      return githubFetch(url, options, retries - 1);
    }

    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }

    if (error instanceof TypeError) {
      throw new Error('Network error. Check your internet connection.');
    }

    throw error;
  }
}

window.addEventListener(
  'click',

  (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  }
);

function saveCache(key, data) {
  localStorage.setItem(
    key,
    JSON.stringify({
      timestamp: Date.now(),
      data,
    })
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

async function openProfile(username){

    modal.style.display = "flex";
    modal.style.position = "fixed";

    modal.style.top = "0";

    modal.style.left = "0";

    modal.style.zIndex = "999999999";

    modal.style.justifyContent = "center";

    modal.style.alignItems = "center";

    modalBody.innerHTML =
    "<p>Loading...</p>";

    try{

        const response =
        await fetch(
        `https://api.github.com/users/${username}`
        );

        if(!response.ok){

            modalBody.innerHTML = `
            <h2>${username}</h2>

            <p>
            Profile unavailable
            </p>
            `;

            return;
        }

        const user =
        await response.json();


        modalBody.innerHTML = `

        <img
        src="${user.avatar_url}"
        style="
        width:120px;
        height:120px;
        border-radius:50%;
        ">

        <h2>
        ${user.name || username}
        </h2>

        <p>
        ${user.bio || "No bio available"}
        </p>

        <p>
        Followers:
        ${user.followers}
        </p>

        <p>
        Repositories:
        ${user.public_repos}
        </p>

        <p>
        Location:
        ${user.location || "Unknown"}
        </p>

        ${
        user.html_url
        ?

        `<a
        href="${user.html_url}"
        target="_blank"
        class="github-btn">

        GitHub Profile

        </a>`

        :

        ""
        }

        `;

    }

    catch(err){

        modalBody.innerHTML =
        "<p>Failed to load profile</p>";

        console.log(err);
    }

}
// Use global REPO_OWNER and REPO_NAME defined in index.js

let allContributors = [];
let filteredContributors = [];

async function fetchContributors() {
  const contributorsContainer = document.getElementById('contributors');

  const contributorCountSpan = document.getElementById('contributorCount');

  const errorBox = document.getElementById('contributorsError');

  const errorMessage = document.getElementById('contributorsErrorMessage');

  const loading = document.getElementById('contributorsLoading');

  loading.classList.remove('hidden');

  errorBox.classList.add('hidden');

  contributorsContainer.innerHTML = '';

  try {
    const cached = loadCache('contributors-cache');

    if (cached) {
      allContributors = cached;

      filteredContributors = [...cached];

      contributorCountSpan.textContent = cached.length;

      renderContributors(filteredContributors);

      loading.classList.add('hidden');

      return;
    }

    const contributors = await githubFetch(
      `${GITHUB_API_BASE}/repos/${window.REPO_OWNER}/${window.REPO_NAME}/contributors?per_page=100`
    );

    saveCache('contributors-cache', contributors);

    contributorCountSpan.textContent = contributors.length;

    const totalCommits = contributors.reduce(
      (sum, c) => sum + c.contributions,
      0
    );

    const totalCommitsEl = document.getElementById('totalCommits');

    if (totalCommitsEl) {
      totalCommitsEl.textContent = totalCommits.toLocaleString();
    }

    allContributors = contributors;

    filteredContributors = [...contributors];

    renderContributors(filteredContributors);
  } catch (error) {
    errorBox.classList.remove('hidden');

    errorMessage.textContent = error.message;

    contributorsContainer.innerHTML = '';
  } finally {
    loading.classList.add('hidden');
  }
}

function renderContributors(data) {
  const contributorsContainer = document.getElementById('contributors');

  const emptyState = document.getElementById('emptyState');

  contributorsContainer.innerHTML = '';

  if (data.length === 0) {
    emptyState.style.display = 'block';

    return;
  }

  emptyState.style.display = 'none';

  const fragment = document.createDocumentFragment();

  data.forEach((contributor) => {
    const card = document.createElement('div');

    const globalRank =
      allContributors.findIndex((c) => c.login === contributor.login) + 1;

    let badge = '';

    if (globalRank === 1) {
      badge = 'assets/badges/diamond.png';
    } else if (globalRank >= 2 && globalRank <= 3) {
      badge = 'assets/badges/gold.png';
    } else if (globalRank >= 4 && globalRank <= 6) {
      badge = 'assets/badges/silver.png';
    } else if (globalRank >= 7 && globalRank <= 10) {
      badge = 'assets/badges/bronze.png';
    }

    card.className = 'contributor-card';

    card.innerHTML = `

${
  badge
    ? `<img
src="${badge}"
class="rank-badge"
>`
    : ''
}

<img
src="${contributor.avatar_url}"

alt="${contributor.login}">

            <h3>${contributor.login}</h3>

            <div class="contributor-stats">

                <div class="stat">

                    <span class="value">
                        ${contributor.contributions}
                    </span>

                    <span class="label">
                        Commits
                    </span>

                </div>

            </div>

           <div class="contributor-links">

    <button
        class="details-btn"
        data-user="${contributor.login}"
    >

        View Details

    </button>

    <a
        href="${contributor.html_url}"
        target="_blank"
        class="github-btn"
    >

        <i class="fab fa-github"></i>
        Profile

    </a>

</div>
        `;

    fragment.appendChild(card);
    const detailsButton = card.querySelector('.details-btn');

    if (detailsButton) {
      detailsButton.addEventListener(
        'click',

        () => {
    openProfile(contributor.login);
        }
      );
    }
  });

  contributorsContainer.appendChild(fragment);
}

function renderStargazers(stargazers) {
  const stargazersContainer = document.getElementById('stargazers');

  stargazersContainer.innerHTML = '';

  stargazers.forEach((stargazer) => {
    const starItem = document.createElement('a');

    starItem.href = stargazer.html_url;

    starItem.target = '_blank';

    starItem.className = 'stargazer-item';

    starItem.title = stargazer.login;

    starItem.innerHTML = `
      <img
        src="${stargazer.avatar_url}"
        alt="${stargazer.login}"
      >
    `;

    stargazersContainer.appendChild(starItem);
  });
}

async function fetchStargazers() {
  const stargazersContainer = document.getElementById('stargazers');

  const errorBox = document.getElementById('stargazersError');

  const errorMessage = document.getElementById('stargazersErrorMessage');

  const loading = document.getElementById('stargazersLoading');

  loading.classList.remove('hidden');

  errorBox.classList.add('hidden');

  stargazersContainer.innerHTML = '';

  try {
    const cached = loadCache('stargazers-cache');

    if (cached) {
      renderStargazers(cached);

      loading.classList.add('hidden');

      return;
    }

    const stargazers = await githubFetch(
      `${GITHUB_API_BASE}/repos/${window.REPO_OWNER}/${window.REPO_NAME}/stargazers?per_page=100`
    );

    saveCache('stargazers-cache', stargazers);

    renderStargazers(stargazers);
  } catch (error) {
    errorBox.classList.remove('hidden');

    errorMessage.textContent = error.message;
  } finally {
    loading.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Repo stats are now handled by index.js
  fetchContributors();
  fetchStargazers();
  
  document
    .getElementById('retryContributors')
    ?.addEventListener('click', fetchContributors);

  document
    .getElementById('retryStargazers')
    ?.addEventListener('click', fetchStargazers);

  const searchInput = document.getElementById('contributorSearch');

  const sortSelect = document.getElementById('sortContributors');
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();

    filteredContributors = allContributors.filter((c) =>
      c.login.toLowerCase().includes(value)
    );

    renderContributors(filteredContributors);
  });

  sortSelect.addEventListener('change', (e) => {
    const order = e.target.value;

    filteredContributors.sort((a, b) => {
      return order === 'asc'
        ? a.contributions - b.contributions
        : b.contributions - a.contributions;
    });

    renderContributors(filteredContributors);
  });
});
