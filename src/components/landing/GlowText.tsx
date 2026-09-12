import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface GlowTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlowText({ children, className = '', delay = 0 }: GlowTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0.1, y: 10, filter: 'brightness(0.5) blur(2px)' }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        filter: 'brightness(1) blur(0px)',
        textShadow: '0 0 20px rgba(34,211,238,0.5)' 
      }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: "easeOut" 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
