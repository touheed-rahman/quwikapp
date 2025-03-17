
import { useState } from "react";
import { Grid, Wrench, Hammer, Zap, Smartphone, Monitor, Thermometer } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const services = [
  { id: "appliance", name: "Appliance Repair", icon: Thermometer },
  { id: "electronic", name: "Electronics Repair", icon: Zap },
  { id: "mobile", name: "Mobile Repair", icon: Smartphone },
  { id: "computer", name: "Computer Repair", icon: Monitor },
  { id: "plumbing", name: "Plumbing", icon: Wrench },
  { id: "carpentry", name: "Carpentry", icon: Hammer },
];

const ServiceView = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold mb-6">Book Professional Services</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {services.map((service) => {
            const IconComponent = service.icon;
            const isSelected = selectedService === service.id;
            
            return (
              <motion.div 
                key={service.id} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.98 }}
                variants={item}
              >
                <Button
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full h-full aspect-square flex flex-col gap-2 items-center justify-center p-3 
                    ${isSelected ? "bg-primary text-white" : "bg-background border-primary/20 hover:border-primary hover:bg-primary/5"}`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <IconComponent className={`h-8 w-8 ${isSelected ? "text-white" : "text-primary/80"}`} />
                  <span className="text-xs font-medium text-center">{service.name}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-muted/50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Grid className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Select Service</h3>
            <p className="text-sm text-muted-foreground">Choose from our range of professional services</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Book Appointment</h3>
            <p className="text-sm text-muted-foreground">Schedule a convenient time for service</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Get it Fixed</h3>
            <p className="text-sm text-muted-foreground">Our professionals will solve your problems</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="bg-primary/5 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Coming Soon!</h3>
          <p className="text-muted-foreground">We're currently expanding our service offerings. Check back soon for more services!</p>
          <Button className="mt-4">Get Notified</Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceView;
