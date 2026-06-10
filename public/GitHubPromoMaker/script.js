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

    // Insights
    const issuesCount = document.getElementById("issuesCount");
    const licenseName = document.getElementById("licenseName");
    const defaultBranch = document.getElementById("defaultBranch");

    // =========================
    // SAFE REPO PARSER (FIXED CODEQL ISSUE)
    // =========================
    const extractRepoPath = (rawInput) => {
        try {
            const input = rawInput.trim();

            // Case 1: Full GitHub URL
            if (input.includes("github.com")) {
                const url = new URL(input);

                // STRICT check (prevents spoofing attacks)
                if (
                    url.hostname !== "github.com" &&
                    url.hostname !== "www.github.com"
                ) {
                    return null;
                }

                const parts = url.pathname.split("/").filter(Boolean);

                if (parts.length >= 2) {
                    return `${parts[0]}/${parts[1]}`;
                }

                return null;
            }

            // Case 2: owner/repo format
            const parts = input.split("/");
            if (parts.length >= 2) {
                return `${parts[0]}/${parts[1]}`;
            }

            return null;
        } catch (err) {
            return null;
        }
    };

    // =========================
    // FORMAT NUMBER
    // =========================
    const formatNumber = (num) => {
        if (num === null || num === undefined) return "0";
        return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
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
    // FETCH REPO DATA
    // =========================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const repoPath = extractRepoPath(input.value);

        if (!repoPath) {
            errorMessage.textContent =
                "Invalid GitHub URL or format (use owner/repo).";
            errorMessage.classList.remove("hidden");
            return;
        }

        errorMessage.classList.add("hidden");

        generateBtn.disabled = true;
        generateBtn.innerHTML =
            '<span class="material-symbols-outlined">sync</span> Loading...';

        try {
            const res = await fetch(
                `https://api.github.com/repos/${repoPath}`
            );

            if (!res.ok) throw new Error("Repo not found");

            const data = await res.json();

            // Main info
            ownerAvatar.src = data.owner.avatar_url;
            ownerName.textContent = data.owner.login;
            repoName.textContent = data.name;
            repoDescription.textContent =
                data.description || "No description available.";

            // Stats
            starCount.textContent = formatNumber(data.stargazers_count);
            forkCount.textContent = formatNumber(data.forks_count);
            watcherCount.textContent = formatNumber(data.subscribers_count);

            // Language
            if (data.language) {
                repoLanguage.textContent = data.language;
                languageBadge.style.display = "flex";
            } else {
                languageBadge.style.display = "none";
            }

            // Insights
            issuesCount.textContent = `${data.open_issues_count} Issues`;
            licenseName.textContent =
                data.license?.name || "No License";
            defaultBranch.textContent = data.default_branch || "main";

            downloadBtn.disabled = false;

        } catch (err) {
            console.error(err);

            errorMessage.textContent =
                "Repository not found. Please check input.";
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
        const card = document.getElementById("promoCard");

        const original = downloadBtn.innerHTML;

        downloadBtn.innerHTML =
            '<span class="material-symbols-outlined">sync</span> Generating...';
        downloadBtn.disabled = true;

        html2canvas(card, {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
        })
            .then((canvas) => {
                const link = document.createElement("a");
                link.download = `${repoName.textContent}-promo.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();

                downloadBtn.innerHTML =
                    '<span class="material-symbols-outlined">check</span> Downloaded!';

                setTimeout(() => {
                    downloadBtn.innerHTML = original;
                    downloadBtn.disabled = false;
                }, 1500);
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to generate image.");

                downloadBtn.innerHTML = original;
                downloadBtn.disabled = false;
            });
    });

    // =========================
    // INIT THEME
    // =========================
    applyTheme(themeSelect.value);
});