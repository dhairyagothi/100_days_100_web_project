/* ============================================================
   CONFIGURATION
   ============================================================ */
if (typeof REPO_OWNER === 'undefined') {
  window.REPO_OWNER = 'dhairyagothi';
  window.REPO_NAME = '100_days_100_web_project';
}
window.REPO_OWNER = window.REPO_OWNER || 'dhairyagothi';
window.REPO_NAME = window.REPO_NAME || '100_days_100_web_project';

let currentPage = 1;
const itemsPerPage = 10;
let projectData = [];
let filteredProjectData = [];
let currentCategory = 'all';
let currentDifficulty = 'all';

const PROJECT_DATA = [
  ['Day 1', 'To-Do List', './public/TO_DO_LIST/todolist.html', 'javascript todo', 'beginner'],
  ['Day 2', 'Digital Clock', './public/digital_clock/digitalclock.html', 'javascript', 'beginner'],
  ['Day 3', 'Indian Flag', './public/indianflag/flag.html', 'css', 'beginner'],
  ['Day 4', 'Dropdown Nav Bar', './public/dropdown_navbar/index.html', 'css', 'beginner'],
  ['Day 5', 'Animated Cursor', './public/Animated-cursor/animated-cursor.html', 'ui javascript css', 'beginner'],
  ['Day 6', 'Auto Background Image Slider', './public/Background-Image-sider/slider.html', 'javascript', 'beginner'],
  ['Day 7', 'Typewriter', './public/typewriter/typewriter.html', 'javascript', 'beginner'],
  ['Day 8', 'Parallel-X Website', './public/Parallel-x%20website/parallal.html', 'css', 'intermediate'],
  ['Day 9', 'Captcha Generator', './public/captcha/captcha.html', 'javascript', 'intermediate'],
  ['Day 10', 'QR Code Generator', './public/qr%20generator/qr.html', 'api javascript', 'intermediate'],
  ['Day 11', 'Serve Website Using Express', './public/index.html', 'javascript', 'intermediate'],
  ['Day 12', 'Nodemailer Contact Form', './public/gmail_nodemailer/public/mail.html', 'api javascript', 'intermediate'],
  ['Day 13', 'Login Form Using MERN', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/loginusingmern', 'api javascript', 'intermediate'],
  ['Day 14', 'File Uploader', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/file_uploader', 'javascript', 'intermediate'],
  ['Day 15', 'Progress Bar', './public/progress_bar/progress_bar.html', 'ui css javascript', 'beginner'],
  ['Day 16', 'Scroll Bar CSS', './public/Scroll Game Dark Run/index.html', 'css', 'beginner'],
  ['Day 17', 'Slider Using Swiper API', './public/slider%20box/index.html', 'api javascript', 'intermediate'],
  ['Day 18', 'Carousel Solar System', './public/carousal/index.html', 'css canvas', 'intermediate'],
  ['Day 19', 'Planto', './public/plantwebsite/plant.html', 'css', 'beginner'],
  ['Day 20', 'EveSparks', 'https://evesparks.onrender.com/', 'javascript', 'intermediate'],
  ['Day 21', 'Video BG Slider Using React', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/travel_website', 'javascript', 'intermediate'],
  ['Day 22', 'Page Loader', './public/pageloader/pageloader.html', 'ui css', 'beginner'],
  ['Day 23', 'Jarvis Virtual Assistant', './public/Jarvis-AI-main/index.html', 'api javascript', 'intermediate'],
  ['Day 24', 'Chat Bot', './public/AI%20ChatBot/chatbot.html', 'api javascript', 'intermediate'],
  ['Day 25', 'Tic-Tac-Toe', './public/TicTacToe/index.html', 'game javascript', 'beginner'],
  ['Day 26', 'Maze Game', './public/Maze-Game-main/index.html', 'game javascript', 'intermediate'],
  ['Day 27', 'Memory Game', './public/MemoryGame/index.html', 'game javascript', 'beginner'],
  ['Day 28', 'Wordle', './public/WORDLE/index.html', 'game javascript', 'intermediate'],
  ['Day 29', 'Snake Game', './public/snake_game/index.html', 'game javascript', 'beginner'],
  ['Day 30', 'Flappy-bird-game', './public/Flappy-bird-main/index.html', 'game canvas', 'intermediate'],
  ['Day 31', 'Password Manager', './public/password%20manager/index.html', 'tool javascript', 'intermediate'],
  ['Day 32', 'Missionaries & Cannibals', './public/Missionaries&Cannibals/index.html', 'game javascript', 'intermediate'],
  ['Day 33', 'Weather Forecasting', './public/Weather%20Forcasting/index.html', 'weather api', 'intermediate'],
  ['Day 34', 'Email Validator', './public/email%20validator/index.html', 'api javascript', 'beginner'],
  ['Day 35', 'Vanilla-JavaScript-Calculator', './public/Vanilla-JavaScript-Calculator-master/index.html', 'tool javascript', 'beginner'],
  ['Day 36', 'Medical App', './public/Medical_App/index.html', 'javascript', 'intermediate'],
  ['Day 37', '2048 Game', './public/2048_game/index.html', 'game javascript', 'intermediate'],
  ['Day 38', 'Github Profile Finder', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/github_profile_finder', 'api javascript', 'intermediate'],
  ['Day 39', 'Notes App', './public/notes-app/index.html', 'todo javascript', 'beginner'],
  ['Day 40', 'Analog Clock', './public/AnalogClock/index.html', 'javascript css', 'beginner'],
  ['Day 41', 'Scroll Dark Game', './public/Scroll%20Game%20Dark%20Run/index.html', 'game canvas', 'intermediate'],
  ['Day 42', 'Amazon App', './public/Amazon_Clone/index.html', 'clone javascript', 'intermediate'],
  ['Day 43', 'Password Generator', './public/Password_Generator/index.html', 'tool javascript', 'beginner'],
  ['Day 44', 'BMI Calculator', './public/BMI_Calculator/index.html', 'tool javascript', 'beginner'],
  ['Day 45', 'Black Jack', './public/BlackJack/blackJ.html', 'game javascript', 'intermediate'],
  ['Day 46', 'Palindrome Generator', './public/Palindrome_Generator/index.html', 'javascript', 'beginner'],
  ['Day 47', 'Ping Pong Game', './public/ping/index.html', 'game canvas', 'intermediate'],
  ['Day 48', 'TextToVoiceConverter', './public/TextToVoiceConverter/index.html', 'api javascript', 'intermediate'],
  ['Day 49', 'Url Shortener', 'https://github.com/chandankoranga02/100_days_100_web_project/tree/Main/public/url_shortener', 'api javascript', 'intermediate'],
  ['Day 50', 'Recipe Genie', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Recipe%20Genie', 'api javascript', 'intermediate'],
  ['Day 51', 'Netflix Landing Page Clone', './public/Netflix_Cloning/Index.html', 'clone css', 'beginner'],
  ['Day 52', 'ClimaCode', './public/ClimaCode%202.0/index.html', 'weather api', 'intermediate'],
  ['Day 53', 'E-Commerce Website with Simple Cart Functionality', './public/e-commerce_cart/index.html', 'javascript', 'intermediate'],
  ['Day 54', 'Budget Tracker', './public/Budget%20Tracker/index.html', 'todo javascript', 'intermediate'],
  ['Day 55', 'Cricket Game', './public/cricket/index.html', 'game javascript', 'intermediate'],
  ['Day 56', 'Pastebin using svelte', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/pastebin', 'javascript', 'intermediate'],
  ['Day 57', 'Glowing Social Media Icons', './public/Social%20Media%20Glowing/index.html', 'ui css', 'beginner'],
  ['Day 58', 'Music App', './public/Music%20App/index.html', 'api javascript', 'intermediate'],
  ['Day 59', 'Blog Page', './public/Blog%20Page/index.html', 'css', 'beginner'],
  ['Day 60', 'Marketing template website', './public/marketing_website/index.html', 'css', 'beginner'],
  ['Day 61', 'Hologram Button', './public/Holo%20Button/index.html', 'ui css', 'beginner'],
  ['Day 62', 'Solar System Explorer', './public/Solar%20System%20Explorer%20in%20CSS%20only%20haml/template.html', 'css', 'intermediate'],
  ['Day 63', 'Image to Text App', './public/Image-To-Text-App/index.html', 'api javascript', 'intermediate'],
  ['Day 64', 'Zomato-clone', './public/zomato-clone/zomato.html', 'clone css', 'beginner'],
  ['Day 65', 'The Cube', './public/The%20Cube/index.html', 'ui canvas css', 'intermediate'],
  ['Day 66', 'Flask Authentication App', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/flask_auth_app', 'api javascript', 'intermediate'],
  ['Day 67', 'Blog-Website', './public/blog/main.html', 'css', 'beginner'],
  ['Day 68', '3d Rotating Card', './public/3d%20cards/index.html', 'ui css', 'intermediate'],
  ['Day 69', 'Spotify Clone Project', './public/spotify-clone%20-project/index.html', 'clone api javascript', 'intermediate'],
  ['Day 70', 'Insect-Catch_Game', './public/Insect-Catch-Game/index.html', 'game canvas', 'intermediate'],
  ['Day 71', 'Quotely Laughs', './public/Quotely-Laughs/index.html', 'api javascript', 'beginner'],
  ['Day 72', 'Contact Book', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Contact%20Book', 'todo javascript', 'intermediate'],
  ['Day 73', 'Candy_Crush_Game', './public/Candy_Crush_Game/index.html', 'game javascript', 'intermediate'],
  ['Day 74', 'Stock Profit Calculator', './public/Stock-Profit-Calculator/index.html', 'tool javascript', 'beginner'],
  ['Day 75', 'code-space-game project', './public/code-jump-space-game/index.html', 'game canvas', 'intermediate'],
  ['Day 76', 'Animated Searchbar', './public/Animated%20Searchbar/index.html', 'ui css javascript', 'beginner'],
  ['Day 77', 'Rock-Paper-Scissor-game project', './public/Stone-Paper-Scissor/index.html', 'game javascript', 'beginner'],
  ['Day 78', 'NPM Package Search', './public/NPM%20Package%20Search/index.html', 'tool api javascript', 'intermediate'],
  ['Day 79', 'Linkedin Homepage Clone', './public/Linkedin-Clone/index.html', 'clone css', 'intermediate'],
  ['Day 80', 'Resume Studio', './public/ResumeStudio/index.html', 'tool javascript', 'intermediate'],
  ['Day 81', 'Simon Says Game', './public/Simon_Says_Game/index.html', 'game javascript', 'intermediate'],
  ['Day 82', 'Love Calculator Game', './public/Love-Calculator/index.html', 'game javascript', 'beginner'],
  ['Day 83', 'Exchange Currency', './public/Exchange_Currency/index.html', 'tool api javascript', 'intermediate'],
  ['Day 84', 'Lights Out Puzzle', './public/Lights_Out_Puzzle/index.html', 'game javascript', 'intermediate'],
  ['Day 85', 'Image Search Engine', './public/Image Search Engine/index.html', 'api javascript', 'intermediate'],
  ['Day 86', 'Profile Card', './public/3d profile Card/index.html', 'ui css', 'beginner'],
  ['Day 87', 'Breakout game', './public/Breakout game/index.html', 'game canvas', 'intermediate'],
  ['Day 88', 'Job dashboard', './public/Job dashboard/jobs.html', 'tool javascript', 'intermediate'],
  ['Day 89', 'N-Queen', './public/N_Queen/index.html', 'game javascript', 'intermediate'],
  ['Day 90', 'Quiz App Timer', './public/QuizeApp Timer/index1.html', 'javascript', 'beginner'],
  ['Day 91', 'Voting Application Backend', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Voting_Application_Backend', 'api javascript', 'intermediate'],
  ['Day 92', 'Slide puzzle Game', './public/Slide puzzle Game/index.html', 'game javascript', 'intermediate'],
  ['Day 93', 'TextUtils', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Textutils', 'javascript', 'beginner'],
  ['Day 94', 'Hangman Game', './public/HangmanGame/index.html', 'game javascript', 'intermediate'],
  ['Day 95', 'TodoList in React TS Tailwind', './public/TodoList-React-TS-Tailwind/index.html', 'todo javascript', 'intermediate'],
  ['Day 96', 'HCL Color Generator', './public/HCL Color Generator/index.html', 'ui css javascript', 'beginner'],
  ['Day 97', 'Time Capsule', './public/Time-Capsule/index.html', 'javascript', 'intermediate'],
  ['Day 98', 'Virtual Piano', './public/Virtual Piano/index.html', 'css javascript', 'intermediate'],
  ['Day 99', 'NASA-APOD Extension', './public/NASA-APOD/popup.html', 'api javascript', 'intermediate'],
  ['Day 100', 'Text Saver Extension', './public/Text_Saver_Ext/popup.html', 'todo javascript', 'intermediate'],
  ['Day 101', 'Personal Finance Tracker', './public/FinanceTracker/index.html', 'todo javascript', 'intermediate'],
  ['Day 102', 'Travel Booking Website', './public/Travel_booking_website/index.html', 'javascript', 'intermediate'],
  ['Day 103', 'Drumkit Game', './public/Drumkit_Game/index.html', 'game javascript', 'beginner'],
  ['Day 104', 'Debug-Website', './public/Debug-Website/index.html', 'css', 'beginner'],
  ['Day 105', 'Periodic Table', './public/Periodic Table/index.html', 'css javascript', 'beginner'],
  ['Day 106', 'Plants Website', './public/Plants Website/index.html', 'css', 'beginner'],
  ['Day 107', 'DocNow', './public/DocNow/index.html', 'api javascript', 'intermediate'],
  ['Day 108', 'expense_Tracker', './public/expense_Tracker/index.html', 'todo javascript', 'intermediate'],
  ['Day 109', 'Mood Tracker', './public/Mood Tracker/index.html', 'todo javascript', 'intermediate'],
  ['Day 110', 'CRYPTOSHOW', './public/CRYPTOSHOW/index.html', 'api javascript', 'intermediate'],
  ['Day 111', 'Whack-a-Mole Game', './public/Whack-a-Mole Game/index.html', 'game canvas', 'intermediate'],
  ['Day 112', 'Nykaa Clone Website', './public/Nykaa-clone/index.html', 'clone css', 'intermediate'],
  ['Day 113', 'CPU Scheduler', './public/CpuScheduler/index.html', 'tool javascript', 'intermediate'],
  ['Day 114', 'EchoNotes', './public/EchoNotes/index.html', 'todo javascript', 'intermediate'],
  ['Day 115', 'Event Registration System', 'https://event-registration-system-w10a.onrender.com/', 'api javascript', 'intermediate'],
  ['Day 116', 'AI Image Classifier', './public/AI Image Classifier/index.html', 'api javascript', 'intermediate'],
  ['Day 117', 'Habit Tracker Web App', './public/Habit-Tracker-Web-App/index.html', 'ui tool html css js', 'intermediate'],
  ['Day 118', 'Particle Effect', './public/particle-effect/index.html', 'ui html css js canvas', 'intermediate'],
  ['Day 119', 'Virtual Playground', './playground.html', 'ui game html css js', 'intermediate'],
  ['Day 120', 'Typing Speed Test', './public/typing_test/index.html', 'html css js game', 'intermediate'],
  ['Day 121', 'InterviewSimulator', './public/InterviewSimulator/index.html','tool','intermediate'],
  ['Day 122', 'AstronomyDashboard', './public/AstronomyDashboard/astro.html','html css javascript api-javascript','Advanced'],
  ['Day 123', 'Pomodoro Timer', './public/Pomodoro_Timer/index.html', 'productivity tool', 'intermediate'],
  ['Day 124', 'Hurdle Highway 2D',   './public/Hurdle_Highway_2D/index.html', 'game', 'intermediate'],
  ['Day 125', 'Snakeladder',   './public/Snakeladder/index.html', 'game', 'intermediate'],

];

// Alias for consistency
const PROJECTS = PROJECT_DATA;
console.log('PROJECTS defined:', PROJECTS.length, 'items');

/* ============================================================
   BOOKMARK + RECENT SYSTEM
============================================================ */

let bookmarkedProjects = JSON.parse(localStorage.getItem('bookmarkedProjects')) || [];
let recentProjects = JSON.parse(localStorage.getItem('recentProjects')) || [];

let showAllBookmarks = false;
let showAllRecent = false;

const INITIAL_VISIBLE_ITEMS = 3;

// Category labels mapping
const CATEGORY_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
};
console.log('CATEGORY_LABEL defined:', CATEGORY_LABEL);

/* ============================================================
   GITHUB REPO STATS
   ============================================================ */
async function fetchRepoStats() {
  try {
    const [repoRes, prRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}`),
      fetch(`https://api.github.com/search/issues?q=repo:${window.REPO_OWNER}/${window.REPO_NAME}+type:pr+state:open`),
    ]);
    if (!repoRes.ok || !prRes.ok) throw new Error('Stats fetch failed');
    const repo = await repoRes.json();
    const prs = await prRes.json();

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = Number(val).toLocaleString();
    };
    set('starCount', repo.stargazers_count);
    set('forkCount', repo.forks_count);
    set('issueCount', repo.open_issues_count - prs.total_count);
    set('prCount', prs.total_count);
  } catch (e) {
    console.warn('GitHub stats unavailable:', e.message);
  }
}

function generateReadme() {
  try {
    const lines = [];
    lines.push('# 100 Days · 100 Web Projects');
    lines.push('A curated archive of frontend experiments — browse, fork, contribute.');
    lines.push('');
    lines.push('## Projects');
    PROJECTS.forEach(([day, name, url, tags, cat]) => {
      const safeUrl = url || '';
      lines.push(`- **${day} — ${name}** — ${safeUrl} — _${cat}_`);
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
let searchQuery = '';

function renderGrid() {
  const grid = document.getElementById('projectGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  const filtered = PROJECTS.filter(([day, name, ,tags, cat]) => {
    const matchesFilter = activeFilter === 'all' || tags.toLowerCase().includes(activeFilter.toLowerCase());
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
    const isBookmarked = bookmarkedProjects.some((item) => item[0] === day);
    const tagsArray = typeof tags === 'string' ? tags.split(/\s+/).filter((t) => t) : tags;
    const tagsHTML = tagsArray.map((t) => `<span class="tag">${t}</span>`).join('');

    card.innerHTML = `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${CATEGORY_LABEL[cat] || cat}</span>
            </div>
            <div class="card-name">${name}</div>
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <a href="${url.trim()}" target="_blank" class="card-link open-project" data-id="${day}" rel="noopener noreferrer">
                    View Demo <i class="fas fa-arrow-right"></i>
                </a>
                <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${day}">
                    <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                </button>
            </div>
        `;

    grid.appendChild(card);
  });
}

function toggleBookmark(project) {
  const exists = bookmarkedProjects.find((item) => item[0] === project[0]);

  if (exists) {
    bookmarkedProjects = bookmarkedProjects.filter((item) => item[0] !== project[0]);
    showToast('Bookmark removed');
  } else {
    bookmarkedProjects.push(project);
    showToast('Project bookmarked');
  }

  localStorage.setItem('bookmarkedProjects', JSON.stringify(bookmarkedProjects));
  renderBookmarks();
  renderGrid();
  renderRecentProjects();
}

function trackRecentProject(project) {
  recentProjects = recentProjects.filter((item) => item[0] !== project[0]);
  recentProjects.unshift(project);

  if (recentProjects.length > 10) {
    recentProjects.pop();
  }

  localStorage.setItem('recentProjects', JSON.stringify(recentProjects));
  renderRecentProjects();
}

const bookmarkGrid = document.getElementById('bookmarkGrid');

function renderBookmarks() {
  if (!bookmarkGrid) return;

  bookmarkGrid.innerHTML = '';

  if (bookmarkedProjects.length === 0) {
    bookmarkGrid.innerHTML = `<p class="empty-state">No bookmarked projects yet.</p>`;
    return;
  }

  const bookmarkToggleBtn = document.getElementById('bookmarkToggleBtn');
  if (bookmarkToggleBtn) {
    bookmarkToggleBtn.style.display = bookmarkedProjects.length <= INITIAL_VISIBLE_ITEMS ? 'none' : 'inline-flex';
  }

  const visibleBookmarks = showAllBookmarks ? bookmarkedProjects : bookmarkedProjects.slice(0, INITIAL_VISIBLE_ITEMS);

  visibleBookmarks.forEach(([day, name, url, tags, cat]) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    const tagsHTML = tags.split(' ').map((tag) => `<span class="tag">${tag}</span>`).join('');

    card.innerHTML = `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${CATEGORY_LABEL[cat]}</span>
            </div>
            <div class="card-name">${name}</div>
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <a href="${url}" target="_blank" class="card-link open-project" data-id="${day}">
                    View Demo <i class="fas fa-arrow-right"></i>
                </a>
                <button class="bookmark-btn active" data-id="${day}">
                    <i class="fa-solid fa-bookmark"></i>
                </button>
            </div>
        `;

    bookmarkGrid.appendChild(card);
  });
}

const recentGrid = document.getElementById('recentGrid');

function renderRecentProjects() {
  if (!recentGrid) return;

  recentGrid.innerHTML = '';

  if (recentProjects.length === 0) {
    recentGrid.innerHTML = `<p class="empty-state">No recently viewed projects.</p>`;
    return;
  }

  const recentToggleBtn = document.getElementById('recentToggleBtn');
  if (recentToggleBtn) {
    recentToggleBtn.style.display = recentProjects.length <= INITIAL_VISIBLE_ITEMS ? 'none' : 'inline-flex';
  }

  const visibleRecent = showAllRecent ? recentProjects : recentProjects.slice(0, INITIAL_VISIBLE_ITEMS);

  visibleRecent.forEach(([day, name, url, tags, cat]) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    const tagsHTML = tags.split(' ').map((tag) => `<span class="tag">${tag}</span>`).join('');
    const isBookmarked = bookmarkedProjects.some((item) => item[0] === day);

    card.innerHTML = `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${CATEGORY_LABEL[cat]}</span>
            </div>
            <div class="card-name">${name}</div>
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <a href="${url}" target="_blank" class="card-link open-project" data-id="${day}">
                    View Demo <i class="fas fa-arrow-right"></i>
                </a>
                <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${day}">
                    <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                </button>
            </div>
        `;

    recentGrid.appendChild(card);
  });
}

/* ============================================================
   VIEW ALL TOGGLE
   ============================================================ */

const bookmarkToggleBtn = document.getElementById('bookmarkToggleBtn');
const recentToggleBtn = document.getElementById('recentToggleBtn');

if (bookmarkToggleBtn) {
  bookmarkToggleBtn.addEventListener('click', () => {
    showAllBookmarks = !showAllBookmarks;
    bookmarkToggleBtn.textContent = showAllBookmarks ? 'Show Less' : 'View All';
    renderBookmarks();
  });
}

if (recentToggleBtn) {
  recentToggleBtn.addEventListener('click', () => {
    showAllRecent = !showAllRecent;
    recentToggleBtn.textContent = showAllRecent ? 'Show Less' : 'View All';
    renderRecentProjects();
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

document.addEventListener('click', (e) => {
  const bookmarkBtn = e.target.closest('.bookmark-btn');
  if (!bookmarkBtn) return;

  e.preventDefault();
  const projectDay = bookmarkBtn.dataset.id;
  const project = PROJECTS.find((item) => item[0] === projectDay);
  toggleBookmark(project);
});

document.addEventListener('click', (e) => {
  const projectLink = e.target.closest('.open-project');
  if (!projectLink) return;

  const projectDay = projectLink.dataset.id;
  const project = PROJECTS.find((item) => item[0] === projectDay);
  if (!project) return;

  trackRecentProject(project);
});

/* ============================================================
   FILTER CHIPS
   ============================================================ */
function initFilterChips() {
  const chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
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
  const countNodes = [document.getElementById('projectCount'), document.getElementById('allCount')];

  countNodes.forEach((node) => {
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
  const isRoot = !window.location.pathname.includes('/contributors/');
  const base = isRoot ? '' : '../';

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
   THEME TOGGLE
   ============================================================ */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const icon = btn.querySelector('i');
  const saved = localStorage.getItem('theme') || 'dark';

  if (saved === 'light') {
    document.body.classList.add('light-mode');
    if (icon) icon.className = 'fas fa-sun';
  }

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    if (icon) icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
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
   BACK TO TOP BUTTON
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  console.log('PROJECTS:', typeof PROJECTS, PROJECTS ? PROJECTS.length : 'undefined');
  initTheme();
  updateNavbar();
  initFilterChips();
  initSearch();
  syncProjectCounts();
  renderGrid();
  renderBookmarks();
  renderRecentProjects();
  fetchRepoStats();
  initScrollBtn();
});
