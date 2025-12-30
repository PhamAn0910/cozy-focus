import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-white/80 rounded-2xl p-3 flex items-center gap-3"
    >
      <img src={logo} alt="The Focus Coffee Shop" className="w-10 h-10 rounded-lg object-contain" />
      <div className="flex flex-col font-body">
        <span className="text-sm font-semibold text-secondary uppercase tracking-wide">THE FOCUS</span>
        <span className="text-xs text-primary uppercase tracking-wide">COFFEE SHOP</span>
      </div>
    </motion.div>
  );
}
