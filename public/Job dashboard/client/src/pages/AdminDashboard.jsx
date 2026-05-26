import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaBriefcase,
  FaClipboardList,
  FaCheckCircle,
} from 'react-icons/fa';
import { getJobs, deleteJob, getApplications } from '../services/api.js';
import toast from 'react-hot-toast';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [appCounts, setAppCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      const jobsList = Array.isArray(data) ? data : data.jobs || [];
      setJobs(jobsList);

      // Fetch application counts for each job (best effort)
      const counts = {};
      await Promise.allSettled(
        jobsList.map(async (job) => {
          try {
            const apps = await getApplications(job._id);
            const list = Array.isArray(apps) ? apps : apps.applications || [];
            counts[job._id] = list.length;
          } catch {
            counts[job._id] = 0;
          }
        })
      );
      setAppCounts(counts);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      return;
    }
    setDeleting(jobId);
    try {
      await deleteJob(jobId);
      toast.success('Job deleted successfully');
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete job';
      toast.error(msg);
    } finally {
      setDeleting(null);
    }
  };

  const totalApps = Object.values(appCounts).reduce((sum, c) => sum + c, 0);
  const activeJobs = jobs.filter((j) => j.isActive !== false).length;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/jobs/new" className="btn">
          <FaPlus /> Add New Job
        </Link>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon--jobs">
            <FaBriefcase />
          </div>
          <div className="stat-info">
            <span className="stat-number">{jobs.length}</span>
            <span className="stat-label">Total Jobs</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--apps">
            <FaClipboardList />
          </div>
          <div className="stat-info">
            <span className="stat-number">{totalApps}</span>
            <span className="stat-label">Total Applications</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--active">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-number">{activeJobs}</span>
            <span className="stat-label">Active Jobs</span>
          </div>
        </div>
      </div>

      {/* Jobs table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="spinner-container">
            <div className="spinner" />
            <p>Loading…</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs created yet.</p>
            <Link to="/admin/jobs/new" className="btn">
              Create your first job
            </Link>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Type</th>
                <th>Status</th>
                <th>Applicants</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="td-title">{job.title}</td>
                  <td>{job.company}</td>
                  <td>
                    <span className="badge">{job.jobType || '—'}</span>
                  </td>
                  <td>
                    <span className={`badge ${job.isActive === false ? 'badge--inactive' : 'badge--active'}`}>
                      {job.isActive === false ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                  <td className="td-center">{appCounts[job._id] ?? '—'}</td>
                  <td>{formatDate(job.postedAt || job.createdAt)}</td>
                  <td className="td-actions">
                    <Link to={`/admin/jobs/${job._id}/edit`} className="action-btn action-btn--edit" title="Edit">
                      <FaEdit />
                    </Link>
                    <Link to={`/admin/jobs/${job._id}/applicants`} className="action-btn action-btn--view" title="View Applicants">
                      <FaUsers />
                    </Link>
                    <button
                      className="action-btn action-btn--delete"
                      title="Delete"
                      onClick={() => handleDelete(job._id, job.title)}
                      disabled={deleting === job._id}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
