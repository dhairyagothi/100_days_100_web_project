import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { getJob, createJob, updateJob } from '../services/api.js';
import toast from 'react-hot-toast';

const JOB_TYPE_OPTIONS = [
  'full-time',
  'part-time',
  'internship',
  'contract',
  'temporary',
  'fresher',
];

const SHIFT_OPTIONS = [
  'day shift',
  'night shift',
  'flexible shift',
  'fixed shift',
];

const emptyForm = {
  title: '',
  company: '',
  location: '',
  salary: '',
  salaryMin: '',
  salaryMax: '',
  category: 'Engineering & Development',
  jobType: 'full-time',
  shift: 'day shift',
  education: '',
  skills: '',
  requirementsEducation: '',
  requirementsAge: '',
  requirementsLanguage: '',
  requirementsExperience: '',
  qualifications: '',
  benefits: '',
  description: '',
  openings: 1,
  companyLogo: '',
};

function AdminJobForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;
    let cancelled = false;
    const fetchJob = async () => {
      setFetching(true);
      try {
        const data = await getJob(id);
        const job = data.job || data;
        if (!cancelled && job) {
          setForm({
            title: job.title || '',
            category: job.category || 'Engineering & Development',
            company: job.company || '',
            location: job.location || '',
            salary: job.salary || '',
            salaryMin: job.salaryMin ?? '',
            salaryMax: job.salaryMax ?? '',
            jobType: job.jobType || 'full-time',
            shift: job.shift || 'day shift',
            education: job.education || '',
            skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
            requirementsEducation: job.requirements?.education || '',
            requirementsAge: job.requirements?.age || '',
            requirementsLanguage: job.requirements?.language || '',
            requirementsExperience: job.requirements?.experience || '',
            qualifications: Array.isArray(job.qualifications) ? job.qualifications.join('\n') : job.qualifications || '',
            benefits: Array.isArray(job.benefits) ? job.benefits.join(', ') : job.benefits || '',
            description: job.description || '',
            openings: job.openings ?? 1,
            companyLogo: job.companyLogo || '',
          });
        }
      } catch {
        toast.error('Failed to load job data');
        navigate('/admin/dashboard');
      } finally {
        if (!cancelled) setFetching(false);
      }
    };
    fetchJob();
    return () => { cancelled = true; };
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company) {
      toast.error('Title and Company are required');
      return;
    }

    const payload = {
      title: form.title,
      category: form.category,
      company: form.company,
      location: form.location,
      salary: form.salary,
      salaryMin: form.salaryMin === '' ? undefined : Number(form.salaryMin),
      salaryMax: form.salaryMax === '' ? undefined : Number(form.salaryMax),
      jobType: form.jobType,
      shift: form.shift,
      education: form.education,
      skills: form.skills
        ? form.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      requirements: {
        education: form.requirementsEducation,
        age: form.requirementsAge,
        language: form.requirementsLanguage,
        experience: form.requirementsExperience,
      },
      qualifications: form.qualifications
        ? form.qualifications.split('\n').map((s) => s.trim()).filter(Boolean)
        : [],
      benefits: form.benefits
        ? form.benefits.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      description: form.description,
      openings: form.openings || 1,
      companyLogo: form.companyLogo,
    };

    setLoading(true);
    try {
      if (isEditing) {
        await updateJob(id, payload);
        toast.success('Job updated successfully!');
      } else {
        await createJob(payload);
        toast.success('Job created successfully!');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to save job';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="admin-form-page">
        <div className="spinner-container">
          <div className="spinner" />
          <p>Loading job data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-form-page">
      <div className="admin-form-header">
        <Link to="/admin/dashboard" className="back-link">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1>{isEditing ? 'Edit Job' : 'Create New Job'}</h1>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* Row 1: Title, Company */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="af-title">Job Title *</label>
            <input id="af-title" type="text" name="title" className="input" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="af-category">Job Category *</label>
            <select id="af-category" name="category" className="input" value={form.category} onChange={handleChange} required>
              <option value="Engineering & Development">Engineering & Development</option>
              <option value="Data, AI & Machine Learning">Data, AI & Machine Learning</option>
              <option value="Operations, Cloud & Infrastructure">Operations, Cloud & Infrastructure</option>
              <option value="Quality Assurance (QA) & Testing">Quality Assurance (QA) & Testing</option>
              <option value="Design & User Experience (UX)">Design & User Experience (UX)</option>
              <option value="Management & Strategy">Management & Strategy</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="af-company">Company *</label>
            <input id="af-company" type="text" name="company" className="input" value={form.company} onChange={handleChange} required />
          </div>
        </div>

        {/* Row 2: Location, Company Logo */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="af-location">Location</label>
            <input id="af-location" type="text" name="location" className="input" placeholder="e.g. Mumbai, India" value={form.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="af-logo">Company Logo URL</label>
            <input id="af-logo" type="text" name="companyLogo" className="input" placeholder="https://…" value={form.companyLogo} onChange={handleChange} />
          </div>
        </div>

        {/* Row 3: Salary display, min, max */}
        <div className="form-row form-row--3">
          <div className="form-group">
            <label htmlFor="af-salary">Salary Display</label>
            <input id="af-salary" type="text" name="salary" className="input" placeholder="e.g. ₹15,000 – ₹25,000 / month" value={form.salary} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="af-salaryMin">Salary Min (₹)</label>
            <input id="af-salaryMin" type="number" name="salaryMin" className="input" value={form.salaryMin} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="af-salaryMax">Salary Max (₹)</label>
            <input id="af-salaryMax" type="number" name="salaryMax" className="input" value={form.salaryMax} onChange={handleChange} />
          </div>
        </div>

        {/* Row 4: Job Type, Shift, Education */}
        <div className="form-row form-row--3">
          <div className="form-group">
            <label htmlFor="af-jobType">Job Type</label>
            <select id="af-jobType" name="jobType" className="input" value={form.jobType} onChange={handleChange}>
              {JOB_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="af-shift">Shift</label>
            <select id="af-shift" name="shift" className="input" value={form.shift} onChange={handleChange}>
              {SHIFT_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="af-education">Education</label>
            <input id="af-education" type="text" name="education" className="input" placeholder="e.g. Bachelor's Degree" value={form.education} onChange={handleChange} />
          </div>
        </div>

        {/* Row 5: Skills, Openings */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="af-skills">Skills (comma-separated)</label>
            <input id="af-skills" type="text" name="skills" className="input" placeholder="React, Node.js, MongoDB" value={form.skills} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ maxWidth: '16rem' }}>
            <label htmlFor="af-openings">Openings</label>
            <input id="af-openings" type="number" name="openings" className="input" min="1" value={form.openings} onChange={handleChange} />
          </div>
        </div>

        {/* Requirements sub-fields */}
        <fieldset className="form-fieldset">
          <legend>Requirements</legend>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="af-reqEdu">Education</label>
              <input id="af-reqEdu" type="text" name="requirementsEducation" className="input" value={form.requirementsEducation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="af-reqAge">Age</label>
              <input id="af-reqAge" type="text" name="requirementsAge" className="input" placeholder="e.g. 18 – 35 years" value={form.requirementsAge} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="af-reqLang">Language</label>
              <input id="af-reqLang" type="text" name="requirementsLanguage" className="input" placeholder="e.g. English, Hindi" value={form.requirementsLanguage} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="af-reqExp">Experience</label>
              <input id="af-reqExp" type="text" name="requirementsExperience" className="input" placeholder="e.g. 2+ years" value={form.requirementsExperience} onChange={handleChange} />
            </div>
          </div>
        </fieldset>

        {/* Qualifications */}
        <div className="form-group">
          <label htmlFor="af-quals">Qualifications (one per line)</label>
          <textarea id="af-quals" name="qualifications" className="input textarea" rows={4} placeholder="Strong communication skills&#10;Team player&#10;Problem-solving ability" value={form.qualifications} onChange={handleChange} />
        </div>

        {/* Benefits */}
        <div className="form-group">
          <label htmlFor="af-benefits">Benefits (comma-separated)</label>
          <input id="af-benefits" type="text" name="benefits" className="input" placeholder="Health insurance, PTO, Remote" value={form.benefits} onChange={handleChange} />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="af-desc">Job Description</label>
          <textarea id="af-desc" name="description" className="input textarea" rows={6} placeholder="Describe the role, responsibilities, and what you're looking for…" value={form.description} onChange={handleChange} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={loading}>
            <FaSave /> {loading ? 'Saving…' : isEditing ? 'Update Job' : 'Create Job'}
          </button>
          <Link to="/admin/dashboard" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AdminJobForm;
