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
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 py-4">
      {categories.map(({ id, name, icon }) => {
        const IconComponent = Icons[icon as keyof typeof Icons];
        return (
          <Popover key={id}>
            <PopoverTrigger asChild>
              <Button
                variant={selectedCategory === id ? "default" : "ghost"}
                className="h-auto flex-col gap-1 py-3 px-2 hover:bg-accent/50 w-full"
                onClick={() => setSelectedCategory(id)}
              >
                {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
                <span className="text-xs font-normal text-muted-foreground">
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