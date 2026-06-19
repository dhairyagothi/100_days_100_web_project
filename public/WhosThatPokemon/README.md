# Who's That Pokémon?

## Description
An interactive web game built for the [100 Days 100 Web Projects](https://github.com/dhairyagothi/100_days_100_web_project) challenge. Test your Pokémon knowledge by guessing the name of the hidden Pokémon based on its silhouette!

## Features
* **Dynamic Silhouettes:** Uses CSS filters to obscure the Pokémon until the correct guess is made.
* **Live API Data:** Fetches randomized Generation 1 Pokémon data and official artwork from the free [PokéAPI](https://pokeapi.co/).
* **Score Tracking:** Keeps track of your correct guesses during your session.
* **Responsive Design:** Fully playable on desktop, tablet, and mobile devices.

## Technologies Used
* **HTML:** Game structure and semantics.
* **CSS:** Custom styling, retro 8-bit font integration, and the silhouette visual effect (`filter: brightness(0)`).
* **JavaScript:** DOM manipulation, event handling, and asynchronous API data fetching (`fetch()`).
* **PokéAPI:** The RESTful API used to source the Pokémon names and images.

## How to Play
1. A hidden Pokémon silhouette will appear on the screen.
2. Type your guess into the input field.
3. Click **"Guess!"** or press the `Enter` key.
4. If you are correct, the Pokémon will be revealed, and your score will increase! Click **"Next Pokémon"** to keep playing.
5. If you are wrong, clear your guess and try again!

## Local Setup
1. Clone the repository to your local machine.
2. Navigate to the `public/WhosThatPokemon` (or your specific project folder name) directory.
3. Open the `index.html` file in your preferred web browser, or serve it using a local development server (like VS Code's Live Server extension).