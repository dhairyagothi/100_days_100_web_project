const API_KEY = "d346486263b3ff2dad1defc0ed65a333";
const cities = [
    { name: "LONDON", id: "london-temp", lat: 51.5074, lon: -0.1278 },
    { name: "NEW DELHI", id: "delhi-temp", lat: 28.6139, lon: 77.2090 },
    { name: "NEW YORK", id: "ny-temp", lat: 40.7128, lon: -74.0060 }
];

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        
        // Check if the response status is OK (200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        console.log(data); // Log the response to inspect its structure
        
        // Check if the expected fields exist in the response
        if (data && data.main && data.weather) {
            document.getElementById(city.id).textContent = `${data.main.temp}°C ${getWeatherIcon(data.weather[0].main)}`;
        } else {
            console.error("Unexpected data format:", data);
            document.getElementById(city.id).textContent = "❌ Invalid data";
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
        document.getElementById(city.id).textContent = `❌ Error: ${error.message}`;
    }
}

function getWeatherIcon(condition) {
    const icons = {
        Clear: "☀️",
        Clouds: "⛅",
        Rain: "🌧️",
        Snow: "❄️",
        Thunderstorm: "⛈️",
        Drizzle: "🌦️",
        Mist: "🌫️"
    };
    return icons[condition] || "🌍";
}

// Fetch weather for all cities
cities.forEach(fetchWeather);
