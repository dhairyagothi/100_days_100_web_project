# World Capital Quiz

## Description

A server-rendered quiz app that asks users to enter the capital city for a randomly selected country. The app keeps a running score while answers are correct and ends the round when the user submits a wrong answer.

## Features

* Serves quiz questions with Express and EJS templates.
* Loads country and capital records from a PostgreSQL `capitals` table.
* Accepts typed answers through a form submission.
* Compares answers case-insensitively after trimming whitespace.
* Displays the total score and correctness feedback after each submission.

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Node.js
* Express.js
* EJS
* PostgreSQL
* body-parser

## Folder Structure

```text
Country Quiz Game/
|-- capitals.csv
|-- index.js
|-- package.json
|-- package-lock.json
|-- readme
|-- public/
|   |-- images/
|   |   `-- background.jpg
|   `-- styles/
|       `-- main.css
`-- views/
    `-- index.ejs
```

## How to Run

1. Clone the repository.
2. Navigate to `public/Country Quiz Game`.
3. Install dependencies with `npm install`.
4. Create a PostgreSQL database and import `capitals.csv` into a `capitals` table.
5. Set `PG_USER`, `PG_HOST`, `PG_DATABASE`, `PG_PASSWORD`, and `PG_PORT` environment variables.
6. Start the server with `node index.js`.
7. Open `http://localhost:3000` in a browser.

## Screenshots

> Screenshots can be added here.

## Future Enhancements

* Add a setup script or seed command for importing the CSV data.
* Add a restart screen that does not rely on browser alerts.

## Author / Contributor

Developed as part of the GSSoC project collection.
