# Components

**Components** are the building blocks of every React application. They let you split the UI into independent, reusable pieces and compose them into complex screens.

---

## 1. Function Components (Modern Standard)

Today, most React code uses **function components**:

```jsx
function Welcome() {
  return <h1>Welcome to my app</h1>;
}

export default Welcome;
```

Use components like custom HTML tags:

```jsx
function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
    </div>
  );
}
```

---

## 2. Component Hierarchy

Large UIs are trees of nested components:

<div class="vector-flowchart">
  <svg viewBox="0 0 580 260" width="100%">
    <rect x="230" y="10" width="120" height="35" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="290" y="32" text-anchor="middle" class="svg-text svg-text-heading">App</text>

    <path d="M 230 45 L 120 75" class="svg-line" />
    <path d="M 290 45 L 290 75" class="svg-line" />
    <path d="M 350 45 L 460 75" class="svg-line" />

    <rect x="60" y="75" width="120" height="35" rx="6" class="svg-node" />
    <text x="120" y="97" text-anchor="middle" class="svg-text">Header</text>

    <rect x="230" y="75" width="120" height="35" rx="6" class="svg-node" />
    <text x="290" y="97" text-anchor="middle" class="svg-text">Main</text>

    <rect x="400" y="75" width="120" height="35" rx="6" class="svg-node" />
    <text x="460" y="97" text-anchor="middle" class="svg-text">Footer</text>

    <path d="M 290 110 L 200 145" class="svg-line" />
    <path d="M 290 110 L 290 145" class="svg-line" />
    <path d="M 290 110 L 380 145" class="svg-line" />

    <rect x="140" y="145" width="120" height="35" rx="6" class="svg-node" />
    <text x="200" y="167" text-anchor="middle" class="svg-text">Sidebar</text>

    <rect x="280" y="145" width="120" height="35" rx="6" class="svg-node" />
    <text x="340" y="167" text-anchor="middle" class="svg-text">Content</text>

    <rect x="420" y="145" width="120" height="35" rx="6" class="svg-node" />
    <text x="480" y="167" text-anchor="middle" class="svg-text">Toolbar</text>

    <path d="M 340 180 L 340 215" class="svg-line" />

    <rect x="280" y="215" width="120" height="35" rx="6" class="svg-node" style="stroke: #10b981;" />
    <text x="340" y="237" text-anchor="middle" class="svg-text">PostCard</text>
  </svg>
</div>

```jsx
function App() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  );
}

function Main() {
  return (
    <main>
      <Sidebar />
      <Content />
    </main>
  );
}
```

---

## 3. Naming and File Conventions

| Convention | Example |
| :--- | :--- |
| PascalCase component names | `UserProfile`, `NavBar` |
| One component per file (common) | `UserProfile.jsx` |
| Default export for main component | `export default UserProfile` |

> [!TIP]
> **Pro Tip**: Name files to match the component (`Button.jsx` exports `Button`) so imports stay predictable.

---

## 4. Composition Over Inheritance

React favors **composition**—nesting components and passing children:

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function App() {
  return (
    <Card>
      <h2>Title</h2>
      <p>Body text inside the card.</p>
    </Card>
  );
}
```

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Keep components small and focused on one responsibility.</li>
      <li>Extract repeated UI into shared components.</li>
      <li>Colocate related files (component + styles) in the same folder.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Using lowercase names for components (`<welcome />` is treated as HTML tag).</li>
      <li>Creating "god components" that do everything.</li>
      <li>Forgetting to export/import components between files.</li>
    </ul>
  </div>
</div>

---

## 6. Coding Exercise: Page Layout

### Task:

Build `App`, `Header`, and `Footer` components. `App` should render Header, a `<main>` with "Page content", and Footer.

##### Solution

```jsx
function Header() {
  return <header><h1>My Site</h1></header>;
}

function Footer() {
  return <footer><p>&copy; 2026 My Site</p></footer>;
}

function App() {
  return (
    <>
      <Header />
      <main>Page content</main>
      <Footer />
    </>
  );
}

export default App;
```

---

## Interview Tips

- **"Class vs function components?"** — Function components with hooks are the modern standard; class components are legacy.
- **"What is composition?"** — Building UIs by nesting components and using `children` instead of inheritance.
- **"Why PascalCase?"** — React distinguishes custom components from native HTML elements.

---

## Key Takeaways

- Components are **reusable UI functions** that return JSX.
- UIs form a **component tree** rooted at `App`.
- Use **composition** and **children** for flexible layouts.
- Name components in **PascalCase** and export them for reuse.
