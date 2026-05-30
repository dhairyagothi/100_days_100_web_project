# useState

The **`useState`** hook is the primary way to add local state to function components. Mastering it unlocks interactive UIs—counters, forms, toggles, and more.

---

## 1. Basic Syntax

```jsx
import { useState } from 'react';

const [state, setState] = useState(initialValue);
```

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

The **initial value** is used only on the first render.

---

## 2. Lazy Initial State

If computing the initial state is expensive, pass a function:

```jsx
const [items, setItems] = useState(() => {
  const saved = localStorage.getItem('items');
  return saved ? JSON.parse(saved) : [];
});
```

React calls this function **once** on mount.

---

## 3. Functional Updates

When the next state depends on the previous state, use the updater form:

```jsx
setCount((prev) => prev + 1);
setCount((prev) => prev + 1); // adds 2 total when called twice in one event
```

This avoids stale closure bugs when multiple updates happen in quick succession.

---

## 4. Multiple State Variables

```jsx
function ProfileEditor() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [bio, setBio] = useState('');

  // Or one object when fields always change together:
  const [form, setForm] = useState({ name: '', age: 0, bio: '' });
}
```

Prefer **separate** `useState` calls when updates are independent; use an **object** when they are tightly coupled.

---

## 5. State Update Flow

<div class="vector-flowchart">
  <svg viewBox="0 0 580 120" width="100%">
    <rect x="20" y="40" width="100" height="40" rx="6" class="svg-node" />
    <text x="70" y="65" text-anchor="middle" class="svg-text">User click</text>

    <path d="M 120 60 L 160 60" class="svg-line" />
    <polygon points="160,60 154,56 154,64" class="svg-marker" />

    <rect x="160" y="40" width="100" height="40" rx="6" class="svg-node" />
    <text x="210" y="65" text-anchor="middle" class="svg-text">setState()</text>

    <path d="M 260 60 L 300 60" class="svg-line" />
    <polygon points="300,60 294,56 294,64" class="svg-marker" />

    <rect x="300" y="40" width="100" height="40" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="350" y="65" text-anchor="middle" class="svg-text">Re-render</text>

    <path d="M 400 60 L 440 60" class="svg-line" />
    <polygon points="440,60 434,56 434,64" class="svg-marker" />

    <rect x="440" y="40" width="120" height="40" rx="6" class="svg-node" style="stroke: #10b981;" />
    <text x="500" y="65" text-anchor="middle" class="svg-text">Updated UI</text>
  </svg>
</div>

---

## 6. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Use functional updates for counters and toggles based on prior value.</li>
      <li>Derive display values in render instead of duplicating state.</li>
      <li>Split unrelated state to avoid unnecessary re-renders.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Mutating state: <code>state.push(item)</code> then <code>setState(state)</code>.</li>
      <li>Expecting immediate state change after <code>setState</code>.</li>
      <li>Storing props in state without a reason (props already update on parent render).</li>
    </ul>
  </div>
</div>

---

## 7. Coding Exercise: Shopping Cart Quantity

### Task:

Create state for `quantity` starting at 1. Add Increment and Decrement buttons (minimum quantity 1).

##### Solution

```jsx
import { useState } from 'react';

function QuantityPicker() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
      <span>{quantity}</span>
      <button onClick={() => setQuantity((q) => q + 1)}>+</button>
    </div>
  );
}
```

---

## Interview Tips

- **"What does useState return?"** — A tuple: current state and a setter function.
- **"Stale closure?"** — Event handlers capturing old state; fix with functional updates or correct deps in effects.
- **"Batching?"** — React 18 batches multiple setState calls in the same event for one re-render.

---

## Key Takeaways

- **`useState(initial)`** adds local mutable state to function components.
- Use **functional updaters** when next state depends on previous state.
- Never **mutate** state—always pass new values/objects.
- State updates trigger a **re-render** with the new UI.
