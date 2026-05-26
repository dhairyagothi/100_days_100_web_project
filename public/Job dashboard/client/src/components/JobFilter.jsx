import { useState } from 'react';

const DATE_OPTIONS = [
  { value: '', label: 'Any time' },
  { value: '1', label: 'Today' },
  { value: '3', label: 'Last 3 days' },
  { value: '7', label: 'Last 7 days' },
  { value: '15', label: 'Last 15 days' },
  { value: '30', label: 'Last 30 days' },
];

const SALARY_OPTIONS = [
  { value: '', label: 'Any salary' },
  { value: '0-1000', label: '1k or less' },
  { value: '1000-5000', label: '1k – 5k' },
  { value: '5000-10000', label: '5k – 10k' },
  { value: '10000-20000', label: '10k – 20k' },
  { value: '20000-30000', label: '20k – 30k' },
  { value: '30000-40000', label: '30k – 40k' },
  { value: '40000-50000', label: '40k – 50k' },
  { value: '50000-100000', label: '50k – 1 lakh' },
  { value: '100000-500000', label: '1 lakh – 5 lakh' },
  { value: '500000-Infinity', label: '5 lakh+' },
];

const JOB_TYPE_OPTIONS = [
  { value: '', label: 'Any type' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'fresher', label: 'Fresher' },
];

const EDUCATION_OPTIONS = [
  { value: '', label: 'Any education' },
  { value: '10th pass', label: '10th Pass' },
  { value: '12th pass', label: '12th Pass' },
  { value: "bachelor's degree", label: "Bachelor's Degree" },
  { value: "master's degree", label: "Master's Degree" },
  { value: 'pg', label: 'PG' },
  { value: 'diploma', label: 'Diploma' },
];

const SHIFT_OPTIONS = [
  { value: '', label: 'Any shift' },
  { value: 'day shift', label: 'Day Shift' },
  { value: 'night shift', label: 'Night Shift' },
  { value: 'flexible shift', label: 'Flexible Shift' },
  { value: 'fixed shift', label: 'Fixed Shift' },
];

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'salary_asc', label: 'Salary: Low to High' },
  { value: 'salary_desc', label: 'Salary: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'title_az', label: 'Title: A – Z' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'Engineering & Development', label: 'Engineering & Development' },
  { value: 'Data, AI & Machine Learning', label: 'Data, AI & Machine Learning' },
  { value: 'Operations, Cloud & Infrastructure', label: 'Operations, Cloud & Infrastructure' },
  { value: 'Quality Assurance (QA) & Testing', label: 'Quality Assurance & Testing' },
  { value: 'Design & User Experience (UX)', label: 'Design & UX' },
  { value: 'Management & Strategy', label: 'Management & Strategy' },
];

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

function JobFilter({ onFilterChange, filters: externalFilters }) {
  const [filters, setFilters] = useState(externalFilters || defaultFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <form className="filter-section" onSubmit={handleApply}>
      <h2 className="filter-title">Find Your Perfect Job</h2>

      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="filter-title">Job Title / Company</label>
          <input
            id="filter-title"
            type="text"
            name="title"
            className="input"
            placeholder="e.g. Frontend Developer"
            value={filters.title}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-category">Job Category</label>
          <select
            id="filter-category"
            name="category"
            className="input"
            value={filters.category}
            onChange={handleChange}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-location">Location</label>
          <input
            id="filter-location"
            type="text"
            name="location"
            className="input"
            placeholder="e.g. Mumbai"
            value={filters.location}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-datePosted">Date Posted</label>
          <select
            id="filter-datePosted"
            name="datePosted"
            className="input"
            value={filters.datePosted}
            onChange={handleChange}
          >
            {DATE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-salary">Salary Range</label>
          <select
            id="filter-salary"
            name="salary"
            className="input"
            value={filters.salary}
            onChange={handleChange}
          >
            {SALARY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-jobType">Job Type</label>
          <select
            id="filter-jobType"
            name="jobType"
            className="input"
            value={filters.jobType}
            onChange={handleChange}
          >
            {JOB_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-education">Education</label>
          <select
            id="filter-education"
            name="education"
            className="input"
            value={filters.education}
            onChange={handleChange}
          >
            {EDUCATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-shift">Shift</label>
          <select
            id="filter-shift"
            name="shift"
            className="input"
            value={filters.shift}
            onChange={handleChange}
          >
            {SHIFT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-sortBy">Sort By</label>
          <select
            id="filter-sortBy"
            name="sortBy"
            className="input"
            value={filters.sortBy}
            onChange={handleChange}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn">
          Apply Filters
        </button>
        <button type="button" className="btn btn-outline" onClick={handleReset}>
          Reset Filters
        </button>
      </div>
    </form>
  );
}

export default JobFilter;
