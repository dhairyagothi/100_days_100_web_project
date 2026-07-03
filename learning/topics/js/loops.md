# Loops & Iteration

Loops let you repeat work. They are especially useful when you process lists (arrays) or keep trying until a condition becomes true.

---

## 1. `for`, `while`, and `do...while`

`for` is common when you know how many iterations you want:

```javascript
for (let i = 0; i < 3; i++) {
  console.log(i);
}
```

`while` runs until a condition becomes false:

```javascript
let n = 3;
while (n > 0) {
  n--;
}
```

---

## 2. `for...of` for arrays

`for...of` iterates directly over values:

```javascript
const arr = [10, 20, 30];
for (const value of arr) {
  console.log(value);
}
```

---

## 3. `break` and `continue`

- `break` exits the loop immediately
- `continue` skips the rest of the loop body for the current iteration

---

## 4. Practical example: find the first match

```javascript
function firstGreaterThan(arr, n) {
  for (const value of arr) {
    if (value > n) return value;
  }
  return null;
}
```

---

> [!NOTE]
> When you break early, you can often reduce work by returning as soon as you find the result.

---

## 5. Coding Exercise: first value > N

### Task:

Given `arr = [2, 5, 1, 9, 3]` and `N = 4`, return the first value greater than `N`.

##### Solution

```javascript
function firstGreaterThan(arr, n) {
  for (const value of arr) {
    if (value > n) return value;
  }
  return null;
}

console.log(firstGreaterThan([2, 5, 1, 9, 3], 4)); // 5
```

