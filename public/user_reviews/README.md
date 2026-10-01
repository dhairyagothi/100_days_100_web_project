# User Reviews & Experience

A modern, responsive **User Reviews & Experience** component built using **HTML, CSS, and Vanilla JavaScript**. This project allows users to submit reviews, rate with stars, filter and sort reviews, and view real-time rating statistics.

## ✨ Features

### ⭐ Rating Summary

* Displays average review score.
* Visual star rating display.
* Review count.
* Rating distribution breakdown with progress bars.

### 📝 Submit Reviews

* User name input.
* Interactive 5-star rating picker.
* Review text area with character counter.
* Form validation.
* Instant review rendering.

### 🔍 Filter & Sort

Filter reviews by:

* All Reviews
* 5 Star Reviews
* 4 Star Reviews
* 3 Star Reviews
* 2 Star Reviews
* 1 Star Reviews

Sort reviews by:

* Newest First
* Oldest First
* Highest Rated
* Lowest Rated

### 💾 Local Storage Support

Reviews are automatically saved in the browser using `localStorage`.

This means:

* User reviews persist after page refresh.
* No backend required.
* Seed reviews load automatically on first visit.

### 🎨 Responsive Design

* Mobile-friendly layout.
* Adaptive review grid.
* Clean modern UI.
* Accessible structure with semantic HTML.

---

## 📂 Project Structure

```text
project/
│
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive design
├── script.js       # Application logic
├── favicon_user.png
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
```

### 2. Open the Project

Simply open:

```text
index.html
```

in your browser.

No build tools or dependencies are required.

---

## 🛠 Technologies Used

* HTML5
* CSS3
* JavaScript (ES6)
* Local Storage API

---

## 📋 Validation Rules

Before submitting a review:

* Name field cannot be empty.
* Star rating must be selected.
* Review must contain at least 10 characters.

Error messages are displayed automatically when validation fails.

---

## 📊 Rating Calculation

The application automatically calculates:

```javascript
Average Rating =
Total Rating Points / Total Reviews
```

It also updates:

* Rating distribution percentages
* Average score
* Total review count

in real time.

---

## 🔒 Security

User-generated content is sanitized before rendering using:

```javascript
escapeHTML()
```

This helps prevent basic HTML injection attacks.

---

## 🌟 Future Improvements

Potential enhancements:

* Edit reviews
* Delete reviews
* User profile images
* Backend database integration
* Authentication system
* Like/Helpful review feature
* Dark mode
* Pagination
* Search reviews

---

## 📸 Preview

### Main Sections

* Review Summary Dashboard
* Submit Review Form
* Filter & Sort Controls
* Review Cards Grid

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Built as a frontend practice project demonstrating:

* DOM Manipulation
* Event Handling
* State Management
* Local Storage
* Responsive UI Design

Feel free to fork, customize, and improve it.
