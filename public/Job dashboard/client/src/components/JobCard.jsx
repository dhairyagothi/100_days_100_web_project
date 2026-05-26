import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaRupeeSign, FaRegHeart, FaHeart } from 'react-icons/fa';

function getRelativeTime(dateString) {
  if (!dateString) return 'recently';
  const now = new Date();
  const posted = new Date(dateString);
  const diffMs = now - posted;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffDay === 0) return 'Posted today';
  if (diffDay === 1) return '1 day ago';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffWeek === 1) return '1 week ago';
  if (diffWeek < 4) return `${diffWeek} weeks ago`;
  if (diffMonth === 1) return '1 month ago';
  return `${diffMonth} months ago`;
}

function JobCard({ job, onSaveToggle, isSaved }) {
  const logoSrc =
    job.companyLogo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'Co')}&background=000&color=fff&size=60`;

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-card-company-info">
          <img
            src={logoSrc}
            alt={`${job.company} logo`}
            className="job-card-logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company || 'Co')}&background=000&color=fff&size=60`;
            }}
          />
          <div>
            <h4 className="job-card-company">{job.company}</h4>
            <span className="job-card-time">
              <FaClock className="icon-inline" /> {getRelativeTime(job.postedAt || job.createdAt)}
            </span>
          </div>
        </div>
        <button
          className="job-card-save-btn"
          onClick={() => onSaveToggle && onSaveToggle(job._id)}
          title={isSaved ? 'Unsave job' : 'Save job'}
          aria-label={isSaved ? 'Unsave job' : 'Save job'}
        >
          {isSaved ? (
            <FaHeart className="heart-icon saved" />
          ) : (
            <FaRegHeart className="heart-icon" />
          )}
        </button>
      </div>

      <h3 className="job-card-title">{job.title}</h3>

      <p className="job-card-location">
        <FaMapMarkerAlt className="icon-inline" /> {job.location || 'Remote'}
      </p>

      <div className="job-card-tags">
        {job.salary && (
          <span className="job-tag">
            <FaRupeeSign className="icon-inline" /> {job.salary}
          </span>
        )}
        {job.jobType && (
          <span className="job-tag">
            <FaBriefcase className="icon-inline" /> {job.jobType}
          </span>
        )}
        {job.shift && (
          <span className="job-tag">{job.shift}</span>
        )}
      </div>

      <div className="job-card-footer">
        <Link to={`/jobs/${job._id}`} className="btn btn-view">
          View details
        </Link>
      </div>
    </div>
  );
}

export default JobCard;
