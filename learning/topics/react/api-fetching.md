# API Fetching Basics

Most React apps load data from **REST APIs** or **GraphQL** backends. This lesson covers fetching with `fetch`, managing loading/error states, and integrating with `useEffect`.

---

## 1. The fetch API

`fetch` returns a Promise that resolves to a **Response** object:

```jsx
async function getPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
}
```

---

## 2. Fetching in useEffect

```jsx
import { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        setLoading(true);
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        if (!cancelled) setPosts(data.slice(0, 5));
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPosts();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

<div class="vector-flowchart">
  <svg viewBox="0 0 580 120" width="100%">
    <rect x="20" y="40" width="90" height="40" rx="6" class="svg-node" />
    <text x="65" y="65" text-anchor="middle" class="svg-text" style="font-size: 9px;">Mount</text>

    <path d="M 110 60 L 150 60" class="svg-line" />
    <polygon points="150,60 144,56 144,64" class="svg-marker" />

    <rect x="150" y="40" width="90" height="40" rx="6" class="svg-node" />
    <text x="195" y="65" text-anchor="middle" class="svg-text" style="font-size: 9px;">loading</text>

    <path d="M 240 60 L 280 60" class="svg-line" />
    <polygon points="280,60 274,56 274,64" class="svg-marker" />

    <rect x="280" y="40" width="90" height="40" rx="6" class="svg-node" />
    <text x="325" y="65" text-anchor="middle" class="svg-text" style="font-size: 9px;">fetch API</text>

    <path d="M 370 60 L 410 60" class="svg-line" />
    <polygon points="410,60 404,56 404,64" class="svg-marker" />

    <rect x="410" y="25" width="90" height="30" rx="6" class="svg-node" style="stroke: #10b981;" />
    <text x="455" y="45" text-anchor="middle" class="svg-text" style="font-size: 9px;">success</text>

    <rect x="410" y="65" width="90" height="30" rx="6" class="svg-node" style="stroke: #ef4444;" />
    <text x="455" y="85" text-anchor="middle" class="svg-text" style="font-size: 9px;">error</text>
  </svg>
</div>

---

## 3. POST Requests

```jsx
async function createPost(title, body) {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, userId: 1 }),
  });
  return response.json();
}
```

Call from an event handler (not necessarily on mount):

```jsx
async function handleSubmit(e) {
  e.preventDefault();
  setSaving(true);
  try {
    const newPost = await createPost(title, body);
    setPosts((prev) => [newPost, ...prev]);
  } finally {
    setSaving(false);
  }
}
```

---

## 4. Environment Variables

Store API base URLs in `.env` (Vite requires `VITE_` prefix):

```env
VITE_API_URL=https://api.example.com
```

```jsx
const baseUrl = import.meta.env.VITE_API_URL;
fetch(`${baseUrl}/users`);
```

> [!WARNING]
> Never expose private API keys in frontend env vars—anything in the client bundle is visible to users.

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Always handle <strong>loading</strong>, <strong>error</strong>, and <strong>empty</strong> states.</li>
      <li>Cancel or ignore stale responses when dependencies change.</li>
      <li>Centralize fetch logic in service modules.</li>
      <li>Consider libraries like TanStack Query for caching and retries.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Assuming <code>fetch</code> throws on 404/500 (only network errors throw).</li>
      <li>Race conditions when user navigates before fetch completes.</li>
      <li>Fetching in render instead of effect or event handler.</li>
    </ul>
  </div>
</div>

---

## 6. Coding Exercise: User Profile Loader

### Task:

Fetch a single user from `https://jsonplaceholder.typicode.com/users/1` and display `name` and `email`. Handle loading and error.

##### Solution

```jsx
import { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(setUser)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## Interview Tips

- **"fetch vs axios?"** — `fetch` is built-in; axios adds interceptors, defaults, and simpler JSON handling.
- **"Where to fetch?"** — `useEffect` on mount, event handlers for user actions, or data libraries (React Query).
- **"CORS?"** — Browser security; server must allow your origin for cross-domain requests.

---

## Key Takeaways

- Use **`fetch`** with **`async/await`** inside effects or handlers.
- Model **loading, error, and success** UI states explicitly.
- **Cancel/ignore** stale requests when components unmount or deps change.
- Keep API logic in **service modules** and secrets off the client.
