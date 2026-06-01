# Introduction to React

**React** is a JavaScript library for building user interfaces. Created by Meta (formerly Facebook), it helps you create fast, interactive web applications by breaking the UI into reusable pieces called **components**.

In this lesson, you will learn what React is, how it fits into the modern web stack, and how the React learning path in this portal is organized.

---

## 1. What is React?

React is **not** a full framework like Angular. It focuses on the **view layer**—what users see and interact with. You combine React with other tools (routing, state management, build tools) to build complete applications.

| Term | Meaning |
| :--- | :--- |
| **Library** | You call React; it does not control your entire app structure |
| **Component** | A reusable UI building block (button, navbar, page section) |
| **Virtual DOM** | React's in-memory representation of the UI for efficient updates |
| **Declarative** | You describe *what* the UI should look like; React handles *how* to update it |

```jsx
function Welcome() {
  return <h1>Hello, React!</h1>;
}
```

When data changes, React re-renders only the parts of the page that need to update.

---

## 2. How React Fits the Web Stack

React sits on top of the fundamentals you already know:

<div class="vector-flowchart">
  <svg viewBox="0 0 580 200" width="100%">
    <rect x="200" y="10" width="180" height="40" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="290" y="35" text-anchor="middle" class="svg-text svg-text-heading">Browser</text>

    <path d="M 290 50 L 290 70" class="svg-line" />

    <rect x="80" y="70" width="140" height="40" rx="6" class="svg-node" />
    <text x="150" y="95" text-anchor="middle" class="svg-text svg-text-heading">HTML</text>

    <rect x="220" y="70" width="140" height="40" rx="6" class="svg-node" />
    <text x="290" y="95" text-anchor="middle" class="svg-text svg-text-heading">CSS</text>

    <rect x="360" y="70" width="140" height="40" rx="6" class="svg-node" />
    <text x="430" y="95" text-anchor="middle" class="svg-text svg-text-heading">JavaScript</text>

    <path d="M 150 110 L 150 130" class="svg-line" />
    <path d="M 290 110 L 290 130" class="svg-line" />
    <path d="M 430 110 L 430 130" class="svg-line" />
    <path d="M 150 130 L 290 150" class="svg-line" />
    <path d="M 430 130 L 290 150" class="svg-line" />

    <rect x="200" y="150" width="180" height="40" rx="6" class="svg-node" style="fill: rgba(97, 218, 251, 0.15); stroke: #61dafb;" />
    <text x="290" y="175" text-anchor="middle" class="svg-text svg-text-heading">React.js</text>
  </svg>
</div>

> [!NOTE]
> Strong HTML, CSS, and JavaScript skills make learning React much easier. If you have not completed those modules, review them first.

---

## 3. React Learning Path (This Module)

Follow these lessons in order for the smoothest learning experience:

<div class="vector-flowchart">
  <svg viewBox="0 0 580 120" width="100%">
    <rect x="10" y="40" width="90" height="40" rx="6" class="svg-node" />
    <text x="55" y="65" text-anchor="middle" class="svg-text" style="font-size: 9px;">Intro &amp; Setup</text>

    <path d="M 100 60 L 120 60" class="svg-line" />
    <polygon points="120,60 114,56 114,64" class="svg-marker" />

    <rect x="120" y="40" width="90" height="40" rx="6" class="svg-node" />
    <text x="165" y="65" text-anchor="middle" class="svg-text" style="font-size: 9px;">JSX &amp; Components</text>

    <path d="M 210 60 L 230 60" class="svg-line" />
    <polygon points="230,60 224,56 224,64" class="svg-marker" />

    <rect x="230" y="40" width="90" height="40" rx="6" class="svg-node" />
    <text x="275" y="65" text-anchor="middle" class="svg-text" style="font-size: 9px;">Props &amp; State</text>

    <path d="M 320 60 L 340 60" class="svg-line" />
    <polygon points="340,60 334,56 334,64" class="svg-marker" />

    <rect x="340" y="40" width="90" height="40" rx="6" class="svg-node" />
    <text x="385" y="65" text-anchor="middle" class="svg-text" style="font-size: 9px;">Events &amp; Lists</text>

    <path d="M 430 60 L 450 60" class="svg-line" />
    <polygon points="450,60 444,56 444,64" class="svg-marker" />

    <rect x="450" y="40" width="120" height="40" rx="6" class="svg-node" style="stroke: #61dafb;" />
    <text x="510" y="65" text-anchor="middle" class="svg-text" style="font-size: 9px;">Hooks &amp; Projects</text>
  </svg>
</div>

---

## 4. Concept Map: Core React Ideas

<div class="vector-flowchart">
  <svg viewBox="0 0 580 280" width="100%">
    <rect x="220" y="10" width="140" height="40" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="290" y="35" text-anchor="middle" class="svg-text svg-text-heading">React UI</text>

    <path d="M 220 50 L 100 90" class="svg-line" />
    <path d="M 260 50 L 180 90" class="svg-line" />
    <path d="M 320 50 L 400 90" class="svg-line" />
    <path d="M 360 50 L 480 90" class="svg-line" />

    <rect x="40" y="90" width="120" height="40" rx="6" class="svg-node" />
    <text x="100" y="115" text-anchor="middle" class="svg-text">Components</text>

    <rect x="180" y="90" width="120" height="40" rx="6" class="svg-node" />
    <text x="240" y="115" text-anchor="middle" class="svg-text">JSX</text>

    <rect x="320" y="90" width="120" height="40" rx="6" class="svg-node" />
    <text x="380" y="115" text-anchor="middle" class="svg-text">Props</text>

    <rect x="460" y="90" width="100" height="40" rx="6" class="svg-node" />
    <text x="510" y="115" text-anchor="middle" class="svg-text">State</text>

    <path d="M 100 130 L 100 170" class="svg-line" />
    <path d="M 240 130 L 240 170" class="svg-line" />
    <path d="M 380 130 L 380 170" class="svg-line" />
    <path d="M 510 130 L 510 170" class="svg-line" />

    <rect x="40" y="170" width="120" height="40" rx="6" class="svg-node" />
    <text x="100" y="195" text-anchor="middle" class="svg-text" style="font-size: 9px;">Composition</text>

    <rect x="180" y="170" width="120" height="40" rx="6" class="svg-node" />
    <text x="240" y="195" text-anchor="middle" class="svg-text" style="font-size: 9px;">Rendering</text>

    <rect x="320" y="170" width="120" height="40" rx="6" class="svg-node" />
    <text x="380" y="195" text-anchor="middle" class="svg-text" style="font-size: 9px;">Data Flow</text>

    <rect x="460" y="170" width="100" height="40" rx="6" class="svg-node" />
    <text x="510" y="195" text-anchor="middle" class="svg-text" style="font-size: 9px;">Hooks</text>

    <path d="M 100 210 L 290 250" class="svg-line" />
    <path d="M 240 210 L 290 250" class="svg-line" />
    <path d="M 380 210 L 290 250" class="svg-line" />
    <path d="M 510 210 L 290 250" class="svg-line" />

    <rect x="200" y="240" width="180" height="35" rx="6" class="svg-node" style="stroke: #10b981;" />
    <text x="290" y="262" text-anchor="middle" class="svg-text" style="fill: #10b981;">Interactive Application</text>
  </svg>
</div>

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Learn HTML, CSS, and JavaScript fundamentals before diving deep into React.</li>
      <li>Follow lessons in order—each topic builds on the previous one.</li>
      <li>Type code examples yourself instead of only reading them.</li>
      <li>Use the official React docs alongside this module for reference.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Expecting React to replace JavaScript—you still need solid JS skills.</li>
      <li>Skipping setup and jumping straight into advanced patterns.</li>
      <li>Confusing React (library) with React Native (mobile) or Next.js (framework).</li>
      <li>Trying to memorize every API before understanding components and state.</li>
    </ul>
  </div>
</div>

> [!TIP]
> **Pro Tip**: Install Node.js and use Vite or Create React App only when you are ready to run projects locally. The next lessons explain setup step by step.

---

## 6. Coding Exercise: Your First Component (Conceptual)

### Task:

Write a function component named `Greeting` that returns an `<h1>` with the text "Welcome to React".

##### Solution

```jsx
function Greeting() {
  return <h1>Welcome to React</h1>;
}
```

**Explanation**: A function component is a JavaScript function that returns JSX. React calls this function and renders the returned markup to the screen.

---

## Interview Tips

- **"What is React?"** — A JavaScript library for building UIs with a component-based, declarative model and a virtual DOM for efficient updates.
- **"Is React a framework?"** — No. It is a view library. Frameworks like Next.js build on top of React.
- **"React vs vanilla JS?"** — Vanilla JS manipulates the DOM directly; React describes UI as a function of state and updates efficiently.

---

## Key Takeaways

- React is a **library** for building user interfaces with **components**.
- It uses a **declarative** model and **Virtual DOM** for performance.
- You need **HTML, CSS, and JavaScript** as prerequisites.
- This module walks from basics through hooks to a mini project.
