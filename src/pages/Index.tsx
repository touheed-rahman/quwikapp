import { useState } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { categories, ProductCondition } from "@/types/categories";
import HeroSearch from "@/components/HeroSearch";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 20;

const mockProducts = [
  {
    id: 1,
    title: "2019 Toyota Camry XSE - Excellent Condition",
    price: 2250000,
    location: "Bengaluru, KA",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    date: "Today",
    featured: true,
    condition: "excellent" as ProductCondition,
    categoryId: "vehicles",
  },
  {
    id: 2,
    title: "iPhone 14 Pro Max - 256GB Space Gray",
    price: 99900,
    location: "Bengaluru, KA",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    date: "2 days ago",
    condition: "new" as ProductCondition,
    categoryId: "mobile",
  },
  {
    id: 3,
    title: "Modern 3-Bedroom Apartment for Rent",
    price: 2800,
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    date: "3 days ago",
    featured: true,
    condition: "good",
    categoryId: "property",
  },
  {
    id: 4,
    title: "MacBook Pro 16' M2 Max - Like New",
    price: 2499,
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    date: "1 week ago",
    condition: "excellent",
    categoryId: "electronics",
  },
  {
    id: 5,
    title: "Professional DSLR Camera Kit",
    price: 1299,
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    date: "2 weeks ago",
    condition: "good",
    categoryId: "electronics",
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
      <main className="container mx-auto px-4 pt-20">
        <div className="space-y-6">
          <HeroSearch />
          
          <div className="flex justify-center">
            <Link to="/sell">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Sell Now
              </Button>
            </Link>
          </div>

          <CategoryFilter />
          
          {/* Featured Products */}
          <section>
            <h2 className="text-xl font-bold mb-4">Featured Listings</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {displayedProducts
                .filter((product) => product.featured)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.title}
                    price={product.price}
                    location={product.location}
                    image={product.image}
                    date={product.date}
                    featured={product.featured}
                    condition={product.condition as ProductCondition}
                  />
                ))}
            </div>
          </section>

          {/* Recent Listings */}
          <section>
            <h2 className="text-xl font-bold mb-4">Fresh Recommendations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  location={product.location}
                  image={product.image}
                  date={product.date}
                  featured={product.featured}
                  condition={product.condition as ProductCondition}
                />
              ))}
            </div>
            
            {!showAllProducts && mockProducts.length > ITEMS_PER_PAGE && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => setShowAllProducts(true)}
                  variant="outline"
                  className="gap-2"
                >
                  Load More
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </section>

          {/* Category-wise Listings */}
          {categories.map((category) => (
            <section key={category.id}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{category.name}</h2>
                <Button variant="ghost" className="text-primary">
                  View All
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {displayedProducts
                  .filter((product) => product.categoryId === category.id)
                  .slice(0, 4)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      title={product.title}
                      price={product.price}
                      location={product.location}
                      image={product.image}
                      date={product.date}
                      featured={product.featured}
                      condition={product.condition as ProductCondition}
                    />
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