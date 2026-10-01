const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const movieResult = document.getElementById("movie-result");
const watchlistContainer = document.getElementById("watchlist-container");
const countBadge = document.getElementById("count-badge");
const statsBar = document.getElementById("stats-bar");
const filterTabs = document.querySelectorAll(".filter-tab");
const toast = document.getElementById("toast");

if (!searchInput || !searchBtn || !movieResult || !watchlistContainer) {
  console.error("Required DOM elements are missing. Movie Watchlist initialization aborted.");
  throw new Error("Missing required DOM elements.");
}

let currentMovie = null;
let watchlist = JSON.parse(localStorage.getItem("movies_list")) || [];
let activeFilter = "all";

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function searchMovie() {
  const title = searchInput.value.trim();
  if (!title) return;

  movieResult.innerHTML = "";
  movieResult.classList.add("hidden");

  searchBtn.disabled = true;
  const originalLabel = searchBtn.textContent;
  searchBtn.innerHTML = '<span class="spinner"></span> Searching...';

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=2b762dc8`,
    );
    const data = await res.json();

    if (data.Response === "False") {
      movieResult.innerHTML = `<p style="color: #f87171;">Movie not found.</p>`;
      movieResult.classList.remove("hidden");
      return;
    }

    currentMovie = {
      id: data.imdbID,
      title: data.Title,
      year: data.Year,
      poster: data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/60x90?text=No+Poster",
      genre: data.Genre && data.Genre !== "N/A" ? data.Genre.split(",")[0].trim() : "—",
      rating: data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : "—",
      runtime: data.Runtime && data.Runtime !== "N/A" ? data.Runtime : "—",
      watched: false,
    };

    movieResult.innerHTML = `
      <div class="movie-card fade-in">
        <img src="${currentMovie.poster}" class="poster" alt="poster">
        <div class="movie-info">
          <h3>${currentMovie.title}</h3>
          <p>${currentMovie.year} • ${currentMovie.runtime}</p>
          <div class="badge-row">
            <span class="badge">${currentMovie.genre}</span>
            <span class="badge badge-rating">★ ${currentMovie.rating}</span>
          </div>
        </div>
        <button class="btn-add" id="add-to-list-btn">Add to Watchlist</button>
      </div>
    `;
    movieResult.classList.remove("hidden");
    document.getElementById("add-to-list-btn").addEventListener("click", addToWatchlist);
  } catch (err) {
    movieResult.innerHTML = `<p style="color: #f87171;">Error connecting to API.</p>`;
    movieResult.classList.remove("hidden");
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = originalLabel;
  }
}

function addToWatchlist() {
  if (!currentMovie) return;

  const alreadyExists = watchlist.some((m) => m.id === currentMovie.id);
  if (alreadyExists) {
    showToast(`"${currentMovie.title}" is already in your watchlist.`);
    return;
  }

  watchlist.push(currentMovie);
  saveAndRender();
  showToast(`Added "${currentMovie.title}" to your watchlist`);

  movieResult.classList.add("hidden");
  searchInput.value = "";
}

function toggleWatched(id) {
  const movie = watchlist.find((m) => m.id === id);
  if (!movie) return;
  movie.watched = !movie.watched;
  saveAndRender();
  showToast(movie.watched ? `Marked "${movie.title}" as watched` : `Marked "${movie.title}" as to watch`);
}

function removeFromWatchlist(id) {
  const btn = watchlistContainer.querySelector(`.btn-del[data-id="${id}"]`);
  const card = btn ? btn.closest(".watch-item") : null;
  const movie = watchlist.find((m) => m.id === id);

  if (card) {
    card.classList.add("fade-out");
    setTimeout(() => {
      watchlist = watchlist.filter((m) => m.id !== id);
      saveAndRender();
      if (movie) showToast(`Removed "${movie.title}" from your watchlist`);
    }, 200);
  } else {
    watchlist = watchlist.filter((m) => m.id !== id);
    saveAndRender();
  }
}

function renderStats() {
  const total = watchlist.length;
  const watched = watchlist.filter((m) => m.watched).length;
  const ratings = watchlist.map((m) => parseFloat(m.rating)).filter((n) => !isNaN(n));
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "—";

  statsBar.innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${total}</div>
      <div class="stat-label">Total movies</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${watched}</div>
      <div class="stat-label">Watched</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${avgRating}</div>
      <div class="stat-label">Avg rating</div>
    </div>
  `;
}

function getFilteredList() {
  if (activeFilter === "watched") return watchlist.filter((m) => m.watched);
  if (activeFilter === "towatch") return watchlist.filter((m) => !m.watched);
  return watchlist;
}

function saveAndRender() {
  localStorage.setItem("movies_list", JSON.stringify(watchlist));

  if (countBadge) countBadge.textContent = watchlist.length;
  renderStats();

  const list = getFilteredList();
  watchlistContainer.innerHTML = "";

  if (list.length === 0) {
    watchlistContainer.innerHTML = `
      <div class="empty-state">
        ${watchlist.length === 0 ? "Your watchlist is empty." : "No movies match this filter."}
      </div>
    `;
    return;
  }

  list.forEach((m) => {
    const div = document.createElement("div");
    div.className = `watch-item fade-in${m.watched ? " watched" : ""}`;
    div.innerHTML = `
      <img src="${m.poster}" class="poster" alt="poster">
      <div class="movie-info">
        <h3>${m.title}</h3>
        <p>${m.year} • ${m.runtime || "—"}</p>
        <div class="badge-row">
          <span class="badge">${m.genre || "—"}</span>
          <span class="badge badge-rating">★ ${m.rating || "—"}</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        <button class="btn-watch${m.watched ? " is-watched" : ""}" data-id="${m.id}">${m.watched ? "Watched" : "Mark watched"}</button>
        <button class="btn-del" data-id="${m.id}">Remove</button>
      </div>
    `;
    watchlistContainer.appendChild(div);
  });

  document.querySelectorAll(".btn-del").forEach((btn) => {
    btn.addEventListener("click", () => removeFromWatchlist(btn.getAttribute("data-id")));
  });
  document.querySelectorAll(".btn-watch").forEach((btn) => {
    btn.addEventListener("click", () => toggleWatched(btn.getAttribute("data-id")));
  });
}

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    activeFilter = tab.getAttribute("data-filter");
    saveAndRender();
  });
});

searchBtn.addEventListener("click", searchMovie);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchMovie();
});

// Initial Load
saveAndRender();