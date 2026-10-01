# Developer Hub

A minimal, single-page application hub that provides a navigation sidebar for organizing and switching between multiple developer projects or tools.

## Description

Developer Hub is a lightweight project navigation template that allows developers to create a centralized hub for accessing multiple projects from a single page. It features a persistent left sidebar navigation menu with smooth page switching using vanilla JavaScript. Perfect as a starting point for portfolio hubs, project dashboards, or application launchers.

## Features

- **Sidebar Navigation**: Fixed left sidebar with project/section navigation links
- **Multi-Page Layout**: Switch between different pages/projects without page reloads
- **Active Page Management**: Only one page visible at a time; others hidden via CSS display toggle
- **Clean UI**: Minimal, distraction-free interface with professional dark color scheme
- **Responsive Structure**: HTML/CSS/JS layout with flexbox for proper spacing
- **Easy to Extend**: Simple function-based page switching makes it easy to add more projects
- **Zero Dependencies**: Pure HTML, CSS, and vanilla JavaScript — no frameworks or libraries
- **Fast Loading**: Lightweight single-file application for instant load times

## Tech Stack

- **HTML5** — semantic structure and page organization
- **CSS3** — flexbox layout, hover effects, color scheme, responsive styling
- **Vanilla JavaScript (ES6)** — DOM manipulation, class toggling, page switching

## Folder Structure

```text
Developer-Hub/
│
├── index.html       # Single-file app — navigation sidebar, page containers, styling, scripts
└── README.md        # Project documentation
```

**Note**: This is a minimal template. To add actual project content, create separate HTML files or components in subdirectories:

```text
Developer-Hub/
├── index.html
├── projects/
│   ├── todo/        # Focus List project (HTML, CSS, JS)
│   ├── game/        # Memory Match project (HTML, CSS, JS)
│   └── finance/     # Finance Dashboard project (HTML, CSS, JS)
└── README.md
```

## Setup / Run Instructions

No build step, dependencies, or server setup required. This is a standalone HTML file.

### Option 1: Open Directly
1. Navigate to the `Developer-Hub` folder.
2. Double-click `index.html` to open in your default browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the `Developer-Hub` folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Navigation
- **Sidebar Menu**: The left sidebar displays project navigation links:
  - **Focus List** — Task/todo management project
  - **Memory Match** — Memory card matching game
  - **Finance Dashboard** — Financial tracking/analytics tool
- **Click Links**: Click any navigation link to switch to that project page
- **Active Indicator**: The displayed page updates instantly; others are hidden

### Page Switching
When you click a navigation link:
1. All pages are hidden by removing the `active` CSS class
2. The selected page is shown by adding the `active` CSS class
3. Switching is instant with no page reload

## How It Works

### HTML Structure
The page container holds multiple page `<div>` elements:
```html
<div id="todo" class="page active"><h1>Focus List</h1>...</div>
<div id="game" class="page"><h1>Memory Match</h1>...</div>
<div id="finance" class="page"><h1>Finance Dashboard</h1>...</div>
```

The `active` class controls visibility via CSS:
```css
.page { display: none; }
.active { display: block; }
```

### Page Switching Function
```javascript
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}
```

The `showPage()` function:
1. Selects all page elements
2. Removes the `active` class from all (hides them)
3. Adds the `active` class to the target page (shows it)

### Navigation Triggers
Navigation links call `showPage()` via `onclick`:
```html
<div onclick="showPage('todo')">Focus List</div>
```

## Implementation Notes

- **Single File App**: All HTML, CSS, and JavaScript are embedded in one file for simplicity and portability
- **Flexbox Layout**: The body uses flexbox with the nav at fixed 200px width and main content filling remaining space
- **CSS Classes**: Page visibility is toggled using CSS `display` property and the `active` class
- **No State Management**: Simple onclick handlers; no state library or router needed
- **Extensible**: Adding new pages is as simple as:
  1. Add a new `<div class="page">` with a unique `id`
  2. Add a navigation link that calls `showPage(id)`

## Educational Value

This project demonstrates:

- Single-page application (SPA) basics
- DOM manipulation with vanilla JavaScript
- CSS display property for showing/hiding elements
- Class toggle patterns for UI state management
- Flexbox layout and sidebar patterns
- Onclick event handlers
- querySelector and querySelectorAll usage
- HTML semantic structure

## Future Enhancements

Potential improvements to extend this hub:

- **Actual Project Integration**: Embed full HTML/CSS/JS for each project inline or via iframes
- **URL Routing**: Use hash-based routing (e.g., `#/todo`) so pages are bookmarkable
- **Active Link Styling**: Highlight the current navigation link visually
- **Local Storage**: Remember the last viewed page
- **Project Descriptions**: Add hover tooltips or descriptions for each navigation item
- **Search Functionality**: Add a search bar to filter projects
- **Dark/Light Theme Toggle**: Theme switcher for user preference
- **Keyboard Shortcuts**: Press keys to switch pages quickly
- **Project Icons**: Add icons next to project names
- **Collapsible Sections**: Group projects into categories
- **Settings Panel**: Add a settings page or modal
- **Analytics**: Track which projects are accessed most
- **Responsive Sidebar**: Collapse sidebar on mobile devices

## Customization

To customize this hub for your projects:

1. **Change Project Names**: Update navigation link text and page headings
2. **Add More Projects**: Add new navigation links and page `<div>` elements
3. **Update Content**: Replace placeholder text with actual project HTML/content
4. **Modify Colors**: Change `#2c3e50` background and text colors in the `<style>` section
5. **Adjust Sidebar Width**: Change the `width: 200px` property for navbar
6. **Add Styling**: Extend the `<style>` block with custom CSS for each page

### Example: Adding a New Page

```html
<!-- In navigation -->
<div onclick="showPage('blog')">Blog</div>

<!-- In main content -->
<div id="blog" class="page"><h1>Blog</h1><p>Blog content...</p></div>
```

## Performance

- **Instant Load**: Single HTML file loads instantly
- **Zero HTTP Requests**: No external resources; all CSS/JS embedded
- **Minimal JS**: Simple page switching logic with no overhead
- **No Build Step**: Ready to run immediately

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge) that support:
- ES6 JavaScript
- CSS Flexbox
- DOM APIs (querySelector, classList)

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
