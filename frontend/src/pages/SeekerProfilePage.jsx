import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import ProfileEditModal from '../components/ProfileEditModal';

export default function SeekerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchData = () => {
    Promise.all([
      api.get('/profile/seeker'),
      api.get('/resumes/my'),
    ]).then(([pRes, rRes]) => {
      setProfile(pRes.data);
      setResumes(rRes.data || []);
    }).catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="loading-screen"><div className="loader" /></div>;

  const completeness = profile?.profileCompleteness ?? 0;
  const currentResume = resumes[0];

  return (
    <div className="page-container">
      <div className="profile-page-grid">

        {/* Left: Profile summary card */}
        <div className="profile-summary-card">
          <div className="profile-avatar">
            {(profile?.fullName || 'U').charAt(0).toUpperCase()}
          </div>
          <h2 className="profile-name">{profile?.fullName || 'Your Name'}</h2>
          {profile?.headline && <p className="profile-headline">{profile.headline}</p>}
          {profile?.currentLocation && <p className="profile-location">📍 {profile.currentLocation}</p>}

          <div className="open-to-work-badge" data-active={profile?.isOpenToWork}>
            {profile?.isOpenToWork ? '✅ Open to Work' : '🔒 Not Looking'}
          </div>

          <div className="completeness-section">
            <div className="completeness-header">
              <span>Profile Strength</span>
              <span className="completeness-pct">{completeness}%</span>
            </div>
            <div className="completeness-bar">
              <div className="completeness-fill" style={{ width: `${completeness}%` }} />
            </div>
          </div>

          <button className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}
            onClick={() => setShowEditModal(true)}>
            ✏️ Edit Profile
          </button>
        </div>

        {/* Right: Details */}
        <div className="profile-detail-section">
          <div className="profile-section-card">
            <h3>About</h3>
            <div className="profile-info-grid">
              {profile?.phoneNumber && <div className="profile-info-item"><span>📞</span>{profile.phoneNumber}</div>}
              {profile?.experience != null && <div className="profile-info-item"><span>⏱</span>{profile.experience} years experience</div>}
              {profile?.dateOfBirth && <div className="profile-info-item"><span>🎂</span>{new Date(profile.dateOfBirth).toLocaleDateString()}</div>}
            </div>
          </div>

          {profile?.skills && (
            <div className="profile-section-card">
              <h3>Skills</h3>
              <div className="skills-list">
                {profile.skills.split(',').map(s => (
                  <span className="skill-chip" key={s.trim()}>{s.trim()}</span>
                ))}
              </div>
            </div>
          )}

          {profile?.education && (
            <div className="profile-section-card">
              <h3>Education</h3>
              <p className="profile-text">{profile.education}</p>
            </div>
          )}

          {profile?.jobPreferences && (
            <div className="profile-section-card">
              <h3>Job Preferences</h3>
              <p className="profile-text">{profile.jobPreferences}</p>
            </div>
          )}

          <div className="profile-section-card">
            <div className="cv-section-header">
              <h3>CV / Resume</h3>
              <button className="btn btn-outline btn-sm" onClick={() => { setShowEditModal(true); }}>
                {currentResume ? '🔄 Update CV' : '📤 Upload CV'}
              </button>
            </div>
            {currentResume ? (
              <div className="current-cv-card">
                <div className="cv-icon">📄</div>
                <div className="cv-info">
                  <div className="cv-name">{currentResume.fileName}</div>
                  <div className="cv-meta">
                    {new Date(currentResume.uploadDate).toLocaleDateString()} · {(currentResume.fileSize / 1024).toFixed(0)} KB
                  </div>
                </div>
                <a href={`http://localhost:8080/api/resumes/download/${currentResume.resumeId}`}
                  className="btn btn-outline btn-sm" target="_blank" rel="noreferrer">⬇ Download</a>
              </div>
            ) : (
              <div className="no-cv-notice">
                <div className="no-cv-icon">📭</div>
                <p>No CV uploaded yet. Click "Upload CV" above to add one.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <ProfileEditModal
          onClose={() => setShowEditModal(false)}
          onSaved={() => { setShowEditModal(false); fetchData(); }}
        />
      )}
    </div>
  );
}
