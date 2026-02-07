import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '@/components/CountdownTimer';
import EvilButton from '@/components/EvilButton';
import PrematureModal from '@/components/PrematureModal';
import VideoPlayer from '@/components/VideoPlayer';
import FinalMessage from '@/components/FinalMessage';

// Target date: 12th February 2026 at 12:00 AM
const TARGET_DATE = new Date('2026-02-12T00:00:00');

type Phase = 'countdown' | 'unlocked' | 'videos' | 'final';

const Index = () => {
  const [phase, setPhase] = useState<Phase>(() => {
    // Check if we're already past the target date
    return new Date() >= TARGET_DATE ? 'unlocked' : 'countdown';
  });
  const [showModal, setShowModal] = useState(false);

  const handleCountdownComplete = useCallback(() => {
    setPhase('unlocked');
  }, []);

  const handlePrematureClick = () => {
    setShowModal(true);
  };

  const handleButtonCaught = () => {
    setPhase('videos');
  };

  const handleVideosComplete = () => {
    setPhase('final');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Video Player Overlay */}
      <AnimatePresence>
        {phase === 'videos' && (
          <VideoPlayer onComplete={handleVideosComplete} />
        )}
      </AnimatePresence>

      {/* Final Message Overlay */}
      <AnimatePresence>
        {phase === 'final' && <FinalMessage />}
      </AnimatePresence>

      {/* Premature Click Modal */}
      <PrematureModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Main Content */}
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* Big Date */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-7xl sm:text-8xl md:text-9xl font-light text-foreground mb-4 tracking-tight"
        >
          12.02
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-muted-foreground text-lg sm:text-xl mb-12"
        >
          {phase === 'countdown' 
            ? 'Loading something important.' 
            : 'Okay fine. Now try clicking.'
          }
        </motion.p>

        {/* Countdown Timer (only in countdown phase) */}
        <AnimatePresence mode="wait">
          {phase === 'countdown' && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <CountdownTimer 
                targetDate={TARGET_DATE} 
                onComplete={handleCountdownComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button Section */}
        <AnimatePresence mode="wait">
          {phase === 'countdown' && (
            <motion.div
              key="premature-button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={handlePrematureClick}
                className="px-8 py-4 bg-muted text-muted-foreground rounded-lg font-medium text-base sm:text-lg hover:bg-muted/80 transition-colors"
              >
                Jab 21 ki hojae tab click kario.
              </button>
            </motion.div>
          )}

          {phase === 'unlocked' && (
            <motion.div
              key="evil-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <EvilButton onCaught={handleButtonCaught} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 text-center"
      >
        <p className="text-xs text-muted-foreground/50">
          Made with questionable intentions 💕
        </p>
      </motion.div>
    </div>
  );
};

export default Index;
