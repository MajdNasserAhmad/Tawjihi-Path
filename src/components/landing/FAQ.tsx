import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlowText } from './GlowText';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useTranslation();

  const faqs = [
    { q: t('landing.faq.q1'), a: t('landing.faq.a1') },
    { q: t('landing.faq.q2'), a: t('landing.faq.a2') },
    { q: t('landing.faq.q3'), a: t('landing.faq.a3') },
    { q: t('landing.faq.q4'), a: t('landing.faq.a4') },
    { q: t('landing.faq.q5'), a: t('landing.faq.a5') },
    { q: t('landing.faq.q6'), a: t('landing.faq.a6') }
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-5xl">
        <div className="text-center mb-16">
          <GlowText className="text-3xl md:text-4xl font-black text-white mb-4">
            {t('landing.faq.title')}
          </GlowText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
              className="bg-[#02050a]/80 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-500/40 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.05)] rounded-none relative">
              
              {/* Corner tech accents */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />

              <button onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-start hover:bg-white/5 transition-colors gap-4">
                <ChevronDown className={`text-cyan-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} size={18} />
                <span className="text-gray-200 font-medium text-sm flex-1">{faq.q}</span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="px-5 pb-4 text-gray-400 text-sm leading-relaxed border-t border-cyan-500/10 pt-3">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
