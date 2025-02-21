
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { categories } from "@/types/categories";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const Category = () => {
  const { categoryId } = useParams();
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-20 pb-24">
          <div className="text-center py-8">
            Category not found
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{category.name}</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/category/${category.id}/${subcategory.id}`}
                className="block"
              >
                <Card className="p-4 hover:bg-[#8B5CF6]/5 transition-colors border-[#8B5CF6]/20 hover:border-[#8B5CF6]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-[#8B5CF6]">
                      {subcategory.name}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Category;
