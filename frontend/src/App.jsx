import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import JobListPage from './pages/JobListPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import UploadCVPage from './pages/UploadCVPage';
import SeekerProfilePage from './pages/SeekerProfilePage';
import RecruiterProfilePage from './pages/RecruiterProfilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route
              path="/post-job"
              element={
                <ProtectedRoute requiredRole="RECRUITER">
                  <PostJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/cv"
              element={
                <ProtectedRoute requiredRole="SEEKER">
                  <UploadCVPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/seeker"
              element={
                <ProtectedRoute requiredRole="SEEKER">
                  <SeekerProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/recruiter"
              element={
                <ProtectedRoute requiredRole="RECRUITER">
                  <RecruiterProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}
