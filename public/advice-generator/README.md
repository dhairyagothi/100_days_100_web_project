# Random Advice Generator

## Description

A compact advice card that fetches a fresh quote from the Advice Slip API. Users can roll for new advice and share the current quote through a prefilled X/Twitter intent link.

## Features

* Fetches random advice from an external API when the page loads.
* Dice button requests a new advice slip with a loading state.
* Displays the advice ID and quote in a centered card layout.
* Share button opens a formatted X/Twitter post for the current advice.
* Shows a friendly error message if the API request fails.

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Advice Slip API

## Folder Structure

```text
advice-generator/
|-- index.html
|-- styles.css
`-- script.js
```

## How to Run

1. Clone the repository.
2. Navigate to `public/advice-generator`.
3. Open `index.html` in a browser.
4. Ensure you have an internet connection so advice can be fetched from the API.

## Screenshots

> Screenshots can be added here.

## Future Enhancements

* Add a saved favorites list for memorable advice.
* Add copy-to-clipboard support for the current quote.

## Author / Contributor

Developed as part of the GSSoC project collection.
