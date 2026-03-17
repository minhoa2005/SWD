import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const WORK_MODES = ['On-site', 'Remote', 'Hybrid'];

const initialForm = {
  jobTitle: '', jobDesc: '', employmentType: 'Full-time', workMode: 'On-site',
  jobLocation: '', salaryMin: '', salaryMax: '', expiresAt: '',
  requiredSkills: '', experienceRequired: '', educationRequired: ''
};

export default function PostJobPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.jobTitle) e.jobTitle = 'Job title is required';
    if (!form.jobDesc) e.jobDesc = 'Job description is required';
    if (!form.jobLocation) e.jobLocation = 'Location is required';
    if (!form.salaryMin) e.salaryMin = 'Minimum salary is required';
    if (!form.salaryMax) e.salaryMax = 'Maximum salary is required';
    if (parseFloat(form.salaryMin) > parseFloat(form.salaryMax)) e.salaryMax = 'Max salary must be ≥ min salary';
    if (!form.expiresAt) e.expiresAt = 'Expiration date is required';
    if (new Date(form.expiresAt) <= new Date()) e.expiresAt = 'Expiration must be in the future';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const payload = {
        ...form,
        salaryMin: parseFloat(form.salaryMin),
        salaryMax: parseFloat(form.salaryMax),
        experienceRequired: form.experienceRequired ? parseInt(form.experienceRequired) : null,
        expiresAt: new Date(form.expiresAt).toISOString().replace('Z', ''),
      };
      const res = await api.post('/jobs', payload);
      toast.success('Job posted successfully!');
      navigate(`/jobs/${res.data.jobId}`);
    } catch (err) {
      const fieldErrors = err.response?.data?.fieldErrors;
      if (fieldErrors) setErrors(fieldErrors);
      else toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="form-card-header">
          <h1>📋 Post a Job Vacancy</h1>
          <p>Fill in the details to attract the right candidates</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Job Title *</label>
              <input name="jobTitle" value={form.jobTitle} onChange={handleChange}
                placeholder="e.g. Senior Software Engineer" className={errors.jobTitle ? 'error' : ''} />
              {errors.jobTitle && <span className="field-error">{errors.jobTitle}</span>}
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea name="jobDesc" value={form.jobDesc} onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={5} className={errors.jobDesc ? 'error' : ''} />
              {errors.jobDesc && <span className="field-error">{errors.jobDesc}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Job Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Employment Type *</label>
                <select name="employmentType" value={form.employmentType} onChange={handleChange}>
                  {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Work Mode *</label>
                <select name="workMode" value={form.workMode} onChange={handleChange}>
                  {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input name="jobLocation" value={form.jobLocation} onChange={handleChange}
                placeholder="e.g. Ho Chi Minh City, Vietnam" className={errors.jobLocation ? 'error' : ''} />
              {errors.jobLocation && <span className="field-error">{errors.jobLocation}</span>}
            </div>
          </div>

          <div className="form-section">
            <h3>Compensation & Requirements</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Salary Min (USD) *</label>
                <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange}
                  placeholder="e.g. 1000" min="0" className={errors.salaryMin ? 'error' : ''} />
                {errors.salaryMin && <span className="field-error">{errors.salaryMin}</span>}
              </div>
              <div className="form-group">
                <label>Salary Max (USD) *</label>
                <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange}
                  placeholder="e.g. 3000" min="0" className={errors.salaryMax ? 'error' : ''} />
                {errors.salaryMax && <span className="field-error">{errors.salaryMax}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Experience Required (years)</label>
                <input type="number" name="experienceRequired" value={form.experienceRequired}
                  onChange={handleChange} placeholder="e.g. 2" min="0" />
              </div>
              <div className="form-group">
                <label>Education Required</label>
                <input name="educationRequired" value={form.educationRequired} onChange={handleChange}
                  placeholder="e.g. Bachelor's Degree" />
              </div>
            </div>

            <div className="form-group">
              <label>Required Skills (comma-separated)</label>
              <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange}
                placeholder="e.g. Java, Spring Boot, MySQL" />
            </div>

            <div className="form-group">
              <label>Application Deadline *</label>
              <input type="datetime-local" name="expiresAt" value={form.expiresAt}
                onChange={handleChange} className={errors.expiresAt ? 'error' : ''} />
              {errors.expiresAt && <span className="field-error">{errors.expiresAt}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/jobs')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : '🚀 Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
