
import { categories } from "@/types/categories";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import {
  Car,
  Smartphone,
  Sofa,
  Home,
  Briefcase,
  Bike,
  GraduationCap,
  PawPrint,
  Shirt,
  Gamepad,
  BookOpen,
  Wrench,
} from "lucide-react";

const categoryIcons: Record<string, any> = {
  vehicles: Car,
  electronics: Smartphone,
  furniture: Sofa,
  real_estate: Home,
  jobs: Briefcase,
  bikes: Bike,
  education: GraduationCap,
  pets: PawPrint,
  fashion: Shirt,
  gaming: Gamepad,
  books: BookOpen,
  services: Wrench,
};

const categoryColors: Record<string, string> = {
  vehicles: "bg-blue-500",
  electronics: "bg-purple-500",
  furniture: "bg-orange-500",
  real_estate: "bg-green-500",
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

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg border shadow-sm">
      <div className="flex w-max space-x-4 p-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id] || Car;
          const bgColor = categoryColors[category.id] || "bg-gray-500";
          
          return (
            <button
              key={category.id}
              onClick={() => navigate(`/categories`)}
              className="inline-flex flex-col items-center justify-center gap-2 rounded-lg p-3 hover:bg-accent transition-colors min-w-[100px]"
            >
              <div className={`p-3 rounded-full ${bgColor} text-white shadow-lg ring-4 ring-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryFilter;
