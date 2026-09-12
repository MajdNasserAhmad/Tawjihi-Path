import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { CountUpNumber } from '../ui/CountUpNumber';

export function StatsMockup() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const user = useAuthStore((state) => state.user);

  const handleCTA = () => {
    if (user) {
      navigate('/assess/grades');
    } else {
      navigate('/auth/signup');
    }
  };

  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl">
        <div className="glow-box p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left column — mockup image (the 87% dashboard) */}
            <div className="flex justify-center order-2 md:order-1">
              <img
                src={isAr ? '/bg-cta-ar.png' : '/bg-cta-en.png'}
                alt="نتائج طريق التوجيهي"
                className="w-full max-w-xs sm:max-w-sm md:max-w-full h-auto rounded-2xl"
                style={{ filter: 'drop-shadow(0 0 40px rgba(0, 229, 255, 0.3))' }}
              />
            </div>

            {/* Right column — text */}
            <div className="text-right order-1 md:order-2" dir="rtl">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
                {t('landing.stats.title1')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 to-purple-500">
                  {t('landing.stats.title2')}
                </span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base mb-10 leading-relaxed">
                {t('landing.stats.desc')}
              </p>

              {/* Stat counters */}
              <div className="flex gap-8 justify-end my-6">
                <div className="text-center">
                  <CountUpNumber value={20} prefix="+" className="text-3xl font-black text-cyan-400" />
                  <div className="text-xs text-gray-400 mt-1">{t('landing.stats.counter3.label')}</div>
                </div>
                <div className="text-center">
                  <CountUpNumber value={50} prefix="+" className="text-3xl font-black text-purple-400" />
                  <div className="text-xs text-gray-400 mt-1">{t('landing.stats.counter2.label')}</div>
                </div>
                <div className="text-center">
                  <CountUpNumber value={95} suffix="%+" className="text-3xl font-black text-cyan-400" />
                  <div className="text-xs text-gray-400 mt-1">{t('landing.stats.counter1.label')}</div>
                </div>
              </div>

              <button
                onClick={handleCTA}
                className="shiny-cta"
              >
                <span>{t('landing.stats.cta')}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
