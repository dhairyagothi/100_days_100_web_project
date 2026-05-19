const modal =
document.getElementById("profileModal");

const modalBody =
document.getElementById("modalBody");

const closeModal =
document.getElementById("closeModal");


closeModal?.addEventListener(
"click",

()=>{

modal.style.display =
"none";

});


window.addEventListener(
"click",

(e)=>{

if(e.target===modal){

modal.style.display=
"none";

}

});

async function openProfile(username) {

    modal.style.display = "flex";

    modalBody.innerHTML = `
        <p>Loading profile...</p>
    `;

    try {

        const response =
        await fetch(
            `https://api.github.com/users/${username}`
        );

        const user =
        await response.json();

        modalBody.innerHTML = `

            <img
            src="${user.avatar_url}"
            >

            <h2>
            ${user.name || user.login}
            </h2>

            <p>
            ${user.bio || "This contributor has not added a bio yet."}
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
            ${user.location || "Not available"}
            </p>

            <p>
            Joined:
            ${new Date(
                user.created_at
            ).toLocaleDateString()}
            </p>

            <div class="popup-btn-container">

                <a
                href="${user.html_url}"
                target="_blank"
                class="github-btn"
                >

                View GitHub

                </a>

            </div>

        `;

    }

    catch(error){

        modalBody.innerHTML =
        "<p>Failed to load profile</p>";

        console.error(error);

    }

}
// Use global REPO_OWNER and REPO_NAME defined in index.js

async function fetchContributors() {
    const contributorsContainer = document.getElementById("contributors");
    const contributorCountSpan = document.getElementById("contributorCount");

    try {
        const response = await fetch(
            `https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}/contributors?per_page=100`
        );

        if (!response.ok) throw new Error("Failed to fetch contributors");

        const contributors = await response.json();
        contributorCountSpan.textContent = contributors.length;

        // Calculate total commits
        const totalCommits = contributors.reduce((sum, c) => sum + c.contributions, 0);
        const totalCommitsEl = document.getElementById('totalCommits');
        if (totalCommitsEl) totalCommitsEl.textContent = totalCommits.toLocaleString();

        contributorsContainer.innerHTML = ""; 

        contributors.forEach((contributor) => {
            const card = document.createElement("div");
            card.className = "contributor-card";

            card.innerHTML = `
                <img src="${contributor.avatar_url}" alt="${contributor.login}">
                <h3>${contributor.login}</h3>
                <div class="contributor-stats">
                    <div class="stat">
                        <span class="value">${contributor.contributions}</span>
                        <span class="label">Commits</span>
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
            contributorsContainer.appendChild(card);
            const detailsButton =
card.querySelector(
".details-btn"
);

if(detailsButton){

detailsButton.addEventListener(

"click",

()=>{

openProfile(
contributor.login
);

});

}
        });
    } catch (error) {
        console.error("Error fetching contributors:", error);
        if (contributorsContainer) contributorsContainer.innerHTML = "<p style='color: #ff4444;'>Failed to load contributors.</p>";
    }
}

async function fetchStargazers() {
    const stargazersContainer = document.getElementById("stargazers");

    try {
        const response = await fetch(
            `https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}/stargazers?per_page=100`
        );

        if (!response.ok) throw new Error("Failed to fetch stargazers");

        const stargazers = await response.json();
        if (stargazersContainer) stargazersContainer.innerHTML = "";

        stargazers.forEach((stargazer) => {
            const starItem = document.createElement("a");
            starItem.href = stargazer.html_url;
            starItem.target = "_blank";
            starItem.className = "stargazer-item";
            starItem.title = stargazer.login;
            starItem.innerHTML = `<img src="${stargazer.avatar_url}" alt="${stargazer.login}">`;
            if (stargazersContainer) stargazersContainer.appendChild(starItem);
        });
    } catch (error) {
        console.error("Error fetching stargazers:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Repo stats are now handled by index.js
    fetchContributors();
    fetchStargazers();
});
