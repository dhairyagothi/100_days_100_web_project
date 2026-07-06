// ============= TMDB API INTEGRATION =============
const TMDB_API_KEY = "879672cbfc471f231f4989b4b693ddb9"; 
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500/";
const FALLBACK_POSTER = "https://placehold.co/500x750/2d2d2d/FFFFFF?text=No+Poster";

// STEP 2: Map each category row to its TMDB genre ID
const GENRE_MAP = {
    actionMovies: 28, 
    romanceMovies: 10749, // <-- Added Romance category (TMDB ID 10749)
    dramaMovies: 18
};

// STEP 3: Function that fetches movies for ONE genre and renders them
function loadMoviesByGenre(containerId, genreId) {
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
                if (movie.adult) return false;

                const blockedIds = [10731, 84317, 44260,921]; 
                if (blockedIds.includes(movie.id)) return false;

                const blocklistWords = ["erotic", "sensual", "softcore", "nudity","9 songs"];
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