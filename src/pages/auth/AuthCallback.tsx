import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../hooks/useUser';
import { Compass, AlertCircle } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  useEffect(() => {
    // If auth state is still loading, do nothing
    if (loading) return;

    // If there's no user and we're not loading, something went wrong, send to login
    if (!user) {
      navigate('/auth/login', { replace: true });
      return;
    }

    const checkOrCreateProfile = async () => {
      try {
        // 1. Check if the profile already exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 means zero rows returned, which is expected for new users
          console.error("Error fetching profile:", fetchError);
          throw fetchError;
        }

        if (existingProfile) {
          // Returning user: redirect to assessment entry (dashboard is Stage 6)
          navigate('/assess/grades', { replace: true });
        } else {
          // New user: Create profile
          // Extract full name from user_metadata (works for Google and our email/pwd signup)
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                full_name: fullName,
                birth_year: 2009,
                preferred_language: 'ar',
              }
            ]);

          if (insertError) {
            console.error("Error creating profile:", insertError);
            throw insertError;
          }

          // First login: redirect to enter grades
          navigate('/assess/grades', { replace: true });
        }
      } catch (err: any) {
        setErrorStatus('حدث خطأ أثناء معالجة تسجيل الدخول. المرجو المحاولة مرة أخرى.');
      }
    };

    checkOrCreateProfile();
  }, [user, loading, navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center font-cairo" dir="rtl">
      {/* Animated background */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      {/* Content */}
      <div className="relative z-10 auth-fade-in">
        {errorStatus ? (
          <div className="glass-card p-8 sm:p-10 max-w-sm mx-4 text-center">
            <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <p className="mb-6 text-red-300 text-sm leading-relaxed">
              {errorStatus}
            </p>
            <button
              onClick={() => navigate('/auth/login')}
              className="btn-primary"
              id="callback-retry-btn"
            >
              العودة للدخول
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="logo-glow mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <Compass className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="auth-spinner mx-auto mb-5" />
            <p className="text-slate-300 text-sm">
              جاري تأكيد حسابك...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
