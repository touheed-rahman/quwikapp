
import { motion } from "framer-motion";
import { Grid, CalendarCheck, ThumbsUp } from "lucide-react";

const HowItWorks = () => {
  return (
    <motion.div 
      className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 rounded-xl mt-8 border border-primary/10 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-primary/90 to-primary/70 text-transparent bg-clip-text">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4 relative group hover:bg-primary/20 transition-all duration-300">
            <Grid className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
            <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">1</div>
          </div>
          <h3 className="font-semibold text-lg">Select Service</h3>
          <p className="text-muted-foreground">Choose from our wide range of professional services</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4 relative group hover:bg-primary/20 transition-all duration-300">
            <CalendarCheck className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
            <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">2</div>
          </div>
          <h3 className="font-semibold text-lg">Book Appointment</h3>
          <p className="text-muted-foreground">Schedule a convenient time that works for you</p>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4 relative group hover:bg-primary/20 transition-all duration-300">
            <ThumbsUp className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
            <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">3</div>
          </div>
          <h3 className="font-semibold text-lg">Get it Fixed</h3>
          <p className="text-muted-foreground">Our verified professionals will solve your problems</p>
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
