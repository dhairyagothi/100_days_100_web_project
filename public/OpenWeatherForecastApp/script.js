const API_KEY = "YOUR_API_KEY";
async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const weatherData = document.getElementById("weatherData");

    if (city === "") {
        weatherData.innerHTML = "<p class='error'>Please enter a city name.</p>";
        return;
    }

    weatherData.innerHTML = "<p>Loading...</p>";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        weatherData.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>

    <img
        class="weather-icon"
        src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
        alt="Weather Icon"
    >

    <p><strong>${data.weather[0].main}</strong></p>
    <p>${data.weather[0].description}</p>

    <p>🌡 Temperature: ${data.main.temp} °C</p>
    <p>🌡 Feels Like: ${data.main.feels_like} °C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬 Wind Speed: ${data.wind.speed} m/s</p>
`;
    } catch (error) {
    console.log(error);
    weatherData.innerHTML =
        `<p class='error'>${error.message}</p>`;
    }
  }
  document
  .getElementById("cityInput")
  .addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
          getWeather();
      }
  });
  