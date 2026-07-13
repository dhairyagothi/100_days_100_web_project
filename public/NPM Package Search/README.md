# 📦 NPM Package Search

A lightweight web application that allows users to search for packages available on the **npm Registry**. Built using **HTML, CSS, and Vanilla JavaScript**, the application fetches package information in real time using the official npm Search API.

Users can quickly discover packages, view descriptions, check the latest version, identify package authors, and open the package page directly on npm.

---

## ✨ Features

* 🔍 Search npm packages by name or keyword
* ⚡ Real-time data fetched from the npm Registry API
* 📦 Displays up to **10 matching packages**
* 📝 View package description
* 🏷️ Shows the latest package version
* 👤 Displays package author information
* 🔗 Direct link to the package page on npm
* ⌨️ Search using either the **Search** button or the **Enter** key
* 📱 Responsive and clean user interface
* 🚫 Handles empty searches and network errors gracefully

---

## 🖥️ Demo

Simply enter a package name such as:

```text
react
express
vite
tailwindcss
axios
```

The application will retrieve matching packages from the npm Registry and display:

* Package Name
* Description
* Latest Version
* Author
* Link to the npm package page

---

## 🚀 How It Works

1. Enter a package name in the search field.
2. Click **Search** or press **Enter**.
3. The application sends a request to the npm Search API.
4. Search results are displayed dynamically.
5. Click **View on npm →** to open the package in a new tab.

---

## 🌐 API Used

The project uses the official npm Registry Search API:

```text
https://registry.npmjs.org/-/v1/search
```

Example request:

```text
https://registry.npmjs.org/-/v1/search?text=react&size=10
```

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript (ES6+)
* Fetch API
* npm Registry Search API

No external libraries or frameworks are required.

---

## 📂 Project Structure

```text
NPM-Package-Search/
│
├── index.html
├── styles.css
├── script.js
├── favicon.png.png
└── README.md
```

---

## ⚙️ Features Overview

* ✅ Live npm package search
* ✅ Dynamic DOM rendering
* ✅ Fetch API integration
* ✅ Keyboard support (Enter key)
* ✅ Loading state
* ✅ Error handling
* ✅ Empty result handling
* ✅ External package links
* ✅ Responsive layout

---

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/100_days_100_web_projects/npm-package-search.git
```

2. Open the project folder.

3. Launch `index.html` in your preferred web browser.

No installation, build tools, or dependencies are required.

---

## 📋 Search Results Include

Each package card displays:

* 📦 Package Name
* 📝 Description
* 🏷️ Latest Version
* 👤 Author Name
* 🔗 Link to the official npm package page

---

## ⚠️ Error Handling

The application gracefully handles:

* Empty search queries
* No matching packages found
* API request failures
* Network connectivity issues
* Multiple rapid searches using request tracking

---

## 💡 Future Improvements

* Package download statistics
* Weekly download count
* GitHub repository links
* Package keywords and tags
* License information
* Sorting and filtering options
* Infinite scrolling
* Package comparison feature
* Dark mode support
* Search history

---

## 🤝 Contributing

Contributions are welcome!

Feel free to fork the repository, improve the project, and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed as a JavaScript project to practice:

* Fetch API
* Async/Await
* DOM Manipulation
* API Integration
* Dynamic UI Rendering
* Event Handling
* Error Handling
* Responsive Web Development
