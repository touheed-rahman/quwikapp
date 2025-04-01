
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LocationSelector from "@/components/LocationSelector";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/hooks/use-session-user";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSession();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Please enter a search term",
        description: "Enter what service you're looking for",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedLocation) {
      toast({
        title: "Location required",
        description: "Please select your location to find nearby services",
        variant: "destructive",
      });
      return;
    }
    
    // Perform search with the parameters
    navigate(`/services/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(selectedLocation)}`);
  };

  return (
    <motion.div 
      className="bg-gradient-to-b from-primary/20 via-primary/10 to-transparent backdrop-blur-sm rounded-xl p-5 md:p-6 lg:p-8 border border-primary/20 shadow-lg"
      variants={item}
    >
      <motion.div 
        className="text-center mb-4 md:mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative inline-block mb-3">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 text-transparent bg-clip-text inline-block">
            Book Professional Services
          </h1>
          <motion.div 
            className="absolute -right-8 -top-6 hidden sm:block"
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </motion.div>
        </div>
        <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up">
          Book verified professionals for all your home and office needs
        </p>
      </motion.div>

      <div className="space-y-3 md:space-y-4">
        <motion.div 
          className="flex flex-col md:flex-row gap-3 items-stretch"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="w-full relative bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 shadow-sm overflow-hidden">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/70">
              <MapPin className="h-4 w-4 md:h-5 md:w-5" />
            </div>
            <LocationSelector 
              value={selectedLocation || ""} 
              onChange={onLocationChange}
              className="pl-10 pr-4 h-12 w-full border-0 focus-visible:ring-1 focus-visible:ring-primary/30 shadow-none bg-transparent"
            />
          </div>
          
          <div className="w-full relative">
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 w-full border-primary/20 shadow-inner rounded-lg focus:ring-primary focus:border-primary/50 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-primary/70" />
              
              <Button 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 rounded-md bg-primary text-white"
                onClick={handleSearch}
              >
                <span className="sr-only md:not-sr-only md:mr-1">Search</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
        
        {!session && (
          <motion.div
            className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="font-medium">Pro tip:</span>
            Log in to access your service history and manage service requests
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="mt-4 md:mt-5 text-center text-xs md:text-sm text-muted-foreground"
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
