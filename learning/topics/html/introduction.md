# Introduction to HTML

Welcome to the foundation of web development! **HTML** (HyperText Markup Language) is the standard markup language used to create the structure of all websites on the World Wide Web. It tells web browsers how to display text, images, and other media using elements called "tags."

In this comprehensive guide, you will learn the core concepts of HTML, how web pages are structured under the hood, and how to build your very first web page from scratch!

---

## 1. How HTML Works

HTML is not a programming language; it is a **markup language**. This means it uses predefined codes (markup) called **tags** to define how content is formatted and organized. 

When you load a website, your browser fetches the HTML file from a server. The browser then acts as a translator, reading the HTML code, rendering the document, and displaying it on your screen.

### The Anatomy of an HTML Element

An HTML element is usually made up of three parts:
1. **An Opening Tag**: `<tagname>` — Marks where the element begins.
2. **The Content**: The text or media you want to display.
3. **A Closing Tag**: `</tagname>` — Marks where the element ends (notice the forward slash).

Here is a visual representation of how a standard HTML element is structured:

<div class="vector-flowchart">
  <svg viewBox="0 0 580 120" width="100%">
    <!-- Opening Tag -->
    <rect x="20" y="20" width="140" height="50" rx="6" class="svg-node" />
    <text x="90" y="50" text-anchor="middle" class="svg-text svg-text-heading">&lt;p&gt;</text>
    <text x="90" y="65" text-anchor="middle" class="svg-text" style="fill: var(--accent);">Opening Tag</text>

    <path d="M 160 45 L 200 45" class="svg-line" />
    <polygon points="200,45 194,41 194,49" class="svg-marker" />

    <!-- Content -->
    <rect x="200" y="20" width="180" height="50" rx="6" class="svg-node" />
    <text x="290" y="50" text-anchor="middle" class="svg-text svg-text-heading">Hello World!</text>
    <text x="290" y="65" text-anchor="middle" class="svg-text" style="fill: #10b981;">Element Content</text>

    <path d="M 380 45 L 420 45" class="svg-line" />
    <polygon points="420,45 414,41 414,49" class="svg-marker" />

    <!-- Closing Tag -->
    <rect x="420" y="20" width="140" height="50" rx="6" class="svg-node" />
    <text x="490" y="50" text-anchor="middle" class="svg-text svg-text-heading">&lt;/p&gt;</text>
    <text x="490" y="65" text-anchor="middle" class="svg-text" style="fill: #ef4444;">Closing Tag</text>
  </svg>
</div>

---

## 2. Basic Skeleton of an HTML Document

Every single HTML document must follow a standard structural layout. This skeleton is loaded first by the web browser to initialize the page properties.

Here is the boilerplate structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to Web Development!</h1>
    <p>This is my very first paragraph structured in HTML.</p>
</body>
</html>
```

### Breakdown of the Skeleton:

| Tag | Purpose |
| :--- | :--- |
| `<!DOCTYPE html>` | Declares to the browser that this is a modern **HTML5** document. |
| `<html lang="en">` | The root element containing the entire page. The `lang` attribute specifies the language (English). |
| `<head>` | Contains "behind-the-scenes" metadata. This info is not visible on the web page itself. |
| `<meta charset="UTF-8">` | Specifies the character encoding to support all symbols and characters. |
| `<meta name="viewport" ...>` | Essential for mobile responsiveness. It scales the page to fit mobile device screens correctly. |
| `<title>` | Specifies the text displayed on the browser tab or in search engine listings. |
| `<body>` | Contains all visible content: text, links, images, forms, and headings. |

---

## 3. Practical Example: A Simple Document

Let's look at how elements are nested inside one another. Nesting means placing elements inside other elements (like placing body tags inside html tags).

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Learning HTML</title>
</head>
<body>
    <div>
        <h2>Understanding Nesting</h2>
        <p>This paragraph is nested inside a <strong>div</strong> container!</p>
    </div>
</body>
</html>
```

<div class="example-output-container">
  <div class="example-output-header">
    <i class="fas fa-desktop"></i> Browser Rendering Output
  </div>
  <div class="example-output-preview">
    <div style="background: var(--bg-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
      <h2 style="margin-top:0; color: var(--text-primary);">Understanding Nesting</h2>
      <p style="margin-bottom:0; color: var(--text-secondary);">This paragraph is nested inside a <strong>div</strong> container!</p>
    </div>
  </div>
</div>

---

## 4. Best Practices & Common Pitfalls

To write high-quality, professional code, you should build excellent coding habits early on.

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Always close your tags to prevent layout breakages.</li>
      <li>Use lowercase tag names (`<p>` instead of `<P>`).</li>
      <li>Indent nested child elements for readability.</li>
      <li>Use semantic elements (like `<article>`, `<header>`) whenever possible to aid SEO and screen-readers.</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Forgetting the forward slash (`/`) in closing tags.</li>
      <li>Incorrect nesting: closing an outer tag before closing an inner tag (`<p><strong>text</p></strong>`).</li>
      <li>Omitting the `alt` attribute on `<img>` tags (essential for accessibility).</li>
    </ul>
  </div>
</div>

> [!TIP]
> **Pro Tip**: Use a code linter or code editor format-on-save (like Prettier) inside your text editor to automatically organize and indent your HTML markup files!

---

## 5. Coding Exercise: Test Your Knowledge

Let's practice what you've learned! 

### Task:
Create a complete boilerplate HTML template. Inside the `<body>` element, write an `<h1>` heading with the text "Hello Antigravity!" and a paragraph `<p>` that contains a nested `<em>` (emphasis/italics) tag wrapping the word "web development".

##### Solution

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Practice Exercises</title>
</head>
<body>
    <h1>Hello Antigravity!</h1>
    <p>I am learning <em>web development</em> today!</p>
</body>
</html>
```

**Explanation**: 
- The `<em>` tag wraps around "web development", applying italics styles natively.
- The `<h1>` provides a primary heading block structure.
- The structure contains a valid head, body, and doctype declaration.
