import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '../../components/landing/Navbar';
import { Footer } from '../../components/landing/Footer';

const SECTION_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export function Terms() {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState<string>('section-1');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const isRtl = i18n.language === 'ar';

  const sections = SECTION_KEYS.map((key) => ({
    id: `section-${key}`,
    number: key,
    title: t(`legal.terms.sections.${key}.title`),
    content: t(`legal.terms.sections.${key}.content`),
  }));

  // Scrollspy to highlight active section in TOC on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sectionElements = document.querySelectorAll('section[id^="section-"]');
    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Back to Top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Account for the sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden font-cairo">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 border-b border-cyan-900/30 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Subtle Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none z-0 animate-pulse" />
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {t('legal.terms.badge')}
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white">
            {t('legal.terms.title')}
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-medium">
            {t('legal.terms.updated')}
          </p>
        </div>
      </section>

      {/* Main Content & TOC Grid */}
      <main className="container mx-auto px-6 md:px-8 lg:px-12 max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          {/* Sticky Sidebar TOC — desktop only */}
          <aside className="lg:col-span-1 lg:sticky lg:top-28 hidden lg:block">
            <div className="border border-cyan-900/30 rounded-2xl bg-[#02050a]/80 backdrop-blur-md p-6 shadow-xl shadow-cyan-950/20">
              <h3 className="text-cyan-400 font-bold text-sm mb-4 border-b border-cyan-900/20 pb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                </span>
                {t('legal.terms.toc')}
              </h3>
              <ul className="space-y-2.5">
                {sections.map((sec) => (
                  <li key={sec.id}>
                    <button
                      onClick={() => handleScrollToSection(sec.id)}
                      className={`text-start w-full block text-xs py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
                        activeSection === sec.id
                          ? 'text-cyan-400 font-extrabold bg-cyan-950/30 border-s-2 border-cyan-400 pl-4 pr-3'
                          : 'text-gray-400 hover:text-white hover:bg-cyan-950/10'
                      }`}
                    >
                      <span className="font-mono text-cyan-500/80 me-2">{sec.number}.</span>
                      {sec.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3 max-w-3xl mx-auto w-full">
            {/* Mobile TOC Dropdown */}
            <div className="lg:hidden mb-8 border border-cyan-900/30 rounded-xl bg-[#02050a]/60 backdrop-blur-md p-4 shadow-lg">
              <button
                onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                className="w-full flex items-center justify-between text-sm font-bold text-cyan-400 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  {t('legal.terms.toc')}
                </span>
                <ChevronDown className={`transition-transform duration-200 ${isMobileTocOpen ? 'rotate-180' : ''}`} size={18} />
              </button>
              <AnimatePresence>
                {isMobileTocOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-1.5 border-t border-cyan-900/20 pt-4 overflow-hidden"
                  >
                    {sections.map((sec) => (
                      <li key={sec.id}>
                        <button
                          onClick={() => {
                            handleScrollToSection(sec.id);
                            setIsMobileTocOpen(false);
                          }}
                          className={`text-start w-full block py-2 px-3 rounded-lg text-xs transition-all ${
                            activeSection === sec.id
                              ? 'text-cyan-400 font-bold bg-cyan-950/20 border-s-2 border-cyan-400'
                              : 'text-gray-400 hover:text-white hover:bg-cyan-950/10'
                          }`}
                        >
                          <span className="text-cyan-500 font-mono me-2">{sec.number}.</span>
                          {sec.title}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Section Articles */}
            <div className="space-y-10">
              {sections.map((sec) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="scroll-mt-24 pb-10 border-b border-cyan-900/10 last:border-0 last:pb-0"
                >
                  <h2 className="text-xl md:text-2xl font-black text-white mb-4 flex items-center gap-3">
                    <span className="text-cyan-400 font-mono text-lg font-bold bg-cyan-950/30 border border-cyan-900/30 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                      {sec.number}
                    </span>
                    {sec.title}
                  </h2>
                  <div className="ps-11">
                    {sec.id === 'section-10' ? (
                      <p className="text-gray-400 leading-relaxed">
                        {sec.content}{' '}
                        <a
                          href="mailto:legal@tawjihipath.com"
                          className="text-cyan-400 hover:text-cyan-300 hover:underline font-bold transition-all"
                        >
                          legal@tawjihipath.com
                        </a>
                      </p>
                    ) : (
                      <p className="text-gray-400 leading-relaxed">
                        {sec.content}
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-8 ${isRtl ? 'left-8' : 'right-8'} z-40 w-10 h-10 rounded-full border border-cyan-500/20 flex items-center justify-center bg-[#02050a]/90 backdrop-blur-md text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer`}
            aria-label="Back to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default Terms;
