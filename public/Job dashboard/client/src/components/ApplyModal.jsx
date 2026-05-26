import { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { submitApplication } from '../services/api.js';
import toast from 'react-hot-toast';

function ApplyModal({ job, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('coverLetter', formData.coverLetter);
      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      await submitApplication(job._id, data);
      toast.success('Application submitted successfully!');
      setFormData({ name: '', email: '', phone: '', coverLetter: '' });
      setResumeFile(null);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to submit application';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-card">
        <div className="modal-header">
          <h2>Apply for {job?.title}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <p className="modal-subtitle">{job?.company}</p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="apply-name">Full Name *</label>
            <input
              id="apply-name"
              type="text"
              name="name"
              className="input"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apply-email">Email *</label>
            <input
              id="apply-email"
              type="email"
              name="email"
              className="input"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apply-phone">Phone *</label>
            <input
              id="apply-phone"
              type="tel"
              name="phone"
              className="input"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apply-cover">Cover Letter</label>
            <textarea
              id="apply-cover"
              name="coverLetter"
              className="input textarea"
              placeholder="Tell us why you're a great fit…"
              rows={4}
              value={formData.coverLetter}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apply-resume">Resume</label>
            <input
              id="apply-resume"
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              className="input file-input"
              onChange={handleFileChange}
            />
            {resumeFile && (
              <span className="file-name">{resumeFile.name}</span>
            )}
          </div>

          <button type="submit" className="btn btn-full" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyModal;
