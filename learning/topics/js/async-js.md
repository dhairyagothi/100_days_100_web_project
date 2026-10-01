# Async JavaScript — Complete Guide from Scratch to End

---

## Table of Contents

1. Why Async JavaScript Exists
2. Synchronous vs Asynchronous
3. The Call Stack
4. The Event Loop
5. Callbacks
6. Callback Hell
7. Promises
8. Promise Chaining
9. Promise Methods
10. async / await
11. Error Handling
12. Common Mistakes
13. Real World Examples

---

## 1. Why Async JavaScript Exists

JavaScript runs in the browser. The browser does many things at once — it shows UI, handles clicks, fetches data from servers, reads files. But JavaScript itself is **single-threaded** — it can only do one thing at a time.

So the question is: what happens when JavaScript needs to wait for something slow — like fetching data from a server that takes 3 seconds?

Without async: JavaScript would freeze the entire page for 3 seconds. No clicks, no scrolling, nothing. The page is dead.

With async: JavaScript starts the slow task, moves on to do other things, and comes back when the slow task is done. Page stays alive.

That is why async JavaScript exists — to handle slow operations without freezing the page.

**Slow operations that need async:**
- Fetching data from an API
- Reading files
- Timers (setTimeout, setInterval)
- Database queries (in Node.js)
- User events (clicks, keyboard input)

---

## 2. Synchronous vs Asynchronous

### Synchronous — one after another

```js
console.log("Step 1");
console.log("Step 2");
console.log("Step 3");

// Output:
// Step 1
// Step 2
// Step 3
```

Each line waits for the previous one to finish. Simple and predictable.

### Asynchronous — don't wait, come back later

```js
console.log("Step 1");

setTimeout(() => {
  console.log("Step 2 — came back after 2 seconds");
}, 2000);

console.log("Step 3");

// Output:
// Step 1
// Step 3
// Step 2 — came back after 2 seconds
```

Step 3 runs before Step 2 because setTimeout is async. JavaScript doesn't wait for the 2 seconds — it moves on and comes back when the timer is done.

**This surprises most beginners.** Keep this example in mind — it is the foundation of everything.

---

## 3. The Call Stack

The call stack is where JavaScript keeps track of what function is currently running.

Think of it like a stack of plates:
- When a function is called → plate added on top
- When a function finishes → plate removed from top
- JavaScript always runs whatever is on top

```js
function greet(name) {
  console.log("Hello " + name);
}

function main() {
  greet("Aarav");
}

main();
```

Call stack flow:
```
1. main() is called → pushed to stack
   [main]

2. inside main, greet() is called → pushed on top
   [greet, main]

3. greet runs console.log → pushed on top
   [console.log, greet, main]

4. console.log finishes → removed
   [greet, main]

5. greet finishes → removed
   [main]

6. main finishes → removed
   []  ← stack is empty
```

**Important:** When the call stack is busy, nothing else can run. This is why long synchronous operations freeze the browser.

---

## 4. The Event Loop

The event loop is the heart of async JavaScript. It is what makes async possible.

Three parts to understand:

**Call Stack** — where code runs right now

**Web APIs** — browser features that handle async tasks (setTimeout, fetch, DOM events). These run outside of JavaScript.

**Callback Queue** — a waiting room. When an async task finishes, its callback waits here.

**Event Loop's job:** constantly check — if call stack is empty AND callback queue has something waiting → move it to the call stack and run it.

```js
console.log("Start");           // 1. goes to call stack → runs → removed

setTimeout(() => {              // 2. goes to call stack
  console.log("Timer done");    //    setTimeout hands timer to Web API → removed from stack
}, 1000);                       //    Web API starts 1 second countdown

console.log("End");             // 3. goes to call stack → runs → removed

// After 1 second:
// Web API timer finishes → callback pushed to Callback Queue
// Event loop sees: call stack empty + queue has callback
// Moves callback to call stack → runs
// Output: "Timer done"

// Final output:
// Start
// End
// Timer done
```

This is the entire mechanism behind all async JavaScript. Every async feature uses this same system.

---

## 5. Callbacks

A callback is a function passed as an argument to another function, to be called later when something finishes.

```js
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: "Aarav", age: 20 };
    callback(data); // call the function we were given
  }, 2000);
}

function handleData(data) {
  console.log("Got data:", data);
}

fetchData(handleData);
// After 2 seconds: Got data: { name: "Aarav", age: 20 }
```

Or with an anonymous function directly:

```js
fetchData(function(data) {
  console.log("Got data:", data);
});
```

Or with arrow function:

```js
fetchData((data) => {
  console.log("Got data:", data);
});
```

### Error-first callbacks (Node.js convention)

In Node.js, callbacks always have error as the first argument:

```js
function fetchUser(id, callback) {
  setTimeout(() => {
    if (id <= 0) {
      callback(new Error("Invalid ID"), null); // error first
    } else {
      callback(null, { id, name: "Aarav" }); // null error = success
    }
  }, 1000);
}

fetchUser(1, (error, user) => {
  if (error) {
    console.log("Error:", error.message);
    return;
  }
  console.log("User:", user);
});
```

---

## 6. Callback Hell

When you need to do multiple async operations in sequence — one after another — using callbacks, the code becomes deeply nested. This is called callback hell or the pyramid of doom.

```js
// Real example: login → get profile → get posts → get comments
// Each step depends on the previous one

loginUser("Aarav@email.com", "password", (error, user) => {
  if (error) {
    console.log("Login failed");
    return;
  }
  
  getUserProfile(user.id, (error, profile) => {
    if (error) {
      console.log("Profile fetch failed");
      return;
    }
    
    getUserPosts(profile.id, (error, posts) => {
      if (error) {
        console.log("Posts fetch failed");
        return;
      }
      
      getPostComments(posts[0].id, (error, comments) => {
        if (error) {
          console.log("Comments fetch failed");
          return;
        }
        
        console.log("Finally got comments:", comments);
        // → keeps going deeper and deeper
      });
    });
  });
});
```

**Problems with callback hell:**
- Hard to read — code goes right instead of down
- Hard to debug — error handling is repeated everywhere
- Hard to maintain — changing one step breaks everything
- Hard to handle errors properly

**Promises were invented to solve this.**

---

## 7. Promises

A Promise is an object that represents a value that will be available in the future. It is a placeholder for a future value.

A promise has three states:
- **Pending** — operation hasn't finished yet
- **Fulfilled** — operation succeeded, value is ready
- **Rejected** — operation failed, error is ready

```js
// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
  // do something async
  const success = true;
  
  if (success) {
    resolve("Data is ready!"); // fulfilled
  } else {
    reject(new Error("Something went wrong")); // rejected
  }
});
```

### Using a Promise

```js
myPromise
  .then((value) => {
    console.log("Success:", value); // runs if resolved
  })
  .catch((error) => {
    console.log("Error:", error.message); // runs if rejected
  })
  .finally(() => {
    console.log("Always runs — success or failure");
  });
```

### Real example — wrapping setTimeout in a Promise

```js
function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(); // no value needed, just signal completion
    }, milliseconds);
  });
}

wait(2000).then(() => {
  console.log("2 seconds passed");
});
```

### Real example — fetch API (already returns a Promise)

```js
fetch("https://api.github.com/users/Aarav")
  .then((response) => {
    return response.json(); // also returns a Promise
  })
  .then((data) => {
    console.log("Username:", data.login);
  })
  .catch((error) => {
    console.log("Fetch failed:", error);
  });
```

---

## 8. Promise Chaining

The real power of Promises — chaining .then() calls to replace callback hell.

```js
// Same login → profile → posts → comments flow
// But clean and readable

loginUser("Aarav@email.com", "password")
  .then((user) => getUserProfile(user.id))
  .then((profile) => getUserPosts(profile.id))
  .then((posts) => getPostComments(posts[0].id))
  .then((comments) => {
    console.log("Comments:", comments);
  })
  .catch((error) => {
    // ONE catch handles errors from ANY step above
    console.log("Something failed:", error.message);
  });
```

Compare this to the callback hell version above. Same logic — completely readable.

**Rules of Promise chaining:**
- Each .then() receives the return value of the previous .then()
- If you return a Promise from .then(), the next .then() waits for it
- If any step throws or rejects, it jumps straight to .catch()
- .finally() always runs at the end regardless

```js
// Returning values in chain
Promise.resolve(1)
  .then((value) => {
    console.log(value); // 1
    return value + 1;   // returning a plain value
  })
  .then((value) => {
    console.log(value); // 2
    return value + 1;
  })
  .then((value) => {
    console.log(value); // 3
  });
```

---

## 9. Promise Methods

### Promise.all() — run multiple promises at the same time, wait for ALL

```js
const p1 = fetch("/api/users");
const p2 = fetch("/api/posts");
const p3 = fetch("/api/comments");

Promise.all([p1, p2, p3])
  .then(([users, posts, comments]) => {
    // all three finished
    console.log(users, posts, comments);
  })
  .catch((error) => {
    // if ANY ONE fails, goes to catch immediately
    console.log("One of them failed:", error);
  });
```

**Use when:** tasks are independent of each other and you need all results.

**Gotcha:** if even one promise rejects, the whole Promise.all rejects. The others are ignored.

---

### Promise.allSettled() — run all, wait for ALL, don't fail if one fails

```js
Promise.allSettled([p1, p2, p3])
  .then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        console.log("Success:", result.value);
      } else {
        console.log("Failed:", result.reason);
      }
    });
  });
```

**Use when:** you want results of all promises even if some failed.

---

### Promise.race() — run all, return the FIRST one that finishes

```js
const timeout = new Promise((_, reject) => {
  setTimeout(() => reject(new Error("Timeout!")), 5000);
});

const fetchData = fetch("/api/data");

Promise.race([fetchData, timeout])
  .then((result) => {
    console.log("Got data before timeout");
  })
  .catch((error) => {
    console.log("Timed out!"); // if fetch takes more than 5 seconds
  });
```

**Use when:** you want to set a timeout on an async operation.

---

### Promise.any() — return the FIRST one that succeeds

```js
Promise.any([p1, p2, p3])
  .then((firstSuccess) => {
    console.log("First success:", firstSuccess);
  })
  .catch(() => {
    console.log("All three failed");
  });
```

**Use when:** you have multiple sources and just need any one that works (like trying multiple CDN servers).

---

## 10. async / await

async/await is syntactic sugar over Promises. It makes async code look like synchronous code. Under the hood it is still Promises — just much cleaner to write and read.

### Rules

- `async` before a function → that function always returns a Promise
- `await` inside an async function → pause and wait for a Promise to resolve
- `await` can only be used inside `async` functions

```js
// Promise version
function fetchUser() {
  return fetch("/api/user")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
}

// async/await version — same thing, cleaner
async function fetchUser() {
  const res = await fetch("/api/user");
  const data = await res.json();
  console.log(data);
}
```

### async function always returns a Promise

```js
async function greet() {
  return "Hello"; // automatically wrapped in Promise.resolve("Hello")
}

greet().then((value) => console.log(value)); // Hello
```

### await unwraps a Promise

```js
async function example() {
  const value = await Promise.resolve(42);
  console.log(value); // 42 — not a Promise, the actual value
}
```

### Full real example

```js
async function loadUserDashboard(userId) {
  const userRes = await fetch(`/api/users/${userId}`);
  const user = await userRes.json();

  const postsRes = await fetch(`/api/posts?userId=${userId}`);
  const posts = await postsRes.json();

  const commentsRes = await fetch(`/api/comments?userId=${userId}`);
  const comments = await commentsRes.json();

  return { user, posts, comments };
}

loadUserDashboard(1).then((dashboard) => {
  console.log(dashboard);
});
```

### Running promises in parallel with async/await

```js
// ❌ WRONG — runs one after another (slow)
async function slow() {
  const users = await fetch("/api/users");    // wait
  const posts = await fetch("/api/posts");    // then wait
  const comments = await fetch("/api/comments"); // then wait
  // total time = time1 + time2 + time3
}

// ✅ RIGHT — runs all at same time (fast)
async function fast() {
  const [users, posts, comments] = await Promise.all([
    fetch("/api/users"),
    fetch("/api/posts"),
    fetch("/api/comments")
  ]);
  // total time = max(time1, time2, time3)
}
```

---

## 11. Error Handling

### try/catch with async/await

```js
async function fetchData() {
  try {
    const res = await fetch("/api/data");
    
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
    
  } catch (error) {
    console.log("Error caught:", error.message);
    // handle gracefully — show error message to user
    return null;
  } finally {
    console.log("Request finished"); // always runs
  }
}
```

### Handling errors in Promise chain

```js
fetch("/api/data")
  .then((res) => {
    if (!res.ok) throw new Error("Bad response");
    return res.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log("Caught:", error.message);
  });
```

### Never swallow errors silently

```js
// ❌ BAD — error disappears, you never know what went wrong
async function bad() {
  try {
    await doSomething();
  } catch (e) {
    // empty catch — error is swallowed
  }
}

// ✅ GOOD — always do something with the error
async function good() {
  try {
    await doSomething();
  } catch (e) {
    console.error("doSomething failed:", e.message);
    // show error to user, or retry, or return fallback value
  }
}
```

---

## 12. Common Mistakes

### Mistake 1 — Forgetting await

```js
// ❌ WRONG
async function getUser() {
  const data = fetch("/api/user"); // forgot await
  console.log(data); // logs Promise object, not data
}

// ✅ RIGHT
async function getUser() {
  const data = await fetch("/api/user");
  console.log(data); // logs actual response
}
```

---

### Mistake 2 — Using await outside async function

```js
// ❌ WRONG — SyntaxError
function getUser() {
  const data = await fetch("/api/user"); // can't use await here
}

// ✅ RIGHT
async function getUser() {
  const data = await fetch("/api/user");
}
```

---

### Mistake 3 — Not handling errors

```js
// ❌ WRONG — if fetch fails, error is unhandled
async function getUser() {
  const res = await fetch("/api/user");
  const data = await res.json();
  return data;
}

// ✅ RIGHT
async function getUser() {
  try {
    const res = await fetch("/api/user");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}
```

---

### Mistake 4 — Sequential await when parallel is possible

```js
// ❌ WRONG — unnecessarily slow (3 seconds if each takes 1 second)
async function getData() {
  const a = await fetchA(); // 1 second
  const b = await fetchB(); // 1 second
  const c = await fetchC(); // 1 second
  // total: 3 seconds
}

// ✅ RIGHT — fast (1 second total)
async function getData() {
  const [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()]);
  // total: 1 second (all run at same time)
}
```

---

### Mistake 5 — Promise inside forEach (async forEach doesn't work)

```js
const userIds = [1, 2, 3];

// ❌ WRONG — forEach doesn't wait for async callbacks
userIds.forEach(async (id) => {
  const user = await fetchUser(id);
  console.log(user); // order is unpredictable
});
console.log("Done"); // this runs BEFORE users are fetched

// ✅ RIGHT — use Promise.all with map
const users = await Promise.all(
  userIds.map((id) => fetchUser(id))
);
console.log(users); // all users fetched
console.log("Done"); // runs after all fetches
```

---

### Mistake 6 — Mixing .then() and await unnecessarily

```js
// ❌ CONFUSING — mixing styles
async function getData() {
  const data = await fetch("/api/data")
    .then((res) => res.json()); // mixing await and .then()
  return data;
}

// ✅ CLEAN — pick one style and stick to it
async function getData() {
  const res = await fetch("/api/data");
  const data = await res.json();
  return data;
}
```

---

### Mistake 7 — Not checking response.ok in fetch

```js
// ❌ WRONG — fetch doesn't throw on 404 or 500 errors
async function getUser() {
  const res = await fetch("/api/user/999");
  const data = await res.json(); // this runs even on 404!
  return data;
}

// ✅ RIGHT — always check res.ok
async function getUser() {
  const res = await fetch("/api/user/999");
  
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  
  const data = await res.json();
  return data;
}
```

---

### Mistake 8 — Creating unnecessary Promises

```js
// ❌ WRONG — wrapping an already async function in new Promise
async function getData() {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fetch("/api/data");
      resolve(data);
    } catch (e) {
      reject(e);
    }
  });
}

// ✅ RIGHT — async functions already return Promises
async function getData() {
  const data = await fetch("/api/data");
  return data;
}
```

---

## 13. Real World Examples

### Example 1 — API call with loading and error state in React

```js
import { useState, useEffect } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}`);
        
        if (!res.ok) throw new Error("User not found");
        
        const data = await res.json();
        setUser(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <p>Hello, {user.name}</p>;
}
```

---

### Example 2 — Retry logic

```js
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
      
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        throw new Error(`All ${maxRetries} attempts failed`);
      }
      
      // wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * attempt)
      );
    }
  }
}

// Usage
fetchWithRetry("/api/data")
  .then((data) => console.log(data))
  .catch((err) => console.log("Completely failed:", err.message));
```

---

### Example 3 — Sequential vs Parallel fetch

```js
// Load a dashboard that needs user + posts + notifications

async function loadDashboard(userId) {
  // User must load first (we need userId for the others)
  const user = await fetchUser(userId);

  // Posts and notifications are independent — load in parallel
  const [posts, notifications] = await Promise.all([
    fetchPosts(user.id),
    fetchNotifications(user.id)
  ]);

  return { user, posts, notifications };
}
```

---

### Example 4 — Timeout wrapper

```js
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

// Usage
async function fetchData() {
  try {
    const data = await withTimeout(fetch("/api/slow-endpoint"), 5000);
    return data;
  } catch (error) {
    if (error.message === "Request timed out") {
      console.log("Server too slow");
    } else {
      console.log("Other error:", error.message);
    }
  }
}
```

---

## Quick Reference Summary

| Concept | When to use |
|---|---|
| Callbacks | Simple one-time async tasks |
| Promises | When you need chaining or parallel execution |
| async/await | Almost always — cleaner than raw Promises |
| Promise.all | Multiple independent tasks, need all results |
| Promise.allSettled | Multiple tasks, want results even if some fail |
| Promise.race | First one to finish wins (timeout pattern) |
| Promise.any | First one to succeed wins |
| try/catch | Error handling inside async functions |
| .catch() | Error handling in Promise chains |

---

## The Mental Model — One Line Each

- **Callback** → "call this function when you're done"
- **Promise** → "I'll give you a placeholder now, real value comes later"
- **async** → "this function will always return a Promise"
- **await** → "pause here until this Promise resolves, then give me the value"
- **Event Loop** → "when the stack is empty, run the next thing in the queue"
- **Promise.all** → "start all, wait for all, fail if any fails"
- **Promise.race** → "start all, return whichever finishes first"
