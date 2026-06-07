'use strict';

/* ── Mood Data ──────────────────────────────────────────────── */
const moods = [
    { id: 'happy',    name: 'Happy',    emoji: '😊', color: '#ffb800', colorDim: 'rgba(255,184,0,0.12)' },
    { id: 'sad',      name: 'Sad',      emoji: '😔', color: '#3b82f6', colorDim: 'rgba(59,130,246,0.12)' },
    { id: 'relaxed',  name: 'Relaxed',  emoji: '😌', color: '#10b981', colorDim: 'rgba(16,185,129,0.12)' },
    { id: 'motivated',name: 'Motivated',emoji: '💪', color: '#ef4444', colorDim: 'rgba(239,68,68,0.12)' },
    { id: 'party',    name: 'Party',    emoji: '🎉', color: '#d946ef', colorDim: 'rgba(217,70,239,0.12)' },
    { id: 'study',    name: 'Study',    emoji: '📚', color: '#8b5cf6', colorDim: 'rgba(139,92,246,0.12)' },
    { id: 'romantic', name: 'Romantic', emoji: '❤️', color: '#f43f5e', colorDim: 'rgba(244,63,94,0.12)' },
    { id: 'roadtrip', name: 'Road Trip',emoji: '🚗', color: '#f97316', colorDim: 'rgba(249,115,22,0.12)' },
    { id: 'rainyday', name: 'Rainy Day',emoji: '🌧️', color: '#64748b', colorDim: 'rgba(100,116,139,0.12)' },
    { id: 'chill',    name: 'Chill',    emoji: '😎', color: '#06b6d4', colorDim: 'rgba(6,182,212,0.12)' }
];

/* ── Song Database ──────────────────────────────────────────── */
const songs = [
    // happy
    { id:1,  title:'Walking on Sunshine',        artist:'Katrina & The Waves',       album:'Walking on Sunshine',               genre:'Pop',       mood:'happy',    match:98, duration:'3:58', cover:'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop' },
    { id:2,  title:'Uptown Funk',                artist:'Mark Ronson ft. Bruno Mars', album:'Uptown Special',                    genre:'Funk',      mood:'happy',    match:95, duration:'4:30', cover:'https://images.unsplash.com/photo-1493225457224-eda0e6fd1463?w=300&h=300&fit=crop' },
    { id:3,  title:'Happy',                      artist:'Pharrell Williams',           album:'GIRL',                              genre:'Pop',       mood:'happy',    match:99, duration:'3:53', cover:'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop' },
    // sad
    { id:4,  title:'Someone Like You',           artist:'Adele',                      album:'21',                                genre:'Pop',       mood:'sad',      match:96, duration:'4:45', cover:'https://images.unsplash.com/photo-1516280440502-d2fc4cb118a1?w=300&h=300&fit=crop' },
    { id:5,  title:'Fix You',                    artist:'Coldplay',                   album:'X&Y',                               genre:'Alt Rock',  mood:'sad',      match:92, duration:'4:55', cover:'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=300&h=300&fit=crop' },
    // relaxed
    { id:6,  title:'Weightless',                 artist:'Marconi Union',              album:'Weightless',                        genre:'Ambient',   mood:'relaxed',  match:99, duration:'8:08', cover:'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop' },
    { id:7,  title:'Holocene',                   artist:'Bon Iver',                   album:'Bon Iver',                          genre:'Indie Folk',mood:'relaxed',  match:94, duration:'5:37', cover:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop' },
    // motivated
    { id:8,  title:'Eye of the Tiger',           artist:'Survivor',                   album:'Eye of the Tiger',                  genre:'Rock',      mood:'motivated',match:98, duration:'4:06', cover:'https://images.unsplash.com/photo-1483721310020-03333e577078?w=300&h=300&fit=crop' },
    { id:9,  title:'Stronger',                   artist:'Kanye West',                 album:'Graduation',                        genre:'Hip Hop',   mood:'motivated',match:95, duration:'5:12', cover:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop' },
    // party
    { id:10, title:'Levels',                     artist:'Avicii',                     album:'True',                              genre:'EDM',       mood:'party',    match:97, duration:'3:20', cover:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=300&fit=crop' },
    { id:11, title:"Don't Start Now",            artist:'Dua Lipa',                   album:'Future Nostalgia',                  genre:'Pop',       mood:'party',    match:94, duration:'3:03', cover:'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop' },
    // study
    { id:12, title:'Lo-Fi Beats',                artist:'ChilledCow',                 album:'Study Session',                     genre:'Lo-Fi',     mood:'study',    match:99, duration:'2:45', cover:'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=300&fit=crop' },
    { id:13, title:'Clair de Lune',              artist:'Claude Debussy',             album:'Suite bergamasque',                 genre:'Classical', mood:'study',    match:95, duration:'5:05', cover:'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop' },
    // romantic
    { id:14, title:'Perfect',                    artist:'Ed Sheeran',                 album:'Divide',                            genre:'Pop',       mood:'romantic', match:98, duration:'4:23', cover:'https://images.unsplash.com/photo-1518199266791-5375a8319d40?w=300&h=300&fit=crop' },
    { id:15, title:'All of Me',                  artist:'John Legend',                album:'Love in the Future',                genre:'R&B',       mood:'romantic', match:97, duration:'4:30', cover:'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&h=300&fit=crop' },
    // roadtrip
    { id:16, title:'Life is a Highway',          artist:'Tom Cochrane',               album:'Mad Mad World',                     genre:'Rock',      mood:'roadtrip', match:96, duration:'4:26', cover:'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300&h=300&fit=crop' },
    { id:17, title:'Hotel California',           artist:'Eagles',                     album:'Hotel California',                  genre:'Rock',      mood:'roadtrip', match:92, duration:'6:30', cover:'https://images.unsplash.com/photo-1482329833698-4b7b204e38e4?w=300&h=300&fit=crop' },
    // rainyday
    { id:18, title:'Riders on the Storm',        artist:'The Doors',                  album:'L.A. Woman',                        genre:'Rock',      mood:'rainyday', match:95, duration:'7:14', cover:'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=300&h=300&fit=crop' },
    { id:19, title:'Stan',                       artist:'Eminem ft. Dido',            album:'The Marshall Mathers LP',           genre:'Hip Hop',   mood:'rainyday', match:91, duration:'6:44', cover:'https://images.unsplash.com/photo-1438449805896-28a666819a20?w=300&h=300&fit=crop' },
    // chill
    { id:20, title:'Sunflower',                  artist:'Post Malone, Swae Lee',      album:'Spider-Man: Into the Spider-Verse', genre:'Pop',       mood:'chill',    match:97, duration:'2:38', cover:'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&fit=crop' },
    { id:21, title:'The Less I Know The Better', artist:'Tame Impala',                album:'Currents',                          genre:'Indie',     mood:'chill',    match:93, duration:'3:36', cover:'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop' },
];

/* ── State ──────────────────────────────────────────────────── */
let currentMood = null;
let activeSongs = [];
let favorites   = [];

try { favorites = JSON.parse(localStorage.getItem('moodMusicFavorites')) || []; } catch {}

/* ── DOM ────────────────────────────────────────────────────── */
const heroSection   = document.getElementById('heroSection');
const recsSection   = document.getElementById('recsSection');
const moodGrid      = document.getElementById('moodGrid');
const surpriseBtn   = document.getElementById('surpriseBtn');
const surpriseBtnRec= document.getElementById('surpriseBtnRec');
const backBtn       = document.getElementById('backBtn');
const recEmoji      = document.getElementById('recEmoji');
const recTitle      = document.getElementById('recTitle');
const recSub        = document.getElementById('recSub');
const songGrid      = document.getElementById('songGrid');
const searchInput   = document.getElementById('searchInput');
const genreFilter   = document.getElementById('genreFilter');
const favToggleBtn  = document.getElementById('favToggleBtn');
const favBadge      = document.getElementById('favBadge');
const favDrawer     = document.getElementById('favDrawer');
const favOverlay    = document.getElementById('favOverlay');
const closeFavDrawer= document.getElementById('closeFavDrawer');
const favList       = document.getElementById('favList');
const toast         = document.getElementById('toast');

/* ── Init ───────────────────────────────────────────────────── */
function init() {
    renderMoodGrid();
    populateGenres();
    updateFavBadge();

    surpriseBtn.addEventListener('click', pickSurprise);
    surpriseBtnRec.addEventListener('click', pickSurprise);
    backBtn.addEventListener('click', showHero);
    searchInput.addEventListener('input', applyFilters);
    genreFilter.addEventListener('change', applyFilters);

    favToggleBtn.addEventListener('click', () => {
        favDrawer.classList.add('open');
        favOverlay.classList.add('active');
        renderFavDrawer();
    });
    closeFavDrawer.addEventListener('click', closeDrawer);
    favOverlay.addEventListener('click', closeDrawer);
}

function closeDrawer() {
    favDrawer.classList.remove('open');
    favOverlay.classList.remove('active');
}

/* ── Mood Grid ──────────────────────────────────────────────── */
function renderMoodGrid() {
    moodGrid.innerHTML = '';
    moods.forEach(mood => {
        const card = document.createElement('div');
        card.className = 'mood-card';
        card.dataset.id = mood.id;
        card.innerHTML = `<span class="mood-emoji">${mood.emoji}</span><span class="mood-name">${mood.name}</span>`;
        card.addEventListener('click', () => selectMood(mood));
        moodGrid.appendChild(card);
    });
}

/* ── Select Mood ────────────────────────────────────────────── */
function selectMood(mood) {
    currentMood = mood;

    // Highlight selected card
    document.querySelectorAll('.mood-card').forEach(c => {
        const isThis = c.dataset.id === mood.id;
        c.classList.toggle('selected', isThis);
        c.style.setProperty('--mood-accent', mood.color);
        c.style.setProperty('--mood-accent-dim', mood.colorDim);
    });

    // Update header
    recEmoji.textContent = mood.emoji;
    recTitle.textContent = `${mood.name} Vibes`;
    recSub.textContent   = `Songs curated for when you're feeling ${mood.name.toLowerCase()}.`;

    // Show recs
    heroSection.style.display = 'none';
    recsSection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Filter + render
    activeSongs = songs.filter(s => s.mood === mood.id);
    searchInput.value = '';
    genreFilter.value = 'all';
    renderSongs(activeSongs);
}

/* ── Surprise ────────────────────────────────────────────────── */
function pickSurprise() {
    const options = currentMood
        ? moods.filter(m => m.id !== currentMood.id)
        : moods;
    selectMood(options[Math.floor(Math.random() * options.length)]);
}

/* ── Show Hero ──────────────────────────────────────────────── */
function showHero() {
    recsSection.style.display = 'none';
    heroSection.style.display = 'block';
    currentMood = null;
    document.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Render Songs ────────────────────────────────────────────── */
function renderSongs(list) {
    songGrid.innerHTML = '';

    if (list.length === 0) {
        songGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>No songs match your search.</p>
            </div>`;
        return;
    }

    list.forEach((song, i) => {
        const isFav = favorites.some(f => f.id === song.id);
        const q     = encodeURIComponent(`${song.title} ${song.artist}`);
        const spUrl = `https://open.spotify.com/search/${q}`;
        const ytUrl = `https://www.youtube.com/results?search_query=${q}`;

        const card  = document.createElement('div');
        card.className = 'song-card';
        card.style.animationDelay = `${i * 40}ms`;
        card.innerHTML = `
            <div class="song-cover-wrap">
                <img src="${song.cover}" alt="${song.title}" loading="lazy">
                <div class="match-badge">
                    <i class="fa-solid fa-star"></i>${song.match}% match
                </div>
                <div class="song-cover-overlay">
                    <a href="${spUrl}" target="_blank" rel="noopener noreferrer"
                       class="overlay-btn overlay-btn-spotify" title="Find on Spotify">
                        <i class="fa-brands fa-spotify"></i>
                    </a>
                    <a href="${ytUrl}" target="_blank" rel="noopener noreferrer"
                       class="overlay-btn overlay-btn-yt" title="Find on YouTube">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                </div>
            </div>
            <div class="song-body">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
                <div class="song-footer">
                    <span class="song-genre">${song.genre}</span>
                    <span class="song-duration">${song.duration}</span>
                    <button class="heart-btn ${isFav ? 'active' : ''}"
                            data-id="${song.id}"
                            aria-label="${isFav ? 'Remove from liked' : 'Add to liked'}">
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                </div>
            </div>`;

        card.querySelector('.heart-btn').addEventListener('click', e => {
            e.stopPropagation();
            toggleFav(song.id, card.querySelector('.heart-btn'));
        });

        songGrid.appendChild(card);
    });
}

/* ── Filters ────────────────────────────────────────────────── */
function populateGenres() {
    const genres = [...new Set(songs.map(s => s.genre))].sort();
    genres.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g; opt.textContent = g;
        genreFilter.appendChild(opt);
    });
}

function applyFilters() {
    if (!currentMood) return;
    const q = searchInput.value.toLowerCase().trim();
    const g = genreFilter.value;
    const filtered = songs.filter(s => {
        if (s.mood !== currentMood.id) return false;
        if (q && !s.title.toLowerCase().includes(q) && !s.artist.toLowerCase().includes(q)) return false;
        if (g !== 'all' && s.genre !== g) return false;
        return true;
    });
    renderSongs(filtered);
}

/* ── Favourites ─────────────────────────────────────────────── */
function toggleFav(songId, btn) {
    const song = songs.find(s => s.id === songId);
    if (!song) return;

    const idx = favorites.findIndex(f => f.id === songId);
    if (idx === -1) {
        favorites.push(song);
        btn.className = 'heart-btn active';
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        showToast('Added to Liked Songs ❤️');
    } else {
        favorites.splice(idx, 1);
        btn.className = 'heart-btn';
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        showToast('Removed from Liked Songs');
    }

    try { localStorage.setItem('moodMusicFavorites', JSON.stringify(favorites)); } catch {}
    updateFavBadge();
}

function updateFavBadge() {
    if (favorites.length > 0) {
        favBadge.textContent = favorites.length;
        favBadge.style.display = 'flex';
    } else {
        favBadge.style.display = 'none';
    }
}

function renderFavDrawer() {
    favList.innerHTML = '';
    if (favorites.length === 0) {
        favList.innerHTML = '<li class="fav-empty">No liked songs yet.<br>Heart a song to save it.</li>';
        return;
    }
    favorites.forEach(song => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="fav-info">
                <div class="fav-title">${song.title}</div>
                <div class="fav-artist">${song.artist}</div>
            </div>`;
        favList.appendChild(li);
    });
}

/* ── Toast ──────────────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

document.addEventListener('DOMContentLoaded', init);
