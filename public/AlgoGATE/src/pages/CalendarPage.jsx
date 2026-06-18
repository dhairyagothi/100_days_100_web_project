// src/pages/CalendarPage.jsx
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_QUESTIONS_MAP } from '../utils/questionData';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const { activity, progress } = useApp();

  const now = new Date();
  const [viewYear, setViewYear]   = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selected, setSelected]   = useState(null);

  const todayStr = now.toISOString().split('T')[0];

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelected(null);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelected(null);
  }

  const daysInMonth  = getDaysInMonth(viewYear, viewMonth);
  const firstDaySlot = getFirstDayOfMonth(viewYear, viewMonth);

  const calendarCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDaySlot; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, date, count: activity[date] || 0 });
    }
    return cells;
  }, [viewYear, viewMonth, firstDaySlot, daysInMonth, activity]);

  // Build solved questions for selected date from progress
  const solvedOnDate = useMemo(() => {
    if (!selected) return [];
    // We don't have per-date question IDs in current schema — show count instead
    const count = activity[selected] || 0;
    return count;
  }, [selected, activity]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20">
          <Calendar size={18} className="text-brand-400" />
        </div>
        <div>
          <h1 className="section-title">Activity Calendar</h1>
          <p className="text-xs text-gray-500">Daily problem-solving history</p>
        </div>
      </div>

      {/* Calendar card */}
      <div className="glass p-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="btn-ghost p-2"><ChevronLeft size={18} /></button>
          <h2 className="text-base font-bold text-white">
            {MONTHS[viewMonth]} {viewYear}
          </h2>
          <button onClick={nextMonth} className="btn-ghost p-2"><ChevronRight size={18} /></button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-600 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} />;
            const isToday = cell.date === todayStr;
            const isSelected = selected === cell.date;
            const hasActivity = cell.count > 0;
            const intensity = cell.count === 0 ? 0 : cell.count <= 2 ? 1 : cell.count <= 5 ? 2 : 3;
            const intensityBg = [
              'bg-dark-600/40',
              'bg-brand-900/80 border-brand-700',
              'bg-brand-600/60 border-brand-500',
              'bg-brand-400/80 border-brand-300',
            ][intensity];

            return (
              <button
                key={cell.date}
                onClick={() => setSelected(isSelected ? null : cell.date)}
                className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-xs transition-all duration-150
                  ${isSelected
                    ? 'border-brand-400 ring-1 ring-brand-500/50 bg-brand-500/20 text-white'
                    : isToday
                    ? 'border-brand-500 bg-brand-500/10 text-brand-300 font-bold'
                    : hasActivity
                    ? `${intensityBg} text-white hover:scale-105`
                    : 'border-transparent bg-dark-600/20 text-gray-600 hover:bg-white/5'
                  }`}
              >
                <span className="font-medium">{cell.day}</span>
                {cell.count > 0 && (
                  <span className="text-[8px] opacity-80">{cell.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day detail */}
        {selected && (
          <div className="mt-5 pt-5 border-t border-white/5 animate-slide-up">
            <p className="text-xs font-semibold text-gray-300 mb-2">
              {new Date(selected + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {solvedOnDate > 0 ? (
              <p className="text-sm text-brand-300 font-semibold">
                ✅ {solvedOnDate} problem{solvedOnDate !== 1 ? 's' : ''} solved
              </p>
            ) : (
              <p className="text-sm text-gray-500 italic">No activity on this day</p>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
        <span>Less active</span>
        {['bg-dark-600/40','bg-brand-900/80','bg-brand-600/60','bg-brand-400/80'].map((c, i) => (
          <div key={i} className={`w-4 h-4 rounded ${c} border border-white/10`} />
        ))}
        <span>More active</span>
      </div>
    </div>
  );
}
