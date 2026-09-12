import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export function RoadPath() {
  
  // Track scroll progress of the entire page
  const { scrollYProgress } = useScroll();
  
  // Smooth out the scroll progress for animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Scale the glow bar height based on scroll
  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1]);
  
  // Position the glow orb
  const orbY = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none z-0">
      {/* Background Line */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      
      {/* Scroll-tracked Glow Bar */}
      <motion.div 
        style={{ scaleY, transformOrigin: 'top' }}
        className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-400 to-cyan-500/0 opacity-50 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
      />
      
      {/* The Glow "Boll" / Leader */}
      <motion.div 
        style={{ top: orbY }}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_30px_#22d3ee,0_0_60px_#22d3ee]"
      >
        <div className="absolute inset-0 bg-cyan-400 animate-ping rounded-full opacity-50" />
      </motion.div>
      
      {/* Ambient Glow Orbs behind sections (optional, adds "Better" aesthetics) */}
      {[0.2, 0.4, 0.6, 0.8].map((pos, i) => (
        <motion.div
          key={i}
          style={{ top: `${pos * 100}%` }}
          className="absolute left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-900/10 blur-[100px] -z-10"
        />
      ))}
    </div>
  );
}
