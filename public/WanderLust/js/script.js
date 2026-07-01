document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // 1. Check if the user already chose a theme in a previous session
  const currentTheme = localStorage.getItem('theme');
  
  if (currentTheme === 'dark') {
    body.classList.add('dark-theme');
  }

  // 2. Listen for clicks on the toggle button
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-theme');

      // 3. Update LocalStorage based on the current state
      if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }

  const filters = document.querySelectorAll('.filter');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(item => {
        item.style.opacity = '0.7';
      });

      filter.style.opacity = '1';
    });
  });

  // 1. Select the search input and the <a> tags wrapping the cards
  const searchInput = document.querySelector('.nav-center input');
  const listingLinks = document.querySelectorAll('.listing-link'); // <-- FIX: Select the link wrapper

  if (searchInput) {
    searchInput.addEventListener('input', function(event) {
      const searchQuery = event.target.value.toLowerCase();

      listingLinks.forEach(link => {
        const cardText = link.innerText.toLowerCase();

        // Check if the text includes the search query
        if (cardText.includes(searchQuery)) {
          link.style.display = ''; // Show the whole grid item
        } else {
          link.style.display = 'none'; // Hide the whole grid item
        }
      });
    });
  }
});


