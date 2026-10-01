# 🌱 TREE - Plant Tree Website

A modern and responsive environmental awareness website built using HTML, CSS, JavaScript, and jQuery.
This project promotes tree plantation and sustainability through an interactive and visually appealing user interface.

The website includes modern UI components, responsive layouts, smooth animations, FAQ interactions, statistics cards, and improved user experience across all devices.

---

# 📌 Features

* 🌿 Responsive Website Design
* 🌎 Environmental Awareness Landing Page
* 📱 Mobile-Friendly Layout
* 🌱 Tree Plantation Information Section
* 👨‍👩‍👧 Team Showcase Cards
* 📊 Statistics/Impact Section
* ❓ Interactive FAQ Accordion
* 📬 Contact Form Section
* ✨ Smooth Scrolling Effects
* 🎨 Hover Animations & UI Enhancements
* 🖼️ Favicon Support
* ⚡ Scroll Reveal Animations
* 🔥 Modern Hero Section Design

---

# 🛠️ Tech Stack

| Technology      | Usage                          |
| --------------- | ------------------------------ |
| HTML5           | Website Structure              |
| CSS3            | Styling & Responsive Design    |
| JavaScript      | Website Interactivity          |
| jQuery          | DOM Manipulation & FAQ Effects |
| Font Awesome    | Icons                          |
| ScrollReveal.js | Scroll Animations              |

---

# 📂 Project Structure

```text

Plant-Website/
│
├── README.md

Plants-Website/
│
├── index.html
├── style.css
├── script.js
├── blog.html
├── blog.js
├── Readme.md
│
├── images/
│   ├── about.png
│   ├── home.jpg
│   ├── plant-1.png
│   ├── plant-2.png
│   ├── plant-3.png
│   ├── faq.png
│   ├── contact.jpg
│   ├── img-1.jpg
│   ├── img-2.jpg
│   ├── img-3.jpg
│   └── img-4.jpg
├── Preview/
│   ├── Preview.mp4
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/tree-website.git
```

## 2️⃣ Open Project Folder

```bash
cd tree-website
```

## 3️⃣ Run the Project

Open `index.html` in your browser.

You can also use:

* VS Code Live Server Extension

---

# 🧠 HTML Structure

## index.html

```html
<header class="header">
    <a href="#" class="logo">
        <i class="fas fa-tree"></i>TREE.
    </a>
</header>
```

---

# 🎨 CSS Styling

## style.css

```css
:root{
   --green: #65b741;
   --black: #333;
   --white: #fff;
}

body{
   font-family: "Poppins", sans-serif;
}
```

---

# ⚡ JavaScript Functionality

## script.js

```javascript
$('.subject-header').click(function(){

    $('.subject-body').slideUp();

    $(this).next('.subject-body').slideDown();
});
```

---

# 🌟 Features Demonstrated

| Feature            | Description                   |
| ------------------ | ----------------------------- |
| Responsive Layout  | Works across all screen sizes |
| Hero Section       | Modern landing page UI        |
| Navigation Bar     | Interactive navigation menu   |
| Statistics Section | Environmental impact showcase |
| FAQ Accordion      | Expand/collapse interaction   |
| Team Cards         | Hover animation effects       |
| Smooth Scrolling   | Better user experience        |
| Contact Form       | Responsive contact section    |

---

# ✨ UI Enhancements Added

* Improved button styling
* Hover lift effects on cards
* Dark overlay on hero background
* Enhanced footer section
* Better spacing and responsiveness
* Smooth section transitions
* Improved mobile compatibility

---

# 🐞 Bug Fixes

* Fixed navbar toggle issue
* Corrected typo:

  * `servics` → `services`
  * `fa-time` → `fa-times`
* Removed unnecessary symbols and spacing issues
* Improved responsive alignment
* Fixed mobile overflow issues

---

# 🌐 Live Demo

Add your deployed project link here:

```text
https://your-demo-link.com
```

You can deploy using:

* Netlify
* Vercel
* GitHub Pages

---

# 🚀 Future Improvements

* 🌙 Dark Mode Support
* 🛒 Donation/Support Section
* 🌍 Live Tree Plantation Counter
* 📍 Interactive Map Integration
* 📬 Backend Contact Form
* 🔐 User Authentication
* 📈 Animated Statistics Counter

---

# 🤝 Contributing

Contributions are welcome.

## Steps to Contribute

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# ⭐ Support

If you found this project useful:

* Star the repository
* Fork the project
* Contribute to improve the project

---

# 👨‍💻 Author

Created with 🌱 for a greener and healthier planet.

