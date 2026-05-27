import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import JobsPage from './pages/JobsPage.jsx';
import JobDetailPage from './pages/JobDetailPage.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminJobForm from './pages/AdminJobForm.jsx';
import AdminApplicants from './pages/AdminApplicants.jsx';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/jobs/new" element={<AdminRoute><AdminJobForm /></AdminRoute>} />
          <Route path="/admin/jobs/:id/edit" element={<AdminRoute><AdminJobForm /></AdminRoute>} />
          <Route path="/admin/jobs/:id/applicants" element={<AdminRoute><AdminApplicants /></AdminRoute>} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;
