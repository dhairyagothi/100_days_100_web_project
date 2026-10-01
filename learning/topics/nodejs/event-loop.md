# Event Loop Basics

The **Event Loop** is the heart of Node.js's asynchronous, non-blocking architecture. Understanding how it works is fundamental to writing efficient Node.js applications. This lesson demystifies the Event Loop and explains how Node.js handles multiple operations simultaneously with a single thread.

---

## 1. Why Event Loop?

Node.js is single-threaded, but it can handle thousands of concurrent connections. How? The **Event Loop** — a mechanism that manages asynchronous operations and callbacks.

### The Problem Without Event Loop

```
Traditional Multi-threaded Server:
Request 1 → Thread 1 (blocks until complete)
Request 2 → Thread 2 (blocks until complete)
Request 3 → Thread 3 (blocks until complete)
...1000 Requests → 1000 threads → High memory usage
```

### The Solution: Event Loop

```
Node.js with Event Loop:
Request 1 ─┐
Request 2 ─┼→ Event Loop → Non-blocking execution
Request 3 ─┘
...1000 Requests → 1 thread → Low memory usage
```

---

## 2. The Event Loop Architecture

<div class="vector-flowchart">
  <svg viewBox="0 0 700 450" width="100%">
    <!-- Title -->
    <text x="350" y="25" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 18px; font-weight: 600;">Node.js Event Loop Architecture</text>
    
    <!-- Main box -->
    <rect x="20" y="50" width="660" height="370" rx="8" style="fill: rgba(96, 165, 250, 0.05); stroke: var(--border); stroke-width: 2;"/>
    
    <!-- Call Stack -->
    <rect x="40" y="80" width="130" height="100" rx="6" class="svg-node"/>
    <text x="105" y="100" text-anchor="middle" class="svg-text svg-text-heading">Call Stack</text>
    <text x="105" y="118" text-anchor="middle" class="svg-text" style="font-size: 11px;">Synchronous</text>
    <text x="105" y="132" text-anchor="middle" class="svg-text" style="font-size: 11px;">code execution</text>
    <text x="105" y="146" text-anchor="middle" class="svg-text" style="font-size: 11px;">(main thread)</text>
    <text x="105" y="160" text-anchor="middle" class="svg-text" style="font-size: 11px;">Executes first</text>
    
    <!-- Arrow -->
    <path d="M 170 130 L 200 130" class="svg-line"/>
    <polygon points="200,130 194,126 194,134" class="svg-marker"/>
    
    <!-- Event Loop -->
    <rect x="200" y="80" width="130" height="100" rx="6" class="svg-node" style="fill: rgba(59, 130, 246, 0.1);"/>
    <text x="265" y="100" text-anchor="middle" class="svg-text svg-text-heading">Event Loop</text>
    <text x="265" y="118" text-anchor="middle" class="svg-text" style="font-size: 11px;">Polls for</text>
    <text x="265" y="132" text-anchor="middle" class="svg-text" style="font-size: 11px;">completed</text>
    <text x="265" y="146" text-anchor="middle" class="svg-text" style="font-size: 11px;">operations and</text>
    <text x="265" y="160" text-anchor="middle" class="svg-text" style="font-size: 11px;">events</text>
    
    <!-- Arrow -->
    <path d="M 330 130 L 360 130" class="svg-line"/>
    <polygon points="360,130 354,126 354,134" class="svg-marker"/>
    
    <!-- Callback Queue -->
    <rect x="360" y="80" width="130" height="100" rx="6" class="svg-node"/>
    <text x="425" y="100" text-anchor="middle" class="svg-text svg-text-heading">Callback Queue</text>
    <text x="425" y="118" text-anchor="middle" class="svg-text" style="font-size: 11px;">Waits for call</text>
    <text x="425" y="132" text-anchor="middle" class="svg-text" style="font-size: 11px;">stack to be</text>
    <text x="425" y="146" text-anchor="middle" class="svg-text" style="font-size: 11px;">empty, then</text>
    <text x="425" y="160" text-anchor="middle" class="svg-text" style="font-size: 11px;">executes</text>
    
    <!-- Arrow -->
    <path d="M 490 130 L 520 130" class="svg-line"/>
    <polygon points="520,130 514,126 514,134" class="svg-marker"/>
    
    <!-- Thread Pool -->
    <rect x="520" y="80" width="130" height="100" rx="6" class="svg-node" style="fill: rgba(16, 185, 129, 0.1);"/>
    <text x="585" y="100" text-anchor="middle" class="svg-text svg-text-heading">Thread Pool</text>
    <text x="585" y="118" text-anchor="middle" class="svg-text" style="font-size: 11px;">Executes async</text>
    <text x="585" y="132" text-anchor="middle" class="svg-text" style="font-size: 11px;">I/O operations</text>
    <text x="585" y="146" text-anchor="middle" class="svg-text" style="font-size: 11px;">(file, database,</text>
    <text x="585" y="160" text-anchor="middle" class="svg-text" style="font-size: 11px;">network)</text>
    
    <!-- Macrotask Queue -->
    <rect x="40" y="210" width="130" height="80" rx="6" style="fill: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444;"/>
    <text x="105" y="230" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 12px;">Macrotask Queue</text>
    <text x="105" y="248" text-anchor="middle" class="svg-text" style="font-size: 10px;">setTimeout</text>
    <text x="105" y="262" text-anchor="middle" class="svg-text" style="font-size: 10px;">I/O callbacks</text>
    <text x="105" y="276" text-anchor="middle" class="svg-text" style="font-size: 10px;">setInterval</text>
    
    <!-- Microtask Queue -->
    <rect x="200" y="210" width="130" height="80" rx="6" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--accent);"/>
    <text x="265" y="230" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 12px;">Microtask Queue</text>
    <text x="265" y="248" text-anchor="middle" class="svg-text" style="font-size: 10px;">Promises</text>
    <text x="265" y="262" text-anchor="middle" class="svg-text" style="font-size: 10px;">async/await</text>
    <text x="265" y="276" text-anchor="middle" class="svg-text" style="font-size: 10px;">queueMicrotask()</text>
    
    <!-- Execution Order -->
    <rect x="360" y="210" width="290" height="80" rx="6" style="fill: rgba(16, 185, 129, 0.05); border: 1px solid #10b981;"/>
    <text x="505" y="230" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 12px;">Execution Priority</text>
    <text x="505" y="248" text-anchor="middle" class="svg-text" style="font-size: 10px;">1. Call Stack (synchronous)</text>
    <text x="505" y="260" text-anchor="middle" class="svg-text" style="font-size: 10px;">2. Microtask Queue (promises)</text>
    <text x="505" y="272" text-anchor="middle" class="svg-text" style="font-size: 10px;">3. Render (if needed)</text>
    <text x="505" y="284" text-anchor="middle" class="svg-text" style="font-size: 10px;">4. Macrotask Queue (timers)</text>
    
    <!-- Flow Loop -->
    <path d="M 105 190 L 105 210" class="svg-line" stroke-dasharray="5,5" style="stroke: rgba(239, 68, 68, 0.5);"/>
    <text x="120" y="205" class="svg-text" style="font-size: 10px; fill: #ef4444;">cycles back</text>
    
    <path d="M 265 190 L 265 210" class="svg-line" stroke-dasharray="5,5" style="stroke: rgba(59, 130, 246, 0.5);"/>
    <text x="280" y="205" class="svg-text" style="font-size: 10px; fill: var(--accent);">immediately</text>
  </svg>
</div>

---

## 3. Understanding Execution Order

### The Three Execution Phases

```javascript
console.log('1. Start');

// Phase 1: Synchronous code (Call Stack)
console.log('2. Synchronous');

// Phase 2: Microtasks (Promises, async/await)
Promise.resolve().then(() => {
  console.log('3. Promise (Microtask)');
});

// Phase 3: Macrotasks (setTimeout, setInterval)
setTimeout(() => {
  console.log('4. setTimeout (Macrotask)');
}, 0);

console.log('5. End');

/* Output:
1. Start
2. Synchronous
5. End
3. Promise (Microtask)
4. setTimeout (Macrotask)
*/
```

### Why This Order?

1. **Call Stack** executes all synchronous code first
2. **Microtask Queue** runs immediately after the stack is empty
3. **Macrotask Queue** runs after microtasks are complete

---

## 4. Visualizing Event Loop Execution

<div class="example-output-container">
  <div class="example-output-header">
    <i class="fas fa-code"></i> Step-by-Step Event Loop Execution
  </div>
  <div class="example-output-preview">
    <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border); font-family: 'JetBrains Mono', monospace; font-size: 11px; max-height: 400px; overflow-y: auto;">

```javascript
console.log('A');

setTimeout(() => {
  console.log('B');
}, 0);

Promise.resolve().then(() => {
  console.log('C');
}).then(() => {
  console.log('D');
});

console.log('E');

/* EXECUTION TRACE:
┌─────────────────────────────────────────┐
│ Step 1: CALL STACK                      │
├─────────────────────────────────────────┤
│ console.log('A')  ───→ OUTPUT: A        │
│ setTimeout(...)   ───→ MOVE TO MACROTASK│
│ Promise.then()    ───→ MOVE TO MICROTASK│
│ console.log('E')  ───→ OUTPUT: E        │
└─────────────────────────────────────────┘

CURRENT OUTPUT: A, E

┌─────────────────────────────────────────┐
│ Step 2: MICROTASK QUEUE (EMPTY STACK)   │
├─────────────────────────────────────────┤
│ Promise.then() #1 ───→ OUTPUT: C        │
│ Promise.then() #2 ───→ OUTPUT: D        │
└─────────────────────────────────────────┘

CURRENT OUTPUT: A, E, C, D

┌─────────────────────────────────────────┐
│ Step 3: MACROTASK QUEUE                 │
├─────────────────────────────────────────┤
│ setTimeout()      ───→ OUTPUT: B        │
└─────────────────────────────────────────┘

FINAL OUTPUT: A, E, C, D, B
```

    </div>
  </div>
</div>

---

## 5. Practical Examples

### Example 1: File Reading (Async I/O)

```javascript
const fs = require('fs');

console.log('1. Before file read');

fs.readFile('data.txt', 'utf8', (err, data) => {
  console.log('3. File read complete');
});

console.log('2. File read scheduled');

/* Output:
1. Before file read
2. File read scheduled
3. File read complete (after file is actually read)
*/
```

### Example 2: Multiple setTimeout Calls

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timer 1 (0ms)');
}, 0);

setTimeout(() => {
  console.log('Timer 2 (0ms)');
}, 0);

console.log('End');

/* Output:
Start
End
Timer 1 (0ms)
Timer 2 (0ms)
*/
```

### Example 3: Promises vs setTimeout

```javascript
console.log('Start');

Promise.resolve()
  .then(() => console.log('Promise 1'))
  .then(() => console.log('Promise 2'));

setTimeout(() => console.log('setTimeout'), 0);

console.log('End');

/* Output:
Start
End
Promise 1
Promise 2
setTimeout
*/
```

---

## 6. Event Loop with I/O Operations

### How Node.js Handles Multiple Requests

```javascript
const fs = require('fs').promises;

// Simulate multiple file operations
async function handleRequest(id) {
  console.log(`Request ${id}: Starting`);
  
  try {
    const data = await fs.readFile('data.txt', 'utf8');
    console.log(`Request ${id}: Read ${data.length} bytes`);
  } catch (err) {
    console.error(`Request ${id}: Error`);
  }
}

// Three concurrent requests
handleRequest(1);
handleRequest(2);
handleRequest(3);

/* Output (all start before any complete):
Request 1: Starting
Request 2: Starting
Request 3: Starting
Request 1: Read X bytes
Request 2: Read X bytes
Request 3: Read X bytes
*/
```

---

## 7. Blocking vs Non-Blocking Operations

### BLOCKING (Don't Do This!)

```javascript
// This blocks the entire application
const data = fs.readFileSync('large-file.txt');
console.log('File read');
// Meanwhile, all other requests wait...
```

### NON-BLOCKING (Recommended)

```javascript
// This doesn't block the application
fs.readFile('large-file.txt', (err, data) => {
  console.log('File read');
});
console.log('File read scheduled');
// Other requests can proceed...
```

---

## 8. Understanding Callback Hell and Solutions

### Problem: Callback Hell (Pyramid of Doom)

```javascript
fs.readFile('file1.txt', (err, data1) => {
  if (err) throw err;
  
  fs.readFile('file2.txt', (err, data2) => {
    if (err) throw err;
    
    fs.readFile('file3.txt', (err, data3) => {
      if (err) throw err;
      
      console.log(data1, data2, data3);
    });
  });
});
```

### Solution 1: Promises

```javascript
const fs = require('fs').promises;

fs.readFile('file1.txt', 'utf8')
  .then(data1 => fs.readFile('file2.txt', 'utf8'))
  .then(data2 => fs.readFile('file3.txt', 'utf8'))
  .then(data3 => console.log(data1, data2, data3))
  .catch(err => console.error(err));
```

### Solution 2: Async/Await (Recommended)

```javascript
const fs = require('fs').promises;

async function readFiles() {
  try {
    const data1 = await fs.readFile('file1.txt', 'utf8');
    const data2 = await fs.readFile('file2.txt', 'utf8');
    const data3 = await fs.readFile('file3.txt', 'utf8');
    
    console.log(data1, data2, data3);
  } catch (err) {
    console.error(err);
  }
}

readFiles();
```

---

## 9. Best Practices

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Always use async methods to avoid blocking</li>
      <li>Prefer async/await over callbacks</li>
      <li>Use Promise.all() for parallel operations</li>
      <li>Keep synchronous code minimal</li>
      <li>Avoid deeply nested callbacks</li>
      <li>Handle all errors properly</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Using synchronous methods in production</li>
      <li>Not understanding microtask vs macrotask</li>
      <li>Expecting synchronous behavior from async code</li>
      <li>Forgetting that async operations are non-blocking</li>
      <li>Not handling promise rejections</li>
      <li>Using setTimeout(fn, 0) instead of setImmediate()</li>
    </ul>
  </div>
</div>

---

> [!TIP]
> **Pro Tip**: Use `setImmediate()` instead of `setTimeout(fn, 0)` to execute a callback in the next iteration of the Event Loop without waiting for the timer phase.

---

## 10. Coding Exercise: Understand Event Loop Order

### Task:

Predict the output of this code, then run it to verify:

##### Solution

```javascript
console.log('1. Start');

// Macrotask
setTimeout(() => {
  console.log('2. setTimeout');
}, 0);

// Microtask
Promise.resolve()
  .then(() => {
    console.log('3. Promise 1');
    return Promise.resolve();
  })
  .then(() => {
    console.log('4. Promise 2');
  });

// Synchronous
console.log('5. End');

/* CORRECT OUTPUT:
1. Start
5. End
3. Promise 1
4. Promise 2
2. setTimeout
*/
```

---

## Summary

The Event Loop is what makes Node.js powerful. It enables handling thousands of concurrent connections with minimal resources by managing asynchronous operations efficiently. Mastering the Event Loop is crucial for writing performant Node.js applications. In the next lesson, you'll use this knowledge to create HTTP servers that handle multiple concurrent requests.
