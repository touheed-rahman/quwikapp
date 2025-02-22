
import Header from "@/components/Header";
import { categories } from "@/types/categories";
import { Link } from "react-router-dom";

const CategoryGrid = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <h1 className="text-2xl font-bold mb-8">Browse Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="bg-white rounded-lg shadow-sm border p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-primary">{category.name}</h2>
              <div className="grid grid-cols-2 gap-2">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    to={`/category/${category.id}/${subcategory.id}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategoryGrid;
