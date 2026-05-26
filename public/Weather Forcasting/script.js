const errorMessage = document.getElementById("errorMessage");
const topBtn = document.getElementById("topBtn");

const getWeather = async (city) => {
    if (city.trim() === "") {
        errorMessage.innerHTML = "Please enter a city name!";
        return;
    }

    errorMessage.innerHTML = "";

    try {
        cityName.innerHTML = city;

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            errorMessage.innerHTML = "City not found!";
            clearWeatherData();
            return;
        }

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        const weather = weatherData.current;
        const daily = weatherData.daily;

        temp.innerHTML = weather.temperature_2m;
        temp2.innerHTML = weather.temperature_2m;

        feels_like.innerHTML = weather.apparent_temperature;

        humidity.innerHTML = weather.relative_humidity_2m;
        humidity2.innerHTML = weather.relative_humidity_2m;

        min_temp.innerHTML = daily.temperature_2m_min[0];
        max_temp.innerHTML = daily.temperature_2m_max[0];

        wind_speed.innerHTML = weather.wind_speed_10m;
        wind_speed2.innerHTML = weather.wind_speed_10m;

        wind_degrees.innerHTML = weather.wind_direction_10m;

        sunrise.innerHTML = new Date(daily.sunrise[0]).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

        sunset.innerHTML = new Date(daily.sunset[0]).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    } catch (error) {
        console.error("Error fetching weather data:", error);
        errorMessage.innerHTML = "Failed to fetch weather data. Please try again.";
        clearWeatherData();
    }
};

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

submit.addEventListener("click", (e) => {
    e.preventDefault();
    getWeather(city.value);
});

window.onscroll = function () {
    if (document.documentElement.scrollTop > 200) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
};

topBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

getWeather("Mumbai");