import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '@/components/CountdownTimer';
import EvilButton from '@/components/EvilButton';
import PrematureModal from '@/components/PrematureModal';
import VideoPlayer from '@/components/VideoPlayer';
import FinalMessage from '@/components/FinalMessage';
import PasswordLock from '@/components/PasswordLock';

// ✅ Correct Date
const TARGET_DATE = new Date('2026-02-12T00:00:00');

type Phase =
  | 'countdown'
  | 'locked'
  | 'unlocked'
  | 'almost'
  | 'loading'
  | 'videos'
  | 'final';

const Index = () => {
  const [phase, setPhase] = useState<Phase>(() =>
    new Date() >= TARGET_DATE ? 'locked' : 'countdown'
  );

  const [showModal, setShowModal] = useState(false);

  const handleCountdownComplete = useCallback(() => {
    setPhase('locked');
  }, []);

  const handlePasswordUnlock = useCallback(() => {
    setPhase('unlocked');
  }, []);

  const handlePrematureClick = () => {
    setShowModal(true);
  };

  const handleButtonCaught = () => {
    setPhase('almost');

    setTimeout(() => {
      setPhase('loading');
      setTimeout(() => {
        setPhase('videos');
      }, 3000);
    }, 2000);
  };

  const handleVideosComplete = () => {
    setPhase('final');
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden transition-colors duration-700 ${
        phase === 'videos' || phase === 'loading' || phase === 'almost'
          ? 'bg-black'
          : 'bg-background'
      }`}
    >
      {/* Premature Modal */}
      <PrematureModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Fake "You Thought?" Screen */}
      <AnimatePresence>
        {phase === 'almost' && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-white text-3xl font-light">
              You really thought it would be that easy?
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fake Loading Screen */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-white mb-6">Loading memories...</p>
            <motion.div
              className="h-1 bg-white w-0"
              animate={{ width: '200px' }}
              transition={{ duration: 3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player */}
      <AnimatePresence>
        {phase === 'videos' && (
          <VideoPlayer onComplete={handleVideosComplete} />
        )}
      </AnimatePresence>

      {/* Final Message */}
      <AnimatePresence>
        {phase === 'final' && <FinalMessage />}
      </AnimatePresence>

      {/* Main Content */}
      {phase === 'countdown' && (
        <>
          <h1 className="text-8xl font-light mb-4">12.02</h1>
          <p className="text-muted-foreground mb-12">
            Loading something important.
          </p>

          <CountdownTimer
            targetDate={TARGET_DATE}
            onComplete={handleCountdownComplete}
          />

          <button
            onClick={handlePrematureClick}
            className="mt-10 px-8 py-4 bg-muted text-muted-foreground rounded-lg"
          >
            Jab 21 ki hojae tab click kario.
          </button>
        </>
      )}

      <AnimatePresence>
        {phase === 'locked' && (
          <PasswordLock onUnlock={handlePasswordUnlock} />
        )}
      </AnimatePresence>

      {phase === 'unlocked' && (
        <>
          <h1 className="text-8xl font-light mb-4">12.02</h1>
          <p className="text-muted-foreground mb-12">
            Okay fine. Now try clicking.
          </p>

          <EvilButton onCaught={handleButtonCaught} />
        </>
      )}
    </div>
  );
};

export default Index;
