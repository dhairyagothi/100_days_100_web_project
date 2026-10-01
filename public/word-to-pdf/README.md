# WordyPDF. 📄✨

A premium, clean, and minimal client-side Word (.docx) to PDF Converter.

`WordyPDF.` lets you view, layout, and convert Microsoft Word documents (`.docx`) into high-quality PDF files directly in your web browser. 

---

## 🔒 Privacy First

Unlike online PDF services that require uploading your private files and documents to a remote server, **`WordyPDF.` operates 100% client-side**.
* Your documents **never** leave your local machine.
* All parsing, layout calculations, rendering, and PDF generation are performed entirely in your browser's sandboxed environment.
* Secure, fast, and works completely offline.

---

## 🚀 Key Features

* **Drag & Drop Uploads**: Seamless HTML5 drag-and-drop zone or direct file browser selector.
* **Live Word Previewer**: Renders DOCX content with styling, margins, tables, font sizing, page alignment, and lists in real-time.
* **Double Export Architecture**:
  * **Save as PDF (Vector)**: Utilizes the browser's native print engine (styled via custom `@media print` rules) to output a 100% vector-based, crisp PDF. Supports text selection, page breaks, links, and tiny file size.
  * **Direct Download (Canvas fallback)**: Single-click instant download using `html2pdf.js` to compile the rendered content locally.
* **Interactive Preview Controls**: Zoom In, Zoom Out, and Fit to Width settings to inspect documents cleanly.
* **Premium Glassmorphic Design**: Clean dashboard layout, soft animated backgrounds, and beautiful responsive cards.
* **Persistent Themes**: Auto-saves light and dark preferences to `localStorage`.

---

## 💻 How to Run Locally

### Option 1: Direct File Opening
Double-click `index.html` or drag it into any modern web browser (Chrome, Firefox, Safari, Edge) to launch instantly.

### Option 2: Local Static Server
If you prefer running it over a local network host, open your command terminal in this directory and execute one of the following commands:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js (`http-server`):**
```bash
npx http-server -p 8000
```

Once running, navigate to `http://localhost:8000` in your web browser.
