
import { motion } from "framer-motion";
import { Grid, CalendarCheck, ThumbsUp } from "lucide-react";

const HowItWorks = () => {
  return (
    <motion.div 
      className="bg-gradient-to-br from-muted/50 to-muted/30 p-8 rounded-lg mt-8 border border-primary/5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h2 className="text-xl font-bold mb-6 text-center">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2 relative">
            <Grid className="h-8 w-8 text-primary" />
            <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
          </div>
          <h3 className="font-semibold text-lg">Select Service</h3>
          <p className="text-muted-foreground">Choose from our range of professional services</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2 relative">
            <CalendarCheck className="h-8 w-8 text-primary" />
            <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
          </div>
          <h3 className="font-semibold text-lg">Book Appointment</h3>
          <p className="text-muted-foreground">Schedule a convenient time for service</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2 relative">
            <ThumbsUp className="h-8 w-8 text-primary" />
            <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
          </div>
          <h3 className="font-semibold text-lg">Get it Fixed</h3>
          <p className="text-muted-foreground">Our professionals will solve your problems</p>
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
