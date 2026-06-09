// // Theme Toggle Functionality
 const themeToggleBtn = document.getElementById("themeToggleBtn");
 const htmlElement = document.documentElement;

// // Toggle theme
const toggleTheme = () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    document.body.classList.toggle('dark-mode', newTheme === 'dark'); // ADD THIS
    localStorage.setItem('theme', newTheme);
    
//     // Update button text/icon
     if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        const label = themeToggleBtn.querySelector('span');
        if (icon) icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
        if (label) label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}

const toggleTheme = () => {
    const current = htmlElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
};

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

applyTheme(savedTheme);