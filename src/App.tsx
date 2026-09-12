import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RTLWrapper } from './components/RTLWrapper';

// Auth logic
import { useAuthStore } from './stores/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { AuthCallback } from './pages/auth/AuthCallback';

const Landing = lazy(() => import('./pages/Landing'));
const Grades = lazy(() => import('./pages/assess/Grades'));
const ExamIntro = lazy(() => import('./pages/assess/ExamIntro'));
const Questions = lazy(() => import('./pages/assess/Questions'));
const Processing = lazy(() => import('./pages/assess/Processing'));
const Results = lazy(() => import('./pages/assess/Results'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/legal/Terms'));
const Fields = lazy(() => import('./pages/explore/Fields'));
const Majors = lazy(() => import('./pages/explore/Majors'));


import { ErrorBoundary } from './components/ErrorBoundary';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Start listening to Supabase auth state upon app load
    const cleanup = initializeAuth();
    return cleanup;
  }, [initializeAuth]);

  // Ensure dark mode is on by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ErrorBoundary>
      <RTLWrapper>
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" /></div>}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route path="/explore/fields" element={<Fields />} />
            <Route path="/explore/majors" element={<Majors />} />
            <Route path="/explore/careers" element={<div className="min-h-screen flex items-center justify-center font-cairo text-white" dir="rtl"><p>Explore Careers — Stage 6</p></div>} />

            <Route path="/share/:id" element={<div className="min-h-screen flex items-center justify-center font-cairo text-white" dir="rtl"><p>Share Result — Stage 6</p></div>} />
            <Route path="/pdf/:id" element={<div className="min-h-screen flex items-center justify-center font-cairo text-white" dir="rtl"><p>PDF Export — Stage 6</p></div>} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/assess/grades" element={<Grades />} />
              <Route path="/assess/intro" element={<ExamIntro />} />
              <Route path="/assess/questions" element={<Questions />} />
              <Route path="/assess/processing" element={<Processing />} />
              <Route path="/assess/results/:id" element={<Results />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </RTLWrapper>
    </ErrorBoundary>
  );
}

export default App;
