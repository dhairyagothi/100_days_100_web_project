# CSS Selectors & Specificity

Selectors tell the browser which elements to style. When multiple rules apply, **specificity** decides which one wins.

---

## 1. Basic selector types

Common selectors:
- Element: `p { ... }`
- Class: `.card { ... }`
- ID: `#main { ... }`
- Attribute: `input[type="email"] { ... }`
- Pseudo-class (state): `a:hover { ... }`

---

## 2. Combinators (how selectors relate)

Combinators decide relationships:
- Descendant: `nav a` (any `a` inside `nav`)
- Child: `nav > a` (direct children only)

---

## 3. Specificity rules (the practical mental model)

Specificity roughly follows this order:
1. Inline styles (`style="..."`)
2. ID selectors (`#id`)
3. Class/attribute/pseudo-class selectors (`.c`, `[type=...]`, `:hover`)
4. Element selectors (`p`, `div`)

If rules have equal specificity, the later rule in the CSS file usually wins.

---

## 4. Practical example: avoid surprises

```css
/* More specific because of class */
.card {
  border: 1px solid #3b82f6;
}

/* Less specific than .card */
div {
  border: 1px solid #999;
}
```

If you later add:

```css
#special {
  border-color: #10b981;
}
```
The `#special` border will win because IDs outrank classes.

---

> [!NOTE]
> Prefer class selectors for scalable styling. Use IDs sparingly when you truly need them.

---

## 5. Coding Exercise: selector practice

### Task:

Create CSS rules that:
- style navigation links with a class `.nav-link`
- change link color on hover
- apply a different background to only the element with `id="menu"`

##### Solution

```css
#menu {
  background: rgba(59, 130, 246, 0.08);
}

.nav-link {
  color: #3b82f6;
  text-decoration: none;
}

.nav-link:hover {
  color: #10b981;
}
```

