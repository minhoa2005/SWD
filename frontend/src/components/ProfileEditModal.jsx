import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';

/**
 * ProfileEditModal — shown to SEEKERs when they click "Edit Profile" in ApplyModal.
 * Tab 1: Personal Info  (PUT /api/profile/seeker)
 * Tab 2: Upload CV      (POST /api/resumes/upload)
 */
export default function ProfileEditModal({ onClose, onSaved }) {
  const [tab, setTab] = useState('info');
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // CV upload state
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentResume, setCurrentResume] = useState(null);

  useEffect(() => {
    api.get('/profile/seeker').then(r => {
      setProfile(r.data);
      setForm({
        fullName: r.data.fullName || '',
        phoneNumber: r.data.phoneNumber || '',
        currentLocation: r.data.currentLocation || '',
        headline: r.data.headline || '',
        skills: r.data.skills || '',
        education: r.data.education || '',
        experience: r.data.experience ?? '',
        jobPreferences: r.data.jobPreferences || '',
        isOpenToWork: r.data.isOpenToWork ?? true,
      });
    }).catch(() => toast.error('Failed to load profile'));

    api.get('/resumes/my').then(r => setCurrentResume(r.data?.[0] || null)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      await api.put('/profile/seeker', {
        ...form,
        experience: form.experience ? parseInt(form.experience) : null,
      });
      toast.success('Profile updated! ✅');
      onSaved?.();
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) { toast.error('Only PDF or DOCX allowed'); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error('File must be under 5MB'); return; }
    setFile(f);
  };

  const handleUploadCV = async () => {
    if (!file) { toast.warning('Please select a file first.'); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      await api.post('/resumes/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('CV updated! ✅');
      setFile(null);
      const r = await api.get('/resumes/my');
      setCurrentResume(r.data?.[0] || null);
      onSaved?.();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const completeness = profile?.profileCompleteness ?? 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Edit My Profile</h2>
            {profile && (
              <div className="completeness-bar-wrap">
                <div className="completeness-bar">
                  <div className="completeness-fill" style={{ width: `${completeness}%` }} />
                </div>
                <span className="completeness-label">{completeness}% complete</span>
              </div>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-tabs">
          <button className={`tab-btn ${tab === 'info' ? 'active' : ''}`} onClick={() => setTab('info')}>👤 Personal Info</button>
          <button className={`tab-btn ${tab === 'cv' ? 'active' : ''}`} onClick={() => setTab('cv')}>📄 CV / Resume</button>
        </div>

        {tab === 'info' && (
          <div className="profile-edit-body">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input name="fullName" value={form.fullName || ''} onChange={handleChange} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} placeholder="+84..." />
              </div>
            </div>

            <div className="form-group">
              <label>Headline</label>
              <input name="headline" value={form.headline || ''} onChange={handleChange} placeholder="e.g. Senior Java Developer @ XYZ" />
            </div>

            <div className="form-group">
              <label>Current Location</label>
              <input name="currentLocation" value={form.currentLocation || ''} onChange={handleChange} placeholder="e.g. Ho Chi Minh City" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Years of Experience</label>
                <input type="number" name="experience" value={form.experience ?? ''} onChange={handleChange} placeholder="e.g. 3" min="0" />
              </div>
              <div className="form-group align-center">
                <label className="checkbox-label">
                  <input type="checkbox" name="isOpenToWork" checked={form.isOpenToWork ?? true} onChange={handleChange} />
                  <span>Open to Work</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Skills (comma-separated)</label>
              <input name="skills" value={form.skills || ''} onChange={handleChange} placeholder="e.g. Java, Spring Boot, React" />
            </div>

            <div className="form-group">
              <label>Education</label>
              <textarea name="education" value={form.education || ''} onChange={handleChange} rows={2} placeholder="e.g. Bachelor's in Computer Science, FPT University" />
            </div>

            <div className="form-group">
              <label>Job Preferences</label>
              <textarea name="jobPreferences" value={form.jobPreferences || ''} onChange={handleChange} rows={2} placeholder="e.g. Remote, Full-time, FinTech" />
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveInfo} disabled={saving}>
                {saving ? <span className="spinner" /> : '💾 Save Changes'}
              </button>
            </div>
          </div>
        )}

        {tab === 'cv' && (
          <div className="profile-edit-body">
            {currentResume ? (
              <div className="current-cv-card" style={{ marginBottom: '1.5rem' }}>
                <div className="cv-icon">📄</div>
                <div className="cv-info">
                  <div className="cv-name">{currentResume.fileName}</div>
                  <div className="cv-meta">
                    Uploaded: {new Date(currentResume.uploadDate).toLocaleString()} · {(currentResume.fileSize / 1024).toFixed(0)} KB
                  </div>
                </div>
                <a href={`http://localhost:8080/api/resumes/download/${currentResume.resumeId}`}
                  className="btn btn-outline btn-sm" target="_blank" rel="noreferrer">⬇ Download</a>
              </div>
            ) : (
              <div className="no-cv-notice" style={{ marginBottom: '1.5rem' }}>
                <div className="no-cv-icon">📭</div>
                <p>No CV uploaded yet.</p>
              </div>
            )}

            <div
              className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFileSelect(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById('modal-cv-input').click()}
            >
              {file ? (
                <><div className="drop-icon">✅</div><div className="drop-text">{file.name}</div></>
              ) : (
                <><div className="drop-icon">📤</div><div className="drop-text">Drag & drop or click to upload</div><div className="drop-hint">PDF / DOCX · max 5MB</div></>
              )}
            </div>
            <input id="modal-cv-input" type="file" accept=".pdf,.docx" style={{ display: 'none' }} onChange={e => handleFileSelect(e.target.files[0])} />

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleUploadCV} disabled={!file || uploading}>
                {uploading ? <span className="spinner" /> : currentResume ? '🔄 Replace CV' : '📤 Upload CV'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
