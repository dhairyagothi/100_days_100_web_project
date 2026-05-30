import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function EmployerDashboard({ user }) {
  const [jobs, setJobs]   = useState([]);
  const [apps, setApps]   = useState({});
  const [selJob, setSel]  = useState(null);
  const H = { headers: { Authorization: `Bearer ${user.token}` } };

  useEffect(() => {
    axios.get("/api/jobs/my", H).then((r) => setJobs(r.data));
  }, []);

  const loadApps = async (jobId) => {
    setSel(jobId);
    if (!apps[jobId]) {
      const r = await axios.get(`/api/applications/job/${jobId}`, H);
      setApps((a) => ({ ...a, [jobId]: r.data }));
    }
  };

  const updateStatus = async (appId, status) => {
    await axios.put(`/api/applications/${appId}/status`, { status }, H);
    setApps((a) => ({
      ...a,
      [selJob]: a[selJob].map((x) => x._id === appId ? { ...x, status } : x),
    }));
  };

  const statusBadge = { pending: "badge-yellow", reviewed: "badge-blue", accepted: "badge-green", rejected: "badge-red" };

  return (
    <div>
      <h2 style={{ color: "#c9d1d9", marginBottom: 8 }}>Employer Dashboard</h2>
      <p style={{ color: "#8b949e", marginBottom: 28 }}>Real-time notifications when candidates apply ⚡</p>

      {jobs.length === 0 ? (
        <div style={{ textAlign: "center", background: "#161b22", border: "1px solid #30363d", borderRadius: 14, padding: 40 }}>
          <p style={{ color: "#8b949e", marginBottom: 16 }}>No jobs posted yet.</p>
          <Link to="/post-job"><button style={{ background: "#238636", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px" }}>Post Your First Job</button></Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {jobs.map((j) => (
            <div key={j._id} style={{ background: "#161b22", border: `1px solid ${selJob === j._id ? "#1f6feb" : "#30363d"}`, borderRadius: 12, padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ color: "#58a6ff" }}>{j.title}</h3>
                  <p style={{ color: "#8b949e", fontSize: "0.88rem", marginTop: 4 }}>{j.applicants?.length || 0} applicants · {j.location} · {j.type}</p>
                </div>
                <button onClick={() => loadApps(j._id)} style={{ background: "#21262d", color: "#c9d1d9", border: "1px solid #30363d", borderRadius: 8, padding: "7px 16px", fontSize: "0.88rem" }}>
                  {selJob === j._id ? "Hide" : "View Applicants"}
                </button>
              </div>
              {selJob === j._id && apps[j._id] && (
                <div style={{ marginTop: 16, borderTop: "1px solid #30363d", paddingTop: 16 }}>
                  {apps[j._id].length === 0
                    ? <p style={{ color: "#8b949e", fontSize: "0.9rem" }}>No applications yet.</p>
                    : apps[j._id].map((a) => (
                      <div key={a._id} style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                          <div>
                            <p style={{ color: "#c9d1d9", fontWeight: 600 }}>{a.candidate?.name}</p>
                            <p style={{ color: "#8b949e", fontSize: "0.85rem" }}>{a.candidate?.email}</p>
                            {a.candidate?.bio && <p style={{ color: "#8b949e", fontSize: "0.83rem", marginTop: 4 }}>{a.candidate.bio}</p>}
                          </div>
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span className={`badge ${statusBadge[a.status]}`}>{a.status}</span>
                            <select value={a.status} onChange={(e) => updateStatus(a._id, e.target.value)}
                              style={{ background: "#21262d", border: "1px solid #30363d", color: "#c9d1d9", borderRadius: 8, padding: "4px 8px", fontSize: "0.82rem" }}>
                              {["pending", "reviewed", "accepted", "rejected"].map((s) => <option key={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                        <p style={{ color: "#8b949e", fontSize: "0.88rem", marginTop: 10, lineHeight: 1.6 }}><strong style={{ color: "#c9d1d9" }}>Cover letter:</strong> {a.coverLetter}</p>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CandidateDashboard({ user }) {
  const [apps, setApps] = useState([]);
  const [load, setLoad] = useState(true);
  const H = { headers: { Authorization: `Bearer ${user.token}` } };
  const statusBadge = { pending: "badge-yellow", reviewed: "badge-blue", accepted: "badge-green", rejected: "badge-red" };

  useEffect(() => {
    axios.get("/api/applications/my", H).then((r) => setApps(r.data)).finally(() => setLoad(false));
  }, []);

  return (
    <div>
      <h2 style={{ color: "#c9d1d9", marginBottom: 8 }}>My Applications</h2>
      <p style={{ color: "#8b949e", marginBottom: 28 }}>{apps.length} application{apps.length !== 1 ? "s" : ""} submitted</p>
      {load ? <p style={{ color: "#8b949e" }}>Loading...</p>
       : apps.length === 0 ? (
         <div style={{ textAlign: "center", background: "#161b22", border: "1px solid #30363d", borderRadius: 14, padding: 40 }}>
           <p style={{ color: "#8b949e", marginBottom: 16 }}>No applications yet.</p>
           <Link to="/"><button style={{ background: "#238636", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px" }}>Browse Jobs</button></Link>
         </div>
       ) : (
         <div style={{ display: "grid", gap: 14 }}>
           {apps.map((a) => (
             <div key={a._id} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: "18px 22px" }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                 <div>
                   <h3 style={{ color: "#58a6ff" }}>{a.job?.title}</h3>
                   <p style={{ color: "#8b949e", fontSize: "0.88rem", marginTop: 4 }}>{a.job?.company} · {a.job?.location} · {a.job?.type}</p>
                 </div>
                 <span className={`badge ${statusBadge[a.status]}`} style={{ fontSize: "0.88rem", padding: "5px 14px" }}>{a.status}</span>
               </div>
               <p style={{ color: "#8b949e", fontSize: "0.83rem", marginTop: 10 }}>Applied {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
             </div>
           ))}
         </div>
       )
      }
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div style={{ background: "#0d1117", minHeight: "90vh", padding: "36px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {user?.role === "employer" ? <EmployerDashboard user={user} /> : <CandidateDashboard user={user} />}
      </div>
    </div>
  );
}
