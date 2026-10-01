# 🌦️ WeatherLens — Dynamic Weather Dashboard

WeatherLens is a modern, glassmorphism-inspired weather dashboard that provides real-time weather conditions, 5-day forecasts, air quality information, sunrise/sunset tracking, animated weather effects, favourites management, and location-based weather lookup.

Built entirely with **HTML, CSS, and JavaScript**, WeatherLens uses the **Open-Meteo API** ecosystem, requiring **no API key**.

---

## ✨ Features

### 🌍 Search Weather Anywhere

* Search weather by city name.
* Fast geocoding powered by Open-Meteo Geocoding API.
* Supports international locations.

### 📍 Current Location Weather

* Uses browser geolocation.
* Fetches weather data for the user's current position.
* Automatically resolves city information.

### 🌡️ Real-Time Weather Conditions

Displays:

* Current temperature
* Feels-like temperature
* Weather condition
* Humidity
* Wind speed
* Atmospheric pressure
* Visibility
* UV Index
* Cloud cover

---

## 📅 5-Day Forecast

View upcoming weather forecasts including:

* Daily weather conditions
* Weather icons
* Maximum temperature
* Minimum temperature

---

## 🌅 Sunrise & Sunset Tracker

Includes an animated solar arc that visualizes:

* Sunrise time
* Sunset time
* Current sun position throughout the day

---

## 🌬️ Air Quality Monitoring

Powered by Open-Meteo Air Quality API.

Displays:

* US AQI score
* AQI category
* PM2.5
* PM10
* Nitrogen Dioxide (NO₂)
* Ozone (O₃)
* Carbon Monoxide (CO)

AQI levels:

| AQI     | Category  |
| ------- | --------- |
| 0-50    | Good      |
| 51-100  | Fair      |
| 101-150 | Moderate  |
| 151-200 | Poor      |
| 200+    | Very Poor |

---

## ❤️ Favourites System

Save your most-used cities.

Features:

* Add/remove favourites
* Persistent storage using LocalStorage
* Quick access to saved locations

---

## 🕘 Recent Searches

Automatically stores recent city searches.

Features:

* One-click search history
* Stored in LocalStorage
* Up to 6 recent cities

---

## 🌈 Dynamic Weather Themes

WeatherLens automatically changes its appearance based on current conditions.

Supported themes:

* ☀️ Sunny
* ☁️ Cloudy
* 🌧️ Rainy
* ❄️ Snowy
* 🌙 Night

---

## 🎨 Animated Weather Effects

Canvas-powered particle system:

### Rain

* Falling rain streaks

### Snow

* Floating snowflakes

### Sunny

* Sparkling light particles

### Night

* Twinkling stars

---

## 🌡️ Temperature Unit Toggle

Switch between:

* Celsius (°C)
* Fahrenheit (°F)

The dashboard automatically refreshes weather data after switching units.

---

## ⏰ Live Clock

Displays:

* Current time
* Current date

Updates every second.

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript (ES6)

### APIs

* Open-Meteo Forecast API
* Open-Meteo Geocoding API
* Open-Meteo Air Quality API
* OpenStreetMap Nominatim Reverse Geocoding

### Browser Features

* Geolocation API
* LocalStorage API
* Canvas API
* Fetch API

---

## 📂 Project Structure

```text
WeatherLens/
│
├── index.html
├── styles.css
├── app.js
├── Favicon_Weather.png
└── README.md
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project
```

### 2. Navigate to Project Folder

```bash
cd weatherlens
```

### 3. Open in Browser

Simply open:

```text
index.html
```

or use a local development server:

```bash
npx serve
```

or

```bash
python -m http.server
```

---

## 🔗 API Endpoints

### Geocoding

```text
https://geocoding-api.open-meteo.com/v1/search
```

### Weather Forecast

```text
https://api.open-meteo.com/v1/forecast
```

### Air Quality

```text
https://air-quality-api.open-meteo.com/v1/air-quality
```

### Reverse Geocoding

```text
https://nominatim.openstreetmap.org/reverse
```

---

## 📱 Responsive Design

WeatherLens is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

---

## 🔮 Future Improvements

Potential enhancements:

* Hourly weather forecast
* Weather radar maps
* Severe weather alerts
* Multiple language support
* Dark/light manual theme switch
* Weather widgets
* PWA support
* Offline caching
* Weather notifications

---

## 📄 License

This project is released under the MIT License.

---

## 👨‍💻 Author

Developed as a modern weather dashboard showcasing:

* API integration
* Real-time data visualization
* Interactive UI design
* Canvas animations
* Local storage management

Enjoy exploring weather around the world with WeatherLens! 🌤️
