import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import {
  Heart,
  Share2,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductCondition } from "@/types/categories";

const ProductPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock product data - in a real app, this would come from an API
  const product = {
    id,
    title: "2019 Toyota Camry XSE - Excellent Condition",
    price: 2250000,
    location: "Bengaluru, KA",
    images: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    ],
    description: "Excellent condition Toyota Camry XSE with all premium features...",
    condition: "excellent" as ProductCondition,
    postedDate: "2024-02-15",
    seller: {
      name: "John Doe",
      memberSince: "2023",
      listings: 5,
    },
    category: "vehicles",
  };

  // Mock related products
  const relatedProducts = [
    {
      id: 2,
      title: "2020 Honda Accord Sport",
      price: 2400000,
      location: "Bengaluru, KA",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
      condition: "excellent" as ProductCondition,
    },
    // ... Add more related products
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-black/5">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevImage}
                className="bg-white/80 hover:bg-white/90"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextImage}
                className="bg-white/80 hover:bg-white/90"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <p className="text-3xl font-bold text-primary mt-2">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Posted on {new Date(product.postedDate).toLocaleDateString()}</span>
              </div>
            </div>

            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {product.condition}
            </Badge>

            <Card className="p-4">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {product.seller.name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{product.seller.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since {product.seller.memberSince} • {product.seller.listings} listings
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1 h-12 bg-primary hover:bg-primary/90">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat with Seller
              </Button>
              <Button variant="outline" className="flex-1 h-12">
                Make Offer
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductPage;