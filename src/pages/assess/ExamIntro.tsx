import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Navbar } from '../../components/landing/Navbar';
import { useTranslation } from 'react-i18next';

export default function ExamIntro() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  // Text definitions for both languages
  const texts = {
    title: isAr ? 'تنبيه مهم' : 'Important Notice',
    subtitle: isAr ? 'دقة نتائجك مرتبطة مباشرةً بصدق إجاباتك' : 'Your results accuracy depends directly on the honesty of your answers',
    points: isAr
      ? [
          'أجب بصدق تام — لا توجد إجابات صحيحة أو خاطئة',
          'لا تتسرع، خذ وقتك في كل سؤال',
          'أجب على جميع الأسئلة دون تخطي أي منها',
        ]
      : [
          'Answer honestly — there are no right or wrong answers',
          'Do not rush, take your time on each question',
          'Answer every question without skipping any',
        ],
    button: isAr ? 'فهمت، ابدأ الاختبار' : "Got it, start the test",
  };

  return (
    <div
      className="min-h-screen bg-[#050505] flex flex-col items-center justify-start px-4"
      dir={isAr ? 'rtl' : 'ltr'}
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      {/* Navbar stays on top */}
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center space-y-8 mt-12"
      >
        {/* Warning icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-orange-500/15 border-2 border-orange-500/40 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-orange-400" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-white">{texts.title}</h1>
          <p className="text-orange-300 text-lg font-semibold">{texts.subtitle}</p>
        </div>

        {/* Warning points */}
        <div className="rounded-2xl border border-orange-500/25 bg-orange-500/8 p-6 space-y-4 text-right">
          {texts.points.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-1 w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              <p className="text-slate-300 text-sm leading-relaxed">{point}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/assess/questions')}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/25"
        >
          <span>{texts.button}</span>
          <ChevronRight className="w-5 h-5 -scale-x-100" />
        </button>
      </motion.div>
    </div>
  );
}
