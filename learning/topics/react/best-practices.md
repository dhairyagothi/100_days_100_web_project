# Best Practices

Writing React that scales requires habits beyond syntax—**component design**, **performance awareness**, **accessibility**, and **testing mindset** matter from day one.

---

## 1. Component Design Principles

### Single Responsibility

Each component should do one job well:

```jsx
// Good — focused components
function UserAvatar({ src, alt }) {
  return <img src={src} alt={alt} className="avatar" />;
}

function UserName({ name }) {
  return <h3>{name}</h3>;
}

function UserCard({ user }) {
  return (
    <article>
      <UserAvatar src={user.avatar} alt={user.name} />
      <UserName name={user.name} />
    </article>
  );
}
```

### Composition Over Configuration

Prefer `children` and small composable pieces over giant prop lists.

---

## 2. State Management Guidelines

| Guideline | Reason |
| :--- | :--- |
| Colocate state | Keep state as close to where it is used as possible |
| Lift only when needed | Share state at lowest common ancestor |
| Avoid redundant state | Derive values during render when possible |
| Immutable updates | Ensures predictable re-renders |

```jsx
// Derived — no extra state needed
const fullName = `${firstName} ${lastName}`;
```

---

## 3. Performance Basics

You do not need premature optimization, but avoid obvious pitfalls:

```jsx
// Expensive filter — memoize if list is huge
import { useMemo } from 'react';

const visibleTodos = useMemo(
  () => todos.filter((t) => t.matchesFilter),
  [todos, filter]
);
```

| Tool | Use when |
| :--- | :--- |
| `React.memo` | Child re-renders often with same props |
| `useMemo` | Expensive calculations |
| `useCallback` | Stable function refs for memoized children |
| Code splitting | Large routes (`React.lazy`) |

> [!NOTE]
> Do not wrap everything in `memo`—measure first. Most apps are fast enough without heavy optimization.

---

## 4. Accessibility (a11y)

```jsx
<button type="button" aria-label="Close dialog" onClick={onClose}>
  <span aria-hidden="true">&times;</span>
</button>

<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

- Use semantic HTML (`button`, `nav`, `main`)
- Provide **labels** for inputs
- Ensure **keyboard** navigation works
- Test with screen readers when possible

---

## 5. Testing & Code Quality

| Practice | Benefit |
| :--- | :--- |
| ESLint + React plugin | Catches hooks mistakes |
| Prettier | Consistent formatting |
| React Testing Library | Tests behavior users see |
| TypeScript (optional) | Catches prop/type errors early |

```jsx
// Testing Library example mindset
// render(<Counter />); user clicks button; expect screen to show "1"
```

---

## 6. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Use keys correctly in lists; avoid index keys for dynamic lists.</li>
      <li>Keep side effects in <code>useEffect</code>, not in render.</li>
      <li>Extract custom hooks for repeated logic.</li>
      <li>Read the official React docs—patterns evolve (e.g. React 19 features).</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Overusing global state for local UI concerns.</li>
      <li>Copy-pasting large components instead of composing.</li>
      <li>Ignoring loading/error states in production UIs.</li>
      <li>Disabling ESLint rules instead of fixing root causes.</li>
    </ul>
  </div>
</div>

> [!TIP]
> **Pro Tip**: Review your component tree periodically—if a file is hard to read, split it.

---

## 7. Coding Exercise: Refactor Checklist

### Task:

Review this anti-pattern list and write the improved approach as a comment for each:

1. Storing `items.length` in state when `items` already exists
2. Fetching inside render
3. Missing `key` on mapped list items

##### Solution

```javascript
// 1. Derive during render: const count = items.length;
// 2. Move fetch to useEffect or React Query
// 3. Add key={item.id} on the outermost element in map()
```

---

## Interview Tips

- **"How to optimize React?"** — Measure first; memoization, lazy loading, virtual lists, avoid unnecessary state.
- **"How to structure large apps?"** — Feature folders, shared UI library, clear data layer.
- **"Accessibility in React?"** — Semantic HTML, ARIA when needed, labels, focus management.

---

## Key Takeaways

- Design **small, composable** components with clear responsibilities.
- **Colocate state**, derive when possible, update **immutably**.
- Handle **loading/error**, **a11y**, and **linting** from the start.
- Optimize **only after** identifying real bottlenecks.
