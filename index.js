/* ============================================================
   CONFIGURATION
   ============================================================ */
if (typeof REPO_OWNER === 'undefined') {
    window.REPO_OWNER = "dhairyagothi";
    window.REPO_NAME  = "100_days_100_web_project";
}
window.REPO_OWNER = window.REPO_OWNER || 'dhairyagothi';
window.REPO_NAME = window.REPO_NAME || '100_days_100_web_project';

/* ============================================================
   PROJECT DATA
   [day label, project name, demo url, tech tags (array), category]
   Categories: game | clone | tool | ui | api
   ============================================================ */
const PROJECTS = [
    ["Day 1",   "To-Do List",                         "./public/TO_DO_LIST/todolist.html",                                                                              ["HTML","CSS","JS"],       "tool"],
    ["Day 2",   "Digital Clock",                       "./public/digital_clock/digitalclock.html",                                                                      ["HTML","CSS","JS"],       "ui"],
    ["Day 3",   "Indian Flag",                         "./public/indianflag/flag.html",                                                                                  ["HTML","CSS"],            "ui"],
    ["Day 4",   "Dropdown Navbar",                     "./public/dropdown_navbar/index.html",                                                                            ["HTML","CSS","JS"],       "ui"],
    ["Day 5",   "Animated Cursor",                     "./public/Animated-cursor/animated-cursor.html",                                                                  ["CSS","JS"],              "ui"],
    ["Day 6",   "Auto Background Slider",              "./public/Background-Image-sider/slider.html",                                                                    ["HTML","CSS","JS"],       "ui"],
    ["Day 7",   "Typewriter Effect",                   "./public/typewriter/typewriter.html",                                                                            ["HTML","CSS","JS"],       "ui"],
    ["Day 8",   "Parallax Website",                    "./public/Parallel-x%20website/parallal.html",                                                                   ["HTML","CSS","JS"],       "ui"],
    ["Day 9",   "Captcha Generator",                   "./public/captcha/captcha.html",                                                                                  ["HTML","CSS","JS"],       "tool"],
    ["Day 10",  "QR Code Generator",                   "./public/qr%20generator/qr.html",                                                                                ["HTML","JS","API"],       "api"],
    ["Day 11",  "Express Static Server",               "./public/index.html",                                                                                            ["Node","Express"],        "tool"],
    ["Day 12",  "Nodemailer Contact Form",             "./public/gmail_nodemailer/public/mail.html",                                                                    ["Node","Nodemailer"],     "tool"],
    ["Day 13",  "Login Form — MERN",                   "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/loginusingmern",                     ["React","MongoDB","Node"],"tool"],
    ["Day 14",  "File Uploader",                       "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/file_uploader",                      ["Node","Multer"],         "tool"],
    ["Day 15",  "Progress Bar",                        "./public/progress_bar/progress_bar.html",                                                                        ["HTML","CSS","JS"],       "ui"],
    ["Day 16",  "Custom Scrollbar CSS",                "./public/index.html",                                                                                            ["CSS"],                   "ui"],
    ["Day 17",  "Slider — Swiper API",                 "./public/slider%20box/index.html",                                                                              ["JS","Swiper"],           "ui"],
    ["Day 18",  "Carousel Solar System",               "./public/carousal/index.html",                                                                                   ["HTML","CSS","JS"],       "ui"],
    ["Day 19",  "Planto — Plant Website",              "./public/plantwebsite/plant.html",                                                                               ["HTML","CSS","JS"],       "ui"],
    ["Day 20",  "EveSparks",                           "https://evesparks.onrender.com/",                                                                                ["React","Node"],          "tool"],
    ["Day 21",  "Video BG Slider — React",             "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/travel_website",                     ["React"],                 "ui"],
    ["Day 22",  "Page Loader",                         "./public/pageloader/pageloader.html",                                                                            ["CSS","JS"],              "ui"],
    ["Day 23",  "Jarvis Virtual Assistant",            "./public/Jarvis-AI-main/index.html",                                                                             ["JS","SpeechAPI"],        "api"],
    ["Day 24",  "AI Chat Bot",                         "./public/AI%20ChatBot/chatbot.html",                                                                             ["JS","API"],              "api"],
    ["Day 25",  "Tic-Tac-Toe",                         "./public/TicTacToe/index.html",                                                                                  ["HTML","CSS","JS"],       "game"],
    ["Day 26",  "Maze Game",                           "./public/Maze-Game-main/index.html",                                                                             ["Canvas","JS"],           "game"],
    ["Day 27",  "Memory Game",                         "./public/MemoryGame/index.html",                                                                                 ["HTML","CSS","JS"],       "game"],
    ["Day 28",  "Wordle",                              "./public/WORDLE/index.html",                                                                                     ["HTML","CSS","JS"],       "game"],
    ["Day 29",  "Snake Game",                          "./public/snake_game/index.html",                                                                                 ["Canvas","JS"],           "game"],
    ["Day 30",  "Flappy Bird",                         "./public/Flappy-bird-main/index.html",                                                                           ["Canvas","JS"],           "game"],
    ["Day 31",  "Password Manager",                    "./public/password%20manager/index.html",                                                                         ["HTML","CSS","JS"],       "tool"],
    ["Day 32",  "Missionaries & Cannibals",            "./public/Missionaries&Cannibals/index.html",                                                                     ["JS"],                    "game"],
    ["Day 33",  "Weather Forecast",                    "./public/Weather%20Forcasting/index.html",                                                                       ["JS","WeatherAPI"],       "api"],
    ["Day 34",  "Email Validator",                     "./public/email%20validator/index.html",                                                                          ["HTML","JS"],             "tool"],
    ["Day 35",  "JS Calculator",                       "./public/Vanilla-JavaScript-Calculator-master/index.html",                                                       ["HTML","CSS","JS"],       "tool"],
    ["Day 36",  "Medical App",                         "./public/Medical_App/index.html",                                                                                ["HTML","CSS","JS"],       "tool"],
    ["Day 37",  "2048 Game",                           "./public/2048_game/index.html",                                                                                  ["HTML","CSS","JS"],       "game"],
    ["Day 38",  "GitHub Profile Finder",               "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/github_profile_finder",              ["JS","GitHub API"],       "api"],
    ["Day 39",  "Notes App",                           "./public/notes-app/index.html",                                                                                  ["HTML","CSS","JS"],       "tool"],
    ["Day 40",  "Analog Clock",                        "./public/AnalogClock/index.html",                                                                                ["Canvas","JS"],           "ui"],
    ["Day 41",  "Scroll Dark Game",                    "./public/Scroll%20Game%20Dark%20Run/index.html",                                                                 ["Canvas","JS"],           "game"],
    ["Day 42",  "Amazon Clone",                        "./public/Amazon_Clone/index.html",                                                                               ["HTML","CSS"],            "clone"],
    ["Day 43",  "Password Generator",                  "./public/Password_Generator/index.html",                                                                         ["HTML","CSS","JS"],       "tool"],
    ["Day 44",  "BMI Calculator",                      "./public/BMI_Calculator/index.html",                                                                             ["HTML","CSS","JS"],       "tool"],
    ["Day 45",  "Black Jack",                          "./public/BlackJack/blackJ.html",                                                                                 ["HTML","CSS","JS"],       "game"],
    ["Day 46",  "Palindrome Generator",                "./public/Palindrome_Generator/index.html",                                                                       ["HTML","JS"],             "tool"],
    ["Day 47",  "Ping Pong",                           "./public/ping/index.html",                                                                                       ["Canvas","JS"],           "game"],
    ["Day 48",  "Text to Voice Converter",             "./public/TextToVoiceConverter/index.html",                                                                       ["JS","SpeechAPI"],        "api"],
    ["Day 49",  "URL Shortener",                       "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/url_shortener",                      ["Node","Express"],        "tool"],
    ["Day 50",  "Recipe Genie",                        "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Recipe-Genie",                       ["JS","API"],              "api"],
    ["Day 51",  "Netflix Clone",                       "./public/Netflix_Cloning/Index.html",                                                                            ["HTML","CSS"],            "clone"],
    ["Day 52",  "ClimaCode 2.0",                       "./public/ClimaCode%202.0/index.html",                                                                            ["JS","WeatherAPI"],       "api"],
    ["Day 53",  "E-Commerce Cart",                     "./public/e-commerce_cart/index.html",                                                                            ["HTML","CSS","JS"],       "tool"],
    ["Day 54",  "Budget Tracker",                      "./public/Budget%20Tracker/index.html",                                                                           ["HTML","CSS","JS"],       "tool"],
    ["Day 55",  "Cricket Game",                        "./public/cricket/index.html",                                                                                    ["HTML","CSS","JS"],       "game"],
    ["Day 56",  "Pastebin — Svelte",                   "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/pastebin",                           ["Svelte"],                "tool"],
    ["Day 57",  "Glowing Social Media Icons",          "./public/Social%20Media%20Glowing/index.html",                                                                   ["CSS"],                   "ui"],
    ["Day 58",  "Music App",                           "./public/Music%20App/index.html",                                                                                ["HTML","CSS","JS"],       "ui"],
    ["Day 59",  "Blog Page",                           "./public/Blog%20Page/index.html",                                                                                ["HTML","CSS"],            "ui"],
    ["Day 60",  "Marketing Website",                   "./public/marketing_website/index.html",                                                                          ["HTML","CSS","JS"],       "ui"],
    ["Day 61",  "Hologram Button",                     "./public/Holo%20Button/index.html",                                                                              ["CSS","JS"],              "ui"],
    ["Day 62",  "Solar System Explorer",               "./public/Solar%20System%20Explorer%20in%20CSS%20only%20haml/template.html",                                     ["CSS"],                   "ui"],
    ["Day 63",  "Image to Text App",                   "./public/Image-To-Text-App/index.html",                                                                          ["JS","OCR API"],          "api"],
    ["Day 64",  "Zomato Clone",                        "./public/zomato-clone/zomato.html",                                                                              ["HTML","CSS"],            "clone"],
    ["Day 65",  "The Cube",                            "./public/The%20Cube/index.html",                                                                                 ["CSS","JS"],              "ui"],
    ["Day 66",  "Flask Auth App",                      "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/flask_auth_app",                     ["Python","Flask"],        "tool"],
    ["Day 67",  "Blog Website",                        "./public/blog/main.html",                                                                                        ["HTML","CSS","JS"],       "ui"],
    ["Day 68",  "3D Rotating Card",                    "./public/3d%20cards/index.html",                                                                                 ["CSS","JS"],              "ui"],
    ["Day 69",  "Spotify Clone",                       "./public/spotify-clone%20-project/index.html",                                                                   ["HTML","CSS"],            "clone"],
    ["Day 70",  "Insect Catch Game",                   "./public/Insect-Catch-Game/index.html",                                                                          ["HTML","CSS","JS"],       "game"],
    ["Day 71",  "Quotely Laughs",                      "./public/Quotely-Laughs/index.html",                                                                             ["JS","API"],              "api"],
    ["Day 72",  "Contact Book",                        "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Contact%20Book",                     ["HTML","CSS","JS"],       "tool"],
    ["Day 73",  "Candy Crush Game",                    "./public/Candy_Crush_Game/index.html",                                                                           ["Canvas","JS"],           "game"],
    ["Day 74",  "Stock Profit Calculator",             "./public/Stock-Profit-Calculator/index.html",                                                                    ["HTML","CSS","JS"],       "tool"],
    ["Day 75",  "Code Space Jump Game",                "./public/code-jump-space-game/index.html",                                                                       ["Canvas","JS"],           "game"],
    ["Day 76",  "Animated Searchbar",                  "./public/Animated%20Searchbar/index.html",                                                                       ["CSS","JS"],              "ui"],
    ["Day 77",  "Rock Paper Scissors",                 "./public/Stone-Paper-Scissor/index.html",                                                                        ["HTML","CSS","JS"],       "game"],
    ["Day 78",  "NPM Package Search",                  "./public/NPM%20Package%20Search/index.html",                                                                     ["JS","npm API"],          "api"],
    ["Day 79",  "LinkedIn Clone",                      "./public/Linkedin-Clone/index.html",                                                                             ["HTML","CSS"],            "clone"],
    ["Day 80",  "Resume Studio",                       "./public/ResumeStudio/index.html",                                                                               ["HTML","CSS","JS"],       "tool"],
    ["Day 81",  "Simon Says Game",                     "./public/Simon_Says_Game/index.html",                                                                            ["HTML","CSS","JS"],       "game"],
    ["Day 82",  "Love Calculator",                     "./public/Love-Calculator/index.html",                                                                            ["HTML","CSS","JS"],       "game"],
    ["Day 83",  "Exchange Currency",                   "./public/Exchange_Currency/index.html",                                                                          ["JS","API"],              "api"],
    ["Day 84",  "Lights Out Puzzle",                   "./public/Lights_Out_Puzzle/index.html",                                                                          ["HTML","CSS","JS"],       "game"],
    ["Day 85",  "Image Search Engine",                 "./public/Image Search Engine/index.html",                                                                        ["JS","Unsplash API"],     "api"],
    ["Day 86",  "3D Profile Card",                     "./public/3d profile Card/index.html",                                                                            ["CSS","JS"],              "ui"],
    ["Day 87",  "Breakout Game",                       "./public/Breakout game/index.html",                                                                              ["Canvas","JS"],           "game"],
    ["Day 88",  "Job Dashboard",                       "./public/Job dashboard/jobs.html",                                                                               ["HTML","CSS","JS"],       "ui"],
    ["Day 89",  "N-Queens Solver",                     "./public/N_Queen/index.html",                                                                                    ["HTML","CSS","JS"],       "tool"],
    ["Day 90",  "Quiz App with Timer",                 "./public/QuizeApp Timer/index1.html",                                                                            ["HTML","CSS","JS"],       "tool"],
    ["Day 91",  "Voting App Backend",                  "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Voting_Application_Backend",         ["Node","MongoDB"],        "tool"],
    ["Day 92",  "Slide Puzzle Game",                   "./public/Slide puzzle Game/index.html",                                                                          ["HTML","CSS","JS"],       "game"],
    ["Day 93",  "TextUtils — React",                   "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Textutils",                          ["React"],                 "tool"],
    ["Day 94",  "Hangman Game",                        "./public/HangmanGame/index.html",                                                                                ["HTML","CSS","JS"],       "game"],
    ["Day 95",  "TodoList — React TS",                 "./public/TodoList-React-TS-Tailwind/index.html",                                                                 ["React","TypeScript"],    "tool"],
    ["Day 96",  "HCL Color Generator",                 "./public/HCL Color Generator/index.html",                                                                        ["HTML","CSS","JS"],       "tool"],
    ["Day 97",  "Time Capsule",                        "./public/Time-Capsule/index.html",                                                                               ["HTML","CSS","JS"],       "tool"],
    ["Day 98",  "Virtual Piano",                       "./public/Virtual Piano/index.html",                                                                              ["JS","Web Audio"],        "ui"],
    ["Day 99",  "NASA APOD Extension",                 "./public/NASA-APOD/popup.html",                                                                                   ["JS","NASA API"],         "api"],
    ["Day 100", "Text Saver Extension",                "./public/Text_Saver_Ext/popup.html",                                                                             ["JS","Chrome API"],       "tool"],
    ["Day 101", "Personal Finance Tracker",            "./public/FinanceTracker/index.html",                                                                             ["HTML","CSS","JS"],       "tool"],
    ["Day 102", "Travel Booking Website",              "./public/Travel_booking_website/index.html",                                                                     ["HTML","CSS","JS"],       "ui"],
    ["Day 103", "Drumkit Game",                        "./public/Drumkit_Game/index.html",                                                                               ["JS","Web Audio"],        "ui"],
    ["Day 104", "Debug Website",                       "./public/Debug-Website/index.html",                                                                              ["HTML","CSS","JS"],       "tool"],
    ["Day 105", "Periodic Table",                      "./public/Periodic Table/index.html",                                                                             ["HTML","CSS","JS"],       "ui"],
    ["Day 106", "Plants Website",                      "./public/Plants Website/index.html",                                                                             ["HTML","CSS","JS"],       "ui"],
    ["Day 107", "DocNow",                              "./public/DocNow/index.html",                                                                                     ["HTML","CSS","JS"],       "tool"],
    ["Day 108", "Expense Tracker",                     "./public/expense_Tracker/index.html",                                                                            ["HTML","CSS","JS"],       "tool"],
    ["Day 109", "Mood Tracker",                        "./public/Mood Tracker/index.html",                                                                               ["HTML","CSS","JS"],       "tool"],
    ["Day 110", "CryptoShow",                          "./public/CRYPTOSHOW/index.html",                                                                                 ["JS","Crypto API"],       "api"],
    ["Day 111", "Whack-a-Mole Game",                   "./public/Whack-a-Mole Game/index.html",                                                                          ["HTML","CSS","JS"],       "game"],
    ["Day 112", "Nykaa Clone",                         "./public/Nykaa-clone/index.html",                                                                                ["HTML","CSS"],            "clone"],
    ["Day 113", "CPU Scheduler",                       "./public/CpuScheduler/index.html",                                                                               ["HTML","CSS","JS"],       "tool"],
    ["Day 114", "EchoNotes",                           "./public/EchoNotes/index.html",                                                                                  ["JS","SpeechAPI"],        "tool"],
    ["Day 115", "Event Registration System",           "https://event-registration-system-w10a.onrender.com/",                                                           ["Node","Express"],        "tool"],
    ["Day 116", "AI Image Classifier",                 "./public/AI Image Classifier/index.html",                                                                        ["HTML","CSS","JS","AI"], "tool"],
];

const CATEGORY_LABEL = {
    game:  "Game",
    clone: "Clone",
    tool:  "Tool",
    ui:    "UI",
    api:   "API",
};

/* ============================================================
   GITHUB STATS
   ============================================================ */
async function fetchRepoStats() {
    try {
        const [repoRes, prRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}`),
            fetch(`https://api.github.com/search/issues?q=repo:${window.REPO_OWNER}/${window.REPO_NAME}+type:pr+state:open`)
        ]);
        if (!repoRes.ok || !prRes.ok) throw new Error("Stats fetch failed");
        const repo = await repoRes.json();
        const prs  = await prRes.json();

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = Number(val).toLocaleString();
        };
        set('starCount',  repo.stargazers_count);
        set('forkCount',  repo.forks_count);
        set('issueCount', repo.open_issues_count - prs.total_count);
        set('prCount',    prs.total_count);
    } catch (e) {
        console.warn("GitHub stats unavailable:", e.message);
    }
}

// NOTE (difficulty): Generating content client-side must sanitize URLs and
// avoid heavy sync work; large project lists may block the main thread.

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

// ── Theme Toggle ────────────────────────────────────────────────────────────
// FIX: Centralised toggle logic used by both the initial button and the
//      button that updateNavbar() recreates inside .buttons innerHTML.
//      Previously, the listener attached at the top of the file was lost
//      as soon as updateNavbar() replaced the button with innerHTML, and
//      window.theme was used for persistence (resets on every page load).
//      Now localStorage is used so the preference survives refresh.

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    // Sync every theme-toggle icon on the page
    document.querySelectorAll('#themeToggle i').forEach(icon => {
        icon.classList.toggle('fa-sun', theme === 'light');
        icon.classList.toggle('fa-moon', theme !== 'light');
    });
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-mode');
    applyTheme(isLight ? 'dark' : 'light');
}

// Update Navbar for Login Status
const buttons = document.getElementsByClassName('buttons')[0];

function updateNavbar() {
    if (!buttons) return;
    const username = window.username || null;
    const isRoot = !window.location.pathname.includes('/contributors/');
    const basePath = isRoot ? '' : '../';

    // FIX: Read current theme from body class so the icon is always correct
    //      even before the user has toggled anything.
    const isLight = document.body.classList.contains('light-mode');
    const themeButton = `
        <button id="themeToggle" class="button" title="Toggle Theme">
            <i class="fas ${isLight ? 'fa-sun' : 'fa-moon'}"></i>
        </button>
    `;

    if (username) {
        buttons.innerHTML = `
        <span class="welcome-text">Welcome, ${username}</span>
        <button class="button logout-btn" id='logout'>Logout</button>
        <a class="button" href="https://github.com/dhairyagothi" target="_blank">GitHub</a>
        <a class="button" href="${basePath}contributors/contributor.html">Contributors</a>
        ${themeButton}`;

        document.getElementById('logout').addEventListener('click', () => {
            window.username = null;
            updateNavbar();
        });
    } else {
        document.body.classList.remove('light-mode');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // FIX: Re-attach listener to the newly created button after innerHTML swap
    const newThemeToggle = document.getElementById('themeToggle');
    if (newThemeToggle) {
        newThemeToggle.addEventListener('click', toggleTheme);
    }
}

let currentPage = 1;
const itemsPerPage = 10;
let projectData = [];

// Populate the table with project data
function fillTable() {
    // FIX: Removed stray merge-conflict text "feature/pagination-project-list"
    //      after Day 113 entry, and collapsed the duplicate / orphaned Day 114
    //      entries and the extra closing ]]; that broke the array literal,
    //      causing a syntax error that prevented the entire script from running.
    projectData = [
        ["Day 1", "To-Do List", "./public/TO_DO_LIST/todolist.html"],
        ["Day 2", "Digital Clock", "./public/digital_clock/digitalclock.html"],
        ["Day 3", "Indian Flag", "./public/indianflag/flag.html"],
        ["Day 4", "Dropdown Nav Bar", "./public/dropdown_navbar/index.html"],
        ["Day 5", "Animated Cursor", "./public/Animated-cursor/animated-cursor.html"],
        ["Day 6", "Auto Background Image Slider", "./public/Background-Image-sider/slider.html"],
        ["Day 7", "Typewriter", "./public/typewriter/typewriter.html"],
        ["Day 8", "Parallel-X Website", "./public/Parallel-x%20website/parallal.html"],
        ["Day 9", "Captcha Generator", "./public/captcha/captcha.html"],
        ["Day 10", "QR Code Generator", "./public/qr%20generator/qr.html"],
        ["Day 11", "Serve Website Using Express", "./public/index.html"],
        ["Day 12", "Nodemailer Contact Form", "./public/gmail_nodemailer/public/mail.html"],
        ["Day 13", "Login Form Using MERN", "github.com"],
        ["Day 14", "File Uploader", "github.com"],
        ["Day 15", "Progress Bar", "./public/progress_bar/progress_bar.html"],
        ["Day 16", "Scroll Bar CSS", "./public/index.html"],
        ["Day 17", "Slider Using Swiper API", "./public/slider%20box/index.html"],
        ["Day 18", "Carousel Solar System", "./public/carousal/index.html"],
        ["Day 19", "Planto", "./public/plantwebsite/plant.html"],
        ["Day 20", "EveSparks", "https://evesparks.onrender.com/"],
        ["Day 21", "Video BG Slider Using React", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/travel_website"],
        ["Day 22", "Page Loader", "./public/pageloader/pageloader.html"],
        ["Day 23", "Jarvis Virtual Assistant", "./public/Jarvis-AI-main/index.html"],
        ["Day 24", "Chat Bot", "./public/AI%20ChatBot/chatbot.html"],
        ["Day 25", "Tic-Tac-Toe", "./public/TicTacToe/index.html"],
        ["Day 26", "Maze Game", "./public/Maze-Game-main/index.html"],
        ["Day 27", "Memory Game", "./public/MemoryGame/index.html"],
        ["Day 28", "Wordle", "./public/WORDLE/index.html"],
        ["Day 29", "Snake Game", "./public/snake_game/index.html"],
        ["Day 30", "Flappy-bird-game", "./public/Flappy-bird-main/index.html"],
        ["Day 31", "Password Manager", "./public/password%20manager/index.html"],
        ["DAY-32", "Missionaries & Cannibals", "./public/Missionaries&Cannibals/index.html"],
        ["Day 33", "Weather Forcasting", "./public/Weather%20Forcasting/index.html"],
        ["Day 34", "Email Validator", "./public/email%20validator/index.html"],
        ["Day 35", "Vanilla-JavaScript-Calculator", "./public/Vanilla-JavaScript-Calculator-master/index.html"],
        ["Day 36", "Medical App", "./public/Medical_App/index.html"],
        ["Day 37", "2048 Game", "./public/2048_game/index.html"],
        ["Day 38", "Github Profile Finder", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/github_profile_finder"],
        ["Day 39", "Notes App", "./public/notes-app/index.html"],
        ["Day 40", "Analog Clock", "./public/AnalogClock/index.html"],
        ["Day 41", "Scroll Dark Game", "./public/Scroll%20Game%20Dark%20Run/index.html"],
        ["Day 42", "Amazon App", "./public/Amazon_Clone/index.html"],
        ["Day 43", "Password Generator", "./public/Password_Generator/index.html"],
        ["Day 44", "BMI Calculator", "./public/BMI_Calculator/index.html"],
        ["Day 45", "Black Jack", "./public/BlackJack/blackJ.html"],
        ["Day 46", "Palindrome Generator", "./public/Palindrome_Generator/index.html"],
        ["Day 47", "Ping Pong Game", "./public/ping/index.html"],
        ["Day 48", "TextToVoiceConverter", "./public/TextToVoiceConverter/index.html"],
        ["Day 49", "Url Shortener", "https://github.com/chandankoranga02/100_days_100_web_project/tree/Main/public/url_shortener"],
        ["Day 50", "Recipe Genie", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Recipe-Genie"],
        ["Day 51", "Netflix Landing Page Clone", "./public/Netflix_Cloning/Index.html"],
        ["Day 52", "ClimaCode", "./public/ClimaCode%202.0/index.html"],
        ["Day 53", "E-Commerce Website with Simple Cart Functionality", "./public/e-commerce_cart/index.html"],
        ["Day 54", "Budget Tracker", "./public/Budget%20Tracker/index.html"],
        ["Day 55", "Cricket Game", "./public/cricket/index.html"],
        ["Day 56", "Pastebin using svelte", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/pastebin"],
        ["Day 57", "Glowing Social Media Icons", "./public/Social%20Media%20Glowing/index.html"],
        ["Day 58", "Music App", "./public/Music%20App/index.html"],
        ["Day 59", "Blog Page", "./public/Blog%20Page/index.html"],
        ["Day 60", "Marketing template website", "./public/marketing_website/index.html"],
        ["Day 61", "Hologram Button", "./public/Holo%20Button/index.html"],
        ["Day 62", "Solar System Explorer", "./public/Solar%20System%20Explorer%20in%20CSS%20only%20haml/template.html"],
        ["Day 63", "Image to Text App", "./public/Image-To-Text-App/index.html"],
        ["Day 64", "Zomato-clone", "./public/zomato-clone/zomato.html"],
        ["Day 65", "The Cube", "./public/The%20Cube/index.html"],
        ["Day 66", "Flask Authentication App", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/flask_auth_app"],
        ["Day 67", "Blog-Website", "./public/blog/main.html"],
        ["Day 68", "3d Rotating Card", "./public/3d%20cards/index.html"],
        ["Day 69", "Spotify Clone Project", "./public/spotify-clone%20-project/index.html"],
        ["Day 70", "Insect-Catch_Game", "./public/Insect-Catch-Game/index.html"],
        ["Day 71", "Quotely Laughs", "./public/Quotely-Laughs/index.html"],
        ["Day 72", "Contact Book", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Contact%20Book"],
        ["Day 73", "Candy_Crush_Game", "./public/Candy_Crush_Game/index.html"],
        ["Day 74", "Stock Profit Calculator", "./public/Stock-Profit-Calculator/index.html"],
        ["Day 75", "code-space-game project", "./public/code-jump-space-game/index.html"],
        ["Day 76", "Animated Searchbar", "./public/Animated%20Searchbar/index.html"],
        ["Day 77", "Rock-Paper-Scissor-game project", "./public/Stone-Paper-Scissor/index.html"],
        ["Day 78", "NPM Package Search", "./public/NPM%20Package%20Search/index.html"],
        ["Day 79", "Linkedin Homepage Clone", "./public/Linkedin-Clone/index.html"],
        ["Day 80", "Resume Studio", "./public/ResumeStudio/index.html"],
        ["Day 81", "Simon Says Game", "./public/Simon_Says_Game/index.html"],
        ["Day 82", "Love Calculator Game", "./public/Love-Calculator/index.html"],
        ["Day 83", "Exchange Currency", "./public/Exchange_Currency/index.html"],
        ["Day 84", "Lights Out Puzzle", "./public/Lights_Out_Puzzle/index.html"],
        ["Day 85", "Image Search Engine", "./public/Image Search Engine/index.html"],
        ["Day 86", "Profile Card", "./public/3d profile Card/index.html"],
        ["Day 87", "Breakout game", "./public/Breakout game/index.html"],
        ["Day 88", "Job dashboard", "./public/Job dashboard/jobs.html"],
        ["Day 89", "N-Queen", "./public/N_Queen/index.html"],
        ["Day 90", "Quize App Timer", "./public/QuizeApp Timer/index1.html"],
        ["Day 91", "Voting Application Backend", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Voting_Application_Backend"],
        ["Day 92", "Slide puzzle Game", "./public/Slide puzzle Game/index.html"],
        ["Day 93", "TextUtils", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Textutils"],
        ["Day 94", "Hangman Game", "./public/HangmanGame/index.html"],
        ["Day 95", "TodoList in React TS Tailwind", "./public/TodoList-React-TS-Tailwind/index.html"],
        ["Day 96", "HCL Color Generator", "./public/HCL Color Generator/index.html"],
        ["Day 97", "Time Capsule", "./public/Time-Capsule/index.html"],
        ["Day 98", "Virtual Piano", "./public/Virtual Piano/index.html"],
        ["Day 99", "NASA-APOD Extension", "./public/NASA-APOD/popup.html"],
        ["Day 100", "Text Saver Extension", "./public/Text_Saver_Ext/popup.html"],
        ["Day 101", "Personal Finance Tracker", "./public/FinanceTracker/index.html"],
        ["Day 102", "Travel Booking Website", "./public/Travel_booking_website/index.html"],
        ["Day 103", "Drumkit Game", "./public/Drumkit_Game/index.html"],
        ["Day 104", "Debug-Website", "./public/Debug-Website/index.html"],
        ["Day 105", "Periodic Table", "./public/Periodic Table/index.html"],
        ["Day 106", "Plants Website", "./public/Plants Website/index.html"],
        ["Day 107", "DocNow", "./public/DocNow/index.html"],
        ["Day 108", "expense_Tracker", "./public/expense_Tracker/index.html"],
        ["Day 109", "Mood Tracker", "./public/Mood Tracker/index.html"],
        ["Day 110", "CRYPTOSHOW", "./public/CRYPTOSHOW/index.html"],
        ["Day 111", "Whack-a-Mole Game", "./public/Whack-a-Mole Game/index.html"],
        ["Day 112", "Nykaa Clone Website", "./public/Nykaa-clone/index.html"],
        ["Day 113", "CPU Scheduler", "./public/CpuScheduler/index.html"],
        ["Day 114", "EchoNotes", "./public/EchoNotes/index.html"],
        ["Day 115", "Event Registration System", "https://event-registration-system-w10a.onrender.com/"],
        ["Day 116", "AI Image Classifier", "./public/AI Image Classifier/index.html"]
    ];

    renderTable();
    createPagination();
}

function renderTable() {
    const tbody = document.getElementById('tableBody');

    tbody.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedData = projectData.slice(startIndex, endIndex);

    paginatedData.forEach(e => {
        const row = document.createElement('tr');

        const days = document.createElement('td');
        const nameP = document.createElement('td');
        const link = document.createElement('td');
        const a = document.createElement('a');

        days.innerText = e[0];
        nameP.innerText = e[1];

        a.href = e[2].trim();
        a.innerHTML = 'View Demo <i class="fas fa-external-link-alt"></i>';
        a.target = '_blank';

        nameP.classList.add('project-name');

        link.appendChild(a);

        row.appendChild(days);
        row.appendChild(nameP);
        row.appendChild(link);

        tbody.appendChild(row);
    });
}

function createPagination() {
    const paginationContainer = document.getElementById('pagination');

    // Toggle "No Projects Found" visibility
    if (filteredData.length === 0) {
        if (noProjectsMessage) noProjectsMessage.style.display = "block";
        return;
    } else {
        if (noProjects) noProjects.style.display = 'none';
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
    const isDark   = !document.body.classList.contains('light-mode');

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
        icon.className = 'fas fa-sun';
    }

    btn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}
let currentPage = 1;
const itemsPerPage = 10;
let projectData = [];

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
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // FIX: Apply saved theme from localStorage BEFORE updateNavbar() builds
    //      the button, so the icon is rendered correctly on first load.
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    initCanvas();
    updateNavbar();
    if (document.getElementById('tableBody')) fillTable();
    if (document.getElementById('starCount')) fetchRepoStats();
});
