# Event Handling

React events feel like DOM events but use **camelCase** names and a **SyntheticEvent** wrapper for consistent behavior across browsers.

---

## 1. Basic Event Handlers

```jsx
function ClickButton() {
  function handleClick() {
    alert('Button clicked!');
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

Pass a **function reference**, not a function call (unless you need arguments):

```jsx
// Correct
<button onClick={handleClick}>OK</button>

// Wrong — runs immediately on every render
<button onClick={handleClick()}>OK</button>

// With arguments — wrap in arrow function
<button onClick={() => handleDelete(id)}>Delete</button>
```

---

## 2. Common React Events

| Event | Use Case |
| :--- | :--- |
| `onClick` | Buttons, clickable elements |
| `onChange` | Inputs, selects, textareas |
| `onSubmit` | Form submission |
| `onKeyDown` | Keyboard shortcuts |
| `onMouseEnter` / `onMouseLeave` | Hover effects |

```jsx
function SearchBox() {
  const [query, setQuery] = useState('');

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

## 3. Preventing Default Behavior

```jsx
function LoginForm() {
  function handleSubmit(event) {
    event.preventDefault();
    // send data without full page reload
    console.log('Form submitted');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Log in</button>
    </form>
  );
}
```

---

## 4. Passing Handlers as Props

Child components can notify parents via callback props:

```jsx
function Toolbar({ onSave, onCancel }) {
  return (
    <div>
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

function Editor() {
  const handleSave = () => console.log('Saved!');
  return <Toolbar onSave={handleSave} onCancel={() => console.log('Cancelled')} />;
}
```

<div class="vector-flowchart">
  <svg viewBox="0 0 580 100" width="100%">
    <rect x="60" y="25" width="120" height="50" rx="6" class="svg-node" />
    <text x="120" y="55" text-anchor="middle" class="svg-text">Child click</text>
    <path d="M 180 50 L 250 50" class="svg-line" />
    <text x="215" y="42" class="svg-text" style="font-size: 9px;">onSave()</text>
    <polygon points="250,50 244,46 244,54" class="svg-marker" />
    <rect x="250" y="25" width="120" height="50" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="310" y="55" text-anchor="middle" class="svg-text">Parent state</text>
  </svg>
</div>

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Name handlers <code>handleEventName</code> for clarity.</li>
      <li>Keep handlers small—delegate heavy logic to separate functions.</li>
      <li>Use <code>event.preventDefault()</code> on forms when using client-side handling.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Calling the handler immediately: <code>onClick={fn()}</code>.</li>
      <li>Using lowercase <code>onclick</code> instead of <code>onClick</code>.</li>
      <li>Creating new inline functions in hot paths without need (minor perf concern).</li>
    </ul>
  </div>
</div>

---

## 6. Coding Exercise: Like Button

### Task:

Build a `LikeButton` that shows a heart count and increments on each click.

##### Solution

```jsx
import { useState } from 'react';

function LikeButton() {
  const [likes, setLikes] = useState(0);

  return (
    <button onClick={() => setLikes((prev) => prev + 1)}>
      ❤️ {likes}
    </button>
  );
}
```

---

## Interview Tips

- **"Synthetic events?"** — React's cross-browser wrapper around native events; pooled in older React, not in React 17+.
- **"How to pass parameters?"** — `onClick={() => handle(id)}` or bind in a class (legacy).
- **"onClick vs addEventListener?"** — React attaches handlers declaratively in JSX.

---

## Key Takeaways

- Use **camelCase** event props: `onClick`, `onChange`, `onSubmit`.
- Pass **function references**, not invoked functions.
- Use **`preventDefault`** for controlled form behavior.
- **Callback props** connect child events to parent logic.
