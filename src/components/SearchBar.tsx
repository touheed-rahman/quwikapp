import { Search } from "lucide-react";
import { Input } from "./ui/input";

const SearchBar = () => {
  return (
    <div className="relative max-w-md w-full">
      <Input
        type="text"
        placeholder="Search for anything..."
        className="pl-10 pr-4 h-10 w-full bg-muted/50 border-none focus-visible:ring-1"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </div>
  );
};

export default SearchBar;