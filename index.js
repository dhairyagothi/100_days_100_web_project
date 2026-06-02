/* ============================================================
   CONFIGURATION
   ============================================================ */
if (typeof REPO_OWNER === "undefined") {
  window.REPO_OWNER = "dhairyagothi";
  window.REPO_NAME = "100_days_100_web_project";
}
window.REPO_OWNER = window.REPO_OWNER || "dhairyagothi";
window.REPO_NAME = window.REPO_NAME || "100_days_100_web_project";

let currentPage = 1;
let itemsPerPage = 9; // Visible projects per page
let projectData = [];
let filteredProjectData = [];
let techStackFilters = [];
let techSearchQuery = '';

const PROJECT_DATA = [
    ['Day 1', 'To-Do List', './public/TO_DO_LIST/todolist.html', 'javascript todo tool', 'beginner'],
    ['Day 2', 'Digital Clock', './public/digital_clock/digitalclock.html', 'javascript ui', 'beginner'],
    ['Day 3', 'Indian Flag', './public/indianflag/flag.html', 'css ui animation', 'beginner'],
    ['Day 4', 'Dropdown Nav Bar', './public/dropdown_navbar/index.html', 'css ui', 'beginner'],
    ['Day 5', 'Animated Cursor', './public/Animated-cursor/animated-cursor.html', 'javascript css ui animation', 'beginner'],
    ['Day 6', 'Auto Background Image Slider', './public/Background-Image-sider/slider.html', 'javascript ui animation', 'beginner'],
    ['Day 7', 'Typewriter', './public/typewriter/typewriter.html', 'javascript ui animation', 'beginner'],
    ['Day 8', 'Parallel-X Website', './public/Parallel-x%20website/parallal.html', 'css ui', 'intermediate'],
    ['Day 9', 'Captcha Generator', './public/captcha/captcha.html', 'javascript tool', 'intermediate'],
    ['Day 10', 'QR Code Generator', './public/qr%20generator/qr.html', 'api javascript tool', 'intermediate'],
    ['Day 11', 'Serve Website Using Express', './index.html', 'javascript api', 'intermediate'],
    ['Day 12', 'Nodemailer Contact Form', './public/gmail_nodemailer/public/mail.html', 'api javascript tool', 'intermediate'],
    ['Day 13', 'Login Form Using MERN', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/loginusingmern', 'api javascript tool', 'intermediate'],
    ['Day 14', 'File Uploader', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/file_uploader', 'javascript tool', 'intermediate'],
    ['Day 15', 'Progress Bar', './public/progress_bar/progress_bar.html', 'css javascript ui animation', 'beginner'],
    ['Day 16', 'Scroll Bar CSS', './public/Scroll Game Dark Run/index.html', 'css ui game', 'beginner'],
    ['Day 17', 'Slider Using Swiper API', './public/slider%20box/index.html', 'api javascript ui animation', 'intermediate'],
    ['Day 18', 'Carousel Solar System', './public/carousal/index.html', 'css canvas ui animation', 'intermediate'],
    ['Day 19', 'Planto', './public/plantwebsite/plant.html', 'css ui', 'beginner'],
    ['Day 20', 'EveSparks', 'https://evesparks.onrender.com/', 'javascript ui', 'intermediate'],
    ['Day 21', 'Video BG Slider Using React', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/travel_website', 'javascript ui animation', 'intermediate'],
    ['Day 22', 'Page Loader', './public/pageloader/pageloader.html', 'css ui animation', 'beginner'],
    ['Day 23', 'Jarvis Virtual Assistant', './public/Jarvis-AI-main/index.html', 'api javascript tool', 'intermediate'],
    ['Day 24', 'Chat Bot', './public/AI%20ChatBot/chatbot.html', 'api javascript tool', 'intermediate'],
    ['Day 25', 'Tic-Tac-Toe', './public/TicTacToe/index.html', 'game javascript', 'beginner'],
    ['Day 26', 'Maze Game', './public/Maze-Game-main/index.html', 'game javascript', 'intermediate'],
    ['Day 27', 'Memory Game', './public/MemoryGame/index.html', 'game javascript', 'beginner'],
    ['Day 28', 'Wordle', './public/WORDLE/index.html', 'game javascript', 'intermediate'],
    ['Day 29', 'Snake Game', './public/snake_game/index.html', 'game javascript', 'beginner'],
    ['Day 30', 'Flappy-bird-game', './public/Flappy-bird-main/index.html', 'game canvas', 'intermediate'],
    ['Day 31', 'Password Manager', './public/password%20manager/index.html', 'javascript tool', 'intermediate'],
    ['Day 32', 'Missionaries & Cannibals', './public/Missionaries&Cannibals/index.html', 'game javascript', 'intermediate'],
    ['Day 33', 'Weather Forecasting', './public/Weather%20Forcasting/index.html', 'weather api tool', 'intermediate'],
    ['Day 34', 'Email Validator', './public/email%20validator/index.html', 'api javascript tool', 'beginner'],
    ['Day 35', 'Vanilla-JavaScript-Calculator', './public/Vanilla-JavaScript-Calculator-master/index.html', 'javascript tool', 'beginner'],
    ['Day 36', 'Medical App', './public/Medical_App/index.html', 'javascript ui', 'intermediate'],
    ['Day 37', '2048 Game', './public/2048_game/index.html', 'game javascript', 'intermediate'],
    ['Day 38', 'Github Profile Finder', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/github_profile_finder', 'api javascript tool', 'intermediate'],
    ['Day 39', 'Notes App', './public/notes-app/index.html', 'todo javascript tool', 'beginner'],
    ['Day 40', 'Analog Clock', './public/AnalogClock/index.html', 'javascript css ui', 'beginner'],
    ['Day 41', 'Scroll Dark Game', './public/Scroll%20Game%20Dark%20Run/index.html', 'game canvas', 'intermediate'],
    // ✅ Day 42 Path explicitly updated to AmazonClone format for proper live serving compatibility
    ['Day 42', 'Amazon App', './public/Amazon_Clone/index.html', 'javascript clone clone', 'intermediate'],
    ['Day 43', 'Password Generator', './public/Password_Generator/index.html', 'javascript tool', 'beginner'],
    ['Day 44', 'BMI Calculator', './public/BMI_Calculator/index.html', 'javascript tool', 'beginner'],
    ['Day 45', 'Black Jack', './public/BlackJack/blackJ.html', 'game javascript', 'intermediate'],
    ['Day 46', 'Palindrome Generator', './public/Palindrome_Generator/index.html', 'javascript tool', 'beginner'],
    ['Day 47', 'Ping Pong Game', './public/ping/index.html', 'game canvas', 'intermediate'],
    ['Day 48', 'TextToVoiceConverter', './public/TextToVoiceConverter/index.html', 'api javascript tool', 'intermediate'],
    ['Day 49', 'Url Shortener', 'https://github.com/chandankoranga02/100_days_100_web_project/tree/Main/public/url_shortener', 'api javascript tool', 'intermediate'],
    ['Day 50', 'Recipe Genie', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Recipe-Genie', 'api javascript tool', 'intermediate'],
    ['Day 51', 'Netflix Landing Page Clone', './public/Netflix_Cloning/Index.html', 'css clone', 'beginner'],
    ['Day 52', 'ClimaCode', './public/ClimaCode%202.0/index.html', 'weather api tool', 'intermediate'],
    ['Day 53', 'E-Commerce Website with Simple Cart Functionality', './public/e-commerce_cart/index.html', 'javascript tool', 'intermediate'],
    ['Day 54', 'Budget Tracker', './public/Budget%20Tracker/index.html', 'todo javascript tool', 'intermediate'],
    ['Day 55', 'Cricket Game', './public/cricket/index.html', 'game javascript', 'intermediate'],
    ['Day 56', 'Pastebin using svelte', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/pastebin', 'javascript tool', 'intermediate'],
    ['Day 57', 'Glowing Social Media Icons', './public/Social%20Media%20Glowing/index.html', 'css ui animation', 'beginner'],
    ['Day 58', 'Music App', './public/Music%20App/index.html', 'api javascript tool', 'intermediate'],
    ['Day 59', 'Blog Page', './public/Blog%20Page/index.html', 'css ui', 'beginner'],
    ['Day 60', 'Marketing template website', './public/marketing_website/index.html', 'css ui', 'beginner'],
    ['Day 61', 'Hologram Button', './public/Holo%20Button/index.html', 'css ui animation', 'beginner'],
    ['Day 62', 'Solar System Explorer', './public/Solar%20System%20Explorer%20in%20CSS%20only%20haml/template.html', 'css ui animation', 'intermediate'],
    ['Day 63', 'Image to Text App', './public/Image-To-Text-App/index.html', 'api javascript tool', 'intermediate'],
    ['Day 64', 'Zomato-clone', './public/zomato-clone/zomato.html', 'css clone', 'beginner'],
    ['Day 65', 'The Cube', './public/The%20Cube/index.html', 'canvas css ui animation', 'intermediate'],
    ['Day 66', 'Flask Authentication App', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/flask_auth_app', 'api javascript tool', 'intermediate'],
    ['Day 67', 'Blog-Website', './public/blog/main.html', 'css ui', 'beginner'],
    ['Day 68', '3d Rotating Card', './public/3d%20cards/index.html', 'css ui animation', 'intermediate'],
    ['Day 69', 'Spotify Clone Project', './public/spotify-clone%20-project/index.html', 'api javascript clone', 'intermediate'],
    ['Day 70', 'Insect-Catch_Game', './public/Insect-Catch-Game/index.html', 'game canvas', 'intermediate'],
    ['Day 71', 'Quotely Laughs', './public/Quotely-Laughs/index.html', 'api javascript tool', 'beginner'],
    ['Day 72', 'Contact Book', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Contact%20Book', 'todo javascript tool', 'intermediate'],
    ['Day 73', 'Candy_Crush_Game', './public/Candy_Crush_Game/index.html', 'game javascript', 'intermediate'],
    ['Day 74', 'Stock Profit Calculator', './public/Stock-Profit-Calculator/index.html', 'javascript tool', 'beginner'],
    ['Day 75', 'code-space-game project', './public/code-jump-space-game/index.html', 'game canvas', 'intermediate'],
    ['Day 76', 'Animated Searchbar', './public/Animated%20Searchbar/index.html', 'css javascript ui animation', 'beginner'],
    ['Day 77', 'Rock-Paper-Scissor-game project', './public/Stone-Paper-Scissor/index.html', 'game javascript', 'beginner'],
    ['Day 78', 'NPM Package Search', './public/NPM%20Package%20Search/index.html', 'api javascript tool', 'intermediate'],
    ['Day 79', 'Linkedin Homepage Clone', './public/Linkedin-Clone/index.html', 'css clone', 'intermediate'],
    ['Day 80', 'Resume Studio', './public/ResumeStudio/index.html', 'javascript tool', 'intermediate'],
    ['Day 81', 'Simon Says Game', './public/Simon_Says_Game/index.html', 'game javascript', 'intermediate'],
    ['Day 82', 'Love Calculator Game', './public/Love-Calculator/index.html', 'game javascript', 'beginner'],
    ['Day 83', 'Exchange Currency', './public/Exchange_Currency/index.html', 'api javascript tool', 'intermediate'],
    ['Day 84', 'Lights Out Puzzle', './public/Lights_Out_Puzzle/index.html', 'game javascript', 'intermediate'],
    ['Day 85', 'Image Search Engine', './public/Image Search Engine/index.html', 'api javascript tool', 'intermediate'],
    ['Day 86', 'Profile Card', './public/3d profile Card/index.html', 'css ui animation', 'beginner'],
    ['Day 87', 'Breakout game', './public/Breakout game/index.html', 'game canvas', 'intermediate'],
    ['Day 88', 'Job dashboard', './public/Job dashboard/jobs.html', 'javascript tool', 'intermediate'],
    ['Day 89', 'N-Queen', './public/N_Queen/index.html', 'game javascript', 'intermediate'],
    ['Day 90', 'Quiz App Timer', './public/QuizeApp Timer/index1.html', 'javascript tool', 'beginner'],
    ['Day 91', 'Voting Application Backend', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Voting_Application_Backend', 'api javascript backend', 'intermediate'],
    ['Day 92', 'Slide puzzle Game', './public/Slide puzzle Game/index.html', 'game javascript', 'intermediate'],
    ['Day 93', 'TextUtils', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Textutils', 'javascript tool', 'beginner'],
    ['Day 94', 'Hangman Game', './public/HangmanGame/index.html', 'game javascript', 'intermediate'],
    ['Day 95', 'TodoList in React TS Tailwind', './public/TodoList-React-TS-Tailwind/index.html', 'todo javascript tool', 'intermediate'],
    ['Day 96', 'HCL Color Generator', './public/HCL Color Generator/index.html', 'css javascript tool', 'beginner'],
    ['Day 97', 'Time Capsule', './public/Time-Capsule/index.html', 'javascript tool', 'intermediate'],
    ['Day 98', 'Virtual Piano', './public/Virtual Piano/index.html', 'css javascript ui game', 'intermediate'],
    ['Day 99', 'NASA-APOD Extension', './public/NASA-APOD/popup.html', 'api javascript tool', 'intermediate'],
    ['Day 100', 'Text Saver Extension', './public/Text_Saver_Ext/popup.html', 'todo javascript tool', 'intermediate'],
    ['Day 101', 'Personal Finance Tracker', './public/FinanceTracker/index.html', 'todo javascript tool', 'intermediate'],
    ['Day 102', 'Travel Booking Website', './public/Travel_booking_website/index.html', 'javascript ui', 'intermediate'],
    ['Day 103', 'Drumkit Game', './public/Drumkit_Game/index.html', 'game javascript', 'beginner'],
    ['Day 104', 'Debug-Website', './public/Debug-Website/index.html', 'css ui', 'beginner'],
    ['Day 105', 'Periodic Table', './public/Periodic Table/index.html', 'css javascript tool', 'beginner'],
    ['Day 106', 'Plants Website', './public/Plants Website/index.html', 'css ui', 'beginner'],
    ['Day 107', 'DocNow', './public/DocNow/index.html', 'api javascript tool', 'intermediate'],
    ['Day 108', 'expense_Tracker', './public/expense_Tracker/index.html', 'todo javascript tool', 'intermediate'],
    ['Day 109', 'Mood Tracker', './public/Mood Tracker/index.html', 'todo javascript tool', 'intermediate'],
    ['Day 110', 'CRYPTOSHOW', './public/CRYPTOSHOW/index.html', 'api javascript tool', 'intermediate'],
    ['Day 111', 'Whack-a-Mole Game', './public/Whack-a-Mole Game/index.html', 'game canvas', 'intermediate'],
    ['Day 112', 'Nykaa Clone Website', './public/Nykaa-clone/index.html', 'css clone', 'intermediate'],
    ['Day 113', 'CPU Scheduler', './public/CpuScheduler/index.html', 'javascript tool', 'intermediate'],
    ['Day 114', 'EchoNotes', './public/EchoNotes/index.html', 'todo javascript tool', 'intermediate'],
    ['Day 115', 'Event Registration System', 'https://event-registration-system-w10a.onrender.com/', 'api javascript tool', 'intermediate'],
    ['Day 116', 'AI Image Classifier', './public/AI Image Classifier/index.html', 'api javascript tool', 'intermediate']
];

const PROJECTS = PROJECT_DATA;

const CATEGORY_LABEL = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced'
};

const FILTER_CATEGORY_MAP = {
    'game': 'Games',
    'clone': 'Clones',
    'tool': 'Tools',
    'ui': 'UI / Animation',
    'api': 'APIs'
};

/* ============================================================
   GLOBAL UTILITIES
   ============================================================ */
function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, `<span class="highlight">$1</span>`);
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/* ============================================================
   GITHUB REPO STATS
   ============================================================ */
async function fetchRepoStats() {
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    try {
        const [repoRes, prRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}`),
            fetch(`https://api.github.com/search/issues?q=repo:${window.REPO_OWNER}/${window.REPO_NAME}+type:pr+state:open`)
        ]);
        if (!repoRes.ok || !prRes.ok) throw new Error("Stats fetch failed");
        const repo = await repoRes.json();
        const prs  = await prRes.json();

        set('starCount', repo.stargazers_count.toLocaleString());
        set('forkCount', repo.forks_count.toLocaleString());
        set('issueCount', (repo.open_issues_count - prs.total_count).toLocaleString());
        set('prCount', prs.total_count.toLocaleString());
    } catch (e) {
        console.warn("GitHub stats unavailable:", e.message);
    }
}

function getCategoryFromTags(tags, name) {
    const tagStr = (Array.isArray(tags) ? tags.join(' ') : (tags || '')).toLowerCase();
    const nameStr = (name || '').toLowerCase();

    if (tagStr.includes('game')) return 'Games';
    if (tagStr.includes('clone')) return 'Clones';
    if (tagStr.includes('tool')) return 'Tools';
    if (tagStr.includes('ui')) return 'UI / Animation';
    if (tagStr.includes('api') || tagStr.includes('weather')) return 'APIs';

    if (nameStr.includes('clone')) return 'Clones';
    if (nameStr.includes('game') || nameStr.includes('puzzle') || nameStr.includes('quiz')) return 'Games';

    return 'Tools';
}

function generateReadme() {
    try {
        const lines = [
            '# 100 Days · 100 Web Projects',
            'A curated archive of frontend experiments — browse, fork, contribute.',
            '',
            '## Projects'
        ];
        PROJECTS.forEach(([day, name, url, tags, cat]) => {
            const safeUrl = url || '';
            const formattedTags = typeof tags === 'string' ? tags.split(/\s+/).join(', ') : '';
            lines.push(`- **${day} — ${name}** — ${safeUrl} — _${cat}_ — ${formattedTags}`);
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
    }
}

function resolveProjectUrls(day, name, url, tags) {
    return {
        demoUrl: url ? url.trim() : '#',
        sourceUrl: `https://github.com/${window.REPO_OWNER}/${window.REPO_NAME}/tree/Main/${url}`,
        sourceOnly: false
    };
}

function getProjectDescription(project) {
    return (project && project[4]) ? `Difficulty: ${CATEGORY_LABEL[project[4]] || project[4]}` : 'Explore this project to discover interactive functionality.';
}

function buildProjectCardHTML({ day, name, url, tags, category, isBookmarked = false, showDescription = true }) {
    const { demoUrl, sourceUrl, sourceOnly } = resolveProjectUrls(day, name, url, tags);
    const tagsArray = typeof tags === 'string' ? tags.split(/\s+/).filter(t => t) : [];
    const tagsHTML = tagsArray.map((t) => `<span class="tag">${t}</span>`).join('');
    
    const project = PROJECTS.find(p => p[1] === name);
    const description = getProjectDescription(project);
    const primaryLink = `<a href="${demoUrl}" target="_blank" class="card-link open-project" data-id="${day}" rel="noopener noreferrer" onclick="event.stopPropagation()">Demo <i class="fas fa-arrow-right"></i></a>`;

    return {
        html: `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${category}</span>
            </div>
            <div class="card-name">${name}</div>
            ${showDescription ? `<div class="card-description">${description}</div>` : ''}
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <div class="card-actions-left">${primaryLink}</div>
                <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${day}" onclick="event.stopPropagation()">
                    <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                </button>
            </div>
        `,
        demoUrl,
        sourceOnly
    };
}

function attachProjectCardInteraction(card, demoUrl, projectData = null) {
    card.style.cursor = 'pointer';
    card.onclick = (e) => {
        if (e.target.closest('a, button')) return;
        if (projectData) trackRecentProject(projectData);
        window.open(demoUrl, '_blank', 'noopener');
    };
}

/* ============================================================
   RENDER PROJECT GRID
   ============================================================ */
let activeFilter = 'all';
let searchQuery = '';
let sortOption = 'default';
let difficultyFilter = 'all';

function syncStateToURL() {
    const url = new URL(window.location);
    if (searchQuery) url.searchParams.set('search', searchQuery);
    else url.searchParams.delete('search');

    if (activeFilter && activeFilter !== 'all') url.searchParams.set('category', activeFilter);
    else url.searchParams.delete('category');

    if (currentPage > 1) url.searchParams.set('page', currentPage);
    else url.searchParams.delete('page');

    window.history.replaceState({}, '', url);
}

function renderGrid() {
    const grid = document.getElementById('projectGrid');
    const noResults = document.getElementById('noResults');
    if (!grid) return;

    let filtered = PROJECTS.filter(([day, name, url, tags, cat]) => {
        const category = getCategoryFromTags(tags, name);
        const targetCategory = FILTER_CATEGORY_MAP[activeFilter] || 'all';
        const matchesFilter = activeFilter === 'all' || category === targetCategory;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || name.toLowerCase().includes(q) || day.toLowerCase().includes(q);
        
        let matchesDifficulty = true;
        if (difficultyFilter && difficultyFilter !== 'all') {
            matchesDifficulty = (cat || '').toLowerCase() === difficultyFilter.toLowerCase();
        }
        return matchesFilter && matchesSearch && matchesDifficulty;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    if (noResults) noResults.style.display = 'none';

    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(startIndex, endIndex = startIndex + itemsPerPage);

    pageItems.forEach(([day, name, url, tags, cat]) => {
        const category = getCategoryFromTags(tags, name);
        const card = document.createElement('div');
        const isBookmarked = bookmarkedProjects.some((item) => item[0] === day);
        
        let displayName = name;
        if (searchQuery) {
            const regex = new RegExp(`(${searchQuery})`, "gi");
            displayName = name.replace(regex, `<span class="highlight">$1</span>`);
        }

        const { html, demoUrl } = buildProjectCardHTML({
            day,
            name: displayName,
            url,
            tags,
            category,
            isBookmarked,
            showDescription: true
        });

        card.className = 'project-card';
        card.innerHTML = html;
        attachProjectCardInteraction(card, demoUrl, [day, name, url, tags, cat]);
        grid.appendChild(card);
    });

    renderPagination(filtered.length, totalPages);
    syncStateToURL();
}

function renderPagination(totalItems, totalPages) {
    const grid = document.getElementById('projectGrid');
    let container = document.getElementById('paginationContainer');
    if (!grid) return;

    if (!container) {
        container = document.createElement('div');
        container.id = 'paginationContainer';
        container.className = 'pagination-container';
    }
    container.innerHTML = '';
    if (totalPages <= 1) return;

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'pagination-controls';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-num ${currentPage === i ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => { currentPage = i; renderGrid(); });
        controlsDiv.appendChild(pageBtn);
    }
    container.appendChild(controlsDiv);
    grid.appendChild(container);
}

/* ============================================================
   BOOKMARK + RECENT SYSTEM
}

function trackRecentProject(project) {
    const projectObj = Array.isArray(project) ? { day: project[0], name: project[1], url: project[2], tags: project[3], timestamp: Date.now() } : { ...project, timestamp: Date.now() };
    recentProjects = recentProjects.filter(item => item.day !== projectObj.day);
    recentProjects.unshift(projectObj);
    localStorage.setItem('recentProjects', JSON.stringify(recentProjects));
}

function renderRecentProjects() {}
function renderBookmarks() {}

function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('input', () => {
        searchQuery = input.value.toLowerCase().trim();
        renderGrid();
    });
}

function initFilterChips() {
    const chips = document.querySelectorAll('.chip[data-filter]');
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.dataset.filter;
            currentPage = 1;
            renderGrid();
        });
    });
}

function syncProjectCounts() {}
function updateNavbar() {}
function initTheme() {}
function initScrollBtn() {}

/* ============================================================
   DOM CONTENT LOADED INIT
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
});