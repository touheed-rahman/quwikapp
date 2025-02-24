
import { useParams, Link } from "react-router-dom";
import { categories } from "@/types/categories";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";

const CategorySubcategories = () => {
  const { categoryId } = useParams();
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">{category.name} Categories</h1>
          
          <div className="grid gap-4">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/category/${categoryId}/${subcategory.id}`}
                className="bg-white rounded-lg shadow-sm border p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
              >
                <span className="text-lg text-foreground/90">{subcategory.name}</span>
                <ChevronRight className="h-5 w-5 text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategorySubcategories;
