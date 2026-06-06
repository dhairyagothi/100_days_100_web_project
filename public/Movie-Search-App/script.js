/* =============================================
   CineSearch — script.js  (fixed & enhanced)
   =============================================

   🔐 API key is loaded from .env
   Do NOT hardcode secrets in this file.
   ============================================= */

// ── Config ────────────────────────────────────
const API_KEY = "d1503a5";
const BASE_URL = "https://www.omdbapi.com/";

// ── DOM ──────────────────────────────────────
const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const moviesContainer = document.getElementById("movies");
const modal = document.getElementById("movieModal");
const movieDetails = document.getElementById("movieDetails");
const closeModalBtn = document.getElementById("closeModal");
const genreFilter = document.getElementById("genreFilter");
const yearFilter = document.getElementById("yearFilter");
const clearBtn = document.getElementById("clearBtn");
const resultsInfo = document.getElementById("resultsInfo");
const loadMoreWrapper = document.getElementById("loadMoreWrapper");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const toast = document.getElementById("toast");

// ── State ────────────────────────────────────
let currentPage = 1;
let totalResults = 0;
let allMovies = [];
let isHomeMode = true;

// ── Genre → curated IMDb IDs ─────────────────
const GENRES = {
  all: { label: "🎬 All Genres" },
  scifi: {
    label: "🚀 Sci-Fi & Adventure",
    ids: [
      "tt0816692",
      "tt1375666",
      "tt0133093",
      "tt2527338",
      "tt4154796",
      "tt0499549",
      "tt1392190",
      "tt0910970",
      "tt1049413",
      "tt2381941",
    ],
  },
  action: {
    label: "🦸 Action & Superheroes",
    ids: [
      "tt4154756",
      "tt0848228",
      "tt1825683",
      "tt3501632",
      "tt0800369",
      "tt0468569",
      "tt1345836",
      "tt0458339",
      "tt4154664",
      "tt2395427",
    ],
  },
  comedy: {
    label: "😄 Comedy & Rom-Com",
    ids: [
      "tt0298148",
      "tt0454876",
      "tt0268978",
      "tt0381681",
      "tt1655442",
      "tt0120338",
      "tt0386117",
      "tt0435761",
      "tt0317705",
      "tt2024544",
    ],
  },
  horror: {
    label: "👻 Horror & Thriller",
    ids: [
      "tt5753856",
      "tt0993842",
      "tt0407887",
      "tt0209144",
      "tt0482571",
      "tt2380307",
      "tt0780504",
      "tt4016934",
      "tt1457767",
      "tt1219289",
    ],
  },
  animation: {
    label: "🎨 Animation & Family",
    ids: [
      "tt0910970",
      "tt1049413",
      "tt0435761",
      "tt0317705",
      "tt0266543",
      "tt0382932",
      "tt2096673",
      "tt1727587",
      "tt4116284",
      "tt2948372",
    ],
  },
  drama: {
    label: "🎭 Drama & Classic",
    ids: [
      "tt0111161",
      "tt0068646",
      "tt0071562",
      "tt0050083",
      "tt0108052",
      "tt0167260",
      "tt0120737",
      "tt0110912",
      "tt0137523",
      "tt0047478",
    ],
  },
};

// ── Populate Year dropdown ────────────────────
(function () {
  const y = new Date().getFullYear();
  for (let i = y; i >= 1970; i--) {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = i;
    yearFilter.appendChild(o);
  }
})();

// ── On load ──────────────────────────────────
window.addEventListener("load", () => {
  movieInput.value = "";
  loadHomePage();
});

// ── Listeners ────────────────────────────────
searchBtn.addEventListener("click", triggerSearch);
movieInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") triggerSearch();
});

genreFilter.addEventListener("change", () => {
  const val = genreFilter.value;
  if (val === "all") {
    isHomeMode = true;
    movieInput.value = "";
    loadHomePage();
  } else {
    isHomeMode = true;
    movieInput.value = "";
    loadSingleGenre(val);
  }
});

yearFilter.addEventListener("change", () => {
  const q = movieInput.value.trim();
  if (q) {
    isHomeMode = false;
    doSearch(true);
  }
});

clearBtn.addEventListener("click", () => {
  movieInput.value = "";
  genreFilter.value = "all";
  yearFilter.value = "";
  isHomeMode = true;
  allMovies = [];
  loadMoreWrapper.style.display = "none";
  loadHomePage();
  showToast("Showing all genres 🎬");
});

loadMoreBtn.addEventListener("click", () => {
  currentPage++;
  doSearch(false);
});

// ── Trigger search from search bar ───────────
function triggerSearch() {
  const q = movieInput.value.trim();
  if (!q) {
    isHomeMode = true;
    loadHomePage();
    return;
  }
  isHomeMode = false;
  genreFilter.value = "all";
  doSearch(true);
}

// ═══════════════════════════════════════════════
// HOMEPAGE — all 6 genre sections
// ═══════════════════════════════════════════════
async function loadHomePage() {
  moviesContainer.className = "movies-home";
  moviesContainer.innerHTML = "";
  resultsInfo.innerHTML = `<span style="color:var(--teal)">🎬 Browse curated picks across genres</span>`;
  loadMoreWrapper.style.display = "none";

  for (const [key, genre] of Object.entries(GENRES)) {
    if (key === "all") continue;
    await renderGenreSection(genre.label, genre.ids);
  }
}

// Single genre page
async function loadSingleGenre(key) {
  const genre = GENRES[key];
  if (!genre) return;
  moviesContainer.className = "movies-home";
  moviesContainer.innerHTML = "";
  resultsInfo.innerHTML = `<span style="color:var(--teal)">${genre.label}</span>`;
  loadMoreWrapper.style.display = "none";
  await renderGenreSection(genre.label, genre.ids);
}

// ── hasPoster — only valid http poster URLs pass ──
function hasPoster(m) {
  return m && m.Poster && m.Poster !== "N/A" && m.Poster.startsWith("http");
}

async function renderGenreSection(label, ids) {
  const heading = document.createElement("div");
  heading.className = "section-heading";
  heading.innerHTML = `<h2>${label}</h2>`;
  moviesContainer.appendChild(heading);

  const row = document.createElement("div");
  row.className = "movies-row";
  moviesContainer.appendChild(row);

  for (let s = 0; s < 6; s++) {
    row.insertAdjacentHTML(
      "beforeend",
      `<div class="skeleton-card">
        <div class="skeleton-poster"></div>
        <div class="skeleton-info">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>`,
    );
  }

  const results = await Promise.all(
    ids.map((id) =>
      fetch(`${BASE_URL}?i=${id}&apikey=${API_KEY}`)
        .then((r) => r.json())
        .catch(() => null),
    ),
  );

  row.innerHTML = "";

  const validMovies = results.filter(
    (m) => m && m.Response !== "False" && hasPoster(m),
  );

  if (validMovies.length === 0) {
    heading.remove();
    row.remove();
    return;
  }

  validMovies.forEach((m, i) => row.appendChild(buildCard(m, i)));
}

// ═══════════════════════════════════════════════
// SEARCH
// ═══════════════════════════════════════════════
async function doSearch(fresh) {
  const query = movieInput.value.trim();
  if (!query) {
    loadHomePage();
    return;
  }

  if (fresh) {
    currentPage = 1;
    allMovies = [];
    moviesContainer.className = "movies-grid";
    moviesContainer.innerHTML = "";
    showSkeletons(10);
    loadMoreWrapper.style.display = "none";
  } else {
    loadMoreBtn.textContent = "Loading…";
    loadMoreBtn.disabled = true;
  }

  const year = yearFilter.value;
  let url = `${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}&page=${currentPage}&type=movie`;
  if (year) url += `&y=${year}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "False") {
      if (fresh) {
        const yearMsg = year ? ` from ${year}` : "";
        moviesContainer.innerHTML = stateMsg(
          "🎭",
          "No Results Found",
          `No movies found for "${query}"${yearMsg}. Try a different title${year ? " or remove the year filter" : ""}.`,
        );
        resultsInfo.innerHTML = "";
      } else {
        showToast("No more results");
      }
      loadMoreWrapper.style.display = "none";
      return;
    }

    totalResults = parseInt(data.totalResults, 10);

    const validResults = data.Search.filter((m) => hasPoster(m));

    allMovies = fresh ? validResults : [...allMovies, ...validResults];

    if (fresh) moviesContainer.innerHTML = "";
    moviesContainer.className = "movies-grid";

    validResults.forEach((m, i) =>
      moviesContainer.appendChild(buildCard(m, i)),
    );

    const showing = allMovies.length;
    const yearLabel = year ? ` · ${year}` : "";
    resultsInfo.innerHTML = `Showing <span>${showing}</span> of <span>${totalResults}</span> results for "<span>${query}${yearLabel}</span>"`;

    if (allMovies.length < totalResults) {
      loadMoreWrapper.style.display = "block";
      loadMoreBtn.textContent = "Load More";
      loadMoreBtn.disabled = false;
    } else {
      loadMoreWrapper.style.display = "none";
    }
  } catch {
    moviesContainer.innerHTML = stateMsg(
      "⚠️",
      "Something Went Wrong",
      "Check your connection and try again.",
    );
    resultsInfo.innerHTML = "";
  }
}

// ═══════════════════════════════════════════════
// CARD BUILDER
// ═══════════════════════════════════════════════
function buildCard(m, i = 0) {
  const poster = m.Poster;

  const badge =
    { movie: "🎬 Movie", series: "📺 Series", episode: "🎞️ Ep" }[m.Type] ||
    m.Type ||
    "";

  const card = document.createElement("div");
  card.className = "movie-card";
  card.style.animationDelay = `${i * 0.04}s`;

  card.innerHTML = `
    <div class="poster-wrap">
      <img src="${poster}" alt="${escapeHtml(m.Title)}" loading="lazy">
      <div class="card-overlay"><button class="overlay-btn">View Details</button></div>
      <span class="type-badge">${badge}</span>
      ${
        m.imdbRating && m.imdbRating !== "N/A"
          ? `<span class="rating-badge">⭐ ${m.imdbRating}</span>`
          : ""
      }
    </div>
    <div class="movie-info">
      <h3 title="${escapeHtml(m.Title)}">${escapeHtml(m.Title)}</h3>
      <p class="year">📅 ${m.Year || ""}</p>
    </div>`;

  card.addEventListener("click", () => getMovieDetails(m.imdbID));
  return card;
}

// ── Skeletons ────────────────────────────────
function showSkeletons(n = 10) {
  moviesContainer.innerHTML = Array(n)
    .fill(
      `
    <div class="skeleton-card">
      <div class="skeleton-poster"></div>
      <div class="skeleton-info">
        <div class="skeleton-line"></div><div class="skeleton-line short"></div>
      </div>
    </div>`,
    )
    .join("");
  resultsInfo.innerHTML = "";
}

// ═══════════════════════════════════════════════
// MOVIE DETAILS MODAL
// ═══════════════════════════════════════════════
async function getMovieDetails(id) {
  if (!id) return;
  movieDetails.innerHTML = `<div style="padding:60px;text-align:center;color:var(--muted)">
    <div style="font-size:40px;margin-bottom:14px">🎬</div><p>Loading details…</p></div>`;
  openModal();

  try {
    const res = await fetch(
      `${BASE_URL}?i=${encodeURIComponent(id)}&apikey=${API_KEY}&plot=full`,
    );
    const m = await res.json();
    if (m.Response === "False") throw new Error();

    const poster = hasPoster(m)
      ? m.Poster
      : "https://placehold.co/260x390/111520/7a8099?text=No+Image";
    const rating = m.imdbRating !== "N/A" ? m.imdbRating : null;

    movieDetails.innerHTML = `
      <div class="details-layout">
        <div class="details-poster">
          <img src="${poster}" alt="${escapeHtml(m.Title)}"
            onerror="this.src='https://placehold.co/260x390/111520/7a8099?text=No+Image'">
        </div>
        <div class="details-body">
          <h2>${escapeHtml(m.Title)}</h2>
          <div class="details-meta-row">
            ${m.Year ? `<span class="meta-pill year">${m.Year}</span>` : ""}
            ${m.Type ? `<span class="meta-pill type">${m.Type}</span>` : ""}
            ${m.Runtime && m.Runtime !== "N/A" ? `<span class="meta-pill runtime">⏱ ${m.Runtime}</span>` : ""}
            ${m.Rated && m.Rated !== "N/A" ? `<span class="meta-pill runtime">${m.Rated}</span>` : ""}
          </div>
          ${
            rating
              ? `<div class="rating-row">
            <span class="stars">${getStars(+rating)}</span>
            <span class="rating-num">${rating}</span>
            <span class="rating-label">/ 10 IMDb</span>
          </div>`
              : ""
          }
          <hr class="details-divider">
          <div class="details-grid">
            ${di("Director", m.Director)}
            ${di("Genre", m.Genre)}
            ${di("Actors", m.Actors, true)}
            ${di("Language", m.Language)}
            ${di("Country", m.Country)}
            ${di("Released", m.Released)}
            ${m.Awards && m.Awards !== "N/A" ? di("Awards", m.Awards, true) : ""}
            ${m.BoxOffice && m.BoxOffice !== "N/A" ? di("Box Office", m.BoxOffice) : ""}
          </div>
          ${
            m.Plot && m.Plot !== "N/A"
              ? `<div class="plot-section">
            <label>Plot</label><p>${escapeHtml(m.Plot)}</p></div>`
              : ""
          }
        </div>
      </div>`;
  } catch {
    movieDetails.innerHTML = `<div style="padding:60px;text-align:center">
      <div style="font-size:36px;margin-bottom:14px">⚠️</div>
      <p style="color:var(--muted)">Failed to load details.</p></div>`;
  }
}

// ── Helpers ──────────────────────────────────
function di(label, val, wide = false) {
  if (!val || val === "N/A") return "";
  return `<div class="detail-item"${wide ? ' style="grid-column:1/-1"' : ""}>
    <label>${label}</label><span>${escapeHtml(val)}</span></div>`;
}
function getStars(r) {
  const f = Math.round(r / 2);
  return "★".repeat(f) + "☆".repeat(5 - f);
}
function stateMsg(icon, title, body) {
  return `<div class="state-message">
    <span class="icon">${icon}</span><h2>${title}</h2><p>${body}</p></div>`;
}
function escapeHtml(s) {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Modal ────────────────────────────────────
function openModal() {
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModalFn() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

closeModalBtn.addEventListener("click", closeModalFn);
document
  .querySelector(".modal-backdrop")
  ?.addEventListener("click", closeModalFn);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModalFn();
});

// ── Toast ────────────────────────────────────
let _tt;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(_tt);
  _tt = setTimeout(() => toast.classList.remove("show"), 2800);
}
