Custom Scroll Bar 🎨

A modern and customizable custom scrollbar component built using pure CSS. This project enhances the default browser scrollbar with sleek styling, smooth visuals, and improved UI aesthetics for modern web applications and portfolios.

📌 Features

Fully custom scrollbar design
Smooth scrolling experience
Modern UI styling
Lightweight implementation
Responsive design support
Cross-browser compatible
Easy customization
Pure CSS implementation


🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5      | Structure |
| CSS3       | Scrollbar Styling |

📂 Project Structure

```text
custom-scrollbar/
├── assets/
│   └── preview.png
│
├── index.html
├── style.css
└── README.md
```
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/custom-scrollbar.git
cd custom-scrollbar
🚀 Run the Project

Open the index.html file directly in your browser.

You can also run the project using a local development server such as:

VS Code Live Server Extension


🧠 HTML Structure

index.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Custom Scroll Bar</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <div class="content">
    <h1>Custom Scroll Bar</h1>

    <p>
      Scroll down to view the custom scrollbar styling.
    </p>

    <div class="scroll-box">
      <p>Lorem ipsum dolor sit amet...</p>
    </div>
  </div>

</body>
</html>



🎨 CSS Styling

style.css

body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background: #0f172a;
  color: white;
}




🌟 How It Works

The project customizes the browser scrollbar using CSS pseudo-elements:

Selector	Purpose
::-webkit-scrollbar	Controls scrollbar width
::-webkit-scrollbar-track	Styles scrollbar track
::-webkit-scrollbar-thumb	Styles draggable scrollbar
::-webkit-scrollbar-thumb:hover	Hover effects


📸 Preview

Add preview image inside:

assets/preview.png

🎯 Customization

You can easily customize:

Scrollbar width
Colors and gradients
Border radius
Hover effects
Background styling
Smooth scrolling behavior

🌐 Browser Support

Browser	Supported
Chrome	✅
Edge	✅
Safari	✅
Firefox	Partial Support

🚀 Future Improvements

Dark/Light mode support
Animated scrollbar effects
Horizontal scrollbar customization
Theme switcher integration
Glassmorphism UI styling
Tailwind CSS version


🌐 Live Demo

Add your deployed demo link here:

https://your-demo-link.com

You can deploy using:

Netlify
Vercel
GitHub Pages
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


