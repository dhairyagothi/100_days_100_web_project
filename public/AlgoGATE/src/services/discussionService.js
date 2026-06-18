// src/services/discussionService.js
import {
  collection, addDoc, getDocs, deleteDoc, doc,
  orderBy, query, serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export async function getDiscussions(questionId) {
  const q = query(
    collection(db, 'discussions', questionId, 'comments'),
    orderBy('createdAt', 'asc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeDiscussions(questionId, callback) {
  const q = query(
    collection(db, 'discussions', questionId, 'comments'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function postComment(questionId, userId, userName, content) {
  await addDoc(collection(db, 'discussions', questionId, 'comments'), {
    userId,
    userName,
    content,
    createdAt: serverTimestamp(),
  });
}

export async function deleteComment(questionId, commentId) {
  await deleteDoc(doc(db, 'discussions', questionId, 'comments', commentId));
}
