# Modules & npm

Node.js is built around a **modular architecture**. Instead of writing all code in a single file, you can organize code into **modules** — reusable, self-contained pieces of functionality. This lesson covers how Node.js modules work and how npm helps you manage dependencies.

---

## 1. What are Modules?

A **module** is a file containing JavaScript code that exports specific functionality for other parts of your application to use. This promotes:
- **Code reusability**: Write once, use many times
- **Maintainability**: Changes in one place affect everywhere
- **Namespace isolation**: Prevent variable name conflicts
- **Scalability**: Build large applications from small pieces

---

## 2. CommonJS Module System (Node.js Default)

Node.js uses **CommonJS** modules by default. Each file is a module with its own scope.

### Exporting from a Module

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add,
  subtract
};
```

### Importing a Module

```javascript
// app.js
const math = require('./math');

console.log(math.add(5, 3));      // 8
console.log(math.subtract(10, 4)); // 6
```

### Module Visualization

<div class="vector-flowchart">
  <svg viewBox="0 0 600 250" width="100%">
    <!-- Module 1 -->
    <rect x="30" y="30" width="150" height="100" rx="6" class="svg-node"/>
    <text x="105" y="55" text-anchor="middle" class="svg-text svg-text-heading">math.js</text>
    <rect x="45" y="70" width="120" height="35" rx="4" style="fill: rgba(59, 130, 246, 0.2); stroke: var(--accent); stroke-width: 1;"/>
    <text x="105" y="82" text-anchor="middle" class="svg-text" style="font-size: 12px;">add(a, b)</text>
    <text x="105" y="98" text-anchor="middle" class="svg-text" style="font-size: 12px;">subtract(a, b)</text>
    
    <!-- Export -->
    <text x="105" y="120" text-anchor="middle" class="svg-text" style="fill: var(--accent); font-size: 12px; font-weight: 500;">module.exports</text>
    
    <!-- Arrow -->
    <path d="M 180 80 L 230 80" class="svg-line" stroke-dasharray="5,5"/>
    <polygon points="230,80 224,76 224,84" class="svg-marker"/>
    
    <!-- Module 2 -->
    <rect x="230" y="30" width="150" height="100" rx="6" class="svg-node" style="fill: rgba(16, 185, 129, 0.1);"/>
    <text x="305" y="55" text-anchor="middle" class="svg-text svg-text-heading">app.js</text>
    <rect x="245" y="70" width="120" height="35" rx="4" style="fill: rgba(16, 185, 129, 0.2); stroke: #10b981; stroke-width: 1;"/>
    <text x="305" y="82" text-anchor="middle" class="svg-text" style="font-size: 12px;">Uses math</text>
    <text x="305" y="98" text-anchor="middle" class="svg-text" style="font-size: 12px;">functions</text>
    
    <!-- Require -->
    <text x="305" y="120" text-anchor="middle" class="svg-text" style="fill: #10b981; font-size: 12px; font-weight: 500;">require()</text>
    
    <!-- Module 3 -->
    <rect x="430" y="30" width="150" height="100" rx="6" class="svg-node" style="fill: rgba(239, 68, 68, 0.1);"/>
    <text x="505" y="55" text-anchor="middle" class="svg-text svg-text-heading">utils.js</text>
    <rect x="445" y="70" width="120" height="35" rx="4" style="fill: rgba(239, 68, 68, 0.2); stroke: #ef4444; stroke-width: 1;"/>
    <text x="505" y="82" text-anchor="middle" class="svg-text" style="font-size: 12px;">format()</text>
    <text x="505" y="98" text-anchor="middle" class="svg-text" style="font-size: 12px;">validate()</text>
    
    <!-- Main App Container -->
    <rect x="50" y="160" width="500" height="70" rx="6" style="fill: rgba(96, 165, 250, 0.1); stroke: var(--border); stroke-width: 2;"/>
    <text x="300" y="180" text-anchor="middle" class="svg-text svg-text-heading">Application</text>
    <text x="300" y="205" text-anchor="middle" class="svg-text" style="font-size: 12px;">Combines all modules into a single working application</text>
  </svg>
</div>

---

## 3. Different Ways to Export

### Named Exports

```javascript
// calculator.js
exports.add = (a, b) => a + b;
exports.multiply = (a, b) => a * b;

// app.js
const calc = require('./calculator');
console.log(calc.add(2, 3));      // 5
console.log(calc.multiply(2, 3)); // 6
```

### Default Export

```javascript
// greeting.js
module.exports = (name) => `Hello, ${name}!`;

// app.js
const greet = require('./greeting');
console.log(greet('Alice')); // Hello, Alice!
```

### Mixed Exports

```javascript
// config.js
module.exports = {
  appName: 'MyApp',
  version: '1.0.0',
  getInfo: function() {
    return `${this.appName} v${this.version}`;
  }
};

// app.js
const config = require('./config');
console.log(config.appName);   // MyApp
console.log(config.getInfo()); // MyApp v1.0.0
```

---

## 4. Core Modules (Built-in)

Node.js provides built-in modules that don't require installation:

| Module | Purpose |
| :--- | :--- |
| `fs` | File system operations |
| `path` | File path manipulation |
| `http` | HTTP server creation |
| `events` | Event emitter pattern |
| `os` | Operating system information |
| `util` | Utility functions |

### Using Core Modules

```javascript
// Using the fs module
const fs = require('fs');

// Using the path module
const path = require('path');
const filePath = path.join(__dirname, 'data', 'users.json');

// Using the http module
const http = require('http');
const server = http.createServer((req, res) => {
  res.write('Hello World');
  res.end();
});
```

---

## 5. npm (Node Package Manager)

**npm** is the official package manager for Node.js, providing access to millions of reusable packages.

### Package.json Structure

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A sample Node.js application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^3.0.1"
  }
}
```

### Semantic Versioning

```
Version: 4.18.2
        │  │  └─ Patch (bug fixes)
        │  └──── Minor (new features, backward compatible)
        └─────── Major (breaking changes)

Symbols:
^4.18.2  → Any version with major 4 (4.x.x)
~4.18.2  → Any version 4.18.x
*        → Any version
```

---

## 6. Installing and Using Packages

### Installing a Package

```bash
# Install Express.js
npm install express

# Install as a development dependency
npm install --save-dev jest

# Install globally (command-line tools)
npm install -g nodemon
```

### Using Installed Packages

```javascript
// app.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000);
```

---

## 7. Common npm Workflows

### Initialize a New Project

```bash
npm init -y  # Create default package.json
```

### Install All Dependencies

```bash
npm install  # Reads package.json and installs all packages
```

### Update Packages

```bash
npm update              # Update to latest compatible versions
npm update express      # Update specific package
npm outdated           # Check for updates available
```

### Remove a Package

```bash
npm uninstall express   # Remove a package
npm uninstall --save-dev jest  # Remove from devDependencies
```

### View Package Information

```bash
npm list                # Show installed packages
npm view express        # View package details
npm search database     # Search for packages
```

---

## 8. Managing Dependencies

### Dependencies vs DevDependencies

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Dependencies</h4>
    <ul>
      <li>Required for application to run</li>
      <li>Installed in production</li>
      <li>Examples: express, dotenv</li>
      <li>Install with: npm install</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> DevDependencies</h4>
    <ul>
      <li>Only needed during development</li>
      <li>NOT installed in production</li>
      <li>Examples: jest, nodemon</li>
      <li>Install with: npm install --save-dev</li>
    </ul>
  </div>
</div>

### Package Lock File

Always commit `package-lock.json` to version control:

```bash
git add package.json package-lock.json
git commit -m "Add project dependencies"
```

This ensures everyone uses the same exact versions.

---

## 9. ES6 Modules (Modern Alternative)

Node.js also supports ES6 modules (`.mjs` files or with `"type": "module"` in package.json):

```javascript
// math.mjs - ES6 style
export function add(a, b) {
  return a + b;
}

export const subtract = (a, b) => a - b;

// app.mjs - ES6 style
import { add, subtract } from './math.mjs';

console.log(add(5, 3));        // 8
console.log(subtract(10, 4));  // 6
```

---

## 10. Module Resolution Process

<div class="vector-flowchart">
  <svg viewBox="0 0 600 300" width="100%">
    <!-- Start -->
    <circle cx="300" cy="30" r="20" class="svg-node"/>
    <text x="300" y="35" text-anchor="middle" class="svg-text" style="font-size: 12px; fill: white; font-weight: bold;">require()</text>
    
    <!-- Arrow -->
    <path d="M 300 50 L 300 80" class="svg-line"/>
    <polygon points="300,80 296,74 304,74" class="svg-marker"/>
    
    <!-- Check 1 -->
    <rect x="160" y="80" width="280" height="50" rx="6" style="fill: rgba(59, 130, 246, 0.1); stroke: var(--accent); stroke-width: 1;"/>
    <text x="300" y="100" text-anchor="middle" class="svg-text svg-text-heading">Is it a core module?</text>
    <text x="300" y="118" text-anchor="middle" class="svg-text" style="font-size: 11px;">(fs, path, http...)</text>
    
    <!-- Yes Arrow -->
    <path d="M 160 105 L 80 105" class="svg-line"/>
    <polygon points="80,105 86,101 86,109" class="svg-marker"/>
    <text x="120" y="98" class="svg-text" style="fill: #10b981; font-size: 11px;">YES</text>
    
    <!-- Load from core -->
    <rect x="20" y="80" width="60" height="50" rx="4" style="fill: rgba(16, 185, 129, 0.1); stroke: #10b981; stroke-width: 1;"/>
    <text x="50" y="100" text-anchor="middle" class="svg-text" style="font-size: 11px;">Load from</text>
    <text x="50" y="115" text-anchor="middle" class="svg-text" style="font-size: 11px;">core</text>
    
    <!-- No Arrow -->
    <path d="M 300 130 L 300 160" class="svg-line"/>
    <polygon points="300,160 296,154 304,154" class="svg-marker"/>
    <text x="320" y="148" class="svg-text" style="fill: #ef4444; font-size: 11px;">NO</text>
    
    <!-- Check 2 -->
    <rect x="160" y="160" width="280" height="50" rx="6" style="fill: rgba(59, 130, 246, 0.1); stroke: var(--accent); stroke-width: 1;"/>
    <text x="300" y="180" text-anchor="middle" class="svg-text svg-text-heading">Is it a relative path?</text>
    <text x="300" y="198" text-anchor="middle" class="svg-text" style="font-size: 11px;">(./file, ../dir/file...)</text>
    
    <!-- Yes Arrow -->
    <path d="M 160 185 L 80 185" class="svg-line"/>
    <polygon points="80,185 86,181 86,189" class="svg-marker"/>
    <text x="120" y="178" class="svg-text" style="fill: #10b981; font-size: 11px;">YES</text>
    
    <!-- Load from file -->
    <rect x="20" y="160" width="60" height="50" rx="4" style="fill: rgba(16, 185, 129, 0.1); stroke: #10b981; stroke-width: 1;"/>
    <text x="50" y="180" text-anchor="middle" class="svg-text" style="font-size: 11px;">Load from</text>
    <text x="50" y="195" text-anchor="middle" class="svg-text" style="font-size: 11px;">file</text>
    
    <!-- No Arrow -->
    <path d="M 300 210 L 300 240" class="svg-line"/>
    <polygon points="300,240 296,234 304,234" class="svg-marker"/>
    <text x="320" y="228" class="svg-text" style="fill: #ef4444; font-size: 11px;">NO</text>
    
    <!-- Check 3 -->
    <rect x="160" y="240" width="280" height="50" rx="6" style="fill: rgba(59, 130, 246, 0.1); stroke: var(--accent); stroke-width: 1;"/>
    <text x="300" y="260" text-anchor="middle" class="svg-text svg-text-heading">Search node_modules</text>
    <text x="300" y="278" text-anchor="middle" class="svg-text" style="font-size: 11px;">(package name)</text>
  </svg>
</div>

---

## 11. Best Practices

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Module Best Practices</h4>
    <ul>
      <li>One responsibility per module</li>
      <li>Keep modules small and focused</li>
      <li>Use meaningful, descriptive names</li>
      <li>Document module exports</li>
      <li>Avoid circular dependencies</li>
      <li>Prefer explicit exports over global variables</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Creating circular dependencies (A requires B, B requires A)</li>
      <li>Modifying other module's exports</li>
      <li>Installing packages globally for production code</li>
      <li>Not committing package-lock.json</li>
      <li>Ignoring package.json in version control</li>
      <li>Leaving console.log statements in production</li>
    </ul>
  </div>
</div>

---

> [!TIP]
> **Pro Tip**: Use `npm audit` to check for security vulnerabilities in your dependencies:
> ```bash
> npm audit
> npm audit fix
> ```

---

## 12. Coding Exercise: Build a Module-Based Calculator

### Task:

1. Create a `calculator.js` module with functions
2. Create an `app.js` file that uses the module
3. Initialize npm and document in package.json

##### Solution

```bash
# Initialize project
npm init -y
```

```javascript
// calculator.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
};

module.exports = { add, subtract, multiply, divide };
```

```javascript
// app.js
const calc = require('./calculator');

console.log('5 + 3 =', calc.add(5, 3));
console.log('10 - 4 =', calc.subtract(10, 4));
console.log('6 × 7 =', calc.multiply(6, 7));
console.log('20 ÷ 4 =', calc.divide(20, 4));
```

Run it:
```bash
node app.js
```

---

## Summary

Modules are fundamental to Node.js development, enabling you to organize code into reusable, maintainable components. npm extends this capability by providing access to a massive ecosystem of pre-built packages. Understanding modules and npm is essential for building scalable Node.js applications. In the next lesson, you'll explore the File System module for reading and writing files.
