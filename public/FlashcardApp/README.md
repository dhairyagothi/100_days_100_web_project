# Smart Flashcards

## Description

Smart Flashcards is a vocabulary learning app that fetches definitions and pronunciations, presents words as flip cards, and tracks learning progress during a study session.

## Features

* Shuffles a predefined vocabulary deck before loading cards.
* Fetches definitions, examples, and audio from `dictionaryapi.dev`.
* Uses a flip-card interaction to reveal the answer side.
* Tracks score, streak, XP, card position, and progress bar status.
* Lets users mark each card as known or missed.
* Includes previous-card navigation.
* Plays API pronunciation audio or falls back to browser speech synthesis.
* Provides a dark theme toggle.

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Free Dictionary API
* Web Speech API
* Browser Audio API
* localStorage

## Folder Structure

```text
FlashcardApp/
|-- index.html
|-- style.css
`-- app.js
```

## How to Run

1. Clone the repository.
2. Navigate to `public/FlashcardApp`.
3. Open `index.html` in a browser.
4. Ensure you have an internet connection for dictionary data and audio.

## Screenshots

> Screenshots can be added here.

## Future Enhancements

* Persist deck progress and theme preference across page reloads.
* Add custom flashcard creation and editable decks.

## Author / Contributor

Developed as part of the GSSoC project collection.
