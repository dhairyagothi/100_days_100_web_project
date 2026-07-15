document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mapContainer = document.getElementById('mapContainer');
    const cityNameEl = document.getElementById('cityName');
    const clockDisplayEl = document.getElementById('clockDisplay');
    const dateDisplayEl = document.getElementById('dateDisplay');
    const timezoneDisplayEl = document.getElementById('timezoneDisplay');

    // State
    let currentTz = 'UTC';
    let clockInterval;

    // City Data with approximate X/Y percentages for the background map
    const cities = [
    { name: "New York", tz: "America/New_York", x: 32, y: 33 },
    { name: "Los Angeles", tz: "America/Los_Angeles", x: 21, y: 35 },
    { name: "London", tz: "Europe/London", x: 47, y: 27 },
    { name: "Paris", tz: "Europe/Paris", x: 49, y: 29 },
    { name: "Dubai", tz: "Asia/Dubai", x: 62, y: 43 },
    { name: "Tokyo", tz: "Asia/Tokyo", x: 80, y: 33 },
    { name: "Sydney", tz: "Australia/Sydney", x: 83, y: 75 },
    { name: "Rio de Janeiro", tz: "America/Sao_Paulo", x: 38, y: 65 },
    { name: "Chennai", tz: "Asia/Kolkata", x: 68, y: 48 },
    { name: "Singapore", tz: "Asia/Singapore", x: 74, y: 55 },
    { name: "Berlin", tz: "Europe/Berlin", x: 51, y: 27 },
    { name: "Cape Town", tz: "Africa/Johannesburg", x: 53, y: 72 },
    { name: "Moscow", tz: "Europe/Moscow", x: 57, y: 24 },
    { name: "Beijing", tz: "Asia/Shanghai", x: 75, y: 30 },
    { name: "Mexico City", tz: "America/Mexico_City", x: 24, y: 43 },
    { name: "Toronto", tz: "America/Toronto", x: 30, y: 30 },
    { name: "Buenos Aires", tz: "America/Argentina/Buenos_Aires", x: 34, y: 70 },
    { name: "Seoul", tz: "Asia/Seoul", x: 77, y: 34 },
    { name: "Bangkok", tz: "Asia/Bangkok", x: 73, y: 49 },
    { name: "Istanbul", tz: "Europe/Istanbul", x: 56, y: 35 },
    { name: "Magadan", tz: "Asia/Magadan", x: 79, y: 15 },
    { name: "Honolulu", tz: "Pacific/Honolulu", x: 11, y: 42 },
    { name: "Krasnoyarsk ", tz: "Asia/Krasnoyarsk", x: 65, y: 18 },
    { name: "Yakutsk", tz: "Asia/Yakutsk", x: 72, y: 14 },
    { name: "Vladivostok", tz: "Asia/Vladivostok", x: 77, y: 26 },
    { name: "Anchorage", tz: "America/Anchorage", x: 18, y: 15 },
    { name: "Reykjavik", tz: "Atlantic/Reykjavik", x: 44, y: 20 },
    { name: "Harbin", tz: "Asia/Harbin", x: 74, y: 25 },
    { name: "Lagos", tz: "Africa/Lagos", x: 50, y: 52 },
    { name: "Karachi", tz: "Asia/Karachi", x: 64, y: 41 },
    { name: "Jakarta", tz: "Asia/Jakarta", x: 75, y: 60 },
    { name: "Macau", tz: "Asia/Macau", x: 75, y: 42 },
    { name: "Kashgar", tz: "Asia/Kashgar", x: 66, y: 33 },
    { name: "Lima", tz: "America/Lima", x: 30, y: 61 },
    { name: "Bogota", tz: "America/Bogota", x: 30, y: 54 },
    { name: "Santiago", tz: "America/Santiago", x: 32, y: 72 },
    { name: "Manaus", tz: "America/Manaus", x: 33, y: 56 },
    { name: "Casablanca", tz: "Africa/Casablanca", x: 47, y: 38 },
    { name:"Cairo", tz: "Africa/Cairo", x: 55, y: 40 },
    { name: "Nairobi", tz: "Africa/Nairobi", x: 58, y: 54 },
    { name: "Stockholm", tz: "Europe/Stockholm", x: 52, y: 22 },
    { name: "Oslo", tz: "Europe/Oslo", x: 49, y: 21 },
    { name: "Perth", tz: "Australia/Perth", x: 75, y: 71 },
    { name: "Auckland", tz: "Pacific/Auckland", x: 88, y: 80 },
    { name: "Vancouver", tz: "America/Vancouver", x: 22, y: 26 },
    { name: "Pangnirtung", tz: "America/Iqaluit", x: 36, y: 17 },
    { name: "Inuvik", tz: "America/Inuvik", x: 24, y: 10 },
];

    // Initialize Map Pins
    function renderPins() {
        cities.forEach((city, index) => {
            const pin = document.createElement('div');
            pin.className = 'pin';
            pin.style.left = `${city.x}%`;
            pin.style.top = `${city.y}%`;
            pin.title = city.name;
            
            // Interaction
            pin.addEventListener('click', () => {
                // Update active state
                document.querySelectorAll('.pin').forEach(p => p.classList.remove('active'));
                pin.classList.add('active');
                
                // Set timezone and update clock
                selectCity(city);
            });

            mapContainer.appendChild(pin);
        });
    }

    // Handle City Selection
    function selectCity(city) {
        currentTz = city.tz;
        cityNameEl.textContent = city.name;
        timezoneDisplayEl.textContent = city.tz;
        
        // Clear existing interval and start a new one
        if (clockInterval) clearInterval(clockInterval);
        updateTime(); // initial call
        clockInterval = setInterval(updateTime, 1000);
    }

    // Update the Clock using Intl API
    function updateTime() {
        const now = new Date();

        // Format Time (HH:MM:SS)
        const timeOptions = { 
            timeZone: currentTz, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        };
        clockDisplayEl.textContent = new Intl.DateTimeFormat('en-US', timeOptions).format(now);

        // Format Date (Weekday, Month Day, Year)
        const dateOptions = { 
            timeZone: currentTz, 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateDisplayEl.textContent = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
    }

    // Initialize the app with the first city in the array
    renderPins();
    selectCity(cities[0]);
    // Set first pin as active
    document.querySelector('.pin').classList.add('active');
});