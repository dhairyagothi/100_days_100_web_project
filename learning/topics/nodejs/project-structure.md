# Node.js Project Structure

A well-organized project structure is critical for scalability, maintainability, and team collaboration. This lesson covers industry-standard project organization patterns and best practices.

---

## 1. Why Project Structure Matters

Good structure provides:
- **Scalability**: Easy to add new features
- **Maintainability**: Quick to find and modify code
- **Testability**: Simple to write and organize tests
- **Collaboration**: Team members understand the codebase quickly
- **Modularity**: Clear separation of concerns

---

## 2. Basic Project Structure

### Minimal Express.js Project

```
my-app/
├── node_modules/          # Dependencies (don't commit)
├── src/                   # Source code
│   ├── config/           # Configuration
│   │   └── config.js
│   ├── routes/           # Route handlers
│   │   └── users.js
│   ├── controllers/      # Business logic
│   │   └── userController.js
│   ├── models/           # Data models
│   │   └── User.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   └── app.js            # Main app file
├── tests/                 # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env                   # Environment variables (don't commit)
├── .env.example          # Example env file
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies & scripts
├── package-lock.json     # Locked dependencies
└── README.md             # Documentation
```

---

## 3. Directory-by-Type vs Domain-Based

### Approach 1: Directory-by-Type (Recommended for small projects)

```
src/
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── users.js
│   ├── products.js
│   └── orders.js
└── middleware/
    ├── auth.js
    └── errorHandler.js
```

**Advantages**: Easy to understand, good for small teams
**Disadvantages**: Gets cluttered as project grows

### Approach 2: Domain-Based/Feature-Based (Recommended for large projects)

```
src/
├── features/
│   ├── users/
│   │   ├── userController.js
│   │   ├── userModel.js
│   │   ├── userRoutes.js
│   │   └── userService.js
│   ├── products/
│   │   ├── productController.js
│   │   ├── productModel.js
│   │   ├── productRoutes.js
│   │   └── productService.js
│   └── orders/
│       ├── orderController.js
│       ├── orderModel.js
│       ├── orderRoutes.js
│       └── orderService.js
├── shared/
│   ├── middleware/
│   ├── utils/
│   └── validators/
└── app.js
```

**Advantages**: Scales well, clear ownership, self-contained features
**Disadvantages**: Slightly more complex structure

---

## 4. File Organization Best Practices

### Models Layer

```javascript
// src/models/User.js
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
  
  static async findById(id) {
    // Database query
  }
  
  async save() {
    // Save to database
  }
}

module.exports = User;
```

### Controller Layer

```javascript
// src/controllers/userController.js
const User = require('../models/User');

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createUser(req, res) {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { getUser, createUser };
```

### Routes Layer

```javascript
// src/routes/users.js
const express = require('express');
const router = express.Router();
const { getUser, createUser } = require('../controllers/userController');

router.get('/:id', getUser);
router.post('/', createUser);

module.exports = router;
```

### Main App File

```javascript
// src/app.js
const express = require('express');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);

module.exports = app;
```

### Entry Point

```javascript
// index.js
const app = require('./src/app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 5. Project Structure Visualization

<div class="vector-flowchart">
  <svg viewBox="0 0 700 380" width="100%">
    <!-- Title -->
    <text x="350" y="25" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 18px; font-weight: 600;">Layered Architecture Flow</text>
    
    <!-- HTTP Request -->
    <circle cx="100" cy="80" r="30" style="fill: rgba(59, 130, 246, 0.2); stroke: var(--accent); stroke-width: 2;"/>
    <text x="100" y="85" text-anchor="middle" class="svg-text" style="font-size: 12px; font-weight: bold;">HTTP</text>
    <text x="100" y="100" text-anchor="middle" class="svg-text" style="font-size: 12px;">Request</text>
    
    <!-- Arrow -->
    <path d="M 130 80 L 170 80" class="svg-line"/>
    <polygon points="170,80 164,76 164,84" class="svg-marker"/>
    
    <!-- Routes Layer -->
    <rect x="170" y="60" width="100" height="40" rx="6" class="svg-node"/>
    <text x="220" y="85" text-anchor="middle" class="svg-text svg-text-heading">Routes</text>
    
    <!-- Arrow -->
    <path d="M 270 80 L 310 80" class="svg-line"/>
    <polygon points="310,80 304,76 304,84" class="svg-marker"/>
    
    <!-- Middleware -->
    <rect x="310" y="60" width="100" height="40" rx="6" class="svg-node" style="fill: rgba(96, 165, 250, 0.1);"/>
    <text x="360" y="85" text-anchor="middle" class="svg-text svg-text-heading">Middleware</text>
    
    <!-- Arrow -->
    <path d="M 410 80 L 450 80" class="svg-line"/>
    <polygon points="450,80 444,76 444,84" class="svg-marker"/>
    
    <!-- Controller -->
    <rect x="450" y="60" width="100" height="40" rx="6" class="svg-node" style="fill: rgba(59, 130, 246, 0.2);"/>
    <text x="500" y="85" text-anchor="middle" class="svg-text svg-text-heading">Controller</text>
    
    <!-- Arrow -->
    <path d="M 500 100 L 500 140" class="svg-line"/>
    <polygon points="500,140 496,134 504,134" class="svg-marker"/>
    
    <!-- Service Layer -->
    <rect x="420" y="140" width="160" height="50" rx="6" class="svg-node" style="fill: rgba(16, 185, 129, 0.1);"/>
    <text x="500" y="160" text-anchor="middle" class="svg-text svg-text-heading">Service/Logic Layer</text>
    <text x="500" y="175" text-anchor="middle" class="svg-text" style="font-size: 11px;">Business logic</text>
    
    <!-- Arrow -->
    <path d="M 500 190 L 500 220" class="svg-line"/>
    <polygon points="500,220 496,214 504,214" class="svg-marker"/>
    
    <!-- Model/Data -->
    <rect x="420" y="220" width="160" height="50" rx="6" class="svg-node" style="fill: rgba(239, 68, 68, 0.1);"/>
    <text x="500" y="240" text-anchor="middle" class="svg-text svg-text-heading">Model Layer</text>
    <text x="500" y="255" text-anchor="middle" class="svg-text" style="font-size: 11px;">Data access</text>
    
    <!-- Arrow -->
    <path d="M 500 270 L 500 300" class="svg-line"/>
    <polygon points="500,300 496,294 504,294" class="svg-marker"/>
    
    <!-- Database -->
    <rect x="420" y="300" width="160" height="50" rx="6" class="svg-node" style="fill: rgba(55, 65, 81, 0.2); stroke: var(--text-secondary);"/>
    <text x="500" y="320" text-anchor="middle" class="svg-text svg-text-heading">Database</text>
    <text x="500" y="335" text-anchor="middle" class="svg-text" style="font-size: 11px;">Data storage</text>
    
    <!-- Side: Key Separation -->
    <rect x="30" y="180" width="320" height="160" rx="8" style="fill: rgba(96, 165, 250, 0.05); stroke: var(--border); stroke-width: 1;"/>
    
    <text x="50" y="200" class="svg-text svg-text-heading" style="font-size: 13px;">Key Separation of Concerns</text>
    
    <!-- Routes -->
    <rect x="50" y="220" width="75" height="50" rx="4" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--border);"/>
    <text x="87" y="235" text-anchor="middle" class="svg-text" style="font-size: 10px; font-weight: 500;">Routes</text>
    <text x="87" y="250" text-anchor="middle" class="svg-text" style="font-size: 9px;">Endpoints</text>
    <text x="87" y="262" text-anchor="middle" class="svg-text" style="font-size: 9px;">&amp; mapping</text>
    
    <!-- Middleware -->
    <rect x="135" y="220" width="75" height="50" rx="4" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--border);"/>
    <text x="172" y="235" text-anchor="middle" class="svg-text" style="font-size: 10px; font-weight: 500;">Middleware</text>
    <text x="172" y="250" text-anchor="middle" class="svg-text" style="font-size: 9px;">Auth, logging,</text>
    <text x="172" y="262" text-anchor="middle" class="svg-text" style="font-size: 9px;">validation</text>
    
    <!-- Logic -->
    <rect x="220" y="220" width="75" height="50" rx="4" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--border);"/>
    <text x="257" y="235" text-anchor="middle" class="svg-text" style="font-size: 10px; font-weight: 500;">Logic</text>
    <text x="257" y="250" text-anchor="middle" class="svg-text" style="font-size: 9px;">Business</text>
    <text x="257" y="262" text-anchor="middle" class="svg-text" style="font-size: 9px;">rules</text>
    
    <!-- Data -->
    <rect x="305" y="220" width="35" height="50" rx="4" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--border);"/>
    <text x="322" y="237" text-anchor="middle" class="svg-text" style="font-size: 9px; font-weight: 500;">Data</text>
    <text x="322" y="251" text-anchor="middle" class="svg-text" style="font-size: 8px;">DB</text>
    
    <!-- Description -->
    <text x="50" y="290" class="svg-text" style="font-size: 10px;">Each layer handles specific responsibility,</text>
    <text x="50" y="305" class="svg-text" style="font-size: 10px;">making code testable and maintainable.</text>
  </svg>
</div>

---

## 6. Testing Structure

```
tests/
├── unit/
│   ├── controllers/
│   │   └── userController.test.js
│   ├── models/
│   │   └── User.test.js
│   └── utils/
│       └── validators.test.js
├── integration/
│   └── api.test.js
└── e2e/
    └── user-flow.test.js
```

### Test File Example

```javascript
// tests/unit/models/User.test.js
const assert = require('assert');
const User = require('../../../src/models/User');

describe('User Model', () => {
  it('should create a user with name and email', () => {
    const user = new User(1, 'John', 'john@example.com');
    assert.strictEqual(user.name, 'John');
    assert.strictEqual(user.email, 'john@example.com');
  });
});
```

---

## 7. Configuration Structure

```
config/
├── default.js        # Default configuration
├── development.js    # Development-specific
├── testing.js        # Test-specific
├── production.js     # Production-specific
└── index.js         # Main config loader
```

```javascript
// config/index.js
const env = process.env.NODE_ENV || 'development';
const defaultConfig = require('./default');
const envConfig = require(`./${env}`);

module.exports = {
  ...defaultConfig,
  ...envConfig
};
```

---

## 8. Documentation Files

```
├── README.md                 # Project overview
├── CONTRIBUTING.md          # Contribution guidelines
├── API.md                   # API documentation
├── ARCHITECTURE.md          # Architecture explanation
├── SETUP.md                 # Setup instructions
└── docs/
    ├── database-schema.md
    ├── deployment.md
    └── troubleshooting.md
```

---

## 9. Utility Functions Organization

```
src/utils/
├── validators.js           # Input validation
├── formatters.js           # Data formatting
├── errorHandler.js         # Error handling
├── logger.js              # Logging utility
└── constants.js           # Shared constants
```

---

## 10. Best Practices

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Keep components small and focused</li>
      <li>Use consistent naming conventions</li>
      <li>Separate concerns into layers</li>
      <li>Keep related files together</li>
      <li>Use clear folder names</li>
      <li>Document complex logic</li>
      <li>Include README files in major folders</li>
      <li>Organize tests with code</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Mixing concerns in single files</li>
      <li>Too many nested directories</li>
      <li>Unclear naming conventions</li>
      <li>Tests far from source code</li>
      <li>No documentation structure</li>
      <li>Hardcoding values across files</li>
      <li>Inconsistent folder organization</li>
    </ul>
  </div>
</div>

---

## 11. Example: Complete Todo App Structure

```
todo-app/
├── src/
│   ├── features/
│   │   ├── todos/
│   │   │   ├── todoController.js
│   │   │   ├── todoModel.js
│   │   │   ├── todoRoutes.js
│   │   │   └── todoService.js
│   │   └── users/
│   │       ├── userController.js
│   │       ├── userModel.js
│   │       ├── userRoutes.js
│   │       └── userService.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── logger.js
│   ├── config.js
│   └── app.js
├── tests/
│   ├── unit/
│   │   └── todoService.test.js
│   └── integration/
│       └── api.test.js
├── .env.example
├── package.json
├── README.md
└── index.js
```

---

## 12. Coding Exercise: Organize a Project

### Task:

Restructure a basic project into a proper layered architecture with controllers, models, and routes.

##### Solution

Structure as shown above with proper separation of concerns, then test by running:

```bash
npm install express
npm start
```

---

## Summary

Good project structure is the foundation of professional Node.js development. It enables collaboration, scalability, and maintainability. Whether using directory-by-type or domain-based organization, the key is consistency and clear separation of concerns. As your application grows, a solid structure becomes increasingly valuable for long-term success.

Congratulations on completing the Node.js fundamentals! You now have the knowledge to build real-world applications. In the final lesson, you'll test your knowledge with a comprehensive quiz.
