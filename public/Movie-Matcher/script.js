const p = (seed) =>
  `https://picsum.photos/seed/${seed}/500/750`;

// ─── Genre map ────────────────────────────────────────────────────────────────
const GENRES = {
  27: { name: 'Horror', emoji: '🩸' },
  878: { name: 'Sci-Fi', emoji: '🚀' },
  28: { name: 'Action', emoji: '💥' },
  35: { name: 'Comedy', emoji: '😂' },
  10749: { name: 'Romance', emoji: '💘' },
  18: { name: 'Drama', emoji: '🎭' },
  53: { name: 'Thriller', emoji: '🔪' },
  14: { name: 'Fantasy', emoji: '🧙' },
  16: { name: 'Animation', emoji: '✏️' },
  80: { name: 'Crime', emoji: '🕵️' },
};

// Picsum Photos — completely open CDN, no key, no redirects, always works
// https://picsum.photos/seed/{anySeed}/500/750  → stable unique image per seed

// ─── Movie database ───────────────────────────────────────────────────────────
const MOVIES = [
  { id: 1, title: 'Shaun of the Dead', year: 2004, genre_ids: [27, 35], vote_average: 7.9, poster: p('shaun') },
  { id: 2, title: 'Tucker & Dale vs. Evil', year: 2010, genre_ids: [27, 35], vote_average: 7.5, poster: p('tucker') },
  { id: 3, title: 'What We Do in the Shadows', year: 2014, genre_ids: [27, 35], vote_average: 7.6, poster: p('shadows') },
  { id: 4, title: 'Scary Movie', year: 2000, genre_ids: [27, 35], vote_average: 6.2, poster: p('scarymovie') },

  // Action + Comedy
  { id: 5, title: 'Deadpool', year: 2016, genre_ids: [28, 35], vote_average: 8.0, poster: p('deadpool') },
  { id: 6, title: 'Hot Fuzz', year: 2007, genre_ids: [28, 35], vote_average: 7.8, poster: p('hotfuzz') },
  { id: 7, title: 'The Nice Guys', year: 2016, genre_ids: [28, 35, 80], vote_average: 7.4, poster: p('niceguys') },
  { id: 8, title: 'Superbad', year: 2007, genre_ids: [35, 80], vote_average: 7.6, poster: p('superbad') },

  // Sci-Fi + Drama
  { id: 9, title: 'Interstellar', year: 2014, genre_ids: [878, 18], vote_average: 8.6, poster: p('interstellar') },
  { id: 10, title: 'Arrival', year: 2016, genre_ids: [878, 18], vote_average: 7.9, poster: p('arrival') },
  { id: 11, title: 'Annihilation', year: 2018, genre_ids: [878, 53, 18], vote_average: 7.0, poster: p('annihilation') },
  { id: 12, title: 'Gravity', year: 2013, genre_ids: [878, 18, 53], vote_average: 7.7, poster: p('gravity2013') },

  // Sci-Fi + Romance
  { id: 13, title: 'Her', year: 2013, genre_ids: [878, 10749, 18], vote_average: 8.0, poster: p('hermovie') },
  { id: 14, title: 'The Martian', year: 2015, genre_ids: [878, 18], vote_average: 7.7, poster: p('martian') },

  // Action + Romance
  { id: 15, title: 'Mr. & Mrs. Smith', year: 2005, genre_ids: [28, 10749], vote_average: 6.5, poster: p('mrsmith') },
  { id: 16, title: 'True Lies', year: 1994, genre_ids: [28, 10749, 35], vote_average: 7.2, poster: p('truelies') },

  // Horror + Drama
  { id: 17, title: 'Get Out', year: 2017, genre_ids: [27, 53, 18], vote_average: 7.7, poster: p('getout') },
  { id: 18, title: 'Hereditary', year: 2018, genre_ids: [27, 18], vote_average: 7.3, poster: p('hereditary') },
  { id: 19, title: 'The Babadook', year: 2014, genre_ids: [27, 18, 53], vote_average: 6.8, poster: p('babadook') },

  // Horror + Thriller
  { id: 20, title: 'A Quiet Place', year: 2018, genre_ids: [27, 53], vote_average: 7.5, poster: p('quietplace') },
  { id: 21, title: 'It Follows', year: 2014, genre_ids: [27, 53], vote_average: 6.8, poster: p('itfollows') },

  // Action + Thriller
  { id: 22, title: 'Mad Max: Fury Road', year: 2015, genre_ids: [28, 53, 878], vote_average: 8.1, poster: p('madmax') },
  { id: 23, title: 'John Wick', year: 2014, genre_ids: [28, 53], vote_average: 7.4, poster: p('johnwick') },
  { id: 24, title: 'Heat', year: 1995, genre_ids: [28, 80, 53], vote_average: 8.2, poster: p('heat1995') },

  // Fantasy + Drama
  { id: 25, title: "Pan's Labyrinth", year: 2006, genre_ids: [14, 18], vote_average: 8.0, poster: p('panslabyrinth') },
  { id: 26, title: 'The Shape of Water', year: 2017, genre_ids: [14, 18, 10749], vote_average: 7.3, poster: p('shapeofwater') },

  // Fantasy + Comedy
  { id: 27, title: 'The Princess Bride', year: 1987, genre_ids: [14, 35, 10749], vote_average: 7.9, poster: p('princessbride') },

  // Sci-Fi + Comedy
  { id: 28, title: 'Zombieland', year: 2009, genre_ids: [27, 35, 28], vote_average: 7.6, poster: p('zombieland') },
  { id: 29, title: "Hitchhiker's Guide to the Galaxy", year: 2005, genre_ids: [878, 35, 14], vote_average: 6.7, poster: p('hitchhiker') },

  // Crime + Drama
  { id: 30, title: 'Parasite', year: 2019, genre_ids: [80, 18, 53], vote_average: 8.5, poster: p('parasite') },
  { id: 31, title: 'Knives Out', year: 2019, genre_ids: [80, 18, 35], vote_average: 7.9, poster: p('knivesout') },
  { id: 32, title: 'The Departed', year: 2006, genre_ids: [80, 18, 53], vote_average: 8.5, poster: p('departed') },

  // Animation
  { id: 33, title: 'Spider-Man: Into the Spider-Verse', year: 2018, genre_ids: [16, 28, 35], vote_average: 8.4, poster: p('spiderverse') },
  { id: 34, title: 'The Incredibles', year: 2004, genre_ids: [16, 28, 35, 14], vote_average: 8.0, poster: p('incredibles') }
];

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const matchBtn = document.getElementById('matchBtn');
const genre1Select = document.getElementById('genre1');
const genre2Select = document.getElementById('genre2');
const resultsEl = document.getElementById('results');
const resultsHeader = document.getElementById('resultsHeader');
const resultsCount = document.getElementById('resultsCount');
const themeToggle = document.getElementById('themeToggle');
const trailerModal = document.getElementById('trailerModal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');

// ─── Theme ────────────────────────────────────────────────────────────────────
const initTheme = () => {
  const saved = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', saved);
  themeToggle.querySelector('.toggle-icon').textContent = saved === 'dark' ? '☀️' : '🌙';
};

themeToggle.addEventListener('click', () => {
  const dark = document.body.getAttribute('data-theme') === 'dark';
  const next = dark ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  themeToggle.querySelector('.toggle-icon').textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', next);
});

// ─── Skeletons ────────────────────────────────────────────────────────────────
const showSkeletons = (n = 4) => {
  resultsEl.innerHTML = Array.from({ length: n }, () => `
    <div class="skeleton" aria-hidden="true">
      <div class="skeleton__img"></div>
      <div class="skeleton__line"></div>
      <div class="skeleton__line skeleton__line--short"></div>
    </div>
  `).join('');
  resultsHeader.classList.add('hidden');
};

// ─── Render ───────────────────────────────────────────────────────────────────
const renderMovies = (movies, g1, g2) => {
  resultsEl.innerHTML = '';

  if (!movies.length) {
    resultsHeader.classList.add('hidden');
    resultsEl.innerHTML = `
      <div class="state-message">
        <span class="state-message__icon">🎬</span>
        <p class="state-message__title">No matches found</p>
        <p class="state-message__sub">Try a different genre combination — some crossovers are rare!</p>
      </div>`;
    return;
  }

  const g1Name = GENRES[g1]?.name;
  const g2Name = GENRES[g2]?.name;
  resultsCount.textContent = `${movies.length} film${movies.length > 1 ? 's' : ''} matching ${g1Name} × ${g2Name}`;
  resultsHeader.classList.remove('hidden');

  movies.forEach(movie => {
    const saved = isFavorite(movie.id);
    const card = document.createElement('article');
    card.className = 'movie-card';

    const chips = movie.genre_ids.map(id => {
      const g = GENRES[id];
      if (!g) return '';
      const isMatch = id === g1 || id === g2;
      return `<span class="genre-chip${isMatch ? ' genre-chip--match' : ''}">${g.emoji} ${g.name}</span>`;
    }).join('');

    card.innerHTML = `
      <div class="movie-card__poster-wrap">
        <img
          class="movie-card__image"
          src="${movie.poster}"
          alt="Poster for ${movie.title}"
          loading="lazy"
        >
        <div class="movie-card__overlay">
          <button class="trailer-btn" data-title="${movie.title}">▶ Watch trailer</button>
        </div>
      </div>
      <div class="movie-card__content">
        <h2 class="movie-card__title">${movie.title}</h2>
        <div class="movie-card__meta">
          <span class="movie-card__rating">★ ${movie.vote_average.toFixed(1)}</span>
          <span class="movie-card__year">${movie.year}</span>
        </div>
        <div class="movie-card__genres">${chips}</div>
          <button
    class="favorite-btn ${saved ? "active" : ""}"
    data-id="${movie.id}">
    ${saved ? "❤️ Saved" : "♡ Favorite"}
  </button>
      </div>
    `;

    card.querySelector('.trailer-btn').addEventListener('click', () => openTrailer(movie.title));
    resultsEl.appendChild(card);
  });
};


document.addEventListener("click", (e) => {

  if (e.target.classList.contains("favorite-btn")) {

    const id = Number(e.target.dataset.id);

    const movie = MOVIES.find(
      m => m.id === id
    );

    if (movie) {
      toggleFavorite(movie);
    }
  }

  if (e.target.classList.contains("remove-favorite")) {

    const id = Number(e.target.dataset.id);

    const movie = MOVIES.find(
      m => m.id === id
    );

    if (movie) {
      toggleFavorite(movie);
    }
  }

});

// ─── Filter ───────────────────────────────────────────────────────────────────
const findMovies = (g1, g2) => {
  showSkeletons(4);
  setTimeout(() => {
    const matched = MOVIES.filter(m => m.genre_ids.includes(g1) && m.genre_ids.includes(g2));
    renderMovies(matched, g1, g2);
  }, 600);
};

// ─── Trailer modal ────────────────────────────────────────────────────────────
const openTrailer = (title) => {
  const query = encodeURIComponent(`${title} official trailer`);
  modalContent.innerHTML = `
    <p class="modal__title">${title}</p>
    <p class="modal__sub">Opens YouTube to find the official trailer in a new tab.</p>
    <a href="https://www.youtube.com/results?search_query=${query}" target="_blank" rel="noopener noreferrer" class="modal__open-btn">
      ▶ Open on YouTube
    </a>
  `;
  trailerModal.classList.remove('hidden');
  modalClose.focus();
};

const closeTrailer = () => trailerModal.classList.add('hidden');
modalClose.addEventListener('click', closeTrailer);
modalBackdrop.addEventListener('click', closeTrailer);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeTrailer(); });

// ─── Match button ─────────────────────────────────────────────────────────────
matchBtn.addEventListener('click', () => {
  const g1 = parseInt(genre1Select.value);
  const g2 = parseInt(genre2Select.value);
  if (g1 === g2) { alert('Pick two different genres!'); return; }
  findMovies(g1, g2);
});

function renderAllMovies() {
  renderMovies(MOVIES);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  renderFavorites();

  renderAllMovies();

  renderFeaturedMovies();
});

// ─── Favorites ─────────────────────────────────────────

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
}

function isFavorite(id) {
  return getFavorites().some(
    movie => movie.id === id
  );
}

function toggleFavorite(movie) {
  let favorites = getFavorites();

  const exists = favorites.some(
    item => item.id === movie.id
  );

  if (exists) {
    favorites = favorites.filter(
      item => item.id !== movie.id
    );
  } else {
    favorites.push(movie);
  }

  saveFavorites(favorites);

  renderFavorites();

  const g1 = parseInt(genre1Select.value);
  const g2 = parseInt(genre2Select.value);

  const matched = MOVIES.filter(
    m =>
      m.genre_ids.includes(g1) &&
      m.genre_ids.includes(g2)
  );

  renderMovies(matched, g1, g2);
}

function renderFavorites() {
  const container =
    document.getElementById(
      "favorites-container"
    );

  if (!container) return;

  const favorites = getFavorites();

  if (!favorites.length) {
  container.innerHTML = `
    <p class="empty-watchlist">
      No movies saved yet 🍿
    </p>
  `;
  return;
}

  container.innerHTML = favorites
    .map(
      movie => `
      <div class="movie-card">
        <img
          src="${movie.poster}"
          alt="${movie.title}"
        >

        <h3>${movie.title}</h3>

        <button
          class="remove-favorite"
          data-id="${movie.id}">
          Remove
        </button>
      </div>
    `
    )
    .join("");
}
function renderFeaturedMovies() {

  const container = document.getElementById("featuredMovies");

  // Run only on index.html
  if (!container) return;

  // Take first 5 movies
  const featuredMovies = MOVIES.slice(0, 5);

  container.innerHTML = "";

  featuredMovies.forEach(movie => {

    const saved = isFavorite(movie.id);

    const card = document.createElement("article");

    card.className = "movie-card";

    card.innerHTML = `
      <img
        class="movie-card__image"
        src="${movie.poster}"
        alt="${movie.title}"
      >

      <div class="movie-card__content">

        <h3>${movie.title}</h3>

        <p>${movie.year}</p>

        <span>⭐ ${movie.vote_average}</span>

        <button
          class="favorite-btn ${saved ? "active" : ""}"
          data-id="${movie.id}">
          ${saved ? "❤️ Saved" : "♡ Favorite"}
        </button>

      </div>
    `;

    container.appendChild(card);

  });

}