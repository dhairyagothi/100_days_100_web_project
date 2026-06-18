// src/pages/StarredPage.jsx
import { useMemo } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ALL_QUESTIONS_MAP, TOPICS } from '../utils/questionData';
import QuestionRow from '../components/practice/QuestionRow';

export default function StarredPage() {
  const { starred, progress, dataLoading } = useApp();

  const starredQuestions = useMemo(
    () => starred.map(id => ALL_QUESTIONS_MAP[id]).filter(Boolean),
    [starred]
  );

  if (dataLoading) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-2">
      {Array(5).fill(0).map((_, i) => <div key={i} className="h-16 skeleton rounded-xl" />)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Star size={20} className="text-amber-400 fill-amber-400" />
        </div>
        <div>
          <h1 className="section-title">Starred Problems</h1>
          <p className="text-xs text-gray-500">{starredQuestions.length} bookmarked problem{starredQuestions.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {starredQuestions.length === 0 ? (
        <div className="glass p-16 text-center">
          <Star size={48} className="text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No starred problems yet</h3>
          <p className="text-sm text-gray-500 mb-6">Star problems while practicing to bookmark them here for quick access.</p>
          <Link to="/practice" className="btn-primary">Start Practicing</Link>
        </div>
      ) : (
        <>
          {/* Group by topic */}
          {TOPICS.map(topic => {
            const qs = starredQuestions.filter(q => q.topic === topic);
            if (qs.length === 0) return null;
            return (
              <div key={topic} className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-sm font-semibold text-gray-300">{topic}</h2>
                  <span className="text-xs text-gray-600">({qs.length})</span>
                </div>
                <div className="space-y-2">
                  {qs.map(q => (
                    <Link key={q.id} to={`/practice/${encodeURIComponent(q.topic)}/${encodeURIComponent(q.id)}`}>
                      <QuestionRow
                        question={q}
                        isSolved={progress?.[q.topic]?.[q.difficulty]?.solved?.includes(q.id) || false}
                        isStarred={true}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
