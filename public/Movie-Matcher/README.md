# Dual-Genre Movie Matcher

## Description
An interactive movie discovery tool that cross references two contrasting genres to generate highly specific recommendations. Instead of relying on a standard search, this application utilizes a custom-built local Mock API database. It uses JavaScript logical `AND` operators and array filtering to find films that sit at the exact intersection of two distinct categories (e.g., finding a film that is exactly both Horror and Comedy).

## Features
- **Zero-Config Setup:** Runs entirely in the browser using a local mock database—no API keys, `.env` files, or backend setup required.
- **Complex Data Filtering:** Simulates API querying using ES6 Array methods (`filter` and `includes`) to execute logical `AND` operations.
- **Dynamic DOM Manipulation:** Instantly renders movie cards with placeholder images generated dynamically based on the movie title.
- **Clean UI:** Responsive layout structured with semantic HTML and styled using the BEM (Block Element Modifier) methodology.

## Technologies Used
- HTML
- CSS
- JavaScript 

## Installation/Setup
1. Clone the repository.
2. Navigate to `public/Dual-Genre-Movie-Matcher/`.
3. Open `index.html` in your web browser. 
4. The project is ready to use immediately!

## Usage
1. Select a primary genre from the first dropdown (e.g., Horror).
2. Select a contrasting secondary genre from the second dropdown (e.g., Comedy).
3. Click "Find Matches" to query the local database and display the results.

## Author
@madhavcodes25