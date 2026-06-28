const TMDB_API_KEY =
  window.TMDB_API_KEY ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_TMDB_API_KEY) ||
  '';

const MOVIE_DISCOVER_API = TMDB_API_KEY
  ? `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=vote_average.desc&vote_count.gte=500&include_adult=false`
  : null;
const IMAGE_RESOURCES_API = 'https://image.tmdb.org/t/p/w400';

const genreTrigger = document.getElementById('genreTrigger');
const genreMenu = document.getElementById('genreMenu');
const genreTriggerLabel = document.getElementById('genreTriggerLabel');
const genreCheckboxes = genreMenu.querySelectorAll('input[type="checkbox"]');
const findMovieBtn = document.getElementById('findMovieBtn');

const loadingState = document.getElementById('loadingState');
const welcomeState = document.getElementById('welcomeState');
const movieCard = document.getElementById('movieCard');

const moviePoster = document.getElementById('moviePoster');
const movieTitle = document.getElementById('movieTitle');
const movieRating = document.getElementById('movieRating');
const movieReleaseDate = document.getElementById('movieReleaseDate');
const movieOverview = document.getElementById('movieOverview');

const trailerBtn = document.getElementById('trailerBtn');
const rerollBtn = document.getElementById('rerollBtn');
const saveBtn = document.getElementById('saveBtn');

const watchlistSection = document.getElementById('watchlistSection');
const watchlistGrid = document.getElementById('watchlistGrid');
const watchlistCount = document.getElementById('watchlistCount');
const clearWatchlistBtn = document.getElementById('clearWatchlistBtn');

let currentMovie = null;
let activeGenreIds = [];
let watchlist = JSON.parse(localStorage.getItem('wtw_watchlist') || '[]');

function getSelectedGenreIds() {
  return Array.from(genreCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);
}

function updateGenreLabel() {
  const selected = Array.from(genreCheckboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.closest('label').querySelector('span').textContent);

  if (selected.length === 0) {
    genreTriggerLabel.textContent = 'Choose genre(s)…';
    genreTriggerLabel.classList.remove('has-selection');
  } else if (selected.length <= 3) {
    genreTriggerLabel.textContent = selected.join(', ');
    genreTriggerLabel.classList.add('has-selection');
  } else {
    genreTriggerLabel.textContent = `${selected.slice(0, 2).join(', ')} +${selected.length - 2} more`;
    genreTriggerLabel.classList.add('has-selection');
  }
}

genreTrigger.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = !genreMenu.classList.contains('hidden');
  genreMenu.classList.toggle('hidden', isOpen);
  genreTrigger.classList.toggle('open', !isOpen);
});

document.addEventListener('click', (e) => {
  if (!genreMenu.classList.contains('hidden') && !genreMenu.contains(e.target) && e.target !== genreTrigger) {
    genreMenu.classList.add('hidden');
    genreTrigger.classList.remove('open');
  }
});

genreCheckboxes.forEach(cb => cb.addEventListener('change', updateGenreLabel));

async function fetchMovie(genreIds) {
  welcomeState.classList.add('hidden');
  movieCard.classList.add('hidden');
  loadingState.classList.remove('hidden');

  try {
    const genreParam = genreIds.join('|');
    const page = Math.floor(Math.random() * 5) + 1;
    const targetUrl = `${MOVIE_DISCOVER_API}&with_genres=${genreParam}&page=${page}`;
    const response = await fetch(targetUrl);
    const payload = await response.json();

    if (!payload.results || payload.results.length === 0) {
      throw new Error('No results returned.');
    }

    const selected = payload.results[Math.floor(Math.random() * payload.results.length)];
    currentMovie = selected;
    populateMovieCard(selected);
  } catch {
    loadingState.classList.add('hidden');
    welcomeState.classList.remove('hidden');
    alert('Could not fetch movies. Please try a different genre selection.');
  }
}

function populateMovieCard(movie) {
  loadingState.classList.add('hidden');
  movieCard.classList.remove('hidden');

  movieTitle.textContent = movie.title;
  movieRating.textContent = `⭐ ${movie.vote_average.toFixed(1)}`;
  movieReleaseDate.textContent = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  movieOverview.textContent = movie.overview || 'No synopsis available for this title.';

  if (movie.poster_path) {
    moviePoster.src = `${IMAGE_RESOURCES_API}${movie.poster_path}`;
    moviePoster.style.display = 'block';
  } else {
    moviePoster.src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop';
  }

  const isSaved = watchlist.some(m => m.id === movie.id);
  saveBtn.textContent = isSaved ? '♥ Saved' : '♡ Save';
  saveBtn.classList.toggle('saved', isSaved);
}

findMovieBtn.addEventListener('click', () => {
  const ids = getSelectedGenreIds();
  if (ids.length === 0) {
    alert('Please select at least one genre first.');
    return;
  }
  genreMenu.classList.add('hidden');
  genreTrigger.classList.remove('open');
  activeGenreIds = ids;
  fetchMovie(activeGenreIds);
});

rerollBtn.addEventListener('click', () => {
  if (activeGenreIds.length === 0) return;
  fetchMovie(activeGenreIds);
});

trailerBtn.addEventListener('click', () => {
  if (!currentMovie) return;
  const query = encodeURIComponent(`${currentMovie.title} ${currentMovie.release_date ? currentMovie.release_date.split('-')[0] : ''} official trailer`);
  window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank', 'noopener');
});

saveBtn.addEventListener('click', () => {
  if (!currentMovie) return;
  const idx = watchlist.findIndex(m => m.id === currentMovie.id);
  if (idx === -1) {
    watchlist.push({
      id: currentMovie.id,
      title: currentMovie.title,
      poster_path: currentMovie.poster_path,
      vote_average: currentMovie.vote_average,
      release_date: currentMovie.release_date,
    });
    saveBtn.textContent = '♥ Saved';
    saveBtn.classList.add('saved');
  } else {
    watchlist.splice(idx, 1);
    saveBtn.textContent = '♡ Save';
    saveBtn.classList.remove('saved');
  }
  persistAndRenderWatchlist();
});

clearWatchlistBtn.addEventListener('click', () => {
  watchlist = [];
  persistAndRenderWatchlist();
});

function persistAndRenderWatchlist() {
  localStorage.setItem('wtw_watchlist', JSON.stringify(watchlist));
  renderWatchlist();
}

function renderWatchlist() {
  watchlistGrid.innerHTML = '';
  watchlistSection.classList.toggle('hidden', watchlist.length === 0);
  watchlistCount.textContent = watchlist.length;

  watchlist.forEach((movie) => {
    const item = document.createElement('div');
    item.className = 'watchlist-item';

    const img = document.createElement('img');
    img.src = movie.poster_path
      ? `${IMAGE_RESOURCES_API}${movie.poster_path}`
      : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop';
    img.alt = movie.title;

    const title = document.createElement('div');
    title.className = 'wl-title';
    title.textContent = movie.title;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'wl-remove';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      watchlist = watchlist.filter(m => m.id !== movie.id);
      persistAndRenderWatchlist();
      if (currentMovie && currentMovie.id === movie.id) {
        saveBtn.textContent = '♡ Save';
        saveBtn.classList.remove('saved');
      }
    });

    item.appendChild(img);
    item.appendChild(title);
    item.appendChild(removeBtn);
    watchlistGrid.appendChild(item);
  });
}

renderWatchlist();