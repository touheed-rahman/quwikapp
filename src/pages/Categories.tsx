
import Header from "@/components/Header";
import { categories } from "@/types/categories";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">All Categories</h1>
          
          <div className="grid gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-[#8B5CF6]">{category.name}</h2>
                  <ChevronRight className="h-5 w-5 text-[#8B5CF6]" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {category.subcategories.map((sub) => (
                    <Link 
                      key={sub.id} 
                      to={`/category/${category.id}/${sub.id}`}
                      className="text-sm text-muted-foreground hover:text-[#8B5CF6] transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
