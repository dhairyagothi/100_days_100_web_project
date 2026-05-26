// ============= SAMPLE MOVIES DATA ============= 
const MOVIES_DATA = [
    {
        id: 1,
        title: "Stranger Things",
        genre: "trending",
        rating: "8.7/10"
    },
    {
        id: 2,
        title: "The Crown",
        genre: "trending",
        rating: "8.6/10"
    },
    {
        id: 3,
        title: "Breaking Bad",
        genre: "trending",
        rating: "9.5/10"
    },
    {
        id: 4,
        title: "The Office",
        genre: "trending",
        rating: "9.0/10"
    },
    {
        id: 5,
        title: "Mission Impossible",
        genre: "action",
        rating: "7.7/10"
    },
    {
        id: 6,
        title: "John Wick",
        genre: "action",
        rating: "7.4/10"
    },
    {
        id: 7,
        title: "Mad Max",
        genre: "action",
        rating: "8.1/10"
    },
    {
        id: 8,
        title: "Top Gun",
        genre: "action",
        rating: "8.0/10"
    },
    {
        id: 9,
        title: "The Handmaid's Tale",
        genre: "drama",
        rating: "8.4/10"
    },
    {
        id: 10,
        title: "Chernobyl",
        genre: "drama",
        rating: "9.3/10"
    },
    {
        id: 11,
        title: "The Irishman",
        genre: "drama",
        rating: "8.2/10"
    },
    {
        id: 12,
        title: "Ozark",
        genre: "drama",
        rating: "8.5/10"
    }
];

// ============= USER DATABASE (LocalStorage) ============= 
function initUserDatabase() {
    if (!localStorage.getItem('netflixUsers')) {
        localStorage.setItem('netflixUsers', JSON.stringify([]));
    }
}

function getAllUsers() {
    return JSON.parse(localStorage.getItem('netflixUsers') || '[]');
}

function saveUser(userData) {
    const users = getAllUsers();
    users.push(userData);
    localStorage.setItem('netflixUsers', JSON.stringify(users));
}

function findUserByEmail(email) {
    const users = getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function setCurrentUser(userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function logoutUser() {
    localStorage.removeItem('currentUser');
}

// ============= MODAL FUNCTIONS ============= 
function openSignupModal() {
    document.getElementById('signupModal').classList.add('active');
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('active');
    document.getElementById('signupForm').reset();
}

function openSigninModal() {
    document.getElementById('signinModal').classList.add('active');
}

function closeSigninModal() {
    document.getElementById('signinModal').classList.remove('active');
    document.getElementById('signinForm').reset();
}

function switchToSignUp() {
    closeSigninModal();
    openSignupModal();
}

function switchToSignIn() {
    closeSignupModal();
    openSigninModal();
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    const signupModal = document.getElementById('signupModal');
    const signinModal = document.getElementById('signinModal');
    
    if (event.target === signupModal) {
        closeSignupModal();
    }
    if (event.target === signinModal) {
        closeSigninModal();
    }
});

// ============= AUTHENTICATION FLOW ============= 
function setupAuthListeners() {
    // Step 1: User enters email and clicks "Get Started"
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('heroEmail').value.trim();
            
            // Validate email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Check if user exists
            const existingUser = findUserByEmail(email);
            
            if (existingUser) {
                // User exists - show sign in modal
                document.getElementById('signinEmail').value = email;
                document.getElementById('signinForm').dataset.prefilled = 'true';
                openSigninModal();
            } else {
                // New user - show sign up modal
                document.getElementById('signupEmail').value = email;
                openSignupModal();
            }
        });
    }

    // Step 2: User signs up (creates new account)
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;

            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters');
                return;
            }

            // Check if user already exists
            if (findUserByEmail(email)) {
                alert('This email is already registered. Please sign in instead.');
                switchToSignIn();
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                name: name,
                email: email,
                password: password, // In real app, this should be hashed
                createdAt: new Date().toISOString()
            };

            saveUser(newUser);
            setCurrentUser(newUser);
            
            closeSignupModal();
            showMoviesPage();
        });
    }

    // Step 3: User signs in (existing account)
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('signinEmail').value.trim();
            const password = document.getElementById('signinPassword').value;

            const user = findUserByEmail(email);

            if (!user) {
                alert('User not found. Please create an account.');
                closeSigninModal();
                openSignupModal();
                return;
            }

            if (user.password !== password) {
                alert('Incorrect password. Please try again.');
                return;
            }

            setCurrentUser(user);
            closeSigninModal();
            showMoviesPage();
        });
    }
}

// ============= MOVIES PAGE FUNCTIONALITY ============= 
function showMoviesPage() {
    // Hide landing page
    document.getElementById('landingPage').classList.add('hidden');
    
    // Show movies page
    document.getElementById('moviesPage').classList.remove('hidden');
    
    // Update user greeting
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('userGreeting').textContent = `Welcome, ${currentUser.name}!`;
    }

    // Render movies
    renderMovies();
    
    // Initialize search
    initMovieSearch();
}

function renderMovies() {
    const trendingContainer = document.getElementById('trendingMovies');
    const actionContainer = document.getElementById('actionMovies');
    const dramaContainer = document.getElementById('dramaMovies');

    const trendingMovies = MOVIES_DATA.filter(m => m.genre === 'trending');
    const actionMovies = MOVIES_DATA.filter(m => m.genre === 'action');
    const dramaMovies = MOVIES_DATA.filter(m => m.genre === 'drama');

    trendingContainer.innerHTML = createMovieCards(trendingMovies);
    actionContainer.innerHTML = createMovieCards(actionMovies);
    dramaContainer.innerHTML = createMovieCards(dramaMovies);
}

function createMovieCards(movies) {
    return movies.map(movie => `
        <div class="movie-card">
            <div class="movie-poster">
                <span style="font-size: 12px;">🎬 ${movie.title}</span>
            </div>
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-rating">⭐ ${movie.rating}</div>
            </div>
        </div>
    `).join('');
}

function initMovieSearch() {
    const searchInput = document.getElementById('searchMovies');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length === 0) {
            renderMovies();
            return;
        }

        const filteredMovies = MOVIES_DATA.filter(m => 
            m.title.toLowerCase().includes(query)
        );

        const containers = {
            'trendingMovies': filteredMovies.filter(m => m.genre === 'trending'),
            'actionMovies': filteredMovies.filter(m => m.genre === 'action'),
            'dramaMovies': filteredMovies.filter(m => m.genre === 'drama')
        };

        Object.keys(containers).forEach(key => {
            document.getElementById(key).innerHTML = createMovieCards(containers[key]);
        });
    });
}

// ============= LOGOUT FUNCTIONALITY ============= 
function setupLogoutListener() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                logoutUser();
                
                // Hide movies page
                document.getElementById('moviesPage').classList.add('hidden');
                
                // Show landing page
                document.getElementById('landingPage').classList.remove('hidden');
                
                // Reset hero form
                document.getElementById('heroEmail').value = '';
            }
        });
    }
}

// ============= NAVBAR SIGN IN BUTTON ============= 
function setupNavbarListener() {
    const navSignInBtn = document.getElementById('navSignInBtn');
    if (navSignInBtn) {
        navSignInBtn.addEventListener('click', () => {
            openSigninModal();
            document.getElementById('signinForm').dataset.prefilled = '';
        });
    }
}

// ============= THEME TOGGLE (Landing Page) ============= 
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

// ============= SCROLL EFFECTS ============= 
// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// ============= FAQ ACCORDION ============= 
function toggleFAQ(button) {
    button.classList.toggle('active');
    const answer = button.nextElementSibling;
    answer.classList.toggle('active');
}

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        toggleFAQ(button);
    });
});

// ============= INITIALIZATION ============= 
document.addEventListener('DOMContentLoaded', () => {
    console.log('Netflix Clone Loaded');
    
    // Initialize user database
    initUserDatabase();
    
    // Initialize theme
    initTheme();
    
    // Setup event listeners
    setupAuthListeners();
    setupLogoutListener();
    setupNavbarListener();
    
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        showMoviesPage();
    }
});