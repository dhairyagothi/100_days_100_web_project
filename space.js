/**
 * ═══════════════════════════════════════════════════════════════
 * 100 DAYS 100 WEB PROJECTS — SPACE THEME ENGINE
 * Deep space animations, asteroid physics, and cosmic UI effects
 * ═══════════════════════════════════════════════════════════════
 */

// ── Project Data ──────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════
// 1. STARFIELD — Multi-layer parallax starfield on canvas
// ═══════════════════════════════════════════════════════════════
class Starfield {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.layers = 3;
        this.starsPerLayer = [200, 120, 60]; // Background, mid, foreground
        this.speeds = [0.15, 0.4, 0.8];
        this.sizes = [0.8, 1.2, 2];
        this.colors = [
            'rgba(226, 232, 240, 0.4)',
            'rgba(226, 232, 240, 0.6)',
            'rgba(226, 232, 240, 0.9)'
        ];
        this.mouseX = 0;
        this.mouseY = 0;
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.stars = [];
        for (let layer = 0; layer < this.layers; layer++) {
            for (let i = 0; i < this.starsPerLayer[layer]; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    baseX: Math.random() * this.canvas.width,
                    baseY: Math.random() * this.canvas.height,
                    size: this.sizes[layer] * (0.5 + Math.random() * 0.8),
                    speed: this.speeds[layer],
                    layer: layer,
                    twinkleSpeed: 0.002 + Math.random() * 0.008,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    color: this.colors[layer],
                });
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const time = Date.now() * 0.001;
        const scrollY = window.scrollY;

        this.stars.forEach(star => {
            // Parallax based on mouse
            const parallaxStrength = (star.layer + 1) * 8;
            const px = star.baseX + this.mouseX * parallaxStrength;
            const py = star.baseY + this.mouseY * parallaxStrength;

            // Scroll parallax
            const scrollParallax = scrollY * star.speed * 0.15;
            star.x = px;
            star.y = py - scrollParallax;

            // Wrap
            if (star.y < -10) star.y = this.canvas.height + 10;
            if (star.y > this.canvas.height + 10) star.y = -10;

            // Twinkle
            const twinkle = Math.sin(time * star.twinkleSpeed * 100 + star.twinkleOffset);
            const alpha = 0.3 + (twinkle + 1) * 0.35;
            const size = star.size * (0.7 + (twinkle + 1) * 0.15);

            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = star.color.replace(/[\d.]+\)$/, `${alpha})`);
            this.ctx.fill();

            // Glow for larger stars
            if (star.layer === 2 && Math.random() > 0.98) {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, size * 4, 0, Math.PI * 2);
                const gradient = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 4);
                gradient.addColorStop(0, `rgba(124, 58, 237, ${alpha * 0.3})`);
                gradient.addColorStop(1, 'transparent');
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}


// ═══════════════════════════════════════════════════════════════
// 2. ASTEROID FIELD — Floating 3D-ish asteroids
// ═══════════════════════════════════════════════════════════════
class AsteroidField {
    constructor(container) {
        this.container = container;
        this.asteroids = [];
        this.count = this.getCount();
        this.create();

        window.addEventListener('resize', () => {
            this.count = this.getCount();
            this.container.innerHTML = '';
            this.create();
        });
    }

    getCount() {
        if (window.innerWidth < 768) return 6;
        if (window.innerWidth < 1200) return 10;
        return 16;
    }

    create() {
        for (let i = 0; i < this.count; i++) {
            const el = document.createElement('div');
            el.className = 'asteroid';

            const size = 8 + Math.random() * 40;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = 30 + Math.random() * 60;
            const delay = Math.random() * -60;
            const opacity = 0.15 + Math.random() * 0.45;

            // Random irregular shape
            const br = [
                30 + Math.random() * 30,
                30 + Math.random() * 30,
                30 + Math.random() * 30,
                30 + Math.random() * 30,
                30 + Math.random() * 30,
                30 + Math.random() * 30,
                30 + Math.random() * 30,
                30 + Math.random() * 30,
            ];

            el.style.cssText = `
                width: ${size}px;
                height: ${size * (0.7 + Math.random() * 0.6)}px;
                left: ${x}%;
                top: ${y}%;
                opacity: ${opacity};
                animation-duration: ${duration}s;
                animation-delay: ${delay}s;
                border-radius: ${br[0]}% ${br[1]}% ${br[2]}% ${br[3]}% / ${br[4]}% ${br[5]}% ${br[6]}% ${br[7]}%;
                filter: blur(${size > 25 ? 0 : 0.5}px);
            `;

            this.container.appendChild(el);
            this.asteroids.push(el);
        }
    }
}


// ═══════════════════════════════════════════════════════════════
// 3. SHOOTING STARS — Random streaks
// ═══════════════════════════════════════════════════════════════
class ShootingStarEngine {
    constructor(container) {
        this.container = container;
        this.spawn();
    }

    spawn() {
        const interval = 2000 + Math.random() * 5000;

        setTimeout(() => {
            this.createStar();
            this.spawn();
        }, interval);
    }

    createStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * 0.6;
        const angle = 15 + Math.random() * 30;
        const length = 60 + Math.random() * 140;
        const duration = 0.6 + Math.random() * 1.2;
        const hue = Math.random() > 0.7 ? '270' : (Math.random() > 0.5 ? '210' : '0');

        star.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            width: ${length}px;
            transform: rotate(${angle}deg);
            animation-duration: ${duration + 3}s;
            background: linear-gradient(90deg,
                hsla(${hue}, 80%, 80%, 0.9),
                hsla(${hue}, 80%, 80%, 0.3) 40%,
                transparent);
        `;

        this.container.appendChild(star);
        star.style.animation = `shoot ${duration + 3}s linear forwards`;

        setTimeout(() => star.remove(), (duration + 3) * 1000 + 100);
    }
}


// ═══════════════════════════════════════════════════════════════
// 4. SCROLL REVEAL — Intersection Observer
// ═══════════════════════════════════════════════════════════════
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


// ═══════════════════════════════════════════════════════════════
// 5. NAVBAR — Scroll effects
// ═══════════════════════════════════════════════════════════════
function initNavbar() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
}


// ═══════════════════════════════════════════════════════════════
// 6. PROJECT TABLE — Population and filtering
// ═══════════════════════════════════════════════════════════════
function fillTable() {
    const tbody = document.getElementById('tableBody');
    const fragment = document.createDocumentFragment();

    projectData.forEach(([day, name, link], index) => {
        const row = document.createElement('tr');
        row.style.animationDelay = `${index * 0.02}s`;
        row.innerHTML = `
            <td class="day-col">${day}</td>
            <td class="name-col">${name}</td>
            <td class="demo-col">
                <a href="${link.trim()}" target="_blank" rel="noopener">
                    <span>Launch</span>
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </td>
        `;
        fragment.appendChild(row);
    });

    tbody.appendChild(fragment);
    updateCount(projectData.length);
}

function filterProjects() {
    const query = searchInput.value.toLowerCase().trim();
    const rows = tableBody.querySelectorAll('tr');
    let visible = 0;

    rows.forEach(row => {
        const name = row.querySelector('.name-col')?.textContent.toLowerCase() || '';
        const match = name.includes(query);
        row.style.display = match ? '' : 'none';
        if (match) visible++;
    });

    document.getElementById('no-projects').style.display = visible === 0 ? 'block' : 'none';
    updateCount(visible);
}

function updateCount(count) {
    document.getElementById('resultsCount').textContent = `${count} mission${count !== 1 ? 's' : ''}`;
}


// ═══════════════════════════════════════════════════════════════
// 7. SCROLL TO TOP
// ═══════════════════════════════════════════════════════════════
function initScrollToTop() {
    const btn = document.getElementById('scrollBtn');

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// ═══════════════════════════════════════════════════════════════
// 8. KEYBOARD SHORTCUT (Ctrl+K)
// ═══════════════════════════════════════════════════════════════
function initKeyboard() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const input = document.getElementById('searchInput');
            input.focus();
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}


// ═══════════════════════════════════════════════════════════════
// 9. CURSOR TRAIL — Cosmic particle trail on mouse
// ═══════════════════════════════════════════════════════════════
class CursorTrail {
    constructor() {
        this.particles = [];
        this.maxParticles = 20;
        this.lastX = 0;
        this.lastY = 0;

        document.addEventListener('mousemove', (e) => {
            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 8) {
                this.createParticle(e.clientX, e.clientY);
                this.lastX = e.clientX;
                this.lastY = e.clientY;
            }
        });
    }

    createParticle(x, y) {
        if (this.particles.length >= this.maxParticles) return;

        const particle = document.createElement('div');
        const size = 2 + Math.random() * 3;
        const hue = Math.random() > 0.5 ? 263 : 220;

        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: hsla(${hue}, 80%, 70%, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            left: ${x}px;
            top: ${y}px;
            box-shadow: 0 0 ${size * 2}px hsla(${hue}, 80%, 70%, 0.4);
            transition: all 0.6s ease-out;
        `;

        document.body.appendChild(particle);
        this.particles.push(particle);

        requestAnimationFrame(() => {
            particle.style.opacity = '0';
            particle.style.transform = `translate(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px) scale(0)`;
        });

        setTimeout(() => {
            particle.remove();
            this.particles = this.particles.filter(p => p !== particle);
        }, 600);
    }
}


// ═══════════════════════════════════════════════════════════════
// 10. ROW GLOW — Interactive table row cosmic effects
// ═══════════════════════════════════════════════════════════════
function initRowGlow() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;

    tableContainer.addEventListener('mousemove', (e) => {
        const rows = tableContainer.querySelectorAll('tbody tr');
        const rect = tableContainer.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;

        rows.forEach(row => {
            const rowRect = row.getBoundingClientRect();
            const rowCenter = rowRect.top + rowRect.height / 2 - rect.top;
            const distance = Math.abs(mouseY - rowCenter);
            const maxDist = 150;
            const intensity = Math.max(0, 1 - distance / maxDist);

            if (intensity > 0) {
                row.style.background = `rgba(124, 58, 237, ${intensity * 0.06})`;
                row.style.boxShadow = `inset 0 0 ${intensity * 40}px rgba(124, 58, 237, ${intensity * 0.03})`;
            } else {
                row.style.background = '';
                row.style.boxShadow = '';
            }
        });
    });

    tableContainer.addEventListener('mouseleave', () => {
        tableContainer.querySelectorAll('tbody tr').forEach(row => {
            row.style.background = '';
            row.style.boxShadow = '';
        });
    });
}


// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');

document.addEventListener('DOMContentLoaded', () => {
    // Core systems
    new Starfield(document.getElementById('starfield'));
    new AsteroidField(document.getElementById('asteroidField'));
    new ShootingStarEngine(document.getElementById('shootingStars'));
    new CursorTrail();

    // UI
    fillTable();
    initNavbar();
    initScrollReveal();
    initScrollToTop();
    initKeyboard();
    initRowGlow();

    // Search
    searchInput.addEventListener('input', filterProjects);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') filterProjects();
    });
});
