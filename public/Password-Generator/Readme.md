# 🔐 Password Generator & Saver

A sleek, browser-based password generator and saver with zero dependencies.

## ✨ Features

- ⚡ Generate cryptographically random passwords (uses `crypto.getRandomValues`)
- 📏 Adjustable length: 8–32 characters
- 🔠 Toggle uppercase, lowercase, numbers, and special symbols
- 🟢 Real-time strength indicator: **Weak / Medium / Strong**
- 📋 Copy to clipboard with one click
- 💾 Save passwords with a custom label (e.g. "Gmail", "Netflix")
- 🔍 Search through saved passwords
- 🗑️ Delete individual entries or clear all at once
- 👁️ Passwords blur by default — hover to reveal
- 💻 All data stored in `localStorage` (no backend, no network)
- ⚠️ Shared-device warning banner

## ⌨️ Keyboard Shortcut

`Ctrl + Enter` (or `Cmd + Enter`) → Generate new password

## 🛠️ Tech Stack

- HTML5
- CSS3 (custom properties, animations, CSS grid/flex)
- Vanilla JavaScript (ES6+, Web Crypto API)
- Google Fonts: JetBrains Mono + Syne

## 📂 File Structure

```
public/PasswordGenerator/
├── index.html   # App structure & markup
├── style.css    # Full styling (dark terminal theme)
├── script.js    # All logic: generation, storage, UI
└── README.md    # This file
```

## ⚠️ Security Note

Passwords are saved in browser `localStorage` and are **not encrypted**. This tool is intended for personal, single-device use. Do not use on shared, public, or untrusted devices.