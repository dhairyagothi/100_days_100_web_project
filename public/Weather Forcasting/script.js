// WEATHER APP — Using Open-Meteo
// Step 1: Convert city name → latitude/longitude (Geocoding API)
// Step 2: Use coordinates → fetch weather (Open-Meteo Forecast API)

function isoToTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function showLoading() {
    const ids = ['temp', 'temp2', 'feels_like', 'humidity', 'humidity2',
                 'min_temp', 'max_temp', 'wind_speed', 'wind_speed2',
                 'wind_degrees', 'sunrise', 'sunset'];
    ids.forEach(id => document.getElementById(id).innerHTML = '...');
    cityName.innerHTML = 'Loading...';
}

function showError(message) {
    const ids = ['temp', 'feels_like', 'humidity', 'min_temp', 'max_temp',
                 'wind_speed', 'wind_degrees', 'sunrise', 'sunset'];
    ids.forEach(id => document.getElementById(id).innerHTML = '—');
    temp2.innerHTML = '?';
    humidity2.innerHTML = '?';
    wind_speed2.innerHTML = '?';
    cityName.innerHTML = '—';
    alert('❌ ' + message);
}

async function geocodeCity(cityName) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding failed');
    const data = await response.json();
    if (!data.results || data.results.length === 0) return null;
    const r = data.results[0];
    return { lat: r.latitude, lon: r.longitude, name: r.name, country: r.country };
}

async function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast`
        + `?latitude=${lat}&longitude=${lon}`
        + `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,cloud_cover`
        + `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset`
        + `&timezone=auto&forecast_days=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather fetch failed');
    return await response.json();
}

const getWeather = async (cityInput) => {
    const city = cityInput.trim();
    if (!city) { alert('Please enter a city name.'); return; }

    showLoading();

    try {
        const location = await geocodeCity(city);
        if (!location) {
            showError(`City "${city}" not found. Check spelling and try again.`);
            return;
        }

        const weatherData = await fetchWeatherByCoords(location.lat, location.lon);
        const current = weatherData.current;
        const daily = weatherData.daily;

        cityName.innerHTML = location.name + ', ' + location.country;

        temp.innerHTML     = Math.round(current.temperature_2m);
        temp2.innerHTML    = Math.round(current.temperature_2m);
        min_temp.innerHTML = Math.round(daily.temperature_2m_min[0]);
        max_temp.innerHTML = Math.round(daily.temperature_2m_max[0]);

        humidity.innerHTML   = current.relative_humidity_2m;
        humidity2.innerHTML  = current.relative_humidity_2m;
        feels_like.innerHTML = Math.round(current.apparent_temperature);
        wind_degrees.innerHTML = current.wind_direction_10m;

        wind_speed.innerHTML  = current.wind_speed_10m;
        wind_speed2.innerHTML = current.wind_speed_10m;
        sunrise.innerHTML = isoToTime(daily.sunrise[0]);
        sunset.innerHTML  = isoToTime(daily.sunset[0]);

    } catch (error) {
        console.error('Weather error:', error);
        showError('Could not fetch weather data. Check your internet connection.');
    }
}

//  TABLE: List of common cities to show in the table
const TABLE_CITIES = ['Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Noida', 'Delhi'];

async function loadTableCities() {
    for (const cityName of TABLE_CITIES) {
        // Find the <tr> whose first <th> text matches the city name
        const rows = document.querySelectorAll('tbody tr');
        let targetRow = null;
        rows.forEach(row => {
            const th = row.querySelector('th');
            if (th && th.textContent.trim() === cityName) {
                targetRow = row;
            }
        });

        if (!targetRow) continue;

        const cells = targetRow.querySelectorAll('td');
        cells.forEach(td => td.innerHTML = '...');

        try {
            const location = await geocodeCity(cityName);
            if (!location) {
                cells.forEach(td => td.innerHTML = '—');
                continue;
            }

            const weatherData = await fetchWeatherByCoords(location.lat, location.lon);
            const c = weatherData.current;
            const d = weatherData.daily;

            cells[0].innerHTML = c.cloud_cover;                            // Cloud_pct
            cells[1].innerHTML = Math.round(c.apparent_temperature);       // Feels_like
            cells[2].innerHTML = c.relative_humidity_2m;                   // Humidity
            cells[3].innerHTML = Math.round(d.temperature_2m_max[0]);      // Max_temp
            cells[4].innerHTML = Math.round(d.temperature_2m_min[0]);      // Min_temp
            cells[5].innerHTML = isoToTime(d.sunrise[0]);                  // Sunrise
            cells[6].innerHTML = isoToTime(d.sunset[0]);                   // Sunset
            cells[7].innerHTML = Math.round(c.temperature_2m);             // Temp
            cells[8].innerHTML = c.wind_direction_10m;                     // Wind_degrees
            cells[9].innerHTML = c.wind_speed_10m;                         // Wind_speed

        } catch (err) {
            console.error(`Failed to load weather for ${cityName}:`, err);
            cells.forEach(td => td.innerHTML = '—');
        }
    }
}

//  Search button click
submit.addEventListener("click", (e) => {
    e.preventDefault()
    getWeather(city.value)
})

// ⌨ Enter key triggers search
city.addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        getWeather(city.value)
    }
})

//  On page load: fetch Delhi for cards + all table cities
window.addEventListener('DOMContentLoaded', () => {
    getWeather('Delhi');
    loadTableCities();
})