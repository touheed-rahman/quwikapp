import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";

const mockProducts = [
  {
    id: 1,
    title: "iPhone 13 Pro Max - Perfect Condition",
    price: 899,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
  {
    id: 2,
    title: "MacBook Pro 16' M1 Max",
    price: 2499,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    id: 3,
    title: "Sony WH-1000XM4 Headphones",
    price: 299,
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    id: 4,
    title: "iPad Pro 12.9' with Apple Pencil",
    price: 999,
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c",
  },
  {
    id: 5,
    title: "Modern Living Room Set",
    price: 1299,
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
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