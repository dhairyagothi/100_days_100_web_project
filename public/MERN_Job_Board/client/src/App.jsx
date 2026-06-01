import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar     from "./components/Navbar";
import Toast      from "./components/Toast";
import Home       from "./pages/Home";
import Auth       from "./pages/Auth";
import JobDetail  from "./pages/JobDetail";
import Dashboard  from "./pages/Dashboard";
import PostJob    from "./pages/PostJob";

const Priv = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  if (role && user.role !== role)
    return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toast />
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/auth"      element={<Auth />} />
        <Route path="/jobs/:id"  element={<JobDetail />} />
        <Route path="/dashboard" element={<Priv><Dashboard /></Priv>} />
        <Route path="/post-job"  element={<Priv role="employer"><PostJob /></Priv>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
