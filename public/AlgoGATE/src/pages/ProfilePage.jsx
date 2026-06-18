// src/pages/ProfilePage.jsx
import { useState, useRef } from 'react';
import { User, Code2, RefreshCw, CheckCircle2, AlertCircle, Loader2, Edit2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { updateCFHandle } from '../services/authService';
import { useCodeforcesSync } from '../hooks/useCodeforcesSync';
import { TOPICS } from '../utils/questionData';
import { getTopicProgress } from '../utils/progressionEngine';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { progress, totalSolved, streak, activity, refreshData } = useApp();
  const { sync, syncing, syncResult, error: syncError } = useCodeforcesSync();

  const [cfHandle, setCfHandle] = useState(profile?.cfHandle || '');
  const [editingCF, setEditingCF] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [savedMsg, setSavedMsg]   = useState('');

  const activeDays = Object.keys(activity).filter(d => activity[d] > 0).length;

  async function saveCFHandle() {
    if (!cfHandle.trim() || !user) return;
    setSaving(true);
    setSavedMsg('');
    try {
      await updateCFHandle(user.uid, cfHandle.trim());
      refreshProfile();
      setEditingCF(false);
      setSavedMsg('Codeforces handle saved!');
      setTimeout(() => setSavedMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  }

  async function handleSync() {
    if (!user || !cfHandle.trim()) return;
    await sync(user.uid, cfHandle.trim());
    refreshProfile();
    refreshData();
  }

  const topicBests = TOPICS.map(t => ({ topic: t, pct: getTopicProgress(progress, t) }))
    .sort((a, b) => b.pct - a.pct).slice(0, 5);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in space-y-6">
      {/* Header */}
      <h1 className="section-title">Profile</h1>

      {/* Profile card */}
      <div className="glass p-6 sm:p-8">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-2xl font-black shadow-glow">
            {(profile?.name || user?.email)?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
            {profile?.rating && (
              <span className="inline-flex mt-1 items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold">
                CF Rating: {profile.rating}
              </span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Solved',      value: totalSolved },
            { label: 'Day Streak',  value: `${streak}🔥` },
            { label: 'Active Days', value: activeDays },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-4 rounded-xl bg-dark-600/50 border border-white/5">
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* CF Handle section */}
        <div className="border-t border-white/5 pt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code2 size={15} className="text-brand-400" />
              <span className="text-sm font-semibold text-gray-300">Codeforces Handle</span>
            </div>
            {!editingCF && (
              <button onClick={() => setEditingCF(true)} className="btn-ghost text-xs gap-1.5">
                <Edit2 size={12} /> Edit
              </button>
            )}
          </div>

          {editingCF ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={cfHandle}
                onChange={e => setCfHandle(e.target.value)}
                placeholder="your_cf_handle"
                className="input-field flex-1 font-mono"
                onKeyDown={e => e.key === 'Enter' && saveCFHandle()}
              />
              <button onClick={saveCFHandle} disabled={saving} className="btn-primary px-4">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              </button>
              <button onClick={() => setEditingCF(false)} className="btn-ghost">Cancel</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {profile?.cfHandle ? (
                <span className="font-mono text-brand-300 text-sm bg-brand-500/10 border border-brand-500/20 px-3 py-2 rounded-lg">
                  {profile.cfHandle}
                </span>
              ) : (
                <span className="text-gray-500 text-sm italic">No handle connected</span>
              )}
            </div>
          )}

          {savedMsg && (
            <p className="flex items-center gap-1.5 text-xs text-brand-400 mt-2 animate-fade-in">
              <CheckCircle2 size={12} /> {savedMsg}
            </p>
          )}
        </div>
      </div>

      {/* CF Sync card */}
      <div className="glass p-6 border border-blue-500/15">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <RefreshCw size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Sync with Codeforces</h3>
            <p className="text-xs text-gray-500">Auto-detect and mark your solved problems</p>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing || !profile?.cfHandle}
          className="btn-primary w-full"
        >
          {syncing
            ? <><Loader2 size={15} className="animate-spin" /> Syncing...</>
            : <><RefreshCw size={15} /> Sync Now</>}
        </button>

        {!profile?.cfHandle && (
          <p className="text-xs text-gray-500 text-center mt-2">Connect your CF handle above to sync</p>
        )}

        {syncResult && (
          <div className="mt-4 p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 animate-fade-in">
            <p className="text-sm font-semibold text-brand-300 mb-2">✅ Sync Complete!</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <span>CF Handle: <span className="text-white font-mono">{syncResult.handle}</span></span>
              {syncResult.rating && <span>Rating: <span className="text-brand-300 font-bold">{syncResult.rating}</span></span>}
              <span>CF Total Solved: <span className="text-white font-semibold">{syncResult.totalCFSolved}</span></span>
              <span>Matched Here: <span className="text-brand-300 font-bold">{syncResult.matched}</span></span>
            </div>
          </div>
        )}

        {syncError && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-fade-in">
            <AlertCircle size={14} />
            {syncError}
          </div>
        )}
      </div>

      {/* Best topics */}
      {topicBests.some(t => t.pct > 0) && (
        <div className="glass p-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Your Best Topics</h3>
          <div className="space-y-3">
            {topicBests.filter(t => t.pct > 0).map(({ topic, pct }) => (
              <div key={topic}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{topic}</span>
                  <span className="text-gray-500">{pct}%</span>
                </div>
                <div className="h-1.5 bg-dark-500 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
