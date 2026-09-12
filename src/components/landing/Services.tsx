import { motion } from 'framer-motion';
import { Target, ListChecks, Building2, Lightbulb, BrainCircuit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GlowText } from './GlowText';

export function Services() {
  const { t } = useTranslation();

  const services = [
    {
      title: t('landing.services.item1.title'),
      desc: t('landing.services.item1.desc'),
      icon: <BrainCircuit className="w-6 h-6 text-cyan-400" />
    },
    {
      title: t('landing.services.item2.title'),
      desc: t('landing.services.item2.desc'),
      icon: <Lightbulb className="w-6 h-6 text-cyan-400" />
    },
    {
      title: t('landing.services.item3.title'),
      desc: t('landing.services.item3.desc'),
      icon: <Building2 className="w-6 h-6 text-cyan-400" />
    },
    {
      title: t('landing.services.item4.title'),
      desc: t('landing.services.item4.desc'),
      icon: <ListChecks className="w-6 h-6 text-cyan-400" />
    },
    {
      title: t('landing.services.item5.title'),
      desc: t('landing.services.item5.desc'),
      icon: <Target className="w-6 h-6 text-cyan-400" />
    }
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="text-center mb-16">
          <GlowText className="text-3xl md:text-4xl font-black text-white mb-2">
            {t('landing.services.title')}
          </GlowText>
          <p className="text-gray-400">{t('landing.services.subtitle')}</p>
        </div>

        <div className="glow-box p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 rounded-2xl bg-[#02050a]/60 backdrop-blur-md border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-[#050B14]/80 transition-all duration-300 text-center flex flex-col items-center group shadow-[0_0_15px_rgba(34,211,238,0.05)] hover:shadow-[0_0_25px_rgba(34,211,238,0.2)] overflow-hidden"
              >
                {/* Top border highlight */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 rounded-xl bg-[#0a1929] border border-cyan-500/30 flex items-center justify-center relative z-10 rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    <div className="-rotate-45 group-hover:rotate-0 transition-transform duration-500">
                      {service.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-2 relative z-10">{service.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed relative z-10">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
