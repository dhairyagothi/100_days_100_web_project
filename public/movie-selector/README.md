# 🎬 What to Watch – Random Movie Selector

A modern web application that helps users discover their next favorite movie by selecting a genre and receiving a randomly chosen **highly-rated movie recommendation**. Powered by **The Movie Database (TMDb) API**, the application fetches top-rated films, displays movie details, and provides a smooth and engaging movie discovery experience.

---

## 🚀 Features

### 🎲 Random Movie Recommendations

* Select a movie genre from the available list.
* Fetches a random highly-rated movie within the selected category.
* Randomly chooses from multiple pages of results for greater variety.
* Filters movies with a significant number of user votes to ensure quality recommendations.

---

## 🎭 Supported Genres

Choose from popular genres including:

* Action
* Adventure
* Animation
* Comedy
* Crime
* Documentary
* Drama
* Fantasy
* Horror
* Mystery
* Science Fiction
* Thriller

---

## ⭐ Movie Details Display

Each recommendation includes:

* Movie poster artwork.
* Movie title.
* User rating score.
* Release year.
* Plot summary/overview.
* Fallback poster handling when an official poster is unavailable.

---

## 🔄 Interactive User Experience

* Clean and responsive user interface.
* Loading animation while fetching movie data.
* Welcome state before searching.
* Dynamic movie recommendation cards.
* Error handling for failed API requests or empty results.

---

## 🔐 TMDb API Integration

The application uses the **TMDb Discover Movie API** to retrieve movie recommendations.

Features of API usage:

* Genre-based filtering.
* Top-rated movie sorting.
* Vote count filtering.
* Adult content exclusion.
* Secure API key support through environment variables or global configuration.

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (ES6+)
* Fetch API
* TMDb API

---

## 📂 Project Structure

```text
What-to-Watch-Random-Movie-Selector/
│
├── index.html        # Main application structure
├── styles.css        # Styling and responsive UI
├── app.js            # API integration and movie selection logic
├── image.png         # Custom favicon
├── .env.example
└── README.md         # Project documentation
```

---

## ▶️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/100_days_100_project.git
```

### 2. Navigate to the Project Folder

```bash
cd movie-selector
```

### 3. Get a TMDb API Key

1. Create an account on TMDb.
2. Generate an API key from your TMDb developer dashboard.
3. Add your API key using one of the following methods:

#### Option A: Global JavaScript Variable

```javascript
window.TMDB_API_KEY = "your_api_key_here";
```

#### Option B: Environment Variable

For Vite-based projects:

```env
VITE_TMDB_API_KEY=your_api_key_here
```

---

### 4. Run the Application

Open the `index.html` file in your preferred browser.

No additional dependencies or build tools are required for the basic version.

---

## ⚙️ How It Works

1. Select your favorite movie genre.
2. Click the **Find Movie** button.
3. The application sends a request to the TMDb Discover API.
4. A random movie is selected from the returned high-rated results.
5. The movie card displays its poster, rating, release year, and synopsis.

---

## 📱 Responsive Design

The interface is optimized for:

* 💻 Desktop devices
* 📱 Mobile phones
* 📟 Tablets

---

## 🔮 Future Enhancements

Potential improvements include:

* Add more genres and filtering options.
* Support for TV show recommendations.
* Movie trailers integration.
* Watchlist and favorites system.
* Dark and light theme switching.
* Streaming platform availability information.
* Advanced recommendation algorithms.
* Search by actor, director, or release year.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature-name
```

3. Commit your changes:

```bash
git commit -m "Add your feature"
```

4. Push your branch:

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## ⭐ Acknowledgements

* The Movie Database (TMDb) for providing movie information and images.
* Fetch API for asynchronous data retrieval.
* Inspired by random movie recommendation tools and movie discovery platforms.

---

### ⭐ If you enjoy this project, consider giving it a star on GitHub!
