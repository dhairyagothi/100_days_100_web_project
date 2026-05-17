/**
 * 100 Days 100 Web Projects — Main Script
 * Clean, modular implementation with design system integration.
 */

// ── Project Data ──────────────────────────────────────────────────────────
const projectData = [
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
    ["Day 13", "Login Form Using MERN", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/loginusingmern"],
    ["Day 14", "File Uploader", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/file_uploader"],
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
    ["Day 30", "Flappy Bird Game", "./public/Flappy-bird-main/index.html"],
    ["Day 31", "Password Manager", "./public/password%20manager/index.html"],
    ["Day 32", "Missionaries & Cannibals", "./public/Missionaries&Cannibals/index.html"],
    ["Day 33", "Weather Forecasting", "./public/Weather%20Forcasting/index.html"],
    ["Day 34", "Email Validator", "./public/email%20validator/index.html"],
    ["Day 35", "JavaScript Calculator", "./public/Vanilla-JavaScript-Calculator-master/index.html"],
    ["Day 36", "Medical App", "./public/Medical_App/index.html"],
    ["Day 37", "2048 Game", "./public/2048_game/index.html"],
    ["Day 38", "GitHub Profile Finder", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/github_profile_finder"],
    ["Day 39", "Notes App", "./public/notes-app/index.html"],
    ["Day 40", "Analog Clock", "./public/AnalogClock/index.html"],
    ["Day 41", "Scroll Dark Game", "./public/Scroll%20Game%20Dark%20Run/index.html"],
    ["Day 42", "Amazon Clone", "./public/Amazon_Clone/index.html"],
    ["Day 43", "Password Generator", "./public/Password_Generator/index.html"],
    ["Day 44", "BMI Calculator", "./public/BMI_Calculator/index.html"],
    ["Day 45", "Black Jack", "./public/BlackJack/blackJ.html"],
    ["Day 46", "Palindrome Generator", "./public/Palindrome_Generator/index.html"],
    ["Day 47", "Ping Pong Game", "./public/ping/index.html"],
    ["Day 48", "Text to Voice Converter", "./public/TextToVoiceConverter/index.html"],
    ["Day 49", "URL Shortener", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/url_shortener"],
    ["Day 50", "Recipe Genie", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Recipe-Genie"],
    ["Day 51", "Netflix Landing Page Clone", "./public/Netflix_Cloning/Index.html"],
    ["Day 52", "ClimaCode", "./public/ClimaCode%202.0/index.html"],
    ["Day 53", "E-Commerce Cart", "./public/e-commerce_cart/index.html"],
    ["Day 54", "Budget Tracker", "./public/Budget%20Tracker/index.html"],
    ["Day 55", "Cricket Game", "./public/cricket/index.html"],
    ["Day 56", "Pastebin (Svelte)", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/pastebin"],
    ["Day 57", "Glowing Social Media Icons", "./public/Social%20Media%20Glowing/index.html"],
    ["Day 58", "Music App", "./public/Music%20App/index.html"],
    ["Day 59", "Blog Page", "./public/Blog%20Page/index.html"],
    ["Day 60", "Marketing Website", "./public/marketing_website/index.html"],
    ["Day 61", "Hologram Button", "./public/Holo%20Button/index.html"],
    ["Day 62", "Solar System Explorer", "./public/Solar%20System%20Explorer%20in%20CSS%20only%20haml/template.html"],
    ["Day 63", "Image to Text App", "./public/Image-To-Text-App/index.html"],
    ["Day 64", "Zomato Clone", "./public/zomato-clone/zomato.html"],
    ["Day 65", "The Cube", "./public/The%20Cube/index.html"],
    ["Day 66", "Flask Auth App", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/flask_auth_app"],
    ["Day 67", "Blog Website", "./public/blog/main.html"],
    ["Day 68", "3D Rotating Card", "./public/3d%20cards/index.html"],
    ["Day 69", "Spotify Clone", "./public/spotify-clone%20-project/index.html"],
    ["Day 70", "Insect Catch Game", "./public/Insect-Catch-Game/index.html"],
    ["Day 71", "Quotely Laughs", "./public/Quotely-Laughs/index.html"],
    ["Day 72", "Contact Book", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Contact%20Book"],
    ["Day 73", "Candy Crush Game", "./public/Candy_Crush_Game/index.html"],
    ["Day 74", "Stock Profit Calculator", "./public/Stock-Profit-Calculator/index.html"],
    ["Day 75", "Code Space Game", "./public/code-jump-space-game/index.html"],
    ["Day 76", "Animated Searchbar", "./public/Animated%20Searchbar/index.html"],
    ["Day 77", "Rock Paper Scissors", "./public/Stone-Paper-Scissor/index.html"],
    ["Day 78", "NPM Package Search", "./public/NPM%20Package%20Search/index.html"],
    ["Day 79", "LinkedIn Clone", "./public/Linkedin-Clone/index.html"],
    ["Day 80", "Resume Studio", "./public/ResumeStudio/index.html"],
    ["Day 81", "Simon Says Game", "./public/Simon_Says_Game/index.html"],
    ["Day 82", "Love Calculator", "./public/Love-Calculator/index.html"],
    ["Day 83", "Exchange Currency", "./public/Exchange_Currency/index.html"],
    ["Day 84", "Lights Out Puzzle", "./public/Lights_Out_Puzzle/index.html"],
    ["Day 85", "Image Search Engine", "./public/Image%20Search%20Engine/index.html"],
    ["Day 86", "3D Profile Card", "./public/3d%20profile%20Card/index.html"],
    ["Day 87", "Breakout Game", "./public/Breakout%20game/index.html"],
    ["Day 88", "Job Dashboard", "./public/Job%20dashboard/jobs.html"],
    ["Day 89", "N-Queen Solver", "./public/N_Queen/index.html"],
    ["Day 90", "Quiz App with Timer", "./public/QuizeApp%20Timer/index1.html"],
    ["Day 91", "Voting Application", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Voting_Application_Backend"],
    ["Day 92", "Slide Puzzle Game", "./public/Slide%20puzzle%20Game/index.html"],
    ["Day 93", "TextUtils", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Textutils"],
    ["Day 94", "Hangman Game", "./public/HangmanGame/index.html"],
    ["Day 95", "TodoList (React + TS)", "./public/TodoList-React-TS-Tailwind/index.html"],
    ["Day 96", "HCL Color Generator", "./public/HCL%20Color%20Generator/index.html"],
    ["Day 97", "Time Capsule", "./public/Time-Capsule/index.html"],
    ["Day 98", "Virtual Piano", "./public/Virtual%20Piano/index.html"],
    ["Day 99", "NASA APOD Extension", "./public/NASA-APOD/popup.html"],
    ["Day 100", "Text Saver Extension", "./public/Text_Saver_Ext/popup.html"],
    ["Day 101", "Personal Finance Tracker", "./public/FinanceTracker/index.html"],
    ["Day 102", "Travel Booking Website", "./public/Travel_booking_website/index.html"],
    ["Day 103", "Drumkit Game", "./public/Drumkit_Game/index.html"],
    ["Day 104", "Debug Website", "./public/Debug-Website/index.html"],
    ["Day 105", "Periodic Table", "./public/Periodic%20Table/index.html"],
    ["Day 106", "Plants Website", "./public/Plants%20Website/index.html"],
    ["Day 107", "DocNow", "./public/DocNow/index.html"],
    ["Day 108", "Expense Tracker", "./public/expense_Tracker/index.html"],
    ["Day 109", "Mood Tracker", "./public/Mood%20Tracker/index.html"],
    ["Day 110", "CryptoShow", "./public/CRYPTOSHOW/index.html"],
    ["Day 111", "Whack-a-Mole Game", "./public/Whack-a-Mole%20Game/index.html"],
    ["Day 112", "Nykaa Clone", "./public/Nykaa-clone/index.html"],
    ["Day 113", "CPU Scheduler", "./public/CpuScheduler/index.html"],
    ["Day 114", "EchoNotes", "./public/EchoNotes/index.html"],
];

// ── DOM Elements ──────────────────────────────────────────────────────────
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const noProjects = document.getElementById('no-projects');
const scrollBtn = document.getElementById('scrollBtn');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const resultsCount = document.getElementById('resultsCount');

// ── Theme Management ──────────────────────────────────────────────────────
function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;

    document.body.classList.toggle('dark-mode', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    themeIcon.classList.remove('fa-moon', 'fa-sun');
    themeIcon.classList.add(isDark ? 'fa-moon' : 'fa-sun');
}

themeToggle.addEventListener('click', toggleTheme);

// ── Table Population ──────────────────────────────────────────────────────
function fillTable() {
    const fragment = document.createDocumentFragment();

    projectData.forEach(([day, name, link]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${day}</td>
            <td class="project-name">${name}</td>
            <td>
                <a href="${link.trim()}" target="_blank" rel="noopener">
                    View <i class="fas fa-arrow-up-right-from-square"></i>
                </a>
            </td>
        `;
        fragment.appendChild(row);
    });

    tableBody.appendChild(fragment);
    updateResultsCount(projectData.length);
}
// ── Search / Filter ───────────────────────────────────────────────────────
function filterProjects() {
    const query = searchInput.value.toLowerCase().trim();
    const rows = tableBody.querySelectorAll('tr');
    let visible = 0;

    rows.forEach(row => {
        const name = row.querySelector('.project-name')?.textContent.toLowerCase() || '';
        const match = name.includes(query);
        row.style.display = match ? '' : 'none';
        if (match) visible++;
    });

    noProjects.style.display = visible === 0 ? 'block' : 'none';
    updateResultsCount(visible);
}

function updateResultsCount(count) {
    resultsCount.textContent = `${count} project${count !== 1 ? 's' : ''}`;
}

searchInput.addEventListener('input', filterProjects);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') filterProjects();
});

// ── Scroll to Top ─────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Initialize ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    fillTable();
});

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
    initTheme();
    updateNavbar();
    initFilterChips();
    initSearch();
    syncProjectCounts();
    renderGrid();
    fetchRepoStats();
    initScrollBtn();
});
