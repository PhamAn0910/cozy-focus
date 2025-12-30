import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFocusState } from '@/hooks/useFocusState';
import { FocusControls } from '@/components/FocusControls';
import { AudioPlayer } from '@/components/AudioPlayer';
import { StopChallengeModal } from '@/components/StopChallengeModal';
import { Logo } from '@/components/Logo';
import studyGirl from '@/assets/study-girl.png';

const Index = () => {
  const {
    isLocked,
    blockedDomains,
    currentSessionSeconds,
    addDomain,
    removeDomain,
    lockIn,
    unlock,
  } = useFocusState();

  const [showStopModal, setShowStopModal] = useState(false);

  const handleStopSession = () => {
    setShowStopModal(true);
  };

  const handleConfirmStop = () => {
    unlock();
    setShowStopModal(false);
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden bg-background">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-muted/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <img
          src={studyGirl}
          alt="Cozy study scene"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-6 flex flex-col">
        {/* Top Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start gap-4">
          <FocusControls
            isLocked={isLocked}
            currentSessionSeconds={currentSessionSeconds}
            blockedDomains={blockedDomains}
            onAddDomain={addDomain}
            onRemoveDomain={removeDomain}
            onLockIn={lockIn}
            onStopSession={handleStopSession}
          />

          <AudioPlayer />
        </header>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Right Logo */}
        <footer className="flex justify-end">
          <Logo />
        </footer>
      </div>

      {/* Stop Challenge Modal */}
      <StopChallengeModal
        isOpen={showStopModal}
        onClose={() => setShowStopModal(false)}
        onConfirmStop={handleConfirmStop}
        sessionMinutes={Math.max(0, Math.ceil((30 * 60 - currentSessionSeconds) / 60))}
      />
    </main>
  );
};

export default Index;
