import { useState } from "react";
import { Button } from "./ui/button";
import { categories } from "@/types/categories";
import * as Icons from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(({ id, name, icon }) => {
          const Icon = Icons[icon as keyof typeof Icons];
          return (
            <Popover key={id}>
              <PopoverTrigger asChild>
                <Button
                  variant={selectedCategory === id ? "default" : "secondary"}
                  className="whitespace-nowrap rounded-full px-4 py-2 flex items-center gap-2"
                  onClick={() => setSelectedCategory(id)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{name}</span>
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
    </div>
  );
};

export default CategoryFilter;