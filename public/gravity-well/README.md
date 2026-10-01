# Gravity Well // Data Simulation

A high-performance, interactive particle physics simulation built using the HTML5 Canvas API and vector-based mathematical modeling.

## 🚀 Overview
Gravity Well is a real-time data visualization project designed to demonstrate energy-efficient animation loops and spatial physics. It uses custom vector math to calculate attraction forces and creates a dynamic "constellation" network between particles based on their proximity.



## 🛠 Tech Stack
* **Language:** Vanilla JavaScript (ES6+)
* **Rendering:** HTML5 Canvas API
* **Styling:** CSS3 (Glassmorphism & Flexbox)
* **Architecture:** Modular Class-based Object Oriented Programming

## ⚙️ Core Logic
The simulation relies on three primary physics pillars:
1.  **Vector Attraction:** Every particle calculates its distance to the mouse cursor using $\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$.
2.  **Velocity Damping:** A friction coefficient of `0.96` is applied per frame to simulate realistic kinetic energy loss.
3.  **Dynamic Network:** A nested loop performs proximity checks ($dist < 100px$) to render real-time connective tissue between particles, visualizing node-based data flow.

## 💡 How to Use
1.  Clone the repository.
2.  Open `index.html` in any modern web browser.
3.  Move your mouse across the screen to create a gravity well and manipulate the particle field.

## 📈 Portfolio Impact
* Demonstrates proficiency in **RequestAnimationFrame** for 60FPS performance.
* Shows ability to handle **responsive DOM scaling** without layout overflow.
* Proves understanding of **Euclidean geometry** and vector motion.