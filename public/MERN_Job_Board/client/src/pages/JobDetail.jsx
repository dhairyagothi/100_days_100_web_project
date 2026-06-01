import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const { user, addToast } = useAuth();
  const nav = useNavigate();
  const [job, setJob]         = useState(null);
  const [cover, setCover]     = useState("");
  const [loading, setLoad]    = useState(true);
  const [applying, setApply]  = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    axios.get(`/api/jobs/${id}`)
      .then((r) => setJob(r.data))
      .catch(() => addToast("Job not found", "error"))
      .finally(() => setLoad(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return nav("/auth");
    if (!cover.trim()) return addToast("Please write a cover letter", "error");
    setApply(true);
    try {
      await axios.post(`/api/applications/${id}`, { coverLetter: cover }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplied(true);
      addToast("🎉 Application submitted successfully!");
    } catch (e) {
      addToast(e.response?.data?.message || "Application failed", "error");
    } finally { setApply(false); }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 80, color: "#8b949e" }}>Loading...</p>;
  if (!job)    return <p style={{ textAlign: "center", marginTop: 80, color: "#f85149" }}>Job not found.</p>;

  const typeColor = { "Full-time": "badge-green", "Remote": "badge-blue", "Internship": "badge-yellow", "Part-time": "badge-yellow", "Contract": "badge-red" };

  return (
    <div style={{ background: "#0d1117", minHeight: "90vh", padding: "36px 20px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 14, padding: "28px 30px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ color: "#c9d1d9", fontSize: "1.6rem", fontWeight: 700, marginBottom: 6 }}>{job.title}</h1>
              <p style={{ color: "#58a6ff", fontSize: "1rem", fontWeight: 500 }}>{job.company}</p>
            </div>
            <span className={`badge ${typeColor[job.type] || "badge-blue"}`} style={{ fontSize: "0.9rem", padding: "6px 14px" }}>{job.type}</span>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
            <span style={{ color: "#8b949e" }}>📍 {job.location}</span>
            {job.salary !== "Not disclosed" && <span style={{ color: "#3fb950" }}>💰 {job.salary}</span>}
            <span style={{ color: "#8b949e" }}>👥 {job.applicants?.length || 0} applicants</span>
          </div>
          {job.techStack?.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
              {job.techStack.map((t) => (
                <span key={t} style={{ background: "#21262d", color: "#58a6ff", padding: "4px 12px", borderRadius: 20, fontSize: "0.82rem", border: "1px solid #30363d" }}>{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 14, padding: "24px 28px", marginBottom: 24 }}>
          <h2 style={{ color: "#c9d1d9", marginBottom: 14, fontSize: "1.1rem" }}>Job Description</h2>
          <p style={{ color: "#8b949e", lineHeight: 1.75, whiteSpace: "pre-line" }}>{job.description}</p>
        </div>

        {/* Apply section */}
        {user?.role === "candidate" && (
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 14, padding: "24px 28px" }}>
            <h2 style={{ color: "#c9d1d9", marginBottom: 16, fontSize: "1.1rem" }}>Apply for this role</h2>
            {applied ? (
              <div style={{ background: "#12261e", border: "1px solid #238636", borderRadius: 10, padding: 20, textAlign: "center", color: "#3fb950" }}>
                ✅ Your application has been submitted! The employer will be notified in real-time.
              </div>
            ) : (
              <form onSubmit={handleApply} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ color: "#8b949e", fontSize: "0.85rem", fontWeight: 500, display: "block", marginBottom: 6 }}>Cover Letter</label>
                  <textarea value={cover} onChange={(e) => setCover(e.target.value)}
                    placeholder="Tell the employer why you're a great fit..."
                    style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, color: "#c9d1d9", padding: "12px 14px", fontSize: "0.95rem", width: "100%", minHeight: 140, resize: "vertical", boxSizing: "border-box" }}
                    maxLength={2000} required />
                  <p style={{ color: "#8b949e", fontSize: "0.8rem", marginTop: 4, textAlign: "right" }}>{cover.length}/2000</p>
                </div>
                <button type="submit" disabled={applying}
                  style={{ background: "#238636", color: "#fff", border: "none", borderRadius: 10, padding: 13, fontWeight: 600, fontSize: "1rem" }}>
                  {applying ? "Submitting..." : "⚡ Submit Application"}
                </button>
              </form>
            )}
          </div>
        )}
        {!user && (
          <div style={{ textAlign: "center", padding: 24, background: "#161b22", border: "1px solid #30363d", borderRadius: 14 }}>
            <p style={{ color: "#8b949e", marginBottom: 14 }}>Sign in as a candidate to apply</p>
            <button onClick={() => nav("/auth")} style={{ background: "#238636", color: "#fff", border: "none", borderRadius: 8, padding: "10px 28px" }}>Sign In →</button>
          </div>
        )}
      </div>
    </div>
  );
}
