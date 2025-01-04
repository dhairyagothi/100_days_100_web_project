const REPO_OWNER = "dhairyagothi";
const REPO_NAME = "100_days_100_web_project";
const GITHUB_TOKEN = ""; // Optional: Add your GitHub personal access token to avoid rate limits

async function fetchContributors() {
  const contributorsContainer = document.getElementById("contributors");

  try {
    // Fetch contributors from the GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100`,
      {
        headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {},
      }
    );

    if (!response.ok) throw new Error("Failed to fetch contributors");

    const contributors = await response.json();

    contributors.forEach((contributor) => {
      // Create a card for each contributor
      const card = document.createElement("div");
      card.className = "contributor-card";

      // Profile image
      const img = document.createElement("img");
      img.src = contributor.avatar_url;
      img.alt = contributor.login;

      // GitHub username
      const name = document.createElement("h3");
      name.textContent = contributor.login;

      // GitHub profile link
      const githubLink = document.createElement("a");
      githubLink.href = contributor.html_url;
      githubLink.target = "_blank";
      githubLink.textContent = "GitHub Profile";

      // Append elements to card
      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(githubLink);

      // Append card to container
      contributorsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching contributors:", error);

    // Show error message on the page
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Failed to load contributors. Please try again.";
    contributorsContainer.appendChild(errorMessage);
  }
}

// Fetch and render contributors on page load
fetchContributors();
