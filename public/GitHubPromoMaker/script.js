document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("repoForm");
    const input = document.getElementById("repoInput");
    const generateBtn = document.getElementById("generateBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const errorMessage = document.getElementById("errorMessage");

    const themeSelect = document.getElementById("themeSelect");
    const promoCard = document.getElementById("promoCard");

    // Card elements
    const ownerAvatar = document.getElementById("ownerAvatar");
    const ownerName = document.getElementById("ownerName");
    const repoName = document.getElementById("repoName");
    const repoDescription = document.getElementById("repoDescription");

    const starCount = document.getElementById("starCount");
    const forkCount = document.getElementById("forkCount");
    const watcherCount = document.getElementById("watcherCount");

    const repoLanguage = document.getElementById("repoLanguage");
    const languageBadge = document.getElementById("languageBadge");

    // NEW: insights
    const issuesCount = document.getElementById("issuesCount");
    const licenseName = document.getElementById("licenseName");
    const defaultBranch = document.getElementById("defaultBranch");

    // =========================
    // FORMAT NUMBER
    // =========================
    const formatNumber = (num) => {
        if (num === null || num === undefined) return "0";
        return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
    };

    // =========================
    // EXTRACT REPO PATH
    // =========================
    const extractRepoPath = (rawInput) => {
        let path = rawInput.trim();

        if (path.includes("github.com/")) {
            path = path.split("github.com/")[1];
        }

        const parts = path.split("/");
        if (parts.length >= 2) {
            return `${parts[0]}/${parts[1]}`;
        }

        return null;
    };

    // =========================
    // APPLY THEME
    // =========================
    const applyTheme = (theme) => {
        promoCard.classList.remove(
            "theme-github-dark",
            "theme-github-light",
            "theme-neon",
            "theme-glass",
            "theme-sunset"
        );

        promoCard.classList.add(`theme-${theme}`);
    };

    themeSelect.addEventListener("change", (e) => {
        applyTheme(e.target.value);
    });

    // =========================
    // FORM SUBMIT
    // =========================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const repoPath = extractRepoPath(input.value);

        if (!repoPath) {
            errorMessage.textContent =
                "Invalid format. Please enter 'owner/repo' or GitHub URL.";
            errorMessage.classList.remove("hidden");
            return;
        }

        errorMessage.classList.add("hidden");

        generateBtn.disabled = true;
        generateBtn.innerHTML =
            '<span class="material-symbols-outlined">sync</span> Loading...';

        try {
            const response = await fetch(
                `https://api.github.com/repos/${repoPath}`
            );

            if (!response.ok) throw new Error("Repo not found");

            const data = await response.json();

            // =========================
            // BASIC INFO
            // =========================
            ownerAvatar.src = data.owner.avatar_url;
            ownerName.textContent = data.owner.login;
            repoName.textContent = data.name;
            repoDescription.textContent =
                data.description ||
                "No description provided for this repository.";

            // =========================
            // STATS
            // =========================
            starCount.textContent = formatNumber(data.stargazers_count);
            forkCount.textContent = formatNumber(data.forks_count);
            watcherCount.textContent = formatNumber(data.subscribers_count);

            // =========================
            // LANGUAGE
            // =========================
            if (data.language) {
                repoLanguage.textContent = data.language;
                languageBadge.style.display = "flex";
            } else {
                languageBadge.style.display = "none";
            }

            // =========================
            // INSIGHTS SECTION (NEW)
            // =========================

            issuesCount.textContent = `${data.open_issues_count} Issues`;

            licenseName.textContent =
                data.license && data.license.name
                    ? data.license.name
                    : "No License";

            defaultBranch.textContent = data.default_branch || "main";

            // enable download
            downloadBtn.disabled = false;

        } catch (err) {
            console.error(err);

            errorMessage.textContent =
                "Repository not found. Please check the URL.";
            errorMessage.classList.remove("hidden");

            downloadBtn.disabled = true;
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = "Generate Card";
        }
    });

    // =========================
    // DOWNLOAD IMAGE
    // =========================
    downloadBtn.addEventListener("click", () => {
        const cardElement = document.getElementById("promoCard");

        const originalText = downloadBtn.innerHTML;

        downloadBtn.innerHTML =
            '<span class="material-symbols-outlined">sync</span> Generating...';
        downloadBtn.disabled = true;

        html2canvas(cardElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
        })
            .then((canvas) => {
                const link = document.createElement("a");
                link.download = `${repoName.textContent}-promo-card.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();

                downloadBtn.innerHTML =
                    '<span class="material-symbols-outlined">check</span> Downloaded!';

                setTimeout(() => {
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.disabled = false;
                }, 1500);
            })
            .catch((err) => {
                console.error("Download error:", err);

                alert(
                    "Error generating image. Please try again."
                );

                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            });
    });

    // =========================
    // INIT DEFAULT THEME
    // =========================
    applyTheme(themeSelect.value);
});