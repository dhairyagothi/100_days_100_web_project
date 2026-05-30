# JSX

**JSX** (JavaScript XML) lets you write HTML-like syntax inside JavaScript. React transforms JSX into `React.createElement` calls that describe what the UI should look like.

---

## 1. What is JSX?

JSX is **syntactic sugar**—it is not HTML and not required by the browser. A build tool (Babel/Vite) compiles it to JavaScript.

```jsx
// JSX
const element = <h1 className="title">Hello</h1>;

// Compiles roughly to:
const element = React.createElement('h1', { className: 'title' }, 'Hello');
```

### Rules of JSX

| Rule | Example |
| :--- | :--- |
| Return **one parent** element (or use Fragment) | `<>...</>` or `<div>...</div>` |
| Use **className** instead of `class` | `<div className="card">` |
| Close all tags | `<img />`, `<br />` |
| Use **camelCase** for most attributes | `onClick`, `tabIndex` |
| Embed JavaScript with **{ }** | `{user.name}` |

---

## 2. Embedding Expressions

Curly braces let you inject any valid JavaScript **expression**:

```jsx
const name = "Sara";
const count = 3;

function Profile() {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You have {count} new messages.</p>
      <p>2 + 2 = {2 + 2}</p>
    </div>
  );
}
```

> [!NOTE]
> You cannot use statements inside `{}`—only expressions. Use ternaries or call functions instead of `if` blocks directly in JSX.

---

## 3. JSX vs HTML Differences

```jsx
// HTML                          // JSX
<label for="email">              <label htmlFor="email">
<div class="box">                <div className="box">
<style>body { margin: 0 }</style>  {/* Use external CSS or CSS modules */}
```

### Comments in JSX

```jsx
function Card() {
  return (
    <div>
      {/* This is a JSX comment */}
      <p>Visible content</p>
    </div>
  );
}
```

---

## 4. Fragments

Avoid extra wrapper `<div>` elements with **Fragments**:

```jsx
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}

// Or explicit:
import { Fragment } from 'react';
<Fragment><li>A</li><li>B</li></Fragment>
```

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Keep JSX readable—extract complex logic into variables above the return.</li>
      <li>Use parentheses for multi-line returns.</li>
      <li>Prefer Fragments over meaningless wrapper divs.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Using <code>class</code> instead of <code>className</code>.</li>
      <li>Returning adjacent elements without a parent or Fragment.</li>
      <li>Putting <code>if</code> statements directly inside <code>{ }</code>.</li>
      <li>Forgetting that <code>for</code> in JSX loops is the reserved word—use <code>htmlFor</code>.</li>
    </ul>
  </div>
</div>

---

## 6. Coding Exercise: Build a JSX Card

### Task:

Create a component `UserCard` that displays a user's name, role, and whether they are active (use a boolean `isActive`).

##### Solution

```jsx
function UserCard() {
  const name = "Jordan Lee";
  const role = "Frontend Developer";
  const isActive = true;

  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{role}</p>
      <p>Status: {isActive ? "Online" : "Offline"}</p>
    </div>
  );
}
```

---

## Interview Tips

- **"What is JSX?"** — Syntax extension that looks like HTML but compiles to `React.createElement`.
- **"Why className?"** — `class` is a reserved word in JavaScript.
- **"Can browsers read JSX?"** — No; it must be transpiled by Babel/Vite/etc.

---

## Key Takeaways

- JSX describes UI as **JavaScript expressions**.
- Use **className**, **camelCase** attributes, and **{ }** for dynamic values.
- **Fragments** avoid unnecessary DOM nodes.
- JSX must have a **single root** per return.
