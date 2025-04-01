
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import LocationSelector from "@/components/LocationSelector";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

type ServiceHeroProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: string | null;
  onLocationChange: (location: string) => void;
};

const ServiceHero = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedLocation, 
  onLocationChange 
}: ServiceHeroProps) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-primary/20 shadow-lg"
      variants={item}
    >
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative inline-block mb-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-transparent bg-clip-text inline-block">
            Professional Services
          </h1>
          <motion.div 
            className="absolute -right-8 -top-6"
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </motion.div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up">
          Book verified professionals for all your home and office needs
        </p>
      </motion.div>

      <motion.div 
        className="flex flex-col md:flex-row gap-4 items-center bg-background/50 backdrop-blur-sm p-3 rounded-lg border border-primary/10 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="w-full md:w-1/2 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70">
            <MapPin className="h-5 w-5" />
          </div>
          <LocationSelector 
            value={selectedLocation || ""} 
            onChange={onLocationChange} 
            className="pl-10 shadow-inner border-primary/20 focus-within:border-primary/50 transition-all"
          />
        </div>
        <div className="w-full md:w-1/2 relative">
          <Input
            type="text"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-12 w-full border-primary/20 shadow-inner rounded-lg focus:ring-primary focus:border-primary/50 transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/70" />
        </div>
      </motion.div>
      
      <motion.div 
        className="mt-4 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span className="inline-flex items-center">
          <span className="bg-green-500/20 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium mr-2">New</span>
          Get ₹100 off on your first service booking!
        </span>
      </motion.div>
    </motion.div>
  );
};

export default ServiceHero;
