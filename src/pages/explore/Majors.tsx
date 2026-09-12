import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ArrowLeft, 
  ArrowRight,
  GraduationCap,
  HeartPulse,
  Settings,
  Briefcase,
  Scale,
  Stethoscope,
  Pill,
  Microscope,
  Activity,
  Apple,
  Shield,
  Syringe,
  Bone,
  Baby,
  Cpu,
  Brain,
  Building,
  Database,
  Compass,
  Zap,
  Lock,
  Sun,
  Megaphone,
  Coins,
  Languages,
  Radio,
  BookOpen,
  Smile,
  PawPrint
} from 'lucide-react';
import { Navbar } from '../../components/landing/Navbar';
import { Footer } from '../../components/landing/Footer';
import { fieldData } from '../../data/fieldData';
import type { FieldId } from '../../types';

// Tab icons mapping
// const tabIcons: Record<string, React.ComponentType<{ className?: string }>> = {
//   all: LayoutGrid,
//   health: HeartPulse,
//   engineering_tech: Settings,
//   business: Briefcase,
//   law_sharia_languages: Scale,
// };

// Lucide major icons mapping based on Arabic keyword matching
const getMajorIcon = (arName: string, fieldId: FieldId) => {
  const name = arName.trim();
  if (name.includes('الطب البشري')) return Stethoscope;
  if (name.includes('طب الأسنان')) return Smile;
  if (name.includes('الصيدلة')) return Pill;
  if (name.includes('التمريض')) return HeartPulse;
  if (name.includes('المختبرات الطبية')) return Microscope;
  if (name.includes('العلاج الطبيعي')) return Activity;
  if (name.includes('التغذية')) return Apple;
  if (name.includes('الصحة العامة')) return Shield;
  if (name.includes('التخدير')) return Syringe;
  if (name.includes('الأشعة')) return Bone;
  if (name.includes('القبالة')) return Baby;
  if (name.includes('هندسة الحاسوب')) return Cpu;
  if (name.includes('الذكاء الاصطناعي')) return Brain;
  if (name.includes('الهندسة المدنية')) return Building;
  if (name.includes('علم البيانات')) return Database;
  if (name.includes('العمارة')) return Compass;
  if (name.includes('الكهربائية')) return Zap;
  if (name.includes('أمن المعلومات')) return Lock;
  if (name.includes('الطاقة المتجددة')) return Sun;
  if (name.includes('إدارة الأعمال')) return Briefcase;
  if (name.includes('التسويق')) return Megaphone;
  if (name.includes('التمويل')) return Coins;
  if (name.includes('القانون')) return Scale;
  if (name.includes('اللغة الإنجليزية')) return Languages;
  if (name.includes('الإعلام')) return Radio;
  if (name.includes('التربية') || name.includes('الدراسات')) return BookOpen;
  if (name.includes('البيطري')) return PawPrint;

  // Fallback by field
  switch (fieldId) {
    case 'health': return Stethoscope;
    case 'engineering_tech': return Settings;
    case 'business': return Briefcase;
    case 'law_sharia_languages': return Scale;
    default: return GraduationCap;
  }
};

// stable sub-majors count helper (3 to 12)
const getSubMajorsCount = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 3 + (Math.abs(hash) % 10);
};

// stable sub-majors label pluralization helper (Arabic grammar)
const getSubMajorsLabel = (name: string, isAr: boolean) => {
  const count = getSubMajorsCount(name);
  if (!isAr) {
    return `${count} Sub-majors`;
  }
  if (count >= 11) {
    return `${count} تخصص متاح`;
  }
  return `${count} تخصصات متاحة`;
};

interface MajorCardProps {
  name: string;
  arName: string;
  fieldId: FieldId;
  fieldColor: string;
  isAr: boolean;
}

function MajorCard({ name, arName, fieldId, fieldColor, isAr }: MajorCardProps) {
  const [hovered, setHovered] = useState(false);
  const MajorIcon = getMajorIcon(arName, fieldId);
  const subMajorsLabel = getSubMajorsLabel(arName, isAr);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{
        scale: 1.05,
        borderColor: fieldColor,
        boxShadow: `0 8px 30px ${fieldColor}22`,
      }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col items-center justify-between p-5 md:p-8 rounded-2xl bg-[#02050a]/40 border text-center transition-all duration-300 group cursor-pointer min-h-[220px] md:min-h-[240px]"
      style={{
        borderColor: hovered ? fieldColor : 'rgba(22, 78, 99, 0.2)',
      }}
    >
      <Link
        to="/assess/grades"
        className="w-full h-full flex flex-col items-center justify-between"
      >
        <div className="flex flex-col items-center w-full">
          {/* Circular icon container */}
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border transition-all duration-300"
            style={{
              backgroundColor: hovered ? `${fieldColor}20` : `${fieldColor}10`,
              borderColor: hovered ? fieldColor : `${fieldColor}30`,
              color: fieldColor,
              boxShadow: hovered ? `0 0 15px ${fieldColor}30` : 'none',
            }}
          >
            <MajorIcon className="w-8 h-8 md:w-9 md:h-9" />
          </div>

          {/* Major Title */}
          <h4 className="text-sm md:text-base font-bold text-white mt-4 line-clamp-2 group-hover:text-cyan-400 transition-colors w-full px-1">
            {name}
          </h4>

          {/* Subtext */}
          <span className="text-xs text-gray-500 mt-2 font-medium block">
            {subMajorsLabel}
          </span>
        </div>

        {/* Explore Button */}
        <div
          className="mt-6 w-full border rounded-full py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300"
          style={{
            borderColor: hovered ? fieldColor : `${fieldColor}30`,
            backgroundColor: hovered ? `${fieldColor}15` : 'transparent',
            color: '#ffffff',
          }}
        >
          <span>{isAr ? 'استكشف' : 'Explore'}</span>
          {isAr ? (
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          ) : (
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export function Majors() {
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const [searchParams] = useSearchParams();
  const searchQuery = '';
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});
  
  const fieldParam = (searchParams.get('field') || 'all') as FieldId | 'all';

  // const handleTabChange = (fieldId: string) => {
  //   if (fieldId === 'all') {
  //     searchParams.delete('field');
  //   } else {
  //     searchParams.set('field', fieldId);
  //   }
  //   setSearchParams(searchParams);
  // };

  const toggleFieldExpansion = (fieldId: string) => {
    setExpandedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  // const tabs = [
  //   { id: 'all', label: t('explore.majors.filterAll') },
  //   { id: 'health', label: fieldData.health.name[isAr ? 'ar' : 'en'] },
  //   { id: 'engineering_tech', label: fieldData.engineering_tech.name[isAr ? 'ar' : 'en'] },
  //   { id: 'business', label: fieldData.business.name[isAr ? 'ar' : 'en'] },
  //   { id: 'law_sharia_languages', label: fieldData.law_sharia_languages.name[isAr ? 'ar' : 'en'] },
  // ];

  // Group and filter logic
  const filteredGroups = Object.entries(fieldData).map(([id, field]) => {
    const fieldId = id as FieldId;
    const matchesTab = fieldParam === 'all' || fieldId === fieldParam;

    const matchingMajors = field.majors.filter((major) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        major.ar.toLowerCase().includes(query) ||
        major.en.toLowerCase().includes(query)
      );
    });

    return {
      fieldId,
      field,
      matchingMajors,
      isVisible: matchesTab && matchingMajors.length > 0,
    };
  });

  const totalFilteredCount = filteredGroups.reduce(
    (acc, group) => acc + (group.isVisible ? group.matchingMajors.length : 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white font-cairo relative" dir={dir}>
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
        <div className="absolute top-[10%] -left-[10%] w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[140px]" />
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
          <div className="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none z-0" />
          
          <span className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 text-cyan-400 text-xs font-bold border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <GraduationCap className="w-4 h-4" />
            <span>{t('explore.majors.badge')}</span>
          </span>

          <h1 className="relative z-10 text-4xl md:text-5xl font-black mt-6 mb-4 leading-tight">
            {isAr ? (
              <>
                استكشف <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">تخصصاتك المستقبلية</span>
              </>
            ) : (
              <>
                Explore <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Your Future Majors</span>
              </>
            )}
          </h1>

          <p className="relative z-10 text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            {t('explore.majors.subtitle')}
          </p>
        </motion.div>



        {/* Majors Content Grid */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {totalFilteredCount === 0 ? (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-24 border border-cyan-900/10 rounded-2xl bg-[#02050a]/20"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-950/30 border border-cyan-900/20 flex items-center justify-center mb-4 text-cyan-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {t('explore.majors.emptyState')}
                </h3>
              </motion.div>
            ) : (
              /* Grouped by Field */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-16"
              >
                {filteredGroups.map(({ fieldId, field, matchingMajors, isVisible }) => {
                  if (!isVisible) return null;

                  const fieldName = field.name[isAr ? 'ar' : 'en'];
                  const isExpanded = expandedFields[fieldId] || false;
                  
                  // Slice majors: show first 10 (2 rows × 5 cols) or all based on expansion state
                  const visibleMajors = isExpanded ? matchingMajors : matchingMajors.slice(0, 10);
                  const hasMoreThanLimit = matchingMajors.length > 10;

                  return (
                    <div key={fieldId} className="space-y-6">
                      {/* Group Header */}
                      <div className="flex items-center gap-3 border-b border-cyan-900/20 pb-4">
                        <span className="text-2xl">{field.icon}</span>
                        <h3 className="text-lg font-black" style={{ color: field.color }}>
                          {fieldName}
                        </h3>
                        <span className="text-cyan-500/40">•</span>
                        <span className="text-xs text-gray-400 font-bold">
                          {t('explore.fields.majorCount', { count: matchingMajors.length })}
                        </span>
                      </div>
                      
                      {/* Grid of Major Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 pt-2">
                        {visibleMajors.map((major, index) => (
                          <MajorCard
                            key={`${fieldId}-${index}`}
                            name={isAr ? major.ar : major.en}
                            arName={major.ar}
                            fieldId={fieldId}
                            fieldColor={field.color}
                            isAr={isAr}
                          />
                        ))}
                      </div>

                      {/* Expand / Collapse Button if has more than 12 majors */}
                      {hasMoreThanLimit && (
                        <div className="flex justify-center mt-8">
                          <button
                            onClick={() => toggleFieldExpansion(fieldId)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-900/30 bg-[#02050a] text-xs font-bold text-gray-300 hover:text-white hover:border-cyan-500/55 transition-all cursor-pointer shadow-lg shadow-cyan-950/20"
                          >
                            <span>
                              {isExpanded
                                ? (isAr ? 'عرض أقل' : 'Show Less')
                                : (isAr 
                                    ? `عرض المزيد من تخصصات ${fieldName}` 
                                    : `Show more majors in ${fieldName}`)
                              }
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
            {t('explore.majors.ctaTitle')}
          </h2>
          <Link
            to="/assess/grades"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 mt-4"
          >
            <span>{t('explore.majors.ctaBtn')}</span>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default Majors;