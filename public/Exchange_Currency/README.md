# Currency Converter

## Description

A currency converter that populates currency dropdowns from a local country-code map, fetches current exchange rates, displays flag icons, and visualizes a recent trend with Chart.js.

## Features

* Converts between many currencies using a public currency API with a fallback endpoint.
* Automatically updates conversion output when the amount or currency selection changes.
* Displays source and target country flags using FlagsAPI.
* Swaps currencies through a clickable exchange icon.
* Validates amount input and rejects negative or invalid values.
* Shows a converted amount field and current exchange rate message.
* Saves up to ten recent conversions in `localStorage`.
* Lets users click a history item to reload that conversion.
* Draws a simulated seven-day rate trend with Chart.js.

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Font Awesome
* Chart.js
* FlagsAPI
* Currency API
* localStorage

## Folder Structure

```text
Exchange_Currency/
|-- index.html
|-- style.css
|-- app.js
|-- data.js
`-- preview.png
```

## How to Run

1. Clone the repository.
2. Navigate to `public/Exchange_Currency`.
3. Open `index.html` in a browser.
4. Ensure you have an internet connection for exchange rates, flags, icons, and Chart.js.

## Screenshots

> Screenshots can be added here.

## Future Enhancements

* Replace simulated trend values with real historical exchange-rate data.
* Add currency search inside the dropdowns.

## Author / Contributor

Developed as part of the GSSoC project collection.
