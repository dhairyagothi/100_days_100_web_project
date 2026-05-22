# 3D Rotating Image Gallery

A stunning, interactive 3D rotating image carousel built using pure HTML and CSS. This project leverages CSS 3D transforms and animations to create a continuous, spinning gallery effect with reflections.

## 🚀 Features
- **3D Perspective:** Uses `preserve-3d` and `perspective` properties for a realistic depth effect.
- **Smooth Animation:** A continuous 360-degree rotation powered by CSS keyframes.
- **Dynamic Reflections:** Implements `-webkit-box-reflect` to create a sleek, mirrored floor effect.
- **Responsive Design:** Images are styled with `object-fit: cover` and maintained within a flexible 3D container.
- **Interactive Elements:** Easy to customize the number of images and rotation speed.

## 🛠️ Technologies Used
- **HTML5:** Semantic structure for the gallery container.
- **CSS3:** Advanced 3D transforms (`rotateY`, `translateZ`), animations, and CSS variables for positioning.

## 📂 Project Structure
```
public/3d cards/
├── Images/      # Folder containing gallery images (img1.jpg to img8.jpg)
├── index.html   # Main gallery structure and image spans
├── style.css    # 3D logic, animations, and aesthetic styling
└── README.md    # Project documentation
```

## 🎮 How to Run
1. Navigate to the `public/3d cards` directory.
2. Open `index.html` in any modern web browser.
3. Watch the carousel rotate automatically in a seamless loop.

## ⚙️ Customization
- **Rotation Speed:** Adjust the `20s` value in `.box { animation: animate 20s linear infinite; }` within `style.css`.
- **Image Spacing:** Modify the `400px` value in `translateZ(400px)` to change the radius of the carousel.
- **Adding Images:** To add more images, update the `--i` variable in `index.html` and adjust the degree calculation in `style.css` (currently `45deg` for 8 images).
