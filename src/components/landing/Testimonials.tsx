import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CountUpNumber } from '../ui/CountUpNumber';

export function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      text: t('landing.testimonials.t1.text'),
      name: t('landing.testimonials.t1.name'),
      age: t('landing.testimonials.t1.age'),
      rating: 5,
      image: 'https://i.pravatar.cc/150?u=1'
    },
    {
      text: t('landing.testimonials.t2.text'),
      name: t('landing.testimonials.t2.name'),
      age: t('landing.testimonials.t2.age'),
      rating: 5,
      image: 'https://i.pravatar.cc/150?u=2'
    },
    {
      text: t('landing.testimonials.t3.text'),
      name: t('landing.testimonials.t3.name'),
      age: t('landing.testimonials.t3.age'),
      rating: 5,
      image: 'https://i.pravatar.cc/150?u=3'
    }
  ];

  const statKeys = ['stat3', 'stat2', 'stat1', 'stat4']; // Matching the original order: +50, +95%, +15K, +20

  const getParsedStat = (key: string) => {
    const statString = t(`landing.testimonials.${key}`);
    const spaceIndex = statString.indexOf(' ');
    if (spaceIndex > -1) {
      return {
        value: statString.substring(0, spaceIndex),
        label: statString.substring(spaceIndex + 1)
      };
    }
    return { value: statString, label: '' };
  };

  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
        <div className="glow-box p-8 md:p-12">
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            
            {/* Stats — RIGHT in RTL, LEFT in LTR */}
            <div className="w-full lg:w-1/3">
              <div className="h-full bg-[#02050a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 flex flex-col justify-center shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                <h2 className="text-2xl font-black text-white mb-10 text-center lg:text-start">
                  {t('landing.testimonials.numbersTitle')}
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-10">
                  {statKeys.map((key, i) => {
                    const s = getParsedStat(key);
                    let numValue = 0;
                    let suffix = "";
                    
                    if (key === 'stat3') { numValue = 50; suffix = "+"; }
                    else if (key === 'stat2') { numValue = 95; suffix = "%+"; }
                    else if (key === 'stat1') { numValue = 15; suffix = "K+"; }
                    else if (key === 'stat4') { numValue = 20; suffix = "+"; }

                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                        <CountUpNumber
                          value={numValue}
                          suffix={suffix}
                          className="text-2xl lg:text-3xl font-black text-cyan-400 mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                        />
                        <div className="text-xs text-gray-400 font-medium">{s.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Testimonials — LEFT in RTL, RIGHT in LTR */}
            <div className="w-full lg:w-2/3">
              <div className="h-full bg-[#02050a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                <h2 className="text-2xl font-black text-white mb-10 text-center lg:text-start">
                  {t('landing.testimonials.reviewsTitle')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {testimonials.map((tItem, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-[#050B14]/60 border border-white/5 hover:border-cyan-500/30 p-6 rounded-xl flex flex-col relative group transition-colors">
                      
                      {/* Top corner accent */}
                      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <Quote className="absolute top-4 left-4 text-white/5 w-8 h-8 group-hover:text-cyan-500/10 transition-colors" />
                      
                      <p className="text-xs lg:text-sm text-gray-300 leading-relaxed mb-6 flex-grow relative z-10">
                        {tItem.text}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-auto">
                        <img src={tItem.image} alt={tItem.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-cyan-500/30" />
                        <div>
                          <div className="text-white font-bold text-sm flex items-center gap-2">
                            {tItem.name}
                            <span className="text-gray-500 text-[10px] font-normal">{tItem.age}</span>
                          </div>
                          <div className="flex gap-0.5 mt-1">
                            {[...Array(5)].map((_, j) => (<Star key={j} className={`w-3 h-3 ${j < tItem.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
