
import { Search, ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SearchBar = () => {
  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block w-32">
          <Button variant="outline" className="w-full justify-between border-[#8B5CF6]/20 text-[#8B5CF6]">
            <span className="text-sm">Categories</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </div>
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 h-10 w-full bg-[#8B5CF6]/5 border-[#8B5CF6]/20 focus-visible:ring-[#8B5CF6]/20 text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B5CF6]" />
        </div>
        <Button type="submit" className="hidden sm:inline-flex h-10 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-sm">
          Search
        </Button>
      </div>
    </div>
  );
};

// Add both default and named exports for compatibility
export { SearchBar };
export default SearchBar;
