// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Code2, Sun, Moon, LogOut, User, Star, BookOpen,
  BarChart2, Menu, X, RefreshCw, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { signOut } from '../../services/authService';
import { useCodeforcesSync } from '../../hooks/useCodeforcesSync';

export default function Navbar() {
  const { user, profile, refreshProfile } = useAuth();
  const { streak, refreshData } = useApp();
  const { sync, syncing } = useCodeforcesSync();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: BarChart2 },
    { to: '/practice',  label: 'Practice',  icon: Code2     },
    { to: '/study',     label: 'Study',     icon: BookOpen  },
    { to: '/starred',   label: 'Starred',   icon: Star      },
  ];

  async function handleSync() {
    if (!profile?.cfHandle || !user) return;
    await sync(user.uid, profile.cfHandle);
    refreshProfile();
    refreshData();
  }

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  return (
    <nav className="app-nav sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-110">
            <img src={`${import.meta.env.BASE_URL}brain.png`} alt="AlgoGATE Brain Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:block">AlgoGATE</span>
        </Link>

        {/* Desktop Nav */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname.startsWith(to)
                    ? 'text-brand-300 bg-brand-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Streak badge */}
          {user && streak > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
              🔥 {streak} day{streak !== 1 ? 's' : ''}
            </div>
          )}

          {/* CF Sync */}
          {user && profile?.cfHandle && (
            <button
              onClick={handleSync}
              disabled={syncing}
              title="Sync with Codeforces"
              className="btn-ghost p-2"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin text-brand-400' : ''} />
            </button>
          )}

          {/* User dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                  {(profile?.name || user.email)?.[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm text-gray-300 max-w-[100px] truncate">
                  {profile?.name || user.email}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {dropOpen && (
                <div className="absolute right-0 mt-2 w-52 glass border border-white/10 rounded-xl shadow-card py-1 z-50 animate-fade-in">
                  <Link
                    to="/profile"
                    onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <User size={15} /> Profile
                  </Link>
                  <div className="divider my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 w-full transition-colors"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn-primary text-sm px-4 py-2">Sign In</Link>
          )}

          {/* Mobile menu toggle */}
          {user && (
            <button onClick={() => setMenuOpen(o => !o)} className="btn-ghost p-2 md:hidden">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {user && menuOpen && (
        <div className="md:hidden border-t" style={{borderColor: 'var(--border)', background: 'var(--bg-nav)'}} >
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${location.pathname.startsWith(to)
                  ? 'text-brand-300 bg-brand-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={16} />{label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
