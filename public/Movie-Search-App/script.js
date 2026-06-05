const API_KEY =
  window.OMDB_API_KEY ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_OMDB_API_KEY) ||
  '';

const movieInput = document.getElementById("movieInput");
const searchBtn = document.getElementById("searchBtn");
const moviesContainer = document.getElementById("movies");

const modal = document.getElementById("movieModal");
const movieDetails = document.getElementById("movieDetails");
const closeBtn = document.querySelector(".close");

searchBtn.addEventListener("click", searchMovies);

movieInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchMovies();
    }
});

// Real-time search with debounce
movieInput.addEventListener(
    "input",
    debounce(() => {
        if (movieInput.value.trim().length > 2) {
            searchMovies();
        }
    }, 500)
);

async function searchMovies() {
    const query = movieInput.value.trim();

    if (!query) {

        moviesContainer.innerHTML = `
            <div class="empty-state">
                <h2>🎬 Search Your Favorite Movies</h2>
                <p>Start typing to discover movies.</p>
            </div>
        `;

        return;
    }

    // Loading state
    moviesContainer.innerHTML = `
        <div class="loading"></div>
    `;

    // Disable button while searching
    searchBtn.disabled = true;
    searchBtn.innerText = "Searching...";

    try {

        const response = await fetch(
            `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`
        );

        const data = await response.json();

        if (data.Response === "False") {

            moviesContainer.innerHTML = `
                <div class="empty-state">
                    <h2>🎥 No Movies Found</h2>
                    <p>Try searching with another movie name.</p>
                </div>
            `;

            searchBtn.disabled = false;
            searchBtn.innerText = "Search";

            return;
        }

        displayMovies(data.Search);

    } catch (error) {

        moviesContainer.innerHTML = `
            <div class="empty-state">
                <h2>⚠️ Something Went Wrong</h2>
                <p>Failed to fetch movies. Please try again later.</p>
            </div>
        `;

    } finally {

        searchBtn.disabled = false;
        searchBtn.innerText = "Search";
    }
}

// ===============================
// DISPLAY MOVIES
// ===============================

function displayMovies(movies) {

    moviesContainer.innerHTML = "";

    movies.forEach((movie, index) => {

        const poster =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Image";

        const card = document.createElement("div");

        card.classList.add("movie-card");

        // Stagger animation delay
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">

            <div class="movie-info">

                <h3>${movie.Title}</h3>

                <p>📅 ${movie.Year}</p>

                <p>🎞️ ${movie.Type}</p>

                <button onclick="getMovieDetails('${movie.imdbID}')">
                    View Details
                </button>

            </div>
        `;

        moviesContainer.appendChild(card);
    });
}

// ===============================
// MOVIE DETAILS MODAL
// ===============================

async function getMovieDetails(id) {

    modal.style.display = "block";

    movieDetails.innerHTML = `
        <div class="loading"></div>
    `;

    try {

        const response = await fetch(
            `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`
        );

        const movie = await response.json();

        const poster =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Image";

        movieDetails.innerHTML = `

            <div class="details">

                <img src="${poster}" alt="${movie.Title}">

                <div class="details-text">

                    <h2>${movie.Title}</h2>

                    <p><strong>📅 Year:</strong> ${movie.Year}</p>

                    <p><strong>🎭 Genre:</strong> ${movie.Genre}</p>

                    <p><strong>⏱ Runtime:</strong> ${movie.Runtime}</p>

                    <p><strong>⭐ IMDb:</strong> ${movie.imdbRating}</p>

                    <p><strong>🎬 Director:</strong> ${movie.Director}</p>

                    <p><strong>🎤 Actors:</strong> ${movie.Actors}</p>

                    <p><strong>🌍 Language:</strong> ${movie.Language}</p>

                    <p><strong>🏳 Country:</strong> ${movie.Country}</p>

                    <p><strong>📝 Plot:</strong></p>

                    <p>${movie.Plot}</p>

                </div>

            </div>
        `;

    } catch (error) {

        movieDetails.innerHTML = `
            <div class="empty-state">
                <h2>⚠️ Failed to Load Movie</h2>
                <p>Please try again later.</p>
            </div>
        `;
    }
}

// ===============================
// CLOSE MODAL
// ===============================

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// ===============================
// DEBOUNCE FUNCTION
// ===============================

function debounce(func, delay) {

    let timeout;

    return function (...args) {

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// ===============================
// INITIAL LOAD
// ===============================

window.onload = () => {

    movieInput.value = "Avengers";

    searchMovies();
};

