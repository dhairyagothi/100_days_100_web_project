/* ============================================
   100 Days 100 Projects — Premium JS
   ============================================ */

if (typeof REPO_OWNER === 'undefined') {
    window.REPO_OWNER = "dhairyagothi";
    window.REPO_NAME = "100_days_100_web_project";
}

/* ---------- DATA ---------- */
const DATA = [
    ["Day 1","To-Do List","./public/TO_DO_LIST/todolist.html"],
    ["Day 2","Digital Clock","./public/digital_clock/digitalclock.html"],
    ["Day 3","Indian Flag","./public/indianflag/flag.html"],
    ["Day 4","Dropdown Nav Bar","./public/dropdown_navbar/index.html"],
    ["Day 5","Animated Cursor","./public/Animated-cursor/animated-cursor.html"],
    ["Day 6","Auto Background Image Slider","./public/Background-Image-sider/slider.html"],
    ["Day 7","Typewriter","./public/typewriter/typewriter.html"],
    ["Day 8","Parallel-X Website","./public/Parallel-x%20website/parallal.html"],
    ["Day 9","Captcha Generator","./public/captcha/captcha.html"],
    ["Day 10","QR Code Generator","./public/qr%20generator/qr.html"],
    ["Day 11","Serve Website Using Express","./public/index.html"],
    ["Day 12","Nodemailer Contact Form","./public/gmail_nodemailer/public/mail.html"],
    ["Day 13","Login Form Using MERN","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/loginusingmern"],
    ["Day 14","File Uploader","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/file_uploader"],
    ["Day 15","Progress Bar","./public/progress_bar/progress_bar.html"],
    ["Day 16","Scroll Bar CSS","./public/index.html"],
    ["Day 17","Slider Using Swiper API","./public/slider%20box/index.html"],
    ["Day 18","Carousel Solar System","./public/carousal/index.html"],
    ["Day 19","Planto","./public/plantwebsite/plant.html"],
    ["Day 20","EveSparks","https://evesparks.onrender.com/"],
    ["Day 21","Video BG Slider Using React","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/travel_website"],
    ["Day 22","Page Loader","./public/pageloader/pageloader.html"],
    ["Day 23","Jarvis Virtual Assistant","./public/Jarvis-AI-main/index.html"],
    ["Day 24","Chat Bot","./public/AI%20ChatBot/chatbot.html"],
    ["Day 25","Tic-Tac-Toe","./public/TicTacToe/index.html"],
    ["Day 26","Maze Game","./public/Maze-Game-main/index.html"],
    ["Day 27","Memory Game","./public/MemoryGame/index.html"],
    ["Day 28","Wordle","./public/WORDLE/index.html"],
    ["Day 29","Snake Game","./public/snake_game/index.html"],
    ["Day 30","Flappy Bird Game","./public/Flappy-bird-main/index.html"],
    ["Day 31","Password Manager","./public/password%20manager/index.html"],
    ["Day 32","Missionaries & Cannibals","./public/Missionaries&Cannibals/index.html"],
    ["Day 33","Weather Forecasting","./public/Weather%20Forcasting/index.html"],
    ["Day 34","Email Validator","./public/email%20validator/index.html"],
    ["Day 35","JavaScript Calculator","./public/Vanilla-JavaScript-Calculator-master/index.html"],
    ["Day 36","Medical App","./public/Medical_App/index.html"],
    ["Day 37","2048 Game","./public/2048_game/index.html"],
    ["Day 38","Github Profile Finder","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/github_profile_finder"],
    ["Day 39","Notes App","./public/notes-app/index.html"],
    ["Day 40","Analog Clock","./public/AnalogClock/index.html"],
    ["Day 41","Scroll Dark Game","./public/Scroll%20Game%20Dark%20Run/index.html"],
    ["Day 42","Amazon Clone","./public/Amazon_Clone/index.html"],
    ["Day 43","Password Generator","./public/Password_Generator/index.html"],
    ["Day 44","BMI Calculator","./public/BMI_Calculator/index.html"],
    ["Day 45","Black Jack","./public/BlackJack/blackJ.html"],
    ["Day 46","Palindrome Generator","./public/Palindrome_Generator/index.html"],
    ["Day 47","Ping Pong Game","./public/ping/index.html"],
    ["Day 48","Text To Voice Converter","./public/TextToVoiceConverter/index.html"],
    ["Day 49","Url Shortener","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/url_shortener"],
    ["Day 50","Recipe Genie","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Recipe-Genie"],
    ["Day 51","Netflix Clone","./public/Netflix_Cloning/Index.html"],
    ["Day 52","ClimaCode","./public/ClimaCode%202.0/index.html"],
    ["Day 53","E-Commerce Cart","./public/e-commerce_cart/index.html"],
    ["Day 54","Budget Tracker","./public/Budget%20Tracker/index.html"],
    ["Day 55","Cricket Game","./public/cricket/index.html"],
    ["Day 56","Pastebin (Svelte)","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/pastebin"],
    ["Day 57","Glowing Social Icons","./public/Social%20Media%20Glowing/index.html"],
    ["Day 58","Music App","./public/Music%20App/index.html"],
    ["Day 59","Blog Page","./public/Blog%20Page/index.html"],
    ["Day 60","Marketing Website","./public/marketing_website/index.html"],
    ["Day 61","Hologram Button","./public/Holo%20Button/index.html"],
    ["Day 62","Solar System Explorer","./public/Solar%20System%20Explorer%20in%20CSS%20only%20haml/template.html"],
    ["Day 63","Image to Text App","./public/Image-To-Text-App/index.html"],
    ["Day 64","Zomato Clone","./public/zomato-clone/zomato.html"],
    ["Day 65","The Cube","./public/The%20Cube/index.html"],
    ["Day 66","Flask Auth App","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/flask_auth_app"],
    ["Day 67","Blog Website","./public/blog/main.html"],
    ["Day 68","3D Rotating Card","./public/3d%20cards/index.html"],
    ["Day 69","Spotify Clone","./public/spotify-clone%20-project/index.html"],
    ["Day 70","Insect Catch Game","./public/Insect-Catch-Game/index.html"],
    ["Day 71","Quotely Laughs","./public/Quotely-Laughs/index.html"],
    ["Day 72","Contact Book","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Contact%20Book"],
    ["Day 73","Candy Crush Game","./public/Candy_Crush_Game/index.html"],
    ["Day 74","Stock Profit Calculator","./public/Stock-Profit-Calculator/index.html"],
    ["Day 75","Code Space Game","./public/code-jump-space-game/index.html"],
    ["Day 76","Animated Searchbar","./public/Animated%20Searchbar/index.html"],
    ["Day 77","Rock Paper Scissor","./public/Stone-Paper-Scissor/index.html"],
    ["Day 78","NPM Package Search","./public/NPM%20Package%20Search/index.html"],
    ["Day 79","LinkedIn Clone","./public/Linkedin-Clone/index.html"],
    ["Day 80","Resume Studio","./public/ResumeStudio/index.html"],
    ["Day 81","Simon Says Game","./public/Simon_Says_Game/index.html"],
    ["Day 82","Love Calculator","./public/Love-Calculator/index.html"],
    ["Day 83","Exchange Currency","./public/Exchange_Currency/index.html"],
    ["Day 84","Lights Out Puzzle","./public/Lights_Out_Puzzle/index.html"],
    ["Day 85","Image Search Engine","./public/Image Search Engine/index.html"],
    ["Day 86","3D Profile Card","./public/3d profile Card/index.html"],
    ["Day 87","Breakout Game","./public/Breakout game/index.html"],
    ["Day 88","Job Dashboard","./public/Job dashboard/jobs.html"],
    ["Day 89","N-Queen Solver","./public/N_Queen/index.html"],
    ["Day 90","Quiz App Timer","./public/QuizeApp Timer/index1.html"],
    ["Day 91","Voting App Backend","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Voting_Application_Backend"],
    ["Day 92","Slide Puzzle Game","./public/Slide puzzle Game/index.html"],
    ["Day 93","TextUtils","https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Textutils"],
    ["Day 94","Hangman Game","./public/HangmanGame/index.html"],
    ["Day 95","TodoList (React TS)","./public/TodoList-React-TS-Tailwind/index.html"],
    ["Day 96","HCL Color Generator","./public/HCL Color Generator/index.html"],
    ["Day 97","Time Capsule","./public/Time-Capsule/index.html"],
    ["Day 98","Virtual Piano","./public/Virtual Piano/index.html"],
    ["Day 99","NASA APOD Extension","./public/NASA-APOD/popup.html"],
    ["Day 100","Text Saver Extension","./public/Text_Saver_Ext/popup.html"],
    ["Day 101","Finance Tracker","./public/FinanceTracker/index.html"],
    ["Day 102","Travel Booking Website","./public/Travel_booking_website/index.html"],
    ["Day 103","Drumkit Game","./public/Drumkit_Game/index.html"],
    ["Day 104","Debug Website","./public/Debug-Website/index.html"],
    ["Day 105","Periodic Table","./public/Periodic Table/index.html"],
    ["Day 106","Plants Website","./public/Plants Website/index.html"],
    ["Day 107","DocNow","./public/DocNow/index.html"],
    ["Day 108","Expense Tracker","./public/expense_Tracker/index.html"],
    ["Day 109","Mood Tracker","./public/Mood Tracker/index.html"],
    ["Day 110","CryptoShow","./public/CRYPTOSHOW/index.html"],
    ["Day 111","Whack-a-Mole","./public/Whack-a-Mole Game/index.html"],
    ["Day 112","Nykaa Clone","./public/Nykaa-clone/index.html"],
    ["Day 113","CPU Scheduler","./public/CpuScheduler/index.html"],
    ["Day 114","EchoNotes","./public/EchoNotes/index.html"]
];

const CAT_MAP = { game: 'Game', clone: 'Clone', tool: 'Tool', app: 'App' };

function categorize(name) {
    const n = name.toLowerCase();
    if (/game|tic|snake|pong|puzzle|crush|breakout|whack|hangman|simon|maze|flappy|wordle|cricket|2048|blackjack|scroll dark|drumkit|mole/i.test(n)) return 'game';
    if (/clone|amazon|netflix|spotify|zomato|nykaa|linkedin/i.test(n)) return 'clone';
    if (/calculator|generator|converter|validator|tracker|search|scheduler|manager|shortener|finder/i.test(n)) return 'tool';
    return 'app';
}

/* ---------- THREE.JS BACKGROUND ---------- */
function initScene() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPos[i*3] = (Math.random() - 0.5) * 100;
        starPos[i*3+1] = (Math.random() - 0.5) * 100;
        starPos[i*3+2] = (Math.random() - 0.5) * 100;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.2 });
    const stars = new THREE.Points(starGeo, starMat);
    mainGroup.add(stars);

    const gridCount = 40;
    const gridGeo = new THREE.PlaneGeometry(100, 100, gridCount, gridCount);
    const gridMat = new THREE.MeshBasicMaterial({ 
        color: 0x6366f1, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.05,
        side: THREE.DoubleSide
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -6;
    mainGroup.add(grid);

    camera.position.z = 15;

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = (e.clientX / innerWidth - 0.5);
        my = (e.clientY / innerHeight - 0.5);
    });

    const pos = grid.geometry.attributes.position;
    const count = pos.count;

    (function loop() {
        requestAnimationFrame(loop);
        const t = Date.now() * 0.0005;

        for (let i = 0; i < count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = Math.sin(x * 0.15 + t) * 0.8 + Math.cos(y * 0.15 + t) * 0.8;
            pos.setZ(i, z);
        }
        pos.needsUpdate = true;

        mainGroup.rotation.y += (mx * 0.02 - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (my * 0.02 - mainGroup.rotation.x) * 0.05;
        stars.rotation.y += 0.0001;

        renderer.render(scene, camera);
    })();

    addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });
}

/* ---------- LOADER ---------- */
function initLoader() {
    const fill = document.getElementById('loaderFill');
    const text = document.getElementById('loaderText');
    const loader = document.getElementById('loader');
    let p = 0;
    const iv = setInterval(() => {
        p += Math.random() * 20 + 10;
        if (p >= 100) {
            p = 100; clearInterval(iv);
            setTimeout(() => {
                loader.classList.add('done');
                revealHero();
                document.getElementById('header').classList.add('visible');
            }, 300);
        }
        fill.style.width = p + '%';
        text.textContent = p >= 100 ? 'Ready' : 'Loading';
    }, 100);
}

/* ---------- GSAP HERO REVEAL ---------- */
function revealHero() {
    if (typeof gsap === 'undefined') return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Clear initial states to prevent flickers
    gsap.set(['#heroEyebrow', '#heroH1', '#heroDesc', '#heroActions', '#heroProof'], { opacity: 0, y: 30 });

    tl.to('#heroEyebrow', { opacity: 1, y: 0, duration: 0.8 })
      .to('#heroH1', { opacity: 1, y: 0, duration: 1, scale: 1 }, '-=0.5')
      .to('#heroDesc', { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          onStart: () => {
              // Start typing effect when desc starts appearing
              const el = document.querySelector('.hero-desc');
              if (el && !el.dataset.typed) {
                  el.dataset.typed = "true";
                  const text = el.textContent;
                  el.textContent = "";
                  gsap.to(el, { duration: 1.5, text: text, ease: "none" });
              }
          }
      }, '-=0.7')
      .to('#heroActions', { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
      .to('#heroProof', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
}

function initScrollAnims() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.stats-row', {
        scrollTrigger: { trigger: '.stats', start: 'top 85%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out'
    });

    gsap.from('.projects-header', {
        scrollTrigger: { trigger: '.projects', start: 'top 85%' },
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out'
    });

    // Cards animation moved to a more robust handler
}

/* ---------- GITHUB STATS ---------- */
async function fetchStats() {
    try {
        const [rr, pr] = await Promise.all([
            fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`),
            fetch(`https://api.github.com/search/issues?q=repo:${REPO_OWNER}/${REPO_NAME}+type:pr+state:open`)
        ]);
        if (!rr.ok || !pr.ok) throw new Error('fail');
        const rd = await rr.json(), pd = await pr.json();
        count('starCount', rd.stargazers_count);
        count('forkCount', rd.forks_count);
        count('issueCount', rd.open_issues_count - pd.total_count);
        count('prCount', pd.total_count);
    } catch(e) { console.error('Stats:', e); }
}

function count(id, target) {
    const el = document.getElementById(id);
    if (!el || target <= 0) { if(el) el.textContent = '0'; return; }
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const iv = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(iv); }
        el.textContent = cur.toLocaleString();
    }, 30);
}

/* ---------- BUILD CARDS ---------- */
function buildCards() {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;

    const typeColors = {
        'APP': { bg: 'rgba(6, 182, 212, 0.1)', text: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
        'GAME': { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
        'TOOL': { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
        'OTHER': { bg: 'rgba(100, 116, 139, 0.1)', text: '#64748b', glow: 'rgba(100, 116, 139, 0.4)' }
    };

    DATA.forEach(([day, name, link]) => {
        const cat = categorize(name);
        const type = CAT_MAP[cat].toUpperCase();
        const colors = typeColors[type] || typeColors['OTHER'];
        
        const card = document.createElement('div');
        card.className = 'p-card';
        card.dataset.cat = cat;
        card.dataset.name = name.toLowerCase();
        card.innerHTML = `
            <div class="p-card-top">
                <span class="p-day" style="background:${colors.bg}; color:${colors.text}; border: 1px solid ${colors.text}44;">
                    ${day}
                </span>
                <span class="p-cat" style="color:${colors.text};">${type}</span>
            </div>
            <div class="p-name">${name}</div>
            <div class="p-actions">
                <a href="${link.trim()}" target="_blank" class="p-link">
                    VIEW DEMO <i class="fas fa-arrow-right"></i>
                </a>
            </div>`;
        grid.appendChild(card);
    });

    updateCount(DATA.length);

    // Smooth staggered reveal as you scroll
    if (window.gsap && window.ScrollTrigger) {
        gsap.utils.toArray('.p-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 95%",
                    toggleActions: "play none none none"
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                clearProps: "all" // Ensures styles are cleared after animation
            });
        });
    }
}

/* ---------- SEARCH & FILTER ---------- */
function filterAll() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const f = document.querySelector('.pill.active')?.dataset.filter || 'all';
    let vis = 0;
    document.querySelectorAll('.p-card').forEach(c => {
        const show = c.dataset.name.includes(q) && (f === 'all' || c.dataset.cat === f);
        c.style.display = show ? '' : 'none';
        if (show) vis++;
    });
    updateCount(vis);
    document.getElementById('emptyState').style.display = vis ? 'none' : 'block';
}

function updateCount(n) {
    const el = document.getElementById('countAll');
    if (el) el.textContent = n;
}

/* ---------- THEME ---------- */
function initTheme() {
    const btn = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    if (!btn) return;
    const saved = localStorage.getItem('theme');
    // Default to dark mode
    if (saved === 'light') {
        document.body.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    }
    btn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        icon.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

/* ---------- HEADER ---------- */
function initHeader() {
    const header = document.getElementById('header');
    const links = document.querySelectorAll('.nav-item[data-sec]');
    const sp = document.getElementById('scrollProgress');
    addEventListener('scroll', () => {
        header.classList.toggle('scrolled', scrollY > 20);
        
        // Update progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (sp) sp.style.width = scrolled + "%";

        ['hero','stats','projects','footer'].forEach(id => {
            const s = document.getElementById(id);
            if (!s) return;
            const r = s.getBoundingClientRect();
            if (r.top <= 150 && r.bottom > 150) {
                links.forEach(l => l.classList.toggle('active', l.dataset.sec === id));
            }
        });
    });
    //
}

/* ---------- SCROLL TOP ---------- */
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    addEventListener('scroll', () => btn.classList.toggle('show', scrollY > 500));
    btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- KEYBOARD SHORTCUT ---------- */
function initKeyboard() {
    addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchInput')?.focus();
        }
    });
}

/* ---------- PILLS ---------- */
function initPills() {
    document.querySelectorAll('.pill').forEach(p => {
        p.addEventListener('click', () => {
            document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
            p.classList.add('active');
            filterAll();
        });
    });
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScene();
    initTheme();
    initHeader();
    initScrollTop();
    initKeyboard();
    buildCards();
    initPills();
    initScrollAnims();
    fetchStats();
});