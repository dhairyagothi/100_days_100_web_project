# Links & Images

Links (`<a>`) and images (`<img>`) are essential for navigation and communication on the web.

This lesson covers the correct attributes you should use and how to avoid common mistakes.

---

## 1. Basic links (`<a>`)

Use `<a href="...">` to create a hyperlink.

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Visit Example
</a>
```

Notes:
- `target="_blank"` opens a new tab
- `rel="noopener noreferrer"` helps security when opening new tabs

---

## 2. Links to sections (anchors)

For in-page navigation, use hash URLs with matching `id`s.

```html
<a href="#contact">Jump to Contact</a>

<h2 id="contact">Contact</h2>
```

---

## 3. Images (`<img>`) and accessibility

Always include an `alt` attribute so screen readers can describe the image.

```html
<img
  src="team-photo.jpg"
  alt="A group photo of the team"
  width="320"
  height="200"
/>
```

If an image is purely decorative, you can use an empty alt: `alt=""`.

---

## 4. Practical example: hero with a call-to-action

```html
<section class="hero">
  <img src="product.png" alt="Screenshot of the product" width="420" height="260" />
  <a class="btn" href="#pricing">See pricing</a>
</section>

<section id="pricing">
  <h2>Pricing</h2>
  <p>Choose the plan that fits you.</p>
</section>
```

---

> [!WARNING]
> Missing `alt` makes your site harder to use with assistive technologies. Add `alt` for every meaningful image.

---

## 5. Coding Exercise: links + images

### Task:

Build a mini snippet that includes:
- a link to `#faq`
- an image with `src` and `alt`
- an `h2` with `id="faq"`

##### Solution

```html
<a href="#faq">Read the FAQ</a>

<img src="faq-illustration.png" alt="Illustration for FAQ section" width="260" height="180" />

<h2 id="faq">Frequently Asked Questions</h2>
```

