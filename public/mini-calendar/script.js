let currentDate = new Date();

function generateCalendar(date = currentDate) {
    const today = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendarGrid.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;
        
        if (day === today.getDate() && today.getMonth() === month && today.getFullYear() === year) {
            dayDiv.classList.add('today');
        }
        
        calendarGrid.appendChild(dayDiv);
    }
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('todayInfo').textContent = 
        `Today: ${today.toLocaleDateString('en-US', options)}`;
}

// Dark Mode Toggle
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const calendarCard = document.querySelector('.calendar-card');
    
    // Check localStorage for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        calendarCard.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }
    
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        calendarCard.classList.toggle('dark-mode');
        
        const isNowDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isNowDarkMode);
        
        darkModeToggle.textContent = isNowDarkMode ? '☀️' : '🌙';
    });
}

generateCalendar();
initDarkMode();

// Month Navigation
function initMonthNavigation() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });
    
    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });
}

initMonthNavigation();