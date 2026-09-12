import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Compass } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center font-cairo" dir="rtl">
        {/* Same animated background as auth pages for consistency */}
        <div className="auth-bg">
          <div className="auth-orb auth-orb-1" />
          <div className="auth-orb auth-orb-2" />
        </div>
        <div className="relative z-10 text-center">
          <div className="logo-glow mx-auto mb-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
            <Compass className="w-7 h-7 text-white" />
          </div>
          <div className="auth-spinner mx-auto mb-4" />
          <p className="text-slate-300 text-sm">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect them to the signup page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they signup, which is a nicer user experience.
    return <Navigate to="/auth/signup" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
