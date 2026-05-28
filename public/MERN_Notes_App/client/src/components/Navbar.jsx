import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        📝 MERN Notes
      </Link>

      <div style={styles.right}>
        {user ? (
          <>
            <span style={styles.welcome}>
              👋 {user.name}
            </span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" style={styles.loginBtn}>
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 28px',
    background: '#12122a',
    borderBottom: '1px solid #1e1e4a',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    color: '#e94560',
    textDecoration: 'none',
    fontSize: '1.35rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  welcome: {
    fontSize: '0.9rem',
    color: '#9ca3af',
  },
  logoutBtn: {
    padding: '8px 20px',
    background: 'transparent',
    color: '#e94560',
    border: '1.5px solid #e94560',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  loginBtn: {
    padding: '8px 20px',
    background: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    textDecoration: 'none',
  },
};
