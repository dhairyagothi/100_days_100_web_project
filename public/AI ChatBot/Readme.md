# Lumix Chat — AI Chat Interface

A sleek, privacy-first AI chatbot powered by Google Gemini with dark mode, multi-session history, voice I/O, AI image generation, pinned messages, chat export, and more — running 100% in your browser.

---

## 🚀 Quick Start

### Step 1: Get Your Gemini API Key

1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Click **"Create API Key"**
3. Copy the key (starts with `AIza...`)

### Step 2: (Optional) Get a Hugging Face Key

1. Go to **[huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)**
2. Click **"New token"** → Read access is enough
3. Copy the token (starts with `hf_...`)
4. Required only for `/imagine` image generation

### Step 3: Open the App

1. Download the 3 files: `index.html`, `style.css`, `script.js`
2. Place them in the **same folder**
3. **Double-click `index.html`** to open in your browser

### Step 4: Enter Your Keys

1. The onboarding wizard will guide you through 4 steps
2. Paste your Gemini key on Step 3
3. Paste your HF key on Step 4 (or skip)
4. Click **"Start Chatting"**

---

## ✨ Features

### Chat

- **Multi-session** — maintain multiple independent conversations
- **Auto-titling** — chats are named from your first message
- **Rename & delete** — hover any chat in the sidebar
- **Markdown rendering** — formatted code, lists, tables, headings
- **Copy buttons** — per code block + full response copy
- **Typing indicator** — animated dots while Lumix is thinking

### AI Image Generation

- Use `/imagine <prompt>` to generate images via FLUX.1-schnell
- Images can be downloaded directly from chat
- Requires a Hugging Face API key

### Voice

- **Voice input** — click 🎤 and speak your message (Chrome/Edge)
- **Read aloud** — click "Read" on any AI response
- **Auto-speak** — toggle in Settings to read every reply automatically
- **Voice selection** — choose language and voice in Settings

### Pinned Messages

- Pin any AI message with the "Pin" button
- A banner appears at the top of chat showing the pin count
- Click "View" to filter only pinned messages

### Search & Export

- **Ctrl+K** — search across all chat sessions instantly
- **Export** — download current chat as TXT, Markdown, JSON, or HTML

### UI

- **Dark / Light / System** theme — saved automatically
- **Responsive** — works on mobile, tablet, and desktop
- **Collapsible sidebar** — compact icon rail on desktop
- **Suggestion chips** — quick-start prompts on new chats

---

## 📖 How to Use

### Sending Messages

1. Type in the message box at the bottom
2. Optionally attach an image with the 📎 icon
3. Press `Enter` or click the send button

### Image Generation

```
/imagine a neon-lit cyberpunk alley at night
/imagine a watercolor painting of Mount Fuji
```

### Managing Chats

| Action   | How                           |
| -------- | ----------------------------- |
| New chat | Click "+ New Chat" in sidebar |
| Rename   | Hover chat → click ✏️         |
| Delete   | Hover chat → click 🗑️         |
| Search   | Ctrl+K or click 🔍 in sidebar |
| Export   | Click export icon in header   |

### Settings

Click the model pill in the header or ⚙️ to open Settings:

- Gemini & Hugging Face API keys
- Active model (Gemini 2.5 Flash / Pro, 2.0 Flash)
- System prompt (custom AI personality)
- Auto-speak & voice selection
- Theme

---

## ⌨️ Keyboard Shortcuts

| Shortcut        | Action           |
| --------------- | ---------------- |
| `Enter`         | Send message     |
| `Shift + Enter` | New line         |
| `Ctrl + K`      | Search all chats |
| `Escape`        | Close modal      |

---

## 🔧 Customization

**Accent color** — `style.css`:

```css
--accent: #7f77dd;
```

**Default model** — `script.js`:

```javascript
const savedModel = localStorage.getItem(STORAGE.MODEL) || "gemini-2.5-flash";
```

**AI personality** — Settings → System Prompt field

---

## ⚠️ Troubleshooting

| Issue                       | Fix                                                                  |
| --------------------------- | -------------------------------------------------------------------- |
| Invalid API Key             | Ensure key starts with `AIza` and is complete (40+ chars)            |
| Image gen "Failed to fetch" | `router.huggingface.co` blocked — change DNS to `8.8.8.8` or use VPN |
| Image gen 404 / deprecated  | Update model URL in `script.js` to latest FLUX endpoint              |
| Voice not working           | Chrome/Edge only — grant microphone permission                       |
| Chats not saving            | Enable browser site storage; try Ctrl+Shift+R                        |
| Image upload fails          | JPEG/PNG only, max ~5MB                                              |

---

## 🔒 Privacy

- API keys stored **only in your browser** (localStorage)
- Chat history stored **only in your browser**
- Messages sent **only to Google Gemini / Hugging Face** — no other servers
- No accounts, no tracking, no backend

---

## 📋 Requirements

- Modern browser (Chrome or Edge recommended for voice features)
- Internet connection (for Gemini and Hugging Face APIs)
- Free Google AI Studio account

---

## 📝 License

Free to use and modify. Built with HTML5, CSS3, and vanilla JavaScript.

---

**Version:** 3.0 | **Last updated:** May 2026
