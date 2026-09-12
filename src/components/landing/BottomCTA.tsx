import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';

export function BottomCTA() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  const handleCTAClick = () => {
    if (user) {
      navigate('/assess/grades');
    } else {
      navigate('/auth/signup');
    }
  };

  return (
    /*
      Use CSS Grid so the image and text occupy the same cell at ALL screen sizes.
      The image scales naturally (w-full h-auto), and the text sits centered on top.
      No absolute positioning — no overflow issues on any screen size.
    */
    <section
      className="w-full"
      style={{ display: 'grid' }}
    >
      {/* Image — always visible, scales with screen */}
      <img
        src="/mockup-dashboard.png"
        alt="cta background"
        className="w-full h-auto block"
        style={{ gridArea: '1/1' }}
      />

      {/* Dark overlay + text — sits in the same grid cell as the image */}
      <div
        className="flex flex-col items-center justify-center text-center px-4"
        style={{
          gridArea: '1/1',
          background: 'rgba(5,8,22,0.62)',
        }}
      >
        <h2
          className="font-black text-white mb-3 leading-tight"
          dir="rtl"
          style={{ fontSize: 'clamp(1.1rem, 3.5vw, 3rem)' }}
        >
          {t('landing.cta.title')}
        </h2>
        <p
          className="text-gray-300 mb-5 max-w-lg mx-auto"
          dir="rtl"
          style={{ fontSize: 'clamp(0.7rem, 1.5vw, 1rem)' }}
        >
          {t('landing.cta.subtitle')}
        </p>
        <button
          onClick={handleCTAClick}
          className="shiny-cta"
        >
          <span>{t('landing.cta.button')}</span>
        </button>
      </div>
    </section>
  );
}
