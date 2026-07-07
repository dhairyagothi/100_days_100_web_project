// =========================
// ELEMENTS
// =========================

const btn = document.querySelector(".talk");
const content = document.querySelector(".content");
const statusText = document.querySelector(".status-text");
const wave = document.querySelector(".wave-container");
const logoutBtn = document.getElementById("logoutBtn");

let recognition;

// Holds the initialized Google OAuth2 token client
let googleTokenClient = null;

// =========================
// SPEAK FUNCTION
// =========================

function speak(text) {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 1;
    utterance.volume = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
}

// =========================
// GREETING
// =========================

function wishMe() {
    const hour = new Date().getHours();

    if (hour < 12) {
        speak("Good Morning Boss");
    } else if (hour < 17) {
        speak("Good Afternoon Boss");
    } else {
        speak("Good Evening Boss");
    }
}

// =========================
// PAGE LOAD
// =========================

window.addEventListener("load", () => {

    // Check regular login (localStorage) OR Google session (sessionStorage)
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const googleSession = JSON.parse(sessionStorage.getItem("jarvisGoogleUser") || "null");
    const isAuthenticated = loggedIn || googleSession !== null;

    const authContainer = document.getElementById("authContainer");
    const mainApp = document.getElementById("mainApp");

    if (authContainer && mainApp) {

        if (isAuthenticated) {

            authContainer.style.display = "none";
            mainApp.style.display = "flex";

            // Resolve the display name — prefer Google session name
            const googleUser = googleSession;
            const localUser = JSON.parse(localStorage.getItem("user") || "null");
            const displayName = googleUser?.name || localUser?.username || null;

            // Speak time-of-day greeting then welcome by name
            setTimeout(() => { wishMe(); }, 500);

            if (displayName) {
                setTimeout(() => {
                    speak(`Welcome back ${displayName}`);
                }, 1800);
            }

        } else {

            authContainer.style.display = "flex";
            mainApp.style.display = "none";

            // Default to signup tab highlighted
            document.getElementById("toggleSignup")?.classList.add("active-tab");

            // No voice on auth screen
        }
    }

    // Pre-initialise the Google OAuth2 token client so it is ready
    // the moment the user clicks "Continue with Google"
    initGoogleAuth();
});

// =========================
// SPEECH RECOGNITION
// =========================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {

        const transcript =
            event.results[0][0].transcript;

        if (content) {
            content.textContent = transcript;
        }

        takeCommand(transcript.toLowerCase());
    };

    recognition.onerror = () => {

        if (statusText) {
            statusText.textContent =
                "Speech Recognition Error";
        }

        btn?.classList.remove("active");
        wave?.classList.remove("active");
    };

    recognition.onend = () => {

        btn?.classList.remove("active");
        wave?.classList.remove("active");

        if (content) {
            content.textContent =
                "Click to Speak";
        }

        if (statusText) {
            statusText.textContent =
                "Idle";
        }
    };

    btn?.addEventListener("click", () => {

        btn.classList.add("active");
        wave?.classList.add("active");

        if (content) {
            content.textContent =
                "Listening...";
        }

        if (statusText) {
            statusText.textContent =
                "Listening...";
        }

        recognition.start();
    });

} else {

    console.error(
        "Speech Recognition not supported"
    );
}

// =========================
// COMMANDS
// =========================

function takeCommand(message) {

    if (
        message.includes("hello") ||
        message.includes("hey")
    ) {

        speak("Hello Boss, how can I help you?");

    }

    else if (
        message.includes("open google")
    ) {

        window.open(
            "https://google.com",
            "_blank"
        );

        speak("Opening Google");
    }

    else if (
        message.includes("open youtube")
    ) {

        window.open(
            "https://youtube.com",
            "_blank"
        );

        speak("Opening YouTube");
    }

    else if (
        message.includes("open facebook")
    ) {

        window.open(
            "https://facebook.com",
            "_blank"
        );

        speak("Opening Facebook");
    }

    else if (
        message.includes("wikipedia")
    ) {

        const query =
            message.replace("wikipedia", "").trim();

        window.open(
            `https://en.wikipedia.org/wiki/${query}`,
            "_blank"
        );

        speak("Opening Wikipedia");
    }

    else if (
        message.includes("time")
    ) {

        const time =
            new Date().toLocaleTimeString();

        speak(`The time is ${time}`);
    }

    else if (
        message.includes("date")
    ) {

        const date =
            new Date().toDateString();

        speak(`Today's date is ${date}`);
    }

    else if (
        message.includes("logout")
    ) {

        logout();
    }

    else {

        window.open(
            `https://www.google.com/search?q=${encodeURIComponent(message)}`,
            "_blank"
        );

        speak("Searching on Google");
    }
}

// =========================
// SIGNUP
// =========================

function signup() {

    const username =
        document.getElementById("signupUsername")?.value.trim();

    const email =
        document.getElementById("signupEmail")?.value.trim();

    const password =
        document.getElementById("signupPassword")?.value.trim();

    if (!username || !email || !password) {

        alert("Please fill all fields");
        return;
    }

    const user = {
        username,
        email,
        password: btoa(password)
    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    alert("Signup Successful");

    showLogin();
}

// =========================
// LOGIN
// =========================

function login() {

    const email =
        document.getElementById("loginEmail")?.value.trim();

    const password =
        document.getElementById("loginPassword")?.value.trim();

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (
        user &&
        email === user.email &&
        password === atob(user.password)
    ) {

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        speak(`Welcome ${user.username}`);

        location.reload();

    } else {

        alert("Invalid Email or Password");
    }
}

// =========================
// LOGOUT
// =========================

function logout() {

    localStorage.removeItem("loggedIn");

    // Clear the temporary Google session too
    sessionStorage.removeItem("jarvisGoogleUser");

    speak("Logged out successfully");

    location.reload();
}

// =========================
// FORGOT PASSWORD
// =========================

function resetPassword() {

    const email =
        document.getElementById("forgotEmail")?.value.trim();

    const newPassword =
        document.getElementById("newPassword")?.value.trim();

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("No User Found");
        return;
    }

    if (user.email === email) {

        user.password = btoa(newPassword);

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        alert("Password Reset Successful");

        showLogin();

    } else {

        alert("Email Not Found");
    }
}

// =========================
// UI SWITCHING
// =========================

function showSignup() {

    document.getElementById("signupBox").style.display =
        "block";

    document.getElementById("loginBox").style.display =
        "none";

    document.getElementById("forgotBox").style.display =
        "none";

    // Highlight active tab
    document.getElementById("toggleSignup")?.classList.add("active-tab");
    document.getElementById("toggleLogin")?.classList.remove("active-tab");
}

function showLogin() {

    document.getElementById("signupBox").style.display =
        "none";

    document.getElementById("loginBox").style.display =
        "block";

    document.getElementById("forgotBox").style.display =
        "none";

    // Highlight active tab
    document.getElementById("toggleLogin")?.classList.add("active-tab");
    document.getElementById("toggleSignup")?.classList.remove("active-tab");
}

function showForgot() {

    document.getElementById("signupBox").style.display =
        "none";

    document.getElementById("loginBox").style.display =
        "none";

    document.getElementById("forgotBox").style.display =
        "block";
}

// =========================
// GOOGLE AUTH
// =========================

// ── Step 1: Initialise the token client once (called on page load) ──────────
// Replace the placeholder below with your real OAuth 2.0 Client ID from
// https://console.cloud.google.com/  →  APIs & Services  →  Credentials
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

function initGoogleAuth() {

    // Detect a placeholder / unconfigured Client ID via pattern:
    // A real ID looks like  "digits-alphanumeric.apps.googleusercontent.com"
    const isPlaceholder = !GOOGLE_CLIENT_ID ||
        GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com" ||
        !/^\d+-.+\.apps\.googleusercontent\.com$/.test(GOOGLE_CLIENT_ID);

    if (typeof google === "undefined" || !google.accounts || isPlaceholder) {
        // GIS not loaded or Client ID not configured — skip silently
        return;
    }

    googleTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/userinfo.profile "
            + "https://www.googleapis.com/auth/userinfo.email",
        callback: handleGoogleToken
    });
}

// ── Step 2: Token callback — runs after Google popup is approved ─────────────
function handleGoogleToken(tokenResponse) {

    if (!tokenResponse.access_token) return;

    // Fetch the user's name & email from Google's userinfo endpoint
    fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
    )
        .then(res => res.json())
        .then(profile => {

            // ── Store only what we need, temporarily in sessionStorage ──
            // sessionStorage lives for the current browser tab session only.
            // It is automatically cleared when the tab is closed — no
            // persistent personal data is written to localStorage.
            const tempUser = {
                name: profile.name,
                email: profile.email,
                picture: profile.picture,
                provider: "google"
            };
            sessionStorage.setItem("jarvisGoogleUser", JSON.stringify(tempUser));

            // ── Transition to main app without a page reload ─────────────
            document.getElementById("authContainer").style.display = "none";
            document.getElementById("mainApp").style.display = "flex";

            // ── Jarvis speaks the name fetched from the Google token ──────
            setTimeout(() => { wishMe(); }, 400);
            setTimeout(() => {
                speak(`Hello ${profile.name}. I am Jarvis, your virtual assistant.`);
            }, 1600);
        })
        .catch(() => {
            alert("Google sign-in failed. Please try again.");
        });
}

// ── Step 3: Button click handler ─────────────────────────────────────────────
function googleAuth() {

    if (googleTokenClient) {
        // Real GIS flow — opens the Google account picker popup
        googleTokenClient.requestAccessToken();

    } else {
        // Client ID not configured — show a clear message instead of
        // silently faking a login
        const statusEl = document.getElementById("status");
        if (statusEl) {
            statusEl.textContent =
                "⚠️ Google Client ID not configured. See app.js → GOOGLE_CLIENT_ID.";
            statusEl.style.color = "#f87171";
        } else {
            alert("Google sign-in requires a valid Client ID.\nSee GOOGLE_CLIENT_ID in app.js.");
        }
    }
}

// =========================
// LOGOUT BUTTON
// =========================

logoutBtn?.addEventListener(
    "click",
    logout
);

// =========================
// PARTICLES
// =========================

if (
    typeof particlesJS !== "undefined" &&
    document.getElementById("particles-js")
) {

    particlesJS("particles-js", {

        particles: {

            number: {
                value: 45,
                density: {
                    enable: true,
                    value_area: 800
                }
            },

            color: {
                value: "#00bcd4"
            },

            shape: {
                type: "circle"
            },

            opacity: {
                value: 0.25
            },

            size: {
                value: 2
            },

            line_linked: {
                enable: true,
                distance: 140,
                color: "#00bcd4",
                opacity: 0.08,
                width: 1
            },

            move: {
                enable: true,
                speed: 0.4
            }
        },

        interactivity: {

            detect_on: "canvas",

            events: {
                onhover: {
                    enable: false
                },
                resize: true
            }
        },

        retina_detect: true
    });
}