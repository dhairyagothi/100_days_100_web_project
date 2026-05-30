import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [mode, setMode]    = useState("login");
  const [form, setForm]    = useState({ name: "", email: "", password: "", role: "candidate", company: "", bio: "" });
  const [error, setError]  = useState("");
  const [loading, setLoad] = useState(false);
  const { login, addToast } = useAuth();
  const nav = useNavigate();

  const ch = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const submit = async (e) => {
    e.preventDefault(); setLoad(true); setError("");
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : form;
      const r = await axios.post(url, payload);
      login(r.data);
      addToast(`Welcome, ${r.data.name}! 👋`);
      nav("/");
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong");
    } finally { setLoad(false); }
  };

  const inp = { background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, color: "#c9d1d9", padding: "11px 14px", fontSize: "0.95rem", width: "100%", boxSizing: "border-box" };
  const lbl = { color: "#8b949e", fontSize: "0.83rem", fontWeight: 500, marginBottom: 5, display: "block" };

  return (
    <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1117", padding: 20 }}>
      <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 460 }}>
        <h2 style={{ color: "#58a6ff", textAlign: "center", marginBottom: 6 }}>⚡ JobBoard</h2>
        <p style={{ color: "#8b949e", textAlign: "center", fontSize: "0.9rem", marginBottom: 28 }}>Real-time Jobs Platform</p>

        <div style={{ display: "flex", background: "#0d1117", borderRadius: 10, padding: 4, marginBottom: 24, gap: 4 }}>
          {["login", "register"].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{ flex: 1, padding: 10, background: mode === m ? "#1f6feb" : "transparent", color: mode === m ? "#fff" : "#8b949e", border: "none", borderRadius: 8, fontWeight: 500 }}>
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {error && <div style={{ background: "#2d1b1b", color: "#f85149", border: "1px solid #6e1c1c", borderRadius: 8, padding: "11px 14px", marginBottom: 16, fontSize: "0.88rem" }}>⚠️ {error}</div>}

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "register" && (
            <>
              <div><label style={lbl}>Full Name</label><input name="name" placeholder="Nishant Nayak" value={form.name} onChange={ch} style={inp} required /></div>
              <div>
                <label style={lbl}>I am a...</label>
                <select name="role" value={form.role} onChange={ch} style={inp}>
                  <option value="candidate">👨‍💻 Candidate — looking for jobs</option>
                  <option value="employer">🏢 Employer — posting jobs</option>
                </select>
              </div>
              {form.role === "employer" && <div><label style={lbl}>Company Name</label><input name="company" placeholder="Acme Corp" value={form.company} onChange={ch} style={inp} /></div>}
              {form.role === "candidate" && <div><label style={lbl}>Short Bio</label><input name="bio" placeholder="Full-stack dev, 2 yrs exp" value={form.bio} onChange={ch} style={inp} /></div>}
            </>
          )}
          <div><label style={lbl}>Email</label><input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={ch} style={inp} required /></div>
          <div><label style={lbl}>Password</label><input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={ch} style={inp} required minLength={6} /></div>
          <button type="submit" disabled={loading} style={{ background: "#238636", color: "#fff", border: "none", borderRadius: 10, padding: 13, fontWeight: 600, fontSize: "1rem", marginTop: 4 }}>
            {loading ? "⏳ Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>
      </div>
    </div>
  );
}
