
import React from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
  buttonColor: string;
}

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleKeyPress,
  isSearching,
  buttonColor
}: SearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="What are you looking for?"
          className={`pl-10 pr-4 h-12 text-sm md:text-base w-full border-${buttonColor}/20 focus-visible:ring-${buttonColor}/20`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-${buttonColor}`} />
      </div>
      <Button 
        size="lg" 
        className={`h-12 px-8 text-base bg-${buttonColor} hover:bg-${buttonColor}/90 disabled:opacity-50`}
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
  );
};

export default SearchBar;
