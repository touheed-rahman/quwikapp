import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";

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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="space-y-8">
          <CategoryFilter />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;