const form = document.getElementById("searchForm");
const input = document.getElementById("usernameInput");
const statusBox = document.getElementById("statusBox");
const profileCard = document.getElementById("profileCard");
const reposSection = document.getElementById("reposSection");
const reposList = document.getElementById("reposList");

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const elements = {
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
    margin: 1rem 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border, #ccc);
  `;
  form.parentNode.insertBefore(searchResultsContainer, profileCard);
}

function updateThemeIcon() {
  themeIcon.textContent = document.body.classList.contains("dark") ? "☀" : "☾";
}

function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.toggle("dark", savedTheme === "dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.body.classList.toggle("dark", prefersDark);
  }
  updateThemeIcon();
}

function showStatus(message, type = "success") {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
  statusBox.classList.remove("hidden");
}

function hideStatus() {
  statusBox.classList.add("hidden");
}

function showLoading() {
  showStatus("Loading profile...", "success");
  profileCard.classList.add("hidden");
  reposSection.classList.add("hidden");
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

function renderProfile(user) {
  elements.avatar.src = user.avatar_url;
  elements.avatar.alt = `${user.login} avatar`;
  elements.name.textContent = safeText(user.name, user.login);
  elements.username.textContent = `@${user.login}`;
  elements.bio.textContent = safeText(user.bio, "No bio available.");
  elements.location.textContent = safeText(user.location);
  elements.company.textContent = safeText(user.company);

  if (user.blog) {
    const blogUrl = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
    elements.website.innerHTML = `<a href="${blogUrl}" target="_blank" rel="noreferrer">${user.blog}</a>`;
  } else {
    elements.website.textContent = "—";
  }

  elements.joined.textContent = formatDate(user.created_at);
  elements.repoCount.textContent = user.public_repos;
  elements.followers.textContent = user.followers;
  elements.following.textContent = user.following;
  elements.gists.textContent = user.public_gists;
  elements.profileLink.href = user.html_url;

  profileCard.classList.remove("hidden");
}

function renderRepos(repos) {
  reposList.innerHTML = "";

  if (!repos.length) {
    reposList.innerHTML = `<div class="repo-card">No repositories found.</div>`;
    reposSection.classList.remove("hidden");
    return;
  }

  repos.forEach((repo) => {
    const card = document.createElement("article");
    card.className = "repo-card";
    card.innerHTML = `
      <div class="repo-top">
        <h4 class="repo-name">
          <a class="repo-link" href="${repo.html_url}" target="_blank" rel="noreferrer">
            ${repo.name}
          </a>
        </h4>
        ${repo.language ? `<span class="pill">${repo.language}</span>` : ""}
      </div>
      <p class="repo-description">${repo.description || "No description provided."}</p>
      <div class="repo-meta">
        <span class="pill">★ ${repo.stargazers_count}</span>
        <span class="pill">⑂ ${repo.forks_count}</span>
        <span class="pill">Updated ${formatDate(repo.updated_at)}</span>
      </div>
    `;
    reposList.appendChild(card);
  });

  reposSection.classList.remove("hidden");
}

function renderSearchResults(users) {
  searchResultsContainer.innerHTML = "";

  if (!users.length) {
    searchResultsContainer.style.display = "none";
    return;
  }

  const heading = document.createElement("p");
  heading.textContent = `${users.length} matching profile(s) found. Click to view:`;
  heading.style.cssText = "padding: 0.5rem 1rem; font-weight: bold; margin: 0;";
  searchResultsContainer.appendChild(heading);

  users.forEach((user) => {
    const item = document.createElement("div");
    item.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-top: 1px solid var(--border, #ccc);
      transition: background 0.2s;
    `;
    item.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" style="width:36px;height:36px;border-radius:50%;">
      <span>${user.login}</span>
    `;
    item.addEventListener("mouseover", () => item.style.background = "rgba(128,128,128,0.1)");
    item.addEventListener("mouseout", () => item.style.background = "");
    item.addEventListener("click", () => {
      input.value = user.login;
      searchResultsContainer.style.display = "none";
      fetchUser(user.login);
    });
    searchResultsContainer.appendChild(item);
  });

  searchResultsContainer.style.display = "block";
}

async function fetchUser(username) {
  const cleanName = username.trim().replace(/^@/, "");

  if (!cleanName) {
    showStatus("Please enter a GitHub username.", "error");
    return;
  }

  showLoading();

  try {
    const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanName)}`);

    if (userResponse.ok) {
      const user = await userResponse.json();
      const repoResponse = await fetch(
        `https://api.github.com/users/${encodeURIComponent(cleanName)}/repos?per_page=100&sort=updated`
      );
      const repos = await repoResponse.json();
      const sortedRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 6);
      renderProfile(user);
      renderRepos(sortedRepos);
      hideStatus();
    } else {
      const searchResponse = await fetch(
        `https://api.github.com/search/users?q=${encodeURIComponent(cleanName)}&per_page=10`
      );

      if (!searchResponse.ok) {
        throw new Error("Unable to search users.");
      }

      const searchData = await searchResponse.json();

      if (!searchData.items || searchData.items.length === 0) {
        throw new Error("No users found matching your search.");
      }

      if (searchData.items.length === 1) {
        await fetchUser(searchData.items[0].login);
      } else {
        hideStatus();
        profileCard.classList.add("hidden");
        reposSection.classList.add("hidden");
        renderSearchResults(searchData.items);
      }
    }
  } catch (error) {
    profileCard.classList.add("hidden");
    reposSection.classList.add("hidden");
    searchResultsContainer.style.display = "none";
    showStatus(error.message || "Something went wrong.", "error");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  fetchUser(input.value);
});

document.querySelectorAll(".quick-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    input.value = btn.dataset.user;
    fetchUser(btn.dataset.user);
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  updateThemeIcon();
});

initTheme();
