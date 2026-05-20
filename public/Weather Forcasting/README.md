# ⛅ Weather App

A real-time weather web application that lets you search any city and instantly view live weather data — including temperature, humidity, wind speed, sunrise/sunset times, and more. Also displays live weather for 6 major Indian cities in a comparison table.

---

## Features

- 🔍 Search weather for any city in the world
- 🌡️ Displays current temperature, min/max temperature, and feels-like temperature
- 💧 Shows humidity percentage and wind degree
- 🌬️ Live wind speed data
- 🌅 Accurate sunrise and sunset times
- 📊 Real-time weather table for 6 common Indian cities (Bangalore, Chennai, Hyderabad, Pune, Noida, Delhi)
- ⌨️ Search via button click or Enter key
- ⏳ Loading state while fetching data
- ❌ Error handling for invalid city names
- 📱 Fully responsive design using Bootstrap

---

## Technologies Used

- HTML5
- CSS3
- Bootstrap 5.3
- Vanilla JavaScript (async/await)
- [Open-Meteo Forecast API](https://open-meteo.com/) — free, no API key required
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) — converts city names to coordinates

---

## How It Works

The app uses a **2-step API approach**:

1. **Geocoding** — converts the city name to latitude & longitude using the Open-Meteo Geocoding API
2. **Weather Fetch** — uses those coordinates to get live weather data from the Open-Meteo Forecast API

No API key or sign-up is required. Works completely in the browser.

---

## How to Run

1. Download or clone the project folder
2. Make sure all files are in the same folder:
   ```
   your-project/
   ├── index.html
   ├── script.js
   ├── style.css
   └── nice-beach-suning-weather-hd-wallapaper.jpg
   ```
3. Open `index.html` using **VS Code Live Server** (recommended) or directly in any browser
4. Search for any city and view live weather instantly!

> ✅ No API key needed. No backend needed. Works 100% in the browser.

---

## Screenshots

> _Add screenshots of your project here_

![Weather App Screenshot](./Screenshots.png)

---

## Project Structure

```
your-project/
├── index.html       → Main HTML structure and UI layout
├── script.js        → All JavaScript logic (API calls, DOM updates)
├── style.css        → Custom styles
└── nice-beach-suning-weather-hd-wallapaper.jpg  → Background image
```

---

## API Reference

| API | Purpose | Cost |
|-----|---------|------|
| [Open-Meteo Forecast API](https://api.open-meteo.com) | Live weather data | Free |
| [Open-Meteo Geocoding API](https://geocoding-api.open-meteo.com) | City name → coordinates | Free |

---

## Author

**Raman Kumar**  
GitHub: [@RamanKumar-Dev](https://github.com/RamanKumar-Dev)  
Email: ramankumarnke12@gmail.com

---

## License

This project is open source and free to use for personal and educational purposes.