import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
  LineChart, Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────────────────────────
interface StatCard {
  label: string;
  value: string | number;
  color: string;
  glowColor: string;
  icon: string;
}

interface FieldCount {
  name: string;
  count: number;
  color: string;
}

interface RecentRow {
  id: string;
  created_at: string;
  field_1: string;
  field_1_score: number;
  full_name?: string;
}

interface ProfileRow {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  tests_count: number;
}

interface DailyTestData {
  name: string;
  count: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const FIELD_LABELS: Record<string, string> = {
  health:               'الصحة',
  engineering_tech:     'الهندسة',
  law_sharia_languages: 'الحقوق واللغات',
  business:             'إدارة الأعمال',
};

const FIELD_COLORS: Record<string, string> = {
  health:               '#10b981',
  engineering_tech:     '#06b6d4',
  law_sharia_languages: '#a855f7',
  business:             '#f59e0b',
};



// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);

  const [totalUsers, setTotalUsers]     = useState<number>(0);
  const [totalTests, setTotalTests]     = useState<number>(0);
  const [topField, setTopField]         = useState<string>('—');
  const [avgScore, setAvgScore]         = useState<number | string>('—');
  const [todayTestsCount, setTodayTestsCount] = useState<number>(0);
  const [fieldData, setFieldData]       = useState<FieldCount[]>([]);
  const [dailyTestsData, setDailyTestsData] = useState<DailyTestData[]>([]);
  const [recentRows, setRecentRows]     = useState<RecentRow[]>([]);
  const [profiles, setProfiles]         = useState<ProfileRow[]>([]);
  const [loading, setLoading]           = useState(true);

  // ── Password Gate ────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (pw === 'admin2026') {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    setPw('');
  };

  // ── Data Fetching ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed) return;
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch general stats and users
        const { data: statsData, error: statsError } = await supabase.functions.invoke('admin-data', {
          body: { action: 'get_stats' }
        });
        if (statsError) throw statsError;

        // Fetch recent assessments
        const { data: recentData, error: recentError } = await supabase.functions.invoke('admin-data', {
          body: { action: 'get_recent' }
        });
        if (recentError) throw recentError;

        setTotalUsers(statsData?.totalUsers ?? 0);
        setTotalTests(statsData?.totalTests ?? 0);
        setAvgScore(statsData?.avgScore ?? 0);
        setTodayTestsCount(statsData?.todayTests ?? 0);
        setProfiles(statsData?.users ?? []);
        setRecentRows(recentData?.rows ?? []);

        // Process field counts for distribution
        const fieldCounts = statsData?.fieldCounts || {};
        const sorted = Object.entries(fieldCounts).sort((a, b) => (b[1] as number) - (a[1] as number));
        if (sorted.length) setTopField(FIELD_LABELS[sorted[0][0]] || sorted[0][0]);

        // Donut/Bar chart data
        const chartData = Object.entries(fieldCounts).map(([key, count]) => ({
          name:  FIELD_LABELS[key] || key,
          count: count as number,
          color: FIELD_COLORS[key] || '#94a3b8',
        }));
        setFieldData(chartData);

        // Daily tests timeline data
        setDailyTestsData(statsData?.dailyTests ?? []);

      } catch (e) {
        console.error('Admin fetch error:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [authed]);

  // ── Format date in Arabic ─────────────────────────────────────────────────
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ar-JO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

  const stats: StatCard[] = [
    { label: 'إجمالي المستخدمين', value: loading ? '...' : totalUsers, color: 'text-cyan-400', glowColor: 'rgba(6,182,212,0.2)', icon: '👥' },
    { label: 'إجمالي الاختبارات', value: loading ? '...' : totalTests, color: 'text-emerald-400', glowColor: 'rgba(16,185,129,0.2)', icon: '📝' },
    { label: 'المجال الأكثر توصية', value: loading ? '...' : topField, color: 'text-purple-400', glowColor: 'rgba(168,85,247,0.2)', icon: '🌟' },
    { label: 'متوسط الدرجة', value: loading ? '...' : (typeof avgScore === 'number' ? `${avgScore}%` : avgScore), color: 'text-pink-400', glowColor: 'rgba(236,72,153,0.2)', icon: '🏆' },
    { label: 'اختبارات اليوم', value: loading ? '...' : todayTestsCount, color: 'text-blue-400', glowColor: 'rgba(59,130,246,0.2)', icon: '⚡' },
    { label: 'متوسط الدقة', value: '89%', color: 'text-amber-400', glowColor: 'rgba(245,158,11,0.2)', icon: '🎯' },
  ];

  if (!authed) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#050505] flex items-center justify-center font-cairo relative overflow-hidden"
      >
        {/* Orbs */}
        <div className="absolute top-[10%] right-[5%] w-[450px] h-[450px] bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full filter blur-[60px] pointer-events-none" />
        <div className="absolute bottom-[5%] left-[5%] w-[450px] h-[450px] bg-gradient-to-br from-purple-500/5 to-transparent rounded-full filter blur-[60px] pointer-events-none" />

        <div className="glass-card border border-white/10 rounded-3xl p-8 w-full max-w-sm z-10 shadow-2xl relative">
          <div className="flex justify-center mb-6">
            <img src="/logo.svg" alt="Tawjihi Path" className="w-16 h-16 object-contain filter drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]" />
          </div>
          <h1 className="text-white text-2xl font-black mb-1 text-center">لوحة الإدارة</h1>
          <p className="text-slate-400 text-sm text-center mb-6">TawjihiPath — طريق التوجيهي المهني</p>
          
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setPwError(false); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="كلمة المرور"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 mb-4 outline-none focus:border-cyan-500 focus:bg-white/10 transition-all text-right font-medium shadow-inner"
          />
          
          {pwError && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center mb-4 font-semibold"
            >
              كلمة المرور غير صحيحة ✕
            </motion.p>
          )}
          
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold py-3.5 rounded-2xl transition-all duration-200 active:scale-95 shadow-lg shadow-cyan-500/25"
          >
            دخول الآمن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#050816] text-white font-cairo p-6 relative overflow-x-hidden">
      {/* Background Orbs */}
      <div style={{ position: 'fixed', top: '10%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(0,229,255,0.08),transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '5%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle,rgba(179,136,255,0.06),transparent 70%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Sticky Gradient Header */}
        <header className="glass-card sticky top-4 z-50 px-6 py-4 flex items-center justify-between mb-8 border border-white/10 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Tawjihi Path" className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
            <div>
              <h1 className="text-xl font-black text-cyan-400 leading-none">طريق التوجيهي</h1>
              <span className="text-[10px] text-slate-400 tracking-wider">TawjihiPath — الإدارة</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-slate-300 font-bold py-2 px-5 rounded-xl transition-all duration-200 active:scale-95 text-sm"
          >
            تسجيل الخروج
          </button>
        </header>

        {/* 6 Stat Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card border border-white/10 rounded-2xl p-5 hover:scale-[1.02] hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between h-32 relative group"
              style={{ boxShadow: `0 10px 30px -15px ${s.glowColor}` }}
            >
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-xs font-semibold leading-tight">{s.label}</span>
                <span className="text-lg opacity-85 group-hover:scale-110 transition-transform duration-200">{s.icon}</span>
              </div>
              <p className={`text-2xl font-black ${s.color} truncate leading-tight`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Donut & Bar Charts Card */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 mb-8 shadow-xl">
          <h2 className="text-lg font-bold text-white border-r-4 border-cyan-500 pr-3 mb-6">
            توزيع التوصيات حسب المجال
          </h2>

          {loading ? (
            <div className="h-56 flex items-center justify-center text-slate-500 font-bold">جاري التحميل...</div>
          ) : fieldData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-slate-500 font-bold">لا توجد بيانات كافية لعرض المخططات بعد</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-xs font-semibold mb-4">رسم بياني شريطي عددي</span>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={fieldData} barSize={40}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#94a3b8', fontFamily: 'Cairo', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, fontFamily: 'Cairo' }}
                      labelStyle={{ color: '#fff' }}
                      itemStyle={{ color: '#94a3b8' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {fieldData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Donut Chart */}
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-xs font-semibold mb-4">التوزيع النسبي للمجالات</span>
                <div className="w-full flex items-center justify-center gap-6">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={fieldData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="count"
                        >
                          {fieldData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, fontFamily: 'Cairo', fontSize: 11 }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend list */}
                  <div className="w-1/2 space-y-2.5">
                    {fieldData.map((entry, index) => {
                      const total = fieldData.reduce((acc, curr) => acc + curr.count, 0);
                      const pct = total > 0 ? Math.round((entry.count / total) * 100) : 0;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                          <div className="flex justify-between w-full text-xs font-bold text-slate-300">
                            <span>{entry.name}</span>
                            <span className="font-mono text-cyan-400">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Line Chart - Full Width */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 shadow-xl mb-8">
          <h2 className="text-lg font-bold text-white border-r-4 border-cyan-500 pr-3 mb-6">
            الاختبارات بمرور الوقت
          </h2>
          {loading ? (
            <div className="h-56 flex items-center justify-center text-slate-500 font-bold">جاري التحميل...</div>
          ) : dailyTestsData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-slate-500 font-bold">لا توجد بيانات كافية لعرض الخط الزمني بعد</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dailyTestsData}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#94a3b8', fontFamily: 'Cairo', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, fontFamily: 'Cairo' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#00E5FF' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ fill: '#00E5FF', r: 4 }}
                  activeDot={{ fill: '#00E5FF', r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Assessments Table */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 mb-8 overflow-x-auto shadow-xl">
          <h2 className="text-lg font-bold text-white border-r-4 border-cyan-500 pr-3 mb-6">
            آخر الاختبارات المنجزة
          </h2>
          {loading ? (
            <p className="text-slate-500 text-center py-8 font-bold">جاري التحميل...</p>
          ) : recentRows.length === 0 ? (
            <p className="text-slate-500 text-center py-8 font-bold">لا توجد اختبارات منجزة بعد</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 font-bold">
                  <th className="text-right pb-3 pr-4">الاسم الطالب</th>
                  <th className="text-right pb-3">المجال الأول للنتيجة</th>
                  <th className="text-right pb-3">نسبة التوافق</th>
                  <th className="text-right pb-3 pl-4">تاريخ الإنجاز</th>
                </tr>
              </thead>
              <tbody>
                {recentRows.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-200">
                    <td className="py-3.5 pr-4 text-white font-semibold">
                      {row.full_name || 'مجهول'}
                    </td>
                    <td className="py-3.5">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold border"
                        style={{
                          background: (FIELD_COLORS[row.field_1] || '#94a3b8') + '15',
                          color: FIELD_COLORS[row.field_1] || '#94a3b8',
                          borderColor: (FIELD_COLORS[row.field_1] || '#94a3b8') + '30'
                        }}
                      >
                        {FIELD_LABELS[row.field_1] || row.field_1}
                      </span>
                    </td>
                    <td className="py-3.5 text-cyan-400 font-bold font-mono">{row.field_1_score}%</td>
                    <td className="py-3.5 text-slate-400 pl-4 font-medium">{fmtDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* User Management Section */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 mb-8 overflow-x-auto shadow-xl">
          <h2 className="text-lg font-bold text-white border-r-4 border-cyan-500 pr-3 mb-6">
            إدارة مستخدمي المنصة
          </h2>
          {loading ? (
            <p className="text-slate-500 text-center py-8 font-bold">جاري التحميل...</p>
          ) : profiles.length === 0 ? (
            <p className="text-slate-500 text-center py-8 font-bold">لا يوجد مستخدمون مسجلون بعد</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 font-bold">
                  <th className="text-right pb-3 pr-4">الاسم الكامل</th>
                  <th className="text-right pb-3">البريد الإلكتروني</th>
                  <th className="text-right pb-3 pl-4">تاريخ التسجيل</th>
                  <th className="text-center pb-3">عدد الاختبارات</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-200">
                    <td className="py-3.5 pr-4 text-white font-semibold">{profile.full_name}</td>
                    <td className="py-3.5 text-slate-300 font-mono text-xs select-all" dir="ltr" style={{ textAlign: 'right' }}>{profile.email}</td>
                    <td className="py-3.5 text-slate-400 font-medium pl-4">{fmtDate(profile.created_at)}</td>
                    <td className="py-3.5 text-slate-300 font-bold font-mono text-center">{profile.tests_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
