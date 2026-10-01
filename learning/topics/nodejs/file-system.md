# File System Module

The **File System (fs) module** is one of Node.js's most powerful built-in modules. It allows you to interact with the file system — create, read, update, and delete files and directories. This lesson covers both synchronous and asynchronous file operations with practical examples.

---

## 1. Introduction to the fs Module

The `fs` module provides methods to work with files and directories. Every method comes in two versions:

| Type | Behavior | Use Case |
| :--- | :--- | :--- |
| **Synchronous** | Blocks execution until complete | Simple scripts, startups |
| **Asynchronous** | Non-blocking, uses callbacks | Production servers, APIs |

### Why Asynchronous?

Node.js is single-threaded. Synchronous I/O blocks the entire application:

```
Synchronous (BLOCKS):
Step 1: Reading file (blocks for 100ms) ❌
Step 2: Waiting for step 1 to complete
Step 3: Processing results

Asynchronous (NON-BLOCKING):
Step 1: Request file read (doesn't block)
Step 2: Continue processing other requests ✅
Step 3: Callback executes when file is ready
```

---

## 2. Reading Files

### Synchronous Read (not recommended for servers)

```javascript
const fs = require('fs');

const content = fs.readFileSync('data.txt', 'utf8');
console.log(content);
```

### Asynchronous Read (recommended)

```javascript
const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});

console.log('File read scheduled, this logs first');
```

### Using Promises with fs/promises

```javascript
const fs = require('fs').promises;

async function readFile() {
  try {
    const data = await fs.readFile('data.txt', 'utf8');
    console.log('File content:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

readFile();
```

---

## 3. Writing Files

### Writing (Replaces existing content)

```javascript
const fs = require('fs');

const content = 'Hello, Node.js World!';
fs.writeFile('output.txt', content, 'utf8', (err) => {
  if (err) throw err;
  console.log('File written successfully');
});
```

### Appending (Adds to existing content)

```javascript
fs.appendFile('log.txt', 'New log entry\n', (err) => {
  if (err) throw err;
  console.log('Data appended successfully');
});
```

---

## 4. File Operations Workflow

<div class="vector-flowchart">
  <svg viewBox="0 0 700 350" width="100%">
    <!-- Title -->
    <text x="350" y="25" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 18px;">File System Operations</text>
    
    <!-- Read Path -->
    <g>
      <!-- Read -->
      <rect x="30" y="60" width="140" height="60" rx="6" class="svg-node"/>
      <text x="100" y="90" text-anchor="middle" class="svg-text svg-text-heading">readFile()</text>
      <text x="100" y="108" text-anchor="middle" class="svg-text" style="font-size: 12px;">Read content</text>
      
      <!-- Arrow -->
      <path d="M 170 90 L 210 90" class="svg-line"/>
      <polygon points="210,90 204,86 204,94" class="svg-marker"/>
      
      <!-- Process -->
      <rect x="210" y="60" width="140" height="60" rx="6" class="svg-node"/>
      <text x="280" y="90" text-anchor="middle" class="svg-text svg-text-heading">Parse/Process</text>
      <text x="280" y="108" text-anchor="middle" class="svg-text" style="font-size: 12px;">Data manipulation</text>
      
      <!-- Label -->
      <text x="100" y="40" text-anchor="middle" class="svg-text" style="fill: var(--accent); font-size: 12px; font-weight: 500;">Reading</text>
    </g>
    
    <!-- Center: File System -->
    <rect x="380" y="40" width="160" height="120" rx="8" style="fill: rgba(96, 165, 250, 0.1); stroke: var(--accent); stroke-width: 2;"/>
    <text x="460" y="85" text-anchor="middle" class="svg-text svg-text-heading">File System</text>
    <text x="460" y="105" text-anchor="middle" class="svg-text" style="font-size: 12px;">Files &amp; Directories</text>
    <text x="460" y="125" text-anchor="middle" class="svg-text" style="font-size: 12px;">on Disk</text>
    
    <!-- Write Path -->
    <g>
      <!-- Generate -->
      <rect x="530" y="60" width="140" height="60" rx="6" class="svg-node"/>
      <text x="600" y="90" text-anchor="middle" class="svg-text svg-text-heading">Generate Output</text>
      <text x="600" y="108" text-anchor="middle" class="svg-text" style="font-size: 12px;">Create content</text>
      
      <!-- Arrow -->
      <path d="M 530 90 L 490 90" class="svg-line"/>
      <polygon points="490,90 496,86 496,94" class="svg-marker"/>
      
      <!-- Label -->
      <text x="600" y="40" text-anchor="middle" class="svg-text" style="fill: #ef4444; font-size: 12px; font-weight: 500;">Writing</text>
    </g>
    
    <!-- Bottom: Common Operations -->
    <rect x="30" y="200" width="640" height="130" rx="8" style="fill: rgba(96, 165, 250, 0.05); stroke: var(--border); stroke-width: 1;"/>
    
    <text x="350" y="225" text-anchor="middle" class="svg-text svg-text-heading">Common File Operations</text>
    
    <!-- Operation 1 -->
    <rect x="50" y="245" width="140" height="70" rx="6" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--border);"/>
    <text x="120" y="265" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 13px;">readFile</text>
    <text x="120" y="283" text-anchor="middle" class="svg-text" style="font-size: 11px;">Read file</text>
    <text x="120" y="297" text-anchor="middle" class="svg-text" style="font-size: 11px;">content</text>
    
    <!-- Operation 2 -->
    <rect x="210" y="245" width="140" height="70" rx="6" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--border);"/>
    <text x="280" y="265" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 13px;">writeFile</text>
    <text x="280" y="283" text-anchor="middle" class="svg-text" style="font-size: 11px;">Write/Replace</text>
    <text x="280" y="297" text-anchor="middle" class="svg-text" style="font-size: 11px;">file content</text>
    
    <!-- Operation 3 -->
    <rect x="370" y="245" width="140" height="70" rx="6" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--border);"/>
    <text x="440" y="265" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 13px;">appendFile</text>
    <text x="440" y="283" text-anchor="middle" class="svg-text" style="font-size: 11px;">Append to</text>
    <text x="440" y="297" text-anchor="middle" class="svg-text" style="font-size: 11px;">existing file</text>
    
    <!-- Operation 4 -->
    <rect x="530" y="245" width="140" height="70" rx="6" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--border);"/>
    <text x="600" y="265" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 13px;">unlink</text>
    <text x="600" y="283" text-anchor="middle" class="svg-text" style="font-size: 11px;">Delete</text>
    <text x="600" y="297" text-anchor="middle" class="svg-text" style="font-size: 11px;">file</text>
  </svg>
</div>

---

## 5. Working with Directories

### Create a Directory

```javascript
const fs = require('fs').promises;

async function createDir() {
  try {
    await fs.mkdir('my-folder', { recursive: true });
    console.log('Directory created');
  } catch (err) {
    console.error(err);
  }
}

createDir();
```

### List Directory Contents

```javascript
const fs = require('fs').promises;

async function listFiles() {
  try {
    const files = await fs.readdir('.');
    console.log('Files:', files);
  } catch (err) {
    console.error(err);
  }
}

listFiles();
```

### Remove a Directory

```javascript
const fs = require('fs').promises;

async function removeDir() {
  try {
    await fs.rmdir('my-folder');
    console.log('Directory removed');
  } catch (err) {
    console.error(err);
  }
}

removeDir();
```

---

## 6. File Information (Stats)

### Getting File Metadata

```javascript
const fs = require('fs').promises;

async function getFileStats() {
  try {
    const stats = await fs.stat('data.txt');
    
    console.log('File size:', stats.size, 'bytes');
    console.log('Created:', stats.birthtime);
    console.log('Modified:', stats.mtime);
    console.log('Is directory:', stats.isDirectory());
    console.log('Is file:', stats.isFile());
  } catch (err) {
    console.error(err);
  }
}

getFileStats();
```

### Checking if File Exists

```javascript
const fs = require('fs');

if (fs.existsSync('data.txt')) {
  console.log('File exists');
} else {
  console.log('File does not exist');
}
```

---

## 7. Practical Example: Log Management

<div class="example-output-container">
  <div class="example-output-header">
    <i class="fas fa-code"></i> Complete Example: Application Logger
  </div>
  <div class="example-output-preview">
    <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border); font-family: 'JetBrains Mono', monospace; font-size: 12px; overflow-x: auto;">

```javascript
// logger.js
const fs = require('fs').promises;
const path = require('path');

class Logger {
  constructor(logDir = './logs') {
    this.logDir = logDir;
    this.init();
  }

  async init() {
    try {
      await fs.mkdir(this.logDir, { 
        recursive: true 
      });
    } catch (err) {
      console.error('Failed to create log dir:', err);
    }
  }

  async log(message, level = 'INFO') {
    const timestamp = new Date()
      .toISOString();
    const logMessage = `[${timestamp}] ${level}: ${message}\n`;
    
    const logFile = path.join(
      this.logDir,
      `app-${new Date()
        .toISOString()
        .split('T')[0]}.log`
    );
    
    try {
      await fs.appendFile(
        logFile,
        logMessage,
        'utf8'
      );
      console.log(logMessage);
    } catch (err) {
      console.error('Logging error:', err);
    }
  }

  async error(message) {
    await this.log(message, 'ERROR');
  }

  async warn(message) {
    await this.log(message, 'WARN');
  }
}

module.exports = Logger;
```

```javascript
// app.js
const Logger = require('./logger');
const logger = new Logger();

async function main() {
  await logger.log('Application started');
  
  // Your app code here
  
  await logger.warn('This is a warning');
  await logger.error('An error occurred');
}

main();
```

    </div>
  </div>
</div>

---

## 8. Common File System Operations

### Copy a File

```javascript
const fs = require('fs').promises;

async function copyFile() {
  try {
    await fs.copyFile('source.txt', 'backup.txt');
    console.log('File copied');
  } catch (err) {
    console.error(err);
  }
}

copyFile();
```

### Rename/Move a File

```javascript
const fs = require('fs').promises;

async function renameFile() {
  try {
    await fs.rename('old-name.txt', 'new-name.txt');
    console.log('File renamed');
  } catch (err) {
    console.error(err);
  }
}

renameFile();
```

### Delete a File

```javascript
const fs = require('fs').promises;

async function deleteFile() {
  try {
    await fs.unlink('unwanted.txt');
    console.log('File deleted');
  } catch (err) {
    console.error(err);
  }
}

deleteFile();
```

---

## 9. Error Handling

### Common Error Types

```javascript
const fs = require('fs').promises;

async function readFile() {
  try {
    const data = await fs.readFile('missing.txt', 'utf8');
  } catch (err) {
    // err.code tells you what went wrong
    if (err.code === 'ENOENT') {
      console.log('File not found');
    } else if (err.code === 'EACCES') {
      console.log('Permission denied');
    } else {
      console.log('Other error:', err.message);
    }
  }
}

readFile();
```

### Error Codes Reference

| Code | Meaning |
| :--- | :--- |
| `ENOENT` | File or directory not found |
| `EACCES` | Permission denied |
| `EISDIR` | Expected file but got directory |
| `EEXIST` | File already exists |
| `EINVAL` | Invalid argument |

---

## 10. Best Practices

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Always use async methods in servers</li>
      <li>Use fs/promises for modern code</li>
      <li>Handle errors properly with try-catch</li>
      <li>Use path module for cross-platform paths</li>
      <li>Create backups before deleting</li>
      <li>Use file locks for concurrent writes</li>
      <li>Stream large files instead of reading entirely</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Using synchronous methods in production</li>
      <li>Not handling file encoding</li>
      <li>Ignoring permission errors</li>
      <li>Using hardcoded file paths</li>
      <li>Not checking if file exists</li>
      <li>Multiple writes without buffering</li>
      <li>Assuming files are small enough to load entirely</li>
    </ul>
  </div>
</div>

---

> [!TIP]
> **Pro Tip**: For very large files, use streams instead of loading the entire file into memory:
> ```javascript
> const fs = require('fs');
> fs.createReadStream('huge-file.txt')
>   .pipe(process.stdout);
> ```

---

## 11. Coding Exercise: Build a CSV Reader

### Task:

1. Create a CSV file with sample data
2. Build a module that reads the CSV
3. Parse data into objects
4. Log the results

##### Solution

```bash
# Create sample CSV
echo "id,name,age
1,Alice,25
2,Bob,30" > users.csv
```

```javascript
// csvReader.js
const fs = require('fs').promises;
const path = require('path');

async function readCSV(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header.trim()] = values[idx]?.trim();
      });
      return obj;
    });
    
    return data;
  } catch (err) {
    console.error('Error reading CSV:', err);
    return [];
  }
}

module.exports = { readCSV };
```

```javascript
// app.js
const { readCSV } = require('./csvReader');

async function main() {
  const users = await readCSV('users.csv');
  console.table(users);
}

main();
```

---

## Summary

The File System module is essential for Node.js applications. Whether reading configuration files, logging data, or managing uploads, understanding async file operations is crucial for building robust applications. In the next lesson, you'll explore the Event Loop, which underlies all of Node.js's asynchronous behavior.
