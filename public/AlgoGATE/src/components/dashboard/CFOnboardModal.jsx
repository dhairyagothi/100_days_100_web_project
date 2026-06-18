import { useState } from 'react';
import { X, Code2, Loader2, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { updateCFHandle } from '../../services/authService';
import { useCodeforcesSync } from '../../hooks/useCodeforcesSync';

export default function CFOnboardModal({ user, profile, refreshProfile, onSkip }) {
  const [handle, setHandle] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const { sync, syncing } = useCodeforcesSync();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!handle.trim() || !user) return;
    setSaving(true);
    try {
      // 1. Save handle to profile
      await updateCFHandle(user.uid, handle.trim());
      // 2. Fetch submissions to sync progress
      await sync(user.uid, handle.trim());
      
      // Update global context 
      await refreshProfile();
      setSuccess(true);
      
      setTimeout(() => {
        onSkip(); // Auto close after showing success
      }, 2000);
    } catch (err) {
      console.error(err);
      // Fallback close on fail, user can retry from profile page
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm animate-fade-in">
        <div className="glass border border-brand-500/30 p-8 rounded-2xl max-w-sm w-full text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-brand-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sync Complete!</h2>
          <p className="text-sm text-gray-400">Your solved problems have been linked.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-sm animate-fade-in">
      <div className="glass border border-brand-500/20 p-6 sm:p-8 rounded-2xl max-w-md w-full relative overflow-hidden shadow-card-hover">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Close Button */}
        <button onClick={onSkip} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex flex-shrink-0 items-center justify-center shadow-glow-sm">
            <Code2 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Link Codeforces</h2>
            <p className="text-xs text-brand-300">Auto-sync your problem progress</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          Unlock your true level by linking your Codeforces account. We'll automatically fetch your submissions and mark problems as completed across all your study topics.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Codeforces Handle</label>
            <input 
              type="text" 
              value={handle}
              onChange={e => setHandle(e.target.value)}
              placeholder="e.g. tourist"
              required
              className="input-field font-mono"
            />
          </div>
          
          <div className="flex items-center gap-3 mt-2">
            <button 
              type="button" 
              onClick={onSkip} 
              disabled={saving || syncing}
              className="btn-ghost flex-1 text-sm py-2.5"
            >
              Skip
            </button>
            <button 
              type="submit" 
              disabled={!handle.trim() || saving || syncing}
              className="btn-primary flex-[2] text-sm py-2.5 shadow-glow-sm"
            >
              {(saving || syncing) ? (
                <><Loader2 size={16} className="animate-spin" /> Syncing...</>
              ) : (
                <><Zap size={16} /> Link & Sync <ArrowRight size={14} /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
