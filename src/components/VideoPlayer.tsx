import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  onComplete: () => void;
}

const VideoPlayer = ({ onComplete }: VideoPlayerProps) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    onComplete();
  };

  const handleError = () => {
    setHasError(true);
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;

    video.play().catch(() => {
      console.log("Autoplay blocked");
      // If autoplay fails, show controls so she can press play
      video.controls = true;
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-foreground/95 flex items-center justify-center z-50"
    >
      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-background/80"
          >
            <p className="text-lg">Loading memories...</p>
          </motion.div>
        ) : (
          <motion.video
            key="single-video"
            ref={videoRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src="/videos/video1.mp4"
            onEnded={handleVideoEnd}
            onError={handleError}
            playsInline
            className="max-w-full max-h-[85vh]"
          />
        )}
      </AnimatePresence>

      <button
        onClick={onComplete}
        className="absolute top-6 right-6 text-background/50 hover:text-background text-sm transition-colors"
      >
        Skip →
      </button>
    </motion.div>
  );
};

export default VideoPlayer;
