import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs').then(res => setJobs(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchSearch = !q || j.jobTitle?.toLowerCase().includes(q) || j.jobLocation?.toLowerCase().includes(q);
    const matchType = !filterType || j.employmentType === filterType;
    const matchMode = !filterMode || j.workMode === filterMode;
    return matchSearch && matchType && matchMode;
  });

  if (loading) return <div className="loading-screen"><div className="loader" /><p>Loading jobs...</p></div>;

  return (
    <div className="page-container">
      <div className="page-hero">
        <h1>Find Your Job</h1>
        <p>{jobs.length} opportunities waiting for you</p>
      </div>

      <div className="filter-bar">
        <input className="search-input" placeholder="🔍 Search by title or location..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ flex: 1 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select style={{ flex: 1 }} value={filterMode} onChange={e => setFilterMode(e.target.value)}>
          <option value="">All Modes</option>
          {['On-site', 'Remote', 'Hybrid'].map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔎</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="job-grid">
          {filtered.map(job => (
            <div className="job-card" key={job.jobId} onClick={() => navigate(`/jobs/${job.jobId}`)}>
              <div className="job-card-header">
                <h3 className="job-title">{job.jobTitle}</h3>
                <span className={`status-badge status-${job.jobStatus?.toLowerCase()}`}>{job.jobStatus}</span>
              </div>
              <p className="job-location">📍 {job.jobLocation}</p>
              <div className="job-tags">
                <span className="tag">{job.employmentType}</span>
                <span className="tag">{job.workMode}</span>
              </div>
              <div className="job-salary">
                💰 ${job.salaryMin?.toLocaleString()} – ${job.salaryMax?.toLocaleString()}
              </div>
              <div className="job-footer">
                <span className="job-date">
                  Posted {new Date(job.postedAt).toLocaleDateString()}
                </span>
                <button className="btn btn-primary btn-sm">View Details →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
