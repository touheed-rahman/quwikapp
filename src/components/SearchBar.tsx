import { Search, ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SearchBar = () => {
  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block w-32">
          <Button variant="outline" className="w-full justify-between">
            <span>All Categories</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </div>
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Find Cars, Mobile Phones and more..."
            className="pl-10 pr-4 h-10 w-full bg-muted/50 border-none focus-visible:ring-1"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button type="submit" className="hidden sm:inline-flex">
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;