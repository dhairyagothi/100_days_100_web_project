# Creating an HTTP Server

Now that you understand the fundamentals of Node.js, the module system, and the Event Loop, you're ready to build your first HTTP server. The HTTP server is the foundation of web applications, APIs, and web services.

---

## 1. What is an HTTP Server?

An **HTTP server** is a program that listens on a network port and responds to client requests following the HTTP protocol. Every website you visit communicates with an HTTP server.

### HTTP Request-Response Model

<div class="vector-flowchart">
  <svg viewBox="0 0 700 200" width="100%">
    <!-- Title -->
    <text x="350" y="25" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 18px; font-weight: 600;">HTTP Request-Response Cycle</text>
    
    <!-- Client -->
    <rect x="30" y="60" width="120" height="80" rx="6" class="svg-node"/>
    <text x="90" y="90" text-anchor="middle" class="svg-text svg-text-heading">Client</text>
    <text x="90" y="108" text-anchor="middle" class="svg-text" style="font-size: 11px;">Browser or</text>
    <text x="90" y="122" text-anchor="middle" class="svg-text" style="font-size: 11px;">App</text>
    
    <!-- Request Arrow -->
    <path d="M 150 85 L 230 85" class="svg-line"/>
    <polygon points="230,85 224,81 224,89" class="svg-marker"/>
    <text x="190" y="78" text-anchor="middle" class="svg-text" style="fill: var(--accent); font-size: 11px;">HTTP Request</text>
    <text x="190" y="100" text-anchor="middle" class="svg-text" style="font-size: 10px;">GET /page</text>
    
    <!-- Server -->
    <rect x="230" y="60" width="120" height="80" rx="6" class="svg-node" style="fill: rgba(59, 130, 246, 0.1);"/>
    <text x="290" y="90" text-anchor="middle" class="svg-text svg-text-heading">Server</text>
    <text x="290" y="108" text-anchor="middle" class="svg-text" style="font-size: 11px;">Node.js</text>
    <text x="290" y="122" text-anchor="middle" class="svg-text" style="font-size: 11px;">HTTP Server</text>
    
    <!-- Response Arrow -->
    <path d="M 350 115 L 270 115" class="svg-line"/>
    <polygon points="270,115 276,119 276,111" class="svg-marker"/>
    <text x="310" y="138" text-anchor="middle" class="svg-text" style="fill: #10b981; font-size: 11px;">HTTP Response</text>
    <text x="310" y="156" text-anchor="middle" class="svg-text" style="font-size: 10px;">200 OK + HTML</text>
  </svg>
</div>

---

## 2. Your First HTTP Server

### Creating a Basic Server

```javascript
// server.js
const http = require('http');

const server = http.createServer((req, res) => {
  // req: request from client
  // res: response to send back
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js server!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

### Running the Server

```bash
node server.js
# Server running at http://localhost:3000
```

Visit http://localhost:3000 in your browser and you'll see "Hello from Node.js server!"

---

## 3. Understanding HTTP Methods

### Common HTTP Methods

| Method | Purpose | When to Use |
| :--- | :--- | :--- |
| **GET** | Retrieve data | Fetch web pages, data |
| **POST** | Send data to server | Submit forms, create resources |
| **PUT** | Update entire resource | Replace existing data |
| **PATCH** | Partial update | Modify specific fields |
| **DELETE** | Remove resource | Delete data |
| **HEAD** | Like GET but no body | Check if resource exists |

### Handling Different HTTP Methods

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('GET request received');
  } else if (req.method === 'POST') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('POST request received');
  } else if (req.method === 'DELETE') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('DELETE request received');
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method not allowed');
  }
});

server.listen(3000);
```

---

## 4. Request and Response Objects

### Analyzing the Request

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Method:', req.method);        // GET, POST, etc.
  console.log('URL:', req.url);              // /path/to/resource
  console.log('Headers:', req.headers);      // Client headers
  
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Request details logged');
});

server.listen(3000);
```

### Building a Response

```javascript
res.writeHead(statusCode, headers);  // Set status & headers
res.write(data);                     // Send data (can call multiple times)
res.end([data]);                     // Send final data and close connection
```

---

## 5. Routing (Handling Different URLs)

### Simple Routing Example

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome Home</h1>');
  } 
  else if (req.url === '/about' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>About Page</h1>');
  } 
  else if (req.url === '/contact' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Contact Page</h1>');
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - Page Not Found</h1>');
  }
});

server.listen(3000);
```

---

## 6. Working with JSON

### Sending JSON Responses

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  const data = {
    message: 'Hello from Node.js',
    timestamp: new Date(),
    version: '1.0.0'
  };
  
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
});

server.listen(3000);
```

### Receiving JSON Data (POST)

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/users') {
    let body = '';
    
    // Collect data chunks
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    // Data collection complete
    req.on('end', () => {
      try {
        const user = JSON.parse(body);
        console.log('Received user:', user);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ id: 1, ...user }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }
});

server.listen(3000);
```

---

## 7. Status Codes

### HTTP Status Code Categories

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-info-circle"></i> 2xx Success Codes</h4>
    <ul>
      <li>200 OK - Request succeeded</li>
      <li>201 Created - Resource created</li>
      <li>204 No Content - Success, no body</li>
    </ul>
  </div>
  
  <div class="practice-card best-practices">
    <h4><i class="fas fa-exclamation-circle"></i> 4xx Client Errors</h4>
    <ul>
      <li>400 Bad Request - Invalid request</li>
      <li>401 Unauthorized - Authentication required</li>
      <li>404 Not Found - Resource doesn't exist</li>
      <li>405 Method Not Allowed</li>
    </ul>
  </div>

  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-ban"></i> 5xx Server Errors</h4>
    <ul>
      <li>500 Internal Server Error</li>
      <li>502 Bad Gateway</li>
      <li>503 Service Unavailable</li>
    </ul>
  </div>
</div>

---

## 8. Complete REST API Example

<div class="example-output-container">
  <div class="example-output-header">
    <i class="fas fa-code"></i> Simple REST API Server
  </div>
  <div class="example-output-preview">
    <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border); font-family: 'JetBrains Mono', monospace; font-size: 11px; max-height: 500px; overflow-y: auto;">

```javascript
// api-server.js
const http = require('http');
const url = require('url');

// In-memory data store
let posts = [
  { id: 1, title: 'First Post', content: 'Hello World' },
  { id: 2, title: 'Second Post', content: 'Node.js is awesome' }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  // GET /api/posts - Get all posts
  if (pathname === '/api/posts' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(posts));
  }
  
  // GET /api/posts/:id - Get specific post
  else if (pathname.match(/^\/api\/posts\/\d+$/) && req.method === 'GET') {
    const id = parseInt(pathname.split('/')[3]);
    const post = posts.find(p => p.id === id);
    
    if (post) {
      res.writeHead(200);
      res.end(JSON.stringify(post));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Post not found' }));
    }
  }
  
  // POST /api/posts - Create new post
  else if (pathname === '/api/posts' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const newPost = JSON.parse(body);
        newPost.id = Math.max(...posts.map(p => p.id)) + 1;
        posts.push(newPost);
        
        res.writeHead(201);
        res.end(JSON.stringify(newPost));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }
  
  // DELETE /api/posts/:id - Delete post
  else if (pathname.match(/^\/api\/posts\/\d+$/) && req.method === 'DELETE') {
    const id = parseInt(pathname.split('/')[3]);
    const index = posts.findIndex(p => p.id === id);
    
    if (index !== -1) {
      posts.splice(index, 1);
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Post not found' }));
    }
  }
  
  // 404
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3000, () => {
  console.log('REST API server running at http://localhost:3000');
});
```

    </div>
  </div>
</div>

---

## 9. Testing Your Server

### Using curl (Command Line)

```bash
# GET request
curl http://localhost:3000/api/posts

# POST request
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"New Post","content":"Test"}'

# DELETE request
curl -X DELETE http://localhost:3000/api/posts/1
```

### Using Node.js http Module for Testing

```javascript
const http = require('http');

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    
    req.on('error', reject);
    req.end();
  });
}

makeRequest('GET', '/api/posts').then(data => {
  console.log('Response:', data);
});
```

---

## 10. Best Practices

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Always set appropriate status codes</li>
      <li>Set correct Content-Type headers</li>
      <li>Handle all error cases</li>
      <li>Use routing frameworks (Express) for complex apps</li>
      <li>Validate and sanitize input data</li>
      <li>Use HTTPS in production</li>
      <li>Implement request logging</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Forgetting to call res.end()</li>
      <li>Not handling request errors</li>
      <li>Returning wrong status codes</li>
      <li>Not setting Content-Type headers</li>
      <li>Blocking the event loop with sync operations</li>
      <li>Not validating request data</li>
      <li>Hardcoding port numbers</li>
    </ul>
  </div>
</div>

---

> [!TIP]
> **Pro Tip**: For production APIs, use frameworks like **Express.js**. It provides routing, middleware, and error handling out of the box, making your code more maintainable and scalable.

---

## 11. Coding Exercise: Build a Todo API

### Task:

Create a simple HTTP server that:
1. GET /todos - Return all todos
2. POST /todos - Add new todo
3. DELETE /todos/:id - Delete a todo
4. Accepts and returns JSON

##### Solution

```javascript
// todo-server.js
const http = require('http');
const url = require('url');

let todos = [
  { id: 1, text: 'Learn Node.js', done: false },
  { id: 2, text: 'Build an API', done: false }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  res.setHeader('Content-Type', 'application/json');
  
  if (pathname === '/todos' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(todos));
  } else if (pathname === '/todos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const todo = JSON.parse(body);
      todo.id = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
      todos.push(todo);
      res.writeHead(201);
      res.end(JSON.stringify(todo));
    });
  } else if (pathname.match(/^\/todos\/\d+$/) && req.method === 'DELETE') {
    const id = parseInt(pathname.split('/')[2]);
    todos = todos.filter(t => t.id !== id);
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3000, () => {
  console.log('Todo API running at http://localhost:3000');
});
```

Run it:
```bash
node todo-server.js
```

---

## Summary

You've successfully created your first HTTP server! This foundation is crucial for all Node.js web development. While raw HTTP is powerful, production applications typically use frameworks like Express.js for better organization and features. In the next lessons, you'll explore working with external APIs, environment variables, and project structure best practices.
