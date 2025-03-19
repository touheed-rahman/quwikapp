
import { motion } from "framer-motion";
import { Grid, CalendarCheck, ThumbsUp, CheckCircle, Clock, CreditCard, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const HowItWorks = () => {
  const stepsData = [
    {
      icon: Grid,
      title: "Select Service",
      description: "Choose from our wide range of professional services",
      points: ["No hidden charges", "Transparent pricing", "Verified professionals"]
    },
    {
      icon: CalendarCheck,
      title: "Book Appointment",
      description: "Schedule a convenient time that works for you",
      points: ["Flexible scheduling", "Same-day options", "Weekend availability"]
    },
    {
      icon: ThumbsUp,
      title: "Get it Fixed",
      description: "Our verified professionals will solve your problems",
      points: ["100% satisfaction guaranteed", "Quality parts used", "Warranty on services"]
    }
  ];

  const benefitsData = [
    {
      icon: Clock,
      title: "Saves Time",
      description: "No more waiting or searching for reliable service providers"
    },
    {
      icon: CreditCard,
      title: "Transparent Pricing",
      description: "Upfront pricing with no hidden charges or surprises"
    },
    {
      icon: HeartHandshake,
      title: "Quality Assurance",
      description: "All our professionals are vetted and highly rated"
    }
  ];

  return (
    <motion.div 
      className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 rounded-xl mt-8 border border-primary/10 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-primary/90 to-primary/70 text-transparent bg-clip-text">How it works</h2>
        <Badge variant="outline" className="bg-primary/10 text-primary">Simple 3-Step Process</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {stepsData.map((step, index) => (
          <motion.div 
            key={index}
            className="flex flex-col items-center text-center space-y-3 group hover:translate-y-[-8px] transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
          >
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4 relative group-hover:bg-primary/20 transition-all duration-300">
              <step.icon className="h-10 w-10 text-primary group-hover:scale-110 transition-transform" />
              <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">
                {index + 1}
              </div>
            </div>
            <h3 className="font-semibold text-lg">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
            <ul className="space-y-2 pt-2">
              {step.points.map((point, idx) => (
                <li key={idx} className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 inline-block mr-2 flex-shrink-0" />
                  <span className="text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      
      <div className="pt-8 border-t border-primary/10">
        <h3 className="text-xl font-semibold text-center mb-8">Why Choose Our Services?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefitsData.map((benefit, index) => (
            <motion.div 
              key={index}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-primary/5 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6, duration: 0.4 }}
            >
              <div className="flex items-start">
                <div className="p-2 rounded-lg bg-primary/10 mr-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
