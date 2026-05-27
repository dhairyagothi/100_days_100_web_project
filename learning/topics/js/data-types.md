# Data Types & Operators

Data types describe what kind of value a variable holds. Operators let you compute new values using those data.

---

## 1. Common JavaScript primitive types

Some widely used primitives:
- `number`: 1, 3.14
- `string`: "hello"
- `boolean`: true / false
- `null`: intentional "no value"
- `undefined`: missing value

---

## 2. `typeof` is your quick check

```javascript
typeof 123;       // "number"
typeof "abc";    // "string"
typeof true;     // "boolean"
typeof undefined;// "undefined"
typeof null;     // "object" (historical quirk)
```

---

## 3. Operators you will use daily

- Arithmetic: `+`, `-`, `*`, `/`, `%`
- Comparison: `===`, `!==`, `<`, `>`
- Logical: `&&`, `||`, `!`
- Ternary: `condition ? a : b`

Truthiness note:
- values like `0`, `""`, `null`, and `undefined` are treated as falsy
- most other values are truthy

---

## 4. Practical example: validate input

```javascript
function isAdult(age) {
  return Number(age) >= 18;
}

console.log(isAdult("18")); // true
console.log(isAdult("17")); // false
```

---

> [!WARNING]
> Prefer `===` and `!==` for comparisons. It avoids unexpected type coercion.

---

## 5. Coding Exercise: evaluate an expression

### Task:

Write an expression that returns:
- `"Allowed"` if `score` is at least `50`
- otherwise `"Try again"`

##### Solution

```javascript
const message = (score >= 50) ? "Allowed" : "Try again";
console.log(message);
```

