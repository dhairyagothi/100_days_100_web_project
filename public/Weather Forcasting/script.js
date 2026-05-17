const errorMessage = document.getElementById("errorMessage");

const getWeather = async (city) => {

    // Empty input validation
    if (city.trim() === "") {
        errorMessage.innerHTML = "Please enter a city name!";
        return;
    }

    errorMessage.innerHTML = "";

    try {

        cityName.innerHTML = city;

        // Step 1: Get latitude & longitude
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const geoData = await geoResponse.json();

        // Invalid city handling
        if (!geoData.results || geoData.results.length === 0) {

            errorMessage.innerHTML = "City not found!";
            clearWeatherData();
            return;
        }

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;

        // Step 2: Fetch weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        console.log(weatherData);

        // Correct objects
        const weather = weatherData.current;
        const daily = weatherData.daily;

        // Temperature
        temp.innerHTML = weather.temperature_2m;
        temp2.innerHTML = weather.temperature_2m;

        // Feels like
        feels_like.innerHTML = weather.apparent_temperature;

        // Humidity
        humidity.innerHTML = weather.relative_humidity_2m;
        humidity2.innerHTML = weather.relative_humidity_2m;

        // Min & Max temp
        min_temp.innerHTML = daily.temperature_2m_min[0];
        max_temp.innerHTML = daily.temperature_2m_max[0];

        // Wind
        wind_speed.innerHTML = weather.wind_speed_10m;
        wind_speed2.innerHTML = weather.wind_speed_10m;

        wind_degrees.innerHTML = weather.wind_direction_10m;

        // Sunrise & Sunset
        sunrise.innerHTML = new Date(daily.sunrise[0]).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        sunset.innerHTML = new Date(daily.sunset[0]).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

    } catch (error) {

        console.error("Error fetching weather data:", error);

        errorMessage.innerHTML =
            "Failed to fetch weather data. Please try again later.";

        clearWeatherData();
    }
};

// Clear weather UI
const clearWeatherData = () => {

    temp.innerHTML = "--";
    temp2.innerHTML = "--";

    feels_like.innerHTML = "--";

    humidity.innerHTML = "--";
    humidity2.innerHTML = "--";

    min_temp.innerHTML = "--";
    max_temp.innerHTML = "--";

    wind_speed.innerHTML = "--";
    wind_speed2.innerHTML = "--";

    wind_degrees.innerHTML = "--";

    sunrise.innerHTML = "--";
    sunset.innerHTML = "--";
};

// Search button event
submit.addEventListener("click", (e) => {

    e.preventDefault();

    getWeather(city.value);
});