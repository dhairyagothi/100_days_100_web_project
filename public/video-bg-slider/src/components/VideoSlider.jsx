/**
 * VideoSlider.jsx
 * ─────────────────────────────────────────────────────────────
 * Full-screen video background slider.
 *
 * FEATURES
 * ────────
 *  ✓ All videos mounted simultaneously → instant cross-fade
 *    via opacity layering (no buffering delay on switch)
 *  ✓ Per-video loading spinner via onLoadedMetadata
 *  ✓ Framer Motion overlay: staggered title → subtitle → CTA
 *  ✓ Left/Right nav arrows (Lucide icons)
 *  ✓ Bottom dot indicators (active = pill, inactive = circle)
 *  ✓ Global Play/Pause toggle button
 *  ✓ Auto-advance with configurable interval
 *  ✓ Keyboard: ← → for nav, Space for play/pause
 *  ✓ Accessible: aria-labels, role="tablist", focus-visible rings
 *  ✓ Mobile-safe: muted + playsInline + loop on every <video>
 *
 * PROPS
 * ─────
 *  slides           {Array}  – videoData items (see App.jsx)
 *  autoplayInterval {number} – ms between auto-advances (0 = off)
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Loader2 } from "lucide-react";

/* ════════════════════════════════════════════════════════════
   FRAMER MOTION VARIANTS
   ════════════════════════════════════════════════════════════ */

/**
 * Each text child slides up and fades in on enter,
 * slides up and fades out on exit.
 */
const textVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -28,
    transition: { duration: 0.35, ease: "easeIn" },
  },
};

/**
 * Container staggers children:
 * eyebrow → title → subtitle → CTA button
 */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
  exit: {
    transition: { staggerChildren: 0.06 },
  },
};

/* ════════════════════════════════════════════════════════════
   VIDEO LAYER — inner component
   Renders one <video> plus its loading overlay.
   All layers stay mounted; only the active one has opacity:1.
   ════════════════════════════════════════════════════════════ */

function VideoLayer({ slide, isActive, isPlaying }) {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  /* ── Play / Pause ─────────────────────────────────────── */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isActive && isPlaying) {
      // play() returns a Promise — catch autoplay policy rejections silently
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isActive, isPlaying]);

  /* ── Reset to start when slide becomes active ─────────── */
  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [isActive]);

  /* ── Metadata loaded → hide spinner ──────────────────── */
  const handleMetadata = () => setLoaded(true);

  return (
    /*
     * All layers are always in the DOM.
     * CSS opacity + transition-opacity handles the cross-fade.
     * z-index ensures the active layer sits on top.
     */
    <div
      className="absolute inset-0 transition-opacity duration-700"
      style={{
        opacity: isActive ? 1 : 0,
        zIndex: isActive ? 1 : 0,
      }}
      aria-hidden={!isActive}
    >
      {/* ── Loading spinner ──────────────────────────────── */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-950">
          <Loader2
            size={52}
            className="animate-spin text-amber-400 opacity-80"
            aria-label="Loading video"
          />
        </div>
      )}

      {/* ── Video element ────────────────────────────────── */}
      <video
        ref={videoRef}
        src={slide.videoUrl}
        poster={slide.poster || ""}   // instant poster prevents black flash
        muted                          // required for autoplay in all browsers
        loop                           // loops the video track
        playsInline                    // critical on iOS — prevents fullscreen takeover
        preload="metadata"             // only fetch first frame + duration, not full file
        onLoadedMetadata={handleMetadata}
        className="h-full w-full object-cover"
        aria-label={`Background video: ${slide.title}`}
      />

      {/* ── Dark gradient scrim ─────────────────────────── */}
      {/* Ensures text stays readable over any video content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   VIDEO SLIDER — main export
   ════════════════════════════════════════════════════════════ */

export default function VideoSlider({ slides = [], autoplayInterval = 8000 }) {
  /* ── State ─────────────────────────────────────────────── */
  const [current, setCurrent]     = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  /* Holds the setInterval handle so we can cancel it cleanly */
  const autoTimer = useRef(null);

  /* ── Navigation helpers ────────────────────────────────── */
  const goTo = useCallback(
    (index) => setCurrent((index + slides.length) % slides.length),
    [slides.length]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = ()             => goTo(current - 1);

  /**
   * manualGoTo: called by arrows / dots.
   * Resets the auto-advance timer so the video isn't skipped
   * immediately after a user interaction.
   */
  const manualGoTo = (index) => {
    clearInterval(autoTimer.current);
    goTo(index);
  };

  /* ── Auto-advance ──────────────────────────────────────── */
  useEffect(() => {
    if (!isPlaying || autoplayInterval <= 0) return;

    autoTimer.current = setInterval(next, autoplayInterval);
    return () => clearInterval(autoTimer.current);
  }, [isPlaying, autoplayInterval, next]);

  /* ── Keyboard navigation ───────────────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  manualGoTo(current - 1);
      if (e.key === "ArrowRight") manualGoTo(current + 1);
      if (e.key === " ")          setIsPlaying((p) => !p);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Guard: nothing to render ──────────────────────────── */
  if (!slides.length) return null;

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-neutral-950"
      style={{ fontFamily: "'Sora', sans-serif" }}
      aria-label="Video background slider"
      aria-roledescription="carousel"
    >

      {/* ── 1. VIDEO LAYERS ──────────────────────────────────
          All layers mounted. Active layer at opacity:1,
          inactive layers at opacity:0.
          CSS transition-opacity gives the cross-fade.
      ────────────────────────────────────────────────────── */}
      {slides.map((slide, i) => (
        <VideoLayer
          key={slide.id}
          slide={slide}
          isActive={i === current}
          isPlaying={isPlaying}
        />
      ))}

      {/* ── 2. OVERLAY CONTENT ───────────────────────────────
          Sits above all video layers (z-10).
          AnimatePresence + key={current} re-mounts on slide
          change → triggers enter animation each time.
          mode="wait" ensures exit finishes before enter starts.
      ────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Slide counter eyebrow */}
            <motion.p
              variants={textVariants}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber-400"
            >
              {`0${current + 1} — 0${slides.length}`}
            </motion.p>

            {/* Main heading */}
            <motion.h1
              variants={textVariants}
              className="mb-5 text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.6)" }}
            >
              {slides[current].title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={textVariants}
              className="mb-10 max-w-2xl mx-auto text-base font-light leading-relaxed text-white/75 md:text-xl"
            >
              {slides[current].subtitle}
            </motion.p>

            {/* CTA button */}
            <motion.div variants={textVariants}>
              <button
                className="
                  rounded-full border border-amber-400
                  px-9 py-3.5
                  text-sm font-semibold uppercase tracking-widest text-amber-400
                  transition-all duration-300
                  hover:bg-amber-400 hover:text-neutral-950
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400
                "
                aria-label={slides[current].btnText}
              >
                {slides[current].btnText}
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 3. LEFT ARROW ────────────────────────────────────── */}
      <button
        onClick={() => manualGoTo(current - 1)}
        aria-label="Previous slide"
        className="
          btn-ghost-circle
          absolute left-4 top-1/2 z-20 -translate-y-1/2
          md:left-8
        "
      >
        <ChevronLeft size={24} aria-hidden="true" />
      </button>

      {/* ── 4. RIGHT ARROW ───────────────────────────────────── */}
      <button
        onClick={() => manualGoTo(current + 1)}
        aria-label="Next slide"
        className="
          btn-ghost-circle
          absolute right-4 top-1/2 z-20 -translate-y-1/2
          md:right-8
        "
      >
        <ChevronRight size={24} aria-hidden="true" />
      </button>

      {/* ── 5. BOTTOM CONTROLS ───────────────────────────────── */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-5">

        {/* Dot indicators */}
        <div role="tablist" aria-label="Slide indicators" className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}: ${slide.title}`}
              onClick={() => manualGoTo(i)}
              className={i === current ? "dot-active" : "dot-inactive"}
            />
          ))}
        </div>

        {/* Play / Pause toggle */}
        <button
          onClick={() => setIsPlaying((p) => !p)}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          aria-pressed={isPlaying}
          className="btn-ghost-circle !p-2"
        >
          {isPlaying
            ? <Pause  size={16} aria-hidden="true" />
            : <Play   size={16} aria-hidden="true" />
          }
        </button>
      </div>

    </section>
  );
}