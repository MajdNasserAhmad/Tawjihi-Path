import { ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.19-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
);

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const { t } = useTranslation();

  const col1Labels = (t('landing.footer.col1Links', { returnObjects: true }) as string[]) || [];
  const col2Labels = (t('landing.footer.col2Links', { returnObjects: true }) as string[]) || [];
  const col3Labels = (t('landing.footer.col3Links', { returnObjects: true }) as string[]) || [];

  const footerLinks = [
    {
      title: t('landing.footer.col1Title'),
      links: [
        { label: col1Labels[0] || '', to: '/privacy' },
        { label: col1Labels[1] || '', to: '/terms' },
        { label: col1Labels[2] || '', to: '/#faq' },
      ]
    },
    {
      title: t('landing.footer.col2Title'),
      links: [
        { label: col2Labels[0] || '', to: '/assess/grades' },
        { label: col2Labels[1] || '', to: '/dashboard' },
      ]
    },
    {
      title: t('landing.footer.col3Title'),
      links: [
        { label: col3Labels[0] || '', to: '/' },
        { label: col3Labels[1] || '', to: '/explore/fields' },
        { label: col3Labels[2] || '', to: '/explore/majors' },
        { label: col3Labels[3] || '', to: '/privacy' },
        { label: col3Labels[4] || '', to: '/terms' },
      ]
    }
  ];

  return (
    <footer className="relative bg-[#02050a] border-t border-cyan-900/30 pt-16 pb-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand — RIGHT in RTL */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-4">
              <img src="/logo.svg" alt="Tawjihi Path" className="h-8 w-auto" />
              <div className="flex flex-col">
                <span className="text-xl font-black text-white">طريق التوجيهي</span>
                <span className="text-[10px] font-bold text-cyan-400 -mt-1 tracking-widest uppercase">Tawjihi Path</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{t('landing.footer.tagline')}</p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h5 className="text-white font-bold mb-5 text-sm">{group.title}</h5>
              <ul className="space-y-3">
                {group.links.map((link, idx) => (
                  <li key={`${link.label}-${idx}`}>
                    <Link to={link.to} className="text-gray-400 hover:text-cyan-400 transition-colors text-xs">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cyan-900/30 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button onClick={scrollToTop} className="w-8 h-8 rounded-full border border-cyan-500/20 flex items-center justify-center bg-[#050B14] hover:bg-cyan-900/30 hover:border-cyan-400/50 transition-colors cursor-pointer">
              <ChevronUp size={16} className="text-cyan-400" />
            </button>
            <p className="text-xs text-gray-500">{t('landing.footer.copyright')}</p>
          </div>
          <div className="flex gap-3">
            {[FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon].map((Icon, i) => (
              <Link key={i} to="/" className="w-8 h-8 rounded-full bg-[#050B14] border border-cyan-500/20 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center">
                <Icon size={14} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
