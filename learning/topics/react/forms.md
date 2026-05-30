# Forms

React forms are usually **controlled components**—form input values are driven by React state so you have a single source of truth for submission and validation.

---

## 1. Controlled Inputs

The input `value` is tied to state; `onChange` updates state:

```jsx
import { useState } from 'react';

function SignupForm() {
  const [email, setEmail] = useState('');

  return (
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="you@example.com"
    />
  );
}
```

---

## 2. Multiple Fields

Group related fields in one state object or separate `useState` calls:

```jsx
function ContactForm() {
  const [form, setForm] = useState({ name: '', message: '' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <textarea name="message" value={form.message} onChange={handleChange} />
    </form>
  );
}
```

---

## 3. Handling Submit

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ email, password });
    // call API or update parent state
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Log in</button>
    </form>
  );
}
```

---

## 4. Select, Checkbox, Radio

```jsx
function Preferences() {
  const [role, setRole] = useState('user');
  const [agreed, setAgreed] = useState(false);

  return (
  <>
    <select value={role} onChange={(e) => setRole(e.target.value)}>
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>

    <label>
      <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
      I agree to terms
    </label>
  </>
  );
}
```

> [!TIP]
> **Pro Tip**: For large forms, libraries like React Hook Form reduce boilerplate while keeping good performance.

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Always call <code>preventDefault</code> on submit for SPA behavior.</li>
      <li>Validate on submit and optionally on blur for better UX.</li>
      <li>Disable submit button while async request is in flight.</li>
      <li>Show accessible error messages near fields.</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Mixing controlled and uncontrolled inputs (missing <code>value</code>).</li>
      <li>Forgetting <code>name</code> when using generic change handlers.</li>
      <li>Not resetting form state after successful submission.</li>
    </ul>
  </div>
</div>

---

## 6. Coding Exercise: Registration Form

### Task:

Build a form with `username` and `password` fields that logs the values on submit (no page reload).

##### Solution

```jsx
import { useState } from 'react';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ username, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}
```

---

## Interview Tips

- **"Controlled vs uncontrolled?"** — Controlled: React state owns the value; uncontrolled: DOM holds the value (refs).
- **"Why controlled components?"** — Predictable validation, instant UI feedback, single source of truth.
- **"How to handle many inputs?"** — One handler with `name` + spread state, or form libraries.

---

## Key Takeaways

- Tie inputs to **state** with `value` + `onChange`.
- Use **`onSubmit`** and **`preventDefault`** for forms.
- Handle **checkbox** with `checked` and `e.target.checked`.
- Validate and provide **accessible** error feedback.
