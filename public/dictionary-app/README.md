# Vocal Lexicon Dictionary

## Description

A dictionary lookup interface that retrieves English word definitions, phonetics, example usage, and pronunciation audio from a public dictionary API.

## Features

* Searches for a word through a text input and button.
* Supports pressing Enter to submit a lookup.
* Fetches definitions from `dictionaryapi.dev`.
* Displays the word, phonetic spelling, part of speech, definition, and example context.
* Shows or hides the example and audio controls based on available API data.
* Plays pronunciation audio when an audio file is returned.
* Displays loading and no-result status messages.

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Free Dictionary API
* Web Audio playback through the browser `Audio` API

## Folder Structure

```text
dictionary-app/
|-- index.html
|-- styles.css
`-- app.js
```

## How to Run

1. Clone the repository.
2. Navigate to `public/dictionary-app`.
3. Open `index.html` in a browser.
4. Ensure you have an internet connection for dictionary results and audio.

## Screenshots

> Screenshots can be added here.

## Future Enhancements

* Show multiple meanings when a word has several definitions.
* Add a search history or favorite words list.

## Author / Contributor

Developed as part of the GSSoC project collection.
