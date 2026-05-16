﻿/**
 * 100 Days 100 Web Projects - Main Script
 * Author: Dhairya Gothi & Sweksha Kakkar (Issue #1209)
 * Goal: Implemented Technology & Category Filters with Multi-select logic
 */

// ============================================
// 1. GLOBAL CONFIG & STATE
// ============================================
if (typeof REPO_OWNER === 'undefined') {
    window.REPO_OWNER = "dhairyagothi";
    window.REPO_NAME  = "100_days_100_web_project";
}

let currentPage = 1;
const itemsPerPage = 10;
let projectData = []; 
let filteredData = []; 
let currentCategory = 'all';
let currentDifficulty = 'all';

// ============================================
// 2. GITHUB REPO STATS
// ============================================
async function fetchRepoStats() {
    try {
        const [repoRes, prRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${window.REPO_OWNER}/${window.REPO_NAME}`),
            fetch(`https://api.github.com/search/issues?q=repo:${window.REPO_OWNER}/${window.REPO_NAME}+type:pr+state:open`)
        ]);
        if (!repoRes.ok || !prRes.ok) return;
        const repoData = await repoRes.json();
        const prData = await prRes.json();

        const starEl = document.getElementById('starCount');
        const forkEl = document.getElementById('forkCount');
        const issueEl = document.getElementById('issueCount');
        const prEl = document.getElementById('prCount');

        if (starEl) starEl.textContent = repoData.stargazers_count.toLocaleString();
        if (forkEl) forkEl.textContent = repoData.forks_count.toLocaleString();
        if (issueEl) issueEl.textContent = (repoData.open_issues_count - prData.total_count).toLocaleString();
        if (prEl) prEl.textContent = prData.total_count.toLocaleString();
    } catch (error) { console.error("Stats fetch error:", error); }
}

// ============================================
// 3. BACKGROUND CANVAS ANIMATION
// ============================================
function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            const isDark = !document.body.classList.contains('light-mode');
            ctx.fillStyle = `rgba(26, 188, 156, ${isDark ? 0.4 : 0.2})`;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        }
    }
    for (let i = 0; i < 80; i++) particles.push(new Particle());
    function animate() {
        const isDark = !document.body.classList.contains('light-mode');
        ctx.fillStyle = isDark ? 'rgba(10, 10, 10, 0.1)' : 'rgba(245, 245, 245, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

// ============================================
// 4. PROJECT DATA (5 ELEMENTS FORMAT)
// ============================================
function fillTable() {
    projectData = [
        ["Day 1", "To-Do List", "./public/TO_DO_LIST/todolist.html", "javascript todo", "beginner"],
        ["Day 2", "Digital Clock", "./public/digital_clock/digitalclock.html", "javascript", "beginner"],
        ["Day 3", "Indian Flag", "./public/indianflag/flag.html", "css", "beginner"],
        ["Day 4", "Dropdown Nav Bar", "./public/dropdown_navbar/index.html", "css", "beginner"],
        ["Day 5", "Animated Cursor", "./public/Animated-cursor/animated-cursor.html", "javascript css", "beginner"],
        ["Day 6", "Auto Background Image Slider", "./public/Background-Image-sider/slider.html", "javascript", "beginner"],
        ["Day 7", "Typewriter", "./public/typewriter/typewriter.html", "javascript", "beginner"],
        ["Day 8", "Parallel-X Website", "./public/Parallel-x%20website/parallal.html", "css", "intermediate"],
        ["Day 9", "Captcha Generator", "./public/captcha/captcha.html", "javascript", "intermediate"],
        ["Day 10", "QR Code Generator", "./public/qr%20generator/qr.html", "api javascript", "intermediate"],
        ["Day 11", "Serve Website Using Express", "./public/index.html", "javascript", "intermediate"],
        ["Day 12", "Nodemailer Contact Form", "./public/gmail_nodemailer/public/mail.html", "api javascript", "intermediate"],
        ["Day 13", "Login Form Using MERN", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/loginusingmern", "api javascript", "intermediate"],
        ["Day 14", "File Uploader", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/file_uploader", "javascript", "intermediate"],
        ["Day 15", "Progress Bar", "./public/progress_bar/progress_bar.html", "css javascript", "beginner"],
        ["Day 16", "Scroll Bar CSS", "./public/index.html", "css", "beginner"],
        ["Day 17", "Slider Using Swiper API", "./public/slider%20box/index.html", "api javascript", "intermediate"],
        ["Day 18", "Carousel Solar System", "./public/carousal/index.html", "css canvas", "intermediate"],
        ["Day 19", "Planto", "./public/plantwebsite/plant.html", "css", "beginner"],
        ["Day 20", "EveSparks", "https://evesparks.onrender.com/", "javascript", "intermediate"],
        ["Day 21", "Video BG Slider Using React", "https://github.com/dhairyagothi/...", "javascript", "intermediate"],
        ["Day 22", "Page Loader", "./public/pageloader/pageloader.html", "css", "beginner"],
        ["Day 23", "Jarvis Virtual Assistant", "./public/Jarvis-AI-main/index.html", "api javascript", "intermediate"],
        ["Day 24", "Chat Bot", "./public/AI%20ChatBot/chatbot.html", "api javascript", "intermediate"],
        ["Day 25", "Tic-Tac-Toe", "./public/TicTacToe/index.html", "game javascript", "beginner"],
        ["Day 26", "Maze Game", "./public/Maze-Game-main/index.html", "game javascript", "intermediate"],
        ["Day 27", "Memory Game", "./public/MemoryGame/index.html", "game javascript", "beginner"],
        ["Day 28", "Wordle", "./public/WORDLE/index.html", "game javascript", "intermediate"],
        ["Day 29", "Snake Game", "./public/snake_game/index.html", "game javascript", "beginner"],
        ["Day 30", "Flappy-bird-game", "./public/Flappy-bird-main/index.html", "game canvas", "intermediate"],
        ["Day 31", "Password Manager", "./public/password%20manager/index.html", "javascript", "intermediate"],
        ["Day 32", "Missionaries & Cannibals", "./public/Missionaries&Cannibals/index.html", "game javascript", "intermediate"],
        ["Day 33", "Weather Forcasting", "./public/Weather%20Forcasting/index.html", "weather api", "intermediate"],
        ["Day 34", "Email Validator", "./public/email_validator/index.html", "api javascript", "beginner"],
        ["Day 35", "Vanilla-JS-Calculator", "./public/Vanilla-JavaScript-Calculator-master/index.html", "javascript", "beginner"],
        ["Day 36", "Medical App", "./public/Medical_App/index.html", "javascript", "intermediate"],
        ["Day 37", "2048 Game", "./public/2048_game/index.html", "game javascript", "intermediate"],
        ["Day 38", "Github Profile Finder", "https://github.com/dhairyagothi/...", "api javascript", "intermediate"],
        ["Day 39", "Notes App", "./public/notes-app/index.html", "todo javascript", "beginner"],
        ["Day 40", "Analog Clock", "./public/AnalogClock/index.html", "javascript css", "beginner"],
        ["Day 41", "Scroll Dark Game", "./public/Scroll%20Game%20Dark%20Run/index.html", "game canvas", "intermediate"],
        ["Day 42", "Amazon App", "./public/Amazon_Clone/index.html", "javascript", "intermediate"],
        ["Day 43", "Password Generator", "./public/Password_Generator/index.html", "javascript", "beginner"],
        ["Day 44", "BMI Calculator", "./public/BMI_Calculator/index.html", "javascript", "beginner"],
        ["Day 45", "Black Jack", "./public/BlackJack/blackJ.html", "game javascript", "intermediate"],
        ["Day 46", "Palindrome Generator", "./public/Palindrome_Generator/index.html", "javascript", "beginner"],
        ["Day 47", "Ping Pong Game", "./public/ping/index.html", "game canvas", "intermediate"],
        ["Day 48", "TextToVoiceConverter", "./public/TextToVoiceConverter/index.html", "api javascript", "intermediate"],
        ["Day 49", "Url Shortener", "https://github.com/...", "api javascript", "intermediate"],
        ["Day 50", "Recipe Genie", "https://github.com/dhairyagothi/...", "api javascript", "intermediate"],
        ["Day 51", "Netflix Landing Page", "./public/Netflix_Cloning/Index.html", "css", "beginner"],
        ["Day 52", "ClimaCode", "./public/ClimaCode%202.0/index.html", "weather api", "intermediate"],
        ["Day 53", "E-Commerce Website", "./public/e-commerce_cart/index.html", "javascript", "intermediate"],
        ["Day 54", "Budget Tracker", "./public/Budget%20Tracker/index.html", "todo javascript", "intermediate"],
        ["Day 55", "Cricket Game", "./public/cricket/index.html", "game javascript", "intermediate"],
        ["Day 56", "Pastebin using svelte", "https://github.com/...", "javascript", "intermediate"],
        ["Day 57", "Glowing Social Media Icons", "./public/Social%20Media%20Glowing/index.html", "css", "beginner"],
        ["Day 58", "Music App", "./public/Music%20App/index.html", "api javascript", "intermediate"],
        ["Day 59", "Blog Page", "./public/Blog%20Page/index.html", "css", "beginner"],
        ["Day 60", "Marketing template", "./public/marketing_website/index.html", "css", "beginner"],
        ["Day 61", "Hologram Button", "./public/Holo%20Button/index.html", "css", "beginner"],
        ["Day 62", "Solar System CSS", "./public/Solar%20System%20Explorer.../template.html", "css", "intermediate"],
        ["Day 63", "Image to Text App", "./public/Image-To-Text-App/index.html", "api javascript", "intermediate"],
        ["Day 64", "Zomato-clone", "./public/zomato-clone/zomato.html", "css", "beginner"],
        ["Day 65", "The Cube", "./public/The%20Cube/index.html", "canvas css", "intermediate"],
        ["Day 66", "Flask Auth App", "https://github.com/...", "api javascript", "intermediate"],
        ["Day 67", "Blog-Website", "./public/blog/main.html", "css", "beginner"],
        ["Day 68", "3d Rotating Card", "./public/3d%20cards/index.html", "css", "intermediate"],
        ["Day 69", "Spotify Clone", "./public/spotify-clone.../index.html", "api javascript", "intermediate"],
        ["Day 70", "Insect-Catch_Game", "./public/Insect-Catch-Game/index.html", "game canvas", "intermediate"],
        ["Day 71", "Quotely Laughs", "./public/Quotely-Laughs/index.html", "api javascript", "beginner"],
        ["Day 72", "Contact Book", "https://github.com/...", "todo javascript", "intermediate"],
        ["Day 73", "Candy_Crush_Game", "./public/Candy_Crush_Game/index.html", "game javascript", "intermediate"],
        ["Day 74", "Stock Profit Calc", "./public/Stock-Profit-Calculator/index.html", "javascript", "beginner"],
        ["Day 75", "code-space-game", "./public/code-jump-space-game/index.html", "game canvas", "intermediate"],
        ["Day 76", "Animated Searchbar", "./public/Animated%20Searchbar/index.html", "css javascript", "beginner"],
        ["Day 77", "Rock-Paper-Scissor", "./public/Stone-Paper-Scissor/index.html", "game javascript", "beginner"],
        ["Day 78", "NPM Package Search", "./public/NPM%20Package%20Search/index.html", "api javascript", "intermediate"],
        ["Day 79", "Linkedin Clone", "./public/Linkedin-Clone/index.html", "css", "intermediate"],
        ["Day 80", "Resume Studio", "./public/ResumeStudio/index.html", "javascript", "intermediate"],
        ["Day 81", "Simon Says Game", "./public/Simon_Says_Game/index.html", "game javascript", "intermediate"],
        ["Day 82", "Love Calculator", "./public/Love-Calculator/index.html", "game javascript", "beginner"],
        ["Day 83", "Exchange Currency", "./public/Exchange_Currency/index.html", "api javascript", "intermediate"],
        ["Day 84", "Lights Out Puzzle", "./public/Lights_Out_Puzzle/index.html", "game javascript", "intermediate"],
        ["Day 85", "Image Search Engine", "./public/Image Search Engine/index.html", "api javascript", "intermediate"],
        ["Day 86", "Profile Card", "./public/3d profile Card/index.html", "css", "beginner"],
        ["Day 87", "Breakout game", "./public/Breakout game/index.html", "game canvas", "intermediate"],
        ["Day 88", "Job dashboard", "./public/Job dashboard/jobs.html", "javascript", "intermediate"],
        ["Day 89", "N-Queen", "./public/N_Queen/index.html", "game javascript", "intermediate"],
        ["Day 90", "Quize App Timer", "./public/QuizeApp Timer/index1.html", "javascript", "beginner"],
        ["Day 91", "Voting Application", "https://github.com/...", "api javascript", "intermediate"],
        ["Day 92", "Slide puzzle Game", "./public/Slide puzzle Game/index.html", "game javascript", "intermediate"],
        ["Day 93", "TextUtils", "https://github.com/...", "javascript", "beginner"],
        ["Day 94", "Hangman Game", "./public/HangmanGame/index.html", "game javascript", "intermediate"],
        ["Day 95", "TodoList React", "./public/TodoList-React-TS-Tailwind/index.html", "todo javascript", "intermediate"],
        ["Day 96", "HCL Color Generator", "./public/HCL Color Generator/index.html", "css javascript", "beginner"],
        ["Day 97", "Time Capsule", "./public/Time-Capsule/index.html", "javascript", "intermediate"],
        ["Day 98", "Virtual Piano", "./public/Virtual Piano/index.html", "css javascript", "intermediate"],
        ["Day 99", "NASA-APOD Ext", "./public/NASA-APOD/popup.html", "api javascript", "intermediate"],
        ["Day 100", "Text Saver Ext", "./public/Text_Saver_Ext/popup.html", "todo javascript", "intermediate"],
        ["Day 101", "Finance Tracker", "./public/FinanceTracker/index.html", "todo javascript", "intermediate"],
        ["Day 102", "Travel Booking", "./public/Travel_booking_website/index.html", "javascript", "intermediate"],
        ["Day 103", "Drumkit Game", "./public/Drumkit_Game/index.html", "game javascript", "beginner"],
        ["Day 104", "Debug-Website", "./public/Debug-Website/index.html", "css", "beginner"],
        ["Day 105", "Periodic Table", "./public/Periodic Table/index.html", "css javascript", "beginner"],
        ["Day 106", "Plants Website", "./public/Plants Website/index.html", "css", "beginner"],
        ["Day 107", "DocNow", "./public/DocNow/index.html", "api javascript", "intermediate"],
        ["Day 108", "expense_Tracker", "./public/expense_Tracker/index.html", "todo javascript", "intermediate"],
        ["Day 109", "Mood Tracker", "./public/Mood Tracker/index.html", "todo javascript", "intermediate"],
        ["Day 110", "CRYPTOSHOW", "./public/CRYPTOSHOW/index.html", "api javascript", "intermediate"],
        ["Day 111", "Whack-a-Mole Game", "./public/Whack-a-Mole Game/index.html", "game canvas", "intermediate"],
        ["Day 112", "Nykaa Clone", "./public/Nykaa-clone/index.html", "css", "intermediate"],
        ["Day 113", "CPU Scheduler", "./public/CpuScheduler/index.html", "javascript", "intermediate"],
        ["Day 114", "EchoNotes", "./public/EchoNotes/index.html", "todo javascript", "intermediate"],
        ["Day 115", "Event Registration System", "https://event-registration-system-w10a.onrender.com/", "api javascript", "intermediate"],
        ["Day 116", "AI Image Classifier", "./public/AI Image Classifier/index.html", "api javascript", "intermediate"],
        ["Day 117", "Astronomy Dashboard", "./public/AstronomyDashboard/astro.html", "api javascript", "intermediate"]
    ];

    filteredData = [...projectData];
    applyFilters();
}

// ============================================
// 5. CORE FILTER & RENDER LOGIC
// ============================================
function filterProjects() {
    applyFilters();
}

function applyFilters() {
    const searchVal = document.getElementById('searchInput')?.value.toLowerCase() || "";

    filteredData = projectData.filter(project => {
        if (!project || project.length < 3) return false;
        const nameMatch = project[1].toLowerCase().includes(searchVal);
        const projectCategory = (project[3] || '').toString().toLowerCase();
        const projectDifficulty = (project[4] || '').toString().toLowerCase();
        const categoryMatch = currentCategory === 'all' || projectCategory.includes(currentCategory);
        const difficultyMatch = currentDifficulty === 'all' || projectDifficulty === currentDifficulty;
        return nameMatch && categoryMatch && difficultyMatch;
    });

    currentPage = 1;
    renderTable();
    createPagination();
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    const noProjects = document.getElementById('no-projects');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (filteredData.length === 0) {
        if (noProjects) noProjects.style.display = 'block';
        const pagin = document.getElementById('pagination');
        if (pagin) pagin.innerHTML = '';
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

    paginatedItems.forEach(e => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${e[0]}</td>
            <td class="project-name">${e[1]} <small style="opacity:0.5">(${(e[4] || '')})</small></td>
            <td><a class="button" href="${(e[2] || '').toString().trim()}" target="_blank">View Demo <i class="fas fa-external-link-alt"></i></a></td>
        `;

        tbody.appendChild(row);
    });

    if (noProjects) {
        noProjects.style.display = filteredData.length === 0 ? 'block' : 'none';
    }
}

function createPagination() {
    const container = document.getElementById('pagination');
    if (!container) return;
    container.innerHTML = '';

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.innerText = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { currentPage--; renderTable(); createPagination(); window.scrollTo(0, 450); };

    const nextBtn = document.createElement('button');
    nextBtn.innerText = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { currentPage++; renderTable(); createPagination(); window.scrollTo(0, 450); };

    const info = document.createElement('span');
    info.innerText = ` Page ${currentPage} of ${totalPages} `;
    info.style.margin = '0 10px';

    container.append(prevBtn, info, nextBtn);
}

window.filterProjects = filterProjects;

// ============================================
// 6. INITIALIZATION & EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    fetchRepoStats();
    fillTable();

    // Search input
    document.getElementById('searchInput')?.addEventListener('input', applyFilters);

    // Filter Buttons (Toggle Logic)
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const val = this.getAttribute('data-category');
            const isDiff = this.classList.contains('difficulty-btn');

            if (isDiff) {
                currentDifficulty = (currentDifficulty === val) ? 'all' : val;
            } else {
                currentCategory = (currentCategory === val) ? 'all' : val;
            }

            // UI Highlight Update
            this.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            if ((isDiff && currentDifficulty === val) || (!isDiff && currentCategory === val)) {
                this.classList.add('active');
            } else if (!isDiff && currentCategory === 'all') {
                document.querySelector('[data-category="all"]')?.classList.add('active');
            }

            applyFilters();
        });
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.onclick = () => {
            document.body.classList.toggle('light-mode');
            const icon = themeBtn.querySelector('i');
            if (icon) icon.className = document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
        };
    }
});
