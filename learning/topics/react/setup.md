# React Setup

To build React applications on your computer, you need **Node.js** (which includes npm) and a project scaffold tool. This lesson walks through modern setup using **Vite**—the recommended fast dev server for new React projects.

---

## 1. Prerequisites

| Tool | Purpose |
| :--- | :--- |
| **Node.js** (LTS) | Runs JavaScript tooling and dev server |
| **npm** or **yarn** or **pnpm** | Installs packages |
| **Code editor** | VS Code with ES7+ React snippets is popular |

Verify installation in your terminal:

```bash
node --version
npm --version
```

You should see version numbers (e.g. `v20.x.x`).

---

## 2. Create a React Project with Vite

Vite provides instant hot reload and a lean development experience.

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### Project structure (initial)

```
my-react-app/
├── public/
├── src/
│   ├── App.jsx          # Root component
│   ├── main.jsx         # Entry point — mounts React to #root
│   └── index.css
├── index.html           # Single HTML shell
├── package.json
└── vite.config.js
```

---

## 3. Entry Point Explained

**index.html** contains a single mount point:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

**main.jsx** connects React to the DOM:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

<div class="vector-flowchart">
  <svg viewBox="0 0 580 120" width="100%">
    <rect x="20" y="35" width="120" height="50" rx="6" class="svg-node" />
    <text x="80" y="65" text-anchor="middle" class="svg-text">index.html</text>

    <path d="M 140 60 L 170 60" class="svg-line" />
    <polygon points="170,60 164,56 164,64" class="svg-marker" />

    <rect x="170" y="35" width="120" height="50" rx="6" class="svg-node" />
    <text x="230" y="65" text-anchor="middle" class="svg-text">main.jsx</text>

    <path d="M 290 60 L 320 60" class="svg-line" />
    <polygon points="320,60 314,56 314,64" class="svg-marker" />

    <rect x="320" y="35" width="120" height="50" rx="6" class="svg-node" />
    <text x="380" y="65" text-anchor="middle" class="svg-text">App.jsx</text>

    <path d="M 440 60 L 470 60" class="svg-line" />
    <polygon points="470,60 464,56 464,64" class="svg-marker" />

    <rect x="470" y="35" width="90" height="50" rx="6" class="svg-node" style="stroke: #10b981;" />
    <text x="515" y="65" text-anchor="middle" class="svg-text" style="font-size: 9px;">Browser UI</text>
  </svg>
</div>

---

## 4. Alternative: Online Playgrounds

No install required for quick experiments:

- [CodeSandbox](https://codesandbox.io)
- [StackBlitz](https://stackblitz.com)
- [React official Try React](https://react.dev)

> [!TIP]
> **Pro Tip**: Use online playgrounds to practice JSX and components before setting up Node locally.

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Use the LTS version of Node.js for stability.</li>
      <li>Prefer Vite for new projects (faster than older Create React App defaults).</li>
      <li>Commit <code>package-lock.json</code> so teammates get the same dependency versions.</li>
      <li>Add <code>node_modules/</code> to <code>.gitignore</code>.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Opening <code>index.html</code> directly in the browser without the dev server (JSX will not work).</li>
      <li>Running commands outside the project folder after <code>cd</code>.</li>
      <li>Mixing incompatible React and React DOM versions.</li>
    </ul>
  </div>
</div>

> [!WARNING]
> Always run <code>npm run dev</code> (or your framework's dev command) when developing—do not double-click HTML files for React apps.

---

## 6. Coding Exercise: Customize App.jsx

### Task:

After creating a Vite React app, change `App.jsx` to display your name in an `<h1>` and a short paragraph below it.

##### Solution

```jsx
function App() {
  return (
    <div>
      <h1>Hello, Alex!</h1>
      <p>My first React app is running with Vite.</p>
    </div>
  );
}

export default App;
```

---

## Interview Tips

- **"How do you create a React app?"** — Typically `npm create vite@latest` with the React template, or frameworks like Next.js for production apps.
- **"What is Vite?"** — A build tool and dev server using native ES modules for fast HMR.
- **"What does createRoot do?"** — Creates a React 18 root and renders your component tree into a DOM node.

---

## Key Takeaways

- Install **Node.js LTS** and use **Vite** to scaffold projects.
- **main.jsx** mounts **App** into `#root`.
- Use the **dev server** (`npm run dev`), not raw file opening.
- Online playgrounds are great for learning without setup.
