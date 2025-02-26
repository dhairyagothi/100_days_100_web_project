const seasonData = {
    spring: {
        months: ["March", "April", "May"],
        backgroundImage: 'url("img/S1.png")'
    },
    summer: {
        months: ["June", "July", "August"],
        backgroundImage: 'url("img/S2.png")'
    },
    autumn: {
        months: ["September", "October", "November"],
        backgroundImage: 'url("img/A1.png")'
    },
    winter: {
        months: ["December", "January", "February"],
        backgroundImage: 'url("img/W1.png")'
    }
};

// Function to get current season based on the month
function getCurrentSeason() {
    const monthToSeason = {
        0: 'winter', 1: 'winter', 2: 'spring', 3: 'spring', 4: 'spring', 5: 'summer', 6: 'summer', 7: 'summer', 8: 'autumn', 9: 'autumn', 10: 'autumn', 11: 'winter'
    };
    return monthToSeason[new Date().getMonth()];
}

// Function to update background and colors based on season
function updateBackgroundAndColors(season) {
    const { backgroundImage } = seasonData[season];
    document.body.style.backgroundImage = backgroundImage;

    const seasonColors = {
        spring: 'rgba(100, 200, 100, 0.9)', 
        summer: 'rgba(100, 110, 250, 0.9)',
        autumn: 'rgba(250, 140, 100, 0.9)', 
        winter: 'rgba(130, 200, 230, 0.9)'
    };

    const color = seasonColors[season];
    document.querySelector('header').style.backgroundColor = color;
    document.querySelector('footer').style.backgroundColor = color;
}

// Function to display months and change background when a season is clicked
function showSeasonMonths(season) {
    // First, hide all the other season details
    const allSeasons = ['spring', 'summer', 'autumn', 'winter'];
    allSeasons.forEach(s => {
        const seasonElement = document.getElementById(`season-months-${s}`);
        if (seasonElement) {
            seasonElement.style.display = 'none'; // Hide the other season elements
        }
    });

    const seasonInfo = seasonData[season]; // Define seasonInfo here
    const seasonElement = document.getElementById(`season-months-${season}`);
    if (seasonElement) {
        seasonElement.innerHTML =  
            `<p><strong>${season.charAt(0).toUpperCase() + season.slice(1)}:</strong> ${seasonInfo.months.join(', ')} <br>
            <a href="https://en.wikipedia.org/wiki/Season#:~:text=According%20to%20this%20definition%2C%20for,and%20winter%20on%201%20June." style="text-decoration: none;">📝</a></p>`;
        seasonElement.style.display = 'block'; // Show the clicked season element
    }
    updateBackgroundAndColors(season);
}

// Event listeners for seasons
['spring', 'summer', 'autumn', 'winter'].forEach(season =>
    document.getElementById(season)?.addEventListener('click', () => showSeasonMonths(season))
);

// Function to generate the live month calendar
function generateMonthCalendar() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthToSeason = {
        "January": "winter", "February": "winter", "March": "spring", "April": "spring", "May": "spring",
        "June": "summer", "July": "summer", "August": "summer", "September": "autumn", "October": "autumn", 
        "November": "autumn", "December": "winter"
    };
    
    const currentMonth = new Date().getMonth(); // Get current month (0-11)
    
    const calendarDiv = document.getElementById("calendar");
    months.forEach((month, index) => {
        const monthDiv = document.createElement("div");
        monthDiv.textContent = month;

        // Highlight the current month
        if (index === currentMonth) {
            monthDiv.classList.add("highlight");
        }

        // Add event listener to show corresponding season when clicked
        monthDiv.addEventListener("click", () => {
            const season = monthToSeason[month];
            updateBackgroundAndColors(season);
            showSeasonMonths(season);
        });
        
        calendarDiv.appendChild(monthDiv);
    });
}

// Initialize everything on page load
window.addEventListener('load', () => {
    // Update background and colors based on the current season
    const currentSeason = getCurrentSeason();
    updateBackgroundAndColors(currentSeason);

    // Generate the live month calendar
    generateMonthCalendar();

    // Optionally, update background dynamically every 24 hours
    setInterval(() => updateBackgroundAndColors(getCurrentSeason()), 86400000); // 24 hours
});

// Display the live current season on page load
const seasonDisplayDiv = document.getElementById('current-season');
const currentSeason = getCurrentSeason();
const seasonInfo = seasonData[currentSeason];

if (seasonDisplayDiv) {
    seasonDisplayDiv.innerHTML = `<p><strong> <b style="text-decoration: dashed underline 2px rgb(200, 50, 50);"> LIVE</b> Current Season:</strong> "${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}"</p>
    <p>Months: ${seasonInfo.months.join(', ')}</p>`;
}
// line 126