# 🤝 Contributing to 100 Days 100 Web Projects

<div align="center">

![Contributing Banner](https://readme-typing-svg.demolab.com?font=Fira+Code&size=30&weight=700&pause=1000&color=1ABC9C&center=true&width=600&lines=Welcome+Contributors!;Let's+Build+Amazing+Projects;Together!)

</div>

Thank you for your interest in contributing to **100 Days 100 Web Projects**! We're excited to have you join our community of developers building amazing web projects. This guide will help you get started and make your first contribution.

## 📋 Table of Contents

1. [🌟 Ways to Contribute](#-ways-to-contribute)
2. [🚀 Getting Started](#-getting-started)
3. [📁 Project Structure](#-project-structure)
4. [➕ Adding New Projects](#-adding-new-projects)
5. [🐛 Bug Reports & Issues](#-bug-reports--issues)
6. [📝 Pull Request Process](#-pull-request-process)
7. [📖 Documentation Guidelines](#-documentation-guidelines)
8. [🎨 Code Style Guidelines](#-code-style-guidelines)
9. [✅ Testing](#-testing)
10. [📞 Getting Help](#-getting-help)

## 🌟 Ways to Contribute

### 🆕 Adding New Projects
- Create new web development projects
- Implement popular website clones
- Build useful web tools and utilities
- Develop interactive games

### 🔧 Improving Existing Projects
- Fix bugs in current projects
- Enhance functionality
- Improve code quality
- Add responsive design

### 📚 Documentation
- Improve README files
- Add project descriptions
- Create setup guides
- Fix typos and formatting

### 🎨 UI/UX Improvements
- Enhance visual design
- Improve user experience
- Add animations and transitions
- Make projects mobile-friendly

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/100_days_100_web_project.git
cd 100_days_100_web_project
```

### 2. Set Up Remote

```bash
# Add the original repository as upstream
git remote add upstream https://github.com/dhairyagothi/100_days_100_web_project.git
```

### 3. Create a Branch

```bash
# Create a new branch for your contribution
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
# or  
git checkout -b add/project-name
```

## 📁 Project Structure

```
100_days_100_web_project/
├── index.html              # Main showcase website
├── index.js               # Project list and functionality
├── style.css              # Main website styles
├── public/                # All individual projects
│   ├── ProjectName/       # Each project in its own folder
│   │   ├── index.html    # Project entry point
│   │   ├── style.css     # Project styles
│   │   ├── script.js     # Project functionality
│   │   └── README.md     # Project documentation
├── contributors/          # Contributors showcase
├── .gitignore            # Git ignore rules
└── vercel.json           # Deployment configuration
```

## ➕ Adding New Projects

### Step 1: Create Project Folder
```bash
# Create a new folder in the public directory
mkdir public/YourProjectName
cd public/YourProjectName
```

### Step 2: Project Files
Create these essential files:

**index.html** (Required)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Project Name</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Your project content -->
    
    <script src="script.js"></script>
</body>
</html>
```

**style.css** (Recommended)
```css
/* Your project styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    /* Add your styles */
}
```

**script.js** (If needed)
```javascript
// Your project functionality
document.addEventListener('DOMContentLoaded', function() {
    // Your code here
});
```

**README.md** (Required)
```markdown
# Your Project Name

Brief description of your project.

## Features
- Feature 1
- Feature 2

## Technologies Used
- HTML
- CSS
- JavaScript

## How to Run
1. Open index.html in a web browser
2. Enjoy the project!

## Screenshots
Add screenshots of your project

## Author
Your Name
```

### Step 3: Update Main Project List
Add your project to the main website by editing `index.js`:

```javascript
// Find the data array and add your project
["Day X", "Your Project Name", "/public/YourProjectName/index.html"],
```

### Step 4: Add .gitignore (If needed)
For projects with dependencies:

```gitignore
# Dependencies
node_modules/
.env

# Build outputs
dist/
build/

# IDE files
.vscode/
.idea/
```

## 🐛 Bug Reports & Issues

### Before Submitting
- Search existing issues to avoid duplicates
- Test on different browsers if applicable
- Check if it's already fixed in the latest version

### Issue Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. Scroll down to...
4. See error

**Expected Behavior** 
What you expected to happen

**Screenshots**
Add screenshots if applicable

**Environment**
- Browser: [e.g. Chrome, Firefox]
- Version: [e.g. 22]
- OS: [e.g. Windows, macOS, Linux]
```

## 📝 Pull Request Process

### 1. Keep Your Fork Updated
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Make Changes
- Follow our coding standards
- Test your changes thoroughly
- Add documentation if needed

### 3. Commit Changes
```bash
git add .
git commit -m "feat: add new project - Project Name"
# or
git commit -m "fix: resolve mobile responsiveness issue"
# or
git commit -m "docs: update README with setup instructions"
```

### 4. Push and Create PR
```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Screenshots/GIFs if applicable
- List of changes made

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New project
- [ ] Bug fix
- [ ] Feature enhancement
- [ ] Documentation update

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile
- [ ] No console errors

## Screenshots
Add screenshots if applicable

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No merge conflicts
```

## 📖 Documentation Guidelines

### Project README Structure
```markdown
# Project Name

## Description
Brief overview of what the project does

## Features
- List key features
- Use bullet points

## Technologies Used
- HTML5
- CSS3
- JavaScript ES6

## Installation/Setup
Step-by-step instructions

## Usage
How to use the project

## Screenshots
Visual representation

## Contributing
How others can contribute

## License
MIT License

## Author
Your information
```

## 🎨 Code Style Guidelines

### HTML
- Use semantic HTML elements
- Proper indentation (2 spaces)
- Include alt text for images
- Use meaningful class and id names

```html
<!-- Good -->
<section class="hero-section">
    <h1 class="hero-title">Welcome</h1>
    <p class="hero-description">Description here</p>
</section>

<!-- Avoid -->
<div class="div1">
    <h1>Welcome</h1>
    <p>Description here</p>
</div>
```

### CSS
- Use meaningful class names
- Follow BEM methodology when appropriate
- Group related properties
- Use CSS custom properties for repeated values

```css
/* Good */
.hero-section {
    background-color: var(--primary-color);
    padding: 2rem;
    text-align: center;
}

.hero-section__title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

/* Avoid */
.div1 {
    background-color: #3498db;
    padding: 32px;
    text-align: center;
}
```

### JavaScript
- Use const/let instead of var
- Use arrow functions when appropriate
- Add comments for complex logic
- Handle errors gracefully

```javascript
// Good
const initializeProject = () => {
    try {
        // Project initialization logic
        setupEventListeners();
        loadInitialData();
    } catch (error) {
        console.error('Failed to initialize project:', error);
    }
};

// Avoid
function init() {
    var x = document.getElementById('test');
    // ... code without error handling
}
```

## ✅ Testing

### Manual Testing Checklist
- [ ] Project loads without errors
- [ ] All features work as expected
- [ ] Responsive design works on different screen sizes
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari)
- [ ] No console errors or warnings
- [ ] Proper error handling
- [ ] All links and buttons work

### Browser Testing
Test your project on:
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: Chrome Mobile, Safari Mobile
- **Screen sizes**: Mobile (375px), Tablet (768px), Desktop (1200px+)

## 📞 Getting Help

### Community Support
- 💬 **GitHub Discussions**: Ask questions and get help from the community
- 🐛 **Issues**: Report bugs or request features
- 📧 **Direct Contact**: Create an issue for specific questions

### Resources
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [W3Schools](https://www.w3schools.com/) - Web development tutorials
- [CSS Tricks](https://css-tricks.com/) - CSS tips and tricks
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial

## 🏆 Recognition

Contributors will be:
- Added to our contributors wall
- Mentioned in release notes
- Featured on the project website
- Given credit in project documentation

## 📜 Code of Conduct

Please be respectful and inclusive in all interactions. We strive to create a welcoming environment for developers of all backgrounds and experience levels.

---

<div align="center">

**🌟 Thank you for contributing to 100 Days 100 Web Projects! 🌟**

**Your contributions help developers worldwide learn and grow!**

</div>

We love pull requests! If you have a fix or a new feature, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b my-feature`).
3. Make your changes.
4. Test your changes.
5. Commit your changes (`git commit -am 'Add new feature'`).
6. Push to the branch (`git push origin my-feature`).
7. Open a pull request.

Please ensure your pull request adheres to the following guidelines:

- Describe the purpose of the pull request and the changes made.
- Reference any related issues or pull requests.
- Ensure your code follows the project's style guides.
- Include tests for new features or bug fixes.
- Update documentation as needed.


## Contribution Guidelines

Thank you for considering contributing to our project! To ensure smooth collaboration and effective contribution management, please adhere to the following guidelines:

### Issue Creation

1. **Limit on Issues:**
   - Each contributor is allowed to create a maximum of **4 issues per day**. This helps us manage and address issues efficiently.

### Contribution Levels

2. **Basic Contributions:**
   - This project is primarily focused on documentation. Most of the setup has been completed, so contributors will generally need to work on basic code tasks, such as writing tests.
   - For these tasks, issues will be assigned the **Easy** label.

3. **Acknowledging Hard Work:**
   - If a contributor puts in significant effort on a task, the issue will be upgraded to **Medium**. This is our way of recognizing and appreciating extra effort.

4. **Feature Additions and Component Work:**
   - Contributors working on new features or components using JSX/TSX will be assigned a level based on the complexity and quality of their work.
   - The more complex and valuable the contribution, the higher the level assigned.

### Level Definitions

- **Easy:**
  - Tasks are straightforward, such as fixing minor bugs, writing tests, or making simple documentation updates.
- **Medium:**
  - Tasks require more effort, such as addressing complex bugs, improving existing features, or making substantial documentation improvements.
- **Hard:**
  - Tasks are highly complex and involve significant new feature development, major refactoring, or extensive contributions to the project’s core components.

We look forward to your contributions and appreciate your effort in helping us improve the project!

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to 100 Days 100 Web Projects!
