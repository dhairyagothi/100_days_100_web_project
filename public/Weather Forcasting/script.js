const getWeather = (city) => {
    cityName.innerHTML = city;
    fetch('https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=' + city, options)
        .then(response => response.json())
        .then((response) => {
            console.log(response);

            temp.innerHTML = response.temp;
            temp2.innerHTML = response.temp;
            feels_like.innerHTML = response.feels_like;
            humidity.innerHTML = response.humidity;
            humidity2.innerHTML = response.humidity;
            min_temp.innerHTML = response.min_temp;
            max_temp.innerHTML = response.max_temp;
            wind_speed.innerHTML = response.wind_speed;
            wind_speed2.innerHTML = response.wind_speed;
            wind_degrees.innerHTML = response.wind_degrees;
            sunrise.innerHTML = response.sunrise;
            sunset.innerHTML = response.sunset;

            if (response.cloud_pct > 70) {
                document.body.style.background = "linear-gradient(to right, #757f9a, #d7dde8)";
            } else if (response.humidity > 80) {
                document.body.style.background = "linear-gradient(to right, #4b79a1, #283e51)";
            } else if (response.temp > 30) {
                document.body.style.background = "linear-gradient(to right, #f7971e, #ffd200)";
            } else if (response.temp < 10) {
                document.body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
            } else {
                document.body.style.background = "linear-gradient(to right, #4facfe, #00f2fe)";
            }
        })  // 👈 closes the .then()
        .catch(err => console.error(err));
}

submit.addEventListener("click", (e) => {
    e.preventDefault();
    getWeather(city.value);
});