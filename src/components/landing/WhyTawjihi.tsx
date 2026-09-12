import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlowText } from './GlowText';

export function WhyTawjihi() {
  const { t } = useTranslation();

  const withoutGuidance = [
    t('landing.why.withoutItems.1'),
    t('landing.why.withoutItems.2'),
    t('landing.why.withoutItems.3'),
    t('landing.why.withoutItems.4')
  ];

  const withTawjihi = [
    t('landing.why.withItems.1'),
    t('landing.why.withItems.2'),
    t('landing.why.withItems.3'),
    t('landing.why.withItems.4')
  ];

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/bg-circuit.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#050816]/45 z-0" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12 max-w-5xl">
        <div className="text-center mb-16">
          <GlowText className="text-3xl md:text-4xl font-black text-white mb-2">
            {t('landing.why.title')}
          </GlowText>
          <p className="text-gray-400">{t('landing.why.subtitle')}</p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 max-w-4xl mx-auto relative">
          
          {/* بدون توجيه - Right side in RTL (First in DOM) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-[#050B14]/80 backdrop-blur-md border border-purple-500/40 rounded-2xl p-8 relative shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden group hover:border-purple-500/70 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full" />
            
            <h3 className="text-xl font-bold text-purple-400 mb-8 text-center drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              {t('landing.why.withoutTitle')}
            </h3>
            <ul className="space-y-6 relative z-10">
              {withoutGuidance.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-purple-500/20 text-purple-400">
                    <X size={14} strokeWidth={3} />
                  </div>
                  <span className="text-gray-300 font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* VS Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full" />
              <div className="w-16 h-16 rounded-full bg-[#02050a] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] relative z-10">
                <span className="text-xl font-black text-cyan-400">VS</span>
              </div>
            </div>
          </div>

          {/* مع معيار تحليل - Left side in RTL (Second in DOM) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-[#050B14]/80 backdrop-blur-md border border-green-500/40 rounded-2xl p-8 relative shadow-[0_0_30px_rgba(34,197,94,0.15)] overflow-hidden group hover:border-green-500/70 transition-colors"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-2xl rounded-full" />
            
            <h3 className="text-xl font-bold text-green-400 mb-8 text-center drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
              {t('landing.why.withTitle')}
            </h3>
            <ul className="space-y-6 relative z-10">
              {withTawjihi.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-green-500/20 text-green-400">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="text-white font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
