import { motion } from 'framer-motion';
import { Lock, Unlock, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { FocusTimer } from './FocusTimer';
import { Blocklist } from './Blocklist';

interface FocusControlsProps {
  isLocked: boolean;
  currentSessionSeconds: number;
  remainingSeconds: number;
  blockedDomains: string[];
  enabledDomains: string[];
  sessionDurationMinutes: number;
  onAddDomain: (domain: string) => void;
  onRemoveDomain: (domain: string) => void;
  onToggleDomain: (domain: string) => void;
  onLockIn: () => void;
  onStopSession: () => void;
  onSetDuration: (minutes: number) => void;
}

const formatDuration = (minutes: number) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes}m`;
};

const formatRemainingTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export function FocusControls({
  isLocked,
  currentSessionSeconds,
  remainingSeconds,
  blockedDomains,
  enabledDomains,
  sessionDurationMinutes,
  onAddDomain,
  onRemoveDomain,
  onToggleDomain,
  onLockIn,
  onStopSession,
  onSetDuration,
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
        {isLocked && remainingSeconds > 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mt-2"
          >
            {formatRemainingTime(remainingSeconds)} remaining
          </motion.p>
        )}
      </div>

      {/* Duration Selector (only when not locked) */}
      {!isLocked && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Session Duration</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {formatDuration(sessionDurationMinutes)}
            </span>
          </div>
          <Slider
            value={[sessionDurationMinutes]}
            onValueChange={(v) => onSetDuration(v[0])}
            min={5}
            max={180}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5m</span>
            <span>1h</span>
            <span>2h</span>
            <span>3h</span>
          </div>
        </motion.div>
      )}

      {/* Blocklist */}
      <Blocklist
        domains={blockedDomains}
        enabledDomains={enabledDomains}
        onAddDomain={onAddDomain}
        onRemoveDomain={onRemoveDomain}
        onToggleDomain={onToggleDomain}
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
