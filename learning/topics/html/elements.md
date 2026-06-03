# HTML Elements & Attributes

HTML pages are built from **elements**. Elements usually contain content and can be configured with **attributes**.

In this lesson, you will learn what elements and attributes are, common attribute patterns, and how they affect what the browser renders.

---

## 1. What is an HTML element?

An HTML element is a building block in the document. Most elements have:
- an opening tag (for example, `<a>`)
- content (optional)
- a closing tag (for example, `</a>`)

Some elements are self-contained (like `<img ... />`) and do not need a closing tag.

### Example: structure of common elements

```html
<h2>Section title</h2>
<p>Some text on the page.</p>
```

---

## 2. What is an attribute?

**Attributes** provide extra information about an element. They are written inside the opening tag as `name="value"`.

Common attribute examples:
- `id` and `class` (for styling and linking)
- `href` (for links)
- `src` (for images)
- `alt` (image alternative text)
- `type` (for input types)

---

## 3. Global attributes (you will use a lot)

Global attributes can appear on many different elements. Two of the most important are:
- `id`: should be unique per page
- `class`: can be reused across many elements

Example:

```html
<p id="intro" class="lead">
  Welcome to my page.
</p>
```

---

## 4. Practical example: ids, classes, and a link

```html
<nav class="top-nav">
  <a class="nav-link" href="#features">Features</a>
  <a class="nav-link" href="#pricing">Pricing</a>
</nav>

<section id="features">
  <h2>Features</h2>
  <p>Here is what the product can do.</p>
</section>
```

---

> [!NOTE]
> Tip: Use `id` for one-off targets (anchors, single elements) and `class` for reusable styling or repeated patterns.

---

## 5. Coding Exercise: Elements + attributes

### Task:

Create a small snippet that contains:
- An image using `src` and `alt`
- A paragraph with a `class`
- A link using `href` that goes to another section on the same page

##### Solution

```html
<img src="avatar.png" alt="Profile avatar" width="80" height="80" />

<p class="bio">
  Hi, I am building things on the web.
</p>

<a href="#about">Read more about me</a>

<h2 id="about">About</h2>
```

