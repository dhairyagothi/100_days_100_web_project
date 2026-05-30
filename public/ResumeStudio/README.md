# Resume Studio

## Description

Resume Studio is a browser-based, AI-powered ATS resume builder built with vanilla HTML, CSS, and JavaScript. It lets users create professional resumes with a live A4 preview, choose from multiple templates, analyze their resume against ATS (Applicant Tracking System) criteria, and download a polished PDF — all without any login or backend.

## Features

- Live A4 resume preview that updates in real time as you type
- Three resume templates — Modern, Classic, and Minimal
- ATS Analyzer with a compatibility score, completeness checklist, and smart suggestions
- Role-based keyword matching (Frontend, Backend, Fullstack, Data Science, PM, or Custom)
- Sidebar progress indicators showing completion status for each section
- PDF download using jsPDF + html2canvas (image-based, high resolution)
- Vector print support via browser's native print dialog
- Dark mode toggle
- Auto-save to `localStorage` — your data persists across sessions
- Demo data loader for quick preview
- Fully responsive layout with a collapsible sidebar on mobile/tablet

## Technologies Used

- HTML5
- CSS3 (CSS Variables, Grid, Flexbox)
- JavaScript ES6+
- [html2canvas v1.4.1](https://html2canvas.hertzen.com/) — DOM-to-canvas rendering for PDF export
- [jsPDF v2.5.1](https://github.com/parallax/jsPDF) — PDF generation in the browser
- [Google Fonts](https://fonts.google.com/) — Inter, Outfit, Playfair Display, Fira Code

## Installation / Setup

No build tools or installation required. This is a pure static project.

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/ResumeStudio.git
   ```
2. Navigate into the project folder:
   ```bash
   cd ResumeStudio
   ```
3. Open `index.html` directly in your browser:
   ```bash
   # On macOS
   open index.html

   # On Linux
   xdg-open index.html

   # On Windows — double-click index.html, or drag it into Chrome/Edge
   ```
4. No server, no `npm install`, no build step needed.

> **Note:** An active internet connection is required on first load to fetch Google Fonts and CDN libraries (html2canvas, jsPDF).

## Usage

1. Fill in your details section by section using the left sidebar navigation (Personal Info → Summary → Experience → Projects → Education → Skills).
2. Watch the live A4 preview update on the right panel in real time.
3. Switch between **Modern**, **Classic**, and **Minimal** templates using the template selector.
4. Navigate to the **ATS Analyzer** tab to see your compatibility score, checklist, and improvement suggestions.
5. Click **Download PDF** to export your resume as a high-resolution PDF.
6. Click **Print** to use the browser's native print dialog for a vector-quality PDF.
7. Use **Fill Demo Data** to instantly populate all fields with sample content.

## File Structure

```
ResumeStudio/
├── index.html      # Main app shell and HTML structure
├── style.css       # All styles — layout, themes, templates, responsive rules
└── script.js       # App logic — form handling, preview rendering, ATS engine, PDF export
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit with a clear message:
   ```bash
   git commit -m "feat: describe what you changed"
   ```
4. Push your branch and open a Pull Request against `main`.
5. Fill in the PR template completely before submitting.

Please make sure your changes are tested in Chrome and Firefox before raising a PR.

## License

MIT License

## README Author

- **Saubhagya Srivastava**
- GitHub: [Saubhagya1621](https://github.com/Saubhagya1621)
- LinkedIn: [Saubhagya Srivastava](https://www.linkedin.com/in/saubhagyasri/)🚀