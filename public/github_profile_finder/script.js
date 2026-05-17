const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultDiv = document.getElementById('result');

// Event listeners
searchBtn.addEventListener('click', searchProfile);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProfile();
    }
});

async function searchProfile() {
    const username = searchInput.value.trim();

    if (!username) {
        resultDiv.innerHTML = '<div class="error">Please enter a GitHub username</div>';
        return;
    }

    resultDiv.innerHTML = '<div class="loading">Searching...</div>';

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);

        if (!response.ok) {
            throw new Error('User not found');
        }

        const data = await response.json();
        displayProfile(data);
    } catch (error) {
        resultDiv.innerHTML = `<div class="error">❌ ${error.message}. Please check the username and try again.</div>`;
    }
}

function displayProfile(user) {
    const profileHTML = `
        <div class="profile">
            <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            <div class="profile-info">
                <h2>${user.name || user.login}</h2>
                <p>@${user.login}</p>
                <p>${user.bio || 'No bio available'}</p>
                ${user.location ? `<p><img src="Images/location-icon.svg" alt="Location"> ${user.location}</p>` : ''}
                <p>
                    <img src="Images/website-icon.svg" alt="Website"> 
                    <a href="${user.html_url}" target="_blank">View GitHub Profile</a>
                </p>
            </div>
            <div class="stats">
                <div class="stat">
                    <h3>${user.public_repos}</h3>
                    <p>Repositories</p>
                </div>
                <div class="stat">
                    <h3>${user.followers}</h3>
                    <p>Followers</p>
                </div>
                <div class="stat">
                    <h3>${user.following}</h3>
                    <p>Following</p>
                </div>
            </div>
        </div>
    `;
    resultDiv.innerHTML = profileHTML;
}
