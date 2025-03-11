
import React from "react";
import LocationSelector from "@/components/LocationSelector";
import SearchBar from "./SearchBar";

interface ClassifiedTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: string | null;
  handleLocationChange: (location: string | null) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
}

const ClassifiedTab = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  handleLocationChange,
  handleSearch,
  handleKeyPress,
  isSearching
}: ClassifiedTabProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-[#8B5CF6]">
        Find What You Need
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
        buttonColor="[#8B5CF6]"
      />
    </div>
  );
};

export default ClassifiedTab;
