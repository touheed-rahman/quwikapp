import { useState } from "react";
import { Button } from "./ui/button";
import { categories } from "@/types/categories";
import { 
  Smartphone, Car, Tv, Building2, Sofa, Shirt, 
  Briefcase, Wrench, Book, Factory, PawPrint, 
  GraduationCap, Users, Heart, Wheat 
} from "lucide-react";
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
  sofa: Sofa,
  tshirt: Shirt,
  briefcase: Briefcase,
  wrench: Wrench,
  book: Book,
  factory: Factory,
  pawprint: PawPrint,
  education: GraduationCap,
  community: Users,
  health: Heart,
  agriculture: Wheat,
};

const CategoryFilter = ({ onSelectCategory }: { onSelectCategory?: (category: string, subcategory: string) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    onSelectCategory?.(categoryId, subcategoryId);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4 py-4">
      {categories.map(({ id, name, icon, subcategories }) => {
        const Icon = iconMap[icon as keyof typeof iconMap];
        return (
          <Popover key={id}>
            <PopoverTrigger asChild>
              <Button
                variant={selectedCategory === id ? "default" : "ghost"}
                className="h-24 sm:h-28 flex-col gap-1 sm:gap-2 py-2 px-2 hover:bg-primary group w-full transition-none"
                onClick={() => setSelectedCategory(id)}
              >
                <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-none">
                  {Icon && <Icon className="h-6 w-6 sm:h-8 sm:w-8" />}
                </div>
                <span className="text-xs sm:text-sm font-medium text-center line-clamp-2 group-hover:text-white">
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
                    className="w-full justify-start font-normal hover:bg-primary hover:text-white transition-none"
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