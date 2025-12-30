import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LockOpen, Coffee, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StopChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStop: () => void;
  sessionMinutes: number;
}

const SHAME_PHRASE = "I am choosing distraction over my goals";

export function StopChallengeModal({ isOpen, onClose, onConfirmStop, sessionMinutes }: StopChallengeModalProps) {
  const [inputValue, setInputValue] = useState('');
  const isMatch = inputValue.toLowerCase() === SHAME_PHRASE.toLowerCase();

  const handleConfirm = () => {
    if (isMatch) {
      onConfirmStop();
      setInputValue('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="glass-panel w-full max-w-md p-8 space-y-6">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <LockOpen className="w-8 h-8 text-primary" />
              </div>

              {/* Title */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-display text-foreground">Are you sure?</h2>
                <p className="text-muted-foreground">
                  You are about to break your focus session. Breaking flow takes{' '}
                  <span className="text-primary font-semibold">23 minutes</span> to recover.
                </p>
              </div>

              {/* Challenge */}
              <div className="glass-panel bg-muted/20 p-5 space-y-4">
                <p className="text-xs uppercase tracking-widest text-center text-muted-foreground font-semibold">
                  To stop, type this phrase exactly:
                </p>
                <p className="text-center font-display text-lg italic text-foreground">
                  "{SHAME_PHRASE}"
                </p>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type the phrase here..."
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-center text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleConfirm}
                  disabled={!isMatch}
                  variant="secondary"
                  className="w-full py-6 text-base disabled:opacity-40"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Confirm Stop
                </Button>

                <Button
                  onClick={onClose}
                  className="w-full py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Coffee className="w-4 h-4 mr-2" />
                  Stay Focused
                </Button>
              </div>

              {/* Session info */}
              <p className="text-center text-sm text-muted-foreground">
                Session ends in {sessionMinutes} minutes.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
