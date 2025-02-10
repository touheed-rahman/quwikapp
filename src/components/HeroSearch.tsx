
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import LocationSelector from "./LocationSelector";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "./ui/use-toast";

const HeroSearch = () => {
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLocationChange = async (location: string | null) => {
    try {
      await setSelectedLocation(location);
      
      toast({
        title: "Location updated",
        description: "Your preferred location has been saved.",
      });
    } catch (error) {
      console.error('Error saving location preference:', error);
      toast({
        title: "Error",
        description: "Failed to save location preference. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedLocation) params.set('location', selectedLocation);
    
    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8">
      <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/5 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-[#8B5CF6]">
          Find Anything You Need
        </h2>
        <div className="flex flex-col gap-3">
          <LocationSelector 
            value={selectedLocation} 
            onChange={handleLocationChange}
          />
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="What are you looking for?"
                className="pl-10 pr-4 h-12 text-sm md:text-base w-full border-[#8B5CF6]/20 focus-visible:ring-[#8B5CF6]/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B5CF6]" />
            </div>
            <Button 
              size="lg" 
              className="h-12 px-8 text-base bg-[#8B5CF6] hover:bg-[#8B5CF6]/90"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;
