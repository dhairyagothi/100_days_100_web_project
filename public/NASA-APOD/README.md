# APOD Explorer (NASA Astronomy Picture of the Day)

## Description
APOD Explorer is a browser extension that brings the wonders of the universe directly to your browser. By utilizing NASA's Astronomy Picture of the Day (APOD) API, it provides users with a new, breathtaking space image and its scientific explanation every day.

## Technologies Used
- HTML5
- CSS3 (Custom animations & transitions)
- JavaScript (Vanilla & Chrome Extension API)
- NASA APOD API

## Features
- **Daily Space Discoveries**: Automatically fetches and displays the latest image from NASA.
- **Date-Based Search**: Travel through time to view pictures from any specific date in NASA's database.
- **Bookmarking System**: Save your favorite cosmic images for easy access later.
- **Persistent Storage**: Uses browser storage to keep your bookmarks safe across sessions.
- **Interactive UI**: Features smooth fade-in animations and a clean, responsive layout.
- **Educational Content**: Read detailed scientific descriptions for every featured image.

## Setup Instructions

### As a Chrome Extension:
1. Clone the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the `public/NASA-APOD/` folder.
5. The extension icon should now appear in your browser's extension list.

### Local Development:
1. Navigate to the project folder: `public/NASA-APOD/`
2. Open `popup.html` in your web browser (Note: Some extension-specific features like storage may require the extension environment to function fully).

## Folder Structure

```text
NASA-APOD/
 ├── background.js
 ├── icon128.png
 ├── icon16.png
 ├── icon48.png
 ├── manifest.json
 ├── popup.css
 ├── popup.html
 └── popup.js
```

## Author
[Mithil](https://github.com/mithilP007)
