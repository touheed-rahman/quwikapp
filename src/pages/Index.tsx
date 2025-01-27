import { useState } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { categories } from "@/types/categories";

const ITEMS_PER_PAGE = 20;

const mockProducts = [
  {
    id: 1,
    title: "2019 Toyota Camry XSE - Excellent Condition",
    price: 22500,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    date: "Today",
    featured: true,
  },
  {
    id: 2,
    title: "iPhone 14 Pro Max - 256GB Space Gray",
    price: 999,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    date: "2 days ago",
  },
  {
    id: 3,
    title: "Modern 3-Bedroom Apartment for Rent",
    price: 2800,
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    date: "3 days ago",
    featured: true,
  },
  {
    id: 4,
    title: "MacBook Pro 16' M2 Max - Like New",
    price: 2499,
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    date: "1 week ago",
  },
  {
    id: 5,
    title: "Professional DSLR Camera Kit",
    price: 1299,
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    date: "2 weeks ago",
  },
];

const Index = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);

  const displayedProducts = showAllProducts
    ? mockProducts
    : mockProducts.slice(0, ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="space-y-8">
          <CategoryFilter />
          
          {/* Featured Products */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Featured Listings</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedProducts
                .filter((product) => product.featured)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </section>

          {/* Recent Listings */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Recent Listings</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
            
            {!showAllProducts && mockProducts.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setShowAllProducts(true)}
                  variant="outline"
                  className="gap-2"
                >
                  See All Listings
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </section>

          {/* Category-wise Listings */}
          {categories.map((category) => (
            <section key={category.id}>
              <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockProducts
                  .filter((product) => product.category === category.id)
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;