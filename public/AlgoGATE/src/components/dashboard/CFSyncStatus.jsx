// src/components/dashboard/CFSyncStatus.jsx
import { RefreshCw, CheckCircle2, Wifi } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

function timeAgo(date) {
  if (!date) return null;
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60)  return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function CFSyncStatus() {
  const { cfSyncing, lastSyncTime } = useApp();
  const { profile } = useAuth();

  // Only show if user has a CF handle linked
  if (!profile?.cfHandle) return null;

  if (cfSyncing) {
    return (
      <div className="inline-flex items-center gap-1.5 text-[11px] text-blue-400 animate-pulse">
        <RefreshCw size={11} className="animate-spin" />
        <span>Syncing with Codeforces…</span>
      </div>
    );
  }

  const syncedAt = lastSyncTime || profile?.lastSyncedAt;
  const ago = timeAgo(syncedAt);

  if (!ago) {
    return (
      <div className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
        <Wifi size={11} />
        <span>CF: {profile.cfHandle}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] text-brand-500/80">
      <CheckCircle2 size={11} />
      <span>CF synced {ago}</span>
    </div>
  );
}
