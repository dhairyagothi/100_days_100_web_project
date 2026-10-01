# 🧩 Advanced Form Builder

A lightweight, browser-based tool to visually design a form field-by-field and instantly generate clean, ready-to-use HTML markup for it — no build tools, no dependencies, just open and use.

---

## 📖 Introduction

Advanced Form Builder lets you add fields one at a time (label, type, options, required), see them rendered live as an actual form, reorder or remove them as needed, and then generate the corresponding HTML with a single click — ready to copy straight into any project.

---

## ✨ Features

- **Dynamic field creation** — add fields with a custom label and one of five types: Text, Email, Number, Select, or Checkbox.
- **Smart Options input** — the comma-separated Options field only appears when the "Select" type is chosen, keeping the form clutter-free.
- **Required field toggle** — mark any field as required; this is reflected in both the live preview and the generated markup (`required` attribute).
- **Field list management** — every added field appears in a manageable list with its type tag, and can be moved up/down or deleted at any time.
- **Live form preview** — the preview panel updates instantly whenever a field is added, reordered, or removed.
- **One-click HTML generation** — the "Generate HTML" button outputs clean, indented form markup in a read-only code panel.
- **Copy to clipboard** — a Copy button on the output panel copies the generated HTML instantly, with a status message confirming success.
- **Safe input handling** — field labels and option values are escaped before rendering, so user input can never break the markup or inject HTML.
- **Empty states** — clear placeholder messaging in both the field list and live preview when no fields have been added yet.
- **Schematic/blueprint-themed UI** — a distinctive dotted-grid background, drafting-style corner marks, and monospace field-type tags (TXT / EML / NUM / SEL / CHK), fully responsive across desktop, tablet, and mobile.

---

## 🛠️ Technologies Used

- **HTML5** — semantic structure and form elements
- **CSS3** — custom properties, grid/flexbox layout, responsive design, no external UI framework
- **Vanilla JavaScript (ES6+)** — DOM manipulation, state management, and dynamic rendering, with no external libraries or dependencies
- **Google Fonts** — Space Grotesk, IBM Plex Mono, and Inter

---

## 📂 Project Structure

```text
AdvancedFormBuilder/
│
├── index.html      # Markup for the builder, live preview, and output panels
├── style.css        # Blueprint-themed styling and responsive layout
└── script.js        # Field state management, rendering, and HTML generation logic
```

---

## ⚙️ Installation

No installation or build step is required.

1. Clone or download this repository.
2. Navigate to the `AdvancedFormBuilder` folder.
3. Open `index.html` directly in any modern web browser.

```bash
git clone https://github.com/sanyogitasinghbgm-spec/100_days_100_web_project.git
cd 100_days_100_web_project/AdvancedFormBuilder
```

---

## 🚀 Usage

1. Enter a **Field Label** (e.g. "Full Name").
2. Choose a **Type** — Text, Email, Number, Select, or Checkbox.
3. If "Select" is chosen, enter comma-separated values in the **Options** field that appears.
4. Optionally check **"Mark as required"**.
5. Click **"+ Add Field"** — the field appears in both the field list and the live preview.
6. Reorder fields using the ↑ / ↓ buttons, or remove them with the × button.
7. Click **"Generate HTML"** to produce the markup for the current form.
8. Click **"Copy"** to copy the generated HTML to your clipboard for use in your own project.

---

## 🔮 Future Enhancements

- Support for additional field types (radio buttons, textarea, date, file upload)
- Drag-and-drop reordering instead of button-based reordering
- Export form configuration as JSON for saving/reloading a draft
- Custom validation rules (min/max length, regex patterns)
- Theming options beyond the default blueprint style

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and test them locally.
4. Submit a pull request with a clear description of your changes.

---

## 📄 License

This project is part of the `100_days_100_web_project` repository and is available for learning and educational purposes.

---

## 👩‍💻 Author

App Development and Documentation — Sanyogita Singh
