import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, onlineCount } = useAuth();
  const nav = useNavigate();

  const s = {
    nav:    { background: "#161b22", borderBottom: "1px solid #30363d", padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 },
    brand:  { color: "#58a6ff", fontWeight: 700, fontSize: "1.25rem", textDecoration: "none" },
    links:  { display: "flex", alignItems: "center", gap: "18px" },
    link:   { color: "#8b949e", textDecoration: "none", fontSize: "0.9rem" },
    online: { display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "#3fb950" },
    btn:    { padding: "7px 18px", background: "#21262d", color: "#c9d1d9", border: "1px solid #30363d", borderRadius: 8, fontSize: "0.88rem" },
    btnPri: { padding: "7px 18px", background: "#238636", color: "#fff", border: "none", borderRadius: 8, fontSize: "0.88rem" },
  };

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.brand}>⚡ JobBoard</Link>
      <div style={s.links}>
        <span style={s.online}>
          <span className="online-dot" /> {onlineCount} online
        </span>
        <Link to="/" style={s.link}>Browse Jobs</Link>
        {user ? (
          <>
            {user.role === "employer" && <Link to="/post-job" style={s.link}>Post Job</Link>}
            <Link to="/dashboard" style={s.link}>Dashboard</Link>
            <span style={{ ...s.link, color: "#8b949e", fontSize: "0.82rem" }}>{user.name} · {user.role}</span>
            <button onClick={() => { logout(); nav("/auth"); }} style={s.btn}>Logout</button>
          </>
        ) : (
          <Link to="/auth"><button style={s.btnPri}>Sign In</button></Link>
        )}
      </div>
    </nav>
  );
}
