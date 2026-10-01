# 🍽️ Recipe Finder By Ingredients

A modern and interactive web application that helps users discover delicious recipes based on the ingredients available in their pantry. The application fetches real-time meal data from **TheMealDB API** and provides detailed recipes, cooking instructions, filtering options, and a personalized favorites system.

---

## 🚀 Overview

Recipe Finder allows users to search for meals using one or multiple ingredients. It intelligently retrieves matching recipes, displays meal details, and provides an enhanced browsing experience through category filters, cuisine filters, sorting options, and bookmark functionality.

---

## ✨ Features

### 🔍 Smart Ingredient Search

* Search recipes using single or multiple ingredients
* Add ingredients using Enter or comma-separated tags
* Real-time search with optimized input handling

### 🍲 Recipe Discovery

* Fetches recipe data from TheMealDB API
* Displays recipe images and meal names
* Shows complete cooking instructions
* Lists required ingredients and measurements

### 🎛️ Advanced Filtering & Sorting

* Filter recipes by:

  * Meal category
  * Cuisine/area
* Sort recipes by:

  * Default order
  * Alphabetical order (A–Z)
  * Favorite recipes first

### ⭐ Favorites System

* Save favorite recipes locally using browser Local Storage
* Quickly access favorite meals
* Persistent favorites across browser sessions

### 🪟 Interactive User Interface

* Responsive recipe cards
* Detailed recipe modal popup
* Loading animations and status indicators
* Empty state and error handling
* Keyboard accessibility support

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript (ES6+)
* Fetch API
* Local Storage API
* TheMealDB REST API

---

## 📁 Project Structure

```plaintext
Recipe-Finder/
│
├── index.html          # Application user interface
├── style.css           # Styling and responsive design
├── script.js           # Application logic and API interactions
├── image.png           # Application favicon/logo
├── app.js
├── styles.css
└── README.md           # Project documentation
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/100_days_100_project.git
```

### 2. Navigate to the project directory

```bash
cd recipe-finder
```

### 3. Run the application

You can open the project directly in your browser:

```bash
Open index.html
```

Or use a local development server such as VS Code Live Server.

---

## 🔗 API Integration

This project uses **TheMealDB API** to retrieve recipe information.

Main API endpoints:

### Search recipes by ingredient

```text
https://www.themealdb.com/api/json/v1/1/filter.php?i=ingredient
```

### Get complete recipe details by ID

```text
https://www.themealdb.com/api/json/v1/1/lookup.php?i=mealID
```

---

## 📖 How It Works

1. Enter one or more ingredients into the search field.
2. Click the **Find Recipes** button.
3. The application fetches matching meals from the API.
4. Browse recipe cards with images and details.
5. Use filters to refine results.
6. Save favorite recipes using the bookmark button.
7. Click a recipe to view full cooking instructions.

---

## 🌟 Key Concepts Demonstrated

* API consumption using asynchronous JavaScript
* Dynamic DOM manipulation
* Event-driven programming
* Debouncing for optimized user input
* Data filtering and sorting
* Modal implementation
* Local storage management
* Responsive UI design
* Error and empty-state handling

---

## 🔮 Future Enhancements

* Add recipe search by meal name
* Add nutritional information
* Add dark/light theme toggle
* Implement user accounts and cloud-saved favorites
* Add recipe sharing functionality
* Add voice-based ingredient search

---

## 🧪 Testing Checklist

* [x] Recipe search works correctly
* [x] Multiple ingredient filtering works
* [x] Category and cuisine filters function properly
* [x] Sorting options work as expected
* [x] Favorite recipes persist after page refresh
* [x] Recipe modal opens and closes correctly
* [x] Keyboard shortcuts function correctly
* [x] Error states display appropriately

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/new-feature
```

3. Commit your changes:

```bash
git commit -m "Add amazing feature"
```

4. Push your branch and open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📸 Preview

A clean and responsive recipe exploration interface featuring ingredient tags, recipe cards, advanced filters, favorites, and detailed cooking instructions.

---

### 🍴 Turn your pantry ingredients into your next delicious meal!
