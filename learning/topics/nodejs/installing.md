# Installing Node.js

Before you can start building Node.js applications, you need to install Node.js and npm (Node Package Manager) on your system. This lesson walks you through the installation process on all major operating systems.

---

## 1. What You're Installing

When you install Node.js, you automatically get:
- **Node.js Runtime**: The JavaScript engine that executes your code
- **npm**: The package manager for downloading and managing libraries
- **Command-Line Tools**: Access to the `node` and `npm` commands in your terminal

### Version Overview

Node.js releases come in two types:

| Type | Description | Stability |
| :--- | :--- | :--- |
| **LTS (Long-Term Support)** | Stable, recommended for production | ✅ Recommended |
| **Current** | Latest features, frequent updates | ⚠️ For testing only |

---

## 2. Installation Process

### On Windows

**Step 1**: Visit the official Node.js website
```
https://nodejs.org/
```

**Step 2**: Download the LTS version (recommended)

<div class="vector-flowchart">
  <svg viewBox="0 0 600 200" width="100%">
    <!-- Download Box -->
    <rect x="50" y="30" width="500" height="140" rx="8" style="fill: rgba(59, 130, 246, 0.1); stroke: var(--border); stroke-width: 2;"/>
    
    <!-- Title -->
    <text x="300" y="55" text-anchor="middle" class="svg-text svg-text-heading">Windows Installation Steps</text>
    
    <!-- Step 1 -->
    <rect x="70" y="80" width="160" height="70" rx="6" class="svg-node"/>
    <text x="150" y="100" text-anchor="middle" class="svg-text svg-text-heading">Step 1</text>
    <text x="150" y="118" text-anchor="middle" class="svg-text" style="font-size: 12px;">Download .msi</text>
    <text x="150" y="132" text-anchor="middle" class="svg-text" style="font-size: 12px;">installer file</text>
    
    <!-- Arrow -->
    <path d="M 230 115 L 260 115" class="svg-line"/>
    <polygon points="260,115 254,111 254,119" class="svg-marker"/>
    
    <!-- Step 2 -->
    <rect x="260" y="80" width="160" height="70" rx="6" class="svg-node"/>
    <text x="340" y="100" text-anchor="middle" class="svg-text svg-text-heading">Step 2</text>
    <text x="340" y="118" text-anchor="middle" class="svg-text" style="font-size: 12px;">Run installer</text>
    <text x="340" y="132" text-anchor="middle" class="svg-text" style="font-size: 12px;">and click Next</text>
    
    <!-- Arrow -->
    <path d="M 420 115 L 450 115" class="svg-line"/>
    <polygon points="450,115 444,111 444,119" class="svg-marker"/>
    
    <!-- Step 3 -->
    <rect x="450" y="80" width="70" height="70" rx="6" class="svg-node" style="fill: rgba(16, 185, 129, 0.1);"/>
    <text x="485" y="100" text-anchor="middle" class="svg-text svg-text-heading">Done!</text>
    <text x="485" y="132" text-anchor="middle" class="svg-text" style="font-size: 12px;">✓</text>
  </svg>
</div>

**Step 3**: Run the installer
- Double-click the downloaded `.msi` file
- Follow the installation wizard (accept defaults)
- Restart your computer

**Step 4**: Verify installation
Open Command Prompt and run:
```cmd
node --version
npm --version
```

---

### On macOS

**Option 1: Using Homebrew (Recommended)**

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify
node --version
npm --version
```

**Option 2: Using the Installer**
1. Visit https://nodejs.org/
2. Download the macOS installer
3. Run the installer and follow prompts

---

### On Linux (Ubuntu/Debian)

```bash
# Update package manager
sudo apt-get update

# Install Node.js and npm
sudo apt-get install nodejs npm

# Verify
node --version
npm --version
```

**For other Linux distributions**, visit the [Node.js binary distributions](https://nodejs.org/en/download/package-manager/) guide.

---

## 3. Verify Your Installation

### Check Node Version

```bash
node --version
# Output: v18.17.0 (or your installed version)
```

### Check npm Version

```bash
npm --version
# Output: 9.8.1 (or your installed version)
```

### Run a Quick Test

Create a file called `test.js`:

```javascript
console.log('Node.js is installed and working!');
console.log('Node version:', process.version);
console.log('npm version:', process.env.npm_package_version);
```

Run it:
```bash
node test.js
```

<div class="example-output-container">
  <div class="example-output-header">
    <i class="fas fa-terminal"></i> Expected Output
  </div>
  <div class="example-output-preview">
    <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border); font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #10b981;">
      $ node test.js<br/>
      Node.js is installed and working!<br/>
      Node version: v18.17.0<br/>
      npm version: 9.8.1<br/>
      $
    </div>
  </div>
</div>

---

## 4. First npm Project Setup

Once Node.js is installed, you can initialize an npm project:

### Step 1: Create a Project Directory

```bash
mkdir my-node-project
cd my-node-project
```

### Step 2: Initialize npm

```bash
npm init -y
```

This creates a `package.json` file:

```json
{
  "name": "my-node-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### Step 3: Create Your First Application

Create `index.js`:

```javascript
console.log('Welcome to my Node.js project!');

const sum = (a, b) => a + b;
console.log('2 + 3 =', sum(2, 3));
```

### Step 4: Run Your Application

```bash
node index.js
```

---

## 5. Installing Your First Package

### Using npm to Install Packages

The npm registry contains millions of packages. Let's install a popular one:

```bash
# Install the 'colors' package
npm install colors
```

This creates a `node_modules/` directory and updates `package.json`.

### Using an Installed Package

Create `colorize.js`:

```javascript
const colors = require('colors');

console.log(colors.red('This text is red'));
console.log(colors.green('This text is green'));
console.log(colors.blue('This text is blue'));
console.log(colors.yellow.bgMagenta('Custom styling'));
```

Run it:
```bash
node colorize.js
```

---

## 6. Package.json Deep Dive

Your `package.json` file is crucial for managing dependencies:

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "My first Node.js app",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "keywords": ["nodejs", "app"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "colors": "^1.4.0"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

### Key Fields:

| Field | Purpose |
| :--- | :--- |
| `name` | Package name (must be lowercase) |
| `version` | Semantic versioning (major.minor.patch) |
| `main` | Entry point file |
| `scripts` | Custom commands to run with `npm run` |
| `dependencies` | Required packages for production |
| `devDependencies` | Packages only needed for development |

---

## 7. Common npm Commands

| Command | Purpose |
| :--- | :--- |
| `npm install` | Install all dependencies from package.json |
| `npm install <package>` | Install a specific package |
| `npm install -g <package>` | Install globally (system-wide) |
| `npm update` | Update packages to latest versions |
| `npm uninstall <package>` | Remove a package |
| `npm list` | Show installed packages |
| `npm run <script>` | Execute a script defined in package.json |

---

## 8. Troubleshooting Installation

### Issue: Command not found

**Solution**: Restart your terminal or computer after installation

### Issue: Permission denied on macOS/Linux

**Solution**: Use `sudo` or configure npm to avoid permission issues:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Issue: Old version of Node.js

**Solution**: Update using your package manager:
```bash
# On macOS with Homebrew
brew upgrade node

# On Linux
sudo apt-get upgrade nodejs
```

---

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Always use LTS versions for production</li>
      <li>Keep Node.js and npm updated regularly</li>
      <li>Use version managers (nvm, fnm) for multiple versions</li>
      <li>Add node_modules to .gitignore</li>
      <li>Commit package-lock.json for consistency</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Installing with `sudo` on Unix systems</li>
      <li>Not restarting terminal after installation</li>
      <li>Mixing different Node.js versions</li>
      <li>Ignoring package-lock.json</li>
      <li>Using outdated or unsupported versions</li>
    </ul>
  </div>
</div>

---

> [!TIP]
> **Pro Tip**: Use a Node version manager like [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) or [fnm](https://github.com/Schniz/fnm) to easily switch between different Node.js versions for different projects.

---

## 9. Coding Exercise: Set Up Your Development Environment

### Task:

1. Install Node.js (if not already installed)
2. Create a new project directory
3. Initialize npm with `npm init -y`
4. Install the `chalk` package for colored output
5. Create an app that uses chalk to print colored messages

##### Solution

```bash
# Step 1-3: Create and initialize project
mkdir color-demo
cd color-demo
npm init -y

# Step 4: Install chalk
npm install chalk
```

```javascript
// app.js - Step 5: Create app
const chalk = require('chalk');

console.log(chalk.bgBlue.white(' Node.js Setup Complete! '));
console.log(chalk.green('✓ Node.js is installed'));
console.log(chalk.green('✓ npm is configured'));
console.log(chalk.yellow('Ready to build awesome applications!'));
```

Run it:
```bash
node app.js
```

---

## Summary

You've successfully installed Node.js and npm, created your first project, and installed external packages. Your development environment is now ready for building Node.js applications. In the next lesson, you'll explore the module system and learn how to organize code into reusable modules.
