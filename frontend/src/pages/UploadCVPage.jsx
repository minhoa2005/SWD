import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';

export default function UploadCVPage() {
  const [resumes, setResumes] = useState([]);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);

  const fetchResumes = () => {
    api.get('/resumes/my').then(res => setResumes(res.data)).catch(() => {}).finally(() => setLoadingResumes(false));
  };

  useEffect(() => { fetchResumes(); }, []);

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) {
      toast.error('Only PDF or DOCX files are allowed.'); return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.'); return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) { toast.warning('Please select a file to upload.'); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('CV updated successfully! ✅');
      setFile(null);
      fetchResumes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const currentResume = resumes[0];

  return (
    <div className="page-container">
      <div className="form-card">
        <div className="form-card-header">
          <h1>📄 My CV / Resume</h1>
          <p>Upload your CV to apply for jobs. Only PDF or DOCX files accepted (max 5MB).</p>
        </div>

        {loadingResumes ? (
          <div className="loading-inline"><div className="loader" /></div>
        ) : currentResume ? (
          <div className="current-cv-card">
            <div className="cv-icon">📄</div>
            <div className="cv-info">
              <div className="cv-name">{currentResume.fileName}</div>
              <div className="cv-meta">
                Uploaded: {new Date(currentResume.uploadDate).toLocaleString()} ·{' '}
                {(currentResume.fileSize / 1024).toFixed(0)} KB · {currentResume.fileFormat}
              </div>
            </div>
            <a
              href={`http://localhost:8080/api/resumes/download/${currentResume.resumeId}`}
              className="btn btn-outline btn-sm" target="_blank" rel="noreferrer">
              ⬇ Download
            </a>
          </div>
        ) : (
          <div className="no-cv-notice">
            <div className="no-cv-icon">📭</div>
            <p>No CV uploaded yet. Upload one to start applying for jobs!</p>
          </div>
        )}

        <div className="upload-section">
          <h3>{currentResume ? 'Replace CV' : 'Upload CV'}</h3>

          <div
            className={`drop-zone ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('cv-file-input').click()}
          >
            {file ? (
              <>
                <div className="drop-icon">✅</div>
                <div className="drop-text">{file.name}</div>
                <div className="drop-hint">({(file.size / 1024).toFixed(0)} KB) – click to change</div>
              </>
            ) : (
              <>
                <div className="drop-icon">📤</div>
                <div className="drop-text">Drag & drop your CV here</div>
                <div className="drop-hint">or click to browse (PDF / DOCX, max 5MB)</div>
              </>
            )}
          </div>

          <input id="cv-file-input" type="file" accept=".pdf,.docx"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])} />

          <div className="form-actions">
            {file && (
              <button className="btn btn-outline" onClick={() => setFile(null)}>Clear</button>
            )}
            <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? <span className="spinner" /> : currentResume ? '🔄 Update CV' : '📤 Upload CV'}
            </button>
          </div>

          <div className="upload-rules">
            <h4>Accepted formats:</h4>
            <ul>
              <li>✅ PDF (.pdf)</li>
              <li>✅ Word Document (.docx)</li>
              <li>❌ Maximum file size: 5MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
