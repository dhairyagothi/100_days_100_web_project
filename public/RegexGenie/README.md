# 🧞 RegexGenie — Interactive AI Regex Builder & Visualizer

> A sleek, browser-based tool that lets you generate, test, and visually understand regular expressions — all without leaving your browser.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## ✨ Features

### 🗣️ Plain-English to Regex Generator
Type a natural description like *"Match email addresses"* or *"Extract phone numbers"* and get an optimized regex pattern instantly — powered by a comprehensive offline pattern dictionary with 30+ entries.

### 🔦 Live Match Highlighter
Paste sample text and watch matches light up in real-time as you type or adjust the regex. Alternating highlight colors make it easy to distinguish adjacent matches.

### 🧩 Interactive Syntax Breakdown
Every token in your regex (`\d`, `+`, `^`, `[a-z]`, etc.) is parsed and displayed with a human-readable label. Hover for details.

### 📖 Quick Reference Cheatsheet
A collapsible cheatsheet covering anchors, character classes, quantifiers, groups, flags, and escapes — always one click away.

### 📋 Copy & Clear
Copy the full regex (with flags) to your clipboard, or clear everything to start fresh.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic page structure |
| **Tailwind CSS** (CDN) | Utility-first responsive styling |
| **Vanilla CSS** | Glassmorphism effects, animations, custom components |
| **JavaScript (ES6+)** | Core logic — regex engine, tokenizer, highlighter |

**Zero dependencies. No build step. No API keys.**

---

## 🚀 How to Run

1. Clone or download this project folder.
2. Open `index.html` in any modern browser.
3. That's it! No server, no npm install needed.

```bash
# Or use a simple local server:
npx serve .
```

---

## 📁 Project Structure

```
RegexGenie/
├── index.html      # Main entry point with semantic HTML structure
├── style.css       # Custom styles (glassmorphism, animations, tokens)
├── script.js       # Core logic (pattern library, highlighter, tokenizer)
└── README.md       # This file
```

---

## 🎯 Supported Pattern Categories

The offline pattern dictionary recognizes these natural language prompts:

| Category | Example Prompts |
|---|---|
| Email | "email", "mail", "email address" |
| URL | "url", "link", "website", "http" |
| Phone | "phone", "mobile", "telephone" |
| IP Address | "ip", "ipv4", "ip address" |
| Hex Colors | "hex", "color code", "css color" |
| Dates | "date", "iso date", "yyyy-mm-dd" |
| Time | "time", "clock", "timestamp" |
| Numbers | "number", "integer", "decimal", "float" |
| Currency | "dollar", "money", "price" |
| Credit Card | "credit card", "visa", "mastercard" |
| SSN | "social security", "ssn" |
| HTML Tags | "html tag", "element", "markup" |
| UUID | "uuid", "guid" |
| MAC Address | "mac", "mac address" |
| ZIP Code | "zip", "postal code" |
| Hashtags | "hashtag", "twitter tag" |
| Mentions | "@", "mention", "username" |
| File Names | "file", "filename", "extension" |
| Passwords | "password", "strong password" |
| Domain Names | "domain", "domain name" |
| RGB Colors | "rgb", "rgb color" |
| And more… | Words, sentences, brackets, quotes, order numbers |

---

## 🧪 Testing Checklist

- [x] Loads without errors in Chrome, Firefox, Safari, Edge
- [x] Live highlighting updates as you type
- [x] All 30+ pattern prompts generate correct regex
- [x] Flag toggles (g, i, m, s) update matches instantly
- [x] Syntax breakdown renders all token types
- [x] Copy button works and shows confirmation
- [x] Clear button resets all fields
- [x] Mobile responsive layout
- [x] No console errors or warnings
- [x] Scroll sync between textarea and highlight overlay

---

## 🤝 Contributing

This project is part of **[100 Days 100 Web Projects](https://github.com/dhairyagothi/100_days_100_web_project)**.

To contribute:
1. Fork the repository
2. Create your branch (`git checkout -b fix/your-fix`)
3. Commit changes (`git commit -m "fix: description"`)
4. Push and open a Pull Request

---

## 📜 License

MIT License — see the root repository for details.

---

## 👤 Author

**Mahesh Kiran** — Open Source Contributor
