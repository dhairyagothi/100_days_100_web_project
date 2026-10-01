# SplitWise Pro — Bill Splitter

## 📖 Description

SplitWise Pro is a fully-featured, browser-based bill splitting tool. It supports equal and custom splits, item-level assignment, settlement logic, tip calculation, dark mode, history tracking, PDF export, and QR sharing — all with no backend or installation required.

## ✨ Features

- **⚖️ Equal Split** — Divide a bill evenly among any number of named participants
- **🎯 Custom Split** — Assign different amounts per person; live indicator shows unassigned balance
- **🧾 Split by Items** — Add line items and assign each to specific people; tip is distributed proportionally
- **💡 Tip Calculator** — Enter a custom tip % or pick a preset (5%, 10%, 15%, 18%, 20%, 25%)
- **💸 Settlement Logic** — Automatically calculates who owes whom using a debt-simplification algorithm
- **👥 Named Participants** — Add, rename, and remove people across all split modes
- **🌙 Dark Mode** — Toggle between light and dark themes; preference persists across sessions
- **💾 History** — Save any split result; view the last 30 splits in a slide-out drawer with clear-all support
- **📄 PDF Export** — Download a styled PDF summary with bill breakdown and settlement table
- **📲 QR Share** — Generate a QR code encoding the split summary for easy sharing

## 🛠️ Technologies Used

- HTML5
- CSS3 (custom properties, CSS variables for theming)
- Vanilla JavaScript (ES6+)
- [jsPDF](https://github.com/parallax/jsPDF) — PDF generation
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) — QR code rendering
- Google Fonts — DM Serif Display, DM Mono, Outfit
- `localStorage` — history and dark mode persistence

## 📂 Project Structure

```text
bill-splitter/
├── index.html   # App shell, markup, tab layout, modals
├── style.css    # All styles — themes, components, animations
└── app.js       # All logic — splits, settlement, PDF, QR, history
```

## 🚀 Getting Started

### Installation

No installation required. All dependencies are loaded from CDNs.

### Run

Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

## 🧭 Usage Guide

### Equal Split
1. Enter the total bill amount
2. Select or type a tip percentage
3. Add participant names
4. Click **Calculate Split**

### Custom Split
1. Enter the total bill
2. Add participants and type how much each person's share is
3. The live indicator shows remaining unassigned amount
4. Click **Calculate & Settle** to see who owes whom

### Split by Items
1. Add participant names
2. Add items with prices and check which people share each item
3. Click **Calculate by Items** for a per-person breakdown and settlement

### Saving & History
- Click **💾 Save** after any calculation to store it
- Open history via the 🕐 icon in the header
- Clear all history with the trash button in the drawer

### Export
- **📄 Export PDF** — downloads a formatted PDF of the current result
- **📲 QR Share** — generates a scannable QR code with the split summary

## 🎯 Architecture Notes

- Split modes are independent tab sections; results are stored on `window._eqResult`, `window._uqResult`, `window._itResult` for export/save actions
- Settlement uses a greedy creditor/debtor matching algorithm to minimise the number of transactions
- Tip in custom split mode is distributed proportionally based on each person's share of the subtotal
- Tip in items split mode is distributed proportionally based on each person's item total
- Dark mode is applied via a `data-theme` attribute on `<html>` and toggled with a single `localStorage` flag

## 🤝 Contributing

Contributions are welcome. Fork the repository, make your changes, and open a pull request.