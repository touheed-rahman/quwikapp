
import { ReactNode } from "react";
import Header from "@/components/Header";
import MobileNavigation from "@/components/navigation/MobileNavigation";
import ChatWindow from "@/components/chat/ChatWindow";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductLayoutProps {
  children: ReactNode;
}

const ProductLayout = ({ children }: ProductLayoutProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 pt-20 pb-20 overflow-x-hidden max-w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
      
      <MobileNavigation onChatOpen={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default ProductLayout;
