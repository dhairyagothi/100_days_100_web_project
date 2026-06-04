document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const historyContainer = document.getElementById('history-container');

    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const resultsState = document.getElementById('results-state');
    const userReposContainer = document.getElementById('user-repos-container');
    const userAnalyticsContainer = document.getElementById('user-analytics-container');
    const repoDetails = document.getElementById('repo-details');
    const reposList = document.getElementById('repos-list');

    let searchHistory = JSON.parse(localStorage.getItem('githubAnalyzerHistory')) || [];
    let langChartInstance = null;

    // ── Tilt ──────────────────────────────────────────────────────────────────
    const initTilt = () => {
        const elements = document.querySelectorAll('.tilt-card, .search-section, .stat-box, .repo-card-mini');
        if (typeof VanillaTilt !== 'undefined' && elements.length > 0) {
            elements.forEach(el => { if (el.vanillaTilt) el.vanillaTilt.destroy(); });
            VanillaTilt.init(elements, { max: 8, speed: 400, glare: true, 'max-glare': 0.15, scale: 1.02 });
        }
    };

    // ── Parallax ──────────────────────────────────────────────────────────────
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        document.documentElement.style.setProperty('--mouse-x', x);
        document.documentElement.style.setProperty('--mouse-y', y);
    });

    // ── History ───────────────────────────────────────────────────────────────
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
            tag.addEventListener('click', () => { searchInput.value = term; handleSearch(term); });
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

    // ── Helpers ───────────────────────────────────────────────────────────────
    const animateValue = (el, start, end, duration) => {
        if (!el) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            el.innerHTML = Math.floor(ease * (end - start) + start).toLocaleString();
            if (progress < 1) window.requestAnimationFrame(step);
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

    // ── State ─────────────────────────────────────────────────────────────────
    const showLoading = () => {
        loadingState.classList.remove('hidden');
        errorState.classList.add('hidden');
        resultsState.classList.add('hidden');
        userReposContainer.classList.add('hidden');
        userAnalyticsContainer.classList.add('hidden');
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

    // ── API Fetchers ──────────────────────────────────────────────────────────
    const fetchRepo = async (owner, repo) => {
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
    };

    const fetchUserProfile = async (username) => {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) {
            if (res.status === 404) throw new Error('User not found');
            if (res.status === 403) throw new Error('API Rate limit exceeded.');
            throw new Error('Failed to fetch user profile');
        }
        return res.json();
    };

    const fetchUserRepos = async (username) => {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!res.ok) {
            if (res.status === 404) throw new Error('User not found');
            if (res.status === 403) throw new Error('API Rate limit exceeded.');
            throw new Error('Failed to fetch user repositories');
        }
        return res.json();
    };

    const fetchUserEvents = async (username) => {
        try {
            const res = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`);
            if (!res.ok) return [];
            return res.json();
        } catch { return []; }
    };

    // ── Render: Repo Details ──────────────────────────────────────────────────
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
        document.getElementById('stat-visibility').textContent = data.visibility
            ? data.visibility.charAt(0).toUpperCase() + data.visibility.slice(1)
            : (data.private ? 'Private' : 'Public');

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

    // ── Render: User Repo Grid ─────────────────────────────────────────────────
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

    // ── Analytics: Language Chart ─────────────────────────────────────────────
    const LANG_COLORS = {
        JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
        Java: '#b07219', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
        Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95',
        Swift: '#F05138', Kotlin: '#A97BFF', HTML: '#e34c26', CSS: '#563d7c',
        SCSS: '#c6538c', Shell: '#89e051', Dart: '#00B4AB', Vue: '#41b883',
        Svelte: '#ff3e00', Elixir: '#6e4a7e', Haskell: '#5e5086',
        Scala: '#c22d40', Lua: '#000080', R: '#198CE7', MATLAB: '#e16737',
    };

    const getLangColor = (lang) =>
        LANG_COLORS[lang] || `hsl(${Math.abs(lang.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 360}, 60%, 55%)`;

    const buildLangChart = (repos) => {
        const langMap = {};
        repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
        const sorted = Object.entries(langMap).sort((a, b) => b[1] - a[1]);
        const total = sorted.reduce((s, [, v]) => s + v, 0);

        document.getElementById('lang-count').textContent = sorted.length;

        const labels = sorted.map(([l]) => l);
        const data = sorted.map(([, v]) => v);
        const colors = labels.map(getLangColor);

        const legendEl = document.getElementById('lang-legend');
        legendEl.innerHTML = '';
        sorted.forEach(([lang, count]) => {
            const pct = ((count / total) * 100).toFixed(1);
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <div class="legend-dot" style="background:${getLangColor(lang)}"></div>
                <span class="legend-name">${lang}</span>
                <span class="legend-pct">${pct}%</span>
            `;
            legendEl.appendChild(item);
        });

        if (langChartInstance) { langChartInstance.destroy(); langChartInstance = null; }
        const ctx = document.getElementById('lang-chart').getContext('2d');
        langChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors,
                    borderColor: 'rgba(10,12,16,0.8)',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                cutout: '72%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: ${((ctx.parsed / total) * 100).toFixed(1)}%`
                        }
                    }
                },
                animation: { animateRotate: true, duration: 900 }
            }
        });
    };

    // ── Analytics: Heatmap ────────────────────────────────────────────────────
    const buildHeatmap = (events) => {
        const monthsEl = document.getElementById('heatmap-months');
        const gridEl = document.getElementById('heatmap-grid');
        monthsEl.innerHTML = '';
        gridEl.innerHTML = '';

        // Map events to date counts
        const activityMap = {};
        events.forEach(ev => {
            const d = ev.created_at ? ev.created_at.split('T')[0] : null;
            if (d) activityMap[d] = (activityMap[d] || 0) + 1;
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Start from Sunday of 52 weeks ago
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 52 * 7 + 1);
        // Rewind to previous Sunday
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const CELL = 11; // px cell size
        const GAP  = 3;  // px gap
        const STEP = CELL + GAP;

        // Build weeks array: each week = array of 7 Date objects (Sun→Sat)
        const weeks = [];
        const cur = new Date(startDate);
        while (cur <= today) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                week.push(new Date(cur));
                cur.setDate(cur.getDate() + 1);
            }
            weeks.push(week);
        }

        // Month labels — place at the week column where the month first appears
        const monthLabelData = []; // { weekIndex, label }
        let lastMonth = -1;
        weeks.forEach((week, wi) => {
            // Use the first day of the week to detect month change
            const firstDay = week[0];
            if (firstDay.getMonth() !== lastMonth) {
                monthLabelData.push({ weekIndex: wi, label: firstDay.toLocaleString('default', { month: 'short' }) });
                lastMonth = firstDay.getMonth();
            }
        });

        // Render month labels positioned absolutely over the grid
        monthsEl.style.position = 'relative';
        monthsEl.style.height = '16px';
        monthLabelData.forEach(({ weekIndex, label }) => {
            const span = document.createElement('span');
            span.className = 'heatmap-month-label';
            span.textContent = label;
            span.style.position = 'absolute';
            span.style.left = `${weekIndex * STEP}px`;
            monthsEl.appendChild(span);
        });

        // Render grid columns
        const maxCount = Math.max(1, ...Object.values(activityMap));
        weeks.forEach(week => {
            const col = document.createElement('div');
            col.className = 'heatmap-week';
            week.forEach(date => {
                const cell = document.createElement('div');
                cell.className = 'heatmap-day';
                const key = date.toISOString().split('T')[0];
                const count = activityMap[key] || 0;
                let level = 0;
                if (count > 0) level = Math.min(4, Math.ceil((count / maxCount) * 4));
                cell.setAttribute('data-level', level);
                const friendly = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                cell.title = `${friendly}: ${count} event${count !== 1 ? 's' : ''}`;
                col.appendChild(cell);
            });
            gridEl.appendChild(col);
        });
    };

    // ── Analytics: Profile + Stats ────────────────────────────────────────────
    const renderUserAnalytics = (profile, repos, events) => {
        document.getElementById('profile-avatar').src = profile.avatar_url;
        document.getElementById('profile-name').textContent = profile.name || profile.login;
        document.getElementById('profile-login').textContent = `@${profile.login}`;
        document.getElementById('profile-bio').textContent = profile.bio || '';
        document.getElementById('profile-github-btn').href = profile.html_url;

        const locEl = document.getElementById('profile-location');
        if (profile.location) {
            locEl.classList.remove('hidden');
            locEl.querySelector('span').textContent = profile.location;
        } else {
            locEl.classList.add('hidden');
        }

        const blogEl = document.getElementById('profile-blog');
        if (profile.blog) {
            blogEl.classList.remove('hidden');
            const url = profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`;
            const a = blogEl.querySelector('a');
            a.href = url;
            a.textContent = profile.blog.replace(/^https?:\/\//, '');
        } else {
            blogEl.classList.add('hidden');
        }

        document.getElementById('profile-joined').querySelector('span').textContent =
            `Joined ${new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

        const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
        const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

        animateValue(document.getElementById('qs-stars'), 0, totalStars, 1200);
        animateValue(document.getElementById('qs-forks'), 0, totalForks, 1200);
        animateValue(document.getElementById('qs-followers'), 0, profile.followers, 1200);
        animateValue(document.getElementById('qs-following'), 0, profile.following, 1200);
        animateValue(document.getElementById('qs-gists'), 0, profile.public_gists, 1200);
        animateValue(document.getElementById('qs-repos'), 0, profile.public_repos, 1200);

        buildLangChart(repos);
        buildHeatmap(events);

        userAnalyticsContainer.classList.remove('hidden');
    };

    // ── Main Search Handler ───────────────────────────────────────────────────
    const handleSearch = async (query) => {
        if (!query) return;
        query = query.trim();

        let owner, repo, isRepo = false;

        try {
            if (query.includes('github.com')) {
                const url = new URL(query.startsWith('http') ? query : `https://${query}`);
                const parts = url.pathname.split('/').filter(p => p);
                if (parts.length >= 2) { owner = parts[0]; repo = parts[1]; isRepo = true; }
                else if (parts.length === 1) { owner = parts[0]; }
                else throw new Error('Invalid GitHub URL');
            } else if (query.includes('/')) {
                const parts = query.split('/');
                owner = parts[0]; repo = parts[1]; isRepo = true;
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
                const [profile, repos, events] = await Promise.all([
                    fetchUserProfile(owner),
                    fetchUserRepos(owner),
                    fetchUserEvents(owner)
                ]);
                showResults();
                renderUserAnalytics(profile, repos, events);
                renderUserRepos(repos.slice(0, 12), owner);
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