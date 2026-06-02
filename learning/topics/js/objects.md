# Objects & JSON

Objects group related properties under a single name. JSON is a text format for exchanging data between systems.

---

## 1. Creating objects

Use object literals:

```javascript
const user = {
  name: "Vasud",
  role: "Learner",
  active: true
};
```

---

## 2. Accessing properties

Dot notation:
```javascript
console.log(user.name);
```

Bracket notation:
```javascript
console.log(user["role"]);
```

Bracket notation is useful for dynamic keys.

---

## 3. Updating objects

```javascript
user.active = false;
user["score"] = 120;
```

---

## 4. JSON: parse and stringify

`JSON.stringify` turns an object into a JSON string.
`JSON.parse` turns a JSON string into an object.

```javascript
const obj = { hello: "world", n: 3 };
const jsonText = JSON.stringify(obj);

const restored = JSON.parse(jsonText);
console.log(restored.hello); // "world"
```

---

> [!IMPORTANT]
> JSON requires double quotes for strings. JavaScript objects can use unquoted keys in many cases, but JSON cannot.

---

## 5. Coding Exercise: user object -> JSON

### Task:

Create:
- a `user` object with `name` and `theme`
- a JSON string using `JSON.stringify`
- parse it back using `JSON.parse`

##### Solution

```javascript
const user = { name: "Vasud", theme: "dark" };

const text = JSON.stringify(user);
const parsed = JSON.parse(text);

console.log(parsed.name); // "Vasud"
```

