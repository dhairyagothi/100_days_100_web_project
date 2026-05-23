# 🚀 Gemini Chat — 5-Minute Setup Guide

## Step-by-Step Installation

### **STEP 1: Get Free API Key (2 minutes)**

```
1. Open: https://aistudio.google.com/app/apikey
2. Look for "Create API Key" button (blue)
3. Click it
4. Google will generate a key like: AIzaSyD...
5. Copy the entire key to clipboard
   └─ Don't share this with anyone!
```

---

### **STEP 2: Download Files (1 minute)**

You need **exactly 3 files**:

```
chatbot/
├── chatbot.html      ← Main file (open this)
├── style.css         ← Styling (must be here)
└── script.js         ← Logic (must be here)
```

✅ All 3 files MUST be in the same folder  
❌ Don't rename them  
✅ Keep the exact names

---

### **STEP 3: Open & Paste Key (2 minutes)**

```
1. Double-click on "chatbot.html"
   └─ Opens in your default browser

2. A modal popup appears with API key field

3. Paste your key (Ctrl+V or Cmd+V)

4. Click "Save & Start Chatting"

5. Start asking Gemini questions!
```

---

## ✨ What You Get

```
┌─────────────────────────────────────────┐
│  ☰  Gemini Chat          ☀️ ⚙️         │  ← Header
├─────────────────────────────────────────┤
│SIDEBAR  │  Chat messages appear here     │
│────────┐ Messages show up with avatars  │
│📁New   │ Gemini replies with formatting │
│Chat    │ Copy buttons on hover          │
│        │                                 │
│Recent  │ ✨ Smooth animations           │
│────────┤ 📱 Works on mobile             │
│✏️Chat1  │ 🌙 Dark mode included        │
│✏️Chat2  │                                │
│✏️Chat3  │ Input at bottom:               │
│        │ [📎] [Type message...] [➤]    │
│────────┤                                 │
│⚙️Key   │                                 │
│🗑️Clear │                                 │
└─────────────────────────────────────────┘
```

---

## 📱 What Works

| Feature | Status |
|---------|--------|
| Chat with Gemini | ✅ Works |
| Send images | ✅ Works |
| Copy responses | ✅ Works |
| Dark/Light mode | ✅ Works |
| Save chat history | ✅ Works |
| Rename chats | ✅ Works (hover & pencil) |
| Delete chats | ✅ Works (hover & trash) |
| Mobile responsive | ✅ Works |
| Works offline | ❌ Needs internet for API |

---

## ⌨️ Quick Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line in input |
| `Escape` | Close sidebar (mobile) |
| `☀️` icon | Toggle dark/light |

---

## 🔒 Privacy & Storage

```
Your Data:
├── API Key      → Stored only in YOUR browser
├── Chat History → Stored only in YOUR browser
└── Messages     → Never sent to any server except Gemini

Clearing Data:
├── Click "Clear All History" → Wipes everything
├── Or delete browser cookies → Resets everything
└── API key in modal → Can be changed anytime
```

---

## ❌ Common Issues & Fixes

### **Issue 1: "Invalid API Key" error**

```
❌ Wrong:  AIza (incomplete)
✅ Right:  AIzaSyDxxxxxx... (full 40+ chars)

Fix: Get a fresh key from aistudio.google.com
```

### **Issue 2: "High demand" error**

```
This means: Gemini API is busy
Solution: Wait 2-5 minutes, try again
It's temporary, not your fault
```

### **Issue 3: Chats not saving**

```
Check: Browser storage is enabled
  Chrome/Firefox: Settings → Privacy → Site data ✅
  Clear browser cache and refresh
  Try in different browser
```

### **Issue 4: Image won't upload**

```
Rules:
  ✅ Only JPEG, PNG
  ✅ Under 5 MB
  ❌ Animated GIFs don't work
  ❌ SVGs don't work
```

### **Issue 5: Dark mode looks broken**

```
Fix: Clear cache + refresh page
  Ctrl+Shift+R (full refresh)
  Or Cmd+Shift+R on Mac
```

---

## 🎨 Customize (Optional)

### Change the accent color:
Open `style.css`, find line ~8:
```css
--accent: #e8673a;  /* Change orange to your color */
```

### Change the model:
Open `script.js`, find line ~4:
```javascript
const API_URL = "...gemini-2.5-flash...";
// Try: gemini-2-pro, gemini-1.5-pro, etc.
```

---

## 📚 Need Help?

| Question | Answer |
|----------|--------|
| "Where's my API key?" | Check email from Google AI Studio, or regenerate at aistudio.google.com |
| "Can I use this offline?" | No, needs internet for Gemini API |
| "Is my data safe?" | Yes, only stored locally in your browser |
| "Can I export chats?" | Copy from sidebar or use browser DevTools |
| "Can I use this on mobile?" | Yes! It's fully responsive |
| "Can multiple people use this?" | Yes, each device stores its own history |

---

## ✅ You're All Set!

```
✓ Files downloaded
✓ API key obtained
✓ chatbot.html opened
✓ Key pasted
✓ Ready to chat!

🎉 Start asking Gemini anything!
```

---

**Last updated:** May 2026  
**Version:** 2.0 (Modern UI with rename/delete)