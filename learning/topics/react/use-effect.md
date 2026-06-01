# useEffect

The **`useEffect`** hook runs **side effects** after render—data fetching, subscriptions, timers, and syncing with external systems. It replaces most class lifecycle methods in modern React.

---

## 1. Basic Syntax

```jsx
import { useEffect } from 'react';

useEffect(() => {
  // side effect runs after paint
  return () => {
    // optional cleanup
  };
}, [dependencies]);
```

---

## 2. Dependency Array

| Dependencies | Behavior |
| :--- | :--- |
| **Omitted** | Runs after **every** render (rarely what you want) |
| **`[]`** | Runs **once** on mount (like componentDidMount) |
| **`[a, b]`** | Runs on mount and when `a` or `b` change |

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then(setUser);
  }, [userId]); // re-fetch when userId changes

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

---

## 3. Cleanup Function

Return a function to clean up before the effect runs again or on unmount:

```jsx
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(timer); // cleanup on unmount or before re-run
}, []);
```

<div class="vector-flowchart">
  <svg viewBox="0 0 580 200" width="100%">
    <rect x="200" y="10" width="180" height="35" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="290" y="32" text-anchor="middle" class="svg-text svg-text-heading">Component Mount</text>

    <path d="M 290 45 L 290 65" class="svg-line" />
    <rect x="200" y="65" width="180" height="35" rx="6" class="svg-node" style="stroke: #10b981;" />
    <text x="290" y="87" text-anchor="middle" class="svg-text">Effect runs</text>

    <path d="M 290 100 L 290 120" class="svg-line" />
    <rect x="200" y="120" width="180" height="35" rx="6" class="svg-node" />
    <text x="290" y="142" text-anchor="middle" class="svg-text">deps change / unmount</text>

    <path d="M 290 155 L 290 175" class="svg-line" />
    <rect x="200" y="175" width="180" height="30" rx="6" class="svg-node" style="stroke: #ef4444;" />
    <text x="290" y="195" text-anchor="middle" class="svg-text" style="font-size: 10px;">Cleanup runs</text>
  </svg>
</div>

---

## 4. Common Use Cases

### Document title

```jsx
useEffect(() => {
  document.title = `${count} items in cart`;
}, [count]);
```

### Event listeners

```jsx
useEffect(() => {
  function onKeyDown(e) {
    if (e.key === 'Escape') closeModal();
  }
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, []);
```

### Fetching data

```jsx
useEffect(() => {
  let cancelled = false;

  async function load() {
    const res = await fetch(url);
    const data = await res.json();
    if (!cancelled) setData(data);
  }

  load();
  return () => { cancelled = true; };
}, [url]);
```

> [!WARNING]
> Never make the effect callback itself `async`—`useEffect` expects a function or cleanup, not a Promise. Use an inner async function instead.

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>List every value from component scope used inside the effect in the dependency array.</li>
      <li>Clean up subscriptions, timers, and listeners.</li>
      <li>Use abort flags or <code>AbortController</code> to ignore stale fetch responses.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Missing dependencies causing stale data bugs.</li>
      <li>Infinite loops from setting state in an effect without proper deps.</li>
      <li>Using <code>useEffect</code> to transform props into state (compute during render instead).</li>
    </ul>
  </div>
</div>

---

## 6. Coding Exercise: Document Title Sync

### Task:

When `username` state changes, update `document.title` to `"Chat - {username}"`.

##### Solution

```jsx
import { useState, useEffect } from 'react';

function ChatHeader() {
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    document.title = `Chat - ${username}`;
  }, [username]);

  return (
    <input value={username} onChange={(e) => setUsername(e.target.value)} />
  );
}
```

---

## Interview Tips

- **"What is useEffect?"** — Runs side effects after render; optional cleanup and dependency control.
- **"Empty dependency array?"** — Effect runs once on mount (plus cleanup on unmount).
- **"useEffect vs useLayoutEffect?"** — `useLayoutEffect` runs synchronously after DOM updates, before paint—use for DOM measurements.

---

## Key Takeaways

- **`useEffect`** handles side effects outside pure rendering.
- The **dependency array** controls when the effect re-runs.
- Return a **cleanup** function for timers, listeners, and cancelled requests.
- Do not use effects for **derived state**—compute during render when possible.
