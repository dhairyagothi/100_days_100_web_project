// Access high-rated discover elements utilizing the public fallback tracking pipeline index mapping
const MOVIE_DISCOVER_API =
  "https://api.themoviedb.org/3/discover/movie?api_key=8f2467d3e6205844a4b1f4faaa387eb3&sort_by=vote_average.desc&vote_count.gte=500&include_adult=false";
const IMAGE_RESOURCES_API = "https://image.tmdb.org/t/p/w400";

const genreSelect = document.getElementById("genreSelect");
const findMovieBtn = document.getElementById("findMovieBtn");

const loadingState = document.getElementById("loadingState");
const welcomeState = document.getElementById("welcomeState");
const movieCard = document.getElementById("movieCard");

const moviePoster = document.getElementById("moviePoster");
const movieTitle = document.getElementById("movieTitle");
const movieRating = document.getElementById("movieRating");
const movieReleaseDate = document.getElementById("movieReleaseDate");
const movieOverview = document.getElementById("movieOverview");

// Asynchronous Selection Engine Orchestrator
async function rollRandomMovieRecommendation(genreId) {
  // Toggle active interface card states
  welcomeState.classList.add("hidden");
  movieCard.classList.add("hidden");
  loadingState.classList.remove("hidden");

  try {
    // Query high-rated films inside the targeted genre matching criteria
    const targetUrl = `${MOVIE_DISCOVER_API}&with_genres=${genreId}&page=${Math.floor(Math.random() * 3) + 1}`;
    const response = await fetch(targetUrl);
    const payload = await response.json();

    if (!payload.results || payload.results.length === 0) {
      throw new Error(
        "Empty query array returned from fallback dataset mapping.",
      );
    }

    // Pull a random index position parameter array element out from the response row arrays
    const structuralIndexList = payload.results;
    const randomElementIndex = Math.floor(
      Math.random() * structuralIndexList.length,
    );
    const selectedMovie = structuralIndexList[randomElementIndex];

    populateMovieCard(selectedMovie);
  } catch (error) {
    loadingState.classList.add("hidden");
    welcomeState.classList.remove("hidden");
    alert(
      "Failed to access cinematic collection nodes. Please select another genre filter.",
    );
  }
}

// Map selected array data features safely straight into DOM element hooks
function populateMovieCard(movie) {
  loadingState.classList.add("hidden");
  movieCard.classList.remove("hidden");

  movieTitle.innerText = movie.title;
  movieRating.innerText = `⭐ ${movie.vote_average.toFixed(1)}`;

  // Parse parsing variables safely to capture the standard release calendar year string
  const dateString = movie.release_date;
  movieReleaseDate.innerText = dateString ? dateString.split("-")[0] : "N/A";

  movieOverview.innerText =
    movie.overview ||
    "No synopsis description overview logs has been filed for this entry.";

  // Fallback image handling if tracking assets maps return empty
  if (movie.poster_path) {
    moviePoster.src = `${IMAGE_RESOURCES_API}${movie.poster_path}`;
    moviePoster.style.display = "block";
  } else {
    moviePoster.src =
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=400&auto=format&fit=crop";
  }
}

// Attach operational click handler bindings
findMovieBtn.addEventListener("click", () => {
  const activeGenreValue = genreSelect.value;
  if (!activeGenreValue) {
    alert(
      "Please make a genre selection selection first inside the console selection menu row.",
    );
    return;
  }
  rollRandomMovieRecommendation(activeGenreValue);
});
