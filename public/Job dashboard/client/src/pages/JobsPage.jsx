import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getJobs } from '../services/api.js';
import { FALLBACK_JOBS } from '../services/mockData.js';
import JobCard from '../components/JobCard.jsx';
import JobFilter from '../components/JobFilter.jsx';
import toast from 'react-hot-toast';

const defaultFilters = {
  title: '',
  category: '',
  location: '',
  datePosted: '',
  salary: '',
  jobType: '',
  education: '',
  shift: '',
  sortBy: '',
};

function getSavedIds() {
  try {
    const raw = localStorage.getItem('savedJobIds');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Strip empty-string keys so they are not sent as query params
function buildParams(filters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== '')
  );
}

// Client-side local filtering logic for offline fallback mode
function applyLocalFilters(jobsArray, f) {
  let result = [...jobsArray];

  // Title / company search
  if (f.title) {
    const q = f.title.toLowerCase();
    result = result.filter(
      (j) =>
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.company && j.company.toLowerCase().includes(q))
    );
  }

  // Category
  if (f.category) {
    const q = f.category.toLowerCase();
    result = result.filter((j) => j.category && j.category.toLowerCase() === q);
  }

  // Location
  if (f.location) {
    const q = f.location.toLowerCase();
    result = result.filter((j) => j.location && j.location.toLowerCase().includes(q));
  }

  // Date posted
  if (f.datePosted) {
    const days = parseInt(f.datePosted, 10);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    result = result.filter((j) => {
      const d = new Date(j.postedAt || j.createdAt || new Date());
      return d >= cutoff;
    });
  }

  // Salary range match
  if (f.salary) {
    const [minStr, maxStr] = f.salary.split('-');
    const sMin = parseFloat(minStr) || 0;
    const sMax = maxStr === 'Infinity' ? Infinity : parseFloat(maxStr) || Infinity;
    result = result.filter((j) => {
      const jMin = j.salaryMin || 0;
      const jMax = j.salaryMax || jMin;
      return jMax >= sMin && jMin <= sMax;
    });
  }

  // Job type
  if (f.jobType) {
    const q = f.jobType.toLowerCase();
    result = result.filter((j) => j.jobType && j.jobType.toLowerCase() === q);
  }

  // Education
  if (f.education) {
    const q = f.education.toLowerCase();
    result = result.filter((j) => {
      const edu = j.education || j.requirements?.education || '';
      return edu.toLowerCase().includes(q);
    });
  }

  // Shift
  if (f.shift) {
    const q = f.shift.toLowerCase();
    result = result.filter((j) => j.shift && j.shift.toLowerCase() === q);
  }

  // Sort
  if (f.sortBy === 'salary_asc') {
    result.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
  } else if (f.sortBy === 'salary_desc') {
    result.sort((a, b) => (b.salaryMin || 0) - (a.salaryMin || 0));
  } else if (f.sortBy === 'newest') {
    result.sort((a, b) => new Date(b.postedAt || b.createdAt || new Date()) - new Date(a.postedAt || a.createdAt || new Date()));
  } else if (f.sortBy === 'title_az') {
    result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  }

  return result;
}

function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [savedIds, setSavedIds] = useState(getSavedIds);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchJobs = useCallback(async (activeFilters) => {
    setLoading(true);
    try {
      const params = buildParams(activeFilters);
      const data = await getJobs(params);
      setJobs(Array.isArray(data) ? data : data.jobs || []);
    } catch (err) {
      console.warn('API error, using offline seed fallback data:', err);
      // Run local client-side filter fallback
      const localResult = applyLocalFilters(FALLBACK_JOBS, activeFilters);
      setJobs(localResult);
      toast('Demo Mode: Showing offline backup listings.', { id: 'offline-fallback-toast', icon: 'ℹ️' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load — fetch all jobs with no filters
  useEffect(() => {
    fetchJobs(defaultFilters);
  }, [fetchJobs]);

  // Scroll to saved section if hash is #saved
  useEffect(() => {
    if (location.hash === '#saved') {
      setTimeout(() => {
        const el = document.getElementById('saved');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location]);

  // Called when user clicks "Apply Filters"
  const handleFilterChange = useCallback(
    (f) => {
      setFilters(f);
      fetchJobs(f);
    },
    [fetchJobs]
  );

  const toggleSave = (jobId) => {
    setSavedIds((prev) => {
      const next = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      if (prev.includes(jobId)) toast('Job removed from saved', { icon: '💔' });
      else toast.success('Job saved!');
      localStorage.setItem('savedJobIds', JSON.stringify(next));
      return next;
    });
  };

  const savedJobs = jobs.filter((j) => savedIds.includes(j._id));

  return (
    <div className="jobs-page">
      <JobFilter onFilterChange={handleFilterChange} filters={filters} />

      <section className="jobs-section">
        <h2 className="section-title">
          {loading
            ? 'Loading jobs…'
            : `${jobs.length} Job${jobs.length !== 1 ? 's' : ''} Found`}
        </h2>

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-line skeleton-line--lg" />
                <div className="skeleton-line skeleton-line--md" />
                <div className="skeleton-line skeleton-line--sm" />
                <div className="skeleton-line skeleton-line--xs" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <p>No jobs match your filters. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job, index) => (
              <div key={job._id} className="job-card-wrapper" style={{ animationDelay: `${index * 0.06}s` }}>
                <JobCard
                  job={job}
                  isSaved={savedIds.includes(job._id)}
                  onSaveToggle={toggleSave}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="saved-section" id="saved">
        <h2 className="section-title">❤️ Saved Jobs</h2>
        {savedJobs.length === 0 ? (
          <div className="empty-state">
            <p>No saved jobs yet. Click the heart icon on a job card to save it.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {savedJobs.map((job, index) => (
              <div key={job._id} className="job-card-wrapper" style={{ animationDelay: `${index * 0.06}s` }}>
                <JobCard
                  job={job}
                  isSaved={true}
                  onSaveToggle={toggleSave}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default JobsPage;
