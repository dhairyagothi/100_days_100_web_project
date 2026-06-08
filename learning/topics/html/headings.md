# Headings & Paragraphs

Headings and paragraphs define the **readable structure** of your content. Correct semantic HTML improves accessibility, SEO, and clarity.

---

## 1. Headings (`h1` to `h6`)

Headings are ranked from most important to least important:
- `h1` is usually the page’s main title
- `h2` is a major section
- `h3` is a subsection

You should not use headings to “make text look big”. Instead, use them to describe the **meaning** of that text.

---

## 2. Paragraphs (`p`)

Paragraphs group related sentences. Use `<p>` for normal text blocks.

```html
<h2>Why semantics matter</h2>
<p>
  Semantic HTML tells the browser and assistive technologies what each piece of content represents.
</p>
```

---

## 3. Line breaks vs paragraphs

If you just need a forced line break inside text, you can use `<br>`. But for new blocks of text, prefer `<p>` so spacing and meaning stay consistent.

---

## 4. Practical example: simple article structure

```html
<article>
  <h1>Learning HTML</h1>
  <h2>Getting started</h2>
  <p>
    HTML uses tags to describe structure. Start small and build up.
  </p>
  <h3>Next steps</h3>
  <p>Practice with short snippets every day.</p>
</article>
```

---

> [!TIP]
> Keep headings short and descriptive. If a heading does not tell you what the section is about, rewrite it.

---

## 5. Coding Exercise: build a heading hierarchy

### Task:

Create an HTML snippet with:
- one `h1` for the page title
- one `h2` section heading
- one `p` paragraph that includes a `<strong>` word

##### Solution

```html
<h1>Welcome to Antigravity</h1>
<h2>What you will learn</h2>
<p>
  Today we focus on <strong>headings</strong> and paragraphs.
</p>
```

