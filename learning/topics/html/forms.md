# HTML Forms & Input

Forms let users submit data to a server or handle it in the browser. Understanding `label`, `name`, and input types is key.

---

## 1. The `<form>` element

The `<form>` element groups controls and defines how submission works.

Common attributes:
- `action`: where data goes
- `method`: `get` or `post`

For many demos, you can use a placeholder `action` and handle submission with JavaScript later.

---

## 2. Labels and `name`

Each input should have:
- a `<label>` for accessibility
- a `name` attribute so the submitted data includes that field

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" />
```

---

## 3. Common input types

Examples:
- `text`, `email`, `password`
- `number`
- `checkbox`, `radio`
- `date`
- `submit` via `<button type="submit">`

---

## 4. Practical example: simple contact form

```html
<form action="/submit" method="post">
  <label for="message">Message</label>
  <textarea id="message" name="message" rows="4"></textarea>

  <button type="submit">Send</button>
</form>
```

---

> [!TIP]
> Always make labels visible (not just placeholders) and pair them using `for` and `id`.

---

## 5. Coding Exercise: login form

### Task:

Create a login form with:
- email input (`type="email"`)
- password input (`type="password"`)
- a submit button
- labels for both inputs

##### Solution

```html
<form action="/login" method="post">
  <label for="login-email">Email</label>
  <input id="login-email" name="email" type="email" required />

  <label for="login-password">Password</label>
  <input id="login-password" name="password" type="password" required />

  <button type="submit">Log in</button>
</form>
```

