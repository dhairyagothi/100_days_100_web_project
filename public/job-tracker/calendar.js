class InterviewCalendar {
    constructor(appInstance) {
        this.app = appInstance;
        const today = new Date();
        this.currentYear = today.getFullYear();
        this.currentMonth = today.getMonth(); // 0-11
        
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.render();
    }

    cacheDOM() {
        this.monthYearTitle = document.getElementById('calendar-month-year');
        this.daysGrid = document.getElementById('calendar-days-grid');
        this.prevBtn = document.getElementById('prev-month-btn');
        this.nextBtn = document.getElementById('next-month-btn');
        this.todayBtn = document.getElementById('today-month-btn');
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigateMonth(-1));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigateMonth(1));
        }
        if (this.todayBtn) {
            this.todayBtn.addEventListener('click', () => {
                const today = new Date();
                this.currentYear = today.getFullYear();
                this.currentMonth = today.getMonth();
                this.render();
            });
        }
    }

    navigateMonth(offset) {
        this.currentMonth += offset;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.render();
    }

    render() {
        if (!this.daysGrid || !this.monthYearTitle) return;

        // Set Month/Year Title
        this.monthYearTitle.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;

        // Clear grid days
        this.daysGrid.innerHTML = '';

        const today = new Date();
        const firstDayIndex = new Date(this.currentYear, this.currentMonth, 1).getDay(); // 0 (Sun) - 6 (Sat)
        const totalDays = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        const prevMonthTotalDays = new Date(this.currentYear, this.currentMonth, 0).getDate();

        // 1. Render days from previous month (prefix cells)
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const dayNum = prevMonthTotalDays - i;
            const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
            const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
            
            const cell = this.createDayCell(dayNum, prevMonth, prevYear, true);
            this.daysGrid.appendChild(cell);
        }

        // 2. Render days of current month
        for (let day = 1; day <= totalDays; day++) {
            const isToday = today.getDate() === day && 
                            today.getMonth() === this.currentMonth && 
                            today.getFullYear() === this.currentYear;
            
            const cell = this.createDayCell(day, this.currentMonth, this.currentYear, false, isToday);
            this.daysGrid.appendChild(cell);
        }

        // 3. Render days from next month (suffix cells to fill standard 6-row / 42-cell layout grid)
        const currentCellsCount = firstDayIndex + totalDays;
        const remainingCells = 42 - currentCellsCount;
        
        for (let day = 1; day <= remainingCells; day++) {
            const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
            const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;

            const cell = this.createDayCell(day, nextMonth, nextYear, true);
            this.daysGrid.appendChild(cell);
        }
    }

    createDayCell(dayNum, monthIndex, year, isInactive = false, isToday = false) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day-cell';
        if (isInactive) cell.classList.add('inactive');
        if (isToday) cell.classList.add('is-today');

        // Render date number
        cell.innerHTML = `<span class="day-number">${dayNum}</span>`;

        // Format cell date string: YYYY-MM-DD
        const formattedMonth = String(monthIndex + 1).padStart(2, '0');
        const formattedDay = String(dayNum).padStart(2, '0');
        const cellDateString = `${year}-${formattedMonth}-${formattedDay}`;

        // Find interviews matching this cell's date
        const matches = this.app.applications.filter(app => {
            return app.dateInterview === cellDateString;
        });

        matches.forEach(app => {
            const badge = document.createElement('div');
            badge.className = 'calendar-event-badge';
            badge.textContent = `${app.company} Interview`;
            badge.title = `${app.company} - ${app.role}`;
            badge.setAttribute('data-id', app.id);
            
            // Open details view when event is clicked
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                this.app.showApplicationDetails(app.id);
            });

            cell.appendChild(badge);
        });

        return cell;
    }
}

// Attach class definition to window scope
window.InterviewCalendar = InterviewCalendar;
