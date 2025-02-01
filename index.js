function filterProjects() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const rows = document.querySelector('tbody').querySelectorAll('tr'); // Choose all rows in the table body
    let hasResults = false;

    rows.forEach(row => {
        const projectName = row.querySelector('.project-name')?.innerText.toLowerCase();

        if (projectName && projectName.includes(filter)) {
            row.style.display = '';
            hasResults = true;
        } else if (row.id !== 'table-subheader') {
            row.style.display = 'none';
        }
    });

    const subheader = document.querySelector('.subheader');
    const noProjectsMessage = document.getElementById('no-projects');

    if (hasResults) {
        subheader.style.display = 'block';
        noProjectsMessage.style.display = 'none';
    } else {
        document.getElementById('table-subheader').style.display = 'none';
        subheader.style.display = 'none';
        noProjectsMessage.style.display = 'block';
    }
}

// Update Navbar for Login Status
const buttons = document.getElementsByClassName('buttons')[0]; // Refers to the section on NavBar where buttons will get appended based on login status

function updateNavbar() {
    const username = localStorage.getItem('username');
    if (username) {
        buttons.innerHTML = `
        <button class="button is-success is-dark has-text-weight-bold">
            Welcome ${username}
        </button>
        <button class="button is-danger is-dark" id='logout'>
            Logout
        </button>
        <a class="button is-primary is-dark" href="https://github.com/dhairyagothi">
            <strong>GitHub</strong>  
        </a>
        <a class="button is-primary is-dark" href="contributors/contributor.html">
            <strong>Contributors</strong>
        </a>`;

        document.getElementById('logout').addEventListener('click', () => {
            localStorage.removeItem('username');
            updateNavbar();
        });
    } else {
        buttons.innerHTML = `
        <a class="button is-primary is-dark" href="contributors/contributor.html">
            <strong>Contributors</strong>
        </a>
        <a class="button is-primary is-dark" href="https://github.com/dhairyagothi">
            <strong>GitHub</strong>
        </a>
        <a class="button is-success is-light" href="/public/Login.html">
            <strong>Log in</strong>
        </a>`;
    }
}

// Populate the table with project data
function fillTable() {
    const data = [
        ["Day 1", "To-Do List", " /public/TO_DO_LIST/todolist.html"],
        ["Day 2", "Digital Clock", " /public/digital_clock/digitalclock.html"],
        ["Day 3", "Indian Flag", " /public/indianflag/flag.html"],
        ["Day 4", "Dropdown Nav Bar", " /public/dropdown_navbar/index.html"],
        ["Day 5", "Animated Cursor", " /public/Animated-cursor/animated-cursor.html"],
        ["Day 6", "Auto Background Image Slider", " /public/Background-Image-sider/slider.html"],
        ["Day 7", "Typewriter", " /public/typewriter/typewriter.html"],
        ["Day 8", "Parallel-X Website", " /public/Parallel-x%20website/parallal.html"],
        ["Day 9", "Captcha Generator", " /public/captcha/captcha.html"],
        ["Day 10", "QR Code Generator", " /public/qr%20generator/qr.html"],
        ["Day 11", "Serve Website Using Express", " /public/index.html"],
        ["Day 12", "Nodemailer Contact Form", " /public/gmail_nodemailer/public/mail.html"],
        ["Day 13", "Login Form Using MERN", "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/loginusingmern"],
        ["Day 14", "File Uploader", "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/file_uploader"],
        ["Day 15", "Progress Bar", " /public/progress_bar/progress_bar.html"],
        ["Day 16", "Scroll Bar CSS", " /public/index.html"],
        ["Day 17", "Slider Using Swiper API", " /public/slider%20box/index.html"],
        ["Day 18", "Carousel Solar System", " /public/carousal/index.html"],
        ["Day 19", "Planto", " /public/plantwebsite/plant.html"],
        ["Day 20", "EveSparks", " /public/https://evesparks.onrender.com/"],
        ["Day 21", "Video BG Slider Using React", " /public/https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/travel_website"],
        ["Day 22", "Page Loader", " /public/pageloader/pageloader.html"],
        ["Day 23", "Jarvis Virtual Assistant", " /public/Jarvis-AI-main/index.html"],
        ["Day 24", "Chat Bot", " /public/AI%20ChatBot/chatbot.html"],
        ["Day 25", "Tic-Tac-Toe", " /public/TicTacToe/index.html"],
        ["Day 26", "Maze Game", " /public/Maze-Game-main/index.html"],
        ["Day 27", "Memory Game", " /public/MemoryGame/index.html"],
        ["Day 28", "Wordle", " /public/WORDLE/index.html"],
        ["Day 29", "Snake Game", " /public/snake_game/index.html"],
        ["Day 30", "Flappy-bird-game", " /public/Flappy-bird-main/index.html"],
        ["Day 31", "Password Manager", " /public/password%20manager/index.html"],
        ["DAY-32", "Missionaries & Cannibals", " /public/Missionaries&Cannibals/index.html"],
        ["Day 33", "Weather Forcasting", " /public/Weather%20Forcasting/index.html"],
        ["Day 34", "Email Validator", " /public/email%20validator/index.html"],
        ["Day 35", "Vanilla-JavaScript-Calculator", " /public/Vanilla-JavaScript-Calculator-master/index.html"],
        ["Day 36", "Medical App", " /public/Medical_App/index.html"],
        ["Day 37", "2048 Game", " /public/2048_game/index.html"],
        ["Day 38", "Github Profile Finder", "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/github_profile_finder"],
        ["Day 39", "Notes App", " /public/notes-app/index.html"],
        ["Day 40", "Analog Clock", " /public/AnalogClock/index.html"],
        ["Day 41", "Scroll Dark Game", " /public/Scroll%20Game%20Dark%20Run/index.html"],
        ["Day 42", "Amazon App", " /public/Amazon_Clone/index.html"],
        ["Day 43", "Password Generator", " /public/Password_Generator/index.html"],
        ["Day 44", "BMI Calculator", " /public/BMI_Calculator/index.html"],
        ["Day 45", "Black Jack", " /public/BlackJack/blackJ.html"],
        ["Day 46", "Palindrome Generator", " /public/Palindrome_Generator/index.html"],
        ["Day 47", "Ping Pong Game", " /public/ping/index.html"],
        ["Day 48", "TextToVoiceConverter", " /public/TextToVoiceConverter/index.html"],
        ["Day 49", "Url Shortener", "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/url_shortener"],
        ["Day 50", "Recipe Genie", "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/Recipe-Genie"],
        ["Day 51", "Netflix Landing Page Clone", " /public/Netflix_Cloning/Index.html"],
        ["Day 52", "ClimaCode", " /public/ClimaCode%202.0/index.html"],
        ["Day 53", "E-Commerce Website with Simple Cart Functionality", " /public/e-commerce_cart/index.html"],
        ["Day 54", "Budget Tracker", " /public/Budget%20Tracker/index.html"],
        ["Day 55", "Cricket Game", " /public/cricket/index.html"],
        ["Day 56", "Pastebin using svelte", "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/pastebin"],
        ["Day 57", "Glowing Social Media Icons", " /public/Social%20Media%20Glowing/index.html"],
        ["Day 58", "Music App", " /public/Music%20App/index.html"],
        ["Day 59", "Blog Page", " /public/Blog%20Page/index.html"],
        ["Day 60", "Marketing template website", " /public/marketing_website/index.html"],
        ["Day 61", "Hologram Button", " /public/Holo%20Button/index.html"],
        ["Day 62", "Solar System Explorer", " /public/Solar%20System%20Explorer%20in%20CSS%20only%20haml/template.html"],
        ["Day 63", "Image to Text App", " /public/Image-To-Text-App/index.html"],
        ["Day 64", "Zomato-clone", " /public/zomato-clone/zomato.html"],
        ["Day 65", "The Cube", " /public/The%20Cube/index.html"],
        ["Day 66", "Flask Authentication App", "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/flask_auth_app/README.md"],
        ["Day 67", "Blog-Website", " /public/blog/main.html"],
        ["Day 68", "3d Rotating Card", " /public/3d%20cards/index.html"],
        ["Day 69", "Spotify Clone Project", " /public/spotify-clone%20-project/index.html"],
        ["Day 70", "Insect-Catch_Game", " /public/Insect-Catch-Game/index.html"],
        ["Day 71", "Quotely Laughs", " /public/Quotely-Laughs/index.html"],
        ["Day 72", "Contact Book", "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/Contact%20Book/README.md"],
        ["Day 73", "Candy_Crush_Game", " /public/Candy_Crush_Game/index.html"],
        ["Day 74", "Stock Profit Calculator", " /public/Stock-Profit-Calculator/index.html"],
        ["Day 75", "code-space-game project", " /public/code-jump-space-game/index.html"],
        ["Day 76", "Animated Searchbar", " /public/Animated%20Searchbar/index.html"],
        ["Day 77", "Rock-Paper-Scissor-game project", " /public/Stone-Paper-Scissor/index.html"],
        ["Day 78", "NPM Package Search", " /public/NPM%20Package%20Search/index.html"],
        ["Day 79", "Linkedin Homepage Clone", " /public/Linkedin-Clone/index.html"],
        ["Day 80", "Resume Studio", " /public/ResumeStudio/index.html"],
        ["Day 81", "Simon Says Game", " /public/Simon_Says_Game/index.html"],
        ["Day 82", "Love Calculator Game", " /public/Love-Calculator/index.html"],
        ["Day 83", "Exchange Currency", " /public/Exchange_Currency/index.html"],
        ["Day 84", "Lights Out Puzzle", "/public/Lights_Out_Puzzle/index.html"],
        ["Day 85", "Image Search Engine", "/public/Image Search Engine/index.html"],
        ["Day 86", "Profile Card", "/public/3d profile Card/index.html"],
        ["Day 87", "Breakout game", "/public/Breakout game/index.html"],
        ["Day 88", "Job dashboard", "/public/Job dashboard/jobs.html"],
        ["Day 89", "N-Queen", "/public/N_Queen/index.html"],
        ["Day 90", "Quize App Timer", "public/QuizeApp Timer/index1.html"],
        ["Day 91", "Voting Application Backend", "https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public"],
        ["Day 92", "Slide puzzle Game", "public/Slide puzzle Game/index.html"],
        ["Day 93", "TextUtils", "/public/Textutils/src/App.js"],
        ["Day 94", "Hangman Game", "./public/HangmanGame/index.html"],
        ["Day 95", "TodoList in React TS Tailwind", "./public/TodoList-React-TS-Tailwind/index.html"],
        ["Day 96", "HCL Color Generator", "./public/HCL Color Generator/index.html"],
        ["Day 97", "Time Capsule", "public/Time-Capsule/index.html"],
        ["Day 98", "Virtual Piano", "./public/Virtual Piano/index.html"],
        ["Day 99", "NASA-APOD Extension", "./public/NASA-APOD/popup.html"],
        ["Day 100", "Text Saver Extension", "public/Text_Saver_Ext/popup.html"],
        ["Day 101", "Personal Finance Tracker", "./public/FinanceTracker/index.html"],
        ["Day 102", "Travel Booking Website", "./public/Travel_booking_website/index.html"],
        ["Day 103", "Drumkit Game", "./public/Drumkit_Game/index.html"],
        ["Day 104", "Debug-Website", "/public/Debug-Website/index.html"],
        ["Day 104", "Periodic Table", "./public/Periodic Table/index.html"],
        ["Day 105", "Plants Website", "./public/Plants Website/index.html"],
        ["Day 106", "DocNow", "/public/DocNow/index.html"],
        ["Day 107", "expense_Tracker", "./public/expense_Tracker/index.html"],
      ["Day 108","Mood Tracker","./public/Mood Tracker/index.html"],
    ["Day 109","CRYPTOSHOW","/public/CRYPTOSHOW/index.html"],
      ["Day 110","Whack-a-Mole Game","./public/Whack-a-Mole Game/index.html"]
        ["Day 111", "GameQuest","./public/GameQuest/index.html"]
    ];




    const tbody = document.getElementById('tableBody');

    data.forEach(e => {
        const row = document.createElement('tr');
        const days = document.createElement('td');
        const nameP = document.createElement('td');
        const link = document.createElement('td');
        const a = document.createElement('a');

        days.innerText = e[0];
        nameP.innerText = e[1];
        a.href = e[2];
        a.innerText = 'Here';
        a.target = '_blank'; // Open link in a new tab
        nameP.classList.add('project-name');

        link.appendChild(a);
        row.appendChild(days);
        row.appendChild(nameP);
        row.appendChild(link);

        tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    fillTable();
});

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check if the user has a saved theme preference
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-theme');
  themeToggle.textContent = '☀️';
} else {
  body.classList.add('light-theme');  // Explicitly set light theme
  themeToggle.textContent = '🌙';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
});
