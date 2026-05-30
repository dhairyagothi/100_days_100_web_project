document.addEventListener('DOMContentLoaded', () => {

    // --- THEME TOGGLE LOGIC ---
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const root = document.documentElement;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('m3-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        root.setAttribute('data-theme', 'dark');
        themeIcon.textContent = 'light_mode';
    }

    // Toggle theme on click
    themeBtn.addEventListener('click', () => {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        root.setAttribute('data-theme', newTheme);
        themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        localStorage.setItem('m3-theme', newTheme);
    });


    // --- SEARCH LOGIC ---
    const searchInput = document.getElementById('searchInput');
    const componentCards = document.querySelectorAll('.component-card');
    const noResults = document.getElementById('noResults');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        let visibleCount = 0;

        componentCards.forEach(card => {
            // Get tags from the data attribute and text from the h3 title
            const tags = card.getAttribute('data-tags') || '';
            const title = card.querySelector('h3').textContent.toLowerCase();

            // Check if search term matches tags or title
            if (tags.includes(searchTerm) || title.includes(searchTerm)) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/Hide the "No Results" message
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    });

});