/**
 * Mood-Based Music Recommender - Main Logic
 */

/* ==========================================================================
   Dataset Setup
   ========================================================================== */
const musicDatabase = [
    // Happy
    { id: 'h1', title: 'Walking On Sunshine', artist: 'Katrina & The Waves', genre: 'Pop', mood: 'Happy', cover: 'https://images.unsplash.com/photo-1533053303648-52fb0fb3e9df?w=150&q=80', matchBase: 95 },
    { id: 'h2', title: 'Happy', artist: 'Pharrell Williams', genre: 'Pop', mood: 'Happy', cover: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=150&q=80', matchBase: 98 },
    { id: 'h3', title: 'Good Vibrations', artist: 'The Beach Boys', genre: 'Rock', mood: 'Happy', cover: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=150&q=80', matchBase: 92 },
    { id: 'h4', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', genre: 'Funk', mood: 'Happy', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80', matchBase: 94 },
    { id: 'h5', title: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake', genre: 'Pop', mood: 'Happy', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&q=80', matchBase: 96 },

    // Sad
    { id: 's1', title: 'Someone Like You', artist: 'Adele', genre: 'Pop', mood: 'Sad', cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&q=80', matchBase: 97 },
    { id: 's2', title: 'Fix You', artist: 'Coldplay', genre: 'Alt Rock', mood: 'Sad', cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150&q=80', matchBase: 95 },
    { id: 's3', title: 'Yesterday', artist: 'The Beatles', genre: 'Rock', mood: 'Sad', cover: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=150&q=80', matchBase: 92 },
    { id: 's4', title: 'Breathe Me', artist: 'Sia', genre: 'Indie', mood: 'Sad', cover: 'https://images.unsplash.com/photo-1498843053639-170ff2122f35?w=150&q=80', matchBase: 94 },
    { id: 's5', title: 'Skinny Love', artist: 'Bon Iver', genre: 'Indie Folk', mood: 'Sad', cover: 'https://images.unsplash.com/photo-1515286438640-eeaf5cc79d04?w=150&q=80', matchBase: 96 },

    // Relaxed
    { id: 'r1', title: 'Weightless', artist: 'Marconi Union', genre: 'Ambient', mood: 'Relaxed', cover: 'https://images.unsplash.com/photo-1518241353312-86380c8e31a1?w=150&q=80', matchBase: 99 },
    { id: 'r2', title: 'Better Together', artist: 'Jack Johnson', genre: 'Acoustic', mood: 'Relaxed', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=150&q=80', matchBase: 94 },
    { id: 'r3', title: 'Come Away With Me', artist: 'Norah Jones', genre: 'Jazz', mood: 'Relaxed', cover: 'https://images.unsplash.com/photo-1516280440502-86641e7cb5a4?w=150&q=80', matchBase: 95 },
    { id: 'r4', title: 'Sunset Lover', artist: 'Petit Biscuit', genre: 'Electronic', mood: 'Relaxed', cover: 'https://images.unsplash.com/photo-1495422964230-2e40f3408ec2?w=150&q=80', matchBase: 96 },
    { id: 'r5', title: 'Holocene', artist: 'Bon Iver', genre: 'Indie Folk', mood: 'Relaxed', cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=150&q=80', matchBase: 92 },

    // Motivated
    { id: 'm1', title: 'Eye of the Tiger', artist: 'Survivor', genre: 'Rock', mood: 'Motivated', cover: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&q=80', matchBase: 98 },
    { id: 'm2', title: 'Lose Yourself', artist: 'Eminem', genre: 'Hip Hop', mood: 'Motivated', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f928?w=150&q=80', matchBase: 97 },
    { id: 'm3', title: 'Stronger', artist: 'Kanye West', genre: 'Hip Hop', mood: 'Motivated', cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=150&q=80', matchBase: 95 },
    { id: 'm4', title: 'Titanium', artist: 'David Guetta ft. Sia', genre: 'Electronic', mood: 'Motivated', cover: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=150&q=80', matchBase: 94 },
    { id: 'm5', title: 'Don\'t Stop Me Now', artist: 'Queen', genre: 'Rock', mood: 'Motivated', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150&q=80', matchBase: 96 },

    // Party
    { id: 'p1', title: 'Danza Kuduro', artist: 'Don Omar', genre: 'Latin', mood: 'Party', cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=150&q=80', matchBase: 98 },
    { id: 'p2', title: 'Levels', artist: 'Avicii', genre: 'EDM', mood: 'Party', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&q=80', matchBase: 97 },
    { id: 'p3', title: 'Yeah!', artist: 'Usher', genre: 'R&B', mood: 'Party', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150&q=80', matchBase: 96 },
    { id: 'p4', title: 'Mr. Brightside', artist: 'The Killers', genre: 'Alt Rock', mood: 'Party', cover: 'https://images.unsplash.com/photo-1533147670608-2a2f9776d3ac?w=150&q=80', matchBase: 95 },
    { id: 'p5', title: 'I Gotta Feeling', artist: 'Black Eyed Peas', genre: 'Pop', mood: 'Party', cover: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=150&q=80', matchBase: 99 },

    // Study
    { id: 'st1', title: 'Lofi Study', artist: 'ChilledCow', genre: 'Lofi', mood: 'Study', cover: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=150&q=80', matchBase: 98 },
    { id: 'st2', title: 'Clair de Lune', artist: 'Claude Debussy', genre: 'Classical', mood: 'Study', cover: 'https://images.unsplash.com/photo-1507838153428-9c60e451b681?w=150&q=80', matchBase: 95 },
    { id: 'st3', title: 'Snowfall', artist: 'Øneheart', genre: 'Ambient', mood: 'Study', cover: 'https://images.unsplash.com/photo-1478147424096-f65b6e41b315?w=150&q=80', matchBase: 96 },
    { id: 'st4', title: 'River Flows In You', artist: 'Yiruma', genre: 'Classical', mood: 'Study', cover: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=150&q=80', matchBase: 94 },
    { id: 'st5', title: 'Cornfield Chase', artist: 'Hans Zimmer', genre: 'Soundtrack', mood: 'Study', cover: 'https://images.unsplash.com/photo-1446903063546-e58f2709199a?w=150&q=80', matchBase: 97 },

    // Romantic
    { id: 'rm1', title: 'Perfect', artist: 'Ed Sheeran', genre: 'Pop', mood: 'Romantic', cover: 'https://images.unsplash.com/photo-1518199266791-5375a83164ba?w=150&q=80', matchBase: 98 },
    { id: 'rm2', title: 'All of Me', artist: 'John Legend', genre: 'R&B', mood: 'Romantic', cover: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=150&q=80', matchBase: 97 },
    { id: 'rm3', title: 'Thinking Out Loud', artist: 'Ed Sheeran', genre: 'Pop', mood: 'Romantic', cover: 'https://images.unsplash.com/photo-1522066750059-e93d18e8784d?w=150&q=80', matchBase: 96 },
    { id: 'rm4', title: 'Make You Feel My Love', artist: 'Adele', genre: 'Pop', mood: 'Romantic', cover: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=150&q=80', matchBase: 95 },
    { id: 'rm5', title: 'At Last', artist: 'Etta James', genre: 'Soul', mood: 'Romantic', cover: 'https://images.unsplash.com/photo-1505934333218-8fe21ff8ce2e?w=150&q=80', matchBase: 99 },

    // Road Trip
    { id: 'rt1', title: 'Life is a Highway', artist: 'Tom Cochrane', genre: 'Rock', mood: 'Road Trip', cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=150&q=80', matchBase: 98 },
    { id: 'rt2', title: 'Hotel California', artist: 'Eagles', genre: 'Classic Rock', mood: 'Road Trip', cover: 'https://images.unsplash.com/photo-1503348658607-4e6378411b0e?w=150&q=80', matchBase: 96 },
    { id: 'rt3', title: 'Born to Run', artist: 'Bruce Springsteen', genre: 'Rock', mood: 'Road Trip', cover: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=150&q=80', matchBase: 97 },
    { id: 'rt4', title: 'Sweet Home Alabama', artist: 'Lynyrd Skynyrd', genre: 'Rock', mood: 'Road Trip', cover: 'https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=150&q=80', matchBase: 95 },
    { id: 'rt5', title: 'Riptide', artist: 'Vance Joy', genre: 'Indie', mood: 'Road Trip', cover: 'https://images.unsplash.com/photo-1473042904071-85e6837943f1?w=150&q=80', matchBase: 94 }
];

const moodCategories = [
    { name: 'Happy', icon: '<i class="fa-solid fa-sun" style="color: #f1c40f;"></i>' },
    { name: 'Sad', icon: '<i class="fa-solid fa-cloud-showers-water" style="color: #3498db;"></i>' },
    { name: 'Relaxed', icon: '<i class="fa-solid fa-mug-hot" style="color: #2ecc71;"></i>' },
    { name: 'Motivated', icon: '<i class="fa-solid fa-fire" style="color: #e74c3c;"></i>' },
    { name: 'Party', icon: '<i class="fa-solid fa-champagne-glasses" style="color: #9b59b6;"></i>' },
    { name: 'Study', icon: '<i class="fa-solid fa-book-open" style="color: #34495e;"></i>' },
    { name: 'Romantic', icon: '<i class="fa-solid fa-heart" style="color: #e84393;"></i>' },
    { name: 'Road Trip', icon: '<i class="fa-solid fa-car-side" style="color: #e67e22;"></i>' }
];

/* ==========================================================================
   State & Local Storage Management
   ========================================================================== */
let currentMood = null;
let favoriteTracks = JSON.parse(localStorage.getItem('moodMusicFavorites')) || [];
let moodHistory = JSON.parse(localStorage.getItem('moodMusicHistory')) || [];

function saveFavorites() {
    localStorage.setItem('moodMusicFavorites', JSON.stringify(favoriteTracks));
}

function saveHistory() {
    localStorage.setItem('moodMusicHistory', JSON.stringify(moodHistory));
}

function addToHistory(mood) {
    const entry = {
        mood: mood,
        timestamp: new Date().getTime(),
        dateStr: new Date().toLocaleString()
    };
    moodHistory.unshift(entry); // Add to beginning
    if (moodHistory.length > 20) moodHistory.pop(); // Keep only last 20
    saveHistory();
    renderHistory();
}

function toggleFavorite(trackId) {
    if (favoriteTracks.includes(trackId)) {
        favoriteTracks = favoriteTracks.filter(id => id !== trackId);
    } else {
        favoriteTracks.push(trackId);
    }
    saveFavorites();
    // Re-render current views to update heart icons
    if (currentMood) renderRecommendations(currentMood);
    renderFavorites();
}

/* ==========================================================================
   UI Rendering
   ========================================================================== */
// Initialize Mood Grid
function initMoodGrid() {
    const grid = document.getElementById('moodGrid');
    grid.innerHTML = '';
    
    moodCategories.forEach(mood => {
        const card = document.createElement('div');
        card.className = 'mood-card';
        card.innerHTML = `
            <div class="mood-icon">${mood.icon}</div>
            <div class="mood-name">${mood.name}</div>
        `;
        card.addEventListener('click', () => selectMood(mood.name, card));
        grid.appendChild(card);
    });
}

function selectMood(moodName, cardElement = null) {
    currentMood = moodName;
    document.body.setAttribute('data-theme', moodName);
    document.getElementById('currentMoodDisplay').textContent = moodName;
    
    // Manage active state on cards
    document.querySelectorAll('.mood-card').forEach(card => card.classList.remove('active-mood'));
    if (cardElement) {
        cardElement.classList.add('active-mood');
    } else {
        // If selected via Random, find the card
        const cards = document.querySelectorAll('.mood-card');
        cards.forEach(card => {
            if(card.querySelector('.mood-name').textContent === moodName) {
                card.classList.add('active-mood');
            }
        });
    }

    addToHistory(moodName);
    
    // Show recommendations
    document.getElementById('recommendationsContainer').classList.remove('hidden');
    renderRecommendations(moodName);
}

// Render Track Lists
function createTrackHTML(track) {
    const isFav = favoriteTracks.includes(track.id);
    const favClass = isFav ? 'fa-solid fa-heart active' : 'fa-regular fa-heart';
    
    // Randomize match slightly based on its base
    const currentMatch = track.matchBase - Math.floor(Math.random() * 5);

    return `
        <div class="track-row">
            <img src="${track.cover}" alt="Cover" class="track-art">
            <div class="track-info">
                <span class="track-title" title="${track.title}">${track.title}</span>
                <span class="track-artist">${track.artist}</span>
            </div>
            <div class="track-genre">${track.genre}</div>
            <div class="track-match"><i class="fa-solid fa-fire"></i> ${currentMatch}% Match</div>
            <div class="track-actions">
                <button class="btn btn-icon fav-btn" data-id="${track.id}">
                    <i class="${favClass}"></i>
                </button>
            </div>
        </div>
    `;
}

function renderRecommendations(mood) {
    const tracksList = document.getElementById('tracksList');
    // Filter and shuffle
    const filtered = musicDatabase.filter(t => t.mood === mood);
    const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 5); // Show max 5
    
    if (shuffled.length === 0) {
        tracksList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-music"></i>
                <p>No tracks found for this mood.</p>
            </div>
        `;
        return;
    }

    tracksList.innerHTML = shuffled.map(createTrackHTML).join('');
    attachFavListeners(tracksList);
}

function renderFavorites() {
    const favList = document.getElementById('favoritesList');
    const favTracks = favoriteTracks.map(id => musicDatabase.find(t => t.id === id)).filter(Boolean);
    
    if (favTracks.length === 0) {
        favList.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-heart"></i>
                <p>You haven't saved any favorites yet.</p>
            </div>
        `;
        return;
    }

    favList.innerHTML = favTracks.map(createTrackHTML).join('');
    attachFavListeners(favList);
}

function renderHistory() {
    const histList = document.getElementById('historyList');
    
    if (moodHistory.length === 0) {
        histList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <p>No mood history available.</p>
            </div>
        `;
        return;
    }

    histList.innerHTML = moodHistory.map(entry => {
        const moodData = moodCategories.find(m => m.name === entry.mood);
        const icon = moodData ? moodData.icon : '🎵';
        
        return `
            <div class="history-item">
                <div class="history-icon">${icon}</div>
                <div class="history-details">
                    <span class="history-mood">${entry.mood}</span>
                    <span class="history-time">${entry.dateStr}</span>
                </div>
            </div>
        `;
    }).join('');
}

function attachFavListeners(container) {
    const favBtns = container.querySelectorAll('.fav-btn');
    favBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent row click if added later
            toggleFavorite(btn.getAttribute('data-id'));
            
            // Show subtle animation
            btn.style.transform = "scale(1.2)";
            setTimeout(() => btn.style.transform = "scale(1)", 200);
        });
    });
}

/* ==========================================================================
   Navigation & Actions
   ========================================================================== */
function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.view-section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active btn
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding section
            const targetId = `section-${btn.getAttribute('data-target')}`;
            sections.forEach(sec => {
                sec.classList.remove('active-section');
                sec.classList.add('hidden');
            });
            
            const targetSection = document.getElementById(targetId);
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active-section');

            // Specific renders
            if(targetId === 'section-favorites') renderFavorites();
            if(targetId === 'section-history') renderHistory();
        });
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Background Animation setup
function setupFloatingNotes() {
    const container = document.getElementById('floatingNotes');
    const noteIcons = ['fa-music', 'fa-headphones', 'fa-record-vinyl', 'fa-compact-disc'];
    
    for (let i = 0; i < 15; i++) {
        const note = document.createElement('i');
        const randomIcon = noteIcons[Math.floor(Math.random() * noteIcons.length)];
        note.className = `fa-solid ${randomIcon} floating-note`;
        
        // Randomize positioning and animation speed
        note.style.left = `${Math.random() * 100}vw`;
        note.style.animationDuration = `${15 + Math.random() * 20}s`;
        note.style.animationDelay = `${Math.random() * 10}s`;
        note.style.fontSize = `${1 + Math.random() * 2}rem`;
        
        container.appendChild(note);
    }
}

/* ==========================================================================
   Initialization
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initMoodGrid();
    setupNavigation();
    setupFloatingNotes();
    
    // Random Mood Generator
    document.getElementById('randomMoodBtn').addEventListener('click', () => {
        const randomMood = moodCategories[Math.floor(Math.random() * moodCategories.length)].name;
        selectMood(randomMood);
        // Switch to home view automatically
        document.querySelector('.nav-btn[data-target="home"]').click();
    });

    // Refresh Recommendations
    document.getElementById('refreshRecsBtn').addEventListener('click', () => {
        if (currentMood) {
            renderRecommendations(currentMood);
            const icon = document.querySelector('#refreshRecsBtn i');
            icon.style.transform = 'rotate(360deg)';
            icon.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                icon.style.transition = 'none';
                icon.style.transform = 'rotate(0deg)';
            }, 500);
        }
    });

    // Share Playlist
    document.getElementById('sharePlaylistBtn').addEventListener('click', () => {
        if (!currentMood) return;
        
        const shareText = `Check out my custom Spotify-inspired playlist for feeling ${currentMood} on MoodMusic!`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                showToast("Playlist link copied to clipboard!");
            });
        } else {
            showToast("Playlist link copied to clipboard!");
        }
    });
});
