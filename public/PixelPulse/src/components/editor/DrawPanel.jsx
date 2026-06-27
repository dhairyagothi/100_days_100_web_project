import { useState } from "react";

const COLORS = [
  "#FFFFFF",
  "#000000",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F97316",
  "#06B6D4",
];

export default function DrawPanel({
  tool,
  setTool,
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  onClearStrokes,
}) {
  const [custom, setCustom] = useState("#FFFFFF");

  return (
    <div className="p-4 overflow-y-auto h-full flex flex-col gap-5">
      <p className="text-[10px] font-mono tracking-widest text-[#334155] uppercase">
        Draw & Annotate
      </p>

      {/* Tool select */}
      <div>
        <p className="text-xs text-[#64748B] mb-2">Tool</p>
        <div className="flex gap-2">
          {[
            {
              id: "brush",
              label: "Brush",
              icon: (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.342Z" />
                </svg>
              ),
            },
            {
              id: "eraser",
              label: "Eraser",
              icon: (
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L3.97 10.53a.75.75 0 0 1 0-1.06l4.25-4.25Zm-2.69 9a.75.75 0 0 0 0 1.5h9.25a.75.75 0 0 0 0-1.5H5.53Z"
                    clipRule="evenodd"
                  />
                </svg>
              ),
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                tool === t.id
                  ? "border-violet-500/50 bg-violet-600/20 text-violet-300"
                  : "border-white/5 text-[#64748B] hover:border-white/10 hover:text-white"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brush size */}
      <div>
        <div className="flex justify-between mb-2">
          <p className="text-xs text-[#64748B]">Size</p>
          <span className="text-xs font-mono text-violet-300">
            {brushSize}px
          </span>
        </div>
        <div className="relative h-1.5 rounded-full bg-[#1E2740]">
          <div
            className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
            style={{
              width: `${((brushSize - 1) / 79) * 100}%`,
              background: "linear-gradient(90deg,#7C3AED,#06B6D4)",
            }}
          />
          <input
            type="range"
            min={1}
            max={80}
            step={1}
            value={brushSize}
            onChange={(e) => setBrushSize(+e.target.value)}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ margin: 0 }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-violet-500 pointer-events-none"
            style={{ left: `calc(${((brushSize - 1) / 79) * 100}% - 7px)` }}
          />
        </div>
        {/* Size preview */}
        <div className="flex items-center justify-center h-12 mt-2">
          <div
            className="rounded-full bg-white/80 transition-all"
            style={{
              width: `${Math.min(brushSize, 48)}px`,
              height: `${Math.min(brushSize, 48)}px`,
              background:
                tool === "eraser" ? "rgba(255,255,255,0.15)" : brushColor,
              border:
                tool === "eraser" ? "2px dashed rgba(255,255,255,0.3)" : "none",
            }}
          />
        </div>
      </div>

      {/* Color (hidden for eraser) */}
      {tool !== "eraser" && (
        <div>
          <p className="text-xs text-[#64748B] mb-2">Color</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setBrushColor(c)}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  brushColor === c
                    ? "border-white scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setBrushColor(e.target.value);
              }}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <span className="text-xs font-mono text-[#475569]">
              Custom color
            </span>
          </div>
        </div>
      )}

      <button
        onClick={onClearStrokes}
        className="mt-auto w-full py-2.5 rounded-xl border border-red-900/40 hover:border-red-500/40 text-red-400/70 hover:text-red-400 text-sm transition-all"
      >
        Clear all drawings
      </button>
    </div>
  );
}
