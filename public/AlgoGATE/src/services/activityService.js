// src/services/activityService.js
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

function todayStr() {
  const d = new Date();
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export async function logActivity(userId) {
  const date = todayStr();
  const ref = doc(db, 'activity', userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, { dates: { [date]: 1 } });
  } else {
    const data = snap.data();
    const count = (data.dates?.[date] || 0) + 1;
    await updateDoc(ref, { [`dates.${date}`]: count });
  }
}

export async function getActivity(userId) {
  const snap = await getDoc(doc(db, 'activity', userId));
  if (!snap.exists()) return {};
  
  const data = snap.data();
  const dates = data.dates || {};
  const cfDates = data.cfDates || {};
  
  const combined = { ...dates };
  for (const [d, count] of Object.entries(cfDates)) {
    // Add CF solves to AlgoGATE solves for that day
    combined[d] = (combined[d] || 0) + count;
  }
  return combined;
}

export async function setCFActivity(userId, cfDates) {
  const ref = doc(db, 'activity', userId);
  await setDoc(ref, { cfDates }, { merge: true });
}
