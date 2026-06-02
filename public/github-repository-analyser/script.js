document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const historyContainer = document.getElementById('history-container');
    
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const resultsState = document.getElementById('results-state');
    const userReposContainer = document.getElementById('user-repos-container');
    const repoDetails = document.getElementById('repo-details');
    const reposList = document.getElementById('repos-list');
    
    let searchHistory = JSON.parse(localStorage.getItem('githubAnalyzerHistory')) || [];

    const initTilt = () => {
        const elements = document.querySelectorAll('.tilt-card, .search-section, .stat-box, .repo-card-mini');
        if (typeof VanillaTilt !== 'undefined' && elements.length > 0) {
            elements.forEach(el => {
                if (el.vanillaTilt) el.vanillaTilt.destroy();
            });
            VanillaTilt.init(elements, {
                max: 8,
                speed: 400,
                glare: true,
                "max-glare": 0.15,
                scale: 1.02
            });
        }
    };

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        document.documentElement.style.setProperty('--mouse-x', x);
        document.documentElement.style.setProperty('--mouse-y', y);
    });

    const renderHistory = () => {
        historyContainer.innerHTML = '';
        if (searchHistory.length === 0) {
            historyContainer.innerHTML = '<span style="color: var(--text-secondary); font-size: 0.85rem;">No recent searches</span>';
            return;
        }

        searchHistory.forEach(term => {
            const tag = document.createElement('div');
            tag.className = 'history-tag';
            tag.innerHTML = `<i class="fas fa-history"></i> ${term}`;
            tag.addEventListener('click', () => {
                searchInput.value = term;
                handleSearch(term);
            });
            historyContainer.appendChild(tag);
        });
    };

    const saveToHistory = (term) => {
        if (!term) return;
        searchHistory = searchHistory.filter(t => t !== term);
        searchHistory.unshift(term);
        if (searchHistory.length > 5) searchHistory.pop();
        localStorage.setItem('githubAnalyzerHistory', JSON.stringify(searchHistory));
        renderHistory();
    };

    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            obj.innerHTML = Math.floor(easeProgress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.round((now - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (seconds < 60) return `${seconds} seconds ago`;
        if (minutes < 60) return `${minutes} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 30) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    const showLoading = () => {
        loadingState.classList.remove('hidden');
        errorState.classList.add('hidden');
        resultsState.classList.add('hidden');
        userReposContainer.classList.add('hidden');
        repoDetails.classList.add('hidden');
        analyzeBtn.disabled = true;
    };

    const showError = (title, message) => {
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        errorState.classList.add('fade-in');
        document.getElementById('error-title').textContent = title;
        document.getElementById('error-message').textContent = message;
        analyzeBtn.disabled = false;
        initTilt();
    };

    const showResults = () => {
        loadingState.classList.add('hidden');
        errorState.classList.add('hidden');
        resultsState.classList.remove('hidden');
        resultsState.classList.add('fade-in');
        analyzeBtn.disabled = false;
    };

    const fetchRepo = async (owner, repo) => {
        try {
            const [repoRes, contribsRes] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`),
                fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=1&anon=true`)
            ]);

            if (!repoRes.ok) {
                if (repoRes.status === 404) throw new Error('Repository not found');
                if (repoRes.status === 403) throw new Error('API Rate limit exceeded. Try again later.');
                throw new Error('Failed to fetch repository details');
            }

            const repoData = await repoRes.json();
            
            let contribCount = 0;
            const linkHeader = contribsRes.headers.get('link');
            if (linkHeader) {
                const match = linkHeader.match(/page=(\d+)>; rel="last"/);
                if (match) contribCount = parseInt(match[1]);
            } else if (contribsRes.ok) {
                const data = await contribsRes.json();
                contribCount = data.length;
            }

            repoData.contributors_count = contribCount;
            return repoData;
        } catch (error) {
            throw error;
        }
    };

    const fetchUserRepos = async (username) => {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
        if (!res.ok) {
            if (res.status === 404) throw new Error('User not found');
            if (res.status === 403) throw new Error('API Rate limit exceeded.');
            throw new Error('Failed to fetch user repositories');
        }
        return await res.json();
    };

    const renderRepoDetails = (data) => {
        document.getElementById('repo-owner-avatar').src = data.owner.avatar_url;
        document.getElementById('repo-name').textContent = data.name;
        document.getElementById('repo-owner').textContent = data.owner.login;
        document.getElementById('repo-description').textContent = data.description || 'No description provided.';
        
        animateValue(document.getElementById('stat-stars'), 0, data.stargazers_count, 1500);
        animateValue(document.getElementById('stat-forks'), 0, data.forks_count, 1500);
        animateValue(document.getElementById('stat-issues'), 0, data.open_issues_count, 1500);
        animateValue(document.getElementById('stat-contributors'), 0, data.contributors_count, 1500);
        
        document.getElementById('stat-license').textContent = data.license ? data.license.spdx_id : 'None';
        document.getElementById('stat-visibility').textContent = data.visibility ? data.visibility.charAt(0).toUpperCase() + data.visibility.slice(1) : (data.private ? 'Private' : 'Public');
        
        document.getElementById('meta-language').textContent = data.language || 'Multiple';
        document.getElementById('meta-size').textContent = formatBytes(data.size * 1024);
        document.getElementById('meta-updated').textContent = `Updated ${timeAgo(data.updated_at)}`;

        const openBtn = document.getElementById('open-btn');
        openBtn.href = data.html_url;

        const copyBtn = document.getElementById('copy-btn');
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(data.html_url);
            const icon = copyBtn.querySelector('i');
            icon.className = 'fas fa-check text-green';
            setTimeout(() => icon.className = 'fas fa-link', 2000);
        };

        repoDetails.classList.remove('hidden');
        initTilt();
    };

    const createMiniStat = (iconClass, textClass, value) => {
        const stat = document.createElement('span');
        const icon = document.createElement('i');

        icon.className = `${iconClass} ${textClass}`;
        stat.appendChild(icon);
        stat.appendChild(document.createTextNode(` ${value}`));

        return stat;
    };

    const renderUserRepos = (repos, username) => {
        reposList.innerHTML = '';
        if (repos.length === 0) {
            reposList.innerHTML = '<p style="grid-column: 1/-1; color: var(--text-secondary);">This user has no public repositories.</p>';
        } else {
            repos.forEach(repo => {
                const description = repo.description
                    ? repo.description.substring(0, 80) + (repo.description.length > 80 ? '...' : '')
                    : 'No description';
                const card = document.createElement('div');
                const title = document.createElement('h3');
                const descriptionText = document.createElement('p');
                const stats = document.createElement('div');

                card.className = 'repo-card-mini';
                title.textContent = repo.name;
                descriptionText.textContent = description;
                stats.className = 'mini-stats';
                stats.appendChild(createMiniStat('fas fa-star', 'text-yellow', repo.stargazers_count));
                stats.appendChild(createMiniStat('fas fa-code-branch', 'text-blue', repo.forks_count));
                stats.appendChild(createMiniStat('fas fa-circle', 'text-purple', repo.language || 'N/A'));

                card.appendChild(title);
                card.appendChild(descriptionText);
                card.appendChild(stats);
                card.onclick = () => {
                    searchInput.value = `${username}/${repo.name}`;
                    handleSearch(`${username}/${repo.name}`);
                };
                reposList.appendChild(card);
            });
        }
        userReposContainer.classList.remove('hidden');
        initTilt();
    };

    const handleSearch = async (query) => {
        if (!query) return;
        query = query.trim();
        
        let owner, repo, isRepo = false;
        
        try {
            if (query.includes('github.com')) {
                const url = new URL(query.startsWith('http') ? query : `https://${query}`);
                const parts = url.pathname.split('/').filter(p => p);
                if (parts.length >= 2) {
                    owner = parts[0];
                    repo = parts[1];
                    isRepo = true;
                } else if (parts.length === 1) {
                    owner = parts[0];
                } else {
                    throw new Error('Invalid GitHub URL');
                }
            } else if (query.includes('/')) {
                const parts = query.split('/');
                owner = parts[0];
                repo = parts[1];
                isRepo = true;
            } else {
                owner = query;
            }

            showLoading();
            saveToHistory(query);

            if (isRepo) {
                const data = await fetchRepo(owner, repo);
                showResults();
                renderRepoDetails(data);
            } else {
                const repos = await fetchUserRepos(owner);
                showResults();
                renderUserRepos(repos, owner);
            }

        } catch (error) {
            showError('Oops!', error.message || 'Something went wrong while fetching data.');
        }
    };

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSearch(searchInput.value);
    });

    renderHistory();
    initTilt();
});
