import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EvilButtonProps {
  onCaught: () => void;
}

const sassyMessages = [
  "Nice try.",
  "Nope.",
  "Almost.",
  "Hehehe.",
  "Still trying?",
  "Reflex kaha hai?",
  "Arey focus.",
  "Embarrassing.",
  "Bas bas.",
  "Last chance."
];

const MAX_ATTEMPTS = 10;

const EvilButton = ({ onCaught }: EvilButtonProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isCaught, setIsCaught] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRandomPosition = useCallback(() => {
    if (!containerRef.current || !buttonRef.current) return { x: 0, y: 0 };

    const container = containerRef.current.getBoundingClientRect();
    const button = buttonRef.current.getBoundingClientRect();

    const padding = 20;
    const maxX = container.width - button.width - padding * 2;
    const maxY = container.height - button.height - padding * 2;

    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;

    return { x: randomX, y: randomY };
  }, []);

  const runAway = useCallback(() => {
    if (isCaught || attempts >= MAX_ATTEMPTS) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    // Safe message indexing
    setCurrentMessage(
      sassyMessages[Math.min(newAttempts - 1, sassyMessages.length - 1)]
    );

    if (newAttempts < MAX_ATTEMPTS) {
      setPosition(getRandomPosition());
    } else {
      setIsCaught(true);
      setCurrentMessage(null);
    }

    setTimeout(() => {
      if (newAttempts < MAX_ATTEMPTS) {
        setCurrentMessage(null);
      }
    }, 800);

  }, [attempts, isCaught, getRandomPosition]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    if (isCaught) {
      onCaught();
      return;
    }

    runAway();
  };

  const handleMouseEnter = () => {
    if (!isCaught && attempts < MAX_ATTEMPTS - 1) {
      runAway();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[220px] sm:h-[280px] flex items-center justify-center"
    >
      {/* Sassy message */}
      <AnimatePresence mode="wait">
        {currentMessage && (
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 text-muted-foreground text-sm font-medium"
          >
            {currentMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Evil Button */}
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onTouchStart={(e) => {
          if (!isCaught && attempts < MAX_ATTEMPTS - 1) {
            e.preventDefault();
            runAway();
          }
        }}
        animate={{
          x: position.x,
          y: position.y,
          scale: isCaught ? 1.05 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        whileHover={isCaught ? { scale: 1.08 } : {}}
        whileTap={isCaught ? { scale: 0.95 } : {}}
        className={`
          px-8 py-4 rounded-lg font-medium text-base sm:text-lg
          transition-colors duration-200
          ${isCaught
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
            : 'bg-muted text-muted-foreground cursor-pointer'
          }
        `}
      >
        {isCaught ? "Fine, you got me." : "Click if you can."}
      </motion.button>

      {/* Attempt counter (optional if you want visible chaos) */}
      {!isCaught && attempts > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 text-xs text-muted-foreground"
        >
      
        </motion.div>
      )}
    </div>
  );
};

export default EvilButton;
