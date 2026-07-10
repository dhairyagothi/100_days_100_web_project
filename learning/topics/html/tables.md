# HTML Tables

Tables represent data in rows and columns. Use semantic table elements so the structure is understandable for everyone.

---

## 1. When should you use a table?

Use tables for:
- schedules
- comparison data
- structured rows/columns

Avoid using tables for layout. For layout, prefer CSS grid or flexbox.

---

## 2. Core table elements

Common elements:
- `<table>` container
- `<caption>` description (optional but helpful)
- `<thead>` header group
- `<tbody>` body group
- `<tr>` row
- `<th>` header cell
- `<td>` data cell

---

## 3. Practical example: a simple data table

```html
<table>
  <caption>Menu for today</caption>
  <thead>
    <tr>
      <th>Item</th>
      <th>Calories</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Veggie bowl</td>
      <td>480</td>
    </tr>
    <tr>
      <td>Fruit cup</td>
      <td>220</td>
    </tr>
  </tbody>
</table>
```

---

## 4. Accessibility tip: headers

If your table includes a complex layout, use `th` cells and keep header rows in `<thead>` so assistive technologies can interpret relationships.

---

> [!NOTE]
> A good table is readable even before CSS. Make the raw structure correct first, then style it.

---

## 5. Coding Exercise: build a table

### Task:

Create a table with:
- a caption
- one header row with two columns using `<th>`
- two body rows using `<td>`

##### Solution

```html
<table>
  <caption>Quick stats</caption>
  <thead>
    <tr>
      <th>Metric</th>
      <th>Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Tasks</td>
      <td>12</td>
    </tr>
    <tr>
      <td>Status</td>
      <td>In progress</td>
    </tr>
  </tbody>
</table>
```

