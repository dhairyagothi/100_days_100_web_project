// src/services/authService.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export async function signUp(email, password, name) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, 'users', cred.user.uid), {
    id: cred.user.uid,
    name,
    email,
    cfHandle: '',
    rating: null,
    createdAt: serverTimestamp(),
  });
  return cred.user;
}

export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateCFHandle(uid, cfHandle) {
  await updateDoc(doc(db, 'users', uid), { cfHandle });
}

export async function updateUserRating(uid, rating) {
  await updateDoc(doc(db, 'users', uid), { rating });
}

export async function updateLastSynced(uid) {
  await updateDoc(doc(db, 'users', uid), { lastSyncedAt: new Date().toISOString() });
}
