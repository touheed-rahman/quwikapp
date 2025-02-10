
import { useState } from "react";
import { Button } from "./ui/button";
import { categories } from "@/types/categories";
import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const CategoryFilter = ({ maxItems = 6 }: { maxItems?: number }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const visibleCategories = categories.slice(0, maxItems);

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    navigate(`/category/${categoryId}/${subcategoryId}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visibleCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`h-auto py-3 flex-col gap-2 relative transition-all text-sm break-words ${
                selectedCategory === category.id 
                  ? "bg-primary text-white shadow-md" 
                  : "hover:border-primary hover:bg-primary/5"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="font-medium text-center px-2 line-clamp-2">
                {category.name}
              </span>
            </Button>
          ))}
        </div>

        {selectedCategory && (
          <div className="animate-fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categories
                .find((c) => c.id === selectedCategory)
                ?.subcategories.map((sub) => (
                  <Button
                    key={sub.id}
                    variant={selectedSubcategory === sub.id ? "default" : "outline"}
                    className={`h-auto py-2 justify-start px-4 text-sm break-words ${
                      selectedSubcategory === sub.id 
                        ? "bg-primary text-white shadow-md" 
                        : "hover:border-primary hover:bg-primary/5"
                    }`}
                    onClick={() => handleSubcategorySelect(selectedCategory, sub.id)}
                  >
                    <span className="line-clamp-1">{sub.name}</span>
                  </Button>
                ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <Link to="/categories" className="w-full md:w-auto">
          <Button 
            variant="outline"
            size="lg"
            className="w-full md:w-auto gap-2 px-8 border-primary text-primary hover:bg-primary hover:text-white"
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
