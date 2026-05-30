import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobContext";

export default function PostJob() {
  const { user, addToast } = useAuth();
  const { fetchJobs }      = useJobs();
  const nav = useNavigate();
  const [form, setForm] = useState({ title: "", location: "", type: "Full-time", salary: "", description: "", techStack: "" });
  const [loading, setLoad] = useState(false);

  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setLoad(true);
    try {
      await axios.post("/api/jobs", {
        ...form,
        techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      addToast("🚀 Job posted! Candidates will see it in real-time.");
      fetchJobs();
      nav("/dashboard");
    } catch (e) {
      addToast(e.response?.data?.message || "Failed to post job", "error");
    } finally { setLoad(false); }
  };

  const inp = { background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, color: "#c9d1d9", padding: "11px 14px", fontSize: "0.95rem", width: "100%", boxSizing: "border-box" };
  const lbl = { color: "#8b949e", fontSize: "0.84rem", fontWeight: 500, marginBottom: 6, display: "block" };

  return (
    <div style={{ background: "#0d1117", minHeight: "90vh", padding: "36px 20px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ color: "#c9d1d9", marginBottom: 6 }}>Post a Job</h2>
        <p style={{ color: "#8b949e", marginBottom: 28, fontSize: "0.9rem" }}>Live on the board the moment you submit ⚡</p>
        <form onSubmit={submit} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 16, padding: "30px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div><label style={lbl}>Job Title *</label><input name="title" placeholder="Senior React Developer" value={form.title} onChange={ch} style={inp} required /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div><label style={lbl}>Location *</label><input name="location" placeholder="Remote / Delhi / Bangalore" value={form.location} onChange={ch} style={inp} required /></div>
            <div>
              <label style={lbl}>Job Type</label>
              <select name="type" value={form.type} onChange={ch} style={inp}>
                {["Full-time", "Part-time", "Remote", "Internship", "Contract"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div><label style={lbl}>Salary (optional)</label><input name="salary" placeholder="₹12–18 LPA / $80k–100k" value={form.salary} onChange={ch} style={inp} /></div>
          <div><label style={lbl}>Tech Stack (comma-separated)</label><input name="techStack" placeholder="React, Node.js, MongoDB, AWS" value={form.techStack} onChange={ch} style={inp} /></div>
          <div>
            <label style={lbl}>Job Description *</label>
            <textarea name="description" placeholder="Describe responsibilities, requirements, perks..." value={form.description} onChange={ch}
              style={{ ...inp, minHeight: 140, resize: "vertical" }} required />
          </div>
          <button type="submit" disabled={loading} style={{ background: "#238636", color: "#fff", border: "none", borderRadius: 10, padding: 13, fontWeight: 600, fontSize: "1rem" }}>
            {loading ? "Posting..." : "⚡ Post Job — Go Live Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
