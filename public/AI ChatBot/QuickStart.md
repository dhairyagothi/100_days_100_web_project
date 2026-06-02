# 🚀 Lumix Chat — 5-Minute Setup Guide

## Step-by-Step Installation

### **STEP 1: Get Your Gemini API Key (2 minutes)**

```
1. Open: https://aistudio.google.com/app/apikey
2. Click "Create API Key" (blue button)
3. Sign in with Google if prompted
4. Copy the key — it looks like: AIzaSyD...
   └─ Don't share this with anyone!
```

---

### **STEP 2: (Optional) Get a Hugging Face Key for Image Generation**

```
1. Open: https://huggingface.co/settings/tokens
2. Click "New token" → select Read access
3. Copy the token — it looks like: hf_...
   └─ Only needed for /imagine image generation
```

---

### **STEP 3: Download Files (1 minute)**

You need **exactly 3 files** in the same folder:

```
lumix/
├── index.html    ← Open this in your browser
├── style.css     ← Styling (must be present)
└── script.js     ← Logic (must be present)
```

✅ All 3 files MUST be in the same folder  
❌ Do not rename them

---

### **STEP 4: Open & Enter Your Keys (2 minutes)**

```
1. Double-click "index.html"
   └─ Opens in your default browser

2. The onboarding wizard appears (4 steps)

3. Follow the steps:
   Step 1 → Welcome screen
   Step 2 → Guide to get Gemini key
   Step 3 → Paste your Gemini key (AIza...)
   Step 4 → Optionally paste your HF key (hf_...)

4. Click "Start Chatting"

5. Done! Start asking Lumix anything.
```

---

## 📱 What Works

| Feature                          | Status              |
| -------------------------------- | ------------------- |
| Chat with Gemini                 | ✅                  |
| Send & analyze images            | ✅                  |
| AI image generation (`/imagine`) | ✅ Needs HF key     |
| Voice input (speech-to-text)     | ✅ Chrome/Edge only |
| Read aloud (text-to-speech)      | ✅                  |
| Dark / Light / System theme      | ✅                  |
| Save chat history                | ✅                  |
| Rename & delete chats            | ✅                  |
| Pin important messages           | ✅                  |
| Search across all chats          | ✅ Ctrl+K           |
| Export chats (TXT/MD/JSON/HTML)  | ✅                  |
| Custom system prompt             | ✅                  |
| Switch Gemini models             | ✅                  |
| Mobile responsive                | ✅                  |
| Works offline                    | ❌ Needs internet   |

---

## ⌨️ Keyboard Shortcuts

| Shortcut        | Action               |
| --------------- | -------------------- |
| `Enter`         | Send message         |
| `Shift + Enter` | New line in input    |
| `Ctrl + K`      | Search all chats     |
| `Escape`        | Close any open modal |

---

## 🎨 Image Generation

Type `/imagine` followed by your prompt:

```
/imagine a futuristic city at sunset, digital art
/imagine a cute corgi astronaut in space
```

Requires a Hugging Face API key in Settings.

---

## 🔒 Privacy & Storage

```
Your Data:
├── API Keys     → Stored only in YOUR browser (localStorage)
├── Chat History → Stored only in YOUR browser (localStorage)
└── Messages     → Sent only to Google / Hugging Face APIs

Clearing Data:
├── "Clear All History" → Wipes all chat sessions
├── Delete browser site data → Resets everything
└── Keys can be updated anytime in ⚙️ Settings
```

---

## ❌ Common Issues & Fixes

### **"Invalid API Key"**

```
Make sure the key is complete (40+ chars, starts with AIza)
Get a fresh key: aistudio.google.com/app/apikey
```

### **Image generation "Failed to fetch" or ERR_NAME_NOT_RESOLVED**

```
router.huggingface.co is blocked on your network/ISP.
Fix: Change DNS to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare)
  or use a VPN.
```

### **Image generation 404 / "Model deprecated"**

```
The HF model endpoint may have changed.
Current URL in script.js should point to:
router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell
```

### **Voice input not working**

```
Only supported in Chrome and Edge.
Grant microphone permission when prompted.
```

### **Chats not saving**

```
Enable browser storage:
Chrome: Settings → Privacy → Site data → On
Then do a full refresh: Ctrl+Shift+R
```

### **Image upload not working**

```
Supported: JPEG, PNG only — max ~5 MB
Not supported: GIFs, SVGs, HEIC
```

---

## 🎨 Customization

**Change the accent color** — edit `style.css`:

```css
--accent: #7f77dd; /* change to any hex color */
```

**Change the default model** — open ⚙️ Settings in the app,
or edit `script.js`:

```javascript
const savedModel = localStorage.getItem(STORAGE.MODEL) || "gemini-2.5-flash";
```

**Set a permanent AI personality** — open Settings → System Prompt.

---

## ✅ You're All Set!

```
✓ Files in same folder
✓ index.html opened in browser
✓ Gemini API key entered
✓ (Optional) Hugging Face key entered
✓ Ready to chat!

🎉 Try: "Explain black holes simply"
🎨 Try: "/imagine a dragon made of clouds"
🎤 Try: Click the mic and speak your message
```

---

**Version:** 3.0 | **Last updated:** May 2026
