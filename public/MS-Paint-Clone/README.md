# 🎨 Paint Clone – Browser Drawing Application

## 🚀 Overview

**Paint Clone** is a feature-rich browser-based drawing application built using **HTML, CSS, and JavaScript (Canvas API)**. It replicates core functionalities of classic paint tools, allowing users to draw, erase, fill colors, and create shapes directly in the browser.

The project demonstrates advanced canvas manipulation, event handling, and interactive UI design.

---

# ✨ Features

## 🖌️ Drawing Tools

* 🖊️ Brush tool for freehand drawing
* 🧽 Eraser tool for removing strokes
* 🪣 Fill tool (flood fill algorithm)
* 📏 Line tool
* ▭ Rectangle tool
* ⚪ Circle/Ellipse tool

---

## 🎨 Color & Styling

* Full color picker support
* Quick-access color palette
* Adjustable brush size (1–60px)
* Custom background color for canvas

---

## ↩️ Editing Features

* Undo functionality (multi-step)
* Clear canvas option
* Real-time cursor brush preview
* Smooth stroke rendering

---

## ⌨️ Keyboard Shortcuts

| Key      | Action    |
| -------- | --------- |
| B        | Brush     |
| E        | Eraser    |
| F        | Fill      |
| L        | Line      |
| R        | Rectangle |
| C        | Circle    |
| Ctrl + Z | Undo      |

---

## 💾 Export Options

* Download artwork as **PNG image**
* Instant canvas saving without backend

---

# 🧠 Advanced Concepts Used

This project demonstrates strong frontend engineering concepts:

* HTML5 Canvas API
* Flood Fill algorithm (BFS-based)
* State management (undo stack)
* Mouse event tracking
* Dynamic shape rendering
* Real-time drawing system
* Responsive canvas resizing
* DOM manipulation
* Keyboard event handling

---

# 🏗️ Project Structure

```text id="paint_structure"
paint-clone/
│
├── index.html      # UI layout and toolbar
├── style.css       # Styling and layout design
├── script.js       # Canvas engine and tools logic
├── image.png       # Favicon
└── README.md
```

---

# ⚙️ How It Works

## 1️⃣ Canvas Initialization

* Canvas automatically resizes based on screen size
* Background is set to white by default

## 2️⃣ Tool System

* Users select tools from toolbar
* Each tool changes drawing behavior dynamically

## 3️⃣ Drawing Engine

* Brush and eraser use continuous mouse tracking
* Shapes are previewed before final rendering

## 4️⃣ Fill Tool

* Uses flood-fill (BFS algorithm)
* Fills connected pixels of same color

## 5️⃣ Undo System

* Stores canvas states in memory stack
* Restores previous states on demand

---

# 🛠️ Technologies Used

| Technology       | Purpose           |
| ---------------- | ----------------- |
| HTML5            | Structure         |
| CSS3             | UI Styling        |
| JavaScript (ES6) | Application logic |
| Canvas API       | Drawing engine    |

---

# 📱 Responsive Design

* Fully responsive canvas workspace
* Works across:

  * 💻 Desktop
  * 🖥️ Laptop
  * 📱 Tablets
  * 📲 Mobile devices

---

# 🎯 Learning Highlights

This project demonstrates:

* Canvas graphics programming
* Algorithm implementation (Flood Fill)
* Real-time rendering systems
* Event-driven architecture
* UI state synchronization
* Tool-based design patterns

---

# 🔮 Future Improvements

* 🧩 Layers system (like Photoshop)
* 🖼️ Image import support
* 🎨 Advanced brush styles (spray, gradient)
* 🌙 Dark mode UI
* ☁️ Cloud save functionality
* 👥 Collaboration drawing mode

---

# 📄 License

This project is built for **learning and educational purposes**.

Feel free to modify, enhance, and use it for personal or portfolio development.

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

Happy Drawing! 🎨🚀
