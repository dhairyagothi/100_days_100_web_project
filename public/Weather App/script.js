// =========================================================
// CONFIGURATION & STATE (No API Keys Required!)
// =========================================================
const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

let currentState = {
    city: 'Hyderabad', // Defaults to your current region
    lat: 17.3850,
    lon: 78.4867,
    units: 'metric', // 'metric' (Celsius) or 'imperial' (Fahrenheit)
    isDarkTheme: false,
    recentSearches: JSON.parse(localStorage.getItem('recentSearches')) || []
};

// =========================================================
// DOM ELEMENTS
// =========================================================
const DOM = {
    form: document.getElementById('searchForm'),
    input: document.getElementById('cityInput'),
    locationBtn: document.getElementById('locationBtn'),
    recentList: document.getElementById('recentList'),
    
    celsiusBtn: document.getElementById('celsiusBtn'),
    fahrenheitBtn: document.getElementById('fahrenheitBtn'),
    themeToggle: document.getElementById('themeToggle'),
    
    loading: document.getElementById('loadingState'),
    content: document.getElementById('weatherContent'),
    
    city: document.getElementById('cityName'),
    date: document.getElementById('currentDate'),
    temp: document.getElementById('currentTemp'),
    icon: document.getElementById('currentIcon'),
    condition: document.getElementById('conditionText'),
    feelsLike: document.getElementById('feelsLike'),
    
    humidity: document.getElementById('humidityVal'),
    wind: document.getElementById('windVal'),
    windDir: document.getElementById('windDirection'),
    visibility: document.getElementById('visibilityVal'),
    uv: document.getElementById('uvVal'),
    uvStatus: document.getElementById('uvStatus'),
    
    forecastGrid: document.getElementById('forecastGrid')
};

// =========================================================
// INITIALIZATION
// =========================================================
function init() {
    setupEventListeners();
    loadThemePreferences();
    renderRecentSearches();
    
    // Initial fetch based on default coordinates
    fetchWeather(currentState.lat, currentState.lon, currentState.city);
}

function setupEventListeners() {
    DOM.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = DOM.input.value.trim();
        if (city) {
            geocodeCity(city);
            DOM.input.value = '';
        }
    });

    DOM.locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            showLoading();
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    reverseGeocode(lat, lon);
                },
                () => {
                    alert('Unable to retrieve your location.');
                    hideLoading();
                }
            );
        }
    });

    DOM.celsiusBtn.addEventListener('click', () => setUnits('metric'));
    DOM.fahrenheitBtn.addEventListener('click', () => setUnits('imperial'));
    
    DOM.themeToggle.addEventListener('click', toggleTheme);
}

// =========================================================
// API FETCHING LOGIC (OPEN-METEO)
// =========================================================

// 1. Convert City Name to Coordinates
async function geocodeCity(city) {
    showLoading();
    try {
        const res = await fetch(`${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const data = await res.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }
        
        const location = data.results[0];
        const displayName = `${location.name}, ${location.country_code}`;
        
        fetchWeather(location.latitude, location.longitude, displayName);
    } catch (error) {
        alert(error.message);
        hideLoading();
    }
}

// 2. Convert Coordinates to City Name (For Geolocation button)
async function reverseGeocode(lat, lon) {
    // Open-Meteo doesn't have a direct reverse geocoder, so we fetch weather first, 
    // and just call it "Current Location" for simplicity.
    fetchWeather(lat, lon, "Your Location");
}

// 3. Fetch the actual Weather Data
async function fetchWeather(lat, lon, cityName) {
    showLoading();
    
    currentState.lat = lat;
    currentState.lon = lon;
    currentState.city = cityName;

    const tempUnit = currentState.units === 'metric' ? 'celsius' : 'fahrenheit';
    const windUnit = currentState.units === 'metric' ? 'kmh' : 'mph';

    // Build the Open-Meteo query
    const query = `latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`;

    try {
        const res = await fetch(`${WEATHER_API}?${query}`);
        const data = await res.json();
        
        updateUI(data, cityName);
        addToRecentSearches(cityName);
    } catch (error) {
        alert('Failed to fetch weather data.');
    } finally {
        hideLoading();
    }
}

// =========================================================
// UI UPDATES & WMO WEATHER CODES
// =========================================================
function updateUI(data, cityName) {
    const current = data.current;
    const daily = data.daily;
    const weatherInfo = getWeatherMetadata(current.weather_code, current.is_day);

    // 1. Main Weather Section
    DOM.city.textContent = cityName;
    DOM.date.textContent = formatDate(new Date());
    DOM.temp.textContent = Math.round(current.temperature_2m);
    DOM.condition.textContent = weatherInfo.description;
    DOM.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°${currentState.units === 'metric' ? 'C' : 'F'}`;
    
    // We use OpenWeather icons as placeholders because they are widely available via direct URL
    DOM.icon.src = `https://openweathermap.org/img/wn/${weatherInfo.icon}@4x.png`;

    // 2. Highlights Section
    DOM.humidity.textContent = current.relative_humidity_2m;
    DOM.wind.textContent = current.wind_speed_10m.toFixed(1);
    DOM.windDir.textContent = getWindDirection(current.wind_direction_10m);
    
    // Visibility conversion (meters to km or miles)
    let visKm = current.visibility / 1000;
    if (currentState.units === 'imperial') visKm = visKm / 1.609;
    DOM.visibility.textContent = visKm.toFixed(1);

    // UV Index (Taking today's max UV from the daily array)
    const uvMax = daily.uv_index_max[0];
    DOM.uv.textContent = Math.round(uvMax);
    DOM.uvStatus.textContent = uvMax <= 2 ? 'Low' : uvMax <= 5 ? 'Moderate' : uvMax <= 7 ? 'High' : uvMax <= 10 ? 'Very High' : 'Extreme';

    // 3. Forecast Section
    renderForecast(daily);
}

function renderForecast(daily) {
    DOM.forecastGrid.innerHTML = '';
    
    // Loop through the next 5 days (skipping today which is index 0)
    for(let i = 1; i <= 5; i++) {
        const dateStr = daily.time[i];
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Always pass 1 for 'is_day' on daily forecasts
        const weatherInfo = getWeatherMetadata(daily.weather_code[i], 1);
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p class="day">${dayName}</p>
            <img src="https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png" alt="${weatherInfo.description}">
            <div class="forecast-temps">
                <span class="max">${Math.round(daily.temperature_2m_max[i])}°</span>
                <span class="min">${Math.round(daily.temperature_2m_min[i])}°</span>
            </div>
        `;
        DOM.forecastGrid.appendChild(card);
    }
}

// WMO Weather Code Interpreter for Open-Meteo
function getWeatherMetadata(code, isDay) {
    const dayNight = isDay ? 'd' : 'n';
    const codes = {
        0: { desc: 'Clear sky', icon: `01${dayNight}` },
        1: { desc: 'Mainly clear', icon: `02${dayNight}` },
        2: { desc: 'Partly cloudy', icon: `03${dayNight}` },
        3: { desc: 'Overcast', icon: `04${dayNight}` },
        45: { desc: 'Fog', icon: `50${dayNight}` },
        48: { desc: 'Depositing rime fog', icon: `50${dayNight}` },
        51: { desc: 'Light drizzle', icon: `09${dayNight}` },
        53: { desc: 'Moderate drizzle', icon: `09${dayNight}` },
        55: { desc: 'Dense drizzle', icon: `09${dayNight}` },
        56: { desc: 'Light freezing drizzle', icon: `09${dayNight}` },
        57: { desc: 'Dense freezing drizzle', icon: `09${dayNight}` },
        61: { desc: 'Slight rain', icon: `10${dayNight}` },
        63: { desc: 'Moderate rain', icon: `10${dayNight}` },
        65: { desc: 'Heavy rain', icon: `10${dayNight}` },
        66: { desc: 'Light freezing rain', icon: `13${dayNight}` },
        67: { desc: 'Heavy freezing rain', icon: `13${dayNight}` },
        71: { desc: 'Slight snow fall', icon: `13${dayNight}` },
        73: { desc: 'Moderate snow fall', icon: `13${dayNight}` },
        75: { desc: 'Heavy snow fall', icon: `13${dayNight}` },
        77: { desc: 'Snow grains', icon: `13${dayNight}` },
        80: { desc: 'Slight rain showers', icon: `09${dayNight}` },
        81: { desc: 'Moderate rain showers', icon: `09${dayNight}` },
        82: { desc: 'Violent rain showers', icon: `09${dayNight}` },
        85: { desc: 'Slight snow showers', icon: `13${dayNight}` },
        86: { desc: 'Heavy snow showers', icon: `13${dayNight}` },
        95: { desc: 'Thunderstorm', icon: `11${dayNight}` },
        96: { desc: 'Thunderstorm with light hail', icon: `11${dayNight}` },
        99: { desc: 'Thunderstorm with heavy hail', icon: `11${dayNight}` },
    };
    return codes[code] || { desc: 'Unknown', icon: `03${dayNight}` };
}

// =========================================================
// RECENT SEARCHES
// =========================================================
function addToRecentSearches(city) {
    if (city === "Your Location") return;

    if (!currentState.recentSearches.includes(city)) {
        currentState.recentSearches.unshift(city);
        if (currentState.recentSearches.length > 5) {
            currentState.recentSearches.pop();
        }
        localStorage.setItem('recentSearches', JSON.stringify(currentState.recentSearches));
        renderRecentSearches();
    }
}

function renderRecentSearches() {
    DOM.recentList.innerHTML = '';
    
    if (currentState.recentSearches.length === 0) {
        DOM.recentList.innerHTML = '<li class="empty-state">No recent locations</li>';
        return;
    }

    currentState.recentSearches.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => geocodeCity(city.split(',')[0]));
        DOM.recentList.appendChild(li);
    });
}

// =========================================================
// UTILITIES & TOGGLES
// =========================================================
function setUnits(unit) {
    if (currentState.units === unit) return;
    
    currentState.units = unit;
    
    if (unit === 'metric') {
        DOM.celsiusBtn.classList.add('active');
        DOM.fahrenheitBtn.classList.remove('active');
        document.querySelector('.temp-unit').textContent = '°C';
    } else {
        DOM.fahrenheitBtn.classList.add('active');
        DOM.celsiusBtn.classList.remove('active');
        document.querySelector('.temp-unit').textContent = '°F';
    }
    
    // Refetch data with new units using current coords
    fetchWeather(currentState.lat, currentState.lon, currentState.city);
}

function toggleTheme() {
    currentState.isDarkTheme = !currentState.isDarkTheme;
    const body = document.body;
    
    if (currentState.isDarkTheme) {
        body.classList.replace('light-theme', 'dark-theme');
        DOM.themeToggle.textContent = '☀️';
    } else {
        body.classList.replace('dark-theme', 'light-theme');
        DOM.themeToggle.textContent = '🌓';
    }
    
    localStorage.setItem('darkTheme', currentState.isDarkTheme);
}

function loadThemePreferences() {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        toggleTheme(); 
    }
}

function showLoading() {
    DOM.content.classList.add('hidden');
    DOM.loading.classList.remove('hidden');
}

function hideLoading() {
    DOM.loading.classList.add('hidden');
    DOM.content.classList.remove('hidden');
}

function formatDate(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8;
    return directions[index];
}

// =========================================================
// BOOTSTRAP APP
// =========================================================
init();