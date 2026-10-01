# pdfy. 📄✨

A premium, simple, and minimal client-side Image to PDF Converter. 

`pdfy.` lets you combine and compile multiple images (**PNG, JPEG, WebP**) into a single, clean PDF document directly within your browser. 

---

## 🔒 Privacy First

Unlike online conversion services that require uploading your personal images to a remote server, **`pdfy.` operates 100% client-side**. 
* Your files **never** leave your machine.
* All processing, image compression, layout calculations, and PDF generation are performed locally in your browser's sandboxed environment.
* Safe, secure, and works entirely offline.

---

## 🚀 Key Features

* **Drag & Drop Uploads**: Seamless HTML5 drag-and-drop dropzone or direct file browsing.
* **Aspect Ratio & Layout Customization**:
  * **Page Size**: Choose between standard **A4**, **US Letter**, or **Fit Image** (which sets page dimensions to perfectly match the original dimensions of each image).
  * **Orientation**: Toggle between **Portrait**, **Landscape**, or **Auto** (which smart-orients the page based on the aspect ratio of individual images).
  * **Margins**: Add **None (0mm)**, **Small (10mm)**, or **Medium (20mm)** white space borders.
* **Instant Reordering**: Shift image sequence order with intuitive left/right controls before generating your PDF.
* **Intelligent Canvas Normalization**: Automatically resizes and compresses extremely large images into optimized JPEG formats behind the scenes on upload. This prevents browser crashes (due to excessive memory consumption) and generates highly compact PDF files.
* **Premium Glassmorphic Design**: A beautiful, fluid interface with custom animated ambient glow backdrops.
* **Persistent Themes**: Responsive dark/light theme switching that saves your preferences in `localStorage`.

---

## 🛠️ Built With

* **Core**: Semantic HTML5 & CSS3 (with responsive layouts and modern custom properties).
* **Logic**: Vanilla ES6+ JavaScript.
* **PDF Compiler**: [jsPDF v2.5.1](https://github.com/parallax/jsPDF) (loaded via CDN).
* **Icons**: [FontAwesome v6.4.0](https://fontawesome.com/).

---

## 💻 How to Run Locally

Since `pdfy.` is built entirely with client-side vanilla technologies, it requires no installation or build steps.

### Option 1: Direct File Opening
Double-click `index.html` or drag it into any modern web browser (Chrome, Firefox, Safari, Edge) to launch.

### Option 2: Local Static Server
If you prefer running it over a local network host, run one of the following commands in the project directory:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js (`http-server`):**
```bash
npx http-server -p 8000
```

Once running, navigate to `http://localhost:8000` in your web browser.

---

## 📄 License
Designed for lightweight, offline personal and professional biometric productivity. Enjoy!
