
import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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
      className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-primary/20 shadow-lg"
      variants={item}
    >
      <motion.div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-transparent bg-clip-text inline-block mb-3">
          Professional Services at Your Doorstep
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Book reliable professionals for all your needs with just a few clicks
        </p>
      </motion.div>

      <motion.div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/2">
          <LocationSelector 
            value={selectedLocation || ""} 
            onChange={onLocationChange} 
          />
        </div>
        <div className="w-full md:w-1/2 relative">
          <Input
            type="text"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-12 w-full border-primary/20 rounded-lg focus:ring-primary focus:border-primary transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceHero;
