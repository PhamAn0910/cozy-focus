import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFocusState } from '@/hooks/useFocusState';
import { FocusControls } from '@/components/FocusControls';
import { AudioPlayer } from '@/components/AudioPlayer';
import { StopChallengeModal } from '@/components/StopChallengeModal';
import studyingGirl from '@/assets/little-studying-girl.png';
import windowVideo from '@/assets/animated-window.mp4';
import logoWindowSeat from '@/assets/logo-window-seat.png';

const Index = () => {
  const {
    isLocked,
    blockedDomains,
    enabledDomains,
    currentSessionSeconds,
    remainingSeconds,
    sessionDurationMinutes,
    addDomain,
    removeDomain,
    toggleDomain,
    setSessionDuration,
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

  // Calculate remaining minutes for the modal
  const remainingMinutes = Math.ceil(remainingSeconds / 60);

  return (
    <main className="h-screen w-full relative overflow-hidden" style={{ backgroundColor: '#fdfdf8' }}>
      {/* Layer 0: Window with animated video (center-right) */}
      <div className="absolute top-[42%] left-[58%] -translate-y-1/2 z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-36 h-48 md:w-40 md:h-56 lg:w-48 lg:h-64 overflow-hidden"
          style={{
            borderRadius: '9999px 9999px 1rem 1rem',
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={windowVideo} type="video/mp4" />
          </video>
        </motion.div>
      </div>

      {/* Layer 1: Studying girl image (overlapping window) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-[40%] left-[45%] -translate-y-1/2 -translate-x-1/2 z-10"
      >
        <img
          src={studyingGirl}
          alt="Girl studying at desk"
          className="w-[200px] md:w-[280px] lg:w-[340px] h-auto object-contain"
        />
      </motion.div>

      {/* Layer 1: Window Seat logo (near the girl and window) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-[29%] left-[46%] -translate-x-1/2 z-10"
      >
        <img
          src={logoWindowSeat}
          alt="Window Seat"
          className="w-[110px] md:w-[140px] lg:w-[170px] h-auto object-contain"
        />
      </motion.div>

      {/* Layer 2: UI Overlays */}
      
      {/* FocusControls - Left side, with consistent top margin */}
      <div className="absolute left-6 md:left-8 top-6 md:top-8 z-20">
        <FocusControls
          isLocked={isLocked}
          currentSessionSeconds={currentSessionSeconds}
          remainingSeconds={remainingSeconds}
          blockedDomains={blockedDomains}
          enabledDomains={enabledDomains}
          sessionDurationMinutes={sessionDurationMinutes}
          onAddDomain={addDomain}
          onRemoveDomain={removeDomain}
          onToggleDomain={toggleDomain}
          onLockIn={lockIn}
          onStopSession={handleStopSession}
          onSetDuration={setSessionDuration}
        />
      </div>

      {/* AudioPlayer - Bottom right with consistent margin */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 flex flex-col items-end gap-2">
        <span className="text-sm italic text-muted-foreground font-medium">
          Listen before you lock in.
        </span>
        <AudioPlayer />
      </div>

      {/* Stop Challenge Modal */}
      <StopChallengeModal
        isOpen={showStopModal}
        onClose={() => setShowStopModal(false)}
        onConfirmStop={handleConfirmStop}
        remainingMinutes={remainingMinutes}
      />
    </main>
  );
};

export default Index;
