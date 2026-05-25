"use strict";

const categoryCatalog = {
    Bollywood: {
        tracks: [
            ["City Lights", "Anaya Beats", "Night Drive"],
            ["Saffron Sky", "Meera Vox", "Rooftop Sessions"],
            ["Monsoon Heart", "Arjun Veda", "Rain Songs"],
            ["Mumbai Sunrise", "Tara Sen", "Local Line"],
            ["Dil Frequency", "Kavya Rao", "Radio Love"],
            ["Golden Dupatta", "Rishi Noor", "Wedding Mix"],
            ["Chai And Chorus", "Naina Shah", "Street Melodies"],
            ["Juhu Breeze", "Dev Mirza", "Coastal Pop"],
            ["Rangoli Rhythm", "Ira Kapoor", "Festival Lights"],
            ["Midnight Mehfil", "Zara Khan", "After Hours"]
        ]
    },
    Tollywood: {
        tracks: [
            ["Neon Veena", "Ravi K", "Festival Mix"],
            ["Hyderabad Nights", "Sita Varma", "Pearl City"],
            ["Mass Entry", "Vikram Pulse", "First Day Show"],
            ["Temple Drums", "Aadhi Ray", "Sacred Beats"],
            ["Kajal Smile", "Nikhil Varma", "Cinema Crush"],
            ["Charminar Echo", "Leela Devi", "Old City"],
            ["Mirchi Step", "Sai Rhythm", "Dance Floor"],
            ["Godavari Glow", "Anvi Teja", "River Tales"],
            ["Hero Theme", "Kiran Raj", "Opening Shot"],
            ["Silver Screen", "Mahi Rao", "Interval High"]
        ]
    },
    Hollywood: {
        tracks: [
            ["Golden Hour", "Maya Stone", "Cinema Skies"],
            ["Starlit Chorus", "The Motion", "Big Screen"],
            ["Sunset Boulevard", "Lena Hart", "West Coast"],
            ["Action Cut", "Noah Chase", "Trailer Room"],
            ["Silver Rain", "Ivy Monroe", "Studio Nights"],
            ["Red Carpet", "Eli Brooks", "Premiere"],
            ["Wide Angle", "June Carter", "Frame One"],
            ["Arcade Kiss", "Mason Vale", "Teen Scene"],
            ["Final Credits", "Aurora Lane", "Last Reel"],
            ["Palm Drive", "Oscar Field", "LA Tapes"]
        ]
    },
    "Lo-fi": {
        tracks: [
            ["Rainy Window", "Loft Tapes", "Late Notes"],
            ["Soft Static", "Bedroom FM", "Study Room"],
            ["Paper Lantern", "Mellow Desk", "Quiet Corners"],
            ["Cafe Steam", "Vinyl Bloom", "Morning Loops"],
            ["Dusty Keyboard", "Pixel Porch", "Homework Beats"],
            ["Sleepy Metro", "Cloud Tape", "Night Commute"],
            ["Muted Vinyl", "Tape Garden", "Analog Bloom"],
            ["Blue Notebook", "Nora Loops", "Soft Focus"],
            ["After Class", "Chill Ledger", "Backpack Beats"],
            ["Window Seat", "Rain Relay", "Grey Weather"]
        ]
    },
    Pop: {
        tracks: [
            ["Afterglow", "Nova Lane", "Bright Side"],
            ["Electric Smile", "Luna Fox", "Radio Ready"],
            ["Bubblegum Skies", "Mila Ray", "Sugar Rush"],
            ["Weekend Signal", "Ava Coast", "Friday Night"],
            ["Mirror Moves", "Theo Spark", "Dance Pop"],
            ["Candy Thunder", "Rhea Blue", "Stadium Hearts"],
            ["Late Text", "Koko Bloom", "Open Chat"],
            ["Supernova Heart", "East Violet", "Bright Lines"],
            ["Playlist Crush", "Nico Vale", "Daily Mix"],
            ["Glow Stick", "Poppy North", "Encore"]
        ]
    },
    Classical: {
        tracks: [
            ["Moon Sonata", "Elena Woods", "Quiet Hall"],
            ["Velvet Concerto", "Marco Bell", "Grand Room"],
            ["Ivory River", "Clara Stein", "Piano Letters"],
            ["Cello Dawn", "Anton Vale", "Morning Suite"],
            ["Glass Waltz", "Mira Laurent", "Crystal Hall"],
            ["Nocturne Garden", "Eden Shore", "Night Bloom"],
            ["Violin Prayer", "Sofia Ames", "Chamber Works"],
            ["Winter Overture", "Hugo Frost", "Seasonal Score"],
            ["Marble Echo", "Dario Klein", "Museum Hall"],
            ["Quiet Prelude", "Nina Sol", "First Movement"]
        ]
    },
    Trending: {
        tracks: [
            ["Viral Pulse", "DJ Orbit", "Weekend Charts"],
            ["Top Shelf", "Kaya Storm", "Hot List"],
            ["Reel Hook", "Max Vibe", "Shorts Club"],
            ["Fire Loop", "Aero Jay", "Chart Breaker"],
            ["Midnight Drop", "Zed Nova", "Fresh Finds"],
            ["Bass Alert", "Mira Flux", "Club Feed"],
            ["Swipe Right", "Kleo Mint", "For You"],
            ["Replay Fever", "Rin Echo", "Loop Mode"],
            ["Spark Trend", "Omar Jet", "Now Wave"],
            ["Global Spin", "Tess Riot", "Daily Top"]
        ]
    }
};

const audioSources = Array.from({ length: 16 }, (_, index) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${index + 1}.mp3`);

function slugify(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function createCoverUrl(category, title, index) {
    const seed = `pulse-${slugify(category)}-${slugify(title)}-${index + 1}`;
    return `https://picsum.photos/seed/${seed}/600/600`;
}

const songs = Object.entries(categoryCatalog).flatMap(([category, group], categoryIndex) => {
    return group.tracks.map(([title, artist, album], trackIndex) => {
        const audioIndex = (categoryIndex * 10 + trackIndex) % audioSources.length;
        const minutes = 4 + ((categoryIndex + trackIndex) % 3);
        const seconds = String((18 + categoryIndex * 7 + trackIndex * 5) % 60).padStart(2, "0");

        return {
            id: `${category.toLowerCase().replace(/\s+/g, "-")}-${trackIndex + 1}`,
            title,
            artist,
            album,
            category,
            duration: `${minutes}:${seconds}`,
            cover: createCoverUrl(category, title, trackIndex),
            src: audioSources[audioIndex]
        };
    });
});

const categories = ["All", "Liked Songs", "Bollywood", "Tollywood", "Hollywood", "Lo-fi", "Pop", "Classical", "Trending"];
const storageKeys = {
    likedSongs: "pulse-liked-songs",
    theme: "pulse-theme"
};

const audio = document.getElementById("audioPlayer");
const themeToggle = document.getElementById("themeToggle");
const categoryNav = document.getElementById("categoryNav");
const searchInput = document.getElementById("searchInput");
const songGrid = document.getElementById("songGrid");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const libraryLabel = document.getElementById("libraryLabel");

const heroCategory = document.getElementById("heroCategory");
const heroTitle = document.getElementById("heroTitle");
const heroMeta = document.getElementById("heroMeta");
const heroCover = document.getElementById("heroCover");
const playerCover = document.getElementById("playerCover");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerLikeBtn = document.getElementById("playerLikeBtn");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const muteBtn = document.getElementById("muteBtn");
const progressInput = document.getElementById("progressInput");
const volumeInput = document.getElementById("volumeInput");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");

let activeCategory = "All";
let activeIndex = 0;
let isSeeking = false;
let isShuffleOn = false;
let isRepeatOn = false;
let likedSongs = new Set(JSON.parse(localStorage.getItem(storageKeys.likedSongs) || "[]"));

audio.volume = Number(volumeInput.value);

function applyTheme(theme) {
    const isLight = theme === "light";
    document.body.classList.toggle("light-theme", isLight);
    themeToggle.textContent = isLight ? "Dark" : "Light";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    localStorage.setItem(storageKeys.theme, theme);
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
}

function getFilteredSongs() {
    const query = searchInput.value.trim().toLowerCase();
    const queryWords = query.split(/\s+/).filter(Boolean);

    return songs.filter((song) => {
        const matchesCategory =
            activeCategory === "All" ||
            (activeCategory === "Liked Songs" && likedSongs.has(song.id)) ||
            song.category === activeCategory;

        if (!query) return matchesCategory;

        const searchable = `${song.title} ${song.artist} ${song.album} ${song.category}`.toLowerCase();
        const matchesSearch = queryWords.every(word => searchable.includes(word));

        return matchesCategory && matchesSearch;
    });
}

function renderCategories() {
    categoryNav.innerHTML = categories.map((category) => {
        const count =
            category === "All" ? songs.length :
                category === "Liked Songs" ? likedSongs.size :
                    songs.filter((song) => song.category === category).length;
        return `
            <button class="category-button ${category === activeCategory ? "active" : ""}" type="button" data-category="${category}">
                <span>${category}</span>
                <small>${count}</small>
            </button>
        `;
    }).join("");
}

function renderSongs() {
    const filteredSongs = getFilteredSongs();

    resultCount.textContent = `${filteredSongs.length} ${filteredSongs.length === 1 ? "song" : "songs"}`;
    libraryLabel.textContent = activeCategory === "All" ? "All songs" : activeCategory;
    emptyState.classList.toggle("show", filteredSongs.length === 0);

    songGrid.innerHTML = filteredSongs.map((song) => {
        const index = songs.indexOf(song);
        return `
            <article class="song-card ${index === activeIndex ? "active" : ""}" data-index="${index}">
                <button class="like-button ${likedSongs.has(song.id) ? "active" : ""}" type="button" data-like-index="${index}" aria-label="${likedSongs.has(song.id) ? "Remove from liked songs" : "Add to liked songs"}">
                    ${likedSongs.has(song.id) ? "♥" : "♡"}
                </button>
                <button class="song-select" type="button" data-index="${index}">
                    <img src="${song.cover}" alt="${song.title} cover" loading="lazy" />
                    <strong>${song.title}</strong>
                    <span>${song.artist}</span>
                    <div class="tag-row">
                        <small>${song.category}</small>
                        <small>${song.duration}</small>
                    </div>
                </button>
            </article>
        `;
    }).join("");
}

function updateLikeButtons() {
    const activeSong = songs[activeIndex];
    const isLiked = likedSongs.has(activeSong.id);

    playerLikeBtn.textContent = isLiked ? "♥" : "♡";
    playerLikeBtn.classList.toggle("active", isLiked);
    playerLikeBtn.setAttribute("aria-label", isLiked ? "Remove current song from liked songs" : "Like current song");
}

function toggleLikedSong(index) {
    const song = songs[index];

    if (likedSongs.has(song.id)) {
        likedSongs.delete(song.id);
    } else {
        likedSongs.add(song.id);
    }

    localStorage.setItem(storageKeys.likedSongs, JSON.stringify([...likedSongs]));
    renderCategories();
    renderSongs();
    updateLikeButtons();
}

function updateTrack(song) {
    heroCategory.textContent = song.category;
    heroTitle.textContent = song.title;
    heroMeta.textContent = `${song.artist} - ${song.album}`;
    heroCover.src = song.cover;
    heroCover.alt = `${song.title} artwork`;

    playerCover.src = song.cover;
    playerCover.alt = `${song.title} artwork`;
    playerTitle.textContent = song.title;
    playerArtist.textContent = `${song.artist} - ${song.album}`;
}

function loadSong(index, shouldPlay = false) {
    activeIndex = (index + songs.length) % songs.length;
    const song = songs[activeIndex];

    audio.src = song.src;
    updateTrack(song);
    renderSongs();
    updateLikeButtons();
    progressInput.value = 0;
    currentTime.textContent = "0:00";
    durationTime.textContent = song.duration;

    if (shouldPlay) {
        audio.play().catch(() => {
            playBtn.textContent = "Play";
        });
    }
}

function playActiveSong() {
    if (!audio.src) {
        loadSong(activeIndex);
    }

    audio.play().catch(() => {
        playBtn.textContent = "Play";
    });
}

function getNextIndex(direction = 1) {
    const filteredSongs = getFilteredSongs();

    if (filteredSongs.length === 0) {
        return activeIndex;
    }

    if (isShuffleOn && filteredSongs.length > 1) {
        const availableSongs = filteredSongs.filter((song) => songs.indexOf(song) !== activeIndex);
        return songs.indexOf(availableSongs[Math.floor(Math.random() * availableSongs.length)]);
    }

    const activeFilteredIndex = filteredSongs.findIndex((song) => songs.indexOf(song) === activeIndex);
    const currentPosition = activeFilteredIndex === -1 ? 0 : activeFilteredIndex;
    const nextPosition = (currentPosition + direction + filteredSongs.length) % filteredSongs.length;

    return songs.indexOf(filteredSongs[nextPosition]);
}

function playNext(direction = 1) {
    loadSong(getNextIndex(direction), true);
}

categoryNav.addEventListener("click", (event) => {
    const button = event.target.closest(".category-button");

    if (!button) {
        return;
    }

    activeCategory = button.dataset.category;
    renderCategories();
    renderSongs();
});

searchInput.addEventListener("input", renderSongs);

songGrid.addEventListener("click", (event) => {
    const likeButton = event.target.closest(".like-button");

    if (likeButton) {
        toggleLikedSong(Number(likeButton.dataset.likeIndex));
        return;
    }

    const card = event.target.closest(".song-select");

    if (!card) {
        return;
    }

    loadSong(Number(card.dataset.index), true);
});

themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
    applyTheme(nextTheme);
});

playerLikeBtn.addEventListener("click", () => {
    toggleLikedSong(activeIndex);
});

playBtn.addEventListener("click", () => {
    if (audio.paused) {
        playActiveSong();
    } else {
        audio.pause();
    }
});

prevBtn.addEventListener("click", () => playNext(-1));
nextBtn.addEventListener("click", () => playNext(1));

shuffleBtn.addEventListener("click", () => {
    isShuffleOn = !isShuffleOn;
    shuffleBtn.classList.toggle("active", isShuffleOn);
    shuffleBtn.setAttribute("aria-label", isShuffleOn ? "Turn shuffle off" : "Turn shuffle on");
});

repeatBtn.addEventListener("click", () => {
    isRepeatOn = !isRepeatOn;
    repeatBtn.classList.toggle("active", isRepeatOn);
    repeatBtn.setAttribute("aria-label", isRepeatOn ? "Turn repeat off" : "Turn repeat on");
});

muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? "Unmute" : "Vol";
});

volumeInput.addEventListener("input", () => {
    audio.volume = Number(volumeInput.value);
    audio.muted = audio.volume === 0;
    muteBtn.textContent = audio.muted ? "Unmute" : "Vol";
});

progressInput.addEventListener("input", () => {
    isSeeking = true;
    const nextTime = (Number(progressInput.value) / 100) * (audio.duration || 0);
    currentTime.textContent = formatTime(nextTime);
});

progressInput.addEventListener("change", () => {
    audio.currentTime = (Number(progressInput.value) / 100) * (audio.duration || 0);
    isSeeking = false;
});

audio.addEventListener("play", () => {
    playBtn.textContent = "Pause";
});

audio.addEventListener("pause", () => {
    playBtn.textContent = "Play";
});

audio.addEventListener("loadedmetadata", () => {
    durationTime.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    if (!isSeeking && Number.isFinite(audio.duration)) {
        progressInput.value = String((audio.currentTime / audio.duration) * 100);
    }

    currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
    if (isRepeatOn) {
        audio.currentTime = 0;
        playActiveSong();
        return;
    }

    playNext(1);
});

document.addEventListener("keydown", (event) => {
    const isTyping = event.target === searchInput;

    if (event.code === "Space" && !isTyping) {
        event.preventDefault();
        playBtn.click();
    }

    if (event.code === "ArrowRight" && !isTyping) {
        audio.currentTime = Math.min((audio.currentTime || 0) + 5, audio.duration || 0);
    }

    if (event.code === "ArrowLeft" && !isTyping) {
        audio.currentTime = Math.max((audio.currentTime || 0) - 5, 0);
    }
});

applyTheme(localStorage.getItem(storageKeys.theme) || "dark");
renderCategories();
loadSong(0);
