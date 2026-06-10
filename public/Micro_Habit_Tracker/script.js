document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const activeDayHeading = document.getElementById('active-day-heading');
    
    const habitCheckboxes = [
        document.getElementById('habit-1'),
        document.getElementById('habit-2'),
        document.getElementById('habit-3')
    ];

    const totalDays = 365;
    let selectedDayIndex = null;

    let trackerData = JSON.parse(localStorage.getItem('pixelTrackerData')) || {};

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

        document.querySelectorAll('.day-square').forEach(el => el.classList.remove('active-focus'));
        squareElement.classList.add('active-focus');

        habitCheckboxes.forEach(cb => cb.disabled = false);

        activeDayHeading.textContent = `Logging Actions for Day: ${index + 1}`;

        const dayData = trackerData[index] || [false, false, false];
        habitCheckboxes.forEach((cb, currentHabitIndex) => {
            cb.checked = dayData[currentHabitIndex];
        });
    }

    habitCheckboxes.forEach((checkbox, currentHabitIndex) => {
        checkbox.addEventListener('change', () => {
            if (selectedDayIndex === null) return;

            if (!trackerData[selectedDayIndex]) {
                trackerData[selectedDayIndex] = [false, false, false];
            }

            trackerData[selectedDayIndex][currentHabitIndex] = checkbox.checked;

            localStorage.setItem('pixelTrackerData', JSON.stringify(trackerData));

            const targetSquare = document.querySelector(`[data-day-index="${selectedDayIndex}"]`);
            if (targetSquare) {
                const completedCount = trackerData[selectedDayIndex].filter(Boolean).length;
                
                targetSquare.className = 'day-square active-focus';
                targetSquare.classList.add(`level-${completedCount}`);
            }
        });
    });

    createGrid();
});