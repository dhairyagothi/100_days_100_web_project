document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gridContainer = document.getElementById('grid-container');
    const activeDayHeading = document.getElementById('active-day-heading');
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    const habitCheckboxes = [
        document.getElementById('habit-1'),
        document.getElementById('habit-2'),
        document.getElementById('habit-3')
    ];

    // --- State Variables ---
    const totalDays = 365;
    let selectedDayIndex = null;

    // Load saved data structures
    let trackerData = JSON.parse(localStorage.getItem('pixelTrackerData')) || {};

    /* ============================================================
       THEME TOGGLE SYSTEM ENGINE
    ============================================================ */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pixel-theme', theme);
    }

    // Baseline checks: check storage, default to system preference profile if missing
    const savedTheme = localStorage.getItem('pixel-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentThemeSetting = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Establish immediate root state initialization
    applyTheme(currentThemeSetting);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme');
            applyTheme(activeTheme === 'dark' ? 'light' : 'dark');
        });
    }

    /* ============================================================
       HABIT TRACKER SYSTEM ENGINE
    ============================================================ */
    function createGrid() {
        gridContainer.innerHTML = ''; 
        
        for (let i = 0; i < totalDays; i++) {
            const square = document.createElement('div');
            square.classList.add('day-square');
            square.dataset.dayIndex = i;
            
            const dayData = trackerData[i] || [false, false, false];
            const completedCount = dayData.filter(Boolean).length;
            
            square.classList.add(`level-${completedCount}`);
            
            square.addEventListener('click', () => selectDay(i, square));
            
            gridContainer.appendChild(square);
        }
    }

    function selectDay(index, squareElement) {
        selectedDayIndex = index;

        // Remove highlight from old active square and apply to new one
        document.querySelectorAll('.day-square').forEach(el => el.classList.remove('active-focus'));
        squareElement.classList.add('active-focus');

        // Enable habit inputs once a valid grid pixel is clicked
        habitCheckboxes.forEach(cb => cb.disabled = false);

        activeDayHeading.textContent = `Logging Actions for Day: ${index + 1}`;

        // Populate checkboxes based on stored values
        const dayData = trackerData[index] || [false, false, false];
        habitCheckboxes.forEach((cb, currentHabitIndex) => {
            cb.checked = dayData[currentHabitIndex];
        });
    }

    // Listens for checkbox modifications and dynamically updates color nodes
    habitCheckboxes.forEach((checkbox, currentHabitIndex) => {
        checkbox.addEventListener('change', () => {
            if (selectedDayIndex === null) return;

            if (!trackerData[selectedDayIndex]) {
                trackerData[selectedDayIndex] = [false, false, false];
            }

            trackerData[selectedDayIndex][currentHabitIndex] = checkbox.checked;

            // Save state to localStorage
            localStorage.setItem('pixelTrackerData', JSON.stringify(trackerData));

            // Instantly re-render the color density level on the selected grid block
            const targetSquare = document.querySelector(`[data-day-index="${selectedDayIndex}"]`);
            if (targetSquare) {
                const completedCount = trackerData[selectedDayIndex].filter(Boolean).length;
                
                targetSquare.className = 'day-square active-focus';
                targetSquare.classList.add(`level-${completedCount}`);
            }
        });
    });

    // Initialize application layout
    createGrid();
});