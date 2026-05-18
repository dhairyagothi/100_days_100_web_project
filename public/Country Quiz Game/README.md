# Country Quiz Game

## Description
An educational quiz game that challenges players' knowledge of world capitals. Built with Node.js and Express, the game pulls data from a CSV-backed database to present random questions and track user performance.

## Technologies Used
- Node.js
- Express.js
- EJS (Embedded JavaScript)
- PostgreSQL (Requires "worlds" database)
- CSV (for data import)

## Features
- **Randomized Questions**: Generates unique quiz questions on every round.
- **Dynamic Scoring**: Real-time feedback and score tracking.
- **Data-Driven**: Uses a structured CSV file for country and capital data.
- **Interactive UI**: Clean and engaging interface rendered via EJS templates.

## Setup Instructions
1. Navigate to the project folder: `public/Country Quiz Game/`
2. Create a PostgreSQL database named `worlds`.
3. Import the provided `capitals.csv` file into a table named `capitals` within the database.
4. Set the following environment variables (e.g. in your system or in a `.env` file):
   - `PG_USER`: your PostgreSQL username
   - `PG_HOST`: database host (e.g., `localhost`)
   - `PG_DATABASE`: `worlds`
   - `PG_PASSWORD`: your PostgreSQL password
   - `PG_PORT`: database port (e.g., `5432`)
5. Install dependencies:
   ```bash
   npm install
   ```
6. Start the server:
   ```bash
   node index.js
   ```
7. Open `http://localhost:3000` in your web browser.

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
