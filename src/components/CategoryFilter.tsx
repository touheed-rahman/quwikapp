import { useState } from "react";
import { Button } from "./ui/button";
import { categories } from "@/types/categories";
import { Car, Home, Smartphone, Briefcase, Bicycle, Monitor, Sofa, Shirt, Book, Paw, Settings } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const iconMap = {
  car: Car,
  home: Home,
  smartphone: Smartphone,
  briefcase: Briefcase,
  bicycle: Bicycle,
  monitor: Monitor,
  sofa: Sofa,
  shirt: Shirt,
  book: Book,
  paw: Paw,
  settings: Settings,
};

const CategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 py-4">
      {categories.map(({ id, name, icon }) => {
        const Icon = iconMap[icon as keyof typeof iconMap];
        return (
          <Popover key={id}>
            <PopoverTrigger asChild>
              <Button
                variant={selectedCategory === id ? "default" : "ghost"}
                className="h-auto flex-col gap-1 py-3 px-2 hover:bg-accent/50 w-full"
                onClick={() => setSelectedCategory(id)}
              >
                {Icon && <Icon className="h-6 w-6 text-primary" />}
                <span className="text-xs font-normal text-muted-foreground text-center">
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