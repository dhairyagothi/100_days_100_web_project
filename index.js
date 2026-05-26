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

const PROJECT_DATA = [
['Day 1', 'To-Do List', './public/TO_DO_LIST/todolist.html', ['javascript', 'todo'], 'beginner'],
  ['Day 2', 'Digital Clock', './public/digital_clock/digitalclock.html', ['javascript'], 'beginner'],
  ['Day 3', 'Indian Flag', './public/indianflag/flag.html', ['css'], 'beginner'],
  ['Day 4', 'Dropdown Nav Bar', './public/dropdown_navbar/index.html', ['css'], 'beginner'],
  ['Day 5', 'Animated Cursor', './public/Animated-cursor/animated-cursor.html', ['ui', 'javascript', 'css'], 'beginner'],
  ['Day 6', 'Auto Background Image Slider', './public/Background-Image-sider/slider.html', ['javascript'], 'beginner'],
  ['Day 7', 'Typewriter', './public/typewriter/typewriter.html', ['html', 'css', 'javascript'], 'advanced'],
  ['Day 8', 'Parallel-X Website', './public/Parallel-x%20website/parallal.html', ['css'], 'intermediate'],
  ['Day 9', 'Captcha Generator', './public/captcha/captcha.html', ['javascript'], 'intermediate'],
  ['Day 10', 'QR Code Generator', './public/qr%20generator/qr.html', ['api', 'javascript'], 'intermediate'],
  ['Day 11', 'Serve Website Using Express', './public/index.html', ['javascript'], 'intermediate'],
  ['Day 12', 'Nodemailer Contact Form', './public/gmail_nodemailer/public/mail.html', ['api', 'javascript'], 'intermediate'],
  ['Day 13', 'Login Form Using MERN', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/loginusingmern', ['api', 'javascript'], 'intermediate'],
  ['Day 14', 'File Uploader', './public/file_uploader/public/file_uploader.html', ['javascript'], 'intermediate'],
  ['Day 15', 'Progress Bar', './public/progress_bar/progress_bar.html', ['ui', 'css', 'javascript'], 'beginner'],
  ['Day 16', 'Scroll Bar CSS', './public/Custom Scroll Bar/index.html', ['css'], 'beginner'],
  ['Day 17', 'Slider Using Swiper API', './public/slider%20box/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 18', 'Carousel Solar System', './public/Carousel%20Solar%20System/index.html', ['css', 'canvas'], 'intermediate'],
  ['Day 19', 'Planto', './public/plantwebsite/plant.html', ['css'], 'beginner'],
  ['Day 20', 'EveSparks', 'https://evesparks.onrender.com/', ['javascript'], 'intermediate'],
  ['Day 21', 'Video BG Slider Using React', './public/travel_website/index.html', ['javascript'], 'intermediate'],
  ['Day 22', 'Page Loader', './public/pageloader/pageloader.html', ['ui', 'css'], 'beginner'],
  ['Day 23', 'Jarvis Virtual Assistant', './public/Jarvis-AI-main/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 24', 'Chat Bot', './public/AI%20ChatBot/chatbot.html', ['api', 'javascript'], 'intermediate'],
  ['Day 25', 'Tic-Tac-Toe', './public/TicTacToe/index.html', ['game', 'javascript'], 'beginner'],
  ['Day 26', 'Maze Game', './public/Maze-Game-main/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 27', 'Memory Game', './public/MemoryGame/index.html', ['game', 'javascript'], 'beginner'],
  ['Day 28', 'Wordle', './public/WORDLE/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 29', 'Snake Game', './public/snake_game/index.html', ['game', 'javascript'], 'beginner'],
  ['Day 30', 'Flappy-bird-game', './public/Flappy-bird-main/index.html', ['game', 'canvas'], 'intermediate'],
  ['Day 31', 'Password Manager', './public/password%20manager/index.html', ['tool', 'javascript'], 'intermediate'],
  ['Day 32', 'Missionaries & Cannibals', './public/Missionaries&Cannibals/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 33', 'Weather Forecasting', './public/Weather%20Forcasting/index.html', ['weather', 'api'], 'intermediate'],
  ['Day 34', 'Email Validator', './public/email%20validator/index.html', ['api', 'javascript'], 'beginner'],
  ['Day 35', 'Vanilla-JavaScript-Calculator', './public/Vanilla-JavaScript-Calculator-master/index.html', ['tool', 'javascript'], 'beginner'],
  ['Day 36', 'Medical App', './public/Medical_App/index.html', ['javascript'], 'intermediate'],
  ['Day 37', '2048 Game', './public/2048_game/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 38', 'Github Profile Finder', './public/github_profile_finder/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 39', 'Notes App', './public/notes-app/index.html', ['todo', 'javascript'], 'beginner'],
  ['Day 40', 'Analog Clock', './public/AnalogClock/index.html', ['javascript', 'css'], 'beginner'],
  ['Day 41', 'Scroll Dark Game', './public/Scroll%20Game%20Dark%20Run/index.html', ['game', 'canvas'], 'intermediate'],
  ['Day 42', 'Amazon App', './public/Amazon_Clone/index.html', ['clone', 'javascript'], 'intermediate'],
  ['Day 43', 'Password Generator', './public/Password_Generator/index.html', ['tool', 'javascript'], 'beginner'],
  ['Day 44', 'BMI Calculator', './public/BMI_Calculator/index.html', ['tool', 'javascript'], 'beginner'],
  ['Day 45', 'Black Jack', './public/BlackJack/blackJ.html', ['game', 'javascript'], 'intermediate'],
  ['Day 46', 'Palindrome Generator', './public/Palindrome_Generator/index.html', ['javascript'], 'beginner'],
  ['Day 47', 'Ping Pong Game', './public/ping/index.html', ['game', 'canvas'], 'intermediate'],
  ['Day 48', 'TextToVoiceConverter', './public/TextToVoiceConverter/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 49', 'Url Shortener', './public/url_shortener/frontend/public/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 50', 'Recipe Genie', './public/Recipe%20Genie/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 51', 'Netflix Landing Page Clone', './public/Netflix_Cloning/Index.html', ['clone', 'css'], 'beginner'],
  ['Day 52', 'ClimaCode', './public/ClimaCode%202.0/index.html', ['weather', 'api'], 'intermediate'],
  ['Day 53', 'E-Commerce Website with Simple Cart Functionality', './public/e-commerce_cart/index.html', ['javascript'], 'intermediate'],
  ['Day 54', 'Budget Tracker', './public/Budget%20Tracker/index.html', ['todo', 'javascript'], 'intermediate'],
  ['Day 55', 'Cricket Game', './public/cricket/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 56', 'Pastebin using svelte', './public/pastebin/src/app.html', ['javascript'], 'intermediate'],
  ['Day 57', 'Glowing Social Media Icons', './public/Social%20Media%20Glowing/index.html', ['ui', 'css'], 'beginner'],
  ['Day 58', 'Music App', './public/Music%20App/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 59', 'Blog Page', './public/Blog%20Page/index.html', ['css'], 'beginner'],
  ['Day 60', 'Marketing template website', './public/marketing_website/index.html', ['css'], 'beginner'],
  ['Day 61', 'Hologram Button', './public/Holo%20Button/index.html', ['ui', 'css'], 'beginner'],
  ['Day 62', 'Solar System Explorer', './public/Solar%20System%20Explorer%20in%20CSS%20only%20haml/template.html', ['css'], 'intermediate'],
  ['Day 63', 'Image to Text App', './public/Image-To-Text-App/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 64', 'Zomato-clone', './public/zomato-clone/zomato.html', ['clone', 'css'], 'beginner'],
  ['Day 65', 'The Cube', './public/The%20Cube/index.html', ['ui', 'canvas', 'css'], 'intermediate'],
  ['Day 66', 'Flask Authentication App', './public/flask_auth_app/explain.html', ['api', 'javascript'], 'intermediate'],
  ['Day 67', 'Blog-Website', './public/blog/main.html', ['css'], 'beginner'],
  ['Day 68', '3d Rotating Card', './public/3d%20cards/index.html', ['ui', 'css'], 'intermediate'],
  ['Day 69', 'Spotify Clone Project', './public/spotify-clone%20-project/index.html', ['clone', 'api', 'javascript'], 'intermediate'],
  ['Day 70', 'Insect-Catch_Game', './public/Insect-Catch-Game/index.html', ['game', 'canvas'], 'intermediate'],
  ['Day 71', 'Quotely Laughs', './public/Quotely-Laughs/index.html', ['api', 'javascript'], 'beginner'],
  ['Day 72', 'Contact Book', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Contact%20Book', ['todo', 'javascript'], 'intermediate'],
  ['Day 73', 'Candy_Crush_Game', './public/Candy_Crush_Game/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 74', 'Stock Profit Calculator', './public/Stock-Profit-Calculator/index.html', ['tool', 'javascript'], 'beginner'],
  ['Day 75', 'code-space-game project', './public/code-jump-space-game/index.html', ['game', 'canvas'], 'intermediate'],
  ['Day 76', 'Animated Searchbar', './public/Animated%20Searchbar/index.html', ['ui', 'css', 'javascript'], 'beginner'],
  ['Day 77', 'Rock-Paper-Scissor-game project', './public/Stone-Paper-Scissor/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 78', 'NPM Package Search', './public/NPM%20Package%20Search/index.html', ['tool', 'api', 'javascript'], 'intermediate'],
  ['Day 79', 'Linkedin Homepage Clone', './public/Linkedin-Clone/index.html', ['clone', 'css'], 'intermediate'],
  ['Day 80', 'Resume Studio', './public/ResumeStudio/index.html', ['tool', 'javascript'], 'intermediate'],
  ['Day 81', 'Simon Says Game', './public/Simon_Says_Game/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 82', 'Love Calculator Game', './public/Love-Calculator/index.html', ['game', 'javascript'], 'beginner'],
  ['Day 83', 'Exchange Currency', './public/Exchange_Currency/index.html', ['tool', 'api', 'javascript'], 'intermediate'],
  ['Day 84', 'Lights Out Puzzle', './public/Lights_Out_Puzzle/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 85', 'Image Search Engine', './public/Image Search Engine/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 86', 'Profile Card', './public/3d profile Card/index.html', ['ui', 'css'], 'beginner'],
  ['Day 87', 'Breakout game', './public/Breakout game/index.html', ['game', 'canvas'], 'intermediate'],
  ['Day 88', 'Job dashboard', './public/Job dashboard/jobs.html', ['tool', 'javascript'], 'intermediate'],
  ['Day 89', 'N-Queen', './public/N_Queen/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 90', 'Quiz App Timer', './public/QuizeApp Timer/index1.html', ['javascript'], 'beginner'],
  ['Day 91', 'Voting Application Backend', 'https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Voting_Application_Backend', ['api', 'javascript'], 'intermediate'],
  ['Day 92', 'Slide puzzle Game', './public/Slide puzzle Game/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 93', 'TextUtils', './public/Textutils/public/index.html', ['javascript'], 'beginner'],
  ['Day 94', 'Hangman Game', './public/HangmanGame/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 95', 'TodoList in React TS Tailwind', './public/TodoList-React-TS-Tailwind/index.html', ['todo', 'javascript'], 'intermediate'],
  ['Day 96', 'HCL Color Generator', './public/HCL Color Generator/index.html', ['ui', 'css', 'javascript'], 'beginner'],
  ['Day 97', 'Time Capsule', './public/Time-Capsule/index.html', ['javascript'], 'intermediate'],
  ['Day 98', 'Virtual Piano', './public/Virtual Piano/index.html', ['css', 'javascript'], 'intermediate'],
  ['Day 99', 'NASA-APOD Extension', './public/NASA-APOD/popup.html', ['api', 'javascript'], 'intermediate'],
  ['Day 100', 'Text Saver Extension', './public/Text_Saver_Ext/popup.html', ['todo', 'javascript'], 'intermediate'],
  ['Day 101', 'Personal Finance Tracker', './public/FinanceTracker/index.html', ['todo', 'javascript'], 'intermediate'],
  ['Day 102', 'Travel Booking Website', './public/Travel_booking_website/index.html', ['javascript'], 'intermediate'],
  ['Day 103', 'Drumkit Game', './public/Drumkit_Game/index.html', ['game', 'javascript'], 'beginner'],
  ['Day 104', 'Debug-Website', './public/Debug-Website/index.html', ['css'], 'beginner'],
  ['Day 105', 'Periodic Table', './public/Periodic Table/index.html', ['css', 'javascript'], 'beginner'],
  ['Day 106', 'Plants Website', './public/Plants Website/index.html', ['css'], 'beginner'],
  ['Day 107', 'DocNow', './public/DocNow/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 108', 'expense_Tracker', './public/expense_Tracker/index.html', ['todo', 'javascript'], 'intermediate'],
  ['Day 109', 'Mood Tracker', './public/Mood Tracker/index.html', ['todo', 'javascript'], 'intermediate'],
  ['Day 110', 'CRYPTOSHOW', './public/CRYPTOSHOW/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 111', 'Whack-a-Mole Game', './public/Whack-a-Mole Game/index.html', ['game', 'canvas'], 'intermediate'],
  ['Day 112', 'Nykaa Clone Website', './public/Nykaa-clone/index.html', ['clone', 'css'], 'intermediate'],
  ['Day 113', 'CPU Scheduler', './public/CpuScheduler/index.html', ['tool', 'javascript'], 'intermediate'],
  ['Day 114', 'EchoNotes', './public/EchoNotes/index.html', ['todo', 'javascript'], 'intermediate'],
  ['Day 115', 'Event Registration System', 'https://event-registration-system-w10a.onrender.com/', ['api', 'javascript'], 'intermediate'],
  ['Day 116', 'AI Image Classifier', './public/AI%20Image%20Classifier/index.html', ['api', 'javascript'], 'intermediate'],
  ['Day 117', 'Habit Tracker Web App', './public/Habit-Tracker-Web-App/index.html', ['ui', 'tool', 'html', 'css', 'js'], 'intermediate'],
  ['Day 118', 'Particle Effect', './public/particle-effect/index.html', ['ui', 'html', 'css', 'js', 'canvas'], 'intermediate'],
  ['Day 119', 'Virtual Playground', './playground.html', ['ui', 'game', 'html', 'css', 'js'], 'intermediate'],
  ['Day 120', 'Typing Speed Test', './public/typing_test/index.html', ['html', 'css', 'js', 'game'], 'intermediate'],
  ['Day 121', 'InterviewSimulator', './public/InterviewSimulator/index.html', ['tool'], 'intermediate'],
  ['Day 122', 'AstronomyDashboard', './public/AstronomyDashboard/astro.html', ['html', 'css', 'javascript', 'api-javascript'], 'Advanced'],
  ['Day 123', 'Pomodoro Timer', './public/Pomodoro_Timer/index.html', ['productivity', 'tool'], 'intermediate'],
  ['Day 124', 'Hurdle Highway 2D', './public/Hurdle_Highway_2D/index.html', ['game'], 'intermediate'],
  ['Day 125', 'Snakeladder', './public/snakeladder/index.html', ['game'], 'intermediate'],
  ['Day 126', 'Temperature Converter', './public/TemperatureConverter/index.html', ['tool', 'javascript'], 'beginner'],
  ['Day 127', 'Particle Wave Animation', './public/Particle Wave Animation/index.html', ['css', 'javascript'], 'intermediate'],
  ['Day 128', 'Reaction Time Test', './public/reaction-time-tester/main.html', ['animation', 'simulation', 'html', 'css', 'js', 'javascript'], 'intermediate'],
  ['Day 129', 'YouTube Clone', './public/youtube clone/index.html', ['Html', 'CSS'], 'beginner'],
  ['Day 130', 'Dino Game', './public/DinoGame/DinoGame-main/index.html', ['game', 'javascript'], 'beginner'],
  ['Day 131', 'Retro Highway Racer', './public/RetroHighwayRacer/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 132', 'Pokedex', './public/Pokedex/index.html', ['utility'], 'intermediate'],
  ['Day 133', 'Stock Market Simulator', './public/stock-market-simulator/index.html', ['simulator'], 'intermediate'],
  ['Day 134', 'Coin Scratch', './public/Coin Scratch/index.html', ['asmr', 'game'], 'intermediate'],
  ['Day 135', 'Shooting game', './public/shooting game/index.html', ['2d', 'game'], 'intermediate'],
  ['Day 136', 'Sudoku Solver', './public/sudoku-solver/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 137', 'Maths Quiz Game', './public/maths-quiz-game/index.html', ['game', 'javascript'], 'intermediate'],
  ['Day 138', 'Age Calculator', './public/age-calculator/index.html', ['tool', 'javascript'], 'beginner'],
  ['Day 139', 'Ludo game', './public/Ludo-game/index.html', ['Html', 'css', 'javascript'], 'intermediate'],
  ['Day 140', 'Big Sales Prediction', './public/BigSales-Prediction/frontend/index.html', ['machine', 'learning', 'python', 'javascript'], 'advanced'],
  ['Day 141', 'Dice Roller', './public/Dice-Roller/main.html', ['html', 'css', 'javascript'], 'intermediate'],
  ['Day 142', 'Geo Guesser game', './public/geo-guesser/index.html', ['map', 'game'], 'intermediate'],
  ['Day 143', 'Morse Code Translator', './public/MorseCodeTranslator/index.html', ['html', 'css', 'javascript'], 'beginner'],
  ['Day 144', 'Car Racing game', './public/racing game/index.html', ['html', 'css', 'js'], 'intermediate'],
  ['Day 145', 'Magic 8 Ball', './public/magic-8ball/main.html', ['simulation', 'html', 'css', 'javascript'], 'beginner'],
  ['Day 146', 'Data Sructures Visualizer', './public/Data Structures Visualizer/index.html', ['visualizer'], 'intermediate'],
  ['Day 147', 'Chronosphere', './public/Chronosphere/index.html', ['game', 'canvas'], 'intermediate'],
  ['Day 148', 'Contest Tracker', './public/ContestTracker/index.html', ['tool', 'javascript'], 'advanced'],
  ['Day 149', 'GitHub Profile Battle', './public/Github-Profile-Battle/index.html', ['tool', 'javascript'], 'advanced'],
  ['Day 150', 'App Privacy Policy Generator', './public/AppPrivacyPolicyGenerator/index.html', ['tool', 'javascript'], 'intermediate'],
  ['Day 151', 'Mini Carrom Game', './public/mini carrom/index.html', ['html', 'css', 'javascript'], 'intermediate'],
  ['Day 152', 'Physics Ball Simulation', './public/PhysicsBallSimulation/index.html', ['html', 'css', 'javascript', 'canvas'], 'advanced'],
  ['Day 153', 'Material3 Showcase', './public/Material3Showcase/index.html', ['tool', 'javascript'], 'intermediate'],
  ['Day 154', 'FocusRoom', './public/FocusRoom/index.html', ['html', 'css', 'javascript', 'productivity', 'timer', 'tasks', 'ambient'], 'intermediate'],
  ['Day 155', 'Hangman Game', './public/hangman-react-ts/HangmanGame/index.html', ['tool','react', 'typescript', 'game', 'hangman', 'vite'], 'advanced'],
  ['Day 156', 'Placement Predictor', './public/Placement-Predictor/index.html', ['tool', 'javascript', 'html', 'css'], 'advanced'],
  ['Day 157', 'Map Route Tracker', './public/Vector-Map-Route-Tracer/index.html', ['tool','html', 'css', 'javascript'], 'advanced'],
  ['Day 158', 'GitHub Promo Maker', './public/GitHubPromoMaker/index.html', ['tool','html', 'css', 'javascript'], 'intermediate'],
  ['Day 159', 'Dining Philosophers Simulation', './public/Dining Philosophers Simulation/index.html', ['simulation', 'algorithm', 'javascript'], 'intermediate'],
  ['Day 160', 'Website Personalizer', './public/WebsitePersonalizer/index.html', ['tool','html', 'css', 'javascript'], 'intermediate'],
  ['Day 161', 'Unit-Converter', './public/Unit-Converter/index.html', ['tool', 'javascript', 'html', 'css'], 'intermediate'],
  ['Day 162', 'Color Palette From Art Generator', './public/ColorPaletteArtGenerator/index.html', ['tool','html', 'css', 'javascript'], 'intermediate'],
  ['Day 163', 'Ai Image Editor', './public/image-editor/index.html', ['edits', 'images'], 'advanced'],
  ['Day 164', 'Code Visualizer Playground', './public/code-visualizer-playground/index.html', ['tool', 'javascript', 'html', 'css'], 'advanced'],
  ['Day 165', 'Amazon Clone', './public/AmazonClone/index.html', ['tool','Amazon', 'Clone', 'HTML', 'CSS', 'JavaScript'], 'beginner'],
  ['Day 166', 'Boredom Buster', './public/BoredomBuster/index.html', ['tool','html', 'css', 'javascript'], 'advanced'],
  ['Day 167', 'scam-sms-detector', '/public/scam-sms-detector/index.html', ['tool', 'api', 'javascript'], 'intermediate'],
  ['Day 168', 'Color Sort Puzzle game','./public/color%20sort%20puzzle/index.html',['tool','html', 'css', 'javascript'],'advanced'],
  ['Day 169', 'Subscription Tracker', './public/subscriptiontracker/tracker.html', ['tool','react', 'typescript', 'tailwindcss', 'ui'], 'advanced'],
  ['Day 170', 'Vector Flowchart Designer', './public/VectorFlowchartDesigner/index.html', ['tool','html', 'css', 'javascript'], 'advanced'],
  ["Day 171", "Glyph Pattern Maker", "./public/GlyphPatternMaker/index.html", ['tool','html','css' ,'javascript'],'advanced'],
  ['Day 172', 'PlaceMate', './public/PlaceMate/index.html', ['tool', 'javascript', 'html', 'css'], 'advanced'],
  ['Day 173', 'AI-Resume-Analyzer', './public/AI-Resume-Analyzer/index.html', ['tool', 'javascript', 'html', 'css'], 'advanced'],
  ['Day 174', 'Unit Kitchen', './public/Unit-Kitchen/index.html', ['html', 'css', 'javascript','game'], 'intermediate'],
   ['Day 175', 'Fruit Slice game', './public/fruitslice/index.html', ['html', 'css', 'javascript','game'], 'intermediate'],

];
const PROJECTS = PROJECT_DATA;
const PROJECT_DESCRIPTIONS = {

"To-Do List":
"Manage daily tasks efficiently with an interactive checklist system. Add, track and organize activities using a simple productivity-focused interface.",

"Digital Clock":
"Real-time digital clock displaying current time updates instantly. A beginner-friendly project exploring JavaScript timing functions.",

"Indian Flag":
"CSS recreation of the Indian national flag using shapes and positioning. Demonstrates layout precision and styling fundamentals.",

"Dropdown Nav Bar":
"Responsive navigation bar with expandable dropdown interactions. Useful for understanding hover states and menu structures.",

"Animated Cursor":
"Custom cursor animation adding engaging movement effects across the page. Focuses on interactivity and modern UI enhancements.",

"Auto Background Image Slider":
"Automatically rotating image slider with smooth transitions. Introduces timing events and dynamic visual presentation.",

"Typewriter":
"Typing animation effect simulating text being written live. Great for learning intervals and DOM manipulation.",

"Parallel-X Website":
"Parallax-inspired website showcasing layered scrolling effects. Designed to improve frontend animation techniques.",

"Captcha Generator":
"Generates random captcha strings for validation practice. Demonstrates input checking and security concepts.",

"QR Code Generator":
"Converts text or links into downloadable QR codes instantly. Integrates APIs with practical utility functionality.",

"Serve Website Using Express":
"Basic Express server setup for hosting web applications. Introduces backend routing fundamentals.",

"Nodemailer Contact Form":
"Email contact form capable of sending messages directly. Uses Nodemailer for backend communication.",

"Login Form Using MERN":
"Authentication workflow using MongoDB, Express, React and Node. Covers login handling and user validation.",

"File Uploader":
"Upload and manage files through a simple interface. Useful for understanding forms and storage workflows.",

"Progress Bar":
"Animated progress indicator tracking completion visually. Focuses on UI feedback and transitions.",

"Scroll Bar CSS":
"Custom scrollbar styling improving overall aesthetics. Demonstrates advanced CSS customization.",

"Slider Using Swiper API":
"Interactive content slider built with Swiper integration. Supports responsive navigation effects.",

"Carousel Solar System":
"Solar system themed rotating carousel with visual motion effects. Combines creativity with CSS animation.",

"Planto":
"Nature-inspired landing page emphasizing clean layouts and styling. Designed for frontend practice.",

"EveSparks":
"Interactive web experience featuring modern interface components. Focuses on responsiveness and usability.",

"Video BG Slider Using React":
"React-based slider with dynamic video backgrounds. Explores multimedia integration in interfaces.",

"Page Loader":
"Animated loading screen improving perceived performance. Useful for polished UI experiences.",

"Jarvis Virtual Assistant":
"Voice-enabled assistant inspired by AI interactions. Combines speech recognition and automation concepts.",

"Chat Bot":
"Conversational chatbot interface supporting user interactions. Demonstrates API integration and messaging flow.",

"Tic-Tac-Toe":
"Classic two-player game built with JavaScript logic. Strengthens conditional rendering skills.",

"Maze Game":
"Navigate through a maze while avoiding obstacles. Focuses on movement controls and game mechanics.",

"Memory Game":
"Card matching challenge testing short-term memory skills. Introduces arrays and state tracking.",

"Wordle":
"Word guessing game inspired by the popular puzzle format. Practices input handling and logic.",

"Snake Game":
"Classic snake gameplay with score tracking mechanics. Useful for learning loops and collision detection.",

"Flappy-bird-game":
"Obstacle avoidance game inspired by Flappy Bird. Covers animation timing and physics simulation.",

"Password Manager":
"Secure utility for storing and organizing passwords efficiently. Helps explore data handling and user-focused productivity features.",

"Missionaries & Cannibals":
"Logic puzzle based on the classic river crossing challenge. Strengthens problem-solving and conditional programming skills.",

"Weather Forecasting":
"Fetches and displays real-time weather information dynamically. Demonstrates API usage and responsive UI updates.",

"Email Validator":
"Checks whether email inputs follow valid formatting rules. Useful for learning regex and form validation techniques.",

"Vanilla-JavaScript-Calculator":
"Fully functional calculator handling arithmetic operations interactively. Reinforces DOM manipulation and event handling.",

"Medical App":
"Healthcare-themed interface designed for information display and accessibility. Focuses on practical frontend implementation.",

"2048 Game":
"Number-merging puzzle game inspired by the popular 2048 challenge. Builds logic handling and game state management.",

"Github Profile Finder":
"Search GitHub users and display profile information instantly. Uses APIs to retrieve and present live data.",

"Notes App":
"Create, edit and manage notes in a lightweight productivity environment. Useful for local storage concepts.",

"Analog Clock":
"Animated analog clock displaying real-time updates with rotating hands. Demonstrates transformations and timing functions.",

"Scroll Dark Game":
"Endless scrolling game with dark-themed visuals and interactive mechanics. Introduces animation loops and collision logic.",

"Amazon App":
"Frontend clone inspired by Amazon layouts and shopping interfaces. Improves responsive design and UI structuring skills.",

"Password Generator":
"Automatically generates strong passwords for better security practices. Combines randomness with utility design.",

"BMI Calculator":
"Computes body mass index based on user input values. Demonstrates calculations and dynamic output rendering.",

"Black Jack":
"Card game recreation implementing score logic and gameplay rules. Strengthens decision-making algorithms.",

"Palindrome Generator":
"Checks whether words or phrases read the same backwards. Introduces string manipulation techniques.",

"Ping Pong Game":
"Arcade-style ping pong experience using movement and collision detection. Reinforces game physics concepts.",

"TextToVoiceConverter":
"Converts typed text into spoken audio using browser capabilities. Explores accessibility and speech APIs.",

"Url Shortener":
"Transforms long links into shorter manageable URLs. Demonstrates backend communication and API workflows.",

"Recipe Genie":
"Searches or suggests recipes through an interactive cooking assistant interface. Focuses on API integration.",

"Netflix Landing Page Clone":
"Replica of Netflix homepage design emphasizing layouts and responsiveness. Useful for frontend practice.",

"ClimaCode":
"Weather-focused application presenting climate information elegantly. Combines APIs with modern UI patterns.",

"E-Commerce Website with Simple Cart Functionality":
"Online shopping interface featuring product listings and cart management. Introduces state handling concepts.",

"Budget Tracker":
"Tracks expenses and income to monitor financial habits efficiently. Designed for productivity and calculations.",

"Cricket Game":
"Interactive cricket-inspired game with score handling mechanics. Helps practice JavaScript game logic.",

"Pastebin using svelte":
"Simple text sharing platform built with Svelte technologies. Explores modern frontend frameworks.",

"Glowing Social Media Icons":
"Animated glowing icon effects enhancing social media sections visually. Focuses on CSS transitions and styling.",

"Music App":
"Music-themed interface supporting playback and interactive controls. Demonstrates multimedia integration concepts.",

"Blog Page":
"Responsive blog layout designed for article presentation and readability. Reinforces UI structuring principles.",

"Marketing template website":
"Landing page template optimized for promotions and product showcases. Emphasizes modern web design patterns.",

"Hologram Button":
"Futuristic button design featuring glowing holographic effects. Explores advanced CSS styling and animations.",

"Solar System Explorer":
"Interactive visualization of planets and orbital layouts using CSS. Combines creativity with motion effects.",

"Image to Text App":
"Extracts text content from uploaded images automatically. Demonstrates OCR concepts and API integration.",

"Zomato-clone":
"Restaurant platform inspired interface replicating browsing and discovery layouts. Improves frontend structuring skills.",

"The Cube":
"3D cube animation showcasing depth and motion interactions. Focuses on transforms and visual effects.",

"Flask Authentication App":
"Authentication workflow built around secure login concepts. Introduces backend validation and user management.",

"Blog-Website":
"Responsive blogging interface optimized for publishing content cleanly. Emphasizes readability and layout design.",

"3d Rotating Card":
"Animated rotating card effect creating depth and interactivity. Useful for modern UI experimentation.",

"Spotify Clone Project":
"Music streaming inspired interface replicating playlists and navigation patterns. Reinforces responsive layouts.",

"Insect-Catch_Game":
"Fast-paced insect catching game with score mechanics and movement. Practices event handling and gameplay logic.",

"Quotely Laughs":
"Generates random humorous quotes to entertain users instantly. Uses APIs and dynamic rendering.",

"Contact Book":
"Store, organize and manage contacts within a simple interface. Focuses on CRUD operations.",

"Candy_Crush_Game":
"Puzzle matching game inspired by Candy Crush mechanics. Builds grid logic and state handling.",

"Stock Profit Calculator":
"Calculates gains or losses from stock investments interactively. Useful for financial utility development.",

"code-space-game project":
"Space-themed gameplay with obstacles and movement controls. Strengthens animation and collision detection skills.",

"Animated Searchbar":
"Expandable search component with smooth transition effects. Improves understanding of interactive UI design.",

"Rock-Paper-Scissor-game project":
"Classic decision game implemented with score tracking logic. Ideal for beginners learning conditions.",

"NPM Package Search":
"Search and explore NPM packages dynamically through APIs. Demonstrates practical developer utilities.",

"Linkedin Homepage Clone":
"Frontend recreation of LinkedIn’s homepage structure and styling. Improves layout accuracy and responsiveness.",

"Resume Studio":
"Tool for creating and managing resumes with structured formatting. Focuses on productivity-oriented interfaces.",

"Simon Says Game":
"Memory-based game requiring players to repeat patterns correctly. Reinforces arrays and event sequences.",

"Love Calculator Game":
"Fun calculator estimating compatibility scores between names. Designed as a lightweight interactive project.",

"Exchange Currency":
"Converts currencies using real-time exchange values. Combines APIs with practical financial utilities.",

"Lights Out Puzzle":
"Logic puzzle where players switch lights off strategically. Builds reasoning and state management skills.",

"Image Search Engine":
"Searches and displays images dynamically from external sources. Demonstrates API integration workflows.",

"Profile Card":
"Stylized profile card showcasing user information creatively. Focuses on clean UI presentation.",

"Breakout game":
"Brick-breaking arcade game featuring collision and scoring systems. Reinforces game development fundamentals.",

"Job dashboard":
"Dashboard interface for managing or exploring job opportunities efficiently. Emphasizes organization and usability.",

"N-Queen":
"Classic N-Queen problem visualized through interactive implementation. Strengthens algorithmic thinking.",

"Quiz App Timer":
"Timed quiz application combining countdown logic with question handling. Useful for event-driven programming.",

"Voting Application Backend":
"Backend-focused project handling votes and user interactions securely. Introduces server-side concepts.",

"Slide puzzle Game":
"Tile sliding puzzle requiring logical movement strategies. Reinforces grid manipulation skills.",

"TextUtils":
"Utility tool performing text formatting and transformation operations. Demonstrates string processing concepts.",

"Hangman Game":
"Word guessing game with progressive hints and challenge mechanics. Strengthens conditional logic.",

"TodoList in React TS Tailwind":
"Modern to-do application built with React, TypeScript and Tailwind. Explores scalable frontend architecture.",

"HCL Color Generator":
"Generate HCL color values for design experimentation and palettes. Useful for UI customization projects.",

"Time Capsule":
"Store messages or memories intended for future viewing. Combines creativity with local storage concepts.",

"Virtual Piano":
"Playable piano simulation responding to keyboard or click inputs. Demonstrates multimedia interactions.",

"NASA-APOD Extension":
"Displays NASA’s Astronomy Picture of the Day automatically. Integrates external APIs into browser extensions.",

"Text Saver Extension":
"Browser extension for quickly saving and organizing text snippets. Focuses on productivity workflows.",

"Personal Finance Tracker":
"Monitor expenses, savings and financial habits through interactive tracking tools. Designed to improve budgeting awareness.",

"Travel Booking Website":
"Travel-focused interface for exploring destinations and booking experiences. Emphasizes responsive layouts and usability.",

"Drumkit Game":
"Virtual drum kit producing sounds through keyboard interactions. Demonstrates event handling and audio APIs.",

"Debug-Website":
"Practice environment for identifying and fixing frontend issues efficiently. Useful for improving debugging skills.",

"Periodic Table":
"Interactive periodic table displaying chemical elements and information. Combines education with engaging design.",

"Plants Website":
"Nature-inspired website emphasizing clean visuals and aesthetic layouts. Focuses on frontend styling techniques.",

"DocNow":
"Document-focused utility designed for managing or interacting with information efficiently. Prioritizes usability.",

"expense_Tracker":
"Track spending habits and monitor expenses through simple visual summaries. Useful for productivity workflows.",

"Mood Tracker":
"Record emotions over time and observe personal mood patterns. Combines wellness concepts with data tracking.",

"CRYPTOSHOW":
"Displays cryptocurrency information dynamically with market-related insights. Introduces API usage and dashboards.",

"Whack-a-Mole Game":
"Fast-paced reaction game requiring players to hit appearing targets quickly. Reinforces timing and score logic.",

"Nykaa Clone Website":
"Beauty and shopping platform clone inspired by Nykaa layouts. Strengthens frontend replication skills.",

"CPU Scheduler":
"Visualizes CPU scheduling algorithms and execution behavior interactively. Useful for understanding operating system concepts.",

"EchoNotes":
"Note-taking application focused on organizing thoughts and quick information capture. Emphasizes productivity.",

"Event Registration System":
"Manage event signups and participant information efficiently. Demonstrates forms and backend interactions.",

"AI Image Classifier":
"Classifies uploaded images using AI-based prediction concepts. Introduces machine learning integrations.",

"Habit Tracker Web App":
"Track routines and monitor consistency across personal habits over time. Encourages productivity and discipline.",

"Particle Effect":
"Interactive particle animation creating visually engaging motion effects. Focuses on graphics and performance.",

"Virtual Playground":
"Experimental environment featuring playful interactions and frontend concepts. Designed for exploration.",

"Typing Speed Test":
"Measure typing speed and accuracy with real-time performance metrics. Useful for event-driven programming.",

"InterviewSimulator":
"Simulates interview experiences to practice responses and preparation strategies. Focuses on utility design.",

"AstronomyDashboard":
"Dashboard presenting astronomy-related information through organized visuals and APIs. Combines science with UI.",

"Pomodoro Timer":
"Productivity timer implementing focused work sessions and breaks. Encourages time management habits.",

"Hurdle Highway 2D":
"Obstacle avoidance game with side-scrolling movement mechanics. Strengthens animation and collision handling.",

"Snakeladder":
"Digital adaptation of the classic Snake and Ladder board game. Introduces turn-based logic implementation.",

"Temperature Converter":
"Convert temperature values between multiple units instantly. Practical utility for calculations and form handling.",

"Particle Wave Animation":
"Animated wave effects created through particle systems and motion. Demonstrates creative frontend experimentation.",

"Reaction Time Test":
"Measures how quickly users respond to visual prompts interactively. Useful for timing logic and events.",

"YouTube Clone":
"Frontend recreation of YouTube layouts including navigation and content sections. Improves responsive design skills.",

"Dino Game":
"Endless runner inspired by the offline Chrome dinosaur game. Builds movement and collision mechanics.",

"Retro Highway Racer":
"Retro-style racing game featuring speed and obstacle navigation. Reinforces animation loops and gameplay logic.",

"Pokedex":
"Browse Pokémon information through an interactive Pokédex interface. Combines APIs with engaging visuals.",

"Stock Market Simulator":
"Simulate investment decisions and market behaviors without real risk. Introduces finance-focused logic.",

"Coin Scratch":
"Interactive scratch-card experience with satisfying reveal mechanics. Focuses on effects and user engagement.",

"Shooting game":
"Action game involving aiming, shooting and score progression. Strengthens gameplay mechanics implementation.",

"Sudoku Solver":
"Automatically solves Sudoku puzzles while demonstrating algorithmic reasoning. Useful for logic practice.",

"Maths Quiz Game":
"Interactive quiz testing mathematical knowledge under game-like conditions. Combines learning with engagement.",

"Age Calculator":
"Calculates age instantly from user-entered birth dates. Demonstrates date handling and calculations.",

"Ludo game":
"Digital version of the classic Ludo board game with turn-based mechanics. Reinforces logic and interactions.",

"Big Sales Prediction":
"Machine learning project predicting sales trends from input data. Combines analytics with practical AI concepts.",

"Dice Roller":
"Virtual dice simulator generating random outcomes instantly. Useful for games and probability demonstrations.",

"Geo Guesser game":
"Location guessing challenge testing geographical knowledge interactively. Combines maps with gameplay mechanics.",

"Morse Code Translator":
"Convert text into Morse code and decode messages seamlessly. Demonstrates string transformations and utilities.",

"Car Racing game":
"Fast-paced racing experience with movement controls and obstacles. Reinforces animation and collision handling.",

"Magic 8 Ball":
"Digital version of the classic prediction toy offering random responses. Focuses on interactivity and randomness.",

"Data Sructures Visualizer":
"Visual representation of data structures and their operations. Useful for understanding algorithms conceptually.",

"Chronosphere":
"Time-themed interactive experience with dynamic gameplay mechanics. Blends creativity with animation concepts.",

"Contest Tracker":
"Track coding contests and upcoming competitive programming events efficiently. Designed for productivity.",

"GitHub Profile Battle":
"Compare GitHub profiles using metrics and statistics interactively. Integrates APIs with developer-focused utilities.",

"App Privacy Policy Generator":
"Generate privacy policies for applications through structured inputs. Practical productivity-oriented utility.",

"Mini Carrom Game":
"Digital carrom simulation recreating board-game mechanics interactively. Reinforces physics and collision handling.",

"Physics Ball Simulation":
"Ball movement simulation demonstrating gravity and physical interactions. Useful for learning physics concepts.",

"Material3 Showcase":
"Collection of Material Design inspired UI components and interactions. Focuses on modern interface patterns.",

"FocusRoom":
"Productivity environment designed to support concentration and task completion. Combines timers and ambience.",

"Hangman Game":
"Advanced Hangman implementation using React and TypeScript architecture. Strengthens component-based thinking.",

"Placement Predictor":
"Predicts placement possibilities using user-provided academic information. Demonstrates logic and analytics concepts.",

"Map Route Tracker":
"Visualize routes and track paths using interactive map elements. Combines location services with frontend development.",

"GitHub Promo Maker":
"Create promotional GitHub banners or visuals quickly. Designed as a developer productivity utility.",

"Dining Philosophers Simulation":
"Simulation of the classic synchronization problem in computer science. Useful for understanding concurrency concepts.",

"Website Personalizer":
"Customize website appearance and behavior through user preferences dynamically. Emphasizes personalization features.",

"Unit-Converter":
"Convert values across multiple measurement units instantly. Practical tool demonstrating calculations and form handling.",

"Color Palette From Art Generator":
"Extract color palettes from artwork automatically for design inspiration. Combines creativity with utility.",

"Ai Image Editor":
"Edit and manipulate images using AI-assisted functionality. Explores machine learning and visual processing concepts.",

"Code Visualizer Playground":
"Interactive environment visualizing code behavior and execution flow. Useful for learning programming concepts.",

"Amazon Clone":
"Beginner-friendly clone inspired by Amazon’s interface and layouts. Reinforces frontend structure and styling.",

"Boredom Buster":
"Suggests activities or interactive ideas to reduce boredom instantly. Designed as a fun productivity utility.",

"scam-sms-detector":
"Detect potentially fraudulent SMS messages using analysis techniques. Introduces AI and security-focused concepts.",

"Color Sort Puzzle game":
"Puzzle game requiring players to organize colors strategically. Builds logical thinking and state management.",

"Subscription Tracker":
"Track recurring subscriptions and monitor expenses efficiently. Useful for budgeting and organization.",

"Vector Flowchart Designer":
"Design editable flowcharts visually through interactive components. Focuses on productivity and diagram creation.",

"Glyph Pattern Maker":
"Generate creative symbol-based patterns with customizable outputs. Explores procedural visual generation.",

"PlaceMate":
"Utility designed to simplify location-related planning or organization tasks. Prioritizes usability and convenience.",

"AI-Resume-Analyzer":
"Analyze resumes using AI concepts to provide insights and feedback. Combines machine learning with productivity.",

"Unit Kitchen":
"Kitchen-focused converter simplifying ingredient and measurement transformations. Practical everyday utility.",

};

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
let techStackFilter = 'all';
let difficultyFilter = 'all';

function renderGrid() {
  const grid = document.getElementById('projectGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  const filtered = PROJECTS.filter(([day, name, url, tags, difficulty = '']) => {
    // Category filter
    const category = getCategoryFromTags(tags, name);
    const targetCategory = FILTER_CATEGORY_MAP[activeFilter] || 'all';
    const matchesFilter = activeFilter === 'all' || category === targetCategory;

    // Search filter
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || q.split(/\s+/).every(term =>
      name.toLowerCase().includes(term) ||
      day.toLowerCase().includes(term) ||
      ((Array.isArray(tags) ? tags.join(' ') : (tags || '')).toLowerCase().includes(term))
    );

    // Tech stack dropdown filter
    let matchesTech = true;
    if (techStackFilter && techStackFilter !== 'all') {
      const tagStr = (Array.isArray(tags) ? tags.join(' ') : (tags || '')).toLowerCase();
      matchesTech = tagStr.includes(techStackFilter.toLowerCase());
    }

    // Difficulty filter
    let matchesDifficulty = true;
    if (difficultyFilter && difficultyFilter !== 'all') {
      matchesDifficulty = (difficulty || '').toLowerCase() === difficultyFilter.toLowerCase();
    }

    return matchesFilter && matchesSearch && matchesTech && matchesDifficulty;
  });

  // Apply sorting
  if (sortOption === 'az') {
    filtered.sort((a, b) => a[1].localeCompare(b[1]));
  } else if (sortOption === 'latest') {
    filtered.sort((a, b) => {
      const dayA = parseInt(a[0].replace('Day ', ''));
      const dayB = parseInt(b[0].replace('Day ', ''));
      return dayB - dayA;
    });
  } else if (sortOption === 'difficulty') {
    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
    filtered.sort((a, b) => {
      const diffA = a[4] ? difficultyOrder[a[4].toLowerCase()] || 0 : 0;
      const diffB = b[4] ? difficultyOrder[b[4].toLowerCase()] || 0 : 0;
      return diffA - diffB;
    });
  }

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.style.display = 'none';
    if (noResults) noResults.style.display = 'block';
    const container = document.getElementById('paginationContainer');
    if (container) container.remove();
    return;
  }

  grid.style.display = 'grid';
  if (noResults) noResults.style.display = 'none';

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageItems = filtered.slice(startIndex, endIndex);
  const fragment = document.createDocumentFragment();

  pageItems.forEach(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const card = document.createElement('div');

    // FIX PART 1: Add a pointer cursor so users know it's clickable
    card.className = 'project-card';
    card.style.cursor = 'pointer';

    // FIX PART 2: Make the whole card clickable to open the demo in a new tab
    card.onclick = () => window.open(url.trim(), '_blank');

    const isBookmarked = bookmarkedProjects.some((item) => item[0] === day);
    const tagsArray = typeof tags === 'string' ? tags.split(/\s+/).filter((t) => t) : tags;
    const tagsHTML = tagsArray.map((t) => `<span class="tag">${t}</span>`).join('');
    const sourceUrl = getSourceUrl(url);
    const description =
  PROJECT_DESCRIPTIONS[name] ||
  "Explore this project to discover interactive functionality, frontend concepts and implementation details.";

    // FIX PART 3: Add onclick="event.stopPropagation()" to the Demo, Code, and Bookmark buttons
    // This stops the click from "bubbling up" to the main card, preventing double-opening!
    card.innerHTML = `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${category}</span>
            </div>
            <div class="card-name">${name}</div>

<div class="card-description">
    ${description}
</div>

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

    fragment.appendChild(card);
  });
  grid.appendChild(fragment);
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
    const tagsArray = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(/\s+/).filter(t => t) : []);
    const tagsHTML = tagsArray.map((tag) => `<span class="tag">${tag}</span>`).join('');
    const sourceUrl = getSourceUrl(url);

    card.innerHTML = `
            <div class="card-meta">
                <span class="card-day">${day}</span>
                <span class="card-category">${category}</span>
            </div>
           <div class="card-name">${name}</div>

<div class="card-description">
    ${description}
</div>

<div class="card-tags">
    ${tagsHTML}
</div>
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
    const tagsArray = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(/\s+/).filter(t => t) : []);
    const tagsHTML = tagsArray.map((tag) => `<span class="tag">${tag}</span>`).join('');
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
const copyBookmarksBtn = document.getElementById('copyBookmarksBtn');

if (bookmarkToggleBtn) {
  bookmarkToggleBtn.addEventListener('click', () => {
    showAllBookmarks = !showAllBookmarks;
    bookmarkToggleBtn.textContent = showAllBookmarks ? 'Show Less' : 'View All';
    renderBookmarks();
  });
}

if (copyBookmarksBtn) {
  copyBookmarksBtn.addEventListener('click', async () => {
    if (bookmarkedProjects.length === 0) {
      showToast('No bookmarks to copy!');
      return;
    }
    const textToCopy = bookmarkedProjects.map(p => {
      const projectName = p[1];
      const projectLink = new URL(p[2], window.location.href).href;
      return `${projectName} - ${projectLink}`;
    }).join('\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('Bookmarks copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy bookmarks.');
    }
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
   LIVE SEARCH & TECH STACK FILTER
   ============================================================ */
function debounce(fn, delay = 300) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener(
    'input',
    debounce(() => {
      searchQuery = input.value.trim();
      currentPage = 1;
      renderGrid();
    }, 180)
  );

  // Tech stack dropdown filter listener
  const techStack = document.getElementById('techStackFilter');
  if (techStack) {
    techStack.addEventListener('change', () => {
      techStackFilter = techStack.value;
      currentPage = 1;
      renderGrid();
    });
  }

  // Difficulty dropdown filter listener
  const diffFilterElement = document.getElementById('difficultyFilter');
  if (diffFilterElement) {
    diffFilterElement.addEventListener('change', () => {
      difficultyFilter = diffFilterElement.value;
      currentPage = 1;
      renderGrid();
    });
  }
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

  let debounceTimer;

  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const value = e.target.value.trim().toLowerCase();

      if (value) {
        const techs = value.split(/[,\s]+/).filter(t => t.length > 0);
        techStackFilters = [...new Set(techs)];
        updateTechFilterDisplay();
        currentPage = 1;
        renderGrid();
      } else {
        clearAllTechFilters();
      }
    }, 300);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearAllTechFilters();
    });
  }

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    }
  });
}

/* ============================================================
   SEARCH CONTROLS
   ============================================================ */
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');

function updateCategoryCounts() {
  const counts = {};
  for (const key of Object.keys(FILTER_CATEGORY_MAP)) {
    if (key !== 'all') {
      counts[key] = 0;
    }
  }

  PROJECTS.forEach(([day, name, url, tags]) => {
    const category = getCategoryFromTags(tags, name);
    const filterKey = Object.keys(FILTER_CATEGORY_MAP).find(
      (key) => FILTER_CATEGORY_MAP[key] === category
    );
    if (filterKey && filterKey !== 'all') {
      counts[filterKey]++;
    }
  });

  const categorySpans = {
    'game': document.getElementById('gameCount'),
    'clone': document.getElementById('cloneCount'),
    'tool': document.getElementById('toolCount'),
    'ui': document.getElementById('uiCount'),
    'api': document.getElementById('apiCount')
  };

  for (const [key, span] of Object.entries(categorySpans)) {
    if (span) {
      span.textContent = counts[key].toLocaleString();
    }
  }
}

function syncProjectCounts() {
  let filtered = [...PROJECTS];

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter(([day, name]) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      day.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const total = filtered.length.toLocaleString();
  const countNodes = [document.getElementById('projectCount'), document.getElementById('allCount')];

  countNodes.forEach((node) => {
    if (node) node.textContent = total;
  });

  if (searchInput) {
    searchInput.placeholder = `Search ${PROJECTS.length.toLocaleString()} projects…`;
  }

  updateCategoryCounts();
}

// Clear button functionality
if (searchInput && clearSearchBtn) {
  clearSearchBtn.addEventListener("click", () => {
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

// Initialize
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
    : `<a class="btn btn-ghost btn-sm" href="${base}index.html"><i class="fas fa-home"></i> Home</a>`;

  if (username) {
    container.innerHTML = `
            ${themeButton}
            <span class="welcome-text">Hi, ${username}</span>
            <button class="btn btn-ghost btn-sm" id="logoutBtn">Log out</button>
            <a class="btn btn-ghost btn-sm" href="https://www.github-readme.tech" target="_blank">Generate README</a>
            <a class="btn btn-ghost btn-sm" href="https://github.com/dhairyagothi/100_days_100_web_project" target="_blank">
              <i class="fab fa-github"></i> GitHub
            </a>
            ${otherLink}
        `;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      window.username = null;
      updateNavbar();
    });
  } else {
    container.innerHTML = `
            ${themeButton}
            ${otherLink}
            <a class="btn btn-ghost btn-sm" href="https://github.com/dhairyagothi/100_days_100_web_project" target="_blank">
                <i class="fab fa-github"></i> GitHub
            </a>
            <a class="btn btn-ghost btn-sm" href="https://www.github-readme.tech" target="_blank">Generate README</a>
            <a class="btn btn-primary btn-sm" href="${base}public/Login.html">Sign in</a>
        `;
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
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    btn.classList.toggle('show', scrollTop > 400);

    if (ring) {
      ring.style.strokeDashoffset = circumference * (1 - progress);
    }
  };

  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initCurrentYear() {
  document.querySelectorAll('[data-current-year], #Current-Year').forEach((node) => {
    node.textContent = new Date().getFullYear();
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

  initCurrentYear();
  initFilterChips();
  initSearch();
  initSorting();
  initTechStackSearch();

  syncProjectCounts();
  fetchRepoStats();
  initScrollBtn();

  if (hasProjectGrid()) {
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
window.addEventListener(
  'resize',
  debounce(() => {
    if (hasProjectGrid()) {
      renderGrid();
    }
  }, 180)
);

/* ============================================================
   EXPOSE FUNCTIONS TO GLOBAL SCOPE
   (Required for HTML onclick handlers)
   ============================================================ */
window.removeTechFilter = removeTechFilter;
window.clearAllTechFilters = clearAllTechFilters;

// Particle Network Background
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointerQuery = window.matchMedia('(pointer: coarse)');
  const palette = [220, 250, 280];
  const DEFAULT_PARTICLE_FPS = 36;
  let W = 0;
  let H = 0;
  let dpr = 1;
  let particles = [];
  let particleCount = 0;
  let linkDistance = 0;
  let maxDistanceSq = 0;
  let frameInterval = 1000 / DEFAULT_PARTICLE_FPS;
  let animationFrame = 0;
  let resizeFrame = 0;
  let lastFrameTime = 0;

  const getProfile = () => {
    const smallScreen = window.innerWidth <= 768 || coarsePointerQuery.matches;
    const reducedMotion = reducedMotionQuery.matches;
    const disableAnimation = smallScreen || reducedMotion;

    return {
      minParticles: reducedMotion ? 8 : smallScreen ? 12 : 24,
      maxParticles: reducedMotion ? 18 : smallScreen ? 28 : 72,
      areaPerParticle: reducedMotion ? 110000 : smallScreen ? 70000 : 26000,
      linkDistance: reducedMotion ? 68 : smallScreen ? 84 : 120,
      velocity: reducedMotion ? 0.12 : smallScreen ? 0.18 : 0.3,
      radius: reducedMotion ? 1.8 : smallScreen ? 2.2 : 4,
      fps: reducedMotion ? 14 : smallScreen ? 20 : 36,
      showLinks: !reducedMotion && !smallScreen,
      disableAnimation,
    };
  };

  let profile = getProfile();

  function resize() {
    profile = getProfile();
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, profile.showLinks ? 1.5 : 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particleCount = Math.min(
      profile.maxParticles,
      Math.max(profile.minParticles, Math.round((W * H) / profile.areaPerParticle))
    );
    linkDistance = profile.linkDistance;
    maxDistanceSq = linkDistance * linkDistance;
    frameInterval = 1000 / profile.fps;
  }

  function init() {
    particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * profile.velocity,
      vy: (Math.random() - 0.5) * profile.velocity,
      r: Math.random() * profile.radius + 0.8,
      hue: palette[Math.floor(Math.random() * palette.length)],
      alpha: Math.random() * 0.45 + 0.18,
    }));
  }

  function stepParticles() {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = W;
      else if (particle.x > W) particle.x = 0;

      if (particle.y < 0) particle.y = H;
      else if (particle.y > H) particle.y = 0;
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    stepParticles();

    if (profile.showLinks) {
      for (let i = 0; i < particleCount; i += 1) {
        for (let j = i + 1; j < particleCount; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq >= maxDistanceSq) continue;

          const distance = Math.sqrt(distanceSq);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${(1 - distance / linkDistance) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${particle.hue}, 80%, 72%, ${particle.alpha})`;
      ctx.fill();
    });
  }

  function draw(now = 0) {
    animationFrame = requestAnimationFrame(draw);

    if (document.hidden || now - lastFrameTime < frameInterval) {
      return;
    }

    lastFrameTime = now;
    drawFrame();
  }

  function stopAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  }

  function startAnimation() {
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(draw);
    }
  }

  const rebuild = () => {
    resize();

    if (profile.disableAnimation) {
      stopAnimation();
      ctx.clearRect(0, 0, W, H);
      canvas.style.display = 'none';
      return;
    }

    canvas.style.display = '';
    init();
    startAnimation();
  };

  const handleResize = () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      rebuild();
    });
  };

  const handleProfileChange = () => {
    lastFrameTime = 0;
    rebuild();
  };

  const bindMediaChange = (query, handler) => {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', handler);
      return;
    }
    if (typeof query.addListener === 'function') {
      query.addListener(handler);
    }
  };

  window.addEventListener('resize', handleResize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      lastFrameTime = 0;
    }
  });
  bindMediaChange(reducedMotionQuery, handleProfileChange);
  bindMediaChange(coarsePointerQuery, handleProfileChange);

  rebuild();
})();

// =============================================
// PERSISTENT FILTERS & SEARCH — Issue #3320
// =============================================

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') || '',
    category: params.get('category') || 'all'
  };
}

function updateURL(search, category) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category && category !== 'all') params.set('category', category);
  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  history.pushState({ search, category }, '', newURL);
}

function restoreStateFromURL() {
  const { search, category } = getQueryParams();
  const searchInput = document.getElementById('searchInput') ||
    document.querySelector('input[type="text"]') ||
    document.querySelector('.search-input');
  if (searchInput && search) searchInput.value = search;
  const categoryFilter = document.getElementById('category');
  if (categoryFilter && category !== 'all') categoryFilter.value = category;
  if (search || category !== 'all') applyFilters(search, category);
}

function applyFilters(search, category) {
  searchQuery = search || '';
  activeFilter = category || 'all';
  currentPage = 1;

  // Sync active chip selection with URL state
  const chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach((chip) => {
    if (chip.dataset.filter === activeFilter) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  renderGrid();
}

document.addEventListener('DOMContentLoaded', () => {
  restoreStateFromURL();
  const searchInput = document.getElementById('search') ||
    document.querySelector('input[type="text"]') ||
    document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const { category } = getQueryParams();
      updateURL(searchInput.value, category);
      applyFilters(searchInput.value, category);
    });
  }
  const categoryFilter = document.getElementById('category');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      const { search } = getQueryParams();
      updateURL(search, categoryFilter.value);
      applyFilters(search, categoryFilter.value);
    });
  }
  window.addEventListener('popstate', () => restoreStateFromURL());
});
