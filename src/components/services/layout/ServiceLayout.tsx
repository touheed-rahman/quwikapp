
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
      {/* Abstract shapes in the background */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-40 right-10 w-64 h-64 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-80 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/5 to-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-r from-amber-200/5 to-yellow-400/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Service content */}
      <motion.div variants={item}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ServiceLayout;
