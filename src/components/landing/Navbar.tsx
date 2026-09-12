import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      dir="ltr"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-4 bg-[#02050a]/90 backdrop-blur-xl border-b border-cyan-900/30 shadow-2xl shadow-cyan-900/20'
          : 'py-5'
      }`}
      style={!isScrolled ? {
        background: 'linear-gradient(to bottom, rgba(5,8,22,0.80) 0%, transparent 100%)',
      } : undefined}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo — desktop and mobile */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/logo.svg" alt="Tawjihi Path" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors drop-shadow-md">
                طريق التوجيهي
              </span>
              <span className="text-[10px] font-bold text-cyan-400 -mt-1 tracking-widest uppercase">
                Tawjihi Path
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* 1. Fields Link */}
            <Link 
              to="/explore/fields"
              className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              {t('landing.navbar.fields')}
            </Link>

            {/* 2. Majors Link */}
            <Link 
              to="/explore/majors"
              className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              {t('landing.navbar.majors')}
            </Link>

            {/* 3. Profile Link (logged in) */}
            {user && (
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                <User size={18} className="text-cyan-400" />
                <span>{t('landing.navbar.profile')}</span>
              </Link>
            )}

            {/* 4. Login Button (not logged in) */}
            {!user && (
              <Link 
                to="/auth/login"
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-sm rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                {t('landing.navbar.login')}
              </Link>
            )}

            {/* 5. Language Toggle (Globe only) */}
            <button 
              onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')}
              className="p-2 bg-transparent border border-cyan-500/50 text-cyan-400 rounded-full hover:bg-cyan-900/30 transition-all flex items-center justify-center"
              aria-label="Toggle language"
            >
              <Globe size={18} />
            </button>

          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button 
              className="p-2 text-cyan-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#02050a]/95 backdrop-blur-xl border-b border-cyan-900/50 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6" style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
              
              {/* Fields Link */}
              <Link 
                to="/explore/fields"
                className="text-base font-bold text-gray-200 hover:text-cyan-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('landing.navbar.fields')}
              </Link>

              {/* Majors Link */}
              <Link 
                to="/explore/majors"
                className="text-base font-bold text-gray-200 hover:text-cyan-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('landing.navbar.majors')}
              </Link>

              {/* Profile Link (logged in) */}
              {user && (
                <Link 
                  to="/dashboard"
                  className="flex items-center gap-2 text-base font-bold text-gray-200 hover:text-cyan-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} className="text-cyan-400" />
                  <span>{t('landing.navbar.profile')}</span>
                </Link>
              )}

              {/* Login Button (not logged in) */}
              {!user && (
                <button 
                  onClick={() => { navigate('/auth/login'); setMobileMenuOpen(false); }}
                  className="w-full py-3 flex justify-center items-center bg-cyan-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  <span>{t('landing.navbar.login')}</span>
                </button>
              )}

              <hr className="border-cyan-900/30 my-2" />

              {/* Language Toggle (Globe only) */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">
                  {i18n.language === 'ar' ? 'English' : 'العربية'}
                </span>
                <button 
                  onClick={() => {
                    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 bg-transparent border border-cyan-500/50 text-cyan-400 rounded-full hover:bg-cyan-900/30 transition-all flex items-center justify-center"
                  aria-label="Toggle language"
                >
                  <Globe size={18} />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
