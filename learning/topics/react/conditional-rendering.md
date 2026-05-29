# Conditional Rendering

**Conditional rendering** means showing different UI based on state, props, or other conditions—just like `if` statements in JavaScript, but expressed in JSX.

---

## 1. if / else Outside JSX

For complex branches, use logic before the `return`:

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign in.</h1>;
}
```

Early returns keep JSX clean for major layout changes.

---

## 2. Ternary Operator

Inline choice between two elements:

```jsx
function StatusBadge({ isOnline }) {
  return (
    <span className={isOnline ? 'badge online' : 'badge offline'}>
      {isOnline ? 'Online' : 'Offline'}
    </span>
  );
}
```

---

## 3. Logical AND (&&)

Render something **only when** a condition is true:

```jsx
function Notifications({ count }) {
  return (
    <div>
      {count > 0 && <p>You have {count} new messages.</p>}
    </div>
  );
}
```

> [!CAUTION]
> Avoid `{count && <p>...</p>}` when `count` can be `0`—React renders `0` on screen. Use `{count > 0 && ...}` instead.

---

## 4. Switching Multiple Conditions

```jsx
function TrafficLight({ color }) {
  switch (color) {
    case 'red':
      return <div className="light red">Stop</div>;
    case 'yellow':
      return <div className="light yellow">Caution</div>;
    case 'green':
      return <div className="light green">Go</div>;
    default:
      return <div className="light off">Unknown</div>;
  }
}
```

Or map statuses to components:

```jsx
const views = {
  loading: <Spinner />,
  error: <ErrorMessage />,
  success: <DataTable />,
};

function Dashboard({ status }) {
  return views[status] ?? <p>Unknown status</p>;
}
```

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Use early returns for large mutually exclusive UIs.</li>
      <li>Use ternaries for simple either/or within JSX.</li>
      <li>Use <code>&&</code> for show/hide of a single element.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Rendering <code>0</code> with <code>{count && &lt;Node /&gt;}</code>.</li>
      <li>Deeply nested ternaries that hurt readability.</li>
      <li>Forgetting a loading/error state in async UIs.</li>
    </ul>
  </div>
</div>

---

## 6. Coding Exercise: Auth Message

### Task:

Given `isLoggedIn` and `username`, show "Hello, {username}" when logged in, otherwise show a login prompt link.

##### Solution

```jsx
function AuthMessage({ isLoggedIn, username }) {
  return (
    <div>
      {isLoggedIn ? (
        <h2>Hello, {username}</h2>
      ) : (
        <p><a href="/login">Please log in</a></p>
      )}
    </div>
  );
}
```

---

## Interview Tips

- **"Ways to conditionally render?"** — `if/return`, ternary, `&&`, switch, object map of components.
- **"Why does 0 render?"** — `0` is falsy but a valid React child; `false`/`null`/`undefined` render nothing.
- **"Null in JSX?"** — Returning `null` renders nothing (useful for conditional components).

---

## Key Takeaways

- Match the pattern to complexity: **if**, **ternary**, **&&**, or **lookup map**.
- Guard numeric conditions: use **`count > 0`** with `&&`.
- Always handle **loading** and **error** states in real apps.
