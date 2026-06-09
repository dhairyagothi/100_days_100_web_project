# 🎬 Video Background Slider

A full-screen, responsive video background slider built with:

- **React 18** (functional components + hooks)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (animated text overlays)
- **Lucide React** (UI icons)
- **Vite** (lightning-fast dev server + build)

---

## Project Structure

```bash
video-slider-app/
│
├── index.html                  ← Vite HTML entry point
├── vite.config.js              ← Vite config (React plugin, dev server)
├── tailwind.config.js          ← Tailwind content paths + theme
├── postcss.config.js           ← PostCSS plugins for Tailwind
├── package.json                ← All dependencies
│
├── public/
│   └── videos/                 ← Drop your .mp4 / .webm files here
│       ├── slide-1.mp4
│       ├── slide-2.mp4
│       └── slide-3.mp4
│
└── src/
    ├── main.jsx                ← ReactDOM.createRoot entry
    ├── App.jsx                 ← videoData array + root component
    ├── index.css               ← Tailwind directives + global styles
    └── components/
        └── VideoSlider.jsx     ← Main slider + inner VideoLayer
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Vite opens `http://localhost:3000` automatically.

### 3. Build for production

```bash
npm run build
npm run preview   # preview the built output locally
```

---

## Adding Your Own Videos

1. Drop your `.mp4` (and optionally `.webm`) files into `public/videos/`.
2. Open `src/App.jsx` and update the `videoData` array:

```js
const videoData = [
  {
    id: 1,
    videoUrl: "/videos/your-file.mp4",   // path relative to /public
    poster:   "/videos/your-poster.jpg", // optional — prevents black flash
    title:    "Your Slide Title",
    subtitle: "Your slide subtitle text here.",
    btnText:  "Click Me",
  },
  // ... more slides
];
```

### Video format tips

| Format         | Browser support       | Notes              |
|--------        |----------------       |-------             |
| `.mp4` (H.264) | All browsers          | Default choice     |
| `.webm` (VP9)  | Chrome, Firefox, Edge | Better compression |

For maximum compatibility, provide both and use `<source>` tags. See the source comment in `VideoLayer` for the snippet.

---

## Keyboard Shortcuts

| Key     | Action              |
|-----    |--------             |
| `←`     | Previous slide      |
| `→`     | Next slide          |
| `Space` | Toggle play / pause |

---

## Props Reference — `<VideoSlider />`

| Prop               | Type     | Default | Description                                   |
|--------------------|----------|---------|-----------------------------------------------|
| `slides`           | `Array`  | `[]`    | Array of slide data objects (required)        |
| `autoplayInterval` | `number` | `8000`  | Ms between auto-advances. Set `0` to disable. |

### Slide object shape

```ts
{
  id:        number   // unique key
  videoUrl:  string   // URL or /public path to video file
  poster?:   string   // optional poster image URL
  title:     string   // large heading text
  subtitle:  string   // smaller description text
  btnText:   string   // CTA button label
}
```

---

## Dependencies

```bash
react              ^18.3.1
react-dom          ^18.3.1
framer-motion      ^11.0.0
lucide-react       ^0.383.0

[devDependencies]
vite               ^5.2.12
@vitejs/plugin-react
tailwindcss        ^3.4.4
postcss + autoprefixer
