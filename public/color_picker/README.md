# 🎨 Custom Color Picker

A sleek, interactive color picker web app that lets users create custom colors using RGB sliders or HEX input, instantly copy color values in multiple formats, generate a matching color palette, and save favorite colors for later use.

---

## 📖 Introduction

Custom Color Picker is a lightweight, browser-based tool for designers and developers to experiment with colors visually. Users can adjust Red, Green, and Blue sliders (or type a HEX code directly) to generate any color, view it in real time, copy it in HEX/RGB/HSL format, auto-generate a complementary palette, and save their favorite colors — all without any backend, using pure HTML, CSS, and JavaScript.

---

## ✨ Features

- 🎚️ **Interactive RGB Sliders** — Adjust Red, Green, and Blue values (0–255) with instant live preview
- 🔤 **Two-Way HEX Sync** — Type a HEX code to update the sliders, or move the sliders to auto-update the HEX field
- 🖼️ **Live Color Display** — Large preview box shows the currently selected color in real time
- 📋 **One-Click Copy Buttons** — Copy the current color as HEX, RGB, or HSL with a single click
- 🌈 **Automatic Palette Generator** — Instantly generates 5 complementary/analogous/shade variations based on the selected base color
- 🖱️ **Click-to-Copy Palette Boxes** — Click any palette swatch to copy its HEX value directly
- ⭐ **Save Favorites** — Save your favorite colors to a persistent list stored in `localStorage`
- ❌ **Remove Favorites** — Delete any saved favorite color individually
- 🔔 **Toast Notifications** — Clean, non-intrusive feedback for copy, save, and remove actions
- 🏠 **Home Navigation** — Quick "← Back to Home" link to return to the main project hub

---

## 🛠️ Technologies Used

- **HTML5** — Structure and layout
- **CSS3** — Styling, gradients, animations, and responsive layout
- **JavaScript (Vanilla)** — Color conversions (RGB ↔ HEX ↔ HSL), DOM manipulation, and event handling
- **Web Storage API (`localStorage`)** — Persisting saved favorite colors across sessions
- **Clipboard API** — Copying color values to the clipboard

---

## 📁 Project Structure

```text
color_picker/
│
├── index.html      # Main HTML structure and UI elements
├── style.css        # Styling, layout, gradients, and animations
└── script.js        # Color logic, palette generation, favorites, and clipboard handling
```

---

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/100-Days-100-Web-Projects.git
   ```
2. Navigate to the project folder:
   ```bash
   cd 100-Days-100-Web-Projects/color_picker
   ```
3. Open `index.html` in your browser — no build step or dependencies required.

---

## 🚀 Usage

1. Move the **Red**, **Green**, and **Blue** sliders to mix your desired color.
2. Alternatively, type a HEX code directly into the **HEX input field**.
3. View the live color preview along with its HEX and RGB values.
4. Click **Copy HEX**, **Copy RGB**, or **Copy HSL** to copy the color in that format.
5. Click **Save This Color** ⭐ to add it to your Favorites list.
6. Click any color box in the **Generated Palette** section to copy its HEX code instantly.
7. Manage saved colors anytime in the **Saved Favorites** section — click to copy, or click ✖ to remove.

---

## 🔮 Future Enhancements

- Add HSL sliders alongside RGB sliders
- Add color name detection (e.g., "Tomato", "SkyBlue") for common colors
- Export saved favorites as a downloadable palette file (JSON/CSS variables)
- Add drag-and-drop reordering for saved favorites
- Add a color contrast/accessibility checker
- Dark mode toggle for the app itself

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository, raise issues, or submit pull requests to improve features, fix bugs, or enhance documentation.

---

## 📄 License

This project is open-source and available under the [MIT License](../LICENSE).

---

### Documentation — Sanyogita Singh
