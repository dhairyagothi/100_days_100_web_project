# ⬡ VisionLocal — AI Image Predictor

A privacy-first, local AI image analysis tool powered by [Ollama](https://ollama.com) and the [Moondream](https://ollama.com/library/moondream) vision model. No cloud uploads. No API keys. Everything runs on your own machine.

![VisionLocal UI](https://i.imgur.com/placeholder.png)

---

## ✨ Features

- 🤖 **Local AI inference** — uses Ollama + Moondream entirely on-device
- 🔒 **100% private** — images never leave your machine
- 🖼️ **Drag & drop upload** — or click to browse
- 📐 **Auto-resize** — images are capped at 1024px before analysis
- 🏷️ **Keyword tags** — auto-extracted from the AI description
- 🌐 **Zero build step** — plain HTML, CSS, and JS; no framework needed
- 🎨 **Animated neural background** — canvas-based particle network

---

## 📁 File Structure

```
visionlocal/
├── index.html      # App markup and layout
├── styles.css      # All visual styles
├── script.js       # App logic + neural canvas animation
└── README.md       # This file
```

---

## 🚀 Getting Started

### 1. Install Ollama

Download and install Ollama from [https://ollama.com/download](https://ollama.com/download)

### 2. Pull the Moondream model

```bash
ollama pull moondream
```

### 3. Start Ollama with CORS enabled

```bash
# macOS / Linux
OLLAMA_ORIGINS="*" ollama serve

# Windows (Command Prompt)
set OLLAMA_ORIGINS=*
ollama serve
```

> ⚠️ The `OLLAMA_ORIGINS=*` flag is required so the browser can talk to Ollama's local API.

### 4. Serve the app locally

Browsers block `fetch()` to `localhost` when a page is opened as a `file://` URL. You must serve the files over HTTP.

**Python (no install needed):**
```bash
cd /path/to/visionlocal
python3 -m http.server 8080
```

**Node / npx:**
```bash
npx serve .
```

**VS Code:**
Install the **Live Server** extension → right-click `index.html` → *Open with Live Server*

### 5. Open in your browser

```
http://localhost:8080
```

---

## 🖥️ Usage

1. **Drop or click** to upload an image (JPEG, PNG, WebP, etc.)
2. Enter your **Ollama endpoint** (default: `http://localhost:11434`)
3. Click **✦ Analyze Image**
4. The AI description and keyword tags appear in the **AI Output** panel
5. Click **Reset** to analyze another image

---

## ⚙️ Configuration

| Setting | Default | Description |
|---|---|---|
| Ollama URL | `http://localhost:11434` | Your Ollama server address |
| Model | `moondream` | Vision model used for inference |
| Max image size | `1024px` | Images are auto-resized before sending |
| JPEG quality | `0.75` | Compression applied after resize |

To use a different vision model (e.g. `llava`), change line in `script.js`:

```js
model: "moondream",   // ← change this to "llava" or any Ollama vision model
```

---

## 🔧 Troubleshooting

**`Failed to fetch`**
- Make sure Ollama is running: `ollama serve`
- Make sure you started Ollama with `OLLAMA_ORIGINS="*"`
- Make sure you're opening the app via `http://localhost:8080`, **not** `file://`

**`Server returned 404`**
- The model isn't pulled yet. Run: `ollama pull moondream`

**Blank / broken layout**
- The two-column layout requires a screen wider than 960px. Below that it stacks vertically by design. Edit the media query in `styles.css` to change the breakpoint.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styles | CSS3 (custom properties, grid, animations) |
| Logic | Vanilla JavaScript (ES2020+) |
| AI runtime | [Ollama](https://ollama.com) |
| Vision model | [Moondream](https://ollama.com/library/moondream) |
| Fonts | Syne + DM Mono (Google Fonts) |

---

## 📄 License

MIT — free to use, modify, and distribute.
