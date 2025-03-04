
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubcategoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
}

const SubcategoryFilters = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  condition,
  setCondition,
  selectedLocation,
  setSelectedLocation,
}: SubcategoryFiltersProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-4 mb-6">
      <div className="md:col-span-2">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search in this category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <LocationSelector 
        value={selectedLocation} 
        onChange={setSelectedLocation}
      />

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>

      <Select value={condition} onValueChange={setCondition}>
        <SelectTrigger>
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Conditions</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="excellent">Excellent</SelectItem>
          <SelectItem value="good">Good</SelectItem>
          <SelectItem value="moderate">Moderate</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubcategoryFilters;
