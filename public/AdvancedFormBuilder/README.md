# FormForge — Advanced Form Builder

A powerful, browser-based form builder for designing, previewing, and exporting custom web forms — no installation, no backend, no dependencies.

---

## ✨ Features

### 🧱 Field Builder
- 10 field types: Text, Email, Number, Phone, Textarea, Select, Checkbox, Radio, Date, File
- Per-field: label, placeholder, default value, help text, required toggle
- Edit any field after creation via a modal editor
- Duplicate fields with one click
- Drag & drop reordering via the fields panel

### 🔍 Validation Builder
- Min / Max length (text-based fields)
- Min / Max value (number fields)
- Regex pattern with a custom error message

### 🎨 Form Settings Panel
- Form title and description
- Submit button text
- 6 built-in themes: Dark, Light, Ocean, Forest, Warm, Mono
- Custom primary color picker
- Border radius and font size sliders

### 📱 Device Preview
Switch between three live preview viewports:

| Mode | Width |
|------|-------|
| 🖥 Desktop | 720px |
| 📟 Tablet | 680px |
| 📱 Mobile | 375px |

### 💾 Save & Load
- **Auto Save** — saves to LocalStorage automatically after every change
- **Manual Save** — explicit save via the Save button
- **Export JSON** — download the entire form schema as a `.json` file
- **Import JSON** — reload any previously exported schema
- **Generate HTML** — produces clean, semantic HTML with all validation attributes ready to copy

---

## 🛠️ Technologies

- HTML5
- CSS3 (CSS variables, Grid, Flexbox)
- Vanilla JavaScript (no frameworks, no build step)

---

## 📂 Project Structure

```text
FormForge/
├── index.html    # App shell, layout, modals
├── style.css     # Design system, themes, responsive layout
└── script.js     # State, rendering, drag & drop, save/load
```

---

## 🚀 Getting Started

No installation required.

```bash
# Just open the file in any modern browser
open index.html
```

Or serve it locally:

```bash
npx serve .
# then visit http://localhost:3000
```

---

## 🧪 Usage

1. **Add a field** — fill in a label, choose a type, set options, and click **Add Field**
2. **Reorder** — drag fields up or down using the handle in the right panel
3. **Edit or duplicate** — hover a field in the right panel to reveal action buttons
4. **Customize** — switch to the **Settings** tab to change the theme, color, and layout
5. **Export** — click **HTML** to get copy-ready markup, or **Export** to save the schema as JSON
6. **Save** — your work is auto-saved to LocalStorage; use **Import** to restore it later

---

## 🤝 Contributing

Contributions are welcome. Fork the repo and open a pull request with your changes.