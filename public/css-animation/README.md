# LayerText — CSS Text Animation Generator

A zero-dependency, single-page web app that lets you configure a layered CSS text animation effect and export clean HTML + CSS code to drop into any project.

---

## Project structure

```bash
css-text-generator/
├── index.html   # Application markup & layout
├── style.css    # Generator UI styles + dark theme
├── script.js    # All interactivity and code generation
└── README.md    # You are here
```

---

## Getting started

No build step, no npm, no frameworks. Just open the file:

```bash
# Option 1 — open directly in your browser
open index.html

# Option 2 — serve locally (recommended to avoid some browser restrictions)
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080` (or whichever port the server picks).

---

## How to use

### Controls panel (left)

| Control           | What it does                                         | Default              |
|-------------------|------------------------------------------------------|----------------------|
| **Phrase**        | The text displayed in every layer                    | `CSS Text Animation` |
| **Background**    | Preview & exported body background color             | `#101010`            |
| **Text / stroke** | Color of the text stroke and the animation highlight | `#ffff00`            |
| **Count**         | How many stacked `<p>` layers to generate            | `9` (range 3–15)     |
| **Duration**      | Full cycle length of the CSS animation               | `2.0s`               |
| **Layer delay**   | Per-layer `animation-delay` stagger offset           | `−0.25s`             |
| **Font size**     | Base `font-size` of each layer                       | `2.0rem`             |

All controls update the live preview and exported code **instantly** — no submit button needed.

### Live preview (right, top)

Shows the real animation running in-page using the exact same keyframes and `calc()` delay logic that will be exported. What you see is what you get.

### Export code (right, bottom)

Two textareas — **HTML** and **CSS** — display the generated code. Both update in real time as you adjust controls. Hit **Copy** on either block to send it to your clipboard.

---

## The animation technique

The effect works by stacking multiple `<p>` elements with a CSS custom property (`--i`) that offsets each layer's `animation-delay` using `calc()`:

```html
<div class="box">
  <p style="--i: 1">YOUR TEXT</p>
  <p style="--i: 2">YOUR TEXT</p>
  <!-- … -->
</div>
```

```css
.box p {
  -webkit-text-stroke: 1px #ffff00;
  color: transparent;
  animation: layerAnimate 2s linear infinite;
  animation-delay: calc(-0.25s * var(--i));
}

@keyframes layerAnimate {
  0%, 10% {
    color: #ffff00;
    filter: hue-rotate(0deg);
  }
  10.1% {
    color: transparent;
  }
  100% {
    color: transparent;
    filter: hue-rotate(720deg);
  }
}
```

Each layer is identical markup, but the negative delay means every `<p>` starts at a different point in the animation cycle. The `hue-rotate` filter then shifts the color of whichever layer is currently "lit", producing the rolling color-wave effect.

---

## Customising the exported code

The exported HTML and CSS are intentionally self-contained and minimal. Common things you might want to tweak after exporting:

- **Font family** — replace `Arial, Helvetica, sans-serif` with any web font.
- **Letter spacing / line height** — adjust `letter-spacing` and `line-height` on `.box p`.
- **Animation easing** — change `linear` to `ease-in-out` for a softer pulse.
- **Hue sweep range** — `hue-rotate(720deg)` is two full cycles; reduce to `360deg` for one.
- **Active window size** — the `10%` / `10.1%` keyframe stops control how long each layer stays "on". Increasing `10%` to `20%` makes the highlight wider.

---

## Browser support

| Feature                         | Support                               |
|---------------------------------|---------------------------------------|
| CSS custom properties (`var()`) | All modern browsers                   |
| `calc()` in `animation-delay`   | Chrome 79+, Firefox 77+, Safari 14+   |
| `-webkit-text-stroke`           | All modern browsers (vendor-prefixed) |
| `filter: hue-rotate()`          | All modern browsers                   |

For the generator UI itself, a modern browser released after 2021 is recommended.

---

## Accessibility notes

- The generator respects `prefers-reduced-motion`: when the user has reduced motion enabled, the preview animation is disabled.
- All controls have proper `<label>` associations and ARIA attributes.
- Copy buttons provide visual feedback and work with keyboard navigation.

---

## License

Do whatever you like with the generated code and the generator itself
