
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { categories } from "@/types/categories";
import { Link, useLocation } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: { id: string; name: string }[];
}

const CategoryFilter = () => {
  const location = useLocation();
  const currentCategory = location.pathname.split('/')[2];

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={cn(
              buttonVariants({ variant: currentCategory === category.id ? "default" : "ghost" }),
              "flex flex-col items-center gap-2 h-auto py-2"
            )}
          >
            <img
              src={category.icon}
              alt={category.name}
              className="h-6 w-6 object-contain"
            />
            <span className="text-sm font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="hidden" />
    </ScrollArea>
  );
};

export default CategoryFilter;
