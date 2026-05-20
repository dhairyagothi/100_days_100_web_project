const apiKey = "YOUR_REAL_API_KEY";
const getWeather = (city) => {
    cityName.innerHTML = city
    loading.style.display = "block";
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then((response) => {
            console.log(response)
            setTimeout(() => {
                loading.style.display = "none";
            }, 800);
            // cloud_pct.innerHTML = response.main.maincloud_pct
            temp.innerHTML = response.main.temp
            temp2.innerHTML = response.main.temp
            feels_like.innerHTML = response.main.feels_like
            humidity.innerHTML = response.main.humidity
            humidity2.innerHTML = response.main.humidity
            min_temp.innerHTML = response.main.temp_min
            max_temp.innerHTML = response.main.temp_max
            wind_speed.innerHTML = response.wind.speed
            wind_speed2.innerHTML = response.wind.speed
            wind_degrees.innerHTML = response.wind.deg
            sunrise.innerHTML = new Date(response.sys.sunrise * 1000).toLocaleTimeString();
            sunset.innerHTML = new Date(response.sys.sunset * 1000).toLocaleTimeString();


        })
        .catch(err => {

            setTimeout(() => {
                loading.style.display = "none";
            }, 800);


            console.error(err);
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
};
const getWeather = (city) => {
    cityName.innerHTML = city
    loading.style.display = "block";
    fetch('https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=' + city, options)
        .then(response => response.json())
        .then((response) => {
            console.log(response)
            loading.style.display = "none";
            // cloud_pct.innerHTML = response.cloud_pct
            temp.innerHTML = response.temp
            temp2.innerHTML = response.temp
            feels_like.innerHTML = response.feels_like
            humidity.innerHTML = response.humidity
            humidity2.innerHTML = response.humidity
            min_temp.innerHTML = response.min_temp
            max_temp.innerHTML = response.max_temp
            wind_speed.innerHTML = response.wind_speed
            wind_speed2.innerHTML = response.wind_speed
            wind_degrees.innerHTML = response.wind_degrees
            sunrise.innerHTML = response.sunrise
            sunset.innerHTML = response.sunset
            

        })
          .catch(err => {

            // HIDE spinner if error occurs
            loading.style.display = "none";

            console.error(err);
        });

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