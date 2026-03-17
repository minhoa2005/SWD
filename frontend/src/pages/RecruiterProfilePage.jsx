import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';

export default function RecruiterProfilePage() {
  const [form, setForm] = useState({
    positionTitle: '', department: '', contactPhone: '', bio: '', isPrimaryContact: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/profile/recruiter')
      .then(r => setForm({
        positionTitle: r.data.positionTitle || '',
        department: r.data.department || '',
        contactPhone: r.data.contactPhone || '',
        bio: r.data.bio || '',
        isPrimaryContact: r.data.isPrimaryContact ?? false,
      }))
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/profile/recruiter', form);
      toast.success('Profile updated successfully! ✅');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-screen"><div className="loader" /></div>;

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="form-card-header">
          <h1>🏢 Recruiter Profile</h1>
          <p>Keep your profile up to date so candidates can learn about you</p>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-section">
            <h3>Professional Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Position Title</label>
                <input name="positionTitle" value={form.positionTitle} onChange={handleChange}
                  placeholder="e.g. Senior HR Manager" />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input name="department" value={form.department} onChange={handleChange}
                  placeholder="e.g. Human Resources" />
              </div>
            </div>

            <div className="form-group">
              <label>Contact Phone</label>
              <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
                placeholder="+84..." />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4}
                placeholder="Tell candidates about yourself and your company culture..." />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="isPrimaryContact" checked={form.isPrimaryContact} onChange={handleChange} />
                <span>I am the primary contact for candidates</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner" /> : '💾 Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
