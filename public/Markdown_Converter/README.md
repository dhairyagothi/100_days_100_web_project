# Real-Time Markdown to HTML Converter & Previewer

A fast, fully client-side tool to write Markdown and see the rendered HTML in real-time. Features syntax highlighting, XSS sanitization, and the ability to download your work as `.md` or `.html` files.

## Features
- **Real-Time Preview**: Split-screen design for distraction-free writing.
- **Syntax Highlighting**: Supports code blocks via Highlight.js.
- **Secure**: Uses DOMPurify to prevent XSS execution in the live preview.
- **Export Options**: Quickly download the raw `.md` or the fully styled `.html`.
- **Beautiful UI**: Modern, sleek dark theme with a GitHub-inspired markdown stylesheet.

## Technologies Used
- HTML5, CSS3, JavaScript (Vanilla)
- [Marked.js](https://marked.js.org/) for Markdown parsing
- [DOMPurify](https://github.com/cure53/DOMPurify) for security
- [Highlight.js](https://highlightjs.org/) for code blocks
- [Phosphor Icons](https://phosphoricons.com/) for UI icons

## Usage
Simply start typing in the left pane. The right pane will instantly update to show the output. Use the buttons in the header to download your files!
