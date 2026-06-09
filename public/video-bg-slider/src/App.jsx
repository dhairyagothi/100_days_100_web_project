/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────
 * Root component. Defines the `videoData` array and renders
 * <VideoSlider /> with it.
 *
 * VIDEO URLS
 * ──────────
 * The demo uses freely available sample MP4s from w3schools
 * (works offline with any internet connection).
 *
 * For production, replace `videoUrl` values with:
 *   • Local files:  "/videos/your-file.mp4"  (place in /public/videos/)
 *   • CDN URLs:     "https://cdn.example.com/your-file.mp4"
 *
 * POSTER (optional but recommended)
 * ──────────────────────────────────
 * A JPEG/PNG poster shows as an instant placeholder *before*
 * the video metadata loads. Without it, some mobile browsers
 * show a brief black flash. Unsplash URLs used here for demo.
 * ─────────────────────────────────────────────────────────────
 */
import VideoSlider from "./components/VideoSlider";

/* ── Slide data ────────────────────────────────────────────── */
const videoData = [
  {
    id: 1,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format",
    title: "Where the Wild Things Are",
    subtitle: "Discover trails that take you beyond the ordinary path.",
    btnText: "Explore Now",
  },
  {
    id: 2,
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    poster:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&auto=format",
    title: "Into the Blue Horizon",
    subtitle: "Sail toward sunsets you've only ever dreamed about.",
    btnText: "Set Sail",
  },
  {
    id: 3,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&auto=format",
    title: "High Above the World",
    subtitle: "Breathe the air that clears every clouded thought.",
    btnText: "Take Flight",
  },
];

/* ── App ────────────────────────────────────────────────────── */
export default function App() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      {/*
        ┌──────────────────────────────────────────────┐
        │  <VideoSlider />                             │
        │                                              │
        │  slides           required  – slide data[]  │
        │  autoplayInterval optional  – ms (0 = off)  │
        └──────────────────────────────────────────────┘
      */}
      <VideoSlider
        slides={videoData}
        autoplayInterval={8000}
      />
    </main>
  );
}