// Authentication Component Handler
import { state, executeAuthLogin, executeAuthSignup, loginWithGoogleOAuth } from '../state.js';

export function initAuthComponent() {
  const screenAuth = document.getElementById('screen-auth');
  const formLogin = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const btnGoogle = document.getElementById('btn-google-login');
  const btnGoogleSignup = document.getElementById('btn-google-signup');
  
  const loginError = document.getElementById('login-error');
  const signupError = document.getElementById('signup-error');

  // Toggle Forms on Tab Clicks
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    formLogin.classList.add('active');
    formLogin.classList.remove('hidden');
    formSignup.classList.remove('active');
    formSignup.classList.add('hidden');
    loginError.classList.add('hidden');
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    formSignup.classList.add('active');
    formSignup.classList.remove('hidden');
    formLogin.classList.remove('active');
    formLogin.classList.add('hidden');
    signupError.classList.add('hidden');
  });

  // Login Submit Event
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const success = await executeAuthLogin(email, password);
      if (success) {
        formLogin.reset();
      }
    } catch (err) {
      loginError.textContent = err.message || 'Incorrect email or password.';
      loginError.classList.remove('hidden');
    }
  });

  // Signup Submit Event
  formSignup.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupError.classList.add('hidden');

    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    
    // Extract selected avatar value
    const selectedAvatar = document.querySelector('input[name="avatar"]:checked')?.value || '🦉';

    try {
      const success = await executeAuthSignup(username, email, password, selectedAvatar);
      if (success) {
        // Automatically login the newly created user
        await executeAuthLogin(email, password);
        formSignup.reset();
      }
    } catch (err) {
      signupError.textContent = err.message || 'Registration failed.';
      signupError.classList.remove('hidden');
    }
  });

  // Google OAuth Login Button Click
  btnGoogle.addEventListener('click', async () => {
    try {
      await loginWithGoogleOAuth();
    } catch (err) {
      loginError.textContent = 'Google sign-in failed: ' + err.message;
      loginError.classList.remove('hidden');
    }
  });

  // Google OAuth Signup Button Click
  btnGoogleSignup.addEventListener('click', async () => {
    try {
      await loginWithGoogleOAuth();
    } catch (err) {
      signupError.textContent = 'Google sign-up failed: ' + err.message;
      signupError.classList.remove('hidden');
    }
  });
}

// Reactively set up default tab state
export function renderAuthView() {
  const tabLogin = document.getElementById('tab-login');
  if (tabLogin && !tabLogin.classList.contains('active')) {
    tabLogin.click();
  }
}
