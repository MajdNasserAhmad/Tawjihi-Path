import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Info, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import { Navbar } from '../../components/landing/Navbar';

interface Subject {
  key: string;
  nameAr: string;
  nameEn: string;
  cluster: string;
}

const subjects: Subject[] = [
  { key: 'arabic', nameAr: 'اللغة العربية', nameEn: 'Arabic Language', cluster: 'language' },
  { key: 'english', nameAr: 'اللغة الإنجليزية', nameEn: 'English Language', cluster: 'language' },
  { key: 'math', nameAr: 'الرياضيات', nameEn: 'Mathematics', cluster: 'science' },
  { key: 'physics', nameAr: 'الفيزياء', nameEn: 'Physics', cluster: 'science' },
  { key: 'chemistry', nameAr: 'الكيمياء', nameEn: 'Chemistry', cluster: 'science' },
  { key: 'biology', nameAr: 'العلوم الحياتية', nameEn: 'Biology', cluster: 'science' },
  { key: 'earth_sciences', nameAr: 'علوم الأرض', nameEn: 'Earth Sciences', cluster: 'science' },
  { key: 'islamic_education', nameAr: 'التربية الإسلامية', nameEn: 'Islamic Education', cluster: 'social' },
  { key: 'history', nameAr: 'التاريخ', nameEn: 'History', cluster: 'social' },
];

const clusterColors: Record<string, string> = {
  science: 'from-blue-500 to-cyan-400',
  language: 'from-purple-500 to-pink-400',
  social: 'from-amber-500 to-orange-400',
};

const clusterLabels: Record<string, string> = {
  science: 'العلوم والرياضيات',
  language: 'اللغات',
  social: 'العلوم الاجتماعية والوطنية',
};

// ── Animated Donut Chart ─────────────────────────────────────────────────
const CLUSTER_ORDER = ['language', 'science', 'social'];

const DONUT_CLUSTER_COLORS: Record<string, { stroke: string; glow: string; legendAr: string; legendEn: string }> = {
  language: { stroke: '#c084fc', glow: 'rgba(192,132,252,0.5)', legendAr: 'اللغات',           legendEn: 'Languages' },
  science:  { stroke: '#22d3ee', glow: 'rgba(34,211,238,0.5)',  legendAr: 'العلوم والرياضيات', legendEn: 'Sciences & Math' },
  social:   { stroke: '#e879f9', glow: 'rgba(232,121,249,0.5)', legendAr: 'الاجتماعيات',       legendEn: 'Social Studies' },
};

// Convert a 0-100 percentage to an SVG arc path on a circle
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}
function AnimatedDonutChart({
  grades,
  subjects,
  clusterColors: _clusterColors,
  clusterLabels: _clusterLabels,
  isAr,
}: {
  grades: Record<string, number>;
  subjects: Subject[];
  clusterColors: Record<string, string>;
  clusterLabels: Record<string, string>;
  isAr: boolean;
}) {
  const { t } = useTranslation();
  const cx = 110, cy = 110;
  const radii: Record<string, number> = { language: 80, science: 60, social: 40 };

  const getAvg = (cluster: string) => {
    const s = subjects.filter((sub: Subject) => sub.cluster === cluster);
    const vals = s.map((sub: Subject) => grades[sub.key] || 0);
    if (!vals.length) return 0;
    return Math.round(vals.reduce((a: number, b: number) => a + b, 0) / vals.length);
  };

  const GAP_DEG = 8; // gap at the "open" part of each ring

  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="220" viewBox="0 0 220 220" className="overflow-visible">
        <defs>
          {CLUSTER_ORDER.map(cluster => (
            <filter key={cluster} id={`glow-${cluster}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {CLUSTER_ORDER.map(cluster => {
          const avg = getAvg(cluster);
          const r = radii[cluster] || 0;
          const color = DONUT_CLUSTER_COLORS[cluster];
          const startAngle = -90 + GAP_DEG / 2;
          const fullSweep = 360 - GAP_DEG;
          const fillSweep = (avg / 100) * fullSweep;
          const endAngle = startAngle + fillSweep;
          const trackEnd = startAngle + fullSweep;

          return (
            <g key={cluster}>
              {/* Track (background ring) */}
              <path
                d={describeArc(cx, cy, r, startAngle, trackEnd)}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Animated fill */}
              <motion.path
                d={describeArc(cx, cy, r, startAngle, endAngle)}
                fill="none"
                stroke={color.stroke}
                strokeWidth="8"
                strokeLinecap="round"
                filter={`url(#glow-${cluster})`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: avg / 100 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.7 }}
              />
              {/* Percentage label */}
              <motion.text
                x={cx + (r - 22) * Math.cos(((startAngle + fullSweep / 2) * Math.PI) / 180)}
                y={cy + (r - 22) * Math.sin(((startAngle + fullSweep / 2) * Math.PI) / 180)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={color.stroke}
                fontSize="11"
                fontWeight="bold"
                fontFamily="Cairo, sans-serif"
                style={{ direction: 'ltr' }}
              >
                {avg}%
              </motion.text>
            </g>
          );
        })}

        {/* Center text */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Cairo, sans-serif" style={{ direction: 'ltr' }}>
          {Math.round(CLUSTER_ORDER.reduce((sum: number, c: string) => sum + getAvg(c), 0) / CLUSTER_ORDER.length)}%
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Cairo, sans-serif" style={{ direction: 'ltr' }}>
          {t('assess.generalAverage')}
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 w-full">
        {CLUSTER_ORDER.map(cluster => {
          const color = DONUT_CLUSTER_COLORS[cluster];
          const avg = getAvg(cluster);
          return (
            <div key={cluster} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color.stroke, boxShadow: `0 0 6px ${color.glow}` }} />
              <span className="text-xs text-slate-400 truncate">{isAr ? color.legendAr : color.legendEn}</span>
              <span className="text-xs font-bold ml-auto" style={{ color: color.stroke }}>{avg}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Grades() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { grades, setGrade, setCurrentStep } = useAssessmentStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';


  const isComplete = subjects.every(s => grades[s.key] !== undefined && grades[s.key] !== null && grades[s.key] !== 0);

  const handleSubmit = async () => {
    if (!isComplete) {
      setError(isAr
        ? 'الرجاء إدخال علامات جميع المباحث للتمكن من المتابعة (اسحب شريط كل مبحث لتحديد العلامة).'
        : 'Please enter grades for all subjects before continuing.');
      return;
    }
    if (!user) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const gradePayload = subjects.map(s => ({
        student_id: user.id,
        subject_key: s.key,
        subject_name_ar: s.nameAr,
        subject_name_en: s.nameEn,
        grade: grades[s.key],
        cluster: s.cluster
      }));

      // Delete existing grades for this user to avoid duplication during retakes
      await supabase
        .from('student_grades')
        .delete()
        .eq('student_id', user.id);

      const { error: insertError } = await supabase
        .from('student_grades')
        .insert(gradePayload);

      if (insertError) throw insertError;

      setCurrentStep('questions' as any);
      navigate('/assess/intro');
    } catch (err: any) {
      console.error('Error saving grades:', err);
      setError(err.message || 'حدث خطأ أثناء حفظ العلامات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white font-cairo pt-20 pb-12 px-4`} dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-to-l from-white via-white to-white/70 bg-clip-text text-transparent leading-relaxed">
            {isAr ? 'أهلاً بك في رحلة اكتشاف مسارك' : 'Welcome to Your Path Discovery Journey'}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {isAr ? 'لنبدأ بإدخال علاماتك في الصف العاشر. هذه العلامات تساعدنا في فهم ميولك الأكاديمية.' : 'Let\'s start by entering your 10th grade marks. These help us understand your academic strengths.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {subjects.map((subject, idx) => {
                  const accentColors: Record<string, string> = {
                    language: 'accent-purple-400',
                    science:  'accent-cyan-400',
                    social:   'accent-fuchsia-400',
                    applied:  'accent-purple-400', // fallback, won't show in chart
                  };

                  const badgeBorderColors: Record<string, string> = {
                    language: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
                    science:  'border-cyan-500/30 text-cyan-300 bg-cyan-500/10',
                    social:   'border-fuchsia-500/30 text-fuchsia-300 bg-fuchsia-500/10',
                    applied:  'border-purple-500/30 text-purple-300 bg-purple-500/10',
                  };

                  return (
                    <motion.div 
                      key={subject.key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <label className="text-slate-300 font-medium">
                          {isAr ? subject.nameAr : subject.nameEn}
                        </label>
                        <span className={`text-2xl font-bold px-3 py-1 rounded-lg border tabular-nums ${badgeBorderColors[subject.cluster]}`}>
                          {grades[subject.key] || 0}
                        </span>
                      </div>
                      <div className="relative group">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={grades[subject.key] || 0}
                          onChange={(e) => setGrade(subject.key, parseInt(e.target.value))}
                          className={`w-full h-2 bg-slate-800/60 rounded-lg appearance-none cursor-pointer ${accentColors[subject.cluster]} transition-colors`}
                        />
                        <div 
                          className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-slate-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                          dir="ltr"
                        >
                          <span>0</span>
                          <span>25</span>
                          <span>50</span>
                          <span>75</span>
                          <span>100</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-8 auth-error"
                >
                  {error}
                </motion.div>
              )}

              <div className="mt-12 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary w-fit px-12 py-4 text-lg"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isAr ? 'التالي' : 'Next'}</span>
                      <ChevronRight className="w-5 h-5 mr-2 -scale-x-100" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Animated Donut Chart */}
          <div className="space-y-6">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>{isAr ? 'نظرة عامة على أدائك' : 'Your Performance Overview'}</span>
              </h3>

              <AnimatedDonutChart grades={grades} subjects={subjects} clusterColors={clusterColors} clusterLabels={clusterLabels} isAr={isAr} />

              <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-sm text-slate-400 leading-relaxed text-right">
                <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
                  <Info className="w-4 h-4" />
                  <span>{isAr ? 'ملاحظة' : 'Note'}</span>
                </div>
                {isAr
                  ? 'تُستخدم هذه المعدلات لتوجيه خوارزمية التطابق نحو الحقول التي تظهر فيها تميزاً أكاديمياً.'
                  : 'These averages guide the matching algorithm toward fields where you show academic strength.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
