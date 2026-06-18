// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Lazy-loaded pages
const LandingPage  = lazy(() => import('./pages/LandingPage'));
const AuthPage     = lazy(() => import('./pages/AuthPage'));
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const TopicPage    = lazy(() => import('./pages/TopicPage'));
const QuestionPage = lazy(() => import('./pages/QuestionPage'));
const StarredPage  = lazy(() => import('./pages/StarredPage'));
const StudyPage    = lazy(() => import('./pages/StudyPage'));
const ProfilePage  = lazy(() => import('./pages/ProfilePage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-dark-900 text-gray-100">
            <Navbar />
            <main>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public */}
                  <Route path="/"     element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />

                  {/* Protected */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                  } />
                  <Route path="/practice" element={
                    <ProtectedRoute><PracticePage /></ProtectedRoute>
                  } />
                  <Route path="/practice/:topic" element={
                    <ProtectedRoute><TopicPage /></ProtectedRoute>
                  } />
                  <Route path="/practice/:topic/:questionId" element={
                    <ProtectedRoute><QuestionPage /></ProtectedRoute>
                  } />
                  <Route path="/starred" element={
                    <ProtectedRoute><StarredPage /></ProtectedRoute>
                  } />
                  <Route path="/study" element={
                    <ProtectedRoute><StudyPage /></ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute><ProfilePage /></ProtectedRoute>
                  } />
                  <Route path="/calendar" element={
                    <ProtectedRoute><CalendarPage /></ProtectedRoute>
                  } />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
