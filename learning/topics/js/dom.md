# DOM Manipulation

The **DOM** (Document Object Model) is a programming interface for web documents. It represents the page structure as a hierarchical tree of objects. By using JavaScript, you can dynamically access, modify, add, or delete elements from this tree, making your websites highly interactive and alive!

---

## 1. What is the DOM Tree?

When a browser loads an HTML page, it parses the HTML and generates a tree-like representation of the document structure in the computer's memory. Every element, attribute, and piece of text in your HTML is a **node** in this tree.

Here is a visual chart showing how an HTML structure maps into a hierarchical DOM Tree:

<div class="vector-flowchart">
  <svg viewBox="0 0 580 260" width="100%">
    <!-- Document Root Node -->
    <rect x="230" y="10" width="120" height="35" rx="6" class="svg-node" style="fill: var(--accent-dim); stroke: var(--accent);" />
    <text x="290" y="32" text-anchor="middle" class="svg-text svg-text-heading">document</text>

    <!-- Connectors Level 1 -->
    <path d="M 290 45 L 290 70" class="svg-line" />

    <!-- html element -->
    <rect x="230" y="70" width="120" height="35" rx="6" class="svg-node" />
    <text x="290" y="92" text-anchor="middle" class="svg-text svg-text-heading">&lt;html&gt;</text>

    <!-- Connectors Level 2 -->
    <path d="M 290 105 L 140 140" class="svg-line" />
    <path d="M 290 105 L 440 140" class="svg-line" />

    <!-- head element -->
    <rect x="80" y="140" width="120" height="35" rx="6" class="svg-node" />
    <text x="140" y="162" text-anchor="middle" class="svg-text svg-text-heading">&lt;head&gt;</text>

    <!-- body element -->
    <rect x="380" y="140" width="120" height="35" rx="6" class="svg-node" />
    <text x="440" y="162" text-anchor="middle" class="svg-text svg-text-heading">&lt;body&gt;</text>

    <!-- Connectors Level 3 -->
    <path d="M 140 175 L 140 210" class="svg-line" />
    <path d="M 440 175 L 360 210" class="svg-line" />
    <path d="M 440 175 L 500 210" class="svg-line" />

    <!-- title element -->
    <rect x="80" y="210" width="120" height="35" rx="6" class="svg-node" />
    <text x="140" y="232" text-anchor="middle" class="svg-text svg-text-heading">&lt;title&gt;</text>

    <!-- h1 element -->
    <rect x="300" y="210" width="110" height="35" rx="6" class="svg-node" />
    <text x="355" y="232" text-anchor="middle" class="svg-text svg-text-heading">&lt;h1&gt;</text>

    <!-- p element -->
    <rect x="440" y="210" width="110" height="35" rx="6" class="svg-node" />
    <text x="495" y="232" text-anchor="middle" class="svg-text svg-text-heading">&lt;p&gt;</text>
  </svg>
</div>

Using JavaScript, you can walk through these branches, grab any element node, change its text, apply styling, or listen to user mouse clicks!

---

## 2. Selecting Elements from the DOM

Before you can change a node, you must select it. JavaScript provides several selector functions to retrieve elements from the document.

### A. Core Selector Methods

```javascript
// 1. Get a single element by its unique ID attribute
const mainHeading = document.getElementById('heading');

// 2. Get a list of elements by their CSS class name
const cards = document.getElementsByClassName('card');

// 3. The modern querySelector (returns the FIRST matching element using CSS rules)
const firstBtn = document.querySelector('.btn-primary');

// 4. querySelectorAll (returns a NodeList of ALL matching elements)
const allParagraphs = document.querySelectorAll('p');
```

---

## 3. Modifying Elements

Once selected, you can easily read or write properties to change the visual representation on the fly.

### A. Changing Text Content
Use `.textContent` to change raw, plain text inside elements safely.

```javascript
const paragraph = document.querySelector('p');
paragraph.textContent = 'Hello, this is new text!';
```

### B. Changing Styles Directly
Use the `.style` property to apply inline CSS values dynamically.

```javascript
const box = document.getElementById('box');
box.style.backgroundColor = '#3b82f6';
box.style.borderRadius = '10px';
box.style.transform = 'scale(1.05)';
```

---

## 4. Creating & Appending New Elements

You can create brand new HTML tags programmatically and inject them straight into your page layout dynamically!

```javascript
// 1. Create a new element node
const newDiv = document.createElement('div');

// 2. Set content or classes
newDiv.className = 'info-card';
newDiv.textContent = 'I was generated programmatically by JavaScript!';

// 3. Select an existing parent container element
const container = document.getElementById('parentContainer');

// 4. Append/insert the child div element inside the parent
container.appendChild(newDiv);
```

---

## 5. Best Practices & Common Pitfalls

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Use `.textContent` rather than `.innerHTML` when writing text to prevent Cross-Site Scripting (XSS) security vulnerabilities.</li>
      <li>Cache selected elements in variables rather than query selecting them repeatedly inside loops.</li>
      <li>Use CSS class toggling (`element.classList.toggle('active')`) instead of applying inline styles directly inside JS code.</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Trying to select elements before the DOM has loaded (yielding `null` selectors).</li>
      <li>Confusing NodeList arrays returned by `querySelectorAll` with single element instances.</li>
      <li>Overusing direct `.innerHTML` calls which clears existing child event listeners.</li>
    </ul>
  </div>
</div>

> [!IMPORTANT]
> **Important**: A `NodeList` returned by `querySelectorAll()` is not a single element! You cannot set `nodelist.style.color = 'red'` directly. You must iterate through the elements inside the NodeList using `nodelist.forEach(item => { item.style.color = 'red'; })`!

---

## 6. Coding Exercise: Interactive Tasks

Let's put this into practice with a dynamic counter!

### Task:
Write a JavaScript script that listens to a button click on an element with the ID `incrementBtn`. Every time it's clicked, increment a number displayed inside a `<span id="counter">0</span>` tag by 1.

##### Solution

```html
<div class="counter-card">
    <span id="counter">0</span>
    <button id="incrementBtn">Increment</button>
</div>
```

```javascript
// 1. Select the DOM elements
const counterSpan = document.getElementById('counter');
const incrementBtn = document.getElementById('incrementBtn');

// 2. Initialize the counter state value
let count = 0;

// 3. Add the click event listener
incrementBtn.addEventListener('click', () => {
  // 4. Increment the value
  count++;
  
  // 5. Update the text content of the span in the DOM
  counterSpan.textContent = count;
});
```

**Explanation**: 
- We select the elements safely using `document.getElementById`.
- We maintain the state in a clean, simple JavaScript let variable.
- We add a click event listener using `.addEventListener()` which triggers our callback function to increment the state and write the update straight to the DOM!
