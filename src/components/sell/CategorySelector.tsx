
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Smartphone, 
  Home, 
  ShoppingBag, 
  Sofa, 
  Laptop, 
  Package
} from "lucide-react";
import { motion } from "framer-motion";

interface CategorySelectorProps {
  value: string | null;
  onChange: (category: string) => void;
}

const categories = [
  { id: "vehicles", label: "Vehicles", icon: Car },
  { id: "mobiles", label: "Mobiles", icon: Smartphone },
  { id: "property", label: "Property", icon: Home },
  { id: "fashion", label: "Fashion", icon: ShoppingBag },
  { id: "furniture", label: "Furniture", icon: Sofa },
  { id: "electronics", label: "Electronics", icon: Laptop },
  { id: "other", label: "Other", icon: Package },
];

const CategorySelector = ({ value, onChange }: CategorySelectorProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="category" className="text-sm font-medium">
        Category *
      </Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = value === category.id;
          
          return (
            <motion.div key={category.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                variant={isSelected ? "default" : "outline"}
                className={`w-full h-full min-h-[80px] flex flex-col gap-2 items-center justify-center p-3 ${isSelected ? "bg-primary text-white" : "bg-background border-primary/20 hover:border-primary hover:bg-primary/5"}`}
                onClick={() => onChange(category.id)}
              >
                <IconComponent className={`h-8 w-8 sm:h-7 sm:w-7 ${isSelected ? "text-white" : "text-primary/80"}`} />
                <span className="text-xs font-medium">{category.label}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
