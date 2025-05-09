import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LocationSelector from "@/components/LocationSelector";

interface ServiceHeroProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedLocation: string | null;
  onLocationChange: (value: string) => void;
}

const ServiceHero = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  onLocationChange
}: ServiceHeroProps) => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };
  
  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.3,
        ease: "easeOut" 
      }
    }
  };
  
  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      }
    }
  };
  
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent rounded-3xl">
      {/* Abstract shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-10 right-20 w-32 h-32 bg-primary/10 rounded-full blur-xl"
          animate={floatingAnimation}
        />
        <motion.div 
          className="absolute bottom-10 left-20 w-40 h-40 bg-blue-400/10 rounded-full blur-xl"
          animate={{
            y: [0, -15, 0],
            transition: {
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.5
            }
          }}
        />
        <motion.div 
          className="absolute top-40 left-40 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"
          animate={{
            y: [0, -8, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 1
            }
          }}
        />
      </div>

      <div className="container px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
              Expert Services at Your Doorstep
            </h1>
            <p className="text-lg text-slate-700 mb-8">
              Book verified professionals for 100+ home services. Trusted by 10K+ customers.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3"
            initial="hidden"
            animate="visible"
            variants={inputVariants}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for any service..."
                className="pl-10 py-6 bg-white shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="w-full sm:w-auto">
              <LocationSelector 
                value={selectedLocation}
                onChange={onLocationChange}
              />
            </div>
            
            <Button size="lg" className="px-8">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-2 mt-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.8
                }
              }
            }}
          >
            {['AC Repair', 'Plumbing', 'Electrician', 'House Cleaning', 'Pest Control'].map((service, index) => (
              <motion.span
                key={index}
                variants={bubbleVariants}
                className="bg-white/80 backdrop-blur-sm text-sm px-3 py-1.5 rounded-full text-primary border border-primary/10 shadow-sm hover:bg-primary hover:text-white transition-colors cursor-pointer"
                onClick={() => setSearchQuery(service)}
              >
                {service}
              </motion.span>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-12"
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Verified Professionals</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">30-Day Service Guarantee</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">10,000+ Happy Customers</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHero;
