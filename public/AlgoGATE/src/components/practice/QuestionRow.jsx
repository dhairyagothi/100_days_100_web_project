// src/components/practice/QuestionRow.jsx
import { useState } from 'react';
import { ExternalLink, Star, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { starQuestion, unstarQuestion } from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getDifficultyClass, getDifficultyLabel } from '../../utils/questionData';

export default function QuestionRow({ question, isSolved, isStarred }) {
  const { user } = useAuth();
  const { setProgress, setStarred, setActivity, refreshData } = useApp();
  const [starLoading, setStarLoading] = useState(false);

  async function toggleStar(e) {
    e.stopPropagation();
    if (!user) return;
    setStarLoading(true);
    try {
      if (isStarred) {
        await unstarQuestion(user.uid, question.id);
        setStarred(s => s.filter(id => id !== question.id));
      } else {
        await starQuestion(user.uid, question.id);
        setStarred(s => [...s, question.id]);
      }
    } finally {
      setStarLoading(false);
    }
  }

  return (
    <div className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200
      ${isSolved
        ? 'bg-emerald-500/15 border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/20 shadow-glow-sm'
        : 'bg-dark-700/40 border-white/5 hover:border-white/10 hover:bg-dark-700/70'
      }`}
    >
      {/* Solved Status Indicator (Synced) */}
      <div
        className="shrink-0 flex items-center justify-center transition-colors"
        title={isSolved ? 'Solved on Codeforces' : 'Not solved yet'}
      >
        {isSolved
          ? <CheckCircle2 size={18} className="text-emerald-400 drop-shadow-md" />
          : <Circle size={18} className="text-gray-500" />
        }
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isSolved ? 'text-emerald-300 drop-shadow-sm' : 'text-gray-200'}`}>
          {question.title}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {question.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/5">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Difficulty badge */}
      <span className={`shrink-0 text-xs px-2.5 py-0.5 rounded-full font-semibold hidden sm:inline-flex
        ${question.difficulty <= 900 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
          : question.difficulty <= 1100 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
          : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
        }`}
      >
        {question.difficulty}
      </span>

      {/* Star */}
      <button
        onClick={toggleStar}
        disabled={starLoading}
        className="shrink-0 text-gray-600 hover:text-amber-400 transition-colors"
        title={isStarred ? 'Unstar' : 'Star'}
      >
        {starLoading
          ? <Loader2 size={15} className="animate-spin" />
          : <Star size={15} className={isStarred ? 'fill-amber-400 text-amber-400' : ''} />
        }
      </button>

      {/* CF link */}
      <a
        href={question.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="shrink-0 text-gray-500 hover:text-brand-400 transition-colors"
        title="Open on Codeforces"
      >
        <ExternalLink size={14} />
      </a>
    </div>
  );
}
