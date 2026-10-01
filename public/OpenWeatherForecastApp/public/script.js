function formatTime(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toUTCString().match(/(\d\d:\d\d)/)[0];
}

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const weatherData = document.getElementById("weatherData");

    if (city === "") {
        weatherData.innerHTML = "<p class='error'>Please enter a city name.</p>";
        return;
    }

    weatherData.innerHTML = "<p class='loading'>Loading detailed forecast...</p>";

    const url = `/api/weather?q=${encodeURIComponent(city)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "City not found");
        }

        const sunriseTime = formatTime(data.sys.sunrise, data.timezone);
        const sunsetTime = formatTime(data.sys.sunset, data.timezone);
        const visibilityKm = (data.visibility / 1000).toFixed(1);

        weatherData.innerHTML = `
            <div class="main-weather">
                <h2>${data.name}, ${data.sys.country}</h2>
                <img
                    class="weather-icon"
                    src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png"
                    alt="Weather Icon"
                >
                <div class="temp-display">${Math.round(data.main.temp)}°C</div>
                <div class="weather-desc">${data.weather[0].description}</div>
            </div>

            <div class="weather-details">
                <div class="detail-card">
                    <span class="label">Feels Like</span>
                    <span class="value">${data.main.feels_like}°C</span>
                </div>
                <div class="detail-card">
                    <span class="label">Humidity</span>
                    <span class="value">${data.main.humidity}%</span>
                </div>
                <div class="detail-card">
                    <span class="label">Wind Speed</span>
                    <span class="value">${data.wind.speed} m/s</span>
                </div>
                <div class="detail-card">
                    <span class="label">Atmospheric Pressure</span>
                    <span class="value">${data.main.pressure} hPa</span>
                </div>
                <div class="detail-card">
                    <span class="label">Visibility</span>
                    <span class="value">${visibilityKm} km</span>
                </div>
                <div class="detail-card">
                    <span class="label">Cloudiness</span>
                    <span class="value">${data.clouds.all}%</span>
                </div>
                <div class="detail-card">
                    <span class="label">Sunrise</span>
                    <span class="value">${sunriseTime}</span>
                </div>
                <div class="detail-card">
                    <span class="label">Sunset</span>
                    <span class="value">${sunsetTime}</span>
                </div>
            </div>
        `;
    } catch (error) {
        console.log(error);
        weatherData.innerHTML = `<p class='error'>${error.message}</p>`;
    }
}

document.getElementById("searchBtn").addEventListener("click", getWeather);

document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});