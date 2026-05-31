import { useEffect, useState } from "react";
import { useJobs } from "../context/JobContext";
import JobCard from "../components/JobCard";

const JOB_TYPES = ["All", "Full-time", "Part-time", "Remote", "Internship", "Contract"];

export default function Home() {
  const { jobs, loading, fetchJobs } = useJobs();
  const [search, setSearch]   = useState("");
  const [type, setType]       = useState("All");
  const [debounced, setDeb]   = useState("");

  useEffect(() => { fetchJobs(); }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDeb(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    fetchJobs({ search: debounced || undefined, type: type !== "All" ? type : undefined });
  }, [debounced, type]);

  return (
    <div style={{ background: "#0d1117", minHeight: "90vh", padding: "36px 20px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ color: "#c9d1d9", fontSize: "2.2rem", fontWeight: 700, marginBottom: 10 }}>
            Find your next <span style={{ color: "#58a6ff" }}>dev job</span> ⚡
          </h1>
          <p style={{ color: "#8b949e" }}>Real-time job postings — new listings appear instantly</p>
        </div>

        {/* Search & Filter */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <input placeholder="🔍  Search by title, skill, or keyword..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 240, background: "#161b22", border: "1px solid #30363d", borderRadius: 10, color: "#c9d1d9", padding: "11px 16px" }} />
          <div style={{ display: "flex", gap: 8 }}>
            {JOB_TYPES.map((t) => (
              <button key={t} onClick={() => setType(t)}
                style={{ padding: "9px 16px", background: type === t ? "#1f6feb" : "#161b22", color: type === t ? "#fff" : "#8b949e", border: "1px solid #30363d", borderRadius: 8, fontSize: "0.85rem" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ color: "#8b949e", fontSize: "0.9rem" }}>{jobs.length} job{jobs.length !== 1 ? "s" : ""} found</p>
          <span style={{ color: "#3fb950", fontSize: "0.82rem" }}>⚡ Updates in real-time</span>
        </div>

        {/* Grid */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#8b949e", marginTop: 60 }}>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p style={{ textAlign: "center", color: "#8b949e", marginTop: 60 }}>No jobs found. Try different filters.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {jobs.map((j) => <JobCard key={j._id} job={j} />)}
          </div>
        )}
      </div>
    </div>
  );
}
