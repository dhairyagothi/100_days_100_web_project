# State

**State** is data that changes over time inside a component. When state updates, React re-renders the component so the UI stays in sync with your data.

---

## 1. State vs Props

| | Props | State |
| :--- | :--- | :--- |
| **Source** | Parent component | Component itself |
| **Mutable by child?** | No | Yes (via setter) |
| **Triggers re-render?** | When parent re-renders | When state is updated |

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## 2. useState Basics

Import and call `useState` with an initial value:

```jsx
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </form>
  );
}
```

`useState` returns `[currentValue, setterFunction]`.

---

## 3. State Updates Are Asynchronous

React may **batch** multiple state updates for performance. Do not read state immediately expecting it to be updated:

```jsx
function handleClick() {
  setCount(count + 1);
  console.log(count); // Still the OLD value
}
```

Use the **functional updater** when the new state depends on the previous state:

```jsx
setCount((prev) => prev + 1);
setCount((prev) => prev + 1); // Correct for double increment
```

---

## 4. Object and Array State

Never mutate state directly—create new copies:

```jsx
const [user, setUser] = useState({ name: 'Sam', age: 25 });

// Wrong
user.age = 26;

// Correct
setUser({ ...user, age: 26 });
```

```jsx
const [items, setItems] = useState(['apple', 'banana']);

setItems([...items, 'cherry']);           // add
setItems(items.filter((i) => i !== 'apple')); // remove
```

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Colocate state as low as possible in the tree (only lift when needed).</li>
      <li>Use functional updates when deriving from previous state.</li>
      <li>Split unrelated state into separate <code>useState</code> calls.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Mutating objects/arrays in state directly.</li>
      <li>Storing derived data in state instead of computing it during render.</li>
      <li>Putting everything in one giant state object unnecessarily.</li>
    </ul>
  </div>
</div>

> [!WARNING]
> Do not call `useState` inside loops, conditions, or nested functions—only at the top level of your component.

---

## 6. Coding Exercise: Toggle Visibility

### Task:

Create a component with a boolean `isVisible` state and a button that toggles a paragraph's visibility.

##### Solution

```jsx
import { useState } from 'react';

function ToggleMessage() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? 'Hide' : 'Show'} Message
      </button>
      {isVisible && <p>Hello! This message can be toggled.</p>}
    </div>
  );
}
```

---

## Interview Tips

- **"What is state?"** — Internal component data that, when changed, triggers a re-render.
- **"Why immutability?"** — React compares references to detect changes; mutation can skip updates.
- **"Lifting state up?"** — Moving shared state to the closest common ancestor.

---

## Key Takeaways

- **State** is mutable local data; **props** are external inputs.
- Use **`useState`** and always update via the setter.
- Prefer **immutable** updates for objects and arrays.
- Use **functional updaters** when the next state depends on the previous state.
