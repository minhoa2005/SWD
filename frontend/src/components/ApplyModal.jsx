import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import ProfileEditModal from './ProfileEditModal';

export default function ApplyModal({ job, onClose }) {
  const [resumes, setResumes] = useState([]);
  const [form, setForm] = useState({ resumeId: '', coverLetter: '', strategyType: 'UPLOAD_CV' });
  const [loading, setLoading] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const fetchResumes = () => {
    api.get('/resumes/my').then(res => setResumes(res.data)).catch(() => {});
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.strategyType === 'UPLOAD_CV' && resumes.length === 0) {
      toast.warning('Please upload your CV before applying.');
      setShowProfileEdit(true);
      return;
    }
    setLoading(true);
    try {
      await api.post('/applications', { ...form, jobId: job.jobId });
      toast.success('Application submitted successfully! 🎉');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  // Switch to profile edit modal inline
  if (showProfileEdit) {
    return (
      <ProfileEditModal
        onClose={() => setShowProfileEdit(false)}
        onSaved={() => { setShowProfileEdit(false); fetchResumes(); }}
      />
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Apply for Position</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline btn-sm"
              onClick={() => setShowProfileEdit(true)}>
              ✏️ Edit Profile
            </button>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="modal-job-info">
          <div className="modal-job-title">{job.jobTitle}</div>
          <div className="modal-job-meta">📍 {job.jobLocation} · {job.employmentType}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Application Method</label>
            <select value={form.strategyType}
              onChange={e => setForm({ ...form, strategyType: e.target.value })}>
              <option value="UPLOAD_CV">Use Uploaded CV</option>
              <option value="PROFILE">Use Profile Data</option>
            </select>
            <span className="field-hint">
              {form.strategyType === 'UPLOAD_CV'
                ? 'Your uploaded CV file will be attached to this application'
                : 'Your profile skills and experience will be used'}
            </span>
          </div>

          {form.strategyType === 'UPLOAD_CV' && (
            <div className="form-group">
              <label>Select Resume</label>
              {resumes.length > 0 ? (
                <select value={form.resumeId} onChange={e => setForm({ ...form, resumeId: e.target.value })}>
                  <option value="">-- Use default resume --</option>
                  {resumes.map(r => (
                    <option key={r.resumeId} value={r.resumeId}>
                      {r.fileName} (uploaded {new Date(r.uploadDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="no-resume-warning">
                  ⚠️ No CV uploaded.{' '}
                  <a href="#" onClick={e => { e.preventDefault(); setShowProfileEdit(true); }}>
                    Upload your CV here
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>Cover Letter</label>
            <textarea value={form.coverLetter}
              onChange={e => setForm({ ...form, coverLetter: e.target.value })}
              placeholder="Tell the recruiter why you're a great fit for this role..."
              rows={4} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : '🚀 Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
