/* ============================================
   CONTRIBUTORS PAGE — JS (Self-contained)
   ============================================ */

const REPO_OWNER = "dhairyagothi";
const REPO_NAME = "100_days_100_web_project";

/* ---------- THEME ---------- */
function initTheme() {
    const btn = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    if (!btn) return;
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.remove('light-mode');
    }
    btn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        icon.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

/* ---------- MOBILE MENU ---------- */
function initMobile() {
    const tog = document.getElementById('mobileToggle');
    const nav = document.getElementById('navCenter');
    if (!tog || !nav) return;
    tog.addEventListener('click', () => {
        nav.classList.toggle('open');
        const i = tog.querySelector('i');
        i.classList.toggle('fa-bars');
        i.classList.toggle('fa-xmark');
    });
    nav.querySelectorAll('.nav-item').forEach(l =>
        l.addEventListener('click', () => nav.classList.remove('open'))
    );
}

/* ---------- SCROLL TOP ---------- */
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    addEventListener('scroll', () => btn.classList.toggle('show', scrollY > 400));
    btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- ANIMATED COUNTER ---------- */
function animateCount(id, target) {
    const el = document.getElementById(id);
    if (!el || target <= 0) { if (el) el.textContent = '0'; return; }
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const iv = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(iv); }
        el.textContent = cur.toLocaleString();
    }, 30);
}

/* ---------- GITHUB STATS ---------- */
async function fetchStats() {
    try {
        const [rr, pr] = await Promise.all([
            fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`),
            fetch(`https://api.github.com/search/issues?q=repo:${REPO_OWNER}/${REPO_NAME}+type:pr+state:open`)
        ]);
        if (!rr.ok || !pr.ok) throw new Error('fail');
        const rd = await rr.json(), pd = await pr.json();
        animateCount('starCount', rd.stargazers_count);
        animateCount('forkCount', rd.forks_count);
        animateCount('issueCount', rd.open_issues_count - pd.total_count);
        animateCount('prCount', pd.total_count);
    } catch (e) { console.error('Stats:', e); }
}

/* ---------- CONTRIBUTORS ---------- */
async function fetchContributors() {
    const grid = document.getElementById('contributors');
    const sub = document.getElementById('contribSub');
    const countEl = document.getElementById('contributorCount');

    try {
        const res = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100`
        );
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();

        if (countEl) animateCount('contributorCount', data.length);
        if (sub) sub.textContent = `${data.length} contributors and counting`;

        // Total commits
        const totalCommits = data.reduce((sum, c) => sum + c.contributions, 0);
        animateCount('totalCommits', totalCommits);

        grid.innerHTML = '';
        data.forEach(c => {
            const card = document.createElement('div');
            card.className = 'contrib-card';
            card.innerHTML = `
                <img class="contrib-avatar" src="${c.avatar_url}" alt="${c.login}" loading="lazy">
                <div class="contrib-info">
                    <div class="contrib-name">${c.login}</div>
                    <div class="contrib-commits">${c.contributions} <span>commits</span></div>
                </div>
                <a href="${c.html_url}" target="_blank" class="contrib-link">
                    <i class="fab fa-github"></i> Profile
                </a>
            `;
            grid.appendChild(card);
        });
    } catch (e) {
        console.error('Contributors:', e);
        if (grid) grid.innerHTML = `<p style="color:var(--text-muted)">Failed to load contributors.</p>`;
    }
}

/* ---------- STARGAZERS ---------- */
async function fetchStargazers() {
    const wrap = document.getElementById('stargazers');
    if (!wrap) return;

    try {
        const res = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/stargazers?per_page=100`
        );
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        wrap.innerHTML = '';
        data.forEach(s => {
            const a = document.createElement('a');
            a.href = s.html_url;
            a.target = '_blank';
            a.className = 'sg-item';
            a.title = s.login;
            a.innerHTML = `<img src="${s.avatar_url}" alt="${s.login}" loading="lazy">`;
            wrap.appendChild(a);
        });
    } catch (e) {
        console.error('Stargazers:', e);
    }
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobile();
    initScrollTop();
    fetchStats();
    fetchContributors();
    fetchStargazers();
});
