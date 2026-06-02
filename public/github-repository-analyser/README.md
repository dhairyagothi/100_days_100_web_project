<div align="center">
  <img src="./logo.png" alt="GitHub Repo Analyzer Logo" width="150" height="150" style="border-radius: 20px; box-shadow: 0 0 20px rgba(47, 129, 247, 0.5);">

  # GitHub Repo Analyzer 🚀

  A modern, highly interactive, and premium portfolio-level web application that utilizes the GitHub API to analyze repositories and user profiles. Featuring a visually striking dark glassmorphism design, robust data visualization, and a 3D interface, it's designed to impress.

  **[View Live Demo](https://git-hub-repo-analyzer-peach.vercel.app/)**

  [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
  [![GitHub Pages](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://git-hub-repo-analyzer-peach.vercel.app/)
  [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
  [![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
  [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
</div>

<br />

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [3D Motion & UI/UX Enhancements](#-3d-motion--uiux-enhancements)
- [Technologies Used](#-technologies-used)
- [Folder Structure](#-folder-structure)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [Code of Conduct](#-code-of-conduct)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 📖 Overview

The **GitHub Repo Analyzer** is designed for developers, recruiters, and open-source enthusiasts who need a quick, beautiful, and comprehensive breakdown of any GitHub repository or user profile. Instead of navigating through standard GitHub pages, this tool extracts the most critical metrics and displays them in an immersive, futuristic dashboard. 

The project was built with performance, aesthetics, and accessibility in mind, serving as a stellar example of what vanilla web technologies can achieve without the overhead of massive frameworks.

---

## 🌐 Live Demo

Experience the dynamic interface and 3D features yourself:
👉 **[Launch GitHub Repo Analyzer](https://git-hub-repo-analyzer-peach.vercel.app/)**

---

## ✨ Key Features

### 🔍 Intelligent Search & Routing
- **Smart Input Parsing:** Paste a full GitHub URL (e.g., `https://github.com/facebook/react`), a repository slug (`facebook/react`), or just a username (`facebook`). The app automatically detects the intent.
- **Deep Repository Analysis:** Instantly fetch and display stars, forks, open issues, contributor counts, primary languages, repository size, and exact licensing information.
- **User Discovery:** Searching a username fetches their most recently updated public repositories, presented in interactive mini-cards for quick navigation.

### 💾 Local Storage Memory
- **Search History:** The app remembers your last 5 successful queries, saving them locally in your browser.
- **Quick Access Tags:** History is displayed as interactive pill tags directly below the search bar for one-click re-searching.

### 🛡️ Robust Error Handling
- **Graceful Failures:** Replaces ugly native browser alerts with custom-designed, glass-frosted error cards.
- **Rate Limit Detection:** Specifically catches and informs the user if the GitHub API rate limit has been exceeded.

---

## 🎨 3D Motion & UI/UX Enhancements

This project goes beyond standard flat web design by implementing heavy 3D layering and hardware-accelerated animations:

- **Global Parallax Background:** A custom mouse-tracking engine feeds your cursor's X and Y coordinates to CSS variables. The neon gradient lighting mesh and floating particle background subtly shift in opposition to your mouse, creating incredible depth.
- **Deep 3D Hover Effects:** Powered by `VanillaTilt.js`, the main search container, mini repository cards, and individual statistic boxes react physically to your cursor's hover position with a calculated glare effect.
- **Holographic Pop-Out Layers:** Utilizing `transform-style: preserve-3d` and `translateZ()`, typography and icons physically "pop out" closer to the screen when their parent container is tilted, mimicking a true holographic interface.
- **Number Counting Animation:** Statistics don't just appear; they count up smoothly from zero using an `easeOutQuart` easing function, making data rendering feel alive and responsive.

---

## 🛠️ Technologies Used

### Core Stack
- **HTML5:** Semantic document structure ensuring maximum accessibility and SEO compatibility.
- **CSS3:** Advanced styling utilizing custom properties (variables), Flexbox/Grid layouts, CSS animations, and `backdrop-filter` for glassmorphism.
- **Vanilla JavaScript (ES6+):** Complete logic handling including Async/Await patterns, DOM Manipulation, Event delegation, and Fetch API integrations.

### Third-Party Assets
- **[GitHub REST API](https://docs.github.com/en/rest):** The primary data provider for all user and repository metrics.
- **[FontAwesome 6](https://fontawesome.com/):** Scalable, high-quality vector icons used throughout the interface.
- **[Google Fonts](https://fonts.google.com/):** Typography powered by `Inter` for extreme readability and `Outfit` for striking geometric headings.
- **[Vanilla-Tilt.js](https://micku7zu.github.io/vanilla-tilt.js/):** A smooth 3D tilt library for JavaScript.

---

## 📂 Folder Structure

```text
github-repo-analyzer/
│
├── index.html      # Main HTML structure, meta tags, and CDN links
├── style.css       # Core styling, 3D transform layers, design tokens
├── script.js       # App logic, VanillaTilt initialization, API fetching
└── README.md       # Project documentation (You are here!)
```

---

## 🚀 Installation & Setup

Since this is a client-side application using vanilla web technologies, running it locally requires zero build tools, node modules, or bundlers.

### Prerequisites
- A modern web browser (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge).
- (Optional) A code editor like VS Code for viewing or modifying the source code.

### Step-by-Step Guide
1. **Clone the Repository:**
   Open your terminal and run:
   ```bash
   git clone https://github.com/your-username/github-repo-analyzer.git
   cd github-repo-analyzer
   ```
   *(Alternatively, you can download the project as a ZIP file and extract it).*

2. **Launch the Application:**
   - **Direct File Access:** Simply double-click the `index.html` file to open it directly in your default browser via the `file://` protocol.
   - **Local Server (Recommended):** If you are using VS Code, install the "Live Server" extension, right-click on `index.html`, and select "Open with Live Server". This ensures all API calls and local storage functions behave exactly as they do in production.

---

## 💡 Usage Guide

1. **Start a Search:** Locate the glowing search bar in the center of the screen.
2. **Enter a Query:**
   - Type `torvalds` to view Linus Torvalds' repositories.
   - Type `facebook/react` to directly analyze the React repository.
   - Paste `https://github.com/microsoft/vscode` to analyze the VS Code repository.
3. **Analyze:** Click the "Analyze" button or press `Enter`.
4. **Interact:** Hover over the generated statistics boxes to experience the 3D tilt. Click the "Copy Link" icon to copy the repo URL to your clipboard, or click the "Open in GitHub" icon to view the source directly.

---

## 🔌 API Reference

This project relies on the public, unauthenticated endpoints of the GitHub REST API.

- **Get Repository:** `GET https://api.github.com/repos/{owner}/{repo}`
- **Get User Repositories:** `GET https://api.github.com/users/{username}/repos?sort=updated`
- **Get Contributors:** `GET https://api.github.com/repos/{owner}/{repo}/contributors`

*Note: Unauthenticated requests are subject to GitHub's standard rate limiting (60 requests per hour per IP).*

---

## 🤝 Contributing

Contributions, issues, and feature requests are highly welcome! This project is great for open-source initiatives like **GirlScript Summer of Code (GSSoC)**.

### How to Contribute
1. **Fork the Project:** Click the 'Fork' button at the top right of this page.
2. **Clone your Fork:** `git clone https://github.com/your-username/github-repo-analyzer.git`
3. **Create your Feature Branch:** `git checkout -b feature/AmazingFeature`
4. **Commit your Changes:** `git commit -m 'Add some AmazingFeature'`
5. **Push to the Branch:** `git push origin feature/AmazingFeature`
6. **Open a Pull Request:** Navigate back to the original repository and click 'Compare & pull request'.

### Future Roadmap / Ideas
- [ ] Add a Light/Dark mode toggle switch.
- [ ] Implement language-specific color coding (e.g., Yellow for JS, Blue for Python).
- [ ] Add Chart.js integration to visually graph repository language breakdowns.
- [ ] Integrate GitHub OAuth authentication to drastically increase API rate limits.

---

## ⚖️ Code of Conduct

Please be respectful and kind to one another when submitting issues or pull requests. We follow the standard open-source contributor covenant to ensure a welcoming environment for all developers, from beginners to experts.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. You are free to use, modify, and distribute this software as you see fit.

---

<div align="center">
  <p>Made with ❤️ for GSSoC & Beyond.</p>
  <p><strong><a href="#top">⬆ Back to Top</a></strong></p>
</div>
