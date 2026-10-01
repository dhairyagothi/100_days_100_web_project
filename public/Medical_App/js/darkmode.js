// Theme Toggle Functionality
const themeToggleBtn = document.getElementById("themeToggleBtn") || document.getElementById("themeToggle");
const htmlElement = document.documentElement;

// Function to apply a theme
const applyTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('theme', theme);
    
    // Update button text/icon/emoji
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        const label = themeToggleBtn.querySelector('span');
        if (icon) {
            icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
        }
        if (label) {
            label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        }
        // If it's a simple emoji button (e.g. reschedule or feedback page)
        if (!icon && !label) {
            themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
};

// Toggle theme event handler
const toggleTheme = () => {
    const current = htmlElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
};

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

// Load saved theme on load
const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

applyTheme(savedTheme);