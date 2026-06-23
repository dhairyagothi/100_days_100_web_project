<div align="center">

# 📈 CryptoSphere Analytics Dashboard

**A modern, real-time cryptocurrency tracking dashboard featuring market analytics, interactive charts, and personalized watchlists.**

</div>

<br/>

## 🌌 About The Project

The **CryptoSphere Analytics Dashboard** is a browser-based application designed to track live cryptocurrency markets. By fetching real-time market data directly from the CoinGecko API, it allows users to monitor the performance, market caps, and trading volumes of the top 100 digital assets. The application combines a sleek, frosted-glass interface with powerful data visualization tools to provide comprehensive market insights.

---

## ✨ Key Features

* 🔄 **Live Market Data:** Fetches the top 100 cryptocurrencies using the CoinGecko API. The dashboard automatically refreshes this data every 60 seconds to ensure up-to-date pricing.
* 🔍 **Advanced Search & Sorting:** Users can actively search for specific cryptocurrencies by their name or symbol. A dropdown filter allows users to sort the market by market cap, price (ascending/descending), top gainers, and top losers.
* ⭐ **Personalized Watchlist:** Users can click a star icon next to any asset to save it to a personalized watchlist. This watchlist data is persistently saved using the browser's local storage.
* 📊 **Interactive Analytics Modal:** Each coin features a "Details" button that opens an overlay modal. This modal displays in-depth statistics such as 24-hour highs/lows, all-time high (ATH), and circulating supply. It also renders a 7-day historical price line chart built with Chart.js.
* 🎨 **Glassmorphism UI:** The interface utilizes a dark background with animated radial gradients, neon green accents, and frosted glass elements. A built-in toggle button allows users to switch between themes.
* 📱 **Responsive Layout:** The dashboard structure and data tables are fully responsive, utilizing media queries to adapt to screens smaller than 900px.

---

## 📁 Project Structure

```text
Crypto Tracker & Market Analytics Dashboard/
├── index.html      # Main structure, table layout, and modal elements
├── script.js       # Asynchronous API logic, sorting, Chart.js rendering, and local storage
├── style.css       # UI styling, glassmorphism effects, variables, and CSS animations
└── README.md       # Project documentation
```
## 🛠️ Technologies Used

* **HTML5:** Provides the semantic structure and integration of FontAwesome icons.
* **CSS3:** Handles styling utilizing CSS variables, flexbox/grid layouts, and responsive media queries.
* **JavaScript (ES6+):** Manages DOM manipulation, asynchronous `fetch` requests, and local storage.
* **Chart.js:** Renders the dynamic 7-day price charts via CDN integration.
* **CoinGecko API:** The external data source providing live cryptocurrency market metrics and historical price arrays.

---

## 🚀 How to Run Locally

1. **Clone the repository** to your local machine.
2. **Navigate** to the `Crypto Tracker & Market Analytics Dashboard` directory.
3. **Open the `index.html` file** directly in any modern web browser.
   * *Note: An active internet connection is required to fetch the live market data from the CoinGecko API and load the Chart.js CDN.*

---

## 🤝 Contribution

This documentation was created and enhanced as part of **GSSoC 2026 (GirlScript Summer of Code)** under open source contribution guidelines.

### Contributor
**[Ananya Joshi](https://github.com/ananyajoshi-cseai)** *GSSoC 2026 Contributor*
