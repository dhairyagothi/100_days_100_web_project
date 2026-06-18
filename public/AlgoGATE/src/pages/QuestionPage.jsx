// src/pages/QuestionPage.jsx
import { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Star, CheckCircle2, Circle, Tag, Lightbulb, ChevronDown, ChevronUp, X, Zap, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ALL_QUESTIONS_MAP } from '../utils/questionData';
import { starQuestion, unstarQuestion } from '../services/progressService';
import DiscussionThread from '../components/discussion/DiscussionThread';
import AdvisoryPopup from '../components/practice/AdvisoryPopup';
import { Loader2 } from 'lucide-react';

export default function QuestionPage() {
  const { topic, questionId } = useParams();
  const decodedTopic = decodeURIComponent(topic);
  const decodedQId   = decodeURIComponent(questionId);

  const { user, profile } = useAuth();
  const { progress, starred, setStarred, refreshData } = useApp();

  const question = useMemo(() => ALL_QUESTIONS_MAP[decodedQId], [decodedQId]);

  const isSolved = progress?.[decodedTopic]?.[question?.difficulty]?.solved?.includes(decodedQId) || false;
  const isStarred = starred.includes(decodedQId);

  const [starLoading, setStarLoading]   = useState(false);
  const [hintVisible, setHintVisible]   = useState(false);
  const [showAdvisory, setShowAdvisory] = useState(false);

  // Show advisory popup once per session when opening a 1300+ question
  useEffect(() => {
    if (!question) return;
    if (question.difficulty >= 1300) {
      const key = 'ag-advisory-seen';
      if (!sessionStorage.getItem(key)) {
        setShowAdvisory(true);
      }
    }
  }, [question?.id]);

  function dismissAdvisory() {
    sessionStorage.setItem('ag-advisory-seen', '1');
    setShowAdvisory(false);
  }

  if (!question) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
      <p className="text-gray-400">Question not found.</p>
      <Link to="/practice" className="btn-primary mt-4 inline-flex">Back to Practice</Link>
    </div>
  );

  async function toggleStar() {
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
    } finally { setStarLoading(false); }
  }

  const diffColor = question.difficulty <= 900 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : question.difficulty <= 1100 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">

      {/* ── 1300+ Advisory Popup ─────────────────────────────── */}
      {showAdvisory && (
        <AdvisoryPopup difficulty={question.difficulty} onClose={dismissAdvisory} />
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
        <Link to="/practice" className="hover:text-brand-400 transition-colors">Practice</Link>
        <span>/</span>
        <Link to={`/practice/${encodeURIComponent(decodedTopic)}`} className="hover:text-brand-400 transition-colors">{decodedTopic}</Link>
        <span>/</span>
        <span className="truncate max-w-[180px]" style={{ color: 'var(--text-base)' }}>{question.title}</span>
      </nav>

      {/* Header card */}
      <div className="glass p-6 sm:p-8 mb-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">{question.title}</h1>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${diffColor}`}>
                {question.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/8 text-gray-400">
                {question.topic}
              </span>
              {isSolved && (
                <span className="flex items-center gap-1 text-xs text-brand-400 font-semibold">
                  <CheckCircle2 size={13} /> Solved
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              <Tag size={12} className="text-gray-600 mt-0.5" />
              {question.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 border border-white/5 text-gray-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <a href={question.link} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex-1">
              <ExternalLink size={14} /> Open on CF
            </a>
            <button
              onClick={toggleStar}
              disabled={starLoading}
              className="btn-ghost text-sm"
            >
              {starLoading
                ? <Loader2 size={14} className="animate-spin" />
                : <Star size={14} className={isStarred ? 'fill-amber-400 text-amber-400' : ''} />}
              {isStarred ? 'Starred' : 'Star'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Hint Card ───────────────────────── */}
      {question.hint && (
        <div className="glass mb-6 overflow-hidden border border-amber-500/20">
          <button
            onClick={() => setHintVisible(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-amber-500/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                <Lightbulb size={14} className="text-amber-400" />
              </div>
              <span className="text-sm font-semibold text-amber-400">Hint</span>
              {!hintVisible && (
                <span className="text-xs text-gray-500 ml-1">(click to reveal)</span>
              )}
            </div>
            {hintVisible
              ? <ChevronUp size={16} className="text-amber-400" />
              : <ChevronDown size={16} className="text-gray-500" />}
          </button>

          {hintVisible && (
            <div className="px-5 pb-5 animate-fade-in">
              <div className="mt-1 px-4 py-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
                <p className="text-sm text-amber-200 leading-relaxed">
                  👉 {question.hint}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Discussion */}
      <div className="glass p-6">
        <DiscussionThread questionId={decodedQId} />
      </div>
    </div>
  );
}
