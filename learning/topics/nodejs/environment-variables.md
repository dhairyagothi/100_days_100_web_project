# Environment Variables

**Environment variables** are dynamic values that configure how your application behaves. They're essential for managing configuration, secrets, and settings across different environments (development, testing, production).

---

## 1. Why Environment Variables?

### Problems They Solve

Without environment variables, you'd hardcode values:

```javascript
// ❌ BAD: Hardcoded secrets
const dbPassword = 'super_secret_password_123';
const apiKey = 'my-api-key-xyz';
const port = 3000;
```

This is problematic because:
- Secrets end up in version control
- Different environments need different values
- Hard to manage multiple configurations
- Security vulnerability if code is compromised

### Solution: Environment Variables

```javascript
// ✅ GOOD: Using environment variables
const dbPassword = process.env.DB_PASSWORD;
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3000;
```

---

## 2. Accessing Environment Variables

### Using process.env

```javascript
// Access a specific environment variable
const port = process.env.PORT;
const environment = process.env.NODE_ENV;
const apiKey = process.env.API_KEY;

console.log('Port:', port);
console.log('Environment:', environment);
console.log('API Key:', apiKey);
```

### Checking if Variable Exists

```javascript
if (process.env.DATABASE_URL) {
  console.log('Database URL is set');
} else {
  console.log('Database URL is not set');
}
```

### Setting Default Values

```javascript
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
const env = process.env.NODE_ENV || 'development';
```

---

## 3. Setting Environment Variables

### On Linux/macOS

```bash
# Set for a single command
PORT=8000 node app.js

# Set in shell (for current session)
export PORT=8000
export DATABASE_URL='mongodb://localhost'
node app.js

# View all environment variables
env

# View a specific variable
echo $PORT
```

### On Windows (Command Prompt)

```cmd
# Set for a single command
set PORT=8000 && node app.js

# Set in shell (for current session)
set PORT=8000
set DATABASE_URL=mongodb://localhost
node app.js

# View all environment variables
set

# View a specific variable
echo %PORT%
```

### On Windows (PowerShell)

```powershell
# Set and run command
$env:PORT=8000; node app.js

# View variable
$env:PORT
```

---

## 4. Using .env Files with dotenv

For local development, store variables in a `.env` file:

### Installation

```bash
npm install dotenv
```

### Creating .env File

Create a `.env` file in your project root:

```
# .env
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/mydb
API_KEY=your-secret-api-key
JWT_SECRET=your-jwt-secret
LOG_LEVEL=debug
```

### Loading .env Variables

```javascript
// config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  logLevel: process.env.LOG_LEVEL || 'info'
};
```

```javascript
// app.js
const config = require('./config');

console.log(`Starting ${config.environment} server on port ${config.port}`);
console.log(`Database: ${config.databaseUrl}`);
```

---

## 5. Environment-Specific Configuration

### Create Different .env Files

```
.env.development
.env.testing
.env.production
```

### Load Based on NODE_ENV

```javascript
// config.js
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

module.exports = {
  port: process.env.PORT,
  debug: process.env.NODE_ENV === 'development'
};
```

---

## 6. Environment Variables Workflow

<div class="vector-flowchart">
  <svg viewBox="0 0 700 300" width="100%">
    <!-- Title -->
    <text x="350" y="25" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 18px; font-weight: 600;">Environment Variables Flow</text>
    
    <!-- Development -->
    <g>
      <rect x="30" y="60" width="140" height="80" rx="6" class="svg-node"/>
      <text x="100" y="85" text-anchor="middle" class="svg-text svg-text-heading">Development</text>
      <text x="100" y="103" text-anchor="middle" class="svg-text" style="font-size: 11px;">.env file</text>
      <text x="100" y="118" text-anchor="middle" class="svg-text" style="font-size: 11px;">local machine</text>
      
      <path d="M 170 100 L 210 100" class="svg-line"/>
      <polygon points="210,100 204,96 204,104" class="svg-marker"/>
    </g>
    
    <!-- process.env -->
    <rect x="210" y="60" width="140" height="80" rx="6" class="svg-node" style="fill: rgba(59, 130, 246, 0.1);"/>
    <text x="280" y="85" text-anchor="middle" class="svg-text svg-text-heading">process.env</text>
    <text x="280" y="103" text-anchor="middle" class="svg-text" style="font-size: 11px;">Runtime</text>
    <text x="280" y="118" text-anchor="middle" class="svg-text" style="font-size: 11px;">Variables</text>
    
    <path d="M 350 100 L 390 100" class="svg-line"/>
    <polygon points="390,100 384,96 384,104" class="svg-marker"/>
    
    <!-- Application -->
    <rect x="390" y="60" width="140" height="80" rx="6" class="svg-node" style="fill: rgba(16, 185, 129, 0.1);"/>
    <text x="460" y="85" text-anchor="middle" class="svg-text svg-text-heading">Application</text>
    <text x="460" y="103" text-anchor="middle" class="svg-text" style="font-size: 11px;">Uses config</text>
    <text x="460" y="118" text-anchor="middle" class="svg-text" style="font-size: 11px;">values</text>
    
    <path d="M 530 100 L 570 100" class="svg-line"/>
    <polygon points="570,100 564,96 564,104" class="svg-marker"/>
    
    <!-- Behavior -->
    <rect x="570" y="60" width="100" height="80" rx="6" class="svg-node" style="fill: rgba(239, 68, 68, 0.1);"/>
    <text x="620" y="85" text-anchor="middle" class="svg-text svg-text-heading">Behavior</text>
    <text x="620" y="103" text-anchor="middle" class="svg-text" style="font-size: 11px;">Customized</text>
    <text x="620" y="118" text-anchor="middle" class="svg-text" style="font-size: 11px;">per env</text>
    
    <!-- Production Path -->
    <g>
      <rect x="30" y="180" width="140" height="80" rx="6" class="svg-node" style="fill: rgba(239, 68, 68, 0.1);"/>
      <text x="100" y="205" text-anchor="middle" class="svg-text svg-text-heading">Production</text>
      <text x="100" y="223" text-anchor="middle" class="svg-text" style="font-size: 11px;">System</text>
      <text x="100" y="238" text-anchor="middle" class="svg-text" style="font-size: 11px;">Environment</text>
      
      <path d="M 170 220 L 210 220" class="svg-line"/>
      <polygon points="210,220 204,216 204,224" class="svg-marker"/>
    </g>
    
    <!-- Environment Types -->
    <rect x="210" y="170" width="480" height="100" rx="6" style="fill: rgba(96, 165, 250, 0.05); stroke: var(--border); stroke-width: 1;"/>
    
    <text x="350" y="190" text-anchor="middle" class="svg-text svg-text-heading">Typical Environments</text>
    
    <!-- Dev -->
    <rect x="230" y="210" width="105" height="50" rx="4" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--border);"/>
    <text x="282" y="230" text-anchor="middle" class="svg-text" style="font-size: 11px; font-weight: 500;">Development</text>
    <text x="282" y="248" text-anchor="middle" class="svg-text" style="font-size: 10px;">Local testing</text>
    
    <!-- Test -->
    <rect x="345" y="210" width="105" height="50" rx="4" style="fill: rgba(59, 130, 246, 0.1); border: 1px solid var(--border);"/>
    <text x="397" y="230" text-anchor="middle" class="svg-text" style="font-size: 11px; font-weight: 500;">Testing</text>
    <text x="397" y="248" text-anchor="middle" class="svg-text" style="font-size: 10px;">CI/CD pipeline</text>
    
    <!-- Prod -->
    <rect x="460" y="210" width="105" height="50" rx="4" style="fill: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444;"/>
    <text x="512" y="230" text-anchor="middle" class="svg-text" style="font-size: 11px; font-weight: 500;">Production</text>
    <text x="512" y="248" text-anchor="middle" class="svg-text" style="font-size: 10px;">Live server</text>
    
    <!-- Staging -->
    <rect x="575" y="210" width="105" height="50" rx="4" style="fill: rgba(16, 185, 129, 0.1); border: 1px solid #10b981;"/>
    <text x="627" y="230" text-anchor="middle" class="svg-text" style="font-size: 11px; font-weight: 500;">Staging</text>
    <text x="627" y="248" text-anchor="middle" class="svg-text" style="font-size: 10px;">Pre-production</text>
  </svg>
</div>

---

## 7. Security Best Practices

### .gitignore Configuration

Always exclude `.env` files from version control:

```
# .gitignore
.env
.env.local
.env.*.local
node_modules/
```

### Example .env.example (Safe to Commit)

```
# .env.example - Commit this, not .env
PORT=3000
NODE_ENV=development
DATABASE_URL=your_database_url_here
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
```

### Validation Pattern

```javascript
// config.js
require('dotenv').config();

const required = [
  'DATABASE_URL',
  'API_KEY',
  'JWT_SECRET'
];

const missing = required.filter(
  key => !process.env[key]
);

if (missing.length > 0) {
  throw new Error(
    `Missing required env vars: ${missing.join(', ')}`
  );
}

module.exports = {
  port: process.env.PORT || 3000,
  database: process.env.DATABASE_URL,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET
};
```

---

## 8. Common Environment Variables

### Standard Variables

| Variable | Purpose | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Execution environment | development, testing, production |
| `PORT` | Server listening port | 3000, 8000 |
| `HOST` | Server hostname | localhost, 0.0.0.0 |
| `LOG_LEVEL` | Logging verbosity | error, warn, info, debug |

### Application-Specific

| Variable | Purpose | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Database connection | mongodb://localhost |
| `JWT_SECRET` | Token signing key | secret-key |
| `API_KEY` | Third-party service key | api_key_xyz |
| `SMTP_PASSWORD` | Email service password | secret |

---

## 9. Real-World Configuration Example

<div class="example-output-container">
  <div class="example-output-header">
    <i class="fas fa-code"></i> Complete Configuration Setup
  </div>
  <div class="example-output-preview">
    <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border); font-family: 'JetBrains Mono', monospace; font-size: 11px; max-height: 400px; overflow-y: auto;">

```javascript
// config/index.js
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

// Validation
const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'API_KEY'
];

const missing = required.filter(
  key => !process.env[key]
);

if (missing.length > 0) {
  console.error(
    'Missing environment variables:',
    missing
  );
  process.exit(1);
}

// Export config
module.exports = {
  // Server
  port: parseInt(process.env.PORT) || 3000,
  host: process.env.HOST || 'localhost',
  environment: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    url: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    }
  },
  
  // Security
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // External Services
  api: {
    key: process.env.API_KEY,
    baseUrl: process.env.API_BASE_URL
  },
  
  // Logging
  log: {
    level: process.env.LOG_LEVEL || 'info'
  },
  
  // Flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTesting: process.env.NODE_ENV === 'testing'
};
```

```javascript
// app.js
const config = require('./config');

console.log(`Starting server in ${config.environment} mode`);
console.log(`Listening on ${config.host}:${config.port}`);

if (config.isDevelopment) {
  console.log('Debug mode enabled');
}
```

    </div>
  </div>
</div>

---

## 10. Best Practices

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Never commit .env files to version control</li>
      <li>Use .env.example as documentation</li>
      <li>Validate required variables on startup</li>
      <li>Use different files for each environment</li>
      <li>Set sensible defaults for non-secrets</li>
      <li>Document all required variables</li>
      <li>Use UPPER_CASE for variable names</li>
      <li>Rotate secrets regularly</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Committing .env with secrets</li>
      <li>Hardcoding sensitive values</li>
      <li>Not validating environment setup</li>
      <li>Using same secrets across environments</li>
      <li>Not documenting required variables</li>
      <li>Logging environment variables</li>
      <li>Using default secrets in production</li>
    </ul>
  </div>
</div>

---

> [!TIP]
> **Pro Tip**: In production on platforms like Heroku or AWS, set environment variables directly in the platform's configuration instead of using `.env` files. This keeps secrets completely separate from code.

---

## 11. Coding Exercise: Build a Configurable Server

### Task:

Create a server that:
1. Loads configuration from .env
2. Validates required variables
3. Adjusts behavior based on NODE_ENV
4. Logs configuration on startup

##### Solution

```bash
# .env.development
PORT=3000
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug

# .env.production
PORT=8000
NODE_ENV=production
DEBUG=false
LOG_LEVEL=error
```

```javascript
// app.js
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

const required = ['PORT', 'NODE_ENV'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('Missing:', missing);
  process.exit(1);
}

const config = {
  port: parseInt(process.env.PORT),
  environment: process.env.NODE_ENV,
  debug: process.env.DEBUG === 'true',
  logLevel: process.env.LOG_LEVEL || 'info'
};

console.log('Configuration loaded:');
console.log(JSON.stringify(config, null, 2));

const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(config));
});

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
```

---

## Summary

Environment variables are fundamental to professional Node.js development. They enable safe configuration management, support multiple deployment environments, and protect sensitive information. Mastering environment variable configuration is essential for building secure, scalable applications. In the next lesson, you'll learn about Node.js project structure best practices.
