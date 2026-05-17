/* ============================================================
   CONFIGURATION
   ============================================================ */

if (typeof REPO_OWNER === 'undefined') {
    window.REPO_OWNER = "dhairyagothi";
    window.REPO_NAME = "100_days_100_web_project";
}

window.REPO_OWNER = window.REPO_OWNER || 'dhairyagothi';
window.REPO_NAME = window.REPO_NAME || '100_days_100_web_project';

/* ============================================================
   GLOBALS
   ============================================================ */

let currentPage = 1;

const itemsPerPage = 10;

let currentCategory = 'all';

let currentDifficulty = 'all';

/* ============================================================
   PROJECT DATA
   ============================================================ */

const PROJECTS = [
    ['Day 1', 'To-Do List', './public/TO_DO_LIST/todolist.html', 'javascript todo', 'beginner'],
    ['Day 2', 'Digital Clock', './public/digital_clock/digitalclock.html', 'javascript', 'beginner'],
    ['Day 3', 'Indian Flag', './public/indianflag/flag.html', 'css', 'beginner'],
    ['Day 4', 'Dropdown Nav Bar', './public/dropdown_navbar/index.html', 'css', 'beginner'],
    ['Day 5', 'Animated Cursor', './public/Animated-cursor/animated-cursor.html', 'javascript css', 'beginner'],
    ['Day 6', 'Auto Background Image Slider', './public/Background-Image-sider/slider.html', 'javascript', 'beginner'],
    ['Day 7', 'Typewriter', './public/typewriter/typewriter.html', 'javascript', 'beginner'],
    ['Day 8', 'Parallel-X Website', './public/Parallel-x%20website/parallal.html', 'css', 'intermediate'],
    ['Day 9', 'Captcha Generator', './public/captcha/captcha.html', 'javascript', 'intermediate'],
    ['Day 10', 'QR Code Generator', './public/qr%20generator/qr.html', 'api javascript', 'intermediate']
];

/* ============================================================
   DOM ELEMENTS
   ============================================================ */

const projectGrid = document.getElementById('projectGrid');

const searchInput = document.getElementById('searchInput');

const scrollBtn = document.getElementById('scrollBtn');

const themeToggle = document.getElementById('themeToggle');

const noResults = document.getElementById('noResults');

/* ============================================================
   THEME
   ============================================================ */

function initTheme() {

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {

        document.body.classList.add('light-mode');

    }

    updateThemeIcon();
}

function updateThemeIcon() {

    const icon = themeToggle.querySelector('i');

    if (document.body.classList.contains('light-mode')) {

        icon.className = 'fas fa-sun';

    } else {

        icon.className = 'fas fa-moon';

    }
}

themeToggle.addEventListener('click', () => {

    document.body.classList.toggle('light-mode');

    const isLight = document.body.classList.contains('light-mode');

    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    updateThemeIcon();
});

/* ============================================================
   RENDER PROJECTS
   ============================================================ */

function renderGrid(data = PROJECTS) {

    if (!projectGrid) return;

    projectGrid.innerHTML = '';

    if (data.length === 0) {

        noResults.style.display = 'flex';

        return;
    }

    noResults.style.display = 'none';

    data.forEach(project => {

        const [day, title, link, tags, difficulty] = project;

        const card = document.createElement('div');

        card.className = 'project-card';

        const tagsArray = tags.split(' ');

        const tagsHTML = tagsArray
            .map(tag => `<span class="tag">${tag}</span>`)
            .join('');

        card.innerHTML = `
            <div class="project-card-top">

                <span class="project-day">
                    ${day}
                </span>

                <span class="project-level">
                    ${difficulty}
                </span>

            </div>

            <h3 class="project-title">
                ${title}
            </h3>

            <div class="project-tags">
                ${tagsHTML}
            </div>

            <a
                href="${link}"
                target="_blank"
                rel="noopener noreferrer"
                class="project-btn"
            >
                Open Project
                <i class="fas fa-arrow-up-right-from-square"></i>
            </a>
        `;

        projectGrid.appendChild(card);
    });
}

/* ============================================================
   SEARCH
   ============================================================ */

function initSearch() {

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {

        const query = searchInput.value.toLowerCase().trim();

        const filtered = PROJECTS.filter(project => {

            const title = project[1].toLowerCase();

            const tags = project[3].toLowerCase();

            return (
                title.includes(query) ||
                tags.includes(query)
            );
        });

        renderGrid(filtered);
    });
}

/* ============================================================
   FILTER CHIPS
   ============================================================ */

function initFilterChips() {

    const chips = document.querySelectorAll('.chip');

    chips.forEach(chip => {

        chip.addEventListener('click', () => {

            chips.forEach(c => c.classList.remove('active'));

            chip.classList.add('active');

            const filter = chip.dataset.filter;

            if (filter === 'all') {

                renderGrid(PROJECTS);

                return;
            }

            const filtered = PROJECTS.filter(project =>
                project[3].includes(filter)
            );

            renderGrid(filtered);
        });
    });
}

/* ============================================================
   NAVBAR
   ============================================================ */

function updateNavbar() {

    const navbar = document.getElementById('navbar');

    if (!navbar) return;

    window.addEventListener('scroll', () => {

        if (window.scrollY > 50) {

            navbar.classList.add('scrolled');

        } else {

            navbar.classList.remove('scrolled');
        }
    });
}

/* ============================================================
   REPO STATS
   ============================================================ */

async function fetchRepoStats() {

    try {

        const [repoRes, prRes] = await Promise.all([

            fetch(
                `https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}`
            ),

            fetch(
                `https://api.github.com/search/issues?q=repo:${window.REPO_OWNER}/${window.REPO_NAME}+type:pr+state:open`
            )

        ]);

        if (!repoRes.ok || !prRes.ok) {
            throw new Error("GitHub API failed");
        }

        const repo = await repoRes.json();

        const prs = await prRes.json();

        const projectCount = document.getElementById('projectCount');

        const starCount = document.getElementById('starCount');

        const forkCount = document.getElementById('forkCount');

        const issueCount = document.getElementById('issueCount');

        const prCount = document.getElementById('prCount');

        if (projectCount) {
            projectCount.textContent = PROJECTS.length;
        }

        if (starCount) {
            starCount.textContent = repo.stargazers_count;
        }

        if (forkCount) {
            forkCount.textContent = repo.forks_count;
        }

        if (issueCount) {
            issueCount.textContent = repo.open_issues_count;
        }

        if (prCount) {
            prCount.textContent = prs.total_count;
        }

    } catch (err) {

        console.error(err);
    }
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */

function initScrollBtn() {

    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {

        scrollBtn.classList.toggle(
            'show',
            window.scrollY > 400
        );
    });

    scrollBtn.addEventListener('click', () => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */

const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {

    window.addEventListener('scroll', () => {

        if (window.scrollY > 200) {

            backToTopButton.style.display = 'block';

        } else {

            backToTopButton.style.display = 'none';
        }
    });

    backToTopButton.addEventListener('click', () => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    console.log('App Initialized');

    initTheme();

    updateNavbar();

    initFilterChips();

    initSearch();

    renderGrid();

    fetchRepoStats();

    initScrollBtn();
});