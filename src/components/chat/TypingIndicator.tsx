
import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex px-3 py-2 text-sm max-w-[80%] bg-muted rounded-lg shadow-sm">
      <div className="flex items-center gap-1">
        <motion.div
          className="h-2 w-2 bg-primary/60 rounded-full"
          animate={{ scale: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2 }}
        />
        <motion.div
          className="h-2 w-2 bg-primary/60 rounded-full"
          animate={{ scale: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2, delay: 0.1 }}
        />
        <motion.div
          className="h-2 w-2 bg-primary/60 rounded-full"
          animate={{ scale: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.2, delay: 0.2 }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;
