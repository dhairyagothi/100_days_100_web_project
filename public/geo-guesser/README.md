# Mini Geo Guesser

A browser-based geography guessing game built with vanilla JavaScript and Leaflet. Players read hints, place a guess on the map, and score points based on how close they are to the hidden location.

## Features

- 5-round geography challenge
- Easy, medium, and hard difficulty levels
- Hint system with score penalties for extra clues
- Distance-based round scoring
- High score and games played tracking
- Theme toggle for light and dark modes

## How to Play

1. Open the game in a browser.
2. Pick a difficulty level.
3. Read the hints for the mystery location.
4. Click on the map to place your guess.
5. Confirm the guess and review your score.

## Tech Stack

- HTML
- CSS
- JavaScript
- Leaflet

## Project Structure

- `index.html` - Game shell and UI
- `css/style.css` - Styling
- `js/app.js` - App bootstrap
- `js/game.js` - Game logic
- `js/ui.js` - UI interactions
- `js/map.js` - Map behavior
- `js/storage.js` - Local storage helpers
- `js/utils.js` - Shared utilities

## Notes

- The game uses local storage for progress stats.
- Leaflet is loaded from a CDN in the HTML file.
