# Country Quiz Game

## Description
An educational quiz game that challenges players' knowledge of world capitals. Built with Node.js and Express, the game pulls data from a CSV-backed database to present random questions and track user performance.

## Technologies Used
- Node.js
- Express.js
- EJS (Embedded JavaScript)
- PostgreSQL / MySQL (Requires "worlds" database)
- CSV (for data import)

## Features
- **Randomized Questions**: Generates unique quiz questions on every round.
- **Dynamic Scoring**: Real-time feedback and score tracking.
- **Data-Driven**: Uses a structured CSV file for country and capital data.
- **Interactive UI**: Clean and engaging interface rendered via EJS templates.

## Setup Instructions
1. Navigate to the project folder: `public/Country Quiz Game/`
2. Create a database named `worlds` in your preferred RDBMS.
3. Import the provided `capitals.csv` file into a table within the database.
4. Update database credentials in `index.js` (if necessary).
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the server:
   ```bash
   node index.js
   ```
7. Open `http://localhost:3000` (or specified port) in your browser.

## Folder Structure
```text
Country Quiz Game/
 ├── views/           # EJS templates for the quiz
 ├── public/          # Static assets (CSS/JS)
 ├── capitals.csv     # Data source for countries and capitals
 ├── index.js         # Express server logic and DB connection
 └── package.json     # Project dependencies
```

## Author
[Mithil](https://github.com/mithilP007)
