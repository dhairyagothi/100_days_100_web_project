# PaletteSnap

PaletteSnap is a lightweight, frontend-only web application that allows users to upload any image and instantly extract beautiful dominant colors, generate gradient suggestions, and copy hex codes for their design projects.

## Features

- Image Upload: Easily upload any image from your device.
- Color Extraction: Accurately identifies the most dominant colors present in the uploaded image.
- Gradient Generation: Automatically creates a stunning linear gradient based on the top extracted colors.
- Copy to Clipboard: Click on any color card to instantly copy its Hex code.
- Responsive Design: Fully optimized for desktop and mobile devices.

## Architecture

The project follows a standard static web application architecture, built entirely with vanilla web technologies. It does not rely on any external libraries or backend services.

- index.html
  Serves as the structural foundation of the application. It includes the hero section for uploading images, an image preview wrapper, sections for displaying the dominant colors and suggested gradients, and an invisible canvas element used for image processing.

- style.css
  Handles all the visual aesthetics, ensuring a modern and premium user interface. It utilizes CSS Grid and Flexbox for layout management, custom keyframe animations for smooth reveals, glassmorphism effects for the upload button, and responsive media queries to adapt to different screen sizes.

- script.js
  Contains the core logic of the application:
  - File Handling: Utilizes the FileReader API to load the uploaded image and display a preview.
  - Image Processing: Draws the loaded image onto an invisible HTML5 canvas element and extracts raw pixel data using getImageData.
  - Color Quantization: Processes the pixel array, rounding RGB values to group similar colors together, and filters out extremely dark or light pixels to ensure vibrant color extraction.
  - DOM Manipulation: Dynamically generates color cards and injects them into the UI, handles the click-to-copy functionality using the Clipboard API, and updates the gradient preview section.

## How to Use

1. Open the application in any modern web browser.
2. Click the "Upload Image" button and select an image file from your device.
3. The application will process the image and display the dominant colors below.
4. Click on any color card to copy its corresponding Hex code to your clipboard.
5. Scroll down to view a suggested CSS linear gradient based on the extracted colors, along with its CSS code.

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- HTML5 Canvas API
- Clipboard API
