/* ============================================================
   MODULAR IMPORTS
   ============================================================ */
import { PROJECTS, CATEGORY_LABEL } from './modules/projects-data.js';
import { fetchRepoStats } from './modules/github-stats.js';
import { initTheme } from './modules/theme.js';
import './modules/config.js'; // imports config and exposes to global window

/* ============================================================
   README GENERATOR
   ============================================================ */
function generateReadme() {
    try {
        const lines = [];
        lines.push('# 100 Days · 100 Web Projects');
        lines.push('A curated archive of frontend experiments — browse, fork, contribute.');
        lines.push('');
        lines.push('## Projects');
        PROJECTS.forEach(([day, name, url, tags, cat]) => {
            const safeUrl = url || '';
            const tagList = (tags || []).join(', ');
            lines.push(`- **${day} — ${name}** — ${safeUrl} — _${cat}_ — ${tagList}`);
        });

        const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'README.md';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
    } catch (e) {
        console.error('Failed to generate README:', e);
        alert('Could not generate README. See console for details.');
    }
}

/* ============================================================
   RENDER PROJECT GRID
   ============================================================ */
let activeFilter = 'all';
let searchQuery  = '';

function renderGrid() {
    const grid = document.getElementById('projectGrid');
    const noResults = document.getElementById('noResults');
    if (!grid) return;

    const filtered = PROJECTS.filter(([day, name, , , cat]) => {
        const matchesFilter = activeFilter === 'all' || cat === activeFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !q || name.toLowerCase().includes(q) || day.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';

    filtered.forEach(([day, name, url, tags, cat]) => {
        const card = document.createElement('div');
        card.className = 'project-card';

        const tagsHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');

        card.innerHTML = `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${CATEGORY_LABEL[cat] || cat}</span>
            </div>
            <div class="card-name">${name}</div>
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <a href="${url.trim()}" target="_blank" class="card-link" rel="noopener noreferrer">
                    View Demo <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;

        grid.appendChild(card);
    });
}

/* ============================================================
   FILTER CHIPS
   ============================================================ */
function initFilterChips() {
    const chips = document.querySelectorAll('.chip[data-filter]');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.dataset.filter;
            renderGrid();
        });
    });
}

/* ============================================================
   LIVE SEARCH
   ============================================================ */
function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('input', () => {
        searchQuery = input.value.trim();
        renderGrid();
    });
}

function syncProjectCounts() {
    const total = PROJECTS.length.toLocaleString();
    const countNodes = [
        document.getElementById('projectCount'),
        document.getElementById('allCount'),
    ];

    countNodes.forEach(node => {
        if (node) node.textContent = total;
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = `Search ${total} projects…`;
    }
}

/* ============================================================
   NAVBAR — dynamic based on login state
   ============================================================ */
function updateNavbar() {
    const container = document.getElementById('navButtons');
    if (!container) return;

    const username = window.username || null;
    const isRoot   = !window.location.pathname.includes('/contributors/');
    const base     = isRoot ? '' : '../';

    if (username) {
        container.innerHTML = `
            <span class="welcome-text">Hi, ${username}</span>
            <button class="btn btn-ghost btn-sm" id="logoutBtn">Log out</button>
            <button class="btn btn-ghost btn-sm" id="generateReadmeBtn">Generate README</button>
            <a class="btn btn-ghost btn-sm" href="https://github.com/dhairyagothi/100_days_100_web_project" target="_blank">
                <i class="fab fa-github"></i> GitHub
            </a>
            <a class="btn btn-ghost btn-sm" href="${base}contributors/contributor.html">Contributors</a>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            window.username = null;
            updateNavbar();
        });
        const gen = document.getElementById('generateReadmeBtn');
        if (gen) gen.addEventListener('click', generateReadme);
    } else {
        container.innerHTML = `
            <a class="btn btn-ghost btn-sm" href="${base}contributors/contributor.html">Contributors</a>
            <a class="btn btn-ghost btn-sm" href="https://github.com/dhairyagothi" target="_blank">
                <i class="fab fa-github"></i> GitHub
            </a>
            <button class="btn btn-ghost btn-sm" id="generateReadmeBtn">Generate README</button>
            <a class="btn btn-primary btn-sm" href="${base}public/Login.html">Sign in</a>
        `;
        const gen2 = document.getElementById('generateReadmeBtn');
        if (gen2) gen2.addEventListener('click', generateReadme);
    }
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
function initScrollBtn() {
    const btn = document.getElementById('scrollBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================================
   COPYRIGHT AUTO-UPDATE
   ============================================================ */
function initCopyrightYear() {
    try {
        const currentYear = new Date().getFullYear();
        const startYear = 2024;
        const yearText = currentYear > startYear ? `${startYear}-${currentYear}` : `${startYear}`;
        
        const footerSpan = document.querySelector('.footer-bottom span');
        if (footerSpan && footerSpan.textContent.includes('2024')) {
            footerSpan.innerHTML = footerSpan.innerHTML.replace('2024', yearText);
        }
        
        const contributorStrong = document.querySelector('.footer p strong');
        if (contributorStrong && contributorStrong.innerHTML.includes('2024')) {
            contributorStrong.innerHTML = contributorStrong.innerHTML.replace('2024', yearText);
        }
    } catch (e) {
        console.warn("Copyright year update failed:", e);
    }
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateNavbar();
    initFilterChips();
    initSearch();
    syncProjectCounts();
    renderGrid();
    fetchRepoStats();
    initScrollBtn();
    initCopyrightYear();
});
