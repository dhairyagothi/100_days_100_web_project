import { useEffect, useRef } from "react";
import { FILTER_PRESETS } from "../../hooks/useEditorCanvas";

function FilterThumb({ preset, active, onClick, sourceCanvas }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !sourceCanvas) return;
    const SIZE = 80;
    c.width = SIZE;
    c.height = SIZE;
    const ctx = c.getContext("2d");
    // Draw square crop from center
    const s = sourceCanvas;
    const minDim = Math.min(s.width, s.height);
    const sx = (s.width - minDim) / 2;
    const sy = (s.height - minDim) / 2;
    ctx.filter = preset.filter;
    ctx.drawImage(s, sx, sy, minDim, minDim, 0, 0, SIZE, SIZE);
    ctx.filter = "none";
    if (preset.overlay) {
      ctx.fillStyle = preset.overlay.color;
      ctx.fillRect(0, 0, SIZE, SIZE);
    }
  }, [sourceCanvas, preset]);

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 group transition-all`}
    >
      <div
        className={`relative rounded-lg overflow-hidden transition-all ${
          active
            ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#0D0D16]"
            : "hover:ring-1 hover:ring-white/20"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-16 h-16 sm:w-18 sm:h-18 object-cover block"
        />
        {!sourceCanvas && (
          <div className="absolute inset-0 bg-[#1E2740] animate-pulse" />
        )}
      </div>
      <span
        className={`text-[10px] font-medium transition-colors ${active ? "text-violet-400" : "text-[#475569] group-hover:text-white"}`}
      >
        {preset.name}
      </span>
    </button>
  );
}

export default function FiltersPanel({ activeFilter, onSelect, sourceCanvas }) {
  return (
    <div className="p-4 overflow-y-auto h-full">
      <p className="text-[10px] font-mono tracking-widest text-[#334155] uppercase mb-4">
        Filters
      </p>
      <div className="grid grid-cols-3 gap-3">
        {FILTER_PRESETS.map((p, i) => (
          <FilterThumb
            key={p.name}
            preset={p}
            index={i}
            active={activeFilter === i}
            onClick={() => onSelect(i)}
            sourceCanvas={sourceCanvas}
          />
        ))}
      </div>
    </div>
  );
}
