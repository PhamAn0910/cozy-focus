import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FocusTimer } from './FocusTimer';
import { Blocklist } from './Blocklist';

interface FocusControlsProps {
  isLocked: boolean;
  currentSessionSeconds: number;
  blockedDomains: string[];
  onAddDomain: (domain: string) => void;
  onRemoveDomain: (domain: string) => void;
  onLockIn: () => void;
  onStopSession: () => void;
}

export function FocusControls({
  isLocked,
  currentSessionSeconds,
  blockedDomains,
  onAddDomain,
  onRemoveDomain,
  onLockIn,
  onStopSession,
}: FocusControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel p-4 w-full max-w-xs space-y-4"
    >
      {/* Focus Badge */}
      <div className="flex justify-center">
        <motion.div
          animate={{ scale: isLocked ? [1, 1.02, 1] : 1 }}
          transition={{ repeat: isLocked ? Infinity : 0, duration: 2 }}
          className={isLocked ? 'focus-badge-on' : 'focus-badge-off'}
        >
          <span className={`w-2 h-2 rounded-full ${isLocked ? 'bg-card animate-pulse' : 'bg-muted-foreground'}`} />
          Focus Mode: {isLocked ? 'ON' : 'OFF'}
        </motion.div>
      </div>

      {/* Timer */}
      <div className="text-center py-2">
        <FocusTimer seconds={currentSessionSeconds} />
      </div>

      {/* Blocklist */}
      <Blocklist
        domains={blockedDomains}
        onAddDomain={onAddDomain}
        onRemoveDomain={onRemoveDomain}
        isLocked={isLocked}
      />

      {/* Action Button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {isLocked ? (
          <Button
            onClick={onStopSession}
            variant="outline"
            className="w-full py-6 text-base border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <Unlock className="w-4 h-4 mr-2" />
            Stop Session
          </Button>
        ) : (
          <Button
            onClick={onLockIn}
            className="w-full py-6 text-base bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Lock className="w-4 h-4 mr-2" />
            Lock In
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
