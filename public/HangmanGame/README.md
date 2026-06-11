# Hangman Game

A browser-based hangman game with progressive hints, keyboard support, and an optional Groq-powered smart hint mode.

## Features

- Classic hangman gameplay with 6 wrong guesses allowed
- On-screen alphabet keyboard and physical keyboard support
- Progressive hints that reveal more context after wrong guesses
- Optional Groq AI smart hint mode for cryptic clues
- Game over and victory modal with replay support
- Lightweight static implementation using HTML, CSS, and JavaScript

## How to Play

1. Open `index.html` in a browser.
2. Guess the hidden word by clicking letters or typing on your keyboard.
3. Wrong guesses increase the hangman count and reveal more hints.
4. Use **Get Better Hint** to move through the progressive hints.
5. Use **Smart Hint** to spend one life and get a cryptic AI clue.
6. Win by revealing the full word before reaching 6 incorrect guesses.

## Smart Hint Mode

The Smart Hint feature uses the Groq API.

- Your API key is stored in `sessionStorage` only
- The key is never written to disk
- If no key is provided, the game falls back to built-in hints

## Project Structure

- `index.html` - game layout and modals
- `style.css` - visual styling
- `script.js` - gameplay logic and hint handling
- `scripts/word-list.js` - word bank and fallback hints
- `images/` - hangman art and result animations

## Notes

- The game resets the board automatically when you click **Play Again**.
- Smart Hint mode becomes unavailable once all uses are spent or the game is over.
