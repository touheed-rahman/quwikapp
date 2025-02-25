
import { useState } from "react";
import { categories } from "@/types/categories";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Laptop,
  Armchair,
  Building,
  Briefcase,
  Bike,
  GraduationCap,
  Dog,
  ShoppingBag,
  Gamepad2,
  Library,
  Wrench,
  ChevronDown,
  ChevronUp,
  Smartphone
} from "lucide-react";

const categoryIcons: Record<string, any> = {
  mobile: Smartphone,
  vehicles: Car,
  electronics: Laptop,
  furniture: Armchair,
  property: Building,
  jobs: Briefcase,
  bikes: Bike,
  education: GraduationCap,
  pets: Dog,
  fashion: ShoppingBag,
  gaming: Gamepad2,
  books: Library,
  services: Wrench,
};

const categoryColors: Record<string, string> = {
  mobile: "bg-[#8B5CF6]", // Changed to a vivid purple color
  vehicles: "bg-blue-500",
  electronics: "bg-purple-500",
  furniture: "bg-orange-500",
  property: "bg-green-500",
  jobs: "bg-indigo-500",
  bikes: "bg-red-500",
  education: "bg-yellow-500",
  pets: "bg-pink-500",
  fashion: "bg-teal-500",
  gaming: "bg-violet-500",
  books: "bg-cyan-500",
  services: "bg-emerald-500",
};

const CategoryFilter = () => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const rows = [];
  const itemsPerRow = 3;
  const initialRows = 2;
  
  for (let i = 0; i < categories.length; i += itemsPerRow) {
    rows.push(categories.slice(i, i + itemsPerRow));
  }

  const visibleRows = showAll ? rows : rows.slice(0, initialRows);

  return (
    <ScrollArea className="w-full rounded-lg border-2 border-gray-200 shadow-md">
      <div className="p-4 space-y-4">
        <div className="space-y-4 transition-all duration-300">
          {visibleRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-4">
              {row.map((category) => {
                const Icon = categoryIcons[category.id] || Car;
                const bgColor = categoryColors[category.id] || "bg-gray-500";
                
                return (
                  <button
                    key={category.id}
                    onClick={() => navigate(`/category/${category.id}`)}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg p-3 hover:bg-accent transition-all"
                  >
                    <div className={`p-3 rounded-full ${bgColor} text-white shadow-lg ring-4 ring-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-center">{category.name}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        {rows.length > initialRows && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors p-2"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryFilter;
