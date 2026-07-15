# Color Sort Puzzle

A glassmorphism confirmation modal for EaseMotion CSS with a soft glow that follows the cursor inside it. Opening, closing, focus handling, and the blurred backdrop are all handled by the native **HTML Popover API** — no JavaScript required for the modal mechanics themselves.

## 🧩 Project Overview

Most modal components reach for JavaScript to handle opening, closing, backdrop clicks, and Escape-to-dismiss. This one uses the native `popover` / `popovertarget` / `popovertargetaction` attributes instead, which the browser implements for free — including light-dismiss (click outside to close) and Escape-key handling.

The one place JavaScript genuinely is necessary is the **cursor-following glow**: CSS has no way to read live pointer coordinates into a custom property, so a small, scoped `mousemove` listener updates `--glow-x` / `--glow-y` while the pointer moves inside the modal. If that script doesn't run for any reason, the modal still opens, closes, and functions normally — the glow simply stays at its default centered position.

## ✨ Features

- Modern glassmorphism modal (`backdrop-filter: blur()`, translucent surface, soft border)
- Cursor-following radial glow, positioned via CSS custom properties
- Native fade-in on open using `@starting-style` + CSS transitions (no keyframe hacks)
- Blurred overlay behind the modal via the native `::backdrop` pseudo-element
- Rounded corners and a soft, layered drop shadow
- Accessible close button (circular icon button) plus Cancel/Confirm actions
- Fully responsive: centered card on desktop/tablet, near-full-width with stacked buttons on mobile
- `prefers-reduced-motion` support disables all transitions
- Reuses EaseMotion CSS's `--ease-standard` / `--ease-emphasized` motion tokens for consistency with other components in the library

## 📁 Folder Structure

submissions/examples/cursor-glow-modal-santoshi/
├── demo.html   # Trigger button, modal markup, and the minimal glow-tracking script
├── style.css   # Design tokens, glassmorphism styling, glow layer, animations, responsive rules
└── README.md   # This file

## 🛠 Technologies Used

- HTML5 **Popover API** (`popover`, `popovertarget`, `popovertargetaction`) for modal open/close behavior
- CSS3 (`backdrop-filter`, `::backdrop`, `@starting-style`, custom properties, media queries)
- A single small `<script>` block (~5 lines) solely to track cursor position for the glow effect
- Google Fonts: Poppins (headings), Inter (body text)

## 🚀 How to Run

1. Make sure `demo.html` and `style.css` are in the same folder.
2. Open `demo.html` in a recent version of Chrome, Edge, or Safari (browsers with Popover API and `@starting-style` support show the full fade-in and glow experience).
3. Click **"Open Confirmation Modal"**, then move your cursor inside the modal to see the glow follow it.
4. Close the modal via the **×** button, the **Cancel**/**Confirm** buttons, the Escape key, or by clicking outside it.

## 📸 Screenshots

<details>
<summary>🖼 Closed state (click to expand)</summary>

_Add a screenshot of the trigger button/page here._

</details>

<details>
<summary>🖼 Open modal with cursor glow (click to expand)</summary>

_Add a screenshot of the open modal, cursor glow visible, here._

</details>

## 🤝 Contributing

This component was built as an example page for the EaseMotion CSS repository, contributed as part of a GSSoC submission. Suggestions and improvements are welcome via Pull Request.
