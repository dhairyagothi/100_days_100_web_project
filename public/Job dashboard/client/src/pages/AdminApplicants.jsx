import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaUserTie } from 'react-icons/fa';
import { getJob, getApplications } from '../services/api.js';
import toast from 'react-hot-toast';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncate(str, max = 80) {
  if (!str) return '—';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function AdminApplicants() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobData, appsData] = await Promise.all([
          getJob(id),
          getApplications(id),
        ]);
        if (!cancelled) {
          setJob(jobData.job || jobData);
          const apps = Array.isArray(appsData) ? appsData : appsData.applications || [];
          setApplications(apps);
        }
      } catch {
        if (!cancelled) toast.error('Failed to load applicant data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="admin-applicants">
        <div className="spinner-container">
          <div className="spinner" />
          <p>Loading applicants…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-applicants">
      <Link to="/admin/dashboard" className="back-link">
        <FaArrowLeft /> Back to Dashboard
      </Link>

      <div className="applicants-header">
        <FaUserTie className="applicants-icon" />
        <div>
          <h1>Applicants</h1>
          {job && (
            <p className="applicants-subtitle">
              {job.title} — {job.company}
            </p>
          )}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <p>No applications received yet for this position.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <p className="applicants-count">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Cover Letter</th>
                <th>Resume</th>
                <th>Applied</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, idx) => (
                <tr key={app._id || idx}>
                  <td className="td-center">{idx + 1}</td>
                  <td className="td-title">{app.name || '—'}</td>
                  <td>
                    <a href={`mailto:${app.email}`} className="table-link">
                      {app.email || '—'}
                    </a>
                  </td>
                  <td>{app.phone || '—'}</td>
                  <td title={app.coverLetter}>{truncate(app.coverLetter)}</td>
                  <td>
                    {app.resumeUrl || app.resume ? (
                      <a
                        href={app.resumeUrl || app.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn action-btn--view"
                        title="Download Resume"
                      >
                        <FaDownload />
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{formatDate(app.appliedAt || app.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminApplicants;
