import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { Navbar } from '../../components/landing/Navbar';
import { useTranslation } from 'react-i18next';
import {
  User, BarChart3, LogOut, Mail, Calendar, Edit3,
  CheckCircle, AlertCircle, ChevronRight, Plus, Trophy,
  Sparkles, RefreshCw, Eye
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ResultRow {
  id: string;
  created_at: string;
  field_1: string;
  field_1_score: number;
  field_2: string;
  field_2_score: number;
}

interface ProfileData {
  full_name: string;
  birth_year: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const FIELD_LABELS: Record<string, { ar: string; en: string }> = {
  health:               { ar: 'الحقل الصحي',             en: 'Health Sciences' },
  engineering_tech:     { ar: 'الهندسة والتقنية',        en: 'Engineering & Tech' },
  law_sharia_languages: { ar: 'الحقوق والشريعة واللغات', en: 'Law, Sharia & Languages' },
  business:             { ar: 'إدارة الأعمال',            en: 'Business Management' },
};

const FIELD_CONFIG: Record<string, {
  bg: string; text: string; bar: string; glow: string; icon: string;
}> = {
  health:               { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'from-emerald-400 to-teal-400', glow: 'shadow-emerald-500/20', icon: '🏥' },
  engineering_tech:     { bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    bar: 'from-cyan-400 to-blue-400',   glow: 'shadow-cyan-500/20',    icon: '⚙️' },
  law_sharia_languages: { bg: 'bg-purple-500/10',  text: 'text-purple-400',  bar: 'from-purple-400 to-pink-400', glow: 'shadow-purple-500/20',  icon: '⚖️' },
  business:             { bg: 'bg-amber-500/10',   text: 'text-amber-400',   bar: 'from-amber-400 to-orange-400', glow: 'shadow-amber-500/20',  icon: '💼' },
};

type Tab = 'results' | 'profile';

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate   = useNavigate();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const user       = useAuthStore((state) => state.user);
  const signOut    = useAuthStore((state) => state.signOut);
  const resetStore = useAssessmentStore((state) => state.reset);

  const [activeTab, setActiveTab] = useState<Tab>('results');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ── Results state ─────────────────────────────────────────────────────────
  const [results,        setResults]        = useState<ResultRow[]>([]);
  const [resultsLoading, setResultsLoading] = useState(true);

  // ── Profile state ─────────────────────────────────────────────────────────
  const [form, setForm] = useState<ProfileData>({ full_name: '', birth_year: 2009 });
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving,         setSaving]         = useState(false);
  const [saved,          setSaved]          = useState(false);
  const [profileError,   setProfileError]   = useState('');

  // ── Fetch results ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    (async () => {
      setResultsLoading(true);
      const { data, error } = await supabase
        .from('assessment_results')
        .select('id, created_at, field_1, field_1_score, field_2, field_2_score')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) setResults(data ?? []);
      setResultsLoading(false);
    })();
  }, [user]);

  // ── Fetch profile ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    (async () => {
      setProfileLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('full_name, birth_year')
        .eq('id', user.id)
        .single();
      if (data) {
        setForm({ full_name: data.full_name ?? '', birth_year: data.birth_year ?? 2009 });
      }
      setProfileLoading(false);
    })();
  }, [user]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleRetake = () => { resetStore(); navigate('/assess/grades'); };

  const handleSaveProfile = async () => {
    if (!user) return;
    const nameErr   = isAr ? 'الاسم الكامل مطلوب'        : 'Full name is required';
    const yearErr   = isAr ? 'يرجى إدخال سنة ميلاد صالحة' : 'Please enter a valid birth year';
    const saveErr   = isAr ? 'حدث خطأ أثناء الحفظ'        : 'Error saving — please try again';
    if (!form.full_name.trim()) { setProfileError(nameErr); return; }
    if (!form.birth_year || form.birth_year < 1900 || form.birth_year > new Date().getFullYear()) {
      setProfileError(yearErr); return;
    }
    setSaving(true); setProfileError('');
    const { error } = await supabase.from('profiles').upsert({
      id: user.id, full_name: form.full_name.trim(),
      birth_year: form.birth_year, updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { setProfileError(saveErr); }
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isAr ? 'ar-JO' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  const getFieldLabel = (key: string) =>
    isAr ? (FIELD_LABELS[key]?.ar ?? key) : (FIELD_LABELS[key]?.en ?? key);

  const displayName = form.full_name || user?.email?.split('@')[0] || (isAr ? 'طالب' : 'Student');

  // ── Translations ──────────────────────────────────────────────────────────
  const tx = {
    greeting:        isAr ? `مرحباً، ${displayName} 👋` : `Welcome, ${displayName} 👋`,
    subtitle:        isAr ? 'لوحتك الشخصية — نتائجك وملفك في مكان واحد' : 'Your dashboard — results and profile in one place',
    tabResults:      isAr ? 'نتائجي'           : 'My Results',
    tabProfile:      isAr ? 'ملفي الشخصي'      : 'My Profile',
    logout:          isAr ? 'تسجيل الخروج'     : 'Log Out',
    logoutConfirm:   isAr ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to log out?',
    logoutYes:       isAr ? 'نعم، خروج'        : 'Yes, Log Out',
    logoutNo:        isAr ? 'إلغاء'             : 'Cancel',
    newTest:         isAr ? '+ اختبار جديد'     : '+ New Test',
    noResults:       isAr ? 'لم تُجرِ أي اختبار بعد' : 'No assessments yet',
    noResultsSub:    isAr ? 'ابدأ اختبارك الأول لاكتشاف مسارك الجامعي المثالي' : 'Start your first assessment to discover your ideal academic path',
    startTest:       isAr ? 'ابدأ اختباراً جديداً'   : 'Start New Assessment',
    completed:       isAr ? 'مكتمل'             : 'completed',
    matchScore:      isAr ? 'درجة التطابق'      : 'Match Score',
    secondField:     isAr ? 'المجال الثاني'     : 'Second Field',
    viewFull:        isAr ? 'عرض النتائج الكاملة' : 'View Full Results',
    emailLabel:      isAr ? 'البريد الإلكتروني' : 'Email Address',
    emailNote:       isAr ? 'لا يمكن تغيير البريد الإلكتروني' : 'Email cannot be changed',
    nameLabel:       isAr ? 'الاسم الكامل'       : 'Full Name',
    namePlaceholder: isAr ? 'مثال: أحمد محمد الأحمد' : 'e.g. Ahmad Mohammad',
    yearLabel:       isAr ? 'سنة الميلاد'        : 'Birth Year',
    yearPlaceholder: isAr ? 'مثال: 2009'          : 'e.g. 2009',
    saveBtn:         isAr ? 'حفظ التغييرات'      : 'Save Changes',
    saving:          isAr ? 'جاري الحفظ...'      : 'Saving...',
    savedOk:         isAr ? '✓ تم الحفظ بنجاح'   : '✓ Saved Successfully',
    assessCount:     (n: number) => isAr
      ? `${n} ${n === 1 ? 'اختبار مكتمل' : 'اختبارات مكتملة'}`
      : `${n} ${n === 1 ? 'assessment' : 'assessments'} completed`,
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div dir={dir} className="min-h-screen bg-[#050810] text-white font-cairo">
      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Background glow ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 pt-28 pb-20">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-start justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-cyan-500/30">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-[#050810]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                {tx.greeting}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">{tx.subtitle}</p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="relative flex-shrink-0">
            <motion.button
              onClick={() => setShowLogoutConfirm(true)}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-sm font-bold"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{tx.logout}</span>
            </motion.button>

            {/* Logout Confirm Dropdown */}
            <AnimatePresence>
              {showLogoutConfirm && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLogoutConfirm(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full mt-2 z-50 bg-[#0d1117] border border-white/10 rounded-2xl p-4 w-64 shadow-2xl shadow-black/50 ${isAr ? 'left-0' : 'right-0'}`}
                  >
                    <p className="text-white text-sm font-bold mb-3 text-center">{tx.logoutConfirm}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={signOut}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-400 text-white rounded-xl text-sm font-bold transition-colors"
                      >
                        {tx.logoutYes}
                      </button>
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-xl text-sm font-bold transition-colors"
                      >
                        {tx.logoutNo}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Stats Bar ── */}
        {!resultsLoading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-3 mb-8"
          >
            {[
              {
                icon: <Trophy size={18} className="text-amber-400" />,
                value: results.length,
                label: isAr ? 'اختبارات' : 'Tests',
                color: 'border-amber-500/20 bg-amber-500/5',
              },
              {
                icon: <BarChart3 size={18} className="text-cyan-400" />,
                value: `${Math.round(results.reduce((a, r) => a + r.field_1_score, 0) / results.length)}%`,
                label: isAr ? 'متوسط التطابق' : 'Avg. Match',
                color: 'border-cyan-500/20 bg-cyan-500/5',
              },
              {
                icon: <Sparkles size={18} className="text-purple-400" />,
                value: getFieldLabel(results[0]?.field_1 ?? ''),
                label: isAr ? 'أعلى مجال' : 'Top Field',
                color: 'border-purple-500/20 bg-purple-500/5',
                small: true,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-3 md:p-4 ${stat.color} flex flex-col gap-1`}
              >
                {stat.icon}
                <div className={`font-black text-white ${stat.small ? 'text-xs leading-tight' : 'text-xl'}`}>
                  {stat.value}
                </div>
                <div className="text-slate-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── Tab Bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex bg-white/[0.04] rounded-2xl p-1 mb-8 border border-white/[0.07]"
        >
          {([
            { key: 'results', label: tx.tabResults, icon: <BarChart3 size={16} /> },
            { key: 'profile', label: tx.tabProfile,  icon: <User size={16} /> },
          ] as { key: Tab; label: string; icon: React.ReactNode }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">

          {/* ════════ TAB 1: RESULTS ════════ */}
          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22 }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                {!resultsLoading && results.length > 0 && (
                  <p className="text-slate-500 text-sm">{tx.assessCount(results.length)}</p>
                )}
                <motion.button
                  onClick={handleRetake}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-cyan-500/20 ml-auto"
                >
                  <Plus size={16} />
                  {tx.newTest}
                </motion.button>
              </div>

              {/* Loading */}
              {resultsLoading ? (
                <div className="flex justify-center py-20">
                  <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                </div>

              /* Empty State */
              ) : results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-white/[0.03] border border-white/[0.07] rounded-3xl"
                >
                  <div className="text-6xl mb-4">🎓</div>
                  <h2 className="text-white text-xl font-black mb-2">{tx.noResults}</h2>
                  <p className="text-slate-500 mb-8 text-sm max-w-xs mx-auto">{tx.noResultsSub}</p>
                  <motion.button
                    onClick={handleRetake}
                    whileTap={{ scale: 0.96 }}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
                  >
                    {tx.startTest}
                  </motion.button>
                </motion.div>

              /* Results List */
              ) : (
                <div className="space-y-4">
                  {results.map((result, i) => {
                    const config = FIELD_CONFIG[result.field_1] ?? FIELD_CONFIG.business;
                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all group cursor-pointer`}
                        onClick={() => navigate(`/assess/results/${result.id}`)}
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center text-lg`}>
                              {config.icon}
                            </div>
                            <div>
                              <span className={`text-sm font-black ${config.text}`}>
                                {getFieldLabel(result.field_1)}
                              </span>
                              <p className="text-slate-600 text-xs mt-0.5">{fmtDate(result.created_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xl font-black ${config.text}`}>{result.field_1_score}%</span>
                            <ChevronRight
                              size={18}
                              className={`text-slate-700 group-hover:text-slate-400 transition-colors ${isAr ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </div>

                        {/* Score Bar */}
                        <div className="mb-3">
                          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${config.bar}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${result.field_1_score}%` }}
                              transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                            />
                          </div>
                        </div>

                        {/* Second field badge */}
                        {result.field_2 && (
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-slate-600 text-xs">{tx.secondField}:</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              (FIELD_CONFIG[result.field_2] ?? FIELD_CONFIG.business).bg
                            } ${(FIELD_CONFIG[result.field_2] ?? FIELD_CONFIG.business).text}`}>
                              {getFieldLabel(result.field_2)} — {result.field_2_score}%
                            </span>
                          </div>
                        )}

                        {/* CTA */}
                        <div className={`flex items-center gap-1 mt-3 text-xs font-bold ${config.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                          <Eye size={12} />
                          <span>{tx.viewFull}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ════════ TAB 2: PROFILE ════════ */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22 }}
            >
              {profileLoading ? (
                <div className="flex justify-center py-20">
                  <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">

                  {/* Profile Card Header */}
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-2xl p-5 flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-cyan-500/30 flex-shrink-0">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-white font-black text-lg">{displayName}</h2>
                      <p className="text-slate-500 text-sm">{user?.email}</p>
                    </div>
                    <Edit3 size={16} className="text-slate-600 ms-auto" />
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="flex items-center gap-2 text-slate-400 text-sm mb-2 font-bold">
                      <Mail size={14} className="text-slate-600" />
                      {tx.emailLabel}
                    </label>
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 text-slate-500 text-sm flex items-center justify-between">
                      <span>{user?.email}</span>
                      <span className="text-xs text-slate-700 font-medium">{tx.emailNote}</span>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-2 text-slate-300 text-sm mb-2 font-bold">
                      <User size={14} className="text-slate-500" />
                      {tx.nameLabel} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={(e) => { setForm(p => ({ ...p, full_name: e.target.value })); setSaved(false); }}
                      placeholder={tx.namePlaceholder}
                      className={`w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:bg-white/[0.08] transition-all text-sm ${isAr ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  {/* Birth Year */}
                  <div>
                    <label className="flex items-center gap-2 text-slate-300 text-sm mb-2 font-bold">
                      <Calendar size={14} className="text-slate-500" />
                      {tx.yearLabel} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={form.birth_year || ''}
                      onChange={(e) => { setForm(p => ({ ...p, birth_year: parseInt(e.target.value) || 0 })); setSaved(false); }}
                      placeholder={tx.yearPlaceholder}
                      className={`w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:bg-white/[0.08] transition-all text-sm ${isAr ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {profileError && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm"
                      >
                        <AlertCircle size={16} />
                        <span>{profileError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Save Button */}
                  <motion.button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-4 rounded-xl font-black text-white transition-all text-sm flex items-center justify-center gap-2 ${
                      saved
                        ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/20'
                    } disabled:opacity-50`}
                  >
                    {saving ? (
                      <><RefreshCw size={16} className="animate-spin" /> {tx.saving}</>
                    ) : saved ? (
                      <><CheckCircle size={16} /> {tx.savedOk}</>
                    ) : (
                      tx.saveBtn
                    )}
                  </motion.button>

                  {/* Danger zone: logout from profile tab too */}
                  <div className="pt-4 border-t border-white/[0.06]">
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="w-full py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} />
                      {tx.logout}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
