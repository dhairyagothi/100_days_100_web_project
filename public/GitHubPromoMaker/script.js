document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("repoForm");
    const input = document.getElementById("repoInput");
    const generateBtn = document.getElementById("generateBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const errorMessage = document.getElementById("errorMessage");

    const themeSelect = document.getElementById("themeSelect");
    const promoCard = document.getElementById("promoCard");

    const ownerAvatar = document.getElementById("ownerAvatar");
    const ownerName = document.getElementById("ownerName");
    const repoName = document.getElementById("repoName");
    const repoDescription = document.getElementById("repoDescription");

    const starCount = document.getElementById("starCount");
    const forkCount = document.getElementById("forkCount");
    const watcherCount = document.getElementById("watcherCount");

    const repoLanguage = document.getElementById("repoLanguage");
    const languageBadge = document.getElementById("languageBadge");

    const issuesCount = document.getElementById("issuesCount");
    const licenseName = document.getElementById("licenseName");
    const defaultBranch = document.getElementById("defaultBranch");

    // =========================
    // STRICT SAFE PARSER (CODEQL SAFE)
    // =========================
    const extractRepoPath = (inputRaw) => {
        const input = inputRaw.trim();

        // CASE 1: owner/repo only (strict validation)
        const simplePattern = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;

        if (simplePattern.test(input)) {
            return input;
        }

        // CASE 2: strict GitHub URL ONLY (no substring checks)
        // Must start EXACTLY with github.com domain pattern
        const parts = input.split("/");

        // Expected formats:
        // https://github.com/owner/repo
        // http(s)://www.github.com/owner/repo
        if (
            (parts[0] === "https:" || parts[0] === "http:") &&
            (parts[2] === "github.com" || parts[2] === "www.github.com")
        ) {
            const owner = parts[3];
            const repo = parts[4];

            if (owner && repo) {
                return `${owner}/${repo}`;
            }
        }

        return null;
    };

    // =========================
    // FORMAT NUMBER
    // =========================
    const formatNumber = (num) =>
        num > 999 ? (num / 1000).toFixed(1) + "k" : String(num || 0);

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

    if (themeSelect) {
        themeSelect.addEventListener("change", (e) => {
            applyTheme(e.target.value);
        });
    }

    // =========================
    // FETCH GITHUB DATA
    // =========================
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const repoPath = extractRepoPath(input.value);

        if (!repoPath) {
            errorMessage.textContent =
                "Invalid format. Use owner/repo or GitHub URL.";
            errorMessage.classList.remove("hidden");
            return;
        }

        errorMessage.classList.add("hidden");

        generateBtn.disabled = true;
        generateBtn.textContent = "Loading...";

        try {
            const res = await fetch(
                "https://api.github.com/repos/" + repoPath
            );

            if (!res.ok) throw new Error("Not found");

            const data = await res.json();

            ownerAvatar.src = data.owner.avatar_url;
            ownerName.textContent = data.owner.login;
            repoName.textContent = data.name;
            repoDescription.textContent =
                data.description || "No description available";

            starCount.textContent = formatNumber(data.stargazers_count);
            forkCount.textContent = formatNumber(data.forks_count);
            watcherCount.textContent = formatNumber(data.subscribers_count);

            repoLanguage.textContent = data.language || "Unknown";

            issuesCount.textContent = String(data.open_issues_count);
            licenseName.textContent = data.license
                ? data.license.name
                : "No License";
            defaultBranch.textContent = data.default_branch;

            downloadBtn.disabled = false;
        } catch (err) {
            errorMessage.textContent =
                "Repository not found or invalid input.";
            errorMessage.classList.remove("hidden");
            downloadBtn.disabled = true;
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = "Generate Card";
        }
    });

    // =========================
    // DOWNLOAD CARD
    // =========================
    downloadBtn.addEventListener("click", () => {
        const card = document.getElementById("promoCard");

        const original = downloadBtn.textContent;
        downloadBtn.textContent = "Generating...";
        downloadBtn.disabled = true;

        html2canvas(card, {
            scale: 2,
            useCORS: true
        })
            .then((canvas) => {
                const link = document.createElement("a");
                link.download = "github-promo-card.png";
                link.href = canvas.toDataURL("image/png");
                link.click();

                downloadBtn.textContent = "Downloaded!";
                setTimeout(() => {
                    downloadBtn.textContent = original;
                    downloadBtn.disabled = false;
                }, 1500);
            })
            .catch(() => {
                alert("Failed to generate image");
                downloadBtn.textContent = original;
                downloadBtn.disabled = false;
            });
    });

    // INIT THEME
    if (themeSelect) {
        applyTheme(themeSelect.value);
    }
});