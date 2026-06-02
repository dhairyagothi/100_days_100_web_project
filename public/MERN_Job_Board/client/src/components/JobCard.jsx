import { Link } from "react-router-dom";

const typeColor = { "Full-time": "badge-green", "Remote": "badge-blue", "Internship": "badge-yellow", "Part-time": "badge-yellow", "Contract": "badge-red" };

export default function JobCard({ job }) {
  const s = {
    card:    { background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12, transition: "border-color .2s" },
    title:   { color: "#58a6ff", fontSize: "1.05rem", fontWeight: 600 },
    company: { color: "#c9d1d9", fontWeight: 500, fontSize: "0.95rem" },
    meta:    { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" },
    loc:     { color: "#8b949e", fontSize: "0.85rem" },
    salary:  { color: "#3fb950", fontSize: "0.85rem", fontWeight: 500 },
    stack:   { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 },
    tag:     { background: "#21262d", color: "#58a6ff", padding: "3px 10px", borderRadius: 20, fontSize: "0.78rem", border: "1px solid #30363d" },
    footer:  { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" },
    date:    { color: "#8b949e", fontSize: "0.8rem" },
    viewBtn: { background: "#238636", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", fontSize: "0.88rem", cursor: "pointer", textDecoration: "none" },
  };

  return (
    <div style={s.card}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h3 style={s.title}>{job.title}</h3>
          <span className={`badge ${typeColor[job.type] || "badge-blue"}`}>{job.type}</span>
        </div>
        <p style={s.company}>{job.company}</p>
      </div>
      <div style={s.meta}>
        <span style={s.loc}>📍 {job.location}</span>
        {job.salary !== "Not disclosed" && <span style={s.salary}>💰 {job.salary}</span>}
      </div>
      {job.techStack?.length > 0 && (
        <div style={s.stack}>
          {job.techStack.slice(0, 5).map((t) => <span key={t} style={s.tag}>{t}</span>)}
          {job.techStack.length > 5 && <span style={s.tag}>+{job.techStack.length - 5}</span>}
        </div>
      )}
      <div style={s.footer}>
        <span style={s.date}>{new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        <Link to={`/jobs/${job._id}`} style={s.viewBtn}>View & Apply →</Link>
      </div>
    </div>
  );
}
