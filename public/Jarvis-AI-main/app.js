

const btn = document.querySelector(".talk");
const content = document.querySelector(".content");
const statusText = document.querySelector(".status-text");
const wave = document.querySelector(".wave-container");
const logoutBtn = document.getElementById("logoutBtn");

let recognition;

function safe(el) {
  return el || { textContent: "" };
}


function speak(text) {
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 1;
  utterance.volume = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

function wishMe() {
  const hour = new Date().getHours();

  if (hour < 12) {
    speak("Good Morning Boss");
  }

  else if (hour < 17) {
    speak("Good Afternoon Boss");
  }

  else {
    speak("Good Evening Boss");
  }
}


window.addEventListener("load", () => {

  // LOGIN CHECK
  if (localStorage.getItem("loggedIn") === "true") {

    document.getElementById("authContainer").style.display = "none";
    document.getElementById("mainApp").style.display = "flex";

    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.username) {
      speak(`Welcome back ${user.username}`);
    }

  } else {

    document.getElementById("authContainer").style.display = "flex";
    document.getElementById("mainApp").style.display = "none";

  }

  wishMe();
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {

  recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;

 
  recognition.onresult = (event) => {

    const transcript =
      event.results[0][0].transcript;

    safe(content).textContent = transcript;

    takeCommand(transcript.toLowerCase());
  };

 
  recognition.onerror = () => {

    safe(statusText).textContent =
      "Speech recognition error";

    btn?.classList.remove("active");
    wave?.classList.remove("active");
  };

 
  recognition.onend = () => {

    btn?.classList.remove("active");
    wave?.classList.remove("active");

    safe(content).textContent =
      "Click to Speak";

    safe(statusText).textContent =
      "Idle";
  };

 
  btn?.addEventListener("click", () => {

    btn.classList.add("active");
    wave?.classList.add("active");

    safe(content).textContent =
      "Listening...";

    safe(statusText).textContent =
      "Listening...";

    recognition.start();
  });

} else {

  alert("Speech Recognition is not supported in this browser.");

}


function takeCommand(message) {

  if (
    message.includes("hello") ||
    message.includes("hey")
  ) {

    speak("Hello Boss, how can I help you?");

  }

  
  else if (message.includes("open google")) {

    window.open("https://google.com", "_blank");

    speak("Opening Google");

  }

  
  else if (message.includes("open youtube")) {

    window.open("https://youtube.com", "_blank");

    speak("Opening YouTube");

  }

 
  else if (message.includes("time")) {

    const time =
      new Date().toLocaleTimeString();

    speak(`The time is ${time}`);

  }

 
  else if (message.includes("date")) {

    const date =
      new Date().toDateString();

    speak(`Today's date is ${date}`);

  }

  
  else if (message.includes("logout")) {

    logout();

  }

  
  else {

    window.open(
      `https://www.google.com/search?q=${message}`,
      "_blank"
    );

    speak("Searching on Google");

  }
}

function signup() {

  const username =
    document.getElementById("signupUsername").value.trim();

  const email =
    document.getElementById("signupEmail").value.trim();

  const password =
    document.getElementById("signupPassword").value.trim();

  if (!username || !email || !password) {

    document.getElementById("status").innerText =
      "Please fill all fields";

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

  document.getElementById("status").innerText =
    "Signup successful";

  
  document.getElementById("signupUsername").value = "";
  document.getElementById("signupEmail").value = "";
  document.getElementById("signupPassword").value = "";

  
  setTimeout(() => {

    showLogin();

    document.getElementById("status").innerText =
      "";

  }, 1000);
}


function login() {

  const email =
    document.getElementById("loginEmail").value.trim();

  const password =
    document.getElementById("loginPassword").value.trim();

  if (!email || !password) {

    document.getElementById("status").innerText =
      "Please fill all fields";

    return;
  }

  const user =
    JSON.parse(localStorage.getItem("user"));

  
  if (
    user &&
    email === user.email &&
    password === atob(user.password)
  ) {

    localStorage.setItem("loggedIn", "true");

    document.getElementById("authContainer").style.display =
      "none";

    document.getElementById("mainApp").style.display =
      "flex";

    document.getElementById("status").innerText =
      "";

  
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    speak(`Welcome ${user.username}`);

  } else {

    document.getElementById("status").innerText =
      "Invalid email or password";

  }
}

function logout() {

  localStorage.removeItem("loggedIn");

  document.getElementById("authContainer").style.display =
    "flex";

  document.getElementById("mainApp").style.display =
    "none";

  
  safe(content).textContent =
    "Click to Speak";

  safe(statusText).textContent =
    "Idle";

  btn?.classList.remove("active");
  wave?.classList.remove("active");

  speak("Logged out successfully");
}


logoutBtn?.addEventListener("click", logout);


function showForgot() {

  document.getElementById("signupBox").style.display =
    "none";

  document.getElementById("loginBox").style.display =
    "none";

  document.getElementById("forgotBox").style.display =
    "block";

  document.getElementById("status").innerText =
    "";
}

function resetPassword() {

  const email =
    document.getElementById("forgotEmail").value.trim();

  const newPassword =
    document.getElementById("newPassword").value.trim();

  const user =
    JSON.parse(localStorage.getItem("user"));

  if (!user) {

    document.getElementById("status").innerText =
      "No user found";

    return;
  }

  if (user.email === email) {

    user.password = btoa(newPassword);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    document.getElementById("status").innerText =
      "Password reset successful";

  
    document.getElementById("forgotEmail").value = "";
    document.getElementById("newPassword").value = "";

    setTimeout(() => {

      showLogin();

      document.getElementById("status").innerText =
        "";

    }, 1000);

  } else {

    document.getElementById("status").innerText =
      "Email not found";

  }
}


function showSignup() {

  document.getElementById("signupBox").style.display =
    "block";

  document.getElementById("loginBox").style.display =
    "none";

  document.getElementById("forgotBox").style.display =
    "none";

  document.getElementById("status").innerText =
    "";
}

function showLogin() {

  document.getElementById("signupBox").style.display =
    "none";

  document.getElementById("loginBox").style.display =
    "block";

  document.getElementById("forgotBox").style.display =
    "none";

  document.getElementById("status").innerText =
    "";
}

const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const status = document.querySelector('.status-text');
const wave =document.querySelector('.wave-container');
function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    status.textContent = "Speech Recognition not supported";
} else {
    const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    btn.classList.add('active');
    wave.classList.add('active');
    content.textContent = "Listening...";
    status.textContent ="Jarvis is listening";
    recognition.start();
});
}

recognition.onend = () => {
    btn.classList.remove('active');
    wave.classList.remove('active');
    content.textContent ="Click here to speak";
    status.textContent ="Idle";
};

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}

particlesJS("particles-js", {

    particles: {
        number: {value: 45,density: {enable: true,value_area: 800}},
        color: {value: "#00bcd4"},
        shape: {type: "circle"},
        opacity: {value: 0.25},
        size: { value: 2},
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
            onhover: {enable: false},
            resize: true
        }
    },
    retina_detect: true
});


const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const typingText = document.getElementById('typing-text');
const status = document.querySelector('.status-text');
const wave =document.querySelector('.wave-container');
function speak(text) {

    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {

    const hour = new Date().getHours();

    if (hour >= 0 && hour < 12) {

        speak("Good Morning Boss");

    } else if (hour >= 12 && hour < 17) {

        speak("Good Afternoon Boss");

    } else {

        speak("Good Evening Boss");
    }
}



window.addEventListener('load', () => {

    speak("Initializing JARVIS");

    typingAnimation();

    setTimeout(() => {
        wishMe();
    }, 2000);
});


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    status.textContent = "Speech Recognition not supported";
} else {
    const recognition = new SpeechRecognition();



const messages = [
    "Initializing JARVIS...",
    "AI Assistant Activated...",
    "Listening for your commands...",
    "Ready to assist you..."
];

let messageIndex = 0;
let charIndex = 0;

function typingAnimation() {

    if (!typingText) return;

    typingText.textContent =
        messages[messageIndex].slice(0, charIndex++);

    if (charIndex > messages[messageIndex].length) {

        charIndex = 0;

        messageIndex++;

        if (messageIndex >= messages.length) {
            messageIndex = 0;
        }
    }

    setTimeout(typingAnimation, 120);
}

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.onresult = (event) => {

    const currentIndex = event.resultIndex;

    const transcript =
        event.results[currentIndex][0].transcript;

    content.textContent = transcript;

    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {


    content.textContent = "Listening...";

    btn.classList.add('active');

if (wave) {
    wave.classList.add('active');
}

content.textContent = "Listening...";

if (status) {
    status.textContent = "Jarvis is listening";
}

recognition.start();

speak("Listening");
    speak("Listening");
});
}

recognition.onend = () => {
    btn.classList.remove('active');
    wave.classList.remove('active');
    content.textContent ="Click here to speak";
    status.textContent ="Idle";
};

function takeCommand(message) {

    btn.classList.remove("active");

    if (
        message.includes('hey') ||
        message.includes('hello')
    ) {

        speak("Hello Boss, How May I Help You?");

        content.textContent = "Hello Boss";

    }

    else if (message.includes("open google")) {

        window.open("https://google.com", "_blank");

        speak("Opening Google");

    }

    else if (message.includes("open youtube")) {

        window.open("https://youtube.com", "_blank");

        speak("Opening YouTube");

    }

    else if (message.includes("open facebook")) {

        window.open("https://facebook.com", "_blank");

        speak("Opening Facebook");

    }

    else if (
        message.includes('what is') ||
        message.includes('who is') ||
        message.includes('what are')
    ) {

        window.open(
            `https://www.google.com/search?q=${message}`,
            "_blank"
        );

        speak(
            "Here is what I found on the internet regarding " +
            message
        );
    }

    else if (message.includes('wikipedia')) {

        window.open(
            `https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`,
            "_blank"
        );

        speak("Opening Wikipedia");
    }

    else if (message.includes('time')) {

        const time = new Date().toLocaleString(
            undefined,
            {
                hour: "numeric",
                minute: "numeric"
            }
        );

        speak("The current time is " + time);

    }

    else if (message.includes('date')) {

        const date = new Date().toLocaleString(
            undefined,
            {
                month: "short",
                day: "numeric"
            }
        );

        speak("Today's date is " + date);

    }

    else if (message.includes('calculator')) {

        speak("Opening Calculator");

        window.open('Calculator:///');

    }

    else {

        window.open(
            `https://www.google.com/search?q=${message}`,
            "_blank"
        );

        speak(
            "I found some information for " + message
        );
    }
}

particlesJS("particles-js", {

    particles: {
        number: {value: 45,density: {enable: true,value_area: 800}},
        color: {value: "#00bcd4"},
        shape: {type: "circle"},
        opacity: {value: 0.25},
        size: { value: 2},
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
            onhover: {enable: false},
            resize: true
        }
    },
    retina_detect: true
 = document.querySelector('.talk');
const content = document.querySelector('.content');
const status = document.querySelector('.status-text');
const wave =document.querySelector('.wave-container');
function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    status.textContent = "Speech Recognition not supported";
} else {
    const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    btn.classList.add('active');
    wave.classList.add('active');
    content.textContent = "Listening...";
    status.textContent ="Jarvis is listening";
    recognition.start();
});
}

recognition.onend = () => {
    btn.classList.remove('active');
    wave.classList.remove('active');
    content.textContent ="Click here to speak";
    status.textContent ="Idle";
};

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        const finalText = "The current time is " + time;
        speak(finalText);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        const finalText = "Today's date is " + date;
        speak(finalText);
    } else if (message.includes('calculator')) {
        window.open('Calculator:///');
        const finalText = "Opening Calculator";
        speak(finalText);
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on Google";
        speak(finalText);
    }
}

particlesJS("particles-js", {

    particles: {
        number: {value: 45,density: {enable: true,value_area: 800}},
        color: {value: "#00bcd4"},
        shape: {type: "circle"},
        opacity: {value: 0.25},
        size: { value: 2},
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
            onhover: {enable: false},
            resize: true
        }
    },
    retina_detect: true
});

