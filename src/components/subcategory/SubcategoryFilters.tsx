
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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface SubcategoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  priceRange?: [number, number];
  setPriceRange?: (range: [number, number]) => void;
  minPrice?: number;
  maxPrice?: number;
  datePosted?: string;
  setDatePosted?: (value: string) => void;
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
  priceRange = [0, 1000000],
  setPriceRange = () => {},
  minPrice = 0,
  maxPrice = 1000000,
  datePosted = "all",
  setDatePosted = () => {},
}: SubcategoryFiltersProps) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  
  // Update local price range when the props change
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);
  
  // Apply price filter when slider stops changing
  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange([values[0], values[1]]);
  };
  
  // Apply price range filter only when user stops dragging
  const handlePriceChangeCommitted = () => {
    setPriceRange(localPriceRange);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="grid gap-4 md:grid-cols-4">
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
      </div>
      
      <Accordion type="single" collapsible className="bg-white p-3 rounded-md border">
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            Advanced Filters
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid md:grid-cols-3 gap-4 pt-2">
              <div>
                <Label htmlFor="condition-filter" className="text-sm mb-2 block">Condition</Label>
                <Select value={condition} onValueChange={setCondition} id="condition-filter">
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
              
              <div>
                <Label htmlFor="date-posted" className="text-sm mb-2 block">Date Posted</Label>
                <Select id="date-posted" value={datePosted} onValueChange={setDatePosted}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date Posted" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Price Range</Label>
                  <div className="text-sm">
                    ₹{localPriceRange[0].toLocaleString()} - ₹{localPriceRange[1].toLocaleString()}
                  </div>
                </div>
                <Slider
                  min={minPrice}
                  max={maxPrice}
                  step={1000}
                  value={[localPriceRange[0], localPriceRange[1]]}
                  onValueChange={handlePriceChange}
                  onValueCommit={handlePriceChangeCommitted}
                  className="my-4"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SubcategoryFilters;
