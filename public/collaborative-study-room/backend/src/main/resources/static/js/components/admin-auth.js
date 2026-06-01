import { API_BASE_URL } from '../state.js';

document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorBox = document.getElementById('error-box');
  const submitBtn = e.target.querySelector('button');

  errorBox.style.display = 'none';
  submitBtn.textContent = 'Authenticating...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    // Role check: ONLY admins are allowed through this portal
    if (data.role !== 'ADMIN') {
      throw new Error('Access Denied: Not an Administrator');
    }

    // Successful Admin Login
    localStorage.setItem('nexus_token', data.token);
    localStorage.setItem('nexus_user', JSON.stringify({
      username: data.username,
      email: data.email,
      role: data.role
    }));

    window.location.href = 'admin.html';

  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.style.display = 'block';
  } finally {
    submitBtn.textContent = 'Authenticate System';
    submitBtn.disabled = false;
  }
});
