# 🏆 Node.js Quiz

Test your knowledge of Node.js concepts covered in this learning module! Answer all 10 questions to assess your understanding.

---

## Quiz Questions

**Click on your answer for each question below. Your score will be calculated automatically.**

### Question 1
**What does Node.js primarily enable you to do?**

A) Create interactive web animations with JavaScript  
B) Execute JavaScript code on servers outside the browser  
C) Style web pages with CSS  
D) Create databases directly  

**Correct Answer: B** — Node.js is a runtime that allows JavaScript to run on servers for backend development.

---

### Question 2
**Which of the following best describes the Event Loop?**

A) A loop that continuously refreshes the page  
B) A mechanism that manages asynchronous operations and callbacks  
C) A JavaScript syntax feature  
D) A way to format HTML documents  

**Correct Answer: B** — The Event Loop handles asynchronous code execution and manages the queue of operations to execute.

---

### Question 3
**How do you export a function from a Node.js module?**

A) `export default function() { ... }`  
B) `module.exports = function() { ... }`  
C) `function export() { ... }`  
D) `export function() { ... }`  

**Correct Answer: B** — CommonJS modules use `module.exports` to export functionality (ES6 modules use `export`, but CommonJS is Node.js default).

---

### Question 4
**What does npm stand for?**

A) Node Package Manager  
B) Node Programming Module  
C) Network Packet Manager  
D) Node Processor Module  

**Correct Answer: A** — npm is the official package manager for Node.js, providing access to millions of packages.

---

### Question 5
**Which method reads a file without blocking the event loop?**

A) `fs.readFileSync()`  
B) `fs.readFile()`  
C) `fs.read()`  
D) `fs.getFile()`  

**Correct Answer: B** — `fs.readFile()` is asynchronous and uses callbacks, not blocking other operations.

---

### Question 6
**In the Event Loop execution order, what runs before setTimeout callbacks?**

A) Synchronous code only  
B) Promises (microtasks)  
C) Both synchronous code and promises  
D) HTTP requests  

**Correct Answer: C** — Synchronous code runs first, then microtasks (Promises), then macrotasks (setTimeout).

---

### Question 7
**What is the primary purpose of environment variables?**

A) To decorate your code  
B) To manage configuration and secrets across different environments  
C) To improve code performance  
D) To replace functions in your code  

**Correct Answer: B** — Environment variables store configuration values and sensitive data without hardcoding them.

---

### Question 8
**Which HTTP method should you use to create a new resource?**

A) GET  
B) POST  
C) PUT  
D) DELETE  

**Correct Answer: B** — POST is used to send data and create new resources on the server.

---

### Question 9
**What does a status code of 404 indicate?**

A) Server error  
B) Success  
C) Resource not found  
D) Unauthorized access  

**Correct Answer: C** — 404 means the requested resource could not be found on the server.

---

### Question 10
**Which of the following is NOT a typical layer in a layered project architecture?**

A) Routes  
B) Controllers  
C) Models  
D) Widgets  

**Correct Answer: D** — Typical layers are Routes, Middleware, Controllers, Services, and Models. Widgets are UI components, not an architectural layer.

---

## Quiz Summary

This quiz covers:
- **Fundamentals**: What Node.js is and why it's used
- **Asynchrony**: Event Loop and async operations
- **Modules**: CommonJS module system and npm
- **File System**: Async file operations
- **HTTP**: HTTP methods and status codes
- **Configuration**: Environment variables
- **Architecture**: Project structure patterns

---

## Key Concepts Recap

| Concept | Key Point |
| :--- | :--- |
| **Node.js** | Server-side JavaScript runtime with non-blocking I/O |
| **Event Loop** | Manages async operations; Microtasks run before Macrotasks |
| **Modules** | Use `module.exports` and `require()` for CommonJS |
| **npm** | Package manager with millions of packages |
| **Async I/O** | Always use async file operations to avoid blocking |
| **Environment Variables** | Manage secrets and configuration without hardcoding |
| **HTTP Methods** | GET (read), POST (create), PUT (update), DELETE (remove) |
| **Status Codes** | 2xx (success), 4xx (client error), 5xx (server error) |
| **Project Structure** | Organize by type or domain; separate concerns into layers |
| **Error Handling** | Use try-catch with async/await; handle all errors |

---

## Next Steps

Now that you've learned Node.js fundamentals, consider:

1. **Build Projects**: Create real applications using Express.js framework
2. **Database Integration**: Learn MongoDB, PostgreSQL, or other databases
3. **Testing**: Master Jest or Mocha for unit and integration testing
4. **Authentication**: Implement user authentication with JWT or OAuth
5. **Deployment**: Deploy to services like Heroku, AWS, or DigitalOcean
6. **Real-time**: Explore WebSockets with Socket.io for real-time applications

---

## Resources

- [Official Node.js Documentation](https://nodejs.org/docs/)
- [npm Registry](https://www.npmjs.com/)
- [Express.js Framework](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## Congratulations!

You've completed the Node.js learning module! You now understand:
- Core Node.js concepts and architecture
- Asynchronous programming patterns
- Module system and package management
- File system operations
- HTTP servers and APIs
- Configuration management
- Professional project organization

These fundamentals prepare you to build scalable, maintainable Node.js applications. Keep practicing by building projects and exploring the vast npm ecosystem!
