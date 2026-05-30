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

async function openProfile(username, commits) {
  modal.style.display = 'flex';

  modalBody.innerHTML = `
        <p>Loading profile...</p>
    `;

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    const user = await response.json();

    modalBody.innerHTML = `

            <img
            src="${user.avatar_url}"
            >

            <h2>
            ${user.name || user.login}
            </h2>

            <p>
            ${user.bio || 'This contributor has not added a bio yet.'}
            </p>

            <p>
            Followers:
            ${user.followers}
            </p>

            <p>
            Public Repos:
            ${user.public_repos}
            </p>

            <p>
            Location:
            ${user.location || 'Not available'}
            </p>

            <p>
            Joined:
            ${new Date(user.created_at).toLocaleDateString()}
            </p>

           <div class="popup-btn-container">

    <a
    href="${user.html_url}"
    target="_blank"
    class="github-btn"
    >

    View GitHub

    </a>


    <button
    id="downloadCertificate"
    class="certificate-btn"
    >

    Download Certificate

    </button>

</div>

        `;

    const certificateBtn = document.getElementById('downloadCertificate');

    closeCertificate?.addEventListener(
      'click',

      () => {
        certificateModal.style.display = 'none';
      }
    );

    certificateBtn?.addEventListener(
      'click',

      () => {
        certificateModal.style.display = 'flex';

        certificateBody.innerHTML = `

<div style="
position:relative;
width:100%;
">

<img
src="assets/template.png"
style="
width:100%;
display:block;
border-radius:12px;
">


<!-- NAME -->

<div style="
position:absolute;
top:35%;
left:50%;
transform:translateX(-50%);
font-family:'Cinzel',serif;

font-size:24px;

font-weight:700;

background:
linear-gradient(
90deg,
#b8860b,
#f4d03f,
#8b5a00
);

-webkit-background-clip:text;

-webkit-text-fill-color:
transparent;

white-space:nowrap;

text-shadow:
0 2px 4px rgba(
0,
0,
0,
0.12
);
">

${user.name || user.login}

</div>



<!-- COMMITS -->

<div style="
position:absolute;
top:82%;
left:30%;
transform:translateX(-50%);
font-size:5px;
color:#5b21b6;
">

${commits}

</div>



<!-- USERNAME -->

<div style="
position:absolute;
top:82%;
left:50%;
transform:translateX(-50%);
font-size:5px;
color:#5b21b6;
">

@${user.login}

</div>



<!-- DATE -->

<div style="
position:absolute;
top:82%;
left:69%;
transform:translateX(-50%);
font-size:5px;
color:#5b21b6;
">

${new Date().toLocaleDateString('en-GB')}

</div>

</div>


<div style="
text-align:center;
margin-top:20px;
">

<button
id="downloadPdfBtn"
style="
background:#16a34a;
padding:14px 30px;
color:white;
border:none;
border-radius:10px;
cursor:pointer;
">

Download PDF

</button>

</div>

`;
        const downloadBtn = document.getElementById('downloadPdfBtn');

        downloadBtn?.addEventListener(
          'click',

          async () => {
            const certificate = certificateBody.querySelector('div');

            const canvas = await html2canvas(
              certificate,

              {
                scale: 3,

                useCORS: true,
              }
            );

            const image = canvas.toDataURL('image/png');

            const { jsPDF } = window.jspdf;

            const pdf = new jsPDF(
              'landscape',

              'px',

              [canvas.width, canvas.height]
            );

            pdf.addImage(
              image,

              'PNG',

              0,

              0,

              canvas.width,

              canvas.height
            );

            pdf.save(`${user.login}-certificate.pdf`);
          }
        );
      }
    );
  } catch (error) {
    modalBody.innerHTML = '<p>Failed to load profile</p>';

    console.error(error);
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
          openProfile(
            contributor.login,

            contributor.contributions
          );
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
