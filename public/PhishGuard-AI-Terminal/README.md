# 🛡️ PhishGuard AI Terminal

A cyber-themed URL analysis tool that detects potentially suspicious or phishing-like links using rule-based logic. It features a hacker-style terminal UI with an animated Matrix background and AI-style explanations for detected threats.
---

## 📖 Overview

**PhishGuard AI Terminal** simulates an AI-powered cybersecurity scanner right in your browser. Paste any URL, and the tool runs it through a rule-based threat detection engine — complete with a live scanning animation, terminal-style logs, and an AI-style breakdown of *why* a link was flagged.

---

## 🚀 Features

- 🔍 URL safety analysis using rule-based scoring
- 📊 Threat score calculation system
- 🤖 AI-style explanation of detected risks
- 📈 Confidence percentage display
- 💻 Real-time terminal log simulation
- 🟩 Matrix-style animated background
- 🖥️ Hacker terminal UI design

---

## 🧪 How It Works

The system analyzes a given URL based on common phishing indicators:

| Pattern | Risk Signal |
|---|---|
| Suspicious keywords (`login`, `verify`, `bank`) | Medium |
| Special characters like `@` in URL | High |
| Use of `HTTP` instead of `HTTPS` | Medium |
| Multiple subdomains | Medium |
| Hyphenated domain patterns | Low–Medium |

Each detected pattern increases a **threat score**, which determines the final verdict:

| Result | Meaning |
|---|---|
| 🟢 Safe Signal | No/minimal suspicious patterns found |
| 🟡 Suspicious Activity | Some risk indicators detected |
| 🔴 Threat Detected | Multiple strong risk indicators found |

---

## 🛠️ Tech Stack

- **HTML5** — structure
- **CSS3** — styling & terminal theme
- **JavaScript (Vanilla)** — scoring logic & interactivity
- **Canvas API** — Matrix rain animation

---

## 📁 Project Structure

```
PhishGuard-AI-Terminal/
├── index.html
├── style.css
└── script.js
```

---

## ⚙️ Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/sapnajha757/PhishGuard-AI-Terminal.git
   ```
2. Open `index.html` in your browser — no build step, no dependencies.
3. Paste a URL into the terminal input and watch the scan run.

---

## 🎮 UI Components

- Matrix digital rain background
- Terminal-style input interface
- Threat score display panel
- AI explanation panel
- Confidence percentage display
- Live scanning logs

---

## 🤝 Contribution

Contributions are welcome! This project can be extended by:
- Improving the UI/UX
- Adding new detection rules
- Refining the scoring algorithm
- Adding real API-based threat intelligence

Feel free to fork the repo, make changes, and submit a pull request.

---

## ⚠️ Disclaimer

This tool is built for **educational purposes only** and does **not** guarantee accurate phishing detection. Please do not rely on it as a real-world security solution.

---

## 👩‍💻 Author

**Sanyogita Singh** — *App Development & Documentation*

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub — it really helps!