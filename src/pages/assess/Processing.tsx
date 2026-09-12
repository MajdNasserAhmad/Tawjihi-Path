import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Briefcase, Brain, Timer, Sparkles, Check, Shield, AlertCircle, Lock } from 'lucide-react';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { supabase } from '../../lib/supabase';

const getSteps = () => [
  {
    id: 1,
    titleAr: 'استرجاع بياناتك الأكاديمية',
    titleEn: 'Retrieving Your Academic Data',
    subtitleAr: 'تم استرجاع بياناتك الدراسية بنجاح',
    subtitleEn: 'Your academic data was retrieved successfully',
    icon: Database,
    color: '#06b6d4',
  },
  {
    id: 2,
    titleAr: 'تحليل ميولك المهنية (RIASEC)',
    titleEn: 'Analyzing Career Interests (RIASEC)',
    subtitleAr: 'تم تحليل ميولك المهنية بدقة',
    subtitleEn: 'Your career interests have been analyzed',
    icon: Briefcase,
    color: '#a855f7',
  },
  {
    id: 3,
    titleAr: 'تحليل السمات الشخصية (Big Five)',
    titleEn: 'Analyzing Personality Traits (Big Five)',
    subtitleAr: 'تم تحليل شخصيتك وفق نموذج العوامل الخمسة الكبرى',
    subtitleEn: 'Your personality analyzed using the Big Five model',
    icon: Brain,
    color: '#0ea5e9',
  },
  {
    id: 4,
    titleAr: 'مطابقة النتائج مع المسارات الأكاديمية',
    titleEn: 'Matching Results with Academic Paths',
    subtitleAr: 'جاري مطابقة نتائجك مع أفضل المسارات المناسبة لك...',
    subtitleEn: 'Matching your results with the best academic paths for you...',
    icon: Timer,
    color: '#8b5cf6',
  },
  {
    id: 5,
    titleAr: 'إنشاء التوصيات الشخصية النهائية',
    titleEn: 'Creating Your Final Personalized Recommendations',
    subtitleAr: 'جاري إعداد توصياتك المخصصة لك...',
    subtitleEn: 'Preparing your personalized recommendations...',
    icon: Sparkles,
    color: '#c084fc',
  },
];

export default function Processing() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const { riasecAnswerString, bigfiveItems } = useAssessmentStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = getSteps();

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1500);

    async function processResults() {
      try {
        const bigfive_responses = bigfiveItems.map((item) => ({
          text: item.text_en,
          response: item.response,
        }));

        const { data, error: functionError } = await supabase.functions.invoke('calculate-results', {
          body: {
            riasec_answers: riasecAnswerString,
            bigfive_responses,
          },
        });

        if (functionError) throw functionError;

        setCurrentStepIndex(4);
        setTimeout(() => {
          navigate(`/assess/results/${data.id}`);
        }, 1000);
      } catch (err: any) {
        console.error('Error processing results:', err);
        setError(
          isAr
            ? 'حدث خطأ أثناء معالجة النتائج. يرجى المحاولة مرة أخرى.'
            : 'An error occurred while processing your results. Please try again.'
        );
      }
    }

    processResults();
    return () => clearInterval(stepInterval);
  }, [navigate, riasecAnswerString, bigfiveItems]);

  // ── Error state ──────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6 font-cairo text-white"
        style={{ background: '#07062e' }}
        dir={dir}
      >
        <div className="bg-white/5 border border-red-500/30 rounded-2xl p-8 text-center max-w-md backdrop-blur-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3">
            {isAr ? 'عذراً، حدث خطأ ما' : 'Something went wrong'}
          </h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 font-bold transition-colors"
          >
            {isAr ? 'العودة للمحاولة مرة أخرى' : 'Go back and try again'}
          </button>
        </div>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen font-cairo text-white relative overflow-y-auto overflow-x-hidden flex flex-col"
      style={{ background: '#07062e' }}
      dir={dir}
    >
      {/* Background image — positioned at top, fades out downward */}
      <div
        className="absolute inset-x-0 top-0 h-[55vh] pointer-events-none z-0"
        style={{
          backgroundImage: "url('/Processing-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top center',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      />

      {/* Subtle radial glow behind content */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-start flex-1 px-4 pt-[38vh] pb-16">
        <div className="w-full max-w-lg">

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-2xl md:text-3xl font-black text-white leading-snug mb-3">
              {isAr ? (
                <>
                  جاري رسم خريطتك{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    الأكاديمية...
                  </span>
                </>
              ) : (
                <>
                  Mapping Your{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Academic Profile...
                  </span>
                </>
              )}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
              {isAr
                ? 'نقوم بتحليل شخصيتك وميولك ونتائجك لاكتشاف المسار الأنسب لك.'
                : "We're analyzing your personality, interests, and results to find your best path."}
            </p>
          </motion.div>

          {/* Steps list */}
          <div className="space-y-3 mb-6 relative">
            {/* Vertical connector line */}
            <div
              className="absolute top-[12px] bottom-[12px] left-[11px] w-[2px] bg-purple-500/15 pointer-events-none"
            />
            {steps.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;
              const isPending = idx > currentStepIndex;
              const Icon = step.icon;
              const title = isAr ? step.titleAr : step.titleEn;
              const subtitle = isAr ? step.subtitleAr : step.subtitleEn;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="flex items-center gap-4"
                  style={{ flexDirection: 'row' }} // Always LTR: Circle on the left, Card on the right
                >
                  {/* Left connector dot */}
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <AnimatePresence mode="wait">
                      {isDone ? (
                        <motion.div
                          key="done"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 rounded-full border border-purple-500/40 bg-purple-500/10 flex items-center justify-center relative z-10"
                        >
                          <Check className="w-3.5 h-3.5 text-purple-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="not-done"
                          className="w-6 h-6 rounded-full border-2 border-dashed border-purple-500/40 bg-purple-500/5 relative z-10"
                          animate={isActive ? { rotate: 360 } : {}}
                          transition={isActive ? { duration: 10, repeat: Infinity, ease: 'linear' } : {}}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Card */}
                  <div
                    className="flex-1 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-500"
                    style={{
                      flexDirection: 'row', // Always LTR structure: [Text, Icon, Checkmark]
                      background: isDone
                        ? `${step.color}0a`
                        : isActive
                        ? `${step.color}14`
                        : 'rgba(255, 255, 255, 0.02)',
                      border: isDone
                        ? `1px solid ${step.color}33`
                        : isActive
                        ? `1px solid ${step.color}66`
                        : '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    {/* Text */}
                    <div className={`flex-1 min-w-0 ${isAr ? 'text-right' : 'text-left'}`}>
                      <p
                        className="text-sm font-bold leading-tight transition-colors duration-500"
                        style={{
                          color: isDone || isActive ? '#ffffff' : '#64748b',
                        }}
                      >
                        {title}
                      </p>
                      <AnimatePresence>
                        {(isDone || isActive) && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs mt-1 leading-snug font-medium"
                            style={{ color: step.color }}
                          >
                            {subtitle}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Icon box */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500"
                      style={{
                        background: isPending
                          ? 'rgba(255, 255, 255, 0.02)'
                          : `${step.color}1c`,
                        border: isPending
                          ? '1px solid rgba(255, 255, 255, 0.05)'
                          : `1px solid ${step.color}44`,
                      }}
                    >
                      <Icon
                        className="w-5 h-5 transition-colors duration-500"
                        style={{ color: isPending ? '#475569' : step.color }}
                      />
                    </div>

                    {/* Right checkmark for done */}
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <AnimatePresence>
                        {isDone && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Check className="w-4 h-4 text-emerald-400" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Privacy note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="rounded-xl px-5 py-4 flex items-center gap-3 mt-2"
            style={{
              flexDirection: 'row', // Always LTR
              background: 'rgba(124, 58, 237, 0.05)',
              border: '1px solid rgba(124, 58, 237, 0.15)',
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(124, 58, 237, 0.12)',
                border: '1px solid rgba(124, 58, 237, 0.25)',
              }}
            >
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div className={`flex-1 min-w-0 ${isAr ? 'text-right' : 'text-left'}`}>
              <p className="text-sm font-bold text-white">
                {isAr ? 'خصوصيتك أمنة' : 'Your Privacy is Safe'}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                {isAr
                  ? 'جميع بياناتك محمية ومشفرة ولا يتم مشاركتها مع أي جهة خارجية'
                  : 'All your data is protected, encrypted, and never shared with any external party'}
              </p>
            </div>
            <div className="w-5 h-5 flex items-center justify-center shrink-0 ml-auto">
              <Lock className="w-4 h-4 text-purple-400/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}