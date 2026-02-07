import { motion, AnimatePresence } from 'framer-motion';

interface PrematureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrematureModal = ({ isOpen, onClose }: PrematureModalProps) => {
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
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
          >
            <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-xl">
              {/* Elephant emoji */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", damping: 15 }}
                className="text-5xl mb-4"
              >
                🐘
              </motion.div>
              
              {/* Main text */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-semibold text-foreground mb-2"
              >
                Tham jaa hathi
              </motion.h3>
              
              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground"
              >
                Abhi time nahi hua.
              </motion.p>
              
              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-muted/80 transition-colors"
              >
                Theek hai 😔
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PrematureModal;
