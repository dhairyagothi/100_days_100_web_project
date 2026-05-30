# Blog Page

A responsive blog page built with **HTML**, **Tailwind CSS**, and **vanilla JavaScript**. The design includes dark mode, an interactive comment system, and a refined user experience.

## Features

- **Dark / Light Mode** — theme preference persisted across sessions using `localStorage`
- **Reading Progress Bar** — progress indicator that tracks scroll position
- **Toast Notifications** — replaces native `alert()` with in-app notifications
- **Like & Bookmark** — toggle states saved to `localStorage`
- **Share Button** — uses Web Share API on mobile and copies the link on desktop
- **Comment System** with full CRUD:
  - add comments with an **optional username**
  - **like** individual comments
  - **edit** comments inline with Save / Cancel
  - **delete** comments
  - all comments persisted in `localStorage` with timestamp and date

## Technologies Used

- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript (ES6+)
- localStorage API

## How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/dhairyagothi/100_days_100_web_project.git
   ```
2. Navigate to the project:
   ```bash
   cd "public/Blog Page"
   ```
3. Open `index.html` in your browser. No build step is required.

## Project Structure

```
Blog Page/
├── index.html   # markup and layout
├── script.js    # interactivity and localStorage logic
└── README.md    # project documentation
```

## Preview

> Responsive two-column layout with the main article on the left and an interactive sidebar on the right. The layout is mobile-friendly and adapts to smaller screens.

## Author

Enhanced by [dynamo-pentester](https://github.com/dynamo-pentester) as part of GSSoC.
Contributions are welcome; see the root [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

Part of [100 Days 100 Web Projects](https://github.com/dhairyagothi/100_days_100_web_project) — MIT License.