/**
 * Manages Dark / Light mode toggle and persistence
 */
export function initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const htmlEl = document.documentElement;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('image-compressor-theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');
    setTheme(initialTheme);
    
    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('image-compressor-theme', theme);
        
        if (theme === 'dark') {
            themeIcon.className = 'ph ph-sun'; // Show sun icon in dark mode to switch to light
        } else {
            themeIcon.className = 'ph ph-moon'; // Show moon icon in light mode to switch to dark
        }
    }
}
