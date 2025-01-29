import { useState } from "react";
import { Button } from "./ui/button";
import { categories } from "@/types/categories";
import { Smartphone, Car, Tv, Building2, Shirt } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const iconMap = {
  smartphone: Smartphone,
  car: Car,
  tv: Tv,
  house: Building2,
  tshirt: Shirt,
};

const CategoryFilter = ({ onSelectCategory }: { onSelectCategory?: (category: string, subcategory: string) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    onSelectCategory?.(categoryId, subcategoryId);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-6">
      {categories.map(({ id, name, icon, subcategories }) => {
        const Icon = iconMap[icon as keyof typeof iconMap];
        return (
          <Popover key={id}>
            <PopoverTrigger asChild>
              <Button
                variant={selectedCategory === id ? "default" : "ghost"}
                className="h-32 flex-col gap-3 py-6 px-4 hover:bg-accent/50 w-full group transition-all duration-300"
                onClick={() => setSelectedCategory(id)}
              >
                <div className="bg-primary/10 p-6 rounded-xl group-hover:bg-primary/20 transition-colors">
                  {Icon && <Icon className="h-10 w-10 text-primary" />}
                </div>
                <span className="text-sm font-medium text-foreground/80 text-center line-clamp-2">
                  {name}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="grid gap-1">
                {subcategories.map((sub) => (
                  <Button
                    key={sub.id}
                    variant="ghost"
                    className="w-full justify-start font-normal"
                    onClick={() => handleSubcategorySelect(id, sub.id)}
                  >
                    {sub.name}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      })}
    </div>
  );
};

export default CategoryFilter;