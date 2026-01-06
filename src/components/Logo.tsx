import { motion } from 'framer-motion';
import logoCactus from '@/assets/logo-cactus.png';
import logoText from '@/assets/logo-text.png';

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex items-center gap-3"
    >
      <img 
        src={logoCactus} 
        alt="Cactus mascot" 
        className="w-20 h-auto object-contain" 
      />
      <img 
        src={logoText} 
        alt="The Focus Coffee Shop" 
        className="h-16 w-auto object-contain" 
      />
    </motion.div>
  );
}
