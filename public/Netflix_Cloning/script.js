// ==========================================
// 1. DATA DATABASE CONSTANTS
// ==========================================

const MOCK_PROFILES = [
  { id: '1', name: 'Alex', colorClass: 'bg-red-600', colorHex: '#e50914' },
  { id: '2', name: 'Sarah', colorClass: 'bg-blue-600', colorHex: '#2563eb' },
  { id: '3', name: 'Kids', colorClass: 'bg-yellow-500', colorHex: '#eab308' },
  { id: '4', name: 'Guest', colorClass: 'bg-purple-600', colorHex: '#9333ea' },
];

const HERO_MOVIE = {
  id: 'st-4',
  title: 'STRANGER THINGS',
  description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl with telekinetic powers.',
  backdropUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1920&q=80',
  thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&h=340&q=80',
  releaseYear: 2026,
  ageRating: '16+',
  duration: '4 Seasons',
  tags: ['Nostalgic', 'Ominous', 'Sci-Fi Drama', 'Mystery', 'Supernatural'],
  genre: 'Sci-Fi Drama',
  rating: 98,
  cast: ['Winona Ryder', 'David Harbour', 'Millie Bobby Brown', 'Finn Wolfhard', 'Gaten Matarazzo'],
  creators: ['The Duffer Brothers'],
  isOriginal: true,
  similarityMatch: 99,
  videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
  subtitles: [
    { time: 0, text: "[Eerie synthesizer ambient sound playing]" },
    { time: 4, text: "Mike: \"Eleven, can you hear us? Speak to us!\"" },
    { time: 8, text: "[Electricity crackles as walkie-talkie static noise buzzes]" },
    { time: 12, text: "Dustin: \"There is something big moving in the demogorgon cave...\"" },
    { time: 16, text: "[Deep growl echoes from the underground lab walls]" },
    { time: 20, text: "Eleven: \"It is here. We must close the gate... right now.\"" },
    { time: 25, text: "[Loud explosion sound, blinding crimson warning sirens flare]" }
  ]
};

const ALL_MOVIES = [
  {
    id: '1',
    title: 'Arcane: League of Legends',
    description: 'Amidst the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.',
    backdropUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&h=340&q=80',
    releaseYear: 2024,
    ageRating: '16+',
    duration: '2 Seasons',
    tags: ['Visually Stunning', 'Action Anime', 'Fantasy', 'Emotional', 'Empowered'],
    genre: 'TV Shows',
    rating: 97,
    cast: ['Hailee Steinfeld', 'Ella Purnell', 'Kevin Alejandro', 'Harry Lloyd'],
    creators: ['Christian Linke', 'Alex Yee'],
    isOriginal: true,
    similarityMatch: 97,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-scenery-of-a-neon-city-at-night-42415-large.mp4',
    subtitles: [
      { time: 0, text: "[Orchestral violins building up tension]" },
      { time: 4, text: "Vi: \"You think you can just replace me? We are family, Jinx!\"" },
      { time: 9, text: "Jinx: \"You changed, sis. But the monsters inside never did.\"" },
      { time: 14, text: "[Gigantic blue magic explosion fires from a hextech crystal]" },
      { time: 19, text: "Mel: \"Power is only dangerous in the hands of those who fear it.\"" }
    ]
  },
  {
    id: '2',
    title: 'The Dark Horizon',
    description: 'In a desolate futurescape, an elite spaceship pilot intercepts a rogue frequency originating from deep inside a stellar black hole.',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&h=340&q=80',
    releaseYear: 2025,
    ageRating: '13+',
    duration: '2h 14m',
    tags: ['Mind-Bending', 'Sci-Fi Adventure', 'Cerebral', 'Suspenseful'],
    genre: 'Movies',
    rating: 94,
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    creators: ['Christopher Nolan'],
    isOriginal: false,
    similarityMatch: 94,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-neon-tunnel-42409-large.mp4',
    subtitles: [
      { time: 0, text: "[Deep engine resonance humming]" },
      { time: 4, text: "Commander: \"We have reached the point of no return. Fuel is at 12%.\"" },
      { time: 9, text: "Co-Pilot: \"Interstellar sensors are picking up a human trace... inside the singularity.\"" }
    ]
  },
  {
    id: '3',
    title: 'Cyberpunk Chronicles',
    description: 'A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner mercenary.',
    backdropUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&h=340&q=80',
    releaseYear: 2025,
    ageRating: '18+',
    duration: '1 Season',
    tags: ['Violent', 'Gritty', 'Sci-Fi Anime', 'Cyberpunk', 'Dystopian'],
    genre: 'TV Shows',
    rating: 99,
    cast: ['Zach Aguilar', 'Giancarlo Esposito', 'Emi Lo'],
    creators: ['Rafał Jaki'],
    isOriginal: true,
    similarityMatch: 99,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-playing-with-futuristic-neon-augmented-reality-glasses-43093-large.mp4',
    subtitles: [
      { time: 0, text: "[Fast-paced synthwave beat kicks in]" },
      { time: 4, text: "David: \"I don't care about the corporate rules. I run this street!\"" },
      { time: 8, text: "[Laser blasts and cybernetic weapon charging hums]" }
    ]
  },
  {
    id: '4',
    title: 'Glass Onion',
    description: 'World-famous detective Benoit Blanc heads to Greece to peel back the layers of a mystery involving a tech billionaire and his eclectic crew of friends.',
    backdropUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=600&h=340&q=80',
    releaseYear: 2023,
    ageRating: '13+',
    duration: '2h 19m',
    tags: ['Witty', 'Mystery Puzzle', 'Eccentric', 'Satirical', 'Suspenseful'],
    genre: 'Movies',
    rating: 91,
    cast: ['Daniel Craig', 'Edward Norton', 'Janelle Monáe', 'Kathryn Hahn'],
    creators: ['Rian Johnson'],
    isOriginal: true,
    similarityMatch: 91,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-island-resort-aerial-view-39824-large.mp4',
    subtitles: [
      { time: 0, text: "[Charming orchestral jazz music playing]" },
      { time: 4, text: "Benoit: \"Every puzzle has a center. And every glass onion has a core.\"" },
      { time: 10, text: "Miles: \"Welcome to paradise, guys! Let the murder mystery game begin!\"" }
    ]
  },
  {
    id: '5',
    title: 'Midnight Detective',
    description: 'In the rain-slicked neon streets of Tokyo, a cynical detective chases an legendary thief who only targets ancient hyper-tech artifacts.',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&h=340&q=80',
    releaseYear: 2026,
    ageRating: '16+',
    duration: '1 Season',
    tags: ['Noir', 'Atmospheric', 'Slow Burn', 'Crime Drama', 'Intellectual'],
    genre: 'TV Shows',
    rating: 95,
    cast: ['Ken Watanabe', 'Rinko Kikuchi', 'Ansel Elgort'],
    creators: ['J.T. Rogers'],
    isOriginal: true,
    similarityMatch: 95,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-through-a-rainy-neon-city-screengrab-41712-large.mp4',
    subtitles: [
      { time: 0, text: "[Rain falling on pavement, smooth saxophone playing]" },
      { time: 5, text: "Ken: \"This city never sleeps. It just waits for the shadow to find the light.\"" }
    ]
  },
  {
    id: '6',
    title: 'Inception of Mind',
    description: 'A professional thief steals corporate secrets through the use of dream-sharing technology. He is given the inverse task of planting an idea into the mind of a C.E.O.',
    backdropUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&h=340&q=80',
    releaseYear: 2010,
    ageRating: '13+',
    duration: '2h 28m',
    tags: ['Mind-Bending', 'Sci-Fi Action', 'Exciting', 'Complex Plot'],
    genre: 'Movies',
    rating: 96,
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    creators: ['Christopher Nolan'],
    isOriginal: false,
    similarityMatch: 96,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-circuits-and-connections-42171-large.mp4',
    subtitles: [
      { time: 0, text: "[Deep brass wind horns blaring]" },
      { time: 4, text: "Cobb: \"An idea is like a virus. Resilient. Highly contagious.\"" }
    ]
  },
  {
    id: '7',
    title: 'Retro Gaming Club',
    description: 'A heart-warming look back at the origins of classic 1980s computer arcades, told through the perspectives of three brilliant teenagers who changed gaming history forever.',
    backdropUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&h=340&q=80',
    releaseYear: 2024,
    ageRating: 'All',
    duration: '5 Episodes',
    tags: ['Charming', 'Nostalgic', 'Feel-Good', 'Documentary Series'],
    genre: 'TV Shows',
    rating: 90,
    cast: ['Ernest Cline', 'Nolan Bushnell', 'Billy Mitchell'],
    creators: ['Seth Gordon'],
    isOriginal: false,
    similarityMatch: 90,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-camera-pan-of-classic-videogame-controllers-and-keyboard-40439-large.mp4',
    subtitles: [
      { time: 0, text: "[Retro 8-bit chiptune sound waves rising]" },
      { time: 4, text: "Speaker: \"We had quarters, a screen, and a whole universe in front of us.\"" }
    ]
  },
  {
    id: '8',
    title: 'Into the Cosmic Abyss',
    description: 'The voyage of an automated exploratory vessel takes a dark, irreversible turn when it approaches a supermassive singular phenomenon at the edge of the galaxy.',
    backdropUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&h=340&q=80',
    releaseYear: 2026,
    ageRating: '13+',
    duration: '1h 52m',
    tags: ['Ominous', 'Visually Captivating', 'Space Horror', 'Cerebral'],
    genre: 'Movies',
    rating: 92,
    cast: ['Cillian Murphy', 'Rose Byrne', 'Chris Evans'],
    creators: ['Danny Boyle'],
    isOriginal: true,
    similarityMatch: 92,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-digital-neurons-connection-background-42037-large.mp4',
    subtitles: [
      { time: 0, text: "[Radio static, distant alarms screaming]" },
      { time: 4, text: "AI Computer: \"Warning. Event horizon breach detected. Systems critical.\"" }
    ]
  },
  {
    id: '9',
    title: 'Cobra Kai',
    description: 'Decades after the tournament that changed their lives, the rivalry between Johnny and Daniel reignites in this sequel series to the classic movies.',
    backdropUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&h=340&q=80',
    releaseYear: 2024,
    ageRating: '13+',
    duration: '6 Seasons',
    tags: ['Exciting', 'Nostalgic', 'Martial Arts', 'Drama', 'Action Hero'],
    genre: 'TV Shows',
    rating: 98,
    cast: ['Ralph Macchio', 'William Zabka', 'Xolo Maridueña'],
    isOriginal: true,
    similarityMatch: 98,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-classic-karate-belt-and-practitioner-42283-large.mp4',
    subtitles: [
      { time: 0, text: "[Guitar intro rocking]" },
      { time: 4, text: "Johnny: \"Strike first. Strike hard. No mercy!\"" }
    ]
  },
  {
    id: '10',
    title: 'Deep Mystery Ocean',
    description: 'A deep-sea biological expedition recovers a biological structure completely unknown to modern terrestrial science, and accidentally brings it on board.',
    backdropUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1920&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=600&h=340&q=80',
    releaseYear: 2025,
    ageRating: '16+',
    duration: '2h 11m',
    tags: ['Suspenseful', 'Sci-Fi Thriller', 'Claustrophobic'],
    genre: 'Movies',
    rating: 89,
    cast: ['Kristen Stewart', 'Vincent Cassel', 'T.J. Miller'],
    creators: ['William Eubank'],
    isOriginal: false,
    similarityMatch: 89,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-underwater-sunbeams-shining-through-water-fluid-motion-42525-large.mp4',
    subtitles: [
      { time: 0, text: "[Deep underwater sonar sonar sounds bouncing]" },
      { time: 4, text: "Captain: \"Hold tight! We're diving deeper than anyone's ever gone.\"" }
    ]
  }
];

const CATEGORIES = [
  { id: 'trending', name: 'Trending Now', filter: () => true },
  { id: 'originals', name: 'Netflix Originals Only', filter: (m) => !!m.isOriginal },
  { id: 'action-scifi', name: 'Sci-Fi & Cyberpunk Hits', filter: (m) => m.tags.includes('Sci-Fi Drama') || m.tags.includes('Cyberpunk') || m.tags.includes('Sci-Fi Adventure') || m.tags.includes('Sci-Fi Anime') },
  { id: 'movies', name: 'Blockbuster Movies', filter: (m) => m.genre === 'Movies' },
  { id: 'tvshows', name: 'Critically Acclaimed TV Shows', filter: (m) => m.genre === 'TV Shows' },
];

// ==========================================
// 2. STATE MACHINE (PERSISTENT VIA LOCALSTORAGE)
// ==========================================

let state = {
  profiles: JSON.parse(localStorage.getItem('netflix_profiles')) || MOCK_PROFILES,
  selectedProfile: JSON.parse(localStorage.getItem('netflix_active_profile')) || null,
  activeTab: 'Home',
  searchQuery: '',
  myLists: JSON.parse(localStorage.getItem('netflix_profile_lists')) || {}, // keyed by profileId
  playingMovie: null,
  selectedMovieInfo: null,
  isProfileEditingMode: false,
  editingProfileId: null,
  editingName: "",
  isMobileMenuOpen: false,
  isNotificationsOpen: false,
  isProfileDropdownOpen: false
};

// ==========================================
// 3. UTILITY ACTIONS & RENDERING HOOKS
// ==========================================

function updateStorage() {
  localStorage.setItem('netflix_profiles', JSON.stringify(state.profiles));
  localStorage.setItem('netflix_active_profile', JSON.stringify(state.selectedProfile));
  localStorage.setItem('netflix_profile_lists', JSON.stringify(state.myLists));
}

function selectProfile(profile) {
  state.selectedProfile = profile;
  state.activeTab = 'Home';
  state.searchQuery = '';
  state.isProfileDropdownOpen = false;
  state.isMobileMenuOpen = false;
  if (!state.myLists[profile.id]) {
    state.myLists[profile.id] = [];
  }
  updateStorage();
  renderApp();
}

function logoutProfile() {
  state.selectedProfile = null;
  state.isProfileEditingMode = false;
  state.editingProfileId = null;
  state.isProfileDropdownOpen = false;
  state.isMobileMenuOpen = false;
  updateStorage();
  renderApp();
}

function toggleMyList(movie, e) {
  if (e) e.stopPropagation();
  if (!state.selectedProfile) return;
  const profileId = state.selectedProfile.id;
  if (!state.myLists[profileId]) {
    state.myLists[profileId] = [];
  }
  
  const movieIdx = state.myLists[profileId].indexOf(movie.id);
  if (movieIdx > -1) {
    state.myLists[profileId].splice(movieIdx, 1);
  } else {
    state.myLists[profileId].push(movie.id);
  }
  updateStorage();
  renderApp();
  
  // Update details modal or rows dynamically if they are shown
  if (state.selectedMovieInfo && state.selectedMovieInfo.id === movie.id) {
    const modalButton = document.getElementById(`modal-list-btn-${movie.id}`);
    if (modalButton) {
      const isAdded = state.myLists[profileId].includes(movie.id);
      modalButton.innerHTML = isAdded ? `<i data-lucide="check" class="text-green-505 w-5 h-5 text-green-500"></i>` : `<i data-lucide="plus" class="w-5 h-5"></i>`;
      modalButton.title = isAdded ? 'Remove from My List' : 'Add to My List';
      lucide.createIcons();
    }
  }
}

function startVideoPlay(movie) {
  state.playingMovie = movie;
  state.selectedMovieInfo = null; // Close details modal when playing
  renderApp();
  initVideoPlayerControls();
}

function showMovieInfo(movie) {
  state.selectedMovieInfo = movie;
  renderApp();
}

// ==========================================
// 4. MAIN RENDERING ENGINE (DOM PORTAL)
// ==========================================

function renderApp() {
  const root = document.getElementById('root');
  if (!root) return;

  // Record focused element before rendering to preserve cursor & keyboards
  const activeId = document.activeElement ? document.activeElement.id : null;
  const activeSelectionStart = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')
    ? document.activeElement.selectionStart
    : null;
  const activeSelectionEnd = document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')
    ? document.activeElement.selectionEnd
    : null;

  root.className = "min-h-screen text-white flex flex-col justify-between";

  // CASE 1: PROFILE MANAGEMENT SELECTION VIEW
  if (!state.selectedProfile) {
    root.innerHTML = renderProfileSelection();
    bindProfileSelectionEvents();
    lucide.createIcons();
    return;
  }

  // CASE 2: MAIN USER MOUNT INTERFACE (HEADER + BODY + DRAWER OVERLAYS + FOOTER)
  let appHTML = '';
  
  // Translucent Navigation Bar Header
  appHTML += renderHeader();

  // Primary content grid
  appHTML += `<main class="flex-grow select-text pb-20 mt-0">`;
  
  if (state.searchQuery) {
    // Search Results Container
    appHTML += renderSearchResults();
  } else if (state.activeTab === 'My List') {
    // Personalized Library
    appHTML += renderMyListTab();
  } else {
    // Cinematic Homepage with Billboard slideshow and Rows
    appHTML += renderBillboardBanner(HERO_MOVIE);
    appHTML += `<div class="relative z-10 -mt-10 sm:-mt-16 md:-mt-20 flex flex-col gap-8 pb-10">`;
    
    CATEGORIES.forEach((row) => {
      // Filter movies based on category requirement
      let filteredMovies = ALL_MOVIES.filter(row.filter);
      
      // If we are looking for "TV Shows" specifically
      if (state.activeTab === 'TV Shows') {
        filteredMovies = filteredMovies.filter(m => m.genre === 'TV Shows');
      } else if (state.activeTab === 'Movies') {
        filteredMovies = filteredMovies.filter(m => m.genre === 'Movies');
      } else if (state.activeTab === 'New & Popular') {
        filteredMovies = filteredMovies.filter(m => m.releaseYear >= 2025);
      }
      
      if (filteredMovies.length > 0) {
        appHTML += renderMovieRow(row.name, filteredMovies, row.id);
      }
    });

    appHTML += `</div>`;
  }

  appHTML += `</main>`;

  // Classic Netflix Footer Section
  appHTML += renderFooter();

  // Insert Modals at bottom of page
  if (state.selectedMovieInfo) {
    appHTML += renderDetailModal(state.selectedMovieInfo);
  }
  
  if (state.playingMovie) {
    appHTML += renderVideoPlayer(state.playingMovie);
  }

  root.innerHTML = appHTML;

  // Restore focus and selection range
  if (activeId) {
    const input = document.getElementById(activeId);
    if (input) {
      input.focus();
      if (activeSelectionStart !== null && activeSelectionEnd !== null) {
        try {
          input.setSelectionRange(activeSelectionStart, activeSelectionEnd);
        } catch (e) {}
      }
    }
  }

  // Bind active DOM listeners
  bindHeaderEvents();
  bindMovieRowEvents();
  bindModalEvents();
  bindSearchResultsEvents();
  
  // Re-render Lucide CDN vector graphics
  lucide.createIcons();
}

// ==========================================
// 5. MODULAR SECTIONS HTML GENERATORS
// ==========================================

/* PROFILE CHOICE */
function renderProfileSelection() {
  const isEditing = state.isProfileEditingMode;
  
  let cardsHTML = '';
  state.profiles.forEach((p) => {
    const isThisEditing = isEditing && state.editingProfileId === p.id;
    cardsHTML += `
      <div class="profile-card-container group flex flex-col items-center cursor-pointer relative" data-profile-id="${p.id}">
        <div class="relative aspect-square w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-active:scale-95 border-2 border-transparent group-hover:border-white ring-offset-4 ring-offset-zinc-900 shadow-xl bg-zinc-800">
          <div class="w-full h-full ${p.colorClass} flex flex-col items-center justify-center relative p-3 text-white">
            <svg class="profile-smiley w-2/3 h-2/3 opacity-85 text-white/95" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="8.5" cy="10" r="1.5" />
              <circle cx="15.5" cy="10" r="1.5" />
              <path d="M8 15.5c2 2 6 2 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          ${isEditing ? `
            <div class="profile-item-edit-btn absolute inset-0 bg-black/60 flex items-center justify-center hover:bg-black/40 transition-opacity" data-edit-profile-id="${p.id}">
              <div class="p-2.5 bg-black/75 rounded-full border border-white hover:scale-110 transition-transform">
                <i data-lucide="edit-2" class="w-5 h-5 text-white"></i>
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="mt-4 text-gray-400 group-hover:text-white text-sm sm:text-base tracking-wide flex items-center gap-2 max-w-full">
          ${isThisEditing ? `
            <div class="flex items-center gap-1 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5" onclick="event.stopPropagation()">
              <input type="text" id="profile-edit-input-${p.id}" value="${state.editingName}" class="bg-transparent text-white border-none focus:outline-none py-0.5 px-1 text-xs sm:text-sm w-20 sm:w-28 text-center font-semibold" autoFocus />
              <button class="profile-save-btn text-green-500 hover:text-green-400 p-1 cursor-pointer" data-save-profile-id="${p.id}">
                <i data-lucide="check" class="w-4 h-4"></i>
              </button>
            </div>
          ` : `
            <span class="truncate max-w-[100px] sm:max-w-[130px] font-medium tracking-wide">
              ${p.name}
            </span>
          `}
        </div>
      </div>
    `;
  });

  return `
    <div class="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white px-4 relative select-none animate-fade-in">
      <div class="absolute top-8 left-8 sm:left-14">
        <span class="font-display text-3xl font-black tracking-tighter text-[#E50914] select-none">NETFLIX</span>
      </div>

      <div class="w-full max-w-4xl text-center flex flex-col items-center justify-center">
        <h1 class="text-3xl sm:text-5xl font-semibold mb-12 tracking-wide animate-scale-up">
          ${isEditing ? 'Manage Profiles' : "Who's watching?"}
        </h1>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 justify-center mb-16 max-w-2xl px-4 w-full">
          ${cardsHTML}
        </div>

        <button id="id-manage-profiles" class="px-8 py-2 border border-zinc-500 text-zinc-400 text-sm sm:text-base font-semibold tracking-wider uppercase hover:border-white hover:text-white transition-all duration-200 cursor-pointer">
          ${isEditing ? 'Done' : 'Manage Profiles'}
        </button>
      </div>
    </div>
  `;
}

/* NAVBAR HEADER */
function renderHeader() {
  const profile = state.selectedProfile;
  const activeList = state.myLists[profile.id] || [];
  
  let tabButtons = '';
  ['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].forEach((tab) => {
    const isCurrent = state.activeTab === tab;
    tabButtons += `
      <button class="nav-tab-btn transition-colors duration-200 hover:text-zinc-300 relative cursor-pointer font-medium tracking-wide ${isCurrent ? 'text-white font-bold' : 'text-zinc-400'}" data-tab="${tab}">
        ${tab}
        ${isCurrent ? `<span class="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-[#E50914] rounded"></span>` : ''}
      </button>
    `;
  });

  // Calculate scrolled background dynamically on immediate render context
  const isScrolled = window.scrollY > 20;
  const scrollClasses = isScrolled 
    ? 'bg-[#141414] shadow-md backdrop-blur-md bg-opacity-95' 
    : 'nav-gradient';

  return `
    <header id="main-navbar" class="fixed top-0 w-full z-[100] transition-all duration-500 flex items-center justify-between px-4 sm:px-12 py-3 sm:py-4 select-none ${scrollClasses}">
      <!-- Left side logo and navigation links -->
      <div class="flex items-center gap-4 lg:gap-10">
        <button id="mobile-hamburger-btn" class="md:hidden text-white hover:text-[#E50914] focus:outline-none transition-colors cursor-pointer">
          <i data-lucide="${state.isMobileMenuOpen ? 'x' : 'menu'}" class="w-6 h-6"></i>
        </button>

        <div id="nav-brand" class="cursor-pointer">
          <span class="font-display text-2xl sm:text-3xl font-black tracking-tighter text-[#E50914] hover:brightness-110 transition-all">
            NETFLIX
          </span>
        </div>

        <div class="hidden md:flex items-center gap-6 text-sm">
          ${tabButtons}
        </div>
      </div>

      <!-- Right side custom user functions -->
      <div class="flex items-center gap-3 sm:gap-6 text-white text-sm">
        <!-- Live search expanding element -->
        <div class="flex items-center gap-2 border transition-all duration-300 py-1.5 px-3 rounded bg-black/45 hover:bg-black/70 border-zinc-800">
          <button id="global-search-btn" class="text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center">
            <i data-lucide="search" class="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300"></i>
          </button>
          <input type="text" id="global-search-input" placeholder="Titles, tags..." value="${state.searchQuery}" class="bg-transparent text-white border-none focus:outline-none text-xs sm:text-sm w-20 sm:w-52 placeholder-zinc-500 font-light" />
          ${state.searchQuery ? `<button id="global-search-clear" class="text-zinc-400 hover:text-white text-xs cursor-pointer">✕</button>` : ''}
        </div>

        <span class="hidden lg:inline text-xs font-medium text-zinc-400 cursor-not-allowed hover:underline">
          Kids
        </span>

        <!-- Notifications button -->
        <div class="relative">
          <button id="notifications-dropdown-toggle" class="relative text-white hover:text-zinc-300 transition-colors cursor-pointer p-1">
            <i data-lucide="bell" class="w-4 h-4 sm:w-5 sm:h-5 text-zinc-200"></i>
            <span class="absolute top-0 right-0 h-4 w-4 bg-[#E50914] text-[9px] font-extrabold flex items-center justify-center rounded-full text-white shadow-md">
              2
            </span>
          </button>

          ${state.isNotificationsOpen ? `
            <div class="absolute right-0 mt-3 w-72 sm:w-80 bg-black/95 border border-zinc-800 rounded shadow-2xl p-2 z-[115] text-xs select-none animate-scale-up">
              <div class="py-2.5 px-3 text-zinc-400 font-bold border-b border-zinc-900 tracking-wider text-[11px]">
                NEW RELEASES ON NETFLIX
              </div>
              <div class="divide-y divide-zinc-900 max-h-72 overflow-y-auto">
                <div class="flex gap-3 py-3 px-3 hover:bg-zinc-900/60 transition-colors cursor-pointer" onclick="event.stopPropagation(); startVideoPlay(ALL_MOVIES[2]);">
                  <div class="h-10 w-16 bg-zinc-800 rounded overflow-hidden shrink-0">
                    <img src="${ALL_MOVIES[2].thumbnailUrl}" alt="" class="h-full w-full object-cover" />
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-white text-xs hover:text-netflix-red">${ALL_MOVIES[2].title}</span>
                    <span class="text-zinc-400 text-[10px] mt-0.5">Brand New Season Out Now!</span>
                    <span class="text-zinc-500 text-[9px] mt-1">2 hours ago</span>
                  </div>
                </div>
                <div class="flex gap-3 py-3 px-3 hover:bg-zinc-900/60 transition-colors cursor-pointer" onclick="event.stopPropagation(); startVideoPlay(ALL_MOVIES[0]);">
                  <div class="h-10 w-16 bg-zinc-800 rounded overflow-hidden shrink-0">
                    <img src="${ALL_MOVIES[0].thumbnailUrl}" alt="" class="h-full w-full object-cover" />
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-white text-xs hover:text-netflix-red">Arcane Season 2</span>
                    <span class="text-zinc-400 text-[10px] mt-0.5">Episode 6 is available today.</span>
                    <span class="text-zinc-500 text-[9px] mt-1">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Custom User Badge dropdown selector -->
        <div class="relative">
          <button id="profile-dropdown-toggle" class="flex items-center gap-1.5 focus:outline-none cursor-pointer group">
            <div class="h-7 w-7 sm:h-8 sm:w-8 ${profile.colorClass} rounded flex items-center justify-center font-black text-white text-xs shadow-md border border-zinc-800">
              ${profile.name[0]}
            </div>
            <i data-lucide="chevron-down" class="w-4 h-4 text-white hover:text-zinc-300 transition-transform ${state.isProfileDropdownOpen ? 'rotate-180' : ''}"></i>
          </button>

          ${state.isProfileDropdownOpen ? `
            <div class="absolute right-0 mt-3 w-48 bg-black/95 border border-zinc-800 rounded shadow-2xl z-[115] py-1 overflow-hidden animate-scale-up">
              <div class="flex items-center gap-2.5 px-4 py-3 border-b border-zinc-900">
                <div class="h-6 w-6 ${profile.colorClass} rounded flex items-center justify-center text-[10px] font-bold text-white">
                  ${profile.name[0]}
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="text-xs font-semibold text-white truncate">${profile.name}</span>
                  <span class="text-[9px] text-zinc-500">Active Profile</span>
                </div>
              </div>
              <button id="id-switch-p" class="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-left text-zinc-300 hover:bg-[#E50914] hover:text-white transition-colors cursor-pointer select-none">
                <i data-lucide="log-out" class="w-4 h-4"></i>
                Switch Profile
              </button>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Mobile drawer menu -->
      ${state.isMobileMenuOpen ? `
        <div class="fixed inset-0 top-[56px] w-full bg-[#141414] z-[100] p-6 flex flex-col gap-6 animate-fade-in">
          <span class="text-[10px] text-zinc-500 font-extrabold tracking-widest uppercase border-b border-zinc-900 pb-2">
            Categories Directory
          </span>
          ${['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map((tab) => `
            <button class="mobile-nav-tab-btn text-left text-lg py-1 hover:text-[#E50914] transition-all cursor-pointer font-semibold ${state.activeTab === tab ? 'text-[#E50914] pl-3 border-l-2 border-[#E50914]' : 'text-white'}" data-tab="${tab}">
              ${tab}
            </button>
          `).join('')}
          <div class="mt-auto border-t border-zinc-900 pt-6 flex items-center justify-between">
            <span class="text-sm font-semibold text-white">${profile.name}</span>
            <button id="mobile-signout" class="text-xs text-[#E50914] font-bold tracking-wider uppercase hover:underline cursor-pointer">
              Sign Out
            </button>
          </div>
        </div>
      ` : ''}
    </header>
  `;
}

/* BILLBOARD SLIDER HERO BANNER */
function renderBillboardBanner(m) {
  const profileId = state.selectedProfile.id;
  const activeList = state.myLists[profileId] || [];
  const isInList = activeList.includes(m.id);

  return `
    <div class="relative w-full h-[56.25vw] min-h-[460px] max-h-[850px] bg-black select-none overflow-hidden animate-fade-in shadow-2xl">
      <img src="${m.backdropUrl}" alt="" class="absolute inset-0 w-full h-full object-cover object-top brightness-[0.62] transition-transform duration-1000" />

      <!-- Shadow mask loops -->
      <div class="absolute inset-0 hero-gradient z-1"></div>
      <div class="absolute inset-x-0 bottom-0 h-[40%] netflix-gradient-bottom z-1"></div>
      <div class="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-black/85 to-transparent z-1"></div>

      <!-- Main content slider texts -->
      <div class="absolute bottom-[24%] sm:bottom-[20%] md:bottom-[18%] left-4 sm:left-12 max-w-[95%] sm:max-w-[48%] z-10 flex flex-col items-start text-white">
        ${m.isOriginal ? `
          <div class="flex items-center gap-1.5 mb-2 scale-90 sm:scale-100 origin-left">
            <svg class="h-5 sm:h-5.5 fill-[#E50914]" viewBox="0 0 24 24">
              <path d="M5.01 22V2h3.98l6 14.8V2h4.01v20h-3.98l-6-14.8V22H5.01z" />
            </svg>
            <span class="text-[10px] sm:text-xs tracking-[0.35em] font-black text-zinc-150 uppercase">
              O R I G I N A L
            </span>
          </div>
        ` : ''}

        <h1 class="font-display text-3xl sm:text-5xl lg:text-[5.5rem] font-bold sm:font-black tracking-tighter leading-none mb-3 sm:mb-4 select-all drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
          ${m.title}
        </h1>

        <div class="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold mb-4 text-zinc-200">
          <span class="text-green-500 font-bold">${m.similarityMatch}% Match</span>
          <span class="text-white border border-white/45 px-1.5 py-0.2 rounded text-[10px] leading-tight font-sans tracking-wide">
            ${m.ageRating}
          </span>
          <span class="text-zinc-350 font-normal">${m.duration}</span>
          <span class="text-zinc-400 font-light hidden sm:inline">${m.tags[0]}</span>
        </div>

        <p class="text-zinc-300 text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 max-w-lg mb-6 sm:mb-8 font-light select-all drop-shadow">
          ${m.description}
        </p>

        <div class="flex items-center gap-2 sm:gap-4 select-none w-full flex-wrap">
          <button class="hero-play-btn flex items-center justify-center gap-2 px-6 sm:px-9 py-2.5 sm:py-3.5 bg-white hover:bg-white/85 text-black font-extrabold text-xs sm:text-base rounded shadow-lg duration-240 transition-transform active:scale-95 cursor-pointer">
            <i data-lucide="play" class="w-4 h-4 sm:w-5 sm:h-5 text-black fill-black"></i>
            Play
          </button>

          <button class="hero-info-btn flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 bg-zinc-700/80 hover:bg-zinc-750 text-white font-bold text-xs sm:text-base rounded shadow-lg duration-240 transition-transform active:scale-95 cursor-pointer">
            <i data-lucide="info" class="w-4 h-4 sm:w-5 sm:h-5 text-white"></i>
            More Info
          </button>

          <button id="hero-list-btn" class="flex items-center justify-center aspect-square h-10 sm:h-12 border border-white/60 hover:bg-white/10 hover:border-white rounded-full bg-black/45 text-white transition-all scale-95 sm:scale-100 cursor-pointer" title="${isInList ? 'Remove from My List' : 'Add to My List'}">
            <i data-lucide="${isInList ? 'check' : 'plus'}" class="${isInList ? 'text-green-400' : ''}"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

/* CAROUSEL FILM ROWS */
function renderMovieRow(rowTitle, moviesList, rowId) {
  const profileId = state.selectedProfile.id;
  const myList = state.myLists[profileId] || [];

  let slidesHTML = '';
  moviesList.forEach((m) => {
    const isAdded = myList.includes(m.id);
    slidesHTML += `
      <div class="movie-card-zoom netflix-card-zoom shrink-0 relative w-[180px] sm:w-[260px] aspect-[16/9] bg-zinc-900 rounded overflow-hidden shadow-md" data-movie-id="${m.id}">
        <img src="${m.thumbnailUrl}" alt="" class="w-full h-full object-cover rounded" />
        
        <!-- Spec overlay hovering detail layout -->
        <div class="movie-card-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 rounded">
          <p class="text-white text-xs sm:text-sm font-bold truncate leading-tight mb-1 select-none">
            ${m.title}
          </p>

          <div class="flex items-center gap-2 text-[9px] sm:text-xs font-semibold mb-2">
            <span class="text-green-500 font-bold">${m.similarityMatch}% Match</span>
            <span class="text-white border border-white/40 px-1 rounded-xs text-[8px] leading-none">${m.ageRating}</span>
            <span class="text-zinc-350 font-light">${m.duration}</span>
          </div>

          <div class="flex items-center gap-2 pt-1 border-t border-white/10">
            <button class="card-play-btn p-1.5 bg-white text-black hover:bg-zinc-200 rounded-full cursor-pointer hover:scale-110 active:scale-90 transition-transform">
              <i data-lucide="play" class="w-3 h-3 text-black fill-black ml-0.5"></i>
            </button>
            <button class="card-list-btn p-1 border border-white/60 hover:border-white rounded-full cursor-pointer hover:scale-110 active:scale-90 transition-transform" data-movie-id="${m.id}">
              <i data-lucide="${isAdded ? 'check' : 'plus'}" class="w-3.5 h-3.5 ${isAdded ? 'text-green-400' : ''}"></i>
            </button>
            <button class="card-info-btn ml-auto p-1.5 bg-zinc-800 text-white hover:bg-zinc-700 rounded-full cursor-pointer hover:scale-110 active:scale-90 transition-transform" data-movie-id="${m.id}">
              <i data-lucide="info" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  return `
    <div id="movie-row-container-${rowId}" class="relative flex flex-col px-4 sm:px-12 select-none group/row">
      <h2 class="text-white text-base sm:text-xl font-bold tracking-wide capitalize hover:text-zinc-300 transition-all cursor-pointer inline-flex items-center gap-1.5 mb-2">
        ${rowTitle}
        <span class="text-[10px] text-[#E50914] font-extrabold opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 ml-1">
          Explore All ›
        </span>
      </h2>

      <div class="relative flex items-center w-full">
        <button class="row-scroll-btn-left absolute left-0 h-full w-10 sm:w-12 bg-black/60 hover:bg-black/85 flex items-center justify-center text-white z-[60] transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer rounded-r outline-none border-none">
          <i data-lucide="chevron-left" class="w-6 h-6 hover:scale-125 transition-transform"></i>
        </button>

        <div class="row-inner-container row-scroll-container w-full flex items-center gap-2 sm:gap-3.5 py-4 overflow-x-auto select-none scroll-smooth">
          ${slidesHTML}
        </div>

        <button class="row-scroll-btn-right absolute right-0 h-full w-10 sm:w-12 bg-black/60 hover:bg-black/85 flex items-center justify-center text-white z-[60] transition-all opacity-0 group-hover/row:opacity-100 cursor-pointer rounded-l outline-none border-none">
          <i data-lucide="chevron-right" class="w-6 h-6 hover:scale-125 transition-transform"></i>
        </button>
      </div>
    </div>
  `;
}

/* SEARCH RESULTS GRID SCREEN */
function renderSearchResults() {
  const query = state.searchQuery.toLowerCase().trim();
  const matchedMovies = ALL_MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query) ||
      m.tags.some((t) => t.toLowerCase().includes(query)) ||
      m.genre.toLowerCase().includes(query)
  );

  const profileId = state.selectedProfile.id;
  const myList = state.myLists[profileId] || [];

  let gridCardsHTML = '';
  matchedMovies.forEach((m) => {
    const isAdded = myList.includes(m.id);
    gridCardsHTML += `
      <div class="movie-card-zoom netflix-card-zoom relative w-full aspect-[16/9] bg-zinc-900 rounded overflow-hidden shadow-md" data-movie-id="${m.id}">
        <img src="${m.thumbnailUrl}" alt="" class="w-full h-full object-cover rounded" />
        <div class="movie-card-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 rounded">
          <p class="text-white text-xs sm:text-sm font-bold truncate mb-1 select-none">${m.title}</p>
          <div class="flex items-center gap-2 text-[9px] sm:text-xs font-semibold mb-2">
            <span class="text-green-500 font-bold">${m.similarityMatch}% Match</span>
            <span class="text-white border border-white/40 px-1 rounded-xs text-[8px] leading-none">${m.ageRating}</span>
          </div>
          <div class="flex items-center gap-2 pt-1 border-t border-white/10">
            <button class="card-play-btn p-1.5 bg-white text-black hover:bg-zinc-200 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-transform">
              <i data-lucide="play" class="w-3 h-3 text-black fill-black ml-0.5"></i>
            </button>
            <button class="card-list-btn p-1 border border-white/60 hover:border-white rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-transform" data-movie-id="${m.id}">
              <i data-lucide="${isAdded ? 'check' : 'plus'}" class="w-3.5 h-3.5 ${isAdded ? 'text-green-400' : ''}"></i>
            </button>
            <button class="card-info-btn ml-auto p-1.5 bg-zinc-800 text-white hover:bg-zinc-700 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-transform" data-movie-id="${m.id}">
              <i data-lucide="info" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  return `
    <div class="px-4 sm:px-12 pt-28 select-none animate-fade-in">
      <h2 class="text-white text-xl sm:text-2xl font-bold tracking-wide mb-8">
        Search results for <span class="text-zinc-400 font-medium">"${state.searchQuery}"</span>
      </h2>
      ${matchedMovies.length > 0 ? `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          ${gridCardsHTML}
        </div>
      ` : `
        <div class="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
          <i data-lucide="search" class="w-16 h-16 text-zinc-600 mb-4 animate-scale-up"></i>
          <p class="text-lg font-semibold text-zinc-300">Your search did not have any matches.</p>
          <span class="text-sm text-zinc-500 font-light mt-1.5 max-w-sm">Try using other terms, movie names, genre tags, or tv show titles.</span>
        </div>
      `}
    </div>
  `;
}

/* MY LIST LIBRARY WITH EMPTY STATE FALLBACK */
function renderMyListTab() {
  const profileId = state.selectedProfile.id;
  const myListIds = state.myLists[profileId] || [];
  const listMovies = ALL_MOVIES.filter((m) => myListIds.includes(m.id));

  let listContent = '';
  if (listMovies.length > 0) {
    listMovies.forEach((m) => {
      listContent += `
        <div class="movie-card-zoom netflix-card-zoom relative w-full aspect-[16/9] bg-zinc-900 rounded overflow-hidden shadow-md" data-movie-id="${m.id}">
          <img src="${m.thumbnailUrl}" alt="" class="w-full h-full object-cover rounded" />
          <div class="movie-card-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 rounded">
            <p class="text-white text-xs sm:text-sm font-bold truncate mb-1 select-none">${m.title}</p>
            <div class="flex items-center gap-2 text-[9px] sm:text-xs font-semibold mb-2">
              <span class="text-green-500 font-bold">${m.similarityMatch}% Match</span>
              <span class="text-white border border-white/40 px-1 rounded-xs text-[8px] leading-none">${m.ageRating}</span>
            </div>
            <div class="flex items-center gap-2 pt-1 border-t border-white/10">
              <button class="card-play-btn p-1.5 bg-white text-black hover:bg-zinc-200 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-transform animate-scale-up">
                <i data-lucide="play" class="w-3 h-3 text-black fill-black ml-0.5"></i>
              </button>
              <button class="card-list-btn p-1 border border-white/60 hover:border-white rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-transform" data-movie-id="${m.id}">
                <i data-lucide="check" class="w-3.5 h-3.5 text-green-455 text-green-400"></i>
              </button>
              <button class="card-info-btn ml-auto p-1.5 bg-zinc-805 text-white hover:bg-zinc-700 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-transform" data-movie-id="${m.id}">
                <i data-lucide="info" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }

  return `
    <div class="px-4 sm:px-12 pt-28 select-none animate-fade-in min-h-[50vh]">
      <h2 class="text-white text-xl sm:text-2xl font-bold tracking-wide mb-8">My List</h2>
      
      ${listMovies.length > 0 ? `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          ${listContent}
        </div>
      ` : `
        <div class="flex flex-col items-center justify-center p-16 border border-dashed border-zinc-800 rounded bg-zinc-900/10 text-center max-w-lg mx-auto">
          <div class="h-14 w-14 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-500 mb-4 animate-scale-up shadow-lg">
            <i data-lucide="plus" class="w-6 h-6"></i>
          </div>
          <p class="text-lg font-bold text-zinc-300">You haven't added anything to your list yet.</p>
          <span class="text-xs text-zinc-500 font-light mt-1 max-w-sm">Build your personalized list of must-watch shows by clicking the plus (+) symbol next to any trailer.</span>
          <button id="mylist-explore-btn" class="mt-6 px-6 py-2 bg-white hover:bg-zinc-200 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded transition-all cursor-pointer">
            Explore Homepage
          </button>
        </div>
      `}
    </div>
  `;
}

/* DETAILS DRAWER DIALOG MODAL */
function renderDetailModal(m) {
  const profileId = state.selectedProfile.id;
  const myList = state.myLists[profileId] || [];
  const isAdded = myList.includes(m.id);

  const recommendations = ALL_MOVIES.filter(
    (other) => other.id !== m.id && (other.genre === m.genre || other.tags.some((t) => m.tags.includes(t)))
  ).slice(0, 3);

  let recsHTML = '';
  recommendations.forEach((rec) => {
    const isRecAdded = myList.includes(rec.id);
    recsHTML += `
      <div class="bg-zinc-900 rounded border border-zinc-800/80 overflow-hidden text-xs flex flex-col group/rec select-text">
        <div class="relative aspect-[16/9] bg-zinc-800 select-none">
          <img src="${rec.thumbnailUrl}" alt="" class="w-full h-full object-cover group-hover/rec:scale-105 transition-transform duration-300" />
          <span class="absolute top-2 right-2 text-[9px] bg-black/75 font-semibold px-2 py-0.5 rounded text-zinc-300">
            ${rec.duration}
          </span>
        </div>

        <div class="p-4 flex flex-col gap-2 flex-grow">
          <div class="flex items-center justify-between select-none">
            <span class="text-green-500 font-bold">${rec.similarityMatch}% Match</span>
            <button class="modal-rec-add-btn p-1 border border-zinc-600 hover:border-white rounded-full bg-zinc-900 w-7 h-7 flex items-center justify-center text-white cursor-pointer select-none" data-rec-id="${rec.id}">
              <i data-lucide="${isRecAdded ? 'check' : 'plus'}" class="w-3.5 h-3.5 ${isRecAdded ? 'text-green-400' : ''}"></i>
            </button>
          </div>

          <span class="text-white font-bold text-xs leading-snug line-clamp-1 truncate">${rec.title}</span>
          <p class="text-zinc-400 text-[11px] leading-relaxed line-clamp-2 font-light">
            ${rec.description}
          </p>
        </div>
      </div>
    `;
  });

  return `
    <div id="info-modal-overlay" class="fixed inset-0 bg-black/85 flex items-center justify-center z-[120] overflow-y-auto p-3 sm:p-6 select-none animate-fade-in">
      <div class="absolute inset-0 cursor-pointer" id="close-modal-backdrop"></div>

      <div class="relative bg-[#181818] w-full max-w-3xl rounded-lg overflow-hidden shadow-2xl z-[130] border border-zinc-800 select-text my-5 my-auto animate-scale-up">
        <!-- Backdrop Banner with Controls -->
        <div class="relative aspect-[16/9] w-full bg-zinc-900 select-none">
          <img src="${m.backdropUrl}" alt="" class="w-full h-full object-cover brightness-[0.70]" />

          <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#181818] via-[#181818]/45 to-transparent"></div>
          <div class="absolute top-0 right-0 p-4 select-none">
            <button id="id-close-modal" class="h-9 w-9 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/10 hover:scale-105 active:scale-95">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <div class="absolute bottom-6 left-6 sm:left-10 right-6 select-none flex flex-col items-start gap-4">
            <h1 class="font-display text-2xl sm:text-4xl font-black text-white leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] uppercase">
              ${m.title}
            </h1>

            <div class="flex items-center gap-3">
              <button id="modal-play-btn" class="flex items-center gap-2 px-6 sm:px-8 py-2.5 bg-white hover:bg-zinc-200 text-black font-extrabold rounded shadow-md text-sm cursor-pointer transition-transform hover:scale-102 active:scale-95">
                <i data-lucide="play" class="w-4 h-4 text-black fill-black ml-0.5"></i>
                Play Player
              </button>

              <button id="modal-list-btn-${m.id}" class="modal-list-btn h-10 w-10 border border-white/60 hover:bg-white/10 hover:border-white rounded-full bg-black/45 flex items-center justify-center text-white cursor-pointer transition-all" title="${isAdded ? 'Remove from List' : 'Add to List'}">
                <i data-lucide="${isAdded ? 'check' : 'plus'}" class="${isAdded ? 'text-green-500 text-green-400' : ''}"></i>
              </button>

              <button class="h-10 w-10 border border-white/60 hover:bg-white/10 hover:border-white rounded-full bg-black/45 flex items-center justify-center text-white cursor-pointer transition-all group/thumb">
                <i data-lucide="thumbs-up" class="w-4 h-4 group-hover/thumb:scale-125 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Specifications and Details Grid -->
        <div class="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div class="md:col-span-2 flex flex-col gap-4">
            <div class="flex items-center gap-3 font-semibold select-none">
              <span class="text-green-500 font-bold">${m.similarityMatch}% Match</span>
              <span class="text-zinc-400 font-mono">${m.releaseYear}</span>
              <span class="text-white border border-white/40 px-1.5 py-0.2 rounded text-xs select-none">
                ${m.ageRating}
              </span>
              <span class="text-zinc-400 font-normal select-none">${m.duration}</span>
            </div>

            <div class="flex items-center gap-2.5 text-xs text-[#E50914] bg-red-950/20 border border-red-900/30 px-3.5 py-2 rounded select-none">
              <i data-lucide="shield" class="w-4 h-4 shrink-0 text-red-500 animate-pulse"></i>
              <span>Interactive HTML5 stream simulated with highly detailed subtitle integration.</span>
            </div>

            <p class="text-zinc-300 text-xs sm:text-sm leading-relaxed font-light">
              ${m.description}
            </p>
          </div>

          <div class="flex flex-col gap-3.5 text-xs text-zinc-400 border-l border-zinc-900 pl-0 md:pl-5">
            <div>
              <span class="text-zinc-500 font-bold">Cast:</span>
              <span class="text-zinc-300 font-light ml-1">${m.cast.join(', ')}</span>
            </div>

            ${m.creators ? `
              <div>
                <span class="text-zinc-500 font-bold">Creators:</span>
                <span class="text-zinc-300 font-light ml-1">${m.creators.join(', ')}</span>
              </div>
            ` : ''}

            <div>
              <span class="text-zinc-500 font-bold">Genres:</span>
              <span class="text-zinc-300 font-light ml-1">${m.genre}</span>
            </div>

            <div>
              <span class="text-zinc-500 font-bold">This is:</span>
              <span class="text-zinc-300 font-light ml-1">${m.tags.join(', ')}</span>
            </div>
          </div>
        </div>

        <!-- Inline Recommendations Grid -->
        ${recommendations.length > 0 ? `
          <div class="px-6 sm:px-10 pb-8">
            <h3 class="text-white text-base sm:text-lg font-bold mb-4 tracking-wide border-t border-zinc-900 pt-6">
              More Like This
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              ${recsHTML}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

/* HIGH-FIDELITY FULLSCREEN VIDEO PLAYER */
function renderVideoPlayer(m) {
  return `
    <div id="full-screen-video-overlay" class="fixed inset-0 bg-black z-200 select-none flex flex-col justify-between overflow-hidden animate-fade-in">
      
      <!-- Video Element -->
      <video id="html5-video-player" class="absolute inset-0 w-full h-full object-cover" autoplay>
        <source src="${m.videoUrl}">
      </video>

      <!-- Subtitles Display -->
      <div id="video-subtitles-box" class="absolute bottom-24 sm:bottom-28 left-4 right-4 text-center z-220 select-none pointer-events-none">
        <span class="subtitle-text text-yellow-400 bg-black/65 px-4 py-2 rounded text-sm sm:text-base md:text-lg tracking-wide font-medium border border-zinc-900/40">
          [Media Loading...]
        </span>
      </div>

      <!-- Top Overlay Controls Layout (Close & Title) -->
      <div class="video-overlay-control absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 to-transparent p-4 sm:p-6 z-210 flex items-center justify-between transition-opacity duration-300">
        <button id="player-close-btn" class="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 hover:bg-white/10 rounded-full transition-transform active:scale-95 cursor-pointer">
          <i data-lucide="arrow-left" class="w-6 h-6 sm:w-7 sm:h-7 text-white"></i>
        </button>

        <div class="text-center font-display">
          <h2 class="text-white text-sm sm:text-lg font-bold tracking-tight uppercase">${m.title}</h2>
          <span class="text-zinc-400 text-[10px] sm:text-xs">Playing Trailer Preview</span>
        </div>

        <div class="w-10 sm:w-12"></div>
      </div>

      <!-- Bottom Interactive Dashboard Overlay Controls -->
      <div class="video-overlay-control absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 sm:p-6 z-210 flex flex-col gap-4 transition-opacity duration-300">
        
        <!-- Progress Bar Track -->
        <div class="flex items-center gap-3">
          <span id="player-current-time" class="text-zinc-300 text-xs font-mono w-10 shrink-0">00:00</span>
          <input type="range" id="player-progress-bar" min="0" max="100" value="0" class="w-full h-1 h-1.5 focus:outline-none cursor-pointer rounded-lg hover:h-2 transition-all" />
          <span id="player-duration" class="text-zinc-300 text-xs font-mono w-10 shrink-0">00:00</span>
        </div>

        <!-- Controls Dashboard -->
        <div class="flex items-center justify-between font-mono text-zinc-100">
          <div class="flex items-center gap-4 sm:gap-6">
            <!-- Backward Rewind -->
            <button id="player-rewind-btn" class="hover:text-white cursor-pointer active:scale-90 transition-transform p-1" title="Rewind 10s">
              <i data-lucide="rotate-ccw" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            </button>

            <!-- Main Play Toggle -->
            <button id="player-main-play" class="hover:text-white cursor-pointer active:scale-90 transition-transform p-1.5 bg-white/10 hover:bg-white/20 rounded-full" title="Play / Pause">
              <i data-lucide="pause" id="player-play-icon" class="w-5 h-5 sm:w-7 sm:h-7 fill-white"></i>
            </button>

            <!-- Forward Jump -->
            <button id="player-forward-btn" class="hover:text-white cursor-pointer active:scale-90 transition-transform p-1" title="Forward 10s">
              <i data-lucide="rotate-cw" class="w-5 h-5 sm:w-6 sm:h-6"></i>
            </button>

            <!-- Volume Slider Control -->
            <div class="flex items-center gap-2 group/volume">
              <button id="player-mute-btn" class="hover:text-white cursor-pointer active:scale-90 transition-transform" title="Mute">
                <i data-lucide="volume-2" id="player-volume-icon"></i>
              </button>
              <input type="range" id="player-volume-slider" min="0" max="100" value="80" class="w-16 sm:w-24 h-1 focus:outline-none cursor-pointer" />
            </div>
          </div>

          <div class="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <!-- Speed selector dropdown -->
            <div class="relative">
              <button id="player-speed-btn" class="hover:text-white cursor-pointer hover:font-bold select-none p-1 shrink-0 font-medium tracking-wide">
                1.0x Speed
              </button>
              <div id="player-speed-dropdown" class="absolute bottom-10 right-0 hidden bg-black/95 border border-zinc-800 rounded py-1 text-center w-24 flex flex-col z-[250]">
                <button class="player-speed-option py-1.5 hover:bg-[#E50914] text-[11px]" data-speed="0.5">0.5x</button>
                <button class="player-speed-option py-1.5 hover:bg-[#E50914] text-[11px]" data-speed="1.0">Normal</button>
                <button class="player-speed-option py-1.5 hover:bg-[#E50914] text-[11px]" data-speed="1.5">1.5x</button>
                <button class="player-speed-option py-1.5 hover:bg-[#E50914] text-[11px]" data-speed="2.0">2.0x</button>
              </div>
            </div>

            <!-- Picture in Picture -->
            <button id="player-pip-btn" class="hover:text-white cursor-pointer active:scale-90 transition-transform" title="Picture in Picture">
              <i data-lucide="radio" class="w-5 h-5"></i>
            </button>

            <!-- Maximize Full Screen toggle -->
            <button id="player-fullscreen-btn" class="hover:text-white cursor-pointer active:scale-90 transition-transform" title="Toggle Full Screen">
              <i data-lucide="maximize-2" id="player-fullscreen-icon" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

/* FOOTER STANDARD */
function renderFooter() {
  return `
    <footer class="bg-[#141414] py-14 border-t border-zinc-900 text-zinc-500 text-xs sm:text-sm tracking-wide select-none">
      <div class="max-w-4xl mx-auto px-6 flex flex-col gap-8">
        <div class="flex gap-6 text-lg text-zinc-300">
          <i data-lucide="globe" class="cursor-pointer hover:text-white transition-colors"></i>
          <i data-lucide="shield" class="cursor-pointer hover:text-white transition-colors"></i>
          <i data-lucide="heart" class="cursor-pointer hover:text-white transition-colors"></i>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px]" id="footer-directory">
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Audio Description</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Help Center</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Gift Cards</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Media Center</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Investor Relations</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Jobs</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Terms of Use</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Privacy Statement</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Legal Notices</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Cookie Preferences</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Corporate Information</a>
          <a href="#" class="hover:underline hover:text-zinc-300 select-none py-1">Contact Us</a>
        </div>

        <div class="flex flex-col gap-3 font-mono text-[10px] text-zinc-600 mt-4">
          <span class="py-1 px-3 border border-zinc-700 hover:text-zinc-300 cursor-pointer w-fit rounded">Service Code</span>
          <span>© 1997-2026 Netflix, Inc. Simulated Interactive Clone for Streaming Previews</span>
        </div>
      </div>
    </footer>
  `;
}

// ==========================================
// 6. DOM EVENT BINDING ENGINE
// ==========================================

/* PROFILE CHOICE LOGIC */
function bindProfileSelectionEvents() {
  const isEditing = state.isProfileEditingMode;

  // Toggle manage mode
  const tBtn = document.getElementById('id-manage-profiles');
  if (tBtn) {
    tBtn.onclick = () => {
      state.isProfileEditingMode = !state.isProfileEditingMode;
      state.editingProfileId = null;
      renderApp();
    };
  }

  // Edit name buttons
  document.querySelectorAll('.profile-item-edit-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const pId = btn.getAttribute('data-edit-profile-id');
      const p = state.profiles.find((x) => x.id === pId);
      state.editingProfileId = pId;
      state.editingName = p ? p.name : '';
      renderApp();
    };
  });

  // Save profile name
  document.querySelectorAll('.profile-save-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const pId = btn.getAttribute('data-save-profile-id');
      const targetInput = document.getElementById(`profile-edit-input-${pId}`);
      if (targetInput) {
        saveProfileNameValue(pId, targetInput.value);
      }
    };
  });

  // Listen to enter keys inside text input
  state.profiles.forEach((p) => {
    const inp = document.getElementById(`profile-edit-input-${p.id}`);
    if (inp) {
      inp.onkeydown = (e) => {
        if (e.key === 'Enter') {
          saveProfileNameValue(p.id, inp.value);
        }
      };
    }
  });

  // Profile cards click logic
  document.querySelectorAll('.profile-card-container').forEach((card) => {
    card.onclick = () => {
      const pId = card.getAttribute('data-profile-id');
      if (!isEditing && state.editingProfileId === null) {
        const found = state.profiles.find((x) => x.id === pId);
        if (found) selectProfile(found);
      }
    };
  });
}

function saveProfileNameValue(pId, val) {
  const cleanVal = val.trim();
  if (cleanVal) {
    state.profiles = state.profiles.map((p) => (p.id === pId ? { ...p, name: cleanVal } : p));
  }
  state.editingProfileId = null;
  updateStorage();
  renderApp();
}

/* NAVBAR HEADER LOGIC */
function bindHeaderEvents() {
  // Brand Logo clicks return to home
  const brand = document.getElementById('nav-brand');
  if (brand) {
    brand.onclick = () => {
      state.activeTab = 'Home';
      state.searchQuery = '';
      state.isMobileMenuOpen = false;
      renderApp();
    };
  }

  // Navbar background change on scrolls
  const header = document.getElementById('main-navbar');
  window.onscroll = () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('bg-[#141414]', 'shadow-md', 'backdrop-blur-md', 'bg-opacity-95');
        header.classList.remove('nav-gradient');
      } else {
        header.classList.remove('bg-[#141414]', 'shadow-md', 'backdrop-blur-md', 'bg-opacity-95');
        header.classList.add('nav-gradient');
      }
    }
  };

  // Nav categories buttons clicks
  document.querySelectorAll('.nav-tab-btn').forEach((btn) => {
    btn.onclick = () => {
      const targetTab = btn.getAttribute('data-tab');
      state.activeTab = targetTab;
      state.searchQuery = '';
      state.isMobileMenuOpen = false;
      renderApp();
    };
  });

  // Mobile nav links list
  document.querySelectorAll('.mobile-nav-tab-btn').forEach((btn) => {
    btn.onclick = () => {
      const targetTab = btn.getAttribute('data-tab');
      state.activeTab = targetTab;
      state.searchQuery = '';
      state.isMobileMenuOpen = false;
      renderApp();
    };
  });

  // Hamburger button
  const hamburger = document.getElementById('mobile-hamburger-btn');
  if (hamburger) {
    hamburger.onclick = () => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
      renderApp();
    };
  }

  // Profile switches clicks
  const profileToggle = document.getElementById('profile-dropdown-toggle');
  if (profileToggle) {
    profileToggle.onclick = (e) => {
      e.stopPropagation();
      state.isProfileDropdownOpen = !state.isProfileDropdownOpen;
      state.isNotificationsOpen = false;
      renderApp();
    };
  }

  // Profile signout action
  const switcher = document.getElementById('id-switch-p');
  if (switcher) switcher.onclick = () => logoutProfile();

  const mobileSignout = document.getElementById('mobile-signout');
  if (mobileSignout) mobileSignout.onclick = () => logoutProfile();

  // Notifications bell click
  const notifToggle = document.getElementById('notifications-dropdown-toggle');
  if (notifToggle) {
    notifToggle.onclick = (e) => {
      e.stopPropagation();
      state.isNotificationsOpen = !state.isNotificationsOpen;
      state.isProfileDropdownOpen = false;
      renderApp();
    };
  }

  // Search input change values
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.oninput = (e) => {
      const oldQuery = state.searchQuery;
      state.searchQuery = e.target.value;
      if (!oldQuery || !e.target.value) {
        renderApp();
      } else {
        const resultsBox = document.getElementById('root');
        if (resultsBox) {
          const resultsPanel = resultsBox.querySelector('main');
          if (resultsPanel) {
            resultsPanel.innerHTML = renderSearchResults();
            bindSearchResultsEvents();
            lucide.createIcons();
          }
        }
      }
    };
  }

  const searchClear = document.getElementById('global-search-clear');
  if (searchClear) {
    searchClear.onclick = () => {
      state.searchQuery = '';
      renderApp();
    };
  }

  // Close menus on clicking document level
  document.onclick = () => {
    let changed = false;
    if (state.isProfileDropdownOpen) {
      state.isProfileDropdownOpen = false;
      changed = true;
    }
    if (state.isNotificationsOpen) {
      state.isNotificationsOpen = false;
      changed = true;
    }
    if (changed) renderApp();
  };

  // Hero play trigger
  const playBtn = document.querySelector('.hero-play-btn');
  if (playBtn) {
    playBtn.onclick = () => startVideoPlay(HERO_MOVIE);
  }

  // Hero info description slider click
  const infoBtn = document.querySelector('.hero-info-btn');
  if (infoBtn) {
    infoBtn.onclick = () => showMovieInfo(HERO_MOVIE);
  }

  const tBtnHero = document.getElementById('hero-list-btn');
  if (tBtnHero) {
    tBtnHero.onclick = (e) => toggleMyList(HERO_MOVIE, e);
  }
}

/* CAROUSEL ROWS MOVEMENT LOGIC */
function bindMovieRowEvents() {
  document.querySelectorAll('[id^="movie-row-container-"]').forEach((elem) => {
    const scroller = elem.querySelector('.row-inner-container');
    const leftArrow = elem.querySelector('.row-scroll-btn-left');
    const rightArrow = elem.querySelector('.row-scroll-btn-right');

    const updateArrowVisibilities = () => {
      if (scroller) {
        const sLeft = scroller.scrollLeft;
        const sWidth = scroller.scrollWidth;
        const cWidth = scroller.clientWidth;

        if (leftArrow) {
          if (sLeft > 10) {
            leftArrow.classList.remove('opacity-0');
            leftArrow.style.pointerEvents = 'auto';
          } else {
            leftArrow.classList.add('opacity-0');
            leftArrow.style.pointerEvents = 'none';
          }
        }

        if (rightArrow) {
          if (sLeft + cWidth < sWidth - 10) {
            rightArrow.classList.remove('opacity-0');
            rightArrow.style.pointerEvents = 'auto';
          } else {
            rightArrow.classList.add('opacity-0');
            rightArrow.style.pointerEvents = 'none';
          }
        }
      }
    };

    if (scroller) {
      scroller.onscroll = updateArrowVisibilities;
      // Trigger once check
      setTimeout(updateArrowVisibilities, 200);
    }

    if (leftArrow && scroller) {
      leftArrow.onclick = () => {
        scroller.scrollBy({ left: -scroller.clientWidth * 0.75, behavior: 'smooth' });
        setTimeout(updateArrowVisibilities, 450);
      };
    }

    if (rightArrow && scroller) {
      rightArrow.onclick = () => {
        scroller.scrollBy({ left: scroller.clientWidth * 0.75, behavior: 'smooth' });
        setTimeout(updateArrowVisibilities, 450);
      };
    }
  });

  // Movie Row Card action buttons
  document.querySelectorAll('.card-play-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const pCard = btn.closest('[data-movie-id]');
      const mId = pCard ? pCard.getAttribute('data-movie-id') : null;
      const m = ALL_MOVIES.find((x) => x.id === mId);
      if (m) startVideoPlay(m);
    };
  });

  document.querySelectorAll('.card-list-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const mId = btn.getAttribute('data-movie-id');
      const m = ALL_MOVIES.find((x) => x.id === mId);
      if (m) toggleMyList(m, e);
    };
  });

  document.querySelectorAll('.card-info-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const mId = btn.getAttribute('data-movie-id');
      const m = ALL_MOVIES.find((x) => x.id === mId);
      if (m) showMovieInfo(m);
    };
  });

  // Clicking anywhere on the card other than buttons also opens info drawer
  document.querySelectorAll('.movie-card-zoom').forEach((card) => {
    card.onclick = (e) => {
      const mId = card.getAttribute('data-movie-id');
      const m = ALL_MOVIES.find((x) => x.id === mId) || (HERO_MOVIE.id === mId ? HERO_MOVIE : null);
      if (m) showMovieInfo(m);
    };
  });
}

/* DETAILS DRAWER DIALOG LOGIC */
function bindModalEvents() {
  const close = document.getElementById('id-close-modal');
  if (close) {
    close.onclick = () => {
      state.selectedMovieInfo = null;
      renderApp();
    };
  }

  const bgClose = document.getElementById('close-modal-backdrop');
  if (bgClose) {
    bgClose.onclick = () => {
      state.selectedMovieInfo = null;
      renderApp();
    };
  }

  const play = document.getElementById('modal-play-btn');
  if (play) {
    play.onclick = () => {
      if (state.selectedMovieInfo) {
        startVideoPlay(state.selectedMovieInfo);
      }
    };
  }

  const listBtn = document.querySelector('.modal-list-btn');
  if (listBtn) {
    listBtn.onclick = (e) => {
      if (state.selectedMovieInfo) {
        toggleMyList(state.selectedMovieInfo, e);
      }
    };
  }

  // Recommendations cards additions in modal
  document.querySelectorAll('.modal-rec-add-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const recId = btn.getAttribute('data-rec-id');
      const m = ALL_MOVIES.find((x) => x.id === recId);
      if (m) {
        toggleMyList(m, e);
        // Refresh detail modal
        renderApp();
      }
    };
  });
}

/* SEARCH & MY LIST ACTIONS */
function bindSearchResultsEvents() {
  document.querySelectorAll('.card-play-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const pCard = btn.closest('[data-movie-id]');
      const mId = pCard ? pCard.getAttribute('data-movie-id') : null;
      const m = ALL_MOVIES.find((x) => x.id === mId);
      if (m) startVideoPlay(m);
    };
  });

  document.querySelectorAll('.card-list-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const mId = btn.getAttribute('data-movie-id');
      const m = ALL_MOVIES.find((x) => x.id === mId);
      if (m) toggleMyList(m, e);
    };
  });

  document.querySelectorAll('.card-info-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const mId = btn.getAttribute('data-movie-id');
      const m = ALL_MOVIES.find((x) => x.id === mId);
      if (m) showMovieInfo(m);
    };
  });

  const explore = document.getElementById('mylist-explore-btn');
  if (explore) {
    explore.onclick = () => {
      state.activeTab = 'Home';
      renderApp();
    };
  }
}

// ==========================================
// 7. VIDEO CONTROLLABLE STREAM PLAYER DRIVER
// ==========================================

function initVideoPlayerControls() {
  const video = document.getElementById('html5-video-player');
  const overlayOverlay = document.getElementById('full-screen-video-overlay');
  if (!video || !overlayOverlay) return;

  // State hooks
  let isVideoPlaying = true;
  let isMuted = false;
  let seekValue = 0.8;
  let subtitleIndex = 0;
  
  const movie = state.playingMovie;
  const subtitles = movie.subtitles || [];

  // Elements mapping
  const close = document.getElementById('player-close-btn');
  const mainPlay = document.getElementById('player-main-play');
  const playIcon = document.getElementById('player-play-icon');
  const bar = document.getElementById('player-progress-bar');
  const currentText = document.getElementById('player-current-time');
  const durationText = document.getElementById('player-duration');
  const backBtn = document.getElementById('player-rewind-btn');
  const forwardBtn = document.getElementById('player-forward-btn');
  const volumeIcon = document.getElementById('player-volume-icon');
  const volumeSlider = document.getElementById('player-volume-slider');
  const muteBtn = document.getElementById('player-mute-btn');
  const velocityBtn = document.getElementById('player-speed-btn');
  const velocityDrop = document.getElementById('player-speed-dropdown');
  const pip = document.getElementById('player-pip-btn');
  const fsBtn = document.getElementById('player-fullscreen-btn');
  const fsIcon = document.getElementById('player-fullscreen-icon');
  const subsBox = document.getElementById('video-subtitles-box');

  const formatVideoTextTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  // Close player
  close.onclick = () => {
    video.pause();
    state.playingMovie = null;
    renderApp();
  };

  // Esc keyboard key binds
  const stopListenEsc = (e) => {
    if (e.key === 'Escape') {
      video.pause();
      state.playingMovie = null;
      document.removeEventListener('keydown', stopListenEsc);
      renderApp();
    }
  };
  document.addEventListener('keydown', stopListenEsc);

  // Auto trigger mute state
  video.muted = isMuted;
  video.volume = seekValue;

  // Event play locks
  video.onloadedmetadata = () => {
    durationText.innerText = formatVideoTextTime(video.duration);
    bar.max = Math.floor(video.duration);
  };

  // Play pause triggers
  const executePlayPauseToggler = () => {
    if (video.paused) {
      video.play().catch(() => {});
      playIcon.setAttribute('data-lucide', 'pause');
      playIcon.style.fill = 'white';
      isVideoPlaying = true;
    } else {
      video.pause();
      playIcon.setAttribute('data-lucide', 'play');
      playIcon.style.fill = 'white';
      isVideoPlaying = false;
    }
    lucide.createIcons();
  };

  mainPlay.onclick = executePlayPauseToggler;
  video.onclick = executePlayPauseToggler;

  // Track timer slide updates
  video.ontimeupdate = () => {
    bar.value = Math.floor(video.currentTime);
    currentText.innerText = formatVideoTextTime(video.currentTime);
    
    // Track subtitles match
    const currSecs = Math.floor(video.currentTime);
    let matchedSubtitle = null;
    
    for (let i = subtitles.length - 1; i >= 0; i--) {
      if (currSecs >= subtitles[i].time) {
        matchedSubtitle = subtitles[i].text;
        break;
      }
    }

    if (matchedSubtitle) {
      subsBox.innerHTML = `
        <span class="subtitle-text text-yellow-400 bg-black/75 px-5 py-2 rounded text-xs sm:text-base tracking-wide font-medium border border-zinc-900/60 leading-relaxed shadow-xl max-w-xl inline-block px-4">
          ${matchedSubtitle}
        </span>
      `;
    } else {
      subsBox.innerHTML = `
        <span class="subtitle-text text-zinc-300 bg-black/60 px-5 py-1.5 rounded text-xs tracking-wide font-light border border-zinc-900/40 opacity-70">
          [Dramatic trailer theme playing]
        </span>
      `;
    }
  };

  bar.oninput = (e) => {
    video.currentTime = e.target.value;
  };

  // Jump forwards step
  forwardBtn.onclick = () => {
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  // Rewind step back
  backBtn.onclick = () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  // Audio adjustments sliders
  volumeSlider.oninput = (e) => {
    seekValue = e.target.value / 100;
    video.volume = seekValue;
    isMuted = seekValue === 0;
    video.muted = isMuted;
    updateMuteIcons();
  };

  const updateMuteIcons = () => {
    if (isMuted) {
      volumeIcon.setAttribute('data-lucide', 'volume-x');
    } else if (seekValue < 0.4) {
      volumeIcon.setAttribute('data-lucide', 'volume-1');
    } else {
      volumeIcon.setAttribute('data-lucide', 'volume-2');
    }
    lucide.createIcons();
  };

  muteBtn.onclick = () => {
    isMuted = !isMuted;
    video.muted = isMuted;
    volumeSlider.value = isMuted ? 0 : Math.floor(seekValue * 100);
    updateMuteIcons();
  };

  // Playback speeds choices
  velocityBtn.onclick = (e) => {
    e.stopPropagation();
    velocityDrop.classList.toggle('hidden');
  };

  document.querySelectorAll('.player-speed-option').forEach((opt) => {
    opt.onclick = (e) => {
      e.stopPropagation();
      const speedVal = parseFloat(opt.getAttribute('data-speed'));
      video.playbackRate = speedVal;
      velocityBtn.innerText = `${speedVal === 1.0 ? 'Normal' : speedVal + 'x'} Speed`;
      velocityDrop.classList.add('hidden');
    };
  });

  document.addEventListener('click', () => {
    if (velocityDrop) velocityDrop.classList.add('hidden');
  });

  // Picture in picture API triggers
  pip.onclick = async () => {
    try {
      if (video !== document.pictureInPictureElement) {
        await video.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (e) {
      console.warn("PIP not supported by layout frames.", e);
    }
  };

  // Full Screen canvas scaling
  fsBtn.onclick = () => {
    if (!document.fullscreenElement) {
      overlayOverlay.requestFullscreen().then(() => {
        fsIcon.setAttribute('data-lucide', 'minimize-2');
        lucide.createIcons();
      }).catch((e) => console.warn(e));
    } else {
      document.exitFullscreen().then(() => {
        fsIcon.setAttribute('data-lucide', 'maximize-2');
        lucide.createIcons();
      }).catch((e) => console.warn(e));
    }
  };

  // Hide overlay mouse controller idle states timers
  let overlayTimer;
  const overlayElements = document.querySelectorAll('.video-overlay-control');
  
  const showHUD = () => {
    overlayElements.forEach(item => item.classList.remove('opacity-0'));
    document.body.style.cursor = 'default';
    clearTimeout(overlayTimer);
    if (!video.paused) {
      overlayTimer = setTimeout(() => {
        overlayElements.forEach(item => item.classList.add('opacity-0'));
        document.body.style.cursor = 'none';
      }, 3500);
    }
  };

  overlayOverlay.onmousemove = showHUD;
  showHUD();
}

// ==========================================
// 8. LIFECYCLE STARTUP HANDLER
// ==========================================

window.onload = () => {
  renderApp();
};

// Also invoke immediately to prevent double hooks in containers
renderApp();
