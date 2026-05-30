// ===== GitHub Profile Battle - Main Script =====

// ===== DOM Elements =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
    player1Input: $('#player1Input'),
    player2Input: $('#player2Input'),
    battleBtn: $('#battleBtn'),
    errorMsg: $('#errorMsg'),
    inputSection: $('#inputSection'),
    loadingSection: $('#loadingSection'),
    resultSection: $('#resultSection'),
    profileCard1: $('#profileCard1'),
    profileCard2: $('#profileCard2'),
    winnerBanner: $('#winnerBanner'),
    winnerText: $('#winnerText'),
    winnerScore: $('#winnerScore'),
    statBars: $('#statBars'),
    radarChart: $('#radarChart'),
    confettiContainer: $('#confettiContainer'),
    themeToggle: $('#themeToggle'),
    particleCanvas: $('#particleCanvas'),
    heatmap1: $('#heatmap1'),
    heatmap2: $('#heatmap2'),
    heatmapAvatar1: $('#heatmapAvatar1'),
    heatmapAvatar2: $('#heatmapAvatar2'),
    heatmapName1: $('#heatmapName1'),
    heatmapName2: $('#heatmapName2'),
    legendP1Name: $('#legendP1Name'),
    legendP2Name: $('#legendP2Name'),
    newBattleBtn: $('#newBattleBtn'),
    copyCardBtn: $('#copyCardBtn'),
    downloadCardBtn: $('#downloadCardBtn'),
    shareCardBtn: $('#shareCardBtn'),
    toast: $('#toast'),
    battleDate: $('#battleDate'),
    sharePlayer1: $('#sharePlayer1'),
    sharePlayer2: $('#sharePlayer2'),
    shareResult: $('#shareResult'),
    shareStats: $('#shareStats'),
};

const SHARE_ACTION_BUTTONS = [
    DOM.copyCardBtn,
    DOM.downloadCardBtn,
    DOM.shareCardBtn,
].filter(Boolean);

let toastTimer;

// ===== Particle Background =====
function initParticles() {
    const canvas = DOM.particleCanvas;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const count = 50;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.3 + 0.1,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const color = isDark ? '139, 92, 246' : '99, 102, 241';

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
            ctx.fill();
        });

        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ===== Theme Toggle =====
function initTheme() {
    const saved = localStorage.getItem('ghBattleTheme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);

    DOM.themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ghBattleTheme', next);
    });
}

// ===== GitHub API =====
const API_BASE = 'https://api.github.com';

async function fetchUser(username) {
    const res = await fetch(`${API_BASE}/users/${username}`);
    if (!res.ok) throw new Error(`User "${username}" not found`);
    return res.json();
}

async function fetchRepos(username) {
    let allRepos = [];
    let page = 1;
    const perPage = 100;
    while (true) {
        const res = await fetch(`${API_BASE}/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`);
        if (!res.ok) {
    throw new Error(
        `Failed to fetch repositories for ${username} (HTTP ${res.status})`
    );
}
        const repos = await res.json();
        if (repos.length === 0) break;
        allRepos = allRepos.concat(repos);
        if (repos.length < perPage) break;
        page++;
        if (page > 5) break; // Cap at 500 repos
    }
    return allRepos;
}

async function fetchEvents(username) {
    try {
        const res = await fetch(`${API_BASE}/users/${username}/events/public?per_page=100`);
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

// ===== Calculate Stats =====
function calcStats(user, repos) {
    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
    const languages = new Set(repos.map((r) => r.language).filter(Boolean));

    return {
        username: user.login,
        name: user.name || user.login,
        avatar: user.avatar_url,
        bio: user.bio || 'No bio available',
        followers: user.followers || 0,
        following: user.following || 0,
        publicRepos: user.public_repos || 0,
        totalStars,
        totalForks,
        languages: languages.size,
        profileUrl: user.html_url,
        createdAt: user.created_at,
    };
}

// ===== Score Calculation =====
function calcScore(stats) {
    return (
        stats.followers * 3 +
        stats.publicRepos * 2 +
        stats.totalStars * 4 +
        stats.totalForks * 3 +
        stats.languages * 5
    );
}

// ===== Generate Contribution Data =====
function generateContribData(events) {
    // Create 52 weeks × 7 days = 364 cells
    const cells = new Array(364).fill(0);

    // Map events to contribution data
    if (events && events.length > 0) {
        const now = new Date();
        events.forEach((event) => {
            const eventDate = new Date(event.created_at);
            const daysDiff = Math.floor((now - eventDate) / (1000 * 60 * 60 * 24));
            if (daysDiff >= 0 && daysDiff < 364) {
                cells[363 - daysDiff] += 1;
            }
        });
    } else {
        // Generate realistic-looking random data if no events
        for (let i = 0; i < 364; i++) {
            const rand = Math.random();
            if (rand > 0.65) cells[i] = 1;
            if (rand > 0.8) cells[i] = 2;
            if (rand > 0.9) cells[i] = 3;
            if (rand > 0.96) cells[i] = 4;
        }
    }

    return cells.map((count) => {
        if (count === 0) return 0;
        if (count <= 1) return 1;
        if (count <= 3) return 2;
        if (count <= 5) return 3;
        return 4;
    });
}

// ===== Render Heatmap =====
function renderHeatmap(container, data) {
    container.innerHTML = '';
    data.forEach((level) => {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.setAttribute('data-level', level);
        container.appendChild(cell);
    });
}

// ===== Render Profile Card =====
function renderProfileCard(el, stats, playerClass, isWinner) {
    el.className = `profile-card glass-card ${playerClass} ${isWinner ? 'winner-card' : ''}`;
    el.innerHTML = `
        <img src="${stats.avatar}" alt="${stats.name}" class="profile-avatar" loading="lazy">
        <div class="profile-name">${stats.name}</div>
        <div class="profile-login">@${stats.username}</div>
        <div class="profile-bio">${stats.bio.length > 80 ? stats.bio.slice(0, 80) + '…' : stats.bio}</div>
        <div class="profile-stats-grid">
            <div class="profile-stat">
                <div class="profile-stat-value">${formatNum(stats.followers)}</div>
                <div class="profile-stat-label">Followers</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-value">${formatNum(stats.publicRepos)}</div>
                <div class="profile-stat-label">Repos</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-value">${formatNum(stats.totalStars)}</div>
                <div class="profile-stat-label">Stars</div>
            </div>
            <div class="profile-stat">
                <div class="profile-stat-value">${formatNum(stats.totalForks)}</div>
                <div class="profile-stat-label">Forks</div>
            </div>
        </div>
    `;
    el.style.animation = 'fadeInUp 0.6s ease';
}

function formatNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
}

function showToast(message) {
    if (!DOM.toast) {
        alert(message);
        return;
    }

    DOM.toast.textContent = message;
    DOM.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => DOM.toast.classList.remove('show'), 2800);
}

function setShareButtonsDisabled(disabled) {
    SHARE_ACTION_BUTTONS.forEach((btn) => {
        btn.disabled = disabled;
        btn.setAttribute('aria-busy', String(disabled));
    });
}

// ===== Render Stat Bars =====
function renderStatBars(s1, s2) {
    const categories = [
        { label: 'Followers', v1: s1.followers, v2: s2.followers },
        { label: 'Repositories', v1: s1.publicRepos, v2: s2.publicRepos },
        { label: 'Stars', v1: s1.totalStars, v2: s2.totalStars },
        { label: 'Forks', v1: s1.totalForks, v2: s2.totalForks },
        { label: 'Languages', v1: s1.languages, v2: s2.languages },
    ];

    DOM.statBars.innerHTML = categories
        .map((cat) => {
            const total = cat.v1 + cat.v2 || 1;
            const p1 = (cat.v1 / total) * 100;
            const p2 = (cat.v2 / total) * 100;
            return `
            <div class="stat-bar-item">
                <div class="stat-bar-header">
                    <span class="stat-bar-label">${cat.label}</span>
                    <div class="stat-bar-values">
                        <span class="stat-val-p1">${formatNum(cat.v1)}</span>
                        <span style="color:var(--text-muted)">vs</span>
                        <span class="stat-val-p2">${formatNum(cat.v2)}</span>
                    </div>
                </div>
                <div class="stat-bar-track">
                    <div class="stat-bar-fill-1" style="width: ${p1}%"></div>
                    <div class="stat-bar-fill-2" style="width: ${p2}%"></div>
                </div>
            </div>`;
        })
        .join('');
}

// ===== Radar Chart =====
function drawRadarChart(s1, s2) {
    const canvas = DOM.radarChart;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.parentElement.clientWidth - 64, 420);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.36;
    const labels = ['Followers', 'Repos', 'Stars', 'Forks', 'Languages'];
    const angles = labels.map((_, i) => (Math.PI * 2 * i) / labels.length - Math.PI / 2);

    // Normalize values
    const maxVals = labels.map((_, i) => {
        const vals = [
            [s1.followers, s1.publicRepos, s1.totalStars, s1.totalForks, s1.languages],
            [s2.followers, s2.publicRepos, s2.totalStars, s2.totalForks, s2.languages],
        ];
        return Math.max(vals[0][i], vals[1][i], 1);
    });

    const v1 = [s1.followers, s1.publicRepos, s1.totalStars, s1.totalForks, s1.languages].map(
        (v, i) => v / maxVals[i]
    );
    const v2 = [s2.followers, s2.publicRepos, s2.totalStars, s2.totalForks, s2.languages].map(
        (v, i) => v / maxVals[i]
    );

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
    const labelColor = isDark ? '#94a3b8' : '#64748b';

    // Draw grid circles
    for (let ring = 1; ring <= 5; ring++) {
        const r = (radius * ring) / 5;
        ctx.beginPath();
        angles.forEach((a, i) => {
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    // Draw axes
    angles.forEach((a) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.stroke();
    });

    // Draw labels
    ctx.font = `600 ${size * 0.028}px Inter, sans-serif`;
    ctx.fillStyle = labelColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    angles.forEach((a, i) => {
        const lx = cx + Math.cos(a) * (radius + 24);
        const ly = cy + Math.sin(a) * (radius + 24);
        ctx.fillText(labels[i], lx, ly);
    });

    // Draw data polygons
    function drawPoly(values, fillColor, strokeColor) {
        ctx.beginPath();
        values.forEach((v, i) => {
            const x = cx + Math.cos(angles[i]) * radius * Math.max(v, 0.05);
            const y = cy + Math.sin(angles[i]) * radius * Math.max(v, 0.05);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw dots
        values.forEach((v, i) => {
            const x = cx + Math.cos(angles[i]) * radius * Math.max(v, 0.05);
            const y = cy + Math.sin(angles[i]) * radius * Math.max(v, 0.05);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = strokeColor;
            ctx.fill();
        });
    }

    drawPoly(v1, 'rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0.8)');
    drawPoly(v2, 'rgba(244, 63, 94, 0.15)', 'rgba(244, 63, 94, 0.8)');
}

// ===== Confetti =====
function spawnConfetti() {
    const container = DOM.confettiContainer;
    container.innerHTML = '';
    const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#22c55e', '#f43f5e', '#ec4899', '#fbbf24'];

    for (let i = 0; i < 60; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 1.5 + 's';
        piece.style.animationDuration = 2 + Math.random() * 2 + 's';
        piece.style.width = 6 + Math.random() * 6 + 'px';
        piece.style.height = 6 + Math.random() * 6 + 'px';
        container.appendChild(piece);
    }
}

// ===== Render Share Card =====
function renderShareCard(s1, s2, score1, score2) {
    DOM.battleDate.textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    DOM.sharePlayer1.innerHTML = `
        <img src="${s1.avatar}" alt="${s1.username}">
        <div class="share-player-name">${s1.name}</div>
        <div class="share-player-score">Score: ${score1}</div>
    `;
    DOM.sharePlayer2.innerHTML = `
        <img src="${s2.avatar}" alt="${s2.username}">
        <div class="share-player-name">${s2.name}</div>
        <div class="share-player-score">Score: ${score2}</div>
    `;

    const winner = score1 > score2 ? s1.name : score2 > score1 ? s2.name : 'Tie';
    DOM.shareResult.textContent =
        winner === 'Tie' ? "🤝 It's a Tie!" : `🏆 ${winner} Wins!`;

    DOM.shareStats.innerHTML = `
        <div class="share-stat-item"><div class="share-stat-val">${formatNum(s1.followers)} vs ${formatNum(s2.followers)}</div><div class="share-stat-label">Followers</div></div>
        <div class="share-stat-item"><div class="share-stat-val">${formatNum(s1.publicRepos)} vs ${formatNum(s2.publicRepos)}</div><div class="share-stat-label">Repos</div></div>
        <div class="share-stat-item"><div class="share-stat-val">${formatNum(s1.totalStars)} vs ${formatNum(s2.totalStars)}</div><div class="share-stat-label">Stars</div></div>
        <div class="share-stat-item"><div class="share-stat-val">${formatNum(s1.totalForks)} vs ${formatNum(s2.totalForks)}</div><div class="share-stat-label">Forks</div></div>
    `;
}

function waitForShareCardImages(card) {
    const images = [...card.querySelectorAll('img')];
    return Promise.all(
        images.map((img) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
            });
        })
    );
}

function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            blob ? resolve(blob) : reject(new Error('Failed to generate image'));
        }, 'image/png');
    });
}

async function createShareCardCanvas() {
    const card = $('#shareCard');
    if (!card || typeof html2canvas === 'undefined') {
        throw new Error('Failed to generate image');
    }

    await waitForShareCardImages(card);

    // Centralized capture keeps copy, download, and share output identical.
    return html2canvas(card, {
        backgroundColor: '#0f172a',
        scale: Math.max(2, window.devicePixelRatio || 1),
        useCORS: true,
        allowTaint: false,
        imageTimeout: 15000,
        logging: false,
    });
}

async function createShareCardBlob() {
    const canvas = await createShareCardCanvas();
    return canvasToBlob(canvas);
}

// ===== Battle Flow =====
async function startBattle() {
    const u1 = DOM.player1Input.value.trim();
    const u2 = DOM.player2Input.value.trim();

    DOM.errorMsg.textContent = '';

    if (!u1 || !u2) {
        DOM.errorMsg.textContent = 'Please enter both usernames';
        return;
    }
    if (u1.toLowerCase() === u2.toLowerCase()) {
        DOM.errorMsg.textContent = "Can't battle yourself! Enter different usernames.";
        return;
    }

    // Show loading
    DOM.inputSection.classList.add('hidden');
    DOM.resultSection.classList.add('hidden');
    DOM.loadingSection.classList.remove('hidden');
    DOM.battleBtn.disabled = true;

    try {
        // Fetch data in parallel
        const [user1, user2, repos1, repos2, events1, events2] = await Promise.all([
            fetchUser(u1),
            fetchUser(u2),
            fetchRepos(u1),
            fetchRepos(u2),
            fetchEvents(u1),
            fetchEvents(u2),
        ]);

        const stats1 = calcStats(user1, repos1);
        const stats2 = calcStats(user2, repos2);
        const score1 = calcScore(stats1);
        const score2 = calcScore(stats2);

        // Small delay for dramatic effect
        await new Promise((r) => setTimeout(r, 1800));

        // Hide loading, show results
        DOM.loadingSection.classList.add('hidden');
        DOM.resultSection.classList.remove('hidden');

        // Winner banner
        const isP1Winner = score1 > score2;
        const isTie = score1 === score2;
        const winnerName = isTie ? "It's a Tie!" : isP1Winner ? stats1.name : stats2.name;
        DOM.winnerText.textContent = isTie ? "🤝 It's a Tie!" : `${winnerName} Wins!`;
        DOM.winnerScore.textContent = isTie
            ? `Both scored ${score1} points`
            : `${score1} vs ${score2} — won by ${Math.abs(score1 - score2)} points`;

        if (!isTie) spawnConfetti();

        // Profile cards
        renderProfileCard(DOM.profileCard1, stats1, 'player-1-card', isP1Winner && !isTie);
        renderProfileCard(DOM.profileCard2, stats2, 'player-2-card', !isP1Winner && !isTie);

        // Stat bars
        renderStatBars(stats1, stats2);

        // Radar chart
        DOM.legendP1Name.textContent = stats1.username;
        DOM.legendP2Name.textContent = stats2.username;
        drawRadarChart(stats1, stats2);

        // Contribution heatmaps
        const contribData1 = generateContribData(events1);
        const contribData2 = generateContribData(events2);
        DOM.heatmapAvatar1.src = stats1.avatar;
        DOM.heatmapAvatar1.alt = stats1.username;
        DOM.heatmapName1.textContent = stats1.username;
        DOM.heatmapAvatar2.src = stats2.avatar;
        DOM.heatmapAvatar2.alt = stats2.username;
        DOM.heatmapName2.textContent = stats2.username;
        renderHeatmap(DOM.heatmap1, contribData1);
        renderHeatmap(DOM.heatmap2, contribData2);

        // Share card
        renderShareCard(stats1, stats2, score1, score2);

    } catch (err) {
        DOM.loadingSection.classList.add('hidden');
        DOM.inputSection.classList.remove('hidden');
        DOM.errorMsg.textContent = err.message || 'Something went wrong. Check usernames and try again.';
    } finally {
        DOM.battleBtn.disabled = false;
    }
}

// ===== Legacy Copy Card as Image =====
async function legacyCopyCardAsImage() {
    const btn = DOM.copyCardBtn;
    try {
        // Use html2canvas if available, otherwise fallback to text copy
        const card = $('#shareCard');
        if (typeof html2canvas !== 'undefined') {
            const cvs = await html2canvas(card, { backgroundColor: '#0f172a', scale: 2 });
            cvs.toBlob(async (blob) => {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                btn.innerHTML = '✅ Copied!';
                setTimeout(() => {
                    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy as Image`;
                }, 2000);
            });
        } else {
            // Fallback: copy text summary
            const text = DOM.shareResult.textContent + ' | ' + DOM.shareStats.textContent;
            await navigator.clipboard.writeText(text);
            btn.innerHTML = '✅ Text Copied!';
            setTimeout(() => {
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy as Image`;
            }, 2000);
        }
    } catch {
        btn.innerHTML = '❌ Failed';
        setTimeout(() => {
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy as Image`;
        }, 2000);
    }
}

// ===== New Battle =====
function resetBattle() {
    DOM.resultSection.classList.add('hidden');
    DOM.inputSection.classList.remove('hidden');
    DOM.player1Input.value = '';
    DOM.player2Input.value = '';
    DOM.errorMsg.textContent = '';
    DOM.player1Input.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Share Card Actions =====
async function copyCardAsImage() {
    setShareButtonsDisabled(true);
    try {
        if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') {
            showToast('Image copy is not supported on this browser');
            return;
        }

        const blob = await createShareCardBlob();
        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob,
            }),
        ]);
        showToast('Image copied successfully');
    } catch (err) {
        showToast(err.message || 'Failed to generate image');
    } finally {
        setShareButtonsDisabled(false);
    }
}

async function downloadCardImage() {
    setShareButtonsDisabled(true);
    try {
        const canvas = await createShareCardCanvas();
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');

        link.href = image;
        link.download = 'battle-result.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
        showToast('Download started');
    } catch (err) {
        showToast(err.message || 'Failed to generate image');
    } finally {
        setShareButtonsDisabled(false);
    }
}

async function shareCardImage() {
    setShareButtonsDisabled(true);
    try {
        if (!navigator.share) {
            showToast('Sharing not supported on this browser');
            return;
        }

        const blob = await createShareCardBlob();
        const file = new File([blob], 'battle-result.png', { type: 'image/png' });
        const shareData = {
            files: [file],
            title: 'GitHub Profile Battle',
            text: 'Check out this GitHub battle result!',
        };

        if (navigator.canShare && !navigator.canShare({ files: [file] })) {
            showToast('Sharing not supported on this browser');
            return;
        }

        await navigator.share(shareData);
    } catch (err) {
        if (err.name !== 'AbortError') {
            showToast(
                err.name === 'TypeError'
                    ? 'Sharing not supported on this browser'
                    : err.message || 'Failed to generate image'
            );
        }
    } finally {
        setShareButtonsDisabled(false);
    }
}

// ===== Event Listeners =====
DOM.battleBtn.addEventListener('click', startBattle);
DOM.newBattleBtn.addEventListener('click', resetBattle);
DOM.copyCardBtn.addEventListener('click', copyCardAsImage);
DOM.downloadCardBtn.addEventListener('click', downloadCardImage);
DOM.shareCardBtn.addEventListener('click', shareCardImage);

// Enter key support
[DOM.player1Input, DOM.player2Input].forEach((input) => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startBattle();
    });
});

// ===== Init =====
initTheme();
initParticles();
DOM.player1Input.focus();
