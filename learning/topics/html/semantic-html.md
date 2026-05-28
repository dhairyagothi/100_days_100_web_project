# Semantic HTML

Semantic HTML uses descriptive tags to convey meaning. It makes your pages easier to navigate for users, improves accessibility, and helps search engines understand content.

---

## 1. Why semantics matter

When you use the right structure, assistive technologies can:
- jump between landmarks (like `main` or `nav`)
- understand page sections
- read content in meaningful order

---

## 2. Common semantic elements

These are frequently used:
- `header` for top-of-page or section headers
- `nav` for navigation links
- `main` for the unique content of the page
- `section` for a thematic grouping
- `article` for independent content (like a blog post)
- `aside` for related but secondary content
- `footer` for page or section footer

---

## 3. Practical example: layout a blog post

```html
<header>
  <h1>My Tech Notes</h1>
</header>

<nav>
  <a href="#posts">Posts</a>
  <a href="#about">About</a>
</nav>

<main>
  <article>
    <h2 id="posts">Latest Post</h2>
    <p>Here is the content of the post...</p>
  </article>

  <aside>
    <h3>Related</h3>
    <p>More reading links...</p>
  </aside>
</main>

<footer>
  <p>&copy; 2026</p>
</footer>
```

---

> [!IMPORTANT]
> Use semantic tags based on meaning. Do not pick a tag purely for styling convenience.

---

## 4. Coding Exercise: semantic structure

### Task:

Create a snippet with:
- `header` containing an `h1`
- `main` containing one `section`
- `section` containing an `h2` and a paragraph
- `footer` containing a short copyright line

##### Solution

```html
<header>
  <h1>Task Tracker</h1>
</header>

<main>
  <section>
    <h2>Today</h2>
    <p>You have 3 tasks left to complete.</p>
  </section>
</main>

<footer>
  <p>2026 Task Tracker</p>
</footer>
```

