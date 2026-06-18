// src/services/progressService.js
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';

/* ── Progress ─────────────────────────────────────────── */
export async function getProgress(userId) {
  const snap = await getDoc(doc(db, 'progress', userId));
  if (!snap.exists()) return {};

  const data = snap.data();
  // Self-healing: Ensure runtime state strips padding bugs instantly
  for (const topicKey in data) {
    for (const levelKey in data[topicKey]) {
      const arr = data[topicKey][levelKey]?.solved;
      if (Array.isArray(arr)) {
        data[topicKey][levelKey].solved = [...new Set(arr.map(id => id.trim()))];
      }
    }
  }
  return data;
}

export async function markSolved(userId, topic, level, questionId) {
  const ref = doc(db, 'progress', userId);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};

  const topicData = data[topic] || {};
  const levelData = topicData[level] || { solved: [] };

  if (!levelData.solved.includes(questionId)) {
    const updated = {
      ...data,
      [topic]: {
        ...topicData,
        [level]: {
          solved: [...levelData.solved, questionId],
          lastUpdated: new Date().toISOString(),
        },
      },
    };
    await setDoc(ref, updated, { merge: true });
  }
}

export async function bulkMarkSolved(userId, matchedQuestions) {
  if (matchedQuestions.length === 0) return;
  
  const ref = doc(db, 'progress', userId);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};

  let hasUpdates = false;

  // Self-healing: Strip whitespace and remove duplicate IDs from padding bug
  for (const topicKey in data) {
    for (const levelKey in data[topicKey]) {
      const arr = data[topicKey][levelKey]?.solved;
      if (Array.isArray(arr)) {
        const cleaned = arr.map(id => id.trim());
        const unique = [...new Set(cleaned)];
        if (unique.length !== arr.length || cleaned.some((id, i) => id !== arr[i])) {
          data[topicKey][levelKey].solved = unique;
          hasUpdates = true;
        }
      }
    }
  }

  for (const q of matchedQuestions) {
    if (!data[q.topic]) data[q.topic] = {};
    if (!data[q.topic][q.difficulty]) data[q.topic][q.difficulty] = { solved: [] };

    if (!data[q.topic][q.difficulty].solved.includes(q.id)) {
      data[q.topic][q.difficulty].solved.push(q.id);
      data[q.topic][q.difficulty].lastUpdated = new Date().toISOString();
      hasUpdates = true;
    }
  }

  if (hasUpdates) {
    await setDoc(ref, data, { merge: true });
  }
}

export async function markUnsolved(userId, topic, level, questionId) {
  const ref = doc(db, 'progress', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const topicData = data[topic] || {};
  const levelData = topicData[level] || { solved: [] };
  const updated = {
    ...data,
    [topic]: {
      ...topicData,
      [level]: {
        solved: levelData.solved.filter(id => id !== questionId),
        lastUpdated: new Date().toISOString(),
      },
    },
  };
  await setDoc(ref, updated, { merge: true });
}

/* ── Starred questions ────────────────────────────────── */
export async function getStarred(userId) {
  const snap = await getDoc(doc(db, 'starred', userId));
  return snap.exists() ? (snap.data().questions || []) : [];
}

export async function starQuestion(userId, questionId) {
  const ref = doc(db, 'starred', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { questions: [questionId] });
  } else {
    await updateDoc(ref, { questions: arrayUnion(questionId) });
  }
}

export async function unstarQuestion(userId, questionId) {
  const ref = doc(db, 'starred', userId);
  await updateDoc(ref, { questions: arrayRemove(questionId) });
}
