# Responsive Design & Media Queries

Responsive design makes your UI usable across different screen sizes and input methods. Media queries let you apply CSS rules conditionally.

---

## 1. The goal: layout that adapts

Instead of making one layout fit all screens, you:
- build a default layout (for small screens first, or large screens first)
- add overrides at key breakpoints

---

## 2. Basic media query syntax

```css
@media (max-width: 600px) {
  .layout {
    flex-direction: column;
  }
}
```

Common breakpoint patterns:
- `max-width`: apply when the screen is smaller than a limit
- `min-width`: apply when the screen is larger than a limit

---

## 3. Responsive units (quick reminders)

You can use:
- percentages (`%`) for widths
- `rem` for font sizes
- `clamp()` for sizing that scales smoothly

---

## 4. Practical example: stack on small screens

```css
.feature-list {
  display: flex;
  gap: 16px;
}

@media (max-width: 720px) {
  .feature-list {
    flex-direction: column;
  }
}
```

---

> [!TIP]
> Choose breakpoints based on where the layout actually breaks, not based on device brand names.

---

## 5. Coding Exercise: responsive layout stacking

### Task:

Create CSS rules so that:
- `.cards` is a row layout by default
- when the viewport is `<= 600px`, `.cards` stacks vertically

##### Solution

```css
.cards {
  display: flex;
  gap: 16px;
}

@media (max-width: 600px) {
  .cards {
    flex-direction: column;
  }
}
```

