const SLIDERS = [
  { key: "exposure", label: "Exposure", min: -100, max: 100, icon: "☀" },
  { key: "brightness", label: "Brightness", min: -100, max: 100, icon: "◑" },
  { key: "contrast", label: "Contrast", min: -100, max: 100, icon: "◐" },
  { key: "saturation", label: "Saturation", min: -100, max: 100, icon: "❋" },
  { key: "hue", label: "Hue", min: -180, max: 180, icon: "◎" },
  { key: "temperature", label: "Temperature", min: -100, max: 100, icon: "🌡" },
  { key: "sharpness", label: "Sharpness", min: 0, max: 100, icon: "◈" },
];

function AdjSlider({ cfg, value, onChange, onCommit }) {
  const pct = ((value - cfg.min) / (cfg.max - cfg.min)) * 100;
  const isDef = value === 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-[#94A3B8] flex items-center gap-1.5">
          <span className="text-[11px]">{cfg.icon}</span>
          {cfg.label}
        </span>
        <span
          className={`text-xs font-mono tabular-nums ${isDef ? "text-[#334155]" : "text-violet-300"}`}
        >
          {value > 0 && cfg.min < 0 ? `+${value}` : value}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-[#1E2740]">
        <div
          className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
          style={{
            width: `${pct}%`,
            background: isDef
              ? "#334155"
              : "linear-gradient(90deg,#7C3AED,#06B6D4)",
          }}
        />
        <input
          type="range"
          min={cfg.min}
          max={cfg.max}
          step={1}
          value={value}
          onChange={(e) => onChange(cfg.key, +e.target.value)}
          onPointerUp={(e) => onCommit(cfg.key, +e.target.value)}
          onKeyUp={(e) => onCommit(cfg.key, +e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 pointer-events-none transition-colors ${
            isDef
              ? "bg-[#1E2740] border-[#334155]"
              : "bg-white border-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.6)]"
          }`}
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
    </div>
  );
}

export default function AdjustPanel({ draftAdj, onChange, onCommit, onReset }) {
  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-mono tracking-widest text-[#334155] uppercase">
          Adjustments
        </p>
        <button
          onClick={onReset}
          className="text-[10px] text-[#475569] hover:text-violet-400 transition-colors font-mono"
        >
          Reset
        </button>
      </div>
      {SLIDERS.map((s) => (
        <AdjSlider
          key={s.key}
          cfg={s}
          value={draftAdj[s.key] ?? 0}
          onChange={onChange}
          onCommit={onCommit}
        />
      ))}
    </div>
  );
}
