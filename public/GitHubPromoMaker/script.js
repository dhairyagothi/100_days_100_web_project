document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('repoForm');
    const input = document.getElementById('repoInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMessage = document.getElementById('errorMessage');

    const ownerAvatar = document.getElementById('ownerAvatar');
    const ownerName = document.getElementById('ownerName');
    const repoName = document.getElementById('repoName');
    const repoDescription = document.getElementById('repoDescription');
    const starCount = document.getElementById('starCount');
    const forkCount = document.getElementById('forkCount');
    const watcherCount = document.getElementById('watcherCount');
    const repoLanguage = document.getElementById('repoLanguage');
    const languageBadge = document.getElementById('languageBadge');

    const formatNumber = (num) => {
        return num > 999 ? (num / 1000).toFixed(1) + 'k' : num;
    };

    const extractRepoPath = (rawInput) => {
        let path = rawInput.trim();
        if (path.includes('github.com/')) {
            path = path.split('github.com/')[1];
        }
        const parts = path.split('/');
        if (parts.length >= 2) {
            return `${parts[0]}/${parts[1]}`;
        }
        return null;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const repoPath = extractRepoPath(input.value);

        if (!repoPath) {
            errorMessage.textContent = "Invalid format. Please enter 'owner/repo' or a GitHub URL.";
            errorMessage.classList.remove('hidden');
            return;
        }

        errorMessage.classList.add('hidden');
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> Loading...';

        try {
            const response = await fetch(`https://api.github.com/repos/${repoPath}`);

            if (!response.ok) throw new Error('Repository not found');

            const data = await response.json();

            ownerAvatar.src = data.owner.avatar_url;
            ownerName.textContent = data.owner.login;
            repoName.textContent = data.name;
            repoDescription.textContent = data.description || "No description provided for this repository.";

            starCount.textContent = formatNumber(data.stargazers_count);
            forkCount.textContent = formatNumber(data.forks_count);
            watcherCount.textContent = formatNumber(data.subscribers_count);

            if (data.language) {
                repoLanguage.textContent = data.language;
                languageBadge.style.display = 'flex';
            } else {
                languageBadge.style.display = 'none';
            }
            downloadBtn.disabled = false;

        } catch (error) {
            errorMessage.textContent = "Repository not found. Please check the URL and try again.";
            errorMessage.classList.remove('hidden');
            downloadBtn.disabled = true;
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = 'Generate Card';
        }
    });

    downloadBtn.addEventListener('click', () => {
        const cardElement = document.getElementById('promoCard');
        const originalText = downloadBtn.innerHTML;

        downloadBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> Generating...';
        downloadBtn.disabled = true;

        html2canvas(cardElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: null
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `${repoName.textContent}-promo-card.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            downloadBtn.innerHTML = '<span class="material-symbols-outlined">check</span> Downloaded!';
            setTimeout(() => {
                downloadBtn.innerHTML = originalText;
                downloadBtn.disabled = false;
            }, 2000);
        }).catch(err => {
            console.error('Error generating image:', err);
            alert("An error occurred while generating the image. Ensure the avatar isn't blocking CORS.");
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
        });
    });
});