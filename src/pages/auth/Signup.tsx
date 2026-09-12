import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const GoogleSVG = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export const Signup: React.FC = () => {
  const [fullName, setFullName]         = useState('');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd]           = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [agreed, setAgreed]             = useState(false);
  const [loading, setLoading]           = useState(false);
  const [errorMsg, setErrorMsg]         = useState<string | null>(null);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  /* ── Supabase handlers (unchanged logic) ────────────────────── */
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || (isRTL ? 'حدث خطأ أثناء التسجيل بواسطة Google.' : 'Google sign-up failed.'));
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg(isRTL ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }
    if (!agreed) {
      setErrorMsg(isRTL ? 'يجب الموافقة على الشروط والسياسات.' : 'Please agree to the terms and privacy policy.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      window.location.href = '/auth/callback';
    } catch (err: any) {
      setErrorMsg(err.message || (isRTL ? 'تأكد من إدخال بيانات صحيحة.' : 'Please check your details and try again.'));
    } finally {
      setLoading(false);
    }
  };
  /* ─────────────────────────────────────────────────────────────── */

  return (
    <div
      className="auth-page-wrap font-cairo"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ backgroundImage: 'url(/sign_bg.png)' }}
    >
      {/* Dark overlay */}
      <div className="auth-page-overlay" />

      {/* ── Outer title (above card) ── */}
      <div className="relative z-10 text-center mb-6 px-4 auth-fade-in">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          {isRTL ? 'إنشاء حساب جديد' : 'Create New Account'}
        </h1>
        <div className="w-10 h-[3px] bg-cyan-400 mx-auto mt-3 rounded-full" />
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-[85%] max-w-sm auth-card auth-fade-in">

        {/* Brand row */}
        <div className="flex items-center gap-3 mb-6">
          <div className="auth-logo-circle">
            <img src="/logo.svg" alt="Tawjihi Path" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white font-black text-lg drop-shadow-md">
              طريق التوجيهي
            </span>
            <span className="text-[10px] font-bold text-cyan-400 -mt-1 tracking-widest uppercase">
              Tawjihi Path
            </span>
          </div>
        </div>

        {/* Card inner title */}
        <h2 className="text-[22px] font-black text-white text-center mb-1">
          {isRTL ? 'إنشاء حساب جديد' : 'Create New Account'}
        </h2>
        <div className="auth-title-dot" />

        {/* Error */}
        {errorMsg && <div className="auth-error mb-4 mt-4">{errorMsg}</div>}

        {/* ── Form ── */}
        <form onSubmit={handleEmailSignup} className="flex flex-col gap-3 mt-5">

          {/* Full name */}
          <div className="auth-field">
            <User className="auth-field-icon" size={17} />
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder={isRTL ? 'الاسم الكامل' : 'Full Name'}
              className="auth-field-input"
              required
              autoComplete="name"
              id="signup-name"
            />
          </div>

          {/* Email */}
          <div className="auth-field">
            <Mail className="auth-field-icon" size={17} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={isRTL ? 'البريد الإلكتروني' : 'Email'}
              className="auth-field-input"
              required
              dir="ltr"
              autoComplete="email"
              id="signup-email"
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <Lock className="auth-field-icon" size={17} />
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isRTL ? 'كلمة المرور' : 'Password'}
              className="auth-field-input auth-field-input-pwd"
              required
              minLength={6}
              dir="ltr"
              autoComplete="new-password"
              id="signup-password"
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              className="auth-eye-btn"
              tabIndex={-1}
            >
              {showPwd
                ? <Eye size={15} className="text-gray-400" />
                : <EyeOff size={15} className="text-gray-400" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <Lock className="auth-field-icon" size={17} />
            <input
              type={showConfirmPwd ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder={isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              className="auth-field-input auth-field-input-pwd"
              required
              dir="ltr"
              autoComplete="new-password"
              id="signup-confirm-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPwd(v => !v)}
              className="auth-eye-btn"
              tabIndex={-1}
            >
              {showConfirmPwd
                ? <Eye size={15} className="text-gray-400" />
                : <EyeOff size={15} className="text-gray-400" />}
            </button>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none mt-1">
            <div
              onClick={() => setAgreed(v => !v)}
              className={`auth-checkbox ${agreed ? 'auth-checkbox-checked' : ''}`}
            >
              {agreed && (
                <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
                  <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-[13px] text-gray-300">
              {isRTL ? (
                <>موافقة على{' '}
                  <Link to="/terms" className="text-cyan-400 hover:underline">الشروط والسياسات</Link>
                </>
              ) : (
                <>I agree to the{' '}
                  <Link to="/terms" className="text-cyan-400 hover:underline">Terms and Conditions</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>
                </>
              )}
            </span>
          </label>

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="auth-cta-btn mt-1"
            id="email-signup-btn"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="flex-1 text-center">
                  {isRTL ? 'ابدأ رحلة التفكير...' : 'Start Your Journey...'}
                </span>
                <span className="auth-cta-arrow">→</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider my-5">
          <span>{isRTL ? 'أو' : 'OR'}</span>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="auth-google-btn"
          id="google-signup-btn"
        >
          <GoogleSVG />
          <span>{isRTL ? 'التسجيل باستخدام Google' : 'Sign up with Google'}</span>
        </button>

        {/* Login link */}
        <div className="text-center mt-6">
          <p className="text-[13px] text-gray-400">
            {isRTL ? 'لديك حساب؟' : 'Already have an account?'}
          </p>
          <Link to="/auth/login" className="auth-switch-link">
            <span>→</span>
            <span>{isRTL ? 'تسجيل الدخول' : 'Sign In'}</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
