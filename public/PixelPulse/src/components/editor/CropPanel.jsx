const RATIOS = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
  { label: "3:4", value: 3 / 4 },
];

export default function CropPanel({
  rotation,
  onRotate,
  flipH,
  onFlipH,
  flipV,
  onFlipV,
  aspectRatio,
  onAspectRatio,
  onApplyCrop,
  onResetCrop,
}) {
  return (
    <div className="p-4 overflow-y-auto h-full flex flex-col gap-5">
      {/* Aspect ratio */}
      <div>
        <p className="text-[10px] font-mono tracking-widest text-[#334155] uppercase mb-3">
          Aspect Ratio
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {RATIOS.map((r) => (
            <button
              key={r.label}
              onClick={() => onAspectRatio(r.value)}
              className={`py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                aspectRatio === r.value
                  ? "bg-violet-600 text-white"
                  : "bg-[#0A0A0F] border border-white/5 text-[#64748B] hover:border-violet-500/30 hover:text-violet-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rotation */}
      <div>
        <p className="text-[10px] font-mono tracking-widest text-[#334155] uppercase mb-3">
          Rotation
        </p>
        <div className="flex items-center gap-2 mb-3">
          {[-90, -45, -15, 15, 45, 90].map((deg) => (
            <button
              key={deg}
              onClick={() => onRotate(deg)}
              className="flex-1 py-1.5 rounded-lg text-[10px] font-mono bg-[#0A0A0F] border border-white/5 text-[#64748B] hover:border-violet-500/30 hover:text-violet-300 transition-all"
            >
              {deg > 0 ? `+${deg}` : deg}°
            </button>
          ))}
        </div>
        {/* Fine rotation slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#475569] w-6 text-right">
            {rotation}°
          </span>
          <div className="relative flex-1 h-1.5 rounded-full bg-[#1E2740]">
            <div
              className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
              style={{
                width: `${((rotation + 180) / 360) * 100}%`,
                background: "linear-gradient(90deg,#7C3AED,#06B6D4)",
              }}
            />
            <input
              type="range"
              min={-180}
              max={180}
              step={1}
              value={rotation}
              onChange={(e) => onRotate(+e.target.value, true)}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
              style={{ margin: 0 }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-violet-500 pointer-events-none shadow-[0_0_8px_rgba(124,58,237,0.6)]"
              style={{ left: `calc(${((rotation + 180) / 360) * 100}% - 7px)` }}
            />
          </div>
        </div>
      </div>

      {/* Flip */}
      <div>
        <p className="text-[10px] font-mono tracking-widest text-[#334155] uppercase mb-3">
          Flip
        </p>
        <div className="flex gap-2">
          <button
            onClick={onFlipH}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
              flipH
                ? "border-violet-500/50 bg-violet-600/20 text-violet-300"
                : "border-white/5 text-[#64748B] hover:border-white/10 hover:text-white"
            }`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10 3a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-1.5 0V3.75A.75.75 0 0 1 10 3ZM4.5 8.25a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM14.25 7.5a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z" />
            </svg>
            Horizontal
          </button>
          <button
            onClick={onFlipV}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
              flipV
                ? "border-violet-500/50 bg-violet-600/20 text-violet-300"
                : "border-white/5 text-[#64748B] hover:border-white/10 hover:text-white"
            }`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path
                d="M10 3a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-1.5 0V3.75A.75.75 0 0 1 10 3ZM8.25 4.5a.75.75 0 0 1-.75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75ZM7.5 14.25a.75.75 0 0 0 1.5 0v-.5a.75.75 0 0 0-1.5 0v.5Z"
                transform="rotate(90 10 10)"
              />
            </svg>
            Vertical
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2">
        <button
          onClick={onResetCrop}
          className="flex-1 py-2.5 rounded-lg border border-white/5 text-[#64748B] hover:text-white hover:border-white/10 text-sm transition-all"
        >
          Reset
        </button>
        <button
          onClick={onApplyCrop}
          className="flex-1 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all"
        >
          Apply Crop
        </button>
      </div>
    </div>
  );
}
