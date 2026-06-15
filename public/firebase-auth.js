import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: window.__FIREBASE_API_KEY__ || "AIzaSyBldpQw5FhPd5idzykQPhbapP3u3o7vlLU",
  authDomain: window.__FIREBASE_AUTH_DOMAIN__ || "days-100-projects.firebaseapp.com",
  projectId: window.__FIREBASE_PROJECT_ID__ || "days-100-projects",
  storageBucket: window.__FIREBASE_STORAGE_BUCKET__ || "days-100-projects.firebasestorage.app",
  messagingSenderId: window.__FIREBASE_SENDER_ID__ || "709830635202",
  appId: window.__FIREBASE_APP_ID__ || "1:709830635202:web:7cd897b945b94ec096155b",
  measurementId: window.__FIREBASE_MEASUREMENT_ID__ || "G-NNM6BQK27H"
};

// For production, inject these values via window.__FIREBASE_*__ globals

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

function getAuthContext() {
  return /SignUp\.html$/i.test(window.location.pathname) ? "signup" : "login";
}

function getFallbackName(user) {
  const explicitName = String(user?.name || user?.username || "").trim();
  if (explicitName) return explicitName;

  const displayName = String(user?.displayName || "").trim();
  if (displayName) return displayName;

  const email = String(user?.email || "").trim();
  if (email) return email.split("@")[0] || email;

  return "there";
}

function persistAuthSession(user, provider, authAction) {
  const name = getFallbackName(user);
  const session = {
    uid: user?.uid || "",
    username: user?.username || name,
    name,
    email: user?.email || "",
    photo: user?.photoURL || "",
    provider,
    authAction,
    loginTime: Date.now(),
    timezone: "Asia/Kolkata",
  };

  if (session.username) {
    localStorage.setItem("loggedInUser", session.username);
  }

  localStorage.setItem("loggedInUserData", JSON.stringify(session));
  return session;
}

window.AuthSession = {
  getAuthContext,
  getFallbackName,
  persistAuthSession,
};


// ================= GOOGLE LOGIN =================

document
  .getElementById("googleLogin")
  ?.addEventListener("click", async () => {

    try {

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      const user = result.user;

      persistAuthSession(user, "google", getAuthContext());

      window.location.href = "../index.html";

    } catch (err) {
      console.error("Google Login Error:", err);
      alert(err.message);
    }
  });


// ================= FACEBOOK LOGIN =================

document
  .getElementById("facebookLogin")
  ?.addEventListener("click", async () => {

    try {

      const result = await signInWithPopup(
        auth,
        facebookProvider
      );

      const user = result.user;

      persistAuthSession(user, "facebook", getAuthContext());

      window.location.href = "../index.html";

    } catch (err) {
      console.error("Facebook Login Error:", err);
      alert(err.message);
    }
  });