
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '2c06e2f780msh3f81c0245629ba6p19a960jsn5eff9cb95a57',
        'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
    }
};
const getWeather = (city) => {
    cityName.innerHTML = city;
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const mainContent = document.querySelector('main');

    loading.classList.remove('d-none');
    errorMessage.classList.add('d-none');
    mainContent.classList.add('d-none');

    fetch('https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=' + city, options)
        .then(response => {
            if (!response.ok) {
                throw new Error("API request failed");
            }
            return response.json();
        })
        .then((response) => {
            if (response.error || response.message) {
                throw new Error("City not found");
            }
            
            loading.classList.add('d-none');
            mainContent.classList.remove('d-none');

            console.log(response)

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
            console.error(err);
            loading.classList.add('d-none');
            errorMessage.classList.remove('d-none');
            mainContent.classList.add('d-none');
        });

}

submit.addEventListener("click", (e) => {
    e.preventDefault()
    getWeather(city.value)
})

