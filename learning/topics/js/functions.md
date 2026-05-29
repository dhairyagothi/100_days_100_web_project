# Functions & Arrow Syntax

Functions group reusable logic. They take inputs (parameters), run code, and may return an output.

---

## 1. Function declarations

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

---

## 2. Function parameters and return values

If a function returns a value, the caller can use it:

```javascript
const result = greet("Antigravity");
```

---

## 3. Arrow functions

Arrow functions are a shorter syntax:

```javascript
const add = (a, b) => a + b;
```

When the body has more than a single expression:

```javascript
const add = (a, b) => {
  return a + b;
};
```

---

## 4. Practical example: callback-style function

```javascript
function applyToArray(arr, fn) {
  const out = [];
  for (const item of arr) {
    out.push(fn(item));
  }
  return out;
}

const doubled = applyToArray([1, 2, 3], (n) => n * 2);
console.log(doubled); // [2, 4, 6]
```

---

> [!TIP]
> If you pass a function into another function, name the parameter like `fn` or `callback` to keep intent clear.

---

## 5. Coding Exercise: format full name

### Task:

Write a function `formatFullName(first, last)` that returns:
- `first` and `last` separated by a single space
- trims extra spaces around inputs

##### Solution

```javascript
function formatFullName(first, last) {
  const f = String(first).trim();
  const l = String(last).trim();
  return `${f} ${l}`;
}

console.log(formatFullName("  Vasud ", "  Rao")); // "Vasud Rao"
```

