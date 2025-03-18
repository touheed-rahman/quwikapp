
import { motion } from "framer-motion";
import { Search, Calendar, UserCheck } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Choose Service",
      description: "Browse and select from our wide range of professional services"
    },
    {
      icon: Calendar,
      title: "Book Appointment",
      description: "Select a convenient date and time that works for you"
    },
    {
      icon: UserCheck,
      title: "Get Expert Help",
      description: "Our verified professional will arrive and solve your problem"
    }
  ];

  return (
    <motion.div 
      className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl mt-8 border border-primary/5 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="p-6 md:p-8 text-center border-b border-primary/5">
        <h2 className="text-2xl font-bold mb-2">How It Works</h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Book a service in just three simple steps and get your problems solved by professionals
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 p-6 md:p-10">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            className="flex flex-col items-center text-center p-4 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-50"></div>
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-2 relative">
                <step.icon className="h-10 w-10 text-primary" />
                <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-24 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            )}
            
            <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HowItWorks;
