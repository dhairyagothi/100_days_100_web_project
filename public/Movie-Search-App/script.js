const API_KEY = "d1503a5";

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

async function searchMovies() {
    const query = movieInput.value.trim();

    if (!query) {
        alert("Please enter a movie name");
        return;
    }

    moviesContainer.innerHTML =
        '<p class="loading">Loading...</p>';

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
        );

        const data = await response.json();

        if (data.Response === "False") {
            moviesContainer.innerHTML =
                "<h2>No movies found.</h2>";
            return;
        }

        displayMovies(data.Search);

    } catch (error) {
        moviesContainer.innerHTML =
            "<h2>Error fetching movies.</h2>";
    }
}

function displayMovies(movies) {
    moviesContainer.innerHTML = "";

    movies.forEach(movie => {

        const poster =
            movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Image";

        const card = document.createElement("div");

        card.classList.add("movie-card");

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

async function getMovieDetails(id) {

    movieDetails.innerHTML =
        '<p class="loading">Loading details...</p>';

    modal.style.display = "block";

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`
        );

        const movie = await response.json();

        movieDetails.innerHTML = `
            <div class="details">
                <img src="${movie.Poster}" alt="${movie.Title}">
                <div class="details-text">
                    <h2>${movie.Title}</h2>

                    <p><strong>Year:</strong> ${movie.Year}</p>
                    <p><strong>Genre:</strong> ${movie.Genre}</p>
                    <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                    <p><strong>IMDb Rating:</strong> ⭐ ${movie.imdbRating}</p>
                    <p><strong>Director:</strong> ${movie.Director}</p>
                    <p><strong>Actors:</strong> ${movie.Actors}</p>
                    <p><strong>Language:</strong> ${movie.Language}</p>
                    <p><strong>Country:</strong> ${movie.Country}</p>
                    <p><strong>Plot:</strong> ${movie.Plot}</p>
                </div>
            </div>
        `;

    } catch (error) {
        movieDetails.innerHTML =
            "<h2>Failed to load details.</h2>";
    }
}

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Load popular movie on startup
window.onload = () => {
    movieInput.value = "Avengers";
    searchMovies();
};