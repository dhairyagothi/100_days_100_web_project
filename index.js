/* ============================================================
   CONFIGURATION & GLOBAL VARIABLES
   ============================================================ */
if (typeof REPO_OWNER === "undefined") {
  window.REPO_OWNER = "dhairyagothi";
  window.REPO_NAME = "100_days_100_web_project";
}
window.REPO_OWNER = window.REPO_OWNER || "dhairyagothi";
window.REPO_NAME = window.REPO_NAME || "100_days_100_web_project";

let currentPage = 1;
let itemsPerPage = 9; 
let projectData = [];
let filteredProjectData = [];
let techStackFilters = []; 
let techSearchQuery = ''; 
let activeFilter = 'all';
let searchQuery = '';

/* ============================================================
   ✅ DEBOUNCE HELPER FUNCTION (Top-Level Par Set)
   ============================================================ */
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/* ============================================================
   DATASET MAP (All 116 Apps Perfectly Formatted)
   ============================================================ */
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
    ['Day 57', 'Glowing Social Media Icons', './public/Social Media Glowing/index.html', 'css ui animation', 'beginner'],
    ['Day 58', 'Music App', './public/Music App/index.html', 'api javascript tool', 'intermediate'],
    ['Day 59', 'Blog Page', './public/Blog Page/index.html', 'css ui', 'beginner'],
    ['Day 60', 'Marketing template website', './public/marketing_website/index.html', 'css ui', 'beginner'],
    ['Day 61', 'Hologram Button', './public/Holo Button/index.html', 'css ui animation', 'beginner'],
    ['Day 62', 'Solar System Explorer', './public/Solar System Explorer in CSS only haml/template.html', 'css ui animation', 'intermediate'],
    ['Day 63', 'Image to Text App', './public/Image-To-Text-App/index.html', 'api javascript tool', 'intermediate'],
    ['Day 64', 'Zomato-clone', './public/zomato-clone/zomato.html', 'css clone', 'beginner'],
    ['Day 65', 'The Cube', './public/The Cube/index.html', 'canvas css ui animation', 'intermediate'],
    ['Day 66', 'Flask Authentication App', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/flask_auth_app', 'api javascript tool', 'intermediate'],
    ['Day 67', 'Blog-Website', './public/blog/main.html', 'css ui', 'beginner'],
    ['Day 68', '3d Rotating Card', './public/3d cards/index.html', 'css ui animation', 'intermediate'],
    ['Day 69', 'Spotify Clone Project', './public/spotify-clone -project/index.html', 'api javascript clone', 'intermediate'],
    ['Day 70', 'Insect-Catch_Game', './public/Insect-Catch-Game/index.html', 'game canvas', 'intermediate'],
    ['Day 71', 'Quotely Laughs', './public/Quotely-Laughs/index.html', 'api javascript tool', 'beginner'],
    ['Day 72', 'Contact Book', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Contact Book', 'todo javascript tool', 'intermediate'],
    ['Day 73', 'Candy_Crush_Game', './public/Candy_Crush_Game/index.html', 'game javascript', 'intermediate'],
    ['Day 74', 'Stock Profit Calculator', './public/Stock-Profit-Calculator/index.html', 'javascript tool', 'beginner'],
    ['Day 75', 'code-space-game project', './public/code-jump-space-game/index.html', 'game canvas', 'intermediate'],
    ['Day 76', 'Animated Searchbar', './public/Animated Searchbar/index.html', 'css javascript ui animation', 'beginner'],
    ['Day 77', 'Rock-Paper-Scissor-game project', './public/Stone-Paper-Scissor/index.html', 'game javascript', 'beginner'],
    ['Day 78', 'NPM Package Search', './public/NPM Package Search/index.html', 'api javascript tool', 'intermediate'],
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

const FILTER_CATEGORY_MAP = {
    'all': 'all',
    'game': 'Games',
    'clone': 'Clones',
    'tool': 'Tools',
    'ui': 'UI / Animation',
    'api': 'APIs'
};

/* ============================================================
   LOGIC & RENDERING FUNCTIONS
   ============================================================ */
function getCategoryFromTags(tags, name) {
  const tagStr = (Array.isArray(tags) ? tags.join(' ') : (tags || '')).toLowerCase();
  if (tagStr.includes('game')) return 'Games';
  if (tagStr.includes('clone')) return 'Clones';
  if (tagStr.includes('tool')) return 'Tools';
  if (tagStr.includes('ui')) return 'UI / Animation';
  if (tagStr.includes('api') || tagStr.includes('weather')) return 'APIs';
  return 'Tools';
}

function resolveProjectUrls(day, name, url, tags) {
  return {
    demoUrl: url ? url.trim() : '#',
    sourceUrl: `https://github.com/${window.REPO_OWNER}/${window.REPO_NAME}/tree/Main/${url}`
  };
}

function buildProjectCardHTML({ day, name, url, tags, category }) {
  const { demoUrl } = resolveProjectUrls(day, name, url, tags);
  const tagsArray = typeof tags === 'string' ? tags.split(/\s+/).filter(t => t) : [];
  const tagsHTML = tagsArray.map(t => `<span class="tag">${t}</span>`).join('');

return {
    html: `
        <div class="card-meta">
            <span class="card-day">${day}</span>
            <span class="card-category">${category}</span>
        </div>
        <div class="card-name">${name}</div>
        <div class="card-tags">${tagsHTML}</div>
        <div class="card-footer">
            <div class="card-actions-left">
                <a href="${demoUrl}" target="_blank" class="card-link">Demo <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `,
    demoUrl
  };
}

function renderGrid() {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  const filtered = PROJECTS.filter(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const targetCategory = FILTER_CATEGORY_MAP[activeFilter] || 'all';
    const matchesFilter = activeFilter === 'all' || category === targetCategory;

    const q = searchQuery.toLowerCase().trim();
    return matchesFilter && (!q || name.toLowerCase().includes(q) || day.toLowerCase().includes(q));
  });

  grid.innerHTML = '';
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  pageItems.forEach(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const card = document.createElement('div');
    const { html } = buildProjectCardHTML({ day, name, url, tags, category });
    card.className = 'project-card';
    card.innerHTML = html;
    grid.appendChild(card);
  });

  renderPagination(filtered.length, Math.ceil(filtered.length / itemsPerPage));
}

function renderPagination(totalItems, totalPages) {
  let container = document.getElementById('paginationContainer');
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  if (!container) {
    container = document.createElement("div");
    container.id = "paginationContainer";
    container.className = "pagination-container";
  }
  container.innerHTML = '';
  if (totalPages <= 1) return;

  const controlsDiv = document.createElement("div");
  controlsDiv.className = "pagination-controls";

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
   LIVE SEARCH & EVENT LISTENERS (Universal Mobile Patch)
   ============================================================ */
function initSearch() {
  const input = document.getElementById('searchInput') || 
                document.getElementById('search') || 
                document.querySelector('input[type="text"]') ||
                document.querySelector('.search-input');
                
  const box = document.getElementById('suggestionsBox') || document.querySelector('.suggestions-box');
  
  if (!input) return;

  // Single event listener target with clean node replacement
  const newInput = input.cloneNode(true);
  input.parentNode.replaceChild(newInput, input);

  newInput.addEventListener('input', debounce(() => {
    searchQuery = newInput.value.trim();
    currentPage = 1;
    renderGrid();
  }, 200));

  document.addEventListener('touchstart', (e) => {
    if (box && !e.target.closest('.search-bar') && !e.target.closest('.search-input-wrapper') && !e.target.closest('input')) {
      box.style.display = 'none';
    }
  });

  newInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      newInput.blur(); 
      if (box) box.style.display = 'none';
    }
  });
}

function initFilterChips() {
  const chips = document.querySelectorAll('.chip[data-filter]') || document.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeFilter = chip.dataset.filter || chip.getAttribute('data-filter');
      currentPage = 1;
      renderGrid();
    });
  });
}

/* ============================================================
   INITIALIZATION TRIGGER
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initFilterChips();
  initSearch();
  renderGrid();
});
