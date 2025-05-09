
import { ReactNode } from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.1, 
      delayChildren: 0.1,
      when: "beforeChildren"
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  }
};

type ServiceLayoutProps = {
  children: ReactNode;
};

const ServiceLayout = ({ children }: ServiceLayoutProps) => {
  return (
    <motion.div 
      className="relative space-y-8 min-h-screen z-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Enhanced abstract shapes in the background for more visually appealing UI */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-60 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/5 to-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-amber-200/5 to-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-80 left-40 w-60 h-60 bg-gradient-to-br from-green-200/5 to-teal-400/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Service content with improved transitions */}
      <motion.div 
        variants={item} 
        className="px-4 sm:px-6 max-w-[1400px] mx-auto w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ServiceLayout;
