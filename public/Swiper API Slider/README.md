Swiper API Slider 🖼️

A responsive and modern image slider built using HTML, CSS, JavaScript, and the Swiper.js library. This project demonstrates how to create smooth, touch-enabled sliders with navigation controls, autoplay functionality, and responsive layouts for modern web applications.


📌 Features

Responsive image slider
Swiper.js integration
Smooth slide transitions
Navigation controls
Pagination support
Touch and swipe gestures
Autoplay functionality
Mobile-friendly design
Easy customization


🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5      | Structure |
| CSS3       | Styling |
| JavaScript | Slider Functionality |
| Swiper.js  | Slider Library |


📂 Project Structure

```text
swiper-api-slider/
├── assets/
│   ├── slide1.jpg
│   ├── slide2.jpg
│   ├── slide3.jpg
│   └── preview.png
│
├── index.html
├── style.css
├── script.js
└── README.md
```


⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/your-username/swiper-api-slider.git
cd swiper-api-slider

🚀 Run the Project

Open the index.html file directly in your browser.

You can also use a local development server such as:

VS Code Live Server Extension

📦 Swiper CDN Integration

Add the Swiper CDN inside your HTML file.

CSS CDN
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
/>
JavaScript CDN
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>


🧠 HTML Structure
index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Swiper API Slider</title>

 
</head>


  
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  <script src="script.js"></script>

</body>
</html>


🎨 CSS Styling

style.css

body {
  margin: 0;
  padding: 0;
  background: #111827;
  font-family: Arial, sans-serif;
}


⚡ JavaScript Configuration

script.js

const swiper = new Swiper(".mySwiper", {});


🌟 Features Demonstrated

| Feature | Description |
|----------|-------------|
| Autoplay | Automatically changes slides |
| Loop Mode | Infinite slider loop |
| Pagination | Clickable slide indicators |
| Navigation Buttons | Previous & Next controls |
| Touch Support | Swipe gestures for mobile devices |

📸 Preview

Add project preview image inside:

assets/preview.png

🌐 Live Demo

Add your deployed demo link here:

https://your-demo-link.com

You can deploy using:

Netlify
Vercel
GitHub Pages


🚀 Future Improvements

Dynamic API-based slides
Thumbnail navigation
Vertical slider support
Lazy loading images
Video slider integration
Dark/Light mode
3D transition effects
Fullscreen slider support

🤝 Contributing

Contributions are welcome.

Fork the repository
Create a feature branch
git checkout -b feature/new-feature
Commit your changes
git commit -m "Add new feature"
Push to GitHub
git push origin feature/new-feature
Open a Pull Request


⭐ Support

If you found this project useful:

Star the repository
Fork the project
Contribute to improve the project
