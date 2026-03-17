import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/jobs">
          <span className="brand-icon">💼</span>
          <span className="brand-name">JobSeeker</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/jobs" className="nav-link">Browse Jobs</Link>

        {isAuthenticated && user?.role === 'RECRUITER' && (
          <>
            <Link to="/post-job" className="nav-link">Post a Job</Link>
            <Link to="/profile/recruiter" className="nav-link">My Profile</Link>
          </>
        )}
        {isAuthenticated && user?.role === 'SEEKER' && (
          <Link to="/profile/seeker" className="nav-link">My Profile</Link>
        )}
      </div>

      <div className="navbar-auth">
        {isAuthenticated ? (
          <>
            <span className="nav-user">
              <span className="role-badge" data-role={user?.role}>{user?.role}</span>
              {user?.username}
            </span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
