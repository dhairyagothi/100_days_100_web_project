# GitHub Profile Battle

A small web app that lets two GitHub users "battle" by comparing public profile statistics (followers, public repos, following, and more) and declares a winner using a simple scoring algorithm.

## Features

- Compare two GitHub profiles side-by-side
- Scores based on followers, public repositories, following and (optionally) total stars
- Uses the GitHub REST API to fetch live profile data
- Responsive, minimal UI with instant results

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- GitHub REST API

## Demo

[View Demo](https://100-days-100-web-project.vercel.app/public/Github-Profile-Battle/index.html)

## How to Run Locally

1. Clone the repository (if you haven't already):

   ```bash
   git clone https://github.com/dhairyagothi/100_days_100_web_project.git
   ```

2. Open the project folder in your browser:

   - Open `public/Github-Profile-Battle/index.html` directly in the browser.
   - Or serve the repository root with a simple static server, for example:

   ```bash
   # from repository root
   python -m http.server 8000
   # then open http://localhost:8000/public/Github-Profile-Battle/index.html
   ```

3. Enter two GitHub usernames and click **Battle**.

## Notes

- The app uses unauthenticated requests to the GitHub API and may be subject to rate limits. If you hit rate limits regularly, you can add a personal access token in `script.js` to increase the request quota (see comments in `script.js`).

## Project Structure

```
Github-Profile-Battle/
├── index.html
├── script.js
├── style.css
└── README.md
```

## Author

Krish Dargar
(GSSoC 2026 Contributor)

## License

This project is included in the main repository and follows the repository license (MIT).
