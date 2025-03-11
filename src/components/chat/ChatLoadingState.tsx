
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const ChatLoadingState = () => {
  return (
    <motion.div 
      className="flex items-center justify-center h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading conversation...</p>
      </div>
    </motion.div>
  );
};

export default ChatLoadingState;
