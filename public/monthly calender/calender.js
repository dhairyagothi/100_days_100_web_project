let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function generateCalendar(month = currentMonth, year = currentYear) {
    const currentDate = new Date();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let calendarHTML = '<table style="width:100%; border-collapse: collapse;">';

    // Day names (Header)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    calendarHTML += '<thead><tr>';
    daysOfWeek.forEach(day => {
        calendarHTML += `<th style="padding: 6px; background-color: #f4f4f4; font-weight: bold; text-align: center;">${day}</th>`;
    });
    calendarHTML += '</tr></thead><tbody><tr>';

    // Blank spaces before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<td style="padding: 10px;"></td>';
    }

    // Create the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear() ? 'today' : '';
        
        // Break into a new row every 7 days
        if ((firstDay + day - 1) % 7 === 0 && day !== 1) calendarHTML += '</tr><tr>';
        
        // Highlight today
        if (isToday) {
            calendarHTML += `<td style="text-align: center; padding: 10px; color:rgb(0, 60, 80); font-weight: 800;">${day}</td>`;
        } else {
            calendarHTML += `<td style="text-align: center; padding: 10px;">${day}</td>`;
        }
    }

    calendarHTML += '</tr></tbody></table>';

    // Display the calendar
    document.getElementById("season-month").innerHTML = calendarHTML;

    // Update the current month/year header
    document.getElementById("current-month-year").textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
}

// Add navigation buttons (< and >)
function addNavigation() {
    let navHTML = '<div style="text-align: center;">';

    // Previous button
    navHTML += `<button onclick="changeMonth(-1)" style="padding: 6px 12px; margin-right: 20px;">&lt;</button>`;
    
    // Month/Year display
    navHTML += `<span id="current-month-year" style="font-size: 18px; font-weight: bold;"></span> &nbsp; &nbsp;`;

    // Next button
    navHTML += `<button onclick="changeMonth(1)" style="padding: 6px 12px;">&gt;</button>`;

    navHTML += '</div>';
    document.getElementById("season-month").insertAdjacentHTML('beforebegin', navHTML); 
}

// Change the month when a navigation button is clicked
function changeMonth(direction) {
    currentMonth += direction;

    // If the month goes out of bounds, adjust the year and month accordingly
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    generateCalendar(currentMonth, currentYear);
}

// Generate the calendar when the page loads
window.onload = function() {
    addNavigation();
    generateCalendar();
};
