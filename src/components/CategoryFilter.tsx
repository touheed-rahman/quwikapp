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
import { cn } from "@/lib/utils";

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
  const isMobile = window.innerWidth < 768;

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    onSelectCategory?.(categoryId, subcategoryId);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3">
        {visibleCategories.map(({ id, name, icon, subcategories }) => {
          const Icon = iconMap[icon as keyof typeof iconMap];
          return (
            <Popover key={id}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-24 sm:h-28 flex-col gap-2 py-3 px-2 bg-[#E5F4FB] hover:bg-primary group w-full transition-colors"
                  onClick={() => setSelectedCategory(id)}
                >
                  <div className="bg-white/80 p-3 rounded-lg group-hover:bg-primary/20">
                    {Icon && <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:text-white" />}
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
      
      {(hasMoreCategories && isMobile) && (
        <div className="flex justify-center md:hidden">
          <Link to="/categories">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base rounded-full"
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