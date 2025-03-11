
import React from "react";
import LocationSelector from "@/components/LocationSelector";
import SearchBar from "./SearchBar";

interface ShopTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: string | null;
  handleLocationChange: (location: string | null) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
}

const ShopTab = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  handleLocationChange,
  handleSearch,
  handleKeyPress,
  isSearching
}: ShopTabProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-[#D946EF]">
        Shop Online
      </h2>
      <LocationSelector 
        value={selectedLocation} 
        onChange={handleLocationChange}
      />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
        isSearching={isSearching}
        buttonColor="[#D946EF]"
      />
    </div>
  );
};

export default ShopTab;
