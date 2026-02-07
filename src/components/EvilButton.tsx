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
  "Last chance.",
];

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
    
    // Calculate safe bounds (with padding)
    const padding = 20;
    const maxX = container.width - button.width - padding * 2;
    const maxY = container.height - button.height - padding * 2;
    
    // Generate random position
    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;
    
    return { x: randomX, y: randomY };
  }, []);

  const runAway = useCallback(() => {
    if (isCaught || attempts >= 5) return;
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setCurrentMessage(sassyMessages[attempts]);
    
    if (newAttempts < 5) {
      setPosition(getRandomPosition());
    } else {
      // After 5th attempt, button is caught
      setIsCaught(true);
      setCurrentMessage(null);
    }
    
    // Clear message after a short delay
    setTimeout(() => {
      if (newAttempts < 5) {
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
    // Run away on hover (before being caught)
    if (!isCaught && attempts < 4) {
      runAway();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[200px] sm:h-[250px] flex items-center justify-center"
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
          if (!isCaught && attempts < 4) {
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
          damping: 20 
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

      {/* Attempt counter */}
      {!isCaught && attempts > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 text-xs text-muted-foreground"
        >
          Attempts: {attempts}/5
        </motion.div>
      )}
    </div>
  );
};

export default EvilButton;
