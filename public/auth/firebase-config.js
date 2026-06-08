import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

function getFirebaseConfig() {
  const config = {
    apiKey: window.FIREBASE_API_KEY || import.meta.env?.VITE_FIREBASE_API_KEY,
    authDomain: window.FIREBASE_AUTH_DOMAIN || import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: window.FIREBASE_PROJECT_ID || import.meta.env?.VITE_FIREBASE_PROJECT_ID,
    storageBucket: window.FIREBASE_STORAGE_BUCKET || import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: window.FIREBASE_APP_ID || import.meta.env?.VITE_FIREBASE_APP_ID,
    measurementId: window.FIREBASE_MEASUREMENT_ID || import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const missing = Object.entries(config)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    console.warn(
      `Firebase config missing: ${missing.join(", ")}. ` +
        "Set environment variables or define window.FIREBASE_* properties."
    );
    return null;
  }

  return config;
}

const firebaseConfig = getFirebaseConfig();

let app = null;
let auth = null;

if (firebaseConfig) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

export { app, auth, firebaseConfig };

export async function signInWithGoogle() {
  if (!auth) {
    throw new Error("Firebase not configured. Check your environment variables.");
  }
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  localStorage.setItem(
    "loggedInUserData",
    JSON.stringify({
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      provider: "google",
    })
  );

  localStorage.setItem("loggedInUser", user.displayName || user.email);

  return user;
}
