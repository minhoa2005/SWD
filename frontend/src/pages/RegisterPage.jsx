import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosInstance';

const initialForm = {
  username: '', email: '', phone: '', password: '', confirmPassword: '', role: 'SEEKER', fullName: ''
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username || form.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    if (!form.password || form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!/(?=.*[A-Z])(?=.*\d)/.test(form.password)) newErrors.password = 'Password must contain uppercase letter and digit';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      const fieldErrors = err.response?.data?.fieldErrors;
      if (fieldErrors) setErrors(fieldErrors);
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">✨</div>
          <h1>Create Account</h1>
          <p>Join the JobSeeker platform today</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input name="username" value={form.username} onChange={handleChange}
                placeholder="johndoe" className={errors.username ? 'error' : ''} />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange}
                placeholder="John Doe" />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="john@example.com" className={errors.email ? 'error' : ''} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange}
              placeholder="+1234567890" className={errors.phone ? 'error' : ''} />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>I am a</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="SEEKER">Job Seeker</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="Min 8 chars, 1 uppercase, 1 digit"
                className={errors.password ? 'error' : ''} />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword}
                onChange={handleChange} placeholder="Repeat password"
                className={errors.confirmPassword ? 'error' : ''} />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
