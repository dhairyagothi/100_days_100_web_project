# Crypto Price Tracker

A real-time cryptocurrency price tracker that displays the top 50 cryptocurrencies by market cap with live pricing, 24-hour price changes, and instant search filtering.

## Description

This project fetches real-time cryptocurrency data from the free CoinGecko API and displays it in a beautiful, responsive grid of cards. Each card shows the coin's name, symbol, current USD price, and 24-hour percentage change (color-coded green for gains, red for losses). Search by cryptocurrency name or symbol to instantly filter the list. Data refreshes automatically every 60 seconds to keep prices current.

## Features

- **Top 50 Cryptocurrencies**: Displays the 50 largest cryptocurrencies by market cap (Bitcoin, Ethereum, etc.).
- **Real-time Prices**: Shows current price in USD with automatic updates every 60 seconds.
- **24-Hour Change**: Displays percentage price change over the last 24 hours with visual indicators (▲ green for positive, ▼ red for negative).
- **Instant Search**: Filter cryptocurrencies by name or symbol in real time as you type.
- **Responsive Grid Layout**: Auto-scaling grid that adapts from 1 to 4+ columns depending on screen size (mobile, tablet, desktop).
- **Glassmorphism UI**: Modern frosted glass effect with blur, transparency, and smooth transitions.
- **Coin Icons**: Each cryptocurrency displays its official icon/logo.
- **Error Handling**: User-friendly error message if the API is unreachable.
- **No Results Message**: Helpful feedback when search returns no matches.
- **Lazy Loading**: Images load lazily for better performance.
- **Zero Dependencies**: Pure HTML, CSS, and Vanilla JavaScript—no npm packages or build steps.

## Tech Stack

- **HTML5** — semantic structure and layout
- **CSS3** — CSS custom properties (variables), glassmorphism (`backdrop-filter`), CSS Grid, responsive media queries, smooth transitions
- **Vanilla JavaScript (ES6+)** — `async`/`await`, `fetch` API, DOM manipulation, array `filter()` method, event listeners
- **CoinGecko API** — free public API for real-time cryptocurrency market data (no authentication required)

## Folder Structure

```text
Crypto_Price_Tracker/
│
├── index.html       # App structure — header, search, crypto grid
├── style.css         # Glassmorphism styling, grid layout, responsive design
├── script.js         # API fetching, search filtering, card rendering
└── README.md         # Project documentation
```

## Setup / Run Instructions

No build step or npm install required. The app uses the public CoinGecko API which does not require authentication.

### Option 1: Open Directly
1. Navigate to the `Crypto_Price_Tracker` folder.
2. Double-click `index.html` (or open it) in any modern web browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

> **Note**: Using a local server (Option 2) is recommended because it handles CORS headers properly and provides a better development experience with live-reload.

## Usage

1. Open `index.html` in your browser.
2. The app automatically fetches the top 50 cryptocurrencies and displays them in a grid of cards.
3. Each card shows:
   - **Coin Icon** — the official cryptocurrency logo
   - **Coin Name** — full name (e.g., "Bitcoin")
   - **Coin Symbol** — ticker symbol in uppercase (e.g., "BTC")
   - **Current Price** — USD price with 2 decimal places
   - **24-Hour Change** — percentage with color and direction indicator
4. **Search**: Type in the search box to filter by cryptocurrency name or symbol (e.g., "bitcoin" or "btc").
5. **Auto-Refresh**: Prices update automatically every 60 seconds. Watch the cards update in real time as markets move.
6. **No Results**: If your search doesn't match any cryptocurrencies, a helpful message appears.

## How It Works

### Data Fetching
`fetchCrypto()` calls the CoinGecko API endpoint:
```
https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50
```
This returns the top 50 coins by market cap, ordered by market capitalization in descending order.

### Auto-Refresh
```javascript
fetchCrypto();                    // Fetch on page load
setInterval(fetchCrypto, 60000);  // Fetch again every 60 seconds
```

### Search Filtering
As the user types in the search box, the `filterAndRenderCoins()` function:
1. Gets the search term and converts it to lowercase.
2. Filters the `coinsData` array by checking if the coin's name or symbol includes the search term.
3. Re-renders only the matching coins.

### Card Rendering
For each cryptocurrency, a card is created with:
- Coin icon image, name, and symbol in the header
- Current USD price and 24-hour % change in the body
- Styling applied based on price direction (positive = green, negative = red)
- All data populated via `textContent` and attributes for security (prevents XSS)

### Error Handling
If the API fetch fails:
- The `catch` block logs the error to the console
- A red error message appears telling the user to try again later
- The grid is cleared to avoid showing stale data

## Implementation Notes

- **Security**: Data is inserted into the DOM using `textContent` instead of `innerHTML` to prevent XSS injection attacks.
- **Lazy Loading**: Images use the `loading="lazy"` attribute for better performance on slow connections.
- **No External Data Storage**: All data is fetched fresh from CoinGecko's public API; no local storage or backend is used.
- **API Rate Limiting**: CoinGecko's free API has rate limits (~10-50 calls/minute). With a 60-second refresh interval, this project stays well within limits.
- **Currency**: Prices are hardcoded to USD. To support multiple currencies, modify the `vs_currency=usd` parameter in the API URL.
- **Market Cap Sorting**: The API returns coins sorted by market cap descending. This is unchangeable on the client side without re-sorting.

## Educational Value

This project demonstrates:

- Fetching external data from a public REST API using `async`/`await`
- Parsing JSON responses
- Real-time search and filtering with array `filter()` and string methods
- DOM manipulation and dynamic card generation
- Responsive CSS Grid layout
- Glassmorphism design pattern
- Error handling for network requests
- Periodic data refresh using `setInterval()`
- CSS custom properties (variables) for theming
- Accessibility attributes (`aria-label`, `alt` text for images)

## Future Enhancements

Potential improvements:

- **Multi-Currency Support**: Allow users to toggle between USD, EUR, GBP, etc.
- **Sorting Options**: Sort by price, market cap, 24-hour change, or volume.
- **Watchlist Feature**: Save favorite cryptocurrencies to localStorage for quick access.
- **Historical Charts**: Show price charts over 1 day, 1 week, 1 month using a charting library (e.g., Chart.js).
- **More Market Data**: Display market cap, trading volume, all-time high/low, circulating supply.
- **Price Alerts**: Notify users when a cryptocurrency reaches a target price.
- **Local Storage Cache**: Store the most recent data locally to handle offline scenarios.
- **Dark/Light Theme Toggle**: Allow theme customization beyond the current dark theme.
- **Cryptocurrency Details Page**: Click a card to see detailed information and price history.

## API Information

**CoinGecko Free API** (used in this project):
- **Endpoint**: `https://api.coingecko.com/api/v3/`
- **Rate Limit**: ~10-50 calls/minute (free tier)
- **Authentication**: None required (public API)
- **Documentation**: https://www.coingecko.com/api/documentations/v3

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
