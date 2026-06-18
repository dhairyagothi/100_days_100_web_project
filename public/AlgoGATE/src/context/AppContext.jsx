// src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { getProgress } from '../services/progressService';
import { getStarred } from '../services/progressService';
import { getActivity } from '../services/activityService';
import { computeStreak } from '../utils/streakEngine';
import { useAuth } from './AuthContext';
import { useCodeforcesSync } from '../hooks/useCodeforcesSync';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user, profile } = useAuth();
  const { syncIfStale, syncing: cfSyncing, lastSyncTime } = useCodeforcesSync();

  const [progress, setProgress]   = useState({});
  const [starred, setStarred]     = useState([]);
  const [activity, setActivity]   = useState({});
  const [dataLoading, setDataLoading] = useState(false);

  // Track whether we've already triggered an auto-sync this session
  const autoSyncFiredRef = useRef(false);

  // Apply theme class to <html> (forces dark mode exclusively)
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  // Load user data on login
  const loadUserData = useCallback(async () => {
    if (!user) {
      setProgress({});
      setStarred([]);
      setActivity({});
      return;
    }
    setDataLoading(true);
    try {
      const [p, s, a] = await Promise.all([
        getProgress(user.uid),
        getStarred(user.uid),
        getActivity(user.uid),
      ]);
      setProgress(p || {});
      setStarred(s || []);
      setActivity(a || {});
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // ── Auto-sync CF when user logs in (once per session, throttled to 10 min) ──
  useEffect(() => {
    if (!user || !profile?.cfHandle || autoSyncFiredRef.current) return;

    autoSyncFiredRef.current = true; // Only fire once per session

    // Run background sync, then refresh local data to show new completions
    syncIfStale(user.uid, profile.cfHandle, profile.lastSyncedAt)
      .then(result => {
        if (result && result.matched > 0) {
          // New problems were matched — reload progress & activity to reflect them
          loadUserData();
        }
      })
      .catch(err => console.error('[Auto-Sync]', err));
  }, [user, profile, syncIfStale, loadUserData]);

  // Reset the session guard when user logs out
  useEffect(() => {
    if (!user) {
      autoSyncFiredRef.current = false;
    }
  }, [user]);

  const streak = useMemo(() => computeStreak(activity), [activity]);

  const totalSolved = useMemo(() => {
    let count = 0;
    for (const topic of Object.values(progress)) {
      for (const level of Object.values(topic)) {
        count += level?.solved?.length || 0;
      }
    }
    return count;
  }, [progress]);

  return (
    <AppContext.Provider value={{
      progress, setProgress,
      starred, setStarred,
      activity, setActivity,
      streak,
      totalSolved,
      dataLoading,
      refreshData: loadUserData,
      // Expose CF sync state for Dashboard status badge
      cfSyncing,
      lastSyncTime,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
