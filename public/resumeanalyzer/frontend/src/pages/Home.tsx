import { Link } from "react-router-dom";

const stats = [
  { value: "98%", label: "Match Accuracy", icon: "verified" },
  { value: "50k+", label: "Top-tier Roles", icon: "work" },
  { value: "12ms", label: "Analysis Speed", icon: "bolt" },
  { value: "4.9★", label: "User Rating", icon: "star" },
];

const features = [
  {
    icon: "upload_file",
    title: "Seamless Upload",
    desc: "Import LinkedIn profiles or PDFs. Our parser handles complex layouts with 100% data retention.",
    color: "#38bdf8",
    glow: "rgba(56,189,248,0.15)",
  },
  {
    icon: "psychology",
    title: "Deep Analysis",
    desc: "Semantic extraction of soft skills, project impact, and leadership trajectory using advanced LLMs.",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.15)",
    featured: true,
  },
  {
    icon: "join_inner",
    title: "Precision Matching",
    desc: "Connect with opportunities aligned with your 5-year career goals, not just your last job title.",
    color: "#34d399",
    glow: "rgba(52,211,153,0.15)",
  },
];

const steps = [
  { num: "01", title: "Upload Resume", desc: "Drag & drop your PDF, DOCX or LinkedIn export." },
  {
    num: "02",
    title: "AI Extracts DNA",
    desc: "Our engine maps your skills, trajectory and hidden strengths.",
  },
  { num: "03", title: "Get Matched", desc: "Receive curated roles sorted by compatibility score." },
];

function Home() {
  return (
    <div className="glass-bg" style={{ minHeight: "100vh", color: "#e2e8ff", overflowX: "hidden" }}>
      {/* Floating Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          style={{
            minHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "80px 24px 60px",
            position: "relative",
          }}
        >
          {/* Badge */}
          <div className="badge-glass anim-fade-up" style={{ marginBottom: 32 }}>
            <span className="glow-dot" />
            Now Powered by Gemini
          </div>

          {/* Headline */}
          <h1
            className="anim-fade-up-delay"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: 28,
              maxWidth: 820,
            }}
          >
            Your Career, <span className="gradient-text">Powered by Intelligence</span>
          </h1>

          {/* Sub */}
          <p
            className="anim-fade-up-delay2"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "#64748b",
              maxWidth: 560,
              lineHeight: 1.7,
              marginBottom: 48,
            }}
          >
            The executive-grade platform that analyzes your professional DNA to find matches that
            others miss. Move beyond job boards into intelligent career steering.
          </p>

          {/* CTA */}
          <div
            className="anim-fade-up-delay2"
            style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}
          >
            <Link to="/resume-analysis" style={{ textDecoration: "none" }}>
              <button className="btn-primary" style={{ fontSize: 15, padding: "16px 36px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  upload_file
                </span>
                Analyze My Resume
              </button>
            </Link>
            <a
              href="#features"
              className="btn-glass"
              style={{ fontSize: 15, padding: "16px 32px" }}
            >
              See How It Works
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                arrow_downward
              </span>
            </a>
          </div>

          {/* Hero card mockup */}
          <div
            className="glass-border-glow anim-fade-in"
            style={{
              marginTop: 72,
              maxWidth: 740,
              width: "100%",
              borderRadius: 28,
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(99,102,241,0.15)",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(32px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 28,
                padding: "28px 28px 20px",
              }}
            >
              {/* Window chrome */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["#f87171", "#fbbf24", "#34d399"].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: c,
                      opacity: 0.9,
                    }}
                  />
                ))}
              </div>
              {/* Fake analysis UI */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Match Score", value: "94%", color: "#34d399" },
                  { label: "Based On", value: "Trained Data", color: "#a78bfa" },
                  { label: "Verified By", value: "Google", color: "#38bdf8" },
                  { label: "Methods Used", value: "AI, Human Review", color: "#f472b6" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 16,
                      padding: "16px 20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: "#475569",
                        fontWeight: 600,
                        marginBottom: 6,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {label}
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 16,
                  height: 6,
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.05)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "94%",
                    height: "100%",
                    borderRadius: 100,
                    background: "linear-gradient(90deg,#6366f1,#38bdf8)",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <section
          style={{
            padding: "48px 24px",
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {stats.map(({ value, label, icon }) => (
              <div
                key={label}
                className="glass"
                style={{ textAlign: "center", padding: "28px 20px" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 22, color: "#818cf8", fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                </div>
                <div
                  className="gradient-text-blue"
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    marginBottom: 6,
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section id="features" style={{ padding: "96px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge-glass" style={{ marginBottom: 20, display: "inline-flex" }}>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              Core Features
            </div>
            <h2
              style={{
                fontSize: "clamp(1.8rem,4vw,3rem)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                marginBottom: 16,
              }}
            >
              Intelligence in Every Step
            </h2>
            <p style={{ color: "#475569", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
              Our proprietary engine deconstructs your experience and maps it to the future of
              industry requirements.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                className={f.featured ? "glass-strong glass-border-glow" : "glass"}
                style={{
                  padding: "36px 32px",
                  position: "relative",
                  overflow: "hidden",
                  transform: f.featured ? "scale(1.03)" : undefined,
                  boxShadow: f.featured
                    ? `0 24px 80px rgba(0,0,0,0.5), 0 0 60px ${f.glow}`
                    : undefined,
                }}
              >
                {f.featured && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      padding: "3px 10px",
                      borderRadius: 100,
                      background: "rgba(167,139,250,0.15)",
                      border: "1px solid rgba(167,139,250,0.3)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "#a78bfa",
                      textTransform: "uppercase",
                    }}
                  >
                    Featured
                  </div>
                )}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: `rgba(${f.color === "#38bdf8" ? "56,189,248" : f.color === "#a78bfa" ? "167,139,250" : "52,211,153"},0.12)`,
                    border: `1px solid ${f.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    boxShadow: `0 0 24px ${f.glow}`,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: f.color,
                      fontSize: 26,
                      fontVariationSettings: f.featured ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {f.icon}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 12,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: "#475569", lineHeight: 1.7, fontSize: 14 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────────── */}
        <section style={{ padding: "80px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <h2
                style={{
                  fontSize: "clamp(1.8rem,4vw,2.6rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  marginBottom: 12,
                }}
              >
                Three Steps to Your <span className="gradient-text">Dream Role</span>
              </h2>
              <p style={{ color: "#475569", fontSize: 15 }}>Simple, powerful, and blazing fast.</p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
                gap: 20,
              }}
            >
              {steps.map(({ num, title, desc }) => (
                <div
                  key={num}
                  className="glass"
                  style={{ padding: "32px 28px", position: "relative", overflow: "hidden" }}
                >
                  <div
                    style={{
                      fontSize: 56,
                      fontWeight: 900,
                      color: "rgba(99,102,241,0.08)",
                      position: "absolute",
                      top: 12,
                      right: 20,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      userSelect: "none",
                    }}
                  >
                    {num}
                  </div>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "linear-gradient(135deg,#6366f1,#38bdf8)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      fontSize: 13,
                      fontWeight: 800,
                      color: "#fff",
                      boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
                    }}
                  >
                    {num}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                  <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonial ──────────────────────────────────────────────── */}
        <section style={{ padding: "80px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div
              className="glass-strong glass-border-glow"
              style={{
                borderRadius: 28,
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "1fr 1.4fr",
                boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.1)",
              }}
            >
              {/* Image side */}
              <div style={{ position: "relative", minHeight: 320 }}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8WITWGF6eUkeOsxIQm3IxQRLQ3jQG11k-gf5b1ECX7jFaubPixkCf5RVWcq59p72bSF7SqhE9ugfdGUk0xcEOHLsnQPXCVkDi_8yEPo9d3kHvQ2hubPU1sTeuTL5N54hwBwDeS8Fz5-bWQSSd_MEwG_cIRfGS5QOEgnwy5RGZaLYy_bSRbZvbdA3zb0hhs26MCVZgE858x_9qR0SNWsvaMEtC3TeM63h7bdggXHDssjuiwTeQOEaDn-0hBTt-C7QfCJ6EWnj_Lzc"
                  alt="Alex Rivers"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "saturate(0.8)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, transparent 40%, rgba(10,15,30,0.9) 100%)",
                  }}
                />
              </div>

              {/* Quote side */}
              <div
                style={{
                  padding: "48px 44px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 24,
                  position: "relative",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 56,
                    color: "#6366f1",
                    opacity: 0.25,
                    position: "absolute",
                    top: 32,
                    left: 40,
                  }}
                >
                  format_quote
                </span>
                <blockquote
                  style={{
                    fontSize: "clamp(1rem,2vw,1.2rem)",
                    fontStyle: "italic",
                    lineHeight: 1.7,
                    color: "#cbd5e1",
                    fontWeight: 500,
                    marginTop: 20,
                  }}
                >
                  "CareerAI didn't just find me a new role; it identified a career pivot I hadn't
                  considered. The accuracy of their matching engine is superior to any headhunter
                  I've worked with in my 20-year career."
                </blockquote>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#e2e8ff" }}>Alex Rivers</div>
                  <div style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, marginTop: 2 }}>
                    Senior Product Designer · Premium Member
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined"
                        style={{
                          fontSize: 16,
                          color: "#fbbf24",
                          fontVariationSettings: "'FILL' 1",
                        }}
                      >
                        star
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section style={{ padding: "80px 24px 120px", textAlign: "center" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div
              className="glass-strong glass-border-glow"
              style={{
                borderRadius: 32,
                padding: "72px 48px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 80px rgba(99,102,241,0.12)",
              }}
            >
              {/* Background glow */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 400,
                  height: 400,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <h2
                style={{
                  fontSize: "clamp(1.8rem,4vw,2.8rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.025em",
                  marginBottom: 16,
                  position: "relative",
                }}
              >
                Ready for the <span className="gradient-text">Next Level?</span>
              </h2>
              <p
                style={{
                  color: "#475569",
                  fontSize: 16,
                  lineHeight: 1.7,
                  marginBottom: 40,
                  position: "relative",
                }}
              >
                Join 10,000+ high-level professionals who have unlocked their true market value with
                AI-driven career intelligence.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  flexWrap: "wrap",
                  position: "relative",
                }}
              >
                <Link to="/resume-analysis" style={{ textDecoration: "none" }}>
                  <button className="btn-primary" style={{ fontSize: 16, padding: "18px 40px" }}>
                    Start Free Analysis
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      arrow_forward
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "48px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                background: "linear-gradient(135deg,#a5b4fc,#67e8f9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 12,
              }}
            >
              CareerAI
            </div>
            <p style={{ color: "#334155", fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
              © 2024 CareerAI. Empowering professional transitions through intelligent matching.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            {[
              { title: "Company", links: ["About Us", "AI Ethics", "Career Blog"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Support"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#e2e8ff",
                    marginBottom: 16,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {title}
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        style={{
                          fontSize: 13,
                          color: "#334155",
                          textDecoration: "none",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#a5b4fc")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#334155")}
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
