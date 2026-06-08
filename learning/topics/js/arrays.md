# Arrays & Array Methods

Arrays store ordered lists of values. JavaScript includes many helpful array methods for mapping, filtering, and reducing data.

---

## 1. Creating arrays

```javascript
const nums = [1, 2, 3];
const names = new Array("A", "B");
```

---

## 2. Access and update

```javascript
console.log(nums[0]); // 1
nums[2] = 10;
```

---

## 3. Common methods: `forEach`, `map`, `filter`, `reduce`

- `forEach`: run a function for each item (no new array returned)
- `map`: transform each item into a new array
- `filter`: keep items that match a condition
- `reduce`: combine values into a single result

---

## 4. Practical example: transform + filter

```javascript
const nums = [1, 2, 3, 4, 5];

const squares = nums.map((n) => n * n);
const evens = nums.filter((n) => n % 2 === 0);

console.log(squares); // [1, 4, 9, 16, 25]
console.log(evens);  // [2, 4]
```

---

> [!NOTE]
> `map` and `filter` return new arrays. `forEach` does not.

---

## 5. Coding Exercise: sum of squares + evens

### Task:

Given `arr = [1, 2, 3, 4, 5]`:
- compute the sum of squares
- create a new array containing only even numbers

##### Solution

```javascript
const arr = [1, 2, 3, 4, 5];

const squares = arr.map((n) => n * n);
const sumOfSquares = squares.reduce((acc, n) => acc + n, 0);

const evens = arr.filter((n) => n % 2 === 0);

console.log(sumOfSquares); // 55
console.log(evens); // [2, 4]
```

