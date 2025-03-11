
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ChatSignInPrompt = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-lg mb-4">Please sign in to view this chat</p>
      <Button onClick={() => navigate('/profile')}>Sign In</Button>
    </motion.div>
  );
};

export default ChatSignInPrompt;
