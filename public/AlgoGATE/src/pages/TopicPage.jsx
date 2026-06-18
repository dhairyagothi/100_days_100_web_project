// src/pages/TopicPage.jsx
import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEVELS, getQForTopicLevel } from '../utils/questionData';
import { getLevelStatus } from '../utils/progressionEngine';
import QuestionRow from '../components/practice/QuestionRow';
import AdvisoryPopup from '../components/practice/AdvisoryPopup';

const TOPIC_TO_STUDY_ID = {
  'Bit-Manipulation': 'bit-manipulation',
  'Hashing': 'hashing',
  'Binary Search': 'binary-search',
  'GCD and Prime Numbers': 'number-theory',
  'Sortings': 'sorting'
};

export default function TopicPage() {
  const { topic } = useParams();
  const decodedTopic = decodeURIComponent(topic);
  const { progress, starred } = useApp();

  const [activeLevel, setActiveLevel] = useState(800);
  const [showAdvisory, setShowAdvisory] = useState(null);

  const questions = useMemo(
    () => getQForTopicLevel(decodedTopic, activeLevel),
    [decodedTopic, activeLevel]
  );

  const levelStatuses = useMemo(() =>
    LEVELS.map(lvl => ({
      level: lvl,
      status: getLevelStatus(progress, decodedTopic, lvl),
    })),
    [progress, decodedTopic]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {showAdvisory && (
        <AdvisoryPopup difficulty={showAdvisory} onClose={() => setShowAdvisory(null)} />
      )}

      {/* Back */}
      <Link
        to="/practice"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-head)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <ArrowLeft size={15} /> All Topics
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{decodedTopic}</h1>
        <p className="text-sm border-b border-white/5 pb-6 mb-4" style={{ color: 'var(--text-muted)' }}>
          Topic-wise problem ladder · All levels are open — tackle them in order for best results
        </p>
        
        {/* Study Resource Link */}
        <div className="flex items-center">
          {TOPIC_TO_STUDY_ID[decodedTopic] ? (
            <Link
              to={`/study?topic=${TOPIC_TO_STUDY_ID[decodedTopic]}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/30 text-sm font-bold text-brand-300 hover:bg-brand-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(var(--brand-rgb),0.15)] group"
            >
              <BookOpen size={16} className="text-brand-400 group-hover:scale-110 transition-transform" />
              📖 Reference Notes
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-700/30 border border-white/5 text-sm text-gray-500">
              🚫 No resources for this topic
            </div>
          )}
        </div>
      </div>

      {/* Level tabs — no locks, all clickable */}
      <div className="flex flex-wrap gap-2 mb-6">
        {levelStatuses.map(({ level, status }) => {
          const isActive = activeLevel === level;
          const isAdvanced = level >= 1300;
          return (
            <button
              key={level}
              onClick={() => {
                setActiveLevel(level);
                if (level >= 1300) {
                  setShowAdvisory(level);
                }
              }}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white border-brand-400 shadow-glow-sm'
                  : 'hover:border-brand-500/40'
                }`}
              style={!isActive ? {
                background: 'var(--bg-card)',
                borderColor: isAdvanced ? 'rgba(239,68,68,0.25)' : 'var(--border)',
                color: 'var(--text-base)',
              } : {}}
            >
              {status.complete && <CheckCircle2 size={11} className="text-brand-400" />}
              <span>{level}</span>
              {isAdvanced && !isActive && (
                <span className="text-[9px] font-bold text-rose-400/70 uppercase tracking-wide">ADV</span>
              )}
              {status.total > 0 && (
                <span
                  className={`text-[10px] ${isActive ? 'text-brand-200' : ''}`}
                  style={!isActive ? { color: 'var(--text-muted)' } : {}}
                >
                  {status.solved}/{status.total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Questions list */}
      {questions.length === 0 ? (
        <div className="glass p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          No problems defined for this level yet. Coming soon!
        </div>
      ) : (
        <div className="space-y-2">
          {questions.map(q => (
            <Link
              key={q.id}
              to={`/practice/${encodeURIComponent(decodedTopic)}/${encodeURIComponent(q.id)}`}
            >
              <QuestionRow
                question={q}
                isSolved={progress?.[decodedTopic]?.[activeLevel]?.solved?.includes(q.id) || false}
                isStarred={starred.includes(q.id)}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
