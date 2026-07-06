// ============= TMDB API INTEGRATION =============
const TMDB_API_KEY = "60c0d7270173c4a4c3ea15ccc1cbb4f0"; 
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500/";
const FALLBACK_POSTER = "https://placehold.co/500x750/2d2d2d/FFFFFF?text=No+Poster";

const GENRE_MAP = {
    actionMovies: 28, 
    dramaMovies: 18
};

// STEP 3: Function that fetches movies for ONE genre and renders them
function loadMoviesByGenre(containerId, genreId) {
    // Added certification constraints to exclude R, NC-17, and NR certifications if possible
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&include_adult=false&certification_country=US&certification.lte=PG-13`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`TMDB request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let movies = data.results;

            // Extra client-side filter layer to clear out any remaining explicit titles
            movies = movies.filter(movie => {
                // Check if the movie is strictly marked as adult
                if (movie.adult) return false;

                // Block specific movie IDs that are slipping through
                const blockedIds = [10731, 84317, 44260]; // IDs for Damage, Like a Brother, Rita
                if (blockedIds.includes(movie.id)) return false;

                // Keyword blocklist for overview descriptions or titles
                const blocklistWords = ["erotic", "sensual", "softcore", "nudity"];
                const titleText = (movie.title || "").toLowerCase();
                const overviewText = (movie.overview || "").toLowerCase();

                const containsBlockedWord = blocklistWords.some(word => 
                    titleText.includes(word) || overviewText.includes(word)
                );

                return !containsBlockedWord;
            });

            renderMovieCards(containerId, movies);
        })
        .catch(error => {
            console.error(`Error fetching movies for ${containerId}:`, error);
        });
}

// STEP 4: Function that takes the movie array and builds the HTML
function renderMovieCards(containerId, movies) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    movies.forEach(movie => {
        const posterUrl = movie.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
            : FALLBACK_POSTER;

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
        container.insertAdjacentHTML("beforeend", cardHTML);
    });
}

// STEP 5: Kick everything off once the page has loaded
document.addEventListener("DOMContentLoaded", () => {
    Object.keys(GENRE_MAP).forEach(containerId => {
        const genreId = GENRE_MAP[containerId];
        loadMoviesByGenre(containerId, genreId);
    });
});