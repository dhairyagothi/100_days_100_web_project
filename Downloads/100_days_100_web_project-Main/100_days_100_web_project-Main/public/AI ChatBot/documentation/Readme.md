# Gemini AI Chat — Modern Chatbot Interface

A sleek, production-ready AI chatbot powered by Google Gemini 2.5 Flash with dark mode, chat history, and image support.

---

## 🚀 Quick Start

### Step 1: Get Your API Key
1. Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Click **"Create API Key"**
3. Copy the key (starts with `AIza...`)

### Step 2: Open the App
1. Download the 3 files:
   - `chatbot.html`
   - `style.css`
   - `script.js`
2. Place them in the same folder
3. **Double-click `chatbot.html`** to open in your browser

### Step 3: Paste Your API Key
1. In the modal that appears, paste your key into the field
2. Click **"Save & Start Chatting"**
3. Done! Start messaging Gemini

---

## ✨ Features

### Chat Management
- **💬 Multi-Session** — Start multiple independent chats
- **✏️ Rename Chats** — Hover over a chat in sidebar, click pencil to rename
- **🗑️ Delete Chats** — Hover and click trash to delete individual chats
- **📜 Chat History** — All conversations saved locally (browser storage)
- **🆕 New Chat Button** — Start fresh anytime

### AI Capabilities
- **🖼️ Image Support** — Attach and analyze images
- **📝 Markdown Rendering** — Formatted code, lists, headings
- **⚡ Typing Indicator** — Animated dots while waiting for response
- **📋 Copy Buttons** — Per-code block + full response copy

### UI/UX
- **🌙 Dark/Light Mode** — Toggle in header, saved automatically
- **📱 Responsive Design** — Works on mobile, tablet, desktop
- **⌨️ Keyboard Shortcuts**:
  - `Enter` → Send message
  - `Shift + Enter` → New line
  - `Shift + Click` → Sidebar toggle
- **✨ Smooth Animations** — Fade-ins, slide transitions
- **💡 Suggestion Chips** — Quick prompts on empty chat

### Data & Privacy
- **🔒 Local Storage Only** — API key never leaves your browser
- **🛡️ No Backend** — Runs 100% client-side
- **🔐 Delete Anytime** — Clear all history with one click

---

## 📖 How to Use

### Sending Messages
1. Type in the message box
2. Optionally attach an image (📎 icon)
3. Press `Enter` or click send button (➤)

### Managing Chats
| Action | How |
|--------|-----|
| **Rename** | Hover on chat → click ✏️ icon → enter new name |
| **Delete** | Hover on chat → click 🗑️ icon → confirm |
| **Switch** | Click any chat in sidebar to load it |
| **New** | Click "New Chat" button at top |

### Changing API Key
- Click the ⚙️ **"Change API Key"** button in sidebar footer
- Or log out and refresh the page

### Dark Mode
- Click ☀️/🌙 icon in top-right corner
- Your preference saves automatically

---

## 🔧 Advanced

### Increase Chat Limit
Edit `script.js`, line 7:
```javascript
const MAX_SESSIONS = 50; // Change this number
```

### Customize Colors
Edit `style.css`, lines 6-9:
```css
--accent: #e8673a;    /* Orange button */
--text-primary: #1a1916;  /* Dark text */
```

### Change Model
Edit `script.js`, line 4:
```javascript
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2-pro:generateContent";
// Or: gemini-2-flash, gemini-1.5-pro, etc.
```

---

## ⚠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| **"Error: Invalid API Key"** | Check key format (starts with `AIza`) |
| **"High demand" error** | Gemini is busy, try again in 5 mins |
| **Chats not saving** | Check browser storage is enabled |
| **Image not uploading** | Only JPEG/PNG, max 5MB |
| **Dark mode not working** | Clear browser cache & refresh |

---

## 📋 Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Gemini API)
- Free Google AI Studio account

---

## 💡 Tips

✅ Use **Shift+Click** on chat to quickly delete without confirm  
✅ Copy code blocks individually with per-block "Copy" button  
✅ Type **longer prompts** for better AI responses  
✅ **Attach images** for visual analysis or OCR  
✅ Use **dark mode** at night to save eye strain  

---

## 📝 License

Free to use. Modify as needed. Built with HTML5, CSS3, JavaScript.

---

**Questions?** Check your API key first. Most issues are API-related.