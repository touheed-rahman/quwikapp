import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ListingSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ListingSearchBar = ({ searchTerm, onSearchChange }: ListingSearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search listings..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};

export default ListingSearchBar;