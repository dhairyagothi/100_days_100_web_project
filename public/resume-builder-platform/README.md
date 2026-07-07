# Elite Resume Builder Platform

A modular, open-source **Resume Builder Platform** built using HTML, CSS, and Vanilla JavaScript. Features a SaaS-style workbench, drag-and-drop section reordering, a real-time visual page-break compiler, an ATS scanner & keyword auditor, a custom cover letter designer, a profile importer, and responsive dark/light modes.

---

## 📂 Project Architecture

```
resume-builder-platform/
├── index.html         # Main dashboard markup, SaaS panel tabs, and AI drawer layout
├── style.css          # Core SaaS workbench theme styles, transitions, grid layouts, and swatches
├── templates.css      # Structure, typographies, and layout designs for individual templates
├── app.js             # Form bindings, state sync, LocalStorage, Drag & Drop, and importers
├── ai-helper.js       # Scanners, ATS keyword calculators, completion audits, and cover letters
└── sample-data.js     # Pre-populated developer profile to demonstrate templates instantly
```

---

## 🛠️ Contributor-Friendly Extensions

This platform is engineered to be highly extensible. Below are instructions on how developers and open-source contributors can add new features.

### 1. Adding a New Resume Template
All resume styles are dynamically driven by wrapping the preview sheet in a CSS class: `.template-[name]`.
To add a new template, follow these steps:

1. **Register the option in `index.html`**:
   Find the select dropdown `#template-select` and append your option:
   ```html
   <option value="minimalist">Minimalist Dark Accent</option>
   ```
2. **Implement styles in `templates.css`**:
   Write target styles under your template selector scope:
   ```css
   .template-minimalist {
     font-family: 'Outfit', sans-serif;
     background-color: #fafafa;
   }
   
   .template-minimalist .resume-section-title {
     border-bottom: 2px solid var(--primary-color);
     text-transform: capitalize;
   }
   ```
3. **Handle custom rendering structures (Optional)**:
   If your template requires a unique grid column mapping (similar to the Modern layout), edit the `renderPreview()` function inside `app.js`:
   ```javascript
   if (activeTemplate === 'minimalist') {
     compiledHTML = compileMinimalistLayout();
   }
   ```

### 2. Adding a New Color Theme / Palette
Theme presets are maintained in a clean JSON format. To add a primary color preset:
1. Open [app.js](file:///c:/Users/dell/OneDrive/Desktop/project/cute-project/resume-builder-platform/app.js) and locate the `colorThemes` array:
   ```javascript
   const colorThemes = [
     { primary: '#2563eb', secondary: '#475569', name: 'Royal Blue' },
     { primary: '#10b981', secondary: '#4b5563', name: 'Emerald' },
     // Add your custom palette:
     { primary: '#8b5cf6', secondary: '#3730a3', name: 'Vibrant Purple' }
   ];
   ```
The UI automatically generates color swatches and wires the event listeners for your new theme upon reload.

### 3. Enhancing the ATS Score Checker & Suggestion Engine
The ATS analyzer and audit parameters are modularized in `ai-helper.js`.
- **Modifying target keywords**: Update the `industryKeywords` list in [ai-helper.js](file:///c:/Users/dell/OneDrive/Desktop/project/cute-project/resume-builder-platform/ai-helper.js) to append modern tech stacks, frameworks, or management certifications.
- **Modifying grammar auditing rules**: Add new structural constraints inside the `getSuggestions(resumeData)` function. For example, to audit phone number validation:
  ```javascript
  if (resumeData.personal.phone && !/^\+?[\d\s-()]{7,15}$/.test(resumeData.personal.phone)) {
    alerts.push({
      type: 'warning',
      section: 'Personal Details',
      message: 'Phone number format seems invalid. Ensure it is written clearly.'
    });
  }
  ```

### 4. Adding Multi-Language Support
To localise the builder workspace:
1. Create a `lang-packs.js` file defining translation strings:
   ```javascript
   const languagePacks = {
     en: { personal: "Personal Details", education: "Education", ... },
     es: { personal: "Datos Personales", education: "Educación", ... }
   };
   ```
2. Set up a language dropdown in `index.html`.
3. In `app.js`, listen to language changes and replace header titles dynamically using the dictionary mapping during rendering.

### 5. Accessibility (a11y) Contributions
To improve keyboard and screen-reader accessibility:
- Ensure all custom forms include explicit `aria-expanded` and `aria-controls` properties for accordion sections.
- Make draggable drag-handles focusable with `tabindex="0"` and support keyboard-based movements by listening to `keydown` events (Spacebar/Enter to select, Up/Down arrows to shift).
- Ensure focus rings look distinct in both light and dark dashboard modes.

---

## 🚀 Running Locally

No bundlers, node modules, or preprocessors are required. Simply open `index.html` directly in any web browser, or launch a quick local server:

**Python**:
```bash
python -m http.server 8000
```

**Node (live-server)**:
```bash
npx live-server
```
