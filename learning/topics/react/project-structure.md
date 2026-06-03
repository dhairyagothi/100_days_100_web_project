# React Project Structure

As React apps grow, **folder organization** keeps code maintainable. This lesson covers common patterns used in Vite and production codebases.

---

## 1. Typical Vite React Layout

```
src/
├── main.jsx              # Entry — mounts App to DOM
├── App.jsx               # Root component
├── App.css
├── index.css             # Global styles
├── assets/               # Images, fonts
├── components/           # Reusable UI pieces
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── Button.css
│   └── Navbar/
├── pages/                # Route-level views (if using router)
├── hooks/                # Custom hooks (useAuth.js, etc.)
├── context/              # React Context providers
├── services/             # API calls (api.js)
└── utils/                # Pure helper functions
```

---

## 2. Organizing by Feature vs Type

### By type (good for small/medium apps)

```
components/
hooks/
services/
```

### By feature (good for large apps)

```
features/
  auth/
    LoginForm.jsx
    useAuth.js
    authApi.js
  todos/
    TodoList.jsx
    todoSlice.js
```

Choose one style and stay consistent across the team.

<div class="vector-flowchart">
  <svg viewBox="0 0 580 120" width="100%">
    <rect x="220" y="10" width="140" height="40" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="290" y="35" text-anchor="middle" class="svg-text svg-text-heading">App.jsx</text>

    <path d="M 200 50 L 100 80" class="svg-line" />
    <path d="M 290 50 L 290 80" class="svg-line" />
    <path d="M 380 50 L 480 80" class="svg-line" />

    <rect x="40" y="80" width="120" height="35" rx="6" class="svg-node" />
    <text x="100" y="102" text-anchor="middle" class="svg-text">components/</text>

    <rect x="230" y="80" width="120" height="35" rx="6" class="svg-node" />
    <text x="290" y="102" text-anchor="middle" class="svg-text">pages/</text>

    <rect x="420" y="80" width="120" height="35" rx="6" class="svg-node" />
    <text x="480" y="102" text-anchor="middle" class="svg-text">services/</text>
  </svg>
</div>

---

## 3. Component File Conventions

```jsx
// Button.jsx
import './Button.css';

export function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
```

| Pattern | When to use |
| :--- | :--- |
| **Named export** | Multiple exports per file, tree-shaking clarity |
| **Default export** | Single main component per file (common in pages) |
| **Colocated CSS** | Component-specific styles next to component |
| **CSS Modules** | Scoped class names (`Button.module.css`) |

---

## 4. Separating Concerns

| Layer | Responsibility |
| :--- | :--- |
| **Components** | UI and user interaction |
| **Hooks** | Reusable stateful logic |
| **Services** | HTTP/API communication |
| **Utils** | Formatting, validation helpers (no React imports) |

```jsx
// services/userApi.js
export async function fetchUser(id) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

// components/UserCard.jsx
import { useEffect, useState } from 'react';
import { fetchUser } from '../services/userApi';
```

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Keep components under ~200 lines—split when they grow.</li>
      <li>Use path aliases (`@/components`) in larger projects via Vite config.</li>
      <li>Place environment variables in <code>.env</code> (never commit secrets).</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Dumping all files flat in <code>src/</code> with no folders.</li>
      <li>Putting API calls directly inside every component with no service layer.</li>
      <li>Circular imports between modules.</li>
    </ul>
  </div>
</div>

---

## 6. Coding Exercise: Plan a Todo App Structure

### Task:

List which folders/files you would create for a Todo app with list UI, API service, and a custom `useTodos` hook.

##### Solution

```
src/
├── main.jsx
├── App.jsx
├── components/
│   ├── TodoList.jsx
│   ├── TodoItem.jsx
│   └── AddTodoForm.jsx
├── hooks/
│   └── useTodos.js
├── services/
│   └── todoApi.js
└── utils/
    └── formatDate.js
```

---

## Interview Tips

- **"How do you structure React apps?"** — Feature folders or type folders; separate UI, hooks, API, and utils.
- **"Where do API calls go?"** — Service modules or custom hooks, not scattered inline in every component.
- **"Public vs src?"** — Static assets in `public/` are served as-is; imported assets in `src/` are processed by the bundler.

---

## Key Takeaways

- Start with **Vite's default layout** and grow folders as needed.
- Separate **UI**, **hooks**, **services**, and **utils**.
- Stay **consistent** with naming and folder strategy.
- Split large components and colocate related files.
