const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const statusText = document.querySelector('.status-text');
const wave = document.querySelector('.wave-container');
const logoutBtn = document.getElementById('logoutBtn');

let recognition;

function safe(el) {
  return el || { textContent: '' };
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
    speak('Good Morning Boss');
  } else if (hour < 17) {
    speak('Good Afternoon Boss');
  } else {
    speak('Good Evening Boss');
  }
}

window.addEventListener('load', () => {
  if (localStorage.getItem('loggedIn') === 'true') {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';

    const user = JSON.parse(localStorage.getItem('user'));

    if (user?.username) {
      speak(`Welcome back ${user.username}`);
    }
  } else {
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
  }

  wishMe();
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    safe(content).textContent = transcript;

    takeCommand(transcript.toLowerCase());
  };

  recognition.onerror = () => {
    safe(statusText).textContent = 'Speech recognition error';

    btn?.classList.remove('active');
    wave?.classList.remove('active');
  };

  recognition.onend = () => {
    btn?.classList.remove('active');
    wave?.classList.remove('active');

    safe(content).textContent = 'Click to Speak';

    safe(statusText).textContent = 'Idle';
  };

  btn?.addEventListener('click', () => {
    btn.classList.add('active');
    wave?.classList.add('active');

    safe(content).textContent = 'Listening...';

    safe(statusText).textContent = 'Listening...';

    recognition.start();
  });
} else {
  alert('Speech Recognition is not supported in this browser.');
}

function takeCommand(message) {
  if (message.includes('hello') || message.includes('hey')) {
    speak('Hello Boss, how can I help you?');
  } else if (message.includes('open google')) {
    window.open('https://google.com', '_blank');

    speak('Opening Google');
  } else if (message.includes('open youtube')) {
    window.open('https://youtube.com', '_blank');

    speak('Opening YouTube');
  } else if (message.includes('time')) {
    const time = new Date().toLocaleTimeString();

    speak(`The time is ${time}`);
  } else if (message.includes('date')) {
    const date = new Date().toDateString();

    speak(`Today's date is ${date}`);
  } else if (message.includes('logout')) {
    logout();
  } else {
    window.open(`https://www.google.com/search?q=${message}`, '_blank');

    speak('Searching on Google');
  }
}

function signup() {
  const username = document.getElementById('signupUsername').value.trim();

  const email = document.getElementById('signupEmail').value.trim();

  const password = document.getElementById('signupPassword').value.trim();

  if (!username || !email || !password) {
    document.getElementById('status').innerText = 'Please fill all fields';

    return;
  }

  const user = {
    username,
    email,
    password: btoa(password),
  };

  localStorage.setItem('user', JSON.stringify(user));

  document.getElementById('status').innerText = 'Signup successful';

  document.getElementById('signupUsername').value = '';
  document.getElementById('signupEmail').value = '';
  document.getElementById('signupPassword').value = '';

  setTimeout(() => {
    showLogin();

    document.getElementById('status').innerText = '';
  }, 1000);
}

function login() {
  const email = document.getElementById('loginEmail').value.trim();

  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    document.getElementById('status').innerText = 'Please fill all fields';

    return;
  }

  const user = JSON.parse(localStorage.getItem('user'));

  if (user && email === user.email && password === atob(user.password)) {
    localStorage.setItem('loggedIn', 'true');

    document.getElementById('authContainer').style.display = 'none';

    document.getElementById('mainApp').style.display = 'flex';

    document.getElementById('status').innerText = '';

    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';

    speak(`Welcome ${user.username}`);
  } else {
    document.getElementById('status').innerText = 'Invalid email or password';
  }
}

function logout() {
  localStorage.removeItem('loggedIn');

  document.getElementById('authContainer').style.display = 'flex';

  document.getElementById('mainApp').style.display = 'none';

  safe(content).textContent = 'Click to Speak';

  safe(statusText).textContent = 'Idle';

  btn?.classList.remove('active');
  wave?.classList.remove('active');

  speak('Logged out successfully');
}

logoutBtn?.addEventListener('click', logout);

function showForgot() {
  document.getElementById('signupBox').style.display = 'none';

  document.getElementById('loginBox').style.display = 'none';

  document.getElementById('forgotBox').style.display = 'block';

  document.getElementById('status').innerText = '';
}

function resetPassword() {
  const email = document.getElementById('forgotEmail').value.trim();

  const newPassword = document.getElementById('newPassword').value.trim();

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    document.getElementById('status').innerText = 'No user found';

    return;
  }

  if (user.email === email) {
    user.password = btoa(newPassword);

    localStorage.setItem('user', JSON.stringify(user));

    document.getElementById('status').innerText = 'Password reset successful';

    document.getElementById('forgotEmail').value = '';
    document.getElementById('newPassword').value = '';

    setTimeout(() => {
      showLogin();

      document.getElementById('status').innerText = '';
    }, 1000);
  } else {
    document.getElementById('status').innerText = 'Email not found';
  }
}

function showSignup() {
  document.getElementById('signupBox').style.display = 'block';

  document.getElementById('loginBox').style.display = 'none';

  document.getElementById('forgotBox').style.display = 'none';

  document.getElementById('status').innerText = '';
}

function showLogin() {
  document.getElementById('signupBox').style.display = 'none';

  document.getElementById('loginBox').style.display = 'block';

  document.getElementById('forgotBox').style.display = 'none';

  document.getElementById('status').innerText = '';
}
