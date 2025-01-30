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
import { Link } from "react-router-dom";

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

const CategoryFilter = ({ onSelectCategory, maxItems = 6 }: { onSelectCategory?: (category: string, subcategory: string) => void, maxItems?: number }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const visibleCategories = categories.slice(0, maxItems);
  const hasMoreCategories = categories.length > maxItems;

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    onSelectCategory?.(categoryId, subcategoryId);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-4 sm:gap-6">
        {visibleCategories.map(({ id, name, icon, subcategories }) => {
          const Icon = iconMap[icon as keyof typeof iconMap];
          return (
            <Popover key={id}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-32 sm:h-36 flex-col gap-3 py-4 px-2 bg-[#E5F4FB] hover:bg-primary group w-full transition-colors"
                  onClick={() => setSelectedCategory(id)}
                >
                  <div className="bg-white/80 p-4 rounded-lg group-hover:bg-primary/20">
                    {Icon && <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary group-hover:text-white" />}
                  </div>
                  <span className="text-sm sm:text-base font-medium text-center line-clamp-2 group-hover:text-white">
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
                      className="w-full justify-start font-normal hover:bg-primary hover:text-white"
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
      
      {hasMoreCategories && (
        <div className="flex justify-center">
          <Link to="/categories">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg rounded-full"
            >
              Explore More
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;