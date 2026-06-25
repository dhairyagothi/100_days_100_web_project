// =========================
// ELEMENTS
// =========================

const btn = document.querySelector(".talk");
const content = document.querySelector(".content");
const statusText = document.querySelector(".status-text");
const wave = document.querySelector(".wave-container");
const logoutBtn = document.getElementById("logoutBtn");

let recognition;

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

    const loggedIn =
        localStorage.getItem("loggedIn") === "true";

    const authContainer =
        document.getElementById("authContainer");

    const mainApp =
        document.getElementById("mainApp");

    if (authContainer && mainApp) {

        if (loggedIn) {

            authContainer.style.display = "none";
            mainApp.style.display = "flex";

            const user =
                JSON.parse(localStorage.getItem("user"));

            if (user?.username) {
                speak(`Welcome back ${user.username}`);
            }

        } else {

            authContainer.style.display = "flex";
            mainApp.style.display = "none";
        }
    }

    setTimeout(() => {
        wishMe();
    }, 1000);
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
}

function showLogin() {

    document.getElementById("signupBox").style.display =
        "none";

    document.getElementById("loginBox").style.display =
        "block";

    document.getElementById("forgotBox").style.display =
        "none";
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