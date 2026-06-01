# CSS Box Model

Every element is drawn as a box. The **box model** explains how CSS properties like `padding` and `margin` create space around elements.

---

## 1. The four layers

From the inside out:
1. **Content** (where text and child elements appear)
2. **Padding** (space between content and border)
3. **Border** (the edge around the padding)
4. **Margin** (space outside the border, separating elements)

---

## 2. A simple visual mental model

If you set:
- `padding: 16px`
- `border: 2px solid ...`
- `margin: 12px`

then the browser will allocate those spaces in that order.

---

## 3. `box-sizing`: content-box vs border-box

Default: `content-box`
- `width` controls only the content area.

Common alternative: `border-box`
- `width` controls the content + padding + border.

```css
/* Usually helps make layouts more predictable */
*, *::before, *::after {
  box-sizing: border-box;
}
```

---

## 4. Practical example: sizing a card

```css
.card {
  width: 320px;
  padding: 16px;
  border: 1px solid rgba(59, 130, 246, 0.35);
  margin: 12px 0;
}
```

---

> [!NOTE]
> If your layout seems "off by a few pixels", it is often the box model (padding/border) adding to your expected width/height.

---

## 5. Coding Exercise: predict size with `border-box`

### Task:

Create CSS for `.box` with:
- `width: 200px`
- `padding: 20px`
- `border: 4px solid #3b82f6`
- `box-sizing: border-box`

##### Solution

```css
.box {
  width: 200px;
  padding: 20px;
  border: 4px solid #3b82f6;
  box-sizing: border-box;
}
```

