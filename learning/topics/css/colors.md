# Colors & Backgrounds

Color is more than aesthetics: it affects readability, hierarchy, and user focus. In CSS, you can choose colors using several formats and create rich backgrounds with gradients.

---

## 1. Color formats (common ones)

You can write colors as:
- HEX: `#3b82f6`
- RGB: `rgb(59, 130, 246)`
- HSL: `hsl(210, 90%, 60%)`

For dynamic themes, you can also rely on CSS variables.

---

## 2. Background layers

The `background` family of properties can set:
- `background-color`
- `background-image`
- `background-size`, `background-position`
- gradients

Example: gradient card background

```css
.card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(16, 185, 129, 0.10));
}
```

---

## 3. Practical example: accessible contrast

If your background is light, text should be darker and vice versa. A quick rule: pick a text color that stays readable against the background even when opacity changes.

---

> [!TIP]
> When experimenting, start with simple solid colors. Add gradients and transparency once the layout and text contrast feel right.

---

## 4. Coding Exercise: gradient background

### Task:

Create CSS for:
- `.pricing-card` with a subtle diagonal gradient
- `color` on headings inside the card

##### Solution

```css
.pricing-card {
  padding: 1.25rem;
  border-radius: 12px;
  background: linear-gradient(140deg, rgba(59, 130, 246, 0.18), rgba(244, 63, 94, 0.10));
}

.pricing-card h3 {
  color: #111827;
}
```

