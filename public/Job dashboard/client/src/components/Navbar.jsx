import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBriefcase, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { isAuthenticated, admin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <FaBriefcase className="navbar-brand-icon" />
          <span>JobBoard</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`navbar-links ${menuOpen ? 'navbar-links--open' : ''}`}>
          <li>
            <NavLink to="/" end onClick={closeMenu}>
              Jobs
            </NavLink>
          </li>
          <li>
            <NavLink to="/#saved" onClick={closeMenu}>
              Saved Jobs
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/admin/dashboard" onClick={closeMenu}>
                  Dashboard
                </NavLink>
              </li>
              <li className="navbar-admin-info">
                <span className="navbar-admin-email">{admin?.email}</span>
              </li>
              <li>
                <button className="navbar-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/admin/login" onClick={closeMenu}>
                Admin Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
