import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Tag, ShoppingBag } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import LocationSelector from "./LocationSelector";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const HeroSearch = () => {
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation } = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("classified");

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

  return (
    <div className="w-full mx-auto">
      <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8">
        <Tabs 
          defaultValue="classified" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="classified" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Classified</span>
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Shop</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/5 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6">
            <TabsContent value="classified" className="mt-0 space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-[#8B5CF6]">
                Find What You Need
              </h2>
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
                  className="h-12 px-8 text-base bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 disabled:opacity-50"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="shop" className="mt-0 space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-[#D946EF]">
                Shop Online
              </h2>
              <LocationSelector 
                value={selectedLocation} 
                onChange={handleLocationChange}
              />
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search for products..."
                    className="pl-10 pr-4 h-12 text-sm md:text-base w-full border-[#D946EF]/20 focus-visible:ring-[#D946EF]/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#D946EF]" />
                </div>
                <Button 
                  size="lg" 
                  className="h-12 px-8 text-base bg-[#D946EF] hover:bg-[#D946EF]/90 disabled:opacity-50"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default HeroSearch;
