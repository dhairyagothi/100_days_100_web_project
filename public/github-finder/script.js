// Target base GitHub tracking endpoint URLs
const GITHUB_API_BASE = 'https://api.github.com/users';

const searchForm = document.getElementById('searchForm');
const usernameInput = document.getElementById('usernameInput');

const welcomeState = document.getElementById('welcomeState');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorTitle = document.getElementById('errorTitle');
const errorMessage = document.getElementById('errorMessage');
const profileResultCard = document.getElementById('profileResultCard');

// Profile DOM interface binding node pointers
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userLogin = document.getElementById('userLogin');
const userBio = document.getElementById('userBio');
const repoCount = document.getElementById('repoCount');
const followerCount = document.getElementById('followerCount');
const followingCount = document.getElementById('followingCount');
const userLocation = document.getElementById('userLocation');
const locationWrapper = document.getElementById('locationWrapper');
const reposGrid = document.getElementById('reposGrid');

// Core API Processing Core Async Manager
async function executeGitHubProfileQuery(username) {
  // Switch state layouts to engage loading status view blocks
  welcomeState.classList.add('hidden');
  errorState.classList.add('hidden');
  profileResultCard.classList.add('hidden');
  loadingState.classList.remove('hidden');

  try {
    // Query the profile metadata row
    const profileResponse = await fetch(`${GITHUB_API_BASE}/${username}`);

    // Handle 404 Not Found error states gracefully
    if (profileResponse.status === 404) {
      showError(
        'No User Found',
        "We couldn't locate that specific profile. Check your spelling and try searching again."
      );
      return;
    }

    if (profileResponse.status === 403) {
      showError(
        'Rate Limit Exceeded',
        'GitHub API rate limit exceeded. Please try again later.'
      );
      return;
    }

    if (!profileResponse.ok) throw new Error('API rejection flag thrown.');

    const profileData = await profileResponse.json();

    // Query repository details sorted by most recently updated public items
    const reposResponse = await fetch(
      `${GITHUB_API_BASE}/${username}/repos?sort=updated&per_page=5`
    );
    const reposData = reposResponse.ok ? await reposResponse.json() : [];

    populateProfileInterface(profileData, reposData);
  } catch (error) {
    console.error(error);

    showError('API Error', 'Unable to fetch profile data due to an API error.');
  }
}

function showError(title, message) {
  errorTitle.innerText = title;
  errorMessage.innerText = message;
  showStateCard(errorState);
}

// Map retrieved properties directly onto DOM elements
function populateProfileInterface(user, repos) {
  loadingState.classList.add('hidden');
  profileResultCard.classList.remove('hidden');

  // Bind metric values safely
  userAvatar.src = user.avatar_url;
  userName.innerText = user.name || user.login;
  userLogin.innerText = `@${user.login}`;
  userLogin.href = user.html_url;
  userBio.innerText = user.bio || 'This user has no profile bio registered.';

  repoCount.innerText = user.public_repos;
  followerCount.innerText = user.followers;
  followingCount.innerText = user.following;

  // Evaluate geography badges
  if (user.location) {
    userLocation.innerText = user.location;
    locationWrapper.classList.remove('hidden');
  } else {
    locationWrapper.classList.add('hidden');
  }

  // Refresh and build repository container cards
  reposGrid.innerHTML = '';
  if (repos.length === 0) {
    reposGrid.innerHTML = `<p class="text-secondary" style="grid-column: 1/-1;">No public repositories located inside this user's registry layout.</p>`;
    return;
  }

  // Iterate over nested repository arrays to display the top 5 public targets
  repos.forEach((repo) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'repo-card';
    cardElement.innerHTML = `
            <div class="repo-card-header">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
                <p class="repo-desc">${repo.description || 'No description asset logs submitted.'}</p>
            </div>
            <div class="repo-footer">
                <span class="repo-stat">⭐ ${repo.stargazers_count}</span>
                <span class="repo-stat">🍴 ${repo.forks_count}</span>
            </div>
        `;
    reposGrid.appendChild(cardElement);
  });
}

// Utility presentation view toggle
function showStateCard(targetCard) {
  loadingState.classList.add('hidden');
  welcomeState.classList.add('hidden');
  errorState.classList.add('hidden');
  profileResultCard.classList.add('hidden');
  targetCard.classList.remove('hidden');
}

// Wire form operational submission interceptors
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const targetedUser = usernameInput.value.trim();
  if (targetedUser) {
    executeGitHubProfileQuery(targetedUser);
  }
});
