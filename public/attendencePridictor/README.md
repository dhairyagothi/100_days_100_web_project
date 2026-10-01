# Class Bunk Calculator & Attendance Predictor

A smart attendance management tool that helps students calculate how many classes they can safely miss while maintaining the minimum attendance requirement set by their institution. The application also predicts future attendance percentages based on planned absences and attended classes.

## Features

- **Current attendance percentage** — Instant calculation with a circular meter
- **Safe bunk calculator** — Know exactly how many more classes you can miss
- **Attendance shortage warning** — Red/yellow/green status indicators
- **Future attendance prediction** — See impact of planned absences
- **Recovery calculator** — Classes needed to reach minimum without missing more
- **Target attendance** — Classes needed to reach a custom target percentage
- **Subject-wise tracking** — Save and compare multiple subjects
- **Visual dashboard** — Charts powered by Chart.js
- **Dark/Light mode** — Toggle theme with persistence
- **LocalStorage** — All data saved locally in your browser

## Getting Started

No build step required. Open `index.html` in any modern browser, or serve locally:

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Usage

1. Enter **Total Classes Conducted** and **Classes Attended**
2. Set your institution's **Minimum Required** percentage (default: 75%)
3. Optionally set a **Target Attendance** percentage
4. Enter **Future Classes to Miss** to see a prediction
5. Click **Calculate** to view results
6. Click **Save as Subject** to track attendance per subject

## Example Outputs

| Scenario | Result |
|----------|--------|
| 42/50 classes, 75% minimum | **84%** attendance, **6 safe bunks** |
| 34/50 classes, 75% minimum | **68%** attendance, **14 classes needed** to recover |
| Miss 5 more from 42/50 | Drops to **76.4%** |

## Tech Stack

- HTML5
- CSS3 (CSS Variables, Grid, Flexbox)
- Vanilla JavaScript
- Chart.js (CDN)
- LocalStorage API

## Project Structure

```
attendencePridictor/
├── index.html    # Main application
├── styles.css    # Styling & themes
├── app.js        # Logic, calculations, storage
└── README.md     # Documentation
```

## Labels

`enhancement` · `new project` · `html` · `css` · `javascript` · `good first issue` · `hacktoberfest`

## License

Open for contributors. Feel free to fork and improve!
