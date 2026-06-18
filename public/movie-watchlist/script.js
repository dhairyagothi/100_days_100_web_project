const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const movieResult = document.getElementById("movie-result");
const watchlistContainer = document.getElementById("watchlist-container");

if (
  !searchInput ||
  !searchBtn ||
  !movieResult ||
  !watchlistContainer
) {
  console.error(
    "Required DOM elements are missing. Movie Watchlist initialization aborted."
  );
  throw new Error("Missing required DOM elements.");
}

let currentMovie = null;
let watchlist = JSON.parse(localStorage.getItem("movies_list")) || [];

async function searchMovie() {
  const title = searchInput.value.trim();
  if (!title) return;

  movieResult.innerHTML = "";
  movieResult.classList.add("hidden");

  try {
    // Safe, public API endpoint that doesn't expose secret private tokens
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
      poster:
        data.Poster !== "N/A"
          ? data.Poster
          : "https://via.placeholder.com/60x90?text=No+Poster",
    };

    movieResult.innerHTML = `
            <div class="movie-card">
                <img src="${currentMovie.poster}" class="poster" alt="poster">
                <div class="movie-info">
                    <h3>${currentMovie.title}</h3>
                    <p>${currentMovie.year}</p>
                </div>
                <button class="btn-add" id="add-to-list-btn">Add to Watchlist</button>
            </div>
        `;
    movieResult.classList.remove("hidden");

    document
      .getElementById("add-to-list-btn")
      .addEventListener("click", addToWatchlist);
  } catch (err) {
    movieResult.innerHTML = `<p style="color: #f87171;">Error connecting to API.</p>`;
    movieResult.classList.remove("hidden");
  }
}

function addToWatchlist() {
  if (!currentMovie) return;

  const alreadyExists = watchlist.some(
    (m) => m.id === currentMovie.id
  );

  if (alreadyExists) {
    alert(
      `"${currentMovie.title}" is already in your watchlist.`
    );
    return;
  }

  watchlist.push(currentMovie);
  saveAndRender();

  movieResult.classList.add("hidden");
  searchInput.value = "";
}

function removeFromWatchlist(id) {
  watchlist = watchlist.filter((m) => m.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("movies_list", JSON.stringify(watchlist));
  watchlistContainer.innerHTML = "";

  if (watchlist.length === 0) {
    watchlistContainer.innerHTML =
      '<p style="color: #94a3b8; font-style: italic;">Your watchlist is empty.</p>';
    return;
  }

  watchlist.forEach((m) => {
    const div = document.createElement("div");
    div.className = "watch-item";
    div.innerHTML = `
            <img src="${m.poster}" class="poster" alt="poster">
            <div class="movie-info">
                <h3>${m.title}</h3>
                <p>${m.year}</p>
            </div>
            <button class="btn-del" data-id="${m.id}">Remove</button>
        `;
    watchlistContainer.appendChild(div);
  });

  document.querySelectorAll(".btn-del").forEach((btn) => {
    btn.addEventListener("click", () =>
      removeFromWatchlist(btn.getAttribute("data-id")),
    );
  });
}

searchBtn.addEventListener("click", searchMovie);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchMovie();
});

// Initial Load
saveAndRender();
