// src/components/heatmap/ActivityHeatmap.jsx
import { useMemo } from 'react';
import { generateHeatmapData, getIntensity, getMonthLabels } from '../../utils/streakEngine';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const INTENSITY_CLASSES = [
  'bg-dark-500 border border-white/5',
  'bg-brand-900/80 border border-brand-800',
  'bg-brand-700/70 border border-brand-600',
  'bg-brand-500/80 border border-brand-400',
  'bg-brand-400 border border-brand-300 shadow-glow-sm',
];

export default function ActivityHeatmap({ activityDates = {} }) {
  const weeks = useMemo(() => generateHeatmapData(activityDates), [activityDates]);
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);

  const totalSolved = useMemo(
    () => Object.values(activityDates).reduce((s, c) => s + c, 0),
    [activityDates]
  );
  const activeDays = useMemo(
    () => Object.keys(activityDates).filter(d => activityDates[d] > 0).length,
    [activityDates]
  );

  return (
    <div className="w-full">
      {/* Stats row */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-300">Activity Heatmap</h3>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span><span className="text-gray-300 font-medium">{totalSolved}</span> total solves</span>
          <span><span className="text-gray-300 font-medium">{activeDays}</span> active days</span>
          {/* Legend */}
          <div className="flex items-center gap-1">
            <span>Less</span>
            {INTENSITY_CLASSES.map((cls, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="inline-flex flex-col gap-1 min-w-max">
          {/* Month labels */}
          <div className="flex gap-1 mb-0.5 ml-8">
            {weeks.map((_, i) => {
              const label = monthLabels.find(m => m.index === i);
              return (
                <div key={i} className="w-3 text-center">
                  {label && (
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">{label.label}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Day rows */}
          {DAYS.map((day, dayIdx) => (
            <div key={day} className="flex items-center gap-1">
              <span className="text-[10px] text-gray-500 w-7 shrink-0">
                {dayIdx % 2 === 1 ? day : ''}
              </span>
              {weeks.map((week, weekIdx) => {
                const cell = week[dayIdx];
                if (!cell) return <div key={weekIdx} className="w-3 h-3" />;
                const intensity = getIntensity(cell.count);
                return (
                  <div
                    key={weekIdx}
                    className={`w-3 h-3 rounded-sm transition-transform hover:scale-125 cursor-default ${INTENSITY_CLASSES[intensity]}`}
                    title={`${cell.date}: ${cell.count} problem${cell.count !== 1 ? 's' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
