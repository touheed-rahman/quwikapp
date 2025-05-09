
import { ReactNode } from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

type ServiceLayoutProps = {
  children: ReactNode;
};

const ServiceLayout = ({ children }: ServiceLayoutProps) => {
  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
};

export default ServiceLayout;
