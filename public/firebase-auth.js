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

      localStorage.setItem(
        "loggedInUserData",
        JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          provider: "google"
        })
      );

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

      localStorage.setItem(
        "loggedInUserData",
        JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          provider: "facebook"
        })
      );

      window.location.href = "../index.html";

    } catch (err) {
      console.error("Facebook Login Error:", err);
      alert(err.message);
    }
  });