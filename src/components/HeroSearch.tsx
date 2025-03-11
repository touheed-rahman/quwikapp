
import { useState } from "react";
import { Tag, ShoppingBag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ClassifiedTab from "./search/ClassifiedTab";
import ShopTab from "./search/ShopTab";
import { useSearch } from "@/hooks/useSearch";

const HeroSearch = () => {
  const [activeTab, setActiveTab] = useState("classified");
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    selectedLocation,
    handleLocationChange,
    handleSearch,
    handleKeyPress
  } = useSearch(activeTab);

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
              <ClassifiedTab 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedLocation={selectedLocation}
                handleLocationChange={handleLocationChange}
                handleSearch={handleSearch}
                handleKeyPress={handleKeyPress}
                isSearching={isSearching}
              />
            </TabsContent>
            
            <TabsContent value="shop" className="mt-0 space-y-4">
              <ShopTab 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedLocation={selectedLocation}
                handleLocationChange={handleLocationChange}
                handleSearch={handleSearch}
                handleKeyPress={handleKeyPress}
                isSearching={isSearching}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default HeroSearch;
