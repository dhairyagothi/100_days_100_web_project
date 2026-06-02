# ✈ Wanderlust — Destination Background Slider

## 🚀 Overview
Wanderlust is a visually immersive travel destination slider built with **HTML, CSS, and JavaScript**.  
It features a dynamic full-viewport hero section with glassmorphism UI, a dropdown to switch between stunning travel destinations, and a clean 3-column footer.

---

## ✨ Features
✅ Full-viewport hero with dynamic background image on destination select  
✅ **Destination Indicator Navigation** — Interactive dots for quick destination switching  
✅ **Glassmorphism design** — frosted-glass card, header, and footer with `backdrop-filter: blur()`  
✅ Custom-styled dropdown with chevron arrow  
✅ **Gradient accent** CTA button (gold → red gradient) with glow shadow  
✅ Smooth background image transition (0.6s ease-in-out)  
✅ **Sticky header** with animated underline nav links  
✅ **Keyboard accessible** — Full keyboard navigation support with visible focus states  
✅ **Responsive** layout for desktop, tablet, and mobile  
✅ **3-column footer** with Contact, About Us, and Services sections  
✅ **ARIA attributes** for screen reader accessibility  

---

## 🛠️ Technologies Used
- HTML5  
- CSS3 (Flexbox, Grid, Glassmorphism, Custom properties)  
- JavaScript (ES6)  
- Google Fonts — Inter  

---

## 📂 Project Structure
```text
Background-Image-sider/
│
├── slider.html       # Main HTML file with indicator container
├── slider.css        # Styling (glassmorphism, indicators, layout, responsive)
├── script.js         # Interactive functionality and indicator logic
├── images/           # Destination background images
│   ├── iceland.jpg
│   ├── Jennifer.avif
│   ├── Daniel.jpeg
│   ├── kai.jpg
│   └── Hannes-Becker4.jpg
└── README.md         # Project documentation
```

---

## 🎮 How to Use

1. Open `slider.html` in your browser.  
2. **Navigate between destinations** using any of these methods:
   - Click the **indicator dots** below the dropdown
   - Use the **dropdown selector** to choose a destination
   - Click **HOME** in the navigation to return to Iceland
   - Use **keyboard navigation** (Tab to indicators, press Enter or Space)
3. The background image, title, description, and button text update dynamically.  
4. The **active indicator** highlights with a gradient glow and pulse animation.
5. Click **"Book a Trip"** to simulate a CTA action.  
6. Navigate via the header links to jump to the footer sections (Contact, About, Services).

### 🎯 Navigation Features

- **Indicator Dots**: 5 interactive dots representing each destination
- **Active State**: Currently selected destination is visually highlighted
- **Synchronized Navigation**: All navigation methods stay in sync
- **Keyboard Accessible**: Full keyboard support with visible focus states
- **Touch Friendly**: Optimized for mobile touch interactions  

---

## 🌐 Demo & Repository

🔗 Live Demo: [https://100-days-100-web-project.vercel.app/public/Background-Image-sider/slider.html](https://100-days-100-web-project.vercel.app/public/Background-Image-sider/slider.html)

🔗 GitHub Repository: [https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Background-Image-sider](https://github.com/dhairyagothi/100_days_100_web_project/tree/Main/public/Background-Image-sider)

### Clone Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
cd 100_days_100_web_project/public/Background-Image-sider
```

---

## 📱 Responsive Design

This project adapts seamlessly across devices:

- 💻 Desktop — Full glass card layout, horizontal nav
- 🖥️ Laptop — Optimized spacing
- 📱 Mobile — Stacked nav, full-width dropdown & button, single-column footer
- 📲 Tablet — Adjusted padding and font sizes

---

## ▶️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
```

### 2. Navigate to Project Folder

```bash
cd 100_days_100_web_project/public/Background-Image-sider
```

### 3. Open in Browser

Open the `slider.html` file in your preferred browser.

Enjoy exploring the world with Wanderlust ✈🌍

---

## ♿ Accessibility Features

This project implements comprehensive accessibility:

- ✅ **Keyboard Navigation**: Tab through indicators, Enter/Space to activate
- ✅ **ARIA Labels**: Descriptive labels for screen readers
- ✅ **Focus Indicators**: Visible focus states on all interactive elements
- ✅ **Semantic HTML**: Proper heading hierarchy and landmark regions
- ✅ **aria-current**: Active indicator marked for assistive technologies
- ✅ **Touch Targets**: Minimum 44x44px interaction areas for mobile

---

## 🎨 Customization

### Adding New Destinations

1. Add destination to `placeBackgrounds` object in `script.js`
2. Add description to `placeDescriptions` object
3. Add option to dropdown in `slider.html`
4. Add background image to `images/` folder

Indicators will automatically generate for all destinations!

### Styling Indicators

Modify these CSS classes in `slider.css`:
- `.destination-dot` — Base styling
- `.destination-dot:hover` — Hover effects
- `.destination-dot:focus` — Focus styles
- `.destination-dot.active` — Active state with gradient


---

## 📄 License

This project is created for **educational, learning, and portfolio purposes**.

You are free to modify and use this project for personal development and practice.