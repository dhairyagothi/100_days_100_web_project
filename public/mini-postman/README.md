# Mini Postman — API Testing Tool

A lightweight, browser-based API testing tool built with pure HTML, CSS, and Vanilla JavaScript — no frameworks, no build tools, no backend.

## Features

### Core
| Feature | Description |
|---|---|
| HTTP Methods | GET, POST, PUT, PATCH, DELETE |
| URL Bar | Smart input with environment variable substitution `{{VAR}}` and URL autocomplete |
| Request Headers | Dynamic add/remove key-value pairs |
| Request Body | JSON / Text body editor with live JSON validation |
| Response Viewer | Status code, response time, size, pretty-print / raw / tree views |
| Syntax Highlighting | Color-coded JSON in the response body |
| Response Copy | One-click copy to clipboard |

### Storage & Collections
| Feature | Description |
|---|---|
| Request History | Last 100 requests stored in LocalStorage |
| Collections | Group and save requests into named collections |
| Import / Export | Export all collections as JSON, import from file |
| Environment Variables | Create named environments with key-value vars, applied via `{{VAR}}` syntax |

### Advanced
| Feature | Description |
|---|---|
| Request Tabs | Multiple concurrent request tabs (Postman-style) |
| cURL Generation | Convert any request to a cURL command |
| cURL Import | Parse a pasted cURL command into a request |
| Collapsible JSON Tree | Interactive tree viewer for JSON responses |
| Response Search | Highlight matching text in response body |
| Auth Helpers | Bearer Token, Basic Auth, API Key auto-applied to headers |
| Theme Switcher | Dark / Light mode with persistence |
| Keyboard Shortcuts | Full keyboard control (see below) |
| Toast Notifications | Non-blocking success / error / info feedback |

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` | Send Request |
| `Ctrl+T` | New Tab |
| `Ctrl+W` | Close Tab |
| `Ctrl+L` | Focus URL input |
| `Ctrl+S` | Save to Collection |
| `Ctrl+Shift+F` | Format JSON Body |
| `Ctrl+D` | Duplicate Tab |
| `Ctrl+/` | Show Shortcuts |
| `Esc` | Close modal / search |

## Project Structure

```
mini-postman/
├── index.html          # App shell and all modals
├── css/
│   └── style.css       # All styles — glassmorphism dark theme
├── js/
│   ├── app.js          # Entry point: tabs, event wiring, send flow
│   ├── storage.js      # LocalStorage CRUD wrapper
│   ├── request.js      # Fetch wrapper, env var substitution, cURL utilities
│   ├── ui.js           # Response rendering, JSON highlighting, toast system
│   └── collections.js  # Sidebar rendering (history, collections, environments)
└── assets/             # Reserved for future icon assets
```

## Usage

Open `index.html` directly in a browser — no server required (note: browser CORS policies still apply to the requests you make).

### Environment Variables

1. Click **Environments** in the sidebar → ⚙ icon → **+ New**
2. Add variables like `BASE_URL = https://api.example.com`
3. Use `{{BASE_URL}}/users` in the URL bar — variables are resolved before sending

### Collections

1. Click **+** next to Collections → name your collection
2. Build a request, then click **Save** → choose collection
3. Click any saved request to load it into the current tab
4. **Export** to share a `.json` file; **Import** to load it back

## Tech Stack

- **HTML5** — Semantic markup, ARIA roles, accessible form controls
- **CSS3** — Custom properties, glassmorphism, CSS Grid/Flexbox, smooth animations
- **Vanilla JS (ES2020)** — Fetch API, LocalStorage, Clipboard API, IIFE modules

## License

MIT
