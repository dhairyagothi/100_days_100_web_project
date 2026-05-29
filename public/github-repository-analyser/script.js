const searchBtn = document.getElementById("searchBtn");
const repoInput = document.getElementById("repoInput");
const result = document.getElementById("result");

searchBtn.addEventListener("click", () => {
  const repoName = repoInput.value;

  fetch(`https://api.github.com/repos/${repoName}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Not Found") {
        result.innerHTML = `
        <p style="color:red;">Repository not found</p>
    `;
        return;
      }
      result.innerHTML = `
                <h2>${data.name}</h2>
                <p class="description">${data.description}</p>
                <p>⭐ Stars: ${data.stargazers_count}</p>
                <p>🍴 Forks: ${data.forks_count}</p>
                <p>🖥 Language: ${data.language}</p>

                <a href="${data.html_url}" target="_blank">
                <button>View on GitHub</button>
</a>
            `;
    });
});
