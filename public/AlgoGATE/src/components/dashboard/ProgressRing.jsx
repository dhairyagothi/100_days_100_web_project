// src/components/dashboard/ProgressRing.jsx
export default function ProgressRing({ percent = 0, size = 80, stroke = 7, label, sublabel }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  const color = percent >= 80 ? '#25a372' : percent >= 40 ? '#f59e0b' : '#6b7280';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white">{percent}%</span>
        </div>
      </div>
      {label && <p className="text-xs font-medium text-gray-300 text-center max-w-[80px] leading-tight">{label}</p>}
      {sublabel && <p className="text-[10px] text-gray-500">{sublabel}</p>}
    </div>
  );
}
