// src/hooks/useCodeforcesSync.js
import { useState, useCallback, useRef } from 'react';
import { getCFUserInfo, getCFSubmissions, extractSolvedProblems, extractCFActivity } from '../services/codeforcesService';
import { bulkMarkSolved } from '../services/progressService';
import { setCFActivity } from '../services/activityService';
import { updateCFHandle, updateUserRating, updateLastSynced } from '../services/authService';
import { ALL_QUESTIONS } from '../utils/questionData';

const SYNC_THROTTLE_MS = 10 * 60 * 1000; // 10 minutes

export function useCodeforcesSync() {
  const [syncing, setSyncing]       = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [error, setError]           = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Prevents double-trigger within the same session
  const inProgressRef = useRef(false);

  // Core sync logic (shared between manual and auto)
  const runSync = useCallback(async (userId, handle, options = {}) => {
    const { silent = false } = options;

    if (inProgressRef.current) return; // already running
    inProgressRef.current = true;

    if (!silent) {
      setSyncing(true);
      setError(null);
      setSyncResult(null);
    } else {
      setSyncing(true);
    }

    try {
      // 1. Validate handle & get rating
      const userInfo = await getCFUserInfo(handle);
      await updateCFHandle(userId, handle);
      if (userInfo.rating) await updateUserRating(userId, userInfo.rating);

      // 2. Fetch all submissions
      const submissions = await getCFSubmissions(handle);
      const cfSolved    = extractSolvedProblems(submissions);
      const cfDates     = extractCFActivity(submissions);

      // 3. Build CF solved set for fast lookup
      const cfSolvedIds = new Set(cfSolved.map(p => p.id));

      // 4. Match against AlgoGATE question DB
      const matchedQuestions = [];
      for (const question of ALL_QUESTIONS) {
        const cfId = `${question.contestId}-${question.index}`;
        if (cfSolvedIds.has(cfId)) {
          matchedQuestions.push(question);
        }
      }

      // 5. Write to Firebase
      if (matchedQuestions.length > 0) {
        await bulkMarkSolved(userId, matchedQuestions);
      }
      await setCFActivity(userId, cfDates);

      // 6. Stamp last-synced time
      await updateLastSynced(userId);
      const now = new Date();
      setLastSyncTime(now);

      if (!silent) {
        setSyncResult({
          handle,
          rating: userInfo.rating,
          totalCFSolved: cfSolved.length,
          matched: matchedQuestions.length,
        });
      }

      return { matched: matchedQuestions.length, totalCFSolved: cfSolved.length };
    } catch (err) {
      if (!silent) setError(err.message || 'Sync failed');
      console.error('[CF Sync Error]', err);
      return null;
    } finally {
      setSyncing(false);
      inProgressRef.current = false;
    }
  }, []);

  // Manual sync — called by "Sync Now" button on Profile page
  const sync = useCallback(async (userId, handle) => {
    return runSync(userId, handle, { silent: false });
  }, [runSync]);

  // Auto sync — called by AppContext on login; skips if recently synced
  const syncIfStale = useCallback(async (userId, handle, lastSyncedAt) => {
    if (!handle || !userId) return;

    // Throttle check: is the stored lastSyncedAt within the last 10 minutes?
    if (lastSyncedAt) {
      const lastSynced = new Date(lastSyncedAt).getTime();
      const timeSince  = Date.now() - lastSynced;
      if (timeSince < SYNC_THROTTLE_MS) {
        console.log(`[CF Auto-Sync] Skipping — last synced ${Math.round(timeSince / 60000)} min ago`);
        return;
      }
    }

    console.log('[CF Auto-Sync] Running background sync for', handle);
    return runSync(userId, handle, { silent: true });
  }, [runSync]);

  return { sync, syncIfStale, syncing, syncResult, error, lastSyncTime };
}
