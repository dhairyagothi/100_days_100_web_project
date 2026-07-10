import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const FEATURES = [
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-6 h-6"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
        />
      </svg>
    ),
    title: "AI Upscaling",
    desc: "Scale images up to 4× their original size without introducing blur or artifacts.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-6 h-6"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        />
      </svg>
    ),
    title: "Auto Enhance",
    desc: "Histogram-driven brightness, contrast, and sharpness correction in one click.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-6 h-6"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
        />
      </svg>
    ),
    title: "Denoise",
    desc: "Remove grain and compression noise while preserving fine edge detail.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-6 h-6"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    ),
    title: "Free Export",
    desc: "Download as PNG or JPEG at full resolution — no watermarks, no account needed.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-6 h-6"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    ),
    title: "Private by Default",
    desc: "All processing happens in your browser. Your images never leave your device.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-6 h-6"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
        />
      </svg>
    ),
    title: "Instant Processing",
    desc: "Web Worker pipeline keeps the UI fluid — even on 20 MP images.",
  },
];

const STEPS = [
  {
    label: "Drop",
    title: "Drop your image",
    desc: "Drag and drop any JPEG, PNG, or WebP — up to 20 MB. Click to browse if you prefer.",
  },
  {
    label: "Tune",
    title: "Tune or auto-enhance",
    desc: "Hit Auto Enhance for instant histogram correction, or dial brightness, contrast, sharpness, and denoise manually.",
  },
  {
    label: "Export",
    title: "Download at full res",
    desc: "Export as PNG or JPEG. No sign-up, no watermark, no catch.",
  },
];

// Pixel grid hero canvas animation
function PixelCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const COLS = 40;
    const ROWS = 22;
    const cw = W / COLS;
    const ch = H / ROWS;

    // Each cell has a target brightness and current brightness
    const cells = Array.from({ length: ROWS * COLS }, () => ({
      val: Math.random(),
      target: Math.random(),
      speed: 0.01 + Math.random() * 0.03,
    }));

    // Periodically assign new targets to random clusters
    const scatter = () => {
      const cx = Math.floor(Math.random() * COLS);
      const cy = Math.floor(Math.random() * ROWS);
      const r = 3 + Math.floor(Math.random() * 6);
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          if (d < r) {
            cells[y * COLS + x].target = Math.random() > 0.5 ? 0.9 : 0.1;
            cells[y * COLS + x].speed = 0.02 + Math.random() * 0.04;
          }
        }
      }
    };

    const interval = setInterval(scatter, 600);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.val += (cell.target - cell.val) * cell.speed;
        const x = (i % COLS) * cw;
        const y = Math.floor(i / COLS) * ch;
        // violet to cyan gradient based on position + value
        const t = (i % COLS) / COLS;
        const r = Math.round(124 * (1 - t) * cell.val);
        const g = Math.round(cell.val * 20 + t * 182 * cell.val);
        const b = Math.round(237 * (1 - t) * cell.val + 212 * t * cell.val);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.15 + cell.val * 0.55})`;
        ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={440}
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
    />
  );
}

export default function Landing() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E2E8F0] font-sans overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="font-display font-700 text-lg tracking-tight text-white">
            Pixel<span className="text-violet-400">Pulse</span>
          </span>
        </div>
        <Link
          to="/editor"
          className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
        >
          Launch Editor
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <PixelCanvas />

        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-150 h-150 rounded-full bg-violet-700/10 blur-[120px]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1
            className="font-display text-5xl sm:text-7xl font-800 leading-[1.05] tracking-tight mb-6"
            style={{ fontWeight: 800 }}
          >
            Make every pixel
            <br />
            <span className="bg-linear-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              count.
            </span>
          </h1>

          <p className="text-[#94A3B8] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Upscale, denoise, and auto-enhance your images — all client-side,
            all instant, all free. No uploads to a server. No waiting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/editor"
              className="group px-8 py-4 rounded-xl bg-linear-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-violet-900/40 hover:shadow-violet-700/50 hover:scale-[1.02]"
            >
              Enhance an image
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 text-[#94A3B8] hover:text-white font-medium text-base transition-colors"
            >
              See how it works
            </button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 text-xs">
          <div className="w-px h-10 bg-linear-to-b from-transparent to-white/20" />
          scroll
        </div>
      </section>

      {/* BEFORE / AFTER DEMO STRIP */}
      <section className="py-6 border-y border-white/5 bg-[#0D0D16] overflow-hidden">
        <div className="flex items-center gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 shrink-0 text-sm font-mono"
            >
              <span className="text-[#4B5563]">before</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: `hsl(${(i * 50 + j * 20) % 360},40%,${20 + j * 8}%)`,
                    }}
                  />
                ))}
              </div>
              <span className="text-violet-400">→</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background: `hsl(${(i * 50 + j * 20) % 360},70%,${40 + j * 10}%)`,
                    }}
                  />
                ))}
              </div>
              <span className="text-cyan-400">after</span>
              <span className="text-white/10 ml-4">·</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">
            Capabilities
          </p>
          <h2
            className="font-display text-4xl sm:text-5xl font-bold text-white"
            style={{ fontWeight: 700 }}
          >
            One tool, every fix
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-default ${
                hovered === i
                  ? "border-violet-500/50 bg-violet-950/40"
                  : "border-white/5 bg-[#0D0D16] hover:border-white/10"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                  hovered === i
                    ? "bg-violet-600 text-white"
                    : "bg-white/5 text-violet-400"
                }`}
              >
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-white text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="py-24 px-6 bg-[#0D0D16] border-t border-white/5"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">
              Process
            </p>
            <h2
              className="font-display text-4xl sm:text-5xl font-bold text-white"
              style={{ fontWeight: 700 }}
            >
              Three steps. Done.
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-7 sm:left-1/2 top-12 bottom-12 w-px bg-linear-to-b from-violet-600 via-purple-500 to-cyan-500 opacity-30 hidden sm:block" />

            <div className="space-y-12">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-6 ${
                    i % 2 === 1 ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Number node */}
                  <div className="relative z-10 shrink-0 sm:mx-auto">
                    <div className="w-14 h-14 rounded-full border border-violet-500/40 bg-[#0A0A0F] flex items-center justify-center">
                      <span className="font-display font-bold text-violet-400 text-lg">
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 p-6 rounded-2xl border border-white/5 bg-[#0A0A0F] ${
                      i % 2 === 1 ? "sm:text-right" : ""
                    }`}
                  >
                    <span className="text-xs font-mono text-cyan-500 tracking-widest uppercase">
                      {step.label}
                    </span>
                    <h3 className="font-display font-semibold text-white text-xl mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#64748B] text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-125 h-75 rounded-full bg-violet-700/10 blur-[100px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2
            className="font-display text-4xl sm:text-5xl font-bold text-white mb-6"
            style={{ fontWeight: 700 }}
          >
            Your next great image
            <br />
            starts here.
          </h2>
          <p className="text-[#64748B] text-lg mb-10">
            No account. No watermark. No compromise.
          </p>
          <Link
            to="/editor"
            className="group px-10 py-5 rounded-xl bg-linear-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-lg transition-all duration-300 shadow-2xl shadow-violet-900/40 hover:scale-[1.02]"
          >
            Open the editor
            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#334155] text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-linear-to-br from-violet-500 to-cyan-400" />
          <span className="font-display font-semibold text-[#475569]">
            PixelPulse
          </span>
        </div>
        <p>All processing is client-side. No data leaves your device.</p>
      </footer>
    </div>
  );
}
