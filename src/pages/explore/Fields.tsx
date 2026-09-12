import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BriefcaseMedical, 
  Settings, 
  Briefcase, 
  Scale, 
  ArrowLeft, 
  ArrowRight, 
  GraduationCap 
} from 'lucide-react';
import { Navbar } from '../../components/landing/Navbar';
import { Footer } from '../../components/landing/Footer';
import { fieldData } from '../../data/fieldData';
import type { FieldId } from '../../types';

const fieldIcons: Record<FieldId, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  health: BriefcaseMedical,
  engineering_tech: Settings,
  business: Briefcase,
  law_sharia_languages: Scale,
};

export function Fields() {
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 80 } },
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white font-cairo overflow-x-hidden relative" dir={dir}>
      <Navbar />

      {/* Decorative stars/sparkles */}
      <div className="absolute top-[20%] right-[15%] w-2 h-2 bg-cyan-400 rounded-full blur-[1px] animate-pulse pointer-events-none opacity-40 z-0" />
      <div className="absolute top-[35%] left-[10%] w-3 h-3 text-cyan-400 pointer-events-none opacity-30 z-0">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></svg>
      </div>
      <div className="absolute top-[15%] right-[20%] w-4 h-4 text-cyan-500 pointer-events-none opacity-30 animate-pulse z-0">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"/></svg>
      </div>

      {/* Background radial glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[15%] -left-[10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[15%] -right-[10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Symmetrical background concentric circles */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] pointer-events-none z-0 hidden md:block opacity-40">
        <div className="absolute inset-0 border border-cyan-500/10 rounded-full" />
        <div className="absolute inset-[60px] border border-cyan-500/5 rounded-full" />
        <div className="absolute inset-[120px] border border-indigo-500/5 rounded-full" />
        <div className="absolute inset-[180px] border border-cyan-500/10 rounded-full border-dashed animate-[spin_180s_linear_infinite]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 px-4 pt-28 pb-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center justify-center relative py-12"
        >
          {/* Radial glow directly behind the title */}
          <div className="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none z-0" />
          
          <span className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 text-cyan-400 text-xs font-bold border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <GraduationCap className="w-4 h-4" />
            <span>{t('explore.fields.badge')}</span>
          </span>

          <h1 className="relative z-10 text-4xl md:text-5xl font-black mt-6 mb-4 leading-tight">
            {isAr ? (
              <>
                أي حقل <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">يناسبك؟</span>
              </>
            ) : (
              <>
                Which Field <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Suits You?</span>
              </>
            )}
          </h1>

          <p className="relative z-10 text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            {t('explore.fields.subtitle')}
            {isAr && " وتخصصات مستقبلية."}
          </p>

          <Link
            to="/assess/grades"
            className="relative z-10 mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>{t('explore.fields.ctaBtn')}</span>
          </Link>
        </motion.div>

        {/* Fields Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto"
        >
          {Object.entries(fieldData).map(([id, field], index) => {
            const fieldId = id as FieldId;
            const fieldName = field.name[isAr ? 'ar' : 'en'];
            const fieldDesc = field.description[isAr ? 'ar' : 'en'];
            const IconComponent = fieldIcons[fieldId];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={fieldId}
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  borderColor: field.color,
                  boxShadow: `0px 0px 40px ${field.color}44`,
                }}
                transition={{ duration: 0.3 }}
                className="relative flex rounded-2xl bg-[#02050a]/40 border min-h-[220px] md:min-h-[260px] overflow-hidden group cursor-pointer transition-all duration-300"
                style={{
                  borderColor: `${field.color}20`,
                  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`,
                }}
              >
                <Link
                  to={`/explore/majors?field=${fieldId}`}
                  className="w-full h-full p-8 md:p-10 flex flex-col justify-between"
                >
                  {/* Top content row (symmetrical / alternating layout) */}
                  <div className={`flex w-full items-start justify-between gap-8 pb-16`}>
                    {isEven ? (
                      <>
                        {/* Icon on the right (start in RTL, end in LTR) */}
                        <div
                          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border shrink-0 transition-all duration-300"
                          style={{
                            backgroundColor: `${field.color}15`,
                            borderColor: `${field.color}40`,
                            boxShadow: `0 0 20px ${field.color}25`,
                          }}
                        >
                          {IconComponent && <IconComponent className="w-8 h-8 md:w-10 md:h-10" style={{ color: field.color }} />}
                        </div>

                        {/* Text on left (end in RTL, start in LTR) */}
                        <div className="flex-grow min-w-0 text-start">
                          <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors">
                            {fieldName}
                          </h3>
                          <p className="mt-3 text-gray-400 text-sm md:text-base leading-relaxed">
                            {fieldDesc}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Text on right (start in RTL, end in LTR) */}
                        <div className="flex-grow min-w-0 text-start">
                          <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors">
                            {fieldName}
                          </h3>
                          <p className="mt-3 text-gray-400 text-sm md:text-base leading-relaxed">
                            {fieldDesc}
                          </p>
                        </div>

                        {/* Icon on left (end in RTL, start in LTR) */}
                        <div
                          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center border shrink-0 transition-all duration-300"
                          style={{
                            backgroundColor: `${field.color}15`,
                            borderColor: `${field.color}40`,
                            boxShadow: `0 0 20px ${field.color}25`,
                          }}
                        >
                          {IconComponent && <IconComponent className="w-8 h-8 md:w-10 md:h-10" style={{ color: field.color }} />}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Arrow at bottom corner (end-6 aligns perfectly bottom-left in RTL / bottom-right in LTR) */}
                  <div
                    className="absolute bottom-6 end-6 w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300"
                    style={{
                      borderColor: `${field.color}40`,
                      color: field.color,
                    }}
                  >
                    {isAr ? (
                      <ArrowLeft className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border border-cyan-900/30 bg-gradient-to-b from-[#02050a] to-[#050816] rounded-3xl p-8 md:p-12 mt-24 max-w-5xl mx-auto text-center relative overflow-hidden backdrop-blur-sm shadow-2xl shadow-cyan-950/20"
        >
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/5 rounded-full blur-[50px] pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none" />
          
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
            {t('explore.fields.ctaTitle')}
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            {t('explore.fields.ctaSubtitle')}
          </p>
          <Link
            to="/assess/grades"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
          >
            <span>{t('explore.fields.ctaBtn')}</span>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default Fields;
