import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/jobs/${id}`).then(res => setJob(res.data)).catch(() => {
      toast.error('Job not found'); navigate('/jobs');
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="loader" /></div>;
  if (!job) return null;

  return (
    <div className="page-container">
      <div className="job-detail-card">
        <div className="job-detail-header">
          <div>
            <h1 className="job-detail-title">{job.jobTitle}</h1>
            <p className="job-detail-meta">
              📍 {job.jobLocation} &nbsp;|&nbsp;
              <span className="tag">{job.employmentType}</span> &nbsp;
              <span className="tag">{job.workMode}</span>
            </p>
          </div>
          <div className="job-detail-salary">
            <div className="salary-amount">
              ${job.salaryMin?.toLocaleString()} – ${job.salaryMax?.toLocaleString()}
              <span>/month</span>
            </div>
          </div>
        </div>

        <div className="info-grid">
          {job.experienceRequired && (
            <div className="info-item">
              <span className="info-label">Experience</span>
              <span className="info-value">{job.experienceRequired}+ years</span>
            </div>
          )}
          {job.educationRequired && (
            <div className="info-item">
              <span className="info-label">Education</span>
              <span className="info-value">{job.educationRequired}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">Deadline</span>
            <span className="info-value">{job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status</span>
            <span className={`status-badge status-${job.jobStatus?.toLowerCase()}`}>{job.jobStatus}</span>
          </div>
        </div>

        {job.requiredSkills && (
          <div className="detail-section">
            <h3>Required Skills</h3>
            <div className="skills-list">
              {job.requiredSkills.split(',').map(s => (
                <span className="skill-chip" key={s.trim()}>{s.trim()}</span>
              ))}
            </div>
          </div>
        )}

        <div className="detail-section">
          <h3>Job Description</h3>
          <div className="job-desc">{job.jobDesc}</div>
        </div>

        <div className="detail-actions">
          <button className="btn btn-outline" onClick={() => navigate('/jobs')}>← Back to Jobs</button>
          {user?.role === 'SEEKER' && job.jobStatus === 'Active' && (
            <button className="btn btn-primary btn-lg" onClick={() => setShowApply(true)}>
              🚀 Apply Now
            </button>
          )}
          {!user && (
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
              Login to Apply
            </button>
          )}
        </div>
      </div>

      {showApply && (
        <ApplyModal job={job} onClose={() => setShowApply(false)} />
      )}
    </div>
  );
}
