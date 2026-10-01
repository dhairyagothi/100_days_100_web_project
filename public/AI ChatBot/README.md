# Lumix Chat — AI Chat Interface

A sleek, privacy-first AI chatbot powered by Google Gemini with dark mode, multi-session history, voice I/O, AI image generation, pinned messages, chat export, and more — running 100% in your browser.

---

## 🚀 Quick Start

### Step 1: Enable the Gemini / Generative Language API

1. Open **Google Cloud Console** and select your project.
2. Go to **APIs & services → Library**.
3. Search for **Generative Language API** or **Gemini API**.
4. Click the API and press **Enable**.

### Step 2: Create a Gemini API key

1. Go to **APIs & services → Credentials**.
2. Click **+ Create Credentials → API Key**.
3. Enter a name like `lumix-chatbot-key`.
4. Check **Authenticate API calls through a service account**.
5. Select or create a service account.
6. Under **Select API restrictions**, choose **Gemini API** / **Generative Language API**.
7. Leave **Application restrictions** set to **None** for now.
8. Click **Create** and copy the generated key.

> If the Gemini API option is greyed out, make sure the Generative Language API is enabled in your current project and the service account is selected.

### Step 3: Create a Hugging Face key (optional)

1. Go to **[huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)**.
2. Click **New token** and grant **Read** access.
3. Copy the token (starts with `hf_...`).
4. This key is only required for `/imagine` image generation.

### Step 4: Open the App

1. Open `public/AI ChatBot/chatbot.html` in your browser.
2. If you run the repo locally, use Live Server or open the file directly.

### Step 5: Enter Your Keys

1. Open the chatbot settings using the gear icon.
2. Paste your Gemini key into the Gemini key field.
3. Paste your Hugging Face key if you want image generation.
4. Save the settings and start chatting.

### Optional: Use a local default Gemini API key

If you want to keep a key locally without committing it to git, create `public/AI ChatBot/default-config.js` with:

```js
window.DEFAULT_GEMINI_API_KEY = "YOUR_GEMINI_KEY_HERE";
```

That file is already gitignored.

### Hosted deployment key

If you deploy to Vercel, set the environment variable `GEMINI_API_KEY` in Vercel project settings. The hosted app will use that key when no local browser key is configured.

For local development with the proxy, create a `.env.local` file with:

```bash
GEMINI_API_KEY=your_real_gemini_key_here
```

If a local browser key or `default-config.js` key exists, those will be used first.

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
- Free Google AI Studio account (required for Gemini API access)

---

## 📝 License

Free to use and modify. Built with HTML5, CSS3, and vanilla JavaScript.

---

**Version:** 3.0 | **Last updated:** May 2026
