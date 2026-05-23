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
//for the number of visible projects in one page.
let itemsPerPage = 9;
let projectData = [];
let filteredProjectData = [];


/* ============================================================
   TECHNOLOGY STACK FILTERING VARIABLES
   ============================================================ */
let techStackFilters = []; // Array of active tech filters
let techSearchQuery = ''; // Current tech search input

// Technology normalization map (handles common variations)
// Maps user input → actual tags in dataset
const TECH_ALIASES = {
  'js': 'javascript',
  'react': 'javascript',
  'node': 'javascript',
  'vue': 'javascript',
  'python': 'api',
  'flask': 'api',
  'game': 'game',
  'games': 'game',
};

/* Maps data-filter values on chip buttons to display category names */
const FILTER_CATEGORY_MAP = {
  'all': 'all',
  'game': 'Games',
  'clone': 'Clones',
  'tool': 'Tools',
  'ui': 'UI / Animation',
  'api': 'APIs',
};

/**
 * Derive a display category from a project's tags and name.
 * Uses the existing tag structure so no new data field is needed.
 */
function getCategoryFromTags(tags, name) {
  const tagStr = (tags || '').toLowerCase();
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

const PROJECT_DATA = [
  ['Day 1', 'To-Do List', './public/TO_DO_LIST/todolist.html', 'javascript todo', 'beginner'],
  ['Day 2', 'Digital Clock', './public/digital_clock/digitalclock.html', 'javascript', 'beginner'],
  ['Day 3', 'Indian Flag', './public/indianflag/flag.html', 'css', 'beginner'],
  ['Day 4', 'Dropdown Nav Bar', './public/dropdown_navbar/index.html', 'css', 'beginner'],
  ['Day 5', 'Animated Cursor', './public/Animated-cursor/animated-cursor.html', 'ui javascript css', 'beginner'],
  ['Day 6', 'Auto Background Image Slider', './public/Background-Image-sider/slider.html', 'javascript', 'beginner'],
  ['Day 7', 'Typewriter', './public/typewriter/typewriter.html', 'html css javascript', 'advanced'],
  ['Day 8', 'Parallel-X Website', './public/Parallel-x%20website/parallal.html', 'css', 'intermediate'],
  ['Day 9', 'Captcha Generator', './public/captcha/captcha.html', 'javascript', 'intermediate'],
  ['Day 10', 'QR Code Generator', './public/qr%20generator/qr.html', 'api javascript', 'intermediate'],
  ['Day 11', 'Serve Website Using Express', './public/index.html', 'javascript', 'intermediate'],
  ['Day 12', 'Nodemailer Contact Form', './public/gmail_nodemailer/public/mail.html', 'api javascript', 'intermediate'],
  ['Day 13', 'Login Form Using MERN', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/loginusingmern', 'api javascript', 'intermediate'],
  ['Day 14', 'File Uploader', './public/file_uploader/public/file_uploader.html', 'javascript', 'intermediate'],
  ['Day 15', 'Progress Bar', './public/progress_bar/progress_bar.html', 'ui css javascript', 'beginner'],
  ['Day 16', 'Scroll Bar CSS', './public/Custom Scroll Bar/index.html', 'css', 'beginner'],
  ['Day 17', 'Slider Using Swiper API', './public/slider%20box/index.html', 'api javascript', 'intermediate'],
  ['Day 18',
    'Carousel Solar System',
    './public/Carousel%20Solar%20System/index.html',
    'css canvas',
    'intermediate'],
  ['Day 19', 'Planto', './public/plantwebsite/plant.html', 'css', 'beginner'],
  ['Day 20', 'EveSparks', 'https://evesparks.onrender.com/', 'javascript', 'intermediate'],
  ['Day 21', 'Video BG Slider Using React', './public/travel_website/index.html', 'javascript', 'intermediate'],
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
  ['Day 38', 'Github Profile Finder', './public/github_profile_finder/index.html', 'api javascript', 'intermediate'],
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
  ['Day 49', 'Url Shortener', './public/url_shortener/frontend/public/index.html', 'api javascript', 'intermediate'],
  ['Day 50', 'Recipe Genie', './public/Recipe%20Genie/index.html', 'api javascript', 'intermediate'],
  ['Day 51', 'Netflix Landing Page Clone', './public/Netflix_Cloning/Index.html', 'clone css', 'beginner'],
  ['Day 52', 'ClimaCode', './public/ClimaCode%202.0/index.html', 'weather api', 'intermediate'],
  ['Day 53', 'E-Commerce Website with Simple Cart Functionality', './public/e-commerce_cart/index.html', 'javascript', 'intermediate'],
  ['Day 54', 'Budget Tracker', './public/Budget%20Tracker/index.html', 'todo javascript', 'intermediate'],
  ['Day 55', 'Cricket Game', './public/cricket/index.html', 'game javascript', 'intermediate'],
  ['Day 56', 'Pastebin using svelte', './public/pastebin/src/app.html', 'javascript', 'intermediate'],
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
  ['Day 77', 'Rock-Paper-Scissor-game project', './public/Stone-Paper-Scissor/index.html', 'game javascript', 'intermediate'],
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
  ['Day 93', 'TextUtils', './public/Textutils/public/index.html', 'javascript', 'beginner'],
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
  ['Day 116', 'AI Image Classifier', './public/AI%20Image%20Classifier/index.html', 'api javascript', 'intermediate'],
  ['Day 117', 'Habit Tracker Web App', './public/Habit-Tracker-Web-App/index.html', 'ui tool html css js', 'intermediate'],
  ['Day 118', 'Particle Effect', './public/particle-effect/index.html', 'ui html css js canvas', 'intermediate'],
  ['Day 119', 'Virtual Playground', './playground.html', 'ui game html css js', 'intermediate'],
  ['Day 120', 'Typing Speed Test', './public/typing_test/index.html', 'html css js game', 'intermediate'],
  ['Day 121', 'InterviewSimulator', './public/InterviewSimulator/index.html', 'tool', 'intermediate'],
  ['Day 122', 'AstronomyDashboard', './public/AstronomyDashboard/astro.html', 'html css javascript api-javascript', 'Advanced'],
  ['Day 123', 'Pomodoro Timer', './public/Pomodoro_Timer/index.html', 'productivity tool', 'intermediate'],
  ['Day 124', 'Hurdle Highway 2D', './public/Hurdle_Highway_2D/index.html', 'game', 'intermediate'],
  ['Day 125', 'Snakeladder', './public/snakeladder/index.html', 'game', 'intermediate'],
  ['Day 126', 'Temperature Converter', './public/TemperatureConverter/index.html', 'tool javascript', 'beginner'],
  ['Day 127', 'Particle Wave Animation', './public/Particle Wave Animation/index.html', 'css javascript', 'intermediate'],
  ['Day 128', 'Reaction Time Test', './public/reaction-time-tester/main.html', 'animation simulation html css js javascript', 'intermediate'],
  ['Day 129', 'YouTube Clone', './public/youtube clone/index.html', 'Html CSS', 'beginner'],
  ['Day 130', 'Dino Game', './public/DinoGame/DinoGame-main/index.html', 'game javascript', 'beginner'],
  ['Day 131', 'Retro Highway Racer', './public/RetroHighwayRacer/index.html', 'game javascript', 'intermediate'],
  ['Day 132', 'Pokedex', './public/Pokedex/index.html', 'utility', 'intermediate'],
  ['Day 133', 'Stock Market Simulator', './public/stock-market-simulator/index.html', 'simulator', 'intermediate'],
  ['Day 134', 'Coin Scratch', './public/Coin Scratch/index.html', 'asmr game', 'intermediate'],
  ['Day 135', 'Shooting game', './public/shooting game/index.html', '2d game', 'intermediate'],
  ['Day 136', 'Sudoku Solver', './public/sudoku-solver/index.html', 'game javascript', 'intermediate'],
  ['Day 137', 'Maths Quiz Game', './public/maths-quiz-game/index.html', 'game javascript', 'intermediate'],
  ['Day 138', 'Age Calculator', './public/age-calculator/index.html', 'tool javascript', 'beginner'],
  ['Day 139', 'Ludo game', './public/Ludo-game/index.html', 'Html css javascript', 'intermediate'],
  ['Day 140', 'Big Sales Prediction', './public/BigSales-Prediction/frontend/index.html', 'machine learning python javascript', 'advanced'],
  ['Day 141', 'Dice Roller', './public/Dice-Roller/main.html', 'html css javascript', 'intermediate'],
  ['Day 142', 'Geo Guesser game', './public/geo-guesser/index.html', 'map game', 'intermediate'],
  ['Day 143', 'Morse Code Translator', './public/MorseCodeTranslator/index.html', 'html css javascript', 'beginner'],
  ['Day 144', 'Car Racing game', './public/racing game/index.html', 'html css js', 'intermediate'],
  ['Day 145', 'Magic 8 Ball', './public/magic-8ball/main.html', 'simulation html css javascript', 'beginner'],
  ['Day 146', 'Data Sructures Visualizer', './public/Data Structures Visualizer/index.html', 'visualizer', 'intermediate'],
  ['Day 147', 'Chronosphere', './public/Chronosphere/index.html', 'game canvas', 'intermediate'],
  ['Day 148', 'Contest Tracker', './public/ContestTracker/index.html', 'tool javascript', 'advanced'],
  ['Day 149', 'GitHub Profile Battle', './public/Github-Profile-Battle/index.html', 'tool javascript', 'advanced'],
  ['Day 150', 'App Privacy Policy Generator', './public/AppPrivacyPolicyGenerator/index.html', 'tool javascript', 'intermediate'],
  ['Day 151', 'Mini Carrom Game', './public/mini carrom/index.html', 'html css javascript', 'intermediate'],
  ['Day 152', 'Physics Ball Simulation', './public/PhysicsBallSimulation/index.html', 'html css javascript canvas', 'advanced'],
  ['Day 153', 'Material3 Showcase', './public/Material3Showcase/index.html', 'tool javascript', 'intermediate'],
  ['Day 154', 'FocusRoom', './public/FocusRoom/index.html', 'html css javascript productivity timer tasks ambient', 'intermediate'],
  ['Day 155', 'Hangman Game', './public/hangman-react-ts/HangmanGame/index.html', 'react typescript game hangman vite', 'advanced'],
  ['Day 156', 'Placement Predictor', './public/Placement-Predictor/index.html', 'tool javascript html css', 'advanced'],
  ['Day 157', 'Map Route Tracker', './public/Vector-Map-Route-Tracer/index.html', 'html css javascript', 'advanced'],
  ['Day 158', 'GitHub Promo Maker', './public/GitHubPromoMaker/index.html', 'html css javascript', 'intermediate'],
  ['Day 159' , 'Dining Philosophers Simulation' , './public/Dining Philosophers Simulation/index.html' , 'simulation algorithm javascript' , 'intermediate' ] ,
];
const PROJECTS = PROJECT_DATA;


/* ============================================================
   SOURCE CODE URL GENERATOR
   ============================================================ */
function getSourceUrl(url) {
  const trimmed = url.trim();
  if (trimmed.startsWith('http')) return trimmed; // Already a full GitHub link
  if (trimmed.startsWith('./')) {
    // Converts "./public/folder/index.html" to "public/folder"
    const folderPath = trimmed.substring(2, trimmed.lastIndexOf('/'));
    return `https://github.com/${window.REPO_OWNER}/${window.REPO_NAME}/tree/Main/${folderPath}`;
  }
  return `https://github.com/${window.REPO_OWNER}/${window.REPO_NAME}/tree/Main`;
}


/* ============================================================
   TECHNOLOGY STACK FILTERING FUNCTIONS
   ============================================================ */

/**
 * Normalize technology name for consistent matching
 * SIMPLIFIED: Just lowercase, no complex aliases needed
 * @param {string} tech - Technology name to normalize
 * @returns {string} Normalized technology name
 */
function normalizeTech(tech) {
  const lower = tech.toLowerCase().trim();
  // Only handle common variations
  return TECH_ALIASES[lower] || lower;
}

/**
 * Check if project matches the active tech stack filters
 * EFFICIENT APPROACH: Direct string matching without complex transformations
 * @param {string|array} projectTags - Project tags (space-separated string or array)
 * @returns {boolean} True if project matches all active filters
 */
function matchesTechStack(projectTags) {
  // No filters = show all projects
  if (techStackFilters.length === 0) return true;

  // Handle empty or missing tags
  if (!projectTags) return false;

  // Convert to single lowercase string for efficient matching
  const tagsLower = (typeof projectTags === 'string' ? projectTags : projectTags.join(' ')).toLowerCase();

  // EFFICIENT: Check if ALL filters exist in tags (AND logic)
  // Uses simple includes() - O(n*m) where n=filters, m=tag length
  return techStackFilters.every(filter => tagsLower.includes(filter));
}


/**
 * Remove a specific technology filter
 * @param {string} tech - Technology to remove from filters
 */
function removeTechFilter(tech) {
  techStackFilters = techStackFilters.filter(t => t !== tech);
  updateTechFilterDisplay();
  renderGrid();
}

/**
 * Clear all technology filters
 */
function clearAllTechFilters() {
  techStackFilters = [];
  techSearchQuery = '';

  const input = document.getElementById('techStackSearch');
  if (input) input.value = '';

  updateTechFilterDisplay();
  renderGrid();
}

/**
 * Update the visual display of active tech filters
 */
function updateTechFilterDisplay() {
  const container = document.getElementById('activeTechFilters');
  const tagsContainer = document.getElementById('techFilterTags');
  const clearBtn = document.getElementById('clearTechFilter');

  if (!container || !tagsContainer) return;

  // Show/hide clear button in search input
  if (clearBtn) {
    clearBtn.style.display = techStackFilters.length > 0 ? 'block' : 'none';
  }

  // Show/hide active filters container
  if (techStackFilters.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';

  // Render filter tags with remove buttons
  tagsContainer.innerHTML = techStackFilters.map(tech => `
    <span class="tech-filter-tag">
      ${tech}
      <button onclick="removeTechFilter('${tech}')" aria-label="Remove ${tech} filter">
        <i class="fas fa-times"></i>
      </button>
    </span>
  `).join('');
}

/**
 * Get all unique technologies from projects (optional utility)
 * EFFICIENT: Uses Set for O(1) lookups
 * @returns {array} Sorted array of unique technologies
 */
function getAllTechnologies() {
  const techSet = new Set();

  PROJECTS.forEach(([, , , tags]) => {
    if (tags) {
      const tagArray = typeof tags === 'string'
        ? tags.split(/\s+/).filter(t => t)
        : tags;

      tagArray.forEach(tag => {
        techSet.add(tag.toLowerCase());
      });
    }
  });

  return Array.from(techSet).sort();
}

/* ============================================================
   BOOKMARK + RECENT SYSTEM
============================================================ */

let bookmarkedProjects = JSON.parse(localStorage.getItem('bookmarkedProjects')) || [];
let recentProjects = JSON.parse(localStorage.getItem('recentProjects')) || [];

let showAllBookmarks = false;
let showAllRecent = false;

const INITIAL_VISIBLE_ITEMS = 3;

const CATEGORY_LABEL = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/* ============================================================
   GITHUB REPO STATS
   ============================================================ */
async function fetchRepoStats() {

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  const setFallback = () => {
    set('starCount', 'N/A');
    set('forkCount', 'N/A');
    set('issueCount', 'N/A');
    set('prCount', 'N/A');
  };

  try {

    // Optional loading state
    set('starCount', 'Loading...');
    set('forkCount', 'Loading...');
    set('issueCount', 'Loading...');
    set('prCount', 'Loading...');

    const [repoRes, prRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}`),
      fetch(`https://api.github.com/search/issues?q=repo:${window.REPO_OWNER}/${window.REPO_NAME}+type:pr+state:open`)
    ]);

    if (!repoRes.ok || !prRes.ok) {
      throw new Error("GitHub API request failed");
    }

    const repo = await repoRes.json();
    const prs = await prRes.json();

    set('starCount', repo.stargazers_count.toLocaleString());
    set('forkCount', repo.forks_count.toLocaleString());
    set('issueCount', (repo.open_issues_count - prs.total_count).toLocaleString());
    set('prCount', prs.total_count.toLocaleString());

  } catch (e) {

    console.warn("GitHub stats unavailable:", e.message);

    // Show fallback text instead of permanent dashes
    setFallback();
  }
}
function generateReadme() {
  try {
    const lines = [];
    lines.push('# 100 Days · 100 Web Projects');
    lines.push('A curated archive of frontend experiments — browse, fork, contribute.');
    lines.push('');
    lines.push('## Projects');
    PROJECTS.forEach(([day, name, url, tags]) => {
      const safeUrl = url || '';
      const category = getCategoryFromTags(tags, name);
      lines.push(`- **${day} — ${name}** — ${safeUrl} — _${category}_`);
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
let sortOption = 'default';

function renderGrid() {
  const grid = document.getElementById('projectGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  const filtered = PROJECTS.filter(([day, name, , tags]) => {
    const category = getCategoryFromTags(tags, name);
    const targetCategory = FILTER_CATEGORY_MAP[activeFilter] || 'all';

    const matchesFilter = activeFilter === 'all' || category === targetCategory;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q || name.toLowerCase().includes(q) || day.toLowerCase().includes(q);

    const matchesTech = matchesTechStack(tags);

    return matchesFilter && matchesSearch && matchesTech;
  });
  if (sortOption === 'az') {
    filtered.sort((a, b) => a[1].localeCompare(b[1]));
  }

  if (sortOption === 'latest') {
    filtered.sort((a, b) => {
      const dayA = parseInt(a[0].replace('Day ', ''));
      const dayB = parseInt(b[0].replace('Day ', ''));
      return dayB - dayA;
    });
  }

  if (sortOption === 'difficulty') {
    const difficultyOrder = {
      beginner: 1,
      intermediate: 2,
      advanced: 3
    };

    filtered.sort((a, b) => {
      return (
        difficultyOrder[a[4].toLowerCase()] -
        difficultyOrder[b[4].toLowerCase()]
      );
    });
  }

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    const container = document.getElementById('paginationContainer');
    if (container) container.innerHTML = '';
    return;
  }

  grid.style.display = 'grid';
  noResults.style.display = 'none';

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  if (currentPage < 1) {
    currentPage = 1;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = filtered.slice(startIndex, endIndex);

  pageItems.forEach(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const card = document.createElement('div');
    card.className = 'project-card';
    const isBookmarked = bookmarkedProjects.some((item) => item[0] === day);
    const tagsArray = typeof tags === 'string' ? tags.split(/\s+/).filter((t) => t) : tags;
    const tagsHTML = tagsArray.map((t) => `<span class="tag">${t}</span>`).join('');
    const sourceUrl = getSourceUrl(url);

    card.innerHTML = `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${category}</span>
            </div>
            <div class="card-name">${name}</div>
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <div class="card-actions-left">
                    <a href="${url.trim()}" target="_blank" class="card-link open-project" data-id="${day}" rel="noopener noreferrer">
                        Demo <i class="fas fa-arrow-right"></i>
                    </a>
                    <a href="${sourceUrl}" target="_blank" class="card-link view-code-link" rel="noopener noreferrer">
                        <i class="fab fa-github"></i> Code
                    </a>
                </div>
                <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-id="${day}">
                    <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                </button>
            </div>
        `;

    grid.appendChild(card);
  });

  renderPagination(filtered.length, totalPages);
}

function renderPagination(totalItems, totalPages) {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;

  let container = document.getElementById('paginationContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'paginationContainer';
    container.className = 'pagination-container';
  }

  container.innerHTML = '';

  // If there is only 1 page of results, hide and detach the pagination block
  if (totalPages <= 1) {
    if (container.parentElement === grid) {
      grid.removeChild(container);
    }
    return;
  }

  // Render showing info range (e.g. "Showing 1 to 9 of 100")
  const infoDiv = document.createElement('div');
  infoDiv.className = 'pagination-info';
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  infoDiv.innerHTML = `Showing <strong>${startItem}</strong> to <strong>${endItem}</strong> of <strong>${totalItems}</strong> projects`;
  container.appendChild(infoDiv);

  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'pagination-controls';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'prev-btn';
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.setAttribute('aria-label', 'Previous Page');
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderGrid();
      // Delay scrolling by 50ms to allow DOM layout to recalculate and stabilize after cards redraw
      setTimeout(() => {
        scrollToProjectSection();
      }, 50);
    }
  });
  controlsDiv.appendChild(prevBtn);

  // Initialize bounds for numeric pagination window (displays maximum of 4 page buttons)
  let startPage = 1;
  let endPage = totalPages;
  const maxVisible = 4;

  // Sliding window pagination logic centering the active page
  if (totalPages > maxVisible) {
    if (currentPage <= 2) {
      startPage = 1;
      endPage = 4;
    } else if (currentPage >= totalPages - 1) {
      startPage = totalPages - 3;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 2;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-num ${currentPage === i ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.setAttribute('aria-label', `Page ${i}`);
    pageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      renderGrid();
      // Delay scrolling by 50ms to allow DOM layout to recalculate and stabilize after cards redraw
      setTimeout(() => {
        scrollToProjectSection();
      }, 50);
    });
    controlsDiv.appendChild(pageBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.className = 'next-btn';
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.setAttribute('aria-label', 'Next Page');
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderGrid();
      // Delay scrolling by 50ms to allow DOM layout to recalculate and stabilize after cards redraw
      setTimeout(() => {
        scrollToProjectSection();
      }, 50);
    }
  });
  controlsDiv.appendChild(nextBtn);

  container.appendChild(controlsDiv);

  // Append container dynamically inside the projectGrid element to keep it attached
  grid.appendChild(container);
}

function scrollToProjectSection() {
  const header = document.querySelector('.projects-header');
  if (!header) return;

  const navbar = document.querySelector('.navbar');
  // Subtract height of fixed navbar with a 50px buffer to prevent overlaying the search bar
  const offset = navbar ? navbar.offsetHeight - 50 : 30;
  const targetY = header.getBoundingClientRect().top + window.pageYOffset - offset;
  const startY = window.pageYOffset;
  const distance = targetY - startY;

  // Custom snappy scroll duration (100ms matches the quick transitions in your CSS)
  const duration = 100;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    // Cap scroll position math exactly to distance to avoid landing slightly off target
    const run = easeInOutQuad(Math.min(timeElapsed, duration), startY, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  // Mathematical Quadratic Ease-In-Out formula for momentum-like deceleration
  function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
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

  visibleBookmarks.forEach(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const card = document.createElement('div');
    card.className = 'project-card';
    const tagsHTML = tags.split(' ').map((tag) => `<span class="tag">${tag}</span>`).join('');
    const sourceUrl = getSourceUrl(url);

    card.innerHTML = `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${category}</span>
            </div>
            <div class="card-name">${name}</div>
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <div class="card-actions-left">
                    <a href="${url}" target="_blank" class="card-link open-project" data-id="${day}">
                        Demo <i class="fas fa-arrow-right"></i>
                    </a>
                    <a href="${sourceUrl}" target="_blank" class="card-link view-code-link" rel="noopener noreferrer">
                        <i class="fab fa-github"></i> Code
                    </a>
                </div>
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

  visibleRecent.forEach(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const card = document.createElement('div');
    card.className = 'project-card';
    const tagsHTML = tags.split(' ').map((tag) => `<span class="tag">${tag}</span>`).join('');
    const isBookmarked = bookmarkedProjects.some((item) => item[0] === day);
    const sourceUrl = getSourceUrl(url);

    card.innerHTML = `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${category}</span>
            </div>
            <div class="card-name">${name}</div>
            <div class="card-tags">${tagsHTML}</div>
            <div class="card-footer">
                <div class="card-actions-left">
                    <a href="${url}" target="_blank" class="card-link open-project" data-id="${day}">
                        Demo <i class="fas fa-arrow-right"></i>
                    </a>
                    <a href="${sourceUrl}" target="_blank" class="card-link view-code-link" rel="noopener noreferrer">
                        <i class="fab fa-github"></i> Code
                    </a>
                </div>
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
  if (!toast) return;

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
  if (!project) return;

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
      currentPage = 1;
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
    currentPage = 1;
    renderGrid();
  });
}
function initSorting() {
  const sortSelect = document.getElementById('sortProjects');

  if (!sortSelect) return;

  sortSelect.addEventListener('change', (e) => {
    sortOption = e.target.value;
    currentPage = 1;
    renderGrid();
  });
}
/* ============================================================
   TECH STACK SEARCH INITIALIZATION
   ============================================================ */
function initTechStackSearch() {
  const input = document.getElementById('techStackSearch');
  const clearBtn = document.getElementById('clearTechFilter');

  if (!input) return;

  // Debounce timer for performance
  let debounceTimer;

  // Listen for input changes
  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);

    // Debounce: wait 300ms after user stops typing
    debounceTimer = setTimeout(() => {
      const value = e.target.value.trim().toLowerCase();

      if (value) {
        // Split by comma or space to support multiple technologies
        // More efficient: direct lowercase conversion
        const techs = value.split(/[,\s]+/).filter(t => t.length > 0);

        techStackFilters = [...new Set(techs)];

        updateTechFilterDisplay();
        renderGrid();
      } else {
        // Empty input = clear all filters
        clearAllTechFilters();
      }
    }, 300); // 300ms debounce delay
  });

  // Clear button functionality
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearAllTechFilters();
    });
  }

  // Optional: Add Enter key support
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur(); // Trigger the debounced input event
    }
  });
}

/* ============================================================
   SEARCH CONTROLS
   ============================================================ */
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearSearch');

function syncProjectCounts() {
  const total = PROJECTS.length.toLocaleString();

  const countNodes = [
    document.getElementById('projectCount'),
    document.getElementById('allCount')
  ];

  countNodes.forEach((node) => {
    if (node) node.textContent = total;
  });

  if (searchInput) {
    searchInput.placeholder = `Search ${total} projects…`;
  }
}

// Clear button functionality
if (searchInput && clearBtn) {
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
    searchInput.focus();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      searchInput.dispatchEvent(new Event("input"));
      searchInput.focus();
    }
  });
}

// initialize
syncProjectCounts();

/* ============================================================
   NAVBAR — dynamic based on login state
   ============================================================ */
function updateNavbar() {
  const container = document.getElementById('navButtons');
  if (!container) return;

  const username = window.username || null;
  const isRoot = !window.location.pathname.includes('/contributors/');
  const base = isRoot ? '' : '../';
  const isLight = document.body.classList.contains('light-mode');
  const themeButton = `
        <button class="btn btn-ghost btn-sm" id="themeToggleNav" aria-label="Toggle theme">
          <i class="fas ${isLight ? 'fa-sun' : 'fa-moon'}"></i> Theme
        </button>
        `;
  const otherLink = isRoot
    ? `<a class="btn btn-ghost btn-sm" href="${base}contributors/contributor.html">Contributors</a>`
    : `<a class="btn btn-ghost btn-sm" href="${base}index.html">Home</a>`;

  if (username) {
    container.innerHTML = `
            ${themeButton}
            <span class="welcome-text">Hi, ${username}</span>
            <button class="btn btn-ghost btn-sm" id="logoutBtn">Log out</button>
            <button class="btn btn-ghost btn-sm" id="generateReadmeBtn">Generate README</button>
            <a class="btn btn-ghost btn-sm" href="https://github.com/dhairyagothi/100_days_100_web_project" target="_blank">
              <i class="fab fa-github"></i> GitHub
            </a>
            ${otherLink}
        `;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      window.username = null;
      updateNavbar();
    });
    const gen = document.getElementById('generateReadmeBtn');
    if (gen) gen.addEventListener('click', generateReadme);
  } else {
    container.innerHTML = `
            ${themeButton}
            ${otherLink}
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
  const saved = localStorage.getItem('theme') || 'dark';
  let transitionTimer = null;

  const syncThemeIcons = () => {
    const isLight = document.body.classList.contains('light-mode');
    const iconClass = isLight ? 'fas fa-sun' : 'fas fa-moon';
    document.querySelectorAll('#themeToggle i, #themeToggleNav i').forEach(icon => {
      icon.className = iconClass;
    });
  };

  if (saved === 'light') {
    document.body.classList.add('light-mode');
  }
  syncThemeIcons();

  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('#themeToggle') || e.target.closest('#themeToggleNav');
    if (!target) return;

    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    syncThemeIcons();

    document.body.classList.add('theme-transitioning');
    if (transitionTimer) clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 400);
  });
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
function initScrollBtn() {
  const btn = document.getElementById('scrollBtn');
  const ring = document.getElementById('ringFill');
  if (!btn) return;

  const circumference = 2 * Math.PI * 22;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    btn.classList.toggle('show', scrollTop > 400);

    if (ring) {
      ring.style.strokeDashoffset = circumference * (1 - progress);
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   INIT
   ============================================================ */
function hasProjectGrid() {
  return Boolean(document.getElementById('projectGrid'));
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateNavbar();

  initFilterChips();
  initSearch();
  initSorting();
  initTechStackSearch();

  syncProjectCounts();
  fetchRepoStats();
  initScrollBtn();

  if (hasProjectGrid()) {
    initFilterChips();
    initSearch();
    initTechStackSearch();
    renderGrid();
    renderBookmarks();
    renderRecentProjects();
  }
});



(() => {
  const initDirectMobileMenu = () => {
    const menuToggle = document.getElementById('menuToggle');
    const navButtons = document.getElementById('navButtons');

    if (!menuToggle || !navButtons) return;

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      navButtons.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!navButtons.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        navButtons.classList.remove('active');
      }
    });

    navButtons.addEventListener('click', (e) => {
      if (e.target.closest('.btn') || e.target.closest('a') || e.target.closest('button')) {
        menuToggle.classList.remove('active');
        navButtons.classList.remove('active');
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDirectMobileMenu);
  } else {
    initDirectMobileMenu();
  }
})();



// Re-render the grid when the browser window is resized to adapt pagination density instantly
window.addEventListener('resize', () => {
  if (hasProjectGrid()) {
    renderGrid();
  }
});

/* ============================================================
   EXPOSE FUNCTIONS TO GLOBAL SCOPE
   (Required for HTML onclick handlers)
   ============================================================ */
window.removeTechFilter = removeTechFilter;
window.clearAllTechFilters = clearAllTechFilters;
