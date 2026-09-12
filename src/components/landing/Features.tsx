import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Target, Compass, BookOpen, Briefcase } from 'lucide-react';
import { GlowText } from './GlowText';

export function Features() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('features.item1.title'),
      desc: t('features.item1.desc'),
      icon: <Target className="text-cyan-400" size={24} />,
      gradient: 'from-cyan-500/20 to-blue-500/0'
    },
    {
      title: t('features.item2.title'),
      desc: t('features.item2.desc'),
      icon: <Compass className="text-purple-400" size={24} />,
      gradient: 'from-purple-500/20 to-pink-500/0'
    },
    {
      title: t('features.item3.title'),
      desc: t('features.item3.desc'),
      icon: <BookOpen className="text-emerald-400" size={24} />,
      gradient: 'from-emerald-500/20 to-teal-500/0'
    },
    {
      title: t('features.item4.title'),
      desc: t('features.item4.desc'),
      icon: <Briefcase className="text-orange-400" size={24} />,
      gradient: 'from-orange-500/20 to-red-500/0'
    }
  ];

  return (
    <section id="features" className="py-24 relative z-10">
      <div className="text-center mb-16">
        <GlowText className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t('features.title')}
        </GlowText>
        <p className="text-gray-400 max-w-xl mx-auto">
          {t('features.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative h-full"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative h-full p-8 border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm overflow-hidden group-hover:border-white/20 transition-colors">
              <div className="mb-6 p-3 w-fit rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              
              <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
              
              <div className="mt-8 flex items-center text-xs font-bold text-white/40 group-hover:text-cyan-400 transition-colors gap-2">
                {t('features.learnMore')}
                <div className="w-8 h-px bg-white/10 group-hover:bg-cyan-400 transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Target Audience Badge */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-20 flex justify-center"
      >
        <div className="px-10 py-6 rounded-3xl bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20 border border-white/10 backdrop-blur-md relative overflow-hidden group text-center md:text-left">
          <div className="absolute inset-0 bg-cyan-400/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <span className="font-black text-xl">2009</span>
            </div>
            <div>
              <h4 className="text-2xl font-black text-white">
                {t('features.audienceTitle')}
              </h4>
              <p className="text-cyan-400/70 font-medium">
                {t('features.audienceDesc')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
