const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const IMAGE_BASE = "https://image.tmdb.org/t/p/original";
const OMDB_API_KEY = process.env.OMDB_API_KEY || "";
const OMDB_URL = "https://www.omdbapi.com/";

async function fetchOMDbByTitle(title) {
  if (!OMDB_API_KEY || OMDB_API_KEY === "REPLACE_WITH_OMDB_API_KEY") return null;
  if (!title) return null;
  try {
    const res = await fetch(`${OMDB_URL}?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&plot=short`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.Response === "True") return data;
    return null;
  } catch (e) {
    console.warn("OMDb fetch failed", e);
    return null;
  }
}

async function fetchOMDbById(imdbID) {
  if (!OMDB_API_KEY || OMDB_API_KEY === "REPLACE_WITH_OMDB_API_KEY") return null;
  if (!imdbID) return null;
  try {
    const res = await fetch(`${OMDB_URL}?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(imdbID)}&plot=short`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.Response === "True") return data;
    return null;
  } catch (e) {
    console.warn("OMDb detail fetch failed", e);
    return null;
  }
}

function mergeOmdbProductionData(movie, omdb) {
  if (!omdb || omdb.Response !== "True") return;
  if ((!Array.isArray(movie.production_companies) || movie.production_companies.length === 0) && omdb.Production && omdb.Production !== "N/A") {
    movie.production_companies = omdb.Production.split(',').map((name) => ({ name: name.trim() })).filter(Boolean);
  }
  if ((!Array.isArray(movie.production_countries) || movie.production_countries.length === 0) && omdb.Country && omdb.Country !== "N/A") {
    movie.production_countries = omdb.Country.split(',').map((name) => ({ name: name.trim(), iso_3166_1: name.trim().slice(0,2).toUpperCase() })).filter(Boolean);
  }
}

async function augmentMovieWithOmdb(m) {
  const needsPoster = !m.poster;
  const needsBackdrop = !m.backdrop;
  const needsPlot = !m.overview || m.overview.trim() === "";
  const needsProduction = (!Array.isArray(m.production_companies) || m.production_companies.length === 0) &&
    (!Array.isArray(m.production_countries) || m.production_countries.length === 0);
  if (!needsPoster && !needsBackdrop && !needsPlot && !needsProduction) return;
  const omdb = await fetchOMDbByTitle(m.title || m.original_title);
  if (!omdb) return;
  if (needsPoster && omdb.Poster && omdb.Poster !== "N/A") m.poster = omdb.Poster;
  if (needsBackdrop && omdb.Poster && omdb.Poster !== "N/A") m.backdrop = omdb.Poster;
  if (needsPlot && omdb.Plot && omdb.Plot !== "N/A") m.overview = omdb.Plot;
  if (omdb.imdbID) m.imdbID = omdb.imdbID;
  mergeOmdbProductionData(m, omdb);
}

async function searchOMDbMovies(query) {
  if (!OMDB_API_KEY || OMDB_API_KEY === "REPLACE_WITH_OMDB_API_KEY") return [];
  if (!query) return [];
  try {
    const response = await fetch(`${OMDB_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    if (!response.ok) return [];
    const data = await response.json();
    if (data.Response !== "True" || !Array.isArray(data.Search)) return [];
    const candidates = data.Search.slice(0, 8);
    const details = await Promise.all(candidates.map(async (item) => {
      const detail = await fetchOMDbById(item.imdbID);
      if (!detail) return null;
      return {
        id: detail.imdbID,
        title: detail.Title || item.Title,
        release_date: detail.Released && detail.Released !== "N/A" ? detail.Released : `${detail.Year || "2025"}-01-01`,
        year: detail.Year || item.Year,
        rating: detail.imdbRating && detail.imdbRating !== "N/A" ? parseFloat(detail.imdbRating) : 0,
        genres: detail.Genre ? detail.Genre.split(",").map((g) => g.trim()) : [],
        overview: detail.Plot && detail.Plot !== "N/A" ? detail.Plot : "",
        poster: detail.Poster && detail.Poster !== "N/A" ? detail.Poster : "",
        backdrop: detail.Poster && detail.Poster !== "N/A" ? detail.Poster : "",
        imdbID: detail.imdbID
      };
    }));
    return details.filter(Boolean);
  } catch (e) {
    console.warn("OMDb search failed", e);
    return [];
  }
}

function getActiveMovieSource() {
  return currentSearchQuery ? (Array.isArray(searchResults) ? searchResults : []) : movieDataset;
}

// UI helpers: loader and error banner
function showLoader() {
  const l = document.getElementById('loader');
  if (l) l.setAttribute('aria-hidden', 'false');
}
function hideLoader() {
  const l = document.getElementById('loader');
  if (l) l.setAttribute('aria-hidden', 'true');
}
function showError(msg) {
  const b = document.getElementById('errorBanner');
  if (!b) return;
  b.textContent = msg;
  b.hidden = false;
  setTimeout(() => { b.hidden = true; }, 6000);
}
function hideError() {
  const b = document.getElementById('errorBanner');
  if (b) b.hidden = true;
}

// Lazy-load background images set via data-bg-url
function lazyLoadBackgrounds() {
  const opts = { root: null, rootMargin: '200px', threshold: 0.01 };
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const url = el.dataset.bgUrl || el.dataset.bgUrl || el.getAttribute('data-bg-url');
      if (url) {
        el.style.backgroundImage = `url('${url}')`;
        el.classList.remove('bg-placeholder');
        el.classList.add('bg-loaded');
        el.removeAttribute('data-bg-url');
      }
      observer.unobserve(el);
    });
  }, opts);

  document.querySelectorAll('[data-bg-url]').forEach(el => {
    io.observe(el);
  });
}
const genreList = [
  { id: "all", name: "All" },
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 53, name: "Thriller" },
  { id: "indian", name: "Indian" },
  { id: 10749, name: "Romance" }
];

const heroSection = document.getElementById("heroSection");
const heroTitle = document.getElementById("heroTitle");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const trendingStrip = document.getElementById("trendingStrip");
const genreBar = document.getElementById("genreBar");
const moviesGrid = document.getElementById("moviesGrid");
const emptyState = document.getElementById("emptyState");
const resetSearchBtn = document.getElementById("resetSearchBtn");
const loadMoreWrap = document.getElementById("loadMoreWrap");
const movieCount = document.getElementById("movieCount");
const popularCount = document.getElementById("popularCount");
const themeToggle = document.getElementById("themeToggle");
const pageOverlay = document.getElementById("pageOverlay");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
let activeGenreId = "all";
let allMovies = [];
let movieDataset = [];
let searchResults = null;
let currentSearchQuery = "";
let currentPage = 1;
let totalPages = null;

const trendingSample = [
  {
    id: 101,
    title: "Dune: Part Two",
    release_date: "2024-11-01",
    rating: 9.4,
    genres: ["Action", "Sci-Fi"],
    overview: "A stunning return to the desert politics of Arrakis as new alliances ignite the future of the universe.",
    poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 102,
    title: "The Dark Knight",
    release_date: "2008-07-18",
    rating: 9.0,
    genres: ["Action", "Crime"],
    overview: "A vigilante must confront the shadows of his city as chaos rises in Gotham.",
    poster: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 103,
    title: "Alien: Romulus",
    release_date: "2024-08-16",
    rating: 8.1,
    genres: ["Horror", "Sci-Fi"],
    overview: "A new terror awakens aboard a mission gone wrong at the edge of space.",
    poster: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 104,
    title: "Oppenheimer",
    release_date: "2023-07-21",
    rating: 7.9,
    genres: ["Drama", "History"],
    overview: "A brilliant physicist builds the weapon that changes the world forever.",
    poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 105,
    title: "Gladiator",
    release_date: "2000-05-05",
    rating: 8.7,
    genres: ["Action", "Drama"],
    overview: "A fallen soldier fights to avenge his family in the arenas of the Roman Empire.",
    poster: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1600&q=80"
  }
];

const popularSample = [
  {
    id: 201,
    title: "Inception",
    release_date: "2010-07-16",
    rating: 8.8,
    genres: ["Sci-Fi", "Thriller"],
    overview: "A thief who enters the dreams of others must pull off the perfect heist.",
    poster: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 202,
    title: "Blade Runner 2049",
    release_date: "2017-10-06",
    rating: 8.0,
    genres: ["Sci-Fi", "Drama"],
    overview: "A new blade runner uncovers a secret that could topple civilization.",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 203,
    title: "Interstellar",
    release_date: "2014-11-07",
    rating: 8.6,
    genres: ["Adventure", "Drama"],
    overview: "A team crosses the galaxy to save humanity from extinction.",
    poster: "https://images.unsplash.com/photo-1514894781790-7b26996c2400?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1514894781790-7b26996c2400?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 204,
    title: "1917",
    release_date: "2019-12-25",
    rating: 8.3,
    genres: ["Drama", "War"],
    overview: "Two soldiers race against time to deliver a message through enemy lines.",
    poster: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 205,
    title: "Mad Max: Fury Road",
    release_date: "2015-05-15",
    rating: 8.1,
    genres: ["Action", "Adventure"],
    overview: "A lone warrior escorts a rebel through a wasteland ruled by a tyrant.",
    poster: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 206,
    title: "The Revenant",
    release_date: "2015-12-25",
    rating: 8.0,
    genres: ["Adventure", "Thriller"],
    overview: "A frontiersman fights to survive and seek revenge after being left for dead.",
    poster: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: 207,
    title: "Midnight Mumbai",
    release_date: "2024-09-27",
    rating: 8.2,
    genres: ["Drama", "Thriller", "Indian"],
    overview: "A city detective must solve a high-stakes case that moves through Mumbai's neon nights.",
    original_language: "hi",
    production_countries: [{ iso_3166_1: "IN", name: "India" }],
    poster: "https://images.unsplash.com/photo-1517260913117-9a528d8d97a5?auto=format&fit=crop&w=800&q=80",
    backdrop: "https://images.unsplash.com/photo-1517260913117-9a528d8d97a5?auto=format&fit=crop&w=1600&q=80"
  }
];

function buildTitleAnimation(text) {
  const words = text.split(" ");
  heroTitle.innerHTML = words
    .map((word, index) => {
      return `<span class='hero-word' style='animation-delay:${index * 0.12}s'>${word}</span>`;
    })
    .join(" ");
}

function setHeroBackdrop(movie) {
  const background = movie.backdrop
    ? `url('${movie.backdrop}')`
    : `url('${IMAGE_BASE + movie.backdrop_path}')`;
  heroSection.style.setProperty("--hero-bg", background);
  heroSection.dataset.bg = "true";
  const titleText = movie.title || "Discover Your Next Favourite";
  buildTitleAnimation(titleText.toUpperCase());
}

function getRatingWidth(rating) {
  const numericRating = Number(rating ?? 0);
  return `${Math.min(100, Math.max(0, Math.round((numericRating / 10) * 100)))}%`;
}

function formatRating(rating) {
  const numericRating = rating ?? (rating === 0 ? 0 : null);
  return numericRating != null && !Number.isNaN(Number(numericRating))
    ? Number(numericRating).toFixed(1)
    : "N/A";
}

function isIndianMovie(movie) {
  const countryMatch = (movie.production_countries || []).some((country) =>
    country.name?.toLowerCase().includes("india") || country.iso_3166_1 === "IN"
  );
  const languageMatch = movie.original_language === "hi" || movie.original_language === "bn";
  return countryMatch || languageMatch || (movie.genres || []).includes("Indian");
}

function generateAIInsight(movie) {
  const source = movie.overview || movie.tagline || "A gripping cinematic experience awaits.";
  const sentence = source.split(".")[0] || source;
  return `AI Insight: ${sentence.trim()}...`;
}

function createMovieCard(movie) {
  const card = document.createElement("article");
  card.className = "movie-card fade-up";
  card.setAttribute('tabindex', '0');
  const releaseDate = movie.release_date || "TBD";
  const formattedDate = new Date(releaseDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const summary = generateAIInsight(movie);
  const ratingValue = movie.rating ?? movie.vote_average;
  const ratingText = formatRating(ratingValue);
  const bgUrl = movie.poster || (movie.poster_path ? IMAGE_BASE + movie.poster_path : "");
  const productionLabels = (movie.production_companies || []).slice(0,3).map((p) => `<span class="production-pill">${p.name || p}</span>`);
  if (!productionLabels.length) {
    productionLabels.push(...(movie.production_countries || []).slice(0,3).map((c) => `<span class="production-pill">${c.name || c.iso_3166_1 || c}</span>`));
  }
  const productionRowHtml = productionLabels.length ? `<div class="production-row">${productionLabels.join("")}</div>` : "";
  
  card.innerHTML = `
    <div class="card-flip">
      <div class="card-face card-front">
        <div class="movie-poster bg-placeholder" data-bg-url="${bgUrl}" role="img" aria-label="Poster: ${movie.title}">
          <div class="poster-top-left">
            <div class="rating-micro"><span class="star">★</span> <strong>${ratingText}</strong></div>
          </div>
          <button class="watchlist-circle" aria-label="Add to watchlist">+</button>
          <div class="poster-gradient"></div>
          <div class="poster-title">
            <h3 class="movie-title">${movie.title}</h3>
            <span class="movie-year">${movie.year || new Date(releaseDate).getFullYear() || "2025"}</span>
          </div>
        </div>
        <div class="movie-card-body">
          <div class="rating-pill-wrap">
            <div class="rating-bar slim">
              <div class="rating-fill" style="width:${getRatingWidth(ratingValue)}"></div>
            </div>
          </div>
          <div class="movie-tags enhanced">
            ${(movie.genres || movie.genre_names || []).slice(0, 3).map((name) => `<span>${name}</span>`).join("")}
          </div>
        </div>
      </div>
      <div class="card-face card-back" style="--backdrop-url: url('${movie.backdrop || bgUrl}')">
        <div class="movie-back-content">
          <div class="movie-meta">
            <h3 class="movie-title">Release Day</h3>
            <span>${formattedDate}</span>
          </div>
          ${productionRowHtml}
          <p class="movie-overview">${summary}</p>
          <div class="movie-meta">
            <span>Rating</span>
            <strong>${ratingText}</strong>
          </div>
          <div class="movie-tags">
            ${(movie.genres || movie.genre_names || []).slice(0, 2).map((name) => `<span>${name}</span>`).join("")}
          </div>
        </div>
      </div>
    </div>
  `;

  card.addEventListener("click", () => {
    document.querySelectorAll(".movie-card.selected").forEach((otherCard) => {
      if (otherCard !== card) otherCard.classList.remove("selected");
    });
    card.classList.toggle("selected");
  });

  // Watchlist circle behaviour: toggle saved state without flipping the card
  const watchBtn = card.querySelector('.watchlist-circle');
  if (watchBtn) {
    watchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      watchBtn.classList.toggle('saved');
      watchBtn.textContent = watchBtn.classList.contains('saved') ? '♥' : '+';
    });
  }

  return card;
}

function createTrendingCard(movie, rank) {
  const card = document.createElement("article");
  card.className = "trending-card fade-up";
  card.setAttribute('tabindex', '0');
  card.dataset.rank = rank.toString().padStart(2, "0");
  const ratingValue = movie.rating ?? movie.vote_average;
  const ratingText = formatRating(ratingValue);
  const bgUrl = movie.poster || (movie.poster_path ? IMAGE_BASE + movie.poster_path : "");
  card.innerHTML = `
    <div class="trending-image bg-placeholder" data-bg-url="${bgUrl}" role="img" aria-label="Poster: ${movie.title}"></div>
    <div class="trending-card-body">
      <span class="badge">${(movie.genre_names || movie.genres || ["Feature"])[0]}</span>
      <h3 class="trending-title">${movie.title}</h3>
      <div class="trending-meta">
        <span>${movie.year || new Date(movie.release_date).getFullYear() || "2025"}</span>
        <span class="rating-pill"><span>★</span>${ratingText}</span>
      </div>
    </div>
  `;
  return card;
}

function renderGenreFilters() {
  genreBar.innerHTML = genreList
    .map((genre) => `
      <button class="genre-pill${genre.id === "all" ? " active" : ""}" data-genre="${genre.id}">${genre.name}</button>`)
    .join("");

  genreBar.querySelectorAll(".genre-pill").forEach((button) => {
    button.addEventListener("click", () => {
      genreBar.querySelectorAll(".genre-pill").forEach((pill) => pill.classList.remove("active"));
      button.classList.add("active");
      activeGenreId = button.dataset.genre;
      filterMovies();
    });
  });
}

function renderMoviesGrid(movies) {
  if (!movies || movies.length === 0) {
    moviesGrid.innerHTML = "";
    movieCount.textContent = 0;
    showEmptyState();
    return;
  }

  hideEmptyState();
  moviesGrid.innerHTML = "";
  movies.forEach((movie) => moviesGrid.appendChild(createMovieCard(movie)));
  movieCount.textContent = movies.length;
  animateCards();
  lazyLoadBackgrounds();
  updateLoadMoreVisibility();
}

function renderTrendingStrip(movies) {
  trendingStrip.innerHTML = "";
  movies.slice(0, 5).forEach((movie, index) => trendingStrip.appendChild(createTrendingCard(movie, index + 1)));
  popularCount.textContent = `${movies.length}+`;
  lazyLoadBackgrounds();
}

function filterMovies() {
  const source = getActiveMovieSource();
  if (activeGenreId === "all") {
    return renderMoviesGrid(source);
  }

  const filtered = source.filter((movie) => {
    if (activeGenreId === "indian") {
      return isIndianMovie(movie);
    }

    const genreName = genreList.find((g) => g.id.toString() === activeGenreId)?.name;
    return (movie.genre_ids || []).includes(Number(activeGenreId)) ||
      (movie.genres || []).includes(activeGenreId) ||
      (movie.genres || []).includes(genreName);
  });
  renderMoviesGrid(filtered);
}

function animateCards() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".fade-up").forEach((card) => observer.observe(card));
}

function showSkeletons() {
  if (!moviesGrid) return;
  moviesGrid.innerHTML = "";
  for (let i = 0; i < 4; i += 1) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-poster skeleton-placeholder"></div>
      <div class="skeleton-body">
        <div class="skeleton-placeholder skeleton-title"></div>
        <div class="skeleton-placeholder skeleton-subtitle"></div>
        <div class="skeleton-placeholder skeleton-tags"></div>
        <div class="skeleton-placeholder skeleton-overview"></div>
        <div class="skeleton-placeholder skeleton-overview short"></div>
        <div class="skeleton-placeholder skeleton-button"></div>
      </div>
    `;
    moviesGrid.appendChild(skeleton);
  }
  hideEmptyState();
}

function showEmptyState(message = 'No movies match your search yet.') {
  if (emptyState) {
    emptyState.querySelector('p').textContent = message;
    emptyState.hidden = false;
  }
  if (loadMoreWrap) loadMoreWrap.hidden = true;
}

function hideEmptyState() {
  if (emptyState) emptyState.hidden = true;
  if (loadMoreWrap) {
    loadMoreWrap.hidden = TMDB_API_KEY === "REPLACE_WITH_YOUR_API_KEY";
  }
}

function updateLoadMoreVisibility() {
  if (!loadMoreWrap) return;
  if (currentSearchQuery) {
    loadMoreWrap.hidden = true;
    return;
  }
  if (TMDB_API_KEY === "REPLACE_WITH_YOUR_API_KEY") {
    loadMoreWrap.hidden = true;
    return;
  }
  loadMoreWrap.hidden = totalPages ? currentPage >= totalPages : false;
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "LIGHT" : "DARK";
}

function initTheme() {
  const storedTheme = localStorage.getItem("movieDiscoveryTheme");
  const defaultTheme = storedTheme || (prefersDark.matches ? "dark" : "light");
  setTheme(defaultTheme);
}

function updateHeroCount() {
  const count = allMovies.length || popularSample.length;
  movieCount.textContent = count;
  popularCount.textContent = `0${Math.min(9, count)}+`;
}

async function fetchTMDB(endpoint) {
  const url = `https://api.themoviedb.org/3${endpoint}&language=en-US&api_key=${TMDB_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("TMDB request failed");
  return response.json();
}

async function fetchMovies() {
  showLoader();
  hideError();
  showSkeletons();
  if (TMDB_API_KEY === "REPLACE_WITH_YOUR_API_KEY") {
    // Augment local sample data with OMDb when available
    try {
      await Promise.all(popularSample.map(augmentMovieWithOmdb));
      await Promise.all(trendingSample.map(augmentMovieWithOmdb));
    } catch (e) {
      console.warn('OMDb augmentation for samples failed', e);
    }

    allMovies = popularSample;
    movieDataset = allMovies;
    searchResults = null;
    currentSearchQuery = "";
    renderTrendingStrip(trendingSample);
    renderMoviesGrid(allMovies);
    setHeroBackdrop(trendingSample[0]);
    updateHeroCount();
    hideLoader();
    return;
  }

  try {
    const trendingData = await fetchTMDB("/trending/movie/week?include_image_language=en,null");
    const discoverData = await fetchTMDB(`/discover/movie?sort_by=popularity.desc&with_watch_monetization_types=flatrate&page=${currentPage}`);
    totalPages = discoverData.total_pages || null;
    allMovies = discoverData.results.map((movie) => ({
      ...movie,
      genre_names: (movie.genre_ids || []).map((id) => genreList.find((genre) => genre.id === id)?.name).filter(Boolean),
      rating: movie.vote_average,
      poster: movie.poster_path ? IMAGE_BASE + movie.poster_path : movie.backdrop_path ? IMAGE_BASE + movie.backdrop_path : "",
      backdrop: movie.backdrop_path ? IMAGE_BASE + movie.backdrop_path : movie.poster_path ? IMAGE_BASE + movie.poster_path : ""
    }));

    // Augment TMDb results with OMDb data when TMDb lacks poster/backdrop/plot information.
    await Promise.all(allMovies.map(augmentMovieWithOmdb));
    const trendingMovies = trendingData.results.map((movie) => ({
      ...movie,
      genre_names: (movie.genre_ids || []).map((id) => genreList.find((genre) => genre.id === id)?.name).filter(Boolean),
      poster: movie.poster_path ? IMAGE_BASE + movie.poster_path : "",
      backdrop: movie.backdrop_path ? IMAGE_BASE + movie.backdrop_path : movie.poster_path ? IMAGE_BASE + movie.poster_path : ""
    }));

    // Also try OMDb fallback for trending set
    await Promise.all(trendingMovies.map(augmentMovieWithOmdb));

    movieDataset = allMovies;
    searchResults = null;
    currentSearchQuery = "";
    renderTrendingStrip(trendingMovies);
    renderMoviesGrid(allMovies);
    setHeroBackdrop(trendingMovies[0] || allMovies[0]);
    updateHeroCount();
    hideLoader();
  } catch (error) {
    console.error(error);
    showError('Failed to fetch remote data — showing local samples');
    allMovies = popularSample;
    movieDataset = allMovies;
    searchResults = null;
    currentSearchQuery = "";
    renderTrendingStrip(trendingSample);
    renderMoviesGrid(allMovies);
    setHeroBackdrop(trendingSample[0]);
    updateHeroCount();
    hideLoader();
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!searchInput.value.trim()) {
    currentSearchQuery = "";
    searchResults = null;
    renderMoviesGrid(movieDataset);
    return;
  }
  const rawQuery = searchInput.value.trim();
  const query = rawQuery.toLowerCase();
  if (!rawQuery) {
    currentSearchQuery = "";
    searchResults = null;
    activeGenreId = "all";
    document.querySelectorAll('.genre-pill').forEach((pill) => pill.classList.remove('active'));
    const defaultPill = document.querySelector('.genre-pill[data-genre="all"]');
    if (defaultPill) defaultPill.classList.add('active');
    renderMoviesGrid(movieDataset);
    return;
  }

  currentSearchQuery = rawQuery;
  showLoader();
  hideError();
  showSkeletons();
  (async () => {
    try {
      if (OMDB_API_KEY && OMDB_API_KEY !== "REPLACE_WITH_OMDB_API_KEY") {
        const results = await searchOMDbMovies(rawQuery);
        searchResults = results;
        if (!results.length) {
          renderMoviesGrid([]);
          showEmptyState(`No results found for "${rawQuery}"`);
        } else {
          activeGenreId = "all";
          document.querySelectorAll('.genre-pill').forEach((pill) => pill.classList.remove('active'));
          const defaultPill = document.querySelector('.genre-pill[data-genre="all"]');
          if (defaultPill) defaultPill.classList.add('active');
          renderMoviesGrid(results);
        }
      } else {
        const results = movieDataset.filter((movie) => {
          const titleMatch = movie.title.toLowerCase().includes(query);
          const genreMatch = (movie.genre_names || movie.genres || []).some((genre) =>
            genre.toLowerCase().includes(query)
          );
          const indianMatch = query.includes("ind") && isIndianMovie(movie);
          return titleMatch || genreMatch || indianMatch;
        });
        searchResults = results;
        if (!results.length) {
          renderMoviesGrid([]);
          showEmptyState(`No results found for "${rawQuery}"`);
        } else {
          renderMoviesGrid(results);
        }
      }
    } catch (error) {
      console.error(error);
      showError('Search failed. Please try again.');
      renderMoviesGrid([]);
    } finally {
      hideLoader();
    }
  })();
});

if (resetSearchBtn) {
  resetSearchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    searchInput.value = '';
    currentSearchQuery = "";
    searchResults = null;
    activeGenreId = 'all';
    document.querySelectorAll('.genre-pill').forEach((pill) => pill.classList.remove('active'));
    const defaultPill = document.querySelector('.genre-pill[data-genre="all"]');
    if (defaultPill) defaultPill.classList.add('active');
    hideError();
    renderMoviesGrid(movieDataset);
  });
}

if (searchInput) {
  searchInput.addEventListener("focus", () => {
    searchInput.style.width = "100%";
  });
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("movieDiscoveryTheme", nextTheme);
});

// Settings button now informs that API keys are loaded from Vite env variables.
const settingsBtn = document.getElementById('settingsBtn');
if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    alert('API keys are loaded from Vite environment variables (VITE_TMDB_API_KEY / VITE_OMDB_API_KEY).');
  });
}

window.addEventListener("load", () => {
  initTheme();
  renderGenreFilters();
  const loadBtn = document.getElementById('loadMoreBtn');
  if (loadBtn) loadBtn.addEventListener('click', loadMoreMovies);
  fetchMovies();
  setTimeout(() => pageOverlay.style.display = "none", 1500);
});

async function loadMoreMovies() {
  if (TMDB_API_KEY === "REPLACE_WITH_YOUR_API_KEY") {
    showError('No more local results');
    return;
  }
  if (totalPages && currentPage >= totalPages) {
    showError('No more pages');
    return;
  }
  showLoader();
  try {
    currentPage += 1;
    const moreData = await fetchTMDB(`/discover/movie?sort_by=popularity.desc&with_watch_monetization_types=flatrate&page=${currentPage}`);
    const more = moreData.results.map((movie) => ({
      ...movie,
      genre_names: (movie.genre_ids || []).map((id) => genreList.find((genre) => genre.id === id)?.name).filter(Boolean),
      rating: movie.vote_average,
      poster: movie.poster_path ? IMAGE_BASE + movie.poster_path : movie.backdrop_path ? IMAGE_BASE + movie.backdrop_path : "",
      backdrop: movie.backdrop_path ? IMAGE_BASE + movie.backdrop_path : movie.poster_path ? IMAGE_BASE + movie.poster_path : ""
    }));

    // OMDb augmentation for new items
    await Promise.all(more.map(augmentMovieWithOmdb));

    allMovies = allMovies.concat(more);
    movieDataset = allMovies;
    if (activeGenreId !== 'all') {
      filterMovies();
    } else {
      renderMoviesGrid(allMovies);
    }
    hideLoader();
  } catch (e) {
    console.error(e);
    showError('Failed to load more results');
    currentPage = Math.max(1, currentPage - 1);
    hideLoader();
  }
}
