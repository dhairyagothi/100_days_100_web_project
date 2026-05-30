# Event Handling

Events are signals from the browser (like clicks, typing, or form submissions). JavaScript can listen to events and update the UI.

---

## 1. Add an event listener

Use `addEventListener`:

```javascript
const btn = document.getElementById("incrementBtn");

btn.addEventListener("click", () => {
  console.log("Clicked!");
});
```

---

## 2. The event object

The listener can receive an `event` object:

```javascript
btn.addEventListener("click", (event) => {
  console.log(event.type); // "click"
});
```

---

## 3. Common event types for learning

- `click`
- `input` (fires while typing)
- `change` (fires when a control loses focus)
- `submit` (for forms)

---

## 4. Practical example: input updates a preview

```javascript
const input = document.getElementById("nameInput");
const preview = document.getElementById("namePreview");

input.addEventListener("input", () => {
  preview.textContent = input.value;
});
```

---

> [!WARNING]
> Avoid heavy work inside frequent events like `input`. Keep handlers fast.

---

## 5. Coding Exercise: click counter

### Task:

Create a script that:
- selects `#counter` (a span)
- selects `#incrementBtn` (a button)
- increments the counter by 1 on each click

##### Solution

```html
<span id="counter">0</span>
<button id="incrementBtn">Increment</button>
```

```javascript
const counterSpan = document.getElementById("counter");
const incrementBtn = document.getElementById("incrementBtn");

let count = 0;

incrementBtn.addEventListener("click", () => {
  count++;
  counterSpan.textContent = String(count);
});
```

