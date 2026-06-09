# Mini Project Overview

Apply everything you have learned by building a **Task Tracker** mini application—a practical capstone that combines components, state, events, lists, forms, and optional API integration.

---

## 1. Project Goals

You will build an app where users can:

- Add new tasks with a text input
- Mark tasks as complete
- Delete tasks
- Filter by All / Active / Completed
- (Stretch) Persist tasks to `localStorage` or a mock API

---

## 2. Features Breakdown

| Feature | React Concepts Used |
| :--- | :--- |
| Task list display | `map()`, **keys**, **props** |
| Add task form | **Controlled inputs**, **events** |
| Toggle complete | **State**, immutable array updates |
| Delete task | **Event handlers**, filter state |
| Filter tabs | **Conditional rendering** |
| Save on refresh | **useEffect**, `localStorage` |

---

## 3. Suggested Component Architecture

<div class="vector-flowchart">
  <svg viewBox="0 0 580 280" width="100%">
    <rect x="220" y="10" width="140" height="40" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="290" y="35" text-anchor="middle" class="svg-text svg-text-heading">App</text>

    <path d="M 260 50 L 120 90" class="svg-line" />
    <path d="M 290 50 L 290 90" class="svg-line" />
    <path d="M 320 50 L 460 90" class="svg-line" />

    <rect x="60" y="90" width="120" height="40" rx="6" class="svg-node" />
    <text x="120" y="115" text-anchor="middle" class="svg-text">AddTaskForm</text>

    <rect x="230" y="90" width="120" height="40" rx="6" class="svg-node" />
    <text x="290" y="115" text-anchor="middle" class="svg-text">FilterBar</text>

    <rect x="400" y="90" width="120" height="40" rx="6" class="svg-node" />
    <text x="460" y="115" text-anchor="middle" class="svg-text">TaskStats</text>

    <path d="M 290 130 L 290 170" class="svg-line" />

    <rect x="230" y="170" width="120" height="40" rx="6" class="svg-node" />
    <text x="290" y="195" text-anchor="middle" class="svg-text">TaskList</text>

    <path d="M 290 210 L 290 240" class="svg-line" />

    <rect x="230" y="240" width="120" height="35" rx="6" class="svg-node" style="stroke: #61dafb;" />
    <text x="290" y="262" text-anchor="middle" class="svg-text">TaskItem</text>
  </svg>
</div>

**State lives in `App`** and flows down via props; callbacks flow up to modify tasks.

---

## 4. Data Model

```jsx
const initialTasks = [
  { id: '1', text: 'Learn JSX', done: false },
  { id: '2', text: 'Build components', done: true },
];

// New task shape
{ id: crypto.randomUUID(), text: 'New task', done: false }
```

---

## 5. Starter Implementation Sketch

```jsx
import { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');

  function addTask(text) {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, done: false },
    ]);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const visible = tasks.filter((t) => {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });

  return (
    <div className="app">
      <h1>Task Tracker</h1>
      <AddTaskForm onAdd={addTask} />
      <FilterBar filter={filter} onFilterChange={setFilter} />
      <TaskList tasks={visible} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  );
}
```

---

## 6. Stretch Goals

1. **localStorage persistence** with `useEffect`
2. **Edit task** inline on double-click
3. **Dark mode toggle** using CSS variables
4. **Fetch initial tasks** from JSONPlaceholder or a local `db.json`
5. Deploy to **Vercel** or **Netlify**

---

## 7. Project Checklist

- [ ] Vite React project created and runs locally
- [ ] At least 4 components with clear props
- [ ] Controlled form for adding tasks
- [ ] List rendering with stable `key={task.id}`
- [ ] Immutable state updates (no `.push` on state array)
- [ ] Filter UI with conditional rendering
- [ ] Loading/error states if using API
- [ ] Responsive CSS (mobile-friendly layout)

---

## 8. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Build one feature at a time—add, then toggle, then delete, then filter.</li>
      <li>Commit to Git after each working milestone.</li>
      <li>Style incrementally to match your design system.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Putting all logic in one 300+ line App file.</li>
      <li>Forgetting empty-state UI ("No tasks yet").</li>
      <li>Using array index as key when deleting/reordering tasks.</li>
    </ul>
  </div>
</div>

---

## 9. Coding Exercise: Complete the TaskItem

### Task:

Implement `TaskItem` that shows checkbox, task text (line-through if done), and a Delete button.

##### Solution

```jsx
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.done ? 'done' : ''}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
        {task.text}
      </span>
      <button type="button" onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}
```

---

## Interview Tips

- **"Describe a React project you built."** — Walk through component tree, state location, data flow, and one challenge you solved.
- **"How would you add authentication?"** — Context or auth library, protected routes, token in httpOnly cookie (preferred over localStorage for tokens).
- **"How to deploy?"** — `npm run build`, host `dist/` on Vercel/Netlify/GitHub Pages.

---

## Key Takeaways

- The **Task Tracker** reinforces the full React fundamentals path.
- Use a clear **component hierarchy** with state in `App`.
- Follow the **checklist** and stretch goals to deepen skills.
- You are ready to explore **React Router**, **Context**, and production frameworks like **Next.js** next.
