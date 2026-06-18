import { X, Zap, BookOpen } from 'lucide-react';

export default function AdvisoryPopup({ difficulty, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-6 animate-slide-up shadow-card"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(239,68,68,0.3)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)', background: 'rgba(128,128,128,0.1)' }}
        >
          <X size={16} />
        </button>

        {/* Icon + heading */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/25 flex items-center justify-center shrink-0">
            <Zap size={22} className="text-rose-400" />
          </div>
          <div>
            <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text-head)' }}>
              Advanced Territory — {difficulty} Rating
            </h2>
            <p className="text-xs font-semibold text-rose-400/90">Multi-concept problems ahead</p>
          </div>
        </div>

        {/* Body */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
          Problems rated <strong style={{ color: 'var(--text-base)' }}>1300 and above</strong> often
          combine <strong style={{ color: 'var(--text-base)' }}>multiple concepts</strong> — like
          sorting&nbsp;+&nbsp;greedy, hashing&nbsp;+&nbsp;two-pointers, or&nbsp;graph&nbsp;+&nbsp;DP.
          They require cross-topic thinking.
        </p>

        {/* Tips */}
        <div
          className="rounded-xl p-4 mb-5 text-sm"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}
        >
          <div className="flex items-center gap-2 mb-3 font-semibold" style={{ color: 'var(--text-head)' }}>
            <BookOpen size={14} className="text-brand-400" />
            Recommended before diving in:
          </div>
          <ul className="space-y-2">
            {[
              'Master at least 3–4 topics at the 800–1000 level',
              'Be comfortable with Hashing, Sorting, Strings & Greedy',
              'Solve 1000–1200 problems across multiple topics first',
              'Read editorials when stuck — patterns repeat!',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2" style={{ color: 'var(--text-muted)' }}>
                <span className="mt-0.5 w-4 h-4 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-primary text-sm">
            Got it — Let's Go! 🚀
          </button>
          <button
            onClick={onClose}
            className="btn-ghost text-xs px-3"
            style={{ color: 'var(--text-muted)' }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
