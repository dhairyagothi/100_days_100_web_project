import { useState } from "react";

const FONTS = [
  "Inter",
  "Georgia",
  "Courier New",
  "Impact",
  "Pacifico",
  "Montserrat",
];
const PRESETS = [
  "#FFFFFF",
  "#000000",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

export default function TextPanel({ onAddText }) {
  const [text, setText] = useState("Your text here");
  const [size, setSize] = useState(48);
  const [color, setColor] = useState("#FFFFFF");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [bold, setBold] = useState(false);
  const [shadow, setShadow] = useState(true);
  const [opacity, setOpacity] = useState(100);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAddText({
      text,
      size,
      color,
      fontFamily,
      bold,
      shadow,
      opacity: opacity / 100,
    });
  };

  return (
    <div className="p-4 overflow-y-auto h-full flex flex-col gap-4">
      <p className="text-[10px] font-mono tracking-widest text-[#334155] uppercase">
        Text Overlay
      </p>

      {/* Text input */}
      <div>
        <label className="text-xs text-[#64748B] mb-1.5 block">Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-[#334155] resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
        />
      </div>

      {/* Font family */}
      <div>
        <label className="text-xs text-[#64748B] mb-1.5 block">Font</label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full bg-[#0A0A0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors"
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-xs text-[#64748B]">Size</label>
          <span className="text-xs font-mono text-violet-300">{size}px</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-[#1E2740]">
          <div
            className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
            style={{
              width: `${((size - 8) / 232) * 100}%`,
              background: "linear-gradient(90deg,#7C3AED,#06B6D4)",
            }}
          />
          <input
            type="range"
            min={8}
            max={240}
            step={2}
            value={size}
            onChange={(e) => setSize(+e.target.value)}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ margin: 0 }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-violet-500 pointer-events-none"
            style={{ left: `calc(${((size - 8) / 232) * 100}% - 7px)` }}
          />
        </div>
      </div>

      {/* Opacity */}
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-xs text-[#64748B]">Opacity</label>
          <span className="text-xs font-mono text-violet-300">{opacity}%</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-[#1E2740]">
          <div
            className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
            style={{
              width: `${opacity}%`,
              background: "linear-gradient(90deg,#7C3AED,#06B6D4)",
            }}
          />
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={opacity}
            onChange={(e) => setOpacity(+e.target.value)}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            style={{ margin: 0 }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-violet-500 pointer-events-none"
            style={{ left: `calc(${opacity}% - 7px)` }}
          />
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="text-xs text-[#64748B] mb-2 block">Color</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${color === c ? "border-white scale-110" : "border-transparent hover:scale-105"}`}
              style={{ background: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
          />
          <span className="text-xs font-mono text-[#475569]">{color}</span>
        </div>
      </div>

      {/* Style toggles */}
      <div className="flex gap-2">
        {[
          { label: "Bold", val: bold, set: setBold },
          { label: "Shadow", val: shadow, set: setShadow },
        ].map(({ label, val, set }) => (
          <button
            key={label}
            onClick={() => set((v) => !v)}
            className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
              val
                ? "border-violet-500/50 bg-violet-600/20 text-violet-300"
                : "border-white/5 text-[#64748B] hover:border-white/10 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-lg bg-[#070710] border border-white/5 h-16 flex items-center justify-center overflow-hidden">
        <span
          style={{
            fontFamily,
            fontSize: `${Math.min(size, 36)}px`,
            color,
            fontWeight: bold ? "bold" : "normal",
            opacity: opacity / 100,
            textShadow: shadow ? "2px 2px 4px rgba(0,0,0,0.8)" : "none",
          }}
        >
          {text || "Preview"}
        </span>
      </div>

      <button
        onClick={handleAdd}
        className="w-full py-3 rounded-xl bg-linear-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-cyan-600 text-white text-sm font-semibold transition-all shadow-lg shadow-violet-900/30"
      >
        Click canvas to place text
      </button>
      <p className="text-[10px] text-[#334155] text-center -mt-2">
        After clicking "Click canvas", tap where you want the text to appear.
      </p>
    </div>
  );
}
