# CSS Grid Layout

CSS Grid is a 2D layout system. It lets you create rows and columns and place elements into them predictably.

---

## 1. Grid container vs grid items

You enable grid on a container:
- `display: grid;`

Then the children become grid items that you can position using grid lines or areas.

---

## 2. Defining columns and rows

Example:

```css
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
}
```

---

## 3. Placing items

You can place items using:
- `grid-column: ...`
- `grid-row: ...`

Example:

```css
.sidebar { grid-column: 1; }
.content { grid-column: 2; }
```

---

## 4. Practical example: a sidebar + content layout

```css
.page {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
}
```

---

> [!TIP]
> Start with `grid-template-columns` and `gap`. Once things look right, add more advanced placement if needed.

---

## 5. Coding Exercise: build a 2x3 grid

### Task:

Create a grid container that has:
- 3 columns
- 2 rows
- `gap: 12px`

Then assign:
- `.item-a` to row 1, col 1
- `.item-b` to row 1, col 2

##### Solution

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 12px;
}

.item-a { grid-column: 1; grid-row: 1; }
.item-b { grid-column: 2; grid-row: 1; }
```

