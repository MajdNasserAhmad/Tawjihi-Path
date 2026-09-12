import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, BrainCircuit, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../../components/landing/Navbar';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { supabase } from '../../lib/supabase';
import type { RIASECQuestion, BigFiveItem, SentinoResponse } from '../../types';

function FaceIcon({ type, color, size = 52 }: { type: 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy'; color: string; size?: number }) {
  const s = size;
  const cx = s / 2, cy = s / 2, r = s * 0.44;
  const eyeY = cy - r * 0.18;
  const eyeX = r * 0.35;
  const eyeR = s * 0.055;
  const sw = s * 0.055; // strokeWidth

  const mouthPaths: Record<string, string> = {
    'very-sad': `M ${cx - r*0.42} ${cy + r*0.32} Q ${cx} ${cy - r*0.08} ${cx + r*0.42} ${cy + r*0.32}`,
    'sad':      `M ${cx - r*0.38} ${cy + r*0.28} Q ${cx} ${cy + r*0.08} ${cx + r*0.38} ${cy + r*0.28}`,
    'neutral':  `M ${cx - r*0.38} ${cy + r*0.28} L ${cx + r*0.38} ${cy + r*0.28}`,
    'happy':    `M ${cx - r*0.38} ${cy + r*0.12} Q ${cx} ${cy + r*0.52} ${cx + r*0.38} ${cy + r*0.12}`,
    'very-happy': `M ${cx - r*0.42} ${cy + r*0.05} Q ${cx} ${cy + r*0.62} ${cx + r*0.42} ${cy + r*0.05}`,
  };

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={r} stroke={color} strokeWidth={sw} />
      {/* Left eye */}
      <circle cx={cx - eyeX} cy={eyeY} r={eyeR} fill={color} />
      {/* Right eye */}
      <circle cx={cx + eyeX} cy={eyeY} r={eyeR} fill={color} />
      {/* Mouth */}
      <path d={mouthPaths[type]} stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
}

const BIG_FIVE_TRANSLATIONS: Record<string, string> = {
  "I like order.": "أنا أحب النظام والترتيب.",
  "I take charge.": "أنا أتولى القيادة والمسؤولية.",
  "I insult people.": "أنا أهين الآخرين.",
  "I think quickly.": "أنا أفكر بسرعة ونباهة.",
  "I get angry easily.": "أنا أغضب بسهولة.",
  "I laugh a lot.": "أنا أضحك كثيراً.",
  "I seek conflict.": "أنا أسعى للمواجهة والخلافات.",
  "I waste my time.": "أنا أضيع وقتي.",
  "I seldom daydream.": "أنا نادراً ما أسترسل في أحلام اليقظة.",
  "I seldom feel blue.": "أنا نادراً ما أشعر بالحزن أو الكآبة.",
  "I mess things up.": "أنا أفسد الأمور.",
  "I get upset easily.": "أنا أنزعج وأتضايق بسهولة.",
  "I respect authority.": "أنا أحترم السلطة والقوانين.",
  "I have a lot of fun.": "أنا أستمتع بوقتي كثيراً.",
  "I do not like poetry.": "أنا لا أحب الشعر والقصائد.",
  "I dislike routine.": "أنا لا أحب الروتين.",
  "I love a good fight.": "أنا أحب خوض النقاشات الحادة والمواجهات.",
  "I worry about things.": "أنا أقلق بشأن الأمور.",
  "I am the first to act.": "أنا أول من يبادر بالتصرف.",
  "I learn things slowly.": "أنا أتعلم الأشياء ببطء."
};

export default function Questions() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const answerOptions = {
    riasec: [
      { value: 1, label: t('assess.riasec.opt1'), face: 'very-sad'   as const, color: '#f472b6', glowRgb: '244,114,182' },
      { value: 2, label: t('assess.riasec.opt2'), face: 'sad'        as const, color: '#a78bfa', glowRgb: '167,139,250' },
      { value: 3, label: t('assess.riasec.opt3'), face: 'neutral'    as const, color: '#94a3b8', glowRgb: '148,163,184' },
      { value: 4, label: t('assess.riasec.opt4'), face: 'happy'      as const, color: '#06b6d4', glowRgb: '6,182,212'   },
      { value: 5, label: t('assess.riasec.opt5'), face: 'very-happy' as const, color: '#22d3ee', glowRgb: '34,211,238'  },
    ],
    bigfive: [
      { value: 'strongly disagree',          label: t('assess.bigfive.opt1'), face: 'very-sad'   as const, color: '#f472b6', glowRgb: '244,114,182' },
      { value: 'disagree',                   label: t('assess.bigfive.opt2'), face: 'sad'        as const, color: '#a78bfa', glowRgb: '167,139,250' },
      { value: 'neither agree nor disagree', label: t('assess.bigfive.opt3'), face: 'neutral'    as const, color: '#94a3b8', glowRgb: '148,163,184' },
      { value: 'agree',                      label: t('assess.bigfive.opt4'), face: 'happy'      as const, color: '#06b6d4', glowRgb: '6,182,212'   },
      { value: 'strongly agree',             label: t('assess.bigfive.opt5'), face: 'very-happy' as const, color: '#22d3ee', glowRgb: '34,211,238'  },
    ],
  };

  const { 
    setRiasecAnswer, 
    setBigfiveItems, 
    setBigfiveResponse, 
    setCurrentStep,
    setQuestionnaireId,
    questionnaireId
  } = useAssessmentStore();

  const [riasecQs, setRiasecQs] = useState<RIASECQuestion[]>([]);
  const [bigfiveQs, setBigfiveQs] = useState<BigFiveItem[]>([]);

  const [riasecAnswers, setLocalRiasecAnswers] = useState<Record<number, number>>({});
  const [bigfiveAnswers, setLocalBigfiveAnswers] = useState<Record<number, SentinoResponse>>({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
const [showSectionBridge, setShowSectionBridge] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        setError(null);

        const [onetRes, sentinoRes] = await Promise.all([
          supabase.functions.invoke('onet-proxy', { body: { action: 'get_questions' } }),
          supabase.functions.invoke('sentino-proxy', { body: { action: 'get_questions' } })
        ]);

        if (onetRes.error) throw onetRes.error;
        if (sentinoRes.error) throw sentinoRes.error;

        const mappedRiasec = (onetRes.data.questions || []).map((q: any) => ({
          onet_index: q.index,
          text_ar: q.text_ar || q.text,
          text_en: q.text
        }));

        const qId = sentinoRes.data.questionnaire_id;
        if (qId) {
          setQuestionnaireId(qId);
        }

        const rawItems = sentinoRes.data.items || sentinoRes.data.questions || (sentinoRes.data.questionnaire && sentinoRes.data.questionnaire.items) || [];
        
        const normalizedTranslations: Record<string, string> = {};
        Object.entries(BIG_FIVE_TRANSLATIONS).forEach(([key, val]) => {
          normalizedTranslations[key.trim().toLowerCase()] = val;
        });

        let mappedBigfive: BigFiveItem[] = rawItems.map((item: any, i: number) => {
          const englishText = typeof item === 'string' ? item : (item.item || item.text || '');
          let arabicText = typeof item === 'string' ? item : (item.text_ar || item.item || item.text || '');

          // Attempt direct translation lookup
          if (!arabicText || arabicText === englishText) {
            const cleanKey = englishText.trim();
            if (BIG_FIVE_TRANSLATIONS[cleanKey]) {
              arabicText = BIG_FIVE_TRANSLATIONS[cleanKey];
            } else {
              // Normalized lookup (case‑insensitive, trimmed)
              const normKey = cleanKey.toLowerCase();
              if (normalizedTranslations[normKey]) {
                arabicText = normalizedTranslations[normKey];
              }
            }
          }

          return {
            index: i,
            text_en: englishText,
            // If text_ar is still empty or matches English (never translated), keep English as safe fallback
            text_ar: arabicText && arabicText !== englishText && arabicText.trim() !== '' ? arabicText : englishText,
            response: null
          };
        });

        // Dynamic translation fallback — only translate items with actual English text
        const itemsToTranslate = mappedBigfive.filter(
          (item: BigFiveItem) =>
            item.text_en.trim() !== '' &&          // skip empty strings
            (!item.text_ar || item.text_ar === item.text_en)
        );

        if (itemsToTranslate.length > 0) {
          try {
            console.log(`Translating ${itemsToTranslate.length} Sentino questions dynamically...`);
            const translationRes = await supabase.functions.invoke('gemini-service', {
              body: {
                action: 'translate_bigfive',
                payload: {
                  items: itemsToTranslate.map((item: BigFiveItem) => item.text_en)
                }
              }
            });
            if (translationRes.data && translationRes.data.result) {
              const translations = translationRes.data.result;
              mappedBigfive = mappedBigfive.map((item: BigFiveItem) => {
                if (!item.text_ar || item.text_ar === item.text_en) {
                  const idxInPayload = itemsToTranslate.findIndex((tItem: BigFiveItem) => tItem.index === item.index);
                  if (idxInPayload !== -1) {
                    const trans = translations.find((t: any) => t.index === idxInPayload);
                    if (trans && trans.text_ar && trans.text_ar !== item.text_en) {
                      return { ...item, text_ar: trans.text_ar };
                    }
                  }
                }
                return item;
              });
            }
          } catch (transErr) {
            console.error('Failed to translate remaining Sentino questions dynamically:', transErr);
          }
        }

        setRiasecQs(mappedRiasec);
        setBigfiveQs(mappedBigfive);
        setBigfiveItems(mappedBigfive);
      } catch (err: any) {
        console.error('Error fetching questions:', err);
        setError(err.message || (isAr ? 'حدث خطأ أثناء تحميل الأسئلة' : 'An error occurred while loading questions'));
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [setBigfiveItems, setQuestionnaireId]);

  const handleRiasecSelect = (index: number, value: number) => {
    setLocalRiasecAnswers(prev => ({ ...prev, [index]: value }));
    setRiasecAnswer(index, value);
  };

  const handleBigfiveSelect = (index: number, value: SentinoResponse) => {
    setLocalBigfiveAnswers(prev => ({ ...prev, [index]: value }));
    setBigfiveResponse(index, value);
  };

  // Build this inside the component after loading:
  const allQuestions = [
    ...riasecQs.map((q, i) => ({
      id: `riasec-${q.onet_index}`,
      text: isAr ? q.text_ar : q.text_en,
      section: 'riasec' as const,
      index: i,
      onetIndex: q.onet_index,
    })),
    ...bigfiveQs.map((q) => ({
      id: `bigfive-${q.index}`,
      text: isAr ? q.text_ar : q.text_en,
      section: 'bigfive' as const,
      index: q.index,
      onetIndex: -1,
    })),
  ];
  const totalQ = allQuestions.length;
  const currentQ = allQuestions[currentIndex];

  const answeredCount = Object.keys(riasecAnswers).length + Object.keys(bigfiveAnswers).length;

  const getCurrentAnswer = () => {
    if (!currentQ) return null;
    return currentQ.section === 'riasec'
      ? riasecAnswers[currentQ.onetIndex]
      : bigfiveAnswers[currentQ.index];
  };

  const handleAnswer = (value: number | string) => {
    if (!currentQ) return;
    if (currentQ.section === 'riasec') {
      handleRiasecSelect(currentQ.onetIndex, value as number);
    } else {
      handleBigfiveSelect(currentQ.index, value as SentinoResponse);
    }
  };

  const goNext = () => {
    if (
      currentIndex === riasecQs.length - 1 &&
      currentQ?.section === 'riasec' &&
      !showSectionBridge
    ) {
      setShowSectionBridge(true);
      // Auto-advance after 3 seconds
      setTimeout(() => {
        setShowSectionBridge(false);
        setCurrentIndex(i => i + 1);
      }, 3000);
      return;
    }
    setShowSectionBridge(false);
    if (currentIndex < totalQ - 1) setCurrentIndex(i => i + 1);
    else handleSubmit();
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleSubmit = async () => {
    const isComplete = answeredCount === totalQ && totalQ > 0;
    if (!isComplete) {
      setError(isAr ? 'الرجاء الإجابة على جميع الأسئلة للتمكن من المتابعة.' : 'Please answer all questions to proceed.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const answersString = Array.from({ length: 30 }, (_, i) => riasecAnswers[i + 1] || 3).join('');
      const sentinoItems = bigfiveQs.map(q => ({
        text: q.text_en,
        response: bigfiveAnswers[q.index]
      }));

      // Call both APIs simultaneously to submit answers
      const [onetRes, sentinoRes] = await Promise.all([
        supabase.functions.invoke('onet-proxy', {
          body: { action: 'submit_answers', answers: answersString }
        }),
        supabase.functions.invoke('sentino-proxy', {
          body: { 
            action: 'submit_answers', 
            items: sentinoItems,
            questionnaire_id: questionnaireId
          }
        })
      ]);

      if (onetRes.error) throw onetRes.error;
      if (sentinoRes.error) throw sentinoRes.error;

      // Ensure Processing has access to the answers
      setCurrentStep('processing');
      navigate('/assess/processing');
    } catch (err: any) {
      console.error('Error submitting answers:', err);
      setError(err.message || (isAr ? 'حدث خطأ أثناء إرسال الإجابات. يرجى المحاولة مرة أخرى.' : 'An error occurred while submitting answers. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="h-screen overflow-hidden text-white font-cairo"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        backgroundImage: 'url(/questions_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#020817',
        imageRendering: 'crisp-edges',
      }}
    >
      {/* Dark overlay so text is readable over the bg image */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'rgba(2,8,23,0.55)' }}
      />

      <Navbar />

      {/* Loading state */}
      {loading && (
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Error state (when questions fail to load) */}
      {!loading && error && totalQ === 0 && (
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="glass-card p-12 text-center max-w-md">
            <BrainCircuit className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">{isAr ? 'عذراً، حدث خطأ' : 'An Error Occurred'}</h2>
            <p className="text-slate-400 mb-8">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary w-full">
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </div>
        </div>
      )}

      {/* Main layout — only shown once questions are loaded */}
      {!loading && totalQ > 0 && currentQ && (
        <>
          {showSectionBridge && (
            <motion.div
              key="section-bridge"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute inset-x-0 z-30 flex flex-col items-center justify-center pointer-events-none"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
              dir={isAr ? 'rtl' : 'ltr'}
            >
              {/* Fiery glow pill */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(234,88,12,0.18), rgba(239,68,68,0.18))',
                  border: '1.5px solid rgba(251,146,60,0.55)',
                  boxShadow: '0 0 32px rgba(234,88,12,0.5), 0 0 72px rgba(239,68,68,0.25)',
                  backdropFilter: 'blur(18px)',
                  borderRadius: '999px',
                  padding: '18px 40px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  minWidth: '260px',
                }}
              >
                {/* Animated fire emoji + badge */}
                <motion.span
                  animate={{ scale: [1, 1.2, 1], rotate: [-6, 6, -6] }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ fontSize: '1.6rem', lineHeight: 1 }}
                >
                  🔥
                </motion.span>
                <motion.p
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', bounce: 0.4 }}
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    letterSpacing: '0.01em',
                    background: 'linear-gradient(90deg, #fb923c, #f87171, #fbbf24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textAlign: 'center',
                    margin: 0,
                  }}
                >
                  {isAr ? '🎉 القسم الأول مكتمل — الآن القسم الثاني!' : '🎉 Part 1 done — Starting Part 2!'}
                </motion.p>
                {/* Countdown dots */}
                <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      style={{
                        display: 'inline-block',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#fb923c',
                      }}
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.33,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {!showSectionBridge && (
            <div className="relative z-10 h-screen flex flex-col">
          {/* 3-column area — ALWAYS ltr layout: */}
          <div 
            className="flex-1 flex items-stretch gap-0 overflow-hidden pt-20"
            style={{ height: 'calc(100vh - 80px)', direction: 'ltr' }}
          >

            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex w-[240px] flex-shrink-0 flex-col justify-center items-center px-6 gap-8 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
              {/* Motivational Quote Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl p-6 text-center w-full"
                style={{
                  background: 'rgba(8,10,28,0.85)',
                  border: '1px solid rgba(192,132,252,0.3)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 35px rgba(192,132,252,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                {/* Two glowing quote marks exactly like the reference */}
                <div className="flex justify-center gap-3 mb-5">
                  {['❝', '❝'].map((q, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '2.4rem',
                        fontWeight: 900,
                        color: '#c084fc',
                        textShadow: '0 0 12px rgba(192,132,252,0.9), 0 0 30px rgba(192,132,252,0.5)',
                        lineHeight: 1,
                        fontFamily: 'Georgia, serif',
                      }}
                    >
                      {q}
                    </span>
                  ))}
                </div>

                <p
                  className="text-slate-200 text-sm leading-relaxed font-medium"
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  {isAr
                    ? 'كل إجابة تقربك خطوة من اكتشاف تخصصك المثالي'
                    : 'Every answer brings you one step closer to your ideal major'}
                </p>
              </motion.div>
            </div>

            {/* ── CENTER PANEL ── */}
            <div className="flex-1 flex flex-col justify-center px-4 md:px-6 py-4 max-w-3xl mx-auto w-full overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>

              {/* Progress bar row */}
              <div className="flex items-center gap-4 mb-3">
                {/* Back button */}
                {currentIndex > 0 && (
                  <button
                    onClick={goPrev}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all text-sm font-bold backdrop-blur-md"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {t('assess.back')}
                  </button>
                )}

                {/* Progress track */}
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-center text-sm text-slate-300 font-medium">
                    {isAr
                      ? `السؤال ${currentIndex + 1} من ${totalQ}`
                      : `Question ${currentIndex + 1} of ${totalQ}`}
                  </p>
                  <div className="relative h-2 w-full rounded-full bg-white/10 overflow-visible">
                    {/* Glowing fill */}
                    <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
                       transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                       className="h-full rounded-full"
                       style={{ background: isAr ? 'linear-gradient(to left, #c084fc, #22d3ee)' : 'linear-gradient(to right, #c084fc, #22d3ee)' }}
                    />
                    {/* Glowing dot at progress tip */}
                    <motion.div
                      animate={{ 
                        right: isAr 
                          ? `${((currentIndex + 1) / totalQ) * 100}%` 
                          : `${100 - ((currentIndex + 1) / totalQ) * 100}%` 
                      }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                      className="absolute top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400"
                      style={{ boxShadow: '0 0 8px #22d3ee, 0 0 16px #22d3ee' }}
                    />
                  </div>
                </div>
              </div>

              {/* Mobile compact progress top bar */}
              <div 
                className="flex lg:hidden items-center justify-between px-3 py-2 mb-3 text-xs bg-white/5 border border-white/10 rounded-xl backdrop-blur-md"
                dir={isAr ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="font-bold text-slate-300">
                    {currentQ.section === 'riasec' ? t('assess.vocational') : t('assess.personality')}
                    {' • '}
                    {isAr
                      ? `${answeredCount} / ${totalQ} أجبت`
                      : `${answeredCount} / ${totalQ} Answered`}
                  </span>
                </div>
                <div className="text-indigo-400 font-black text-sm tabular-nums">
                  {Math.round((answeredCount / Math.max(totalQ, 1)) * 100)}%
                </div>
              </div>

              {/* Question Card */}
              <motion.div
                key={currentQ.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl p-5 md:p-6 relative"
                style={{
                  boxShadow: '0 0 40px rgba(99,102,241,0.2), 0 0 80px rgba(34,211,238,0.08), inset 0 1px 0 rgba(255,255,255,0.08)',
                  border: '1px solid rgba(99,102,241,0.25)',
                  background: 'rgba(15,18,40,0.75)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Question number badge */}
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-indigo-400" />
                  </div>
                </div>

                <p className="text-slate-400 text-center text-sm mb-1 font-bold tabular-nums">
                  .{currentIndex + 1}
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-center mb-1 leading-relaxed">
                  {currentQ.text}
                </h2>


                {/* Answer Buttons */}
                <div className="grid grid-cols-5 gap-3" dir="ltr">
                  {(currentQ.section === 'riasec' ? answerOptions.riasec : answerOptions.bigfive).map((opt) => {
                    const isSelected = getCurrentAnswer() === opt.value;

                    return (
                      <button
                        key={String(opt.value)}
                        onClick={() => handleAnswer(opt.value)}
                        className="relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
                        style={{
                          background: isSelected ? `rgba(${opt.glowRgb}, 0.1)` : 'rgba(255,255,255,0.04)',
                          border: isSelected ? `2px solid ${opt.color}` : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: isSelected
                            ? `0 0 18px rgba(${opt.glowRgb}, 0.6), 0 0 36px rgba(${opt.glowRgb}, 0.25)`
                            : 'none',
                          transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            const el = e.currentTarget as HTMLElement;
                            el.style.boxShadow = `0 0 14px rgba(${opt.glowRgb}, 0.45)`;
                            el.style.border = `1px solid rgba(${opt.glowRgb}, 0.55)`;
                            el.style.transform = 'scale(1.04)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            const el = e.currentTarget as HTMLElement;
                            el.style.boxShadow = 'none';
                            el.style.border = '1px solid rgba(255,255,255,0.1)';
                            el.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        {/* Checkmark badge when selected — top right corner */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}

                        {/* SVG face with neon glow */}
                        <div style={{ filter: `drop-shadow(0 0 6px rgba(${opt.glowRgb}, 0.8))` }}>
                          <FaceIcon type={opt.face} color={opt.color} size={52} />
                        </div>

                        <span className="text-slate-300 text-center text-xs leading-tight font-medium">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Error message */}
                {error && (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center font-bold">
                    {error}
                  </div>
                )}
              </motion.div>

              {/* Previous / Next buttons */}
              <div className="flex justify-between items-center mt-4 gap-4" dir="ltr">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold backdrop-blur-md"
                >
                  <ChevronRight className="w-5 h-5 -scale-x-100" />
                  {t('assess.prevQuestion')}
                </button>

                <button
                  onClick={goNext}
                  disabled={getCurrentAnswer() === undefined || getCurrentAnswer() === null}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    boxShadow: getCurrentAnswer() !== undefined ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                  }}
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {currentIndex === totalQ - 1
                        ? t('assess.submitBtn')
                        : t('assess.nextQuestion')}
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Bottom disclaimer */}
              <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-[10px]">
                <span>🔒</span>
                <span>
                  {isAr
                    ? "لن يتم حفظ تقدمك حتى تضغط على 'إرسال جميع الإجابات' في النهاية"
                    : "Your progress won't be saved until you click 'Submit All Answers'"}
                </span>
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="hidden lg:flex w-[240px] flex-shrink-0 flex-col justify-center px-6 gap-6 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
              {/* Progress Donut Card */}
              <div 
                className="rounded-2xl border border-white/10 p-5"
                style={{
                  boxShadow: '0 0 30px rgba(34,211,238,0.12), 0 0 60px rgba(34,211,238,0.05)',
                  border: '1px solid rgba(34,211,238,0.2)',
                  background: 'rgba(15,18,40,0.7)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <h3 className="text-center font-bold text-sm mb-4 text-slate-300">
                  {t('assess.progress')}
                </h3>

                {/* SVG donut */}
                <div className="flex justify-center mb-3">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    {/* Track */}
                    <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                    {/* Fill */}
                    <motion.circle
                      cx="60" cy="60" r="48"
                      fill="none"
                      stroke="url(#progressGrad)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 48 * (1 - answeredCount / Math.max(totalQ, 1))
                      }}
                      transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
                      style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)' }}
                    />
                    <defs>
                      <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                    <text x="60" y="54" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="Cairo">
                      {Math.round((answeredCount / Math.max(totalQ, 1)) * 100)}%
                    </text>
                    <text x="60" y="70" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="Cairo">
                      {answeredCount} / {totalQ}
                    </text>
                    <text x="60" y="82" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="Cairo">
                      {t('assess.currentQ')}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Sections Card */}
              <div 
                className="rounded-2xl border border-white/10 p-5 space-y-4"
                style={{
                  boxShadow: '0 0 30px rgba(34,211,238,0.12), 0 0 60px rgba(34,211,238,0.05)',
                  border: '1px solid rgba(34,211,238,0.2)',
                  background: 'rgba(15,18,40,0.7)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <h3 className="font-bold text-sm text-slate-300 text-center">
                  {t('assess.sections')}
                </h3>

                {/* RIASEC section */}
                {(() => {
                  const riasecAnswered = Object.keys(riasecAnswers).length;
                  const riasecPct = riasecQs.length > 0 ? Math.round((riasecAnswered / riasecQs.length) * 100) : 0;
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                          </div>
                          <span className="text-slate-300">{t('assess.vocational')}</span>
                        </div>
                        <span className="font-bold text-indigo-400">{riasecPct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${riasecPct}%` }}
                          className="h-full rounded-full bg-indigo-400"
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Big Five section */}
                {(() => {
                  const bfAnswered = Object.keys(bigfiveAnswers).length;
                  const bfPct = bigfiveQs.length > 0 ? Math.round((bfAnswered / bigfiveQs.length) * 100) : 0;
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          </div>
                          <span className="text-slate-300">{t('assess.personality')}</span>
                        </div>
                        <span className="font-bold text-purple-400">{bfPct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${bfPct}%` }}
                          className="h-full rounded-full bg-purple-400"
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
}