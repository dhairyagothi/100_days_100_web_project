// DOM Elements
const matchBtn = document.getElementById('matchBtn');
const genre1Select = document.getElementById('genre1');
const genre2Select = document.getElementById('genre2');
const resultsContainer = document.getElementById('results');
const themeToggle = document.getElementById('themeToggle');

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
  }
};

themeToggle.addEventListener('click', () => {
  const isDark = document.body.getAttribute('data-theme') === 'dark';
  
  if (isDark) { 
    document.body.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  } else {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }
});

const mockMovieDatabase = [
  {
    title: "Shaun of the Dead",
    genre_ids: [27, 35], 
    vote_average: 7.9,
    poster_url: "https://placehold.co/500x750/1e293b/FFF?text=Shaun+of+\nthe+Dead"
  },
  {
    title: "Tucker & Dale vs. Evil",
    genre_ids: [27, 35], 
    vote_average: 7.5,
    poster_url: "https://placehold.co/500x750/1e293b/FFF?text=Tucker+&+Dale+\nvs.+Evil"
  },
  {
    title: "Zombieland",
    genre_ids: [27, 35, 28], 
    vote_average: 7.6,
    poster_url: "https://placehold.co/500x750/1e293b/FFF?text=Zombieland"
  },
  {
    title: "Deadpool",
    genre_ids: [28, 35], 
    vote_average: 8.0,
    poster_url: "https://placehold.co/500x750/1e293b/FFF?text=Deadpool"
  },
  {
    title: "Hot Fuzz",
    genre_ids: [28, 35], 
    vote_average: 7.8,
    poster_url: "https://placehold.co/500x750/1e293b/FFF?text=Hot+Fuzz"
  },
  {
    title: "Interstellar",
    genre_ids: [878, 18], 
    vote_average: 8.6,
    poster_url: "https://placehold.co/500x750/1e293b/FFF?text=Interstellar"
  },
  {
    title: "Arrival",
    genre_ids: [878, 18], 
    vote_average: 7.9,
    poster_url: "https://placehold.co/500x750/1e293b/FFF?text=Arrival"
  },
  {
    title: "Mr. & Mrs. Smith",
    genre_ids: [28, 10749], 
    vote_average: 6.5,
    poster_url: "https://placehold.co/500x750/1e293b/FFF?text=Mr.+&+Mrs.+\nSmith"
  },
  {
    title: "Her",
    genre_ids: [878, 10749, 18], 
    vote_average: 8.0,
    poster_url: "https://placehold.co/500x750/1e293b/FFF?text=Her"
  }
];

const fetchMoviesByDualGenres = (genre1Id, genre2Id) => {
  resultsContainer.innerHTML = '<p style="text-align:center; width: 100%; color: var(--text-muted);">Searching the local database...</p>';

  setTimeout(() => {
    const matchedMovies = mockMovieDatabase.filter(movie => 
      movie.genre_ids.includes(genre1Id) && movie.genre_ids.includes(genre2Id)
    );
    renderMovies(matchedMovies);
  }, 500);
};

const renderMovies = (movies) => {
  resultsContainer.innerHTML = ''; 

  if (movies.length === 0) {
    resultsContainer.innerHTML = '<p style="text-align:center; width: 100%; color: var(--text-muted);">No matches found for this specific combo! Try another.</p>';
    return;
  }

  movies.forEach(movie => {
    const movieCard = document.createElement('article');
    movieCard.classList.add('movie-card');

    movieCard.innerHTML = `
      <img class="movie-card__image" src="${movie.poster_url}" alt="Poster for ${movie.title}">
      <div class="movie-card__content">
        <h2 class="movie-card__title">${movie.title}</h2>
        <p class="movie-card__rating">⭐ ${movie.vote_average.toFixed(1)} / 10</p>
      </div>
    `;
    
    resultsContainer.appendChild(movieCard);
  });
};

// Setup Event Listeners
const setupEventListeners = () => {
  matchBtn.addEventListener('click', () => {
    const genre1 = parseInt(genre1Select.value);
    const genre2 = parseInt(genre2Select.value);
    
    if (genre1 === genre2) {
        alert("Please select two different genres!");
        return;
    }

    fetchMoviesByDualGenres(genre1, genre2);
  });
};

// Initialize Project
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  setupEventListeners();
});