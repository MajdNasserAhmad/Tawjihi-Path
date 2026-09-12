import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, BookOpen, GraduationCap, Share2, Download,
  ChevronDown, ChevronUp, Sparkles, MessageSquare, TrendingUp, UserCircle,
  AlertCircle, Loader2, X, Briefcase, ChevronRight
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { supabase } from '../../lib/supabase';
import { Navbar } from '../../components/landing/Navbar';
import { useTranslation } from 'react-i18next';
import type { FieldId } from '../../types';
import { fieldData } from '../../data/fieldData';

// ─── Bilingual Static Data ────────────────────────────────────────────────────

const riasecLabels: Record<string, { ar: string; en: string }> = {
  R: { ar: 'واقعي',     en: 'Realistic' },
  I: { ar: 'استقصائي', en: 'Investigative' },
  A: { ar: 'فني',       en: 'Artistic' },
  S: { ar: 'اجتماعي',  en: 'Social' },
  E: { ar: 'مبادر',    en: 'Enterprising' },
  C: { ar: 'تقليدي',   en: 'Conventional' },
};

const bigFiveLabels: Record<string, { ar: string; en: string }> = {
  O: { ar: 'الانفتاح',  en: 'Openness' },
  C: { ar: 'الضمير',    en: 'Conscientiousness' },
  E: { ar: 'الانبساط',  en: 'Extraversion' },
  A: { ar: 'القبول',    en: 'Agreeableness' },
  N: { ar: 'العصبية',  en: 'Neuroticism' },
};

const electiveKeys: Record<string, { ar: string; en: string }> = {
  math:              { ar: 'الرياضيات',              en: 'Mathematics' },
  physics:           { ar: 'الفيزياء',               en: 'Physics' },
  chemistry:         { ar: 'الكيمياء',               en: 'Chemistry' },
  biology:           { ar: 'الأحياء',                en: 'Biology' },
  earth_sciences:    { ar: 'علوم الأرض',             en: 'Earth Sciences' },
  history:           { ar: 'التاريخ',                en: 'History' },
  geography:         { ar: 'الجغرافيا',              en: 'Geography' },
  digital_skills:    { ar: 'المهارات الرقمية',       en: 'Digital Skills' },
  management:        { ar: 'الإدارة',                en: 'Management' },
  vocational_digital:{ ar: 'التربية المهنية والرقمية', en: 'Vocational & Digital Education' },
};


const CAREERS_FALLBACK: Record<string, { ar: { jobs: string[]; majors: string[] }; en: { jobs: string[]; majors: string[] } }> = {
  health: {
    ar: {
      jobs:   ['طبيب / طبيبة', 'صيدلاني / صيدلانية', 'ممرض / ممرضة متخصص'],
      majors: ['الطب البشري',   'طب الأسنان',          'الصيدلة'],
    },
    en: {
      jobs:   ['General Practitioner / Doctor', 'Pharmacist', 'Specialist Nurse'],
      majors: ['Medicine', 'Dentistry', 'Pharmacy'],
    },
  },
  engineering_tech: {
    ar: {
      jobs:   ['مهندس برمجيات', 'مهندس مدني', 'محلل بيانات وذكاء اصطناعي'],
      majors: ['هندسة الحاسوب', 'الهندسة المدنية', 'علم البيانات والذكاء الاصطناعي'],
    },
    en: {
      jobs:   ['Software Engineer', 'Civil Engineer', 'Data & AI Analyst'],
      majors: ['Computer Engineering', 'Civil Engineering', 'Data Science & AI'],
    },
  },
  business: {
    ar: {
      jobs:   ['مدير أعمال', 'محاسب قانوني', 'مختص تسويق رقمي'],
      majors: ['إدارة الأعمال', 'المحاسبة', 'التسويق الرقمي'],
    },
    en: {
      jobs:   ['Business Manager', 'Certified Accountant', 'Digital Marketing Specialist'],
      majors: ['Business Administration', 'Accounting', 'Digital Marketing'],
    },
  },
  law_sharia_languages: {
    ar: {
      jobs:   ['محامٍ / محامية', 'صحفي / إعلامي', 'مترجم معتمد'],
      majors: ['القانون', 'الإعلام والاتصال', 'اللغة الإنجليزية التطبيقية'],
    },
    en: {
      jobs:   ['Lawyer', 'Journalist / Media Specialist', 'Certified Translator'],
      majors: ['Law', 'Media & Communication', 'Applied English'],
    },
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const resetAssessment = useAssessmentStore((state) => state.reset);
  void resetAssessment; // kept for potential future use

  const [result, setResult]                 = useState<any | null>(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState<string | null>(null);
  const [expandedField, setExpandedField]   = useState<string | null>(null);
  const [matchCounter, setMatchCounter]     = useState(0);
  const [showAllFields, setShowAllFields]   = useState(false);

  const [modalTitle, setModalTitle]         = useState<string | null>(null);
  const [modalDesc, setModalDesc]           = useState<string | null>(null);
  const [loadingDesc, setLoadingDesc]       = useState(false);

  const [fieldCareers, setFieldCareers]     = useState<Record<string, { jobs: string[]; majors: string[] }>>({});
  const [loadingCareers, setLoadingCareers] = useState<string | null>(null);

  const [isChatOpen, setIsChatOpen]         = useState(false);
  const [chatMessages, setChatMessages]     = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput]           = useState('');
  const [isTyping, setIsTyping]             = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Inline translations ────────────────────────────────────────────────────
  const tx = {
    loading:          isAr ? 'جاري جلب تقريرك المخصص...'          : 'Loading your personalized report...',
    errorTitle:       isAr ? 'خطأ في استرجاع النتائج'             : 'Error Retrieving Results',
    errorDefault:     isAr ? 'تعذر العثور على التقرير.'            : 'Report not found. Please check the link or retake the assessment.',
    retakeBtn:        isAr ? 'إعادة الاختبار'                      : 'Retake Assessment',
    overallScore:     isAr ? 'نتيجتك العامة'                       : 'Your Overall Score',
    highMatch:        isAr ? 'مستوى مرتفع جداً'                    : 'Very High Match',
    bestField:        isAr ? 'أفضل حقل لك'                         : 'Your Best Field',
    completed:        isAr ? 'اكتمل التقييم بنجاح'                : 'Assessment Completed Successfully',
    heroSubtitle:     isAr ? 'انطلق لتحقيق أهدافك وطموحاتك بمقترحات مخصصة لك — الاختيار الأنسب الذي يقودك نحو مستقبل متميز.'
                           : 'Launch toward your goals with personalized recommendations — the right choice to lead you to a distinguished future.',
    downloadBtn:      isAr ? 'تحميل التقرير'                       : 'Download Report',
    shareBtn:         isAr ? 'مشاركة النتيجة'                      : 'Share Result',
    whySectionTitle:  isAr ? 'لماذا هذا الحقل؟'                   : 'Why This Field?',
    whyNarrativeFallback: isAr
      ? 'انت تتميز بقدرة فريدة على الجمع بين المهارات العملية والتطبيقية مع الفضول الاستقصائي والتحليلي، وهذا يجعل هذا الحقل مناسبا لك بشكل كبير. ستجد ان مهاراتك في التحليل والاستقصاء ستساعدك في فهم وتحليل الحالات وتطوير حلول فعالة. كما ان سماتك الشخصية مثل التعاون والتعاطف والانفتاح الفكري تجعلك شخصا قادرا على العمل بشكل جيد مع الزملاء في بيئة عمل تعاونية. سوف تنجح في هذا الحقل لانك تملك سمات قوية تجعلك شخصا رائعا في التعامل مع الاخرين.'
      : 'You stand out for your ability to combine practical, hands-on skills with strong analytical and investigative curiosity, which makes this field a great match for you. Your research and analytical abilities will help you understand situations and develop effective solutions. Your personal qualities, such as collaboration, empathy, and intellectual openness, also make you someone who works well with others in a team-oriented environment. You are set to thrive in this field thanks to these strong personal and professional traits.',
    traitComm:        isAr ? 'تتمتع بمهارات تواصل قوية'           : 'You have strong communication skills',
    traitEmpathy:     isAr ? 'لديك حس عالٍ بالتعاطف والمسؤولية'  : 'You have a high sense of empathy and responsibility',
    traitAnalytical:  isAr ? 'تميل إلى فهم الناس وحل المشكلات'   : 'You tend to understand people and solve problems',
    traitService:     isAr ? 'تنجذب للأعمال التي تخدم المجتمع'   : 'You are drawn to work that serves the community',
    personalityTitle: isAr ? 'تحليل شخصيتك وميولك المهنية'       : 'Personality & Career Interests Analysis',
    riasecTitle:      isAr ? 'بصمة ميولك المهنية (RIASEC)'        : 'Your Career Interests (RIASEC)',
    bigFiveTitle:     isAr ? 'تحليل السمات الشخصية'               : 'Personality Traits Analysis',
    pathsTitle:       isAr ? 'باقي الحقول'                          : 'Other Fields',
    showOtherFields:  (n: number) => isAr ? `عرض الحقول الأخرى (${n})` : `Show Other Fields (${n})`,
    hideOtherFields:  isAr ? 'إخفاء الحقول الأقل توافقاً'         : 'Hide Less Compatible Fields',
    careersTitle:     isAr ? 'فرصك المهنية المستقبلية'            : 'Your Future Career Opportunities',
    viewMore:         isAr ? 'عرض المزيد'                          : 'View More',
    growth:           isAr ? 'نمو'                                  : 'Growth',
    growthHigh:       isAr ? 'مرتفع'                               : 'High',
    growthMedium:     isAr ? 'متوسط'                               : 'Medium',
    stepsTitle:       isAr ? 'خطواتك القادمة'                      : 'Your Next Steps',
    step1:            isAr ? 'أكمل إجراءات الاختيار'              : 'Complete the selection process',
    step2:            isAr ? 'تم تحليل شخصيتك'                    : 'Personality analyzed',
    step3:            isAr ? 'تم اختيار أفضل المسارات لك'         : 'Best paths selected for you',
    step4:            isAr ? 'تعرف على الجامعات والتخصصات'        : 'Explore universities and majors',
    advisorTitle:     isAr ? 'المستشار الذكي'                      : 'AI Academic Advisor',
    advisorSubtitle:  isAr ? 'اسأل مستشارك الأكاديمي الرقمي عن أي شيء يتعلق بنتائجك والمسارات المتاحة.'
                           : 'Ask your digital academic advisor anything about your results and available paths.',
    startChat:        isAr ? 'ابدأ المحادثة'                       : 'Start Chat',
    online:           isAr ? '🟢 متاح على مدار الساعة'             : '🟢 Available 24/7',
    chatHeader:       isAr ? 'المستشار الأكاديمي الذكي'            : 'AI Academic Advisor',
    chatOnline:       isAr ? 'متصل الآن'                           : 'Online now',
    chatWelcome:      isAr ? 'أهلاً بك في مسار التوجيهي!'         : 'Welcome to TawjihiPath!',
    chatPrompt:       isAr ? 'اسألني أي شيء عن نتائجك أو التخصصات المتاحة.' : 'Ask me anything about your results or available majors.',
    chatPlaceholder:  isAr ? 'اسأل مستشارك عن مسارك...'           : 'Ask your advisor about your path...',
    chatError:        isAr ? 'عذراً، واجهت مشكلة. يرجى المحاولة مرة أخرى.' : 'Sorry, an error occurred. Please try again.',
    modalLoading:     isAr ? 'جاري جلب التفاصيل...'               : 'Loading details...',
    modalError:       isAr ? 'عذراً، تعذر جلب التفاصيل حالياً.'   : 'Sorry, details could not be loaded right now.',
    closeBtn:         isAr ? 'إغلاق'                               : 'Close',
    compatScore:      isAr ? 'التوافق'                             : 'Match',
    showDetails:      isAr ? 'عرض التفاصيل'                        : 'Show Details',
    hideDetails:      isAr ? 'إخفاء التفاصيل'                      : 'Hide Details',
    ministerialSubs:  isAr ? 'المواد الوزارية'                     : 'Required Subjects',
    recommendedElec:  isAr ? 'المادة الاختيارية الموصى بها'        : 'Recommended Elective',
    topJobs:          isAr ? 'أبرز الوظائف بعد التخرج'            : 'Top Career Paths',
    topMajors:        isAr ? 'أفضل 3 تخصصات موصى بها'             : 'Top 3 Recommended Majors',
    allMajors:        (n: number) => isAr ? `جميع التخصصات المتاحة (${n})` : `All Available Majors (${n})`,
    hide:             isAr ? 'إخفاء'                               : 'Hide',
    fetchingCareers:  isAr ? 'جاري التحميل...'                     : 'Loading...',
    fetchingData:     isAr ? 'جاري جلب البيانات...'               : 'Fetching data...',
    shareCopied:      isAr ? 'تم نسخ الرابط!'                     : 'Link copied!',
    shareTitle:       isAr ? 'نتائج مسار التوجيهي'                : 'TawjihiPath Results',
    noCareers:        isAr ? 'جاري جلب البيانات...'               : 'Fetching data...',
    currency:         isAr ? 'د.ا'                                  : 'JD',
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const fieldName  = (fid: FieldId) => isAr ? fieldData[fid]?.name.ar  : fieldData[fid]?.name.en;

  // ── Fetch result ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchResult() {
      if (!id) return;
      try {
        const { data, error: fetchError } = await supabase
          .from('assessment_results').select('*').eq('id', id).single();
        if (fetchError) throw fetchError;
        const enriched = {
          ...data,
          fields_ranked: [
            { field_id: data.field_1, score: data.field_1_score },
            { field_id: data.field_2, score: data.field_2_score },
            { field_id: data.field_3, score: data.field_3_score },
            { field_id: data.field_4, score: data.field_4_score },
          ].filter(f => f.field_id),
        };
        setResult(enriched);
        // If narrative is missing, poll the backend until it arrives (max 5 attempts)
        if (!enriched.ai_narrative_en && !enriched.ai_narrative_ar) {
          let attempts = 0;
          const poll = async () => {
            if (attempts >= 5) return;
            attempts++;
            try {
              const { data: pollData, error: pollError } = await supabase
                .from('assessment_results')
                .select('ai_narrative_en, ai_narrative_ar')
                .eq('id', id)
                .single();
              if (pollError) throw pollError;
              if (pollData.ai_narrative_en || pollData.ai_narrative_ar) {
                setResult(prev => ({ ...prev, ...pollData }));
              } else {
                setTimeout(poll, 3000);
              }
            } catch (e) {
              console.error('Narrative poll error', e);
            }
          };
          setTimeout(poll, 3000);
        }
        setExpandedField(data.field_1 || null);
      } catch {
        setError(tx.errorDefault);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [id]);

  // ── Score counter animation ────────────────────────────────────────────────
  useEffect(() => {
    if (!result?.field_1_score) return;
    const raw = Number(result.field_1_score);
    const target = Math.round(raw <= 1 ? raw * 100 : raw);
    if (matchCounter >= target) return;
    const timer = setTimeout(() => setMatchCounter(prev => Math.min(prev + 1, target)), 18);
    return () => clearTimeout(timer);
  }, [result?.field_1_score, matchCounter]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // ── Fetch field careers ────────────────────────────────────────────────────
  const fetchFieldCareers = async (field_id: string, field_name: string) => {
    const lang = isAr ? 'ar' : 'en';
    const cacheKey = `${field_id}_${lang}`;
    if (fieldCareers[cacheKey]) return;
    setLoadingCareers(field_id);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-service', {
        body: { action: 'field_careers', payload: { field_id, field_name, lang } },
      });
      if (error) throw error;
      if (data?.result) setFieldCareers(prev => ({ ...prev, [cacheKey]: data.result }));
    } catch {
      setFieldCareers(prev => ({
        ...prev,
        [cacheKey]: CAREERS_FALLBACK[field_id]?.[lang] || { jobs: [], majors: [] },
      }));
    } finally {
      setLoadingCareers(null);
    }
  };

  useEffect(() => {
    if (!expandedField) return;

    const lang = isAr ? 'ar' : 'en';
    const cacheKey = `${expandedField}_${lang}`;

    if (fieldCareers[cacheKey]) return;

    const details = fieldData[expandedField as FieldId];

    if (!details) return;

    fetchFieldCareers(
      expandedField,
      isAr ? details.name.ar : details.name.en
    );
  }, [isAr, expandedField]);

  const handleFieldExpand = (field_id: string) => {
    const isExpanding = expandedField !== field_id;
    setExpandedField(isExpanding ? field_id : null);
  };

  // ── Detail modal ──────────────────────────────────────────────────────────
  const openDetailModal = async (name: string) => {
    setModalTitle(name);
    setModalDesc(null);
    setLoadingDesc(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-service', {
        body: { action: 'major_description', payload: { major_name: name, lang: isAr ? 'ar' : 'en' } },
      });
      if (error) throw error;
      setModalDesc(data.result);
    } catch {
      setModalDesc(tx.modalError);
    } finally {
      setLoadingDesc(false);
    }
  };

  // ── Chat ──────────────────────────────────────────────────────────────────
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isTyping || !result) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-service', {
        body: { action: 'chatbot', payload: { message: userMsg, context: result, history: chatMessages.slice(-5), lang: isAr ? 'ar' : 'en' } },
      });
      if (error) throw error;
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: tx.chatError }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/share/${result?.id}`;
    if (navigator.share) await navigator.share({ title: tx.shareTitle, url: shareUrl });
    else { await navigator.clipboard.writeText(shareUrl); alert(tx.shareCopied); }
  };

  const getScoreColor = (score: number) => {
    const pct = score <= 1 ? score * 100 : score;
    if (pct >= 70) return 'text-emerald-400';
    if (pct >= 50) return 'text-amber-400';
    return 'text-slate-400';
  };

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-cairo text-white">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
      <p className="text-slate-400 animate-pulse">{tx.loading}</p>
    </div>
  );

  if (error || !result) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-cairo text-white">
      <div className="glass-card p-8 border-red-500/30 text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold mb-4">{tx.errorTitle}</h2>
        <p className="text-slate-400 mb-8">{error}</p>
        <button onClick={() => navigate('/assess/grades')} className="btn-primary w-full">{tx.retakeBtn}</button>
      </div>
    </div>
  );

  // ── Derived data ───────────────────────────────────────────────────────────

  const riasecChartData = [
    { subject: isAr ? riasecLabels['R'].ar : riasecLabels['R'].en, value: Math.round(Number(result.riasec_r || 0)) },
    { subject: isAr ? riasecLabels['I'].ar : riasecLabels['I'].en, value: Math.round(Number(result.riasec_i || 0)) },
    { subject: isAr ? riasecLabels['A'].ar : riasecLabels['A'].en, value: Math.round(Number(result.riasec_a || 0)) },
    { subject: isAr ? riasecLabels['S'].ar : riasecLabels['S'].en, value: Math.round(Number(result.riasec_s || 0)) },
    { subject: isAr ? riasecLabels['E'].ar : riasecLabels['E'].en, value: Math.round(Number(result.riasec_e || 0)) },
    { subject: isAr ? riasecLabels['C'].ar : riasecLabels['C'].en, value: Math.round(Number(result.riasec_c || 0)) },
  ];

  const bigFiveChartData = [
    { subject: isAr ? bigFiveLabels['O'].ar : bigFiveLabels['O'].en, value: Math.round(Number(result.big5_openness || 0)) },
    { subject: isAr ? bigFiveLabels['C'].ar : bigFiveLabels['C'].en, value: Math.round(Number(result.big5_conscientiousness || 0)) },
    { subject: isAr ? bigFiveLabels['E'].ar : bigFiveLabels['E'].en, value: Math.round(Number(result.big5_extraversion || 0)) },
    { subject: isAr ? bigFiveLabels['A'].ar : bigFiveLabels['A'].en, value: Math.round(Number(result.big5_agreeableness || 0)) },
    { subject: isAr ? bigFiveLabels['N'].ar : bigFiveLabels['N'].en, value: Math.round(Number(result.big5_neuroticism || 0)) },
  ];

  const topFields    = result.fields_ranked.slice(0, 2);
  const bottomFields = result.fields_ranked.slice(2);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050505] text-white font-cairo overflow-x-hidden" dir={dir}>

      <Navbar />

      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 px-4 pt-28 pb-24 space-y-14">

        {/* ══ SECTION 1 — HERO ══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex flex-col ${isAr ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}
        >
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0 w-full md:w-72 rounded-2xl border border-purple-500/30 bg-[#0d0d1a] p-7 flex flex-col items-center gap-4 relative overflow-hidden shadow-xl shadow-purple-900/20"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500" />
            <span className="text-slate-400 text-sm font-bold">{tx.overallScore}</span>
            <span className="text-8xl font-black bg-gradient-to-br from-white via-purple-200 to-cyan-400 bg-clip-text text-transparent tabular-nums leading-none">
              {matchCounter}%
            </span>
            <span className="text-emerald-400 text-sm font-bold">{tx.highMatch}</span>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${matchCounter}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
            <div className="w-full flex flex-col items-center gap-1 pt-1 border-t border-white/10">
              <span className="text-xs text-slate-500">{tx.bestField}</span>
              <span className="text-base font-black text-white text-center">
                {fieldName(result.field_1 as FieldId) || result.field_1}
              </span>
            </div>
          </motion.div>

          {/* Why This Field — inline beside score card */}
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 space-y-4">
            <h2 className={`text-xl font-black flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
              {tx.whySectionTitle} {fieldName(result.field_1 as FieldId)}{isAr ? '؟' : '?'}
            </h2>
            <p className={`text-slate-300 leading-relaxed text-sm whitespace-pre-line ${isAr ? 'text-right' : 'text-left'}`}>
              {(isAr ? result.ai_narrative_ar : result.ai_narrative_en) ?? tx.whyNarrativeFallback}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {[
                { icon: '💬', text: tx.traitComm },
                { icon: '❤️', text: tx.traitEmpathy },
                { icon: '🔍', text: tx.traitAnalytical },
                { icon: '🤝', text: tx.traitService },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-xs font-medium text-slate-200 ${isAr ? 'flex-row-reverse' : ''}`}>
                  <span>{item.icon}</span><span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ══ SECTION 3 — PERSONALITY RADAR CHARTS ══ */}
        <section>
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
            <UserCircle className="w-6 h-6 text-cyan-400" />
            {tx.personalityTitle}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4 text-cyan-400">
                <TrendingUp className="w-4 h-4" />{tx.riasecTitle}
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={riasecChartData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Cairo, sans-serif' }} />
                  <Radar name="RIASEC" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
                  <Tooltip contentStyle={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontFamily: 'Cairo' }}
                    labelStyle={{ color: '#e2e8f0' }} itemStyle={{ color: '#06b6d4' }} formatter={(v: any) => [`${v}%`, '']} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4 text-purple-400">
                <UserCircle className="w-4 h-4" />{tx.bigFiveTitle}
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={bigFiveChartData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'Cairo, sans-serif' }} />
                  <Radar name="Big Five" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
                  <Tooltip contentStyle={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontFamily: 'Cairo' }}
                    labelStyle={{ color: '#e2e8f0' }} itemStyle={{ color: '#8b5cf6' }} formatter={(v: any) => [`${v}%`, '']} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </section>

        {/* ══ SECTION 4 — BEST PATHS ══ */}
        <section>
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-400" />{tx.pathsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {topFields.map((field: any, idx: number) => (
              <PathCard key={field.field_id} field={field} idx={idx}
                isExpanded={expandedField === field.field_id}
                onToggle={() => handleFieldExpand(field.field_id)}
                careers={fieldCareers[`${field.field_id}_${isAr ? 'ar' : 'en'}`]}
                loadingCareers={loadingCareers === field.field_id}
                result={result} getScoreColor={getScoreColor}
                onDetailClick={openDetailModal} isAr={isAr} tx={tx}
              />
            ))}
          </div>

          {bottomFields.length > 0 && (
            <div className="mt-5 space-y-5">
              <div className="flex justify-center">
                <button onClick={() => setShowAllFields(v => !v)}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-bold border border-white/10 hover:border-white/20 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10">
                  {showAllFields
                    ? <><ChevronUp className="w-4 h-4" />{tx.hideOtherFields}</>
                    : <><ChevronDown className="w-4 h-4" />{tx.showOtherFields(bottomFields.length)}</>}
                </button>
              </div>
              <AnimatePresence>
                {showAllFields && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-hidden">
                    {bottomFields.map((field: any, idx: number) => (
                      <PathCard key={field.field_id} field={field} idx={idx + 2}
                        isExpanded={expandedField === field.field_id}
                        onToggle={() => handleFieldExpand(field.field_id)}
                        careers={fieldCareers[`${field.field_id}_${isAr ? 'ar' : 'en'}`]}
                        loadingCareers={loadingCareers === field.field_id}
                        result={result} getScoreColor={getScoreColor}
                        onDetailClick={openDetailModal} isAr={isAr} tx={tx} dimmed
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* ══ SHARE & PRINT BUTTONS ══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`flex flex-wrap items-center justify-center gap-4 pt-4 pb-2`}
        >
          <button
            onClick={handleShare}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-400/60 text-indigo-300 hover:text-white shadow-lg shadow-indigo-900/20 ${isAr ? 'flex-row-reverse' : ''}`}
          >
            <Share2 className="w-4 h-4" />
            {tx.shareBtn}
          </button>
          <button
            onClick={() => window.print()}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 text-slate-300 hover:text-white shadow-lg ${isAr ? 'flex-row-reverse' : ''}`}
          >
            <Download className="w-4 h-4" />
            {tx.downloadBtn}
          </button>
        </motion.section>

      </div>

      {/* ══ DETAIL MODAL ══ */}
      <AnimatePresence>
        {modalTitle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalTitle(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card p-8 border-white/20 shadow-2xl" dir={dir}>
              <button onClick={() => setModalTitle(null)}
                className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors`}>
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold mb-6 text-cyan-400 flex items-center gap-3">
                <GraduationCap className="w-6 h-6" /><span>{modalTitle}</span>
              </h3>
              {loadingDesc ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                  <p className="text-slate-400 text-sm">{tx.modalLoading}</p>
                </div>
              ) : (
                <div className="text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto">
                  <p className="whitespace-pre-line text-base">{modalDesc}</p>
                </div>
              )}
              <button onClick={() => setModalTitle(null)} className="btn-google w-full mt-8">{tx.closeBtn}</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══ CHATBOT PANEL ══ */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)} className="fixed inset-0 z-[109] bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className={`fixed bottom-4 right-4 md:right-8 z-[110] w-full max-w-md h-[440px] glass-card flex flex-col shadow-2xl border-indigo-500/30`}
              dir={dir}
            >
              <div className="p-4 border-b border-white/10 bg-indigo-500/10 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{tx.chatHeader}</h4>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />{tx.chatOnline}
                    </span>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <p className="font-bold">{tx.chatWelcome}</p>
                    <p className="text-sm text-slate-400">{tx.chatPrompt}</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? (isAr ? 'justify-start' : 'justify-end') : (isAr ? 'justify-end' : 'justify-start')}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-indigo-600/20 border border-indigo-500/20'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className={`flex ${isAr ? 'justify-end' : 'justify-start'}`}>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 flex-shrink-0">
                <div className="relative">
                  <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)}
                    placeholder={tx.chatPlaceholder}
                    className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors ${isAr ? 'pr-4 pl-12' : 'pl-4 pr-12'}`} />
                  <button type="submit" disabled={isTyping || !chatInput.trim()}
                    className={`absolute top-1.5 ${isAr ? 'left-2' : 'right-2'} p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 disabled:opacity-50 transition-colors`}>
                    <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══ FLOATING CHATBOT FAB ══ */}
      <div className="fixed bottom-6 right-6 z-[108] flex flex-col items-end gap-2">
        <AnimatePresence>
          {!isChatOpen && (
            <motion.button
              onClick={() => setIsChatOpen(true)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-1.5"
            >
              {/* Glow bubble */}
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-900/60"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #06b6d4 100%)' }}>
                <div className="absolute inset-0 rounded-full opacity-30 animate-pulse"
                  style={{ background: 'inherit', filter: 'blur(10px)', transform: 'scale(1.3)' }} />
                <MessageSquare className="w-7 h-7 text-white relative z-10" />
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-[#050505] z-20">
                  1
                </div>
              </div>
              {/* Label card */}
              <div className="bg-[#0d0d1a] border border-white/15 rounded-xl px-3 py-1.5 text-center shadow-xl backdrop-blur-md">
                <p className="text-white text-xs font-bold">{tx.advisorTitle}</p>
                <p className="text-slate-400 text-[10px]">{isAr ? 'اسأل عن أي شيء' : 'Ask anything'}</p>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── PathCard ─────────────────────────────────────────────────────────────────

interface PathCardProps {
  field: any;
  idx: number;
  isExpanded: boolean;
  onToggle: () => void;
  careers?: { jobs: string[]; majors: string[] };
  loadingCareers: boolean;
  result: any;
  getScoreColor: (s: number) => string;
  onDetailClick: (name: string) => void;
  isAr: boolean;
  tx: Record<string, any>;
  dimmed?: boolean;
}

function PathCard({ field, idx, isExpanded, onToggle, careers, loadingCareers, result, getScoreColor, onDetailClick, isAr, tx, dimmed = false }: PathCardProps) {
  const details = fieldData[field.field_id as FieldId];
  const [showAllMajors, setShowAllMajors] = useState(false);

  const aiMajors   = careers?.majors ?? [];
  const allStaticMajors = (details?.majors ?? []).map(m => isAr ? m.ar : m.en);
  const restMajors = allStaticMajors.filter(m => !aiMajors.includes(m));

  const electiveKey   = result.recommended_electives?.[field.field_id];
  const electiveLabel = electiveKey
    ? (isAr ? (electiveKeys[electiveKey]?.ar || electiveKey) : (electiveKeys[electiveKey]?.en || electiveKey))
    : '-';

  const rawScore = Number(field.score || 0);
  const scorePct = Math.round(rawScore <= 1 ? rawScore * 100 : rawScore);

  const RANK_COLORS = ['#8b5cf6', '#f59e0b', '#06b6d4', '#10b981'];

  const name = isAr ? details?.name.ar : details?.name.en;
  const desc = isAr ? details?.description.ar : details?.description.en;
  const mandatorySubs = (details?.mandatory_subjects ?? []).map(s => isAr ? s.ar : s.en);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + idx * 0.1 }}
      className={`rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md transition-all duration-300 ${
        isExpanded ? 'ring-2 ring-indigo-500/20 border-indigo-500/20' : ''
      } ${dimmed ? 'opacity-60' : ''}`}
    >
      {/* Header */}
      <div className="p-6 cursor-pointer hover:bg-white/5 transition-colors rounded-t-2xl select-none" onClick={onToggle}>
        <div className="flex items-start justify-between gap-4">
          <div className={`flex items-start gap-4 flex-1 ${isAr ? 'flex-row-reverse' : ''}`}>
            <div className="flex-shrink-0 relative">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/5 border border-white/10">
                {details?.icon || '📚'}
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{ background: RANK_COLORS[idx] || '#6366f1' }}>
                {idx + 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-lg leading-tight mb-1">{name || field.field_id}</h4>
              <p className="text-slate-400 text-xs line-clamp-2">{desc}</p>
            </div>
          </div>
          <div className={`flex-shrink-0 ${isAr ? 'text-right' : 'text-left'}`}>
            <div className={`text-2xl font-black tabular-nums ${getScoreColor(scorePct)}`}>{scorePct}%</div>
            <div className="text-[10px] text-slate-500 text-center">{tx.compatScore}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full" style={{ background: details?.color || '#6366f1' }}
            initial={{ width: 0 }} animate={{ width: `${scorePct}%` }}
            transition={{ duration: 1.2, delay: idx * 0.15, ease: 'easeOut' }} />
        </div>

        <div className={`mt-4 flex items-center ${isAr ? 'flex-row-reverse' : ''} justify-between`}>
          <button className="text-xs font-bold px-4 py-1.5 rounded-full text-white border border-white/15 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all"
            onClick={(e) => { e.stopPropagation(); onToggle(); }}>
            {isExpanded ? tx.hideDetails : tx.showDetails}
          </button>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div key="expanded" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
            <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Required subjects */}
                <div className="space-y-3">
                  <h5 className={`text-indigo-400 font-bold text-xs flex items-center gap-1.5 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <BookOpen className="w-3.5 h-3.5" />{tx.ministerialSubs}
                  </h5>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                    {mandatorySubs.map((s, i) => (
                      <div key={i} className={`flex items-center gap-2 text-xs text-slate-300 ${isAr ? 'flex-row-reverse' : ''}`}>
                        <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                    <span className="text-[10px] text-indigo-400 font-bold block mb-0.5">{tx.recommendedElec}</span>
                    <span className="text-sm font-bold">{electiveLabel}</span>
                  </div>
                </div>

                {/* Top jobs */}
                <div className="space-y-3">
                  <h5 className={`text-amber-400 font-bold text-xs flex items-center gap-1.5 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <Briefcase className="w-3.5 h-3.5" />{tx.topJobs}
                  </h5>
                  {loadingCareers ? (
                    <div className={`flex items-center gap-2 text-slate-400 text-xs py-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /><span>{tx.fetchingCareers}</span>
                    </div>
                  ) : careers?.jobs?.length ? (
                    <div className="space-y-1.5">
                      {careers.jobs.map((job, i) => (
                        <button key={i} type="button"
                          onClick={(e) => { e.stopPropagation(); onDetailClick(job); }}
                          className={`w-full flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-all ${isAr ? 'flex-row-reverse text-right' : 'text-left'} group`}>
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          <span className="text-xs text-slate-200 flex-1">{job}</span>
                          <ChevronRight className={`w-3 h-3 text-amber-500/40 group-hover:text-amber-400 flex-shrink-0 ${isAr ? 'rotate-180' : ''}`} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 text-xs">{tx.noCareers}</p>
                  )}
                </div>

                {/* Top majors */}
                <div className="space-y-3">
                  <h5 className={`text-emerald-400 font-bold text-xs flex items-center gap-1.5 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <Sparkles className="w-3.5 h-3.5" />{tx.topMajors}
                  </h5>
                  {loadingCareers ? (
                    <div className={`flex items-center gap-2 text-slate-400 text-xs py-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /><span>{tx.fetchingCareers}</span>
                    </div>
                  ) : aiMajors.length ? (
                    <div className="space-y-1.5">
                      {aiMajors.map((major, i) => (
                        <button key={i} type="button"
                          onClick={(e) => { e.stopPropagation(); onDetailClick(major); }}
                          className={`w-full flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all ${isAr ? 'flex-row-reverse text-right' : 'text-left'} group`}>
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          <span className="text-xs text-slate-200 flex-1">{major}</span>
                          <ChevronRight className={`w-3 h-3 text-emerald-500/40 group-hover:text-emerald-400 flex-shrink-0 ${isAr ? 'rotate-180' : ''}`} />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 text-xs">{tx.fetchingData}</p>
                  )}
                </div>
              </div>

              {/* All majors toggle */}
              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className={`flex ${isAr ? 'justify-start' : 'justify-end'}`}>
                  <button type="button"
                    onClick={(e) => { e.stopPropagation(); setShowAllMajors(v => !v); }}
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-full">
                    {showAllMajors
                      ? <><ChevronUp className="w-3 h-3" />{tx.hide}</>
                      : <><ChevronDown className="w-3 h-3" />{tx.allMajors(restMajors.length + aiMajors.length)}</>}
                  </button>
                </div>
                <AnimatePresence>
                  {showAllMajors && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <div className="flex flex-wrap gap-2">
                        {aiMajors.map((major, mIdx) => (
                          <button key={`ai-${mIdx}`} type="button"
                            onClick={(e) => { e.stopPropagation(); onDetailClick(major); }}
                            className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-medium hover:bg-emerald-500/20 transition-all flex items-center gap-1.5">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />{major}
                          </button>
                        ))}
                        {restMajors.map((major, mIdx) => (
                          <button key={`rest-${mIdx}`} type="button"
                            onClick={(e) => { e.stopPropagation(); onDetailClick(major); }}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-medium hover:bg-white/10 transition-all flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />{major}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}