# Hooks Overview

**Hooks** are functions that let you use React features—state, lifecycle effects, context, and more—from function components. They replaced most class component patterns in modern React.

---

## 1. What Are Hooks?

Hooks always start with `use` (e.g. `useState`, `useEffect`). They connect your component logic to React's rendering system.

```jsx
import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <p>Elapsed: {seconds}s</p>;
}
```

---

## 2. Rules of Hooks

React enforces two rules:

<div class="vector-flowchart">
  <svg viewBox="0 0 580 140" width="100%">
    <rect x="40" y="20" width="220" height="50" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="150" y="42" text-anchor="middle" class="svg-text svg-text-heading">Rule 1</text>
    <text x="150" y="58" text-anchor="middle" class="svg-text" style="font-size: 10px;">Only call at top level</text>

    <rect x="320" y="20" width="220" height="50" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="430" y="42" text-anchor="middle" class="svg-text svg-text-heading">Rule 2</text>
    <text x="430" y="58" text-anchor="middle" class="svg-text" style="font-size: 10px;">Only in React functions</text>

    <path d="M 150 70 L 150 95" class="svg-line" />
    <path d="M 430 70 L 430 95" class="svg-line" />

    <rect x="80" y="95" width="140" height="35" rx="6" class="svg-node" />
    <text x="150" y="117" text-anchor="middle" class="svg-text" style="font-size: 9px;">No loops / if / nested fn</text>

    <rect x="360" y="95" width="140" height="35" rx="6" class="svg-node" />
    <text x="430" y="117" text-anchor="middle" class="svg-text" style="font-size: 9px;">Components or custom hooks</text>
  </svg>
</div>

| Rule | Meaning |
| :--- | :--- |
| **Top level only** | Never call hooks inside loops, conditions, or nested functions |
| **React functions only** | Call from function components or custom hooks—not regular JS functions |

---

## 3. Built-in Hooks (Common Set)

| Hook | Purpose |
| :--- | :--- |
| `useState` | Local state |
| `useEffect` | Side effects (fetch, subscriptions, DOM sync) |
| `useContext` | Read shared context |
| `useRef` | Mutable ref without re-render |
| `useMemo` / `useCallback` | Performance optimization |
| `useReducer` | Complex state logic |

You will study `useState` and `useEffect` in depth in the next lessons.

---

## 4. Custom Hooks

Extract reusable logic into your own hooks:

```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

// Usage in any component
function Layout() {
  const width = useWindowWidth();
  return <p>Window width: {width}px</p>;
}
```

Custom hooks share **stateful logic**, not state itself (each call gets its own state).

---

## 5. Hooks vs Class Lifecycle (Conceptual Map)

<div class="vector-flowchart">
  <svg viewBox="0 0 580 200" width="100%">
    <text x="120" y="20" class="svg-text" style="font-weight: bold;">Class (legacy)</text>
    <rect x="40" y="30" width="160" height="30" rx="6" class="svg-node" />
    <text x="120" y="50" text-anchor="middle" class="svg-text">componentDidMount</text>
    <rect x="40" y="70" width="160" height="30" rx="6" class="svg-node" />
    <text x="120" y="90" text-anchor="middle" class="svg-text">componentDidUpdate</text>
    <rect x="40" y="110" width="160" height="30" rx="6" class="svg-node" />
    <text x="120" y="130" text-anchor="middle" class="svg-text">componentWillUnmount</text>

    <path d="M 210 75 L 280 75" class="svg-line" />
    <text x="245" y="68" class="svg-text" style="font-size: 10px;">maps to</text>
    <polygon points="280,75 274,71 274,79" class="svg-marker" />

    <text x="430" y="20" class="svg-text" style="font-weight: bold;">Hooks (modern)</text>
    <rect x="300" y="55" width="200" height="50" rx="6" class="svg-node" style="stroke: #61dafb;" />
    <text x="400" y="78" text-anchor="middle" class="svg-text svg-text-heading">useEffect(() => { ... }, [deps])</text>
    <text x="400" y="95" text-anchor="middle" class="svg-text" style="font-size: 9px;">+ cleanup return function</text>
  </svg>
</div>

---

## 6. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Extract repeated effect logic into custom hooks.</li>
      <li>Keep effects focused—one concern per <code>useEffect</code> when possible.</li>
      <li>Follow the Rules of Hooks (ESLint plugin helps).</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Calling hooks conditionally (<code>if (x) useState()</code>).</li>
      <li>Using <code>useEffect</code> for everything including derived data.</li>
      <li>Naming custom hooks without the <code>use</code> prefix.</li>
    </ul>
  </div>
</div>

---

## 7. Coding Exercise: Custom Hook Sketch

### Task:

Outline a custom hook `useToggle(initial)` that returns `[value, toggle]` where `toggle` flips the boolean.

##### Solution

```jsx
import { useState, useCallback } from 'react';

function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function Panel() {
  const [open, toggleOpen] = useToggle(false);
  return (
    <>
      <button onClick={toggleOpen}>{open ? 'Close' : 'Open'}</button>
      {open && <p>Panel content</p>}
    </>
  );
}
```

---

## Interview Tips

- **"Why hooks?"** — Reuse stateful logic, simpler components, avoid `this` binding issues in classes.
- **"Rules of hooks?"** — Top level only; only in React functions/custom hooks.
- **"Custom hook?"** — A function named `useSomething` that composes other hooks.

---

## Key Takeaways

- Hooks connect **function components** to React features.
- Follow the **Rules of Hooks** strictly.
- **`useState`** and **`useEffect`** are the foundation.
- **Custom hooks** extract reusable logic across components.
