// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { Code2, TrendingUp, Compass, BookOpen, MessageSquare, Zap, ArrowRight, CheckCircle2, Star, Target, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TOPICS } from '../utils/questionData';

const FEATURES = [
  { icon: TrendingUp, title: 'Progressive Difficulty', desc: 'Start at CF-800 and climb to 1500 with structured level gates. No more jumping into the deep end.', color: 'text-brand-400' },
  { icon: Compass,    title: 'Smart Recommendations', desc: 'Automatically recommends what to practice next based on your mastery of topics, ensuring balanced progression.', color: 'text-amber-400' },
  { icon: Zap,        title: 'CF Auto-Sync', desc: 'Connect your Codeforces handle. Solved problems are auto-detected and marked across all topics.', color: 'text-blue-400' },
  { icon: BookOpen,   title: 'Detailed Notes',  desc: 'DSA, IITM BS, and Dev notes organised by topic — quick reference materials right in the browser.', color: 'text-purple-400' },
  { icon: MessageSquare, title: 'Discussion Threads', desc: 'Each problem has a live discussion. Post solutions, ask doubts, reply to peers in real-time.', color: 'text-rose-400' },
  { icon: CheckCircle2,  title: 'Progress Tracking', desc: 'GitHub-style heatmap, streak counter, per-topic rings — see your journey at a glance.', color: 'text-orange-400' },
];

const STEPS = [
  { n: '01', title: 'Create Account', desc: 'Sign up in seconds and link your Codeforces handle.' },
  { n: '02', title: 'Pick a Topic', desc: 'Choose from 10 core CP topics. Start with level 800.' },
  { n: '03', title: 'Solve & Progress', desc: 'Master concepts fully. CF sync auto-marks solved problems for you.' },
  { n: '04', title: 'Follow Recommendations', desc: 'Let the system recommend branching into other topics to build a well-rounded foundation.' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900">
      {/* ── HERO ──────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-0 w-[250px] h-[250px] bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow" />
            Structured CP Learning — 800 → 1500
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-[1.08] animate-slide-up">
            Stop Getting{' '}
            <span className="gradient-text">TLE'd</span>
            <br />on Your Career
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            AlgoGATE is the structured competitive programming platform that takes you from CF-800 to CF-1500
            through curated topic ladders, smart progression locks, and real-time CF sync.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {user ? (
              <Link to="/dashboard" className="btn-primary text-base px-7 py-3.5">
                Go to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/auth" className="btn-primary text-base px-7 py-3.5">
                  Start for Free <ArrowRight size={18} />
                </Link>
                <Link to="/auth" className="btn-secondary text-base px-7 py-3.5">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Topic pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-14 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {TOPICS.map(t => (
              <Link key={t} to={`/practice/${encodeURIComponent(t)}`} className="px-3 py-1.5 text-xs font-medium rounded-full border border-white/8 bg-white/5 text-gray-400 hover:border-brand-500/40 hover:text-brand-300 transition-all duration-200 cursor-pointer">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────── */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Why AlgoGATE</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything you need to level up</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-hover p-6">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  <Icon size={22} className={color} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────── */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">How AlgoGATE works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-brand-500/40 to-transparent z-10" />
                )}
                <div className="glass p-6">
                  <div className="text-4xl font-black gradient-text mb-4">{s.n}</div>
                  <h3 className="text-sm font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Smart Recommendation Engine ────────────── */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="glass border border-amber-500/20 bg-amber-500/5 p-8 sm:p-12 rounded-3xl text-center shadow-[0_0_40px_rgba(245,158,11,0.05)]">
            <div className="text-4xl mb-4 animate-bounce hover:animate-none cursor-default transition-transform hover:scale-125">🧭</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Smart Recommendation Engine
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
              We've replaced the traditional lock system with intelligent recommendations. The system tracks your mastery across multiple topics and <span className="text-amber-300 font-semibold">guides you towards the most impactful problems</span>, preventing blind grinding and ensuring you build a well-rounded foundation naturally.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {['Arrays 📈', 'Strings 🔥', 'Greedy 🎯', 'DP 💡', 'Graphs 🚀'].map(t => (
                <span key={t} className="px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-200 transition-transform hover:scale-110 cursor-default">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Study Notes Section ──────────────────── */}
      <section className="py-20 px-4 border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          
          {/* DSA Notes */}
          <div className="glass p-8 sm:p-10 rounded-3xl border-brand-500/20 bg-brand-500/5 relative overflow-hidden group h-full flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-500/20 transition-all duration-700 pointer-events-none" />
            <BookOpen size={40} className="text-brand-400 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Detailed DSA Notes</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
              Need a quick refresher before jumping into a Codeforces contest? We provide comprehensive, topic-wise DSA study references ranging from basic Arrays to advanced dynamic programming.
            </p>
            <ul className="space-y-3 mb-8">
              {['Concept explanations & intuition', 'Standard algorithm templates', 'Time & space complexity analysis'].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle2 size={16} className="text-brand-400" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <Link to="/study" className="btn-secondary">
                Browse DSA Notes
              </Link>
            </div>
          </div>

          {/* IITM-BS Notes (Animated Notebook) */}
          <div className="relative p-6 sm:p-10 perspective-[1000px] flex items-center justify-center">
            
            {/* The Notebook Container */}
            <div className="w-[340px] sm:w-[400px] h-[450px] notebook-paper p-8 pl-12 shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 relative cursor-default">
              
              {/* Spiral Binder */}
              <div className="spiral-container">
                {Array(15).fill(0).map((_,i) => <div key={i} className="spiral-ring" />)}
              </div>
              
              <div className="font-handwriting text-xl sm:text-2xl font-bold text-blue-800/90 mb-4 animate-fade-in flex justify-between items-center bg-blue-100/50 p-2 rounded -mx-2 border border-blue-200/50">
                <span>IITM-BS Diary</span>
                <Star size={20} className="text-yellow-500 fill-yellow-500 animate-pulse" />
              </div>
              
              <h3 className="font-handwriting text-slate-800 text-xl font-bold mb-5 rotate-[-1deg]">
                Specialized Weekly Notes!
              </h3>
              
              <p className="font-handwriting text-slate-700/90 leading-[28px] text-[15px] sm:text-[16px]">
                Pursuing dual degrees? We've got you covered! Get weekly curated study materials completely aligned with the 
                <strong className="text-red-700/90 mx-1">IITM-BS Data Science & AI</strong> 
                curriculum.
                <br /><br />
                <span className="inline-block animate-float-rotate bg-yellow-200/80 p-1 px-2 -rotate-2 border-2 border-yellow-400/50 rounded-lg shadow-sm font-semibold">Perfect for busy students!</span>
              </p>
              
              {/* Sticky Note */}
              <div className="absolute -bottom-6 right-6 w-32 h-32 bg-yellow-300 shadow-xl p-3 transform rotate-6 animate-sticky border border-yellow-400 flex flex-col justify-center items-center text-center z-20 transition-transform duration-300 hover:rotate-0 hover:scale-110">
                <span className="font-handwriting text-sm font-bold text-black/80">Bonus!</span>
                <span className="font-handwriting text-[11px] text-black/70 mt-1 leading-snug">Foundation & Diploma levels included.</span>
              </div>
              
              {/* Graphic Elements */}
              <div className="hidden sm:block absolute top-[40%] -right-8 w-12 h-36 bg-gradient-to-b from-orange-400 via-yellow-400 to-red-400 rounded-full border border-orange-500 shadow-xl opacity-90 transform -rotate-12 animate-float-slow -z-10" />
              <div className="absolute top-8 -right-4 transform rotate-[15deg] bg-blue-100 text-blue-800 border border-blue-300 shadow px-2 py-0.5 text-[10px] font-bold rounded-md animate-pulse">#DataScience</div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
            Ready to <span className="gradient-text">escape TLE</span>?
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Join thousands of CP learners building a solid algorithmic foundation.
          </p>
          <Link to={user ? '/dashboard' : '/auth'} className="btn-primary text-base px-8 py-4">
            {user ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-xs text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Code2 size={14} className="text-brand-500" />
          <span className="font-semibold text-gray-400">AlgoGATE</span>
        </div>
        <p>Built for competitive programmers. Problems from Codeforces. Not affiliated with Codeforces.</p>
      </footer>
    </div>
  );
}
