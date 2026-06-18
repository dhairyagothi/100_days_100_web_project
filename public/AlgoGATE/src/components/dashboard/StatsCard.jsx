// src/components/dashboard/StatsCard.jsx
export default function StatsCard({ icon, label, value, sub, color = 'brand' }) {
  const colorMap = {
    brand:  { bg: 'bg-brand-500/10',  border: 'border-brand-500/20',  text: 'text-brand-400',  icon: 'bg-brand-500/20'  },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', icon: 'bg-orange-500/20' },
    blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',   icon: 'bg-blue-500/20'   },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', icon: 'bg-purple-500/20' },
    rose:   { bg: 'bg-rose-500/10',   border: 'border-rose-500/20',   text: 'text-rose-400',   icon: 'bg-rose-500/20'   },
  };
  const c = colorMap[color] || colorMap.brand;

  return (
    <div className={`glass-hover p-5 border ${c.border} ${c.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${c.icon}`}>
          <span className={`text-xl ${c.text}`}>{icon}</span>
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-300">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}
