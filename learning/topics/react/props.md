# Props

**Props** (short for properties) are how parent components pass data to child components. Props are **read-only**—a child must never modify props directly.

---

## 1. Passing Props

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

function App() {
  return <Greeting name="Alex" />;
}
```

You can pass any JavaScript value:

```jsx
<Avatar imageUrl="/photo.jpg" size={48} isOnline={true} tags={["dev", "react"]} />
```

---

## 2. Props Are Read-Only

React's one-way data flow means data flows **down** via props:

<div class="vector-flowchart">
  <svg viewBox="0 0 580 100" width="100%">
    <rect x="40" y="25" width="140" height="50" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="110" y="55" text-anchor="middle" class="svg-text">Parent</text>
    <text x="110" y="68" text-anchor="middle" class="svg-text" style="font-size: 9px;">owns data</text>

    <path d="M 180 50 L 250 50" class="svg-line" />
    <text x="215" y="42" text-anchor="middle" class="svg-text" style="font-size: 10px; fill: var(--accent);">props</text>
    <polygon points="250,50 244,46 244,54" class="svg-marker" />

    <rect x="250" y="25" width="140" height="50" rx="6" class="svg-node" />
    <text x="320" y="55" text-anchor="middle" class="svg-text">Child</text>
    <text x="320" y="68" text-anchor="middle" class="svg-text" style="font-size: 9px;">reads only</text>

    <path d="M 390 50 L 460 50" class="svg-line" style="stroke-dasharray: 4;" />
    <text x="425" y="42" text-anchor="middle" class="svg-text" style="font-size: 9px; fill: #ef4444;">✗ mutate props</text>

    <rect x="460" y="25" width="80" height="50" rx="6" class="svg-node" style="opacity: 0.4;" />
    <text x="500" y="55" text-anchor="middle" class="svg-text" style="font-size: 9px;">blocked</text>
  </svg>
</div>

```jsx
// Wrong — never do this
function BadChild(props) {
  props.count = props.count + 1; // Error in strict mode / anti-pattern
  return <span>{props.count}</span>;
}
```

To change data, the **parent** updates its state and passes new props down.

---

## 3. Default Props and Destructuring

```jsx
function Button({ label = "Click me", variant = "primary" }) {
  return <button className={`btn btn-${variant}`}>{label}</button>;
}

<Button />
<Button label="Submit" variant="secondary" />
```

### PropTypes (optional documentation)

```jsx
import PropTypes from 'prop-types';

Button.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
};
```

> [!NOTE]
> TypeScript is increasingly used instead of PropTypes for type safety in production apps.

---

## 4. The `children` Prop

Content placed between opening and closing tags becomes `props.children`:

```jsx
function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}

<Panel title="Settings">
  <p>Adjust your preferences here.</p>
  <button>Save</button>
</Panel>
```

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Destructure props in the function signature for clarity.</li>
      <li>Keep prop lists focused—pass objects only when many related fields travel together.</li>
      <li>Use callback props (`onSave`) for child-to-parent communication.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Mutating props or state objects in place.</li>
      <li>Drilling props through many layers (consider context or composition).</li>
      <li>Spreading unknown props onto DOM elements without filtering.</li>
    </ul>
  </div>
</div>

---

## 6. Coding Exercise: Reusable Product Card

### Task:

Create `ProductCard` that accepts `name`, `price`, and `inStock` props and displays them appropriately.

##### Solution

```jsx
function ProductCard({ name, price, inStock }) {
  return (
    <article className="product-card">
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>
      <span>{inStock ? "In stock" : "Out of stock"}</span>
    </article>
  );
}

function App() {
  return (
    <ProductCard name="Wireless Mouse" price={29.99} inStock={true} />
  );
}
```

---

## Interview Tips

- **"What are props?"** — Inputs to components, passed from parent to child, immutable in the child.
- **"Props vs state?"** — Props are external and read-only; state is internal and mutable via setters.
- **"Prop drilling?"** — Passing props through many intermediate components; solved with Context or state libraries.

---

## Key Takeaways

- Props pass **data down** the component tree.
- Props are **read-only** in child components.
- Use **destructuring**, **defaults**, and **children** effectively.
- Callback props enable **upward** communication.
