# AI-Assisted Smart Notes App

A modern, responsive notes application built with HTML, CSS, and vanilla JavaScript, enhanced with **Sarvam AI** capabilities for grammar correction and intelligent formatting.

## Features

- 📝 **Full Notes Management**: Create, edit, archive, restore, and permanently delete notes.
- 🏷️ **Tags & Search**: Organize notes with categories/tags and search dynamically by title, body, or tags.
- 🎨 **Visual Options**: Customize note card colors (Teal, Violet, Amber, Rose) and star notes as favorites.
- 🌓 **Theme Toggle**: Light and dark themes with persistent preference storage.
- 📤 **Backup**: Export and import notes as JSON backups.
- ⌨️ **Keyboard Shortcuts**: `Ctrl/Cmd + N` (New note), `Ctrl/Cmd + F` (Focus search), `Esc` (Close editor).
- ✨ **AI Fix Grammar & Format**: A combined AI helper that instantly resolves typos, spelling, capitalization, and grammatical mistakes while formatting your notes into structured Markdown (with proper headings, bullet lists, and paragraphs) in one click.

---

## How to Get a Sarvam AI API Key

To use the AI features, you need a subscription key from Sarvam AI:
1. Register/Login at the **[Sarvam AI Dashboard](https://dashboard.sarvam.ai/)**.
2. Go to the **API Keys** section and generate a new key.
3. Every new account receives free credits to test and explore the Indic-optimized models.

---

## How to Run

You can run the app in two different ways depending on your needs:

### 1. Browser-Only Mode (No Server Setup)
1. Open `public/notes-app/index.html` directly in your browser.
2. Open the note editor, click the **🔑 API Key** button in the AI toolbar, and paste your Sarvam key.
3. Your key is stored securely in your browser's local storage (`localStorage`) and calls the Sarvam API directly.

### 2. Secure Backend Proxy Mode (Recommended for Deployment)
To keep your API key secure on the backend:
1. In the `public/notes-app` directory, create a `.env` file:
   ```env
   SARVAM_API_KEY=your_sarvam_subscription_key_here
   PORT=3000
   NODE_ENV=development
   ```
2. Install dependencies:
   ```bash
   cd public/notes-app
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Access the app at `http://localhost:3000/notes-app/index.html`.

---

## API Endpoints (Backend)

### Health Check
```http
GET http://localhost:3000/api/health
```

### Process Text with AI
```http
POST http://localhost:3000/api/ai-process
Content-Type: application/json

{
  "action": "enhance",
  "text": "your unformatted text here..."
}
```

---

## License

MIT License. Developed for GSSoC '26.
