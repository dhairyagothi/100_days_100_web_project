import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await axios.post(endpoint, payload);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.logo}>📝</h1>
          <h2 style={styles.title}>MERN Notes</h2>
          <p style={styles.subtitle}>
            {isLogin ? 'Welcome back! Log in to your notes.' : 'Create an account to get started.'}
          </p>
        </div>

        {/* Toggle tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{ ...styles.tab, ...(isLogin ? styles.tabActive : {}) }}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{ ...styles.tab, ...(!isLogin ? styles.tabActive : {}) }}
          >
            Register
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                required
                minLength={2}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
              minLength={6}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? '⏳ Please wait...' : isLogin ? '🔐 Login' : '🚀 Create Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }} style={styles.switchLink}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a1a', padding: '20px' },
  card: { background: '#12122a', padding: '40px 36px', borderRadius: '18px', width: '100%', maxWidth: '440px', border: '1px solid #1e1e4a' },
  header: { textAlign: 'center', marginBottom: '28px' },
  logo: { fontSize: '3rem', display: 'block', marginBottom: '8px' },
  title: { color: '#e94560', fontSize: '1.8rem', fontWeight: '700', marginBottom: '6px' },
  subtitle: { color: '#6b7280', fontSize: '0.9rem' },
  tabs: { display: 'flex', background: '#0a0a1a', borderRadius: '10px', padding: '4px', marginBottom: '24px', gap: '4px' },
  tab: { flex: 1, padding: '10px', background: 'transparent', color: '#6b7280', border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '500' },
  tabActive: { background: '#e94560', color: '#fff' },
  errorBox: { background: '#2d1515', color: '#f87171', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#9ca3af', fontSize: '0.85rem', fontWeight: '500' },
  input: { padding: '12px 16px', background: '#0a0a1a', border: '1px solid #1e3a6e', borderRadius: '10px', color: '#fff', fontSize: '1rem' },
  submitBtn: { padding: '14px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', marginTop: '4px' },
  switchText: { textAlign: 'center', color: '#6b7280', marginTop: '20px', fontSize: '0.9rem' },
  switchLink: { color: '#e94560', cursor: 'pointer', fontWeight: '600' },
};
