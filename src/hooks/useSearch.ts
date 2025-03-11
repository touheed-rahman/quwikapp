
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSearch = (activeTab: string) => {
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter what you're looking for.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const trimmedQuery = searchQuery.trim();
      
      let { data: matches, error } = await supabase
        .from('listings')
        .select('id, title, category, subcategory, location')
        .eq('status', 'approved')
        .ilike('title', `%${trimmedQuery}%`);
      
      if (error) throw error;
      
      let filteredMatches = matches || [];
      
      if (activeTab === "shop") {
        filteredMatches = filteredMatches.filter(item => 
          item.category === 'electronics' || item.category === 'fashion'
        );
      } else {
        filteredMatches = filteredMatches.filter(item => 
          item.category !== 'electronics' && item.category !== 'fashion'
        );
      }
      
      if (selectedLocation) {
        filteredMatches = filteredMatches.filter(item => item.location === selectedLocation);
      }
      
      if (filteredMatches.length > 0) {
        navigate(`/category/${filteredMatches[0].category}/${filteredMatches[0].subcategory}?q=${encodeURIComponent(trimmedQuery)}&mode=${activeTab}`);
      } else {
        toast({
          title: "No results found",
          description: "We couldn't find any listings matching your search. Try different keywords or check your spelling.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "There was an error performing the search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    selectedLocation,
    handleLocationChange,
    handleSearch,
    handleKeyPress
  };
};
