/**
 * MovieHub - Movie Explorer App Logic
 */

// ==========================================================================
// Mock Movie Data (20+ Movies)
// ==========================================================================
const moviesData = [
    { id: 1, title: "Inception", genre: "Sci-Fi", rating: 4.8, year: 2010, description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop", cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page", director: "Christopher Nolan" },
    { id: 2, title: "The Dark Knight", genre: "Action", rating: 4.9, year: 2008, description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=800&auto=format&fit=crop", cast: "Christian Bale, Heath Ledger, Aaron Eckhart", director: "Christopher Nolan" },
    { id: 3, title: "Interstellar", genre: "Sci-Fi", rating: 4.7, year: 2014, description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain", director: "Christopher Nolan" },
    { id: 4, title: "Parasite", genre: "Drama", rating: 4.6, year: 2019, description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop", cast: "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong", director: "Bong Joon Ho" },
    { id: 5, title: "Avengers: Endgame", genre: "Action", rating: 4.5, year: 2019, description: "After the devastating events of Infinity War, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.", image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=800&auto=format&fit=crop", cast: "Robert Downey Jr., Chris Evans, Mark Ruffalo", director: "Anthony Russo, Joe Russo" },
    { id: 6, title: "Spirited Away", genre: "Animation", rating: 4.8, year: 2001, description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop", cast: "Rumi Hiiragi, Miyu Irino, Mari Natsuki", director: "Hayao Miyazaki" },
    { id: 7, title: "Spider-Man: Into the Spider-Verse", genre: "Animation", rating: 4.7, year: 2018, description: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.", image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800&auto=format&fit=crop", cast: "Shameik Moore, Jake Johnson, Hailee Steinfeld", director: "Bob Persichetti, Peter Ramsey, Rodney Rothman" },
    { id: 8, title: "The Matrix", genre: "Sci-Fi", rating: 4.7, year: 1999, description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop", cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss", director: "Lana Wachowski, Lilly Wachowski" },
    { id: 9, title: "Mad Max: Fury Road", genre: "Action", rating: 4.6, year: 2015, description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.", image: "https://images.unsplash.com/photo-1473220464506-698d249f809d?q=80&w=800&auto=format&fit=crop", cast: "Tom Hardy, Charlize Theron, Nicholas Hoult", director: "George Miller" },
    { id: 10, title: "Joker", genre: "Drama", rating: 4.4, year: 2019, description: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.", image: "https://images.unsplash.com/photo-1613679074971-91fc27180061?q=80&w=800&auto=format&fit=crop", cast: "Joaquin Phoenix, Robert De Niro, Zazie Beetz", director: "Todd Phillips" },
    { id: 11, title: "Get Out", genre: "Horror", rating: 4.5, year: 2017, description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.", image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop", cast: "Daniel Kaluuya, Allison Williams, Bradley Whitford", director: "Jordan Peele" },
    { id: 12, title: "Knives Out", genre: "Comedy", rating: 4.3, year: 2019, description: "A detective investigates the death of a patriarch of an eccentric, combative family.", image: "https://images.unsplash.com/photo-1584652868574-0669f4292976?q=80&w=800&auto=format&fit=crop", cast: "Daniel Craig, Chris Evans, Ana de Armas", director: "Rian Johnson" },
    { id: 13, title: "La La Land", genre: "Romance", rating: 4.4, year: 2016, description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.", image: "https://images.unsplash.com/photo-1517482813155-83e20ecddbe6?q=80&w=800&auto=format&fit=crop", cast: "Ryan Gosling, Emma Stone, Rosemarie DeWitt", director: "Damien Chazelle" },
    { id: 14, title: "A Quiet Place", genre: "Horror", rating: 4.3, year: 2018, description: "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.", image: "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?q=80&w=800&auto=format&fit=crop", cast: "Emily Blunt, John Krasinski, Millicent Simmonds", director: "John Krasinski" },
    { id: 15, title: "The Grand Budapest Hotel", genre: "Comedy", rating: 4.5, year: 2014, description: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.", image: "https://images.unsplash.com/photo-1582719478250-c89402bb73e5?q=80&w=800&auto=format&fit=crop", cast: "Ralph Fiennes, F. Murray Abraham, Mathieu Amalric", director: "Wes Anderson" },
    { id: 16, title: "Gone Girl", genre: "Thriller", rating: 4.4, year: 2014, description: "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it's suspected that he may not be innocent.", image: "https://images.unsplash.com/photo-1533227260815-584cd5c15fb0?q=80&w=800&auto=format&fit=crop", cast: "Ben Affleck, Rosamund Pike, Neil Patrick Harris", director: "David Fincher" },
    { id: 17, title: "Dune", genre: "Sci-Fi", rating: 4.6, year: 2021, description: "Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.", image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=800&auto=format&fit=crop", cast: "Timothée Chalamet, Rebecca Ferguson, Zendaya", director: "Denis Villeneuve" },
    { id: 18, title: "Deadpool", genre: "Comedy", rating: 4.3, year: 2016, description: "A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.", image: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?q=80&w=800&auto=format&fit=crop", cast: "Ryan Reynolds, Morena Baccarin, T.J. Miller", director: "Tim Miller" },
    { id: 19, title: "Titanic", genre: "Romance", rating: 4.4, year: 1997, description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop", cast: "Leonardo DiCaprio, Kate Winslet, Billy Zane", director: "James Cameron" },
    { id: 20, title: "Gladiator", genre: "Action", rating: 4.5, year: 2000, description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.", image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop", cast: "Russell Crowe, Joaquin Phoenix, Connie Nielsen", director: "Ridley Scott" }
];

// ==========================================================================
// State Variables
// ==========================================================================
let currentMovies = [...moviesData];
let favorites = JSON.parse(localStorage.getItem('moviehub_favorites')) || [];
let watchlist = JSON.parse(localStorage.getItem('moviehub_watchlist')) || [];
let activeGenre = 'All';
let currentSearch = '';

// ==========================================================================
// DOM Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Init rendering
    renderMovies(currentMovies);
    renderFavorites();
    renderWatchlist();
    checkTheme();
    initHero();

    // Elements
    const navbar = document.getElementById('navbar');
    const searchInput = document.getElementById('nav-search-input');
    const genreBtns = document.querySelectorAll('.genre-btn');
    const sortSelect = document.getElementById('sort-select');
    
    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Search Input
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase();
        applyFilters();
        
        // Scroll to movies if not already there
        if (currentSearch.length > 2 && window.scrollY < 300) {
            document.getElementById('movies-container').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Genre Filter Buttons
    genreBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            genreBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            activeGenre = e.target.dataset.genre;
            
            // Update section title
            const titleEl = document.getElementById('section-title');
            titleEl.textContent = activeGenre === 'All' ? 'Trending Now' : `${activeGenre} Movies`;
            
            applyFilters();
            
            // Close mobile sidebar if open
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar-filters').classList.remove('active');
                document.getElementById('overlay').classList.remove('active');
            }
        });
    });

    // Sort Select
    sortSelect.addEventListener('change', (e) => {
        handleSort(e.target.value);
    });

    // Empty State Reset
    document.getElementById('reset-filters-btn').addEventListener('click', () => {
        searchInput.value = '';
        currentSearch = '';
        activeGenre = 'All';
        sortSelect.value = 'default';
        
        genreBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('.genre-btn[data-genre="All"]').classList.add('active');
        document.getElementById('section-title').textContent = 'Trending Now';
        
        applyFilters();
    });

    // Mobile Menu & Modals Setup
    setupSidebarsAndModals();

    // Event Delegation for dynamic buttons
    document.body.addEventListener('click', (e) => {
        // Toggle Favorite
        if (e.target.closest('.action-btn.fav') || e.target.closest('#modal-fav-btn')) {
            const btn = e.target.closest('.action-btn.fav') || e.target.closest('#modal-fav-btn');
            const id = parseInt(btn.dataset.id);
            if(id) toggleFavorite(id, btn);
            e.stopPropagation();
        }
        
        // Toggle Watchlist
        if (e.target.closest('.action-btn.watch') || e.target.closest('#modal-watchlist-btn')) {
            const btn = e.target.closest('.action-btn.watch') || e.target.closest('#modal-watchlist-btn');
            const id = parseInt(btn.dataset.id);
            if(id) toggleWatchlist(id, btn);
            e.stopPropagation();
        }

        // View Details (Movie Card click)
        if (e.target.closest('.movie-card')) {
            // Check if they clicked an action button instead
            if (!e.target.closest('.action-btn')) {
                const id = parseInt(e.target.closest('.movie-card').dataset.id);
                openMovieDetails(id);
            }
        }
        
        // Remove from list buttons
        if (e.target.closest('.remove-fav-btn')) {
            const id = parseInt(e.target.closest('.remove-fav-btn').dataset.id);
            toggleFavorite(id);
        }
        if (e.target.closest('.remove-watch-btn')) {
            const id = parseInt(e.target.closest('.remove-watch-btn').dataset.id);
            toggleWatchlist(id);
        }
    });

    // Modal Star Rating UI interaction
    document.querySelectorAll('.star-rate').forEach(star => {
        star.addEventListener('click', (e) => {
            const val = parseInt(e.target.dataset.val);
            const stars = document.querySelectorAll('.star-rate');
            stars.forEach((s, idx) => {
                if (idx < val) {
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid');
                } else {
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular');
                }
            });
            showToast('Rating submitted successfully!');
        });
    });
});

// ==========================================================================
// Rendering Functions
// ==========================================================================

function renderMovies(movies) {
    const grid = document.getElementById('movies-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (movies.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        grid.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
    }
}

function createMovieCard(movie) {
    const isFav = favorites.some(f => f.id === movie.id);
    const isWatch = watchlist.some(w => w.id === movie.id);
    
    return `
        <div class="movie-card" data-id="${movie.id}">
            <img src="${movie.image}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="movie-overlay">
                <h3 class="movie-overlay-title" title="${movie.title}">${movie.title}</h3>
                <div class="movie-overlay-meta">
                    <span>${movie.year} &bull; ${movie.genre}</span>
                    <span><i class="fa-solid fa-star" style="color: var(--accent-color)"></i> ${movie.rating}</span>
                </div>
                <div class="movie-overlay-actions">
                    <button class="action-btn fav ${isFav ? 'active' : ''}" data-id="${movie.id}" title="${isFav ? 'Remove Favorite' : 'Add Favorite'}">
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                    <button class="action-btn watch ${isWatch ? 'active' : ''}" data-id="${movie.id}" title="${isWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}">
                        <i class="fa-${isWatch ? 'solid' : 'regular'} fa-bookmark"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function initHero() {
    const hero = document.getElementById('hero');
    // Set hero background image to match the featured movie (Inception)
    hero.style.backgroundImage = `url('https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1920&auto=format&fit=crop')`;
    
    document.getElementById('hero-play-btn').addEventListener('click', () => {
        showToast('Trailer playback is not available in this demo.', 'info');
    });
    
    document.getElementById('hero-details-btn').addEventListener('click', () => {
        openMovieDetails(1); // ID 1 is Inception
    });
}

// ==========================================================================
// Search, Filter, Sort Logic
// ==========================================================================

function applyFilters() {
    let filtered = moviesData;

    if (activeGenre !== 'All') {
        filtered = filtered.filter(m => m.genre === activeGenre);
    }

    if (currentSearch) {
        filtered = filtered.filter(m => 
            m.title.toLowerCase().includes(currentSearch) ||
            m.genre.toLowerCase().includes(currentSearch)
        );
    }

    currentMovies = filtered;
    
    const sortVal = document.getElementById('sort-select').value;
    handleSort(sortVal, false); // sort without immediate re-render
    
    renderMovies(currentMovies);
}

function handleSort(sortType, reRender = true) {
    switch (sortType) {
        case 'rating-desc':
            currentMovies.sort((a, b) => b.rating - a.rating);
            break;
        case 'name-asc':
            currentMovies.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            currentMovies.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'year-desc':
            currentMovies.sort((a, b) => b.year - a.year);
            break;
        default:
            currentMovies.sort((a, b) => a.id - b.id); // default by ID
            break;
    }
    
    if (reRender) {
        renderMovies(currentMovies);
    }
}

// ==========================================================================
// Favorites & Watchlist Logic
// ==========================================================================

function toggleFavorite(id, btnElement = null) {
    const movie = moviesData.find(m => m.id === id);
    if (!movie) return;

    const index = favorites.findIndex(f => f.id === id);
    let isAdded = false;

    if (index > -1) {
        favorites.splice(index, 1);
        showToast(`Removed "${movie.title}" from Favorites`);
    } else {
        favorites.push(movie);
        isAdded = true;
        showToast(`Added "${movie.title}" to Favorites ❤️`, 'success');
    }

    localStorage.setItem('moviehub_favorites', JSON.stringify(favorites));
    renderFavorites();
    
    // Update all relevant UI buttons
    const favBtns = document.querySelectorAll(`.action-btn.fav[data-id="${id}"], #modal-fav-btn[data-id="${id}"]`);
    favBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        if (isAdded) {
            btn.classList.add('active');
            icon.classList.replace('fa-regular', 'fa-solid');
            btn.style.color = 'var(--primary-color)';
            if(btn.id !== 'modal-fav-btn') btn.style.borderColor = 'var(--primary-color)';
        } else {
            btn.classList.remove('active');
            icon.classList.replace('fa-solid', 'fa-regular');
            btn.style.color = '';
            if(btn.id !== 'modal-fav-btn') btn.style.borderColor = '';
        }
    });
}

function toggleWatchlist(id, btnElement = null) {
    const movie = moviesData.find(m => m.id === id);
    if (!movie) return;

    const index = watchlist.findIndex(w => w.id === id);
    let isAdded = false;

    if (index > -1) {
        watchlist.splice(index, 1);
        showToast(`Removed "${movie.title}" from Watchlist`);
    } else {
        watchlist.push(movie);
        isAdded = true;
        showToast(`Added "${movie.title}" to Watchlist 📌`, 'success');
    }

    localStorage.setItem('moviehub_watchlist', JSON.stringify(watchlist));
    renderWatchlist();
    
    // Update all relevant UI buttons
    const watchBtns = document.querySelectorAll(`.action-btn.watch[data-id="${id}"], #modal-watchlist-btn[data-id="${id}"]`);
    watchBtns.forEach(btn => {
        const icon = btn.querySelector('i');
        if (isAdded) {
            btn.classList.add('active');
            icon.classList.replace('fa-regular', 'fa-solid');
            btn.style.color = 'var(--accent-color)';
            if(btn.id !== 'modal-watchlist-btn') btn.style.borderColor = 'var(--accent-color)';
        } else {
            btn.classList.remove('active');
            icon.classList.replace('fa-solid', 'fa-regular');
            btn.style.color = '';
            if(btn.id !== 'modal-watchlist-btn') btn.style.borderColor = '';
        }
    });
}

function renderFavorites() {
    const container = document.getElementById('favorites-list');
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-list">
                <i class="fa-regular fa-heart"></i>
                <p>No favorites yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = favorites.map(m => `
        <div class="list-item">
            <img src="${m.image}" class="list-item-img" alt="${m.title}">
            <div class="list-item-info">
                <div class="list-item-title">${m.title}</div>
                <div class="list-item-meta">${m.year} &bull; ${m.genre}</div>
            </div>
            <button class="icon-btn remove-fav-btn" data-id="${m.id}" title="Remove">
                <i class="fa-solid fa-trash" style="font-size: 0.9rem; color: var(--text-secondary);"></i>
            </button>
        </div>
    `).join('');
}

function renderWatchlist() {
    const container = document.getElementById('watchlist-list');
    if (watchlist.length === 0) {
        container.innerHTML = `
            <div class="empty-list">
                <i class="fa-regular fa-bookmark"></i>
                <p>Watchlist is empty.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = watchlist.map(m => `
        <div class="list-item">
            <img src="${m.image}" class="list-item-img" alt="${m.title}">
            <div class="list-item-info">
                <div class="list-item-title">${m.title}</div>
                <div class="list-item-meta">${m.year} &bull; ${m.genre}</div>
            </div>
            <button class="icon-btn remove-watch-btn" data-id="${m.id}" title="Remove">
                <i class="fa-solid fa-trash" style="font-size: 0.9rem; color: var(--text-secondary);"></i>
            </button>
        </div>
    `).join('');
}

// ==========================================================================
// Movie Details Modal
// ==========================================================================

function openMovieDetails(id) {
    const movie = moviesData.find(m => m.id === id);
    if (!movie) return;

    // Reset star rating UI
    document.querySelectorAll('.star-rate').forEach(s => {
        s.classList.remove('fa-solid');
        s.classList.add('fa-regular');
    });

    // Populate data
    document.getElementById('modal-hero').style.backgroundImage = `url('${movie.image}')`;
    document.getElementById('modal-title').textContent = movie.title;
    document.getElementById('modal-year').textContent = movie.year;
    document.getElementById('modal-genre').textContent = movie.genre;
    document.getElementById('modal-desc').textContent = movie.description;
    document.getElementById('modal-cast').textContent = movie.cast;
    document.getElementById('modal-director').textContent = movie.director;
    document.getElementById('modal-rating').textContent = movie.rating;

    // Update Action buttons state
    const isFav = favorites.some(f => f.id === id);
    const favBtn = document.getElementById('modal-fav-btn');
    favBtn.dataset.id = id;
    if(isFav) {
        favBtn.classList.add('active');
        favBtn.querySelector('i').classList.replace('fa-regular', 'fa-solid');
        favBtn.style.color = 'var(--primary-color)';
    } else {
        favBtn.classList.remove('active');
        favBtn.querySelector('i').classList.replace('fa-solid', 'fa-regular');
        favBtn.style.color = '';
    }

    const isWatch = watchlist.some(w => w.id === id);
    const watchBtn = document.getElementById('modal-watchlist-btn');
    watchBtn.dataset.id = id;
    if(isWatch) {
        watchBtn.classList.add('active');
        watchBtn.querySelector('i').classList.replace('fa-regular', 'fa-solid');
        watchBtn.style.color = 'var(--accent-color)';
    } else {
        watchBtn.classList.remove('active');
        watchBtn.querySelector('i').classList.replace('fa-solid', 'fa-regular');
        watchBtn.style.color = '';
    }

    // Show modal
    document.getElementById('movie-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// ==========================================================================
// Utility: Sidebars, Modals & Toast
// ==========================================================================

function setupSidebarsAndModals() {
    const overlay = document.getElementById('overlay');
    
    const closeAll = () => {
        document.querySelectorAll('.right-sidebar, .modal').forEach(el => el.classList.remove('active'));
        document.getElementById('sidebar-filters').classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('nav-links').classList.remove('active'); // mobile menu
    };

    overlay.addEventListener('click', closeAll);
    document.querySelectorAll('.close-modal, .close-right-sidebar, #close-filters-btn').forEach(btn => {
        btn.addEventListener('click', closeAll);
    });

    // Mobile Menu Toggle
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('nav-links').classList.toggle('active');
    });

    // Nav Links handling
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            if(link.dataset.target === 'home-section') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                closeAll();
            } else if (link.dataset.target === 'movies-section') {
                document.getElementById('movies-container').scrollIntoView({ behavior: 'smooth' });
                closeAll();
            }
        });
    });

    // Favorites Sidebar Toggle
    document.getElementById('nav-favorites').addEventListener('click', (e) => {
        e.preventDefault();
        closeAll();
        document.getElementById('favorites-sidebar').classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Watchlist Sidebar Toggle
    document.getElementById('nav-watchlist').addEventListener('click', (e) => {
        e.preventDefault();
        closeAll();
        document.getElementById('watchlist-sidebar').classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Mobile Filters Sidebar Toggle
    document.getElementById('mobile-filters-btn').addEventListener('click', () => {
        document.getElementById('sidebar-filters').classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

function showToast(message, type = 'default') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast`;
    
    // Can customize styling based on type if needed
    if (type === 'success') toast.style.backgroundColor = 'var(--accent-color)';

    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}

// ==========================================================================
// Dark/Light Mode Theme Toggle
// ==========================================================================

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('moviehub_theme', isDark ? 'dark' : 'light');
    
    updateThemeIcon(isDark);
}

function checkTheme() {
    // Default is dark mode in HTML, check if user explicitly saved 'light'
    const savedTheme = localStorage.getItem('moviehub_theme');
    
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        updateThemeIcon(false);
    } else {
        updateThemeIcon(true);
    }
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('#theme-toggle i');
    if (isDark) {
        icon.classList.replace('fa-moon', 'fa-sun'); // Show sun to toggle light
    } else {
        icon.classList.replace('fa-sun', 'fa-moon'); // Show moon to toggle dark
    }
}
