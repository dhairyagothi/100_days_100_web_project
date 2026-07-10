import React, {
  useEffect,
  useRef,
} from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(h, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

function FaultyTerminal({
  tint = "#0066ff",
  className,
  style,
  ...rest
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.pointerEvents = "none";
    
    const d = window.devicePixelRatio || 1;
    canvas.width = (container.offsetWidth || 400) * d;
    canvas.height = (container.offsetHeight || 300) * d;
    const ctx = canvas.getContext("2d");

    const TECH_TERMS = [
      "React",
      "JavaScript",
      "TypeScript",
      "CSS",
      "HTML",
      "Node.js",
      "REST API",
      "WebGL",
      "Canvas",
      "SVG",
      "Git",
      "npm",
      "ES6+",
      "DOM",
      "JSON",
      "Tailwind",
      "PWA",
      "UI/UX",
      "open source",
      "frontend",
    ];

    let tr = 0,
      tg = 102,
      tb = 255;
    const rgb = hexToRgb(tint);
    if (rgb) {
      tr = Math.round(rgb[0] * 255);
      tg = Math.round(rgb[1] * 255);
      tb = Math.round(rgb[2] * 255);
    }

    const particles = TECH_TERMS.map((term) => ({
      term,
      x: 0.05 + Math.random() * 0.9,
      y: 0.1 + Math.random() * 0.8,
      opacity: 0.15 + Math.random() * 0.45,
      fontSize: (10 + Math.random() * 6) * d,
    }));

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Gradient background matching the dark space theme
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(4,8,18,0.2)");
      grad.addColorStop(1, "rgba(2,6,23,0.7)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Subtle Grid lines
      ctx.strokeStyle = `rgba(${tr},${tg},${tb},0.035)`;
      ctx.lineWidth = 1;
      const gs = Math.floor(h / 12);
      for (let gy = 0; gy < h; gy += gs) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }
      const gsx = Math.floor(w / 16);
      for (let gx = 0; gx < w; gx += gsx) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }

      // Tech terms
      ctx.textBaseline = "middle";
      for (const p of particles) {
        ctx.font = `500 ${p.fontSize}px 'JetBrains Mono', 'Courier New', monospace`;
        ctx.fillStyle = `rgba(${tr},${tg},${tb},${p.opacity.toFixed(3)})`;
        ctx.fillText(p.term, p.x * w, p.y * h);
      }

      // Scanlines
      ctx.fillStyle = "rgba(255,255,255,0.012)";
      const sl = Math.max(3, Math.floor(h / 200)) * d;
      for (let sy = 0; sy < h; sy += sl * 2) {
        ctx.fillRect(0, sy, w, 1);
      }

      // Subtle glow
      const glow = ctx.createRadialGradient(
        w * 0.5,
        h * 0.45,
        0,
        w * 0.5,
        h * 0.45,
        w * 0.45,
      );
      glow.addColorStop(0, `rgba(${tr},${tg},${tb},0.06)`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }

    container.appendChild(canvas);
    draw();

    const resize = () => {
      const rd = window.devicePixelRatio || 1;
      canvas.width = (container.offsetWidth || 400) * rd;
      canvas.height = (container.offsetHeight || 300) * rd;
      draw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, [tint]);

  return React.createElement("div", {
    ref: containerRef,
    className: `faulty-terminal-container ${className || ""}`.trim(),
    style,
    ...rest,
  });
}

const host = document.getElementById("heroTerminal");

if (host) {
  const root = createRoot(host);

  const getScreenSettings = () => {
    return {
      tint: "#0066ff",
      style: { width: "100%", height: "100%" },
    };
  };

  const renderTerminal = () => {
    const terminalSettings = getScreenSettings();
    root.render(
      React.createElement(FaultyTerminal, {
        ...terminalSettings,
      }),
    );
  };

  renderTerminal();

  const handleResize = () => {
    renderTerminal();
  };

  window.addEventListener("resize", handleResize);
}
