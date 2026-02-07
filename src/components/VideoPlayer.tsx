import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  onComplete: () => void;
}

// Placeholder video sources - replace with actual videos
const videoSources = [
  '/videos/video1.mp4',
  '/videos/video2.mp4',
  '/videos/video3.mp4',
];

const VideoPlayer = ({ onComplete }: VideoPlayerProps) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    if (currentVideoIndex < videoSources.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentVideoIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 500);
    } else {
      // All videos done
      onComplete();
    }
  };

  const handleError = () => {
    setHasError(true);
    // If video fails to load, skip to end after a moment
    setTimeout(() => {
      if (currentVideoIndex < videoSources.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
        setHasError(false);
      } else {
        onComplete();
      }
    }, 2000);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, try muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(handleError);
        }
      });
    }
  }, [currentVideoIndex]);

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
            <p className="text-sm mt-2 text-background/50">
              (Add videos to /public/videos/ folder)
            </p>
          </motion.div>
        ) : (
          <motion.video
            key={currentVideoIndex}
            ref={videoRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={videoSources[currentVideoIndex]}
            onEnded={handleVideoEnd}
            onError={handleError}
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        )}
      </AnimatePresence>

      {/* Video progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {videoSources.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentVideoIndex 
                ? 'bg-background' 
                : index < currentVideoIndex 
                  ? 'bg-background/50' 
                  : 'bg-background/20'
            }`}
          />
        ))}
      </div>

      {/* Skip button */}
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
