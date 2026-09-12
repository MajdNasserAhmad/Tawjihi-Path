import { motion } from 'framer-motion';
import { Target, Search, Compass, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlowText } from './GlowText';

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      num: t('landing.howItWorks.step1.num'),
      title: t('landing.howItWorks.step1.title'),
      desc: t('landing.howItWorks.step1.desc'),
      icon: <Search className="w-6 h-6" />
    },
    {
      num: t('landing.howItWorks.step2.num'),
      title: t('landing.howItWorks.step2.title'),
      desc: t('landing.howItWorks.step2.desc'),
      icon: <Target className="w-6 h-6" />
    },
    {
      num: t('landing.howItWorks.step3.num'),
      title: t('landing.howItWorks.step3.title'),
      desc: t('landing.howItWorks.step3.desc'),
      icon: <Compass className="w-6 h-6" />
    },
    {
      num: t('landing.howItWorks.step4.num'),
      title: t('landing.howItWorks.step4.title'),
      desc: t('landing.howItWorks.step4.desc'),
      icon: <ShieldCheck className="w-6 h-6" />
    }
  ];

  return (
    <section 
      id="how-it-works"
      className="py-24 relative z-10"
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-6xl">
        <div className="text-center mb-20">
          <GlowText className="text-3xl md:text-4xl font-black text-white mb-2">
            {t('landing.howItWorks.title')}
          </GlowText>
        </div>

        <div className="glow-box p-8 md:p-12">
          <div className="relative">
            {/* Main glowing connection line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-cyan-900 shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
              
              {/* Arrows along the line */}
              <div className="absolute top-1/2 left-[33%] -translate-y-1/2 text-cyan-500">»</div>
              <div className="absolute top-1/2 left-[66%] -translate-y-1/2 text-cyan-500">»</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Node */}
                  <div className="relative mb-6">
                    {/* Glowing rings */}
                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md scale-150" />
                    <div className="absolute inset-[-8px] rounded-full border border-cyan-500/30 animate-[spin_4s_linear_infinite]" />
                    
                    <div className="w-24 h-24 rounded-full bg-[#050B14] border-2 border-cyan-400 flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                      <div className="absolute top-2 left-2 text-cyan-200 text-xs font-black">{step.num}</div>
                      <div className="text-cyan-400">{step.icon}</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
