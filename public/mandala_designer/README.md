# Mandala Designer 🎨

A high-precision, responsive symmetric vector geometry studio engineered on a pure frontend stack. This application enables creators to design intricate, perfectly balanced kaleidoscope artwork with flawless rendering metrics.

## 🚀 Key Technical Features

* **Multi-Axis Symmetry Matrix:** Implements a nested rotational loop computing programmatic coordinate translations from **2 up to 32 structural axes** simultaneously.
* **Secondary Kaleidoscope Reflections:** Features an integrated geometric mirroring algorithm using relative scaling transforms (`ctx.scale(1, -1)`) to automatically balance inverse canvas paths.
* **Razor-Sharp Edge Physics:** Optimizes pixel precision by bypassing standard canvas alpha-blending scaling flags (`ctx.imageSmoothingEnabled = false`) and eliminating fuzzy ambient lighting structures (`ctx.shadowBlur`) for hard, clean vector strokes.
* **High-DPI Display Scaler:** Built-in dynamic Device Pixel Ratio (DPR) back-buffer modifier that recalibrates canvas coordinates on the fly to prevent artifacting, blurriness, or clipping on Retina and 4K viewports.
* **Lossless History Stacks:** Manages state transitions via an isolated base64 data-URL ring buffer limited to a maximum depth of 25 frames, enabling multi-step state recovery through standard `Ctrl + Z` keyboard macro triggers.
* **Dual-Engine Color Controller:** Supports interactive runtime switching between dynamic real-time HSL spectrum cycling (Rainbow Fade) and customized solid hexadecimal selections.

---

## 📂 Project Structure

The studio operates entirely as a zero-dependency architecture under a unified workspace path directory:

```text
./public/mandala_designer/
├── index.html   # Symmetrically centered workspace dashboard & layout shell
├── style.css    # Premium glassmorphic panel theme and responsive media boundaries
├── script.js    # Rotational matrix calculator, interaction loops, and history state stack
└── README.md    # Comprehensive technical overview and deployment configurations