// src/pages/AuthPage.jsx
import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Code2, Loader2, AlertCircle } from 'lucide-react';
import { signIn, signUp } from '../services/authService';

export default function AuthPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';

  const [tab, setTab]           = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const nameRef  = useRef(null);
  const emailRef = useRef(null);
  const passRef  = useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email = emailRef.current.value.trim();
    const pass  = passRef.current.value;
    const name  = nameRef.current?.value.trim() || '';

    try {
      if (tab === 'signup') {
        if (!name) throw new Error('Name is required');
        if (pass.length < 6) throw new Error('Password must be at least 6 characters');
        await signUp(email, pass, name);
      } else {
        await signIn(email, pass);
      }
      navigate(from, { replace: true });
    } catch (err) {
      const code = err.code || '';
      const msg = code === 'auth/invalid-credential' || code === 'auth/wrong-password'
        ? 'Invalid email or password'
        : code === 'auth/email-already-in-use'
        ? 'Email already registered'
        : code === 'auth/user-not-found'
        ? 'No account with this email'
        : err.message || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-16">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-600/6 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
              <Code2 size={20} className="text-white" />
            </div>
            <span className="text-2xl font-black gradient-text">AlgoGATE</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass border border-white/8 p-8 animate-slide-up">
          {/* Tabs */}
          <div className="flex mb-8 p-1 rounded-xl bg-dark-600/60 border border-white/5">
            {['login', 'signup'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200
                  ${tab === t
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow-sm'
                    : 'text-gray-400 hover:text-white'}`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div className="animate-slide-up">
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input ref={nameRef} type="text" placeholder="John Doe" required className="input-field" />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input ref={emailRef} type="email" placeholder="you@email.com" required className="input-field" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passRef}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-fade-in">
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {tab === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                tab === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setTab(tab === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
            >
              {tab === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          By continuing you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
