// src/pages/Dashboard.jsx
import { useState, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Star, BookOpen, TrendingUp, Zap, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import StatsCard from '../components/dashboard/StatsCard';
import ProgressRing from '../components/dashboard/ProgressRing';
import ActivityHeatmap from '../components/heatmap/ActivityHeatmap';
import CFOnboardModal from '../components/dashboard/CFOnboardModal';
import CFSyncStatus from '../components/dashboard/CFSyncStatus';
import { TOPICS, LEVELS } from '../utils/questionData';
import { getTopicProgress, getHighestUnlockedLevel, getTopicsMastered } from '../utils/progressionEngine';

function SkeletonCard() {
  return <div className="glass p-5 h-28 skeleton" />;
}

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const { progress, starred, activity, streak, totalSolved, dataLoading } = useApp();
  
  const [showCFModal, setShowCFModal] = useState(true);

  const topicProgresses = useMemo(() =>
    TOPICS.map(t => ({ topic: t, pct: getTopicProgress(progress, t), level: getHighestUnlockedLevel(progress, t) })),
    [progress]
  );

  const topicsStarted = useMemo(() =>
    topicProgresses.filter(t => t.pct > 0).length, [topicProgresses]);

  const activeDays = useMemo(() =>
    Object.keys(activity).filter(d => activity[d] > 0).length, [activity]);

  const accuracy = useMemo(() => {
    if (totalSolved === 0) return 0;
    return Math.min(100, Math.round((totalSolved / Math.max(totalSolved, 1)) * 100));
  }, [totalSolved]);

  const name = profile?.name || user?.email?.split('@')[0] || 'Coder';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* ── CF Onboard Modal ───────────────────── */}
      {!dataLoading && profile && !profile.cfHandle && showCFModal && (
        <CFOnboardModal 
          user={user} 
          profile={profile} 
          refreshProfile={refreshProfile} 
          onSkip={() => setShowCFModal(false)}
        />
      )}

      {/* ── Welcome Banner ─────────────────────── */}
      <div className="relative glass border border-brand-500/20 bg-gradient-to-r from-brand-500/5 to-transparent overflow-hidden p-6 sm:p-8">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
        <div className="relative">
          <p className="text-brand-400 text-sm font-semibold mb-1">Welcome back 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            {streak > 0 && (
              <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
                🔥 {streak} day streak
              </span>
            )}
            {profile?.cfHandle && (
              <span className="flex items-center gap-1.5">
                <Code2 size={13} className="text-brand-400" />
                {profile.cfHandle}
                {profile.rating && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold">
                    {profile.rating}
                  </span>
                )}
              </span>
            )}
          </div>

          {!profile?.cfHandle && (
            <Link to="/profile" className="inline-flex items-center gap-2 mt-4 text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium">
              <Zap size={13} /> Connect your Codeforces handle to auto-sync solved problems <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dataLoading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatsCard icon="✅" label="Problems Solved" value={totalSolved} color="brand" />
            <StatsCard icon="🔥" label="Current Streak" value={`${streak}d`} sub="consecutive days" color="orange" />
            <StatsCard icon="📚" label="Topics Started" value={topicsStarted} sub={`/ ${TOPICS.length} topics`} color="blue" />
            <StatsCard icon="⭐" label="Starred" value={starred.length} sub="bookmarked problems" color="purple" />
          </>
        )}
      </div>

      {/* ── Topic Progress Rings ─────────────── */}
      <div className="glass p-6 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title text-xl">Topic Progress</h2>
          <Link to="/practice" className="btn-ghost text-xs gap-1">
            Practice <ArrowRight size={13} />
          </Link>
        </div>

        {dataLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full skeleton" />
                <div className="w-12 h-3 skeleton" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-4">
            {topicProgresses.map(({ topic, pct, level }) => (
              <Link key={topic} to={`/practice/${encodeURIComponent(topic)}`}
                className="flex flex-col items-center hover:scale-105 transition-transform duration-200"
              >
                <ProgressRing percent={pct} size={64} stroke={6} />
                <p className="text-[10px] font-medium text-gray-400 text-center mt-1 leading-tight">{topic}</p>
                <p className="text-[10px] text-gray-600">Lv.{level}</p>
              </Link>
            ))}
          </div>
        )}

        {/* ── Disclaimer ───────────────────── */}
        <div className="mt-4 lg:mt-0 lg:absolute lg:bottom-4 lg:right-4 w-full lg:w-[300px] glass p-2.5 text-[10px] text-yellow-200/80 border border-yellow-500/30 bg-yellow-500/10 rounded-lg shadow-xl z-10 transition-all hover:bg-yellow-500/20 hover:border-yellow-500/50">
          <p className="flex items-start gap-2 leading-tight">
            <span className="text-yellow-400 shrink-0 text-xs mt-0.5">⚠️</span>
            <span>
              <strong className="text-yellow-400 font-semibold">Disclaimer:</strong> The questions of these topics may or may not require the topic concepts, the topics are just for specificity of the domain of the concepts. Higher rating questions of these topics usually involve full use of its main concepts.
            </span>
          </p>
        </div>
      </div>

      {/* ── Activity Heatmap ─────────────────── */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-1">
          <span />
          <CFSyncStatus />
        </div>
        <ActivityHeatmap activityDates={activity} />
      </div>

      {/* ── Advisory Alert ──────────────── */}
      {!dataLoading && (() => {
        const count = getTopicsMastered(progress);
        const goal = 4;
        const complete = count >= goal;
        
        return (
          <div className="glass border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-3">
            <BookOpen size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                <p className="text-sm font-semibold text-amber-300">Level 1300+ Preparation</p>
                <div className="px-2.5 py-0.5 rounded-full bg-black/20 text-amber-200/90 text-[10px] font-bold border border-amber-500/15">
                  MASTERED: {count}/{goal} TOPICS
                </div>
              </div>
              <p className="text-xs text-amber-200/80 leading-relaxed max-w-2xl">
                Master at least {goal} topics at the 800-1000 level before moving to 1300+ questions, as they often combine multiple concepts. Currently you have fully mastered <strong className="text-amber-400">{count}</strong> topics. {complete ? 'Great job! You\'re ready for the hard ones.' : 'Keep at it!'}
              </p>
            </div>
          </div>
        );
      })()}

      {/* ── Quick Links ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/practice', icon: Code2,    label: 'Practice Problems', desc: 'Solve topic-wise questions', color: 'text-brand-400',  border: 'border-brand-500/20',  bg: 'bg-brand-500/5'  },
          { to: '/study',    icon: BookOpen, label: 'Study Notes',       desc: 'Open PDF notes by topic',   color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5' },
          { to: '/starred',  icon: Star,     label: 'Starred Problems',  desc: `${starred.length} bookmarked`, color: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/5' },
        ].map(({ to, icon: Icon, label, desc, color, border, bg }) => (
          <Link key={to} to={to} className={`glass-hover p-5 border ${border} ${bg}`}>
            <Icon size={22} className={`${color} mb-3`} />
            <p className="text-sm font-semibold text-white mb-1">{label}</p>
            <p className="text-xs text-gray-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
