// ============= TMDB API INTEGRATION =============
// This script fetches real movie data from TMDB and swaps out
// the static placeholder cards inside our category rows.

// STEP 1: Basic config variables
// Get a free API key from https://www.themoviedb.org/settings/api
const TMDB_API_KEY = "60c0d7270173c4a4c3ea15ccc1cbb4f0"; // <-- put your key here
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500/";

// Fallback image used when a movie has no poster_path
const FALLBACK_POSTER = "https://placehold.co/500x750/2d2d2d/FFFFFF?text=No+Poster";

// STEP 2: Map each category row to its TMDB genre ID
// (You can find more genre IDs in TMDB's /genre/movie/list endpoint)
const GENRE_MAP = {
    actionMovies: 28, // container id -> genre id
    dramaMovies: 18
};

// STEP 3: Function that fetches movies for ONE genre and renders them
function loadMoviesByGenre(containerId, genreId) {
    // Build the "discover" endpoint URL with our genre filter
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`;

    fetch(url)
        .then(response => {
            // Basic error check before trying to parse JSON
            if (!response.ok) {
                throw new Error(`TMDB request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // "data.results" is the array of movie objects TMDB gives us
            const movies = data.results;
            renderMovieCards(containerId, movies);
        })
        .catch(error => {
            // If something goes wrong (bad key, no internet, etc.) log it
            console.error(`Error fetching movies for ${containerId}:`, error);
        });
}

// STEP 4: Function that takes the movie array and builds the HTML
function renderMovieCards(containerId, movies) {
    const container = document.getElementById(containerId);

    // Safety check - if the container doesn't exist on this page, stop here
    if (!container) return;

    // Clear out the old static placeholder cards first
    container.innerHTML = "";

    // Loop through each movie and build a card for it
    movies.forEach(movie => {
        // Some movies don't have a poster_path - use the fallback in that case
        const posterUrl = movie.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : FALLBACK_POSTER;

        // Build the card markup using a template literal
        const cardHTML = `
            <div class="movie-card">
                <img
                    class="movie-poster"
                    src="${posterUrl}"
                    alt="${movie.title}"
                    onerror="this.src='${FALLBACK_POSTER}'"
                />
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-rating">⭐ ${movie.vote_average}/10</div>
                </div>
            </div>
        `;

        // Append this card to the container (keeps the previous cards)
        container.insertAdjacentHTML("beforeend", cardHTML);
    });
}

// STEP 5: Kick everything off once the page has loaded
document.addEventListener("DOMContentLoaded", () => {
    // Loop over our GENRE_MAP and fetch each category row
    Object.keys(GENRE_MAP).forEach(containerId => {
        const genreId = GENRE_MAP[containerId];
        loadMoviesByGenre(containerId, genreId);
    });
});