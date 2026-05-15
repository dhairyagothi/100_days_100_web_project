const apiKey = ''; // Add your OpenWeatherMap API Key here

const getWeather = (city) => {
    const cityName = document.getElementById('cityName');
    if (cityName) cityName.innerHTML = city;
    
    // Fetch from OpenWeatherMap for Weather ID and Description
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const weatherId = data.weather[0].id;
                const iconCode = data.weather[0].icon;
                
                // Update basic UI elements
                document.getElementById('temp').innerHTML = Math.round(data.main.temp);
                document.getElementById('temp2').innerHTML = Math.round(data.main.temp);
                document.getElementById('feels_like').innerHTML = Math.round(data.main.feels_like);
                document.getElementById('humidity').innerHTML = data.main.humidity;
                document.getElementById('humidity2').innerHTML = data.main.humidity;
                document.getElementById('min_temp').innerHTML = Math.round(data.main.temp_min);
                document.getElementById('max_temp').innerHTML = Math.round(data.main.temp_max);
                document.getElementById('wind_speed').innerHTML = data.wind.speed;
                document.getElementById('wind_speed2').innerHTML = data.wind.speed;
                document.getElementById('wind_degrees').innerHTML = data.wind.deg || '-';
                
                // Set sunrise and sunset
                const formatTime = (unix) => new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                document.getElementById('sunrise').innerHTML = formatTime(data.sys.sunrise);
                document.getElementById('sunset').innerHTML = formatTime(data.sys.sunset);

                updateUI(weatherId, iconCode);
            } else {
                alert("City not found: " + data.message);
            }
        })
        .catch(err => {
            console.error("Error fetching weather:", err);
            alert("Failed to fetch weather data. Please check your connection or API key.");
        });
}

const updateUI = (weatherId, iconCode) => {
    const body = document.body;
    body.className = ''; // Reset classes

    // Grouping OpenWeatherMap condition codes
    // https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300) {
        body.classList.add('weather-stormy');
    } else if (weatherId >= 300 && weatherId < 600) {
        body.classList.add('weather-rainy');
    } else if (weatherId >= 600 && weatherId < 700) {
        body.classList.add('weather-snowy');
    } else if (weatherId >= 700 && weatherId < 800) {
        body.classList.add('weather-cloudy');
    } else if (weatherId === 800) {
        // Special check for day/night clear sky if we wanted to be fancy
        // But for now, let's use sunny for 800
        body.classList.add('weather-sunny');
    } else if (weatherId > 800) {
        body.classList.add('weather-cloudy');
    }

    const weatherIcon = document.getElementById('weatherIcon');
    if (weatherIcon) {
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`; // Use 4x for better quality
        weatherIcon.alt = "Weather Icon";
    }
}

const submitBtn = document.getElementById('submit');
const cityInput = document.getElementById('city');

if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (cityInput.value) {
            getWeather(cityInput.value);
        }
    });
}

// Load default city
getWeather("Delhi");

