import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", exact: true },
    { to: "/resume-analysis", label: "Resume" },
    { to: "/job-matches", label: "Matches" },
  ];

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <header
      className="w-full sticky top-0 z-50 nav-glass"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 68,
          padding: "0 2rem",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg,#6366f1,#38bdf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(99,102,241,0.5)",
                flexShrink: 0,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, color: "#fff", fontVariationSettings: "'FILL' 1" }}
              >
                psychology
              </span>
            </div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                background: "linear-gradient(135deg,#a5b4fc,#67e8f9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.02em",
              }}
            >
              CareerAI
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            justifyContent: "center",
            flex: 1,
          }}
          className="hidden md:flex"
        >
          {links.map(({ to, label, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                style={{
                  padding: "8px 18px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  textDecoration: "none",
                  color: active ? "#a5b4fc" : "#94a3b8",
                  background: active ? "rgba(99,102,241,0.12)" : "transparent",
                  border: active ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.01em",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: 8,
            cursor: "pointer",
            color: "#a5b4fc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            {isOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav
          className="md:hidden"
          style={{
            background: "rgba(4,8,15,0.92)",
            backdropFilter: "blur(24px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "16px 24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {links.map(({ to, label, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                  textDecoration: "none",
                  color: active ? "#a5b4fc" : "#94a3b8",
                  background: active ? "rgba(99,102,241,0.12)" : "transparent",
                  border: active ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
