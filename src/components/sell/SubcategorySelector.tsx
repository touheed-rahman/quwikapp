
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubcategorySelectorProps {
  category: string | null;
  value: string | null;
  onChange: (subcategory: string) => void;
  disabled?: boolean;
}

// Define subcategories mapping
const subcategories: Record<string, string[]> = {
  vehicles: [
    "Cars", "Motorcycles", "Trucks", "Bicycles", "Auto Parts", "Boats", "Other Vehicles"
  ],
  mobiles: [
    "Smartphones", "Feature Phones", "Tablets", "Accessories", "Mobile Parts"
  ],
  property: [
    "Apartments", "Houses", "Land", "Commercial", "Rooms", "Vacation Rentals"
  ],
  fashion: [
    "Men's Clothing", "Women's Clothing", "Jewelry", "Watches", "Bags", "Shoes", "Accessories"
  ],
  furniture: [
    "Sofas", "Beds", "Tables", "Chairs", "Wardrobes", "Storage", "Office Furniture", "Garden Furniture"
  ],
  electronics: [
    "Laptops", "TVs", "Audio", "Cameras", "Computer Parts", "Gaming", "Home Appliances"
  ],
  other: [
    "Sports", "Books", "Musical Instruments", "Art", "Pets", "Toys", "Baby Products", "Services", "Other"
  ]
};

const SubcategorySelector = ({ category, value, onChange, disabled = false }: SubcategorySelectorProps) => {
  const options = category ? subcategories[category] || [] : [];

  useEffect(() => {
    // Reset value when category changes
    if (category && options.length > 0 && (!value || !options.includes(value))) {
      onChange(options[0]);
    }
  }, [category, options, value, onChange]);
  
  return (
    <div className="space-y-3">
      <Label htmlFor="subcategory" className="text-sm font-medium">
        Subcategory *
      </Label>
      <Select
        disabled={disabled || options.length === 0}
        value={value || ""}
        onValueChange={onChange}
      >
        <SelectTrigger id="subcategory" className="w-full px-4 py-6 focus:ring-primary focus:border-primary">
          <SelectValue placeholder="Select a subcategory" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubcategorySelector;
