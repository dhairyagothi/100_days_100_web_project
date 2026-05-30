import { NavLink } from "react-router-dom";

// NavLink is like <a> but it automatically adds an "active"
// class when the current URL matches the link's path
export default function Sidebar({ historyCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">📦</span>
        <span className="logo-text">
          BigSales<br />
          <small>PREDICTOR</small>
        </span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">TOOLS</span>

        {/* end={true} means "/" only matches exact root, not every route */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          🎯 Predict
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
        >
          📊 History
          {/* Badge shows count of predictions made so far */}
          {historyCount > 0 && (
            <span className="nav-badge">{historyCount}</span>
          )}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span>YBI Intern Project</span>
        <span className="api-status">
          <span className="dot" /> API Live
        </span>
      </div>
    </aside>
  );
}
