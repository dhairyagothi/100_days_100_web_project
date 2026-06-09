# Lists and Keys

Rendering lists in React means mapping an array to a collection of JSX elements. Each item needs a stable **`key`** so React can track identity across re-renders efficiently.

---

## 1. Rendering Lists with map()

```jsx
const fruits = ['Apple', 'Banana', 'Cherry'];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}
```

For objects, use a unique id:

```jsx
const users = [
  { id: 1, name: 'Alex' },
  { id: 2, name: 'Sam' },
];

function UserList() {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 2. Why Keys Matter

Keys help React identify which items changed, were added, or removed:

<div class="vector-flowchart">
  <svg viewBox="0 0 580 120" width="100%">
    <text x="80" y="20" text-anchor="middle" class="svg-text" style="font-weight: bold;">Before</text>
    <rect x="20" y="30" width="120" height="35" rx="6" class="svg-node" />
    <text x="80" y="52" text-anchor="middle" class="svg-text">key: 1 A</text>
    <rect x="20" y="75" width="120" height="35" rx="6" class="svg-node" />
    <text x="80" y="97" text-anchor="middle" class="svg-text">key: 2 B</text>

    <path d="M 160 60 L 220 60" class="svg-line" />
    <text x="190" y="50" text-anchor="middle" class="svg-text" style="font-size: 9px;">reorder</text>
    <polygon points="220,60 214,56 214,64" class="svg-marker" />

    <text x="400" y="20" text-anchor="middle" class="svg-text" style="font-weight: bold;">After</text>
    <rect x="340" y="30" width="120" height="35" rx="6" class="svg-node" />
    <text x="400" y="52" text-anchor="middle" class="svg-text">key: 2 B</text>
    <rect x="340" y="75" width="120" height="35" rx="6" class="svg-node" />
    <text x="400" y="97" text-anchor="middle" class="svg-text">key: 1 A</text>
  </svg>
</div>

Without stable keys, React may re-create DOM nodes unnecessarily or mix up component state.

---

## 3. Rules for Keys

| Do | Don't |
| :--- | :--- |
| Use stable unique ids from data | Use array index as key when list can reorder |
| Put `key` on the outermost element in the map | Put `key` inside a child deep in the tree |
| Use `key` only in lists—not as a regular prop | Generate random keys on every render |

```jsx
// Risky when items can be inserted/deleted/reordered
{items.map((item, index) => <Row key={index} data={item} />)}

// Better
{items.map((item) => <Row key={item.id} data={item} />)}
```

---

## 4. Extracting List Items into Components

```jsx
function TodoItem({ todo, onToggle }) {
  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      {todo.text}
    </li>
  );
}

function TodoList({ todos, onToggle }) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
      ))}
    </ul>
  );
}
```

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Store list data in state and map to JSX in render.</li>
      <li>Use database or client-generated UUIDs for keys.</li>
      <li>Extract row components for readability and reuse.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Forgetting <code>key</code> (console warning).</li>
      <li>Using index keys for sortable/filterable lists.</li>
      <li>Using non-unique keys (duplicate ids).</li>
    </ul>
  </div>
</div>

---

## 6. Coding Exercise: Filtered Product List

### Task:

Given an array of products, render only those with `inStock: true`.

##### Solution

```jsx
const products = [
  { id: 1, name: 'Keyboard', inStock: true },
  { id: 2, name: 'Monitor', inStock: false },
  { id: 3, name: 'Mouse', inStock: true },
];

function InStockProducts() {
  const available = products.filter((p) => p.inStock);

  return (
    <ul>
      {available.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

---

## Interview Tips

- **"What is the key prop?"** — A hint to React about element identity in a list; not passed to the component as a prop.
- **"Index as key?"** — Acceptable only for static lists that never reorder; otherwise use stable ids.
- **"Can two siblings share a key?"** — No—keys must be unique among siblings.

---

## Key Takeaways

- Use **`.map()`** to render lists in JSX.
- Always provide **stable, unique `key`** values.
- Avoid **index keys** when the list order or length changes dynamically.
- Extract **list item components** for cleaner code.
