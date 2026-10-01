# Vocal Lexicon Dictionary

## Description

A feature-rich dictionary lookup interface that retrieves English word definitions, phonetics, multiple meanings, synonyms, antonyms, example usages, and pronunciation audio from the free Dictionary API — all with a polished, accessible UI.

## Features

### Core
- Search for any English word via text input or pressing **Enter**
- Fetches data from `dictionaryapi.dev` (free, no API key needed)
- Displays the word, phonetic spelling, part of speech, definition, and example context
- Plays native audio pronunciation when available

### New in this version
| Feature | Description |
|---|---|
| **Multiple meanings / tabs** | Each part of speech (noun, verb, adj…) gets its own tab; up to 5 definitions shown per tab |
| **Synonyms & Antonyms** | Displayed as clickable chips at the bottom — clicking searches that word instantly |
| **Search History** | Last 25 searches saved to `localStorage`; accessible from the sidebar |
| **Favourites** | Star any word; persists across sessions; click to re-search |
| **Sidebar panel** | Slide-in panel with History + Favourites; can be cleared |
| **Dark / Light theme toggle** | Preference saved to `localStorage` |
| **Copy definition** | Copies `word (partOfSpeech): definition` to clipboard |
| **Share word** | Uses Web Share API (mobile) or copies a deep-link URL to clipboard |
| **Clear input button** | × button inside the search field |
| **Word of the Day** | A new word shown each day from a curated pool; click "Look it up →" to search it |
| **Deep-link support** | Opening `index.html?q=serendipity` auto-searches that word |
| **Spinner / loading state** | Animated spinner while fetching |
| **Toast notifications** | Non-blocking feedback for copy, share, and favourite actions |

## Technologies Used

- HTML5
- CSS3 (custom properties, CSS animations, responsive layout)
- Vanilla JavaScript (ES2020+)
- [DM Serif Display & DM Sans](https://fonts.google.com/) via Google Fonts
- [Free Dictionary API](https://dictionaryapi.dev/)
- `localStorage` for persistent history, favourites, and theme
- Web Audio API (`new Audio()`) for pronunciation playback
- Web Share API for native sharing on mobile

## Folder Structure

```text
dictionary-app/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## How to Run

1. Clone the repository.
2. Navigate to `public/dictionary-app` (or wherever the files live).
3. Open `index.html` in any modern browser.
4. Ensure you have an internet connection for dictionary results, audio, and Google Fonts.

> No build step, no dependencies, no API key required.

## Deep-link Example

```
index.html?q=ephemeral
```

Opens the app and immediately searches for "ephemeral".

## Screenshots

> Screenshots can be added here after deployment.

## Future Enhancements

- Offline support via Service Worker caching
- Multi-language support
- Flashcard / quiz mode using the favourites list
- Export favourites as CSV or JSON

## Author / Contributor

Enhanced as part of the GSSoC project collection.