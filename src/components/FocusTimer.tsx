import { motion } from 'framer-motion';

interface FocusTimerProps {
  seconds: number;
}

export function FocusTimer({ seconds }: FocusTimerProps) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="timer-display text-7xl md:text-8xl font-light text-foreground tracking-tight"
    >
      {hours > 0 && (
        <>
          <span>{formatNumber(hours)}</span>
          <span className="text-muted-foreground">:</span>
        </>
      )}
      <span>{formatNumber(minutes)}</span>
      <span className="text-muted-foreground animate-pulse-soft">:</span>
      <span>{formatNumber(secs)}</span>
    </motion.div>
  );
}
