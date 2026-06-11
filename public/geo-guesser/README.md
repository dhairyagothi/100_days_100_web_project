# Mini Geo Guesser

Mini Geo Guesser is a browser-based geography challenge game where players guess famous locations from visual clues and hints. It uses a map-based guessing flow, round scoring, theme switching, and local storage to keep track of progress and high scores.

## Features

- 5-round guessing game with location hints
- Click-to-guess map interaction powered by Leaflet
- Score tracking with round-by-round results
- Easy, medium, and hard difficulty modes
- Light and dark theme toggle
- High score and games played persisted in local storage
- Responsive layout for desktop and mobile

## How To Play

1. Open `index.html` in a browser.
2. Pick a difficulty level.
3. Read the hints for the mystery location.
4. Click on the map to place your guess.
5. Confirm the guess and review the distance and score.
6. Finish all 5 rounds and try to beat your best score.

## Tech Stack

- HTML
- CSS
- JavaScript
- Leaflet.js

## Project Structure

```text
geo-guesser/
  index.html
  css/
    style.css
  js/
    app.js
    data.js
    game.js
    map.js
    storage.js
    ui.js
    utils.js
  images/
    *.jpg
  preview.png
  README.md
```

## Notes

- The game warns before leaving a round in progress so progress is not lost accidentally.
- Theme and score data are stored locally in the browser.
- The location set includes landmarks and destinations from around the world.

