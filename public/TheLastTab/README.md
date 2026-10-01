# Last Tab

An immersive single-page interactive narrative that begins as an article about the history of the internet and slowly evolves into a psychological horror experience.

As users continue reading, the page gradually changes its appearance, content, browser title, URL, favicon, and behavior. What starts as a simple article becomes a conversation with a mysterious entity that believes it is living on the last remaining page of the internet.

## Features

* Multi-phase storytelling experience
* Dynamic content degradation and rewriting
* Interactive chat system with branching dialogue
* Animated favicon states
* Progressive UI transformations
* Browser history and URL manipulation
* Local storage persistence for returning visitors
* Multiple endings based on user choices
* Custom notifications and reader-count simulation
* Glitch effects and atmospheric visual transitions
* Responsive design for desktop and mobile devices

## Experience Flow

### Phase 1

* Reader count appears
* Notifications begin appearing
* Subtle title changes occur

### Phase 2

* Article content starts changing
* Favicon becomes animated
* URL and page state begin degrading
* Reality of the article becomes questionable

### Phase 3

* A chat interface appears
* The entity begins communicating
* The environment transforms into a darker atmosphere
* User interaction becomes part of the story

### Phase 4

* The entity asks the final question
* User chooses whether to stay or leave
* Different endings are triggered

## Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript
* Local Storage API
* History API
* Browser Visibility API
* SVG Favicons

## Running the Project

Simply open the HTML file in a modern web browser:

```bash
open index.html
```

or serve it using a local development server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Browser Support

* Google Chrome
* Microsoft Edge
* Firefox
* Safari

Modern browser features such as Local Storage, CSS Variables, History API, and ES6 JavaScript are required.

## Project Structure

```text
project/
├── index.html
├── style.css
├── script.js
├── favicon.png
└── README.md
```

## Themes

The experience transitions through multiple visual states:

* Normal article
* Uncanny degradation
* Dark terminal-inspired interface
* Multiple ending states

## Endings

The story contains multiple endings depending on user behavior and choices:

* Stay Ending
* Leave Ending
* Silent Ending

## Notes

This project is designed as an experimental storytelling experience that blends web technologies, interactive fiction, and psychological horror. The narrative relies heavily on timing, user behavior, and browser interactions to create immersion.

For the best experience, use headphones, keep the tab active, and allow the story to unfold naturally.

## Author
zen-ash-dev
