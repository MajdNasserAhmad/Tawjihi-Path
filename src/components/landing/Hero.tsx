import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';

export function Hero() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const imgSrc = isAr ? '/hero-ar.png' : '/hero-en.png';
  const user = useAuthStore((state) => state.user);

  const handleCTAClick = () => {
    if (user) {
      navigate('/assess/grades');
    } else {
      navigate('/auth/signup');
    }
  };

  return (
    <section className="relative w-full">

      {/* ── DESKTOP md+ : buttons overlaid on image ── */}
      <div className="relative w-full hidden md:block">
        <img src={imgSrc} alt="hero" className="w-full h-auto block" />

        {/* 
          Buttons sit below the subtitle text.
          The subtitle ends around 53% from the top of the image.
          Buttons start at 55% — adjust between 52%-60% if needed.
        */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex gap-4 justify-center"
          style={{ top: '56%' }}
        >
          <button
            onClick={handleCTAClick}
            className="shiny-cta"
          >
            <span>{t('landing.hero.ctaMain')}</span>
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-7 py-3 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 font-bold rounded-xl text-base transition-all cursor-pointer whitespace-nowrap"
          >
            {t('landing.hero.ctaSecondary')}
          </button>
        </div>
      </div>

      {/* ── MOBILE below md : image + buttons below ── */}
      <div className="flex flex-col md:hidden w-full">
        <img src={imgSrc} alt="hero" className="w-full h-auto block" />
        {/* Buttons sit below the image on mobile — always visible */}
        <div className="flex flex-row gap-3 justify-center px-5 py-5 bg-[#050816]">
          <button
            onClick={handleCTAClick}
            className="shiny-cta"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.75rem' }}
          >
            <span>{t('landing.hero.ctaMain')}</span>
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-2 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            {t('landing.hero.ctaSecondary')}
          </button>
        </div>
      </div>

    </section>
  );
}
