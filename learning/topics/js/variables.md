# Variables & Scope

Variables store values in memory so your JavaScript can use and update them.

In this lesson: you will learn `let` vs `const`, and how **scope** determines where a variable can be accessed.

---

## 1. Declaring variables

JavaScript provides:
- `const`: variable cannot be reassigned
- `let`: can be reassigned (recommended for most cases)
- `var`: older style (avoid unless you know why)

```javascript
const appName = "Antigravity";
let count = 0;
```

---

## 2. Scope (global, function, block)

Scope controls where a variable exists.
- **Global scope**: variables in the top-level script
- **Function scope**: variables inside a function
- **Block scope**: variables inside `{ ... }` blocks (like `if`, `for`, `while`)

```javascript
if (true) {
  let x = 10; // x exists only inside this block
}
// x is not accessible here
```

---

## 3. Why this matters

Scope bugs often appear when:
- you expect a variable to persist, but it is inside a block
- you accidentally redeclare a variable with `var`

---

> [!NOTE]
> Use `const` by default, and switch to `let` only when you need reassignment.

---

## 4. Practical example: a safe counter

```javascript
function makeCounter() {
  let count = 0;
  return () => {
    count++;
    return count;
  };
}

const next = makeCounter();
next(); // 1
next(); // 2
```

---

## 5. Coding Exercise: compare scoping behavior

### Task:

Write a small snippet that:
- defines `let total = 0;`
- loops from `0` to `2`
- inside the loop, updates `total`

##### Solution

```javascript
let total = 0;

for (let i = 0; i < 3; i++) {
  total = total + i; // 0 + 1 + 2
}

console.log(total); // 3
```

