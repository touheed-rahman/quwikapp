
import { motion } from "framer-motion";
import { Grid, CalendarCheck, ThumbsUp, MousePointerClick } from "lucide-react";

const HowItWorks = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-lg mt-12 border border-primary/10 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div className="flex flex-col items-center text-center space-y-4" variants={item}>
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-2 relative shadow-inner">
            <MousePointerClick className="h-10 w-10 text-primary" />
            <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg">1</div>
          </div>
          <h3 className="font-semibold text-lg">Select Service</h3>
          <p className="text-muted-foreground">Browse through our wide range of professional services and choose what you need</p>
        </motion.div>
        
        <div className="hidden md:block absolute top-20 left-1/4 right-1/4 border-t-2 border-dashed border-primary/30 z-0"></div>
        
        <motion.div className="flex flex-col items-center text-center space-y-4" variants={item}>
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-2 relative shadow-inner">
            <Grid className="h-10 w-10 text-primary" />
            <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg">2</div>
          </div>
          <h3 className="font-semibold text-lg">Share Details</h3>
          <p className="text-muted-foreground">Tell us about your service needs and schedule a convenient time</p>
        </motion.div>
        
        <div className="hidden md:block absolute top-20 left-1/2 right-1/4 border-t-2 border-dashed border-primary/30 z-0"></div>
        
        <motion.div className="flex flex-col items-center text-center space-y-4" variants={item}>
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-2 relative shadow-inner">
            <CalendarCheck className="h-10 w-10 text-primary" />
            <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg">3</div>
          </div>
          <h3 className="font-semibold text-lg">Book Appointment</h3>
          <p className="text-muted-foreground">Confirm your booking and we'll match you with the right professional</p>
        </motion.div>
        
        <div className="hidden md:block absolute top-20 left-3/4 right-0 border-t-2 border-dashed border-primary/30 z-0"></div>
        
        <motion.div className="flex flex-col items-center text-center space-y-4" variants={item}>
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-2 relative shadow-inner">
            <ThumbsUp className="h-10 w-10 text-primary" />
            <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg">4</div>
          </div>
          <h3 className="font-semibold text-lg">Get It Done</h3>
          <p className="text-muted-foreground">Our skilled professionals will arrive and deliver high-quality service</p>
        </motion.div>
      </motion.div>
      
      <div className="mt-10 bg-white/80 rounded-lg p-4 border border-primary/10 text-center">
        <p className="font-medium text-primary">Try our service today and enjoy 10% off your first booking!</p>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
