import { motion } from 'framer-motion';

const FinalMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-foreground flex items-center justify-center z-50"
    >
      <div className="text-center px-6">
        {/* Cake emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.3, 
            type: "spring", 
            damping: 12,
            stiffness: 100 
          }}
          className="text-6xl sm:text-7xl mb-8"
        >
          🎂
        </motion.div>
        
        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-semibold text-background mb-4"
        >
          Happy 21st, sunshine.
        </motion.h1>
        
        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-background/60 text-lg sm:text-xl"
        >
          I love you.
        </motion.p>

        {/* Hearts decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-12 flex justify-center gap-4 text-2xl"
        >
          {['💕', '✨', '💕'].map((emoji, i) => (
            <motion.span
              key={i}
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinalMessage;
