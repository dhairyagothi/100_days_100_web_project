import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBriefcase,
  FaClock,
  FaRegHeart,
  FaHeart,
  FaArrowLeft,
  FaUsers,
  FaGraduationCap,
  FaLanguage,
  FaCalendarAlt,
} from 'react-icons/fa';
import { getJob } from '../services/api.js';
import { FALLBACK_JOBS } from '../services/mockData.js';
import ApplyModal from '../components/ApplyModal.jsx';
import toast from 'react-hot-toast';

function getSavedIds() {
  try {
    return JSON.parse(localStorage.getItem('savedJobIds')) || [];
  } catch {
    return [];
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [savedIds, setSavedIds] = useState(getSavedIds);

  useEffect(() => {
    let cancelled = false;
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await getJob(id);
        const jobData = data.job || data;
        if (!cancelled) {
          if (!jobData || !jobData._id) {
            setNotFound(true);
          } else {
            setJob(jobData);
          }
        }
      } catch (err) {
        console.warn('API error, using offline details fallback:', err);
        if (!cancelled) {
          const localJob = FALLBACK_JOBS.find((j) => j._id === id);
          if (localJob) {
            setJob(localJob);
          } else {
            setNotFound(true);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchJob();
    return () => { cancelled = true; };
  }, [id]);

  const isSaved = job && savedIds.includes(job._id);

  const toggleSave = () => {
    if (!job) return;
    setSavedIds((prev) => {
      let next;
      if (prev.includes(job._id)) {
        next = prev.filter((x) => x !== job._id);
        toast('Removed from saved jobs', { icon: '💔' });
      } else {
        next = [...prev, job._id];
        toast.success('Job saved!');
      }
      localStorage.setItem('savedJobIds', JSON.stringify(next));
      return next;
    });
  };

  if (loading) {
    return (
      <div className="detail-page">
        <div className="spinner-container">
          <div className="spinner" />
          <p>Loading job details…</p>
        </div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="detail-page">
        <div className="empty-state">
          <h2>Job Not Found</h2>
          <p>The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="btn">
            <FaArrowLeft /> Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const requirements = job.requirements || {};
  const qualifications = job.qualifications || [];
  const skills = job.skills || [];
  const benefits = job.benefits || [];

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">
        <FaArrowLeft /> Back to all jobs
      </Link>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-header-left">
            <img
              src={
                job.companyLogo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'Co')}&background=000&color=fff&size=80`
              }
              alt={`${job.company} logo`}
              className="detail-logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'Co')}&background=000&color=fff&size=80`;
              }}
            />
            <div>
              <h3 className="detail-title">{job.title}</h3>
              <p className="detail-company">{job.company}</p>
              <p className="detail-location">
                <FaMapMarkerAlt className="icon-inline" /> {job.location || 'Remote'}
              </p>
            </div>
          </div>

          <div className="detail-header-actions">
            <button
              className={`btn-save-detail ${isSaved ? 'saved' : ''}`}
              onClick={toggleSave}
              title={isSaved ? 'Unsave' : 'Save'}
            >
              {isSaved ? <FaHeart /> : <FaRegHeart />}
              {isSaved ? ' Saved' : ' Save'}
            </button>
          </div>
        </div>

        {/* Basic details box */}
        <div className="basic-details">
          {job.salary && (
            <div className="basic-detail-item">
              <FaRupeeSign className="icon-inline" />
              <div>
                <span className="basic-label">Salary</span>
                <span className="basic-value">{job.salary}</span>
              </div>
            </div>
          )}
          {job.jobType && (
            <div className="basic-detail-item">
              <FaBriefcase className="icon-inline" />
              <div>
                <span className="basic-label">Job Type</span>
                <span className="basic-value">{job.jobType}</span>
              </div>
            </div>
          )}
          {job.shift && (
            <div className="basic-detail-item">
              <FaClock className="icon-inline" />
              <div>
                <span className="basic-label">Schedule</span>
                <span className="basic-value">{job.shift}</span>
              </div>
            </div>
          )}
          {(benefits.length > 0 || job.benefits) && (
            <div className="basic-detail-item">
              <span className="icon-inline">🎁</span>
              <div>
                <span className="basic-label">Benefits</span>
                <span className="basic-value">
                  {Array.isArray(benefits) ? benefits.join(', ') : job.benefits}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Requirements */}
        {(requirements.education || requirements.age || requirements.language || requirements.experience) && (
          <div className="detail-section">
            <h4 className="detail-section-title">Requirements</h4>
            <ul className="detail-list">
              {requirements.education && (
                <li><FaGraduationCap className="icon-inline" /> <strong>Education:</strong> {requirements.education}</li>
              )}
              {requirements.age && (
                <li><FaUsers className="icon-inline" /> <strong>Age:</strong> {requirements.age}</li>
              )}
              {requirements.language && (
                <li><FaLanguage className="icon-inline" /> <strong>Language:</strong> {requirements.language}</li>
              )}
              {requirements.experience && (
                <li><FaBriefcase className="icon-inline" /> <strong>Experience:</strong> {requirements.experience}</li>
              )}
            </ul>
          </div>
        )}

        {/* Qualifications */}
        {qualifications.length > 0 && (
          <div className="detail-section">
            <h4 className="detail-section-title">Qualifications</h4>
            <ul className="detail-list">
              {qualifications.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="detail-section">
            <h4 className="detail-section-title">Skills</h4>
            <div className="skills-tags">
              {skills.map((s, i) => (
                <span key={i} className="skill-tag">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {job.description && (
          <div className="detail-section">
            <h4 className="detail-section-title">Job Description</h4>
            <p className="detail-description">{job.description}</p>
          </div>
        )}

        {/* Footer meta */}
        <div className="detail-meta">
          {job.openings && (
            <span className="meta-item">
              <FaUsers className="icon-inline" /> {job.openings} Opening{job.openings > 1 ? 's' : ''}
            </span>
          )}
          <span className="meta-item">
            <FaCalendarAlt className="icon-inline" /> Posted {formatDate(job.postedAt || job.createdAt)}
          </span>
        </div>

        <div className="detail-actions">
          <button className="btn btn-apply" onClick={() => setModalOpen(true)}>
            Apply Now
          </button>
        </div>
      </div>

      <ApplyModal job={job} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default JobDetailPage;
