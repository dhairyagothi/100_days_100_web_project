const OAUTH_ERROR_MESSAGES = {
  oauth_failed: 'Sign-in was cancelled or failed. Please try again.',
  oauth_google: 'Google sign-in failed. Check your OAuth credentials and redirect URI.',
  oauth_github: 'GitHub sign-in failed. Check your OAuth credentials and redirect URI.',
  oauth_google_disabled: 'Google sign-in is not configured on this server.',
  oauth_github_disabled: 'GitHub sign-in is not configured on this server.',
};

function showAuthMessage(message, type = 'error') {
  let box = document.getElementById('authMessage');
  if (!box) return;

  box.textContent = message;
  box.className = `auth-message auth-message--${type}`;
  box.hidden = false;
}

function hideAuthMessage() {
  const box = document.getElementById('authMessage');
  if (box) {
    box.hidden = true;
    box.textContent = '';
  }
}

function showOAuthQueryErrors() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  if (error && OAUTH_ERROR_MESSAGES[error]) {
    showAuthMessage(OAUTH_ERROR_MESSAGES[error], 'error');
  }
}

function togglePasswordField() {
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.querySelector('.toggle-password');
  if (!passwordInput || !toggleIcon) return;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.classList.add('active');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.remove('active');
  }
}

document.addEventListener('DOMContentLoaded', showOAuthQueryErrors);
