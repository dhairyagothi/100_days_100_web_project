// src/pages/PracticePage.jsx
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOPICS } from '../utils/questionData';
import { getTopicProgress, canUnlock, getHighestUnlockedLevel, getLevelStatus } from '../utils/progressionEngine';
import ProgressRing from '../components/dashboard/ProgressRing';

const BASE = import.meta.env.BASE_URL;

const TOPIC_ICONS = {
  'Binary Search': `${BASE}icons/binary-search.png`,
  'Bit-Manipulation': `${BASE}icons/bit-manipulation.png`,
  'Games': `${BASE}icons/games.png`,
  'Greedy': `${BASE}icons/greedy.png`,
  'Matrix/Grids': `${BASE}icons/grid.png`,
  'Hashing': `${BASE}icons/hashing.png`,
  'Number Theory': `${BASE}icons/number theory.png`,
  'Stacks': `${BASE}icons/stacks.png`,
  'Strings': `${BASE}icons/strings.png`,
  'Trees': `${BASE}icons/trees.png`,
  'Prefix Sum': `${BASE}icons/prefix sum.png`,
  'Sortings': `${BASE}icons/sorting.png`
};

export default function PracticePage() {
  const { progress, dataLoading } = useApp();

  const topicData = useMemo(() => TOPICS.map(topic => {
    const pct = getTopicProgress(progress, topic);
    const highestLevel = getHighestUnlockedLevel(progress, topic);
    return { topic, pct, highestLevel };
  }), [progress]);

  if (dataLoading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array(10).fill(0).map((_, i) => <div key={i} className="h-44 skeleton rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">Practice</h1>
        <p className="text-gray-400 text-sm">Choose a topic to start solving. Complete levels sequentially to unlock advanced problems.</p>
      </div>

      {/* Advisory notice */}
      <div className="glass border border-amber-500/15 bg-amber-500/5 px-5 py-3.5 flex items-center gap-3 mb-6 rounded-xl">
        <p className="text-sm text-amber-200/90">
          <strong className="text-amber-400">💡 Tip:</strong> Master at least 3-4 topics at the 800-1000 level before diving into 1300+ questions, as they often combine multiple concepts.
        </p>
      </div>

      {/* Topic grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {topicData.map(({ topic, pct, highestLevel }) => (
          <Link key={topic} to={`/practice/${encodeURIComponent(topic)}`}
            className="glass-hover p-6 group flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl mb-2 flex items-center justify-start h-8 w-8">
                  {TOPIC_ICONS[topic] ? (
                    <img src={TOPIC_ICONS[topic]} alt={topic} className="w-full h-full object-contain filter contrast-125 drop-shadow-sm brightness-110" />
                  ) : (
                    '📌'
                  )}
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors">{topic}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Up to Lv.{highestLevel}</p>
              </div>
              <ProgressRing percent={pct} size={56} stroke={5} />
            </div>

            {/* Level mini-bars */}
            <div className="flex gap-1">
              {[800,900,1000,1100,1200,1300,1400,1500].map(lvl => {
                const status = getLevelStatus(progress, topic, lvl);
                const unlocked = canUnlock(progress, topic, lvl);
                return (
                  <div key={lvl}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300
                      ${status.complete ? 'bg-brand-400'
                        : unlocked && status.solved > 0 ? 'bg-brand-600'
                        : unlocked ? 'bg-dark-400'
                        : 'bg-dark-500/40'}`}
                    title={`${lvl}: ${status.solved}/${status.total}`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{pct}% complete</span>
              <ChevronRight size={15} className="text-gray-600 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
