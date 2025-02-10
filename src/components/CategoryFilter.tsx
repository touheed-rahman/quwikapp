
import { useState } from "react";
import { Button } from "./ui/button";
import { categories } from "@/types/categories";
import { 
  Smartphone, Car, Tv, Building2, Sofa, Shirt, 
  Briefcase, Wrench, Book, Factory, PawPrint, 
  GraduationCap, Users, Heart, Wheat, ChevronRight
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link, useNavigate } from "react-router-dom";

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

const CategoryFilter = ({ maxItems = 6 }: { maxItems?: number }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const visibleCategories = categories.slice(0, maxItems);

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    navigate(`/category/${categoryId}/${subcategoryId}`);
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
                  className="h-20 sm:h-24 flex-col gap-2 py-3 px-2 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6] group w-full transition-colors rounded-lg border border-[#8B5CF6]/20"
                  onClick={() => setSelectedCategory(id)}
                >
                  <div className="bg-white/90 p-2 rounded-lg group-hover:bg-[#8B5CF6]/20">
                    {Icon && <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-[#8B5CF6] group-hover:text-white" />}
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-center leading-tight line-clamp-2 text-[#8B5CF6] group-hover:text-white">
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
                      className="w-full justify-start font-normal hover:bg-[#8B5CF6] hover:text-white"
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
      
      <div className="flex justify-center">
        <Link to="/categories" className="w-full md:w-auto">
          <Button 
            variant="outline"
            size="lg"
            className="w-full md:w-auto gap-2 px-8 border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6] hover:text-white"
          >
            Explore All Categories
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CategoryFilter;
