import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.username) newErrors.username = 'Username is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const data = res.data;
      console.log(data);
      login({ username: data.username, role: data.role, userId: data.userId, profileId: data.profileId }, data.token);
      toast.success('Welcome back, ' + data.username + '!');
      navigate('/jobs');
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Login failed';
      if (status === 409) {
        toast.warning(msg); // account locked
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Username</label>
            <input name="username" value={form.username} onChange={handleChange}
              placeholder="Your username" autoComplete="username"
              className={errors.username ? 'error' : ''} />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange}
              placeholder="Your password" autoComplete="current-password"
              className={errors.password ? 'error' : ''} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-hint">
            ⚠️ After 5 failed attempts, your account will be locked for 15 minutes.
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
}
