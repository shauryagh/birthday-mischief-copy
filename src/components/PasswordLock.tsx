import { useState } from 'react';
import { motion } from 'framer-motion';

const CORRECT_PASSWORD = 'HAATHI';
const MAX_FAKE_ATTEMPTS = 3;

interface PasswordLockProps {
  onUnlock: () => void;
}

const PasswordLock = ({ onUnlock }: PasswordLockProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [fakeAttemptsLeft, setFakeAttemptsLeft] = useState(MAX_FAKE_ATTEMPTS);

  const getFakeMessage = () => {
    if (fakeAttemptsLeft === 3) return "3 attempts remaining.";
    if (fakeAttemptsLeft === 2) return "2 attempts remaining. Soch le dhang se.";
    if (fakeAttemptsLeft === 1) return "Last attempt. Dimaag laga.";
    return "No attempts left. (Jaa 1 aur try lele 😌)";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      onUnlock();
      return;
    }

    // Wrong password logic
    setError(true);
    setShake(true);
    setPassword('');

    setTimeout(() => setShake(false), 500);

    // Decrease fake attempts but don't go negative
    setFakeAttemptsLeft((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-light text-foreground">
          Enter Password
        </h2>

        <motion.input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="••••••••"
          className="w-64 rounded-lg border border-border bg-background px-4 py-3 text-center text-foreground outline-none focus:ring-2 focus:ring-primary/40"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        />

        {error && (
          <motion.p
            className="text-sm text-destructive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Wrong password 👀
          </motion.p>
        )}

        {/* Fake Attempts Line */}
        <motion.p
          key={fakeAttemptsLeft}
          className="text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {getFakeMessage()}
        </motion.p>

        <button
          type="submit"
          disabled={!password}
          className="rounded-lg bg-primary px-8 py-3 text-primary-foreground transition-opacity disabled:opacity-40"
        >
          Unlock
        </button>
      </motion.form>
    </motion.div>
  );
};

export default PasswordLock;
