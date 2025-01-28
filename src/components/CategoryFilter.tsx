import { useState } from "react";
import { Button } from "./ui/button";
import { categories } from "@/types/categories";
import {
  Car,
  Building2,
  Smartphone,
  Briefcase,
  Monitor,
  Sofa,
  Shirt,
  Plane,
  Bike,
  Package
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const iconMap = {
  car: Car,
  home: Building2,
  smartphone: Smartphone,
  briefcase: Briefcase,
  monitor: Monitor,
  sofa: Sofa,
  shirt: Shirt,
  travel: Plane,
  bike: Bike,
  package: Package,
};

const CategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4 py-6">
      {categories.map(({ id, name, icon }) => {
        const Icon = iconMap[icon as keyof typeof iconMap];
        return (
          <Popover key={id}>
            <PopoverTrigger asChild>
              <Button
                variant={selectedCategory === id ? "default" : "ghost"}
                className="h-24 flex-col gap-2 py-4 px-2 hover:bg-accent/50 w-full group transition-all duration-300"
                onClick={() => setSelectedCategory(id)}
              >
                <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                  {Icon && <Icon className="h-8 w-8 text-primary" />}
                </div>
                <span className="text-sm font-medium text-foreground/80 text-center line-clamp-2">
                  {name}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="grid gap-2">
                {categories
                  .find((cat) => cat.id === id)
                  ?.subcategories.map((sub) => (
                    <Button
                      key={sub.id}
                      variant="ghost"
                      className="w-full justify-start"
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